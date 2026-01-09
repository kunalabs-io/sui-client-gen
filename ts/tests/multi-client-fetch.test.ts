/**
 * Integration tests for multi-client fetch support (JSON-RPC, gRPC, GraphQL).
 *
 * Tests the generated struct fetch function with all three Sui SDK clients:
 * - SuiClient (JSON-RPC)
 * - SuiGrpcClient (gRPC)
 * - SuiGraphQLClient (GraphQL)
 *
 * Run with: pnpm test multi-client-fetch
 */

import { describe, it, expect } from 'vitest'
import { SuiClient } from '@mysten/sui/client'
import { SuiGrpcClient } from '@mysten/sui/grpc'
import { SuiGraphQLClient } from '@mysten/sui/graphql'
import { Pool } from '../examples/gen/amm/pool/structs'
import { SUI } from '../examples/gen/sui/sui/structs'
import { EXAMPLE_COIN } from '../examples/gen/examples/example-coin/structs'
import { TEST_IDS, TESTNET_ENDPOINTS } from './test-utils'

// Initialize clients
const jsonRpcClient = new SuiClient({ url: TESTNET_ENDPOINTS.RPC })
const grpcClient = new SuiGrpcClient({
  baseUrl: TESTNET_ENDPOINTS.GRPC,
  network: 'testnet',
})
const graphqlClient = new SuiGraphQLClient({
  url: TESTNET_ENDPOINTS.GRAPHQL,
  network: 'testnet',
})

// Client configurations for parameterized tests
const clients = [
  { name: 'JSON-RPC', client: jsonRpcClient },
  { name: 'gRPC', client: grpcClient },
  { name: 'GraphQL', client: graphqlClient },
] as const

describe('Pool.fetch() multi-client integration', () => {
  describe.each(clients)('$name client', ({ client }) => {
    it('fetches valid Pool object', async () => {
      const pool = await Pool.fetch(client, [SUI.p, EXAMPLE_COIN.p], TEST_IDS.AMM_POOL)

      expect(pool).toBeDefined()
      expect(pool.id).toBe(TEST_IDS.AMM_POOL)
      expect(pool.$typeName).toBe(Pool.$typeName)
    })

    it('throws for non-existing object', async () => {
      await expect(
        Pool.fetch(client, [SUI.p, EXAMPLE_COIN.p], TEST_IDS.NON_EXISTING)
      ).rejects.toThrow()
    })

    it('throws for Move package (not a Move object)', async () => {
      await expect(
        Pool.fetch(client, [SUI.p, EXAMPLE_COIN.p], TEST_IDS.SUI_FRAMEWORK)
      ).rejects.toThrow()
    })
  })

  it('data fetched from different clients should be the same', async () => {
    const pool1 = await Pool.fetch(jsonRpcClient, [SUI.p, EXAMPLE_COIN.p], TEST_IDS.AMM_POOL)
    const pool2 = await Pool.fetch(grpcClient, [SUI.p, EXAMPLE_COIN.p], TEST_IDS.AMM_POOL)
    const pool3 = await Pool.fetch(graphqlClient, [SUI.p, EXAMPLE_COIN.p], TEST_IDS.AMM_POOL)

    expect(pool1).toEqual(pool2)
    expect(pool1).toEqual(pool3)
  })
})
