import { Option } from '../../_dependencies/source/0x1/option/structs'
import { String } from '../../_dependencies/source/0x1/string/structs'
import { TypeName } from '../../_dependencies/source/0x1/type-name/structs'
import {
  ReifiedTypeArgument,
  ToField,
  assertFieldsWithTypesArgsMatch,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  extractType,
  fieldToJSON,
} from '../../_framework/reified'
import { FieldsWithTypes, compressSuiType } from '../../_framework/util'
import { Balance } from '../balance/structs'
import { ID, UID } from '../object/structs'
import { VecMap } from '../vec-map/structs'
import { VecSet } from '../vec-set/structs'
import { bcs, fromHEX, toHEX } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== RuleKey =============================== */

export function isRuleKey(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::token::RuleKey<')
}

export interface RuleKeyFields {
  isProtected: ToField<'bool'>
}

export class RuleKey {
  static readonly $typeName = '0x2::token::RuleKey'
  static readonly $numTypeParams = 1

  readonly $typeName = RuleKey.$typeName

  static get bcs() {
    return bcs.struct('RuleKey', {
      is_protected: bcs.bool(),
    })
  }

  readonly $typeArg: string

  readonly isProtected: ToField<'bool'>

  private constructor(typeArg: string, isProtected: ToField<'bool'>) {
    this.$typeArg = typeArg

    this.isProtected = isProtected
  }

  static new(typeArg: ReifiedTypeArgument, isProtected: ToField<'bool'>): RuleKey {
    return new RuleKey(extractType(typeArg), isProtected)
  }

  static reified(T: ReifiedTypeArgument) {
    return {
      typeName: RuleKey.$typeName,
      typeArgs: [T],
      fromFields: (fields: Record<string, any>) => RuleKey.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => RuleKey.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => RuleKey.fromBcs(T, data),
      bcs: RuleKey.bcs,
      __class: null as unknown as ReturnType<typeof RuleKey.new>,
    }
  }

  static fromFields(typeArg: ReifiedTypeArgument, fields: Record<string, any>): RuleKey {
    return RuleKey.new(typeArg, decodeFromFields('bool', fields.is_protected))
  }

