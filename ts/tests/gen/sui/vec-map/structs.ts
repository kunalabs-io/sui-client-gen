import * as reified from '../../_framework/reified'
import {
  PhantomReified,
  Reified,
  StructClass,
  ToField,
  ToTypeArgument,
  ToTypeStr,
  TypeArgument,
  assertFieldsWithTypesArgsMatch,
  assertReifiedTypeArgsMatch,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  extractType,
  fieldToJSON,
  phantom,
  toBcs,
} from '../../_framework/reified'
import {
  FieldsWithTypes,
  composeSuiType,
  compressSuiType,
  parseTypeName,
} from '../../_framework/util'
import { Vector } from '../../_framework/vector'
import { PKG_V21 } from '../index'
import { BcsType, bcs } from '@mysten/sui/bcs'
import { SuiClient, SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromB64 } from '@mysten/sui/utils'

/* ============================== Entry =============================== */

export function isEntry(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`${PKG_V21}::vec_map::Entry` + '<')
}

export interface EntryFields<K extends TypeArgument, V extends TypeArgument> {
  key: ToField<K>
  value: ToField<V>
}

export type EntryReified<K extends TypeArgument, V extends TypeArgument> = Reified<
  Entry<K, V>,
  EntryFields<K, V>
>

export class Entry<K extends TypeArgument, V extends TypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `${PKG_V21}::vec_map::Entry`
  static readonly $numTypeParams = 2
  static readonly $isPhantom = [false, false] as const

  readonly $typeName = Entry.$typeName
  readonly $fullTypeName: `${typeof PKG_V21}::vec_map::Entry<${ToTypeStr<K>}, ${ToTypeStr<V>}>`
  readonly $typeArgs: [ToTypeStr<K>, ToTypeStr<V>]
  readonly $isPhantom = Entry.$isPhantom

  readonly key: ToField<K>
  readonly value: ToField<V>

  private constructor(typeArgs: [ToTypeStr<K>, ToTypeStr<V>], fields: EntryFields<K, V>) {
    this.$fullTypeName = composeSuiType(
      Entry.$typeName,
      ...typeArgs
    ) as `${typeof PKG_V21}::vec_map::Entry<${ToTypeStr<K>}, ${ToTypeStr<V>}>`
    this.$typeArgs = typeArgs

    this.key = fields.key
    this.value = fields.value
  }

  static reified<K extends Reified<TypeArgument, any>, V extends Reified<TypeArgument, any>>(
    K: K,
    V: V
  ): EntryReified<ToTypeArgument<K>, ToTypeArgument<V>> {
    return {
      typeName: Entry.$typeName,
      fullTypeName: composeSuiType(
        Entry.$typeName,
        ...[extractType(K), extractType(V)]
      ) as `${typeof PKG_V21}::vec_map::Entry<${ToTypeStr<ToTypeArgument<K>>}, ${ToTypeStr<ToTypeArgument<V>>}>`,
      typeArgs: [extractType(K), extractType(V)] as [
        ToTypeStr<ToTypeArgument<K>>,
        ToTypeStr<ToTypeArgument<V>>,
      ],
      isPhantom: Entry.$isPhantom,
      reifiedTypeArgs: [K, V],
      fromFields: (fields: Record<string, any>) => Entry.fromFields([K, V], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Entry.fromFieldsWithTypes([K, V], item),
      fromBcs: (data: Uint8Array) => Entry.fromBcs([K, V], data),
      bcs: Entry.bcs(toBcs(K), toBcs(V)),
      fromJSONField: (field: any) => Entry.fromJSONField([K, V], field),
      fromJSON: (json: Record<string, any>) => Entry.fromJSON([K, V], json),
      fromSuiParsedData: (content: SuiParsedData) => Entry.fromSuiParsedData([K, V], content),
      fromSuiObjectData: (content: SuiObjectData) => Entry.fromSuiObjectData([K, V], content),
      fetch: async (client: SuiClient, id: string) => Entry.fetch(client, [K, V], id),
      new: (fields: EntryFields<ToTypeArgument<K>, ToTypeArgument<V>>) => {
        return new Entry([extractType(K), extractType(V)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Entry.reified
  }

  static phantom<K extends Reified<TypeArgument, any>, V extends Reified<TypeArgument, any>>(
    K: K,
    V: V
  ): PhantomReified<ToTypeStr<Entry<ToTypeArgument<K>, ToTypeArgument<V>>>> {
    return phantom(Entry.reified(K, V))
  }
  static get p() {
    return Entry.phantom
  }

  static get bcs() {
    return <K extends BcsType<any>, V extends BcsType<any>>(K: K, V: V) =>
      bcs.struct(`Entry<${K.name}, ${V.name}>`, {
        key: K,
        value: V,
      })
  }

  static fromFields<K extends Reified<TypeArgument, any>, V extends Reified<TypeArgument, any>>(
    typeArgs: [K, V],
    fields: Record<string, any>
  ): Entry<ToTypeArgument<K>, ToTypeArgument<V>> {
    return Entry.reified(typeArgs[0], typeArgs[1]).new({
      key: decodeFromFields(typeArgs[0], fields.key),
      value: decodeFromFields(typeArgs[1], fields.value),
    })
  }

  static fromFieldsWithTypes<
    K extends Reified<TypeArgument, any>,
    V extends Reified<TypeArgument, any>,
  >(typeArgs: [K, V], item: FieldsWithTypes): Entry<ToTypeArgument<K>, ToTypeArgument<V>> {
    if (!isEntry(item.type)) {
      throw new Error('not a Entry type')
    }
    assertFieldsWithTypesArgsMatch(item, typeArgs)

    return Entry.reified(typeArgs[0], typeArgs[1]).new({
      key: decodeFromFieldsWithTypes(typeArgs[0], item.fields.key),
      value: decodeFromFieldsWithTypes(typeArgs[1], item.fields.value),
    })
  }

  static fromBcs<K extends Reified<TypeArgument, any>, V extends Reified<TypeArgument, any>>(
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

  static fromJSONField<K extends Reified<TypeArgument, any>, V extends Reified<TypeArgument, any>>(
    typeArgs: [K, V],
    field: any
  ): Entry<ToTypeArgument<K>, ToTypeArgument<V>> {
    return Entry.reified(typeArgs[0], typeArgs[1]).new({
      key: decodeFromJSONField(typeArgs[0], field.key),
      value: decodeFromJSONField(typeArgs[1], field.value),
    })
  }

  static fromJSON<K extends Reified<TypeArgument, any>, V extends Reified<TypeArgument, any>>(
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

  static fromSuiParsedData<
    K extends Reified<TypeArgument, any>,
    V extends Reified<TypeArgument, any>,
  >(typeArgs: [K, V], content: SuiParsedData): Entry<ToTypeArgument<K>, ToTypeArgument<V>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isEntry(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Entry object`)
    }
    return Entry.fromFieldsWithTypes(typeArgs, content)
  }

  static fromSuiObjectData<
    K extends Reified<TypeArgument, any>,
    V extends Reified<TypeArgument, any>,
  >(typeArgs: [K, V], data: SuiObjectData): Entry<ToTypeArgument<K>, ToTypeArgument<V>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isEntry(data.bcs.type)) {
        throw new Error(`object at is not a Entry object`)
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs
      if (gotTypeArgs.length !== 2) {
        throw new Error(
          `type argument mismatch: expected 2 type arguments but got ${gotTypeArgs.length}`
        )
      }
      for (let i = 0; i < 2; i++) {
        const gotTypeArg = compressSuiType(gotTypeArgs[i])
        const expectedTypeArg = compressSuiType(extractType(typeArgs[i]))
        if (gotTypeArg !== expectedTypeArg) {
          throw new Error(
            `type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`
          )
        }
      }

      return Entry.fromBcs(typeArgs, fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Entry.fromSuiParsedData(typeArgs, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<K extends Reified<TypeArgument, any>, V extends Reified<TypeArgument, any>>(
    client: SuiClient,
    typeArgs: [K, V],
    id: string
  ): Promise<Entry<ToTypeArgument<K>, ToTypeArgument<V>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching Entry object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isEntry(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a Entry object`)
    }

    return Entry.fromSuiObjectData(typeArgs, res.data)
  }
}

/* ============================== VecMap =============================== */

export function isVecMap(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`${PKG_V21}::vec_map::VecMap` + '<')
}

export interface VecMapFields<K extends TypeArgument, V extends TypeArgument> {
  contents: ToField<Vector<Entry<K, V>>>
}

export type VecMapReified<K extends TypeArgument, V extends TypeArgument> = Reified<
  VecMap<K, V>,
  VecMapFields<K, V>
>

export class VecMap<K extends TypeArgument, V extends TypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `${PKG_V21}::vec_map::VecMap`
  static readonly $numTypeParams = 2
  static readonly $isPhantom = [false, false] as const

  readonly $typeName = VecMap.$typeName
  readonly $fullTypeName: `${typeof PKG_V21}::vec_map::VecMap<${ToTypeStr<K>}, ${ToTypeStr<V>}>`
  readonly $typeArgs: [ToTypeStr<K>, ToTypeStr<V>]
  readonly $isPhantom = VecMap.$isPhantom

  readonly contents: ToField<Vector<Entry<K, V>>>

  private constructor(typeArgs: [ToTypeStr<K>, ToTypeStr<V>], fields: VecMapFields<K, V>) {
    this.$fullTypeName = composeSuiType(
      VecMap.$typeName,
      ...typeArgs
    ) as `${typeof PKG_V21}::vec_map::VecMap<${ToTypeStr<K>}, ${ToTypeStr<V>}>`
    this.$typeArgs = typeArgs

    this.contents = fields.contents
  }

  static reified<K extends Reified<TypeArgument, any>, V extends Reified<TypeArgument, any>>(
    K: K,
    V: V
  ): VecMapReified<ToTypeArgument<K>, ToTypeArgument<V>> {
    return {
      typeName: VecMap.$typeName,
      fullTypeName: composeSuiType(
        VecMap.$typeName,
        ...[extractType(K), extractType(V)]
      ) as `${typeof PKG_V21}::vec_map::VecMap<${ToTypeStr<ToTypeArgument<K>>}, ${ToTypeStr<ToTypeArgument<V>>}>`,
      typeArgs: [extractType(K), extractType(V)] as [
        ToTypeStr<ToTypeArgument<K>>,
        ToTypeStr<ToTypeArgument<V>>,
      ],
      isPhantom: VecMap.$isPhantom,
      reifiedTypeArgs: [K, V],
      fromFields: (fields: Record<string, any>) => VecMap.fromFields([K, V], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => VecMap.fromFieldsWithTypes([K, V], item),
      fromBcs: (data: Uint8Array) => VecMap.fromBcs([K, V], data),
      bcs: VecMap.bcs(toBcs(K), toBcs(V)),
      fromJSONField: (field: any) => VecMap.fromJSONField([K, V], field),
      fromJSON: (json: Record<string, any>) => VecMap.fromJSON([K, V], json),
      fromSuiParsedData: (content: SuiParsedData) => VecMap.fromSuiParsedData([K, V], content),
      fromSuiObjectData: (content: SuiObjectData) => VecMap.fromSuiObjectData([K, V], content),
      fetch: async (client: SuiClient, id: string) => VecMap.fetch(client, [K, V], id),
      new: (fields: VecMapFields<ToTypeArgument<K>, ToTypeArgument<V>>) => {
        return new VecMap([extractType(K), extractType(V)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return VecMap.reified
  }

  static phantom<K extends Reified<TypeArgument, any>, V extends Reified<TypeArgument, any>>(
    K: K,
    V: V
  ): PhantomReified<ToTypeStr<VecMap<ToTypeArgument<K>, ToTypeArgument<V>>>> {
    return phantom(VecMap.reified(K, V))
  }
  static get p() {
    return VecMap.phantom
  }

  static get bcs() {
    return <K extends BcsType<any>, V extends BcsType<any>>(K: K, V: V) =>
      bcs.struct(`VecMap<${K.name}, ${V.name}>`, {
        contents: bcs.vector(Entry.bcs(K, V)),
      })
  }

  static fromFields<K extends Reified<TypeArgument, any>, V extends Reified<TypeArgument, any>>(
    typeArgs: [K, V],
    fields: Record<string, any>
  ): VecMap<ToTypeArgument<K>, ToTypeArgument<V>> {
    return VecMap.reified(typeArgs[0], typeArgs[1]).new({
      contents: decodeFromFields(
        reified.vector(Entry.reified(typeArgs[0], typeArgs[1])),
        fields.contents
      ),
    })
  }

  static fromFieldsWithTypes<
    K extends Reified<TypeArgument, any>,
    V extends Reified<TypeArgument, any>,
  >(typeArgs: [K, V], item: FieldsWithTypes): VecMap<ToTypeArgument<K>, ToTypeArgument<V>> {
    if (!isVecMap(item.type)) {
      throw new Error('not a VecMap type')
    }
    assertFieldsWithTypesArgsMatch(item, typeArgs)

    return VecMap.reified(typeArgs[0], typeArgs[1]).new({
      contents: decodeFromFieldsWithTypes(
        reified.vector(Entry.reified(typeArgs[0], typeArgs[1])),
        item.fields.contents
      ),
    })
  }

  static fromBcs<K extends Reified<TypeArgument, any>, V extends Reified<TypeArgument, any>>(
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
        `vector<${Entry.$typeName}<${this.$typeArgs[0]}, ${this.$typeArgs[1]}>>`,
        this.contents
      ),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<K extends Reified<TypeArgument, any>, V extends Reified<TypeArgument, any>>(
    typeArgs: [K, V],
    field: any
  ): VecMap<ToTypeArgument<K>, ToTypeArgument<V>> {
    return VecMap.reified(typeArgs[0], typeArgs[1]).new({
      contents: decodeFromJSONField(
        reified.vector(Entry.reified(typeArgs[0], typeArgs[1])),
        field.contents
      ),
    })
  }

  static fromJSON<K extends Reified<TypeArgument, any>, V extends Reified<TypeArgument, any>>(
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

  static fromSuiParsedData<
    K extends Reified<TypeArgument, any>,
    V extends Reified<TypeArgument, any>,
  >(typeArgs: [K, V], content: SuiParsedData): VecMap<ToTypeArgument<K>, ToTypeArgument<V>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isVecMap(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a VecMap object`)
    }
    return VecMap.fromFieldsWithTypes(typeArgs, content)
  }

  static fromSuiObjectData<
    K extends Reified<TypeArgument, any>,
    V extends Reified<TypeArgument, any>,
  >(typeArgs: [K, V], data: SuiObjectData): VecMap<ToTypeArgument<K>, ToTypeArgument<V>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isVecMap(data.bcs.type)) {
        throw new Error(`object at is not a VecMap object`)
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs
      if (gotTypeArgs.length !== 2) {
        throw new Error(
          `type argument mismatch: expected 2 type arguments but got ${gotTypeArgs.length}`
        )
      }
      for (let i = 0; i < 2; i++) {
        const gotTypeArg = compressSuiType(gotTypeArgs[i])
        const expectedTypeArg = compressSuiType(extractType(typeArgs[i]))
        if (gotTypeArg !== expectedTypeArg) {
          throw new Error(
            `type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`
          )
        }
      }

      return VecMap.fromBcs(typeArgs, fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return VecMap.fromSuiParsedData(typeArgs, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<K extends Reified<TypeArgument, any>, V extends Reified<TypeArgument, any>>(
    client: SuiClient,
    typeArgs: [K, V],
    id: string
  ): Promise<VecMap<ToTypeArgument<K>, ToTypeArgument<V>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching VecMap object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isVecMap(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a VecMap object`)
    }

    return VecMap.fromSuiObjectData(typeArgs, res.data)
  }
}
