import { Encoding, bcsSource as bcs } from '../../_framework/bcs'
import { FieldsWithTypes, Type, compressSuiType } from '../../_framework/util'

/* ============================== Curve =============================== */

bcs.registerStructType('0x2::groth16::Curve', {
  id: `u8`,
})

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

  static fromBcs(data: Uint8Array | string, encoding?: Encoding): Curve {
    return Curve.fromFields(bcs.de([Curve.$typeName], data, encoding))
  }
}

/* ============================== PreparedVerifyingKey =============================== */

bcs.registerStructType('0x2::groth16::PreparedVerifyingKey', {
  vk_gamma_abc_g1_bytes: `vector<u8>`,
  alpha_g1_beta_g2_bytes: `vector<u8>`,
  gamma_g2_neg_pc_bytes: `vector<u8>`,
  delta_g2_neg_pc_bytes: `vector<u8>`,
})

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

  static fromBcs(data: Uint8Array | string, encoding?: Encoding): PreparedVerifyingKey {
    return PreparedVerifyingKey.fromFields(bcs.de([PreparedVerifyingKey.$typeName], data, encoding))
  }
}

/* ============================== ProofPoints =============================== */

bcs.registerStructType('0x2::groth16::ProofPoints', {
  bytes: `vector<u8>`,
})

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

  static fromBcs(data: Uint8Array | string, encoding?: Encoding): ProofPoints {
    return ProofPoints.fromFields(bcs.de([ProofPoints.$typeName], data, encoding))
  }
}

/* ============================== PublicProofInputs =============================== */

bcs.registerStructType('0x2::groth16::PublicProofInputs', {
  bytes: `vector<u8>`,
})

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

  static fromBcs(data: Uint8Array | string, encoding?: Encoding): PublicProofInputs {
    return PublicProofInputs.fromFields(bcs.de([PublicProofInputs.$typeName], data, encoding))
  }
}
