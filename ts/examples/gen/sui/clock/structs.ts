import { bcsSource as bcs } from '../../_framework/bcs'
import { FieldsWithTypes, Type } from '../../_framework/util'
import { UID } from '../object/structs'
import { Encoding } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== Clock =============================== */

bcs.registerStructType('0x2::clock::Clock', {
  id: `0x2::object::UID`,
  timestamp_ms: `u64`,
})

export function isClock(type: Type): boolean {
  return type === '0x2::clock::Clock'
}

export interface ClockFields {
  id: string
  timestampMs: bigint
}

export class Clock {
  static readonly $typeName = '0x2::clock::Clock'
  static readonly $numTypeParams = 0

  readonly id: string
  readonly timestampMs: bigint

  constructor(fields: ClockFields) {
    this.id = fields.id
    this.timestampMs = fields.timestampMs
  }

  static fromFields(fields: Record<string, any>): Clock {
    return new Clock({ id: UID.fromFields(fields.id).id, timestampMs: BigInt(fields.timestamp_ms) })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Clock {
    if (!isClock(item.type)) {
      throw new Error('not a Clock type')
    }
    return new Clock({ id: item.fields.id.id, timestampMs: BigInt(item.fields.timestamp_ms) })
  }

  static fromBcs(data: Uint8Array | string, encoding?: Encoding): Clock {
    return Clock.fromFields(bcs.de([Clock.$typeName], data, encoding))
  }

  static fromSuiParsedData(content: SuiParsedData) {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isClock(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Clock object`)
    }
    return Clock.fromFieldsWithTypes(content)
  }

  static async fetch(client: SuiClient, id: string): Promise<Clock> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching Clock object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isClock(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a Clock object`)
    }
    return Clock.fromFieldsWithTypes(res.data.content)
  }
}
