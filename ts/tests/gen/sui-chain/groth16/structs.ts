import * as reified from '../../_framework/reified'
import {
  Reified,
  ToField,
  Vector,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  fieldToJSON,
} from '../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../_framework/util'
import { bcs } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== Curve =============================== */

export function isCurve(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x2::groth16::Curve'
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface CurveFields {
  id: ToField<'u8'>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Curve {
  static readonly $typeName = '0x2::groth16::Curve'
  static readonly $numTypeParams = 0

  readonly $fullTypeName = null as unknown as '0x2::groth16::Curve'

  readonly $typeName = Curve.$typeName

  static get bcs() {
    return bcs.struct('Curve', {
      id: bcs.u8(),
    })
  }

  readonly id: ToField<'u8'>

  private constructor(id: ToField<'u8'>) {
    this.id = id
  }

  static new(id: ToField<'u8'>): Curve {
    return new Curve(id)
  }

  static reified(): Reified<Curve> {
    return {
      typeName: Curve.$typeName,
      fullTypeName: composeSuiType(Curve.$typeName, ...[]) as '0x2::groth16::Curve',
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => Curve.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Curve.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => Curve.fromBcs(data),
      bcs: Curve.bcs,
      fromJSONField: (field: any) => Curve.fromJSONField(field),
      fetch: async (client: SuiClient, id: string) => Curve.fetch(client, id),
      kind: 'StructClassReified',
    }
  }

  static fromFields(fields: Record<string, any>): Curve {
    return Curve.new(decodeFromFields('u8', fields.id))
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Curve {
    if (!isCurve(item.type)) {
      throw new Error('not a Curve type')
    }

    return Curve.new(decodeFromFieldsWithTypes('u8', item.fields.id))
  }

  static fromBcs(data: Uint8Array): Curve {
    return Curve.fromFields(Curve.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, ...this.toJSONField() }
  }

  static fromJSONField(field: any): Curve {
    return Curve.new(decodeFromJSONField('u8', field.id))
  }

  static fromJSON(json: Record<string, any>): Curve {
    if (json.$typeName !== Curve.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return Curve.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): Curve {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isCurve(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Curve object`)
    }
    return Curve.fromFieldsWithTypes(content)
  }

  static async fetch(client: SuiClient, id: string): Promise<Curve> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching Curve object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isCurve(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a Curve object`)
    }
    return Curve.fromFieldsWithTypes(res.data.content)
  }
}

/* ============================== PreparedVerifyingKey =============================== */

export function isPreparedVerifyingKey(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x2::groth16::PreparedVerifyingKey'
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface PreparedVerifyingKeyFields {
  vkGammaAbcG1Bytes: ToField<Vector<'u8'>>
  alphaG1BetaG2Bytes: ToField<Vector<'u8'>>
  gammaG2NegPcBytes: ToField<Vector<'u8'>>
  deltaG2NegPcBytes: ToField<Vector<'u8'>>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class PreparedVerifyingKey {
  static readonly $typeName = '0x2::groth16::PreparedVerifyingKey'
  static readonly $numTypeParams = 0

  readonly $fullTypeName = null as unknown as '0x2::groth16::PreparedVerifyingKey'

  readonly $typeName = PreparedVerifyingKey.$typeName

  static get bcs() {
    return bcs.struct('PreparedVerifyingKey', {
      vk_gamma_abc_g1_bytes: bcs.vector(bcs.u8()),
      alpha_g1_beta_g2_bytes: bcs.vector(bcs.u8()),
      gamma_g2_neg_pc_bytes: bcs.vector(bcs.u8()),
      delta_g2_neg_pc_bytes: bcs.vector(bcs.u8()),
    })
  }

  readonly vkGammaAbcG1Bytes: ToField<Vector<'u8'>>
  readonly alphaG1BetaG2Bytes: ToField<Vector<'u8'>>
  readonly gammaG2NegPcBytes: ToField<Vector<'u8'>>
  readonly deltaG2NegPcBytes: ToField<Vector<'u8'>>

  private constructor(fields: PreparedVerifyingKeyFields) {
    this.vkGammaAbcG1Bytes = fields.vkGammaAbcG1Bytes
    this.alphaG1BetaG2Bytes = fields.alphaG1BetaG2Bytes
    this.gammaG2NegPcBytes = fields.gammaG2NegPcBytes
    this.deltaG2NegPcBytes = fields.deltaG2NegPcBytes
  }

  static new(fields: PreparedVerifyingKeyFields): PreparedVerifyingKey {
    return new PreparedVerifyingKey(fields)
  }

  static reified(): Reified<PreparedVerifyingKey> {
    return {
      typeName: PreparedVerifyingKey.$typeName,
      fullTypeName: composeSuiType(
        PreparedVerifyingKey.$typeName,
        ...[]
      ) as '0x2::groth16::PreparedVerifyingKey',
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => PreparedVerifyingKey.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        PreparedVerifyingKey.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => PreparedVerifyingKey.fromBcs(data),
      bcs: PreparedVerifyingKey.bcs,
      fromJSONField: (field: any) => PreparedVerifyingKey.fromJSONField(field),
      fetch: async (client: SuiClient, id: string) => PreparedVerifyingKey.fetch(client, id),
      kind: 'StructClassReified',
    }
  }

  static fromFields(fields: Record<string, any>): PreparedVerifyingKey {
    return PreparedVerifyingKey.new({
      vkGammaAbcG1Bytes: decodeFromFields(reified.vector('u8'), fields.vk_gamma_abc_g1_bytes),
      alphaG1BetaG2Bytes: decodeFromFields(reified.vector('u8'), fields.alpha_g1_beta_g2_bytes),
      gammaG2NegPcBytes: decodeFromFields(reified.vector('u8'), fields.gamma_g2_neg_pc_bytes),
      deltaG2NegPcBytes: decodeFromFields(reified.vector('u8'), fields.delta_g2_neg_pc_bytes),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): PreparedVerifyingKey {
    if (!isPreparedVerifyingKey(item.type)) {
      throw new Error('not a PreparedVerifyingKey type')
    }

    return PreparedVerifyingKey.new({
      vkGammaAbcG1Bytes: decodeFromFieldsWithTypes(
        reified.vector('u8'),
        item.fields.vk_gamma_abc_g1_bytes
      ),
      alphaG1BetaG2Bytes: decodeFromFieldsWithTypes(
        reified.vector('u8'),
        item.fields.alpha_g1_beta_g2_bytes
      ),
      gammaG2NegPcBytes: decodeFromFieldsWithTypes(
        reified.vector('u8'),
        item.fields.gamma_g2_neg_pc_bytes
      ),
      deltaG2NegPcBytes: decodeFromFieldsWithTypes(
        reified.vector('u8'),
        item.fields.delta_g2_neg_pc_bytes
      ),
    })
  }

  static fromBcs(data: Uint8Array): PreparedVerifyingKey {
    return PreparedVerifyingKey.fromFields(PreparedVerifyingKey.bcs.parse(data))
  }

  toJSONField() {
    return {
      vkGammaAbcG1Bytes: fieldToJSON<Vector<'u8'>>(`vector<u8>`, this.vkGammaAbcG1Bytes),
      alphaG1BetaG2Bytes: fieldToJSON<Vector<'u8'>>(`vector<u8>`, this.alphaG1BetaG2Bytes),
      gammaG2NegPcBytes: fieldToJSON<Vector<'u8'>>(`vector<u8>`, this.gammaG2NegPcBytes),
      deltaG2NegPcBytes: fieldToJSON<Vector<'u8'>>(`vector<u8>`, this.deltaG2NegPcBytes),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, ...this.toJSONField() }
  }

  static fromJSONField(field: any): PreparedVerifyingKey {
    return PreparedVerifyingKey.new({
      vkGammaAbcG1Bytes: decodeFromJSONField(reified.vector('u8'), field.vkGammaAbcG1Bytes),
      alphaG1BetaG2Bytes: decodeFromJSONField(reified.vector('u8'), field.alphaG1BetaG2Bytes),
      gammaG2NegPcBytes: decodeFromJSONField(reified.vector('u8'), field.gammaG2NegPcBytes),
      deltaG2NegPcBytes: decodeFromJSONField(reified.vector('u8'), field.deltaG2NegPcBytes),
    })
  }

  static fromJSON(json: Record<string, any>): PreparedVerifyingKey {
    if (json.$typeName !== PreparedVerifyingKey.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return PreparedVerifyingKey.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): PreparedVerifyingKey {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isPreparedVerifyingKey(content.type)) {
      throw new Error(
        `object at ${(content.fields as any).id} is not a PreparedVerifyingKey object`
      )
    }
    return PreparedVerifyingKey.fromFieldsWithTypes(content)
  }

  static async fetch(client: SuiClient, id: string): Promise<PreparedVerifyingKey> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching PreparedVerifyingKey object at id ${id}: ${res.error.code}`)
    }
    if (
      res.data?.content?.dataType !== 'moveObject' ||
      !isPreparedVerifyingKey(res.data.content.type)
    ) {
      throw new Error(`object at id ${id} is not a PreparedVerifyingKey object`)
    }
    return PreparedVerifyingKey.fromFieldsWithTypes(res.data.content)
  }
}

/* ============================== PublicProofInputs =============================== */

export function isPublicProofInputs(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x2::groth16::PublicProofInputs'
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface PublicProofInputsFields {
  bytes: ToField<Vector<'u8'>>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class PublicProofInputs {
  static readonly $typeName = '0x2::groth16::PublicProofInputs'
  static readonly $numTypeParams = 0

  readonly $fullTypeName = null as unknown as '0x2::groth16::PublicProofInputs'

  readonly $typeName = PublicProofInputs.$typeName

  static get bcs() {
    return bcs.struct('PublicProofInputs', {
      bytes: bcs.vector(bcs.u8()),
    })
  }

  readonly bytes: ToField<Vector<'u8'>>

  private constructor(bytes: ToField<Vector<'u8'>>) {
    this.bytes = bytes
  }

  static new(bytes: ToField<Vector<'u8'>>): PublicProofInputs {
    return new PublicProofInputs(bytes)
  }

  static reified(): Reified<PublicProofInputs> {
    return {
      typeName: PublicProofInputs.$typeName,
      fullTypeName: composeSuiType(
        PublicProofInputs.$typeName,
        ...[]
      ) as '0x2::groth16::PublicProofInputs',
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => PublicProofInputs.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => PublicProofInputs.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => PublicProofInputs.fromBcs(data),
      bcs: PublicProofInputs.bcs,
      fromJSONField: (field: any) => PublicProofInputs.fromJSONField(field),
      fetch: async (client: SuiClient, id: string) => PublicProofInputs.fetch(client, id),
      kind: 'StructClassReified',
    }
  }

  static fromFields(fields: Record<string, any>): PublicProofInputs {
    return PublicProofInputs.new(decodeFromFields(reified.vector('u8'), fields.bytes))
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): PublicProofInputs {
    if (!isPublicProofInputs(item.type)) {
      throw new Error('not a PublicProofInputs type')
    }

    return PublicProofInputs.new(decodeFromFieldsWithTypes(reified.vector('u8'), item.fields.bytes))
  }

  static fromBcs(data: Uint8Array): PublicProofInputs {
    return PublicProofInputs.fromFields(PublicProofInputs.bcs.parse(data))
  }

  toJSONField() {
    return {
      bytes: fieldToJSON<Vector<'u8'>>(`vector<u8>`, this.bytes),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, ...this.toJSONField() }
  }

  static fromJSONField(field: any): PublicProofInputs {
    return PublicProofInputs.new(decodeFromJSONField(reified.vector('u8'), field.bytes))
  }

  static fromJSON(json: Record<string, any>): PublicProofInputs {
    if (json.$typeName !== PublicProofInputs.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return PublicProofInputs.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): PublicProofInputs {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isPublicProofInputs(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a PublicProofInputs object`)
    }
    return PublicProofInputs.fromFieldsWithTypes(content)
  }

  static async fetch(client: SuiClient, id: string): Promise<PublicProofInputs> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching PublicProofInputs object at id ${id}: ${res.error.code}`)
    }
    if (
      res.data?.content?.dataType !== 'moveObject' ||
      !isPublicProofInputs(res.data.content.type)
    ) {
      throw new Error(`object at id ${id} is not a PublicProofInputs object`)
    }
    return PublicProofInputs.fromFieldsWithTypes(res.data.content)
  }
}

/* ============================== ProofPoints =============================== */

export function isProofPoints(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x2::groth16::ProofPoints'
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface ProofPointsFields {
  bytes: ToField<Vector<'u8'>>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class ProofPoints {
  static readonly $typeName = '0x2::groth16::ProofPoints'
  static readonly $numTypeParams = 0

  readonly $fullTypeName = null as unknown as '0x2::groth16::ProofPoints'

  readonly $typeName = ProofPoints.$typeName

  static get bcs() {
    return bcs.struct('ProofPoints', {
      bytes: bcs.vector(bcs.u8()),
    })
  }

  readonly bytes: ToField<Vector<'u8'>>

  private constructor(bytes: ToField<Vector<'u8'>>) {
    this.bytes = bytes
  }

  static new(bytes: ToField<Vector<'u8'>>): ProofPoints {
    return new ProofPoints(bytes)
  }

  static reified(): Reified<ProofPoints> {
    return {
      typeName: ProofPoints.$typeName,
      fullTypeName: composeSuiType(ProofPoints.$typeName, ...[]) as '0x2::groth16::ProofPoints',
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => ProofPoints.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => ProofPoints.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => ProofPoints.fromBcs(data),
      bcs: ProofPoints.bcs,
      fromJSONField: (field: any) => ProofPoints.fromJSONField(field),
      fetch: async (client: SuiClient, id: string) => ProofPoints.fetch(client, id),
      kind: 'StructClassReified',
    }
  }

  static fromFields(fields: Record<string, any>): ProofPoints {
    return ProofPoints.new(decodeFromFields(reified.vector('u8'), fields.bytes))
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): ProofPoints {
    if (!isProofPoints(item.type)) {
      throw new Error('not a ProofPoints type')
    }

    return ProofPoints.new(decodeFromFieldsWithTypes(reified.vector('u8'), item.fields.bytes))
  }

  static fromBcs(data: Uint8Array): ProofPoints {
    return ProofPoints.fromFields(ProofPoints.bcs.parse(data))
  }

  toJSONField() {
    return {
      bytes: fieldToJSON<Vector<'u8'>>(`vector<u8>`, this.bytes),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, ...this.toJSONField() }
  }

  static fromJSONField(field: any): ProofPoints {
    return ProofPoints.new(decodeFromJSONField(reified.vector('u8'), field.bytes))
  }

  static fromJSON(json: Record<string, any>): ProofPoints {
    if (json.$typeName !== ProofPoints.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return ProofPoints.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): ProofPoints {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isProofPoints(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a ProofPoints object`)
    }
    return ProofPoints.fromFieldsWithTypes(content)
  }

  static async fetch(client: SuiClient, id: string): Promise<ProofPoints> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching ProofPoints object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isProofPoints(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a ProofPoints object`)
    }
    return ProofPoints.fromFieldsWithTypes(res.data.content)
  }
}
