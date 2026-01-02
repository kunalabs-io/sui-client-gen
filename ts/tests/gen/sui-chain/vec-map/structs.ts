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
import { BcsType, bcs } from '@mysten/sui/bcs'
import { SuiClient, SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromB64 } from '@mysten/sui/utils'

/* ============================== VecMap =============================== */

export function isVecMap(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::vec_map::VecMap` + '<')
}

export interface VecMapFields<T0 extends TypeArgument, T1 extends TypeArgument> {
  contents: ToField<Vector<Entry<T0, T1>>>
}

export type VecMapReified<T0 extends TypeArgument, T1 extends TypeArgument> = Reified<
  VecMap<T0, T1>,
  VecMapFields<T0, T1>
>

export class VecMap<T0 extends TypeArgument, T1 extends TypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::vec_map::VecMap`
  static readonly $numTypeParams = 2
  static readonly $isPhantom = [false, false] as const

  readonly $typeName = VecMap.$typeName
  readonly $fullTypeName: `0x2::vec_map::VecMap<${ToTypeStr<T0>}, ${ToTypeStr<T1>}>`
  readonly $typeArgs: [ToTypeStr<T0>, ToTypeStr<T1>]
  readonly $isPhantom = VecMap.$isPhantom

  readonly contents: ToField<Vector<Entry<T0, T1>>>

  private constructor(typeArgs: [ToTypeStr<T0>, ToTypeStr<T1>], fields: VecMapFields<T0, T1>) {
    this.$fullTypeName = composeSuiType(
      VecMap.$typeName,
      ...typeArgs
    ) as `0x2::vec_map::VecMap<${ToTypeStr<T0>}, ${ToTypeStr<T1>}>`
    this.$typeArgs = typeArgs

    this.contents = fields.contents
  }

  static reified<T0 extends Reified<TypeArgument, any>, T1 extends Reified<TypeArgument, any>>(
    T0: T0,
    T1: T1
  ): VecMapReified<ToTypeArgument<T0>, ToTypeArgument<T1>> {
    const reifiedBcs = VecMap.bcs(toBcs(T0), toBcs(T1))
    return {
      typeName: VecMap.$typeName,
      fullTypeName: composeSuiType(
        VecMap.$typeName,
        ...[extractType(T0), extractType(T1)]
      ) as `0x2::vec_map::VecMap<${ToTypeStr<ToTypeArgument<T0>>}, ${ToTypeStr<ToTypeArgument<T1>>}>`,
      typeArgs: [extractType(T0), extractType(T1)] as [
        ToTypeStr<ToTypeArgument<T0>>,
        ToTypeStr<ToTypeArgument<T1>>,
      ],
      isPhantom: VecMap.$isPhantom,
      reifiedTypeArgs: [T0, T1],
      fromFields: (fields: Record<string, any>) => VecMap.fromFields([T0, T1], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => VecMap.fromFieldsWithTypes([T0, T1], item),
      fromBcs: (data: Uint8Array) => VecMap.fromFields([T0, T1], reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => VecMap.fromJSONField([T0, T1], field),
      fromJSON: (json: Record<string, any>) => VecMap.fromJSON([T0, T1], json),
      fromSuiParsedData: (content: SuiParsedData) => VecMap.fromSuiParsedData([T0, T1], content),
      fromSuiObjectData: (content: SuiObjectData) => VecMap.fromSuiObjectData([T0, T1], content),
      fetch: async (client: SuiClient, id: string) => VecMap.fetch(client, [T0, T1], id),
      new: (fields: VecMapFields<ToTypeArgument<T0>, ToTypeArgument<T1>>) => {
        return new VecMap([extractType(T0), extractType(T1)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return VecMap.reified
  }

  static phantom<T0 extends Reified<TypeArgument, any>, T1 extends Reified<TypeArgument, any>>(
    T0: T0,
    T1: T1
  ): PhantomReified<ToTypeStr<VecMap<ToTypeArgument<T0>, ToTypeArgument<T1>>>> {
    return phantom(VecMap.reified(T0, T1))
  }

  static get p() {
    return VecMap.phantom
  }

  private static instantiateBcs() {
    return <T0 extends BcsType<any>, T1 extends BcsType<any>>(T0: T0, T1: T1) =>
      bcs.struct(`VecMap<${T0.name}, ${T1.name}>`, {
        contents: bcs.vector(Entry.bcs(T0, T1)),
      })
  }

  private static cachedBcs: ReturnType<typeof VecMap.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof VecMap.instantiateBcs> {
    if (!VecMap.cachedBcs) {
      VecMap.cachedBcs = VecMap.instantiateBcs()
    }
    return VecMap.cachedBcs
  }

  static fromFields<T0 extends Reified<TypeArgument, any>, T1 extends Reified<TypeArgument, any>>(
    typeArgs: [T0, T1],
    fields: Record<string, any>
  ): VecMap<ToTypeArgument<T0>, ToTypeArgument<T1>> {
    return VecMap.reified(typeArgs[0], typeArgs[1]).new({
      contents: decodeFromFields(
        reified.vector(Entry.reified(typeArgs[0], typeArgs[1])),
        fields.contents
      ),
    })
  }

  static fromFieldsWithTypes<
    T0 extends Reified<TypeArgument, any>,
    T1 extends Reified<TypeArgument, any>,
  >(typeArgs: [T0, T1], item: FieldsWithTypes): VecMap<ToTypeArgument<T0>, ToTypeArgument<T1>> {
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

  static fromBcs<T0 extends Reified<TypeArgument, any>, T1 extends Reified<TypeArgument, any>>(
    typeArgs: [T0, T1],
    data: Uint8Array
  ): VecMap<ToTypeArgument<T0>, ToTypeArgument<T1>> {
    return VecMap.fromFields(
      typeArgs,
      VecMap.bcs(toBcs(typeArgs[0]), toBcs(typeArgs[1])).parse(data)
    )
  }

  toJSONField() {
    return {
      contents: fieldToJSON<Vector<Entry<T0, T1>>>(
        `vector<${Entry.$typeName}<${this.$typeArgs[0]}, ${this.$typeArgs[1]}>>`,
        this.contents
      ),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<
    T0 extends Reified<TypeArgument, any>,
    T1 extends Reified<TypeArgument, any>,
  >(typeArgs: [T0, T1], field: any): VecMap<ToTypeArgument<T0>, ToTypeArgument<T1>> {
    return VecMap.reified(typeArgs[0], typeArgs[1]).new({
      contents: decodeFromJSONField(
        reified.vector(Entry.reified(typeArgs[0], typeArgs[1])),
        field.contents
      ),
    })
  }

  static fromJSON<T0 extends Reified<TypeArgument, any>, T1 extends Reified<TypeArgument, any>>(
    typeArgs: [T0, T1],
    json: Record<string, any>
  ): VecMap<ToTypeArgument<T0>, ToTypeArgument<T1>> {
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
    T0 extends Reified<TypeArgument, any>,
    T1 extends Reified<TypeArgument, any>,
  >(typeArgs: [T0, T1], content: SuiParsedData): VecMap<ToTypeArgument<T0>, ToTypeArgument<T1>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isVecMap(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a VecMap object`)
    }
    return VecMap.fromFieldsWithTypes(typeArgs, content)
  }

  static fromSuiObjectData<
    T0 extends Reified<TypeArgument, any>,
    T1 extends Reified<TypeArgument, any>,
  >(typeArgs: [T0, T1], data: SuiObjectData): VecMap<ToTypeArgument<T0>, ToTypeArgument<T1>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isVecMap(data.bcs.type)) {
        throw new Error(`object at is not a VecMap object`)
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs
      if (gotTypeArgs.length !== 2) {
        throw new Error(
          `type argument mismatch: expected 2 type arguments but got '${gotTypeArgs.length}'`
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

  static async fetch<T0 extends Reified<TypeArgument, any>, T1 extends Reified<TypeArgument, any>>(
    client: SuiClient,
    typeArgs: [T0, T1],
    id: string
  ): Promise<VecMap<ToTypeArgument<T0>, ToTypeArgument<T1>>> {
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

/* ============================== Entry =============================== */

export function isEntry(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::vec_map::Entry` + '<')
}

export interface EntryFields<T0 extends TypeArgument, T1 extends TypeArgument> {
  key: ToField<T0>
  value: ToField<T1>
}

export type EntryReified<T0 extends TypeArgument, T1 extends TypeArgument> = Reified<
  Entry<T0, T1>,
  EntryFields<T0, T1>
>

export class Entry<T0 extends TypeArgument, T1 extends TypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::vec_map::Entry`
  static readonly $numTypeParams = 2
  static readonly $isPhantom = [false, false] as const

  readonly $typeName = Entry.$typeName
  readonly $fullTypeName: `0x2::vec_map::Entry<${ToTypeStr<T0>}, ${ToTypeStr<T1>}>`
  readonly $typeArgs: [ToTypeStr<T0>, ToTypeStr<T1>]
  readonly $isPhantom = Entry.$isPhantom

  readonly key: ToField<T0>
  readonly value: ToField<T1>

  private constructor(typeArgs: [ToTypeStr<T0>, ToTypeStr<T1>], fields: EntryFields<T0, T1>) {
    this.$fullTypeName = composeSuiType(
      Entry.$typeName,
      ...typeArgs
    ) as `0x2::vec_map::Entry<${ToTypeStr<T0>}, ${ToTypeStr<T1>}>`
    this.$typeArgs = typeArgs

    this.key = fields.key
    this.value = fields.value
  }

  static reified<T0 extends Reified<TypeArgument, any>, T1 extends Reified<TypeArgument, any>>(
    T0: T0,
    T1: T1
  ): EntryReified<ToTypeArgument<T0>, ToTypeArgument<T1>> {
    const reifiedBcs = Entry.bcs(toBcs(T0), toBcs(T1))
    return {
      typeName: Entry.$typeName,
      fullTypeName: composeSuiType(
        Entry.$typeName,
        ...[extractType(T0), extractType(T1)]
      ) as `0x2::vec_map::Entry<${ToTypeStr<ToTypeArgument<T0>>}, ${ToTypeStr<ToTypeArgument<T1>>}>`,
      typeArgs: [extractType(T0), extractType(T1)] as [
        ToTypeStr<ToTypeArgument<T0>>,
        ToTypeStr<ToTypeArgument<T1>>,
      ],
      isPhantom: Entry.$isPhantom,
      reifiedTypeArgs: [T0, T1],
      fromFields: (fields: Record<string, any>) => Entry.fromFields([T0, T1], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Entry.fromFieldsWithTypes([T0, T1], item),
      fromBcs: (data: Uint8Array) => Entry.fromFields([T0, T1], reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => Entry.fromJSONField([T0, T1], field),
      fromJSON: (json: Record<string, any>) => Entry.fromJSON([T0, T1], json),
      fromSuiParsedData: (content: SuiParsedData) => Entry.fromSuiParsedData([T0, T1], content),
      fromSuiObjectData: (content: SuiObjectData) => Entry.fromSuiObjectData([T0, T1], content),
      fetch: async (client: SuiClient, id: string) => Entry.fetch(client, [T0, T1], id),
      new: (fields: EntryFields<ToTypeArgument<T0>, ToTypeArgument<T1>>) => {
        return new Entry([extractType(T0), extractType(T1)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Entry.reified
  }

  static phantom<T0 extends Reified<TypeArgument, any>, T1 extends Reified<TypeArgument, any>>(
    T0: T0,
    T1: T1
  ): PhantomReified<ToTypeStr<Entry<ToTypeArgument<T0>, ToTypeArgument<T1>>>> {
    return phantom(Entry.reified(T0, T1))
  }

  static get p() {
    return Entry.phantom
  }

  private static instantiateBcs() {
    return <T0 extends BcsType<any>, T1 extends BcsType<any>>(T0: T0, T1: T1) =>
      bcs.struct(`Entry<${T0.name}, ${T1.name}>`, {
        key: T0,
        value: T1,
      })
  }

  private static cachedBcs: ReturnType<typeof Entry.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof Entry.instantiateBcs> {
    if (!Entry.cachedBcs) {
      Entry.cachedBcs = Entry.instantiateBcs()
    }
    return Entry.cachedBcs
  }

  static fromFields<T0 extends Reified<TypeArgument, any>, T1 extends Reified<TypeArgument, any>>(
    typeArgs: [T0, T1],
    fields: Record<string, any>
  ): Entry<ToTypeArgument<T0>, ToTypeArgument<T1>> {
    return Entry.reified(typeArgs[0], typeArgs[1]).new({
      key: decodeFromFields(typeArgs[0], fields.key),
      value: decodeFromFields(typeArgs[1], fields.value),
    })
  }

  static fromFieldsWithTypes<
    T0 extends Reified<TypeArgument, any>,
    T1 extends Reified<TypeArgument, any>,
  >(typeArgs: [T0, T1], item: FieldsWithTypes): Entry<ToTypeArgument<T0>, ToTypeArgument<T1>> {
    if (!isEntry(item.type)) {
      throw new Error('not a Entry type')
    }
    assertFieldsWithTypesArgsMatch(item, typeArgs)

    return Entry.reified(typeArgs[0], typeArgs[1]).new({
      key: decodeFromFieldsWithTypes(typeArgs[0], item.fields.key),
      value: decodeFromFieldsWithTypes(typeArgs[1], item.fields.value),
    })
  }

  static fromBcs<T0 extends Reified<TypeArgument, any>, T1 extends Reified<TypeArgument, any>>(
    typeArgs: [T0, T1],
    data: Uint8Array
  ): Entry<ToTypeArgument<T0>, ToTypeArgument<T1>> {
    return Entry.fromFields(typeArgs, Entry.bcs(toBcs(typeArgs[0]), toBcs(typeArgs[1])).parse(data))
  }

  toJSONField() {
    return {
      key: fieldToJSON<T0>(`${this.$typeArgs[0]}`, this.key),
      value: fieldToJSON<T1>(`${this.$typeArgs[1]}`, this.value),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<
    T0 extends Reified<TypeArgument, any>,
    T1 extends Reified<TypeArgument, any>,
  >(typeArgs: [T0, T1], field: any): Entry<ToTypeArgument<T0>, ToTypeArgument<T1>> {
    return Entry.reified(typeArgs[0], typeArgs[1]).new({
      key: decodeFromJSONField(typeArgs[0], field.key),
      value: decodeFromJSONField(typeArgs[1], field.value),
    })
  }

  static fromJSON<T0 extends Reified<TypeArgument, any>, T1 extends Reified<TypeArgument, any>>(
    typeArgs: [T0, T1],
    json: Record<string, any>
  ): Entry<ToTypeArgument<T0>, ToTypeArgument<T1>> {
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
    T0 extends Reified<TypeArgument, any>,
    T1 extends Reified<TypeArgument, any>,
  >(typeArgs: [T0, T1], content: SuiParsedData): Entry<ToTypeArgument<T0>, ToTypeArgument<T1>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isEntry(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Entry object`)
    }
    return Entry.fromFieldsWithTypes(typeArgs, content)
  }

  static fromSuiObjectData<
    T0 extends Reified<TypeArgument, any>,
    T1 extends Reified<TypeArgument, any>,
  >(typeArgs: [T0, T1], data: SuiObjectData): Entry<ToTypeArgument<T0>, ToTypeArgument<T1>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isEntry(data.bcs.type)) {
        throw new Error(`object at is not a Entry object`)
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs
      if (gotTypeArgs.length !== 2) {
        throw new Error(
          `type argument mismatch: expected 2 type arguments but got '${gotTypeArgs.length}'`
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

  static async fetch<T0 extends Reified<TypeArgument, any>, T1 extends Reified<TypeArgument, any>>(
    client: SuiClient,
    typeArgs: [T0, T1],
    id: string
  ): Promise<Entry<ToTypeArgument<T0>, ToTypeArgument<T1>>> {
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
