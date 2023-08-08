import { String as String1 } from '../../_dependencies/onchain/0x1/ascii/structs'
import { Option } from '../../_dependencies/onchain/0x1/option/structs'
import { String } from '../../_dependencies/onchain/0x1/string/structs'
import { Balance } from '../../_dependencies/onchain/0x2/balance/structs'
import { ID, UID } from '../../_dependencies/onchain/0x2/object/structs'
import { Url } from '../../_dependencies/onchain/0x2/url/structs'
import { bcsOnchain as bcs } from '../../_framework/bcs'
import { initLoaderIfNeeded } from '../../_framework/init-onchain'
import { structClassLoaderOnchain } from '../../_framework/loader'
import { FieldsWithTypes, Type, parseTypeName } from '../../_framework/util'
import { StructFromOtherModule } from '../other-module/structs'
import { Encoding } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== Dummy =============================== */

bcs.registerStructType(
  '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::Dummy',
  {
    dummy_field: `bool`,
  }
)

export function isDummy(type: Type): boolean {
  return (
    type === '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::Dummy'
  )
}

export interface DummyFields {
  dummyField: boolean
}

export class Dummy {
  static readonly $typeName =
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::Dummy'
  static readonly $numTypeParams = 0

  readonly dummyField: boolean

  constructor(dummyField: boolean) {
    this.dummyField = dummyField
  }

  static fromFields(fields: Record<string, any>): Dummy {
    return new Dummy(fields.dummy_field)
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Dummy {
    if (!isDummy(item.type)) {
      throw new Error('not a Dummy type')
    }
    return new Dummy(item.fields.dummy_field)
  }

  static fromBcs(data: Uint8Array | string, encoding?: Encoding): Dummy {
    return Dummy.fromFields(bcs.de([Dummy.$typeName], data, encoding))
  }
}

/* ============================== WithGenericField =============================== */

bcs.registerStructType(
  '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithGenericField<T0>',
  {
    id: `0x2::object::UID`,
    generic_field: `T0`,
  }
)

export function isWithGenericField(type: Type): boolean {
  return type.startsWith(
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithGenericField<'
  )
}

export interface WithGenericFieldFields<T0> {
  id: string
  genericField: T0
}

export class WithGenericField<T0> {
  static readonly $typeName =
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithGenericField'
  static readonly $numTypeParams = 1

  readonly $typeArg: Type

  readonly id: string
  readonly genericField: T0

  constructor(typeArg: Type, fields: WithGenericFieldFields<T0>) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.genericField = fields.genericField
  }

  static fromFields<T0>(typeArg: Type, fields: Record<string, any>): WithGenericField<T0> {
    initLoaderIfNeeded()

    return new WithGenericField(typeArg, {
      id: UID.fromFields(fields.id).id,
      genericField: structClassLoaderOnchain.fromFields(typeArg, fields.generic_field),
    })
  }

  static fromFieldsWithTypes<T0>(item: FieldsWithTypes): WithGenericField<T0> {
    initLoaderIfNeeded()

    if (!isWithGenericField(item.type)) {
      throw new Error('not a WithGenericField type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new WithGenericField(typeArgs[0], {
      id: item.fields.id.id,
      genericField: structClassLoaderOnchain.fromFieldsWithTypes(
        typeArgs[0],
        item.fields.generic_field
      ),
    })
  }

  static fromBcs<T0>(
    typeArg: Type,
    data: Uint8Array | string,
    encoding?: Encoding
  ): WithGenericField<T0> {
    return WithGenericField.fromFields(
      typeArg,
      bcs.de([WithGenericField.$typeName, typeArg], data, encoding)
    )
  }

  static fromSuiParsedData(content: SuiParsedData) {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isWithGenericField(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a WithGenericField object`)
    }
    return WithGenericField.fromFieldsWithTypes(content)
  }

  static async fetch<T0>(client: SuiClient, id: string): Promise<WithGenericField<T0>> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching WithGenericField object at id ${id}: ${res.error.code}`)
    }
    if (
      res.data?.content?.dataType !== 'moveObject' ||
      !isWithGenericField(res.data.content.type)
    ) {
      throw new Error(`object at id ${id} is not a WithGenericField object`)
    }
    return WithGenericField.fromFieldsWithTypes(res.data.content)
  }
}

/* ============================== Bar =============================== */

bcs.registerStructType(
  '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::Bar',
  {
    value: `u64`,
  }
)

export function isBar(type: Type): boolean {
  return type === '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::Bar'
}

