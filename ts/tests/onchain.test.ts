import { it, expect } from 'vitest'
import { TransactionBlock } from '@mysten/sui.js/transactions'
import { SuiClient } from '@mysten/sui.js/client'
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519'
import { fromB64 } from '@mysten/sui.js/utils'
import {
  Bar,
  Dummy,
  Foo,
  WithGenericField,
  WithSpecialTypes,
  WithSpecialTypesAsGenerics,
  WithSpecialTypesInVectors,
  WithTwoGenerics,
} from './gen/examples-chain/fixture/structs'
import {
  createBar,
  createFoo,
  createSpecial,
  createSpecialAsGenerics,
  createSpecialInVectors,
  createWithGenericField,
  createWithTwoGenerics,
} from './gen/examples-chain/fixture/functions'
import { StructFromOtherModule } from './gen/examples-chain/other-module/structs'
import { string } from './gen/move-stdlib-chain/ascii/functions'
import { utf8 } from './gen/move-stdlib-chain/string/functions'
import { none, some } from './gen/move-stdlib-chain/option/functions'
import { newUnsafeFromBytes } from './gen/sui-chain/url/functions'
import { new_ as newUid, idFromAddress } from './gen/sui-chain/object/functions'
import { zero } from './gen/sui-chain/balance/functions'
import { Balance } from './gen/sui-chain/balance/structs'
import { extractType, vector } from './gen/_framework/reified'
import { SUI } from './gen/sui-chain/sui/structs'
import { String } from './gen/move-stdlib-chain/string/structs'
import { String as AsciiString } from './gen/move-stdlib-chain/ascii/structs'
import { Url } from './gen/sui-chain/url/structs'
import { ID, UID } from './gen/sui-chain/object/structs'
import { Option } from './gen/move-stdlib-chain/option/structs'
import { initLoaderIfNeeded } from './gen/_framework/init-onchain'
import { structClassLoaderOnchain } from './gen/_framework/loader'

const keypair = Ed25519Keypair.fromSecretKey(
  fromB64('AMVT58FaLF2tJtg/g8X2z1/vG0FvNn0jvRu9X2Wl8F+u').slice(1)
) // address: 0x8becfafb14c111fc08adee6cc9afa95a863d1bf133f796626eec353f98ea8507

const client = new SuiClient({
  url: 'https://fullnode.testnet.sui.io:443/',
})

