import {
  Connection,
  JsonRpcProvider,
  RawSigner,
  TransactionBlock,
  fromExportedKeypair,
} from '@mysten/sui.js'
import { it, expect } from 'vitest'
import {
  Bar,
  Dummy,
  Foo,
  WithSpecialTypes,
  WithSpecialTypesAsGenerics,
  WithSpecialTypesInVectors,
  WithTwoGenerics,
} from './gen/fixture/fixture/structs'
import {
  createBar,
  createFoo,
  createSpecial,
  createSpecialAsGenerics,
  createSpecialInVectors,
  createWithTwoGenerics,
} from './gen/fixture/fixture/functions'
import { bcsSource as bcs } from './gen/_framework/bcs'
import { StructFromOtherModule } from './gen/fixture-chain/other-module/structs'
import { string } from './gen/move-stdlib/ascii/functions'
import { utf8 } from './gen/move-stdlib/string/functions'
import { none, some } from './gen/move-stdlib/option/functions'
import { newUnsafeFromBytes } from './gen/sui/url/functions'
import { new_ as newUid, idFromAddress } from './gen/sui/object/functions'
import { zero } from './gen/sui/balance/functions'
import { Balance } from './gen/sui/balance/structs'

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

it('creates and decodes an object with object as type param', async () => {
  const txb = new TransactionBlock()

  const T = Bar.$typeName

  const genericVecNested = [
    createWithTwoGenerics(txb, [T, 'u8'], {
      genericField1: createBar(txb, 100n),
      genericField2: 1,
    }),
  ]

  const twoGenericsNested = createWithTwoGenerics(
    txb,
    [T, `${WithTwoGenerics.$typeName}<u8, u8>`],
    {
      genericField1: createBar(txb, 100n),
      genericField2: createWithTwoGenerics(txb, ['u8', 'u8'], {
        genericField1: 1,
        genericField2: 2,
      }),
    }
  )

  const twoGenericsReifiedNested = createWithTwoGenerics(
    txb,
    [Bar.$typeName, `${WithTwoGenerics.$typeName}<u8, u8>`],
    {
      genericField1: createBar(txb, 100n),
      genericField2: createWithTwoGenerics(txb, ['u8', 'u8'], {
        genericField1: 1,
        genericField2: 2,
      }),
    }
  )

  const twoGenericsNestedVec = [
    createWithTwoGenerics(txb, [Bar.$typeName, `vector<${WithTwoGenerics.$typeName}<${T}, u8>>`], {
      genericField1: createBar(txb, 100n),
      genericField2: [
        createWithTwoGenerics(txb, [Bar.$typeName, 'u8'], {
          genericField1: createBar(txb, 100n),
          genericField2: 1,
        }),
      ],
    }),
  ]

  createFoo(txb, [T, Bar.$typeName], {
    generic: createBar(txb, 100n),
    reifiedPrimitiveVec: [1n, 2n, 3n],
    reifiedObjectVec: [createBar(txb, 100n)],
    genericVec: [createBar(txb, 100n)],
    genericVecNested,
    twoGenerics: createWithTwoGenerics(txb, [T, Bar.$typeName], {
      genericField1: createBar(txb, 100n),
      genericField2: createBar(txb, 100n),
    }),
    twoGenericsReifiedPrimitive: createWithTwoGenerics(txb, ['u16', 'u64'], {
      genericField1: 1,
      genericField2: 2n,
    }),
    twoGenericsReifiedObject: createWithTwoGenerics(txb, [Bar.$typeName, Bar.$typeName], {
      genericField1: createBar(txb, 100n),
      genericField2: createBar(txb, 100n),
    }),
    twoGenericsNested,
    twoGenericsReifiedNested,
    twoGenericsNestedVec,
    objRef: createBar(txb, 100n),
  })

  const res = await signer.signAndExecuteTransactionBlock({
    transactionBlock: txb,
    options: {
      showEffects: true,
    },
  })

  const id = res.effects!.created![0].reference.objectId

  const foo = await provider.getObject({
    id,
    options: {
      showBcs: true,
      showContent: true,
    },
  })

  if (foo.data?.bcs?.dataType !== 'moveObject' || foo.data?.content?.dataType !== 'moveObject') {
    throw new Error(`not a moveObject`)
  }

  const exp = new Foo<Bar>(T, {
    id: id,
    generic: new Bar(100n),
    reifiedPrimitiveVec: [1n, 2n, 3n],
    reifiedObjectVec: [new Bar(100n)],
    genericVec: [new Bar(100n)],
    genericVecNested: [
      new WithTwoGenerics<Bar, number>([T, 'u8'], {
        genericField1: new Bar(100n),
        genericField2: 1,
      }),
    ],
    twoGenerics: new WithTwoGenerics<Bar, Bar>([T, Bar.$typeName], {
      genericField1: new Bar(100n),
      genericField2: new Bar(100n),
    }),
    twoGenericsReifiedPrimitive: new WithTwoGenerics<number, bigint>(['u16', 'u64'], {
      genericField1: 1,
      genericField2: 2n,
    }),
    twoGenericsReifiedObject: new WithTwoGenerics<Bar, Bar>([Bar.$typeName, Bar.$typeName], {
      genericField1: new Bar(100n),
      genericField2: new Bar(100n),
    }),
    twoGenericsNested: new WithTwoGenerics<Bar, WithTwoGenerics<number, number>>(
      [T, `${WithTwoGenerics.$typeName}<u8, u8>`],
      {
        genericField1: new Bar(100n),
        genericField2: new WithTwoGenerics<number, number>(['u8', 'u8'], {
          genericField1: 1,
          genericField2: 2,
        }),
      }
    ),
    twoGenericsReifiedNested: new WithTwoGenerics<Bar, WithTwoGenerics<number, number>>(
      [Bar.$typeName, `${WithTwoGenerics.$typeName}<u8, u8>`],
      {
        genericField1: new Bar(100n),
        genericField2: new WithTwoGenerics<number, number>(['u8', 'u8'], {
          genericField1: 1,
          genericField2: 2,
        }),
      }
    ),
    twoGenericsNestedVec: [
      new WithTwoGenerics<Bar, Array<WithTwoGenerics<Bar, number>>>(
        [Bar.$typeName, `vector<${WithTwoGenerics.$typeName}<${T}, u8>>`],
        {
          genericField1: new Bar(100n),
          genericField2: [
            new WithTwoGenerics<Bar, number>([T, 'u8'], {
              genericField1: new Bar(100n),
              genericField2: 1,
            }),
          ],
        }
      ),
    ],
    dummy: new Dummy(false),
    other: new StructFromOtherModule(false),
  })

  const de = bcs.de(`${Foo.$typeName}<${T}>`, foo.data.bcs.bcsBytes, 'base64')

  expect(Foo.fromFields(T, de)).toEqual(exp)
  expect(Foo.fromFieldsWithTypes(foo.data.content)).toEqual(exp)
  expect(Foo.fromSuiParsedData(foo.data.content)).toEqual(exp)
  expect(await Foo.fetch(provider, id)).toEqual(exp)
})

