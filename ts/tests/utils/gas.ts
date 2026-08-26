import type { SuiGrpcClient } from '@mysten/sui/grpc'
import type { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519'
import { Transaction, type TransactionObjectArgument } from '@mysten/sui/transactions'

const SUI_TYPE = '0x2::sui::SUI'

/**
 * Gas budget for the two bootstrap transactions below. Both are tiny; this only has to be
 * comfortably larger than they cost.
 */
const BOOTSTRAP_GAS_BUDGET = 1_000_000_000n

/** Left behind as coins so the funding transaction can pay for itself. Swept immediately after. */
const FUND_RESERVE = 5_000_000_000n

/**
 * Move the signer's SUI from coin objects into its **address balance** (the funds accumulator),
 * leaving it with no SUI coins at all.
 *
 * This is what lets the suite run transactions concurrently from a single account. A gas coin is
 * an owned object consumed at a specific version, so two transactions built against the same
 * version equivocate and the coin locks until the end of the epoch. An address balance has no
 * version to race on and settles concurrent debits commutatively, so once the signer is
 * SUI-coinless, `tx.build()` has no coin to select and pays gas from the accumulator instead —
 * adding the bounded expiration such transactions require on its own.
 *
 * Must run *after* anything that needs ordinary coin gas, notably the `sui` CLI publishes.
 */
export async function useAddressBalanceForGas(
  client: SuiGrpcClient,
  keypair: Ed25519Keypair
): Promise<void> {
  await fundAddressBalance(client, keypair)
  await drainGasCoins(client, keypair)
}

/**
 * Send all but {@link FUND_RESERVE} of the signer's coin SUI to its own address balance.
 * Pays gas the ordinary way, since there is nothing in the accumulator yet.
 */
async function fundAddressBalance(client: SuiGrpcClient, keypair: Ed25519Keypair): Promise<void> {
  const address = keypair.toSuiAddress()
  const total = BigInt((await client.core.getBalance({ owner: address })).balance.balance)
  const amount = total - FUND_RESERVE
  if (amount <= 0n) {
    throw new Error(
      `cannot fund the address balance of ${address}: it holds ${total} MIST, ` +
        `which leaves nothing above the ${FUND_RESERVE} MIST gas reserve`
    )
  }

  // Descending by balance: the SDK picks the largest coin for gas, and it is the only one not
  // consumed as an input, so merging the rest into `tx.gas` puts the whole balance in one place.
  const coins = (await client.core.listCoins({ owner: address, coinType: SUI_TYPE })).objects
    .slice()
    .sort((a, b) => (BigInt(b.balance) > BigInt(a.balance) ? 1 : -1))

  const tx = new Transaction()
  tx.setSender(address)
  const rest = coins.slice(1).map(c => tx.object(c.objectId))
  if (rest.length > 0) tx.mergeCoins(tx.gas, rest)
  const [split] = tx.splitCoins(tx.gas, [amount])
  sendToAddressBalance(tx, split, address)
  tx.setGasBudget(BOOTSTRAP_GAS_BUDGET)

  await execute(client, keypair, tx, 'fund address balance')
}

/**
 * Sweep the signer's remaining SUI coins into its address balance.
 *
 * This is the one transaction that must pay from the accumulator *explicitly*: coins still
 * exist, so gas selection would otherwise pick one and leave it behind. An empty gas payment
 * requires supplying the expiration by hand, which every later transaction gets automatically
 * once no coins remain.
 */
async function drainGasCoins(client: SuiGrpcClient, keypair: Ed25519Keypair): Promise<void> {
  const address = keypair.toSuiAddress()
  const coins = (await client.core.listCoins({ owner: address, coinType: SUI_TYPE })).objects
  if (coins.length === 0) return

  const tx = new Transaction()
  tx.setSender(address)
  const primary = tx.object(coins[0].objectId)
  if (coins.length > 1) {
    tx.mergeCoins(
      primary,
      coins.slice(1).map(c => tx.object(c.objectId))
    )
  }
  sendToAddressBalance(tx, primary, address)
  tx.setGasPayment([])
  tx.setGasBudget(BOOTSTRAP_GAS_BUDGET)
  tx.setExpiration(await addressBalanceExpiration(client))

  await execute(client, keypair, tx, 'drain gas coins')

  const left = (await client.core.listCoins({ owner: address, coinType: SUI_TYPE })).objects
  if (left.length > 0) {
    throw new Error(
      `${address} still holds ${left.length} SUI coin(s) after draining; gas selection would ` +
        `pick one and transactions would race on its version again`
    )
  }
}

/** `coin::into_balance` then `balance::send_funds` back to `recipient`'s accumulator. */
function sendToAddressBalance(
  tx: Transaction,
  coin: TransactionObjectArgument,
  recipient: string
): void {
  const balance = tx.moveCall({
    target: '0x2::coin::into_balance',
    typeArguments: [SUI_TYPE],
    arguments: [coin],
  })
  tx.moveCall({
    target: '0x2::balance::send_funds',
    typeArguments: [SUI_TYPE],
    arguments: [balance, tx.pure.address(recipient)],
  })
}

/**
 * Expiration for a transaction paying from an address balance. The validator caps validity at
 * two epochs, so the window is `[epoch, epoch + 1]`; the harness runs a long epoch precisely so
 * this cannot go stale mid-run.
 */
async function addressBalanceExpiration(client: SuiGrpcClient) {
  const [{ chainIdentifier }, { systemState }] = await Promise.all([
    client.core.getChainIdentifier(),
    client.core.getCurrentSystemState(),
  ])
  const epoch = BigInt(systemState.epoch)
  return {
    ValidDuring: {
      minEpoch: String(epoch),
      maxEpoch: String(epoch + 1n),
      minTimestamp: null,
      maxTimestamp: null,
      chain: chainIdentifier,
      // Distinguishes otherwise byte-identical transactions, so concurrent senders can't collide.
      nonce: Math.floor(Math.random() * 4_294_967_296),
    },
  }
}

async function execute(
  client: SuiGrpcClient,
  keypair: Ed25519Keypair,
  tx: Transaction,
  label: string
): Promise<void> {
  const bytes = await tx.build({ client })
  const { signature } = await keypair.signTransaction(bytes)
  const res = await client.core.executeTransaction({
    transaction: bytes,
    signatures: [signature],
    include: { effects: true },
  })
  const executed = res.Transaction ?? res.FailedTransaction
  await client.core.waitForTransaction({ digest: executed.digest })
  if (!executed.status.success) {
    throw new Error(`${label} failed: ${executed.status.error?.message ?? 'unknown error'}`)
  }
}
