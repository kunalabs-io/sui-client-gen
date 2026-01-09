import { String } from '../../_dependencies/std/string/structs'
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
  vector,
} from '../../_framework/reified'
import {
  FieldsWithTypes,
  SupportedSuiClient,
  composeSuiType,
  compressSuiType,
  fetchObjectBcs,
} from '../../_framework/util'
import { Vector } from '../../_framework/vector'
import { UID } from '../object/structs'
import { bcs } from '@mysten/sui/bcs'
import { SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromBase64 } from '@mysten/sui/utils'

/* ============================== AuthenticatorState =============================== */

export function isAuthenticatorState(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::authenticator_state::AuthenticatorState`
}

export interface AuthenticatorStateFields {
  id: ToField<UID>
  version: ToField<'u64'>
}

export type AuthenticatorStateReified = Reified<AuthenticatorState, AuthenticatorStateFields>

/**
 * Singleton shared object which stores the global authenticator state.
 * The actual state is stored in a dynamic field of type AuthenticatorStateInner to support
 * future versions of the authenticator state.
 */
export class AuthenticatorState implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::authenticator_state::AuthenticatorState` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = AuthenticatorState.$typeName
  readonly $fullTypeName: `0x2::authenticator_state::AuthenticatorState`
  readonly $typeArgs: []
  readonly $isPhantom = AuthenticatorState.$isPhantom

  readonly id: ToField<UID>
  readonly version: ToField<'u64'>

  private constructor(typeArgs: [], fields: AuthenticatorStateFields) {
    this.$fullTypeName = composeSuiType(
      AuthenticatorState.$typeName,
      ...typeArgs
    ) as `0x2::authenticator_state::AuthenticatorState`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.version = fields.version
  }

  static reified(): AuthenticatorStateReified {
    const reifiedBcs = AuthenticatorState.bcs
    return {
      typeName: AuthenticatorState.$typeName,
      fullTypeName: composeSuiType(
        AuthenticatorState.$typeName,
        ...[]
      ) as `0x2::authenticator_state::AuthenticatorState`,
      typeArgs: [] as [],
      isPhantom: AuthenticatorState.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => AuthenticatorState.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => AuthenticatorState.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => AuthenticatorState.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => AuthenticatorState.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => AuthenticatorState.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => AuthenticatorState.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => AuthenticatorState.fromSuiObjectData(content),
      fetch: async (client: SupportedSuiClient, id: string) => AuthenticatorState.fetch(client, id),
      new: (fields: AuthenticatorStateFields) => {
        return new AuthenticatorState([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return AuthenticatorState.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<AuthenticatorState>> {
    return phantom(AuthenticatorState.reified())
  }

  static get p() {
    return AuthenticatorState.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('AuthenticatorState', {
      id: UID.bcs,
      version: bcs.u64(),
    })
  }

  private static cachedBcs: ReturnType<typeof AuthenticatorState.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof AuthenticatorState.instantiateBcs> {
    if (!AuthenticatorState.cachedBcs) {
      AuthenticatorState.cachedBcs = AuthenticatorState.instantiateBcs()
    }
    return AuthenticatorState.cachedBcs
  }

  static fromFields(fields: Record<string, any>): AuthenticatorState {
    return AuthenticatorState.reified().new({
      id: decodeFromFields(UID.reified(), fields.id),
      version: decodeFromFields('u64', fields.version),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): AuthenticatorState {
    if (!isAuthenticatorState(item.type)) {
      throw new Error('not a AuthenticatorState type')
    }

    return AuthenticatorState.reified().new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      version: decodeFromFieldsWithTypes('u64', item.fields.version),
    })
  }

  static fromBcs(data: Uint8Array): AuthenticatorState {
    return AuthenticatorState.fromFields(AuthenticatorState.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
      version: this.version.toString(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): AuthenticatorState {
    return AuthenticatorState.reified().new({
      id: decodeFromJSONField(UID.reified(), field.id),
      version: decodeFromJSONField('u64', field.version),
    })
  }

  static fromJSON(json: Record<string, any>): AuthenticatorState {
    if (json.$typeName !== AuthenticatorState.$typeName) {
      throw new Error(
        `not a AuthenticatorState json object: expected '${AuthenticatorState.$typeName}' but got '${json.$typeName}'`
      )
    }

    return AuthenticatorState.fromJSONField(json)
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

  static fromSuiObjectData(data: SuiObjectData): AuthenticatorState {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isAuthenticatorState(data.bcs.type)) {
        throw new Error(`object at is not a AuthenticatorState object`)
      }

      return AuthenticatorState.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return AuthenticatorState.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<AuthenticatorState> {
    const res = await fetchObjectBcs(client, id)
    if (!isAuthenticatorState(res.type)) {
      throw new Error(`object at id ${id} is not a AuthenticatorState object`)
    }

    return AuthenticatorState.fromBcs(res.bcsBytes)
  }
}

/* ============================== AuthenticatorStateInner =============================== */

export function isAuthenticatorStateInner(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::authenticator_state::AuthenticatorStateInner`
}

export interface AuthenticatorStateInnerFields {
  version: ToField<'u64'>
  /** List of currently active JWKs. */
  activeJwks: ToField<Vector<ActiveJwk>>
}

export type AuthenticatorStateInnerReified = Reified<
  AuthenticatorStateInner,
  AuthenticatorStateInnerFields
>

export class AuthenticatorStateInner implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::authenticator_state::AuthenticatorStateInner` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = AuthenticatorStateInner.$typeName
  readonly $fullTypeName: `0x2::authenticator_state::AuthenticatorStateInner`
  readonly $typeArgs: []
  readonly $isPhantom = AuthenticatorStateInner.$isPhantom

  readonly version: ToField<'u64'>
  /** List of currently active JWKs. */
  readonly activeJwks: ToField<Vector<ActiveJwk>>

  private constructor(typeArgs: [], fields: AuthenticatorStateInnerFields) {
    this.$fullTypeName = composeSuiType(
      AuthenticatorStateInner.$typeName,
      ...typeArgs
    ) as `0x2::authenticator_state::AuthenticatorStateInner`
    this.$typeArgs = typeArgs

    this.version = fields.version
    this.activeJwks = fields.activeJwks
  }

  static reified(): AuthenticatorStateInnerReified {
    const reifiedBcs = AuthenticatorStateInner.bcs
    return {
      typeName: AuthenticatorStateInner.$typeName,
      fullTypeName: composeSuiType(
        AuthenticatorStateInner.$typeName,
        ...[]
      ) as `0x2::authenticator_state::AuthenticatorStateInner`,
      typeArgs: [] as [],
      isPhantom: AuthenticatorStateInner.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => AuthenticatorStateInner.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        AuthenticatorStateInner.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => AuthenticatorStateInner.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => AuthenticatorStateInner.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => AuthenticatorStateInner.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) =>
        AuthenticatorStateInner.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) =>
        AuthenticatorStateInner.fromSuiObjectData(content),
      fetch: async (client: SupportedSuiClient, id: string) =>
        AuthenticatorStateInner.fetch(client, id),
      new: (fields: AuthenticatorStateInnerFields) => {
        return new AuthenticatorStateInner([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return AuthenticatorStateInner.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<AuthenticatorStateInner>> {
    return phantom(AuthenticatorStateInner.reified())
  }

  static get p() {
    return AuthenticatorStateInner.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('AuthenticatorStateInner', {
      version: bcs.u64(),
      active_jwks: bcs.vector(ActiveJwk.bcs),
    })
  }

  private static cachedBcs: ReturnType<typeof AuthenticatorStateInner.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof AuthenticatorStateInner.instantiateBcs> {
    if (!AuthenticatorStateInner.cachedBcs) {
      AuthenticatorStateInner.cachedBcs = AuthenticatorStateInner.instantiateBcs()
    }
    return AuthenticatorStateInner.cachedBcs
  }

  static fromFields(fields: Record<string, any>): AuthenticatorStateInner {
    return AuthenticatorStateInner.reified().new({
      version: decodeFromFields('u64', fields.version),
      activeJwks: decodeFromFields(vector(ActiveJwk.reified()), fields.active_jwks),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): AuthenticatorStateInner {
    if (!isAuthenticatorStateInner(item.type)) {
      throw new Error('not a AuthenticatorStateInner type')
    }

    return AuthenticatorStateInner.reified().new({
      version: decodeFromFieldsWithTypes('u64', item.fields.version),
      activeJwks: decodeFromFieldsWithTypes(vector(ActiveJwk.reified()), item.fields.active_jwks),
    })
  }

  static fromBcs(data: Uint8Array): AuthenticatorStateInner {
    return AuthenticatorStateInner.fromFields(AuthenticatorStateInner.bcs.parse(data))
  }

  toJSONField() {
    return {
      version: this.version.toString(),
      activeJwks: fieldToJSON<Vector<ActiveJwk>>(`vector<${ActiveJwk.$typeName}>`, this.activeJwks),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): AuthenticatorStateInner {
    return AuthenticatorStateInner.reified().new({
      version: decodeFromJSONField('u64', field.version),
      activeJwks: decodeFromJSONField(vector(ActiveJwk.reified()), field.activeJwks),
    })
  }

  static fromJSON(json: Record<string, any>): AuthenticatorStateInner {
    if (json.$typeName !== AuthenticatorStateInner.$typeName) {
      throw new Error(
        `not a AuthenticatorStateInner json object: expected '${AuthenticatorStateInner.$typeName}' but got '${json.$typeName}'`
      )
    }

    return AuthenticatorStateInner.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): AuthenticatorStateInner {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isAuthenticatorStateInner(content.type)) {
      throw new Error(
        `object at ${(content.fields as any).id} is not a AuthenticatorStateInner object`
      )
    }
    return AuthenticatorStateInner.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): AuthenticatorStateInner {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isAuthenticatorStateInner(data.bcs.type)) {
        throw new Error(`object at is not a AuthenticatorStateInner object`)
      }

      return AuthenticatorStateInner.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return AuthenticatorStateInner.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<AuthenticatorStateInner> {
    const res = await fetchObjectBcs(client, id)
    if (!isAuthenticatorStateInner(res.type)) {
      throw new Error(`object at id ${id} is not a AuthenticatorStateInner object`)
    }

    return AuthenticatorStateInner.fromBcs(res.bcsBytes)
  }
}

/* ============================== JWK =============================== */

export function isJWK(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::authenticator_state::JWK`
}

export interface JWKFields {
  kty: ToField<String>
  e: ToField<String>
  n: ToField<String>
  alg: ToField<String>
}

export type JWKReified = Reified<JWK, JWKFields>

/** Must match the JWK struct in fastcrypto-zkp */
export class JWK implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::authenticator_state::JWK` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = JWK.$typeName
  readonly $fullTypeName: `0x2::authenticator_state::JWK`
  readonly $typeArgs: []
  readonly $isPhantom = JWK.$isPhantom

  readonly kty: ToField<String>
  readonly e: ToField<String>
  readonly n: ToField<String>
  readonly alg: ToField<String>

  private constructor(typeArgs: [], fields: JWKFields) {
    this.$fullTypeName = composeSuiType(
      JWK.$typeName,
      ...typeArgs
    ) as `0x2::authenticator_state::JWK`
    this.$typeArgs = typeArgs

    this.kty = fields.kty
    this.e = fields.e
    this.n = fields.n
    this.alg = fields.alg
  }

  static reified(): JWKReified {
    const reifiedBcs = JWK.bcs
    return {
      typeName: JWK.$typeName,
      fullTypeName: composeSuiType(JWK.$typeName, ...[]) as `0x2::authenticator_state::JWK`,
      typeArgs: [] as [],
      isPhantom: JWK.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => JWK.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => JWK.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => JWK.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => JWK.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => JWK.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => JWK.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => JWK.fromSuiObjectData(content),
      fetch: async (client: SupportedSuiClient, id: string) => JWK.fetch(client, id),
      new: (fields: JWKFields) => {
        return new JWK([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return JWK.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<JWK>> {
    return phantom(JWK.reified())
  }

  static get p() {
    return JWK.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('JWK', {
      kty: String.bcs,
      e: String.bcs,
      n: String.bcs,
      alg: String.bcs,
    })
  }

  private static cachedBcs: ReturnType<typeof JWK.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof JWK.instantiateBcs> {
    if (!JWK.cachedBcs) {
      JWK.cachedBcs = JWK.instantiateBcs()
    }
    return JWK.cachedBcs
  }

  static fromFields(fields: Record<string, any>): JWK {
    return JWK.reified().new({
      kty: decodeFromFields(String.reified(), fields.kty),
      e: decodeFromFields(String.reified(), fields.e),
      n: decodeFromFields(String.reified(), fields.n),
      alg: decodeFromFields(String.reified(), fields.alg),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): JWK {
    if (!isJWK(item.type)) {
      throw new Error('not a JWK type')
    }

    return JWK.reified().new({
      kty: decodeFromFieldsWithTypes(String.reified(), item.fields.kty),
      e: decodeFromFieldsWithTypes(String.reified(), item.fields.e),
      n: decodeFromFieldsWithTypes(String.reified(), item.fields.n),
      alg: decodeFromFieldsWithTypes(String.reified(), item.fields.alg),
    })
  }

  static fromBcs(data: Uint8Array): JWK {
    return JWK.fromFields(JWK.bcs.parse(data))
  }

  toJSONField() {
    return {
      kty: this.kty,
      e: this.e,
      n: this.n,
      alg: this.alg,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): JWK {
    return JWK.reified().new({
      kty: decodeFromJSONField(String.reified(), field.kty),
      e: decodeFromJSONField(String.reified(), field.e),
      n: decodeFromJSONField(String.reified(), field.n),
      alg: decodeFromJSONField(String.reified(), field.alg),
    })
  }

  static fromJSON(json: Record<string, any>): JWK {
    if (json.$typeName !== JWK.$typeName) {
      throw new Error(
        `not a JWK json object: expected '${JWK.$typeName}' but got '${json.$typeName}'`
      )
    }

    return JWK.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): JWK {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isJWK(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a JWK object`)
    }
    return JWK.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): JWK {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isJWK(data.bcs.type)) {
        throw new Error(`object at is not a JWK object`)
      }

      return JWK.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return JWK.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<JWK> {
    const res = await fetchObjectBcs(client, id)
    if (!isJWK(res.type)) {
      throw new Error(`object at id ${id} is not a JWK object`)
    }

    return JWK.fromBcs(res.bcsBytes)
  }
}

/* ============================== JwkId =============================== */

export function isJwkId(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::authenticator_state::JwkId`
}

export interface JwkIdFields {
  iss: ToField<String>
  kid: ToField<String>
}

export type JwkIdReified = Reified<JwkId, JwkIdFields>

/** Must match the JwkId struct in fastcrypto-zkp */
export class JwkId implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::authenticator_state::JwkId` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = JwkId.$typeName
  readonly $fullTypeName: `0x2::authenticator_state::JwkId`
  readonly $typeArgs: []
  readonly $isPhantom = JwkId.$isPhantom

  readonly iss: ToField<String>
  readonly kid: ToField<String>

  private constructor(typeArgs: [], fields: JwkIdFields) {
    this.$fullTypeName = composeSuiType(
      JwkId.$typeName,
      ...typeArgs
    ) as `0x2::authenticator_state::JwkId`
    this.$typeArgs = typeArgs

    this.iss = fields.iss
    this.kid = fields.kid
  }

  static reified(): JwkIdReified {
    const reifiedBcs = JwkId.bcs
    return {
      typeName: JwkId.$typeName,
      fullTypeName: composeSuiType(JwkId.$typeName, ...[]) as `0x2::authenticator_state::JwkId`,
      typeArgs: [] as [],
      isPhantom: JwkId.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => JwkId.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => JwkId.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => JwkId.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => JwkId.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => JwkId.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => JwkId.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => JwkId.fromSuiObjectData(content),
      fetch: async (client: SupportedSuiClient, id: string) => JwkId.fetch(client, id),
      new: (fields: JwkIdFields) => {
        return new JwkId([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return JwkId.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<JwkId>> {
    return phantom(JwkId.reified())
  }

  static get p() {
    return JwkId.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('JwkId', {
      iss: String.bcs,
      kid: String.bcs,
    })
  }

  private static cachedBcs: ReturnType<typeof JwkId.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof JwkId.instantiateBcs> {
    if (!JwkId.cachedBcs) {
      JwkId.cachedBcs = JwkId.instantiateBcs()
    }
    return JwkId.cachedBcs
  }

  static fromFields(fields: Record<string, any>): JwkId {
    return JwkId.reified().new({
      iss: decodeFromFields(String.reified(), fields.iss),
      kid: decodeFromFields(String.reified(), fields.kid),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): JwkId {
    if (!isJwkId(item.type)) {
      throw new Error('not a JwkId type')
    }

    return JwkId.reified().new({
      iss: decodeFromFieldsWithTypes(String.reified(), item.fields.iss),
      kid: decodeFromFieldsWithTypes(String.reified(), item.fields.kid),
    })
  }

  static fromBcs(data: Uint8Array): JwkId {
    return JwkId.fromFields(JwkId.bcs.parse(data))
  }

  toJSONField() {
    return {
      iss: this.iss,
      kid: this.kid,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): JwkId {
    return JwkId.reified().new({
      iss: decodeFromJSONField(String.reified(), field.iss),
      kid: decodeFromJSONField(String.reified(), field.kid),
    })
  }

  static fromJSON(json: Record<string, any>): JwkId {
    if (json.$typeName !== JwkId.$typeName) {
      throw new Error(
        `not a JwkId json object: expected '${JwkId.$typeName}' but got '${json.$typeName}'`
      )
    }

    return JwkId.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): JwkId {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isJwkId(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a JwkId object`)
    }
    return JwkId.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): JwkId {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isJwkId(data.bcs.type)) {
        throw new Error(`object at is not a JwkId object`)
      }

      return JwkId.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return JwkId.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<JwkId> {
    const res = await fetchObjectBcs(client, id)
    if (!isJwkId(res.type)) {
      throw new Error(`object at id ${id} is not a JwkId object`)
    }

    return JwkId.fromBcs(res.bcsBytes)
  }
}

/* ============================== ActiveJwk =============================== */

export function isActiveJwk(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::authenticator_state::ActiveJwk`
}

export interface ActiveJwkFields {
  jwkId: ToField<JwkId>
  jwk: ToField<JWK>
  epoch: ToField<'u64'>
}

export type ActiveJwkReified = Reified<ActiveJwk, ActiveJwkFields>

export class ActiveJwk implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::authenticator_state::ActiveJwk` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = ActiveJwk.$typeName
  readonly $fullTypeName: `0x2::authenticator_state::ActiveJwk`
  readonly $typeArgs: []
  readonly $isPhantom = ActiveJwk.$isPhantom

  readonly jwkId: ToField<JwkId>
  readonly jwk: ToField<JWK>
  readonly epoch: ToField<'u64'>

  private constructor(typeArgs: [], fields: ActiveJwkFields) {
    this.$fullTypeName = composeSuiType(
      ActiveJwk.$typeName,
      ...typeArgs
    ) as `0x2::authenticator_state::ActiveJwk`
    this.$typeArgs = typeArgs

    this.jwkId = fields.jwkId
    this.jwk = fields.jwk
    this.epoch = fields.epoch
  }

  static reified(): ActiveJwkReified {
    const reifiedBcs = ActiveJwk.bcs
    return {
      typeName: ActiveJwk.$typeName,
      fullTypeName: composeSuiType(
        ActiveJwk.$typeName,
        ...[]
      ) as `0x2::authenticator_state::ActiveJwk`,
      typeArgs: [] as [],
      isPhantom: ActiveJwk.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => ActiveJwk.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => ActiveJwk.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => ActiveJwk.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => ActiveJwk.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => ActiveJwk.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => ActiveJwk.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => ActiveJwk.fromSuiObjectData(content),
      fetch: async (client: SupportedSuiClient, id: string) => ActiveJwk.fetch(client, id),
      new: (fields: ActiveJwkFields) => {
        return new ActiveJwk([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return ActiveJwk.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<ActiveJwk>> {
    return phantom(ActiveJwk.reified())
  }

  static get p() {
    return ActiveJwk.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('ActiveJwk', {
      jwk_id: JwkId.bcs,
      jwk: JWK.bcs,
      epoch: bcs.u64(),
    })
  }

  private static cachedBcs: ReturnType<typeof ActiveJwk.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof ActiveJwk.instantiateBcs> {
    if (!ActiveJwk.cachedBcs) {
      ActiveJwk.cachedBcs = ActiveJwk.instantiateBcs()
    }
    return ActiveJwk.cachedBcs
  }

  static fromFields(fields: Record<string, any>): ActiveJwk {
    return ActiveJwk.reified().new({
      jwkId: decodeFromFields(JwkId.reified(), fields.jwk_id),
      jwk: decodeFromFields(JWK.reified(), fields.jwk),
      epoch: decodeFromFields('u64', fields.epoch),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): ActiveJwk {
    if (!isActiveJwk(item.type)) {
      throw new Error('not a ActiveJwk type')
    }

    return ActiveJwk.reified().new({
      jwkId: decodeFromFieldsWithTypes(JwkId.reified(), item.fields.jwk_id),
      jwk: decodeFromFieldsWithTypes(JWK.reified(), item.fields.jwk),
      epoch: decodeFromFieldsWithTypes('u64', item.fields.epoch),
    })
  }

  static fromBcs(data: Uint8Array): ActiveJwk {
    return ActiveJwk.fromFields(ActiveJwk.bcs.parse(data))
  }

  toJSONField() {
    return {
      jwkId: this.jwkId.toJSONField(),
      jwk: this.jwk.toJSONField(),
      epoch: this.epoch.toString(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): ActiveJwk {
    return ActiveJwk.reified().new({
      jwkId: decodeFromJSONField(JwkId.reified(), field.jwkId),
      jwk: decodeFromJSONField(JWK.reified(), field.jwk),
      epoch: decodeFromJSONField('u64', field.epoch),
    })
  }

  static fromJSON(json: Record<string, any>): ActiveJwk {
    if (json.$typeName !== ActiveJwk.$typeName) {
      throw new Error(
        `not a ActiveJwk json object: expected '${ActiveJwk.$typeName}' but got '${json.$typeName}'`
      )
    }

    return ActiveJwk.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): ActiveJwk {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isActiveJwk(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a ActiveJwk object`)
    }
    return ActiveJwk.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): ActiveJwk {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isActiveJwk(data.bcs.type)) {
        throw new Error(`object at is not a ActiveJwk object`)
      }

      return ActiveJwk.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return ActiveJwk.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<ActiveJwk> {
    const res = await fetchObjectBcs(client, id)
    if (!isActiveJwk(res.type)) {
      throw new Error(`object at id ${id} is not a ActiveJwk object`)
    }

    return ActiveJwk.fromBcs(res.bcsBytes)
  }
}
