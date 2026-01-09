import { bcs, BcsType } from '@mysten/sui/bcs'
import type { SuiClient } from '@mysten/sui/client'
import type { SuiGraphQLClient } from '@mysten/sui/graphql'
import type { SuiGrpcClient } from '@mysten/sui/grpc'
import {
  Transaction,
  TransactionArgument,
  TransactionObjectArgument,
  TransactionObjectInput,
} from '@mysten/sui/transactions'
import { fromBase64 } from '@mysten/sui/utils'

/**
 * Union type of all supported Sui SDK clients.
 * - SuiClient: JSON-RPC client (default)
 * - SuiGrpcClient: gRPC client
 * - SuiGraphQLClient: GraphQL client
 */
export type SupportedSuiClient = SuiClient | SuiGrpcClient | SuiGraphQLClient

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
  genericSeparators: [string, string] = ['<', '>'],
): string[] {
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

export function obj(tx: Transaction, arg: TransactionObjectInput): TransactionArgument {
  return isTransactionArgument(arg) ? arg : tx.object(arg)
}

export function pure(tx: Transaction, arg: PureArg, type: string): TransactionArgument {
  if (isTransactionArgument(arg)) {
    if (typeof arg === 'function') {
      throw new Error('Transaction plugins are not supported')
    }
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

export function option(tx: Transaction, type: string, arg: GenericArg | null): TransactionArgument {
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

export function generic(tx: Transaction, type: string, arg: GenericArg): TransactionArgument {
  if (typeArgIsPure(type)) {
    return pure(tx, arg as PureArg | TransactionArgument, type)
  } else {
    const { typeName, typeArgs } = parseTypeName(type)
    if (typeName === 'vector' && Array.isArray(arg)) {
      const itemType = typeArgs[0]

      return tx.makeMoveVec({
        type: itemType,
        elements: arg.map(item => obj(tx, item as TransactionObjectInput)) as Array<
          TransactionObjectArgument
        >,
      })
    } else {
      return obj(tx, arg as TransactionObjectInput)
    }
  }
}

export function vector(
  tx: Transaction,
  itemType: string,
  items: Array<GenericArg> | TransactionArgument,
): TransactionArgument {
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
      const elements = items.map(item => option(tx, itemTypeArgs[0], item)) as Array<
        TransactionObjectArgument
      >
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

// ============================================================================
// Multi-client fetch support (JSON-RPC, gRPC, GraphQL)
// ============================================================================

/**
 * Runtime detection for gRPC client.
 * gRPC clients have a `ledgerService` property.
 */
function isGrpcClient(client: unknown): client is SuiGrpcClient {
  return client != null && typeof client === 'object' && 'ledgerService' in client
}

/**
 * Runtime detection for GraphQL client.
 * GraphQL clients have a `query` method but no `ledgerService`.
 */
function isGraphQLClient(client: unknown): client is SuiGraphQLClient {
  return (
    client != null
    && typeof client === 'object'
    && 'query' in client
    && typeof (client as any).query === 'function'
    && !('ledgerService' in client)
  )
}

/**
 * Result of fetching object BCS data from any supported client.
 */
export interface FetchObjectBcsResult {
  /** Raw BCS bytes of the object */
  bcsBytes: Uint8Array
  /** Full type string (e.g., "0x2::coin::Coin<0x2::sui::SUI>") */
  type: string
}

const GRAPHQL_OBJECT_QUERY = `
  query GetObjectBcs($id: SuiAddress!) {
    object(address: $id) {
      asMoveObject {
        contents {
          bcs
          type { repr }
        }
      }
    }
  }
`

interface GraphQLObjectResponse {
  object: {
    asMoveObject: {
      contents: {
        bcs: string
        type: { repr: string }
      }
    } | null
  } | null
}

/**
 * Fetches object BCS data from any supported Sui client.
 * Handles JSON-RPC, gRPC, and GraphQL clients transparently.
 *
 * @param client - A Sui SDK client (SuiClient, SuiGrpcClient, or SuiGraphQLClient)
 * @param id - The object ID to fetch
 * @returns The BCS bytes and type string
 * @throws Error if object not found, is a package, or fetch fails
 */
export async function fetchObjectBcs(
  client: SupportedSuiClient,
  id: string,
): Promise<FetchObjectBcsResult> {
  if (isGrpcClient(client)) {
    return fetchObjectBcsWithGrpc(client, id)
  }
  if (isGraphQLClient(client)) {
    return fetchObjectBcsWithGraphQL(client, id)
  }
  return fetchObjectBcsWithJsonRpc(client as SuiClient, id)
}

async function fetchObjectBcsWithJsonRpc(
  client: SuiClient,
  id: string,
): Promise<FetchObjectBcsResult> {
  const res = await client.getObject({ id, options: { showBcs: true } })

  if (res.error) {
    throw new Error(`error fetching object at id ${id}: ${res.error.code}`)
  }

  if (res.data?.bcs?.dataType !== 'moveObject') {
    throw new Error(`object at id ${id} is not a Move object`)
  }

  const bcsData = res.data.bcs
  return {
    bcsBytes: fromBase64(bcsData.bcsBytes),
    type: bcsData.type,
  }
}

async function fetchObjectBcsWithGrpc(
  client: SuiGrpcClient,
  id: string,
): Promise<FetchObjectBcsResult> {
  try {
    const res = await client.ledgerService.getObject({
      objectId: id,
      readMask: { paths: ['contents'] },
    })

    const contents = res.response?.object?.contents
    if (!contents) {
      throw new Error(`error fetching object at id ${id}: object not found or not a Move object`)
    }
    if (!contents.value || !contents.name) {
      throw new Error(`error fetching object at id ${id}: no BCS data returned`)
    }

    return {
      bcsBytes: contents.value,
      type: contents.name,
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error(`error fetching object at id ${id}: ${String(error)}`)
  }
}

async function fetchObjectBcsWithGraphQL(
  client: SuiGraphQLClient,
  id: string,
): Promise<FetchObjectBcsResult> {
  const res = await client.query<GraphQLObjectResponse>({
    query: GRAPHQL_OBJECT_QUERY,
    variables: { id },
  })

  if (res.errors && res.errors.length > 0) {
    throw new Error(`error fetching object at id ${id}: ${JSON.stringify(res.errors)}`)
  }

  const obj = res.data?.object
  if (!obj) {
    throw new Error(`error fetching object at id ${id}: object not found`)
  }

  const asMoveObject = obj.asMoveObject
  if (!asMoveObject) {
    throw new Error(`object at id ${id} is not a Move object`)
  }

  const contents = asMoveObject.contents
  if (!contents) {
    throw new Error(`error fetching object at id ${id}: no contents returned`)
  }

  return {
    bcsBytes: fromBase64(contents.bcs),
    type: contents.type.repr,
  }
}
