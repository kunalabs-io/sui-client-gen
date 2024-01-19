import {
  ReifiedTypeArgument,
  ToField,
  ToTypeArgument,
  TypeArgument,
  assertFieldsWithTypesArgsMatch,
  decodeFromFieldsGenericOrSpecial,
  decodeFromFieldsWithTypesGenericOrSpecial,
  extractType,
  reified,
  toBcs,
} from '../../_framework/types'
import { FieldsWithTypes, compressSuiType, genericToJSON } from '../../_framework/util'
import { String as String1 } from '../../move-stdlib-chain/ascii/structs'
import { Option } from '../../move-stdlib-chain/option/structs'
import { String } from '../../move-stdlib-chain/string/structs'
import { Balance } from '../../sui-chain/balance/structs'
import { ID, UID } from '../../sui-chain/object/structs'
import { SUI } from '../../sui-chain/sui/structs'
import { Url } from '../../sui-chain/url/structs'
import { StructFromOtherModule } from '../other-module/structs'
import { BcsType, bcs } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== Dummy =============================== */

export function isDummy(type: string): boolean {
  type = compressSuiType(type)
  return (
    type === '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::Dummy'
  )
}

export interface DummyFields {
  dummyField: ToField<'bool'>
}

export class Dummy {
  static readonly $typeName =
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::Dummy'
  static readonly $numTypeParams = 0

  readonly $typeName = Dummy.$typeName

  static get bcs() {
    return bcs.struct('Dummy', {
      dummy_field: bcs.bool(),
    })
  }

  readonly dummyField: ToField<'bool'>

  private constructor(dummyField: ToField<'bool'>) {
    this.dummyField = dummyField
  }

  static new(dummyField: ToField<'bool'>): Dummy {
    return new Dummy(dummyField)
  }

  static reified() {
    return {
      typeName: Dummy.$typeName,
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => Dummy.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Dummy.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => Dummy.fromBcs(data),
      bcs: Dummy.bcs,
      __class: null as unknown as ReturnType<typeof Dummy.new>,
    }
  }

  static fromFields(fields: Record<string, any>): Dummy {
    return Dummy.new(decodeFromFieldsGenericOrSpecial('bool', fields.dummy_field))
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Dummy {
    if (!isDummy(item.type)) {
      throw new Error('not a Dummy type')
    }

    return Dummy.new(decodeFromFieldsWithTypesGenericOrSpecial('bool', item.fields.dummy_field))
  }

  static fromBcs(data: Uint8Array): Dummy {
    return Dummy.fromFields(Dummy.bcs.parse(data))
  }

  toJSON() {
    return {
      dummyField: this.dummyField,
    }
  }
}

/* ============================== WithGenericField =============================== */

export function isWithGenericField(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithGenericField<'
  )
}

export interface WithGenericFieldFields<T0 extends TypeArgument> {
  id: ToField<UID>
  genericField: ToField<T0>
}

export class WithGenericField<T0 extends TypeArgument> {
  static readonly $typeName =
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithGenericField'
  static readonly $numTypeParams = 1

  readonly $typeName = WithGenericField.$typeName

  static get bcs() {
    return <T0 extends BcsType<any>>(T0: T0) =>
      bcs.struct(`WithGenericField<${T0.name}>`, {
        id: UID.bcs,
        generic_field: T0,
      })
  }

  readonly $typeArg: string

  readonly id: ToField<UID>
  readonly genericField: ToField<T0>

