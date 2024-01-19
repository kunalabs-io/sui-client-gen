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

export interface EntryFields<K extends TypeArgument, V extends TypeArgument> {
  key: ToField<K>
  value: ToField<V>
}

export class Entry<K extends TypeArgument, V extends TypeArgument> {
  static readonly $typeName = '0x2::vec_map::Entry'
  static readonly $numTypeParams = 2

  readonly $typeName = Entry.$typeName

  static get bcs() {
    return <K extends BcsType<any>, V extends BcsType<any>>(K: K, V: V) =>
      bcs.struct(`Entry<${K.name}, ${V.name}>`, {
        key: K,
        value: V,
      })
  }

  readonly $typeArgs: [string, string]

  readonly key: ToField<K>
  readonly value: ToField<V>

  private constructor(typeArgs: [string, string], fields: EntryFields<K, V>) {
    this.$typeArgs = typeArgs

    this.key = fields.key
    this.value = fields.value
  }

  static new<K extends ReifiedTypeArgument, V extends ReifiedTypeArgument>(
    typeArgs: [K, V],
    fields: EntryFields<ToTypeArgument<K>, ToTypeArgument<V>>
  ): Entry<ToTypeArgument<K>, ToTypeArgument<V>> {
    return new Entry(typeArgs.map(extractType) as [string, string], fields)
  }

  static reified<K extends ReifiedTypeArgument, V extends ReifiedTypeArgument>(K: K, V: V) {
    return {
      typeName: Entry.$typeName,
      typeArgs: [K, V],
      fromFields: (fields: Record<string, any>) => Entry.fromFields([K, V], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Entry.fromFieldsWithTypes([K, V], item),
      fromBcs: (data: Uint8Array) => Entry.fromBcs([K, V], data),
      bcs: Entry.bcs(toBcs(K), toBcs(V)),
      __class: null as unknown as ReturnType<
        typeof Entry.new<ToTypeArgument<K>, ToTypeArgument<V>>
      >,
    }
  }

  static fromFields<K extends ReifiedTypeArgument, V extends ReifiedTypeArgument>(
    typeArgs: [K, V],
    fields: Record<string, any>
  ): Entry<ToTypeArgument<K>, ToTypeArgument<V>> {
    return Entry.new(typeArgs, {
      key: decodeFromFieldsGenericOrSpecial(typeArgs[0], fields.key),
      value: decodeFromFieldsGenericOrSpecial(typeArgs[1], fields.value),
    })
  }

  static fromFieldsWithTypes<K extends ReifiedTypeArgument, V extends ReifiedTypeArgument>(
    typeArgs: [K, V],
    item: FieldsWithTypes
  ): Entry<ToTypeArgument<K>, ToTypeArgument<V>> {
    if (!isEntry(item.type)) {
      throw new Error('not a Entry type')
    }
    assertFieldsWithTypesArgsMatch(item, typeArgs)

    return Entry.new(typeArgs, {
      key: decodeFromFieldsWithTypesGenericOrSpecial(typeArgs[0], item.fields.key),
      value: decodeFromFieldsWithTypesGenericOrSpecial(typeArgs[1], item.fields.value),
    })
  }

  static fromBcs<K extends ReifiedTypeArgument, V extends ReifiedTypeArgument>(
    typeArgs: [K, V],
    data: Uint8Array
  ): Entry<ToTypeArgument<K>, ToTypeArgument<V>> {
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

export interface VecMapFields<K extends TypeArgument, V extends TypeArgument> {
  contents: Array<ToField<Entry<K, V>>>
}

export class VecMap<K extends TypeArgument, V extends TypeArgument> {
  static readonly $typeName = '0x2::vec_map::VecMap'
  static readonly $numTypeParams = 2

  readonly $typeName = VecMap.$typeName

  static get bcs() {
    return <K extends BcsType<any>, V extends BcsType<any>>(K: K, V: V) =>
      bcs.struct(`VecMap<${K.name}, ${V.name}>`, {
        contents: bcs.vector(Entry.bcs(K, V)),
      })
  }

  readonly $typeArgs: [string, string]

  readonly contents: Array<ToField<Entry<K, V>>>

  private constructor(typeArgs: [string, string], contents: Array<ToField<Entry<K, V>>>) {
    this.$typeArgs = typeArgs

    this.contents = contents
  }

  static new<K extends ReifiedTypeArgument, V extends ReifiedTypeArgument>(
    typeArgs: [K, V],
    contents: Array<ToField<Entry<ToTypeArgument<K>, ToTypeArgument<V>>>>
  ): VecMap<ToTypeArgument<K>, ToTypeArgument<V>> {
    return new VecMap(typeArgs.map(extractType) as [string, string], contents)
  }

  static reified<K extends ReifiedTypeArgument, V extends ReifiedTypeArgument>(K: K, V: V) {
    return {
      typeName: VecMap.$typeName,
      typeArgs: [K, V],
      fromFields: (fields: Record<string, any>) => VecMap.fromFields([K, V], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => VecMap.fromFieldsWithTypes([K, V], item),
      fromBcs: (data: Uint8Array) => VecMap.fromBcs([K, V], data),
      bcs: VecMap.bcs(toBcs(K), toBcs(V)),
      __class: null as unknown as ReturnType<
        typeof VecMap.new<ToTypeArgument<K>, ToTypeArgument<V>>
      >,
    }
  }

  static fromFields<K extends ReifiedTypeArgument, V extends ReifiedTypeArgument>(
    typeArgs: [K, V],
    fields: Record<string, any>
  ): VecMap<ToTypeArgument<K>, ToTypeArgument<V>> {
    return VecMap.new(
      typeArgs,
      decodeFromFieldsGenericOrSpecial(
        reified.vector(Entry.reified(typeArgs[0], typeArgs[1])),
        fields.contents
      )
    )
  }

  static fromFieldsWithTypes<K extends ReifiedTypeArgument, V extends ReifiedTypeArgument>(
    typeArgs: [K, V],
    item: FieldsWithTypes
  ): VecMap<ToTypeArgument<K>, ToTypeArgument<V>> {
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

  static fromBcs<K extends ReifiedTypeArgument, V extends ReifiedTypeArgument>(
    typeArgs: [K, V],
    data: Uint8Array
  ): VecMap<ToTypeArgument<K>, ToTypeArgument<V>> {
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