it('creates and decodes Foo with vector of objects as type param', async () => {
  const provider = new JsonRpcProvider()
  const txb = new TransactionBlock()

  const T = `vector<${Bar.$typeName}>`

  function createT(txb: TransactionBlock, value: bigint) {
    return txb.makeMoveVec({
      objects: [createBar(txb, value)],
      type: Bar.$typeName,
    })
  }

  const genericVecNested = [
    createWithTwoGenerics(txb, [T, 'u8'], {
      genericField1: [createBar(txb, 100n)],
      genericField2: 1,
    }),
  ]

  const twoGenericsNested = createWithTwoGenerics(
    txb,
    [T, `${WithTwoGenerics.$typeName}<u8, u8>`],
    {
      genericField1: [createBar(txb, 100n)],
      genericField2: createWithTwoGenerics(txb, ['u8', 'u8'], {
        genericField1: 1,
        genericField2: 2,
      }),
    }
  )

  const twoGenericsReifiedNested = createWithTwoGenerics(
    txb,
    [Bar.$typeName, `${WithTwoGenerics.$typeName}<u8, u8>`],
    {
      genericField1: createBar(txb, 100n),
      genericField2: createWithTwoGenerics(txb, ['u8', 'u8'], {
        genericField1: 1,
        genericField2: 2,
      }),
    }
  )

  const twoGenericsNestedVec = [
    createWithTwoGenerics(txb, [Bar.$typeName, `vector<${WithTwoGenerics.$typeName}<${T}, u8>>`], {
      genericField1: createBar(txb, 100n),
      genericField2: [
        createWithTwoGenerics(txb, [T, 'u8'], {
          genericField1: createT(txb, 100n), // or [createBar(txb, 100n)],
          genericField2: 1,
        }),
      ],
    }),
  ]

  createFoo(txb, [T, Bar.$typeName], {
    generic: createT(txb, 100n), // or [createBar(txb, 100n)]
    reifiedPrimitiveVec: [1n, 2n, 3n],
    reifiedObjectVec: [createBar(txb, 100n)],
    genericVec: [createT(txb, 100n)],
    genericVecNested,
    twoGenerics: createWithTwoGenerics(txb, [T, Bar.$typeName], {
      genericField1: [createBar(txb, 100n), createBar(txb, 100n)],
      genericField2: createBar(txb, 100n),
    }),
    twoGenericsReifiedPrimitive: createWithTwoGenerics(txb, ['u16', 'u64'], {
      genericField1: 1,
      genericField2: 2n,
    }),
    twoGenericsReifiedObject: createWithTwoGenerics(txb, [Bar.$typeName, Bar.$typeName], {
      genericField1: createBar(txb, 100n),
      genericField2: createBar(txb, 100n),
    }),
    twoGenericsNested,
    twoGenericsReifiedNested,
    twoGenericsNestedVec,
    objRef: createBar(txb, 100n),
  })

  const res = await signer.signAndExecuteTransactionBlock({
    transactionBlock: txb,
    options: {
      showEffects: true,
    },
  })

  const id = res.effects!.created![0].reference.objectId

  const foo = await provider.getObject({
    id,
    options: {
      showBcs: true,
      showContent: true,
    },
  })

  if (foo.data?.bcs?.dataType !== 'moveObject' || foo.data?.content?.dataType !== 'moveObject') {
    throw new Error(`not a moveObject`)
  }

  const exp = new Foo<Array<Bar>>(T, {
    id: id,
    generic: [new Bar(100n)],
    reifiedPrimitiveVec: [1n, 2n, 3n],
    reifiedObjectVec: [new Bar(100n)],
    genericVec: [[new Bar(100n)]],
    genericVecNested: [
      new WithTwoGenerics<Array<Bar>, number>([T, 'u8'], {
        genericField1: [new Bar(100n)],
        genericField2: 1,
      }),
    ],
    twoGenerics: new WithTwoGenerics<Array<Bar>, Bar>([T, Bar.$typeName], {
      genericField1: [new Bar(100n), new Bar(100n)],
      genericField2: new Bar(100n),
    }),
    twoGenericsReifiedPrimitive: new WithTwoGenerics<number, bigint>(['u16', 'u64'], {
      genericField1: 1,
      genericField2: 2n,
    }),
    twoGenericsReifiedObject: new WithTwoGenerics<Bar, Bar>([Bar.$typeName, Bar.$typeName], {
      genericField1: new Bar(100n),
      genericField2: new Bar(100n),
    }),
    twoGenericsNested: new WithTwoGenerics<Array<Bar>, WithTwoGenerics<number, number>>(
      [T, `${WithTwoGenerics.$typeName}<u8, u8>`],
      {
        genericField1: [new Bar(100n)],
        genericField2: new WithTwoGenerics<number, number>(['u8', 'u8'], {
          genericField1: 1,
          genericField2: 2,
        }),
      }
    ),
    twoGenericsReifiedNested: new WithTwoGenerics<Bar, WithTwoGenerics<number, number>>(
      [Bar.$typeName, `${WithTwoGenerics.$typeName}<u8, u8>`],
      {
        genericField1: new Bar(100n),
        genericField2: new WithTwoGenerics<number, number>(['u8', 'u8'], {
          genericField1: 1,
          genericField2: 2,
        }),
      }
    ),
    twoGenericsNestedVec: [
      new WithTwoGenerics<Bar, Array<WithTwoGenerics<Array<Bar>, number>>>(
        [Bar.$typeName, `vector<${WithTwoGenerics.$typeName}<${T}, u8>>`],
        {
          genericField1: new Bar(100n),
          genericField2: [
            new WithTwoGenerics<Array<Bar>, number>([T, 'u8'], {
              genericField1: [new Bar(100n)],
              genericField2: 1,
            }),
          ],
        }
      ),
    ],
    dummy: new Dummy(false),
    other: new StructFromOtherModule(false),
  })

  const de = bcs.de(`${Foo.$typeName}<${T}>`, foo.data.bcs.bcsBytes, 'base64')

  expect(Foo.fromFields(T, de)).toEqual(exp)

  expect(Foo.fromFieldsWithTypes(foo.data.content)).toEqual(exp)
})