  private constructor(typeArg: string, fields: WithGenericFieldFields<T0>) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.genericField = fields.genericField
  }

  static new<T0 extends ReifiedTypeArgument>(
    typeArg: T0,
    fields: WithGenericFieldFields<ToTypeArgument<T0>>
  ): WithGenericField<ToTypeArgument<T0>> {
    return new WithGenericField(extractType(typeArg), fields)
  }

  static reified<T0 extends ReifiedTypeArgument>(T0: T0) {
    return {
      typeName: WithGenericField.$typeName,
      typeArgs: [T0],
      fromFields: (fields: Record<string, any>) => WithGenericField.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        WithGenericField.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => WithGenericField.fromBcs(T0, data),
      bcs: WithGenericField.bcs(toBcs(T0)),
      __class: null as unknown as ReturnType<typeof WithGenericField.new<ToTypeArgument<T0>>>,
    }
  }

  static fromFields<T0 extends ReifiedTypeArgument>(
    typeArg: T0,
    fields: Record<string, any>
  ): WithGenericField<ToTypeArgument<T0>> {
    return WithGenericField.new(typeArg, {
      id: decodeFromFieldsGenericOrSpecial(UID.reified(), fields.id),
      genericField: decodeFromFieldsGenericOrSpecial(typeArg, fields.generic_field),
    })
  }

  static fromFieldsWithTypes<T0 extends ReifiedTypeArgument>(
    typeArg: T0,
    item: FieldsWithTypes
  ): WithGenericField<ToTypeArgument<T0>> {
    if (!isWithGenericField(item.type)) {
      throw new Error('not a WithGenericField type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return WithGenericField.new(typeArg, {
      id: decodeFromFieldsWithTypesGenericOrSpecial(UID.reified(), item.fields.id),
      genericField: decodeFromFieldsWithTypesGenericOrSpecial(typeArg, item.fields.generic_field),
    })
  }

  static fromBcs<T0 extends ReifiedTypeArgument>(
    typeArg: T0,
    data: Uint8Array
  ): WithGenericField<ToTypeArgument<T0>> {
    const typeArgs = [typeArg]

    return WithGenericField.fromFields(
      typeArg,
      WithGenericField.bcs(toBcs(typeArgs[0])).parse(data)
    )
  }

  toJSON() {
    return {
      $typeArg: this.$typeArg,
      id: this.id,
      genericField: genericToJSON(this.$typeArg, this.genericField),
    }
  }

  static fromSuiParsedData<T0 extends ReifiedTypeArgument>(
    typeArg: T0,
    content: SuiParsedData
  ): WithGenericField<ToTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isWithGenericField(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a WithGenericField object`)
    }
    return WithGenericField.fromFieldsWithTypes(typeArg, content)
  }

  static async fetch<T0 extends ReifiedTypeArgument>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<WithGenericField<ToTypeArgument<T0>>> {
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
    return WithGenericField.fromFieldsWithTypes(typeArg, res.data.content)
  }
}

/* ============================== Bar =============================== */

export function isBar(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::Bar'
}

export interface BarFields {
  value: ToField<'u64'>
}

export class Bar {
  static readonly $typeName =
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::Bar'
  static readonly $numTypeParams = 0

  readonly $typeName = Bar.$typeName

  static get bcs() {
    return bcs.struct('Bar', {
      value: bcs.u64(),
    })
  }

  readonly value: ToField<'u64'>

  private constructor(value: ToField<'u64'>) {
    this.value = value
  }

  static new(value: ToField<'u64'>): Bar {
    return new Bar(value)
  }

  static reified() {
    return {
      typeName: Bar.$typeName,
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => Bar.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Bar.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => Bar.fromBcs(data),
      bcs: Bar.bcs,
      __class: null as unknown as ReturnType<typeof Bar.new>,
    }
  }

  static fromFields(fields: Record<string, any>): Bar {
    return Bar.new(decodeFromFieldsGenericOrSpecial('u64', fields.value))
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Bar {
    if (!isBar(item.type)) {
      throw new Error('not a Bar type')
    }

    return Bar.new(decodeFromFieldsWithTypesGenericOrSpecial('u64', item.fields.value))
  }

  static fromBcs(data: Uint8Array): Bar {
    return Bar.fromFields(Bar.bcs.parse(data))
  }

  toJSON() {
    return {
      value: this.value.toString(),
    }
  }
}

/* ============================== WithTwoGenerics =============================== */

export function isWithTwoGenerics(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithTwoGenerics<'
  )
}

export interface WithTwoGenericsFields<T0 extends TypeArgument, T1 extends TypeArgument> {
  genericField1: ToField<T0>
  genericField2: ToField<T1>
}

export class WithTwoGenerics<T0 extends TypeArgument, T1 extends TypeArgument> {
  static readonly $typeName =
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithTwoGenerics'
  static readonly $numTypeParams = 2

  readonly $typeName = WithTwoGenerics.$typeName

  static get bcs() {
    return <T0 extends BcsType<any>, T1 extends BcsType<any>>(T0: T0, T1: T1) =>
      bcs.struct(`WithTwoGenerics<${T0.name}, ${T1.name}>`, {
        generic_field_1: T0,
        generic_field_2: T1,
      })
  }

  readonly $typeArgs: [string, string]

  readonly genericField1: ToField<T0>
  readonly genericField2: ToField<T1>

  private constructor(typeArgs: [string, string], fields: WithTwoGenericsFields<T0, T1>) {
    this.$typeArgs = typeArgs

    this.genericField1 = fields.genericField1
    this.genericField2 = fields.genericField2
  }

  static new<T0 extends ReifiedTypeArgument, T1 extends ReifiedTypeArgument>(
    typeArgs: [T0, T1],
    fields: WithTwoGenericsFields<ToTypeArgument<T0>, ToTypeArgument<T1>>
  ): WithTwoGenerics<ToTypeArgument<T0>, ToTypeArgument<T1>> {
    return new WithTwoGenerics(typeArgs.map(extractType) as [string, string], fields)
  }

  static reified<T0 extends ReifiedTypeArgument, T1 extends ReifiedTypeArgument>(T0: T0, T1: T1) {
    return {
      typeName: WithTwoGenerics.$typeName,
      typeArgs: [T0, T1],
      fromFields: (fields: Record<string, any>) => WithTwoGenerics.fromFields([T0, T1], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        WithTwoGenerics.fromFieldsWithTypes([T0, T1], item),
      fromBcs: (data: Uint8Array) => WithTwoGenerics.fromBcs([T0, T1], data),
      bcs: WithTwoGenerics.bcs(toBcs(T0), toBcs(T1)),
      __class: null as unknown as ReturnType<
        typeof WithTwoGenerics.new<ToTypeArgument<T0>, ToTypeArgument<T1>>
      >,
    }
  }

  static fromFields<T0 extends ReifiedTypeArgument, T1 extends ReifiedTypeArgument>(
    typeArgs: [T0, T1],
    fields: Record<string, any>
  ): WithTwoGenerics<ToTypeArgument<T0>, ToTypeArgument<T1>> {
    return WithTwoGenerics.new(typeArgs, {
      genericField1: decodeFromFieldsGenericOrSpecial(typeArgs[0], fields.generic_field_1),
      genericField2: decodeFromFieldsGenericOrSpecial(typeArgs[1], fields.generic_field_2),
    })
  }

  static fromFieldsWithTypes<T0 extends ReifiedTypeArgument, T1 extends ReifiedTypeArgument>(
    typeArgs: [T0, T1],
    item: FieldsWithTypes
  ): WithTwoGenerics<ToTypeArgument<T0>, ToTypeArgument<T1>> {
    if (!isWithTwoGenerics(item.type)) {
      throw new Error('not a WithTwoGenerics type')
    }
    assertFieldsWithTypesArgsMatch(item, typeArgs)

    return WithTwoGenerics.new(typeArgs, {
      genericField1: decodeFromFieldsWithTypesGenericOrSpecial(
        typeArgs[0],
        item.fields.generic_field_1
      ),
      genericField2: decodeFromFieldsWithTypesGenericOrSpecial(
        typeArgs[1],
        item.fields.generic_field_2
      ),
    })
  }

  static fromBcs<T0 extends ReifiedTypeArgument, T1 extends ReifiedTypeArgument>(
    typeArgs: [T0, T1],
    data: Uint8Array
  ): WithTwoGenerics<ToTypeArgument<T0>, ToTypeArgument<T1>> {
    return WithTwoGenerics.fromFields(
      typeArgs,
      WithTwoGenerics.bcs(toBcs(typeArgs[0]), toBcs(typeArgs[1])).parse(data)
    )
  }

  toJSON() {
    return {
      $typeArgs: this.$typeArgs,
      genericField1: genericToJSON(this.$typeArgs[0], this.genericField1),
      genericField2: genericToJSON(this.$typeArgs[1], this.genericField2),
    }
  }
}

/* ============================== Foo =============================== */

export function isFoo(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::Foo<'
  )
}

export interface FooFields<T0 extends TypeArgument> {
  id: ToField<UID>
  generic: ToField<T0>
  reifiedPrimitiveVec: Array<ToField<'u64'>>
  reifiedObjectVec: Array<ToField<Bar>>
  genericVec: Array<ToField<T0>>
  genericVecNested: Array<ToField<WithTwoGenerics<T0, 'u8'>>>
  twoGenerics: ToField<WithTwoGenerics<T0, Bar>>
  twoGenericsReifiedPrimitive: ToField<WithTwoGenerics<'u16', 'u64'>>
  twoGenericsReifiedObject: ToField<WithTwoGenerics<Bar, Bar>>
  twoGenericsNested: ToField<WithTwoGenerics<T0, WithTwoGenerics<'u8', 'u8'>>>
  twoGenericsReifiedNested: ToField<WithTwoGenerics<Bar, WithTwoGenerics<'u8', 'u8'>>>
  twoGenericsNestedVec: Array<ToField<WithTwoGenerics<Bar, Array<WithTwoGenerics<T0, 'u8'>>>>>
  dummy: ToField<Dummy>
  other: ToField<StructFromOtherModule>
}

export class Foo<T0 extends TypeArgument> {
  static readonly $typeName =
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::Foo'
  static readonly $numTypeParams = 1

  readonly $typeName = Foo.$typeName

  static get bcs() {
    return <T0 extends BcsType<any>>(T0: T0) =>
      bcs.struct(`Foo<${T0.name}>`, {
        id: UID.bcs,
        generic: T0,
        reified_primitive_vec: bcs.vector(bcs.u64()),
        reified_object_vec: bcs.vector(Bar.bcs),
        generic_vec: bcs.vector(T0),
        generic_vec_nested: bcs.vector(WithTwoGenerics.bcs(T0, bcs.u8())),
        two_generics: WithTwoGenerics.bcs(T0, Bar.bcs),
        two_generics_reified_primitive: WithTwoGenerics.bcs(bcs.u16(), bcs.u64()),
        two_generics_reified_object: WithTwoGenerics.bcs(Bar.bcs, Bar.bcs),
        two_generics_nested: WithTwoGenerics.bcs(T0, WithTwoGenerics.bcs(bcs.u8(), bcs.u8())),
        two_generics_reified_nested: WithTwoGenerics.bcs(
          Bar.bcs,
          WithTwoGenerics.bcs(bcs.u8(), bcs.u8())
        ),
        two_generics_nested_vec: bcs.vector(
          WithTwoGenerics.bcs(Bar.bcs, bcs.vector(WithTwoGenerics.bcs(T0, bcs.u8())))
        ),
        dummy: Dummy.bcs,
        other: StructFromOtherModule.bcs,
      })
  }

  readonly $typeArg: string

  readonly id: ToField<UID>
  readonly generic: ToField<T0>
  readonly reifiedPrimitiveVec: Array<ToField<'u64'>>
  readonly reifiedObjectVec: Array<ToField<Bar>>
  readonly genericVec: Array<ToField<T0>>
  readonly genericVecNested: Array<ToField<WithTwoGenerics<T0, 'u8'>>>
  readonly twoGenerics: ToField<WithTwoGenerics<T0, Bar>>
  readonly twoGenericsReifiedPrimitive: ToField<WithTwoGenerics<'u16', 'u64'>>
  readonly twoGenericsReifiedObject: ToField<WithTwoGenerics<Bar, Bar>>
  readonly twoGenericsNested: ToField<WithTwoGenerics<T0, WithTwoGenerics<'u8', 'u8'>>>
  readonly twoGenericsReifiedNested: ToField<WithTwoGenerics<Bar, WithTwoGenerics<'u8', 'u8'>>>
  readonly twoGenericsNestedVec: Array<
    ToField<WithTwoGenerics<Bar, Array<WithTwoGenerics<T0, 'u8'>>>>
  >
  readonly dummy: ToField<Dummy>
  readonly other: ToField<StructFromOtherModule>

  private constructor(typeArg: string, fields: FooFields<T0>) {
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

  static new<T0 extends ReifiedTypeArgument>(
    typeArg: T0,
    fields: FooFields<ToTypeArgument<T0>>
  ): Foo<ToTypeArgument<T0>> {
    return new Foo(extractType(typeArg), fields)
  }

  static reified<T0 extends ReifiedTypeArgument>(T0: T0) {
    return {
      typeName: Foo.$typeName,
      typeArgs: [T0],
      fromFields: (fields: Record<string, any>) => Foo.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Foo.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => Foo.fromBcs(T0, data),
      bcs: Foo.bcs(toBcs(T0)),
      __class: null as unknown as ReturnType<typeof Foo.new<ToTypeArgument<T0>>>,
    }
  }

  static fromFields<T0 extends ReifiedTypeArgument>(
    typeArg: T0,
    fields: Record<string, any>
  ): Foo<ToTypeArgument<T0>> {
    return Foo.new(typeArg, {
      id: decodeFromFieldsGenericOrSpecial(UID.reified(), fields.id),
      generic: decodeFromFieldsGenericOrSpecial(typeArg, fields.generic),
      reifiedPrimitiveVec: decodeFromFieldsGenericOrSpecial(
        reified.vector('u64'),
        fields.reified_primitive_vec
      ),
      reifiedObjectVec: decodeFromFieldsGenericOrSpecial(
        reified.vector(Bar.reified()),
        fields.reified_object_vec
      ),
      genericVec: decodeFromFieldsGenericOrSpecial(reified.vector(typeArg), fields.generic_vec),
      genericVecNested: decodeFromFieldsGenericOrSpecial(
        reified.vector(WithTwoGenerics.reified(typeArg, 'u8')),
        fields.generic_vec_nested
      ),
      twoGenerics: decodeFromFieldsGenericOrSpecial(
        WithTwoGenerics.reified(typeArg, Bar.reified()),
        fields.two_generics
      ),
      twoGenericsReifiedPrimitive: decodeFromFieldsGenericOrSpecial(
        WithTwoGenerics.reified('u16', 'u64'),
        fields.two_generics_reified_primitive
      ),
      twoGenericsReifiedObject: decodeFromFieldsGenericOrSpecial(
        WithTwoGenerics.reified(Bar.reified(), Bar.reified()),
        fields.two_generics_reified_object
      ),
      twoGenericsNested: decodeFromFieldsGenericOrSpecial(
        WithTwoGenerics.reified(typeArg, WithTwoGenerics.reified('u8', 'u8')),
        fields.two_generics_nested
      ),
      twoGenericsReifiedNested: decodeFromFieldsGenericOrSpecial(
        WithTwoGenerics.reified(Bar.reified(), WithTwoGenerics.reified('u8', 'u8')),
        fields.two_generics_reified_nested
      ),
      twoGenericsNestedVec: decodeFromFieldsGenericOrSpecial(
        reified.vector(
          WithTwoGenerics.reified(
            Bar.reified(),
            reified.vector(WithTwoGenerics.reified(typeArg, 'u8'))
          )
        ),
        fields.two_generics_nested_vec
      ),
      dummy: decodeFromFieldsGenericOrSpecial(Dummy.reified(), fields.dummy),
      other: decodeFromFieldsGenericOrSpecial(StructFromOtherModule.reified(), fields.other),
    })
  }

  static fromFieldsWithTypes<T0 extends ReifiedTypeArgument>(
    typeArg: T0,
    item: FieldsWithTypes
  ): Foo<ToTypeArgument<T0>> {
    if (!isFoo(item.type)) {
      throw new Error('not a Foo type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Foo.new(typeArg, {
      id: decodeFromFieldsWithTypesGenericOrSpecial(UID.reified(), item.fields.id),
      generic: decodeFromFieldsWithTypesGenericOrSpecial(typeArg, item.fields.generic),
      reifiedPrimitiveVec: decodeFromFieldsWithTypesGenericOrSpecial(
        reified.vector('u64'),
        item.fields.reified_primitive_vec
      ),
      reifiedObjectVec: decodeFromFieldsWithTypesGenericOrSpecial(
        reified.vector(Bar.reified()),
        item.fields.reified_object_vec
      ),
      genericVec: decodeFromFieldsWithTypesGenericOrSpecial(
        reified.vector(typeArg),
        item.fields.generic_vec
      ),
      genericVecNested: decodeFromFieldsWithTypesGenericOrSpecial(
        reified.vector(WithTwoGenerics.reified(typeArg, 'u8')),
        item.fields.generic_vec_nested
      ),
      twoGenerics: decodeFromFieldsWithTypesGenericOrSpecial(
        WithTwoGenerics.reified(typeArg, Bar.reified()),
        item.fields.two_generics
      ),
      twoGenericsReifiedPrimitive: decodeFromFieldsWithTypesGenericOrSpecial(
        WithTwoGenerics.reified('u16', 'u64'),
        item.fields.two_generics_reified_primitive
      ),
      twoGenericsReifiedObject: decodeFromFieldsWithTypesGenericOrSpecial(
        WithTwoGenerics.reified(Bar.reified(), Bar.reified()),
        item.fields.two_generics_reified_object
      ),
      twoGenericsNested: decodeFromFieldsWithTypesGenericOrSpecial(
        WithTwoGenerics.reified(typeArg, WithTwoGenerics.reified('u8', 'u8')),
        item.fields.two_generics_nested
      ),
      twoGenericsReifiedNested: decodeFromFieldsWithTypesGenericOrSpecial(
        WithTwoGenerics.reified(Bar.reified(), WithTwoGenerics.reified('u8', 'u8')),
        item.fields.two_generics_reified_nested
      ),
      twoGenericsNestedVec: decodeFromFieldsWithTypesGenericOrSpecial(
        reified.vector(
          WithTwoGenerics.reified(
            Bar.reified(),
            reified.vector(WithTwoGenerics.reified(typeArg, 'u8'))
          )
        ),
        item.fields.two_generics_nested_vec
      ),
      dummy: decodeFromFieldsWithTypesGenericOrSpecial(Dummy.reified(), item.fields.dummy),
      other: decodeFromFieldsWithTypesGenericOrSpecial(
        StructFromOtherModule.reified(),
        item.fields.other
      ),
    })
  }

  static fromBcs<T0 extends ReifiedTypeArgument>(
    typeArg: T0,
    data: Uint8Array
  ): Foo<ToTypeArgument<T0>> {
    const typeArgs = [typeArg]

    return Foo.fromFields(typeArg, Foo.bcs(toBcs(typeArgs[0])).parse(data))
  }

  toJSON() {
    return {
      $typeArg: this.$typeArg,
      id: this.id,
      generic: genericToJSON(this.$typeArg, this.generic),
      reifiedPrimitiveVec: genericToJSON(`vector<u64>`, this.reifiedPrimitiveVec),
      reifiedObjectVec: genericToJSON(
        `vector<0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::Bar>`,
        this.reifiedObjectVec
      ),
      genericVec: genericToJSON(`vector<${this.$typeArg}>`, this.genericVec),
      genericVecNested: genericToJSON(
        `vector<0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithTwoGenerics<${this.$typeArg}, u8>>`,
        this.genericVecNested
      ),
      twoGenerics: this.twoGenerics.toJSON(),
      twoGenericsReifiedPrimitive: this.twoGenericsReifiedPrimitive.toJSON(),
      twoGenericsReifiedObject: this.twoGenericsReifiedObject.toJSON(),
      twoGenericsNested: this.twoGenericsNested.toJSON(),
      twoGenericsReifiedNested: this.twoGenericsReifiedNested.toJSON(),
      twoGenericsNestedVec: genericToJSON(
        `vector<0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithTwoGenerics<0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::Bar, vector<0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithTwoGenerics<${this.$typeArg}, u8>>>>`,
        this.twoGenericsNestedVec
      ),
      dummy: this.dummy.toJSON(),
      other: this.other.toJSON(),
    }
  }

  static fromSuiParsedData<T0 extends ReifiedTypeArgument>(
    typeArg: T0,
    content: SuiParsedData
  ): Foo<ToTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isFoo(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Foo object`)
    }
    return Foo.fromFieldsWithTypes(typeArg, content)
  }

  static async fetch<T0 extends ReifiedTypeArgument>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<Foo<ToTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching Foo object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isFoo(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a Foo object`)
    }
    return Foo.fromFieldsWithTypes(typeArg, res.data.content)
  }
}

/* ============================== WithSpecialTypes =============================== */

export function isWithSpecialTypes(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithSpecialTypes<'
  )
}

export interface WithSpecialTypesFields<T1 extends TypeArgument> {
  id: ToField<UID>
  string: ToField<String>
  asciiString: ToField<String1>
  url: ToField<Url>
  idField: ToField<ID>
  uid: ToField<UID>
  balance: ToField<Balance>
  option: ToField<Option<'u64'>>
  optionObj: ToField<Option<Bar>>
  optionNone: ToField<Option<'u64'>>
  balanceGeneric: ToField<Balance>
  optionGeneric: ToField<Option<T1>>
  optionGenericNone: ToField<Option<T1>>
}

export class WithSpecialTypes<T1 extends TypeArgument> {
  static readonly $typeName =
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithSpecialTypes'
  static readonly $numTypeParams = 2

  readonly $typeName = WithSpecialTypes.$typeName

  static get bcs() {
    return <T1 extends BcsType<any>>(T1: T1) =>
      bcs.struct(`WithSpecialTypes<${T1.name}>`, {
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
        option_generic: Option.bcs(T1),
        option_generic_none: Option.bcs(T1),
      })
  }

  readonly $typeArgs: [string, string]

  readonly id: ToField<UID>
  readonly string: ToField<String>
  readonly asciiString: ToField<String1>
  readonly url: ToField<Url>
  readonly idField: ToField<ID>
  readonly uid: ToField<UID>
  readonly balance: ToField<Balance>
  readonly option: ToField<Option<'u64'>>
  readonly optionObj: ToField<Option<Bar>>
  readonly optionNone: ToField<Option<'u64'>>
  readonly balanceGeneric: ToField<Balance>
  readonly optionGeneric: ToField<Option<T1>>
  readonly optionGenericNone: ToField<Option<T1>>

  private constructor(typeArgs: [string, string], fields: WithSpecialTypesFields<T1>) {
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

  static new<T1 extends ReifiedTypeArgument>(
    typeArgs: [ReifiedTypeArgument, T1],
    fields: WithSpecialTypesFields<ToTypeArgument<T1>>
  ): WithSpecialTypes<ToTypeArgument<T1>> {
    return new WithSpecialTypes(typeArgs.map(extractType) as [string, string], fields)
  }

  static reified<T1 extends ReifiedTypeArgument>(T0: ReifiedTypeArgument, T1: T1) {
    return {
      typeName: WithSpecialTypes.$typeName,
      typeArgs: [T0, T1],
      fromFields: (fields: Record<string, any>) => WithSpecialTypes.fromFields([T0, T1], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        WithSpecialTypes.fromFieldsWithTypes([T0, T1], item),
      fromBcs: (data: Uint8Array) => WithSpecialTypes.fromBcs([T0, T1], data),
      bcs: WithSpecialTypes.bcs(toBcs(T1)),
      __class: null as unknown as ReturnType<typeof WithSpecialTypes.new<ToTypeArgument<T1>>>,
    }
  }

  static fromFields<T1 extends ReifiedTypeArgument>(
    typeArgs: [ReifiedTypeArgument, T1],
    fields: Record<string, any>
  ): WithSpecialTypes<ToTypeArgument<T1>> {
    return WithSpecialTypes.new(typeArgs, {
      id: decodeFromFieldsGenericOrSpecial(UID.reified(), fields.id),
      string: decodeFromFieldsGenericOrSpecial(String.reified(), fields.string),
      asciiString: decodeFromFieldsGenericOrSpecial(String1.reified(), fields.ascii_string),
      url: decodeFromFieldsGenericOrSpecial(Url.reified(), fields.url),
      idField: decodeFromFieldsGenericOrSpecial(ID.reified(), fields.id_field),
      uid: decodeFromFieldsGenericOrSpecial(UID.reified(), fields.uid),
      balance: decodeFromFieldsGenericOrSpecial(Balance.reified(SUI.reified()), fields.balance),
      option: decodeFromFieldsGenericOrSpecial(Option.reified('u64'), fields.option),
      optionObj: decodeFromFieldsGenericOrSpecial(Option.reified(Bar.reified()), fields.option_obj),
      optionNone: decodeFromFieldsGenericOrSpecial(Option.reified('u64'), fields.option_none),
      balanceGeneric: decodeFromFieldsGenericOrSpecial(
        Balance.reified(typeArgs[0]),
        fields.balance_generic
      ),
      optionGeneric: decodeFromFieldsGenericOrSpecial(
        Option.reified(typeArgs[1]),
        fields.option_generic
      ),
      optionGenericNone: decodeFromFieldsGenericOrSpecial(
        Option.reified(typeArgs[1]),
        fields.option_generic_none
      ),
    })
  }

  static fromFieldsWithTypes<T1 extends ReifiedTypeArgument>(
    typeArgs: [ReifiedTypeArgument, T1],
    item: FieldsWithTypes
  ): WithSpecialTypes<ToTypeArgument<T1>> {
    if (!isWithSpecialTypes(item.type)) {
      throw new Error('not a WithSpecialTypes type')
    }
    assertFieldsWithTypesArgsMatch(item, typeArgs)

    return WithSpecialTypes.new(typeArgs, {
      id: decodeFromFieldsWithTypesGenericOrSpecial(UID.reified(), item.fields.id),
      string: decodeFromFieldsWithTypesGenericOrSpecial(String.reified(), item.fields.string),
      asciiString: decodeFromFieldsWithTypesGenericOrSpecial(
        String1.reified(),
        item.fields.ascii_string
      ),
      url: decodeFromFieldsWithTypesGenericOrSpecial(Url.reified(), item.fields.url),
      idField: decodeFromFieldsWithTypesGenericOrSpecial(ID.reified(), item.fields.id_field),
      uid: decodeFromFieldsWithTypesGenericOrSpecial(UID.reified(), item.fields.uid),
      balance: decodeFromFieldsWithTypesGenericOrSpecial(
        Balance.reified(SUI.reified()),
        item.fields.balance
      ),
      option: decodeFromFieldsWithTypesGenericOrSpecial(Option.reified('u64'), item.fields.option),
      optionObj: decodeFromFieldsWithTypesGenericOrSpecial(
        Option.reified(Bar.reified()),
        item.fields.option_obj
      ),
      optionNone: decodeFromFieldsWithTypesGenericOrSpecial(
        Option.reified('u64'),
        item.fields.option_none
      ),
      balanceGeneric: decodeFromFieldsWithTypesGenericOrSpecial(
        Balance.reified(typeArgs[0]),
        item.fields.balance_generic
      ),
      optionGeneric: decodeFromFieldsWithTypesGenericOrSpecial(
        Option.reified(typeArgs[1]),
        item.fields.option_generic
      ),
      optionGenericNone: decodeFromFieldsWithTypesGenericOrSpecial(
        Option.reified(typeArgs[1]),
        item.fields.option_generic_none
      ),
    })
  }

  static fromBcs<T1 extends ReifiedTypeArgument>(
    typeArgs: [ReifiedTypeArgument, T1],
    data: Uint8Array
  ): WithSpecialTypes<ToTypeArgument<T1>> {
    return WithSpecialTypes.fromFields(
      typeArgs,
      WithSpecialTypes.bcs(toBcs(typeArgs[1])).parse(data)
    )
  }

  toJSON() {
    return {
      $typeArgs: this.$typeArgs,
      id: this.id,
      string: this.string,
      asciiString: this.asciiString,
      url: this.url,
      idField: this.idField,
      uid: this.uid,
      balance: this.balance.toJSON(),
      option: genericToJSON(`0x1::option::Option<u64>`, this.option),
      optionObj: genericToJSON(
        `0x1::option::Option<0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::Bar>`,
        this.optionObj
      ),
      optionNone: genericToJSON(`0x1::option::Option<u64>`, this.optionNone),
      balanceGeneric: this.balanceGeneric.toJSON(),
      optionGeneric: genericToJSON(`0x1::option::Option<${this.$typeArgs[1]}>`, this.optionGeneric),
      optionGenericNone: genericToJSON(
        `0x1::option::Option<${this.$typeArgs[1]}>`,
        this.optionGenericNone
      ),
    }
  }

  static fromSuiParsedData<T1 extends ReifiedTypeArgument>(
    typeArgs: [ReifiedTypeArgument, T1],
    content: SuiParsedData
  ): WithSpecialTypes<ToTypeArgument<T1>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isWithSpecialTypes(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a WithSpecialTypes object`)
    }
    return WithSpecialTypes.fromFieldsWithTypes(typeArgs, content)
  }

  static async fetch<T1 extends ReifiedTypeArgument>(
    client: SuiClient,
    typeArgs: [ReifiedTypeArgument, T1],
    id: string
  ): Promise<WithSpecialTypes<ToTypeArgument<T1>>> {
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
    return WithSpecialTypes.fromFieldsWithTypes(typeArgs, res.data.content)
  }
}

