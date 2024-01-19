import {
  ToField,
  decodeFromFieldsGenericOrSpecial,
  decodeFromFieldsWithTypesGenericOrSpecial,
} from '../../_framework/types'
import { FieldsWithTypes, compressSuiType } from '../../_framework/util'
import { UID } from '../object/structs'
import { bcs } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== ObjectBag =============================== */

export function isObjectBag(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x2::object_bag::ObjectBag'
}

export interface ObjectBagFields {
  id: ToField<UID>
  size: ToField<'u64'>
}

export class ObjectBag {
  static readonly $typeName = '0x2::object_bag::ObjectBag'
  static readonly $numTypeParams = 0

  readonly $typeName = ObjectBag.$typeName

  static get bcs() {
    return bcs.struct('ObjectBag', {
      id: UID.bcs,
      size: bcs.u64(),
    })
  }

  readonly id: ToField<UID>
  readonly size: ToField<'u64'>

  private constructor(fields: ObjectBagFields) {
    this.id = fields.id
    this.size = fields.size
  }

  static new(fields: ObjectBagFields): ObjectBag {
    return new ObjectBag(fields)
  }

  static reified() {
    return {
      typeName: ObjectBag.$typeName,
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => ObjectBag.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => ObjectBag.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => ObjectBag.fromBcs(data),
      bcs: ObjectBag.bcs,
      __class: null as unknown as ReturnType<typeof ObjectBag.new>,
    }
  }

  static fromFields(fields: Record<string, any>): ObjectBag {
    return ObjectBag.new({
      id: decodeFromFieldsGenericOrSpecial(UID.reified(), fields.id),
      size: decodeFromFieldsGenericOrSpecial('u64', fields.size),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): ObjectBag {
    if (!isObjectBag(item.type)) {
      throw new Error('not a ObjectBag type')
    }

    return ObjectBag.new({
      id: decodeFromFieldsWithTypesGenericOrSpecial(UID.reified(), item.fields.id),
      size: decodeFromFieldsWithTypesGenericOrSpecial('u64', item.fields.size),
    })
  }

  static fromBcs(data: Uint8Array): ObjectBag {
    return ObjectBag.fromFields(ObjectBag.bcs.parse(data))
  }

  toJSON() {
    return {
      id: this.id,
      size: this.size.toString(),
    }
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

  static async fetch(client: SuiClient, id: string): Promise<ObjectBag> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching ObjectBag object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isObjectBag(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a ObjectBag object`)
    }
    return ObjectBag.fromFieldsWithTypes(res.data.content)
  }
}