export interface BarFields {
  value: bigint
}

export class Bar {
  static readonly $typeName =
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::Bar'
  static readonly $numTypeParams = 0

  readonly value: bigint

  constructor(value: bigint) {
    this.value = value
  }

  static fromFields(fields: Record<string, any>): Bar {
    return new Bar(BigInt(fields.value))
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Bar {
    if (!isBar(item.type)) {
      throw new Error('not a Bar type')
    }
    return new Bar(BigInt(item.fields.value))
  }

  static fromBcs(data: Uint8Array | string, encoding?: Encoding): Bar {
    return Bar.fromFields(bcs.de([Bar.$typeName], data, encoding))
  }
}

/* ============================== WithTwoGenerics =============================== */

bcs.registerStructType(
  '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithTwoGenerics<T0, T1>',
  {
    generic_field_1: `T0`,
    generic_field_2: `T1`,
  }
)

export function isWithTwoGenerics(type: Type): boolean {
  return type.startsWith(
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithTwoGenerics<'
  )
}

export interface WithTwoGenericsFields<T0, T1> {
  genericField1: T0
  genericField2: T1
}

export class WithTwoGenerics<T0, T1> {
  static readonly $typeName =
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithTwoGenerics'
  static readonly $numTypeParams = 2

  readonly $typeArgs: [Type, Type]

  readonly genericField1: T0
  readonly genericField2: T1

  constructor(typeArgs: [Type, Type], fields: WithTwoGenericsFields<T0, T1>) {
    this.$typeArgs = typeArgs

    this.genericField1 = fields.genericField1
    this.genericField2 = fields.genericField2
  }

  static fromFields<T0, T1>(
    typeArgs: [Type, Type],
    fields: Record<string, any>
  ): WithTwoGenerics<T0, T1> {
    initLoaderIfNeeded()

    return new WithTwoGenerics(typeArgs, {
      genericField1: structClassLoaderOnchain.fromFields(typeArgs[0], fields.generic_field_1),
      genericField2: structClassLoaderOnchain.fromFields(typeArgs[1], fields.generic_field_2),
    })
  }

  static fromFieldsWithTypes<T0, T1>(item: FieldsWithTypes): WithTwoGenerics<T0, T1> {
    initLoaderIfNeeded()

    if (!isWithTwoGenerics(item.type)) {
      throw new Error('not a WithTwoGenerics type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new WithTwoGenerics([typeArgs[0], typeArgs[1]], {
      genericField1: structClassLoaderOnchain.fromFieldsWithTypes(
        typeArgs[0],
        item.fields.generic_field_1
      ),
      genericField2: structClassLoaderOnchain.fromFieldsWithTypes(
        typeArgs[1],
        item.fields.generic_field_2
      ),
    })
  }

  static fromBcs<T0, T1>(
    typeArgs: [Type, Type],
    data: Uint8Array | string,
    encoding?: Encoding
  ): WithTwoGenerics<T0, T1> {
    return WithTwoGenerics.fromFields(
      typeArgs,
      bcs.de([WithTwoGenerics.$typeName, ...typeArgs], data, encoding)
    )
  }
}

/* ============================== Foo =============================== */

bcs.registerStructType(
  '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::Foo<T0>',
  {
    id: `0x2::object::UID`,
    generic: `T0`,
    reified_primitive_vec: `vector<u64>`,
    reified_object_vec: `vector<0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::Bar>`,
    generic_vec: `vector<T0>`,
    generic_vec_nested: `vector<0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithTwoGenerics<T0, u8>>`,
    two_generics: `0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithTwoGenerics<T0, 0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::Bar>`,
    two_generics_reified_primitive: `0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithTwoGenerics<u16, u64>`,
    two_generics_reified_object: `0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithTwoGenerics<0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::Bar, 0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::Bar>`,
    two_generics_nested: `0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithTwoGenerics<T0, 0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithTwoGenerics<u8, u8>>`,
    two_generics_reified_nested: `0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithTwoGenerics<0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::Bar, 0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithTwoGenerics<u8, u8>>`,
    two_generics_nested_vec: `vector<0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithTwoGenerics<0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::Bar, vector<0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithTwoGenerics<T0, u8>>>>`,
    dummy: `0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::Dummy`,
    other: `0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::other_module::StructFromOtherModule`,
  }
)

export function isFoo(type: Type): boolean {
  return type.startsWith(
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::Foo<'
  )
}

export interface FooFields<T0> {
  id: string
  generic: T0
  reifiedPrimitiveVec: Array<bigint>
  reifiedObjectVec: Array<Bar>
  genericVec: Array<T0>
  genericVecNested: Array<WithTwoGenerics<T0, number>>
  twoGenerics: WithTwoGenerics<T0, Bar>
  twoGenericsReifiedPrimitive: WithTwoGenerics<number, bigint>
  twoGenericsReifiedObject: WithTwoGenerics<Bar, Bar>
  twoGenericsNested: WithTwoGenerics<T0, WithTwoGenerics<number, number>>
  twoGenericsReifiedNested: WithTwoGenerics<Bar, WithTwoGenerics<number, number>>
  twoGenericsNestedVec: Array<WithTwoGenerics<Bar, Array<WithTwoGenerics<T0, number>>>>
  dummy: Dummy
  other: StructFromOtherModule
}

export class Foo<T0> {
  static readonly $typeName =
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::Foo'
  static readonly $numTypeParams = 1