/* ============================== WithSpecialTypesAsGenerics =============================== */

export function isWithSpecialTypesAsGenerics(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithSpecialTypesAsGenerics<'
  )
}

export interface WithSpecialTypesAsGenericsFields<
  T0 extends TypeArgument,
  T1 extends TypeArgument,
  T2 extends TypeArgument,
  T3 extends TypeArgument,
  T4 extends TypeArgument,
  T5 extends TypeArgument,
  T6 extends TypeArgument,
  T7 extends TypeArgument,
> {
  id: ToField<UID>
  string: ToField<T0>
  asciiString: ToField<T1>
  url: ToField<T2>
  idField: ToField<T3>
  uid: ToField<T4>
  balance: ToField<T5>
  option: ToField<T6>
  optionNone: ToField<T7>
}

export class WithSpecialTypesAsGenerics<
  T0 extends TypeArgument,
  T1 extends TypeArgument,
  T2 extends TypeArgument,
  T3 extends TypeArgument,
  T4 extends TypeArgument,
  T5 extends TypeArgument,
  T6 extends TypeArgument,
  T7 extends TypeArgument,
> {
  static readonly $typeName =
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithSpecialTypesAsGenerics'
  static readonly $numTypeParams = 8

  readonly $typeName = WithSpecialTypesAsGenerics.$typeName

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

  readonly $typeArgs: [string, string, string, string, string, string, string, string]

  readonly id: ToField<UID>
  readonly string: ToField<T0>
  readonly asciiString: ToField<T1>
  readonly url: ToField<T2>
  readonly idField: ToField<T3>
  readonly uid: ToField<T4>
  readonly balance: ToField<T5>
  readonly option: ToField<T6>
  readonly optionNone: ToField<T7>

  private constructor(
    typeArgs: [string, string, string, string, string, string, string, string],
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

  static new<
    T0 extends ReifiedTypeArgument,
    T1 extends ReifiedTypeArgument,
    T2 extends ReifiedTypeArgument,
    T3 extends ReifiedTypeArgument,
    T4 extends ReifiedTypeArgument,
    T5 extends ReifiedTypeArgument,
    T6 extends ReifiedTypeArgument,
    T7 extends ReifiedTypeArgument,
  >(
    typeArgs: [T0, T1, T2, T3, T4, T5, T6, T7],
    fields: WithSpecialTypesAsGenericsFields<
      ToTypeArgument<T0>,
      ToTypeArgument<T1>,
      ToTypeArgument<T2>,
      ToTypeArgument<T3>,
      ToTypeArgument<T4>,
      ToTypeArgument<T5>,
      ToTypeArgument<T6>,
      ToTypeArgument<T7>
    >
  ): WithSpecialTypesAsGenerics<
    ToTypeArgument<T0>,
    ToTypeArgument<T1>,
    ToTypeArgument<T2>,
    ToTypeArgument<T3>,
    ToTypeArgument<T4>,
    ToTypeArgument<T5>,
    ToTypeArgument<T6>,
    ToTypeArgument<T7>
  > {
    return new WithSpecialTypesAsGenerics(
      typeArgs.map(extractType) as [string, string, string, string, string, string, string, string],
      fields
    )
  }

  static reified<
    T0 extends ReifiedTypeArgument,
    T1 extends ReifiedTypeArgument,
    T2 extends ReifiedTypeArgument,
    T3 extends ReifiedTypeArgument,
    T4 extends ReifiedTypeArgument,
    T5 extends ReifiedTypeArgument,
    T6 extends ReifiedTypeArgument,
    T7 extends ReifiedTypeArgument,
  >(T0: T0, T1: T1, T2: T2, T3: T3, T4: T4, T5: T5, T6: T6, T7: T7) {
    return {
      typeName: WithSpecialTypesAsGenerics.$typeName,
      typeArgs: [T0, T1, T2, T3, T4, T5, T6, T7],
      fromFields: (fields: Record<string, any>) =>
        WithSpecialTypesAsGenerics.fromFields([T0, T1, T2, T3, T4, T5, T6, T7], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        WithSpecialTypesAsGenerics.fromFieldsWithTypes([T0, T1, T2, T3, T4, T5, T6, T7], item),
      fromBcs: (data: Uint8Array) =>
        WithSpecialTypesAsGenerics.fromBcs([T0, T1, T2, T3, T4, T5, T6, T7], data),
      bcs: WithSpecialTypesAsGenerics.bcs(
        toBcs(T0),
        toBcs(T1),
        toBcs(T2),
        toBcs(T3),
        toBcs(T4),
        toBcs(T5),
        toBcs(T6),
        toBcs(T7)
      ),
      __class: null as unknown as ReturnType<
        typeof WithSpecialTypesAsGenerics.new<
          ToTypeArgument<T0>,
          ToTypeArgument<T1>,
          ToTypeArgument<T2>,
          ToTypeArgument<T3>,
          ToTypeArgument<T4>,
          ToTypeArgument<T5>,
          ToTypeArgument<T6>,
          ToTypeArgument<T7>
        >
      >,
    }
  }

  static fromFields<
    T0 extends ReifiedTypeArgument,
    T1 extends ReifiedTypeArgument,
    T2 extends ReifiedTypeArgument,
    T3 extends ReifiedTypeArgument,
    T4 extends ReifiedTypeArgument,
    T5 extends ReifiedTypeArgument,
    T6 extends ReifiedTypeArgument,
    T7 extends ReifiedTypeArgument,
  >(
    typeArgs: [T0, T1, T2, T3, T4, T5, T6, T7],
    fields: Record<string, any>
  ): WithSpecialTypesAsGenerics<
    ToTypeArgument<T0>,
    ToTypeArgument<T1>,
    ToTypeArgument<T2>,
    ToTypeArgument<T3>,
    ToTypeArgument<T4>,
    ToTypeArgument<T5>,
    ToTypeArgument<T6>,
    ToTypeArgument<T7>
  > {
    return WithSpecialTypesAsGenerics.new(typeArgs, {
      id: decodeFromFieldsGenericOrSpecial(UID.reified(), fields.id),
      string: decodeFromFieldsGenericOrSpecial(typeArgs[0], fields.string),
      asciiString: decodeFromFieldsGenericOrSpecial(typeArgs[1], fields.ascii_string),
      url: decodeFromFieldsGenericOrSpecial(typeArgs[2], fields.url),
      idField: decodeFromFieldsGenericOrSpecial(typeArgs[3], fields.id_field),
      uid: decodeFromFieldsGenericOrSpecial(typeArgs[4], fields.uid),
      balance: decodeFromFieldsGenericOrSpecial(typeArgs[5], fields.balance),
      option: decodeFromFieldsGenericOrSpecial(typeArgs[6], fields.option),
      optionNone: decodeFromFieldsGenericOrSpecial(typeArgs[7], fields.option_none),
    })
  }

  static fromFieldsWithTypes<
    T0 extends ReifiedTypeArgument,
    T1 extends ReifiedTypeArgument,
    T2 extends ReifiedTypeArgument,
    T3 extends ReifiedTypeArgument,
    T4 extends ReifiedTypeArgument,
    T5 extends ReifiedTypeArgument,
    T6 extends ReifiedTypeArgument,
    T7 extends ReifiedTypeArgument,
  >(
    typeArgs: [T0, T1, T2, T3, T4, T5, T6, T7],
    item: FieldsWithTypes
  ): WithSpecialTypesAsGenerics<
    ToTypeArgument<T0>,
    ToTypeArgument<T1>,
    ToTypeArgument<T2>,
    ToTypeArgument<T3>,
    ToTypeArgument<T4>,
    ToTypeArgument<T5>,
    ToTypeArgument<T6>,
    ToTypeArgument<T7>
  > {
    if (!isWithSpecialTypesAsGenerics(item.type)) {
      throw new Error('not a WithSpecialTypesAsGenerics type')
    }
    assertFieldsWithTypesArgsMatch(item, typeArgs)

    return WithSpecialTypesAsGenerics.new(typeArgs, {
      id: decodeFromFieldsWithTypesGenericOrSpecial(UID.reified(), item.fields.id),
      string: decodeFromFieldsWithTypesGenericOrSpecial(typeArgs[0], item.fields.string),
      asciiString: decodeFromFieldsWithTypesGenericOrSpecial(typeArgs[1], item.fields.ascii_string),
      url: decodeFromFieldsWithTypesGenericOrSpecial(typeArgs[2], item.fields.url),
      idField: decodeFromFieldsWithTypesGenericOrSpecial(typeArgs[3], item.fields.id_field),
      uid: decodeFromFieldsWithTypesGenericOrSpecial(typeArgs[4], item.fields.uid),
      balance: decodeFromFieldsWithTypesGenericOrSpecial(typeArgs[5], item.fields.balance),
      option: decodeFromFieldsWithTypesGenericOrSpecial(typeArgs[6], item.fields.option),
      optionNone: decodeFromFieldsWithTypesGenericOrSpecial(typeArgs[7], item.fields.option_none),
    })
  }

  static fromBcs<
    T0 extends ReifiedTypeArgument,
    T1 extends ReifiedTypeArgument,
    T2 extends ReifiedTypeArgument,
    T3 extends ReifiedTypeArgument,
    T4 extends ReifiedTypeArgument,
    T5 extends ReifiedTypeArgument,
    T6 extends ReifiedTypeArgument,
    T7 extends ReifiedTypeArgument,
  >(
    typeArgs: [T0, T1, T2, T3, T4, T5, T6, T7],
    data: Uint8Array
  ): WithSpecialTypesAsGenerics<
    ToTypeArgument<T0>,
    ToTypeArgument<T1>,
    ToTypeArgument<T2>,
    ToTypeArgument<T3>,
    ToTypeArgument<T4>,
    ToTypeArgument<T5>,
    ToTypeArgument<T6>,
    ToTypeArgument<T7>
  > {
    return WithSpecialTypesAsGenerics.fromFields(
      typeArgs,
      WithSpecialTypesAsGenerics.bcs(
        toBcs(typeArgs[0]),
        toBcs(typeArgs[1]),
        toBcs(typeArgs[2]),
        toBcs(typeArgs[3]),
        toBcs(typeArgs[4]),
        toBcs(typeArgs[5]),
        toBcs(typeArgs[6]),
        toBcs(typeArgs[7])
      ).parse(data)
    )
  }

  toJSON() {
    return {
      $typeArgs: this.$typeArgs,
      id: this.id,
      string: genericToJSON(this.$typeArgs[0], this.string),
      asciiString: genericToJSON(this.$typeArgs[1], this.asciiString),
      url: genericToJSON(this.$typeArgs[2], this.url),
      idField: genericToJSON(this.$typeArgs[3], this.idField),
      uid: genericToJSON(this.$typeArgs[4], this.uid),
      balance: genericToJSON(this.$typeArgs[5], this.balance),
      option: genericToJSON(this.$typeArgs[6], this.option),
      optionNone: genericToJSON(this.$typeArgs[7], this.optionNone),
    }
  }

  static fromSuiParsedData<
    T0 extends ReifiedTypeArgument,
    T1 extends ReifiedTypeArgument,
    T2 extends ReifiedTypeArgument,
    T3 extends ReifiedTypeArgument,
    T4 extends ReifiedTypeArgument,
    T5 extends ReifiedTypeArgument,
    T6 extends ReifiedTypeArgument,
    T7 extends ReifiedTypeArgument,
  >(
    typeArgs: [T0, T1, T2, T3, T4, T5, T6, T7],
    content: SuiParsedData
  ): WithSpecialTypesAsGenerics<
    ToTypeArgument<T0>,
    ToTypeArgument<T1>,
    ToTypeArgument<T2>,
    ToTypeArgument<T3>,
    ToTypeArgument<T4>,
    ToTypeArgument<T5>,
    ToTypeArgument<T6>,
    ToTypeArgument<T7>
  > {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isWithSpecialTypesAsGenerics(content.type)) {
      throw new Error(
        `object at ${(content.fields as any).id} is not a WithSpecialTypesAsGenerics object`
      )
    }
    return WithSpecialTypesAsGenerics.fromFieldsWithTypes(typeArgs, content)
  }

  static async fetch<
    T0 extends ReifiedTypeArgument,
    T1 extends ReifiedTypeArgument,
    T2 extends ReifiedTypeArgument,
    T3 extends ReifiedTypeArgument,
    T4 extends ReifiedTypeArgument,
    T5 extends ReifiedTypeArgument,
    T6 extends ReifiedTypeArgument,
    T7 extends ReifiedTypeArgument,
  >(
    client: SuiClient,
    typeArgs: [T0, T1, T2, T3, T4, T5, T6, T7],
    id: string
  ): Promise<
    WithSpecialTypesAsGenerics<
      ToTypeArgument<T0>,
      ToTypeArgument<T1>,
      ToTypeArgument<T2>,
      ToTypeArgument<T3>,
      ToTypeArgument<T4>,
      ToTypeArgument<T5>,
      ToTypeArgument<T6>,
      ToTypeArgument<T7>
    >
  > {
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
    return WithSpecialTypesAsGenerics.fromFieldsWithTypes(typeArgs, res.data.content)
  }
}

/* ============================== WithSpecialTypesInVectors =============================== */

export function isWithSpecialTypesInVectors(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithSpecialTypesInVectors<'
  )
}

