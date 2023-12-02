import { initLoaderIfNeeded } from '../../_framework/init-source'
import { structClassLoaderSource } from '../../_framework/loader'
import { FieldsWithTypes, Type, compressSuiType, parseTypeName } from '../../_framework/util'
import { String as String1 } from '../../move-stdlib/ascii/structs'
import { Option } from '../../move-stdlib/option/structs'
import { String } from '../../move-stdlib/string/structs'
import { Balance } from '../../sui/balance/structs'
import { ID, UID } from '../../sui/object/structs'
import { Url } from '../../sui/url/structs'
import { StructFromOtherModule } from '../other-module/structs'
import { BcsType, bcs } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== Bar =============================== */

export function isBar(type: Type): boolean {
  type = compressSuiType(type)
  return type === '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::Bar'
}

export interface BarFields {
  value: bigint
}

export class Bar {
  static readonly $typeName =
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::Bar'
  static readonly $numTypeParams = 0

  static get bcs() {
    return bcs.struct('Bar', {
      value: bcs.u64(),
    })
  }

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

  static fromBcs(data: Uint8Array): Bar {
    return Bar.fromFields(Bar.bcs.parse(data))
  }
}

/* ============================== Dummy =============================== */

export function isDummy(type: Type): boolean {
  type = compressSuiType(type)
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

  static get bcs() {
    return bcs.struct('Dummy', {
      dummy_field: bcs.bool(),
    })
  }

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

  static fromBcs(data: Uint8Array): Dummy {
    return Dummy.fromFields(Dummy.bcs.parse(data))
  }
}

/* ============================== Foo =============================== */

export function isFoo(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith(
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::Foo<'
  )
}

export interface FooFields<T> {
  id: string
  generic: T
  reifiedPrimitiveVec: Array<bigint>
  reifiedObjectVec: Array<Bar>
  genericVec: Array<T>
  genericVecNested: Array<WithTwoGenerics<T, number>>
  twoGenerics: WithTwoGenerics<T, Bar>
  twoGenericsReifiedPrimitive: WithTwoGenerics<number, bigint>
  twoGenericsReifiedObject: WithTwoGenerics<Bar, Bar>
  twoGenericsNested: WithTwoGenerics<T, WithTwoGenerics<number, number>>
  twoGenericsReifiedNested: WithTwoGenerics<Bar, WithTwoGenerics<number, number>>
  twoGenericsNestedVec: Array<WithTwoGenerics<Bar, Array<WithTwoGenerics<T, number>>>>
  dummy: Dummy
  other: StructFromOtherModule
}

export class Foo<T> {
  static readonly $typeName =
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::Foo'
  static readonly $numTypeParams = 1

  static get bcs() {
    return <T extends BcsType<any>>(T: T) =>
      bcs.struct(`Foo<${T.name}>`, {
        id: UID.bcs,
        generic: T,
        reified_primitive_vec: bcs.vector(bcs.u64()),
        reified_object_vec: bcs.vector(Bar.bcs),
        generic_vec: bcs.vector(T),
        generic_vec_nested: bcs.vector(WithTwoGenerics.bcs(T, bcs.u8())),
        two_generics: WithTwoGenerics.bcs(T, Bar.bcs),
        two_generics_reified_primitive: WithTwoGenerics.bcs(bcs.u16(), bcs.u64()),
        two_generics_reified_object: WithTwoGenerics.bcs(Bar.bcs, Bar.bcs),
        two_generics_nested: WithTwoGenerics.bcs(T, WithTwoGenerics.bcs(bcs.u8(), bcs.u8())),
        two_generics_reified_nested: WithTwoGenerics.bcs(
          Bar.bcs,
          WithTwoGenerics.bcs(bcs.u8(), bcs.u8())
        ),
        two_generics_nested_vec: bcs.vector(
          WithTwoGenerics.bcs(Bar.bcs, bcs.vector(WithTwoGenerics.bcs(T, bcs.u8())))
        ),
        dummy: Dummy.bcs,
        other: StructFromOtherModule.bcs,
      })
  }

  readonly $typeArg: Type

