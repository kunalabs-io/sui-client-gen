pub static ESLINTRC: &str = r#"{
    "rules": {
        "@typescript-eslint/ban-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-vars": "off"
    }
}
"#;

pub static LOADER: &str = r#"
import { compressSuiType, parseTypeName } from './util'
import {
  PhantomReified,
  PhantomTypeArgument,
  Primitive,
  Reified,
  StructClass,
  StructClassReified,
  TypeArgument,
  VectorClass,
  VectorClassReified,
  phantom,
  vector,
} from './reified'
import { registerClasses } from './init-loader'

export type PrimitiveValue = string | number | boolean | bigint

interface _StructClass {
  $typeName: string
  $numTypeParams: number
  $isPhantom: readonly boolean[]
  reified(
    ...Ts: Array<Reified<TypeArgument, any> | PhantomReified<PhantomTypeArgument>>
  ): StructClassReified<StructClass, any>
}

export class StructClassLoader {
  private map: Map<string, _StructClass> = new Map()

  register(...classes: _StructClass[]) {
    for (const cls of classes) {
      this.map.set(cls.$typeName, cls)
    }
  }

  reified<T extends Primitive>(type: T): T
  reified(type: `vector<${string}>`): VectorClassReified<VectorClass, any>
  reified(type: string): StructClassReified<StructClass, any>
  reified(
    type: string
  ): StructClassReified<StructClass, any> | VectorClassReified<VectorClass, any> | string {
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

    const reifiedTypeArgs: Array<Reified<TypeArgument, any> | PhantomReified<PhantomTypeArgument>> =
      []
    for (let i = 0; i < typeArgs.length; i++) {
      if (cls.$isPhantom[i]) {
        reifiedTypeArgs.push(phantom(typeArgs[i]))
      } else {
        reifiedTypeArgs.push(this.reified(typeArgs[i]))
      }
    }

    return cls.reified(...reifiedTypeArgs)
  }
}

export const loader = new StructClassLoader()
registerClasses(loader)

"#;

pub static UTIL: &str = r#"
import { bcs, BcsType } from '@mysten/sui/bcs'
import {
  Transaction,
  TransactionArgument,
  TransactionObjectArgument,
  TransactionObjectInput,
} from '@mysten/sui/transactions'

export interface FieldsWithTypes {
  fields: Record<string, any>
  type: string
}

export type ObjectId = string

export type PureArg =
  | bigint
  | string
  | number
  | boolean
  | null
  | TransactionArgument
  | Array<PureArg>
export type GenericArg =
  | TransactionObjectInput
  | PureArg
  | Array<TransactionObjectInput>
  | Array<PureArg>
  | Array<GenericArg>

export function splitGenericParameters(
  str: string,
  genericSeparators: [string, string] = ['<', '>']
) {
  const [left, right] = genericSeparators
  const tok: string[] = []
  let word = ''
  let nestedAngleBrackets = 0

  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    if (char === left) {
      nestedAngleBrackets++
    }
    if (char === right) {
      nestedAngleBrackets--
    }
    if (nestedAngleBrackets === 0 && char === ',') {
      tok.push(word.trim())
      word = ''
      continue
    }
    word += char
  }

  tok.push(word.trim())

  return tok
}

export function parseTypeName(name: string): { typeName: string; typeArgs: string[] } {
  if (typeof name !== 'string') {
    throw new Error(`Illegal type passed as a name of the type: ${name}`)
  }

  const [left, right] = ['<', '>']

  const l_bound = name.indexOf(left)
  const r_bound = Array.from(name).reverse().indexOf(right)

  // if there are no generics - exit gracefully.
  if (l_bound === -1 && r_bound === -1) {
    return { typeName: name, typeArgs: [] }
  }

  // if one of the bounds is not defined - throw an Error.
  if (l_bound === -1 || r_bound === -1) {
    throw new Error(`Unclosed generic in name '${name}'`)
  }

  const typeName = name.slice(0, l_bound)
  const typeArgs = splitGenericParameters(name.slice(l_bound + 1, name.length - r_bound - 1), [
    left,
    right,
  ])

  return { typeName, typeArgs }
}

export function isTransactionArgument(arg: GenericArg): arg is TransactionArgument {
  if (!arg || typeof arg !== 'object' || Array.isArray(arg)) {
    return false
  }

  return 'GasCoin' in arg || 'Input' in arg || 'Result' in arg || 'NestedResult' in arg
}

