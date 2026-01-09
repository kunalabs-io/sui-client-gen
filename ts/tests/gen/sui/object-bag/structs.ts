/**
 * Similar to `sui::bag`, an `ObjectBag` is a heterogeneous map-like collection. But unlike
 * `sui::bag`, the values bound to these dynamic fields _must_ be objects themselves. This allows
 * for the objects to still exist in storage, which may be important for external tools.
 * The difference is otherwise not observable from within Move.
 */

import { bcs } from '@mysten/sui/bcs'
import { SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromBase64 } from '@mysten/sui/utils'
import {
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  phantom,
  PhantomReified,
  Reified,
  StructClass,
  ToField,
  ToJSON,
  ToTypeStr,
} from '../../_framework/reified'
import {
  composeSuiType,
  compressSuiType,
  fetchObjectBcs,
  FieldsWithTypes,
  SupportedSuiClient,
} from '../../_framework/util'
import { UID } from '../object/structs'

/* ============================== ObjectBag =============================== */

export function isObjectBag(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::object_bag::ObjectBag`
}

export interface ObjectBagFields {
  /** the ID of this bag */
  id: ToField<UID>
  /** the number of key-value pairs in the bag */
  size: ToField<'u64'>
}

export type ObjectBagReified = Reified<ObjectBag, ObjectBagFields>

export type ObjectBagJSONField = {
  id: string
  size: string
}

export type ObjectBagJSON = {
  $typeName: typeof ObjectBag.$typeName
  $typeArgs: []
} & ObjectBagJSONField

export class ObjectBag implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::object_bag::ObjectBag` = `0x2::object_bag::ObjectBag` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName: typeof ObjectBag.$typeName = ObjectBag.$typeName
  readonly $fullTypeName: `0x2::object_bag::ObjectBag`
  readonly $typeArgs: []
  readonly $isPhantom: typeof ObjectBag.$isPhantom = ObjectBag.$isPhantom

  /** the ID of this bag */
  readonly id: ToField<UID>
  /** the number of key-value pairs in the bag */
  readonly size: ToField<'u64'>

  private constructor(typeArgs: [], fields: ObjectBagFields) {
    this.$fullTypeName = composeSuiType(
      ObjectBag.$typeName,
      ...typeArgs,
    ) as `0x2::object_bag::ObjectBag`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.size = fields.size
  }

  static reified(): ObjectBagReified {
    const reifiedBcs = ObjectBag.bcs
    return {
      typeName: ObjectBag.$typeName,
      fullTypeName: composeSuiType(
        ObjectBag.$typeName,
        ...[],
      ) as `0x2::object_bag::ObjectBag`,
      typeArgs: [] as [],
      isPhantom: ObjectBag.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => ObjectBag.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => ObjectBag.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => ObjectBag.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => ObjectBag.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => ObjectBag.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => ObjectBag.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => ObjectBag.fromSuiObjectData(content),
      fetch: async (client: SupportedSuiClient, id: string) => ObjectBag.fetch(client, id),
      new: (fields: ObjectBagFields) => {
        return new ObjectBag([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): ObjectBagReified {
    return ObjectBag.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<ObjectBag>> {
    return phantom(ObjectBag.reified())
  }

  static get p(): PhantomReified<ToTypeStr<ObjectBag>> {
    return ObjectBag.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('ObjectBag', {
      id: UID.bcs,
      size: bcs.u64(),
    })
  }

  private static cachedBcs: ReturnType<typeof ObjectBag.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof ObjectBag.instantiateBcs> {
    if (!ObjectBag.cachedBcs) {
      ObjectBag.cachedBcs = ObjectBag.instantiateBcs()
    }
    return ObjectBag.cachedBcs
  }

  static fromFields(fields: Record<string, any>): ObjectBag {
    return ObjectBag.reified().new({
      id: decodeFromFields(UID.reified(), fields.id),
      size: decodeFromFields('u64', fields.size),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): ObjectBag {
    if (!isObjectBag(item.type)) {
      throw new Error('not a ObjectBag type')
    }

    return ObjectBag.reified().new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      size: decodeFromFieldsWithTypes('u64', item.fields.size),
    })
  }

  static fromBcs(data: Uint8Array): ObjectBag {
    return ObjectBag.fromFields(ObjectBag.bcs.parse(data))
  }

  toJSONField(): ObjectBagJSONField {
    return {
      id: this.id,
      size: this.size.toString(),
    }
  }

  toJSON(): ObjectBagJSON {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): ObjectBag {
    return ObjectBag.reified().new({
      id: decodeFromJSONField(UID.reified(), field.id),
      size: decodeFromJSONField('u64', field.size),
    })
  }

  static fromJSON(json: Record<string, any>): ObjectBag {
    if (json.$typeName !== ObjectBag.$typeName) {
      throw new Error(
        `not a ObjectBag json object: expected '${ObjectBag.$typeName}' but got '${json.$typeName}'`,
      )
    }

    return ObjectBag.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): ObjectBag {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isObjectBag(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a ObjectBag object`)
    }
    return ObjectBag.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): ObjectBag {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isObjectBag(data.bcs.type)) {
        throw new Error(`object at is not a ObjectBag object`)
      }

      return ObjectBag.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return ObjectBag.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.',
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<ObjectBag> {
    const res = await fetchObjectBcs(client, id)
    if (!isObjectBag(res.type)) {
      throw new Error(`object at id ${id} is not a ObjectBag object`)
    }

    return ObjectBag.fromBcs(res.bcsBytes)
  }
}
