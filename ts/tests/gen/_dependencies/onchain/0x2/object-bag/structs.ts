import { bcsOnchain as bcs } from '../../../../_framework/bcs'
import { FieldsWithTypes, Type } from '../../../../_framework/util'
import { UID } from '../object/structs'
import { Encoding } from '@mysten/bcs'
import { JsonRpcProvider, ObjectId, SuiParsedData } from '@mysten/sui.js'

/* ============================== ObjectBag =============================== */

bcs.registerStructType('0x2::object_bag::ObjectBag', {
  id: `0x2::object::UID`,
  size: `u64`,
})

export function isObjectBag(type: Type): boolean {
  return type === '0x2::object_bag::ObjectBag'
}

export interface ObjectBagFields {
  id: ObjectId
  size: bigint
}

export class ObjectBag {
  static readonly $typeName = '0x2::object_bag::ObjectBag'
  static readonly $numTypeParams = 0

  readonly id: ObjectId
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

  static fromBcs(data: Uint8Array | string, encoding?: Encoding): ObjectBag {
    return ObjectBag.fromFields(bcs.de([ObjectBag.$typeName], data, encoding))
  }

  static fromSuiParsedData(content: SuiParsedData) {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isObjectBag(content.type)) {
      throw new Error(`object at ${content.fields.id} is not a ObjectBag object`)
    }
    return ObjectBag.fromFieldsWithTypes(content)
  }

  static async fetch(provider: JsonRpcProvider, id: ObjectId): Promise<ObjectBag> {
    const res = await provider.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching ObjectBag object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isObjectBag(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a ObjectBag object`)
    }
    return ObjectBag.fromFieldsWithTypes(res.data.content)
  }
}