it('creates and decodes an object with object as type param', async () => {
  const txb = new TransactionBlock()

  const T = Bar.$typeName

  const genericVecNested = [
    createWithTwoGenerics(txb, [T, 'u8'], {
      t0: createBar(txb, 100n),
      t1: 1,
    }),
  ]

  const twoGenericsNested = createWithTwoGenerics(
    txb,
    [T, `${WithTwoGenerics.$typeName}<u8, u8>`],
    {
      t0: createBar(txb, 100n),
      t1: createWithTwoGenerics(txb, ['u8', 'u8'], {
        t0: 1,
        t1: 2,
      }),
    }
  )

  const twoGenericsReifiedNested = createWithTwoGenerics(
    txb,
    [Bar.$typeName, `${WithTwoGenerics.$typeName}<u8, u8>`],
    {
      t0: createBar(txb, 100n),
      t1: createWithTwoGenerics(txb, ['u8', 'u8'], {
        t0: 1,
        t1: 2,
      }),
    }
  )

  const twoGenericsNestedVec = [
    createWithTwoGenerics(txb, [Bar.$typeName, `vector<${WithTwoGenerics.$typeName}<${T}, u8>>`], {
      t0: createBar(txb, 100n),
      t1: [
        createWithTwoGenerics(txb, [Bar.$typeName, 'u8'], {
          t0: createBar(txb, 100n),
          t1: 1,
        }),
      ],
    }),
  ]

  createFoo(txb, [T, Bar.$typeName], {
    t0: createBar(txb, 100n),
    vecU64: [1n, 2n, 3n],
    vecBar: [createBar(txb, 100n)],
    vecT0: [createBar(txb, 100n)],
    vecWithTwoGenerics1: genericVecNested,
    withTwoGenerics1: createWithTwoGenerics(txb, [T, Bar.$typeName], {
      t0: createBar(txb, 100n),
      t1: createBar(txb, 100n),
    }),
    withTwoGenerics2: createWithTwoGenerics(txb, ['u16', 'u64'], {
      t0: 1,
      t1: 2n,
    }),
    withTwoGenerics3: createWithTwoGenerics(txb, [Bar.$typeName, Bar.$typeName], {
      t0: createBar(txb, 100n),
      t1: createBar(txb, 100n),
    }),
    withTwoGenerics4: twoGenericsNested,
    withTwoGenerics5: twoGenericsReifiedNested,
    vecWithTwoGenerics2: twoGenericsNestedVec,
    bar: createBar(txb, 100n),
  })

  const res = await client.signAndExecuteTransactionBlock({
    signer: keypair,
    transactionBlock: txb,
    options: {
      showEffects: true,
    },
  })

  const id = res.effects!.created![0].reference.objectId

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

  const exp = Foo.new(Bar.reified(), {
    id,
    generic: Bar.new(100n),
    reifiedPrimitiveVec: [1n, 2n, 3n],
    reifiedObjectVec: [Bar.new(100n)],
    genericVec: [Bar.new(100n)],
    genericVecNested: [
      WithTwoGenerics.new([Bar.reified(), 'u8'], {
        genericField1: Bar.new(100n),
        genericField2: 1,
      }),
    ],
    twoGenerics: WithTwoGenerics.new([Bar.reified(), Bar.reified()], {
      genericField1: Bar.new(100n),
      genericField2: Bar.new(100n),
    }),
    twoGenericsReifiedPrimitive: WithTwoGenerics.new(['u16', 'u64'], {
      genericField1: 1,
      genericField2: 2n,
    }),
    twoGenericsReifiedObject: WithTwoGenerics.new([Bar.reified(), Bar.reified()], {
      genericField1: Bar.new(100n),
      genericField2: Bar.new(100n),
    }),
    twoGenericsNested: WithTwoGenerics.new([Bar.reified(), WithTwoGenerics.reified('u8', 'u8')], {
      genericField1: Bar.new(100n),
      genericField2: WithTwoGenerics.new(['u8', 'u8'], {
        genericField1: 1,
        genericField2: 2,
      }),
    }),
    twoGenericsReifiedNested: WithTwoGenerics.new(
      [Bar.reified(), WithTwoGenerics.reified('u8', 'u8')],
      {
        genericField1: Bar.new(100n),
        genericField2: WithTwoGenerics.new(['u8', 'u8'], {
          genericField1: 1,
          genericField2: 2,
        }),
      }
    ),
    twoGenericsNestedVec: [
      WithTwoGenerics.new([Bar.reified(), vector(WithTwoGenerics.reified(Bar.reified(), 'u8'))], {
        genericField1: Bar.new(100n),
        genericField2: [
          WithTwoGenerics.new([Bar.reified(), 'u8'], {
            genericField1: Bar.new(100n),
            genericField2: 1,
          }),
        ],
      }),
    ],
    dummy: Dummy.new(false),
    other: StructFromOtherModule.new(false),
  })

  const de = Foo.fromBcs(Bar.reified(), fromB64(foo.data.bcs.bcsBytes))

  expect(de).toEqual(exp)
  expect(Foo.fromFieldsWithTypes(Bar.reified(), foo.data.content)).toEqual(exp)
  expect(Foo.fromSuiParsedData(Bar.reified(), foo.data.content)).toEqual(exp)
  expect(await Foo.fetch(client, Bar.reified(), id)).toEqual(exp)
})

