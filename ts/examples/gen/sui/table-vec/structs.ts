import * as reified from '../../_framework/reified'
import {
  PhantomReified,
  PhantomToTypeStr,
  PhantomTypeArgument,
  Reified,
  StructClass,
  ToField,
  ToPhantomTypeArgument,
  ToTypeStr,
  assertFieldsWithTypesArgsMatch,
  assertReifiedTypeArgsMatch,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  extractType,
  fieldToJSON,
  phantom,
} from '../../_framework/reified'
import {
  FieldsWithTypes,
  composeSuiType,
  compressSuiType,
  parseTypeName,
} from '../../_framework/util'
import { Table } from '../table/structs'
import { bcs } from '@mysten/sui/bcs'
import { SuiClient, SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromB64 } from '@mysten/sui/utils'

/* ============================== TableVec =============================== */

export function isTableVec(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::table_vec::TableVec` + '<')
}

export interface TableVecFields<Element extends PhantomTypeArgument> {
  contents: ToField<Table<'u64', Element>>
}

export type TableVecReified<Element extends PhantomTypeArgument> = Reified<
  TableVec<Element>,
  TableVecFields<Element>
>

export class TableVec<Element extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::table_vec::TableVec`
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName = TableVec.$typeName
  readonly $fullTypeName: `0x2::table_vec::TableVec<${PhantomToTypeStr<Element>}>`
  readonly $typeArgs: [PhantomToTypeStr<Element>]
  readonly $isPhantom = TableVec.$isPhantom

  readonly contents: ToField<Table<'u64', Element>>

  private constructor(typeArgs: [PhantomToTypeStr<Element>], fields: TableVecFields<Element>) {
    this.$fullTypeName = composeSuiType(
      TableVec.$typeName,
      ...typeArgs
    ) as `0x2::table_vec::TableVec<${PhantomToTypeStr<Element>}>`
    this.$typeArgs = typeArgs

    this.contents = fields.contents
  }

  static reified<Element extends PhantomReified<PhantomTypeArgument>>(
    Element: Element
  ): TableVecReified<ToPhantomTypeArgument<Element>> {
    const reifiedBcs = TableVec.bcs
    return {
      typeName: TableVec.$typeName,
      fullTypeName: composeSuiType(
        TableVec.$typeName,
        ...[extractType(Element)]
      ) as `0x2::table_vec::TableVec<${PhantomToTypeStr<ToPhantomTypeArgument<Element>>}>`,
      typeArgs: [extractType(Element)] as [PhantomToTypeStr<ToPhantomTypeArgument<Element>>],
      isPhantom: TableVec.$isPhantom,
      reifiedTypeArgs: [Element],
      fromFields: (fields: Record<string, any>) => TableVec.fromFields(Element, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => TableVec.fromFieldsWithTypes(Element, item),
      fromBcs: (data: Uint8Array) => TableVec.fromFields(Element, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => TableVec.fromJSONField(Element, field),
      fromJSON: (json: Record<string, any>) => TableVec.fromJSON(Element, json),
      fromSuiParsedData: (content: SuiParsedData) => TableVec.fromSuiParsedData(Element, content),
      fromSuiObjectData: (content: SuiObjectData) => TableVec.fromSuiObjectData(Element, content),
      fetch: async (client: SuiClient, id: string) => TableVec.fetch(client, Element, id),
      new: (fields: TableVecFields<ToPhantomTypeArgument<Element>>) => {
        return new TableVec([extractType(Element)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return TableVec.reified
  }

  static phantom<Element extends PhantomReified<PhantomTypeArgument>>(
    Element: Element
  ): PhantomReified<ToTypeStr<TableVec<ToPhantomTypeArgument<Element>>>> {
    return phantom(TableVec.reified(Element))
  }

  static get p() {
    return TableVec.phantom
  }

  private static instantiateBcs() {
    return bcs.struct('TableVec', {
      contents: Table.bcs,
    })
  }

  private static cachedBcs: ReturnType<typeof TableVec.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof TableVec.instantiateBcs> {
    if (!TableVec.cachedBcs) {
      TableVec.cachedBcs = TableVec.instantiateBcs()
    }
    return TableVec.cachedBcs
  }

  static fromFields<Element extends PhantomReified<PhantomTypeArgument>>(
    typeArg: Element,
    fields: Record<string, any>
  ): TableVec<ToPhantomTypeArgument<Element>> {
    return TableVec.reified(typeArg).new({
      contents: decodeFromFields(Table.reified(reified.phantom('u64'), typeArg), fields.contents),
    })
  }

  static fromFieldsWithTypes<Element extends PhantomReified<PhantomTypeArgument>>(
    typeArg: Element,
    item: FieldsWithTypes
  ): TableVec<ToPhantomTypeArgument<Element>> {
    if (!isTableVec(item.type)) {
      throw new Error('not a TableVec type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return TableVec.reified(typeArg).new({
      contents: decodeFromFieldsWithTypes(
        Table.reified(reified.phantom('u64'), typeArg),
        item.fields.contents
      ),
    })
  }

  static fromBcs<Element extends PhantomReified<PhantomTypeArgument>>(
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
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<Element extends PhantomReified<PhantomTypeArgument>>(
    typeArg: Element,
    field: any
  ): TableVec<ToPhantomTypeArgument<Element>> {
    return TableVec.reified(typeArg).new({
      contents: decodeFromJSONField(Table.reified(reified.phantom('u64'), typeArg), field.contents),
    })
  }

  static fromJSON<Element extends PhantomReified<PhantomTypeArgument>>(
    typeArg: Element,
    json: Record<string, any>
  ): TableVec<ToPhantomTypeArgument<Element>> {
    if (json.$typeName !== TableVec.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(TableVec.$typeName, ...[extractType(typeArg)]),
      json.$typeArgs,
      [typeArg]
    )

    return TableVec.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<Element extends PhantomReified<PhantomTypeArgument>>(
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

  static fromSuiObjectData<Element extends PhantomReified<PhantomTypeArgument>>(
    typeArg: Element,
    data: SuiObjectData
  ): TableVec<ToPhantomTypeArgument<Element>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isTableVec(data.bcs.type)) {
        throw new Error(`object at is not a TableVec object`)
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs
      if (gotTypeArgs.length !== 1) {
        throw new Error(
          `type argument mismatch: expected 1 type arguments but got '${gotTypeArgs.length}'`
        )
      }
      for (let i = 0; i < 1; i++) {
        const gotTypeArg = compressSuiType(gotTypeArgs[i])
        const expectedTypeArg = compressSuiType(extractType([typeArg][i]))
        if (gotTypeArg !== expectedTypeArg) {
          throw new Error(
            `type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`
          )
        }
      }

      return TableVec.fromBcs(typeArg, fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return TableVec.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<Element extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: Element,
    id: string
  ): Promise<TableVec<ToPhantomTypeArgument<Element>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching TableVec object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isTableVec(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a TableVec object`)
    }

    return TableVec.fromSuiObjectData(typeArg, res.data)
  }
}
