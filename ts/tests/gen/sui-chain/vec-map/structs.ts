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
import { FieldsWithTypes, Type, compressSuiType, genericToJSON } from '../../_framework/util'
import { BcsType, bcs } from '@mysten/bcs'

/* ============================== Entry =============================== */

export function isEntry(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::vec_map::Entry<')
}

export interface EntryFields<T0 extends TypeArgument, T1 extends TypeArgument> {
  key: ToField<T0>
  value: ToField<T1>
}

export class Entry<T0 extends TypeArgument, T1 extends TypeArgument> {
  static readonly $typeName = '0x2::vec_map::Entry'
  static readonly $numTypeParams = 2

  readonly $typeName = Entry.$typeName

  static get bcs() {
    return <T0 extends BcsType<any>, T1 extends BcsType<any>>(T0: T0, T1: T1) =>
      bcs.struct(`Entry<${T0.name}, ${T1.name}>`, {
        key: T0,
        value: T1,
      })
  }

  readonly $typeArgs: [string, string]

  readonly key: ToField<T0>
  readonly value: ToField<T1>

  private constructor(typeArgs: [string, string], fields: EntryFields<T0, T1>) {
    this.$typeArgs = typeArgs

    this.key = fields.key
    this.value = fields.value
  }

  static new<T0 extends ReifiedTypeArgument, T1 extends ReifiedTypeArgument>(
    typeArgs: [T0, T1],
    fields: EntryFields<ToTypeArgument<T0>, ToTypeArgument<T1>>
  ): Entry<ToTypeArgument<T0>, ToTypeArgument<T1>> {
    return new Entry(typeArgs.map(extractType) as [string, string], fields)
  }

  static reified<T0 extends ReifiedTypeArgument, T1 extends ReifiedTypeArgument>(T0: T0, T1: T1) {
    return {
      typeName: Entry.$typeName,
      typeArgs: [T0, T1],
      fromFields: (fields: Record<string, any>) => Entry.fromFields([T0, T1], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Entry.fromFieldsWithTypes([T0, T1], item),
      fromBcs: (data: Uint8Array) => Entry.fromBcs([T0, T1], data),
      bcs: Entry.bcs(toBcs(T0), toBcs(T1)),
      __class: null as unknown as ReturnType<
        typeof Entry.new<ToTypeArgument<T0>, ToTypeArgument<T1>>
      >,
    }
  }

  static fromFields<T0 extends ReifiedTypeArgument, T1 extends ReifiedTypeArgument>(
    typeArgs: [T0, T1],
    fields: Record<string, any>
  ): Entry<ToTypeArgument<T0>, ToTypeArgument<T1>> {
    return Entry.new(typeArgs, {
      key: decodeFromFieldsGenericOrSpecial(typeArgs[0], fields.key),
      value: decodeFromFieldsGenericOrSpecial(typeArgs[1], fields.value),
    })
  }

  static fromFieldsWithTypes<T0 extends ReifiedTypeArgument, T1 extends ReifiedTypeArgument>(
    typeArgs: [T0, T1],
    item: FieldsWithTypes
  ): Entry<ToTypeArgument<T0>, ToTypeArgument<T1>> {
    if (!isEntry(item.type)) {
      throw new Error('not a Entry type')
    }
    assertFieldsWithTypesArgsMatch(item, typeArgs)

    return Entry.new(typeArgs, {
      key: decodeFromFieldsWithTypesGenericOrSpecial(typeArgs[0], item.fields.key),
      value: decodeFromFieldsWithTypesGenericOrSpecial(typeArgs[1], item.fields.value),
    })
  }

  static fromBcs<T0 extends ReifiedTypeArgument, T1 extends ReifiedTypeArgument>(
    typeArgs: [T0, T1],
    data: Uint8Array
  ): Entry<ToTypeArgument<T0>, ToTypeArgument<T1>> {
    return Entry.fromFields(typeArgs, Entry.bcs(toBcs(typeArgs[0]), toBcs(typeArgs[1])).parse(data))
  }

  toJSON() {
    return {
      $typeArgs: this.$typeArgs,
      key: genericToJSON(this.$typeArgs[0], this.key),
      value: genericToJSON(this.$typeArgs[1], this.value),
    }
  }
}

/* ============================== VecMap =============================== */

export function isVecMap(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::vec_map::VecMap<')
}

export interface VecMapFields<T0 extends TypeArgument, T1 extends TypeArgument> {
  contents: Array<ToField<Entry<T0, T1>>>
}

export class VecMap<T0 extends TypeArgument, T1 extends TypeArgument> {
  static readonly $typeName = '0x2::vec_map::VecMap'
  static readonly $numTypeParams = 2