export function obj(tx: Transaction, arg: TransactionObjectInput) {
  return isTransactionArgument(arg) ? arg : tx.object(arg)
}

export function pure(tx: Transaction, arg: PureArg, type: string): TransactionArgument {
  if (isTransactionArgument(arg)) {
    return obj(tx, arg)
  }

  function getBcsForType(type: string): BcsType<any> {
    const { typeName, typeArgs } = parseTypeName(type)
    switch (typeName) {
      case 'bool':
        return bcs.Bool
      case 'u8':
        return bcs.U8
      case 'u16':
        return bcs.U16
      case 'u32':
        return bcs.U32
      case 'u64':
        return bcs.U64
      case 'u128':
        return bcs.U128
      case 'u256':
        return bcs.U256
      case 'address':
        return bcs.Address
      case '0x1::string::String':
      case '0x1::ascii::String':
        return bcs.String
      case '0x2::object::ID':
        return bcs.Address
      case '0x1::option::Option':
        return bcs.option(getBcsForType(typeArgs[0]))
      case 'vector':
        return bcs.vector(getBcsForType(typeArgs[0]))
      default:
        throw new Error(`invalid primitive type ${type}`)
    }
  }

  function hasUndefinedOrNull(items: PureArg[]) {
    for (const item of items) {
      if (typeof item === 'undefined' || item === null) {
        return true
      }

      if (Array.isArray(item)) {
        return hasUndefinedOrNull(item)
      }
    }

    return false
  }

  function consistsOnlyOfPrimitiveValues(items: PureArg[]) {
    for (const item of items) {
      if (!Array.isArray(item)) {
        if (item === null) {
          continue
        }
        switch (typeof item) {
          case 'string':
          case 'number':
          case 'bigint':
          case 'boolean':
            continue
          default:
            return false
        }
      }

      return consistsOnlyOfPrimitiveValues(item)
    }

    return true
  }

  function hasPrimitiveValues(items: PureArg[]) {
    for (const item of items) {
      if (!Array.isArray(item)) {
        switch (typeof item) {
          case 'string':
          case 'number':
          case 'bigint':
          case 'boolean':
            return true
          default:
            continue
        }
      }

      return hasPrimitiveValues(item)
    }

    return false
  }

  // handle some cases when TransactionArgument is nested within a vector or option
  const { typeName, typeArgs } = parseTypeName(type)
  switch (typeName) {
    case '0x1::option::Option':
      if (arg === null) {
        return tx.pure.option('bool', null) // 'bool' is arbitrary
      }
      if (consistsOnlyOfPrimitiveValues([arg])) {
        return tx.pure(getBcsForType(type).serialize(arg))
      }
      if (hasPrimitiveValues([arg])) {
        throw new Error('mixing primitive and TransactionArgument values is not supported')
      }

      // wrap it with some
      return tx.moveCall({
        target: `0x1::option::some`,
        typeArguments: [typeArgs[0]],
        arguments: [pure(tx, arg, typeArgs[0])],
      })
    case 'vector':
      if (!Array.isArray(arg)) {
        throw new Error('expected an array for vector type')
      }
      if (arg.length === 0) {
        return tx.pure(bcs.vector(bcs.Bool).serialize([])) // bcs.Bool is arbitrary
      }
      if (hasUndefinedOrNull(arg)) {
        throw new Error('the provided array contains undefined or null values')
      }
      if (consistsOnlyOfPrimitiveValues(arg)) {
        return tx.pure(getBcsForType(type).serialize(arg))
      }
      if (hasPrimitiveValues(arg)) {
        throw new Error('mixing primitive and TransactionArgument values is not supported')
      }

      return tx.makeMoveVec({
        type: typeArgs[0],
        elements: arg as Array<TransactionObjectArgument>,
      })
    default:
      return tx.pure(getBcsForType(type).serialize(arg))
  }
}

