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

// Testnet endpoints
const TESTNET_RPC_URL = 'https://fullnode.testnet.sui.io:443/'
const TESTNET_GRPC_URL = 'https://fullnode.testnet.sui.io'
const TESTNET_GRAPHQL_URL = 'https://graphql.testnet.sui.io/graphql'

// Fixture object IDs
const AMM_POOL_ID = '0x799331284a2f75ed54b1a2bf212a26e3f465cbc7b974dbfa956f093de9ad8059'
const PACKAGE_ID = '0x0000000000000000000000000000000000000000000000000000000000000002'
const NON_EXISTING_ID = '0x' + '1'.repeat(64)

describe('Pool.fetch() multi-client integration', () => {
  const jsonRpcClient = new SuiClient({ url: TESTNET_RPC_URL })
  const grpcClient = new SuiGrpcClient({
    baseUrl: TESTNET_GRPC_URL,
    network: 'testnet',
  })
  const graphqlClient = new SuiGraphQLClient({
    url: TESTNET_GRAPHQL_URL,
    network: 'testnet',
  })

  describe('fetch valid Pool object', () => {
    it('JSON-RPC client', async () => {
      const pool = await Pool.fetch(jsonRpcClient, [SUI.p, EXAMPLE_COIN.p], AMM_POOL_ID)

      expect(pool).toBeDefined()
      expect(pool.id).toBe(AMM_POOL_ID)
      expect(pool.$typeName).toBe(Pool.$typeName)
    })

    it('gRPC client', async () => {
      // Cast needed: our SupportedSuiClient uses minimal duck-typed definitions
      const pool = await Pool.fetch(grpcClient, [SUI.p, EXAMPLE_COIN.p], AMM_POOL_ID)

      expect(pool).toBeDefined()
      expect(pool.id).toBe(AMM_POOL_ID)
      expect(pool.$typeName).toBe(Pool.$typeName)
    })

    it('GraphQL client', async () => {
      const pool = await Pool.fetch(graphqlClient, [SUI.p, EXAMPLE_COIN.p], AMM_POOL_ID)

      expect(pool).toBeDefined()
      expect(pool.id).toBe(AMM_POOL_ID)
      expect(pool.$typeName).toBe(Pool.$typeName)
    })

    it('data fetched from different clients should be the same', async () => {
      const pool1 = await Pool.fetch(jsonRpcClient, [SUI.p, EXAMPLE_COIN.p], AMM_POOL_ID)
      const pool2 = await Pool.fetch(grpcClient, [SUI.p, EXAMPLE_COIN.p], AMM_POOL_ID)
      const pool3 = await Pool.fetch(graphqlClient, [SUI.p, EXAMPLE_COIN.p], AMM_POOL_ID)

      expect(pool1).toEqual(pool2)
      expect(pool1).toEqual(pool3)
    })
  })

  describe('error: non-existing object', () => {
    it('JSON-RPC client', async () => {
      await expect(
        Pool.fetch(jsonRpcClient, [SUI.p, EXAMPLE_COIN.p], NON_EXISTING_ID)
      ).rejects.toThrow('error fetching object')
    })

    it('gRPC client', async () => {
      await expect(
        Pool.fetch(grpcClient, [SUI.p, EXAMPLE_COIN.p], NON_EXISTING_ID)
      ).rejects.toThrow()
    })

    it('GraphQL client', async () => {
      await expect(
        Pool.fetch(graphqlClient, [SUI.p, EXAMPLE_COIN.p], NON_EXISTING_ID)
      ).rejects.toThrow('error fetching object')
    })
  })

  describe('error: Move package (not a Move object)', () => {
    it('JSON-RPC client', async () => {
      await expect(Pool.fetch(jsonRpcClient, [SUI.p, EXAMPLE_COIN.p], PACKAGE_ID)).rejects.toThrow(
        'not a Move object'
      )
    })

    it('gRPC client', async () => {
      await expect(Pool.fetch(grpcClient, [SUI.p, EXAMPLE_COIN.p], PACKAGE_ID)).rejects.toThrow()
    })

    it('GraphQL client', async () => {
      await expect(Pool.fetch(graphqlClient, [SUI.p, EXAMPLE_COIN.p], PACKAGE_ID)).rejects.toThrow(
        'not a Move object'
      )
    })
  })
})
