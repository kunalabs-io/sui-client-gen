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

export interface PublishOptions {
  /** Absolute path to the Move package directory. */
  packagePath: string
  /** Path to the throwaway `client.yaml` produced by `createSuiCliConfig`. */
  clientConfigPath: string
  suiBin?: string
}

export interface PublishResult {
  packageId: string
  modules: string[]
}

interface PublishedChange {
  type?: string
  packageId?: string
  modules?: string[]
}

/**
 * Publish a Move package to the network the CLI config points at, and return its
 * fresh package ID.
 *
 * Uses `sui client test-publish`, which compiles against `--build-env` while publishing to
 * whatever network the config names, recording dependency addresses in an ephemeral pubfile.
 * The build env stays `testnet` rather than tracking the localnet: `--force-regenesis` mints a
 * new chain identifier on every run, so no committed `[environments]` entry could match it,
 * and the build env only selects which addresses compilation uses — it does not have to be the
 * network being published to.
 */
export async function publishPackage(opts: PublishOptions): Promise<PublishResult> {
  const suiBin = opts.suiBin ?? process.env.SUI_BIN ?? 'sui'
  const pubfileDir = await fs.mkdtemp(path.join(os.tmpdir(), 'sui-client-gen-pub-'))
  const pubfilePath = path.join(pubfileDir, 'Pub.localnet.toml')

  let stdout: string
  try {
    const res = await exec(
      suiBin,
      [
        'client',
        '--client.config',
        opts.clientConfigPath,
        'test-publish',
        '--pubfile-path',
        pubfilePath,
        '--build-env',
        'testnet',
        '--publish-unpublished-deps',
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
      `sui client test-publish failed for ${opts.packagePath}:\n${detail || err.message}`,
      { cause: e }
    )
  } finally {
    await fs.rm(pubfileDir, { recursive: true, force: true })
  }

  const start = stdout.indexOf('{')
  if (start < 0) throw new Error(`sui client test-publish produced no JSON for ${opts.packagePath}`)
  const parsed = JSON.parse(stdout.slice(start)) as { objectChanges?: PublishedChange[] }

  const published = (parsed.objectChanges ?? []).filter(c => c.type === 'published')
  if (published.length !== 1) {
    // Our fixture packages have no unpublished local dependencies, so exactly one package
    // is published per call. More than one means the fixtures grew a dependency and the
    // caller can no longer assume which ID belongs to which source directory.
    throw new Error(
      `expected exactly 1 published package from ${opts.packagePath}, got ${published.length}`
    )
  }

  const { packageId, modules } = published[0]
  if (!packageId) throw new Error(`no packageId in publish output for ${opts.packagePath}`)
  return { packageId, modules: modules ?? [] }
}
