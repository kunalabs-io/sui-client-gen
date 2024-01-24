import * as reified from '../../_framework/reified'
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
import { Table } from '../table/structs'
import { bcs } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== TableVec =============================== */

export function isTableVec(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::table_vec::TableVec<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface TableVecFields<Element extends PhantomTypeArgument> {
  contents: ToField<Table<'u64', Element>>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class TableVec<Element extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::table_vec::TableVec'
  static readonly $numTypeParams = 1

  readonly $fullTypeName = null as unknown as `0x2::table_vec::TableVec<${ToTypeStr<Element>}>`

  readonly $typeName = TableVec.$typeName

  static get bcs() {
    return bcs.struct('TableVec', {
      contents: Table.bcs,
    })
  }

  readonly $typeArg: string

  readonly contents: ToField<Table<'u64', Element>>

  private constructor(typeArg: string, contents: ToField<Table<'u64', Element>>) {
    this.$typeArg = typeArg

    this.contents = contents
  }

  static new<Element extends ReifiedPhantomTypeArgument>(
    typeArg: Element,
    contents: ToField<Table<'u64', ToPhantomTypeArgument<Element>>>
  ): TableVec<ToPhantomTypeArgument<Element>> {
    return new TableVec(extractType(typeArg), contents)
  }

  static reified<Element extends ReifiedPhantomTypeArgument>(
    Element: Element
  ): Reified<TableVec<ToPhantomTypeArgument<Element>>> {
    return {
      typeName: TableVec.$typeName,
      fullTypeName: composeSuiType(
        TableVec.$typeName,
        ...[extractType(Element)]
      ) as `0x2::table_vec::TableVec<${ToTypeStr<ToPhantomTypeArgument<Element>>}>`,
      typeArgs: [Element],
      fromFields: (fields: Record<string, any>) => TableVec.fromFields(Element, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => TableVec.fromFieldsWithTypes(Element, item),
      fromBcs: (data: Uint8Array) => TableVec.fromBcs(Element, data),
      bcs: TableVec.bcs,
      fromJSONField: (field: any) => TableVec.fromJSONField(Element, field),
      fetch: async (client: SuiClient, id: string) => TableVec.fetch(client, Element, id),
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return TableVec.reified
  }

  static fromFields<Element extends ReifiedPhantomTypeArgument>(
    typeArg: Element,
    fields: Record<string, any>
  ): TableVec<ToPhantomTypeArgument<Element>> {
    return TableVec.new(
      typeArg,
      decodeFromFields(Table.reified(reified.phantom('u64'), typeArg), fields.contents)
    )
  }

  static fromFieldsWithTypes<Element extends ReifiedPhantomTypeArgument>(
    typeArg: Element,
    item: FieldsWithTypes
  ): TableVec<ToPhantomTypeArgument<Element>> {
    if (!isTableVec(item.type)) {
      throw new Error('not a TableVec type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return TableVec.new(
      typeArg,
      decodeFromFieldsWithTypes(
        Table.reified(reified.phantom('u64'), typeArg),
        item.fields.contents
      )
    )
  }

  static fromBcs<Element extends ReifiedPhantomTypeArgument>(
    typeArg: Element,
    data: Uint8Array
  ): TableVec<ToPhantomTypeArgument<Element>> {
    return TableVec.fromFields(typeArg, TableVec.bcs.parse(data))
  }

  toJSONField() {
    return {
      contents: this.contents.toJSONField(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArg: this.$typeArg, ...this.toJSONField() }
  }

  static fromJSONField<Element extends ReifiedPhantomTypeArgument>(
    typeArg: Element,
    field: any
  ): TableVec<ToPhantomTypeArgument<Element>> {
    return TableVec.new(
      typeArg,
      decodeFromJSONField(Table.reified(reified.phantom('u64'), typeArg), field.contents)
    )
  }

  static fromJSON<Element extends ReifiedPhantomTypeArgument>(
    typeArg: Element,
    json: Record<string, any>
  ): TableVec<ToPhantomTypeArgument<Element>> {
    if (json.$typeName !== TableVec.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(TableVec.$typeName, extractType(typeArg)),
      [json.$typeArg],
      [typeArg]
    )

    return TableVec.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<Element extends ReifiedPhantomTypeArgument>(
    typeArg: Element,
    content: SuiParsedData
  ): TableVec<ToPhantomTypeArgument<Element>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isTableVec(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a TableVec object`)
    }
    return TableVec.fromFieldsWithTypes(typeArg, content)
  }

  static async fetch<Element extends ReifiedPhantomTypeArgument>(
    client: SuiClient,
    typeArg: Element,
    id: string
  ): Promise<TableVec<ToPhantomTypeArgument<Element>>> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching TableVec object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isTableVec(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a TableVec object`)
    }
    return TableVec.fromFieldsWithTypes(typeArg, res.data.content)
  }
}