it('decodes special-cased types correctly with fromFieldsWithTypes', async () => {
  const txb = new TransactionBlock()

  const encoder = new TextEncoder()

  createSpecial(txb, ['0x2::sui::SUI', 'u64'], {
    string: utf8(txb, Array.from(encoder.encode('string'))),
    asciiString: string(txb, Array.from(encoder.encode('ascii'))),
    url: newUnsafeFromBytes(txb, Array.from(encoder.encode('https://example.com'))),
    idField: idFromAddress(txb, 'faf60f9f9d1f6c490dce8673c1371b9df456e0c183f38524e5f78d959ea559a5'),
    uid: newUid(txb),
    balance: zero(txb, '0x2::sui::SUI'),
    option: some(txb, 'u64', 100n),
    optionObj: some(txb, Bar.$typeName, createBar(txb, 100n)),
    optionNone: none(txb, 'u64'),
    balanceGeneric: zero(txb, '0x2::sui::SUI'),
    optionGeneric: some(txb, 'u64', 200n),
    optionGenericNone: none(txb, 'u64'),
  })

  const res = await signer.signAndExecuteTransactionBlock({
    transactionBlock: txb,
    options: {
      showEffects: true,
    },
  })

  const id = res.effects!.created![0].reference.objectId

  const obj = await provider.getObject({
    id,
    options: {
      showBcs: true,
      showContent: true,
    },
  })

  if (obj.data?.bcs?.dataType !== 'moveObject' || obj.data?.content?.dataType !== 'moveObject') {
    throw new Error(`not a moveObject`)
  }

  const uid = obj.data.content.fields.uid.id

  expect(WithSpecialTypes.fromFieldsWithTypes(obj.data.content)).toEqual(
    new WithSpecialTypes(['0x2::sui::SUI', 'u64'], {
      id,
      string: 'string',
      asciiString: 'ascii',
      url: 'https://example.com',
      idField: '0xfaf60f9f9d1f6c490dce8673c1371b9df456e0c183f38524e5f78d959ea559a5',
      uid,
      balance: new Balance('0x2::sui::SUI', 0n),
      option: 100n,
      optionObj: new Bar(100n),
      optionNone: null,
      balanceGeneric: new Balance('0x2::sui::SUI', 0n),
      optionGeneric: 200n,
      optionGenericNone: null,
    })
  )
})