  static fromFieldsWithTypes(typeArg: ReifiedTypeArgument, item: FieldsWithTypes): RuleKey {
    if (!isRuleKey(item.type)) {
      throw new Error('not a RuleKey type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return RuleKey.new(typeArg, decodeFromFieldsWithTypes('bool', item.fields.is_protected))
  }

  static fromBcs(typeArg: ReifiedTypeArgument, data: Uint8Array): RuleKey {
    return RuleKey.fromFields(typeArg, RuleKey.bcs.parse(data))
  }

  toJSONField() {
    return {
      isProtected: this.isProtected,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArg: this.$typeArg, ...this.toJSONField() }
  }
}

/* ============================== ActionRequest =============================== */

export function isActionRequest(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::token::ActionRequest<')
}

export interface ActionRequestFields {
  name: ToField<String>
  amount: ToField<'u64'>
  sender: ToField<'address'>
  recipient: ToField<Option<'address'>>
  spentBalance: ToField<Option<Balance>>
  approvals: ToField<VecSet<TypeName>>
}

export class ActionRequest {
  static readonly $typeName = '0x2::token::ActionRequest'
  static readonly $numTypeParams = 1

  readonly $typeName = ActionRequest.$typeName

  static get bcs() {
    return bcs.struct('ActionRequest', {
      name: String.bcs,
      amount: bcs.u64(),
      sender: bcs.bytes(32).transform({
        input: (val: string) => fromHEX(val),
        output: (val: Uint8Array) => toHEX(val),
      }),
      recipient: Option.bcs(
        bcs.bytes(32).transform({
          input: (val: string) => fromHEX(val),
          output: (val: Uint8Array) => toHEX(val),
        })
      ),
      spent_balance: Option.bcs(Balance.bcs),
      approvals: VecSet.bcs(TypeName.bcs),
    })
  }

  readonly $typeArg: string

  readonly name: ToField<String>
  readonly amount: ToField<'u64'>
  readonly sender: ToField<'address'>
  readonly recipient: ToField<Option<'address'>>
  readonly spentBalance: ToField<Option<Balance>>
  readonly approvals: ToField<VecSet<TypeName>>

  private constructor(typeArg: string, fields: ActionRequestFields) {
    this.$typeArg = typeArg

    this.name = fields.name
    this.amount = fields.amount
    this.sender = fields.sender
    this.recipient = fields.recipient
    this.spentBalance = fields.spentBalance
    this.approvals = fields.approvals
  }

  static new(typeArg: ReifiedTypeArgument, fields: ActionRequestFields): ActionRequest {
    return new ActionRequest(extractType(typeArg), fields)
  }

  static reified(T: ReifiedTypeArgument) {
    return {
      typeName: ActionRequest.$typeName,
      typeArgs: [T],
      fromFields: (fields: Record<string, any>) => ActionRequest.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => ActionRequest.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => ActionRequest.fromBcs(T, data),
      bcs: ActionRequest.bcs,
      __class: null as unknown as ReturnType<typeof ActionRequest.new>,
    }
  }

  static fromFields(typeArg: ReifiedTypeArgument, fields: Record<string, any>): ActionRequest {
    return ActionRequest.new(typeArg, {
      name: decodeFromFields(String.reified(), fields.name),
      amount: decodeFromFields('u64', fields.amount),
      sender: decodeFromFields('address', fields.sender),
      recipient: decodeFromFields(Option.reified('address'), fields.recipient),
      spentBalance: decodeFromFields(
        Option.reified(Balance.reified(typeArg)),
        fields.spent_balance
      ),
      approvals: decodeFromFields(VecSet.reified(TypeName.reified()), fields.approvals),
    })
  }

  static fromFieldsWithTypes(typeArg: ReifiedTypeArgument, item: FieldsWithTypes): ActionRequest {
    if (!isActionRequest(item.type)) {
      throw new Error('not a ActionRequest type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return ActionRequest.new(typeArg, {
      name: decodeFromFieldsWithTypes(String.reified(), item.fields.name),
      amount: decodeFromFieldsWithTypes('u64', item.fields.amount),
      sender: decodeFromFieldsWithTypes('address', item.fields.sender),
      recipient: decodeFromFieldsWithTypes(Option.reified('address'), item.fields.recipient),
      spentBalance: decodeFromFieldsWithTypes(
        Option.reified(Balance.reified(typeArg)),
        item.fields.spent_balance
      ),
      approvals: decodeFromFieldsWithTypes(
        VecSet.reified(TypeName.reified()),
        item.fields.approvals
      ),
    })
  }

  static fromBcs(typeArg: ReifiedTypeArgument, data: Uint8Array): ActionRequest {
    return ActionRequest.fromFields(typeArg, ActionRequest.bcs.parse(data))
  }

  toJSONField() {
    return {
      name: this.name,
      amount: this.amount.toString(),
      sender: this.sender,
      recipient: fieldToJSON<Option<'address'>>(`0x1::option::Option<address>`, this.recipient),
      spentBalance: fieldToJSON<Option<Balance>>(
        `0x1::option::Option<0x2::balance::Balance<${this.$typeArg}>>`,
        this.spentBalance
      ),
      approvals: this.approvals.toJSONField(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArg: this.$typeArg, ...this.toJSONField() }
  }
}

/* ============================== Token =============================== */

export function isToken(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::token::Token<')
}

export interface TokenFields {
  id: ToField<UID>
  balance: ToField<Balance>
}

export class Token {
  static readonly $typeName = '0x2::token::Token'
  static readonly $numTypeParams = 1

  readonly $typeName = Token.$typeName

  static get bcs() {
    return bcs.struct('Token', {
      id: UID.bcs,
      balance: Balance.bcs,
    })
  }

  readonly $typeArg: string

  readonly id: ToField<UID>
  readonly balance: ToField<Balance>

  private constructor(typeArg: string, fields: TokenFields) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.balance = fields.balance
  }

  static new(typeArg: ReifiedTypeArgument, fields: TokenFields): Token {
    return new Token(extractType(typeArg), fields)
  }

  static reified(T: ReifiedTypeArgument) {
    return {
      typeName: Token.$typeName,
      typeArgs: [T],
      fromFields: (fields: Record<string, any>) => Token.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Token.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => Token.fromBcs(T, data),
      bcs: Token.bcs,
      __class: null as unknown as ReturnType<typeof Token.new>,
    }
  }

  static fromFields(typeArg: ReifiedTypeArgument, fields: Record<string, any>): Token {
    return Token.new(typeArg, {
      id: decodeFromFields(UID.reified(), fields.id),
      balance: decodeFromFields(Balance.reified(typeArg), fields.balance),
    })
  }

  static fromFieldsWithTypes(typeArg: ReifiedTypeArgument, item: FieldsWithTypes): Token {
    if (!isToken(item.type)) {
      throw new Error('not a Token type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Token.new(typeArg, {
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      balance: decodeFromFieldsWithTypes(Balance.reified(typeArg), item.fields.balance),
    })
  }

  static fromBcs(typeArg: ReifiedTypeArgument, data: Uint8Array): Token {
    return Token.fromFields(typeArg, Token.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
      balance: this.balance.toJSONField(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArg: this.$typeArg, ...this.toJSONField() }
  }

  static fromSuiParsedData(typeArg: ReifiedTypeArgument, content: SuiParsedData): Token {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isToken(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Token object`)
    }
    return Token.fromFieldsWithTypes(typeArg, content)
  }

  static async fetch(client: SuiClient, typeArg: ReifiedTypeArgument, id: string): Promise<Token> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching Token object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isToken(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a Token object`)
    }
    return Token.fromFieldsWithTypes(typeArg, res.data.content)
  }
}

/* ============================== TokenPolicy =============================== */

export function isTokenPolicy(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::token::TokenPolicy<')
}

export interface TokenPolicyFields {
  id: ToField<UID>
  spentBalance: ToField<Balance>
  rules: ToField<VecMap<String, VecSet<TypeName>>>
}

export class TokenPolicy {
  static readonly $typeName = '0x2::token::TokenPolicy'
  static readonly $numTypeParams = 1

  readonly $typeName = TokenPolicy.$typeName

  static get bcs() {
    return bcs.struct('TokenPolicy', {
      id: UID.bcs,
      spent_balance: Balance.bcs,
      rules: VecMap.bcs(String.bcs, VecSet.bcs(TypeName.bcs)),
    })
  }

  readonly $typeArg: string

  readonly id: ToField<UID>
  readonly spentBalance: ToField<Balance>
  readonly rules: ToField<VecMap<String, VecSet<TypeName>>>

  private constructor(typeArg: string, fields: TokenPolicyFields) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.spentBalance = fields.spentBalance
    this.rules = fields.rules
  }

  static new(typeArg: ReifiedTypeArgument, fields: TokenPolicyFields): TokenPolicy {
    return new TokenPolicy(extractType(typeArg), fields)
  }

  static reified(T: ReifiedTypeArgument) {
    return {
      typeName: TokenPolicy.$typeName,
      typeArgs: [T],
      fromFields: (fields: Record<string, any>) => TokenPolicy.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => TokenPolicy.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => TokenPolicy.fromBcs(T, data),
      bcs: TokenPolicy.bcs,
      __class: null as unknown as ReturnType<typeof TokenPolicy.new>,
    }
  }

  static fromFields(typeArg: ReifiedTypeArgument, fields: Record<string, any>): TokenPolicy {
    return TokenPolicy.new(typeArg, {
      id: decodeFromFields(UID.reified(), fields.id),
      spentBalance: decodeFromFields(Balance.reified(typeArg), fields.spent_balance),
      rules: decodeFromFields(
        VecMap.reified(String.reified(), VecSet.reified(TypeName.reified())),
        fields.rules
      ),
    })
  }

  static fromFieldsWithTypes(typeArg: ReifiedTypeArgument, item: FieldsWithTypes): TokenPolicy {
    if (!isTokenPolicy(item.type)) {
      throw new Error('not a TokenPolicy type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return TokenPolicy.new(typeArg, {
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      spentBalance: decodeFromFieldsWithTypes(Balance.reified(typeArg), item.fields.spent_balance),
      rules: decodeFromFieldsWithTypes(
        VecMap.reified(String.reified(), VecSet.reified(TypeName.reified())),
        item.fields.rules
      ),
    })
  }

  static fromBcs(typeArg: ReifiedTypeArgument, data: Uint8Array): TokenPolicy {
    return TokenPolicy.fromFields(typeArg, TokenPolicy.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
      spentBalance: this.spentBalance.toJSONField(),
      rules: this.rules.toJSONField(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArg: this.$typeArg, ...this.toJSONField() }
  }

  static fromSuiParsedData(typeArg: ReifiedTypeArgument, content: SuiParsedData): TokenPolicy {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isTokenPolicy(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a TokenPolicy object`)
    }
    return TokenPolicy.fromFieldsWithTypes(typeArg, content)
  }

  static async fetch(
    client: SuiClient,
    typeArg: ReifiedTypeArgument,
    id: string
  ): Promise<TokenPolicy> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching TokenPolicy object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isTokenPolicy(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a TokenPolicy object`)
    }
    return TokenPolicy.fromFieldsWithTypes(typeArg, res.data.content)
  }
}

/* ============================== TokenPolicyCap =============================== */

export function isTokenPolicyCap(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::token::TokenPolicyCap<')
}

export interface TokenPolicyCapFields {
  id: ToField<UID>
  for: ToField<ID>
}

export class TokenPolicyCap {
  static readonly $typeName = '0x2::token::TokenPolicyCap'
  static readonly $numTypeParams = 1

