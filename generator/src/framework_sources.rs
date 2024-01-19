pub static ESLINTRC: &str = r#"{
    "rules": {
        "@typescript-eslint/ban-types": "off",
        "@typescript-eslint/no-explicit-any": "off"
    }
}
"#;

pub static LOADER: &str = r#"
import { compressSuiType, parseTypeName } from './util'
import { Primitive, ReifiedTypeArgument, StructClassReified, VectorReified, vector } from './reified'

export type PrimitiveValue = string | number | boolean | bigint

interface StructClass {
  $typeName: string
  $numTypeParams: number
  reified(...Ts: ReifiedTypeArgument[]): StructClassReified
}

export class StructClassLoader {
  private map: Map<string, StructClass> = new Map()

  register(...classes: StructClass[]) {
    for (const cls of classes) {
      this.map.set(cls.$typeName, cls)
    }
  }

  reified<T extends Primitive>(type: T): T
  reified(type: `vector<${string}>`): VectorReified
  reified(type: string): StructClassReified
  reified(type: string): ReifiedTypeArgument {
    const { typeName, typeArgs } = parseTypeName(compressSuiType(type))
    switch (typeName) {
      case 'bool':
      case 'u8':
      case 'u16':
      case 'u32':
      case 'u64':
      case 'u128':
      case 'u256':
      case 'address':
        return typeName
      case 'vector': {
        if (typeArgs.length !== 1) {
          throw new Error(`Vector expects 1 type argument, but got ${typeArgs.length}`)
        }
        return vector(this.reified(typeArgs[0]))
      }
    }

    if (!this.map.has(typeName)) {
      throw new Error(`Unknown type ${typeName}`)
    }

    const cls = this.map.get(typeName)!
    if (cls.$numTypeParams !== typeArgs.length) {
      throw new Error(
        `Type ${typeName} expects ${cls.$numTypeParams} type arguments, but got ${typeArgs.length}`
      )
    }

    return cls.reified(...typeArgs.map(t => this.reified(t)))
  }
}

export const structClassLoaderSource = new StructClassLoader()
export const structClassLoaderOnchain = new StructClassLoader()

"#;

pub static UTIL: &str = r#"
import { normalizeSuiAddress } from '@mysten/sui.js/utils'
import {
  TransactionArgument,
  TransactionBlock,
  TransactionObjectArgument,
} from '@mysten/sui.js/transactions'
import { bcs, ObjectArg as SuiObjectArg } from '@mysten/sui.js/bcs'
import { BCS } from '@mysten/bcs'

export interface FieldsWithTypes {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  fields: Record<string, any>
  type: string
}

export type ObjectId = string

export type ObjectCallArg = { Object: SuiObjectArg }

export type ObjectArg = string | ObjectCallArg | TransactionArgument

export type PureArg =
  | bigint
  | string
  | number
  | boolean
  | null
  | TransactionArgument
  | Array<PureArg>
export type GenericArg = ObjectArg | PureArg | Array<ObjectArg> | Array<PureArg> | Array<GenericArg>

export function parseTypeName(name: string): { typeName: string; typeArgs: string[] } {
  const parsed = bcs.parseTypeName(name)
  return { typeName: parsed.name, typeArgs: parsed.params as string[] }
}

export function isTransactionArgument(arg: GenericArg): arg is TransactionArgument {
  if (!arg || typeof arg !== 'object' || Array.isArray(arg)) {
    return false
  }

  return 'kind' in arg
}

export function isTransactionObjectArgument(arg: GenericArg): arg is TransactionObjectArgument {
  if (!isTransactionArgument(arg)) {
    return false
  }

  if (arg.kind === 'Input' && arg.type === 'pure') {
    return false
  }

  return true
}

export function obj(txb: TransactionBlock, arg: ObjectArg) {
  return isTransactionArgument(arg) ? arg : txb.object(arg)
}

