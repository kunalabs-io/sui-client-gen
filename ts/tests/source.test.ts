import { Transaction } from '@mysten/sui/transactions'
import { SuiClient } from '@mysten/sui/client'
import { SerialTransactionExecutor } from '@mysten/sui/transactions'
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519'
import { fromBase64 } from '@mysten/sui/utils'
import { it, expect, describe, afterAll, expectTypeOf } from 'vitest'
import {
  Bar,
  Dummy,
  Foo,
  WithGenericField,
  WithSpecialTypes,
  WithSpecialTypesAsGenerics,
  WithSpecialTypesInVectors,
  WithTwoGenerics,
} from './gen/examples/fixture/structs'
import {
  createBar,
  createFoo,
  createSpecial,
  createSpecialAsGenerics,
  createSpecialInVectors,
  createWithGenericField,
  createWithTwoGenerics,
} from './gen/examples/fixture/functions'
import { StructFromOtherModule } from './gen/examples/other-module/structs'
import { string } from './gen/std/ascii/functions'
import { utf8 } from './gen/std/string/functions'
import { none, some } from './gen/std/option/functions'
import { newUnsafeFromBytes } from './gen/sui/url/functions'
import { new_ as newUid, idFromAddress } from './gen/sui/object/functions'
import { zero } from './gen/sui/balance/functions'
import { Balance } from './gen/sui/balance/structs'
import { extractType, phantom, ToField, ToJSON, ToTypeStr, vector } from './gen/_framework/reified'
import { SUI } from './gen/sui/sui/structs'
import { Option } from './gen/std/option/structs'
import { String as Utf8String } from './gen/std/string/structs'
import { String as AsciiString } from './gen/std/ascii/structs'
import { Url } from './gen/sui/url/structs'
import { ID, UID } from './gen/sui/object/structs'
import { loader } from './gen/_framework/loader'
import { sqrt } from './gen/sui/math/functions'
import {
  Action,
  ActionStop,
  ActionPause,
  ActionJump,
  isWrapped,
  Wrapped,
} from '../examples/gen/examples/enums/structs'
import { getOriginalId } from '../examples/gen/_envs'

const keypair = Ed25519Keypair.fromSecretKey(
  fromBase64('AMVT58FaLF2tJtg/g8X2z1/vG0FvNn0jvRu9X2Wl8F+u').slice(1)
) // address: 0x8becfafb14c111fc08adee6cc9afa95a863d1bf133f796626eec353f98ea8507

const client = new SuiClient({
  url: 'https://fullnode.testnet.sui.io:443/',
})

// SerialTransactionExecutor handles gas coin management to avoid conflicts in parallel tests
const executor = new SerialTransactionExecutor({
  client,
  signer: keypair,
})

afterAll(() => executor.resetCache())

// Helper to execute transaction and wait for object to be indexed
async function execTx(tx: Transaction) {
  const res = await executor.executeTransaction(tx, { showEffects: true })
  const id = res.data.effects!.created![0].reference.objectId
  // Wait briefly for object to be indexed on full node
  await client.waitForTransaction({ digest: res.digest, pollInterval: 200 })
  return { id, res }
}

