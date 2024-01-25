import * as reified from '../../_framework/reified'
import {
  PhantomReified,
  Reified,
  ToField,
  ToTypeArgument,
  ToTypeStr,
  TypeArgument,
  Vector,
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
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../_framework/util'
import { BcsType, bcs, fromB64 } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== Entry =============================== */

export function isEntry(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::vec_map::Entry<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface EntryFields<T0 extends TypeArgument, T1 extends TypeArgument> {
  key: ToField<T0>
  value: ToField<T1>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Entry<T0 extends TypeArgument, T1 extends TypeArgument> {
  static readonly $typeName = '0x2::vec_map::Entry'
  static readonly $numTypeParams = 2

  readonly $typeName = Entry.$typeName

  readonly $fullTypeName: `0x2::vec_map::Entry<${string}, ${string}>`

  readonly $typeArgs: [string, string]

  readonly key: ToField<T0>
  readonly value: ToField<T1>

  private constructor(typeArgs: [string, string], fields: EntryFields<T0, T1>) {
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
  ): Reified<
    Entry<ToTypeArgument<T0>, ToTypeArgument<T1>>,
    EntryFields<ToTypeArgument<T0>, ToTypeArgument<T1>>
  > {
    return {
      typeName: Entry.$typeName,
      fullTypeName: composeSuiType(
        Entry.$typeName,
        ...[extractType(T0), extractType(T1)]
      ) as `0x2::vec_map::Entry<${ToTypeStr<ToTypeArgument<T0>>}, ${ToTypeStr<
        ToTypeArgument<T1>
      >}>`,
      typeArgs: [T0, T1],
      fromFields: (fields: Record<string, any>) => Entry.fromFields([T0, T1], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Entry.fromFieldsWithTypes([T0, T1], item),
      fromBcs: (data: Uint8Array) => Entry.fromBcs([T0, T1], data),
      bcs: Entry.bcs(toBcs(T0), toBcs(T1)),
      fromJSONField: (field: any) => Entry.fromJSONField([T0, T1], field),
      fromJSON: (json: Record<string, any>) => Entry.fromJSON([T0, T1], json),
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

  static get bcs() {
    return <T0 extends BcsType<any>, T1 extends BcsType<any>>(T0: T0, T1: T1) =>
      bcs.struct(`Entry<${T0.name}, ${T1.name}>`, {
        key: T0,
        value: T1,
      })
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
      key: fieldToJSON<T0>(this.$typeArgs[0], this.key),
      value: fieldToJSON<T1>(this.$typeArgs[1], this.value),
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
    return Entry.fromBcs(typeArgs, fromB64(res.data.bcs.bcsBytes))
  }
}

/* ============================== VecMap =============================== */

export function isVecMap(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::vec_map::VecMap<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface VecMapFields<T0 extends TypeArgument, T1 extends TypeArgument> {
  contents: ToField<Vector<Entry<T0, T1>>>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class VecMap<T0 extends TypeArgument, T1 extends TypeArgument> {
  static readonly $typeName = '0x2::vec_map::VecMap'
  static readonly $numTypeParams = 2

  readonly $typeName = VecMap.$typeName

  readonly $fullTypeName: `0x2::vec_map::VecMap<${string}, ${string}>`

  readonly $typeArgs: [string, string]

  readonly contents: ToField<Vector<Entry<T0, T1>>>

  private constructor(typeArgs: [string, string], fields: VecMapFields<T0, T1>) {
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
  ): Reified<
    VecMap<ToTypeArgument<T0>, ToTypeArgument<T1>>,
    VecMapFields<ToTypeArgument<T0>, ToTypeArgument<T1>>
  > {
    return {
      typeName: VecMap.$typeName,
      fullTypeName: composeSuiType(
        VecMap.$typeName,
        ...[extractType(T0), extractType(T1)]
      ) as `0x2::vec_map::VecMap<${ToTypeStr<ToTypeArgument<T0>>}, ${ToTypeStr<
        ToTypeArgument<T1>
      >}>`,
      typeArgs: [T0, T1],
      fromFields: (fields: Record<string, any>) => VecMap.fromFields([T0, T1], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => VecMap.fromFieldsWithTypes([T0, T1], item),
      fromBcs: (data: Uint8Array) => VecMap.fromBcs([T0, T1], data),
      bcs: VecMap.bcs(toBcs(T0), toBcs(T1)),
      fromJSONField: (field: any) => VecMap.fromJSONField([T0, T1], field),
      fromJSON: (json: Record<string, any>) => VecMap.fromJSON([T0, T1], json),
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

  static get bcs() {
    return <T0 extends BcsType<any>, T1 extends BcsType<any>>(T0: T0, T1: T1) =>
      bcs.struct(`VecMap<${T0.name}, ${T1.name}>`, {
        contents: bcs.vector(Entry.bcs(T0, T1)),
      })
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
        `vector<0x2::vec_map::Entry<${this.$typeArgs[0]}, ${this.$typeArgs[1]}>>`,
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
    return VecMap.fromBcs(typeArgs, fromB64(res.data.bcs.bcsBytes))
  }
}
