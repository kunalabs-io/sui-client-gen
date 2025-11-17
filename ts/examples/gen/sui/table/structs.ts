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
import { UID } from '../object/structs'
import { bcs } from '@mysten/sui/bcs'
import { SuiClient, SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromB64 } from '@mysten/sui/utils'

/* ============================== Table =============================== */

export function isTable(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::table::Table` + '<')
}

export interface TableFields<K extends PhantomTypeArgument, V extends PhantomTypeArgument> {
  id: ToField<UID>
  size: ToField<'u64'>
}

export type TableReified<K extends PhantomTypeArgument, V extends PhantomTypeArgument> = Reified<
  Table<K, V>,
  TableFields<K, V>
>

export class Table<K extends PhantomTypeArgument, V extends PhantomTypeArgument>
  implements StructClass
{
  __StructClass = true as const

  static readonly $typeName = `0x2::table::Table`
  static readonly $numTypeParams = 2
  static readonly $isPhantom = [true, true] as const

  readonly $typeName = Table.$typeName
  readonly $fullTypeName: `0x2::table::Table<${PhantomToTypeStr<K>}, ${PhantomToTypeStr<V>}>`
  readonly $typeArgs: [PhantomToTypeStr<K>, PhantomToTypeStr<V>]
  readonly $isPhantom = Table.$isPhantom

  readonly id: ToField<UID>
  readonly size: ToField<'u64'>

  private constructor(
    typeArgs: [PhantomToTypeStr<K>, PhantomToTypeStr<V>],
    fields: TableFields<K, V>
  ) {
    this.$fullTypeName = composeSuiType(
      Table.$typeName,
      ...typeArgs
    ) as `0x2::table::Table<${PhantomToTypeStr<K>}, ${PhantomToTypeStr<V>}>`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.size = fields.size
  }

  static reified<
    K extends PhantomReified<PhantomTypeArgument>,
    V extends PhantomReified<PhantomTypeArgument>,
  >(K: K, V: V): TableReified<ToPhantomTypeArgument<K>, ToPhantomTypeArgument<V>> {
    const reifiedBcs = Table.bcs
    return {
      typeName: Table.$typeName,
      fullTypeName: composeSuiType(
        Table.$typeName,
        ...[extractType(K), extractType(V)]
      ) as `0x2::table::Table<${PhantomToTypeStr<ToPhantomTypeArgument<K>>}, ${PhantomToTypeStr<ToPhantomTypeArgument<V>>}>`,
      typeArgs: [extractType(K), extractType(V)] as [
        PhantomToTypeStr<ToPhantomTypeArgument<K>>,
        PhantomToTypeStr<ToPhantomTypeArgument<V>>,
      ],
      isPhantom: Table.$isPhantom,
      reifiedTypeArgs: [K, V],
      fromFields: (fields: Record<string, any>) => Table.fromFields([K, V], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Table.fromFieldsWithTypes([K, V], item),
      fromBcs: (data: Uint8Array) => Table.fromFields([K, V], reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => Table.fromJSONField([K, V], field),
      fromJSON: (json: Record<string, any>) => Table.fromJSON([K, V], json),
      fromSuiParsedData: (content: SuiParsedData) => Table.fromSuiParsedData([K, V], content),
      fromSuiObjectData: (content: SuiObjectData) => Table.fromSuiObjectData([K, V], content),
      fetch: async (client: SuiClient, id: string) => Table.fetch(client, [K, V], id),
      new: (fields: TableFields<ToPhantomTypeArgument<K>, ToPhantomTypeArgument<V>>) => {
        return new Table([extractType(K), extractType(V)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Table.reified
  }

  static phantom<
    K extends PhantomReified<PhantomTypeArgument>,
    V extends PhantomReified<PhantomTypeArgument>,
  >(
    K: K,
    V: V
  ): PhantomReified<ToTypeStr<Table<ToPhantomTypeArgument<K>, ToPhantomTypeArgument<V>>>> {
    return phantom(Table.reified(K, V))
  }
  static get p() {
    return Table.phantom
  }

  private static instantiateBcs() {
    return bcs.struct('Table', {
      id: UID.bcs,
      size: bcs.u64(),
    })
  }

  private static cachedBcs: ReturnType<typeof Table.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof Table.instantiateBcs> {
    if (!Table.cachedBcs) {
      Table.cachedBcs = Table.instantiateBcs()
    }
    return Table.cachedBcs
  }

  static fromFields<
    K extends PhantomReified<PhantomTypeArgument>,
    V extends PhantomReified<PhantomTypeArgument>,
  >(
    typeArgs: [K, V],
    fields: Record<string, any>
  ): Table<ToPhantomTypeArgument<K>, ToPhantomTypeArgument<V>> {
    return Table.reified(typeArgs[0], typeArgs[1]).new({
      id: decodeFromFields(UID.reified(), fields.id),
      size: decodeFromFields('u64', fields.size),
    })
  }

  static fromFieldsWithTypes<
    K extends PhantomReified<PhantomTypeArgument>,
    V extends PhantomReified<PhantomTypeArgument>,
  >(
    typeArgs: [K, V],
    item: FieldsWithTypes
  ): Table<ToPhantomTypeArgument<K>, ToPhantomTypeArgument<V>> {
    if (!isTable(item.type)) {
      throw new Error('not a Table type')
    }
    assertFieldsWithTypesArgsMatch(item, typeArgs)

    return Table.reified(typeArgs[0], typeArgs[1]).new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      size: decodeFromFieldsWithTypes('u64', item.fields.size),
    })
  }

  static fromBcs<
    K extends PhantomReified<PhantomTypeArgument>,
    V extends PhantomReified<PhantomTypeArgument>,
  >(typeArgs: [K, V], data: Uint8Array): Table<ToPhantomTypeArgument<K>, ToPhantomTypeArgument<V>> {
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
    K extends PhantomReified<PhantomTypeArgument>,
    V extends PhantomReified<PhantomTypeArgument>,
  >(typeArgs: [K, V], field: any): Table<ToPhantomTypeArgument<K>, ToPhantomTypeArgument<V>> {
    return Table.reified(typeArgs[0], typeArgs[1]).new({
      id: decodeFromJSONField(UID.reified(), field.id),
      size: decodeFromJSONField('u64', field.size),
    })
  }

  static fromJSON<
    K extends PhantomReified<PhantomTypeArgument>,
    V extends PhantomReified<PhantomTypeArgument>,
  >(
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
    K extends PhantomReified<PhantomTypeArgument>,
    V extends PhantomReified<PhantomTypeArgument>,
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

  static fromSuiObjectData<
    K extends PhantomReified<PhantomTypeArgument>,
    V extends PhantomReified<PhantomTypeArgument>,
  >(
    typeArgs: [K, V],
    data: SuiObjectData
  ): Table<ToPhantomTypeArgument<K>, ToPhantomTypeArgument<V>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isTable(data.bcs.type)) {
        throw new Error(`object at is not a Table object`)
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs
      if (gotTypeArgs.length !== 2) {
        throw new Error(
          `type argument mismatch: expected 2 type arguments but got ${gotTypeArgs.length}`
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

      return Table.fromBcs(typeArgs, fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Table.fromSuiParsedData(typeArgs, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<
    K extends PhantomReified<PhantomTypeArgument>,
    V extends PhantomReified<PhantomTypeArgument>,
  >(
    client: SuiClient,
    typeArgs: [K, V],
    id: string
  ): Promise<Table<ToPhantomTypeArgument<K>, ToPhantomTypeArgument<V>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching Table object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isTable(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a Table object`)
    }

    return Table.fromSuiObjectData(typeArgs, res.data)
  }
}