it('creates and decodes Foo with vector of objects as type param', async () => {
  const txb = new TransactionBlock()

  const T = `vector<${Bar.$typeName}>`
  const reifiedT = vector(Bar.reified())

  function createT(txb: TransactionBlock, value: bigint) {
    return txb.makeMoveVec({
      objects: [createBar(txb, value)],
      type: Bar.$typeName,
    })
  }

  const genericVecNested = [
    createWithTwoGenerics(txb, [T, 'u8'], {
      t0: [createBar(txb, 100n)],
      t1: 1,
    }),
  ]

  const twoGenericsNested = createWithTwoGenerics(
    txb,
    [T, `${WithTwoGenerics.$typeName}<u8, u8>`],
    {
      t0: [createBar(txb, 100n)],
      t1: createWithTwoGenerics(txb, ['u8', 'u8'], {
        t0: 1,
        t1: 2,
      }),
    }
  )

  const twoGenericsReifiedNested = createWithTwoGenerics(
    txb,
    [Bar.$typeName, `${WithTwoGenerics.$typeName}<u8, u8>`],
    {
      t0: createBar(txb, 100n),
      t1: createWithTwoGenerics(txb, ['u8', 'u8'], {
        t0: 1,
        t1: 2,
      }),
    }
  )

  const twoGenericsNestedVec = [
    createWithTwoGenerics(txb, [Bar.$typeName, `vector<${WithTwoGenerics.$typeName}<${T}, u8>>`], {
      t0: createBar(txb, 100n),
      t1: [
        createWithTwoGenerics(txb, [T, 'u8'], {
          t0: createT(txb, 100n), // or [createBar(txb, 100n)],
          t1: 1,
        }),
      ],
    }),
  ]

  createFoo(txb, [T, Bar.$typeName], {
    t0: createT(txb, 100n), // or [createBar(txb, 100n)]
    vecU64: [1n, 2n, 3n],
    vecBar: [createBar(txb, 100n)],
    vecT0: [createT(txb, 100n)],
    vecWithTwoGenerics1: genericVecNested,
    withTwoGenerics1: createWithTwoGenerics(txb, [T, Bar.$typeName], {
      t0: [createBar(txb, 100n), createBar(txb, 100n)],
      t1: createBar(txb, 100n),
    }),
    withTwoGenerics2: createWithTwoGenerics(txb, ['u16', 'u64'], {
      t0: 1,
      t1: 2n,
    }),
    withTwoGenerics3: createWithTwoGenerics(txb, [Bar.$typeName, Bar.$typeName], {
      t0: createBar(txb, 100n),
      t1: createBar(txb, 100n),
    }),
    withTwoGenerics4: twoGenericsNested,
    withTwoGenerics5: twoGenericsReifiedNested,
    vecWithTwoGenerics2: twoGenericsNestedVec,
    bar: createBar(txb, 100n),
  })

  const res = await client.signAndExecuteTransactionBlock({
    signer: keypair,
    transactionBlock: txb,
    options: {
      showEffects: true,
    },
  })

  const id = res.effects!.created![0].reference.objectId

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

  const exp = Foo.new(reifiedT, {
    id: id,
    generic: [Bar.new(100n)],
    reifiedPrimitiveVec: [1n, 2n, 3n],
    reifiedObjectVec: [Bar.new(100n)],
    genericVec: [[Bar.new(100n)]],
    genericVecNested: [
      WithTwoGenerics.new([reifiedT, 'u8'], {
        genericField1: [Bar.new(100n)],
        genericField2: 1,
      }),
    ],
    twoGenerics: WithTwoGenerics.new([reifiedT, Bar.reified()], {
      genericField1: [Bar.new(100n), Bar.new(100n)],
      genericField2: Bar.new(100n),
    }),
    twoGenericsReifiedPrimitive: WithTwoGenerics.new(['u16', 'u64'], {
      genericField1: 1,
      genericField2: 2n,
    }),
    twoGenericsReifiedObject: WithTwoGenerics.new([Bar.reified(), Bar.reified()], {
      genericField1: Bar.new(100n),
      genericField2: Bar.new(100n),
    }),
    twoGenericsNested: WithTwoGenerics.new([reifiedT, WithTwoGenerics.reified('u8', 'u8')], {
      genericField1: [Bar.new(100n)],
      genericField2: WithTwoGenerics.new(['u8', 'u8'], {
        genericField1: 1,
        genericField2: 2,
      }),
    }),
    twoGenericsReifiedNested: WithTwoGenerics.new(
      [Bar.reified(), WithTwoGenerics.reified('u8', 'u8')],
      {
        genericField1: Bar.new(100n),
        genericField2: WithTwoGenerics.new(['u8', 'u8'], {
          genericField1: 1,
          genericField2: 2,
        }),
      }
    ),
    twoGenericsNestedVec: [
      WithTwoGenerics.new([Bar.reified(), vector(WithTwoGenerics.reified(reifiedT, 'u8'))], {
        genericField1: Bar.new(100n),
        genericField2: [
          WithTwoGenerics.new([reifiedT, 'u8'], {
            genericField1: [Bar.new(100n)],
            genericField2: 1,
          }),
        ],
      }),
    ],
    dummy: Dummy.new(false),
    other: StructFromOtherModule.new(false),
  })

  const de = Foo.fromBcs(reifiedT, fromB64(foo.data.bcs.bcsBytes))

  expect(de).toEqual(exp)

  expect(Foo.fromFieldsWithTypes(reifiedT, foo.data.content)).toEqual(exp)
})