  readonly $typeArg: Type

  readonly id: string
  readonly generic: T0
  readonly reifiedPrimitiveVec: Array<bigint>
  readonly reifiedObjectVec: Array<Bar>
  readonly genericVec: Array<T0>
  readonly genericVecNested: Array<WithTwoGenerics<T0, number>>
  readonly twoGenerics: WithTwoGenerics<T0, Bar>
  readonly twoGenericsReifiedPrimitive: WithTwoGenerics<number, bigint>
  readonly twoGenericsReifiedObject: WithTwoGenerics<Bar, Bar>
  readonly twoGenericsNested: WithTwoGenerics<T0, WithTwoGenerics<number, number>>
  readonly twoGenericsReifiedNested: WithTwoGenerics<Bar, WithTwoGenerics<number, number>>
  readonly twoGenericsNestedVec: Array<WithTwoGenerics<Bar, Array<WithTwoGenerics<T0, number>>>>
  readonly dummy: Dummy
  readonly other: StructFromOtherModule

  constructor(typeArg: Type, fields: FooFields<T0>) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.generic = fields.generic
    this.reifiedPrimitiveVec = fields.reifiedPrimitiveVec
    this.reifiedObjectVec = fields.reifiedObjectVec
    this.genericVec = fields.genericVec
    this.genericVecNested = fields.genericVecNested
    this.twoGenerics = fields.twoGenerics
    this.twoGenericsReifiedPrimitive = fields.twoGenericsReifiedPrimitive
    this.twoGenericsReifiedObject = fields.twoGenericsReifiedObject
    this.twoGenericsNested = fields.twoGenericsNested
    this.twoGenericsReifiedNested = fields.twoGenericsReifiedNested
    this.twoGenericsNestedVec = fields.twoGenericsNestedVec
    this.dummy = fields.dummy
    this.other = fields.other
  }

  static fromFields<T0>(typeArg: Type, fields: Record<string, any>): Foo<T0> {
    initLoaderIfNeeded()

    return new Foo(typeArg, {
      id: UID.fromFields(fields.id).id,
      generic: structClassLoaderOnchain.fromFields(typeArg, fields.generic),
      reifiedPrimitiveVec: fields.reified_primitive_vec.map((item: any) => BigInt(item)),
      reifiedObjectVec: fields.reified_object_vec.map((item: any) => Bar.fromFields(item)),
      genericVec: fields.generic_vec.map((item: any) =>
        structClassLoaderOnchain.fromFields(typeArg, item)
      ),
      genericVecNested: fields.generic_vec_nested.map((item: any) =>
        WithTwoGenerics.fromFields<T0, number>([`${typeArg}`, `u8`], item)
      ),
      twoGenerics: WithTwoGenerics.fromFields<T0, Bar>(
        [
          `${typeArg}`,
          `0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::Bar`,
        ],
        fields.two_generics
      ),
      twoGenericsReifiedPrimitive: WithTwoGenerics.fromFields<number, bigint>(
        [`u16`, `u64`],
        fields.two_generics_reified_primitive
      ),
      twoGenericsReifiedObject: WithTwoGenerics.fromFields<Bar, Bar>(
        [
          `0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::Bar`,
          `0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::Bar`,
        ],
        fields.two_generics_reified_object
      ),
      twoGenericsNested: WithTwoGenerics.fromFields<T0, WithTwoGenerics<number, number>>(
        [
          `${typeArg}`,
          `0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithTwoGenerics<u8, u8>`,
        ],
        fields.two_generics_nested
      ),
      twoGenericsReifiedNested: WithTwoGenerics.fromFields<Bar, WithTwoGenerics<number, number>>(
        [
          `0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::Bar`,
          `0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithTwoGenerics<u8, u8>`,
        ],
        fields.two_generics_reified_nested
      ),
      twoGenericsNestedVec: fields.two_generics_nested_vec.map((item: any) =>
        WithTwoGenerics.fromFields<Bar, Array<WithTwoGenerics<T0, number>>>(
          [
            `0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::Bar`,
            `vector<0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithTwoGenerics<${typeArg}, u8>>`,
          ],
          item
        )
      ),
      dummy: Dummy.fromFields(fields.dummy),
      other: StructFromOtherModule.fromFields(fields.other),
    })
  }

