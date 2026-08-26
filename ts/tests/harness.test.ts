/**
 * Invariants the harness itself depends on.
 *
 * These don't exercise generated code — they protect the property that lets every other test
 * file run concurrently against one shared account. If it regresses, the symptom elsewhere is
 * intermittent equivocation ("already locked by a different transaction") that only shows up
 * under load and points nowhere near the cause.
 */
import { SuiGrpcClient } from '@mysten/sui/grpc'
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519'
import { fromBase64 } from '@mysten/sui/utils'
import { it, expect, describe } from 'vitest'
import { LOCALNET_ENDPOINTS } from './test-utils'
import { TEST_SECRET_KEY } from './utils/constants'

const client = new SuiGrpcClient({ baseUrl: LOCALNET_ENDPOINTS.GRPC, network: 'localnet' })
const address = Ed25519Keypair.fromSecretKey(fromBase64(TEST_SECRET_KEY).slice(1)).toSuiAddress()

describe('gas comes from the address balance', () => {
  it('leaves the shared signer without SUI coins', async () => {
    // A gas coin is an owned object consumed at a specific version. With one in the account,
    // concurrent transactions build against the same version and equivocate, locking it until
    // the epoch ends. No coin means gas selection falls through to the accumulator.
    const coins = await client.core.listCoins({ owner: address, coinType: '0x2::sui::SUI' })
    expect(coins.objects).toHaveLength(0)
  })

  it('keeps a spendable balance for that signer', async () => {
    // The coins are gone but the value is not: it lives in the accumulator, which is what the
    // transactions actually draw on.
    const { balance } = await client.core.getBalance({ owner: address })
    expect(BigInt(balance.balance)).toBeGreaterThan(0n)
  })
})
