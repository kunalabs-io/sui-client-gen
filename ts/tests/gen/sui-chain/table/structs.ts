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
export interface TableFields<T0 extends PhantomTypeArgument, T1 extends PhantomTypeArgument> {
  id: ToField<UID>
  size: ToField<'u64'>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Table<T0 extends PhantomTypeArgument, T1 extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::table::Table'
  static readonly $numTypeParams = 2

  readonly $fullTypeName =
    null as unknown as `0x2::table::Table<${ToTypeStr<T0>}, ${ToTypeStr<T1>}>`

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

  private constructor(typeArgs: [string, string], fields: TableFields<T0, T1>) {
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.size = fields.size
  }

  static new<T0 extends ReifiedPhantomTypeArgument, T1 extends ReifiedPhantomTypeArgument>(
    typeArgs: [T0, T1],
    fields: TableFields<ToPhantomTypeArgument<T0>, ToPhantomTypeArgument<T1>>
  ): Table<ToPhantomTypeArgument<T0>, ToPhantomTypeArgument<T1>> {
    return new Table(typeArgs.map(extractType) as [string, string], fields)
  }

  static reified<T0 extends ReifiedPhantomTypeArgument, T1 extends ReifiedPhantomTypeArgument>(
    T0: T0,
    T1: T1
  ): Reified<Table<ToPhantomTypeArgument<T0>, ToPhantomTypeArgument<T1>>> {
    return {
      typeName: Table.$typeName,
      fullTypeName: composeSuiType(
        Table.$typeName,
        ...[extractType(T0), extractType(T1)]
      ) as `0x2::table::Table<${ToTypeStr<ToPhantomTypeArgument<T0>>}, ${ToTypeStr<
        ToPhantomTypeArgument<T1>
      >}>`,
      typeArgs: [T0, T1],
      fromFields: (fields: Record<string, any>) => Table.fromFields([T0, T1], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Table.fromFieldsWithTypes([T0, T1], item),
      fromBcs: (data: Uint8Array) => Table.fromBcs([T0, T1], data),
      bcs: Table.bcs,
      fromJSONField: (field: any) => Table.fromJSONField([T0, T1], field),
      fetch: async (client: SuiClient, id: string) => Table.fetch(client, [T0, T1], id),
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Table.reified
  }

  static fromFields<T0 extends ReifiedPhantomTypeArgument, T1 extends ReifiedPhantomTypeArgument>(
    typeArgs: [T0, T1],
    fields: Record<string, any>
  ): Table<ToPhantomTypeArgument<T0>, ToPhantomTypeArgument<T1>> {
    return Table.new(typeArgs, {
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
  ): Table<ToPhantomTypeArgument<T0>, ToPhantomTypeArgument<T1>> {
    if (!isTable(item.type)) {
      throw new Error('not a Table type')
    }
    assertFieldsWithTypesArgsMatch(item, typeArgs)

    return Table.new(typeArgs, {
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      size: decodeFromFieldsWithTypes('u64', item.fields.size),
    })
  }

  static fromBcs<T0 extends ReifiedPhantomTypeArgument, T1 extends ReifiedPhantomTypeArgument>(
    typeArgs: [T0, T1],
    data: Uint8Array
  ): Table<ToPhantomTypeArgument<T0>, ToPhantomTypeArgument<T1>> {
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

  static fromJSONField<
    T0 extends ReifiedPhantomTypeArgument,
    T1 extends ReifiedPhantomTypeArgument,
  >(typeArgs: [T0, T1], field: any): Table<ToPhantomTypeArgument<T0>, ToPhantomTypeArgument<T1>> {
    return Table.new(typeArgs, {
      id: decodeFromJSONField(UID.reified(), field.id),
      size: decodeFromJSONField('u64', field.size),
    })
  }

  static fromJSON<T0 extends ReifiedPhantomTypeArgument, T1 extends ReifiedPhantomTypeArgument>(
    typeArgs: [T0, T1],
    json: Record<string, any>
  ): Table<ToPhantomTypeArgument<T0>, ToPhantomTypeArgument<T1>> {
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
    T0 extends ReifiedPhantomTypeArgument,
    T1 extends ReifiedPhantomTypeArgument,
  >(
    typeArgs: [T0, T1],
    content: SuiParsedData
  ): Table<ToPhantomTypeArgument<T0>, ToPhantomTypeArgument<T1>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isTable(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Table object`)
    }
    return Table.fromFieldsWithTypes(typeArgs, content)
  }

  static async fetch<T0 extends ReifiedPhantomTypeArgument, T1 extends ReifiedPhantomTypeArgument>(
    client: SuiClient,
    typeArgs: [T0, T1],
    id: string
  ): Promise<Table<ToPhantomTypeArgument<T0>, ToPhantomTypeArgument<T1>>> {
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
