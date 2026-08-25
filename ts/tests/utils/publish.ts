import { execFile } from 'node:child_process'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { promisify } from 'node:util'

const exec = promisify(execFile)

export interface StagedMoveTree {
  dir: string
  dispose: () => Promise<void>
}

/**
 * Copy the Move source tree to a temporary directory to publish from.
 *
 * Publishing writes back into the package directory: `Published.toml` gains an entry and a
 * legacy `Move.lock` gets rewritten in the modern format. Doing that in-tree would leave the
 * repository dirty after every test run and — worse — record a localnet address under the
 * `[published.testnet]` heading that the generator reads, since the build env is `testnet`
 * regardless of which network is actually being published to.
 *
 * The whole tree is copied rather than individual packages so relative paths between packages
 * keep resolving. `build/` output is skipped; it is large and gets regenerated anyway.
 */
export async function stageMoveTree(moveDir: string): Promise<StagedMoveTree> {
  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'sui-client-gen-move-'))
  const dir = path.join(tmp, 'move')
  await fs.cp(moveDir, dir, {
    recursive: true,
    filter: src => path.basename(src) !== 'build',
  })
  return { dir, dispose: () => fs.rm(tmp, { recursive: true, force: true }) }
}

/**
 * An ephemeral publication file.
 *
 * `test-publish` records the package's addresses here, and `test-upgrade` reads them back to
 * know what it is upgrading — so a publish and its later upgrade must share one pubfile.
 * Ephemeral means the metadata never lands in the Move source tree.
 */
export interface Pubfile {
  path: string
  dispose: () => Promise<void>
}

export async function createPubfile(): Promise<Pubfile> {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'sui-client-gen-pub-'))
  return {
    path: path.join(dir, 'Pub.localnet.toml'),
    dispose: () => fs.rm(dir, { recursive: true, force: true }),
  }
}

export interface PublishOptions {
  /** Absolute path to the Move package directory. */
  packagePath: string
  /** Path to the throwaway `client.yaml` produced by `createSuiCliConfig`. */
  clientConfigPath: string
  /** Shared pubfile; pass the same one to `upgradePackage` to upgrade this publication. */
  pubfilePath: string
  suiBin?: string
}

export interface PublishResult {
  packageId: string
  /** `0x2::package::UpgradeCap` minted by the publish, required to upgrade later. */
  upgradeCapId: string
}

export interface UpgradeOptions extends PublishOptions {
  upgradeCapId: string
}

interface ObjectChange {
  type?: string
  packageId?: string
  objectId?: string
  objectType?: string
}

/**
 * Publish a Move package to the network the CLI config points at, and return its fresh
 * package ID together with the upgrade capability minted for it.
 *
 * The build env stays `testnet` while publishing to localnet. That is supported — the build
 * env only selects which addresses compilation uses, not where the transaction lands — and it
 * is necessary, because `--force-regenesis` mints a new chain identifier on every run, so no
 * committed `[environments]` entry could ever match the local chain.
 */
export async function publishPackage(opts: PublishOptions): Promise<PublishResult> {
  const changes = await runPackageCommand('test-publish', opts, ['--publish-unpublished-deps'])

  const packageId = singlePublishedId(changes, opts.packagePath)
  const cap = changes.find(
    c => c.type === 'created' && (c.objectType ?? '').includes('::package::UpgradeCap')
  )
  if (!cap?.objectId) throw new Error(`no UpgradeCap minted publishing ${opts.packagePath}`)

  return { packageId, upgradeCapId: cap.objectId }
}

/**
 * Upgrade a previously published package and return the new package ID.
 *
 * Must use `test-upgrade` rather than `upgrade`: the plain subcommand rejects `--pubfile-path`
 * outright, since ephemeral publications are not recorded in the package's lockfile.
 */
export async function upgradePackage(opts: UpgradeOptions): Promise<{ packageId: string }> {
  const changes = await runPackageCommand('test-upgrade', opts, [
    '--upgrade-capability',
    opts.upgradeCapId,
  ])
  return { packageId: singlePublishedId(changes, opts.packagePath) }
}

async function runPackageCommand(
  subcommand: 'test-publish' | 'test-upgrade',
  opts: PublishOptions,
  extraArgs: string[]
): Promise<ObjectChange[]> {
  const suiBin = opts.suiBin ?? process.env.SUI_BIN ?? 'sui'

  let stdout: string
  try {
    const res = await exec(
      suiBin,
      [
        'client',
        '--client.config',
        opts.clientConfigPath,
        subcommand,
        '--pubfile-path',
        opts.pubfilePath,
        '--build-env',
        'testnet',
        ...extraArgs,
        '--skip-dependency-verification',
        '--silence-warnings',
        '--json',
        opts.packagePath,
      ],
      { maxBuffer: 256 * 1024 * 1024 }
    )
    stdout = res.stdout
  } catch (e) {
    const err = e as { stderr?: string; stdout?: string; message?: string }
    const detail = [err.stderr, err.stdout].filter(Boolean).join('\n').trim()
    throw new Error(
      `sui client ${subcommand} failed for ${opts.packagePath}:\n${detail || err.message}`,
      {
        cause: e,
      }
    )
  }

  // The CLI prints human-readable preamble before the JSON payload.
  const start = stdout.indexOf('{')
  if (start < 0)
    throw new Error(`sui client ${subcommand} produced no JSON for ${opts.packagePath}`)
  const parsed = JSON.parse(stdout.slice(start)) as { objectChanges?: ObjectChange[] }
  return parsed.objectChanges ?? []
}

function singlePublishedId(changes: ObjectChange[], packagePath: string): string {
  const published = changes.filter(c => c.type === 'published')
  if (published.length !== 1) {
    // The fixture packages have no unpublished local dependencies, so exactly one package is
    // published per call. More than one means a fixture grew a dependency, and the caller can
    // no longer assume which ID belongs to which source directory.
    throw new Error(
      `expected exactly 1 published package from ${packagePath}, got ${published.length}`
    )
  }
  const { packageId } = published[0]
  if (!packageId) throw new Error(`no packageId in publish output for ${packagePath}`)
  return packageId
}
