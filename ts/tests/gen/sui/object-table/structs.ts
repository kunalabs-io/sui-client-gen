import {
  ReifiedTypeArgument,
  ToField,
  assertFieldsWithTypesArgsMatch,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  extractType,
} from '../../_framework/reified'
import { FieldsWithTypes, compressSuiType } from '../../_framework/util'
import { UID } from '../object/structs'
import { bcs } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== ObjectTable =============================== */

export function isObjectTable(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::object_table::ObjectTable<')
}

export interface ObjectTableFields {
  id: ToField<UID>
  size: ToField<'u64'>
}

export class ObjectTable {
  static readonly $typeName = '0x2::object_table::ObjectTable'
  static readonly $numTypeParams = 2

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

  private constructor(typeArgs: [string, string], fields: ObjectTableFields) {
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.size = fields.size
  }

  static new(
    typeArgs: [ReifiedTypeArgument, ReifiedTypeArgument],
    fields: ObjectTableFields
  ): ObjectTable {
    return new ObjectTable(typeArgs.map(extractType) as [string, string], fields)
  }

  static reified(K: ReifiedTypeArgument, V: ReifiedTypeArgument) {
    return {
      typeName: ObjectTable.$typeName,
      typeArgs: [K, V],
      fromFields: (fields: Record<string, any>) => ObjectTable.fromFields([K, V], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => ObjectTable.fromFieldsWithTypes([K, V], item),
      fromBcs: (data: Uint8Array) => ObjectTable.fromBcs([K, V], data),
      bcs: ObjectTable.bcs,
      __class: null as unknown as ReturnType<typeof ObjectTable.new>,
    }
  }

  static fromFields(
    typeArgs: [ReifiedTypeArgument, ReifiedTypeArgument],
    fields: Record<string, any>
  ): ObjectTable {
    return ObjectTable.new(typeArgs, {
      id: decodeFromFields(UID.reified(), fields.id),
      size: decodeFromFields('u64', fields.size),
    })
  }

  static fromFieldsWithTypes(
    typeArgs: [ReifiedTypeArgument, ReifiedTypeArgument],
    item: FieldsWithTypes
  ): ObjectTable {
    if (!isObjectTable(item.type)) {
      throw new Error('not a ObjectTable type')
    }
    assertFieldsWithTypesArgsMatch(item, typeArgs)

    return ObjectTable.new(typeArgs, {
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      size: decodeFromFieldsWithTypes('u64', item.fields.size),
    })
  }

  static fromBcs(
    typeArgs: [ReifiedTypeArgument, ReifiedTypeArgument],
    data: Uint8Array
  ): ObjectTable {
    return ObjectTable.fromFields(typeArgs, ObjectTable.bcs.parse(data))
  }

  toJSON() {
    return {
      $typeArgs: this.$typeArgs,
      id: this.id,
      size: this.size.toString(),
    }
  }

  static fromSuiParsedData(
    typeArgs: [ReifiedTypeArgument, ReifiedTypeArgument],
    content: SuiParsedData
  ): ObjectTable {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isObjectTable(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a ObjectTable object`)
    }
    return ObjectTable.fromFieldsWithTypes(typeArgs, content)
  }

  static async fetch(
    client: SuiClient,
    typeArgs: [ReifiedTypeArgument, ReifiedTypeArgument],
    id: string
  ): Promise<ObjectTable> {
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
