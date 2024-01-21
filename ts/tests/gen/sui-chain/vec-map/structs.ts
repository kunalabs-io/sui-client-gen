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
export interface EntryFields<T0 extends TypeArgument, T1 extends TypeArgument> {
  key: ToField<T0>
  value: ToField<T1>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Entry<T0 extends TypeArgument, T1 extends TypeArgument> {
  static readonly $typeName = '0x2::vec_map::Entry'
  static readonly $numTypeParams = 2

  __reifiedFullTypeString =
    null as unknown as `0x2::vec_map::Entry<${ToPhantom<T0>}, ${ToPhantom<T1>}>`

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
      fullTypeName: composeSuiType(
        Entry.$typeName,
        ...[extractType(T0), extractType(T1)]
      ) as `0x2::vec_map::Entry<${ToPhantomTypeArgument<T0>}, ${ToPhantomTypeArgument<T1>}>`,
      fromFields: (fields: Record<string, any>) => Entry.fromFields([T0, T1], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Entry.fromFieldsWithTypes([T0, T1], item),
      fromBcs: (data: Uint8Array) => Entry.fromBcs([T0, T1], data),
      bcs: Entry.bcs(toBcs(T0), toBcs(T1)),
      fromJSONField: (field: any) => Entry.fromJSONField([T0, T1], field),
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
      key: decodeFromFields(typeArgs[0], fields.key),
      value: decodeFromFields(typeArgs[1], fields.value),
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
      key: decodeFromFieldsWithTypes(typeArgs[0], item.fields.key),
      value: decodeFromFieldsWithTypes(typeArgs[1], item.fields.value),
    })
  }

  static fromBcs<T0 extends ReifiedTypeArgument, T1 extends ReifiedTypeArgument>(
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

  static fromJSONField<T0 extends ReifiedTypeArgument, T1 extends ReifiedTypeArgument>(
    typeArgs: [T0, T1],
    field: any
  ): Entry<ToTypeArgument<T0>, ToTypeArgument<T1>> {
    return Entry.new(typeArgs, {
      key: decodeFromJSONField(typeArgs[0], field.key),
      value: decodeFromJSONField(typeArgs[1], field.value),
    })
  }

  static fromJSON<T0 extends ReifiedTypeArgument, T1 extends ReifiedTypeArgument>(
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

  __reifiedFullTypeString =
    null as unknown as `0x2::vec_map::VecMap<${ToPhantom<T0>}, ${ToPhantom<T1>}>`

  readonly $typeName = VecMap.$typeName

  static get bcs() {
    return <T0 extends BcsType<any>, T1 extends BcsType<any>>(T0: T0, T1: T1) =>
      bcs.struct(`VecMap<${T0.name}, ${T1.name}>`, {
        contents: bcs.vector(Entry.bcs(T0, T1)),
      })
  }

  readonly $typeArgs: [string, string]

  readonly contents: ToField<Vector<Entry<T0, T1>>>

  private constructor(typeArgs: [string, string], contents: ToField<Vector<Entry<T0, T1>>>) {
    this.$typeArgs = typeArgs

    this.contents = contents
  }

  static new<T0 extends ReifiedTypeArgument, T1 extends ReifiedTypeArgument>(
    typeArgs: [T0, T1],
    contents: ToField<Vector<Entry<ToTypeArgument<T0>, ToTypeArgument<T1>>>>
  ): VecMap<ToTypeArgument<T0>, ToTypeArgument<T1>> {
    return new VecMap(typeArgs.map(extractType) as [string, string], contents)
  }

  static reified<T0 extends ReifiedTypeArgument, T1 extends ReifiedTypeArgument>(T0: T0, T1: T1) {
    return {
      typeName: VecMap.$typeName,
      typeArgs: [T0, T1],
      fullTypeName: composeSuiType(
        VecMap.$typeName,
        ...[extractType(T0), extractType(T1)]
      ) as `0x2::vec_map::VecMap<${ToPhantomTypeArgument<T0>}, ${ToPhantomTypeArgument<T1>}>`,
      fromFields: (fields: Record<string, any>) => VecMap.fromFields([T0, T1], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => VecMap.fromFieldsWithTypes([T0, T1], item),
      fromBcs: (data: Uint8Array) => VecMap.fromBcs([T0, T1], data),
      bcs: VecMap.bcs(toBcs(T0), toBcs(T1)),
      fromJSONField: (field: any) => VecMap.fromJSONField([T0, T1], field),
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
      decodeFromFields(reified.vector(Entry.reified(typeArgs[0], typeArgs[1])), fields.contents)
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
      decodeFromFieldsWithTypes(
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

  static fromJSONField<T0 extends ReifiedTypeArgument, T1 extends ReifiedTypeArgument>(
    typeArgs: [T0, T1],
    field: any
  ): VecMap<ToTypeArgument<T0>, ToTypeArgument<T1>> {
    return VecMap.new(
      typeArgs,
      decodeFromJSONField(reified.vector(Entry.reified(typeArgs[0], typeArgs[1])), field.contents)
    )
  }

  static fromJSON<T0 extends ReifiedTypeArgument, T1 extends ReifiedTypeArgument>(
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
}
