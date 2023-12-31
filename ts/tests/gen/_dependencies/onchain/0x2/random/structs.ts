import { FieldsWithTypes, Type, compressSuiType, genericToJSON } from '../../../../_framework/util'
import { UID } from '../object/structs'
import { Versioned } from '../versioned/structs'
import { bcs } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== Random =============================== */

export function isRandom(type: Type): boolean {
  type = compressSuiType(type)
  return type === '0x2::random::Random'
}

export interface RandomFields {
  id: string
  inner: Versioned
}

export class Random {
  static readonly $typeName = '0x2::random::Random'
  static readonly $numTypeParams = 0

  static get bcs() {
    return bcs.struct('Random', {
      id: UID.bcs,
      inner: Versioned.bcs,
    })
  }

  readonly id: string
  readonly inner: Versioned

  constructor(fields: RandomFields) {
    this.id = fields.id
    this.inner = fields.inner
  }

  static fromFields(fields: Record<string, any>): Random {
    return new Random({
      id: UID.fromFields(fields.id).id,
      inner: Versioned.fromFields(fields.inner),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Random {
    if (!isRandom(item.type)) {
      throw new Error('not a Random type')
    }
    return new Random({
      id: item.fields.id.id,
      inner: Versioned.fromFieldsWithTypes(item.fields.inner),
    })
  }

  static fromBcs(data: Uint8Array): Random {
    return Random.fromFields(Random.bcs.parse(data))
  }

  toJSON() {
    return {
      id: this.id,
      inner: this.inner.toJSON(),
    }
  }

  static fromSuiParsedData(content: SuiParsedData) {
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

export function isRandomInner(type: Type): boolean {
  type = compressSuiType(type)
  return type === '0x2::random::RandomInner'
}

export interface RandomInnerFields {
  version: bigint
  epoch: bigint
  randomnessRound: bigint
  randomBytes: Array<number>
}

export class RandomInner {
  static readonly $typeName = '0x2::random::RandomInner'
  static readonly $numTypeParams = 0

  static get bcs() {
    return bcs.struct('RandomInner', {
      version: bcs.u64(),
      epoch: bcs.u64(),
      randomness_round: bcs.u64(),
      random_bytes: bcs.vector(bcs.u8()),
    })
  }

  readonly version: bigint
  readonly epoch: bigint
  readonly randomnessRound: bigint
  readonly randomBytes: Array<number>

  constructor(fields: RandomInnerFields) {
    this.version = fields.version
    this.epoch = fields.epoch
    this.randomnessRound = fields.randomnessRound
    this.randomBytes = fields.randomBytes
  }

  static fromFields(fields: Record<string, any>): RandomInner {
    return new RandomInner({
      version: BigInt(fields.version),
      epoch: BigInt(fields.epoch),
      randomnessRound: BigInt(fields.randomness_round),
      randomBytes: fields.random_bytes.map((item: any) => item),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): RandomInner {
    if (!isRandomInner(item.type)) {
      throw new Error('not a RandomInner type')
    }
    return new RandomInner({
      version: BigInt(item.fields.version),
      epoch: BigInt(item.fields.epoch),
      randomnessRound: BigInt(item.fields.randomness_round),
      randomBytes: item.fields.random_bytes.map((item: any) => item),
    })
  }

  static fromBcs(data: Uint8Array): RandomInner {
    return RandomInner.fromFields(RandomInner.bcs.parse(data))
  }

  toJSON() {
    return {
      version: this.version.toString(),
      epoch: this.epoch.toString(),
      randomnessRound: this.randomnessRound.toString(),
      randomBytes: genericToJSON(`vector<u8>`, this.randomBytes),
    }
  }
}