export function pure(txb: TransactionBlock, arg: PureArg, type: string) {
  if (isTransactionArgument(arg)) {
    return obj(txb, arg)
  }

  function convertType(type: string): string {
    const { typeName, typeArgs } = parseTypeName(type)
    switch (typeName) {
      case '0x1::string::String':
      case '0x1::ascii::String':
        return BCS.STRING
      case '0x2::object::ID':
        return BCS.ADDRESS
      case '0x1::option::Option':
        return `vector<${convertType(typeArgs[0])}>`
      case 'vector':
        return `vector<${convertType(typeArgs[0])}>`
      default:
        return type
    }
  }

  function isOrHasNestedTransactionArgument(arg: PureArg): boolean {
    if (Array.isArray(arg)) {
      return arg.some(item => isOrHasNestedTransactionArgument(item))
    }
    return isTransactionArgument(arg)
  }

  function convertArg(arg: PureArg, type: string): PureArg {
    const { typeName, typeArgs } = parseTypeName(type)
    if (typeName === '0x1::option::Option') {
      if (arg === null) {
        return []
      } else {
        return [convertArg(arg, typeArgs[0])]
      }
    } else if (typeName === 'vector' && Array.isArray(arg)) {
      return arg.map(item => convertArg(item, typeArgs[0]))
    } else if (typeName === '0x2::object::ID' || typeName === 'address') {
      return normalizeSuiAddress(arg as string)
    } else {
      return arg
    }
  }

  // handle some cases when TransactionArgument is nested within a vector or option
  const { typeName, typeArgs } = parseTypeName(type)
  switch (typeName) {
    case '0x1::option::Option':
      if (arg === null) {
        return txb.pure([], `vector<${convertType(typeArgs[0])}>`)
      }
      if (isOrHasNestedTransactionArgument(arg)) {
        throw new Error('nesting TransactionArgument is not currently supported')
      }
      break
    case 'vector':
      if (!Array.isArray(arg)) {
        throw new Error('expected an array for vector type')
      }
      if (arg.length === 0) {
        return txb.pure([], `vector<${convertType(typeArgs[0])}>`)
      }
      if (arg.some(arg => Array.isArray(arg) && isOrHasNestedTransactionArgument(arg))) {
        throw new Error('nesting TransactionArgument is not currently supported')
      }
      if (
        isTransactionArgument(arg[0]) &&
        arg.filter(arg => !isTransactionArgument(arg)).length > 0
      ) {
        throw new Error('mixing TransactionArgument with other types is not currently supported')
      }
      if (isTransactionObjectArgument(arg[0])) {
        return txb.makeMoveVec({
          objects: arg as Array<TransactionObjectArgument>,
          type: typeArgs[0],
        })
      }
  }

  return txb.pure(convertArg(arg, type), convertType(type))
}

export function option(txb: TransactionBlock, type: string, arg: GenericArg | null) {
  if (arg === null) {
    return pure(txb, arg, `0x1::option::Option<${type}>`)
  }

  if (typeArgIsPure(type)) {
    return pure(txb, arg as PureArg | TransactionArgument, `0x1::option::Option<${type}>`)
  } else if (isTransactionArgument(arg)) {
    return arg
  } else {
    if (arg === null) {
      return pure(txb, arg, `vector<${type}>`)
    }

    // wrap it with some
    const val = generic(txb, type, arg)
    return txb.moveCall({
      target: `0x1::option::some`,
      typeArguments: [type],
      arguments: [val],
    })
  }
}

export function generic(txb: TransactionBlock, type: string, arg: GenericArg) {
  if (typeArgIsPure(type)) {
    return pure(txb, arg as PureArg | TransactionArgument, type)
  } else {
    const { typeName, typeArgs } = parseTypeName(type)
    if (typeName === 'vector' && Array.isArray(arg)) {
      const itemType = typeArgs[0]

      return txb.makeMoveVec({
        objects: arg.map(item => obj(txb, item as ObjectArg)) as Array<TransactionObjectArgument>,
        type: itemType,
      })
    } else {
      return obj(txb, arg as ObjectArg)
    }
  }
}

export function vector(
  txb: TransactionBlock,
  itemType: string,
  items: Array<GenericArg> | TransactionArgument
) {
  if (typeArgIsPure(itemType)) {
    return pure(txb, items as PureArg, `vector<${itemType}>`)
  } else if (isTransactionArgument(items)) {
    return items
  } else {
    const { typeName: itemTypeName, typeArgs: itemTypeArgs } = parseTypeName(itemType)
    if (itemTypeName === '0x1::option::Option') {
      const objects = items.map(item =>
        option(txb, itemTypeArgs[0], item)
      ) as Array<TransactionObjectArgument>
      return txb.makeMoveVec({
        objects,
        type: itemType,
      })
    }

    return txb.makeMoveVec({
      objects: items as Array<TransactionObjectArgument>,
      type: itemType,
    })
  }
}