export function option(tx: Transaction, type: string, arg: GenericArg | null) {
  if (isTransactionArgument(arg)) {
    return arg
  }

  if (typeArgIsPure(type)) {
    return pure(tx, arg as PureArg | TransactionArgument, `0x1::option::Option<${type}>`)
  }

  if (arg === null) {
    return tx.moveCall({
      target: `0x1::option::none`,
      typeArguments: [type],
      arguments: [],
    })
  }

  // wrap it with some
  const val = generic(tx, type, arg)
  return tx.moveCall({
    target: `0x1::option::some`,
    typeArguments: [type],
    arguments: [val],
  })
}

export function generic(tx: Transaction, type: string, arg: GenericArg) {
  if (typeArgIsPure(type)) {
    return pure(tx, arg as PureArg | TransactionArgument, type)
  } else {
    const { typeName, typeArgs } = parseTypeName(type)
    if (typeName === 'vector' && Array.isArray(arg)) {
      const itemType = typeArgs[0]

      return tx.makeMoveVec({
        type: itemType,
        elements: arg.map(item =>
          obj(tx, item as TransactionObjectInput)
        ) as Array<TransactionObjectArgument>,
      })
    } else {
      return obj(tx, arg as TransactionObjectInput)
    }
  }
}

export function vector(
  tx: Transaction,
  itemType: string,
  items: Array<GenericArg> | TransactionArgument
) {
  if (typeof items === 'function') {
    throw new Error('Transaction plugins are not supported')
  }

  if (typeArgIsPure(itemType)) {
    return pure(tx, items as PureArg, `vector<${itemType}>`)
  } else if (isTransactionArgument(items)) {
    return items
  } else {
    const { typeName: itemTypeName, typeArgs: itemTypeArgs } = parseTypeName(itemType)
    if (itemTypeName === '0x1::option::Option') {
      const elements = items.map(item =>
        option(tx, itemTypeArgs[0], item)
      ) as Array<TransactionObjectArgument>
      return tx.makeMoveVec({
        type: itemType,
        elements,
      })
    }

    return tx.makeMoveVec({
      type: itemType,
      elements: items as Array<TransactionObjectArgument>,
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
import { bcs, BcsType } from '@mysten/sui/bcs'
import { fromHEX, toHEX } from '@mysten/sui/utils'
import { FieldsWithTypes, compressSuiType, parseTypeName } from './util'
import { SuiClient, SuiParsedData, SuiObjectData } from '@mysten/sui/client'
import { EnumOutputShapeWithKeys } from '@mysten/bcs';

// for backwards compatibility
export { vector } from './vector'

export interface StructClass {
  readonly $typeName: string
  readonly $fullTypeName: string
  readonly $typeArgs: string[]
  readonly $isPhantom: readonly boolean[]
  toJSONField(): Record<string, any>
  toJSON(): Record<string, any>

  __StructClass: true
}

export interface EnumClass {
  $typeName: string;
  $fullTypeName: string;
  $typeArgs: string[];
}

export interface VectorClass {
  readonly $typeName: 'vector'
  readonly $fullTypeName: string
  readonly $typeArgs: [string]
  readonly $isPhantom: readonly [false]
  toJSONField(): any[]
  toJSON(): Record<string, any>

  readonly elements: any

  __VectorClass: true
}

export type Primitive = 'bool' | 'u8' | 'u16' | 'u32' | 'u64' | 'u128' | 'u256' | 'address'
export type TypeArgument = StructClass | Primitive | VectorClass | EnumClass;

export interface StructClassReified<T extends StructClass, Fields> {
  typeName: T['$typeName'] // e.g., '0x2::balance::Balance', without type arguments
  fullTypeName: ToTypeStr<T> // e.g., '0x2::balance::Balance<0x2::sui:SUI>'
  typeArgs: T['$typeArgs'] // e.g., ['0x2::sui:SUI']
  isPhantom: T['$isPhantom'] // e.g., [true, false]
  reifiedTypeArgs: Array<Reified<TypeArgument, any> | PhantomReified<PhantomTypeArgument>>
  bcs: BcsType<any>
  fromFields(fields: Record<string, any>): T
  fromFieldsWithTypes(item: FieldsWithTypes): T
  fromBcs(data: Uint8Array): T
  fromJSONField: (field: any) => T
  fromJSON: (json: Record<string, any>) => T
  fromSuiParsedData: (content: SuiParsedData) => T
  fromSuiObjectData: (data: SuiObjectData) => T
  fetch: (client: SuiClient, id: string) => Promise<T>
  new: (fields: Fields) => T
  kind: 'StructClassReified'
}

export interface VectorClassReified<T extends VectorClass, Elements> {
  typeName: T['$typeName']
  fullTypeName: ToTypeStr<T>
  typeArgs: T['$typeArgs']
  isPhantom: readonly [false]
  reifiedTypeArgs: Array<Reified<TypeArgument, any>>
  bcs: BcsType<any>
  fromFields(fields: any[]): T
  fromFieldsWithTypes(item: FieldsWithTypes): T
  fromBcs(data: Uint8Array): T
  fromJSONField: (field: any) => T
  fromJSON: (json: Record<string, any>) => T
  new: (elements: Elements) => T
  kind: 'VectorClassReified'
}

export interface EnumClassReified<T extends EnumClass, Data> {
  typeName: T['$typeName']; // e.g., '0x2::balance::Balance', without type arguments
  fullTypeName: ToTypeStr<T>;
  typeArgs: T['$typeArgs']; // e.g., ['0x2::sui:SUI']
  reifiedTypeArgs: Array<
    Reified<TypeArgument, any> | PhantomReified<PhantomTypeArgument>
  >;
  fromBcs(data: Uint8Array): T;
  bcs: BcsType<any>;
  // fromJSONField: (field: any) => T;
  fromFields: (fields: EnumOutputShapeWithKeys<any, string>) => T;
  fromFieldsWithTypes: (fields: EnumOutputShapeWithKeys<any, string>) => T;
  new: (data: Data) => T;

  kind: 'EnumClassReified';
}

export type Reified<T extends TypeArgument, Fields> = T extends Primitive
  ? Primitive
  : T extends StructClass
  ? StructClassReified<T, Fields>
  : T extends VectorClass
  ? VectorClassReified<T, Fields>
  : T extends EnumClass
  ? EnumClassReified<T, Fields>
  : never;

export type ToTypeArgument<
  T extends
    | Primitive
    | StructClassReified<StructClass, any>
    | VectorClassReified<VectorClass, any>
    | EnumClassReified<EnumClass, any>,
> = T extends Primitive
  ? T
  : T extends StructClassReified<infer U, any>
  ? U
  : T extends VectorClassReified<infer U, any>
  ? U
  : T extends EnumClassReified<infer U, any>
  ? U
  : never;

export type ToPhantomTypeArgument<
  T extends PhantomReified<PhantomTypeArgument>,
> = T extends PhantomReified<infer U> ? U : never;

export type PhantomTypeArgument = string

export interface PhantomReified<P> {
  phantomType: P
  kind: 'PhantomReified'
}

export function phantom<T extends Reified<TypeArgument, any>>(
  reified: T
): PhantomReified<ToTypeStr<ToTypeArgument<T>>>;
export function phantom<P extends PhantomTypeArgument>(
  phantomType: P,
): PhantomReified<P>;
export function phantom(
  type: string | Reified<TypeArgument, any>,
): PhantomReified<string> {
  if (typeof type === 'string') {
    return {
      phantomType: type,
      kind: 'PhantomReified',
    }
  } else {
    return {
      phantomType: type.fullTypeName,
      kind: 'PhantomReified',
    }
  }
}

export type ToTypeStr<T extends TypeArgument> = T extends Primitive
  ? T
  : T extends StructClass
  ? T['$fullTypeName']
  : T extends VectorClass
  ? T['$fullTypeName']
  : T extends EnumClass
  ? T['$fullTypeName']
  : never;

export type PhantomToTypeStr<T extends PhantomTypeArgument> = T extends PhantomTypeArgument
  ? T
  : never

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
  : T extends VectorClass
  ? ReturnType<T['toJSONField']>
  : T extends StructClass
  ? ReturnType<T['toJSONField']>
  : never

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
  : T extends {
      $typeName: '0x1::option::Option'
      __inner: infer U extends TypeArgument
    }
  ? ToField<U> | null
  : T extends VectorClass
  ? T['elements']
  : T extends StructClass
  ? T
  : T extends EnumClass
  ? T

  : never;

const Address = bcs.bytes(32).transform({
  input: (val: string) => fromHEX(val),
  output: val => toHEX(val),
})

export function toBcs<T extends Reified<TypeArgument, any>>(arg: T): BcsType<any> {
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

export function extractType<T extends Reified<TypeArgument, any>>(
  reified: T
): ToTypeStr<ToTypeArgument<T>>
export function extractType<T extends PhantomReified<PhantomTypeArgument>>(
  reified: T
): PhantomToTypeStr<ToPhantomTypeArgument<T>>
export function extractType<
  T extends Reified<TypeArgument, any> | PhantomReified<PhantomTypeArgument>,
>(reified: T): string

export function extractType(
  reified: Reified<TypeArgument, any> | PhantomReified<string>,
): string {
  switch (reified) {
    case 'u8':
    case 'u16':
    case 'u32':
    case 'u64':
    case 'u128':
    case 'u256':
    case 'bool':
    case 'address':
      return reified
  }
  switch (reified.kind) {
    case 'PhantomReified':
      return reified.phantomType
    case 'StructClassReified':
      return reified.fullTypeName
    case 'VectorClassReified':
      return reified.fullTypeName
    case 'EnumClassReified':
      return reified.fullTypeName;
  }

  throw new Error('unreachable')
}

export function decodeFromFields(
  reified: Reified<TypeArgument, any>,
  field: any,
) {
  switch (reified) {
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
      return `0x${field}`
  }
  if (reified.kind === 'VectorClassReified') {
    return reified.fromFields(field).elements
  }
  switch (reified.typeName) {
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
      return ((reified as any).fromFields(field) as any).vec[0];
    }
    default:
      return reified.fromFields(field)
  }
}

export function decodeFromFieldsWithTypes(
  reified: Reified<TypeArgument, any>,
  item: any,
) {
  switch (reified) {
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
  if (reified.kind === 'VectorClassReified') {
    return reified.fromFieldsWithTypes(item).elements
  }
  switch (reified.typeName) {
    case '0x1::string::String':
    case '0x1::ascii::String':
    case '0x2::url::Url':
    case '0x2::object::ID':
      return item
    case '0x2::object::UID':
      return item.id
    case '0x2::balance::Balance':
      return (reified as StructClassReified<StructClass, any>).fromFields({
        value: BigInt(item),
      });
    case '0x1::option::Option': {
      if (item === null) {
        return null
      }
      return decodeFromFieldsWithTypes(
        (reified as any).reifiedTypeArgs[0],
        item,
      );
    }
    default:
      return reified.fromFieldsWithTypes(item)
  }
}

export function assertReifiedTypeArgsMatch(
  fullType: string,
  typeArgs: string[],
  reifiedTypeArgs: Array<Reified<TypeArgument, any> | PhantomReified<string>>,
) {
  if (reifiedTypeArgs.length !== typeArgs.length) {
    throw new Error(
      `provided item has mismatching number of type argments ${fullType} (expected ${reifiedTypeArgs.length}, got ${typeArgs.length}))`,
    );
  }
  for (let i = 0; i < typeArgs.length; i++) {
    if (
      compressSuiType(typeArgs[i]) !==
      compressSuiType(extractType(reifiedTypeArgs[i]))
    ) {
      throw new Error(
        `provided item has mismatching type argments ${fullType} (expected ${extractType(
          reifiedTypeArgs[i],
        )}, got ${typeArgs[i]}))`,
      );
    }
  }
}

export function assertFieldsWithTypesArgsMatch(
  item: FieldsWithTypes,
  reifiedTypeArgs: Array<Reified<TypeArgument, any> | PhantomReified<string>>,
) {
  const { typeArgs: itemTypeArgs } = parseTypeName(item.type);
  assertReifiedTypeArgsMatch(item.type, itemTypeArgs, reifiedTypeArgs);
}

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

export function decodeFromJSONField(typeArg: Reified<TypeArgument, any>, field: any) {
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
  if (typeArg.kind === 'VectorClassReified') {
    return typeArg.fromJSONField(field).elements
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
      return decodeFromJSONField(typeArg.reifiedTypeArgs[0] as any, field)
    }
    default:
      if ('fromJSONField' in typeArg) {
        return typeArg.fromJSONField(field);
      } else {
        throw new Error('Enum class cant be decoded from JSON field');
      }
  }
}
"#;

pub static VECTOR: &str = r#"
import { bcs } from '@mysten/sui/bcs'
import {
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  extractType,
  Reified,
  toBcs,
  ToField,
  ToTypeArgument,
  ToTypeStr,
  TypeArgument,
  VectorClass,
  VectorClassReified,
  fieldToJSON,
} from './reified'
import { composeSuiType, FieldsWithTypes } from './util'

export type VectorElements<T extends TypeArgument> = Array<ToField<T>>

export type VectorReified<T extends TypeArgument> = VectorClassReified<Vector<T>, VectorElements<T>>

export class Vector<T extends TypeArgument> implements VectorClass {
  __VectorClass = true as const

  static readonly $typeName = 'vector'
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [false] as const

  readonly $typeName = 'vector'
  readonly $fullTypeName: `vector<${ToTypeStr<T>}>`
  readonly $typeArgs: [ToTypeStr<T>]
  readonly $isPhantom = [false] as const

  readonly elements: Array<ToField<T>>

  constructor(typeArgs: [ToTypeStr<T>], elements: VectorElements<T>) {
    this.$fullTypeName = composeSuiType(this.$typeName, ...typeArgs) as `vector<${ToTypeStr<T>}>`
    this.$typeArgs = typeArgs

    this.elements = elements
  }

  static reified<T extends Reified<TypeArgument, any>>(T: T): VectorReified<ToTypeArgument<T>> {
    return {
      typeName: Vector.$typeName,
      fullTypeName: composeSuiType(
        Vector.$typeName,
        ...[extractType(T)]
      ) as `vector<${ToTypeStr<ToTypeArgument<T>>}>`,
      typeArgs: [extractType(T)] as [ToTypeStr<ToTypeArgument<T>>],
      isPhantom: Vector.$isPhantom,
      reifiedTypeArgs: [T],
      fromFields: (elements: any[]) => Vector.fromFields(T, elements),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Vector.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => Vector.fromBcs(T, data),
      bcs: Vector.bcs(toBcs(T)),
      fromJSONField: (field: any) => Vector.fromJSONField(T, field),
      fromJSON: (json: any) => Vector.fromJSON(T, json),
      new: (elements: VectorElements<ToTypeArgument<T>>) => {
        return new Vector([extractType(T)], elements)
      },
      kind: 'VectorClassReified',
    }
  }

  static get r() {
    return Vector.reified
  }

  static get bcs() {
    return bcs.vector
  }

  static fromFields<T extends Reified<TypeArgument, any>>(
    typeArg: T,
    elements: any[]
  ): Vector<ToTypeArgument<T>> {
    return Vector.reified(typeArg).new(elements.map(element => decodeFromFields(typeArg, element)))
  }

  static fromFieldsWithTypes<T extends Reified<TypeArgument, any>>(
    typeArg: T,
    item: FieldsWithTypes
  ): Vector<ToTypeArgument<T>> {
    return Vector.reified(typeArg).new(
      (item as unknown as any[]).map((field: any) => decodeFromFieldsWithTypes(typeArg, field))
    )
  }

  static fromBcs<T extends Reified<TypeArgument, any>>(
    typeArg: T,
    data: Uint8Array
  ): Vector<ToTypeArgument<T>> {
    return Vector.fromFields(typeArg, Vector.bcs(toBcs(typeArg)).parse(data))
  }

  toJSONField() {
    return this.elements.map(element => fieldToJSON(this.$typeArgs[0], element))
  }

  toJSON() {
    return {
      $typeName: this.$typeName,
      $typeArgs: this.$typeArgs,
      elements: this.toJSONField(),
    }
  }

  static fromJSONField<T extends Reified<TypeArgument, any>>(
    typeArg: T,
    field: any[]
  ): Vector<ToTypeArgument<T>> {
    return Vector.reified(typeArg).new(field.map(field => decodeFromJSONField(typeArg, field)))
  }

  static fromJSON<T extends Reified<TypeArgument, any>>(
    typeArg: T,
    json: any
  ): Vector<ToTypeArgument<T>> {
    if (json.$typeName !== Vector.$typeName) {
      throw new Error('not a vector json object')
    }

    return Vector.fromJSONField(typeArg, json.elements)
  }
}

export function vector<T extends Reified<TypeArgument, any>>(
  T: T
): VectorClassReified<Vector<ToTypeArgument<T>>, VectorElements<ToTypeArgument<T>>> {
  return Vector.r(T)
}

"#;
