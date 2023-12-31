import { FieldsWithTypes, Type, compressSuiType, genericToJSON } from '../../_framework/util'
import { bcs } from '@mysten/bcs'

/* ============================== Curve =============================== */

export function isCurve(type: Type): boolean {
  type = compressSuiType(type)
  return type === '0x2::groth16::Curve'
}

export interface CurveFields {
  id: number
}

export class Curve {
  static readonly $typeName = '0x2::groth16::Curve'
  static readonly $numTypeParams = 0

  static get bcs() {
    return bcs.struct('Curve', {
      id: bcs.u8(),
    })
  }

  readonly id: number

  constructor(id: number) {
    this.id = id
  }

  static fromFields(fields: Record<string, any>): Curve {
    return new Curve(fields.id)
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Curve {
    if (!isCurve(item.type)) {
      throw new Error('not a Curve type')
    }
    return new Curve(item.fields.id)
  }

  static fromBcs(data: Uint8Array): Curve {
    return Curve.fromFields(Curve.bcs.parse(data))
  }

  toJSON() {
    return {
      id: this.id,
    }
  }
}

/* ============================== PreparedVerifyingKey =============================== */

export function isPreparedVerifyingKey(type: Type): boolean {
  type = compressSuiType(type)
  return type === '0x2::groth16::PreparedVerifyingKey'
}

export interface PreparedVerifyingKeyFields {
  vkGammaAbcG1Bytes: Array<number>
  alphaG1BetaG2Bytes: Array<number>
  gammaG2NegPcBytes: Array<number>
  deltaG2NegPcBytes: Array<number>
}

export class PreparedVerifyingKey {
  static readonly $typeName = '0x2::groth16::PreparedVerifyingKey'
  static readonly $numTypeParams = 0

  static get bcs() {
    return bcs.struct('PreparedVerifyingKey', {
      vk_gamma_abc_g1_bytes: bcs.vector(bcs.u8()),
      alpha_g1_beta_g2_bytes: bcs.vector(bcs.u8()),
      gamma_g2_neg_pc_bytes: bcs.vector(bcs.u8()),
      delta_g2_neg_pc_bytes: bcs.vector(bcs.u8()),
    })
  }

  readonly vkGammaAbcG1Bytes: Array<number>
  readonly alphaG1BetaG2Bytes: Array<number>
  readonly gammaG2NegPcBytes: Array<number>
  readonly deltaG2NegPcBytes: Array<number>

  constructor(fields: PreparedVerifyingKeyFields) {
    this.vkGammaAbcG1Bytes = fields.vkGammaAbcG1Bytes
    this.alphaG1BetaG2Bytes = fields.alphaG1BetaG2Bytes
    this.gammaG2NegPcBytes = fields.gammaG2NegPcBytes
    this.deltaG2NegPcBytes = fields.deltaG2NegPcBytes
  }

  static fromFields(fields: Record<string, any>): PreparedVerifyingKey {
    return new PreparedVerifyingKey({
      vkGammaAbcG1Bytes: fields.vk_gamma_abc_g1_bytes.map((item: any) => item),
      alphaG1BetaG2Bytes: fields.alpha_g1_beta_g2_bytes.map((item: any) => item),
      gammaG2NegPcBytes: fields.gamma_g2_neg_pc_bytes.map((item: any) => item),
      deltaG2NegPcBytes: fields.delta_g2_neg_pc_bytes.map((item: any) => item),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): PreparedVerifyingKey {
    if (!isPreparedVerifyingKey(item.type)) {
      throw new Error('not a PreparedVerifyingKey type')
    }
    return new PreparedVerifyingKey({
      vkGammaAbcG1Bytes: item.fields.vk_gamma_abc_g1_bytes.map((item: any) => item),
      alphaG1BetaG2Bytes: item.fields.alpha_g1_beta_g2_bytes.map((item: any) => item),
      gammaG2NegPcBytes: item.fields.gamma_g2_neg_pc_bytes.map((item: any) => item),
      deltaG2NegPcBytes: item.fields.delta_g2_neg_pc_bytes.map((item: any) => item),
    })
  }

  static fromBcs(data: Uint8Array): PreparedVerifyingKey {
    return PreparedVerifyingKey.fromFields(PreparedVerifyingKey.bcs.parse(data))
  }

  toJSON() {
    return {
      vkGammaAbcG1Bytes: genericToJSON(`vector<u8>`, this.vkGammaAbcG1Bytes),
      alphaG1BetaG2Bytes: genericToJSON(`vector<u8>`, this.alphaG1BetaG2Bytes),
      gammaG2NegPcBytes: genericToJSON(`vector<u8>`, this.gammaG2NegPcBytes),
      deltaG2NegPcBytes: genericToJSON(`vector<u8>`, this.deltaG2NegPcBytes),
    }
  }
}

/* ============================== ProofPoints =============================== */

export function isProofPoints(type: Type): boolean {
  type = compressSuiType(type)
  return type === '0x2::groth16::ProofPoints'
}

export interface ProofPointsFields {
  bytes: Array<number>
}

export class ProofPoints {
  static readonly $typeName = '0x2::groth16::ProofPoints'
  static readonly $numTypeParams = 0

  static get bcs() {
    return bcs.struct('ProofPoints', {
      bytes: bcs.vector(bcs.u8()),
    })
  }

  readonly bytes: Array<number>

  constructor(bytes: Array<number>) {
    this.bytes = bytes
  }

  static fromFields(fields: Record<string, any>): ProofPoints {
    return new ProofPoints(fields.bytes.map((item: any) => item))
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): ProofPoints {
    if (!isProofPoints(item.type)) {
      throw new Error('not a ProofPoints type')
    }
    return new ProofPoints(item.fields.bytes.map((item: any) => item))
  }

  static fromBcs(data: Uint8Array): ProofPoints {
    return ProofPoints.fromFields(ProofPoints.bcs.parse(data))
  }

  toJSON() {
    return {
      bytes: genericToJSON(`vector<u8>`, this.bytes),
    }
  }
}

/* ============================== PublicProofInputs =============================== */

export function isPublicProofInputs(type: Type): boolean {
  type = compressSuiType(type)
  return type === '0x2::groth16::PublicProofInputs'
}

export interface PublicProofInputsFields {
  bytes: Array<number>
}

export class PublicProofInputs {
  static readonly $typeName = '0x2::groth16::PublicProofInputs'
  static readonly $numTypeParams = 0

  static get bcs() {
    return bcs.struct('PublicProofInputs', {
      bytes: bcs.vector(bcs.u8()),
    })
  }

  readonly bytes: Array<number>

  constructor(bytes: Array<number>) {
    this.bytes = bytes
  }

  static fromFields(fields: Record<string, any>): PublicProofInputs {
    return new PublicProofInputs(fields.bytes.map((item: any) => item))
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): PublicProofInputs {
    if (!isPublicProofInputs(item.type)) {
      throw new Error('not a PublicProofInputs type')
    }
    return new PublicProofInputs(item.fields.bytes.map((item: any) => item))
  }

  static fromBcs(data: Uint8Array): PublicProofInputs {
    return PublicProofInputs.fromFields(PublicProofInputs.bcs.parse(data))
  }

  toJSON() {
    return {
      bytes: genericToJSON(`vector<u8>`, this.bytes),
    }
  }
}
