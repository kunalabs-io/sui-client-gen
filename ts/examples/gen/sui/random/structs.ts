/** This module provides functionality for generating secure randomness. */

import { bcs } from '@mysten/sui/bcs'
import { SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromBase64 } from '@mysten/sui/utils'
import {
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  fieldToJSON,
  phantom,
  PhantomReified,
  Reified,
  StructClass,
  ToField,
  ToJSON,
  ToTypeStr,
  vector,
} from '../../_framework/reified'
import {
  composeSuiType,
  compressSuiType,
  fetchObjectBcs,
  FieldsWithTypes,
  SupportedSuiClient,
} from '../../_framework/util'
import { Vector } from '../../_framework/vector'
import { UID } from '../object/structs'
import { Versioned } from '../versioned/structs'

/* ============================== Random =============================== */

export function isRandom(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::random::Random`
}

export interface RandomFields {
  id: ToField<UID>
  inner: ToField<Versioned>
}

export type RandomReified = Reified<Random, RandomFields>

export type RandomJSONField = {
  id: string
  inner: ToJSON<Versioned>
}

export type RandomJSON = {
  $typeName: typeof Random.$typeName
  $typeArgs: []
} & RandomJSONField

/**
 * Singleton shared object which stores the global randomness state.
 * The actual state is stored in a versioned inner field.
 */
export class Random implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::random::Random` = `0x2::random::Random` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName: typeof Random.$typeName = Random.$typeName
  readonly $fullTypeName: `0x2::random::Random`
  readonly $typeArgs: []
  readonly $isPhantom: typeof Random.$isPhantom = Random.$isPhantom

  readonly id: ToField<UID>
  readonly inner: ToField<Versioned>

  private constructor(typeArgs: [], fields: RandomFields) {
    this.$fullTypeName = composeSuiType(
      Random.$typeName,
      ...typeArgs,
    ) as `0x2::random::Random`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.inner = fields.inner
  }

  static reified(): RandomReified {
    const reifiedBcs = Random.bcs
    return {
      typeName: Random.$typeName,
      fullTypeName: composeSuiType(
        Random.$typeName,
        ...[],
      ) as `0x2::random::Random`,
      typeArgs: [] as [],
      isPhantom: Random.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => Random.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Random.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => Random.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => Random.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => Random.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => Random.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => Random.fromSuiObjectData(content),
      fetch: async (client: SupportedSuiClient, id: string) => Random.fetch(client, id),
      new: (fields: RandomFields) => {
        return new Random([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): RandomReified {
    return Random.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<Random>> {
    return phantom(Random.reified())
  }

  static get p(): PhantomReified<ToTypeStr<Random>> {
    return Random.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('Random', {
      id: UID.bcs,
      inner: Versioned.bcs,
    })
  }

  private static cachedBcs: ReturnType<typeof Random.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof Random.instantiateBcs> {
    if (!Random.cachedBcs) {
      Random.cachedBcs = Random.instantiateBcs()
    }
    return Random.cachedBcs
  }

  static fromFields(fields: Record<string, any>): Random {
    return Random.reified().new({
      id: decodeFromFields(UID.reified(), fields.id),
      inner: decodeFromFields(Versioned.reified(), fields.inner),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Random {
    if (!isRandom(item.type)) {
      throw new Error('not a Random type')
    }

    return Random.reified().new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      inner: decodeFromFieldsWithTypes(Versioned.reified(), item.fields.inner),
    })
  }

  static fromBcs(data: Uint8Array): Random {
    return Random.fromFields(Random.bcs.parse(data))
  }

  toJSONField(): RandomJSONField {
    return {
      id: this.id,
      inner: this.inner.toJSONField(),
    }
  }

  toJSON(): RandomJSON {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): Random {
    return Random.reified().new({
      id: decodeFromJSONField(UID.reified(), field.id),
      inner: decodeFromJSONField(Versioned.reified(), field.inner),
    })
  }

  static fromJSON(json: Record<string, any>): Random {
    if (json.$typeName !== Random.$typeName) {
      throw new Error(
        `not a Random json object: expected '${Random.$typeName}' but got '${json.$typeName}'`,
      )
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

  static fromSuiObjectData(data: SuiObjectData): Random {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isRandom(data.bcs.type)) {
        throw new Error(`object at is not a Random object`)
      }

      return Random.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Random.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.',
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<Random> {
    const res = await fetchObjectBcs(client, id)
    if (!isRandom(res.type)) {
      throw new Error(`object at id ${id} is not a Random object`)
    }

    return Random.fromBcs(res.bcsBytes)
  }
}

/* ============================== RandomInner =============================== */

export function isRandomInner(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::random::RandomInner`
}

export interface RandomInnerFields {
  version: ToField<'u64'>
  epoch: ToField<'u64'>
  randomnessRound: ToField<'u64'>
  randomBytes: ToField<Vector<'u8'>>
}

export type RandomInnerReified = Reified<RandomInner, RandomInnerFields>

export type RandomInnerJSONField = {
  version: string
  epoch: string
  randomnessRound: string
  randomBytes: number[]
}

export type RandomInnerJSON = {
  $typeName: typeof RandomInner.$typeName
  $typeArgs: []
} & RandomInnerJSONField

export class RandomInner implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::random::RandomInner` = `0x2::random::RandomInner` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName: typeof RandomInner.$typeName = RandomInner.$typeName
  readonly $fullTypeName: `0x2::random::RandomInner`
  readonly $typeArgs: []
  readonly $isPhantom: typeof RandomInner.$isPhantom = RandomInner.$isPhantom

  readonly version: ToField<'u64'>
  readonly epoch: ToField<'u64'>
  readonly randomnessRound: ToField<'u64'>
  readonly randomBytes: ToField<Vector<'u8'>>

  private constructor(typeArgs: [], fields: RandomInnerFields) {
    this.$fullTypeName = composeSuiType(
      RandomInner.$typeName,
      ...typeArgs,
    ) as `0x2::random::RandomInner`
    this.$typeArgs = typeArgs

    this.version = fields.version
    this.epoch = fields.epoch
    this.randomnessRound = fields.randomnessRound
    this.randomBytes = fields.randomBytes
  }

  static reified(): RandomInnerReified {
    const reifiedBcs = RandomInner.bcs
    return {
      typeName: RandomInner.$typeName,
      fullTypeName: composeSuiType(
        RandomInner.$typeName,
        ...[],
      ) as `0x2::random::RandomInner`,
      typeArgs: [] as [],
      isPhantom: RandomInner.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => RandomInner.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => RandomInner.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => RandomInner.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => RandomInner.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => RandomInner.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => RandomInner.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => RandomInner.fromSuiObjectData(content),
      fetch: async (client: SupportedSuiClient, id: string) => RandomInner.fetch(client, id),
      new: (fields: RandomInnerFields) => {
        return new RandomInner([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): RandomInnerReified {
    return RandomInner.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<RandomInner>> {
    return phantom(RandomInner.reified())
  }

  static get p(): PhantomReified<ToTypeStr<RandomInner>> {
    return RandomInner.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('RandomInner', {
      version: bcs.u64(),
      epoch: bcs.u64(),
      randomness_round: bcs.u64(),
      random_bytes: bcs.vector(bcs.u8()),
    })
  }

  private static cachedBcs: ReturnType<typeof RandomInner.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof RandomInner.instantiateBcs> {
    if (!RandomInner.cachedBcs) {
      RandomInner.cachedBcs = RandomInner.instantiateBcs()
    }
    return RandomInner.cachedBcs
  }

  static fromFields(fields: Record<string, any>): RandomInner {
    return RandomInner.reified().new({
      version: decodeFromFields('u64', fields.version),
      epoch: decodeFromFields('u64', fields.epoch),
      randomnessRound: decodeFromFields('u64', fields.randomness_round),
      randomBytes: decodeFromFields(vector('u8'), fields.random_bytes),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): RandomInner {
    if (!isRandomInner(item.type)) {
      throw new Error('not a RandomInner type')
    }

    return RandomInner.reified().new({
      version: decodeFromFieldsWithTypes('u64', item.fields.version),
      epoch: decodeFromFieldsWithTypes('u64', item.fields.epoch),
      randomnessRound: decodeFromFieldsWithTypes('u64', item.fields.randomness_round),
      randomBytes: decodeFromFieldsWithTypes(vector('u8'), item.fields.random_bytes),
    })
  }

  static fromBcs(data: Uint8Array): RandomInner {
    return RandomInner.fromFields(RandomInner.bcs.parse(data))
  }

  toJSONField(): RandomInnerJSONField {
    return {
      version: this.version.toString(),
      epoch: this.epoch.toString(),
      randomnessRound: this.randomnessRound.toString(),
      randomBytes: fieldToJSON<Vector<'u8'>>(`vector<u8>`, this.randomBytes),
    }
  }

  toJSON(): RandomInnerJSON {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): RandomInner {
    return RandomInner.reified().new({
      version: decodeFromJSONField('u64', field.version),
      epoch: decodeFromJSONField('u64', field.epoch),
      randomnessRound: decodeFromJSONField('u64', field.randomnessRound),
      randomBytes: decodeFromJSONField(vector('u8'), field.randomBytes),
    })
  }

  static fromJSON(json: Record<string, any>): RandomInner {
    if (json.$typeName !== RandomInner.$typeName) {
      throw new Error(
        `not a RandomInner json object: expected '${RandomInner.$typeName}' but got '${json.$typeName}'`,
      )
    }

    return RandomInner.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): RandomInner {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isRandomInner(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a RandomInner object`)
    }
    return RandomInner.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): RandomInner {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isRandomInner(data.bcs.type)) {
        throw new Error(`object at is not a RandomInner object`)
      }

      return RandomInner.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return RandomInner.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.',
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<RandomInner> {
    const res = await fetchObjectBcs(client, id)
    if (!isRandomInner(res.type)) {
      throw new Error(`object at id ${id} is not a RandomInner object`)
    }

    return RandomInner.fromBcs(res.bcsBytes)
  }
}

/* ============================== RandomGenerator =============================== */

export function isRandomGenerator(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::random::RandomGenerator`
}

export interface RandomGeneratorFields {
  seed: ToField<Vector<'u8'>>
  counter: ToField<'u16'>
  buffer: ToField<Vector<'u8'>>
}

export type RandomGeneratorReified = Reified<RandomGenerator, RandomGeneratorFields>

export type RandomGeneratorJSONField = {
  seed: number[]
  counter: number
  buffer: number[]
}

export type RandomGeneratorJSON = {
  $typeName: typeof RandomGenerator.$typeName
  $typeArgs: []
} & RandomGeneratorJSONField

/** Unique randomness generator, derived from the global randomness. */
export class RandomGenerator implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::random::RandomGenerator` =
    `0x2::random::RandomGenerator` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName: typeof RandomGenerator.$typeName = RandomGenerator.$typeName
  readonly $fullTypeName: `0x2::random::RandomGenerator`
  readonly $typeArgs: []
  readonly $isPhantom: typeof RandomGenerator.$isPhantom = RandomGenerator.$isPhantom

  readonly seed: ToField<Vector<'u8'>>
  readonly counter: ToField<'u16'>
  readonly buffer: ToField<Vector<'u8'>>

  private constructor(typeArgs: [], fields: RandomGeneratorFields) {
    this.$fullTypeName = composeSuiType(
      RandomGenerator.$typeName,
      ...typeArgs,
    ) as `0x2::random::RandomGenerator`
    this.$typeArgs = typeArgs

    this.seed = fields.seed
    this.counter = fields.counter
    this.buffer = fields.buffer
  }

  static reified(): RandomGeneratorReified {
    const reifiedBcs = RandomGenerator.bcs
    return {
      typeName: RandomGenerator.$typeName,
      fullTypeName: composeSuiType(
        RandomGenerator.$typeName,
        ...[],
      ) as `0x2::random::RandomGenerator`,
      typeArgs: [] as [],
      isPhantom: RandomGenerator.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => RandomGenerator.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => RandomGenerator.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => RandomGenerator.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => RandomGenerator.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => RandomGenerator.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => RandomGenerator.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => RandomGenerator.fromSuiObjectData(content),
      fetch: async (client: SupportedSuiClient, id: string) => RandomGenerator.fetch(client, id),
      new: (fields: RandomGeneratorFields) => {
        return new RandomGenerator([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): RandomGeneratorReified {
    return RandomGenerator.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<RandomGenerator>> {
    return phantom(RandomGenerator.reified())
  }

  static get p(): PhantomReified<ToTypeStr<RandomGenerator>> {
    return RandomGenerator.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('RandomGenerator', {
      seed: bcs.vector(bcs.u8()),
      counter: bcs.u16(),
      buffer: bcs.vector(bcs.u8()),
    })
  }

  private static cachedBcs: ReturnType<typeof RandomGenerator.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof RandomGenerator.instantiateBcs> {
    if (!RandomGenerator.cachedBcs) {
      RandomGenerator.cachedBcs = RandomGenerator.instantiateBcs()
    }
    return RandomGenerator.cachedBcs
  }

  static fromFields(fields: Record<string, any>): RandomGenerator {
    return RandomGenerator.reified().new({
      seed: decodeFromFields(vector('u8'), fields.seed),
      counter: decodeFromFields('u16', fields.counter),
      buffer: decodeFromFields(vector('u8'), fields.buffer),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): RandomGenerator {
    if (!isRandomGenerator(item.type)) {
      throw new Error('not a RandomGenerator type')
    }

    return RandomGenerator.reified().new({
      seed: decodeFromFieldsWithTypes(vector('u8'), item.fields.seed),
      counter: decodeFromFieldsWithTypes('u16', item.fields.counter),
      buffer: decodeFromFieldsWithTypes(vector('u8'), item.fields.buffer),
    })
  }

  static fromBcs(data: Uint8Array): RandomGenerator {
    return RandomGenerator.fromFields(RandomGenerator.bcs.parse(data))
  }

  toJSONField(): RandomGeneratorJSONField {
    return {
      seed: fieldToJSON<Vector<'u8'>>(`vector<u8>`, this.seed),
      counter: this.counter,
      buffer: fieldToJSON<Vector<'u8'>>(`vector<u8>`, this.buffer),
    }
  }

  toJSON(): RandomGeneratorJSON {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): RandomGenerator {
    return RandomGenerator.reified().new({
      seed: decodeFromJSONField(vector('u8'), field.seed),
      counter: decodeFromJSONField('u16', field.counter),
      buffer: decodeFromJSONField(vector('u8'), field.buffer),
    })
  }

  static fromJSON(json: Record<string, any>): RandomGenerator {
    if (json.$typeName !== RandomGenerator.$typeName) {
      throw new Error(
        `not a RandomGenerator json object: expected '${RandomGenerator.$typeName}' but got '${json.$typeName}'`,
      )
    }

    return RandomGenerator.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): RandomGenerator {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isRandomGenerator(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a RandomGenerator object`)
    }
    return RandomGenerator.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): RandomGenerator {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isRandomGenerator(data.bcs.type)) {
        throw new Error(`object at is not a RandomGenerator object`)
      }

      return RandomGenerator.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return RandomGenerator.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.',
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<RandomGenerator> {
    const res = await fetchObjectBcs(client, id)
    if (!isRandomGenerator(res.type)) {
      throw new Error(`object at id ${id} is not a RandomGenerator object`)
    }

    return RandomGenerator.fromBcs(res.bcsBytes)
  }
}