it('decodes special-cased types as generics correctly with fromFieldsWithTypes', async () => {
  const txb = new TransactionBlock()

  const encoder = new TextEncoder()

  createSpecialAsGenerics(
    txb,
    [
      '0x1::string::String',
      '0x1::ascii::String',
      '0x2::url::Url',
      '0x2::object::ID',
      '0x2::object::UID',
      '0x2::balance::Balance<0x2::sui::SUI>',
      '0x1::option::Option<u64>',
      '0x1::option::Option<u64>',
    ],
    {
      string: utf8(txb, Array.from(encoder.encode('string'))),
      asciiString: string(txb, Array.from(encoder.encode('ascii'))),
      url: newUnsafeFromBytes(txb, Array.from(encoder.encode('https://example.com'))),
      idField: idFromAddress(
        txb,
        'faf60f9f9d1f6c490dce8673c1371b9df456e0c183f38524e5f78d959ea559a5'
      ),
      uid: newUid(txb),
      balance: zero(txb, '0x2::sui::SUI'),
      option: some(txb, 'u64', 100n),
      optionNone: none(txb, 'u64'),
    }
  )

  const res = await signer.signAndExecuteTransactionBlock({
    transactionBlock: txb,
    options: {
      showEffects: true,
    },
  })

  const id = res.effects!.created![0].reference.objectId

  const obj = await provider.getObject({
    id,
    options: {
      showBcs: true,
      showContent: true,
    },
  })

  if (obj.data?.bcs?.dataType !== 'moveObject' || obj.data?.content?.dataType !== 'moveObject') {
    throw new Error(`not a moveObject`)
  }

  const uid = obj.data.content.fields.uid.id

  expect(WithSpecialTypesAsGenerics.fromFieldsWithTypes(obj.data.content)).toEqual(
    new WithSpecialTypesAsGenerics(
      [
        '0x1::string::String',
        '0x1::ascii::String',
        '0x2::url::Url',
        '0x2::object::ID',
        '0x2::object::UID',
        '0x2::balance::Balance<0x2::sui::SUI>',
        '0x1::option::Option<u64>',
        '0x1::option::Option<u64>',
      ],
      {
        id,
        string: 'string',
        asciiString: 'ascii',
        url: 'https://example.com',
        idField: '0xfaf60f9f9d1f6c490dce8673c1371b9df456e0c183f38524e5f78d959ea559a5',
        uid,
        balance: new Balance('0x2::sui::SUI', 0n),
        option: 100n,
        optionNone: null,
      }
    )
  )
})

