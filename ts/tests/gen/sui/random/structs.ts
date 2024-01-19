import * as reified from '../../_framework/reified'
import {
  ToField,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  fieldToJSON,
} from '../../_framework/reified'
import { FieldsWithTypes, compressSuiType } from '../../_framework/util'
import { UID } from '../object/structs'
import { Versioned } from '../versioned/structs'
import { bcs } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== Random =============================== */

export function isRandom(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x2::random::Random'
}

export interface RandomFields {
  id: ToField<UID>
  inner: ToField<Versioned>
}

export class Random {
  static readonly $typeName = '0x2::random::Random'
  static readonly $numTypeParams = 0

  readonly $typeName = Random.$typeName

  static get bcs() {
    return bcs.struct('Random', {
      id: UID.bcs,
      inner: Versioned.bcs,
    })
  }

  readonly id: ToField<UID>
  readonly inner: ToField<Versioned>

  private constructor(fields: RandomFields) {
    this.id = fields.id
    this.inner = fields.inner
  }

  static new(fields: RandomFields): Random {
    return new Random(fields)
  }

  static reified() {
    return {
      typeName: Random.$typeName,
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => Random.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Random.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => Random.fromBcs(data),
      bcs: Random.bcs,
      fromJSONField: (field: any) => Random.fromJSONField(field),
      __class: null as unknown as ReturnType<typeof Random.new>,
    }
  }

  static fromFields(fields: Record<string, any>): Random {
    return Random.new({
      id: decodeFromFields(UID.reified(), fields.id),
      inner: decodeFromFields(Versioned.reified(), fields.inner),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Random {
    if (!isRandom(item.type)) {
      throw new Error('not a Random type')
    }

    return Random.new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      inner: decodeFromFieldsWithTypes(Versioned.reified(), item.fields.inner),
    })
  }

  static fromBcs(data: Uint8Array): Random {
    return Random.fromFields(Random.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
      inner: this.inner.toJSONField(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, ...this.toJSONField() }
  }

  static fromJSONField(field: any): Random {
    return Random.new({
      id: decodeFromJSONField(UID.reified(), field.id),
      inner: decodeFromJSONField(Versioned.reified(), field.inner),
    })
  }

  static fromJSON(json: Record<string, any>): Random {
    if (json.$typeName !== Random.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return Random.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): Random {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isRandom(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Random object`)
    }
    return Random.fromFieldsWithTypes(content)
  }

  static async fetch(client: SuiClient, id: string): Promise<Random> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching Random object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isRandom(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a Random object`)
    }
    return Random.fromFieldsWithTypes(res.data.content)
  }
}

/* ============================== RandomInner =============================== */

export function isRandomInner(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x2::random::RandomInner'
}

export interface RandomInnerFields {
  version: ToField<'u64'>
  epoch: ToField<'u64'>
  randomnessRound: ToField<'u64'>
  randomBytes: Array<ToField<'u8'>>
}

export class RandomInner {
  static readonly $typeName = '0x2::random::RandomInner'
  static readonly $numTypeParams = 0

  readonly $typeName = RandomInner.$typeName

  static get bcs() {
    return bcs.struct('RandomInner', {
      version: bcs.u64(),
      epoch: bcs.u64(),
      randomness_round: bcs.u64(),
      random_bytes: bcs.vector(bcs.u8()),
    })
  }

  readonly version: ToField<'u64'>
  readonly epoch: ToField<'u64'>
  readonly randomnessRound: ToField<'u64'>
  readonly randomBytes: Array<ToField<'u8'>>

  private constructor(fields: RandomInnerFields) {
    this.version = fields.version
    this.epoch = fields.epoch
    this.randomnessRound = fields.randomnessRound
    this.randomBytes = fields.randomBytes
  }

  static new(fields: RandomInnerFields): RandomInner {
    return new RandomInner(fields)
  }

  static reified() {
    return {
      typeName: RandomInner.$typeName,
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => RandomInner.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => RandomInner.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => RandomInner.fromBcs(data),
      bcs: RandomInner.bcs,
      fromJSONField: (field: any) => RandomInner.fromJSONField(field),
      __class: null as unknown as ReturnType<typeof RandomInner.new>,
    }
  }

  static fromFields(fields: Record<string, any>): RandomInner {
    return RandomInner.new({
      version: decodeFromFields('u64', fields.version),
      epoch: decodeFromFields('u64', fields.epoch),
      randomnessRound: decodeFromFields('u64', fields.randomness_round),
      randomBytes: decodeFromFields(reified.vector('u8'), fields.random_bytes),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): RandomInner {
    if (!isRandomInner(item.type)) {
      throw new Error('not a RandomInner type')
    }

    return RandomInner.new({
      version: decodeFromFieldsWithTypes('u64', item.fields.version),
      epoch: decodeFromFieldsWithTypes('u64', item.fields.epoch),
      randomnessRound: decodeFromFieldsWithTypes('u64', item.fields.randomness_round),
      randomBytes: decodeFromFieldsWithTypes(reified.vector('u8'), item.fields.random_bytes),
    })
  }

  static fromBcs(data: Uint8Array): RandomInner {
    return RandomInner.fromFields(RandomInner.bcs.parse(data))
  }

  toJSONField() {
    return {
      version: this.version.toString(),
      epoch: this.epoch.toString(),
      randomnessRound: this.randomnessRound.toString(),
      randomBytes: fieldToJSON<Array<'u8'>>(`vector<u8>`, this.randomBytes),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, ...this.toJSONField() }
  }

  static fromJSONField(field: any): RandomInner {
    return RandomInner.new({
      version: decodeFromJSONField('u64', field.version),
      epoch: decodeFromJSONField('u64', field.epoch),
      randomnessRound: decodeFromJSONField('u64', field.randomnessRound),
      randomBytes: decodeFromJSONField(reified.vector('u8'), field.randomBytes),
    })
  }

  static fromJSON(json: Record<string, any>): RandomInner {
    if (json.$typeName !== RandomInner.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return RandomInner.fromJSONField(json)
  }
}
