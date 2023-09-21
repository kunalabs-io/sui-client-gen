import { normalizeSuiAddress } from '@mysten/sui.js/utils'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'
import { bcs, ObjectArg as SuiObjectArg } from '@mysten/sui.js/bcs'
import { BCS } from '@mysten/bcs'

/** A Move type, e.g., `address`, `bool`, `u64`, `vector<u64>`, `0x2::sui::SUI`... */
export type Type = string

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

export function parseTypeName(name: Type): { typeName: string; typeArgs: Type[] } {
  const parsed = bcs.parseTypeName(name)
  return { typeName: parsed.name, typeArgs: parsed.params as string[] }
}

export function isTransactionArgument(arg: GenericArg): arg is TransactionArgument {
  if (!arg || typeof arg !== 'object' || Array.isArray(arg)) {
    return false
  }

  return 'kind' in arg
}

export function obj(txb: TransactionBlock, arg: ObjectArg) {
  return isTransactionArgument(arg) ? arg : txb.object(arg)
}

export function pure(txb: TransactionBlock, arg: PureArg, type: Type) {
  if (isTransactionArgument(arg)) {
    return obj(txb, arg)
  }

  function convertType(type: Type): string {
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

  function convertArg(arg: PureArg, type: Type): PureArg {
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
      if (isTransactionArgument(arg[0])) {
        return txb.makeMoveVec({
          objects: arg as Array<TransactionArgument>,
          type: typeArgs[0],
        })
      }
  }

  return txb.pure(convertArg(arg, type), convertType(type))
}

export function option(txb: TransactionBlock, type: Type, arg: GenericArg | null) {
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

export function generic(txb: TransactionBlock, type: Type, arg: GenericArg) {
  if (typeArgIsPure(type)) {
    return pure(txb, arg as PureArg | TransactionArgument, type)
  } else {
    const { typeName, typeArgs } = parseTypeName(type)
    if (typeName === 'vector' && Array.isArray(arg)) {
      const itemType = typeArgs[0]

      return txb.makeMoveVec({
        objects: arg.map(item => obj(txb, item as ObjectArg)),
        type: itemType,
      })
    } else {
      return obj(txb, arg as ObjectArg)
    }
  }
}

export function vector(
  txb: TransactionBlock,
  itemType: Type,
  items: Array<GenericArg> | TransactionArgument
) {
  if (typeArgIsPure(itemType)) {
    return pure(txb, items as PureArg, `vector<${itemType}>`)
  } else if (isTransactionArgument(items)) {
    return items
  } else {
    const { typeName: itemTypeName, typeArgs: itemTypeArgs } = parseTypeName(itemType)
    if (itemTypeName === '0x1::option::Option') {
      const objects = items.map(item => option(txb, itemTypeArgs[0], item))
      return txb.makeMoveVec({
        objects,
        type: itemType,
      })
    }

    return txb.makeMoveVec({
      objects: items as Array<TransactionArgument>,
      type: itemType,
    })
  }
}

export function typeArgIsPure(type: Type): boolean {
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