export function typeArgIsPure(type: string): boolean {
  const { typeName, typeArgs } = parseTypeName(type)
  switch (typeName) {
    case 'bool':
    case 'u8':
    case 'u16':
    case 'u32':
    case 'u64':
    case 'u128':
    case 'u256':
    case 'address':
    case 'signer':
      return true
    case 'vector':
      return typeArgIsPure(typeArgs[0])
    case '0x1::string::String':
    case '0x1::ascii::String':
    case '0x2::object::ID':
      return true
    case '0x1::option::Option':
      return typeArgIsPure(typeArgs[0])
    default:
      return false
  }
}

export function compressSuiAddress(addr: string): string {
  // remove leading zeros
  const stripped = addr.split('0x').join('')
  for (let i = 0; i < stripped.length; i++) {
    if (stripped[i] !== '0') {
      return `0x${stripped.substring(i)}`
    }
  }
  return '0x0'
}

// Recursively removes leading zeros from a type.
// e.g. `0x00000002::module::Name<0x00001::a::C>` -> `0x2::module::Name<0x1::a::C>`
export function compressSuiType(type: string): string {
  const { typeName, typeArgs } = parseTypeName(type)
  switch (typeName) {
    case 'bool':
    case 'u8':
    case 'u16':
    case 'u32':
    case 'u64':
    case 'u128':
    case 'u256':
    case 'address':
    case 'signer':
      return typeName
    case 'vector':
      return `vector<${compressSuiType(typeArgs[0])}>`
    default: {
      const tok = typeName.split('::')
      tok[0] = compressSuiAddress(tok[0])
      const compressedName = tok.join('::')
      if (typeArgs.length > 0) {
        return `${compressedName}<${typeArgs.map(typeArg => compressSuiType(typeArg)).join(',')}>`
      } else {
        return compressedName
      }
    }
  }
}

export function composeSuiType(typeName: string, ...typeArgs: string[]): string {
  if (typeArgs.length > 0) {
    return `${typeName}<${typeArgs.join(', ')}>`
  } else {
    return typeName
  }
}

"#;

pub static REIFIED: &str = r#"
import { BcsType, bcs, fromHEX, toHEX } from '@mysten/bcs'
import { FieldsWithTypes, compressSuiType, parseTypeName } from './util'

export interface StructClassReified {
  typeName: string
  typeArgs: ReifiedTypeArgument[]
  bcs: BcsType<any>
  fromFields(fields: Record<string, any>): any
  fromFieldsWithTypes(item: FieldsWithTypes): any
  fromBcs: (data: Uint8Array) => any
  fromJSONField: (field: any) => any
  __class: any
}

export interface VectorReified {
  typeArg: ReifiedTypeArgument
  bcs: BcsType<any>
  fromFields(fields: any[]): any[]
  fromFieldsWithTypes(item: any[]): any[]
  fromBcs(data: Uint8Array): any[]
  fromJSONField: (field: any) => any
  __vectorItem: any
}

export type Primitive = 'bool' | 'u8' | 'u16' | 'u32' | 'u64' | 'u128' | 'u256' | 'address'

export interface StructClass {
  toJSONField(): Record<string, any>
  toJSON(): Record<string, any>
}

export type TypeArgument = StructClass | Primitive | Array<TypeArgument>

export type ReifiedTypeArgument = Primitive | VectorReified | StructClassReified

export type ToField<T extends TypeArgument> = T extends 'bool'
  ? boolean
  : T extends 'u8'
  ? number
  : T extends 'u16'
  ? number
  : T extends 'u32'
  ? number
  : T extends 'u64'
  ? bigint
  : T extends 'u128'
  ? bigint
  : T extends 'u256'
  ? bigint
  : T extends 'address'
  ? string
  : T extends { $typeName: '0x1::string::String' }
  ? string
  : T extends { $typeName: '0x1::ascii::String' }
  ? string
  : T extends { $typeName: '0x2::object::UID' }
  ? string
  : T extends { $typeName: '0x2::object::ID' }
  ? string
  : T extends { $typeName: '0x2::url::Url' }
  ? string
  : T extends { $typeName: '0x1::option::Option'; vec: Array<infer U> }
  ? U | null
  : T extends Array<infer U extends TypeArgument>
  ? ToField<U>[]
  : T

