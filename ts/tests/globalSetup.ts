import fs from 'node:fs/promises'
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
import { createPubfile, publishPackage, stageMoveTree, upgradePackage } from './utils/publish'
import { useAddressBalanceForGas } from './utils/gas'
import { LOCALNET_FAUCET_PORT, LOCALNET_RPC_PORT, TEST_SECRET_KEY } from './utils/constants'

const here = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(here, '../..')
const moveDir = path.join(repoRoot, 'move')

/** The module whose pre-upgrade copy drives the staged publish-then-upgrade. */
const OTHER_MODULE_REL = 'sources/other_module.move'
const OTHER_MODULE_V1 = path.join(here, 'fixtures/examples-v1/other_module.move')
/** The struct that only exists from v2 onwards. */
const UPGRADE_ADDED_STRUCT = 'AddedInAnUpgrade'
/** Matched as a declaration so a passing mention in a comment doesn't count as defining it. */
const UPGRADE_ADDED_STRUCT_DECL = `public struct ${UPGRADE_ADDED_STRUCT}`

declare module 'vitest' {
  export interface ProvidedContext {
    rpcUrl: string
    faucetUrl: string
    /** Address of examples v1 — where every type except `AddedInAnUpgrade` originates. */
    examplesOriginalId: string
    /** Address of examples v2 — where move calls into the package are dispatched. */
    examplesPublishedAt: string
    /** Address of the version that introduced `other_module::AddedInAnUpgrade` (v2). */
    examplesUpgradeAddedOriginId: string
    /** Fresh package ID of `move/amm` on this run's localnet. */
    ammPackageId: string
    /** `Wrapped<Action<u64, SUI>, ...>` object created by `examples::enums::create_actions`. */
    wrappedEnumId: string
  }
}

let network: LocalNetwork | undefined
let cliConfig: SuiCliConfig | undefined

export default async function setup(project: TestProject): Promise<() => Promise<void>> {
  network = await startLocalNetwork({
    rpcPort: LOCALNET_RPC_PORT,
    faucetPort: LOCALNET_FAUCET_PORT,
  })
  try {
    return await provisionChain(project)
  } catch (e) {
    // Vitest never calls the teardown when setup throws, so anything started above has to be
    // cleaned up here. A leaked validator holds port 9000 and the *next* run then talks to a
    // chain that has none of this run's packages on it — failures that look like decoding bugs
    // and have nothing to do with the code under test.
    await teardown()
    throw e
  }
}

async function provisionChain({ provide }: TestProject): Promise<() => Promise<void>> {
  if (!network) throw new Error('provisionChain called before the network was started')
  const client = new SuiGrpcClient({ network: 'localnet', baseUrl: network.rpcUrl })
  const keypair = Ed25519Keypair.fromSecretKey(fromBase64(TEST_SECRET_KEY).slice(1))
  const address = keypair.toSuiAddress()

  await fundFromFaucet(network.faucetUrl, address)
  await waitForBalance(client, address)

  cliConfig = await createSuiCliConfig({ rpcUrl: network.rpcUrl, keypair })

  const staged = await stageMoveTree(moveDir)
  const pubfile = await createPubfile()
  let examples: { originalId: string; publishedAt: string }
  let amm: { packageId: string }
  try {
    examples = await publishExamplesWithUpgrade(
      path.join(staged.dir, 'examples'),
      cliConfig.clientYamlPath,
      pubfile.path
    )
    const ammPubfile = await createPubfile()
    try {
      amm = await publishPackage({
        packagePath: path.join(staged.dir, 'amm'),
        clientConfigPath: cliConfig.clientYamlPath,
        pubfilePath: ammPubfile.path,
      })
    } finally {
      await ammPubfile.dispose()
    }
  } finally {
    await pubfile.dispose()
    await staged.dispose()
  }

  const wrappedEnumId = await createWrappedEnum(client, keypair, examples.publishedAt)

  // Last step that touches the chain during setup: everything above — the `sui` CLI publishes
  // especially — pays gas from a coin, and this leaves the account with none. From here on
  // transactions draw gas from the address balance, which is what makes it safe for the test
  // files to run concurrently against this single shared account.
  await useAddressBalanceForGas(client, keypair)

  provide('rpcUrl', network.rpcUrl)
  provide('faucetUrl', network.faucetUrl)
  provide('examplesOriginalId', examples.originalId)
  provide('examplesPublishedAt', examples.publishedAt)
  // `AddedInAnUpgrade` is introduced by the upgrade, so it originates at v2's address.
  provide('examplesUpgradeAddedOriginId', examples.publishedAt)
  provide('ammPackageId', amm.packageId)
  provide('wrappedEnumId', wrappedEnumId)

  return teardown
}

async function teardown(): Promise<void> {
  await cliConfig?.dispose()
  cliConfig = undefined
  await network?.stop()
  network = undefined
}

/**
 * Publish the examples package as v1 without `AddedInAnUpgrade`, then restore the struct and
 * upgrade to v2.
 *
 * This reproduces on a throwaway chain the shape the package really has on testnet, where that
 * struct was added in an upgrade and therefore originates at a later address than the rest of
 * the package. Without it a from-scratch publish collapses `originalId`, `publishedAt`, and
 * every type origin into one address — and the distinction between them is precisely what the
 * generated code has to get right, since `$typeName` is built from a type's defining address
 * while move calls target `publishedAt`.
 *
 * Returns v1's address (`originalId`) and v2's (`publishedAt`).
 */
async function publishExamplesWithUpgrade(
  packagePath: string,
  clientConfigPath: string,
  pubfilePath: string
): Promise<{ originalId: string; publishedAt: string }> {
  const modulePath = path.join(packagePath, OTHER_MODULE_REL)
  const [current, v1] = await Promise.all([
    fs.readFile(modulePath, 'utf8'),
    fs.readFile(OTHER_MODULE_V1, 'utf8'),
  ])

  // Guard both directions, so drift fails here rather than silently collapsing the two
  // versions into one and quietly deleting this test's whole reason for existing.
  if (!current.includes(UPGRADE_ADDED_STRUCT_DECL)) {
    throw new Error(
      `move/examples/${OTHER_MODULE_REL} no longer defines ${UPGRADE_ADDED_STRUCT}. The fixture ` +
        `at ${OTHER_MODULE_V1} exists to withhold it for v1; without it in the real source ` +
        `there is no upgrade to reproduce.`
    )
  }
  if (v1.includes(UPGRADE_ADDED_STRUCT_DECL)) {
    throw new Error(
      `the pre-upgrade fixture ${OTHER_MODULE_V1} defines ${UPGRADE_ADDED_STRUCT}, so v1 and v2 ` +
        `would be identical and no type would originate in the upgrade.`
    )
  }

  await fs.writeFile(modulePath, v1)
  const published = await publishPackage({ packagePath, clientConfigPath, pubfilePath })

  await fs.writeFile(modulePath, current)
  const upgraded = await upgradePackage({
    packagePath,
    clientConfigPath,
    pubfilePath,
    upgradeCapId: published.upgradeCapId,
  })

  if (upgraded.packageId === published.packageId) {
    throw new Error('upgrade returned the same package ID as the publish; nothing was upgraded')
  }

  return { originalId: published.packageId, publishedAt: upgraded.packageId }
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