  static fromFieldsWithTypes<T0>(item: FieldsWithTypes): Foo<T0> {
    initLoaderIfNeeded()

    if (!isFoo(item.type)) {
      throw new Error('not a Foo type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new Foo(typeArgs[0], {
      id: item.fields.id.id,
      generic: structClassLoaderOnchain.fromFieldsWithTypes(typeArgs[0], item.fields.generic),
      reifiedPrimitiveVec: item.fields.reified_primitive_vec.map((item: any) => BigInt(item)),
      reifiedObjectVec: item.fields.reified_object_vec.map((item: any) =>
        Bar.fromFieldsWithTypes(item)
      ),
      genericVec: item.fields.generic_vec.map((item: any) =>
        structClassLoaderOnchain.fromFieldsWithTypes(typeArgs[0], item)
      ),
      genericVecNested: item.fields.generic_vec_nested.map((item: any) =>
        WithTwoGenerics.fromFieldsWithTypes<T0, number>(item)
      ),
      twoGenerics: WithTwoGenerics.fromFieldsWithTypes<T0, Bar>(item.fields.two_generics),
      twoGenericsReifiedPrimitive: WithTwoGenerics.fromFieldsWithTypes<number, bigint>(
        item.fields.two_generics_reified_primitive
      ),
      twoGenericsReifiedObject: WithTwoGenerics.fromFieldsWithTypes<Bar, Bar>(
        item.fields.two_generics_reified_object
      ),
      twoGenericsNested: WithTwoGenerics.fromFieldsWithTypes<T0, WithTwoGenerics<number, number>>(
        item.fields.two_generics_nested
      ),
      twoGenericsReifiedNested: WithTwoGenerics.fromFieldsWithTypes<
        Bar,
        WithTwoGenerics<number, number>
      >(item.fields.two_generics_reified_nested),
      twoGenericsNestedVec: item.fields.two_generics_nested_vec.map((item: any) =>
        WithTwoGenerics.fromFieldsWithTypes<Bar, Array<WithTwoGenerics<T0, number>>>(item)
      ),
      dummy: Dummy.fromFieldsWithTypes(item.fields.dummy),
      other: StructFromOtherModule.fromFieldsWithTypes(item.fields.other),
    })
  }

  static fromBcs<T0>(typeArg: Type, data: Uint8Array | string, encoding?: Encoding): Foo<T0> {
    return Foo.fromFields(typeArg, bcs.de([Foo.$typeName, typeArg], data, encoding))
  }

  static fromSuiParsedData(content: SuiParsedData) {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isFoo(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Foo object`)
    }
    return Foo.fromFieldsWithTypes(content)
  }

  static async fetch<T0>(client: SuiClient, id: string): Promise<Foo<T0>> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching Foo object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isFoo(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a Foo object`)
    }
    return Foo.fromFieldsWithTypes(res.data.content)
  }
}

/* ============================== WithSpecialTypes =============================== */

bcs.registerStructType(
  '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithSpecialTypes<T0, T1>',
  {
    id: `0x2::object::UID`,
    string: `0x1::string::String`,
    ascii_string: `0x1::ascii::String`,
    url: `0x2::url::Url`,
    id_field: `0x2::object::ID`,
    uid: `0x2::object::UID`,
    balance: `0x2::balance::Balance<0x2::sui::SUI>`,
    option: `0x1::option::Option<u64>`,
    option_obj: `0x1::option::Option<0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::Bar>`,
    option_none: `0x1::option::Option<u64>`,
    balance_generic: `0x2::balance::Balance<T0>`,
    option_generic: `0x1::option::Option<T1>`,
    option_generic_none: `0x1::option::Option<T1>`,
  }
)