it('decodes special-cased types correctly', async () => {
  const txb = new TransactionBlock()

  const encoder = new TextEncoder()

  const typeArgs = ['0x2::sui::SUI', 'u64'] as [string, string]
  const reifiedArgs = [SUI.reified(), 'u64'] as [ReturnType<typeof SUI.reified>, 'u64']

  createSpecial(txb, typeArgs, {
    string1: utf8(txb, Array.from(encoder.encode('string'))),
    string2: string(txb, Array.from(encoder.encode('ascii'))),
    url: newUnsafeFromBytes(txb, Array.from(encoder.encode('https://example.com'))),
    id: idFromAddress(txb, 'faf60f9f9d1f6c490dce8673c1371b9df456e0c183f38524e5f78d959ea559a5'),
    uid: newUid(txb),
    balance1: zero(txb, '0x2::sui::SUI'),
    option1: some(txb, 'u64', 100n),
    option2: some(txb, Bar.$typeName, createBar(txb, 100n)),
    option3: none(txb, 'u64'),
    balance2: zero(txb, '0x2::sui::SUI'),
    option4: some(txb, 'u64', 200n),
    option5: none(txb, 'u64'),
  })

  const res = await client.signAndExecuteTransactionBlock({
    signer: keypair,
    transactionBlock: txb,
    options: {
      showEffects: true,
    },
  })

  const id = res.effects!.created![0].reference.objectId

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

  const fromBcs = WithSpecialTypes.fromBcs(reifiedArgs, fromB64(obj.data.bcs.bcsBytes))
  const fromFieldsWithTypes = WithSpecialTypes.fromFieldsWithTypes(reifiedArgs, obj.data.content)

  const uid = (obj.data.content.fields as { uid: { id: string } }).uid.id

  const exp = WithSpecialTypes.new(reifiedArgs, {
    id,
    string: 'string',
    asciiString: 'ascii',
    url: 'https://example.com',
    idField: '0xfaf60f9f9d1f6c490dce8673c1371b9df456e0c183f38524e5f78d959ea559a5',
    uid,
    balance: Balance.new(SUI.reified(), 0n),
    option: 100n,
    optionObj: Bar.new(100n),
    optionNone: null,
    balanceGeneric: Balance.new(SUI.reified(), 0n),
    optionGeneric: 200n,
    optionGenericNone: null,
  })

  expect(fromFieldsWithTypes).toEqual(exp)
  expect(fromBcs).toEqual(exp)
})