it('calls function correctly when special types are used', async () => {
  const txb = new TransactionBlock()

  const encoder = new TextEncoder()

  createSpecial(
    txb,
    ['0x2::sui::SUI', 'vector<0x1::option::Option<0x1::option::Option<vector<vector<u64>>>>>'],
    {
      string: 'string',
      asciiString: 'ascii',
      url: newUnsafeFromBytes(txb, Array.from(encoder.encode('https://example.com'))),
      idField: idFromAddress(
        txb,
        '0xfaf60f9f9d1f6c490dce8673c1371b9df456e0c183f38524e5f78d959ea559a5'
      ),
      uid: newUid(txb),
      balance: zero(txb, '0x2::sui::SUI'),
      option: 100n,
      optionObj: some(txb, Bar.$typeName, createBar(txb, 100n)),
      optionNone: null,
      balanceGeneric: zero(txb, '0x2::sui::SUI'),
      optionGeneric: [[[200n, 300n]], null, [[400n, 500n]]],
      optionGenericNone: null,
    }
  )

  const res = await signer.signAndExecuteTransactionBlock({
    transactionBlock: txb,
    options: {
      showEffects: true,
    },
  })

  const id = res.effects!.created![0].reference.objectId

  const obj = await provider.getObject({
    id,
    options: {
      showBcs: true,
      showContent: true,
    },
  })

  if (obj.data?.bcs?.dataType !== 'moveObject' || obj.data?.content?.dataType !== 'moveObject') {
    throw new Error(`not a moveObject`)
  }

  expect(WithSpecialTypes.fromFieldsWithTypes(obj.data.content)).toEqual(
    new WithSpecialTypes(
      ['0x2::sui::SUI', 'vector<0x1::option::Option<0x1::option::Option<vector<vector<u64>>>>>'],
      {
        id,
        string: 'string',
        asciiString: 'ascii',
        url: 'https://example.com',
        idField: '0xfaf60f9f9d1f6c490dce8673c1371b9df456e0c183f38524e5f78d959ea559a5',
        uid: obj.data.content.fields.uid.id,
        balance: new Balance('0x2::sui::SUI', 0n),
        option: 100n,
        optionObj: new Bar(100n),
        optionNone: null,
        balanceGeneric: new Balance('0x2::sui::SUI', 0n),
        optionGeneric: [[[200n, 300n]], null, [[400n, 500n]]],
        optionGenericNone: null,
      }
    )
  )
})