export function isWithSpecialTypes(type: Type): boolean {
  return type.startsWith(
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithSpecialTypes<'
  )
}

export interface WithSpecialTypesFields<T1> {
  id: string
  string: string
  asciiString: string
  url: string
  idField: string
  uid: string
  balance: Balance
  option: bigint | null
  optionObj: Bar | null
  optionNone: bigint | null
  balanceGeneric: Balance
  optionGeneric: T1 | null
  optionGenericNone: T1 | null
}

export class WithSpecialTypes<T1> {
  static readonly $typeName =
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithSpecialTypes'
  static readonly $numTypeParams = 2

  readonly $typeArgs: [Type, Type]

  readonly id: string
  readonly string: string
  readonly asciiString: string
  readonly url: string
  readonly idField: string
  readonly uid: string
  readonly balance: Balance
  readonly option: bigint | null
  readonly optionObj: Bar | null
  readonly optionNone: bigint | null
  readonly balanceGeneric: Balance
  readonly optionGeneric: T1 | null
  readonly optionGenericNone: T1 | null

  constructor(typeArgs: [Type, Type], fields: WithSpecialTypesFields<T1>) {
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.string = fields.string
    this.asciiString = fields.asciiString
    this.url = fields.url
    this.idField = fields.idField
    this.uid = fields.uid
    this.balance = fields.balance
    this.option = fields.option
    this.optionObj = fields.optionObj
    this.optionNone = fields.optionNone
    this.balanceGeneric = fields.balanceGeneric
    this.optionGeneric = fields.optionGeneric
    this.optionGenericNone = fields.optionGenericNone
  }

  static fromFields<T1>(typeArgs: [Type, Type], fields: Record<string, any>): WithSpecialTypes<T1> {
    initLoaderIfNeeded()

    return new WithSpecialTypes(typeArgs, {
      id: UID.fromFields(fields.id).id,
      string: new TextDecoder()
        .decode(Uint8Array.from(String.fromFields(fields.string).bytes))
        .toString(),
      asciiString: new TextDecoder()
        .decode(Uint8Array.from(String1.fromFields(fields.ascii_string).bytes))
        .toString(),
      url: Url.fromFields(fields.url).url,
      idField: ID.fromFields(fields.id_field).bytes,
      uid: UID.fromFields(fields.uid).id,
      balance: Balance.fromFields(`0x2::sui::SUI`, fields.balance),
      option: Option.fromFields<bigint>(`u64`, fields.option).vec[0] || null,
      optionObj:
        Option.fromFields<Bar>(
          `0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::Bar`,
          fields.option_obj
        ).vec[0] || null,
      optionNone: Option.fromFields<bigint>(`u64`, fields.option_none).vec[0] || null,
      balanceGeneric: Balance.fromFields(`${typeArgs[0]}`, fields.balance_generic),
      optionGeneric: Option.fromFields<T1>(`${typeArgs[1]}`, fields.option_generic).vec[0] || null,
      optionGenericNone:
        Option.fromFields<T1>(`${typeArgs[1]}`, fields.option_generic_none).vec[0] || null,
    })
  }

  static fromFieldsWithTypes<T1>(item: FieldsWithTypes): WithSpecialTypes<T1> {
    initLoaderIfNeeded()

    if (!isWithSpecialTypes(item.type)) {
      throw new Error('not a WithSpecialTypes type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new WithSpecialTypes([typeArgs[0], typeArgs[1]], {
      id: item.fields.id.id,
      string: item.fields.string,
      asciiString: item.fields.ascii_string,
      url: item.fields.url,
      idField: item.fields.id_field,
      uid: item.fields.uid.id,
      balance: new Balance(`0x2::sui::SUI`, BigInt(item.fields.balance)),
      option:
        item.fields.option !== null
          ? Option.fromFieldsWithTypes<bigint>({
              type: '0x1::option::Option<' + `u64` + '>',
              fields: { vec: [item.fields.option] },
            }).vec[0]
          : null,
      optionObj:
        item.fields.option_obj !== null
          ? Option.fromFieldsWithTypes<Bar>({
              type:
                '0x1::option::Option<' +
                `0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::Bar` +
                '>',
              fields: { vec: [item.fields.option_obj] },
            }).vec[0]
          : null,
      optionNone:
        item.fields.option_none !== null
          ? Option.fromFieldsWithTypes<bigint>({
              type: '0x1::option::Option<' + `u64` + '>',
              fields: { vec: [item.fields.option_none] },
            }).vec[0]
          : null,
      balanceGeneric: new Balance(`${typeArgs[0]}`, BigInt(item.fields.balance_generic)),
      optionGeneric:
        item.fields.option_generic !== null
          ? Option.fromFieldsWithTypes<T1>({
              type: '0x1::option::Option<' + `${typeArgs[1]}` + '>',
              fields: { vec: [item.fields.option_generic] },
            }).vec[0]
          : null,
      optionGenericNone:
        item.fields.option_generic_none !== null
          ? Option.fromFieldsWithTypes<T1>({
              type: '0x1::option::Option<' + `${typeArgs[1]}` + '>',
              fields: { vec: [item.fields.option_generic_none] },
            }).vec[0]
          : null,
    })
  }

