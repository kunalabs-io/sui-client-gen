import * as reified from '../../_framework/reified'
import {
  PhantomReified,
  Reified,
  StructClass,
  ToField,
  ToTypeStr,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  fieldToJSON,
  phantom,
} from '../../_framework/reified'
import {
  FieldsWithTypes,
  composeSuiType,
  compressSuiType,
  parseTypeName,
} from '../../_framework/util'
import { Vector } from '../../_framework/vector'
import { bcs } from '@mysten/sui/bcs'
import { SuiClient, SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromB64 } from '@mysten/sui/utils'

/* ============================== EventStreamHead =============================== */

export function isEventStreamHead(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::accumulator_settlement::EventStreamHead`
}

export interface EventStreamHeadFields {
  mmr: ToField<Vector<'u256'>>
  checkpointSeq: ToField<'u64'>
  numEvents: ToField<'u64'>
}

export type EventStreamHeadReified = Reified<EventStreamHead, EventStreamHeadFields>

export class EventStreamHead implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::accumulator_settlement::EventStreamHead`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = EventStreamHead.$typeName
  readonly $fullTypeName: `0x2::accumulator_settlement::EventStreamHead`
  readonly $typeArgs: []
  readonly $isPhantom = EventStreamHead.$isPhantom

  readonly mmr: ToField<Vector<'u256'>>
  readonly checkpointSeq: ToField<'u64'>
  readonly numEvents: ToField<'u64'>

  private constructor(typeArgs: [], fields: EventStreamHeadFields) {
    this.$fullTypeName = composeSuiType(
      EventStreamHead.$typeName,
      ...typeArgs
    ) as `0x2::accumulator_settlement::EventStreamHead`
    this.$typeArgs = typeArgs

    this.mmr = fields.mmr
    this.checkpointSeq = fields.checkpointSeq
    this.numEvents = fields.numEvents
  }

  static reified(): EventStreamHeadReified {
    const reifiedBcs = EventStreamHead.bcs
    return {
      typeName: EventStreamHead.$typeName,
      fullTypeName: composeSuiType(
        EventStreamHead.$typeName,
        ...[]
      ) as `0x2::accumulator_settlement::EventStreamHead`,
      typeArgs: [] as [],
      isPhantom: EventStreamHead.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => EventStreamHead.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => EventStreamHead.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => EventStreamHead.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => EventStreamHead.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => EventStreamHead.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => EventStreamHead.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => EventStreamHead.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => EventStreamHead.fetch(client, id),
      new: (fields: EventStreamHeadFields) => {
        return new EventStreamHead([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return EventStreamHead.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<EventStreamHead>> {
    return phantom(EventStreamHead.reified())
  }

  static get p() {
    return EventStreamHead.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('EventStreamHead', {
      mmr: bcs.vector(bcs.u256()),
      checkpoint_seq: bcs.u64(),
      num_events: bcs.u64(),
    })
  }

  private static cachedBcs: ReturnType<typeof EventStreamHead.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof EventStreamHead.instantiateBcs> {
    if (!EventStreamHead.cachedBcs) {
      EventStreamHead.cachedBcs = EventStreamHead.instantiateBcs()
    }
    return EventStreamHead.cachedBcs
  }

  static fromFields(fields: Record<string, any>): EventStreamHead {
    return EventStreamHead.reified().new({
      mmr: decodeFromFields(reified.vector('u256'), fields.mmr),
      checkpointSeq: decodeFromFields('u64', fields.checkpoint_seq),
      numEvents: decodeFromFields('u64', fields.num_events),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): EventStreamHead {
    if (!isEventStreamHead(item.type)) {
      throw new Error('not a EventStreamHead type')
    }

    return EventStreamHead.reified().new({
      mmr: decodeFromFieldsWithTypes(reified.vector('u256'), item.fields.mmr),
      checkpointSeq: decodeFromFieldsWithTypes('u64', item.fields.checkpoint_seq),
      numEvents: decodeFromFieldsWithTypes('u64', item.fields.num_events),
    })
  }

  static fromBcs(data: Uint8Array): EventStreamHead {
    return EventStreamHead.fromFields(EventStreamHead.bcs.parse(data))
  }

  toJSONField() {
    return {
      mmr: fieldToJSON<Vector<'u256'>>(`vector<u256>`, this.mmr),
      checkpointSeq: this.checkpointSeq.toString(),
      numEvents: this.numEvents.toString(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): EventStreamHead {
    return EventStreamHead.reified().new({
      mmr: decodeFromJSONField(reified.vector('u256'), field.mmr),
      checkpointSeq: decodeFromJSONField('u64', field.checkpointSeq),
      numEvents: decodeFromJSONField('u64', field.numEvents),
    })
  }

  static fromJSON(json: Record<string, any>): EventStreamHead {
    if (json.$typeName !== EventStreamHead.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return EventStreamHead.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): EventStreamHead {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isEventStreamHead(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a EventStreamHead object`)
    }
    return EventStreamHead.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): EventStreamHead {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isEventStreamHead(data.bcs.type)) {
        throw new Error(`object at is not a EventStreamHead object`)
      }

      return EventStreamHead.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return EventStreamHead.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<EventStreamHead> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching EventStreamHead object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isEventStreamHead(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a EventStreamHead object`)
    }

    return EventStreamHead.fromSuiObjectData(res.data)
  }
}
