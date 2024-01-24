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

/* ============================== Table =============================== */

export function isTable(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::table::Table<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface TableFields<K extends PhantomTypeArgument, V extends PhantomTypeArgument> {
  id: ToField<UID>
  size: ToField<'u64'>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Table<K extends PhantomTypeArgument, V extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::table::Table'
  static readonly $numTypeParams = 2

  readonly $fullTypeName = null as unknown as `0x2::table::Table<${ToTypeStr<K>}, ${ToTypeStr<V>}>`

  readonly $typeName = Table.$typeName

  static get bcs() {
    return bcs.struct('Table', {
      id: UID.bcs,
      size: bcs.u64(),
    })
  }

  readonly $typeArgs: [string, string]

  readonly id: ToField<UID>
  readonly size: ToField<'u64'>

  private constructor(typeArgs: [string, string], fields: TableFields<K, V>) {
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.size = fields.size
  }

  static new<K extends ReifiedPhantomTypeArgument, V extends ReifiedPhantomTypeArgument>(
    typeArgs: [K, V],
    fields: TableFields<ToPhantomTypeArgument<K>, ToPhantomTypeArgument<V>>
  ): Table<ToPhantomTypeArgument<K>, ToPhantomTypeArgument<V>> {
    return new Table(typeArgs.map(extractType) as [string, string], fields)
  }

  static reified<K extends ReifiedPhantomTypeArgument, V extends ReifiedPhantomTypeArgument>(
    K: K,
    V: V
  ): Reified<Table<ToPhantomTypeArgument<K>, ToPhantomTypeArgument<V>>> {
    return {
      typeName: Table.$typeName,
      fullTypeName: composeSuiType(
        Table.$typeName,
        ...[extractType(K), extractType(V)]
      ) as `0x2::table::Table<${ToTypeStr<ToPhantomTypeArgument<K>>}, ${ToTypeStr<
        ToPhantomTypeArgument<V>
      >}>`,
      typeArgs: [K, V],
      fromFields: (fields: Record<string, any>) => Table.fromFields([K, V], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Table.fromFieldsWithTypes([K, V], item),
      fromBcs: (data: Uint8Array) => Table.fromBcs([K, V], data),
      bcs: Table.bcs,
      fromJSONField: (field: any) => Table.fromJSONField([K, V], field),
      fetch: async (client: SuiClient, id: string) => Table.fetch(client, [K, V], id),
      kind: 'StructClassReified',
    }
  }

  static fromFields<K extends ReifiedPhantomTypeArgument, V extends ReifiedPhantomTypeArgument>(
    typeArgs: [K, V],
    fields: Record<string, any>
  ): Table<ToPhantomTypeArgument<K>, ToPhantomTypeArgument<V>> {
    return Table.new(typeArgs, {
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
  ): Table<ToPhantomTypeArgument<K>, ToPhantomTypeArgument<V>> {
    if (!isTable(item.type)) {
      throw new Error('not a Table type')
    }
    assertFieldsWithTypesArgsMatch(item, typeArgs)

    return Table.new(typeArgs, {
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      size: decodeFromFieldsWithTypes('u64', item.fields.size),
    })
  }

  static fromBcs<K extends ReifiedPhantomTypeArgument, V extends ReifiedPhantomTypeArgument>(
    typeArgs: [K, V],
    data: Uint8Array
  ): Table<ToPhantomTypeArgument<K>, ToPhantomTypeArgument<V>> {
    return Table.fromFields(typeArgs, Table.bcs.parse(data))
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
  ): Table<ToPhantomTypeArgument<K>, ToPhantomTypeArgument<V>> {
    return Table.new(typeArgs, {
      id: decodeFromJSONField(UID.reified(), field.id),
      size: decodeFromJSONField('u64', field.size),
    })
  }

  static fromJSON<K extends ReifiedPhantomTypeArgument, V extends ReifiedPhantomTypeArgument>(
    typeArgs: [K, V],
    json: Record<string, any>
  ): Table<ToPhantomTypeArgument<K>, ToPhantomTypeArgument<V>> {
    if (json.$typeName !== Table.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Table.$typeName, ...typeArgs.map(extractType)),
      json.$typeArgs,
      typeArgs
    )

    return Table.fromJSONField(typeArgs, json)
  }

  static fromSuiParsedData<
    K extends ReifiedPhantomTypeArgument,
    V extends ReifiedPhantomTypeArgument,
  >(
    typeArgs: [K, V],
    content: SuiParsedData
  ): Table<ToPhantomTypeArgument<K>, ToPhantomTypeArgument<V>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isTable(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Table object`)
    }
    return Table.fromFieldsWithTypes(typeArgs, content)
  }

  static async fetch<K extends ReifiedPhantomTypeArgument, V extends ReifiedPhantomTypeArgument>(
    client: SuiClient,
    typeArgs: [K, V],
    id: string
  ): Promise<Table<ToPhantomTypeArgument<K>, ToPhantomTypeArgument<V>>> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching Table object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isTable(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a Table object`)
    }
    return Table.fromFieldsWithTypes(typeArgs, res.data.content)
  }
}