it('decodes special-cased types as generics correctly', async () => {
  const txb = new TransactionBlock()

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
    String.reified(),
    AsciiString.reified(),
    Url.reified(),
    ID.reified(),
    UID.reified(),
    Balance.reified(SUI.reified()),
    Option.reified('u64'),
    Option.reified('u64'),
  ] as [
    ReturnType<typeof String.reified>,
    ReturnType<typeof AsciiString.reified>,
    ReturnType<typeof Url.reified>,
    ReturnType<typeof ID.reified>,
    ReturnType<typeof UID.reified>,
    ReturnType<typeof Balance.reified>,
    ReturnType<typeof Option.reified<'u64'>>,
    ReturnType<typeof Option.reified<'u64'>>,
  ]

  createSpecialAsGenerics(txb, typeArgs, {
    t0: utf8(txb, Array.from(encoder.encode('string'))),
    t1: string(txb, Array.from(encoder.encode('ascii'))),
    t2: newUnsafeFromBytes(txb, Array.from(encoder.encode('https://example.com'))),
    t3: idFromAddress(txb, 'faf60f9f9d1f6c490dce8673c1371b9df456e0c183f38524e5f78d959ea559a5'),
    t4: newUid(txb),
    t5: zero(txb, '0x2::sui::SUI'),
    t6: some(txb, 'u64', 100n),
    t7: none(txb, 'u64'),
  })

  const res = await client.signAndExecuteTransactionBlock({
    signer: keypair,
    transactionBlock: txb,
    options: {
      showEffects: true,
    },
  })

  const id = res.effects!.created![0].reference.objectId

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

  const fromBcs = WithSpecialTypesAsGenerics.fromBcs(reifiedArgs, fromB64(obj.data.bcs.bcsBytes))
  const fromFieldsWithTypes = WithSpecialTypesAsGenerics.fromFieldsWithTypes(
    reifiedArgs,
    obj.data.content
  )

  const exp = WithSpecialTypesAsGenerics.new(reifiedArgs, {
    id,
    string: 'string',
    asciiString: 'ascii',
    url: 'https://example.com',
    idField: '0xfaf60f9f9d1f6c490dce8673c1371b9df456e0c183f38524e5f78d959ea559a5',
    uid,
    balance: Balance.new(SUI.reified(), 0n),
    option: 100n,
    optionNone: null,
  })

  expect(fromBcs).toEqual(exp)
  expect(fromFieldsWithTypes).toEqual(exp)
})

it('calls function correctly when special types are used', async () => {
  const txb = new TransactionBlock()

  const encoder = new TextEncoder()

  const reifiedArgs = [
    SUI.reified(),
    vector(Option.reified(Option.reified(vector(vector('u64'))))),
  ] as [
    ReturnType<typeof SUI.reified>,
    ReturnType<
      typeof vector<
        ReturnType<
          typeof Option.reified<
            ReturnType<
              typeof Option.reified<ReturnType<typeof vector<ReturnType<typeof vector<'u64'>>>>>
            >
          >
        >
      >
    >,
  ]

  createSpecial(
    txb,
    ['0x2::sui::SUI', 'vector<0x1::option::Option<0x1::option::Option<vector<vector<u64>>>>>'],
    {
      string1: 'string',
      string2: 'ascii',
      url: newUnsafeFromBytes(txb, Array.from(encoder.encode('https://example.com'))),
      id: idFromAddress(txb, '0xfaf60f9f9d1f6c490dce8673c1371b9df456e0c183f38524e5f78d959ea559a5'),
      uid: newUid(txb),
      balance1: zero(txb, '0x2::sui::SUI'),
      option1: 100n,
      option2: some(txb, Bar.$typeName, createBar(txb, 100n)),
      option3: null,
      balance2: zero(txb, '0x2::sui::SUI'),
      option4: [[[200n, 300n]], null, [[400n, 500n]]],
      option5: null,
    }
  )

  const res = await client.signAndExecuteTransactionBlock({
    signer: keypair,
    transactionBlock: txb,
    options: {
      showEffects: true,
    },
  })

  const id = res.effects!.created![0].reference.objectId

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

  expect(WithSpecialTypes.fromFieldsWithTypes(reifiedArgs, obj.data.content)).toEqual(
    WithSpecialTypes.new(reifiedArgs, {
      id,
      string: 'string',
      asciiString: 'ascii',
      url: 'https://example.com',
      idField: '0xfaf60f9f9d1f6c490dce8673c1371b9df456e0c183f38524e5f78d959ea559a5',
      uid: (obj.data.content.fields as { uid: { id: string } }).uid.id,
      balance: Balance.new(SUI.reified(), 0n),
      option: 100n,
      optionObj: Bar.new(100n),
      optionNone: null,
      balanceGeneric: Balance.new(SUI.reified(), 0n),
      optionGeneric: [[[200n, 300n]], null, [[400n, 500n]]],
      optionGenericNone: null,
    })
  )
})

