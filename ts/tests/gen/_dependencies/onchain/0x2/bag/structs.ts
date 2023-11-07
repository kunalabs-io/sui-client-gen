import { Encoding, bcsOnchain as bcs } from '../../../../_framework/bcs'
import { FieldsWithTypes, Type } from '../../../../_framework/util'
import { UID } from '../object/structs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== Bag =============================== */

bcs.registerStructType('0x2::bag::Bag', {
  id: `0x2::object::UID`,
  size: `u64`,
})

export function isBag(type: Type): boolean {
  return type === '0x2::bag::Bag'
}

export interface BagFields {
  id: string
  size: bigint
}

export class Bag {
  static readonly $typeName = '0x2::bag::Bag'
  static readonly $numTypeParams = 0

  readonly id: string
  readonly size: bigint

  constructor(fields: BagFields) {
    this.id = fields.id
    this.size = fields.size
  }

  static fromFields(fields: Record<string, any>): Bag {
    return new Bag({ id: UID.fromFields(fields.id).id, size: BigInt(fields.size) })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Bag {
    if (!isBag(item.type)) {
      throw new Error('not a Bag type')
    }
    return new Bag({ id: item.fields.id.id, size: BigInt(item.fields.size) })
  }

  static fromBcs(data: Uint8Array | string, encoding?: Encoding): Bag {
    return Bag.fromFields(bcs.de([Bag.$typeName], data, encoding))
  }

  static fromSuiParsedData(content: SuiParsedData) {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isBag(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Bag object`)
    }
    return Bag.fromFieldsWithTypes(content)
  }

  static async fetch(client: SuiClient, id: string): Promise<Bag> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching Bag object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isBag(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a Bag object`)
    }
    return Bag.fromFieldsWithTypes(res.data.content)
  }
}
