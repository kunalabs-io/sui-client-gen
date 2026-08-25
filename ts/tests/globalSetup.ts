import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { TestProject } from 'vitest/node'
import { SuiGrpcClient } from '@mysten/sui/grpc'
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519'
import { Transaction } from '@mysten/sui/transactions'
import { fromBase64 } from '@mysten/sui/utils'
import { FaucetRateLimitError, requestSuiFromFaucetV2 } from '@mysten/sui/faucet'

import { startLocalNetwork, type LocalNetwork } from './utils/network'
import { createSuiCliConfig, type SuiCliConfig } from './utils/sui-cli-config'
import { publishPackage, stageMoveTree } from './utils/publish'
import { LOCALNET_FAUCET_PORT, LOCALNET_RPC_PORT, TEST_SECRET_KEY } from './utils/constants'

const here = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(here, '../..')
const moveDir = path.join(repoRoot, 'move')

declare module 'vitest' {
  export interface ProvidedContext {
    rpcUrl: string
    faucetUrl: string
    /** Fresh package ID of `move/examples` on this run's localnet. */
    examplesPackageId: string
    /** Fresh package ID of `move/amm` on this run's localnet. */
    ammPackageId: string
    /** `Wrapped<Action<u64, SUI>, ...>` object created by `examples::enums::create_actions`. */
    wrappedEnumId: string
  }
}

let network: LocalNetwork | undefined
let cliConfig: SuiCliConfig | undefined

export default async function setup({ provide }: TestProject): Promise<() => Promise<void>> {
  network = await startLocalNetwork({
    rpcPort: LOCALNET_RPC_PORT,
    faucetPort: LOCALNET_FAUCET_PORT,
  })
  const client = new SuiGrpcClient({ network: 'localnet', baseUrl: network.rpcUrl })
  const keypair = Ed25519Keypair.fromSecretKey(fromBase64(TEST_SECRET_KEY).slice(1))
  const address = keypair.toSuiAddress()

  await fundFromFaucet(network.faucetUrl, address)
  await waitForBalance(client, address)

  cliConfig = await createSuiCliConfig({ rpcUrl: network.rpcUrl, keypair })

  const staged = await stageMoveTree(moveDir)
  let examples: { packageId: string }
  let amm: { packageId: string }
  try {
    examples = await publishPackage({
      packagePath: path.join(staged.dir, 'examples'),
      clientConfigPath: cliConfig.clientYamlPath,
    })
    amm = await publishPackage({
      packagePath: path.join(staged.dir, 'amm'),
      clientConfigPath: cliConfig.clientYamlPath,
    })
  } finally {
    await staged.dispose()
  }

  const wrappedEnumId = await createWrappedEnum(client, keypair, examples.packageId)

  provide('rpcUrl', network.rpcUrl)
  provide('faucetUrl', network.faucetUrl)
  provide('examplesPackageId', examples.packageId)
  provide('ammPackageId', amm.packageId)
  provide('wrappedEnumId', wrappedEnumId)

  return async () => {
    await cliConfig?.dispose()
    cliConfig = undefined
    await network?.stop()
    network = undefined
  }
}

/**
 * Create the shared `Wrapped` enum fixture object.
 *
 * Called as a raw move call rather than through the generated `createActions` binding: the
 * generated bindings resolve addresses through module-level active-env state, and global setup
 * runs in a different process from the test workers. Keeping setup free of that state means
 * there is only one place (the per-file setup) that activates an environment.
 */
async function createWrappedEnum(
  client: SuiGrpcClient,
  keypair: Ed25519Keypair,
  examplesPackageId: string
): Promise<string> {
  const tx = new Transaction()
  tx.moveCall({ target: `${examplesPackageId}::enums::create_actions` })

  const res = await client.signAndExecuteTransaction({
    transaction: tx,
    signer: keypair,
    include: { effects: true },
  })
  if (res.$kind !== 'Transaction') {
    throw new Error(`create_actions failed: ${res.FailedTransaction?.status.error?.message}`)
  }
  const created = res.Transaction.effects.changedObjects.find(
    c => c.idOperation === 'Created' && c.outputState === 'ObjectWrite'
  )
  if (!created) throw new Error('create_actions created no object')
  await client.core.waitForTransaction({ digest: res.Transaction.digest })
  return created.objectId
}

async function fundFromFaucet(faucetUrl: string, address: string) {
  const deadline = Date.now() + 60_000
  let lastErr: unknown
  while (Date.now() < deadline) {
    try {
      await requestSuiFromFaucetV2({ host: faucetUrl, recipient: address })
      return
    } catch (e) {
      if (e instanceof FaucetRateLimitError) throw e
      lastErr = e
      await new Promise(r => setTimeout(r, 500))
    }
  }
  throw new Error(`faucet did not respond within 60s (last error: ${lastErr})`)
}

async function waitForBalance(client: SuiGrpcClient, address: string) {
  const deadline = Date.now() + 30_000
  while (Date.now() < deadline) {
    const balance = await client.core.getBalance({ owner: address }).catch(() => null)
    if (balance && BigInt(balance.balance.balance) > 0n) return
    await new Promise(r => setTimeout(r, 250))
  }
  throw new Error(`address ${address} still has zero balance after the faucet request`)
}
