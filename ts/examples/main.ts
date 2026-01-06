import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519'
import { fromB64, normalizeSuiAddress } from '@mysten/sui/utils'
import { SuiClient } from '@mysten/sui/client'
import { Transaction } from '@mysten/sui/transactions'
import { create } from './gen/amm/pool/functions'
import { PACKAGE_ID as EXAMPLES_PACKAGE_ID } from './gen/examples'
import { intoBalance, fromBalance } from './gen/sui/coin/functions'
import { faucetMint } from './gen/examples/example-coin/functions'
import { Command } from 'commander'
import { LP, Pool, PoolCreationEvent, PoolRegistry, PoolRegistryItem } from './gen/amm/pool/structs'
import { createWithGenericField } from './gen/examples/fixture/functions'
import { WithGenericField } from './gen/examples/fixture/structs'
import { Field } from './gen/sui/dynamic-field/structs'
import { EXAMPLE_COIN } from './gen/examples/example-coin/structs'
import { createExampleStruct, specialTypes } from './gen/examples/examples/functions'
import { bcs } from '@mysten/sui/bcs'
import { ExampleStruct } from './gen/examples/examples/structs'
import { SUI } from './gen/sui/sui/structs'
import { vector } from './gen/_framework/reified'

const EXAMPLE_COIN_FAUCET_ID = '0x23a00d64a785280a794d0bdd2f641dfabf117c78e07cb682550ed3c2b41dd760'
const AMM_POOL_REGISTRY_ID = '0xe3e05313eff4f6f44206982e42fa1219c972113f3a651abe168123abc0202411'

const AMM_POOL_ID = '0x799331284a2f75ed54b1a2bf212a26e3f465cbc7b974dbfa956f093de9ad8059'

const WITH_GENERIC_FIELD_ID = '0xf170bc37f72659e942b376cef95b3194f8ffbecc0a82e601d682ae6e2693cd35'

const keypair = Ed25519Keypair.fromSecretKey(
  fromB64('AMVT58FaLF2tJtg/g8X2z1/vG0FvNn0jvRu9X2Wl8F+u').slice(1)
) // address: 0x8becfafb14c111fc08adee6cc9afa95a863d1bf133f796626eec353f98ea8507

const client = new SuiClient({
  url: 'https://fullnode.testnet.sui.io:443/',
})

/**
 * An example for calling transactions.
 * Create a new AMM pool. Will not work if the pool already exists.
 */
async function createPool() {
  const address = keypair.getPublicKey().toSuiAddress()

  const tx = new Transaction()

  const [suiCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(1_000_000)])
  const exampleCoin = faucetMint(tx, EXAMPLE_COIN_FAUCET_ID)

  // Convert coins to balances
  const suiBalance = intoBalance(tx, '0x2::sui::SUI', suiCoin)
  const exampleBalance = intoBalance(tx, EXAMPLE_COIN.$typeName, exampleCoin)

  // Call pool::create with balances
  const lpBalance = create(tx, ['0x2::sui::SUI', EXAMPLE_COIN.$typeName], {
    registry: AMM_POOL_REGISTRY_ID,
    initA: suiBalance,
    initB: exampleBalance,
    lpFeeBps: 30n,
    adminFeePct: 10n,
  })

  // Convert LP balance back to coin
  const lpTypeName = LP.r(SUI.p, EXAMPLE_COIN.p).fullTypeName // `${AMM_PACKAGE_ID}::pool::LP<0x2::sui::SUI, ${EXAMPLE_COIN.$typeName}>`
  const lp = fromBalance(tx, lpTypeName, lpBalance)

  tx.transferObjects([lp], tx.pure.address(address))

  const res = await client.signAndExecuteTransaction({
    signer: keypair,
    transaction: tx,
  })
  console.log(`tx digest: ${res.digest}`)
}

/** An example for object fetching. Fetch and print the AMM pool at AMM_POOL_ID. */
async function fetchPool() {
  const pool = await Pool.r(SUI.p, EXAMPLE_COIN.p).fetch(client, AMM_POOL_ID)
  console.log(pool)
}

/** An example for event fetching. Fetch and print the pool creation events. */
async function fetchPoolCreationEvents() {
  const res = await client.queryEvents({
    query: {
      MoveEventType: PoolCreationEvent.$typeName,
    },
  })
  res.data.map(e => {
    console.log(PoolCreationEvent.fromBcs(fromB64(e.bcs!)))
  })
}

/**
 * An example for dynamic field fetching.
 * Fetch and print the items in the AMM pool registry at AMM_POOL_REGISTRY_ID.
 */
async function fetchPoolRegistryItems() {
  const registry = await PoolRegistry.fetch(client, AMM_POOL_REGISTRY_ID)
  const fields = await client.getDynamicFields({
    parentId: registry.table.id,
  })

  const item = await Field.fetch(
    client,
    [PoolRegistryItem.reified(), 'bool'],
    fields.data[0].objectId
  )
  console.log(item)
}

/**
 * An example for calling transactions with generic fields.
 */
async function createStructWithVector() {
  const tx = new Transaction()

  const coin = faucetMint(tx, tx.object(EXAMPLE_COIN_FAUCET_ID))

  const field = tx.makeMoveVec({
    elements: [coin],
  })
  createWithGenericField(
    tx,
    `vector<0x2::coin::Coin<${EXAMPLES_PACKAGE_ID}::example_coin::EXAMPLE_COIN>>`,
    field
  )

  const res = await client.signAndExecuteTransaction({
    signer: keypair,
    transaction: tx,
  })
  console.log(res)
}

/** An example for object fetching with generic fields. */
async function fetchWithGenericField() {
  const field = await WithGenericField.r(vector(EXAMPLE_COIN.r)).fetch(
    client,
    WITH_GENERIC_FIELD_ID
  )
  console.log(field)
}

async function createSpecialTypes() {
  const tx = new Transaction()

  const e1 = createExampleStruct(tx)
  const e2 = createExampleStruct(tx)

  specialTypes(tx, {
    asciiString: 'example ascii string',
    utf8String: 'example utf8 string',
    vectorOfU64: [1n, 2n],
    vectorOfObjects: [e1, e2],
    idField: '0x12345',
    address: '0x12345',
    optionSome: 5n,
    optionNone: null,
  })

  // manually
  specialTypes(tx, {
    asciiString: tx.pure.string('example ascii string'),
    utf8String: tx.pure.string('example utf8 string'),
    vectorOfU64: tx.pure(bcs.vector(bcs.u64()).serialize([1n, 2n])),
    vectorOfObjects: tx.makeMoveVec({
      elements: [createExampleStruct(tx), createExampleStruct(tx)],
      type: ExampleStruct.$typeName,
    }),
    idField: tx.pure.address(normalizeSuiAddress('0x12345')),
    address: tx.pure.address(normalizeSuiAddress('0x12345')),
    optionSome: tx.pure(bcs.vector(bcs.u64()).serialize([5n])),
    optionNone: tx.pure(bcs.vector(bcs.u64()).serialize([])),
  })

  const res = await client.signAndExecuteTransaction({
    signer: keypair,
    transaction: tx,
  })
  console.log(res.digest)
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
  program
    .command('create-special-types')
    .action(createSpecialTypes)
    .summary('An example for calling functions with special types.')

  program.addHelpCommand(false)

  await program.parseAsync()
}

main().catch(console.error)