it('calls function correctly when special types are used as generics', async () => {
  const txb = new TransactionBlock()

  const encoder = new TextEncoder()

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
      string: 'string',
      asciiString: 'ascii',
      url: newUnsafeFromBytes(txb, Array.from(encoder.encode('https://example.com'))),
      idField: idFromAddress(
        txb,
        '0xfaf60f9f9d1f6c490dce8673c1371b9df456e0c183f38524e5f78d959ea559a5'
      ),
      uid: newUid(txb),
      balance: zero(txb, '0x2::sui::SUI'),
      option: [5n, null, 3n],
      optionNone: null,
    }
  )

  const res = await signer.signAndExecuteTransactionBlock({
    transactionBlock: txb,
    options: {
      showEffects: true,
    },
  })

  const id = res.effects!.created![0].reference.objectId

  const obj = await provider.getObject({
    id,
    options: {
      showBcs: true,
      showContent: true,
    },
  })

  if (obj.data?.bcs?.dataType !== 'moveObject' || obj.data?.content?.dataType !== 'moveObject') {
    throw new Error(`not a moveObject`)
  }

  expect(WithSpecialTypesAsGenerics.fromFieldsWithTypes(obj.data.content)).toEqual(
    new WithSpecialTypesAsGenerics(
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
        id,
        string: 'string',
        asciiString: 'ascii',
        url: 'https://example.com',
        idField: '0xfaf60f9f9d1f6c490dce8673c1371b9df456e0c183f38524e5f78d959ea559a5',
        uid: obj.data.content.fields.uid.id,
        balance: new Balance('0x2::sui::SUI', 0n),
        option: [5n, null, 3n],
        optionNone: null,
      }
    )
  )
})

it('calls function correctly when special types are used as as vectors', async () => {
  const txb = new TransactionBlock()

  createSpecialInVectors(txb, 'vector<u64>', {
    string: ['string'],
    asciiString: ['ascii'],
    idField: ['0x0', '0x1'],
    bar: [createBar(txb, 100n)],
    option: [5n, 1n, 3n],
    optionGeneric: [[5n], null],
  })

  const res = await signer.signAndExecuteTransactionBlock({
    transactionBlock: txb,
    options: {
      showEffects: true,
    },
  })

  const id = res.effects!.created![0].reference.objectId

  const obj = await provider.getObject({
    id,
    options: {
      showBcs: true,
      showContent: true,
    },
  })

  if (obj.data?.bcs?.dataType !== 'moveObject' || obj.data?.content?.dataType !== 'moveObject') {
    throw new Error(`not a moveObject`)
  }

  expect(WithSpecialTypesInVectors.fromFieldsWithTypes(obj.data.content)).toEqual(
    new WithSpecialTypesInVectors('vector<u64>', {
      id,
      string: ['string'],
      asciiString: ['ascii'],
      idField: [
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000001',
      ],
      bar: [new Bar(100n)],
      option: [5n, 1n, 3n],
      optionGeneric: [[5n], null],
    })
  )
})