export type ToTypeArgument<T extends ReifiedTypeArgument> = T extends StructClassReified
  ? T['__class']
  : T extends VectorReified
  ? Array<T['__vectorItem']>
  : T

const Address = bcs.bytes(32).transform({
  input: (val: string) => fromHEX(val),
  output: val => toHEX(val),
})

export function toBcs<T extends ReifiedTypeArgument>(arg: T): BcsType<any> {
  switch (arg) {
    case 'bool':
      return bcs.bool()
    case 'u8':
      return bcs.u8()
    case 'u16':
      return bcs.u16()
    case 'u32':
      return bcs.u32()
    case 'u64':
      return bcs.u64()
    case 'u128':
      return bcs.u128()
    case 'u256':
      return bcs.u256()
    case 'address':
      return Address
    default:
      return arg.bcs
  }
}

export function extractType(generic: ReifiedTypeArgument): string {
  switch (generic) {
    case 'u8':
    case 'u16':
    case 'u32':
    case 'u64':
    case 'u128':
    case 'u256':
    case 'bool':
    case 'address':
      return generic
  }
  if ('__vectorItem' in generic) {
    return 'vector<' + extractType(generic.typeArg) + '>'
  } else {
    if (generic.typeArgs.length > 0) {
      return generic.typeName + '<' + generic.typeArgs.map(extractType).join(', ') + '>'
    } else {
      return generic.typeName
    }
  }
}

export function decodeFromFields(typeArg: ReifiedTypeArgument, field: any) {
  switch (typeArg) {
    case 'bool':
    case 'u8':
    case 'u16':
    case 'u32':
      return field
    case 'u64':
    case 'u128':
    case 'u256':
      return BigInt(field)
    case 'address':
      return field
  }
  if ('__vectorItem' in typeArg) {
    return typeArg.fromFields(field)
  }
  switch (typeArg.typeName) {
    case '0x1::string::String':
    case '0x1::ascii::String':
      return new TextDecoder().decode(Uint8Array.from(field.bytes)).toString()
    case '0x2::url::Url':
      return new TextDecoder().decode(Uint8Array.from(field.url.bytes)).toString()
    case '0x2::object::ID':
      return `0x${field.bytes}`
    case '0x2::object::UID':
      return `0x${field.id.bytes}`
    case '0x1::option::Option': {
      if (field.vec.length === 0) {
        return null
      }
      return decodeFromFields(typeArg.typeArgs[0], field.vec[0])
    }
    default:
      return typeArg.fromFields(field)
  }
}

export function decodeFromFieldsWithTypes(typeArg: ReifiedTypeArgument, item: any) {
  switch (typeArg) {
    case 'bool':
    case 'u8':
    case 'u16':
    case 'u32':
      return item
    case 'u64':
    case 'u128':
    case 'u256':
      return BigInt(item)
    case 'address':
      return item
  }
  if ('__vectorItem' in typeArg) {
    return typeArg.fromFieldsWithTypes(item)
  }
  switch (typeArg.typeName) {
    case '0x1::string::String':
    case '0x1::ascii::String':
    case '0x2::url::Url':
    case '0x2::object::ID':
      return item
    case '0x2::object::UID':
      return item.id
    case '0x2::balance::Balance':
      return typeArg.fromFields({ value: BigInt(item) })
    case '0x1::option::Option': {
      if (item === null) {
        return null
      }
      return decodeFromFieldsWithTypes(typeArg.typeArgs[0], item)
    }
    default:
      return typeArg.fromFieldsWithTypes(item)
  }
}

export function assertReifiedTypeArgsMatch(
  fullType: string,
  typeArgs: string[],
  reifiedTypeArgs: ReifiedTypeArgument[]
) {
  if (reifiedTypeArgs.length !== typeArgs.length) {
    throw new Error(
      `provided item has mismatching number of type argments ${fullType} (expected ${reifiedTypeArgs.length}, got ${typeArgs.length}))`
    )
  }
  for (let i = 0; i < typeArgs.length; i++) {
    if (compressSuiType(typeArgs[i]) !== compressSuiType(extractType(reifiedTypeArgs[i]))) {
      throw new Error(
        `provided item has mismatching type argments ${fullType} (expected ${extractType(
          reifiedTypeArgs[i]
        )}, got ${typeArgs[i]}))`
      )
    }
  }
}

