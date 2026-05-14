/**
 * Shared test utilities for the sui-client-gen test suite.
 *
 * Contains helper functions to reduce code duplication across test files.
 */

import type { ClientWithCoreApi, SuiClientTypes } from '@mysten/sui/client'

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
  /** AMM Pool object */
  AMM_POOL: '0x799331284a2f75ed54b1a2bf212a26e3f465cbc7b974dbfa956f093de9ad8059',
  /** Enum test object (Wrapped containing Action variants) */
  WRAPPED_ENUM: '0x867aff39fede0ba58effd5d9fec74184503391321cf72ff5df5c631824b2c75a',
  /** Sui framework package ID */
  SUI_FRAMEWORK: '0x0000000000000000000000000000000000000000000000000000000000000002',
  /** Non-existing object ID for error tests */
  NON_EXISTING: '0x1111111111111111111111111111111111111111111111111111111111111111',
}

/** Testnet endpoints */
export const TESTNET_ENDPOINTS = {
  RPC: 'https://fullnode.testnet.sui.io:443/',
  GRPC: 'https://fullnode.testnet.sui.io',
} as const

// ============================================================================
// Object Fetching Helpers
// ============================================================================

/** Result from fetchMoveObject with properly typed fields */
export interface FetchedMoveObject {
  /** BCS-encoded bytes of the Move struct content */
  bcsBytes: Uint8Array
  /** Full core-API object response (with content included) */
  obj: SuiClientTypes.Object<{ content: true }>
}

/**
 * Fetch a Move object from chain using the v2 core API.
 *
 * Returns both the raw BCS bytes (for `fromBcs` paths) and the full Object
 * response (for `fromCoreObject` paths).
 *
 * @param client - Any client implementing the core API (e.g. SuiGrpcClient)
 * @param id - Object ID to fetch
 * @returns Fetched object data with bcsBytes and obj fields
 * @throws Error if the object cannot be retrieved
 *
 * @example
 * ```ts
 * const { bcsBytes, obj } = await fetchMoveObject(client, objectId)
 * const decoded = MyStruct.fromBcs(bcsBytes)
 * const alsoDecoded = MyStruct.fromCoreObject(obj)
 * ```
 */
export async function fetchMoveObject(
  client: ClientWithCoreApi,
  id: string
): Promise<FetchedMoveObject> {
  const { object } = await client.core.getObject({
    objectId: id,
    include: { content: true },
  })
  return {
    bcsBytes: object.content,
    obj: object,
  }
}

/**
 * Extract the UID field from a parsed Move object.
 *
 * After decoding via `fromBcs` / `fromCoreObject`, the resulting struct typically
 * has an `id` field of shape `{ id: string }`. This helper unwraps it.
 *
 * @param decoded - Decoded struct with an id field
 * @returns The UID string
 */
export function extractUid(decoded: { id: string }): string {
  return decoded.id
}