it.concurrent('creates and decodes an object with object as type param', async () => {
  const tx = new Transaction()

  const T = Bar.$typeName

  const genericVecNested = [
    createWithTwoGenerics(tx, [T, 'u8'], {
      genericField1: createBar(tx, 100n),
      genericField2: 1,
    }),
  ]

  const twoGenericsNested = createWithTwoGenerics(tx, [T, `${WithTwoGenerics.$typeName}<u8, u8>`], {
    genericField1: createBar(tx, 100n),
    genericField2: createWithTwoGenerics(tx, ['u8', 'u8'], {
      genericField1: 1,
      genericField2: 2,
    }),
  })

  const twoGenericsReifiedNested = createWithTwoGenerics(
    tx,
    [Bar.$typeName, `${WithTwoGenerics.$typeName}<u8, u8>`],
    {
      genericField1: createBar(tx, 100n),
      genericField2: createWithTwoGenerics(tx, ['u8', 'u8'], {
        genericField1: 1,
        genericField2: 2,
      }),
    }
  )

  const twoGenericsNestedVec = [
    createWithTwoGenerics(tx, [Bar.$typeName, `vector<${WithTwoGenerics.$typeName}<${T}, u8>>`], {
      genericField1: createBar(tx, 100n),
      genericField2: [
        createWithTwoGenerics(tx, [Bar.$typeName, 'u8'], {
          genericField1: createBar(tx, 100n),
          genericField2: 1,
        }),
      ],
    }),
  ]

  createFoo(tx, [T, Bar.$typeName], {
    generic: createBar(tx, 100n),
    reifiedPrimitiveVec: [1n, 2n, 3n],
    reifiedObjectVec: [createBar(tx, 100n)],
    genericVec: [createBar(tx, 100n)],
    genericVecNested,
    twoGenerics: createWithTwoGenerics(tx, [T, Bar.$typeName], {
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
    twoGenericsNested,
    twoGenericsReifiedNested,
    twoGenericsNestedVec,
    objRef: createBar(tx, 100n),
  })

  const { id } = await execTx(tx)

  const foo = await client.getObject({
    id,
    options: {
      showBcs: true,
      showContent: true,
    },
  })

  if (foo.data?.bcs?.dataType !== 'moveObject' || foo.data?.content?.dataType !== 'moveObject') {
    throw new Error(`not a moveObject`)
  }

  const exp = Foo.r(Bar.reified()).new({
    id,
    generic: Bar.r.new({ value: 100n }),
    reifiedPrimitiveVec: [1n, 2n, 3n],
    reifiedObjectVec: [Bar.r.new({ value: 100n })],
    genericVec: [Bar.r.new({ value: 100n })],
    genericVecNested: [
      WithTwoGenerics.r(Bar.reified(), 'u8').new({
        genericField1: Bar.r.new({ value: 100n }),
        genericField2: 1,
      }),
    ],
    twoGenerics: WithTwoGenerics.r(Bar.reified(), Bar.reified()).new({
      genericField1: Bar.r.new({ value: 100n }),
      genericField2: Bar.r.new({ value: 100n }),
    }),
    twoGenericsReifiedPrimitive: WithTwoGenerics.r('u16', 'u64').new({
      genericField1: 1,
      genericField2: 2n,
    }),
    twoGenericsReifiedObject: WithTwoGenerics.r(Bar.reified(), Bar.reified()).new({
      genericField1: Bar.r.new({ value: 100n }),
      genericField2: Bar.r.new({ value: 100n }),
    }),
    twoGenericsNested: WithTwoGenerics.r(Bar.reified(), WithTwoGenerics.reified('u8', 'u8')).new({
      genericField1: Bar.r.new({ value: 100n }),
      genericField2: WithTwoGenerics.r('u8', 'u8').new({
        genericField1: 1,
        genericField2: 2,
      }),
    }),
    twoGenericsReifiedNested: WithTwoGenerics.r(
      Bar.reified(),
      WithTwoGenerics.reified('u8', 'u8')
    ).new({
      genericField1: Bar.r.new({ value: 100n }),
      genericField2: WithTwoGenerics.r('u8', 'u8').new({
        genericField1: 1,
        genericField2: 2,
      }),
    }),
    twoGenericsNestedVec: [
      WithTwoGenerics.r(Bar.reified(), vector(WithTwoGenerics.reified(Bar.reified(), 'u8'))).new({
        genericField1: Bar.r.new({ value: 100n }),
        genericField2: [
          WithTwoGenerics.r(Bar.reified(), 'u8').new({
            genericField1: Bar.r.new({ value: 100n }),
            genericField2: 1,
          }),
        ],
      }),
    ],
    dummy: Dummy.r.new({ dummyField: false }),
    other: StructFromOtherModule.r.new({ dummyField: false }),
  })

  const de = Foo.fromBcs(Bar.reified(), fromBase64(foo.data.bcs.bcsBytes))

  expect(de).toEqual(exp)
  expect(Foo.fromFieldsWithTypes(Bar.reified(), foo.data.content)).toEqual(exp)
  expect(Foo.fromSuiParsedData(Bar.reified(), foo.data.content)).toEqual(exp)
  expect(await Foo.fetch(client, Bar.reified(), id)).toEqual(exp)
  expect(Foo.fromJSON(Bar.reified(), de.toJSON())).toEqual(exp)
})

it.concurrent('creates and decodes Foo with vector of objects as type param', async () => {
  const tx = new Transaction()

  const T = `vector<${Bar.$typeName}>`
  const reifiedT = vector(Bar.reified())

  function createT(tx: Transaction, value: bigint) {
    return tx.makeMoveVec({
      elements: [createBar(tx, value)],
      type: Bar.$typeName,
    })
  }

  const genericVecNested = [
    createWithTwoGenerics(tx, [T, 'u8'], {
      genericField1: [createBar(tx, 100n)],
      genericField2: 1,
    }),
  ]

  const twoGenericsNested = createWithTwoGenerics(tx, [T, `${WithTwoGenerics.$typeName}<u8, u8>`], {
    genericField1: [createBar(tx, 100n)],
    genericField2: createWithTwoGenerics(tx, ['u8', 'u8'], {
      genericField1: 1,
      genericField2: 2,
    }),
  })

  const twoGenericsReifiedNested = createWithTwoGenerics(
    tx,
    [Bar.$typeName, `${WithTwoGenerics.$typeName}<u8, u8>`],
    {
      genericField1: createBar(tx, 100n),
      genericField2: createWithTwoGenerics(tx, ['u8', 'u8'], {
        genericField1: 1,
        genericField2: 2,
      }),
    }
  )

  const twoGenericsNestedVec = [
    createWithTwoGenerics(tx, [Bar.$typeName, `vector<${WithTwoGenerics.$typeName}<${T}, u8>>`], {
      genericField1: createBar(tx, 100n),
      genericField2: [
        createWithTwoGenerics(tx, [T, 'u8'], {
          genericField1: createT(tx, 100n), // or [createBar(tx, 100n)],
          genericField2: 1,
        }),
      ],
    }),
  ]

  createFoo(tx, [T, Bar.$typeName], {
    generic: createT(tx, 100n), // or [createBar(tx, 100n)]
    reifiedPrimitiveVec: [1n, 2n, 3n],
    reifiedObjectVec: [createBar(tx, 100n)],
    genericVec: [createT(tx, 100n)],
    genericVecNested,
    twoGenerics: createWithTwoGenerics(tx, [T, Bar.$typeName], {
      genericField1: [createBar(tx, 100n), createBar(tx, 100n)],
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
    twoGenericsNested,
    twoGenericsReifiedNested,
    twoGenericsNestedVec,
    objRef: createBar(tx, 100n),
  })

  const { id } = await execTx(tx)

  const foo = await client.getObject({
    id,
    options: {
      showBcs: true,
      showContent: true,
    },
  })

  if (foo.data?.bcs?.dataType !== 'moveObject' || foo.data?.content?.dataType !== 'moveObject') {
    throw new Error(`not a moveObject`)
  }

  const exp = Foo.r(reifiedT).new({
    id: id,
    generic: [Bar.r.new({ value: 100n })],
    reifiedPrimitiveVec: [1n, 2n, 3n],
    reifiedObjectVec: [Bar.r.new({ value: 100n })],
    genericVec: [[Bar.r.new({ value: 100n })]],
    genericVecNested: [
      WithTwoGenerics.r(reifiedT, 'u8').new({
        genericField1: [Bar.r.new({ value: 100n })],
        genericField2: 1,
      }),
    ],
    twoGenerics: WithTwoGenerics.r(reifiedT, Bar.reified()).new({
      genericField1: [Bar.r.new({ value: 100n }), Bar.r.new({ value: 100n })],
      genericField2: Bar.r.new({ value: 100n }),
    }),
    twoGenericsReifiedPrimitive: WithTwoGenerics.r('u16', 'u64').new({
      genericField1: 1,
      genericField2: 2n,
    }),
    twoGenericsReifiedObject: WithTwoGenerics.r(Bar.reified(), Bar.reified()).new({
      genericField1: Bar.r.new({ value: 100n }),
      genericField2: Bar.r.new({ value: 100n }),
    }),
    twoGenericsNested: WithTwoGenerics.r(reifiedT, WithTwoGenerics.reified('u8', 'u8')).new({
      genericField1: [Bar.r.new({ value: 100n })],
      genericField2: WithTwoGenerics.r('u8', 'u8').new({
        genericField1: 1,
        genericField2: 2,
      }),
    }),
    twoGenericsReifiedNested: WithTwoGenerics.r(
      Bar.reified(),
      WithTwoGenerics.reified('u8', 'u8')
    ).new({
      genericField1: Bar.r.new({ value: 100n }),
      genericField2: WithTwoGenerics.r('u8', 'u8').new({
        genericField1: 1,
        genericField2: 2,
      }),
    }),
    twoGenericsNestedVec: [
      WithTwoGenerics.r(Bar.reified(), vector(WithTwoGenerics.reified(reifiedT, 'u8'))).new({
        genericField1: Bar.r.new({ value: 100n }),
        genericField2: [
          WithTwoGenerics.r(reifiedT, 'u8').new({
            genericField1: [Bar.r.new({ value: 100n })],
            genericField2: 1,
          }),
        ],
      }),
    ],
    dummy: Dummy.r.new({ dummyField: false }),
    other: StructFromOtherModule.r.new({ dummyField: false }),
  })

  const de = Foo.fromBcs(reifiedT, fromBase64(foo.data.bcs.bcsBytes))

  expect(de).toEqual(exp)

  expect(Foo.fromFieldsWithTypes(reifiedT, foo.data.content)).toEqual(exp)
  expect(Foo.fromJSON(reifiedT, de.toJSON())).toEqual(exp)
})

it.concurrent('decodes special-cased types correctly', async () => {
  const tx = new Transaction()

  const encoder = new TextEncoder()

  const typeArgs = ['0x2::sui::SUI', 'u64'] as [string, string]
  const reifiedArgs = [SUI.p, 'u64'] as const

  createSpecial(tx, typeArgs, {
    string: utf8(tx, Array.from(encoder.encode('string'))),
    asciiString: string(tx, Array.from(encoder.encode('ascii'))),
    url: newUnsafeFromBytes(tx, Array.from(encoder.encode('https://example.com'))),
    idField: idFromAddress(tx, 'faf60f9f9d1f6c490dce8673c1371b9df456e0c183f38524e5f78d959ea559a5'),
    uid: newUid(tx),
    balance: zero(tx, '0x2::sui::SUI'),
    option: some(tx, 'u64', 100n),
    optionObj: some(tx, Bar.$typeName, createBar(tx, 100n)),
    optionNone: none(tx, 'u64'),
    balanceGeneric: zero(tx, '0x2::sui::SUI'),
    optionGeneric: some(tx, 'u64', 200n),
    optionGenericNone: none(tx, 'u64'),
  })

  const { id } = await execTx(tx)

  const obj = await client.getObject({
    id,
    options: {
      showBcs: true,
      showContent: true,
    },
  })

  if (obj.data?.bcs?.dataType !== 'moveObject' || obj.data?.content?.dataType !== 'moveObject') {
    throw new Error(`not a moveObject`)
  }

  const fromBcs = WithSpecialTypes.r(...reifiedArgs).fromBcs(fromBase64(obj.data.bcs.bcsBytes))
  const fromFieldsWithTypes = WithSpecialTypes.r(...reifiedArgs).fromFieldsWithTypes(
    obj.data.content
  )

  const uid = (obj.data.content.fields as { uid: { id: string } }).uid.id

  const exp = WithSpecialTypes.r(...reifiedArgs).new({
    id,
    string: 'string',
    asciiString: 'ascii',
    url: 'https://example.com',
    idField: '0xfaf60f9f9d1f6c490dce8673c1371b9df456e0c183f38524e5f78d959ea559a5',
    uid,
    balance: Balance.r(SUI.p).new({ value: 0n }),
    option: 100n,
    optionObj: Bar.r.new({ value: 100n }),
    optionNone: null,
    balanceGeneric: Balance.r(SUI.p).new({ value: 0n }),
    optionGeneric: 200n,
    optionGenericNone: null,
  })

  expect(fromFieldsWithTypes).toEqual(exp)
  expect(fromBcs).toEqual(exp)
  expect(WithSpecialTypes.r(...reifiedArgs).fromJSON(exp.toJSON())).toEqual(exp)
})

it.concurrent('decodes special-cased types as generics correctly', async () => {
  const tx = new Transaction()

  const encoder = new TextEncoder()

  const typeArgs = [
    '0x1::string::String',
    '0x1::ascii::String',
    '0x2::url::Url',
    '0x2::object::ID',
    '0x2::object::UID',
    '0x2::balance::Balance<0x2::sui::SUI>',
    '0x1::option::Option<u64>',
    '0x1::option::Option<u64>',
  ] as [string, string, string, string, string, string, string, string]
  const reifiedArgs = [
    Utf8String.reified(),
    AsciiString.reified(),
    Url.reified(),
    ID.reified(),
    UID.reified(),
    Balance.reified(SUI.p),
    Option.reified('u64'),
    Option.reified('u64'),
  ] as const

  createSpecialAsGenerics(tx, typeArgs, {
    string: utf8(tx, Array.from(encoder.encode('string'))),
    asciiString: string(tx, Array.from(encoder.encode('ascii'))),
    url: newUnsafeFromBytes(tx, Array.from(encoder.encode('https://example.com'))),
    idField: idFromAddress(tx, 'faf60f9f9d1f6c490dce8673c1371b9df456e0c183f38524e5f78d959ea559a5'),
    uid: newUid(tx),
    balance: zero(tx, '0x2::sui::SUI'),
    option: some(tx, 'u64', 100n),
    optionNone: none(tx, 'u64'),
  })

  const { id } = await execTx(tx)

  const obj = await client.getObject({
    id,
    options: {
      showBcs: true,
      showContent: true,
    },
  })

  if (obj.data?.bcs?.dataType !== 'moveObject' || obj.data?.content?.dataType !== 'moveObject') {
    throw new Error(`not a moveObject`)
  }

  const uid = (obj.data.content.fields as { uid: { id: string } }).uid.id

  const fromBcs = WithSpecialTypesAsGenerics.r(...reifiedArgs).fromBcs(
    fromBase64(obj.data.bcs.bcsBytes)
  )
  const fromFieldsWithTypes = WithSpecialTypesAsGenerics.r(...reifiedArgs).fromFieldsWithTypes(
    obj.data.content
  )

  const exp = WithSpecialTypesAsGenerics.r(...reifiedArgs).new({
    id,
    string: 'string',
    asciiString: 'ascii',
    url: 'https://example.com',
    idField: '0xfaf60f9f9d1f6c490dce8673c1371b9df456e0c183f38524e5f78d959ea559a5',
    uid,
    balance: Balance.r(SUI.p).new({ value: 0n }),
    option: 100n,
    optionNone: null,
  })

  expect(fromBcs).toEqual(exp)
  expect(fromFieldsWithTypes).toEqual(exp)
  expect(WithSpecialTypesAsGenerics.r(...reifiedArgs).fromJSON(exp.toJSON())).toEqual(exp)
})

it.concurrent('calls function correctly when special types are used', async () => {
  const tx = new Transaction()

  const encoder = new TextEncoder()

  const reifiedArgs = [
    SUI.p,
    vector(Option.reified(Option.reified(vector(vector('u64'))))),
  ] as const

  createSpecial(
    tx,
    ['0x2::sui::SUI', 'vector<0x1::option::Option<0x1::option::Option<vector<vector<u64>>>>>'],
    {
      string: 'string',
      asciiString: 'ascii',
      url: newUnsafeFromBytes(tx, Array.from(encoder.encode('https://example.com'))),
      idField: idFromAddress(
        tx,
        '0xfaf60f9f9d1f6c490dce8673c1371b9df456e0c183f38524e5f78d959ea559a5'
      ),
      uid: newUid(tx),
      balance: zero(tx, '0x2::sui::SUI'),
      option: 100n,
      optionObj: some(tx, Bar.$typeName, createBar(tx, 100n)),
      optionNone: null,
      balanceGeneric: zero(tx, '0x2::sui::SUI'),
      optionGeneric: [[[200n, 300n]], null, [[400n, 500n]]],
      optionGenericNone: null,
    }
  )

  const { id } = await execTx(tx)

  const obj = await client.getObject({
    id,
    options: {
      showBcs: true,
      showContent: true,
    },
  })

  if (obj.data?.bcs?.dataType !== 'moveObject' || obj.data?.content?.dataType !== 'moveObject') {
    throw new Error(`not a moveObject`)
  }

  expect(WithSpecialTypes.fromFieldsWithTypes([SUI.p, reifiedArgs[1]], obj.data.content)).toEqual(
    WithSpecialTypes.r(SUI.p, reifiedArgs[1]).new({
      id,
      string: 'string',
      asciiString: 'ascii',
      url: 'https://example.com',
      idField: '0xfaf60f9f9d1f6c490dce8673c1371b9df456e0c183f38524e5f78d959ea559a5',
      uid: (obj.data.content.fields as { uid: { id: string } }).uid.id,
      balance: Balance.r(SUI.p).new({ value: 0n }),
      option: 100n,
      optionObj: Bar.r.new({ value: 100n }),
      optionNone: null,
      balanceGeneric: Balance.r(SUI.p).new({ value: 0n }),
      optionGeneric: [[[200n, 300n]], null, [[400n, 500n]]],
      optionGenericNone: null,
    })
  )
})

it.concurrent('calls function correctly when special types are used as generics', async () => {
  const tx = new Transaction()

  const encoder = new TextEncoder()

  const reifiedArgs = [
    Utf8String.reified(),
    AsciiString.reified(),
    Url.reified(),
    ID.reified(),
    UID.reified(),
    Balance.reified(SUI.p),
    Option.reified(vector(Option.reified('u64'))),
    Option.reified('u64'),
  ] as const

  createSpecialAsGenerics(
    tx,
    [
      '0x1::string::String',
      '0x1::ascii::String',
      '0x2::url::Url',
      '0x2::object::ID',
      '0x2::object::UID',
      '0x2::balance::Balance<0x2::sui::SUI>',
      '0x1::option::Option<vector<0x1::option::Option<u64>>>',
      '0x1::option::Option<u64>',
    ],
    {
      string: 'string',
      asciiString: 'ascii',
      url: newUnsafeFromBytes(tx, Array.from(encoder.encode('https://example.com'))),
      idField: idFromAddress(
        tx,
        '0xfaf60f9f9d1f6c490dce8673c1371b9df456e0c183f38524e5f78d959ea559a5'
      ),
      uid: newUid(tx),
      balance: zero(tx, '0x2::sui::SUI'),
      option: [5n, null, 3n],
      optionNone: null,
    }
  )

  const { id } = await execTx(tx)

  const obj = await client.getObject({
    id,
    options: {
      showBcs: true,
      showContent: true,
    },
  })

  if (obj.data?.bcs?.dataType !== 'moveObject' || obj.data?.content?.dataType !== 'moveObject') {
    throw new Error(`not a moveObject`)
  }

  expect(
    WithSpecialTypesAsGenerics.r(...reifiedArgs).fromFieldsWithTypes(obj.data.content)
  ).toEqual(
    WithSpecialTypesAsGenerics.r(...reifiedArgs).new({
      id,
      string: 'string',
      asciiString: 'ascii',
      url: 'https://example.com',
      idField: '0xfaf60f9f9d1f6c490dce8673c1371b9df456e0c183f38524e5f78d959ea559a5',
      uid: (obj.data.content.fields as { uid: { id: string } }).uid.id,
      balance: Balance.r(SUI.p).new({ value: 0n }),
      option: [5n, null, 3n],
      optionNone: null,
    })
  )
})

it.concurrent('calls function correctly when special types are used as as vectors', async () => {
  const tx = new Transaction()

  createSpecialInVectors(tx, 'vector<u64>', {
    string: ['string'],
    asciiString: ['ascii'],
    idField: ['0x0', '0x1'],
    bar: [createBar(tx, 100n)],
    option: [5n, 1n, 3n],
    optionGeneric: [[5n], null],
  })

  const { id } = await execTx(tx)

  const obj = await client.getObject({
    id,
    options: {
      showBcs: true,
      showContent: true,
    },
  })

  if (obj.data?.bcs?.dataType !== 'moveObject' || obj.data?.content?.dataType !== 'moveObject') {
    throw new Error(`not a moveObject`)
  }

  expect(WithSpecialTypesInVectors.fromFieldsWithTypes(vector('u64'), obj.data.content)).toEqual(
    WithSpecialTypesInVectors.r(vector('u64')).new({
      id,
      string: ['string'],
      asciiString: ['ascii'],
      idField: [
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000001',
      ],
      bar: [Bar.r.new({ value: 100n })],
      option: [5n, 1n, 3n],
      optionGeneric: [[5n], null],
    })
  )
})

it.concurrent('loads with loader correctly', async () => {
  const tx = new Transaction()

  const T = `${WithTwoGenerics.$typeName}<${Bar.$typeName}, vector<${WithTwoGenerics.$typeName}<${Bar.$typeName}, u8>>>`
  const tReified = WithTwoGenerics.reified(
    Bar.reified(),
    vector(WithTwoGenerics.reified(Bar.reified(), 'u8'))
  )

  const withTwoGenerics = createWithTwoGenerics(
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
  )
  createWithGenericField(tx, T, withTwoGenerics)

  const { id } = await execTx(tx)

  const obj = await client.getObject({
    id,
    options: {
      showBcs: true,
      showContent: true,
    },
  })
  if (obj.data?.bcs?.dataType !== 'moveObject' || obj.data?.content?.dataType !== 'moveObject') {
    throw new Error(`not a moveObject`)
  }

  const withGenericFieldReified = loader.reified(`${WithGenericField.$typeName}<${T}>`)

  expect(extractType(withGenericFieldReified)).toEqual(`${WithGenericField.$typeName}<${T}>`)

  const fromBcs = withGenericFieldReified.fromFieldsWithTypes(obj.data.content)
  expect(fromBcs).toEqual(
    WithGenericField.r(tReified).new({
      id,
      genericField: WithTwoGenerics.r(
        Bar.reified(),
        vector(WithTwoGenerics.reified(Bar.reified(), 'u8'))
      ).new({
        genericField1: Bar.r.new({ value: 100n }),
        genericField2: [
          WithTwoGenerics.r(Bar.reified(), 'u8').new({
            genericField1: Bar.r.new({ value: 100n }),
            genericField2: 1,
          }),
        ],
      }),
    })
  )
})

it('converts to json correctly', () => {
  const U = WithSpecialTypes.reified(SUI.p, 'u64')
  const V = vector(WithTwoGenerics.reified(Bar.reified(), 'u8'))

  const obj = WithTwoGenerics.r(U, V).new({
    genericField1: WithSpecialTypes.r(SUI.p, 'u64').new({
      id: '0x1',
      string: 'string',
      asciiString: 'ascii',
      url: 'https://example.com',
      idField: '0x2',
      uid: '0x3',
      balance: Balance.r(SUI.p).new({ value: 0n }),
      option: 100n,
      optionObj: Bar.r.new({ value: 100n }),
      optionNone: null,
      balanceGeneric: Balance.r(SUI.p).new({ value: 0n }),
      optionGeneric: 200n,
      optionGenericNone: null,
    }),
    genericField2: [
      WithTwoGenerics.r(Bar.reified(), 'u8').new({
        genericField1: Bar.r.new({ value: 100n }),
        genericField2: 1,
      }),
    ],
  })

  const pkgAddress = getOriginalId('examples')

  const exp: ReturnType<typeof obj.toJSON> = {
    $typeName: `${pkgAddress}::fixture::WithTwoGenerics`,
    $typeArgs: [
      `${pkgAddress}::fixture::WithSpecialTypes<0x2::sui::SUI, u64>`,
      `vector<${pkgAddress}::fixture::WithTwoGenerics<${pkgAddress}::fixture::Bar, u8>>`,
    ],
    genericField1: {
      id: '0x1',
      string: 'string',
      asciiString: 'ascii',
      url: 'https://example.com',
      idField: '0x2',
      uid: '0x3',
      balance: {
        value: '0',
      },
      option: '100',
      optionObj: {
        value: '100',
      },
      optionNone: null,
      balanceGeneric: {
        value: '0',
      },
      optionGeneric: '200',
      optionGenericNone: null,
    },
    genericField2: [
      {
        genericField1: {
          value: '100',
        },
        genericField2: 1,
      },
    ],
  }

  const resJSON = obj.toJSON()
  expect(resJSON).toEqual(exp)

  const fromJSON = WithTwoGenerics.fromJSON([U, V], resJSON)
  expect(fromJSON).toEqual(obj)
})

it.concurrent('decodes address field correctly', async () => {
  const tx = new Transaction()

  const T = 'address'

  const genericVecNested = [
    createWithTwoGenerics(tx, ['address', 'u8'], {
      genericField1: '0x999',
      genericField2: 1,
    }),
  ]

  const twoGenericsNested = createWithTwoGenerics(tx, [T, `${WithTwoGenerics.$typeName}<u8, u8>`], {
    genericField1: '0x111',
    genericField2: createWithTwoGenerics(tx, ['u8', 'u8'], {
      genericField1: 1,
      genericField2: 2,
    }),
  })

  const twoGenericsReifiedNested = createWithTwoGenerics(
    tx,
    [Bar.$typeName, `${WithTwoGenerics.$typeName}<u8, u8>`],
    {
      genericField1: createBar(tx, 100n),
      genericField2: createWithTwoGenerics(tx, ['u8', 'u8'], {
        genericField1: 1,
        genericField2: 2,
      }),
    }
  )

  const twoGenericsNestedVec = [
    createWithTwoGenerics(tx, [Bar.$typeName, `vector<${WithTwoGenerics.$typeName}<${T}, u8>>`], {
      genericField1: createBar(tx, 100n),
      genericField2: [
        createWithTwoGenerics(tx, ['address', 'u8'], {
          genericField1: '0x111',
          genericField2: 1,
        }),
      ],
    }),
  ]

  createFoo(tx, [T, Bar.$typeName], {
    generic: '0x123',
    reifiedPrimitiveVec: [1n, 2n, 3n],
    reifiedObjectVec: [createBar(tx, 100n)],
    genericVec: ['0x555'],
    genericVecNested,
    twoGenerics: createWithTwoGenerics(tx, ['address', Bar.$typeName], {
      genericField1: '0x111',
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
    twoGenericsNested,
    twoGenericsReifiedNested,
    twoGenericsNestedVec,
    objRef: createBar(tx, 100n),
  })

  const { id } = await execTx(tx)

  const foo = await client.getObject({
    id,
    options: {
      showBcs: true,
      showContent: true,
    },
  })

  if (foo.data?.bcs?.dataType !== 'moveObject' || foo.data?.content?.dataType !== 'moveObject') {
    throw new Error(`not a moveObject`)
  }

  const exp = Foo.r('address').new({
    id,
    generic: '0x0000000000000000000000000000000000000000000000000000000000000123',
    reifiedPrimitiveVec: [1n, 2n, 3n],
    reifiedObjectVec: [Bar.r.new({ value: 100n })],
    genericVec: ['0x0000000000000000000000000000000000000000000000000000000000000555'],
    genericVecNested: [
      WithTwoGenerics.r('address', 'u8').new({
        genericField1: '0x0000000000000000000000000000000000000000000000000000000000000999',
        genericField2: 1,
      }),
    ],
    twoGenerics: WithTwoGenerics.r('address', Bar.reified()).new({
      genericField1: '0x0000000000000000000000000000000000000000000000000000000000000111',
      genericField2: Bar.r.new({ value: 100n }),
    }),
    twoGenericsReifiedPrimitive: WithTwoGenerics.r('u16', 'u64').new({
      genericField1: 1,
      genericField2: 2n,
    }),
    twoGenericsReifiedObject: WithTwoGenerics.r(Bar.reified(), Bar.reified()).new({
      genericField1: Bar.r.new({ value: 100n }),
      genericField2: Bar.r.new({ value: 100n }),
    }),
    twoGenericsNested: WithTwoGenerics.r('address', WithTwoGenerics.reified('u8', 'u8')).new({
      genericField1: '0x0000000000000000000000000000000000000000000000000000000000000111',
      genericField2: WithTwoGenerics.r('u8', 'u8').new({
        genericField1: 1,
        genericField2: 2,
      }),
    }),
    twoGenericsReifiedNested: WithTwoGenerics.r(
      Bar.reified(),
      WithTwoGenerics.reified('u8', 'u8')
    ).new({
      genericField1: Bar.r.new({ value: 100n }),
      genericField2: WithTwoGenerics.r('u8', 'u8').new({
        genericField1: 1,
        genericField2: 2,
      }),
    }),
    twoGenericsNestedVec: [
      WithTwoGenerics.r(Bar.reified(), vector(WithTwoGenerics.reified('address', 'u8'))).new({
        genericField1: Bar.r.new({ value: 100n }),
        genericField2: [
          WithTwoGenerics.r('address', 'u8').new({
            genericField1: '0x0000000000000000000000000000000000000000000000000000000000000111',
            genericField2: 1,
          }),
        ],
      }),
    ],
    dummy: Dummy.r.new({ dummyField: false }),
    other: StructFromOtherModule.r.new({ dummyField: false }),
  })

  expect(Foo.fromBcs('address', fromBase64(foo.data.bcs.bcsBytes))).toEqual(exp)
  expect(Foo.fromFieldsWithTypes('address', foo.data.content)).toEqual(exp)
  expect(Foo.fromSuiParsedData('address', foo.data.content)).toEqual(exp)
  expect(await Foo.fetch(client, 'address', id)).toEqual(exp)

  const de = Foo.fromFieldsWithTypes('address', foo.data.content)
  expect(Foo.fromJSON('address', de.toJSON())).toEqual(exp)
})

it.concurrent('fails when fetching mismatch reified type', async () => {
  const tx = new Transaction()

  const encoder = new TextEncoder()
  const typeArgs = ['0x2::sui::SUI', 'u64'] as [string, string]

  createSpecial(tx, typeArgs, {
    string: utf8(tx, Array.from(encoder.encode('string'))),
    asciiString: string(tx, Array.from(encoder.encode('ascii'))),
    url: newUnsafeFromBytes(tx, Array.from(encoder.encode('https://example.com'))),
    idField: idFromAddress(tx, 'faf60f9f9d1f6c490dce8673c1371b9df456e0c183f38524e5f78d959ea559a5'),
    uid: newUid(tx),
    balance: zero(tx, '0x2::sui::SUI'),
    option: some(tx, 'u64', 100n),
    optionObj: some(tx, Bar.$typeName, createBar(tx, 100n)),
    optionNone: none(tx, 'u64'),
    balanceGeneric: zero(tx, '0x2::sui::SUI'),
    optionGeneric: some(tx, 'u64', 200n),
    optionGenericNone: none(tx, 'u64'),
  })

  const { id } = await execTx(tx)

  await expect(() => {
    return WithSpecialTypes.r(phantom('u8'), 'u8').fetch(client, id)
  }).rejects.toThrowError(
    `type argument mismatch at position 0: expected 'u8' but got '0x2::sui::SUI'`
  )
  await expect(() => {
    return WithSpecialTypes.r(SUI.p, 'u8').fetch(client, id)
  }).rejects.toThrowError(`type argument mismatch at position 1: expected 'u8' but got 'u64'`)
})

describe.concurrent('handles function calls with vector arguments correctly', () => {
  it('can pass in tx.pure values', async () => {
    const tx = new Transaction()

    createWithGenericField(tx, 'vector<u8>', [tx.pure.u8(3), tx.pure.u8(4)])
    const { id } = await execTx(tx)
    const obj = await WithGenericField.r(vector('u8')).fetch(client, id)
    expect(obj.genericField).toEqual([3, 4])
  })

  it('can pass in primitive values', async () => {
    const tx = new Transaction()

    createWithGenericField(tx, 'vector<u8>', [3, 4])
    const { id } = await execTx(tx)
    const obj = await WithGenericField.r(vector('u8')).fetch(client, id)
    expect(obj.genericField).toEqual([3, 4])
  })

  it('throws when mixing primitive and TransactionArgument values', async () => {
    const tx = new Transaction()

    expect(() => {
      createWithGenericField(tx, 'vector<u8>', [3, tx.pure.u8(4)])
    }).toThrowError('mixing primitive and TransactionArgument values is not supported')
  })

  it('can pass in mixed tx.pure and command result values', async () => {
    const tx = new Transaction()

    const val = sqrt(tx, 36n)
    createWithGenericField(tx, 'vector<u64>', [tx.pure.u64(3), val])

    const { id } = await execTx(tx)
    const obj = await WithGenericField.r(vector('u64')).fetch(client, id)
    expect(obj.genericField).toEqual([3n, 6n])
  })

  it('throws when mixing primitive and command result values', async () => {
    const tx = new Transaction()
    const val = sqrt(tx, 36n)
    expect(() => {
      createWithGenericField(tx, 'vector<u64>', [3, val])
    }).toThrowError('mixing primitive and TransactionArgument values is not supported')
  })

  it('can use intents as values and can mix with tx.pure', async () => {
    const tx = new Transaction()

    const intent1 = (tx: Transaction) => tx.pure.u8(3)
    const intent2 = (tx: Transaction) => tx.pure.u8(4)

    createWithGenericField(tx, 'vector<u8>', [intent1(tx), intent2(tx), tx.pure.u8(7)])

    const { id } = await execTx(tx)
    const obj = await WithGenericField.r(vector('u8')).fetch(client, id)
    expect(obj.genericField).toEqual([3, 4, 7])
  })

  it('throws when mixing primitive and intent values', async () => {
    const tx = new Transaction()

    const intent = (tx: Transaction) => tx.pure.u8(3)
    expect(() => {
      createWithGenericField(tx, 'vector<u8>', [3, intent(tx)])
    }).toThrowError('mixing primitive and TransactionArgument values is not supported')
  })
})

describe.concurrent('handles function calls with option arguments correctly', () => {
  it('can use primitive value as option directly', async () => {
    const tx = new Transaction()

    createWithGenericField(tx, `${Option.$typeName}<u8>`, 3)
    const { id } = await execTx(tx)
    const obj = await WithGenericField.r(Option.r('u8')).fetch(client, id)
    expect(obj.genericField).toEqual(3)
  })

  it('can pass in tx.pure values', async () => {
    const tx = new Transaction()

    createWithGenericField(tx, `${Option.$typeName}<vector<u8>>`, [tx.pure.u8(3), tx.pure.u8(4)])
    const { id } = await execTx(tx)
    const obj = await WithGenericField.r(Option.r(vector('u8'))).fetch(client, id)
    expect(obj.genericField).toEqual([3, 4])
  })

  it('throws when mixing primitive and TransactionArgument values', async () => {
    const tx = new Transaction()

    expect(() => {
      createWithGenericField(tx, `${Option.$typeName}<vector<u8>>`, [3, tx.pure.u8(4)])
    }).toThrowError('mixing primitive and TransactionArgument values is not supported')
  })

  it('can use none function call result as a value', async () => {
    const tx = new Transaction()

    createWithGenericField(tx, `${Option.$typeName}<u8>`, none(tx, 'u8'))
    const { id } = await execTx(tx)
    const obj = await WithGenericField.r(Option.r('u8')).fetch(client, id)
    expect(obj.genericField).toEqual(null)
  })

  it('can use null as values', async () => {
    const tx = new Transaction()

    createWithGenericField(tx, `${Option.$typeName}<u8>`, null)
    const { id } = await execTx(tx)
    const obj = await WithGenericField.r(Option.r('u8')).fetch(client, id)
    expect(obj.genericField).toEqual(null)
  })

  it('handles nested vector of options as inner type correctly', async () => {
    const tx = new Transaction()

    createWithGenericField(tx, `${Option.$typeName}<vector<${Option.$typeName}<u8>>>`, [3, null, 4])
    const { id } = await execTx(tx)
    const obj = await WithGenericField.r(Option.r(vector(Option.r('u8')))).fetch(client, id)
    expect(obj.genericField).toEqual([3, null, 4])
  })
})

it.concurrent('handles enums correctly', async () => {
  const id = '0x867aff39fede0ba58effd5d9fec74184503391321cf72ff5df5c631824b2c75a'

  // Setup reified types
  const actionReified = Action.r('u64', SUI.p)
  const wrappedReified = Wrapped.r(actionReified, actionReified, actionReified)
  const zeroBalance = Balance.r(SUI.p).new({ value: 0n })

  // Build expected object with all enum variants
  const exp = wrappedReified.new({
    id,
    t: actionReified.new('Stop', {}),
    u: actionReified.new('Pause', {
      duration: 100,
      genericField: 101n,
      phantomField: zeroBalance,
      reifiedField: 102n,
    }),
    v: actionReified.new('Jump', [103n, 104n, zeroBalance, 105n]),
    stop: actionReified.new('Stop', {}),
    pause: actionReified.new('Pause', {
      duration: 106,
      genericField: 107n,
      phantomField: zeroBalance,
      reifiedField: 108n,
    }),
    jump: actionReified.new('Jump', [109n, 110n, zeroBalance, 111n]),
  })

  // Fetch object from chain
  const res = await client.getObject({
    id,
    options: { showBcs: true, showContent: true },
  })

  // Decode from BCS
  if (res.data?.bcs?.dataType !== 'moveObject' || !isWrapped(res.data.bcs.type)) {
    throw new Error(`object at id ${id} is not a Wrapped object`)
  }
  const fromBcs = wrappedReified.fromBcs(fromBase64(res.data.bcs.bcsBytes))
  expect(fromBcs).toEqual(exp)

  // Decode from parsed data (fields with types)
  if (res.data?.content?.dataType !== 'moveObject' || !isWrapped(res.data.content.type)) {
    throw new Error(`object at id ${id} is not a Wrapped object`)
  }
  const fromFields = wrappedReified.fromSuiParsedData(res.data.content)
  expect(fromFields).toEqual(exp)

  // Serialize to JSON
  const asJSON = exp.toJSON()
  expect(asJSON).toEqual({
    $typeName: Wrapped.$typeName,
    $typeArgs: exp.$typeArgs,
    id,
    t: { $kind: 'Stop' },
    u: {
      $kind: 'Pause',
      duration: 100,
      genericField: '101',
      phantomField: { value: '0' },
      reifiedField: '102',
    },
    v: {
      $kind: 'Jump',
      vec: ['103', '104', { value: '0' }, '105'],
    },
    stop: { $kind: 'Stop' },
    pause: {
      $kind: 'Pause',
      duration: 106,
      genericField: '107',
      phantomField: { value: '0' },
      reifiedField: '108',
    },
    jump: {
      $kind: 'Jump',
      vec: ['109', '110', { value: '0' }, '111'],
    },
  })

  // Deserialize from JSON
  const fromJSON = wrappedReified.fromJSON(asJSON)
  expect(fromJSON).toEqual(exp)
})

// Type-level tests for JSON types using vitest's expectTypeOf
// These verify at compile-time that the generated types are correct.
// If any type is wrong, TypeScript will error during `pnpm check`.
describe('JSON type definitions (compile-time checks)', () => {
  it('should have correct types for simple struct toJSON()', () => {
    const dummy = Dummy.r.new({ dummyField: true })
    const json = dummy.toJSON()

    // Verify individual field types
    expectTypeOf(json.$typeName).toEqualTypeOf<typeof Dummy.$typeName>()
    expectTypeOf(json.$typeArgs).toEqualTypeOf<[]>()
    expectTypeOf(json.dummyField).toEqualTypeOf<boolean>()

    expect(json.dummyField).toBe(true)
  })

  it('should have correct types for struct with value field (u64 → string)', () => {
    const bar = Bar.r.new({ value: 100n })
    const json = bar.toJSON()

    // Bar has a u64 field which serializes to string
    expectTypeOf(json.$typeName).toEqualTypeOf<typeof Bar.$typeName>()
    expectTypeOf(json.$typeArgs).toEqualTypeOf<[]>()
    expectTypeOf(json.value).toEqualTypeOf<string>() // u64 → string in JSON

    expect(json.value).toBe('100')
  })

  it('should have correct types for generic struct with concrete types', () => {
    const obj = WithTwoGenerics.reified(Bar.reified(), 'u8').new({
      genericField1: Bar.r.new({ value: 100n }),
      genericField2: 42,
    })
    const json = obj.toJSON()

    // Verify nested struct field has correct shape (Bar → { value: string })
    expectTypeOf(json.genericField1.value).toEqualTypeOf<string>()
    // Verify primitive field has correct type (u8 → number)
    expectTypeOf(json.genericField2).toEqualTypeOf<number>()

    expect(json.genericField1.value).toBe('100')
    expect(json.genericField2).toBe(42)
  })

  it('should have correct types for toJSONField() with exact shape', () => {
    const bar = Bar.r.new({ value: 100n })
    const field = bar.toJSONField()

    // toJSONField() returns just the fields, no $typeName/$typeArgs
    expectTypeOf(field.value).toEqualTypeOf<string>()

    expect(field.value).toBe('100')
  })

  it('should have correct types for generic struct toJSONField()', () => {
    const obj = WithGenericField.reified(Bar.reified()).new({
      id: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      genericField: Bar.r.new({ value: 200n }),
    })
    const field = obj.toJSONField()

    // Verify exact field types
    expectTypeOf(field.id).toEqualTypeOf<string>() // UID → string
    expectTypeOf(field.genericField.value).toEqualTypeOf<string>() // Bar.value → string

    expect(field.genericField.value).toBe('200')
  })

  it('should handle nested generics with correct nested types', () => {
    const inner = WithTwoGenerics.reified(Bar.reified(), 'u8').new({
      genericField1: Bar.r.new({ value: 50n }),
      genericField2: 10,
    })
    const outer = WithTwoGenerics.reified(WithTwoGenerics.reified(Bar.reified(), 'u8'), 'u16').new({
      genericField1: inner,
      genericField2: 20,
    })

    const json = outer.toJSON()

    // Nested structure: outer.genericField1 is WithTwoGenerics<Bar, 'u8'>
    expectTypeOf(json.genericField1.genericField1.value).toEqualTypeOf<string>() // Bar.value → string
    expectTypeOf(json.genericField1.genericField2).toEqualTypeOf<number>() // u8 → number
    expectTypeOf(json.genericField2).toEqualTypeOf<number>() // u16 → number

    expect(json.genericField1.genericField1.value).toBe('50')
    expect(json.genericField1.genericField2).toBe(10)
    expect(json.genericField2).toBe(20)
  })

  it('should have correct array types for vectors', () => {
    const bars = [Bar.r.new({ value: 1n }), Bar.r.new({ value: 2n }), Bar.r.new({ value: 3n })]

    const jsonBars = bars.map(b => b.toJSONField())

    // Array elements should have value: string
    expectTypeOf(jsonBars[0].value).toEqualTypeOf<string>()

    expect(jsonBars.map(j => j.value)).toEqual(['1', '2', '3'])
  })

  it('should serialize primitive types correctly', () => {
    // Test all primitive JSON mappings using values
    const boolVal = true as ToJSON<'bool'>
    const u8Val = 1 as ToJSON<'u8'>
    const u64Val = '1' as ToJSON<'u64'>
    const addressVal = '0x1' as ToJSON<'address'>

    expectTypeOf(boolVal).toEqualTypeOf<boolean>()
    expectTypeOf(u8Val).toEqualTypeOf<number>()
    expectTypeOf(u64Val).toEqualTypeOf<string>() // Large ints → string
    expectTypeOf(addressVal).toEqualTypeOf<string>()
  })
})

// ============================================================================
// Special Types JSON Tests
// ============================================================================
describe('Special types JSON serialization (compile-time checks)', () => {
  it('should serialize all special type fields to string', () => {
    // Create a WithSpecialTypes instance to test field types
    const obj = WithSpecialTypes.reified(SUI.phantom(), Bar.reified()).new({
      id: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      string: 'hello',
      asciiString: 'world',
      url: 'https://example.com',
      idField: '0xabcd',
      uid: '0x5678',
      balance: Balance.reified(SUI.phantom()).new({ value: 0n }),
      option: 123n,
      optionObj: Bar.r.new({ value: 456n }),
      optionNone: null,
      balanceGeneric: Balance.reified(SUI.phantom()).new({ value: 789n }),
      optionGeneric: Bar.r.new({ value: 101n }),
      optionGenericNone: null,
    })

    const json = obj.toJSONField()

    // All special types serialize to string
    expectTypeOf(json.id).toEqualTypeOf<string>() // UID → string
    expectTypeOf(json.string).toEqualTypeOf<string>() // String (UTF-8) → string
    expectTypeOf(json.asciiString).toEqualTypeOf<string>() // String (ASCII) → string
    expectTypeOf(json.url).toEqualTypeOf<string>() // Url → string
    expectTypeOf(json.idField).toEqualTypeOf<string>() // ID → string
    expectTypeOf(json.uid).toEqualTypeOf<string>() // UID → string
  })

  it('should serialize Balance to { value: string }', () => {
    const balance = Balance.reified(SUI.phantom()).new({ value: 1000n })
    const json = balance.toJSONField()

    expectTypeOf(json.value).toEqualTypeOf<string>() // u64 inside Balance → string

    expect(json.value).toBe('1000')
  })
})

// ============================================================================
// Option Type JSON Tests
// ============================================================================
describe('Option type JSON serialization (compile-time checks)', () => {
  it('should serialize Option<primitive> to primitive | null', () => {
    const obj = WithSpecialTypes.reified(SUI.phantom(), Bar.reified()).new({
      id: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      string: 'hello',
      asciiString: 'world',
      url: 'https://example.com',
      idField: '0xabcd',
      uid: '0x5678',
      balance: Balance.reified(SUI.phantom()).new({ value: 0n }),
      option: 123n, // Option<u64> with Some value
      optionObj: Bar.r.new({ value: 456n }),
      optionNone: null, // Option<u64> with None
      balanceGeneric: Balance.reified(SUI.phantom()).new({ value: 789n }),
      optionGeneric: Bar.r.new({ value: 101n }),
      optionGenericNone: null,
    })

    const json = obj.toJSONField()

    // Option<u64> → string | null (u64 serializes to string)
    expectTypeOf(json.option).toEqualTypeOf<string | null>()
    expectTypeOf(json.optionNone).toEqualTypeOf<string | null>()

    expect(json.option).toBe('123')
    expect(json.optionNone).toBe(null)
  })

  it('should serialize Option<struct> to JSONField | null', () => {
    const obj = WithSpecialTypes.reified(SUI.phantom(), Bar.reified()).new({
      id: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      string: 'hello',
      asciiString: 'world',
      url: 'https://example.com',
      idField: '0xabcd',
      uid: '0x5678',
      balance: Balance.reified(SUI.phantom()).new({ value: 0n }),
      option: 123n,
      optionObj: Bar.r.new({ value: 456n }), // Option<Bar> with Some value
      optionNone: null,
      balanceGeneric: Balance.reified(SUI.phantom()).new({ value: 789n }),
      optionGeneric: Bar.r.new({ value: 101n }),
      optionGenericNone: null,
    })

    const json = obj.toJSONField()

    // Option<Bar> → { value: string } | null
    // When Some, we can access the nested field
    if (json.optionObj !== null) {
      expectTypeOf(json.optionObj.value).toEqualTypeOf<string>()
    }

    expect(json.optionObj).toEqual({ value: '456' })
  })

  it('should serialize Option<generic T> with ToJSON<T> | null', () => {
    // When T = Bar
    const obj = WithSpecialTypes.reified(SUI.phantom(), Bar.reified()).new({
      id: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      string: 'hello',
      asciiString: 'world',
      url: 'https://example.com',
      idField: '0xabcd',
      uid: '0x5678',
      balance: Balance.reified(SUI.phantom()).new({ value: 0n }),
      option: 123n,
      optionObj: Bar.r.new({ value: 456n }),
      optionNone: null,
      balanceGeneric: Balance.reified(SUI.phantom()).new({ value: 789n }),
      optionGeneric: Bar.r.new({ value: 101n }), // Option<U> where U = Bar
      optionGenericNone: null,
    })

    const json = obj.toJSONField()

    // optionGeneric: ToJSON<U> | null, where U = Bar → { value: string } | null
    if (json.optionGeneric !== null) {
      expectTypeOf(json.optionGeneric.value).toEqualTypeOf<string>()
    }

    expect(json.optionGeneric).toEqual({ value: '101' })
    expect(json.optionGenericNone).toBe(null)
  })
})

// ============================================================================
// Vector Type JSON Tests
// ============================================================================
describe('Vector type JSON serialization (compile-time checks)', () => {
  it('should serialize Vector<String> to string[]', () => {
    const obj = WithSpecialTypesInVectors.reified(Bar.reified()).new({
      id: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      string: ['hello', 'world'],
      asciiString: ['foo', 'bar'],
      idField: ['0x1', '0x2'],
      bar: [Bar.r.new({ value: 1n }), Bar.r.new({ value: 2n })],
      option: [100n, null, 200n],
      optionGeneric: [Bar.r.new({ value: 3n }), null],
    })

    const json = obj.toJSONField()

    // Vector<String> → string[]
    expectTypeOf(json.string).toEqualTypeOf<string[]>()
    expectTypeOf(json.asciiString).toEqualTypeOf<string[]>()
    expectTypeOf(json.idField).toEqualTypeOf<string[]>()

    expect(json.string).toEqual(['hello', 'world'])
  })

  it('should serialize Vector<struct> to JSONField[]', () => {
    const obj = WithSpecialTypesInVectors.reified(Bar.reified()).new({
      id: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      string: ['hello'],
      asciiString: ['foo'],
      idField: ['0x1'],
      bar: [Bar.r.new({ value: 1n }), Bar.r.new({ value: 2n })],
      option: [100n],
      optionGeneric: [Bar.r.new({ value: 3n })],
    })

    const json = obj.toJSONField()

    // Vector<Bar> → { value: string }[]
    expectTypeOf(json.bar[0].value).toEqualTypeOf<string>()

    expect(json.bar).toEqual([{ value: '1' }, { value: '2' }])
  })

  it('should serialize Vector<Option<T>> to (T | null)[]', () => {
    const obj = WithSpecialTypesInVectors.reified(Bar.reified()).new({
      id: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      string: ['hello'],
      asciiString: ['foo'],
      idField: ['0x1'],
      bar: [Bar.r.new({ value: 1n })],
      option: [100n, null, 200n], // Vector<Option<u64>>
      optionGeneric: [Bar.r.new({ value: 3n }), null], // Vector<Option<Bar>>
    })

    const json = obj.toJSONField()

    // Vector<Option<u64>> → (string | null)[]
    expectTypeOf(json.option).toEqualTypeOf<(string | null)[]>()

    expect(json.option).toEqual(['100', null, '200'])
  })
})

// ============================================================================
// Complex Foo Structure JSON Tests
// ============================================================================
describe('Complex Foo structure JSON types (compile-time checks)', () => {
  it('should have correct types for Foo<Bar> fields', () => {
    const foo = Foo.reified(Bar.reified()).new({
      id: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      generic: Bar.r.new({ value: 1n }),
      reifiedPrimitiveVec: [1n, 2n, 3n],
      reifiedObjectVec: [Bar.r.new({ value: 10n })],
      genericVec: [Bar.r.new({ value: 20n })],
      genericVecNested: [
        WithTwoGenerics.reified(Bar.reified(), 'u8').new({
          genericField1: Bar.r.new({ value: 30n }),
          genericField2: 5,
        }),
      ],
      twoGenerics: WithTwoGenerics.reified(Bar.reified(), Bar.reified()).new({
        genericField1: Bar.r.new({ value: 40n }),
        genericField2: Bar.r.new({ value: 50n }),
      }),
      twoGenericsReifiedPrimitive: WithTwoGenerics.reified('u16', 'u64').new({
        genericField1: 100,
        genericField2: 200n,
      }),
      twoGenericsReifiedObject: WithTwoGenerics.reified(Bar.reified(), Bar.reified()).new({
        genericField1: Bar.r.new({ value: 60n }),
        genericField2: Bar.r.new({ value: 70n }),
      }),
      twoGenericsNested: WithTwoGenerics.reified(
        Bar.reified(),
        WithTwoGenerics.reified('u8', 'u8')
      ).new({
        genericField1: Bar.r.new({ value: 80n }),
        genericField2: WithTwoGenerics.reified('u8', 'u8').new({
          genericField1: 1,
          genericField2: 2,
        }),
      }),
      twoGenericsReifiedNested: WithTwoGenerics.reified(
        Bar.reified(),
        WithTwoGenerics.reified('u8', 'u8')
      ).new({
        genericField1: Bar.r.new({ value: 90n }),
        genericField2: WithTwoGenerics.reified('u8', 'u8').new({
          genericField1: 3,
          genericField2: 4,
        }),
      }),
      twoGenericsNestedVec: [],
      dummy: Dummy.r.new({ dummyField: true }),
      other: StructFromOtherModule.r.new({ dummyField: false }),
    })

    const json = foo.toJSONField()

    // id: UID → string
    expectTypeOf(json.id).toEqualTypeOf<string>()

    // generic: T where T = Bar → { value: string }
    expectTypeOf(json.generic.value).toEqualTypeOf<string>()

    // reifiedPrimitiveVec: Vector<u64> → string[]
    expectTypeOf(json.reifiedPrimitiveVec).toEqualTypeOf<string[]>()

    // reifiedObjectVec: Vector<Bar> → { value: string }[]
    expectTypeOf(json.reifiedObjectVec[0].value).toEqualTypeOf<string>()

    // genericVec: Vector<T> where T = Bar → { value: string }[]
    expectTypeOf(json.genericVec[0].value).toEqualTypeOf<string>()

    // dummy: Dummy → { dummyField: boolean }
    expectTypeOf(json.dummy.dummyField).toEqualTypeOf<boolean>()

    // other: StructFromOtherModule → { dummyField: boolean }
    expectTypeOf(json.other.dummyField).toEqualTypeOf<boolean>()
  })

  it('should have correct types for nested generics in Foo', () => {
    const foo = Foo.reified(Bar.reified()).new({
      id: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      generic: Bar.r.new({ value: 1n }),
      reifiedPrimitiveVec: [],
      reifiedObjectVec: [],
      genericVec: [],
      genericVecNested: [],
      twoGenerics: WithTwoGenerics.reified(Bar.reified(), Bar.reified()).new({
        genericField1: Bar.r.new({ value: 40n }),
        genericField2: Bar.r.new({ value: 50n }),
      }),
      twoGenericsReifiedPrimitive: WithTwoGenerics.reified('u16', 'u64').new({
        genericField1: 100,
        genericField2: 200n,
      }),
      twoGenericsReifiedObject: WithTwoGenerics.reified(Bar.reified(), Bar.reified()).new({
        genericField1: Bar.r.new({ value: 60n }),
        genericField2: Bar.r.new({ value: 70n }),
      }),
      twoGenericsNested: WithTwoGenerics.reified(
        Bar.reified(),
        WithTwoGenerics.reified('u8', 'u8')
      ).new({
        genericField1: Bar.r.new({ value: 80n }),
        genericField2: WithTwoGenerics.reified('u8', 'u8').new({
          genericField1: 1,
          genericField2: 2,
        }),
      }),
      twoGenericsReifiedNested: WithTwoGenerics.reified(
        Bar.reified(),
        WithTwoGenerics.reified('u8', 'u8')
      ).new({
        genericField1: Bar.r.new({ value: 90n }),
        genericField2: WithTwoGenerics.reified('u8', 'u8').new({
          genericField1: 3,
          genericField2: 4,
        }),
      }),
      twoGenericsNestedVec: [],
      dummy: Dummy.r.new({ dummyField: true }),
      other: StructFromOtherModule.r.new({ dummyField: false }),
    })

    const json = foo.toJSONField()

    // twoGenerics: WithTwoGenerics<T, Bar> → { genericField1: { value: string }, genericField2: { value: string } }
    expectTypeOf(json.twoGenerics.genericField1.value).toEqualTypeOf<string>()
    expectTypeOf(json.twoGenerics.genericField2.value).toEqualTypeOf<string>()

    // twoGenericsReifiedPrimitive: WithTwoGenerics<u16, u64> → { genericField1: number, genericField2: string }
    expectTypeOf(json.twoGenericsReifiedPrimitive.genericField1).toEqualTypeOf<number>() // u16 → number
    expectTypeOf(json.twoGenericsReifiedPrimitive.genericField2).toEqualTypeOf<string>() // u64 → string

    // twoGenericsNested: WithTwoGenerics<T, WithTwoGenerics<u8, u8>> → deeply nested
    expectTypeOf(json.twoGenericsNested.genericField1.value).toEqualTypeOf<string>() // T = Bar
    expectTypeOf(json.twoGenericsNested.genericField2.genericField1).toEqualTypeOf<number>() // u8
    expectTypeOf(json.twoGenericsNested.genericField2.genericField2).toEqualTypeOf<number>() // u8
  })
})

// ============================================================================
// Enum Variant JSON Tests
// ============================================================================
describe('Enum variant JSON types (compile-time checks)', () => {
  // Use the phantom type string for U
  type SUIPhantom = typeof SUI.$typeName

  it('should have correct $kind discriminator for ActionStop', () => {
    // Create a Stop variant directly with proper phantom type
    const stop = new ActionStop<'u64', SUIPhantom>(['u64', SUI.$typeName], {})

    const json = stop.toJSONField()

    // Unit variant only has $kind
    expectTypeOf(json.$kind).toEqualTypeOf<'Stop'>()
  })

  it('should have correct $kind and fields for ActionPause', () => {
    // Create a Pause variant directly with the correct constructor
    const pause = new ActionPause<'u64', SUIPhantom>(['u64', SUI.$typeName], {
      duration: 100,
      genericField: 200n,
      phantomField: Balance.reified(SUI.phantom()).new({ value: 300n }),
      reifiedField: 400n,
    })

    const json = pause.toJSONField()

    expectTypeOf(json.$kind).toEqualTypeOf<'Pause'>()
    expectTypeOf(json.duration).toEqualTypeOf<number>() // u32 → number
    expectTypeOf(json.genericField).toEqualTypeOf<string>() // T = u64 → string
    expectTypeOf(json.phantomField.value).toEqualTypeOf<string>() // Balance<U> → { value: string }
    expectTypeOf(json.reifiedField).toEqualTypeOf<string | null>() // Option<u64> → string | null
  })

  it('should have correct $kind and vec tuple for ActionJump', () => {
    // Create a Jump variant directly - fields are a tuple [u64, T, Balance<U>, Option<u64>]
    const jump = new ActionJump<'u64', SUIPhantom>(
      ['u64', SUI.$typeName],
      [100n, 200n, Balance.reified(SUI.phantom()).new({ value: 300n }), 400n]
    )

    const json = jump.toJSONField()

    expectTypeOf(json.$kind).toEqualTypeOf<'Jump'>()
    // vec: [u64, T, Balance<U>, Option<u64>] → [string, string, { value: string }, string | null]
    expectTypeOf(json.vec[0]).toEqualTypeOf<string>() // u64 → string
    expectTypeOf(json.vec[1]).toEqualTypeOf<string>() // T = u64 → string
    expectTypeOf(json.vec[2].value).toEqualTypeOf<string>() // Balance<U> → { value: string }
    expectTypeOf(json.vec[3]).toEqualTypeOf<string | null>() // Option<u64> → string | null
  })
})

// ============================================================================
// ToField Type Mapping Tests
// ============================================================================
describe('ToField type mappings (compile-time checks)', () => {
  it('should map primitives correctly', () => {
    // Type-level checks for ToField
    type BoolField = ToField<'bool'>
    type U8Field = ToField<'u8'>
    type U64Field = ToField<'u64'>
    type AddressField = ToField<'address'>

    expectTypeOf<BoolField>().toEqualTypeOf<boolean>()
    expectTypeOf<U8Field>().toEqualTypeOf<number>()
    expectTypeOf<U64Field>().toEqualTypeOf<bigint>() // ToField keeps as bigint
    expectTypeOf<AddressField>().toEqualTypeOf<string>()
  })

  it('should map special types to string', () => {
    // Special types in ToField become string
    type UIDField = ToField<UID>
    type IDField = ToField<ID>
    type UrlField = ToField<Url>

    expectTypeOf<UIDField>().toEqualTypeOf<string>()
    expectTypeOf<IDField>().toEqualTypeOf<string>()
    expectTypeOf<UrlField>().toEqualTypeOf<string>()
  })

  it('should map structs to themselves', () => {
    // Struct types in ToField stay as the struct
    type BarField = ToField<Bar>

    expectTypeOf<BarField>().toEqualTypeOf<Bar>()
  })
})

// ============================================================================
// $typeArgs Type Tests
// ============================================================================
describe('$typeArgs type accuracy (compile-time checks)', () => {
  it('should have empty $typeArgs for non-generic structs', () => {
    const dummy = Dummy.r.new({ dummyField: true })
    const json = dummy.toJSON()

    expectTypeOf(json.$typeArgs).toEqualTypeOf<[]>()
  })

  it('should have correct $typeArgs for single generic', () => {
    const obj = WithGenericField.reified(Bar.reified()).new({
      id: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      genericField: Bar.r.new({ value: 100n }),
    })
    const json = obj.toJSON()

    // $typeArgs should be [ToTypeStr<Bar>]
    expectTypeOf(json.$typeArgs).toEqualTypeOf<[ToTypeStr<Bar>]>()
  })

  it('should have correct $typeArgs for multiple generics', () => {
    const obj = WithTwoGenerics.reified(Bar.reified(), 'u8').new({
      genericField1: Bar.r.new({ value: 100n }),
      genericField2: 42,
    })
    const json = obj.toJSON()

    // $typeArgs should be [ToTypeStr<Bar>, ToTypeStr<'u8'>]
    expectTypeOf(json.$typeArgs).toEqualTypeOf<[ToTypeStr<Bar>, ToTypeStr<'u8'>]>()
  })

  it('should include phantom type args in $typeArgs tuple', () => {
    // WithSpecialTypes has phantom T and non-phantom U
    const obj = WithSpecialTypes.reified(SUI.phantom(), Bar.reified()).new({
      id: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      string: 'hello',
      asciiString: 'world',
      url: 'https://example.com',
      idField: '0xabcd',
      uid: '0x5678',
      balance: Balance.reified(SUI.phantom()).new({ value: 0n }),
      option: 123n,
      optionObj: Bar.r.new({ value: 456n }),
      optionNone: null,
      balanceGeneric: Balance.reified(SUI.phantom()).new({ value: 789n }),
      optionGeneric: Bar.r.new({ value: 101n }),
      optionGenericNone: null,
    })
    const json = obj.toJSON()

    // $typeArgs is a 2-tuple for WithSpecialTypes<phantom T, U>
    // Verify it's a tuple of length 2 containing strings
    expectTypeOf(json.$typeArgs).toMatchTypeOf<[string, string]>()

    // At runtime, verify the actual values
    expect(json.$typeArgs.length).toBe(2)
    expect(typeof json.$typeArgs[0]).toBe('string')
    expect(typeof json.$typeArgs[1]).toBe('string')
  })
})