  static fromBcs<T1>(
    typeArgs: [Type, Type],
    data: Uint8Array | string,
    encoding?: Encoding
  ): WithSpecialTypes<T1> {
    return WithSpecialTypes.fromFields(
      typeArgs,
      bcs.de([WithSpecialTypes.$typeName, ...typeArgs], data, encoding)
    )
  }

  static fromSuiParsedData(content: SuiParsedData) {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isWithSpecialTypes(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a WithSpecialTypes object`)
    }
    return WithSpecialTypes.fromFieldsWithTypes(content)
  }

  static async fetch<T1>(client: SuiClient, id: string): Promise<WithSpecialTypes<T1>> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching WithSpecialTypes object at id ${id}: ${res.error.code}`)
    }
    if (
      res.data?.content?.dataType !== 'moveObject' ||
      !isWithSpecialTypes(res.data.content.type)
    ) {
      throw new Error(`object at id ${id} is not a WithSpecialTypes object`)
    }
    return WithSpecialTypes.fromFieldsWithTypes(res.data.content)
  }
}

/* ============================== WithSpecialTypesAsGenerics =============================== */

bcs.registerStructType(
  '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithSpecialTypesAsGenerics<T0, T1, T2, T3, T4, T5, T6, T7>',
  {
    id: `0x2::object::UID`,
    string: `T0`,
    ascii_string: `T1`,
    url: `T2`,
    id_field: `T3`,
    uid: `T4`,
    balance: `T5`,
    option: `T6`,
    option_none: `T7`,
  }
)

export function isWithSpecialTypesAsGenerics(type: Type): boolean {
  return type.startsWith(
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithSpecialTypesAsGenerics<'
  )
}

export interface WithSpecialTypesAsGenericsFields<T0, T1, T2, T3, T4, T5, T6, T7> {
  id: string
  string: T0
  asciiString: T1
  url: T2
  idField: T3
  uid: T4
  balance: T5
  option: T6
  optionNone: T7
}

export class WithSpecialTypesAsGenerics<T0, T1, T2, T3, T4, T5, T6, T7> {
  static readonly $typeName =
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithSpecialTypesAsGenerics'
  static readonly $numTypeParams = 8

  readonly $typeArgs: [Type, Type, Type, Type, Type, Type, Type, Type]

  readonly id: string
  readonly string: T0
  readonly asciiString: T1
  readonly url: T2
  readonly idField: T3
  readonly uid: T4
  readonly balance: T5
  readonly option: T6
  readonly optionNone: T7

  constructor(
    typeArgs: [Type, Type, Type, Type, Type, Type, Type, Type],
    fields: WithSpecialTypesAsGenericsFields<T0, T1, T2, T3, T4, T5, T6, T7>
  ) {
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.string = fields.string
    this.asciiString = fields.asciiString
    this.url = fields.url
    this.idField = fields.idField
    this.uid = fields.uid
    this.balance = fields.balance
    this.option = fields.option
    this.optionNone = fields.optionNone
  }

  static fromFields<T0, T1, T2, T3, T4, T5, T6, T7>(
    typeArgs: [Type, Type, Type, Type, Type, Type, Type, Type],
    fields: Record<string, any>
  ): WithSpecialTypesAsGenerics<T0, T1, T2, T3, T4, T5, T6, T7> {
    initLoaderIfNeeded()

    return new WithSpecialTypesAsGenerics(typeArgs, {
      id: UID.fromFields(fields.id).id,
      string: structClassLoaderOnchain.fromFields(typeArgs[0], fields.string),
      asciiString: structClassLoaderOnchain.fromFields(typeArgs[1], fields.ascii_string),
      url: structClassLoaderOnchain.fromFields(typeArgs[2], fields.url),
      idField: structClassLoaderOnchain.fromFields(typeArgs[3], fields.id_field),
      uid: structClassLoaderOnchain.fromFields(typeArgs[4], fields.uid),
      balance: structClassLoaderOnchain.fromFields(typeArgs[5], fields.balance),
      option: structClassLoaderOnchain.fromFields(typeArgs[6], fields.option),
      optionNone: structClassLoaderOnchain.fromFields(typeArgs[7], fields.option_none),
    })
  }