  readonly id: string
  readonly generic: T
  readonly reifiedPrimitiveVec: Array<bigint>
  readonly reifiedObjectVec: Array<Bar>
  readonly genericVec: Array<T>
  readonly genericVecNested: Array<WithTwoGenerics<T, number>>
  readonly twoGenerics: WithTwoGenerics<T, Bar>
  readonly twoGenericsReifiedPrimitive: WithTwoGenerics<number, bigint>
  readonly twoGenericsReifiedObject: WithTwoGenerics<Bar, Bar>
  readonly twoGenericsNested: WithTwoGenerics<T, WithTwoGenerics<number, number>>
  readonly twoGenericsReifiedNested: WithTwoGenerics<Bar, WithTwoGenerics<number, number>>
  readonly twoGenericsNestedVec: Array<WithTwoGenerics<Bar, Array<WithTwoGenerics<T, number>>>>
  readonly dummy: Dummy
  readonly other: StructFromOtherModule

  constructor(typeArg: Type, fields: FooFields<T>) {
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

  static fromFields<T>(typeArg: Type, fields: Record<string, any>): Foo<T> {
    initLoaderIfNeeded()

    return new Foo(typeArg, {
      id: UID.fromFields(fields.id).id,
      generic: structClassLoaderSource.fromFields(typeArg, fields.generic),
      reifiedPrimitiveVec: fields.reified_primitive_vec.map((item: any) => BigInt(item)),
      reifiedObjectVec: fields.reified_object_vec.map((item: any) => Bar.fromFields(item)),
      genericVec: fields.generic_vec.map((item: any) =>
        structClassLoaderSource.fromFields(typeArg, item)
      ),
      genericVecNested: fields.generic_vec_nested.map((item: any) =>
        WithTwoGenerics.fromFields<T, number>([`${typeArg}`, `u8`], item)
      ),
      twoGenerics: WithTwoGenerics.fromFields<T, Bar>(
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
      twoGenericsNested: WithTwoGenerics.fromFields<T, WithTwoGenerics<number, number>>(
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
        WithTwoGenerics.fromFields<Bar, Array<WithTwoGenerics<T, number>>>(
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

  static fromFieldsWithTypes<T>(item: FieldsWithTypes): Foo<T> {
    initLoaderIfNeeded()

    if (!isFoo(item.type)) {
      throw new Error('not a Foo type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new Foo(typeArgs[0], {
      id: item.fields.id.id,
      generic: structClassLoaderSource.fromFieldsWithTypes(typeArgs[0], item.fields.generic),
      reifiedPrimitiveVec: item.fields.reified_primitive_vec.map((item: any) => BigInt(item)),
      reifiedObjectVec: item.fields.reified_object_vec.map((item: any) =>
        Bar.fromFieldsWithTypes(item)
      ),
      genericVec: item.fields.generic_vec.map((item: any) =>
        structClassLoaderSource.fromFieldsWithTypes(typeArgs[0], item)
      ),
      genericVecNested: item.fields.generic_vec_nested.map((item: any) =>
        WithTwoGenerics.fromFieldsWithTypes<T, number>(item)
      ),
      twoGenerics: WithTwoGenerics.fromFieldsWithTypes<T, Bar>(item.fields.two_generics),
      twoGenericsReifiedPrimitive: WithTwoGenerics.fromFieldsWithTypes<number, bigint>(
        item.fields.two_generics_reified_primitive
      ),
      twoGenericsReifiedObject: WithTwoGenerics.fromFieldsWithTypes<Bar, Bar>(
        item.fields.two_generics_reified_object
      ),
      twoGenericsNested: WithTwoGenerics.fromFieldsWithTypes<T, WithTwoGenerics<number, number>>(
        item.fields.two_generics_nested
      ),
      twoGenericsReifiedNested: WithTwoGenerics.fromFieldsWithTypes<
        Bar,
        WithTwoGenerics<number, number>
      >(item.fields.two_generics_reified_nested),
      twoGenericsNestedVec: item.fields.two_generics_nested_vec.map((item: any) =>
        WithTwoGenerics.fromFieldsWithTypes<Bar, Array<WithTwoGenerics<T, number>>>(item)
      ),
      dummy: Dummy.fromFieldsWithTypes(item.fields.dummy),
      other: StructFromOtherModule.fromFieldsWithTypes(item.fields.other),
    })
  }

  static fromBcs<T>(typeArg: Type, data: Uint8Array): Foo<T> {
    initLoaderIfNeeded()

    const typeArgs = [typeArg]

    return Foo.fromFields(
      typeArg,
      Foo.bcs(structClassLoaderSource.getBcsType(typeArgs[0])).parse(data)
    )
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

  static async fetch<T>(client: SuiClient, id: string): Promise<Foo<T>> {
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

/* ============================== WithGenericField =============================== */

export function isWithGenericField(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith(
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithGenericField<'
  )
}

export interface WithGenericFieldFields<T> {
  id: string
  genericField: T
}

export class WithGenericField<T> {
  static readonly $typeName =
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithGenericField'
  static readonly $numTypeParams = 1

  static get bcs() {
    return <T extends BcsType<any>>(T: T) =>
      bcs.struct(`WithGenericField<${T.name}>`, {
        id: UID.bcs,
        generic_field: T,
      })
  }

  readonly $typeArg: Type

  readonly id: string
  readonly genericField: T

  constructor(typeArg: Type, fields: WithGenericFieldFields<T>) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.genericField = fields.genericField
  }

  static fromFields<T>(typeArg: Type, fields: Record<string, any>): WithGenericField<T> {
    initLoaderIfNeeded()

    return new WithGenericField(typeArg, {
      id: UID.fromFields(fields.id).id,
      genericField: structClassLoaderSource.fromFields(typeArg, fields.generic_field),
    })
  }

  static fromFieldsWithTypes<T>(item: FieldsWithTypes): WithGenericField<T> {
    initLoaderIfNeeded()

    if (!isWithGenericField(item.type)) {
      throw new Error('not a WithGenericField type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new WithGenericField(typeArgs[0], {
      id: item.fields.id.id,
      genericField: structClassLoaderSource.fromFieldsWithTypes(
        typeArgs[0],
        item.fields.generic_field
      ),
    })
  }

  static fromBcs<T>(typeArg: Type, data: Uint8Array): WithGenericField<T> {
    initLoaderIfNeeded()

    const typeArgs = [typeArg]

    return WithGenericField.fromFields(
      typeArg,
      WithGenericField.bcs(structClassLoaderSource.getBcsType(typeArgs[0])).parse(data)
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

  static async fetch<T>(client: SuiClient, id: string): Promise<WithGenericField<T>> {
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

/* ============================== WithSpecialTypes =============================== */

export function isWithSpecialTypes(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith(
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithSpecialTypes<'
  )
}

export interface WithSpecialTypesFields<U> {
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
  optionGeneric: U | null
  optionGenericNone: U | null
}

export class WithSpecialTypes<U> {
  static readonly $typeName =
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithSpecialTypes'
  static readonly $numTypeParams = 2

  static get bcs() {
    return <U extends BcsType<any>>(U: U) =>
      bcs.struct(`WithSpecialTypes<${U.name}>`, {
        id: UID.bcs,
        string: String.bcs,
        ascii_string: String1.bcs,
        url: Url.bcs,
        id_field: ID.bcs,
        uid: UID.bcs,
        balance: Balance.bcs,
        option: Option.bcs(bcs.u64()),
        option_obj: Option.bcs(Bar.bcs),
        option_none: Option.bcs(bcs.u64()),
        balance_generic: Balance.bcs,
        option_generic: Option.bcs(U),
        option_generic_none: Option.bcs(U),
      })
  }

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
  readonly optionGeneric: U | null
  readonly optionGenericNone: U | null

  constructor(typeArgs: [Type, Type], fields: WithSpecialTypesFields<U>) {
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

  static fromFields<U>(typeArgs: [Type, Type], fields: Record<string, any>): WithSpecialTypes<U> {
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
      optionGeneric: Option.fromFields<U>(`${typeArgs[1]}`, fields.option_generic).vec[0] || null,
      optionGenericNone:
        Option.fromFields<U>(`${typeArgs[1]}`, fields.option_generic_none).vec[0] || null,
    })
  }

  static fromFieldsWithTypes<U>(item: FieldsWithTypes): WithSpecialTypes<U> {
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
          ? Option.fromFieldsWithTypes<U>({
              type: '0x1::option::Option<' + `${typeArgs[1]}` + '>',
              fields: { vec: [item.fields.option_generic] },
            }).vec[0]
          : null,
      optionGenericNone:
        item.fields.option_generic_none !== null
          ? Option.fromFieldsWithTypes<U>({
              type: '0x1::option::Option<' + `${typeArgs[1]}` + '>',
              fields: { vec: [item.fields.option_generic_none] },
            }).vec[0]
          : null,
    })
  }

  static fromBcs<U>(typeArgs: [Type, Type], data: Uint8Array): WithSpecialTypes<U> {
    initLoaderIfNeeded()

    return WithSpecialTypes.fromFields(
      typeArgs,
      WithSpecialTypes.bcs(structClassLoaderSource.getBcsType(typeArgs[1])).parse(data)
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

  static async fetch<U>(client: SuiClient, id: string): Promise<WithSpecialTypes<U>> {
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

export function isWithSpecialTypesAsGenerics(type: Type): boolean {
  type = compressSuiType(type)
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

  static get bcs() {
    return <
      T0 extends BcsType<any>,
      T1 extends BcsType<any>,
      T2 extends BcsType<any>,
      T3 extends BcsType<any>,
      T4 extends BcsType<any>,
      T5 extends BcsType<any>,
      T6 extends BcsType<any>,
      T7 extends BcsType<any>,
    >(
      T0: T0,
      T1: T1,
      T2: T2,
      T3: T3,
      T4: T4,
      T5: T5,
      T6: T6,
      T7: T7
    ) =>
      bcs.struct(
        `WithSpecialTypesAsGenerics<${T0.name}, ${T1.name}, ${T2.name}, ${T3.name}, ${T4.name}, ${T5.name}, ${T6.name}, ${T7.name}>`,
        {
          id: UID.bcs,
          string: T0,
          ascii_string: T1,
          url: T2,
          id_field: T3,
          uid: T4,
          balance: T5,
          option: T6,
          option_none: T7,
        }
      )
  }

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
      string: structClassLoaderSource.fromFields(typeArgs[0], fields.string),
      asciiString: structClassLoaderSource.fromFields(typeArgs[1], fields.ascii_string),
      url: structClassLoaderSource.fromFields(typeArgs[2], fields.url),
      idField: structClassLoaderSource.fromFields(typeArgs[3], fields.id_field),
      uid: structClassLoaderSource.fromFields(typeArgs[4], fields.uid),
      balance: structClassLoaderSource.fromFields(typeArgs[5], fields.balance),
      option: structClassLoaderSource.fromFields(typeArgs[6], fields.option),
      optionNone: structClassLoaderSource.fromFields(typeArgs[7], fields.option_none),
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
        string: structClassLoaderSource.fromFieldsWithTypes(typeArgs[0], item.fields.string),
        asciiString: structClassLoaderSource.fromFieldsWithTypes(
          typeArgs[1],
          item.fields.ascii_string
        ),
        url: structClassLoaderSource.fromFieldsWithTypes(typeArgs[2], item.fields.url),
        idField: structClassLoaderSource.fromFieldsWithTypes(typeArgs[3], item.fields.id_field),
        uid: structClassLoaderSource.fromFieldsWithTypes(typeArgs[4], item.fields.uid),
        balance: structClassLoaderSource.fromFieldsWithTypes(typeArgs[5], item.fields.balance),
        option: structClassLoaderSource.fromFieldsWithTypes(typeArgs[6], item.fields.option),
        optionNone: structClassLoaderSource.fromFieldsWithTypes(
          typeArgs[7],
          item.fields.option_none
        ),
      }
    )
  }

  static fromBcs<T0, T1, T2, T3, T4, T5, T6, T7>(
    typeArgs: [Type, Type, Type, Type, Type, Type, Type, Type],
    data: Uint8Array
  ): WithSpecialTypesAsGenerics<T0, T1, T2, T3, T4, T5, T6, T7> {
    initLoaderIfNeeded()

    return WithSpecialTypesAsGenerics.fromFields(
      typeArgs,
      WithSpecialTypesAsGenerics.bcs(
        structClassLoaderSource.getBcsType(typeArgs[0]),
        structClassLoaderSource.getBcsType(typeArgs[1]),
        structClassLoaderSource.getBcsType(typeArgs[2]),
        structClassLoaderSource.getBcsType(typeArgs[3]),
        structClassLoaderSource.getBcsType(typeArgs[4]),
        structClassLoaderSource.getBcsType(typeArgs[5]),
        structClassLoaderSource.getBcsType(typeArgs[6]),
        structClassLoaderSource.getBcsType(typeArgs[7])
      ).parse(data)
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

export function isWithSpecialTypesInVectors(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith(
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithSpecialTypesInVectors<'
  )
}

export interface WithSpecialTypesInVectorsFields<T> {
  id: string
  string: Array<string>
  asciiString: Array<string>
  idField: Array<string>
  bar: Array<Bar>
  option: Array<bigint | null>
  optionGeneric: Array<T | null>
}

export class WithSpecialTypesInVectors<T> {
  static readonly $typeName =
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithSpecialTypesInVectors'
  static readonly $numTypeParams = 1

  static get bcs() {
    return <T extends BcsType<any>>(T: T) =>
      bcs.struct(`WithSpecialTypesInVectors<${T.name}>`, {
        id: UID.bcs,
        string: bcs.vector(String.bcs),
        ascii_string: bcs.vector(String1.bcs),
        id_field: bcs.vector(ID.bcs),
        bar: bcs.vector(Bar.bcs),
        option: bcs.vector(Option.bcs(bcs.u64())),
        option_generic: bcs.vector(Option.bcs(T)),
      })
  }

  readonly $typeArg: Type

  readonly id: string
  readonly string: Array<string>
  readonly asciiString: Array<string>
  readonly idField: Array<string>
  readonly bar: Array<Bar>
  readonly option: Array<bigint | null>
  readonly optionGeneric: Array<T | null>

  constructor(typeArg: Type, fields: WithSpecialTypesInVectorsFields<T>) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.string = fields.string
    this.asciiString = fields.asciiString
    this.idField = fields.idField
    this.bar = fields.bar
    this.option = fields.option
    this.optionGeneric = fields.optionGeneric
  }

  static fromFields<T>(typeArg: Type, fields: Record<string, any>): WithSpecialTypesInVectors<T> {
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
        (item: any) => Option.fromFields<T>(`${typeArg}`, item).vec[0] || null
      ),
    })
  }

  static fromFieldsWithTypes<T>(item: FieldsWithTypes): WithSpecialTypesInVectors<T> {
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
          ? Option.fromFieldsWithTypes<T>({
              type: '0x1::option::Option<' + `${typeArgs[0]}` + '>',
              fields: { vec: [item] },
            }).vec[0]
          : null
      ),
    })
  }

  static fromBcs<T>(typeArg: Type, data: Uint8Array): WithSpecialTypesInVectors<T> {
    initLoaderIfNeeded()

    const typeArgs = [typeArg]

    return WithSpecialTypesInVectors.fromFields(
      typeArg,
      WithSpecialTypesInVectors.bcs(structClassLoaderSource.getBcsType(typeArgs[0])).parse(data)
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

  static async fetch<T>(client: SuiClient, id: string): Promise<WithSpecialTypesInVectors<T>> {
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

/* ============================== WithTwoGenerics =============================== */

export function isWithTwoGenerics(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith(
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithTwoGenerics<'
  )
}

export interface WithTwoGenericsFields<T, U> {
  genericField1: T
  genericField2: U
}

export class WithTwoGenerics<T, U> {
  static readonly $typeName =
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithTwoGenerics'
  static readonly $numTypeParams = 2

  static get bcs() {
    return <T extends BcsType<any>, U extends BcsType<any>>(T: T, U: U) =>
      bcs.struct(`WithTwoGenerics<${T.name}, ${U.name}>`, {
        generic_field_1: T,
        generic_field_2: U,
      })
  }

  readonly $typeArgs: [Type, Type]

  readonly genericField1: T
  readonly genericField2: U

  constructor(typeArgs: [Type, Type], fields: WithTwoGenericsFields<T, U>) {
    this.$typeArgs = typeArgs

    this.genericField1 = fields.genericField1
    this.genericField2 = fields.genericField2
  }

  static fromFields<T, U>(
    typeArgs: [Type, Type],
    fields: Record<string, any>
  ): WithTwoGenerics<T, U> {
    initLoaderIfNeeded()

    return new WithTwoGenerics(typeArgs, {
      genericField1: structClassLoaderSource.fromFields(typeArgs[0], fields.generic_field_1),
      genericField2: structClassLoaderSource.fromFields(typeArgs[1], fields.generic_field_2),
    })
  }

  static fromFieldsWithTypes<T, U>(item: FieldsWithTypes): WithTwoGenerics<T, U> {
    initLoaderIfNeeded()

    if (!isWithTwoGenerics(item.type)) {
      throw new Error('not a WithTwoGenerics type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new WithTwoGenerics([typeArgs[0], typeArgs[1]], {
      genericField1: structClassLoaderSource.fromFieldsWithTypes(
        typeArgs[0],
        item.fields.generic_field_1
      ),
      genericField2: structClassLoaderSource.fromFieldsWithTypes(
        typeArgs[1],
        item.fields.generic_field_2
      ),
    })
  }

  static fromBcs<T, U>(typeArgs: [Type, Type], data: Uint8Array): WithTwoGenerics<T, U> {
    initLoaderIfNeeded()

    return WithTwoGenerics.fromFields(
      typeArgs,
      WithTwoGenerics.bcs(
        structClassLoaderSource.getBcsType(typeArgs[0]),
        structClassLoaderSource.getBcsType(typeArgs[1])
      ).parse(data)
    )
  }
}
