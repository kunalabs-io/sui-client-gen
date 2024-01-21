import {
  PhantomTypeArgument,
  ReifiedPhantomTypeArgument,
  ToField,
  ToPhantomTypeArgument,
  ToTypeArgument,
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
export interface ObjectTableFields<K extends PhantomTypeArgument, V extends PhantomTypeArgument> {
  id: ToField<UID>
  size: ToField<'u64'>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class ObjectTable<K extends PhantomTypeArgument, V extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::object_table::ObjectTable'
  static readonly $numTypeParams = 2

  __reifiedFullTypeString = null as unknown as `0x2::object_table::ObjectTable<${K}, ${V}>`

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

  private constructor(typeArgs: [string, string], fields: ObjectTableFields<K, V>) {
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.size = fields.size
  }

  static new<K extends ReifiedPhantomTypeArgument, V extends ReifiedPhantomTypeArgument>(
    typeArgs: [K, V],
    fields: ObjectTableFields<ToPhantomTypeArgument<K>, ToPhantomTypeArgument<V>>
  ): ObjectTable<ToPhantomTypeArgument<K>, ToPhantomTypeArgument<V>> {
    return new ObjectTable(typeArgs.map(extractType) as [string, string], fields)
  }

  static reified<K extends ReifiedPhantomTypeArgument, V extends ReifiedPhantomTypeArgument>(
    K: K,
    V: V
  ) {
    return {
      typeName: ObjectTable.$typeName,
      typeArgs: [K, V],
      fullTypeName: composeSuiType(
        ObjectTable.$typeName,
        ...[extractType(K), extractType(V)]
      ) as `0x2::object_table::ObjectTable<${ToPhantomTypeArgument<K>}, ${ToPhantomTypeArgument<V>}>`,
      fromFields: (fields: Record<string, any>) => ObjectTable.fromFields([K, V], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => ObjectTable.fromFieldsWithTypes([K, V], item),
      fromBcs: (data: Uint8Array) => ObjectTable.fromBcs([K, V], data),
      bcs: ObjectTable.bcs,
      fromJSONField: (field: any) => ObjectTable.fromJSONField([K, V], field),
      __class: null as unknown as ReturnType<
        typeof ObjectTable.new<ToTypeArgument<K>, ToTypeArgument<V>>
      >,
    }
  }

  static fromFields<K extends ReifiedPhantomTypeArgument, V extends ReifiedPhantomTypeArgument>(
    typeArgs: [K, V],
    fields: Record<string, any>
  ): ObjectTable<ToPhantomTypeArgument<K>, ToPhantomTypeArgument<V>> {
    return ObjectTable.new(typeArgs, {
      id: decodeFromFields(UID.reified(), fields.id),
      size: decodeFromFields('u64', fields.size),
    })
  }

  static fromFieldsWithTypes<
    K extends ReifiedPhantomTypeArgument,
    V extends ReifiedPhantomTypeArgument,
  >(
    typeArgs: [K, V],
    item: FieldsWithTypes
  ): ObjectTable<ToPhantomTypeArgument<K>, ToPhantomTypeArgument<V>> {
    if (!isObjectTable(item.type)) {
      throw new Error('not a ObjectTable type')
    }
    assertFieldsWithTypesArgsMatch(item, typeArgs)

    return ObjectTable.new(typeArgs, {
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      size: decodeFromFieldsWithTypes('u64', item.fields.size),
    })
  }

  static fromBcs<K extends ReifiedPhantomTypeArgument, V extends ReifiedPhantomTypeArgument>(
    typeArgs: [K, V],
    data: Uint8Array
  ): ObjectTable<ToPhantomTypeArgument<K>, ToPhantomTypeArgument<V>> {
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

  static fromJSONField<K extends ReifiedPhantomTypeArgument, V extends ReifiedPhantomTypeArgument>(
    typeArgs: [K, V],
    field: any
  ): ObjectTable<ToPhantomTypeArgument<K>, ToPhantomTypeArgument<V>> {
    return ObjectTable.new(typeArgs, {
      id: decodeFromJSONField(UID.reified(), field.id),
      size: decodeFromJSONField('u64', field.size),
    })
  }

  static fromJSON<K extends ReifiedPhantomTypeArgument, V extends ReifiedPhantomTypeArgument>(
    typeArgs: [K, V],
    json: Record<string, any>
  ): ObjectTable<ToPhantomTypeArgument<K>, ToPhantomTypeArgument<V>> {
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
    K extends ReifiedPhantomTypeArgument,
    V extends ReifiedPhantomTypeArgument,
  >(
    typeArgs: [K, V],
    content: SuiParsedData
  ): ObjectTable<ToPhantomTypeArgument<K>, ToPhantomTypeArgument<V>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isObjectTable(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a ObjectTable object`)
    }
    return ObjectTable.fromFieldsWithTypes(typeArgs, content)
  }

  static async fetch<K extends ReifiedPhantomTypeArgument, V extends ReifiedPhantomTypeArgument>(
    client: SuiClient,
    typeArgs: [K, V],
    id: string
  ): Promise<ObjectTable<ToPhantomTypeArgument<K>, ToPhantomTypeArgument<V>>> {
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
