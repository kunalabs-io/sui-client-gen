import { Option } from '../../_dependencies/source/0x1/option/structs'
import { String } from '../../_dependencies/source/0x1/string/structs'
import { TypeName } from '../../_dependencies/source/0x1/type-name/structs'
import {
  PhantomTypeArgument,
  ReifiedPhantomTypeArgument,
  ToField,
  ToPhantomTypeArgument,
  ToTypeArgument,
  assertFieldsWithTypesArgsMatch,
  assertReifiedTypeArgsMatch,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  extractType,
  fieldToJSON,
} from '../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../_framework/util'
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface RuleKeyFields<T extends PhantomTypeArgument> {
  isProtected: ToField<'bool'>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class RuleKey<T extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::token::RuleKey'
  static readonly $numTypeParams = 1

  __reifiedFullTypeString = null as unknown as `0x2::token::RuleKey<${T}>`

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

  static new<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    isProtected: ToField<'bool'>
  ): RuleKey<ToPhantomTypeArgument<T>> {
    return new RuleKey(extractType(typeArg), isProtected)
  }

  static reified<T extends ReifiedPhantomTypeArgument>(T: T) {
    return {
      typeName: RuleKey.$typeName,
      typeArgs: [T],
      fullTypeName: composeSuiType(
        RuleKey.$typeName,
        ...[extractType(T)]
      ) as `0x2::token::RuleKey<${ToPhantomTypeArgument<T>}>`,
      fromFields: (fields: Record<string, any>) => RuleKey.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => RuleKey.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => RuleKey.fromBcs(T, data),
      bcs: RuleKey.bcs,
      fromJSONField: (field: any) => RuleKey.fromJSONField(T, field),
      __class: null as unknown as ReturnType<typeof RuleKey.new<ToTypeArgument<T>>>,
    }
  }

  static fromFields<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    fields: Record<string, any>
  ): RuleKey<ToPhantomTypeArgument<T>> {
    return RuleKey.new(typeArg, decodeFromFields('bool', fields.is_protected))
  }

  static fromFieldsWithTypes<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    item: FieldsWithTypes
  ): RuleKey<ToPhantomTypeArgument<T>> {
    if (!isRuleKey(item.type)) {
      throw new Error('not a RuleKey type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return RuleKey.new(typeArg, decodeFromFieldsWithTypes('bool', item.fields.is_protected))
  }

  static fromBcs<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    data: Uint8Array
  ): RuleKey<ToPhantomTypeArgument<T>> {
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

  static fromJSONField<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    field: any
  ): RuleKey<ToPhantomTypeArgument<T>> {
    return RuleKey.new(typeArg, decodeFromJSONField('bool', field.isProtected))
  }

  static fromJSON<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    json: Record<string, any>
  ): RuleKey<ToPhantomTypeArgument<T>> {
    if (json.$typeName !== RuleKey.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(RuleKey.$typeName, extractType(typeArg)),
      [json.$typeArg],
      [typeArg]
    )

    return RuleKey.fromJSONField(typeArg, json)
  }
}

/* ============================== ActionRequest =============================== */