  readonly $typeName = TokenPolicyCap.$typeName

  static get bcs() {
    return bcs.struct('TokenPolicyCap', {
      id: UID.bcs,
      for: ID.bcs,
    })
  }

  readonly $typeArg: string

  readonly id: ToField<UID>
  readonly for: ToField<ID>

  private constructor(typeArg: string, fields: TokenPolicyCapFields) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.for = fields.for
  }

  static new(typeArg: ReifiedTypeArgument, fields: TokenPolicyCapFields): TokenPolicyCap {
    return new TokenPolicyCap(extractType(typeArg), fields)
  }

  static reified(T: ReifiedTypeArgument) {
    return {
      typeName: TokenPolicyCap.$typeName,
      typeArgs: [T],
      fromFields: (fields: Record<string, any>) => TokenPolicyCap.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => TokenPolicyCap.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => TokenPolicyCap.fromBcs(T, data),
      bcs: TokenPolicyCap.bcs,
      __class: null as unknown as ReturnType<typeof TokenPolicyCap.new>,
    }
  }

  static fromFields(typeArg: ReifiedTypeArgument, fields: Record<string, any>): TokenPolicyCap {
    return TokenPolicyCap.new(typeArg, {
      id: decodeFromFields(UID.reified(), fields.id),
      for: decodeFromFields(ID.reified(), fields.for),
    })
  }

