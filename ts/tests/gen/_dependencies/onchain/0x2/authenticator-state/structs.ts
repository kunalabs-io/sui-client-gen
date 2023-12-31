import { FieldsWithTypes, Type, compressSuiType, genericToJSON } from '../../../../_framework/util'
import { String } from '../../0x1/string/structs'
import { UID } from '../object/structs'
import { bcs } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== AuthenticatorState =============================== */

export function isAuthenticatorState(type: Type): boolean {
  type = compressSuiType(type)
  return type === '0x2::authenticator_state::AuthenticatorState'
}

export interface AuthenticatorStateFields {
  id: string
  version: bigint
}

export class AuthenticatorState {
  static readonly $typeName = '0x2::authenticator_state::AuthenticatorState'
  static readonly $numTypeParams = 0

  static get bcs() {
    return bcs.struct('AuthenticatorState', {
      id: UID.bcs,
      version: bcs.u64(),
    })
  }

  readonly id: string
  readonly version: bigint

  constructor(fields: AuthenticatorStateFields) {
    this.id = fields.id
    this.version = fields.version
  }

  static fromFields(fields: Record<string, any>): AuthenticatorState {
    return new AuthenticatorState({
      id: UID.fromFields(fields.id).id,
      version: BigInt(fields.version),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): AuthenticatorState {
    if (!isAuthenticatorState(item.type)) {
      throw new Error('not a AuthenticatorState type')
    }
    return new AuthenticatorState({ id: item.fields.id.id, version: BigInt(item.fields.version) })
  }

  static fromBcs(data: Uint8Array): AuthenticatorState {
    return AuthenticatorState.fromFields(AuthenticatorState.bcs.parse(data))
  }

  toJSON() {
    return {
      id: this.id,
      version: this.version.toString(),
    }
  }

  static fromSuiParsedData(content: SuiParsedData) {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isAuthenticatorState(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a AuthenticatorState object`)
    }
    return AuthenticatorState.fromFieldsWithTypes(content)
  }

  static async fetch(client: SuiClient, id: string): Promise<AuthenticatorState> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching AuthenticatorState object at id ${id}: ${res.error.code}`)
    }
    if (
      res.data?.content?.dataType !== 'moveObject' ||
      !isAuthenticatorState(res.data.content.type)
    ) {
      throw new Error(`object at id ${id} is not a AuthenticatorState object`)
    }
    return AuthenticatorState.fromFieldsWithTypes(res.data.content)
  }
}

/* ============================== AuthenticatorStateInner =============================== */

export function isAuthenticatorStateInner(type: Type): boolean {
  type = compressSuiType(type)
  return type === '0x2::authenticator_state::AuthenticatorStateInner'
}

export interface AuthenticatorStateInnerFields {
  version: bigint
  activeJwks: Array<ActiveJwk>
}

export class AuthenticatorStateInner {
  static readonly $typeName = '0x2::authenticator_state::AuthenticatorStateInner'
  static readonly $numTypeParams = 0

  static get bcs() {
    return bcs.struct('AuthenticatorStateInner', {
      version: bcs.u64(),
      active_jwks: bcs.vector(ActiveJwk.bcs),
    })
  }

  readonly version: bigint
  readonly activeJwks: Array<ActiveJwk>

  constructor(fields: AuthenticatorStateInnerFields) {
    this.version = fields.version
    this.activeJwks = fields.activeJwks
  }