it('calls function correctly when special types are used as generics', async () => {
  const txb = new TransactionBlock()

  const encoder = new TextEncoder()

  const reifiedArgs = [
    String.reified(),
    AsciiString.reified(),
    Url.reified(),
    ID.reified(),
    UID.reified(),
    Balance.reified(SUI.reified()),
    Option.reified(vector(Option.reified('u64'))),
    Option.reified('u64'),
  ] as [
    ReturnType<typeof String.reified>,
    ReturnType<typeof AsciiString.reified>,
    ReturnType<typeof Url.reified>,
    ReturnType<typeof ID.reified>,
    ReturnType<typeof UID.reified>,
    ReturnType<typeof Balance.reified>,
    ReturnType<
      typeof Option.reified<ReturnType<typeof vector<ReturnType<typeof Option.reified<'u64'>>>>>
    >,
    ReturnType<typeof Option.reified<'u64'>>,
  ]

  createSpecialAsGenerics(
    txb,
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
      t0: 'string',
      t1: 'ascii',
      t2: newUnsafeFromBytes(txb, Array.from(encoder.encode('https://example.com'))),
      t3: idFromAddress(txb, '0xfaf60f9f9d1f6c490dce8673c1371b9df456e0c183f38524e5f78d959ea559a5'),
      t4: newUid(txb),
      t5: zero(txb, '0x2::sui::SUI'),
      t6: [5n, null, 3n],
      t7: null,
    }
  )

  const res = await client.signAndExecuteTransactionBlock({
    signer: keypair,
    transactionBlock: txb,
    options: {
      showEffects: true,
    },
  })

  const id = res.effects!.created![0].reference.objectId

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

  expect(WithSpecialTypesAsGenerics.fromFieldsWithTypes(reifiedArgs, obj.data.content)).toEqual(
    WithSpecialTypesAsGenerics.new(reifiedArgs, {
      id,
      string: 'string',
      asciiString: 'ascii',
      url: 'https://example.com',
      idField: '0xfaf60f9f9d1f6c490dce8673c1371b9df456e0c183f38524e5f78d959ea559a5',
      uid: (obj.data.content.fields as { uid: { id: string } }).uid.id,
      balance: Balance.new(SUI.reified(), 0n),
      option: [5n, null, 3n],
      optionNone: null,
    })
  )
})