  static fromFieldsWithTypes(typeArg: ReifiedTypeArgument, item: FieldsWithTypes): TokenPolicyCap {
    if (!isTokenPolicyCap(item.type)) {
      throw new Error('not a TokenPolicyCap type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return TokenPolicyCap.new(typeArg, {
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      for: decodeFromFieldsWithTypes(ID.reified(), item.fields.for),
    })
  }

  static fromBcs(typeArg: ReifiedTypeArgument, data: Uint8Array): TokenPolicyCap {
    return TokenPolicyCap.fromFields(typeArg, TokenPolicyCap.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
      for: this.for,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArg: this.$typeArg, ...this.toJSONField() }
  }

  static fromSuiParsedData(typeArg: ReifiedTypeArgument, content: SuiParsedData): TokenPolicyCap {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isTokenPolicyCap(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a TokenPolicyCap object`)
    }
    return TokenPolicyCap.fromFieldsWithTypes(typeArg, content)
  }

  static async fetch(
    client: SuiClient,
    typeArg: ReifiedTypeArgument,
    id: string
  ): Promise<TokenPolicyCap> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching TokenPolicyCap object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isTokenPolicyCap(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a TokenPolicyCap object`)
    }
    return TokenPolicyCap.fromFieldsWithTypes(typeArg, res.data.content)
  }
}

/* ============================== TokenPolicyCreated =============================== */

export function isTokenPolicyCreated(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::token::TokenPolicyCreated<')
}

export interface TokenPolicyCreatedFields {
  id: ToField<ID>
  isMutable: ToField<'bool'>
}

export class TokenPolicyCreated {
  static readonly $typeName = '0x2::token::TokenPolicyCreated'
  static readonly $numTypeParams = 1

  readonly $typeName = TokenPolicyCreated.$typeName

  static get bcs() {
    return bcs.struct('TokenPolicyCreated', {
      id: ID.bcs,
      is_mutable: bcs.bool(),
    })
  }

  readonly $typeArg: string

  readonly id: ToField<ID>
  readonly isMutable: ToField<'bool'>

  private constructor(typeArg: string, fields: TokenPolicyCreatedFields) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.isMutable = fields.isMutable
  }

  static new(typeArg: ReifiedTypeArgument, fields: TokenPolicyCreatedFields): TokenPolicyCreated {
    return new TokenPolicyCreated(extractType(typeArg), fields)
  }

  static reified(T: ReifiedTypeArgument) {
    return {
      typeName: TokenPolicyCreated.$typeName,
      typeArgs: [T],
      fromFields: (fields: Record<string, any>) => TokenPolicyCreated.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        TokenPolicyCreated.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => TokenPolicyCreated.fromBcs(T, data),
      bcs: TokenPolicyCreated.bcs,
      __class: null as unknown as ReturnType<typeof TokenPolicyCreated.new>,
    }
  }

  static fromFields(typeArg: ReifiedTypeArgument, fields: Record<string, any>): TokenPolicyCreated {
    return TokenPolicyCreated.new(typeArg, {
      id: decodeFromFields(ID.reified(), fields.id),
      isMutable: decodeFromFields('bool', fields.is_mutable),
    })
  }

  static fromFieldsWithTypes(
    typeArg: ReifiedTypeArgument,
    item: FieldsWithTypes
  ): TokenPolicyCreated {
    if (!isTokenPolicyCreated(item.type)) {
      throw new Error('not a TokenPolicyCreated type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return TokenPolicyCreated.new(typeArg, {
      id: decodeFromFieldsWithTypes(ID.reified(), item.fields.id),
      isMutable: decodeFromFieldsWithTypes('bool', item.fields.is_mutable),
    })
  }

  static fromBcs(typeArg: ReifiedTypeArgument, data: Uint8Array): TokenPolicyCreated {
    return TokenPolicyCreated.fromFields(typeArg, TokenPolicyCreated.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
      isMutable: this.isMutable,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArg: this.$typeArg, ...this.toJSONField() }
  }
}