  static fromFields(fields: Record<string, any>): AuthenticatorStateInner {
    return new AuthenticatorStateInner({
      version: BigInt(fields.version),
      activeJwks: fields.active_jwks.map((item: any) => ActiveJwk.fromFields(item)),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): AuthenticatorStateInner {
    if (!isAuthenticatorStateInner(item.type)) {
      throw new Error('not a AuthenticatorStateInner type')
    }
    return new AuthenticatorStateInner({
      version: BigInt(item.fields.version),
      activeJwks: item.fields.active_jwks.map((item: any) => ActiveJwk.fromFieldsWithTypes(item)),
    })
  }

  static fromBcs(data: Uint8Array): AuthenticatorStateInner {
    return AuthenticatorStateInner.fromFields(AuthenticatorStateInner.bcs.parse(data))
  }

  toJSON() {
    return {
      version: this.version.toString(),
      activeJwks: genericToJSON(`vector<0x2::authenticator_state::ActiveJwk>`, this.activeJwks),
    }
  }
}

/* ============================== JWK =============================== */

export function isJWK(type: Type): boolean {
  type = compressSuiType(type)
  return type === '0x2::authenticator_state::JWK'
}

export interface JWKFields {
  kty: string
  e: string
  n: string
  alg: string
}

export class JWK {
  static readonly $typeName = '0x2::authenticator_state::JWK'
  static readonly $numTypeParams = 0

  static get bcs() {
    return bcs.struct('JWK', {
      kty: String.bcs,
      e: String.bcs,
      n: String.bcs,
      alg: String.bcs,
    })
  }

  readonly kty: string
  readonly e: string
  readonly n: string
  readonly alg: string

  constructor(fields: JWKFields) {
    this.kty = fields.kty
    this.e = fields.e
    this.n = fields.n
    this.alg = fields.alg
  }

  static fromFields(fields: Record<string, any>): JWK {
    return new JWK({
      kty: new TextDecoder()
        .decode(Uint8Array.from(String.fromFields(fields.kty).bytes))
        .toString(),
      e: new TextDecoder().decode(Uint8Array.from(String.fromFields(fields.e).bytes)).toString(),
      n: new TextDecoder().decode(Uint8Array.from(String.fromFields(fields.n).bytes)).toString(),
      alg: new TextDecoder()
        .decode(Uint8Array.from(String.fromFields(fields.alg).bytes))
        .toString(),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): JWK {
    if (!isJWK(item.type)) {
      throw new Error('not a JWK type')
    }
    return new JWK({
      kty: item.fields.kty,
      e: item.fields.e,
      n: item.fields.n,
      alg: item.fields.alg,
    })
  }

  static fromBcs(data: Uint8Array): JWK {
    return JWK.fromFields(JWK.bcs.parse(data))
  }

  toJSON() {
    return {
      kty: this.kty,
      e: this.e,
      n: this.n,
      alg: this.alg,
    }
  }
}

/* ============================== JwkId =============================== */

export function isJwkId(type: Type): boolean {
  type = compressSuiType(type)
  return type === '0x2::authenticator_state::JwkId'
}

export interface JwkIdFields {
  iss: string
  kid: string
}

export class JwkId {
  static readonly $typeName = '0x2::authenticator_state::JwkId'
  static readonly $numTypeParams = 0

  static get bcs() {
    return bcs.struct('JwkId', {
      iss: String.bcs,
      kid: String.bcs,
    })
  }

  readonly iss: string
  readonly kid: string

  constructor(fields: JwkIdFields) {
    this.iss = fields.iss
    this.kid = fields.kid
  }

  static fromFields(fields: Record<string, any>): JwkId {
    return new JwkId({
      iss: new TextDecoder()
        .decode(Uint8Array.from(String.fromFields(fields.iss).bytes))
        .toString(),
      kid: new TextDecoder()
        .decode(Uint8Array.from(String.fromFields(fields.kid).bytes))
        .toString(),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): JwkId {
    if (!isJwkId(item.type)) {
      throw new Error('not a JwkId type')
    }
    return new JwkId({ iss: item.fields.iss, kid: item.fields.kid })
  }

  static fromBcs(data: Uint8Array): JwkId {
    return JwkId.fromFields(JwkId.bcs.parse(data))
  }

  toJSON() {
    return {
      iss: this.iss,
      kid: this.kid,
    }
  }
}

/* ============================== ActiveJwk =============================== */

export function isActiveJwk(type: Type): boolean {
  type = compressSuiType(type)
  return type === '0x2::authenticator_state::ActiveJwk'
}

export interface ActiveJwkFields {
  jwkId: JwkId
  jwk: JWK
  epoch: bigint
}

export class ActiveJwk {
  static readonly $typeName = '0x2::authenticator_state::ActiveJwk'
  static readonly $numTypeParams = 0

  static get bcs() {
    return bcs.struct('ActiveJwk', {
      jwk_id: JwkId.bcs,
      jwk: JWK.bcs,
      epoch: bcs.u64(),
    })
  }

  readonly jwkId: JwkId
  readonly jwk: JWK
  readonly epoch: bigint

  constructor(fields: ActiveJwkFields) {
    this.jwkId = fields.jwkId
    this.jwk = fields.jwk
    this.epoch = fields.epoch
  }

  static fromFields(fields: Record<string, any>): ActiveJwk {
    return new ActiveJwk({
      jwkId: JwkId.fromFields(fields.jwk_id),
      jwk: JWK.fromFields(fields.jwk),
      epoch: BigInt(fields.epoch),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): ActiveJwk {
    if (!isActiveJwk(item.type)) {
      throw new Error('not a ActiveJwk type')
    }
    return new ActiveJwk({
      jwkId: JwkId.fromFieldsWithTypes(item.fields.jwk_id),
      jwk: JWK.fromFieldsWithTypes(item.fields.jwk),
      epoch: BigInt(item.fields.epoch),
    })
  }

  static fromBcs(data: Uint8Array): ActiveJwk {
    return ActiveJwk.fromFields(ActiveJwk.bcs.parse(data))
  }

  toJSON() {
    return {
      jwkId: this.jwkId.toJSON(),
      jwk: this.jwk.toJSON(),
      epoch: this.epoch.toString(),
    }
  }
}
