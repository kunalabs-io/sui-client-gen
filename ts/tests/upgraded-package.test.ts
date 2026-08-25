/**
 * End-to-end coverage for types belonging to an upgraded package.
 *
 * Global setup publishes the examples package without `other_module::AddedInAnUpgrade`, then
 * restores it and upgrades. That makes the two addresses the generated code has to keep
 * straight genuinely different on this chain:
 *
 *   - `$typeName` is built from the address of the version that *defined* the type;
 *   - move calls are dispatched to `publishedAt`, the newest version.
 *
 * A from-scratch publish collapses both into one address, which makes every confusion between
 * them invisible. These tests assert the distinction holds, and that objects created through
 * the newest version still decode against types defined by the original one.
 */
import { Transaction } from '@mysten/sui/transactions'
import { SuiGrpcClient } from '@mysten/sui/grpc'
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519'
import { fromBase64 } from '@mysten/sui/utils'
import { it, expect, describe, inject, beforeAll } from 'vitest'
import { LOCALNET_ENDPOINTS } from './test-utils'
import { localizeEnv } from './utils/local-env'
import { TEST_SECRET_KEY } from './utils/constants'
import {
  getEnv,
  getOriginalId,
  getPublishedAt,
  getTypeOrigin,
  getTypeOriginAddresses,
  getTypeOriginAddressesFor,
  setActiveEnvWithConfig,
} from './gen/_envs'
import { Bar } from './gen/examples/fixture/structs'
import { createBar, createFoo, createWithTwoGenerics } from './gen/examples/fixture/functions'
import { Foo } from './gen/examples/fixture/structs'

const originalId = inject('examplesOriginalId')
const publishedAt = inject('examplesPublishedAt')
const upgradeAddedOrigin = inject('examplesUpgradeAddedOriginId')

beforeAll(() => {
  setActiveEnvWithConfig(
    localizeEnv(getEnv('testnet'), {
      examples: {
        originalId,
        publishedAt,
        typeOriginOverrides: { 'other_module::AddedInAnUpgrade': upgradeAddedOrigin },
      },
    })
  )
})

const client = new SuiGrpcClient({ baseUrl: LOCALNET_ENDPOINTS.GRPC, network: 'localnet' })
const keypair = Ed25519Keypair.fromSecretKey(fromBase64(TEST_SECRET_KEY).slice(1))

describe('upgraded package', () => {
  it('publishes an upgrade, so the addresses actually differ', () => {
    // Guards the fixture itself: if setup ever stopped upgrading, every assertion below would
    // still pass trivially while testing nothing.
    expect(publishedAt).not.toBe(originalId)
    expect(getOriginalId('examples')).toBe(originalId)
    expect(getPublishedAt('examples')).toBe(publishedAt)
  })

  it('resolves type origins to the version that defined each type', () => {
    // Defined in v1 and untouched by the upgrade.
    expect(getTypeOrigin('examples', 'fixture::Bar')).toBe(originalId)
    expect(getTypeOrigin('examples', 'other_module::StructFromOtherModule')).toBe(originalId)
    // Introduced by the upgrade.
    expect(getTypeOrigin('examples', 'other_module::AddedInAnUpgrade')).toBe(upgradeAddedOrigin)
  })

  it('reports the distinct origin addresses across versions', () => {
    expect(getTypeOriginAddresses('examples')).toEqual([originalId, upgradeAddedOrigin].sort())
    expect(
      getTypeOriginAddressesFor('examples', [
        'fixture::Bar',
        'other_module::AddedInAnUpgrade',
      ]).sort()
    ).toEqual([originalId, upgradeAddedOrigin].sort())
  })

  it('builds $typeName from the defining version, not the newest one', () => {
    expect(Bar.$typeName).toBe(`${originalId}::fixture::Bar`)
    expect(Bar.$typeName.startsWith(publishedAt)).toBe(false)
  })

  it('creates an object through the newest version and decodes it as a v1 type', async () => {
    // The move call is dispatched to `publishedAt` while the decode validates against a
    // `$typeName` rooted at `originalId`. Confusing the two fails here.
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
      twoGenericsNested: createWithTwoGenerics(tx, [Bar.$typeName, `${createNestedTypeArg()}`], {
        genericField1: createBar(tx, 100n),
        genericField2: createWithTwoGenerics(tx, ['u8', 'u8'], {
          genericField1: 1,
          genericField2: 2,
        }),
      }),
      twoGenericsReifiedNested: createWithTwoGenerics(
        tx,
        [Bar.$typeName, `${createNestedTypeArg()}`],
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
          [Bar.$typeName, `vector<${createNestedTypeArg(Bar.$typeName)}>`],
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

    const res = await client.signAndExecuteTransaction({
      transaction: tx,
      signer: keypair,
      include: { effects: true },
    })
    if (res.$kind !== 'Transaction') throw new Error('transaction failed')
    const created = res.Transaction.effects.changedObjects.find(
      c => c.idOperation === 'Created' && c.outputState === 'ObjectWrite'
    )
    if (!created) throw new Error('no created object in transaction effects')
    await client.core.waitForTransaction({ digest: res.Transaction.digest })

    const foo = await Foo.r(Bar.reified()).fetch(client, created.objectId)
    expect(foo.generic.value).toEqual(100n)
    expect(foo.$typeName).toBe(`${originalId}::fixture::Foo`)
  })
})

/** `WithTwoGenerics<A, u8>` type string, rooted at the defining version like every other type. */
function createNestedTypeArg(inner = 'u8'): string {
  return `${getTypeOrigin('examples', 'fixture::WithTwoGenerics')}::fixture::WithTwoGenerics<${inner}, u8>`
}