  static fromFieldsWithTypes<T0, T1, T2, T3, T4, T5, T6, T7>(
    item: FieldsWithTypes
  ): WithSpecialTypesAsGenerics<T0, T1, T2, T3, T4, T5, T6, T7> {
    initLoaderIfNeeded()

    if (!isWithSpecialTypesAsGenerics(item.type)) {
      throw new Error('not a WithSpecialTypesAsGenerics type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new WithSpecialTypesAsGenerics(
      [
        typeArgs[0],
        typeArgs[1],
        typeArgs[2],
        typeArgs[3],
        typeArgs[4],
        typeArgs[5],
        typeArgs[6],
        typeArgs[7],
      ],
      {
        id: item.fields.id.id,
        string: structClassLoaderOnchain.fromFieldsWithTypes(typeArgs[0], item.fields.string),
        asciiString: structClassLoaderOnchain.fromFieldsWithTypes(
          typeArgs[1],
          item.fields.ascii_string
        ),
        url: structClassLoaderOnchain.fromFieldsWithTypes(typeArgs[2], item.fields.url),
        idField: structClassLoaderOnchain.fromFieldsWithTypes(typeArgs[3], item.fields.id_field),
        uid: structClassLoaderOnchain.fromFieldsWithTypes(typeArgs[4], item.fields.uid),
        balance: structClassLoaderOnchain.fromFieldsWithTypes(typeArgs[5], item.fields.balance),
        option: structClassLoaderOnchain.fromFieldsWithTypes(typeArgs[6], item.fields.option),
        optionNone: structClassLoaderOnchain.fromFieldsWithTypes(
          typeArgs[7],
          item.fields.option_none
        ),
      }
    )
  }

  static fromBcs<T0, T1, T2, T3, T4, T5, T6, T7>(
    typeArgs: [Type, Type, Type, Type, Type, Type, Type, Type],
    data: Uint8Array | string,
    encoding?: Encoding
  ): WithSpecialTypesAsGenerics<T0, T1, T2, T3, T4, T5, T6, T7> {
    return WithSpecialTypesAsGenerics.fromFields(
      typeArgs,
      bcs.de([WithSpecialTypesAsGenerics.$typeName, ...typeArgs], data, encoding)
    )
  }

  static fromSuiParsedData(content: SuiParsedData) {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isWithSpecialTypesAsGenerics(content.type)) {
      throw new Error(
        `object at ${(content.fields as any).id} is not a WithSpecialTypesAsGenerics object`
      )
    }
    return WithSpecialTypesAsGenerics.fromFieldsWithTypes(content)
  }

  static async fetch<T0, T1, T2, T3, T4, T5, T6, T7>(
    client: SuiClient,
    id: string
  ): Promise<WithSpecialTypesAsGenerics<T0, T1, T2, T3, T4, T5, T6, T7>> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(
        `error fetching WithSpecialTypesAsGenerics object at id ${id}: ${res.error.code}`
      )
    }
    if (
      res.data?.content?.dataType !== 'moveObject' ||
      !isWithSpecialTypesAsGenerics(res.data.content.type)
    ) {
      throw new Error(`object at id ${id} is not a WithSpecialTypesAsGenerics object`)
    }
    return WithSpecialTypesAsGenerics.fromFieldsWithTypes(res.data.content)
  }
}

/* ============================== WithSpecialTypesInVectors =============================== */

bcs.registerStructType(
  '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithSpecialTypesInVectors<T0>',
  {
    id: `0x2::object::UID`,
    string: `vector<0x1::string::String>`,
    ascii_string: `vector<0x1::ascii::String>`,
    id_field: `vector<0x2::object::ID>`,
    bar: `vector<0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::Bar>`,
    option: `vector<0x1::option::Option<u64>>`,
    option_generic: `vector<0x1::option::Option<T0>>`,
  }
)

export function isWithSpecialTypesInVectors(type: Type): boolean {
  return type.startsWith(
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithSpecialTypesInVectors<'
  )
}

