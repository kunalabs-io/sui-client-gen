import { BcsType, bcs, fromHEX, toHEX } from '@mysten/bcs'
import { FieldsWithTypes, compressSuiType, parseTypeName } from './util'

export interface StructClassReified {
  typeName: string // e.g., '0x2::balance::Balance', without type arguments
  typeArgs: Array<ReifiedTypeArgument | PhantomReified>
  fullTypeName: any // e.g., '0x2::balance::Balance<0x2::sui:SUI>', leave as any to allow for string literals
  bcs: BcsType<any>
  fromFields(fields: Record<string, any>): any
  fromFieldsWithTypes(item: FieldsWithTypes): any
  fromBcs: (data: Uint8Array) => any
  fromJSONField: (field: any) => any
  __class: any // leave as any to allow for string literals, used for type inferrence
}

export interface VectorReified {
  typeArg: ReifiedTypeArgument
  bcs: BcsType<any>
  fullTypeName: any // e.g., 'vector<u8>', leave as any to allow for string literals
  fromFields(fields: any[]): any[]
  fromFieldsWithTypes(item: any[]): any[]
  fromBcs(data: Uint8Array): any[]
  fromJSONField: (field: any) => any
  __vectorItem: any // leave as any to allow type inference
}

export type Primitive = 'bool' | 'u8' | 'u16' | 'u32' | 'u64' | 'u128' | 'u256' | 'address'

export interface StructClass {
  toJSONField(): Record<string, any>
  toJSON(): Record<string, any>
  __reifiedFullTypeString: string // e.g., '0x2::balance::Balance<0x2::sui:SUI>'
}

export interface Vector<T extends TypeArgument> {
  __vectorTypeArg: T
}

export type TypeArgument = StructClass | Primitive | Vector<TypeArgument>

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
  : T extends { $typeName: '0x1::option::Option'; __inner: infer U extends TypeArgument }
  ? ToField<U> | null
  : T extends Vector<infer U>
  ? ToField<U>[]
  : T extends StructClass
  ? T
  : never

export type ToTypeArgument<T extends ReifiedTypeArgument | PhantomReified> =
  T extends StructClassReified
    ? T['__class']
    : T extends VectorReified
    ? Vector<T['__vectorItem']>
    : T

export type ToPhantomTypeArgument<T extends PhantomReified | ReifiedTypeArgument> =
  T extends PhantomReified
    ? T['phantomType']
    : T extends StructClassReified
    ? T['fullTypeName']
    : T extends VectorReified
    ? T['fullTypeName']
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

export function extractType(generic: ReifiedTypeArgument | PhantomReified): string {
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
    return generic.fullTypeName
  } else if ('__class' in generic) {
    return generic.fullTypeName
  } else if ('phantomType' in generic) {
    return generic.phantomType
  } else {
    throw new Error(`invalid reified type argument ${generic}`)
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
      return decodeFromFields(typeArg.typeArgs[0] as ReifiedTypeArgument, field.vec[0])
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
      return decodeFromFieldsWithTypes(typeArg.typeArgs[0] as ReifiedTypeArgument, item)
    }
    default:
      return typeArg.fromFieldsWithTypes(item)
  }
}

export function assertReifiedTypeArgsMatch(
  fullType: string,
  typeArgs: string[],
  reifiedTypeArgs: Array<ReifiedTypeArgument | PhantomReified>
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
  reifiedTypeArgs: Array<ReifiedTypeArgument | PhantomReified>
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
  : T extends Vector<infer U>
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
    fullTypeName: `vector<${extractType(typeArg)}>` as `vector<${ToPhantomTypeArgument<T>}>`,
    bcs: bcs.vector(toBcs(typeArg)),
    fromFields: (fields: any[]) => fields.map(field => decodeFromFields(typeArg, field)),
    fromFieldsWithTypes: (item: any[]) =>
      item.map(field => decodeFromFieldsWithTypes(typeArg, field)),
    fromBcs: (data: Uint8Array) => bcs.vector(toBcs(typeArg)).parse(data),
    fromJSONField: (json: any[]) => json.map(field => decodeFromJSONField(typeArg, field)),
    __vectorItem: null as unknown as ToTypeArgument<T>,
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
      return decodeFromJSONField(typeArg.typeArgs[0] as ReifiedTypeArgument, field)
    }
    default:
      return typeArg.fromJSONField(field)
  }
}

export interface PhantomReified {
  phantomType: any // leave as any to allow for string literals
}

export function phantom<P extends string>(phantomType: P): { phantomType: P } {
  return {
    phantomType,
  }
}

export type PhantomTypeArgument = string

export type ReifiedPhantomTypeArgument = ReifiedTypeArgument | PhantomReified

export type ToTypeStr<T extends TypeArgument, Depth extends number = 10> = Depth extends 0
  ? string
  : T extends Primitive
  ? T
  : T extends { __reifiedFullTypeString: infer U }
  ? U
  : T extends Vector<infer U>
  ? `vector<${ToTypeStr<U, Decrement<Depth>>}>`
  : never

// to prevent "Type instantiation is excessively deep and possibly infinite" errors
// for nested vectors
type Decrement<N extends number> = N extends 1
  ? 0
  : N extends 2
  ? 1
  : N extends 3
  ? 2
  : N extends 4
  ? 3
  : N extends 5
  ? 4
  : N extends 6
  ? 5
  : N extends 7
  ? 6
  : N extends 8
  ? 7
  : N extends 9
  ? 8
  : N extends 10
  ? 9
  : never
