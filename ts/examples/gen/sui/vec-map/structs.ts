import * as reified from '../../_framework/reified'
import {
  ReifiedTypeArgument,
  ToField,
  ToPhantomTypeArgument,
  ToTypeArgument,
  TypeArgument,
  Vector,
  assertFieldsWithTypesArgsMatch,
  assertReifiedTypeArgsMatch,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  extractType,
  fieldToJSON,
  toBcs,
  ToTypeStr as ToPhantom,
} from '../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../_framework/util'
import { BcsType, bcs } from '@mysten/bcs'

/* ============================== Entry =============================== */

export function isEntry(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::vec_map::Entry<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface EntryFields<K extends TypeArgument, V extends TypeArgument> {
  key: ToField<K>
  value: ToField<V>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Entry<K extends TypeArgument, V extends TypeArgument> {
  static readonly $typeName = '0x2::vec_map::Entry'
  static readonly $numTypeParams = 2

  __reifiedFullTypeString =
    null as unknown as `0x2::vec_map::Entry<${ToPhantom<K>}, ${ToPhantom<V>}>`

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
      fullTypeName: composeSuiType(
        Entry.$typeName,
        ...[extractType(K), extractType(V)]
      ) as `0x2::vec_map::Entry<${ToPhantomTypeArgument<K>}, ${ToPhantomTypeArgument<V>}>`,
      fromFields: (fields: Record<string, any>) => Entry.fromFields([K, V], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Entry.fromFieldsWithTypes([K, V], item),
      fromBcs: (data: Uint8Array) => Entry.fromBcs([K, V], data),
      bcs: Entry.bcs(toBcs(K), toBcs(V)),
      fromJSONField: (field: any) => Entry.fromJSONField([K, V], field),
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
      key: decodeFromFields(typeArgs[0], fields.key),
      value: decodeFromFields(typeArgs[1], fields.value),
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
      key: decodeFromFieldsWithTypes(typeArgs[0], item.fields.key),
      value: decodeFromFieldsWithTypes(typeArgs[1], item.fields.value),
    })
  }

  static fromBcs<K extends ReifiedTypeArgument, V extends ReifiedTypeArgument>(
    typeArgs: [K, V],
    data: Uint8Array
  ): Entry<ToTypeArgument<K>, ToTypeArgument<V>> {
    return Entry.fromFields(typeArgs, Entry.bcs(toBcs(typeArgs[0]), toBcs(typeArgs[1])).parse(data))
  }

  toJSONField() {
    return {
      key: fieldToJSON<K>(this.$typeArgs[0], this.key),
      value: fieldToJSON<V>(this.$typeArgs[1], this.value),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<K extends ReifiedTypeArgument, V extends ReifiedTypeArgument>(
    typeArgs: [K, V],
    field: any
  ): Entry<ToTypeArgument<K>, ToTypeArgument<V>> {
    return Entry.new(typeArgs, {
      key: decodeFromJSONField(typeArgs[0], field.key),
      value: decodeFromJSONField(typeArgs[1], field.value),
    })
  }

  static fromJSON<K extends ReifiedTypeArgument, V extends ReifiedTypeArgument>(
    typeArgs: [K, V],
    json: Record<string, any>
  ): Entry<ToTypeArgument<K>, ToTypeArgument<V>> {
    if (json.$typeName !== Entry.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Entry.$typeName, ...typeArgs.map(extractType)),
      json.$typeArgs,
      typeArgs
    )

    return Entry.fromJSONField(typeArgs, json)
  }
}

/* ============================== VecMap =============================== */

export function isVecMap(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::vec_map::VecMap<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface VecMapFields<K extends TypeArgument, V extends TypeArgument> {
  contents: ToField<Vector<Entry<K, V>>>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class VecMap<K extends TypeArgument, V extends TypeArgument> {
  static readonly $typeName = '0x2::vec_map::VecMap'
  static readonly $numTypeParams = 2

  __reifiedFullTypeString =
    null as unknown as `0x2::vec_map::VecMap<${ToPhantom<K>}, ${ToPhantom<V>}>`

  readonly $typeName = VecMap.$typeName

  static get bcs() {
    return <K extends BcsType<any>, V extends BcsType<any>>(K: K, V: V) =>
      bcs.struct(`VecMap<${K.name}, ${V.name}>`, {
        contents: bcs.vector(Entry.bcs(K, V)),
      })
  }

  readonly $typeArgs: [string, string]

  readonly contents: ToField<Vector<Entry<K, V>>>

  private constructor(typeArgs: [string, string], contents: ToField<Vector<Entry<K, V>>>) {
    this.$typeArgs = typeArgs

    this.contents = contents
  }

  static new<K extends ReifiedTypeArgument, V extends ReifiedTypeArgument>(
    typeArgs: [K, V],
    contents: ToField<Vector<Entry<ToTypeArgument<K>, ToTypeArgument<V>>>>
  ): VecMap<ToTypeArgument<K>, ToTypeArgument<V>> {
    return new VecMap(typeArgs.map(extractType) as [string, string], contents)
  }

  static reified<K extends ReifiedTypeArgument, V extends ReifiedTypeArgument>(K: K, V: V) {
    return {
      typeName: VecMap.$typeName,
      typeArgs: [K, V],
      fullTypeName: composeSuiType(
        VecMap.$typeName,
        ...[extractType(K), extractType(V)]
      ) as `0x2::vec_map::VecMap<${ToPhantomTypeArgument<K>}, ${ToPhantomTypeArgument<V>}>`,
      fromFields: (fields: Record<string, any>) => VecMap.fromFields([K, V], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => VecMap.fromFieldsWithTypes([K, V], item),
      fromBcs: (data: Uint8Array) => VecMap.fromBcs([K, V], data),
      bcs: VecMap.bcs(toBcs(K), toBcs(V)),
      fromJSONField: (field: any) => VecMap.fromJSONField([K, V], field),
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
      decodeFromFields(reified.vector(Entry.reified(typeArgs[0], typeArgs[1])), fields.contents)
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
      decodeFromFieldsWithTypes(
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

  toJSONField() {
    return {
      contents: fieldToJSON<Vector<Entry<K, V>>>(
        `vector<0x2::vec_map::Entry<${this.$typeArgs[0]}, ${this.$typeArgs[1]}>>`,
        this.contents
      ),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<K extends ReifiedTypeArgument, V extends ReifiedTypeArgument>(
    typeArgs: [K, V],
    field: any
  ): VecMap<ToTypeArgument<K>, ToTypeArgument<V>> {
    return VecMap.new(
      typeArgs,
      decodeFromJSONField(reified.vector(Entry.reified(typeArgs[0], typeArgs[1])), field.contents)
    )
  }

  static fromJSON<K extends ReifiedTypeArgument, V extends ReifiedTypeArgument>(
    typeArgs: [K, V],
    json: Record<string, any>
  ): VecMap<ToTypeArgument<K>, ToTypeArgument<V>> {
    if (json.$typeName !== VecMap.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(VecMap.$typeName, ...typeArgs.map(extractType)),
      json.$typeArgs,
      typeArgs
    )

    return VecMap.fromJSONField(typeArgs, json)
  }
}
