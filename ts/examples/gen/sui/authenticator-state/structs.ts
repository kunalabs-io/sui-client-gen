import * as reified from '../../_framework/reified'
import { String } from '../../_dependencies/source/0x1/string/structs'
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
import { UID } from '../object/structs'
import { bcs } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== ActiveJwk =============================== */

export function isActiveJwk(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x2::authenticator_state::ActiveJwk'
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface ActiveJwkFields {
  jwkId: ToField<JwkId>
  jwk: ToField<JWK>
  epoch: ToField<'u64'>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class ActiveJwk {
  static readonly $typeName = '0x2::authenticator_state::ActiveJwk'
  static readonly $numTypeParams = 0

  readonly $fullTypeName = null as unknown as '0x2::authenticator_state::ActiveJwk'

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

  static reified(): Reified<ActiveJwk> {
    return {
      typeName: ActiveJwk.$typeName,
      fullTypeName: composeSuiType(
        ActiveJwk.$typeName,
        ...[]
      ) as '0x2::authenticator_state::ActiveJwk',
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => ActiveJwk.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => ActiveJwk.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => ActiveJwk.fromBcs(data),
      bcs: ActiveJwk.bcs,
      fromJSONField: (field: any) => ActiveJwk.fromJSONField(field),
      fetch: async (client: SuiClient, id: string) => ActiveJwk.fetch(client, id),
      kind: 'StructClassReified',
    }
  }

  static fromFields(fields: Record<string, any>): ActiveJwk {
    return ActiveJwk.new({
      jwkId: decodeFromFields(JwkId.reified(), fields.jwk_id),
      jwk: decodeFromFields(JWK.reified(), fields.jwk),
      epoch: decodeFromFields('u64', fields.epoch),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): ActiveJwk {
    if (!isActiveJwk(item.type)) {
      throw new Error('not a ActiveJwk type')
    }

    return ActiveJwk.new({
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
    return { $typeName: this.$typeName, ...this.toJSONField() }
  }

  static fromJSONField(field: any): ActiveJwk {
    return ActiveJwk.new({
      jwkId: decodeFromJSONField(JwkId.reified(), field.jwkId),
      jwk: decodeFromJSONField(JWK.reified(), field.jwk),
      epoch: decodeFromJSONField('u64', field.epoch),
    })
  }

  static fromJSON(json: Record<string, any>): ActiveJwk {
    if (json.$typeName !== ActiveJwk.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
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

  static async fetch(client: SuiClient, id: string): Promise<ActiveJwk> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching ActiveJwk object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isActiveJwk(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a ActiveJwk object`)
    }
    return ActiveJwk.fromFieldsWithTypes(res.data.content)
  }
}

/* ============================== AuthenticatorState =============================== */

export function isAuthenticatorState(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x2::authenticator_state::AuthenticatorState'
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface AuthenticatorStateFields {
  id: ToField<UID>
  version: ToField<'u64'>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class AuthenticatorState {
  static readonly $typeName = '0x2::authenticator_state::AuthenticatorState'
  static readonly $numTypeParams = 0

  readonly $fullTypeName = null as unknown as '0x2::authenticator_state::AuthenticatorState'

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

  static reified(): Reified<AuthenticatorState> {
    return {
      typeName: AuthenticatorState.$typeName,
      fullTypeName: composeSuiType(
        AuthenticatorState.$typeName,
        ...[]
      ) as '0x2::authenticator_state::AuthenticatorState',
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => AuthenticatorState.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => AuthenticatorState.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => AuthenticatorState.fromBcs(data),
      bcs: AuthenticatorState.bcs,
      fromJSONField: (field: any) => AuthenticatorState.fromJSONField(field),
      fetch: async (client: SuiClient, id: string) => AuthenticatorState.fetch(client, id),
      kind: 'StructClassReified',
    }
  }

  static fromFields(fields: Record<string, any>): AuthenticatorState {
    return AuthenticatorState.new({
      id: decodeFromFields(UID.reified(), fields.id),
      version: decodeFromFields('u64', fields.version),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): AuthenticatorState {
    if (!isAuthenticatorState(item.type)) {
      throw new Error('not a AuthenticatorState type')
    }

    return AuthenticatorState.new({
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
    return { $typeName: this.$typeName, ...this.toJSONField() }
  }

  static fromJSONField(field: any): AuthenticatorState {
    return AuthenticatorState.new({
      id: decodeFromJSONField(UID.reified(), field.id),
      version: decodeFromJSONField('u64', field.version),
    })
  }

  static fromJSON(json: Record<string, any>): AuthenticatorState {
    if (json.$typeName !== AuthenticatorState.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface AuthenticatorStateInnerFields {
  version: ToField<'u64'>
  activeJwks: ToField<Vector<ActiveJwk>>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class AuthenticatorStateInner {
  static readonly $typeName = '0x2::authenticator_state::AuthenticatorStateInner'
  static readonly $numTypeParams = 0

  readonly $fullTypeName = null as unknown as '0x2::authenticator_state::AuthenticatorStateInner'

  readonly $typeName = AuthenticatorStateInner.$typeName

  static get bcs() {
    return bcs.struct('AuthenticatorStateInner', {
      version: bcs.u64(),
      active_jwks: bcs.vector(ActiveJwk.bcs),
    })
  }

  readonly version: ToField<'u64'>
  readonly activeJwks: ToField<Vector<ActiveJwk>>

  private constructor(fields: AuthenticatorStateInnerFields) {
    this.version = fields.version
    this.activeJwks = fields.activeJwks
  }

  static new(fields: AuthenticatorStateInnerFields): AuthenticatorStateInner {
    return new AuthenticatorStateInner(fields)
  }

  static reified(): Reified<AuthenticatorStateInner> {
    return {
      typeName: AuthenticatorStateInner.$typeName,
      fullTypeName: composeSuiType(
        AuthenticatorStateInner.$typeName,
        ...[]
      ) as '0x2::authenticator_state::AuthenticatorStateInner',
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => AuthenticatorStateInner.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        AuthenticatorStateInner.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => AuthenticatorStateInner.fromBcs(data),
      bcs: AuthenticatorStateInner.bcs,
      fromJSONField: (field: any) => AuthenticatorStateInner.fromJSONField(field),
      fetch: async (client: SuiClient, id: string) => AuthenticatorStateInner.fetch(client, id),
      kind: 'StructClassReified',
    }
  }

  static fromFields(fields: Record<string, any>): AuthenticatorStateInner {
    return AuthenticatorStateInner.new({
      version: decodeFromFields('u64', fields.version),
      activeJwks: decodeFromFields(reified.vector(ActiveJwk.reified()), fields.active_jwks),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): AuthenticatorStateInner {
    if (!isAuthenticatorStateInner(item.type)) {
      throw new Error('not a AuthenticatorStateInner type')
    }

    return AuthenticatorStateInner.new({
      version: decodeFromFieldsWithTypes('u64', item.fields.version),
      activeJwks: decodeFromFieldsWithTypes(
        reified.vector(ActiveJwk.reified()),
        item.fields.active_jwks
      ),
    })
  }

  static fromBcs(data: Uint8Array): AuthenticatorStateInner {
    return AuthenticatorStateInner.fromFields(AuthenticatorStateInner.bcs.parse(data))
  }

  toJSONField() {
    return {
      version: this.version.toString(),
      activeJwks: fieldToJSON<Vector<ActiveJwk>>(
        `vector<0x2::authenticator_state::ActiveJwk>`,
        this.activeJwks
      ),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, ...this.toJSONField() }
  }

  static fromJSONField(field: any): AuthenticatorStateInner {
    return AuthenticatorStateInner.new({
      version: decodeFromJSONField('u64', field.version),
      activeJwks: decodeFromJSONField(reified.vector(ActiveJwk.reified()), field.activeJwks),
    })
  }

  static fromJSON(json: Record<string, any>): AuthenticatorStateInner {
    if (json.$typeName !== AuthenticatorStateInner.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
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

  static async fetch(client: SuiClient, id: string): Promise<AuthenticatorStateInner> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(
        `error fetching AuthenticatorStateInner object at id ${id}: ${res.error.code}`
      )
    }
    if (
      res.data?.content?.dataType !== 'moveObject' ||
      !isAuthenticatorStateInner(res.data.content.type)
    ) {
      throw new Error(`object at id ${id} is not a AuthenticatorStateInner object`)
    }
    return AuthenticatorStateInner.fromFieldsWithTypes(res.data.content)
  }
}

/* ============================== JWK =============================== */

export function isJWK(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x2::authenticator_state::JWK'
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface JWKFields {
  kty: ToField<String>
  e: ToField<String>
  n: ToField<String>
  alg: ToField<String>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class JWK {
  static readonly $typeName = '0x2::authenticator_state::JWK'
  static readonly $numTypeParams = 0

  readonly $fullTypeName = null as unknown as '0x2::authenticator_state::JWK'

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

  static reified(): Reified<JWK> {
    return {
      typeName: JWK.$typeName,
      fullTypeName: composeSuiType(JWK.$typeName, ...[]) as '0x2::authenticator_state::JWK',
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => JWK.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => JWK.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => JWK.fromBcs(data),
      bcs: JWK.bcs,
      fromJSONField: (field: any) => JWK.fromJSONField(field),
      fetch: async (client: SuiClient, id: string) => JWK.fetch(client, id),
      kind: 'StructClassReified',
    }
  }

  static fromFields(fields: Record<string, any>): JWK {
    return JWK.new({
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

    return JWK.new({
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
    return { $typeName: this.$typeName, ...this.toJSONField() }
  }

  static fromJSONField(field: any): JWK {
    return JWK.new({
      kty: decodeFromJSONField(String.reified(), field.kty),
      e: decodeFromJSONField(String.reified(), field.e),
      n: decodeFromJSONField(String.reified(), field.n),
      alg: decodeFromJSONField(String.reified(), field.alg),
    })
  }

  static fromJSON(json: Record<string, any>): JWK {
    if (json.$typeName !== JWK.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
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

  static async fetch(client: SuiClient, id: string): Promise<JWK> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching JWK object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isJWK(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a JWK object`)
    }
    return JWK.fromFieldsWithTypes(res.data.content)
  }
}

/* ============================== JwkId =============================== */

export function isJwkId(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x2::authenticator_state::JwkId'
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface JwkIdFields {
  iss: ToField<String>
  kid: ToField<String>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class JwkId {
  static readonly $typeName = '0x2::authenticator_state::JwkId'
  static readonly $numTypeParams = 0

  readonly $fullTypeName = null as unknown as '0x2::authenticator_state::JwkId'

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

  static reified(): Reified<JwkId> {
    return {
      typeName: JwkId.$typeName,
      fullTypeName: composeSuiType(JwkId.$typeName, ...[]) as '0x2::authenticator_state::JwkId',
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => JwkId.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => JwkId.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => JwkId.fromBcs(data),
      bcs: JwkId.bcs,
      fromJSONField: (field: any) => JwkId.fromJSONField(field),
      fetch: async (client: SuiClient, id: string) => JwkId.fetch(client, id),
      kind: 'StructClassReified',
    }
  }

  static fromFields(fields: Record<string, any>): JwkId {
    return JwkId.new({
      iss: decodeFromFields(String.reified(), fields.iss),
      kid: decodeFromFields(String.reified(), fields.kid),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): JwkId {
    if (!isJwkId(item.type)) {
      throw new Error('not a JwkId type')
    }

    return JwkId.new({
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
    return { $typeName: this.$typeName, ...this.toJSONField() }
  }

  static fromJSONField(field: any): JwkId {
    return JwkId.new({
      iss: decodeFromJSONField(String.reified(), field.iss),
      kid: decodeFromJSONField(String.reified(), field.kid),
    })
  }

  static fromJSON(json: Record<string, any>): JwkId {
    if (json.$typeName !== JwkId.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
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

  static async fetch(client: SuiClient, id: string): Promise<JwkId> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching JwkId object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isJwkId(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a JwkId object`)
    }
    return JwkId.fromFieldsWithTypes(res.data.content)
  }
}