export interface WithSpecialTypesInVectorsFields<T0 extends TypeArgument> {
  id: ToField<UID>
  string: Array<ToField<String>>
  asciiString: Array<ToField<String1>>
  idField: Array<ToField<ID>>
  bar: Array<ToField<Bar>>
  option: Array<ToField<Option<'u64'>>>
  optionGeneric: Array<ToField<Option<T0>>>
}

export class WithSpecialTypesInVectors<T0 extends TypeArgument> {
  static readonly $typeName =
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithSpecialTypesInVectors'
  static readonly $numTypeParams = 1

  readonly $typeName = WithSpecialTypesInVectors.$typeName

  static get bcs() {
    return <T0 extends BcsType<any>>(T0: T0) =>
      bcs.struct(`WithSpecialTypesInVectors<${T0.name}>`, {
        id: UID.bcs,
        string: bcs.vector(String.bcs),
        ascii_string: bcs.vector(String1.bcs),
        id_field: bcs.vector(ID.bcs),
        bar: bcs.vector(Bar.bcs),
        option: bcs.vector(Option.bcs(bcs.u64())),
        option_generic: bcs.vector(Option.bcs(T0)),
      })
  }

  readonly $typeArg: string

  readonly id: ToField<UID>
  readonly string: Array<ToField<String>>
  readonly asciiString: Array<ToField<String1>>
  readonly idField: Array<ToField<ID>>
  readonly bar: Array<ToField<Bar>>
  readonly option: Array<ToField<Option<'u64'>>>
  readonly optionGeneric: Array<ToField<Option<T0>>>

