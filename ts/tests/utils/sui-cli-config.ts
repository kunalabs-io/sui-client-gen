import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import type { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519'
import { decodeSuiPrivateKey } from '@mysten/sui/cryptography'
import { toBase64 } from '@mysten/sui/utils'

export interface SuiCliConfig {
  clientYamlPath: string
  dispose: () => Promise<void>
}

export interface CreateSuiCliConfigOptions {
  rpcUrl: string
  keypair: Ed25519Keypair
  alias?: string
}

const SCHEME_FLAG: Record<string, number> = {
  ED25519: 0x00,
  Secp256k1: 0x01,
  Secp256r1: 0x02,
}

/**
 * Write a throwaway `client.yaml` + keystore so the `sui` CLI can publish as `keypair`
 * against `rpcUrl`. Publishing goes through the CLI rather than the SDK because
 * `sui client test-publish` handles building and unpublished-dependency publication;
 * the CLI needs a config file on disk, and we don't want to touch the developer's
 * real `~/.sui`.
 */
export async function createSuiCliConfig(opts: CreateSuiCliConfigOptions): Promise<SuiCliConfig> {
  const alias = opts.alias ?? 'localnet'
  const configDir = await fs.mkdtemp(path.join(os.tmpdir(), 'sui-client-gen-cli-'))
  const keystorePath = path.join(configDir, 'sui.keystore')
  const clientYamlPath = path.join(configDir, 'client.yaml')

  const { scheme, secretKey } = decodeSuiPrivateKey(opts.keypair.getSecretKey())
  const flag = SCHEME_FLAG[scheme]
  if (flag === undefined) throw new Error(`unsupported keypair scheme: ${scheme}`)
  const bytes = new Uint8Array(secretKey.length + 1)
  bytes[0] = flag
  bytes.set(secretKey, 1)
  await fs.writeFile(keystorePath, `${JSON.stringify([toBase64(bytes)], null, 2)}\n`)

  await fs.writeFile(
    clientYamlPath,
    `---
keystore:
  File: ${keystorePath}
external_keys: ~
envs:
  - alias: ${alias}
    rpc: "${opts.rpcUrl}"
    ws: ~
    basic_auth: ~
active_env: ${alias}
active_address: "${opts.keypair.toSuiAddress()}"
`
  )

  return {
    clientYamlPath,
    dispose: () => fs.rm(configDir, { recursive: true, force: true }),
  }
}
