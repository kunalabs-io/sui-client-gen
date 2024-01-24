import {
  PhantomTypeArgument,
  Reified,
  ReifiedPhantomTypeArgument,
  ToField,
  ToPhantomTypeArgument,
  ToTypeStr,
  assertFieldsWithTypesArgsMatch,
  assertReifiedTypeArgsMatch,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  extractType,
} from '../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../_framework/util'
import { UID } from '../object/structs'
import { bcs } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== ObjectTable =============================== */

export function isObjectTable(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::object_table::ObjectTable<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface ObjectTableFields<T0 extends PhantomTypeArgument, T1 extends PhantomTypeArgument> {
  id: ToField<UID>
  size: ToField<'u64'>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class ObjectTable<T0 extends PhantomTypeArgument, T1 extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::object_table::ObjectTable'
  static readonly $numTypeParams = 2

  readonly $fullTypeName =
    null as unknown as `0x2::object_table::ObjectTable<${ToTypeStr<T0>}, ${ToTypeStr<T1>}>`

  readonly $typeName = ObjectTable.$typeName

  static get bcs() {
    return bcs.struct('ObjectTable', {
      id: UID.bcs,
      size: bcs.u64(),
    })
  }

  readonly $typeArgs: [string, string]

  readonly id: ToField<UID>
  readonly size: ToField<'u64'>

  private constructor(typeArgs: [string, string], fields: ObjectTableFields<T0, T1>) {
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.size = fields.size
  }

  static new<T0 extends ReifiedPhantomTypeArgument, T1 extends ReifiedPhantomTypeArgument>(
    typeArgs: [T0, T1],
    fields: ObjectTableFields<ToPhantomTypeArgument<T0>, ToPhantomTypeArgument<T1>>
  ): ObjectTable<ToPhantomTypeArgument<T0>, ToPhantomTypeArgument<T1>> {
    return new ObjectTable(typeArgs.map(extractType) as [string, string], fields)
  }

  static reified<T0 extends ReifiedPhantomTypeArgument, T1 extends ReifiedPhantomTypeArgument>(
    T0: T0,
    T1: T1
  ): Reified<ObjectTable<ToPhantomTypeArgument<T0>, ToPhantomTypeArgument<T1>>> {
    return {
      typeName: ObjectTable.$typeName,
      fullTypeName: composeSuiType(
        ObjectTable.$typeName,
        ...[extractType(T0), extractType(T1)]
      ) as `0x2::object_table::ObjectTable<${ToTypeStr<ToPhantomTypeArgument<T0>>}, ${ToTypeStr<
        ToPhantomTypeArgument<T1>
      >}>`,
      typeArgs: [T0, T1],
      fromFields: (fields: Record<string, any>) => ObjectTable.fromFields([T0, T1], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        ObjectTable.fromFieldsWithTypes([T0, T1], item),
      fromBcs: (data: Uint8Array) => ObjectTable.fromBcs([T0, T1], data),
      bcs: ObjectTable.bcs,
      fromJSONField: (field: any) => ObjectTable.fromJSONField([T0, T1], field),
      fetch: async (client: SuiClient, id: string) => ObjectTable.fetch(client, [T0, T1], id),
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return ObjectTable.reified
  }

  static fromFields<T0 extends ReifiedPhantomTypeArgument, T1 extends ReifiedPhantomTypeArgument>(
    typeArgs: [T0, T1],
    fields: Record<string, any>
  ): ObjectTable<ToPhantomTypeArgument<T0>, ToPhantomTypeArgument<T1>> {
    return ObjectTable.new(typeArgs, {
      id: decodeFromFields(UID.reified(), fields.id),
      size: decodeFromFields('u64', fields.size),
    })
  }

  static fromFieldsWithTypes<
    T0 extends ReifiedPhantomTypeArgument,
    T1 extends ReifiedPhantomTypeArgument,
  >(
    typeArgs: [T0, T1],
    item: FieldsWithTypes
  ): ObjectTable<ToPhantomTypeArgument<T0>, ToPhantomTypeArgument<T1>> {
    if (!isObjectTable(item.type)) {
      throw new Error('not a ObjectTable type')
    }
    assertFieldsWithTypesArgsMatch(item, typeArgs)

    return ObjectTable.new(typeArgs, {
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      size: decodeFromFieldsWithTypes('u64', item.fields.size),
    })
  }

  static fromBcs<T0 extends ReifiedPhantomTypeArgument, T1 extends ReifiedPhantomTypeArgument>(
    typeArgs: [T0, T1],
    data: Uint8Array
  ): ObjectTable<ToPhantomTypeArgument<T0>, ToPhantomTypeArgument<T1>> {
    return ObjectTable.fromFields(typeArgs, ObjectTable.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
      size: this.size.toString(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<
    T0 extends ReifiedPhantomTypeArgument,
    T1 extends ReifiedPhantomTypeArgument,
  >(
    typeArgs: [T0, T1],
    field: any
  ): ObjectTable<ToPhantomTypeArgument<T0>, ToPhantomTypeArgument<T1>> {
    return ObjectTable.new(typeArgs, {
      id: decodeFromJSONField(UID.reified(), field.id),
      size: decodeFromJSONField('u64', field.size),
    })
  }

  static fromJSON<T0 extends ReifiedPhantomTypeArgument, T1 extends ReifiedPhantomTypeArgument>(
    typeArgs: [T0, T1],
    json: Record<string, any>
  ): ObjectTable<ToPhantomTypeArgument<T0>, ToPhantomTypeArgument<T1>> {
    if (json.$typeName !== ObjectTable.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(ObjectTable.$typeName, ...typeArgs.map(extractType)),
      json.$typeArgs,
      typeArgs
    )

    return ObjectTable.fromJSONField(typeArgs, json)
  }

  static fromSuiParsedData<
    T0 extends ReifiedPhantomTypeArgument,
    T1 extends ReifiedPhantomTypeArgument,
  >(
    typeArgs: [T0, T1],
    content: SuiParsedData
  ): ObjectTable<ToPhantomTypeArgument<T0>, ToPhantomTypeArgument<T1>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isObjectTable(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a ObjectTable object`)
    }
    return ObjectTable.fromFieldsWithTypes(typeArgs, content)
  }

  static async fetch<T0 extends ReifiedPhantomTypeArgument, T1 extends ReifiedPhantomTypeArgument>(
    client: SuiClient,
    typeArgs: [T0, T1],
    id: string
  ): Promise<ObjectTable<ToPhantomTypeArgument<T0>, ToPhantomTypeArgument<T1>>> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching ObjectTable object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isObjectTable(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a ObjectTable object`)
    }
    return ObjectTable.fromFieldsWithTypes(typeArgs, res.data.content)
  }
}