export interface WithSpecialTypesInVectorsFields<T0> {
  id: string
  string: Array<string>
  asciiString: Array<string>
  idField: Array<string>
  bar: Array<Bar>
  option: Array<bigint | null>
  optionGeneric: Array<T0 | null>
}

export class WithSpecialTypesInVectors<T0> {
  static readonly $typeName =
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithSpecialTypesInVectors'
  static readonly $numTypeParams = 1

  readonly $typeArg: Type

  readonly id: string
  readonly string: Array<string>
  readonly asciiString: Array<string>
  readonly idField: Array<string>
  readonly bar: Array<Bar>
  readonly option: Array<bigint | null>
  readonly optionGeneric: Array<T0 | null>

  constructor(typeArg: Type, fields: WithSpecialTypesInVectorsFields<T0>) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.string = fields.string
    this.asciiString = fields.asciiString
    this.idField = fields.idField
    this.bar = fields.bar
    this.option = fields.option
    this.optionGeneric = fields.optionGeneric
  }

  static fromFields<T0>(typeArg: Type, fields: Record<string, any>): WithSpecialTypesInVectors<T0> {
    initLoaderIfNeeded()

    return new WithSpecialTypesInVectors(typeArg, {
      id: UID.fromFields(fields.id).id,
      string: fields.string.map((item: any) =>
        new TextDecoder().decode(Uint8Array.from(String.fromFields(item).bytes)).toString()
      ),
      asciiString: fields.ascii_string.map((item: any) =>
        new TextDecoder().decode(Uint8Array.from(String1.fromFields(item).bytes)).toString()
      ),
      idField: fields.id_field.map((item: any) => ID.fromFields(item).bytes),
      bar: fields.bar.map((item: any) => Bar.fromFields(item)),
      option: fields.option.map(
        (item: any) => Option.fromFields<bigint>(`u64`, item).vec[0] || null
      ),
      optionGeneric: fields.option_generic.map(
        (item: any) => Option.fromFields<T0>(`${typeArg}`, item).vec[0] || null
      ),
    })
  }

  static fromFieldsWithTypes<T0>(item: FieldsWithTypes): WithSpecialTypesInVectors<T0> {
    initLoaderIfNeeded()

    if (!isWithSpecialTypesInVectors(item.type)) {
      throw new Error('not a WithSpecialTypesInVectors type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new WithSpecialTypesInVectors(typeArgs[0], {
      id: item.fields.id.id,
      string: item.fields.string.map((item: any) => item),
      asciiString: item.fields.ascii_string.map((item: any) => item),
      idField: item.fields.id_field.map((item: any) => item),
      bar: item.fields.bar.map((item: any) => Bar.fromFieldsWithTypes(item)),
      option: item.fields.option.map((item: any) =>
        item !== null
          ? Option.fromFieldsWithTypes<bigint>({
              type: '0x1::option::Option<' + `u64` + '>',
              fields: { vec: [item] },
            }).vec[0]
          : null
      ),
      optionGeneric: item.fields.option_generic.map((item: any) =>
        item !== null
          ? Option.fromFieldsWithTypes<T0>({
              type: '0x1::option::Option<' + `${typeArgs[0]}` + '>',
              fields: { vec: [item] },
            }).vec[0]
          : null
      ),
    })
  }

  static fromBcs<T0>(
    typeArg: Type,
    data: Uint8Array | string,
    encoding?: Encoding
  ): WithSpecialTypesInVectors<T0> {
    return WithSpecialTypesInVectors.fromFields(
      typeArg,
      bcs.de([WithSpecialTypesInVectors.$typeName, typeArg], data, encoding)
    )
  }

  static fromSuiParsedData(content: SuiParsedData) {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isWithSpecialTypesInVectors(content.type)) {
      throw new Error(
        `object at ${(content.fields as any).id} is not a WithSpecialTypesInVectors object`
      )
    }
    return WithSpecialTypesInVectors.fromFieldsWithTypes(content)
  }

  static async fetch<T0>(client: SuiClient, id: string): Promise<WithSpecialTypesInVectors<T0>> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(
        `error fetching WithSpecialTypesInVectors object at id ${id}: ${res.error.code}`
      )
    }
    if (
      res.data?.content?.dataType !== 'moveObject' ||
      !isWithSpecialTypesInVectors(res.data.content.type)
    ) {
      throw new Error(`object at id ${id} is not a WithSpecialTypesInVectors object`)
    }
    return WithSpecialTypesInVectors.fromFieldsWithTypes(res.data.content)
  }
}