export function isActionRequest(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::token::ActionRequest<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface ActionRequestFields<T extends PhantomTypeArgument> {
  name: ToField<String>
  amount: ToField<'u64'>
  sender: ToField<'address'>
  recipient: ToField<Option<'address'>>
  spentBalance: ToField<Option<Balance<T>>>
  approvals: ToField<VecSet<TypeName>>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class ActionRequest<T extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::token::ActionRequest'
  static readonly $numTypeParams = 1

  __reifiedFullTypeString = null as unknown as `0x2::token::ActionRequest<${T}>`

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
  readonly spentBalance: ToField<Option<Balance<T>>>
  readonly approvals: ToField<VecSet<TypeName>>

  private constructor(typeArg: string, fields: ActionRequestFields<T>) {
    this.$typeArg = typeArg

    this.name = fields.name
    this.amount = fields.amount
    this.sender = fields.sender
    this.recipient = fields.recipient
    this.spentBalance = fields.spentBalance
    this.approvals = fields.approvals
  }

  static new<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    fields: ActionRequestFields<ToPhantomTypeArgument<T>>
  ): ActionRequest<ToPhantomTypeArgument<T>> {
    return new ActionRequest(extractType(typeArg), fields)
  }

  static reified<T extends ReifiedPhantomTypeArgument>(T: T) {
    return {
      typeName: ActionRequest.$typeName,
      typeArgs: [T],
      fullTypeName: composeSuiType(
        ActionRequest.$typeName,
        ...[extractType(T)]
      ) as `0x2::token::ActionRequest<${ToPhantomTypeArgument<T>}>`,
      fromFields: (fields: Record<string, any>) => ActionRequest.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => ActionRequest.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => ActionRequest.fromBcs(T, data),
      bcs: ActionRequest.bcs,
      fromJSONField: (field: any) => ActionRequest.fromJSONField(T, field),
      __class: null as unknown as ReturnType<typeof ActionRequest.new<ToTypeArgument<T>>>,
    }
  }

  static fromFields<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    fields: Record<string, any>
  ): ActionRequest<ToPhantomTypeArgument<T>> {
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

  static fromFieldsWithTypes<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    item: FieldsWithTypes
  ): ActionRequest<ToPhantomTypeArgument<T>> {
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

  static fromBcs<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    data: Uint8Array
  ): ActionRequest<ToPhantomTypeArgument<T>> {
    return ActionRequest.fromFields(typeArg, ActionRequest.bcs.parse(data))
  }

  toJSONField() {
    return {
      name: this.name,
      amount: this.amount.toString(),
      sender: this.sender,
      recipient: fieldToJSON<Option<'address'>>(`0x1::option::Option<address>`, this.recipient),
      spentBalance: fieldToJSON<Option<Balance<T>>>(
        `0x1::option::Option<0x2::balance::Balance<${this.$typeArg}>>`,
        this.spentBalance
      ),
      approvals: this.approvals.toJSONField(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArg: this.$typeArg, ...this.toJSONField() }
  }

  static fromJSONField<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    field: any
  ): ActionRequest<ToPhantomTypeArgument<T>> {
    return ActionRequest.new(typeArg, {
      name: decodeFromJSONField(String.reified(), field.name),
      amount: decodeFromJSONField('u64', field.amount),
      sender: decodeFromJSONField('address', field.sender),
      recipient: decodeFromJSONField(Option.reified('address'), field.recipient),
      spentBalance: decodeFromJSONField(
        Option.reified(Balance.reified(typeArg)),
        field.spentBalance
      ),
      approvals: decodeFromJSONField(VecSet.reified(TypeName.reified()), field.approvals),
    })
  }

  static fromJSON<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    json: Record<string, any>
  ): ActionRequest<ToPhantomTypeArgument<T>> {
    if (json.$typeName !== ActionRequest.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(ActionRequest.$typeName, extractType(typeArg)),
      [json.$typeArg],
      [typeArg]
    )

    return ActionRequest.fromJSONField(typeArg, json)
  }
}

/* ============================== Token =============================== */

