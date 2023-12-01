import { FieldsWithTypes, Type, compressSuiType } from '../../../../_framework/util'
import { UID } from '../object/structs'
import { bcs } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== ObjectBag =============================== */

export function isObjectBag(type: Type): boolean {
  type = compressSuiType(type)
  return type === '0x2::object_bag::ObjectBag'
}

export interface ObjectBagFields {
  id: string
  size: bigint
}

export class ObjectBag {
  static readonly $typeName = '0x2::object_bag::ObjectBag'
  static readonly $numTypeParams = 0

  static get bcs() {
    return bcs.struct('ObjectBag', {
      id: UID.bcs,
      size: bcs.u64(),
    })
  }

  readonly id: string
  readonly size: bigint

  constructor(fields: ObjectBagFields) {
    this.id = fields.id
    this.size = fields.size
  }

  static fromFields(fields: Record<string, any>): ObjectBag {
    return new ObjectBag({ id: UID.fromFields(fields.id).id, size: BigInt(fields.size) })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): ObjectBag {
    if (!isObjectBag(item.type)) {
      throw new Error('not a ObjectBag type')
    }
    return new ObjectBag({ id: item.fields.id.id, size: BigInt(item.fields.size) })
  }

  static fromBcs(data: Uint8Array): ObjectBag {
    return ObjectBag.fromFields(ObjectBag.bcs.parse(data))
  }

  static fromSuiParsedData(content: SuiParsedData) {
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
