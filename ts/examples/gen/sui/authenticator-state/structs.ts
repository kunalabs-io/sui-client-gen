import { String } from '../../_dependencies/source/0x1/string/structs'
import {
  ToField,
  decodeFromFieldsGenericOrSpecial,
  decodeFromFieldsWithTypesGenericOrSpecial,
  reified,
} from '../../_framework/types'
import { FieldsWithTypes, compressSuiType, genericToJSON } from '../../_framework/util'
import { UID } from '../object/structs'
import { bcs } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== ActiveJwk =============================== */

export function isActiveJwk(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x2::authenticator_state::ActiveJwk'
}

export interface ActiveJwkFields {
  jwkId: ToField<JwkId>
  jwk: ToField<JWK>
  epoch: ToField<'u64'>
}

export class ActiveJwk {
  static readonly $typeName = '0x2::authenticator_state::ActiveJwk'
  static readonly $numTypeParams = 0

  readonly $typeName = ActiveJwk.$typeName

  static get bcs() {
    return bcs.struct('ActiveJwk', {
      jwk_id: JwkId.bcs,
      jwk: JWK.bcs,
      epoch: bcs.u64(),
    })
  }

  readonly jwkId: ToField<JwkId>
  readonly jwk: ToField<JWK>
  readonly epoch: ToField<'u64'>

  private constructor(fields: ActiveJwkFields) {
    this.jwkId = fields.jwkId
    this.jwk = fields.jwk
    this.epoch = fields.epoch
  }

  static new(fields: ActiveJwkFields): ActiveJwk {
    return new ActiveJwk(fields)
  }

  static reified() {
    return {
      typeName: ActiveJwk.$typeName,
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => ActiveJwk.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => ActiveJwk.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => ActiveJwk.fromBcs(data),
      bcs: ActiveJwk.bcs,
      __class: null as unknown as ReturnType<typeof ActiveJwk.new>,
    }
  }