export function isToken(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::token::Token<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface TokenFields<T extends PhantomTypeArgument> {
  id: ToField<UID>
  balance: ToField<Balance<T>>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Token<T extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::token::Token'
  static readonly $numTypeParams = 1

  __reifiedFullTypeString = null as unknown as `0x2::token::Token<${T}>`

  readonly $typeName = Token.$typeName

  static get bcs() {
    return bcs.struct('Token', {
      id: UID.bcs,
      balance: Balance.bcs,
    })
  }

  readonly $typeArg: string

  readonly id: ToField<UID>
  readonly balance: ToField<Balance<T>>

  private constructor(typeArg: string, fields: TokenFields<T>) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.balance = fields.balance
  }

  static new<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    fields: TokenFields<ToPhantomTypeArgument<T>>
  ): Token<ToPhantomTypeArgument<T>> {
    return new Token(extractType(typeArg), fields)
  }

  static reified<T extends ReifiedPhantomTypeArgument>(T: T) {
    return {
      typeName: Token.$typeName,
      typeArgs: [T],
      fullTypeName: composeSuiType(
        Token.$typeName,
        ...[extractType(T)]
      ) as `0x2::token::Token<${ToPhantomTypeArgument<T>}>`,
      fromFields: (fields: Record<string, any>) => Token.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Token.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => Token.fromBcs(T, data),
      bcs: Token.bcs,
      fromJSONField: (field: any) => Token.fromJSONField(T, field),
      __class: null as unknown as ReturnType<typeof Token.new<ToTypeArgument<T>>>,
    }
  }

  static fromFields<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    fields: Record<string, any>
  ): Token<ToPhantomTypeArgument<T>> {
    return Token.new(typeArg, {
      id: decodeFromFields(UID.reified(), fields.id),
      balance: decodeFromFields(Balance.reified(typeArg), fields.balance),
    })
  }

  static fromFieldsWithTypes<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    item: FieldsWithTypes
  ): Token<ToPhantomTypeArgument<T>> {
    if (!isToken(item.type)) {
      throw new Error('not a Token type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Token.new(typeArg, {
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      balance: decodeFromFieldsWithTypes(Balance.reified(typeArg), item.fields.balance),
    })
  }

  static fromBcs<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    data: Uint8Array
  ): Token<ToPhantomTypeArgument<T>> {
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

  static fromJSONField<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    field: any
  ): Token<ToPhantomTypeArgument<T>> {
    return Token.new(typeArg, {
      id: decodeFromJSONField(UID.reified(), field.id),
      balance: decodeFromJSONField(Balance.reified(typeArg), field.balance),
    })
  }

  static fromJSON<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    json: Record<string, any>
  ): Token<ToPhantomTypeArgument<T>> {
    if (json.$typeName !== Token.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Token.$typeName, extractType(typeArg)),
      [json.$typeArg],
      [typeArg]
    )

    return Token.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    content: SuiParsedData
  ): Token<ToPhantomTypeArgument<T>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isToken(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Token object`)
    }
    return Token.fromFieldsWithTypes(typeArg, content)
  }

  static async fetch<T extends ReifiedPhantomTypeArgument>(
    client: SuiClient,
    typeArg: T,
    id: string
  ): Promise<Token<ToPhantomTypeArgument<T>>> {
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface TokenPolicyFields<T extends PhantomTypeArgument> {
  id: ToField<UID>
  spentBalance: ToField<Balance<T>>
  rules: ToField<VecMap<String, VecSet<TypeName>>>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class TokenPolicy<T extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::token::TokenPolicy'
  static readonly $numTypeParams = 1

  __reifiedFullTypeString = null as unknown as `0x2::token::TokenPolicy<${T}>`

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
  readonly spentBalance: ToField<Balance<T>>
  readonly rules: ToField<VecMap<String, VecSet<TypeName>>>

  private constructor(typeArg: string, fields: TokenPolicyFields<T>) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.spentBalance = fields.spentBalance
    this.rules = fields.rules
  }

  static new<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    fields: TokenPolicyFields<ToPhantomTypeArgument<T>>
  ): TokenPolicy<ToPhantomTypeArgument<T>> {
    return new TokenPolicy(extractType(typeArg), fields)
  }

  static reified<T extends ReifiedPhantomTypeArgument>(T: T) {
    return {
      typeName: TokenPolicy.$typeName,
      typeArgs: [T],
      fullTypeName: composeSuiType(
        TokenPolicy.$typeName,
        ...[extractType(T)]
      ) as `0x2::token::TokenPolicy<${ToPhantomTypeArgument<T>}>`,
      fromFields: (fields: Record<string, any>) => TokenPolicy.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => TokenPolicy.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => TokenPolicy.fromBcs(T, data),
      bcs: TokenPolicy.bcs,
      fromJSONField: (field: any) => TokenPolicy.fromJSONField(T, field),
      __class: null as unknown as ReturnType<typeof TokenPolicy.new<ToTypeArgument<T>>>,
    }
  }

  static fromFields<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    fields: Record<string, any>
  ): TokenPolicy<ToPhantomTypeArgument<T>> {
    return TokenPolicy.new(typeArg, {
      id: decodeFromFields(UID.reified(), fields.id),
      spentBalance: decodeFromFields(Balance.reified(typeArg), fields.spent_balance),
      rules: decodeFromFields(
        VecMap.reified(String.reified(), VecSet.reified(TypeName.reified())),
        fields.rules
      ),
    })
  }

  static fromFieldsWithTypes<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    item: FieldsWithTypes
  ): TokenPolicy<ToPhantomTypeArgument<T>> {
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

  static fromBcs<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    data: Uint8Array
  ): TokenPolicy<ToPhantomTypeArgument<T>> {
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

  static fromJSONField<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    field: any
  ): TokenPolicy<ToPhantomTypeArgument<T>> {
    return TokenPolicy.new(typeArg, {
      id: decodeFromJSONField(UID.reified(), field.id),
      spentBalance: decodeFromJSONField(Balance.reified(typeArg), field.spentBalance),
      rules: decodeFromJSONField(
        VecMap.reified(String.reified(), VecSet.reified(TypeName.reified())),
        field.rules
      ),
    })
  }

  static fromJSON<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    json: Record<string, any>
  ): TokenPolicy<ToPhantomTypeArgument<T>> {
    if (json.$typeName !== TokenPolicy.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(TokenPolicy.$typeName, extractType(typeArg)),
      [json.$typeArg],
      [typeArg]
    )

    return TokenPolicy.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    content: SuiParsedData
  ): TokenPolicy<ToPhantomTypeArgument<T>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isTokenPolicy(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a TokenPolicy object`)
    }
    return TokenPolicy.fromFieldsWithTypes(typeArg, content)
  }

  static async fetch<T extends ReifiedPhantomTypeArgument>(
    client: SuiClient,
    typeArg: T,
    id: string
  ): Promise<TokenPolicy<ToPhantomTypeArgument<T>>> {
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface TokenPolicyCapFields<T extends PhantomTypeArgument> {
  id: ToField<UID>
  for: ToField<ID>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class TokenPolicyCap<T extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::token::TokenPolicyCap'
  static readonly $numTypeParams = 1

  __reifiedFullTypeString = null as unknown as `0x2::token::TokenPolicyCap<${T}>`

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

  private constructor(typeArg: string, fields: TokenPolicyCapFields<T>) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.for = fields.for
  }

  static new<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    fields: TokenPolicyCapFields<ToPhantomTypeArgument<T>>
  ): TokenPolicyCap<ToPhantomTypeArgument<T>> {
    return new TokenPolicyCap(extractType(typeArg), fields)
  }

  static reified<T extends ReifiedPhantomTypeArgument>(T: T) {
    return {
      typeName: TokenPolicyCap.$typeName,
      typeArgs: [T],
      fullTypeName: composeSuiType(
        TokenPolicyCap.$typeName,
        ...[extractType(T)]
      ) as `0x2::token::TokenPolicyCap<${ToPhantomTypeArgument<T>}>`,
      fromFields: (fields: Record<string, any>) => TokenPolicyCap.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => TokenPolicyCap.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => TokenPolicyCap.fromBcs(T, data),
      bcs: TokenPolicyCap.bcs,
      fromJSONField: (field: any) => TokenPolicyCap.fromJSONField(T, field),
      __class: null as unknown as ReturnType<typeof TokenPolicyCap.new<ToTypeArgument<T>>>,
    }
  }

  static fromFields<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    fields: Record<string, any>
  ): TokenPolicyCap<ToPhantomTypeArgument<T>> {
    return TokenPolicyCap.new(typeArg, {
      id: decodeFromFields(UID.reified(), fields.id),
      for: decodeFromFields(ID.reified(), fields.for),
    })
  }

  static fromFieldsWithTypes<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    item: FieldsWithTypes
  ): TokenPolicyCap<ToPhantomTypeArgument<T>> {
    if (!isTokenPolicyCap(item.type)) {
      throw new Error('not a TokenPolicyCap type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return TokenPolicyCap.new(typeArg, {
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      for: decodeFromFieldsWithTypes(ID.reified(), item.fields.for),
    })
  }

  static fromBcs<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    data: Uint8Array
  ): TokenPolicyCap<ToPhantomTypeArgument<T>> {
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

  static fromJSONField<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    field: any
  ): TokenPolicyCap<ToPhantomTypeArgument<T>> {
    return TokenPolicyCap.new(typeArg, {
      id: decodeFromJSONField(UID.reified(), field.id),
      for: decodeFromJSONField(ID.reified(), field.for),
    })
  }

  static fromJSON<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    json: Record<string, any>
  ): TokenPolicyCap<ToPhantomTypeArgument<T>> {
    if (json.$typeName !== TokenPolicyCap.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(TokenPolicyCap.$typeName, extractType(typeArg)),
      [json.$typeArg],
      [typeArg]
    )

    return TokenPolicyCap.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    content: SuiParsedData
  ): TokenPolicyCap<ToPhantomTypeArgument<T>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isTokenPolicyCap(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a TokenPolicyCap object`)
    }
    return TokenPolicyCap.fromFieldsWithTypes(typeArg, content)
  }

  static async fetch<T extends ReifiedPhantomTypeArgument>(
    client: SuiClient,
    typeArg: T,
    id: string
  ): Promise<TokenPolicyCap<ToPhantomTypeArgument<T>>> {
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface TokenPolicyCreatedFields<T extends PhantomTypeArgument> {
  id: ToField<ID>
  isMutable: ToField<'bool'>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class TokenPolicyCreated<T extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::token::TokenPolicyCreated'
  static readonly $numTypeParams = 1

  __reifiedFullTypeString = null as unknown as `0x2::token::TokenPolicyCreated<${T}>`

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

  private constructor(typeArg: string, fields: TokenPolicyCreatedFields<T>) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.isMutable = fields.isMutable
  }

  static new<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    fields: TokenPolicyCreatedFields<ToPhantomTypeArgument<T>>
  ): TokenPolicyCreated<ToPhantomTypeArgument<T>> {
    return new TokenPolicyCreated(extractType(typeArg), fields)
  }

  static reified<T extends ReifiedPhantomTypeArgument>(T: T) {
    return {
      typeName: TokenPolicyCreated.$typeName,
      typeArgs: [T],
      fullTypeName: composeSuiType(
        TokenPolicyCreated.$typeName,
        ...[extractType(T)]
      ) as `0x2::token::TokenPolicyCreated<${ToPhantomTypeArgument<T>}>`,
      fromFields: (fields: Record<string, any>) => TokenPolicyCreated.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        TokenPolicyCreated.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => TokenPolicyCreated.fromBcs(T, data),
      bcs: TokenPolicyCreated.bcs,
      fromJSONField: (field: any) => TokenPolicyCreated.fromJSONField(T, field),
      __class: null as unknown as ReturnType<typeof TokenPolicyCreated.new<ToTypeArgument<T>>>,
    }
  }

  static fromFields<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    fields: Record<string, any>
  ): TokenPolicyCreated<ToPhantomTypeArgument<T>> {
    return TokenPolicyCreated.new(typeArg, {
      id: decodeFromFields(ID.reified(), fields.id),
      isMutable: decodeFromFields('bool', fields.is_mutable),
    })
  }

  static fromFieldsWithTypes<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    item: FieldsWithTypes
  ): TokenPolicyCreated<ToPhantomTypeArgument<T>> {
    if (!isTokenPolicyCreated(item.type)) {
      throw new Error('not a TokenPolicyCreated type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return TokenPolicyCreated.new(typeArg, {
      id: decodeFromFieldsWithTypes(ID.reified(), item.fields.id),
      isMutable: decodeFromFieldsWithTypes('bool', item.fields.is_mutable),
    })
  }

  static fromBcs<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    data: Uint8Array
  ): TokenPolicyCreated<ToPhantomTypeArgument<T>> {
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

  static fromJSONField<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    field: any
  ): TokenPolicyCreated<ToPhantomTypeArgument<T>> {
    return TokenPolicyCreated.new(typeArg, {
      id: decodeFromJSONField(ID.reified(), field.id),
      isMutable: decodeFromJSONField('bool', field.isMutable),
    })
  }

  static fromJSON<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    json: Record<string, any>
  ): TokenPolicyCreated<ToPhantomTypeArgument<T>> {
    if (json.$typeName !== TokenPolicyCreated.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(TokenPolicyCreated.$typeName, extractType(typeArg)),
      [json.$typeArg],
      [typeArg]
    )

    return TokenPolicyCreated.fromJSONField(typeArg, json)
  }
}