export function assertFieldsWithTypesArgsMatch(
  item: FieldsWithTypes,
  reifiedTypeArgs: ReifiedTypeArgument[]
) {
  const { typeArgs: itemTypeArgs } = parseTypeName(item.type)
  assertReifiedTypeArgsMatch(item.type, itemTypeArgs, reifiedTypeArgs)
}

export type ToJSON<T extends TypeArgument> = T extends 'bool'
  ? boolean
  : T extends 'u8'
  ? number
  : T extends 'u16'
  ? number
  : T extends 'u32'
  ? number
  : T extends 'u64'
  ? string
  : T extends 'u128'
  ? string
  : T extends 'u256'
  ? string
  : T extends 'address'
  ? string
  : T extends { $typeName: '0x1::string::String' }
  ? string
  : T extends { $typeName: '0x1::ascii::String' }
  ? string
  : T extends { $typeName: '0x2::object::UID' }
  ? string
  : T extends { $typeName: '0x2::object::ID' }
  ? string
  : T extends { $typeName: '0x2::url::Url' }
  ? string
  : T extends {
      $typeName: '0x1::option::Option'
      __inner: infer U extends TypeArgument
    }
  ? ToJSON<U> | null
  : T extends Array<infer U extends TypeArgument>
  ? ToJSON<U>[]
  : T extends StructClass
  ? ReturnType<T['toJSONField']>
  : never

export function fieldToJSON<T extends TypeArgument>(type: string, field: ToField<T>): ToJSON<T> {
  const { typeName, typeArgs } = parseTypeName(type)
  switch (typeName) {
    case 'bool':
      return field as any
    case 'u8':
    case 'u16':
    case 'u32':
      return field as any
    case 'u64':
    case 'u128':
    case 'u256':
      return field.toString() as any
    case 'address':
    case 'signer':
      return field as any
    case 'vector':
      return (field as any[]).map((item: any) => fieldToJSON(typeArgs[0], item)) as any
    // handle special types
    case '0x1::string::String':
    case '0x1::ascii::String':
    case '0x2::url::Url':
    case '0x2::object::ID':
    case '0x2::object::UID':
      return field as any
    case '0x1::option::Option': {
      if (field === null) {
        return null as any
      }
      return fieldToJSON(typeArgs[0], field)
    }
    default:
      return (field as any).toJSONField()
  }
}

export function vector<T extends ReifiedTypeArgument>(typeArg: T) {
  return {
    typeArg,
    bcs: bcs.vector(toBcs(typeArg)),
    fromFields: (fields: any[]) => fields.map(field => decodeFromFields(typeArg, field)),
    fromFieldsWithTypes: (item: any[]) =>
      item.map(field => decodeFromFieldsWithTypes(typeArg, field)),
    fromBcs: (data: Uint8Array) => bcs.vector(toBcs(typeArg)).parse(data),
    fromJSONField: (json: any[]) => json.map(field => decodeFromJSONField(typeArg, field)),
    __vectorItem: null as unknown as ToField<ToTypeArgument<T>>,
  }
}

export function decodeFromJSONField(typeArg: ReifiedTypeArgument, field: any) {
  switch (typeArg) {
    case 'bool':
    case 'u8':
    case 'u16':
    case 'u32':
      return field
    case 'u64':
    case 'u128':
    case 'u256':
      return BigInt(field)
    case 'address':
      return field
  }
  if ('__vectorItem' in typeArg) {
    return typeArg.fromJSONField(field)
  }
  switch (typeArg.typeName) {
    case '0x1::string::String':
    case '0x1::ascii::String':
    case '0x2::url::Url':
    case '0x2::object::ID':
    case '0x2::object::UID':
      return field
    case '0x1::option::Option': {
      if (field === null) {
        return null
      }
      return decodeFromJSONField(typeArg.typeArgs[0], field)
    }
    default:
      return typeArg.fromJSONField(field)
  }
}

"#;
