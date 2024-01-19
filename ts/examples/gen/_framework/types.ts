import { BcsType, bcs, fromHEX, toHEX } from '@mysten/bcs'
import { FieldsWithTypes, compressSuiType, parseTypeName } from './util'

export interface StructClassReified {
  typeName: string
  typeArgs: ReifiedTypeArgument[]
  bcs: BcsType<any>
  fromFields(fields: Record<string, any>): any
  fromFieldsWithTypes(item: FieldsWithTypes): any
  fromBcs: (data: Uint8Array) => any
  __class: any
}

export interface VectorReified {
  typeArg: ReifiedTypeArgument
  bcs: BcsType<any>
  fromFields(fields: any[]): any[]
  fromFieldsWithTypes(item: any[]): any[]
  fromBcs(data: Uint8Array): any[]
  __vectorItem: any
}

export type Primitive = 'bool' | 'u8' | 'u16' | 'u32' | 'u64' | 'u128' | 'u256' | 'address'

export interface StructClass {
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

export function decodeFromFieldsGenericOrSpecial(typeArg: ReifiedTypeArgument, field: any) {
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
      return decodeFromFieldsGenericOrSpecial(typeArg.typeArgs[0], field.vec[0])
    }
    default:
      return typeArg.fromFields(field)
  }
}

export function decodeFromFieldsWithTypesGenericOrSpecial(typeArg: ReifiedTypeArgument, item: any) {
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
      return decodeFromFieldsWithTypesGenericOrSpecial(typeArg.typeArgs[0], item)
    }
    default:
      return typeArg.fromFieldsWithTypes(item)
  }
}

export const reified = {
  vector: <T extends ReifiedTypeArgument>(typeArg: T) => ({
    typeArg,
    bcs: bcs.vector(toBcs(typeArg)),
    fromFields: (fields: any[]) =>
      fields.map(field => decodeFromFieldsGenericOrSpecial(typeArg, field)),
    fromFieldsWithTypes: (item: any[]) =>
      item.map(field => decodeFromFieldsWithTypesGenericOrSpecial(typeArg, field)),
    fromBcs: (data: Uint8Array) => bcs.vector(toBcs(typeArg)).parse(data),
    __vectorItem: null as unknown as ToField<ToTypeArgument<T>>,
  }),
}

export function assertFieldsWithTypesArgsMatch(
  item: FieldsWithTypes,
  typeArgs: ReifiedTypeArgument[]
) {
  const { typeArgs: itemTypeArgs } = parseTypeName(item.type)
  const reifiedTypeArgs = typeArgs.map(extractType)

  if (itemTypeArgs.length !== reifiedTypeArgs.length) {
    throw new Error(
      `provided item has mismatching number of type argments ${item.type} (expected ${reifiedTypeArgs.length}, got ${itemTypeArgs.length}))`
    )
  }
  for (let i = 0; i < itemTypeArgs.length; i++) {
    if (compressSuiType(itemTypeArgs[i]) !== compressSuiType(reifiedTypeArgs[i])) {
      throw new Error(
        `provided item has mismatching type argments ${item.type} (expected ${reifiedTypeArgs[i]}, got ${itemTypeArgs[i]}))`
      )
    }
  }
}
