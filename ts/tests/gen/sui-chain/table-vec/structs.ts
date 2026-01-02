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

export interface TableVecFields<T0 extends PhantomTypeArgument> {
  contents: ToField<Table<'u64', T0>>
}

export type TableVecReified<T0 extends PhantomTypeArgument> = Reified<
  TableVec<T0>,
  TableVecFields<T0>
>

export class TableVec<T0 extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::table_vec::TableVec`
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName = TableVec.$typeName
  readonly $fullTypeName: `0x2::table_vec::TableVec<${PhantomToTypeStr<T0>}>`
  readonly $typeArgs: [PhantomToTypeStr<T0>]
  readonly $isPhantom = TableVec.$isPhantom

  readonly contents: ToField<Table<'u64', T0>>

  private constructor(typeArgs: [PhantomToTypeStr<T0>], fields: TableVecFields<T0>) {
    this.$fullTypeName = composeSuiType(
      TableVec.$typeName,
      ...typeArgs
    ) as `0x2::table_vec::TableVec<${PhantomToTypeStr<T0>}>`
    this.$typeArgs = typeArgs

    this.contents = fields.contents
  }

  static reified<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): TableVecReified<ToPhantomTypeArgument<T0>> {
    const reifiedBcs = TableVec.bcs
    return {
      typeName: TableVec.$typeName,
      fullTypeName: composeSuiType(
        TableVec.$typeName,
        ...[extractType(T0)]
      ) as `0x2::table_vec::TableVec<${PhantomToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [extractType(T0)] as [PhantomToTypeStr<ToPhantomTypeArgument<T0>>],
      isPhantom: TableVec.$isPhantom,
      reifiedTypeArgs: [T0],
      fromFields: (fields: Record<string, any>) => TableVec.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => TableVec.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => TableVec.fromFields(T0, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => TableVec.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => TableVec.fromJSON(T0, json),
      fromSuiParsedData: (content: SuiParsedData) => TableVec.fromSuiParsedData(T0, content),
      fromSuiObjectData: (content: SuiObjectData) => TableVec.fromSuiObjectData(T0, content),
      fetch: async (client: SuiClient, id: string) => TableVec.fetch(client, T0, id),
      new: (fields: TableVecFields<ToPhantomTypeArgument<T0>>) => {
        return new TableVec([extractType(T0)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return TableVec.reified
  }

  static phantom<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): PhantomReified<ToTypeStr<TableVec<ToPhantomTypeArgument<T0>>>> {
    return phantom(TableVec.reified(T0))
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

  static fromFields<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    fields: Record<string, any>
  ): TableVec<ToPhantomTypeArgument<T0>> {
    return TableVec.reified(typeArg).new({
      contents: decodeFromFields(Table.reified(reified.phantom('u64'), typeArg), fields.contents),
    })
  }

  static fromFieldsWithTypes<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    item: FieldsWithTypes
  ): TableVec<ToPhantomTypeArgument<T0>> {
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

  static fromBcs<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: Uint8Array
  ): TableVec<ToPhantomTypeArgument<T0>> {
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

  static fromJSONField<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    field: any
  ): TableVec<ToPhantomTypeArgument<T0>> {
    return TableVec.reified(typeArg).new({
      contents: decodeFromJSONField(Table.reified(reified.phantom('u64'), typeArg), field.contents),
    })
  }

  static fromJSON<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    json: Record<string, any>
  ): TableVec<ToPhantomTypeArgument<T0>> {
    if (json.$typeName !== TableVec.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(TableVec.$typeName, extractType(typeArg)),
      json.$typeArgs,
      [typeArg]
    )

    return TableVec.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    content: SuiParsedData
  ): TableVec<ToPhantomTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isTableVec(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a TableVec object`)
    }
    return TableVec.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: SuiObjectData
  ): TableVec<ToPhantomTypeArgument<T0>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isTableVec(data.bcs.type)) {
        throw new Error(`object at is not a TableVec object`)
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs
      if (gotTypeArgs.length !== 1) {
        throw new Error(
          `type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`
        )
      }
      const gotTypeArg = compressSuiType(gotTypeArgs[0])
      const expectedTypeArg = compressSuiType(extractType(typeArg))
      if (gotTypeArg !== compressSuiType(extractType(typeArg))) {
        throw new Error(
          `type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`
        )
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

  static async fetch<T0 extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<TableVec<ToPhantomTypeArgument<T0>>> {
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
