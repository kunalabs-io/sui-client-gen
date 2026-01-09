/**
 * Shared test utilities for the sui-client-gen test suite.
 *
 * Contains helper functions to reduce code duplication across test files.
 */

import { SuiClient, SuiParsedData } from '@mysten/sui/client'
import { fromBase64 } from '@mysten/sui/utils'

// ============================================================================
// Constants
// ============================================================================

/** Shared TextEncoder instance (avoids creating new instances in each test) */
export const TEXT_ENCODER: InstanceType<typeof TextEncoder> = new TextEncoder()

// ============================================================================
// Test Object IDs and Addresses
// ============================================================================

/** Common test object IDs used across tests */
export const TEST_IDS: {
  readonly AMM_POOL: string
  readonly WRAPPED_ENUM: string
  readonly SUI_FRAMEWORK: string
  readonly NON_EXISTING: string
} = {
  /** AMM Pool object for multi-client fetch tests */
  AMM_POOL: '0x799331284a2f75ed54b1a2bf212a26e3f465cbc7b974dbfa956f093de9ad8059',
  /** Enum test object (Wrapped containing Action variants) */
  WRAPPED_ENUM: '0x867aff39fede0ba58effd5d9fec74184503391321cf72ff5df5c631824b2c75a',
  /** Sui framework package ID */
  SUI_FRAMEWORK: '0x0000000000000000000000000000000000000000000000000000000000000002',
  /** Non-existing object ID for error tests */
  NON_EXISTING: '0x1111111111111111111111111111111111111111111111111111111111111111',
}

/** Testnet RPC endpoints */
export const TESTNET_ENDPOINTS = {
  RPC: 'https://fullnode.testnet.sui.io:443/',
  GRPC: 'https://fullnode.testnet.sui.io',
  GRAPHQL: 'https://graphql.testnet.sui.io/graphql',
} as const

// ============================================================================
// Object Fetching Helpers
// ============================================================================

/** BCS data for a Move object */
interface MoveObjectBcs {
  dataType: 'moveObject'
  bcsBytes: string
  type: string
  hasPublicTransfer: boolean
  version: string
}

/** Result from fetchMoveObject with properly typed fields */
export interface FetchedMoveObject {
  /** BCS-encoded bytes of the object */
  bcsBytes: Uint8Array
  /** Parsed content with move object data */
  content: SuiParsedData & { dataType: 'moveObject' }
  /** BCS data with move object metadata */
  bcs: MoveObjectBcs
}

/**
 * Fetch a Move object from chain with BCS and content data.
 *
 * This helper consolidates the common pattern of:
 * 1. Calling client.getObject with showBcs and showContent options
 * 2. Checking that the result is a moveObject
 * 3. Extracting and decoding the BCS bytes
 *
 * @param client - Sui client instance
 * @param id - Object ID to fetch
 * @returns Fetched object data with bcsBytes, content, and bcs fields
 * @throws Error if the object is not a Move object
 *
 * @example
 * ```ts
 * const { bcsBytes, content } = await fetchMoveObject(client, objectId)
 * const decoded = MyStruct.fromBcs(bcsBytes)
 * ```
 */
export async function fetchMoveObject(client: SuiClient, id: string): Promise<FetchedMoveObject> {
  const obj = await client.getObject({
    id,
    options: {
      showBcs: true,
      showContent: true,
    },
  })

  if (obj.data?.bcs?.dataType !== 'moveObject' || obj.data?.content?.dataType !== 'moveObject') {
    throw new Error(`not a moveObject`)
  }

  return {
    bcsBytes: fromBase64(obj.data.bcs.bcsBytes),
    content: obj.data.content,
    bcs: obj.data.bcs,
  }
}

/**
 * Extract the UID field from parsed Move object content.
 *
 * Many test objects have a nested uid field that needs to be extracted
 * for comparison with expected values.
 *
 * @param content - Parsed content from fetchMoveObject
 * @returns The UID string
 */
export function extractUid(content: SuiParsedData & { dataType: 'moveObject' }): string {
  return (content.fields as { uid: { id: string } }).uid.id
}