  static fromFields(fields: Record<string, any>): ActiveJwk {
    return ActiveJwk.new({
      jwkId: decodeFromFieldsGenericOrSpecial(JwkId.reified(), fields.jwk_id),
      jwk: decodeFromFieldsGenericOrSpecial(JWK.reified(), fields.jwk),
      epoch: decodeFromFieldsGenericOrSpecial('u64', fields.epoch),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): ActiveJwk {
    if (!isActiveJwk(item.type)) {
      throw new Error('not a ActiveJwk type')
    }

    return ActiveJwk.new({
      jwkId: decodeFromFieldsWithTypesGenericOrSpecial(JwkId.reified(), item.fields.jwk_id),
      jwk: decodeFromFieldsWithTypesGenericOrSpecial(JWK.reified(), item.fields.jwk),
      epoch: decodeFromFieldsWithTypesGenericOrSpecial('u64', item.fields.epoch),
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

/* ============================== AuthenticatorState =============================== */

export function isAuthenticatorState(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x2::authenticator_state::AuthenticatorState'
}

export interface AuthenticatorStateFields {
  id: ToField<UID>
  version: ToField<'u64'>
}

export class AuthenticatorState {
  static readonly $typeName = '0x2::authenticator_state::AuthenticatorState'
  static readonly $numTypeParams = 0

  readonly $typeName = AuthenticatorState.$typeName

  static get bcs() {
    return bcs.struct('AuthenticatorState', {
      id: UID.bcs,
      version: bcs.u64(),
    })
  }

  readonly id: ToField<UID>
  readonly version: ToField<'u64'>

  private constructor(fields: AuthenticatorStateFields) {
    this.id = fields.id
    this.version = fields.version
  }

  static new(fields: AuthenticatorStateFields): AuthenticatorState {
    return new AuthenticatorState(fields)
  }

  static reified() {
    return {
      typeName: AuthenticatorState.$typeName,
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => AuthenticatorState.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => AuthenticatorState.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => AuthenticatorState.fromBcs(data),
      bcs: AuthenticatorState.bcs,
      __class: null as unknown as ReturnType<typeof AuthenticatorState.new>,
    }
  }

  static fromFields(fields: Record<string, any>): AuthenticatorState {
    return AuthenticatorState.new({
      id: decodeFromFieldsGenericOrSpecial(UID.reified(), fields.id),
      version: decodeFromFieldsGenericOrSpecial('u64', fields.version),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): AuthenticatorState {
    if (!isAuthenticatorState(item.type)) {
      throw new Error('not a AuthenticatorState type')
    }

    return AuthenticatorState.new({
      id: decodeFromFieldsWithTypesGenericOrSpecial(UID.reified(), item.fields.id),
      version: decodeFromFieldsWithTypesGenericOrSpecial('u64', item.fields.version),
    })
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

  static fromSuiParsedData(content: SuiParsedData): AuthenticatorState {
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

export function isAuthenticatorStateInner(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x2::authenticator_state::AuthenticatorStateInner'
}

export interface AuthenticatorStateInnerFields {
  version: ToField<'u64'>
  activeJwks: Array<ToField<ActiveJwk>>
}

export class AuthenticatorStateInner {
  static readonly $typeName = '0x2::authenticator_state::AuthenticatorStateInner'
  static readonly $numTypeParams = 0

  readonly $typeName = AuthenticatorStateInner.$typeName

  static get bcs() {
    return bcs.struct('AuthenticatorStateInner', {
      version: bcs.u64(),
      active_jwks: bcs.vector(ActiveJwk.bcs),
    })
  }

  readonly version: ToField<'u64'>
  readonly activeJwks: Array<ToField<ActiveJwk>>

  private constructor(fields: AuthenticatorStateInnerFields) {
    this.version = fields.version
    this.activeJwks = fields.activeJwks
  }

  static new(fields: AuthenticatorStateInnerFields): AuthenticatorStateInner {
    return new AuthenticatorStateInner(fields)
  }

  static reified() {
    return {
      typeName: AuthenticatorStateInner.$typeName,
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => AuthenticatorStateInner.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        AuthenticatorStateInner.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => AuthenticatorStateInner.fromBcs(data),
      bcs: AuthenticatorStateInner.bcs,
      __class: null as unknown as ReturnType<typeof AuthenticatorStateInner.new>,
    }
  }

  static fromFields(fields: Record<string, any>): AuthenticatorStateInner {
    return AuthenticatorStateInner.new({
      version: decodeFromFieldsGenericOrSpecial('u64', fields.version),
      activeJwks: decodeFromFieldsGenericOrSpecial(
        reified.vector(ActiveJwk.reified()),
        fields.active_jwks
      ),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): AuthenticatorStateInner {
    if (!isAuthenticatorStateInner(item.type)) {
      throw new Error('not a AuthenticatorStateInner type')
    }

    return AuthenticatorStateInner.new({
      version: decodeFromFieldsWithTypesGenericOrSpecial('u64', item.fields.version),
      activeJwks: decodeFromFieldsWithTypesGenericOrSpecial(
        reified.vector(ActiveJwk.reified()),
        item.fields.active_jwks
      ),
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

export function isJWK(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x2::authenticator_state::JWK'
}

export interface JWKFields {
  kty: ToField<String>
  e: ToField<String>
  n: ToField<String>
  alg: ToField<String>
}

export class JWK {
  static readonly $typeName = '0x2::authenticator_state::JWK'
  static readonly $numTypeParams = 0

  readonly $typeName = JWK.$typeName

  static get bcs() {
    return bcs.struct('JWK', {
      kty: String.bcs,
      e: String.bcs,
      n: String.bcs,
      alg: String.bcs,
    })
  }

  readonly kty: ToField<String>
  readonly e: ToField<String>
  readonly n: ToField<String>
  readonly alg: ToField<String>

  private constructor(fields: JWKFields) {
    this.kty = fields.kty
    this.e = fields.e
    this.n = fields.n
    this.alg = fields.alg
  }

  static new(fields: JWKFields): JWK {
    return new JWK(fields)
  }

  static reified() {
    return {
      typeName: JWK.$typeName,
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => JWK.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => JWK.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => JWK.fromBcs(data),
      bcs: JWK.bcs,
      __class: null as unknown as ReturnType<typeof JWK.new>,
    }
  }

  static fromFields(fields: Record<string, any>): JWK {
    return JWK.new({
      kty: decodeFromFieldsGenericOrSpecial(String.reified(), fields.kty),
      e: decodeFromFieldsGenericOrSpecial(String.reified(), fields.e),
      n: decodeFromFieldsGenericOrSpecial(String.reified(), fields.n),
      alg: decodeFromFieldsGenericOrSpecial(String.reified(), fields.alg),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): JWK {
    if (!isJWK(item.type)) {
      throw new Error('not a JWK type')
    }

    return JWK.new({
      kty: decodeFromFieldsWithTypesGenericOrSpecial(String.reified(), item.fields.kty),
      e: decodeFromFieldsWithTypesGenericOrSpecial(String.reified(), item.fields.e),
      n: decodeFromFieldsWithTypesGenericOrSpecial(String.reified(), item.fields.n),
      alg: decodeFromFieldsWithTypesGenericOrSpecial(String.reified(), item.fields.alg),
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

export function isJwkId(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x2::authenticator_state::JwkId'
}

export interface JwkIdFields {
  iss: ToField<String>
  kid: ToField<String>
}

export class JwkId {
  static readonly $typeName = '0x2::authenticator_state::JwkId'
  static readonly $numTypeParams = 0

  readonly $typeName = JwkId.$typeName

  static get bcs() {
    return bcs.struct('JwkId', {
      iss: String.bcs,
      kid: String.bcs,
    })
  }

  readonly iss: ToField<String>
  readonly kid: ToField<String>

  private constructor(fields: JwkIdFields) {
    this.iss = fields.iss
    this.kid = fields.kid
  }

  static new(fields: JwkIdFields): JwkId {
    return new JwkId(fields)
  }

  static reified() {
    return {
      typeName: JwkId.$typeName,
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => JwkId.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => JwkId.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => JwkId.fromBcs(data),
      bcs: JwkId.bcs,
      __class: null as unknown as ReturnType<typeof JwkId.new>,
    }
  }

  static fromFields(fields: Record<string, any>): JwkId {
    return JwkId.new({
      iss: decodeFromFieldsGenericOrSpecial(String.reified(), fields.iss),
      kid: decodeFromFieldsGenericOrSpecial(String.reified(), fields.kid),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): JwkId {
    if (!isJwkId(item.type)) {
      throw new Error('not a JwkId type')
    }

    return JwkId.new({
      iss: decodeFromFieldsWithTypesGenericOrSpecial(String.reified(), item.fields.iss),
      kid: decodeFromFieldsWithTypesGenericOrSpecial(String.reified(), item.fields.kid),
    })
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