  private constructor(typeArg: string, fields: WithSpecialTypesInVectorsFields<T0>) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.string = fields.string
    this.asciiString = fields.asciiString
    this.idField = fields.idField
    this.bar = fields.bar
    this.option = fields.option
    this.optionGeneric = fields.optionGeneric
  }

  static new<T0 extends ReifiedTypeArgument>(
    typeArg: T0,
    fields: WithSpecialTypesInVectorsFields<ToTypeArgument<T0>>
  ): WithSpecialTypesInVectors<ToTypeArgument<T0>> {
    return new WithSpecialTypesInVectors(extractType(typeArg), fields)
  }

  static reified<T0 extends ReifiedTypeArgument>(T0: T0) {
    return {
      typeName: WithSpecialTypesInVectors.$typeName,
      typeArgs: [T0],
      fromFields: (fields: Record<string, any>) => WithSpecialTypesInVectors.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        WithSpecialTypesInVectors.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => WithSpecialTypesInVectors.fromBcs(T0, data),
      bcs: WithSpecialTypesInVectors.bcs(toBcs(T0)),
      __class: null as unknown as ReturnType<
        typeof WithSpecialTypesInVectors.new<ToTypeArgument<T0>>
      >,
    }
  }

  static fromFields<T0 extends ReifiedTypeArgument>(
    typeArg: T0,
    fields: Record<string, any>
  ): WithSpecialTypesInVectors<ToTypeArgument<T0>> {
    return WithSpecialTypesInVectors.new(typeArg, {
      id: decodeFromFieldsGenericOrSpecial(UID.reified(), fields.id),
      string: decodeFromFieldsGenericOrSpecial(reified.vector(String.reified()), fields.string),
      asciiString: decodeFromFieldsGenericOrSpecial(
        reified.vector(String1.reified()),
        fields.ascii_string
      ),
      idField: decodeFromFieldsGenericOrSpecial(reified.vector(ID.reified()), fields.id_field),
      bar: decodeFromFieldsGenericOrSpecial(reified.vector(Bar.reified()), fields.bar),
      option: decodeFromFieldsGenericOrSpecial(
        reified.vector(Option.reified('u64')),
        fields.option
      ),
      optionGeneric: decodeFromFieldsGenericOrSpecial(
        reified.vector(Option.reified(typeArg)),
        fields.option_generic
      ),
    })
  }

  static fromFieldsWithTypes<T0 extends ReifiedTypeArgument>(
    typeArg: T0,
    item: FieldsWithTypes
  ): WithSpecialTypesInVectors<ToTypeArgument<T0>> {
    if (!isWithSpecialTypesInVectors(item.type)) {
      throw new Error('not a WithSpecialTypesInVectors type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return WithSpecialTypesInVectors.new(typeArg, {
      id: decodeFromFieldsWithTypesGenericOrSpecial(UID.reified(), item.fields.id),
      string: decodeFromFieldsWithTypesGenericOrSpecial(
        reified.vector(String.reified()),
        item.fields.string
      ),
      asciiString: decodeFromFieldsWithTypesGenericOrSpecial(
        reified.vector(String1.reified()),
        item.fields.ascii_string
      ),
      idField: decodeFromFieldsWithTypesGenericOrSpecial(
        reified.vector(ID.reified()),
        item.fields.id_field
      ),
      bar: decodeFromFieldsWithTypesGenericOrSpecial(
        reified.vector(Bar.reified()),
        item.fields.bar
      ),
      option: decodeFromFieldsWithTypesGenericOrSpecial(
        reified.vector(Option.reified('u64')),
        item.fields.option
      ),
      optionGeneric: decodeFromFieldsWithTypesGenericOrSpecial(
        reified.vector(Option.reified(typeArg)),
        item.fields.option_generic
      ),
    })
  }

  static fromBcs<T0 extends ReifiedTypeArgument>(
    typeArg: T0,
    data: Uint8Array
  ): WithSpecialTypesInVectors<ToTypeArgument<T0>> {
    const typeArgs = [typeArg]

    return WithSpecialTypesInVectors.fromFields(
      typeArg,
      WithSpecialTypesInVectors.bcs(toBcs(typeArgs[0])).parse(data)
    )
  }

  toJSON() {
    return {
      $typeArg: this.$typeArg,
      id: this.id,
      string: genericToJSON(`vector<0x1::string::String>`, this.string),
      asciiString: genericToJSON(`vector<0x1::ascii::String>`, this.asciiString),
      idField: genericToJSON(`vector<0x2::object::ID>`, this.idField),
      bar: genericToJSON(
        `vector<0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::Bar>`,
        this.bar
      ),
      option: genericToJSON(`vector<0x1::option::Option<u64>>`, this.option),
      optionGeneric: genericToJSON(
        `vector<0x1::option::Option<${this.$typeArg}>>`,
        this.optionGeneric
      ),
    }
  }

  static fromSuiParsedData<T0 extends ReifiedTypeArgument>(
    typeArg: T0,
    content: SuiParsedData
  ): WithSpecialTypesInVectors<ToTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isWithSpecialTypesInVectors(content.type)) {
      throw new Error(
        `object at ${(content.fields as any).id} is not a WithSpecialTypesInVectors object`
      )
    }
    return WithSpecialTypesInVectors.fromFieldsWithTypes(typeArg, content)
  }

  static async fetch<T0 extends ReifiedTypeArgument>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<WithSpecialTypesInVectors<ToTypeArgument<T0>>> {
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
    return WithSpecialTypesInVectors.fromFieldsWithTypes(typeArg, res.data.content)
  }
}
