import { spawn, type ChildProcess } from 'node:child_process'
import { SuiGrpcClient } from '@mysten/sui/grpc'

export interface LocalNetwork {
  rpcUrl: string
  faucetUrl: string
  stop: () => Promise<void>
}

export interface StartLocalNetworkOptions {
  rpcPort?: number
  faucetPort?: number
  epochDurationMs?: number
  readyTimeoutMs?: number
  suiBin?: string
}

/**
 * Spawn a single-validator Sui network with a faucet, for the duration of the test run.
 *
 * `--force-regenesis` means every run starts from a fresh genesis, so nothing carries over
 * between runs and the chain identifier differs each time. Set `SUI_NETWORK_LOG=1` to see
 * the validator's output.
 */
export async function startLocalNetwork(
  opts: StartLocalNetworkOptions = {}
): Promise<LocalNetwork> {
  const rpcPort = opts.rpcPort ?? 9000
  const faucetPort = opts.faucetPort ?? 9123
  // A long epoch keeps the epoch stable for the whole run. Transactions paying gas from an
  // address balance carry an expiration bounded to [epoch, epoch + 1], so an epoch flip
  // mid-run could invalidate an in-flight transaction.
  const epochMs = opts.epochDurationMs ?? 3_600_000
  const readyTimeoutMs = opts.readyTimeoutMs ?? 120_000
  const suiBin = opts.suiBin ?? process.env.SUI_BIN ?? 'sui'

  const child = spawn(
    suiBin,
    [
      'start',
      '--force-regenesis',
      `--with-faucet=0.0.0.0:${faucetPort}`,
      '--fullnode-rpc-port',
      String(rpcPort),
      '--epoch-duration-ms',
      String(epochMs),
    ],
    { stdio: ['ignore', 'pipe', 'pipe'] }
  )

  const verbose = process.env.SUI_NETWORK_LOG === '1'
  child.stdout?.on('data', d => {
    if (verbose) process.stdout.write(d)
  })
  child.stderr?.on('data', d => {
    if (verbose) process.stderr.write(d)
  })

  const earlyExit = new Promise<never>((_, reject) => {
    child.once('exit', (code, signal) => {
      reject(
        new Error(
          `\`${suiBin} start\` exited before becoming ready (code=${code} signal=${signal}). ` +
            `Re-run with SUI_NETWORK_LOG=1 to see its output. A stale validator still holding ` +
            `port ${rpcPort} is the usual cause.`
        )
      )
    })
  })

  const rpcUrl = `http://127.0.0.1:${rpcPort}`
  const faucetUrl = `http://127.0.0.1:${faucetPort}`

  try {
    await Promise.race([waitForRpc(rpcUrl, readyTimeoutMs), earlyExit])
  } catch (err) {
    await stopProcess(child)
    throw err
  }

  return { rpcUrl, faucetUrl, stop: () => stopProcess(child) }
}

async function waitForRpc(url: string, timeoutMs: number): Promise<void> {
  const client = new SuiGrpcClient({ network: 'localnet', baseUrl: url })
  const deadline = Date.now() + timeoutMs
  let lastErr: unknown
  while (Date.now() < deadline) {
    try {
      await client.core.getChainIdentifier()
      return
    } catch (e) {
      lastErr = e
      await sleep(250)
    }
  }
  throw new Error(
    `local Sui RPC at ${url} not healthy within ${timeoutMs}ms (last error: ${lastErr})`
  )
}

async function stopProcess(child: ChildProcess): Promise<void> {
  if (child.exitCode != null || child.signalCode != null) return
  child.kill('SIGTERM')
  await new Promise<void>(resolve => {
    child.once('exit', () => resolve())
    setTimeout(() => {
      if (child.exitCode == null && child.signalCode == null) child.kill('SIGKILL')
      resolve()
    }, 5_000)
  })
}

function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms))
}
