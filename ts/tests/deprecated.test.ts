/**
 * Tests for the deprecated `fromSuiParsedData` and `fromSuiObjectData` static methods.
 *
 * These methods consume JSON-RPC-shaped `SuiParsedData` / `SuiObjectData` types and are
 * only meaningful when paired with a `SuiJsonRpcClient`. They're retained on every
 * generated class for backwards-compatibility but marked `@deprecated`. This file is
 * the single place we exercise them with real chain data; the rest of the test suite
 * runs against gRPC, which doesn't produce JSON-RPC-shaped responses.
 *
 * When JSON-RPC support is eventually dropped upstream, this file should be deleted
 * alongside the deprecated methods themselves.
 */

import { Transaction } from '@mysten/sui/transactions'
import { SuiJsonRpcClient } from '@mysten/sui/jsonRpc'
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519'
import { fromBase64 } from '@mysten/sui/utils'
import { expect, it } from 'vitest'
import { TESTNET_ENDPOINTS } from './test-utils'
import { Bar, Foo } from './gen/examples/fixture/structs'
import { createBar, createFoo, createWithTwoGenerics } from './gen/examples/fixture/functions'
import { Dummy } from './gen/examples/fixture/structs'
import { StructFromOtherModule } from './gen/examples/other-module/structs'
import { WithTwoGenerics } from './gen/examples/fixture/structs'

const keypair = Ed25519Keypair.fromSecretKey(
  fromBase64('AMVT58FaLF2tJtg/g8X2z1/vG0FvNn0jvRu9X2Wl8F+u').slice(1)
)

const client = new SuiJsonRpcClient({
  url: TESTNET_ENDPOINTS.RPC,
  network: 'testnet',
})

async function execTx(tx: Transaction) {
  const res = await client.signAndExecuteTransaction({
    transaction: tx,
    signer: keypair,
    options: { showEffects: true },
  })
  if (!res.effects) {
    throw new Error(`Can't find effects in transaction`)
  }
  const id = res.effects!.created![0].reference.objectId
  if (!id) {
    throw new Error('no created object in transaction effects')
  }
  await client.waitForTransaction({ digest: res.digest })
  return id
}

async function fetchSuiObjectData(id: string) {
  const res = await client.getObject({
    id,
    options: { showBcs: true, showContent: true },
  })
  if (!res.data) {
    throw new Error(`object at id ${id} could not be fetched`)
  }
  return res.data
}

it.concurrent('fromSuiObjectData and fromSuiParsedData decode a non-generic struct', async () => {
  // Foo<Bar> with minimal payload — Bar is a top-level non-generic, but we need
  // a top-level fetchable object, so we create Foo<Bar> and assert the outer Foo decoding.
  const tx = new Transaction()

  createFoo(tx, [Bar.$typeName, Bar.$typeName], {
    generic: createBar(tx, 100n),
    reifiedPrimitiveVec: [1n],
    reifiedObjectVec: [createBar(tx, 100n)],
    genericVec: [createBar(tx, 100n)],
    genericVecNested: [
      createWithTwoGenerics(tx, [Bar.$typeName, 'u8'], {
        genericField1: createBar(tx, 100n),
        genericField2: 1,
      }),
    ],
    twoGenerics: createWithTwoGenerics(tx, [Bar.$typeName, Bar.$typeName], {
      genericField1: createBar(tx, 100n),
      genericField2: createBar(tx, 100n),
    }),
    twoGenericsReifiedPrimitive: createWithTwoGenerics(tx, ['u16', 'u64'], {
      genericField1: 1,
      genericField2: 2n,
    }),
    twoGenericsReifiedObject: createWithTwoGenerics(tx, [Bar.$typeName, Bar.$typeName], {
      genericField1: createBar(tx, 100n),
      genericField2: createBar(tx, 100n),
    }),
    twoGenericsNested: createWithTwoGenerics(
      tx,
      [Bar.$typeName, `${WithTwoGenerics.$typeName}<u8, u8>`],
      {
        genericField1: createBar(tx, 100n),
        genericField2: createWithTwoGenerics(tx, ['u8', 'u8'], {
          genericField1: 1,
          genericField2: 2,
        }),
      }
    ),
    twoGenericsReifiedNested: createWithTwoGenerics(
      tx,
      [Bar.$typeName, `${WithTwoGenerics.$typeName}<u8, u8>`],
      {
        genericField1: createBar(tx, 100n),
        genericField2: createWithTwoGenerics(tx, ['u8', 'u8'], {
          genericField1: 1,
          genericField2: 2,
        }),
      }
    ),
    twoGenericsNestedVec: [
      createWithTwoGenerics(
        tx,
        [Bar.$typeName, `vector<${WithTwoGenerics.$typeName}<${Bar.$typeName}, u8>>`],
        {
          genericField1: createBar(tx, 100n),
          genericField2: [
            createWithTwoGenerics(tx, [Bar.$typeName, 'u8'], {
              genericField1: createBar(tx, 100n),
              genericField2: 1,
            }),
          ],
        }
      ),
    ],
    objRef: createBar(tx, 100n),
  })

  const id = await execTx(tx)
  const data = await fetchSuiObjectData(id)

  // fromSuiObjectData: prefers BCS path when available, falls back to content.
  const fromObjectData = Foo.fromSuiObjectData(Bar.reified(), data)

  // fromSuiParsedData: consumes the JSON-RPC content (fields-with-types) shape.
  if (!data.content) {
    throw new Error('expected content to be present')
  }
  const fromParsedData = Foo.fromSuiParsedData(Bar.reified(), data.content)

  // Both paths must produce identical results.
  expect(fromObjectData).toEqual(fromParsedData)

  // Spot-check a couple of fields to confirm decoding actually happened.
  expect(fromObjectData.id).toEqual(id)
  expect(fromObjectData.generic).toEqual(Bar.r.new({ value: 100n }))
  expect(fromObjectData.dummy).toEqual(Dummy.r.new({ dummyField: false }))
  expect(fromObjectData.other).toEqual(StructFromOtherModule.r.new({ dummyField: false }))
  expect(fromObjectData.reifiedPrimitiveVec).toEqual([1n])
})
