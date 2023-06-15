import {
  Connection,
  JsonRpcProvider,
  RawSigner,
  TransactionBlock,
  fromExportedKeypair,
} from '@mysten/sui.js'
import { createPoolWithCoins } from './gen/amm/util/functions'
import { PACKAGE_ID as FIXTURE_PACKAGE_ID } from './gen/fixture'
import { faucetMint } from './gen/fixture/example-coin/functions'
import { Command } from 'commander'
import { Pool, PoolCreationEvent, PoolRegistry } from './gen/amm/pool/structs'
import { createWithGenericField } from './gen/fixture/fixture/functions'
import { WithGenericField } from './gen/fixture/fixture/structs'
import { Field } from './gen/sui/dynamic-field/structs'

const EXAMPLE_COIN_FAUCET_ID = '0x810610be4cf14d2eb108c3437cb85ffb166e4ab22ba95ea94d309df792b1beb0'
const AMM_POOL_REGISTRY_ID = '0xf5fbeb73a0a1967766cc4804cd46ee8f303f15337cb6fb6a9b0368060f017136'

const AMM_POOL_ID = '0x31f15e8544b739ee857d759a2c85a60712a67f1918a534f123f978b76a0dbbd2'

const WITH_GENERIC_FIELD_ID = '0x8cff8a5ed1cf49dcc8aac13e250f843cb26be8ed6a5e2e304051507965d4b79f'

const keypair = fromExportedKeypair({
  schema: 'ED25519',
  privateKey: 'c6dC5eHuDwtumSoCO4v6MQCqVoYlGQwtdZVcyUYSuAo=',
}) // address: 0x590b8e60ae1d7c1ff57f4697b03bd3a19a7db7d766c87e880153bc494596cb26

const provider = new JsonRpcProvider(
  new Connection({
    fullnode: 'https://fullnode.devnet.sui.io:443/',
  })
)
const signer = new RawSigner(keypair, provider)

/**
 * An example for calling transactions.
 * Create a new AMM pool. Will not work if the pool already exists.
 */
async function createPool() {
  const address = await signer.getAddress()

  const tx = new TransactionBlock()

  const [suiCoin] = tx.splitCoins(tx.gas, [tx.pure(1_000_000)])
  const exampleCoin = faucetMint(tx, EXAMPLE_COIN_FAUCET_ID)
  const lp = createPoolWithCoins(
    tx,
    ['0x2::sui::SUI', `${FIXTURE_PACKAGE_ID}::example_coin::EXAMPLE_COIN`],
    {
      registry: AMM_POOL_REGISTRY_ID,
      initA: suiCoin,
      initB: exampleCoin,
      lpFeeBps: 30n,
      adminFeePct: 10n,
    }
  )
  tx.transferObjects([lp], tx.pure(address))

  const res = await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
  })
  console.log(`tx digest: ${res.digest}`)
}

/** An example for object fetching. Fetch and print the AMM pool at AMM_POOL_ID. */
async function fetchPool() {
  const pool = await Pool.fetch(provider, AMM_POOL_ID)
  console.log(pool)
}

/** An example for event fetching. Fetch and print the pool creation events. */
async function fetchPoolCreationEvents() {
  const res = await provider.queryEvents({
    query: {
      MoveEventType: PoolCreationEvent.$typeName,
    },
  })
  res.data.map(e => {
    console.log(PoolCreationEvent.fromBcs(e.bcs!, 'base58'))
  })
}

/**
 * An example for dynamic field fetching.
 * Fetch and print the items in the AMM pool registry at AMM_POOL_REGISTRY_ID.
 */
async function fetchPoolRegistryItems() {
  const registry = await PoolRegistry.fetch(provider, AMM_POOL_REGISTRY_ID)
  const fields = await provider.getDynamicFields({
    parentId: registry.table.id,
  })

  const item = await Field.fetch(provider, fields.data[0].objectId)
  console.log(item)
}

/**
 * An example for calling transactions with generic fields.
 */
async function createStructWithVector() {
  const tx = new TransactionBlock()

  const coin = faucetMint(tx, tx.object(EXAMPLE_COIN_FAUCET_ID))

  const field = tx.makeMoveVec({
    objects: [coin],
  })
  createWithGenericField(
    tx,
    `vector<0x2::coin::Coin<${FIXTURE_PACKAGE_ID}::example_coin::EXAMPLE_COIN>>`,
    field
  )

  const res = await signer.signAndExecuteTransactionBlock({
    transactionBlock: tx,
  })
  console.log(res)
}

/** An example for object fetching with generic fields. */
async function fetchWithGenericField() {
  const field = await WithGenericField.fetch(provider, WITH_GENERIC_FIELD_ID)
  console.log(field)
}

async function main() {
  const program = new Command()

  program
    .command('create-pool')
    .action(createPool)
    .summary(
      'An example for calling transactions. Create a new AMM pool. Will not work if the pool already exists.'
    )
  program
    .command('fetch-pool')
    .action(fetchPool)
    .summary(`An example for object fetching. Fetch and print the AMM pool at ${AMM_POOL_ID}.`)
  program
    .command('fetch-pool-registry-items')
    .action(fetchPoolRegistryItems)
    .summary(
      `An example for dynamic field fetching. Fetch and print the items in the AMM pool registry at ${AMM_POOL_REGISTRY_ID}.`
    )
  program
    .command('fetch-pool-creation-events')
    .action(fetchPoolCreationEvents)
    .summary('An example for event fetching. Fetch and print the pool creation events.')
  program
    .command('create-struct-with-vector')
    .action(createStructWithVector)
    .summary('An example for calling transactions with generic fields.')
  program
    .command('fetch-with-generic-field')
    .action(fetchWithGenericField)
    .summary('An example for fetching an object with a generic field.')

  program.addHelpCommand(false)

  await program.parseAsync()
}

main().catch(console.error)