  readonly $typeName = VecMap.$typeName

  static get bcs() {
    return <T0 extends BcsType<any>, T1 extends BcsType<any>>(T0: T0, T1: T1) =>
      bcs.struct(`VecMap<${T0.name}, ${T1.name}>`, {
        contents: bcs.vector(Entry.bcs(T0, T1)),
      })
  }

  readonly $typeArgs: [string, string]

  readonly contents: Array<ToField<Entry<T0, T1>>>

  private constructor(typeArgs: [string, string], contents: Array<ToField<Entry<T0, T1>>>) {
    this.$typeArgs = typeArgs

    this.contents = contents
  }

  static new<T0 extends ReifiedTypeArgument, T1 extends ReifiedTypeArgument>(
    typeArgs: [T0, T1],
    contents: Array<ToField<Entry<ToTypeArgument<T0>, ToTypeArgument<T1>>>>
  ): VecMap<ToTypeArgument<T0>, ToTypeArgument<T1>> {
    return new VecMap(typeArgs.map(extractType) as [string, string], contents)
  }

  static reified<T0 extends ReifiedTypeArgument, T1 extends ReifiedTypeArgument>(T0: T0, T1: T1) {
    return {
      typeName: VecMap.$typeName,
      typeArgs: [T0, T1],
      fromFields: (fields: Record<string, any>) => VecMap.fromFields([T0, T1], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => VecMap.fromFieldsWithTypes([T0, T1], item),
      fromBcs: (data: Uint8Array) => VecMap.fromBcs([T0, T1], data),
      bcs: VecMap.bcs(toBcs(T0), toBcs(T1)),
      __class: null as unknown as ReturnType<
        typeof VecMap.new<ToTypeArgument<T0>, ToTypeArgument<T1>>
      >,
    }
  }

  static fromFields<T0 extends ReifiedTypeArgument, T1 extends ReifiedTypeArgument>(
    typeArgs: [T0, T1],
    fields: Record<string, any>
  ): VecMap<ToTypeArgument<T0>, ToTypeArgument<T1>> {
    return VecMap.new(
      typeArgs,
      decodeFromFieldsGenericOrSpecial(
        reified.vector(Entry.reified(typeArgs[0], typeArgs[1])),
        fields.contents
      )
    )
  }

  static fromFieldsWithTypes<T0 extends ReifiedTypeArgument, T1 extends ReifiedTypeArgument>(
    typeArgs: [T0, T1],
    item: FieldsWithTypes
  ): VecMap<ToTypeArgument<T0>, ToTypeArgument<T1>> {
    if (!isVecMap(item.type)) {
      throw new Error('not a VecMap type')
    }
    assertFieldsWithTypesArgsMatch(item, typeArgs)

    return VecMap.new(
      typeArgs,
      decodeFromFieldsWithTypesGenericOrSpecial(
        reified.vector(Entry.reified(typeArgs[0], typeArgs[1])),
        item.fields.contents
      )
    )
  }

  static fromBcs<T0 extends ReifiedTypeArgument, T1 extends ReifiedTypeArgument>(
    typeArgs: [T0, T1],
    data: Uint8Array
  ): VecMap<ToTypeArgument<T0>, ToTypeArgument<T1>> {
    return VecMap.fromFields(
      typeArgs,
      VecMap.bcs(toBcs(typeArgs[0]), toBcs(typeArgs[1])).parse(data)
    )
  }

  toJSON() {
    return {
      $typeArgs: this.$typeArgs,
      contents: genericToJSON(
        `vector<0x2::vec_map::Entry<${this.$typeArgs[0]}, ${this.$typeArgs[1]}>>`,
        this.contents
      ),
    }
  }
}
