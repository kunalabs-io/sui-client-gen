import { BcsType, splitGenericParameters } from '@mysten/bcs'
import { bcs } from '@mysten/sui/bcs'
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
  if (typeof arg === 'function') {
    throw new Error('Transaction plugins are not supported')
  }

  if (!arg || typeof arg !== 'object' || Array.isArray(arg)) {
    return false
  }

  return 'GasCoin' in arg || 'Input' in arg || 'Result' in arg || 'NestedResult' in arg
}

export function isTransactionObjectArgument(arg: GenericArg): arg is TransactionObjectArgument {
  if (typeof arg === 'function') {
    throw new Error('Transaction plugins are not supported')
  }

  if (!isTransactionArgument(arg)) {
    return false
  }

  if ('Input' in arg && arg.type === 'pure') {
    return false
  }

  return true
}

export function obj(tx: Transaction, arg: TransactionObjectInput) {
  if (typeof arg === 'function') {
    throw new Error('Transaction plugins are not supported')
  }

  return isTransactionArgument(arg) ? arg : tx.object(arg)
}

export function pure(tx: Transaction, arg: PureArg, type: string) {
  if (typeof arg === 'function') {
    throw new Error('Transaction plugins are not supported')
  }

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

  function isOrHasNestedTransactionArgument(arg: PureArg): boolean {
    if (typeof arg === 'function') {
      throw new Error('Transaction plugins are not supported')
    }

    if (Array.isArray(arg)) {
      return arg.some(item => isOrHasNestedTransactionArgument(item))
    }
    return isTransactionArgument(arg)
  }

  // handle some cases when TransactionArgument is nested within a vector or option
  const { typeName, typeArgs } = parseTypeName(type)
  switch (typeName) {
    case '0x1::option::Option':
      if (arg === null) {
        return tx.pure(bcs.option(bcs.Bool).serialize(null)) // bcs.Bool is arbitrary
      }
      if (isOrHasNestedTransactionArgument(arg)) {
        throw new Error('nesting TransactionArgument is not supported')
      }
      break
    case 'vector':
      if (!Array.isArray(arg)) {
        throw new Error('expected an array for vector type')
      }
      if (arg.length === 0) {
        return tx.pure(bcs.vector(bcs.Bool).serialize([])) // bcs.Bool is arbitrary
      }
      if (arg.some(arg => Array.isArray(arg) && isOrHasNestedTransactionArgument(arg))) {
        throw new Error('nesting TransactionArgument is not supported')
      }
      if (
        isTransactionArgument(arg[0]) &&
        arg.filter(arg => !isTransactionArgument(arg)).length > 0
      ) {
        throw new Error('mixing TransactionArgument with other types is not supported')
      }
      if (isTransactionObjectArgument(arg[0])) {
        return tx.makeMoveVec({
          type: typeArgs[0],
          elements: arg as Array<TransactionObjectArgument>,
        })
      }
  }

  return tx.pure(getBcsForType(type).serialize(arg))
}

export function option(tx: Transaction, type: string, arg: GenericArg | null) {
  if (typeof arg === 'function') {
    throw new Error('Transaction plugins are not supported')
  }

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
  if (typeof arg === 'function') {
    throw new Error('Transaction plugins are not supported')
  }

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