it('calls function correctly when special types are used as as vectors', async () => {
  const txb = new TransactionBlock()

  createSpecialInVectors(txb, 'vector<u64>', {
    vecString1: ['string'],
    vecString2: ['ascii'],
    vecId: ['0x0', '0x1'],
    vecBar: [createBar(txb, 100n)],
    vecOption1: [5n, 1n, 3n],
    vecOption2: [[5n], null],
  })

  const res = await client.signAndExecuteTransactionBlock({
    signer: keypair,
    transactionBlock: txb,
    options: {
      showEffects: true,
    },
  })

  const id = res.effects!.created![0].reference.objectId

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
    WithSpecialTypesInVectors.new(vector('u64'), {
      id,
      string: ['string'],
      asciiString: ['ascii'],
      idField: [
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000001',
      ],
      bar: [Bar.new(100n)],
      option: [5n, 1n, 3n],
      optionGeneric: [[5n], null],
    })
  )
})

it('loads with loader correctly', async () => {
  const txb = new TransactionBlock()

  const T = `${WithTwoGenerics.$typeName}<${Bar.$typeName}, vector<${WithTwoGenerics.$typeName}<${Bar.$typeName}, u8>>>`
  const tReified = WithTwoGenerics.reified(
    Bar.reified(),
    vector(WithTwoGenerics.reified(Bar.reified(), 'u8'))
  )

  const withTwoGenerics = createWithTwoGenerics(
    txb,
    [Bar.$typeName, `vector<${WithTwoGenerics.$typeName}<${Bar.$typeName}, u8>>`],
    {
      t0: createBar(txb, 100n),
      t1: [
        createWithTwoGenerics(txb, [Bar.$typeName, 'u8'], {
          t0: createBar(txb, 100n),
          t1: 1,
        }),
      ],
    }
  )
  createWithGenericField(txb, T, withTwoGenerics)

  const res = await client.signAndExecuteTransactionBlock({
    signer: keypair,
    transactionBlock: txb,
    options: {
      showEffects: true,
    },
  })

  const id = res.effects!.created![0].reference.objectId

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

  initLoaderIfNeeded()

  const withGenericFieldReified = structClassLoaderOnchain.reified(
    `${WithGenericField.$typeName}<${T}>`
  )

  expect(extractType(withGenericFieldReified)).toEqual(`${WithGenericField.$typeName}<${T}>`)

  const fromBcs = withGenericFieldReified.fromFieldsWithTypes(obj.data.content)
  expect(fromBcs).toEqual(
    WithGenericField.new(tReified, {
      id,
      genericField: WithTwoGenerics.new(
        [Bar.reified(), vector(WithTwoGenerics.reified(Bar.reified(), 'u8'))],
        {
          genericField1: Bar.new(100n),
          genericField2: [
            WithTwoGenerics.new([Bar.reified(), 'u8'], {
              genericField1: Bar.new(100n),
              genericField2: 1,
            }),
          ],
        }
      ),
    })
  )
})

it('converts to json correctly', () => {
  const U = WithSpecialTypes.reified(Bar.reified(), 'u64')
  const V = vector(WithTwoGenerics.reified(Bar.reified(), 'u8'))
  const reified = WithTwoGenerics.reified(U, V)

  const obj = WithTwoGenerics.new([U, V], {
    genericField1: WithSpecialTypes.new([Bar.reified(), 'u64'], {
      id: '0x1',
      string: 'string',
      asciiString: 'ascii',
      url: 'https://example.com',
      idField: '0x2',
      uid: '0x3',
      balance: Balance.new(SUI.reified(), 0n),
      option: 100n,
      optionObj: Bar.new(100n),
      optionNone: null,
      balanceGeneric: Balance.new(SUI.reified(), 0n),
      optionGeneric: 200n,
      optionGenericNone: null,
    }),
    genericField2: [
      WithTwoGenerics.new([Bar.reified(), 'u8'], {
        genericField1: Bar.new(100n),
        genericField2: 1,
      }),
    ],
  })

  const exp = {
    $typeName:
      '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithTwoGenerics',
    $typeArgs: [
      '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithSpecialTypes<0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::Bar, u64>',
      'vector<0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithTwoGenerics<0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::Bar, u8>>',
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

  expect(obj.toJSON()).toEqual(exp)
})
