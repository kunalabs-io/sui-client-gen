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
import { Option } from '../../move-stdlib-chain/option/structs'
import { String } from '../../move-stdlib-chain/string/structs'
import { TypeName } from '../../move-stdlib-chain/type-name/structs'
import { Balance } from '../balance/structs'
import { ID, UID } from '../object/structs'
import { VecMap } from '../vec-map/structs'
import { VecSet } from '../vec-set/structs'
import { bcs, fromHEX, toHEX } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== Token =============================== */

export function isToken(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::token::Token<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface TokenFields<T0 extends PhantomTypeArgument> {
  id: ToField<UID>
  balance: ToField<Balance<T0>>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Token<T0 extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::token::Token'
  static readonly $numTypeParams = 1

  __reifiedFullTypeString = null as unknown as `0x2::token::Token<${T0}>`

  readonly $typeName = Token.$typeName

  static get bcs() {
    return bcs.struct('Token', {
      id: UID.bcs,
      balance: Balance.bcs,
    })
  }

  readonly $typeArg: string

  readonly id: ToField<UID>
  readonly balance: ToField<Balance<T0>>

  private constructor(typeArg: string, fields: TokenFields<T0>) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.balance = fields.balance
  }

  static new<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    fields: TokenFields<ToPhantomTypeArgument<T0>>
  ): Token<ToPhantomTypeArgument<T0>> {
    return new Token(extractType(typeArg), fields)
  }

  static reified<T0 extends ReifiedPhantomTypeArgument>(T0: T0) {
    return {
      typeName: Token.$typeName,
      typeArgs: [T0],
      fullTypeName: composeSuiType(
        Token.$typeName,
        ...[extractType(T0)]
      ) as `0x2::token::Token<${ToPhantomTypeArgument<T0>}>`,
      fromFields: (fields: Record<string, any>) => Token.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Token.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => Token.fromBcs(T0, data),
      bcs: Token.bcs,
      fromJSONField: (field: any) => Token.fromJSONField(T0, field),
      __class: null as unknown as ReturnType<typeof Token.new<ToTypeArgument<T0>>>,
    }
  }

  static fromFields<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    fields: Record<string, any>
  ): Token<ToPhantomTypeArgument<T0>> {
    return Token.new(typeArg, {
      id: decodeFromFields(UID.reified(), fields.id),
      balance: decodeFromFields(Balance.reified(typeArg), fields.balance),
    })
  }

  static fromFieldsWithTypes<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    item: FieldsWithTypes
  ): Token<ToPhantomTypeArgument<T0>> {
    if (!isToken(item.type)) {
      throw new Error('not a Token type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Token.new(typeArg, {
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      balance: decodeFromFieldsWithTypes(Balance.reified(typeArg), item.fields.balance),
    })
  }

  static fromBcs<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    data: Uint8Array
  ): Token<ToPhantomTypeArgument<T0>> {
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

  static fromJSONField<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    field: any
  ): Token<ToPhantomTypeArgument<T0>> {
    return Token.new(typeArg, {
      id: decodeFromJSONField(UID.reified(), field.id),
      balance: decodeFromJSONField(Balance.reified(typeArg), field.balance),
    })
  }

  static fromJSON<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    json: Record<string, any>
  ): Token<ToPhantomTypeArgument<T0>> {
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

  static fromSuiParsedData<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    content: SuiParsedData
  ): Token<ToPhantomTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isToken(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Token object`)
    }
    return Token.fromFieldsWithTypes(typeArg, content)
  }

  static async fetch<T0 extends ReifiedPhantomTypeArgument>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<Token<ToPhantomTypeArgument<T0>>> {
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

/* ============================== TokenPolicyCap =============================== */

export function isTokenPolicyCap(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::token::TokenPolicyCap<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface TokenPolicyCapFields<T0 extends PhantomTypeArgument> {
  id: ToField<UID>
  for: ToField<ID>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class TokenPolicyCap<T0 extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::token::TokenPolicyCap'
  static readonly $numTypeParams = 1

  __reifiedFullTypeString = null as unknown as `0x2::token::TokenPolicyCap<${T0}>`

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

  private constructor(typeArg: string, fields: TokenPolicyCapFields<T0>) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.for = fields.for
  }

  static new<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    fields: TokenPolicyCapFields<ToPhantomTypeArgument<T0>>
  ): TokenPolicyCap<ToPhantomTypeArgument<T0>> {
    return new TokenPolicyCap(extractType(typeArg), fields)
  }

  static reified<T0 extends ReifiedPhantomTypeArgument>(T0: T0) {
    return {
      typeName: TokenPolicyCap.$typeName,
      typeArgs: [T0],
      fullTypeName: composeSuiType(
        TokenPolicyCap.$typeName,
        ...[extractType(T0)]
      ) as `0x2::token::TokenPolicyCap<${ToPhantomTypeArgument<T0>}>`,
      fromFields: (fields: Record<string, any>) => TokenPolicyCap.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => TokenPolicyCap.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => TokenPolicyCap.fromBcs(T0, data),
      bcs: TokenPolicyCap.bcs,
      fromJSONField: (field: any) => TokenPolicyCap.fromJSONField(T0, field),
      __class: null as unknown as ReturnType<typeof TokenPolicyCap.new<ToTypeArgument<T0>>>,
    }
  }

  static fromFields<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    fields: Record<string, any>
  ): TokenPolicyCap<ToPhantomTypeArgument<T0>> {
    return TokenPolicyCap.new(typeArg, {
      id: decodeFromFields(UID.reified(), fields.id),
      for: decodeFromFields(ID.reified(), fields.for),
    })
  }

  static fromFieldsWithTypes<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    item: FieldsWithTypes
  ): TokenPolicyCap<ToPhantomTypeArgument<T0>> {
    if (!isTokenPolicyCap(item.type)) {
      throw new Error('not a TokenPolicyCap type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return TokenPolicyCap.new(typeArg, {
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      for: decodeFromFieldsWithTypes(ID.reified(), item.fields.for),
    })
  }

  static fromBcs<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    data: Uint8Array
  ): TokenPolicyCap<ToPhantomTypeArgument<T0>> {
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

  static fromJSONField<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    field: any
  ): TokenPolicyCap<ToPhantomTypeArgument<T0>> {
    return TokenPolicyCap.new(typeArg, {
      id: decodeFromJSONField(UID.reified(), field.id),
      for: decodeFromJSONField(ID.reified(), field.for),
    })
  }

  static fromJSON<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    json: Record<string, any>
  ): TokenPolicyCap<ToPhantomTypeArgument<T0>> {
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

  static fromSuiParsedData<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    content: SuiParsedData
  ): TokenPolicyCap<ToPhantomTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isTokenPolicyCap(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a TokenPolicyCap object`)
    }
    return TokenPolicyCap.fromFieldsWithTypes(typeArg, content)
  }

  static async fetch<T0 extends ReifiedPhantomTypeArgument>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<TokenPolicyCap<ToPhantomTypeArgument<T0>>> {
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

/* ============================== TokenPolicy =============================== */

export function isTokenPolicy(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::token::TokenPolicy<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface TokenPolicyFields<T0 extends PhantomTypeArgument> {
  id: ToField<UID>
  spentBalance: ToField<Balance<T0>>
  rules: ToField<VecMap<String, VecSet<TypeName>>>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class TokenPolicy<T0 extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::token::TokenPolicy'
  static readonly $numTypeParams = 1

  __reifiedFullTypeString = null as unknown as `0x2::token::TokenPolicy<${T0}>`

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
  readonly spentBalance: ToField<Balance<T0>>
  readonly rules: ToField<VecMap<String, VecSet<TypeName>>>

  private constructor(typeArg: string, fields: TokenPolicyFields<T0>) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.spentBalance = fields.spentBalance
    this.rules = fields.rules
  }

  static new<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    fields: TokenPolicyFields<ToPhantomTypeArgument<T0>>
  ): TokenPolicy<ToPhantomTypeArgument<T0>> {
    return new TokenPolicy(extractType(typeArg), fields)
  }

  static reified<T0 extends ReifiedPhantomTypeArgument>(T0: T0) {
    return {
      typeName: TokenPolicy.$typeName,
      typeArgs: [T0],
      fullTypeName: composeSuiType(
        TokenPolicy.$typeName,
        ...[extractType(T0)]
      ) as `0x2::token::TokenPolicy<${ToPhantomTypeArgument<T0>}>`,
      fromFields: (fields: Record<string, any>) => TokenPolicy.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => TokenPolicy.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => TokenPolicy.fromBcs(T0, data),
      bcs: TokenPolicy.bcs,
      fromJSONField: (field: any) => TokenPolicy.fromJSONField(T0, field),
      __class: null as unknown as ReturnType<typeof TokenPolicy.new<ToTypeArgument<T0>>>,
    }
  }

  static fromFields<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    fields: Record<string, any>
  ): TokenPolicy<ToPhantomTypeArgument<T0>> {
    return TokenPolicy.new(typeArg, {
      id: decodeFromFields(UID.reified(), fields.id),
      spentBalance: decodeFromFields(Balance.reified(typeArg), fields.spent_balance),
      rules: decodeFromFields(
        VecMap.reified(String.reified(), VecSet.reified(TypeName.reified())),
        fields.rules
      ),
    })
  }

  static fromFieldsWithTypes<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    item: FieldsWithTypes
  ): TokenPolicy<ToPhantomTypeArgument<T0>> {
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

  static fromBcs<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    data: Uint8Array
  ): TokenPolicy<ToPhantomTypeArgument<T0>> {
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

  static fromJSONField<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    field: any
  ): TokenPolicy<ToPhantomTypeArgument<T0>> {
    return TokenPolicy.new(typeArg, {
      id: decodeFromJSONField(UID.reified(), field.id),
      spentBalance: decodeFromJSONField(Balance.reified(typeArg), field.spentBalance),
      rules: decodeFromJSONField(
        VecMap.reified(String.reified(), VecSet.reified(TypeName.reified())),
        field.rules
      ),
    })
  }

  static fromJSON<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    json: Record<string, any>
  ): TokenPolicy<ToPhantomTypeArgument<T0>> {
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

  static fromSuiParsedData<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    content: SuiParsedData
  ): TokenPolicy<ToPhantomTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isTokenPolicy(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a TokenPolicy object`)
    }
    return TokenPolicy.fromFieldsWithTypes(typeArg, content)
  }

  static async fetch<T0 extends ReifiedPhantomTypeArgument>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<TokenPolicy<ToPhantomTypeArgument<T0>>> {
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

/* ============================== ActionRequest =============================== */

export function isActionRequest(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::token::ActionRequest<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface ActionRequestFields<T0 extends PhantomTypeArgument> {
  name: ToField<String>
  amount: ToField<'u64'>
  sender: ToField<'address'>
  recipient: ToField<Option<'address'>>
  spentBalance: ToField<Option<Balance<T0>>>
  approvals: ToField<VecSet<TypeName>>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class ActionRequest<T0 extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::token::ActionRequest'
  static readonly $numTypeParams = 1

  __reifiedFullTypeString = null as unknown as `0x2::token::ActionRequest<${T0}>`

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
  readonly spentBalance: ToField<Option<Balance<T0>>>
  readonly approvals: ToField<VecSet<TypeName>>

  private constructor(typeArg: string, fields: ActionRequestFields<T0>) {
    this.$typeArg = typeArg

    this.name = fields.name
    this.amount = fields.amount
    this.sender = fields.sender
    this.recipient = fields.recipient
    this.spentBalance = fields.spentBalance
    this.approvals = fields.approvals
  }

  static new<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    fields: ActionRequestFields<ToPhantomTypeArgument<T0>>
  ): ActionRequest<ToPhantomTypeArgument<T0>> {
    return new ActionRequest(extractType(typeArg), fields)
  }

  static reified<T0 extends ReifiedPhantomTypeArgument>(T0: T0) {
    return {
      typeName: ActionRequest.$typeName,
      typeArgs: [T0],
      fullTypeName: composeSuiType(
        ActionRequest.$typeName,
        ...[extractType(T0)]
      ) as `0x2::token::ActionRequest<${ToPhantomTypeArgument<T0>}>`,
      fromFields: (fields: Record<string, any>) => ActionRequest.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => ActionRequest.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => ActionRequest.fromBcs(T0, data),
      bcs: ActionRequest.bcs,
      fromJSONField: (field: any) => ActionRequest.fromJSONField(T0, field),
      __class: null as unknown as ReturnType<typeof ActionRequest.new<ToTypeArgument<T0>>>,
    }
  }

  static fromFields<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    fields: Record<string, any>
  ): ActionRequest<ToPhantomTypeArgument<T0>> {
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

  static fromFieldsWithTypes<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    item: FieldsWithTypes
  ): ActionRequest<ToPhantomTypeArgument<T0>> {
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

  static fromBcs<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    data: Uint8Array
  ): ActionRequest<ToPhantomTypeArgument<T0>> {
    return ActionRequest.fromFields(typeArg, ActionRequest.bcs.parse(data))
  }

  toJSONField() {
    return {
      name: this.name,
      amount: this.amount.toString(),
      sender: this.sender,
      recipient: fieldToJSON<Option<'address'>>(`0x1::option::Option<address>`, this.recipient),
      spentBalance: fieldToJSON<Option<Balance<T0>>>(
        `0x1::option::Option<0x2::balance::Balance<${this.$typeArg}>>`,
        this.spentBalance
      ),
      approvals: this.approvals.toJSONField(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArg: this.$typeArg, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    field: any
  ): ActionRequest<ToPhantomTypeArgument<T0>> {
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

  static fromJSON<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    json: Record<string, any>
  ): ActionRequest<ToPhantomTypeArgument<T0>> {
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

/* ============================== RuleKey =============================== */

export function isRuleKey(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::token::RuleKey<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface RuleKeyFields<T0 extends PhantomTypeArgument> {
  isProtected: ToField<'bool'>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class RuleKey<T0 extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::token::RuleKey'
  static readonly $numTypeParams = 1

  __reifiedFullTypeString = null as unknown as `0x2::token::RuleKey<${T0}>`

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

  static new<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    isProtected: ToField<'bool'>
  ): RuleKey<ToPhantomTypeArgument<T0>> {
    return new RuleKey(extractType(typeArg), isProtected)
  }

  static reified<T0 extends ReifiedPhantomTypeArgument>(T0: T0) {
    return {
      typeName: RuleKey.$typeName,
      typeArgs: [T0],
      fullTypeName: composeSuiType(
        RuleKey.$typeName,
        ...[extractType(T0)]
      ) as `0x2::token::RuleKey<${ToPhantomTypeArgument<T0>}>`,
      fromFields: (fields: Record<string, any>) => RuleKey.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => RuleKey.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => RuleKey.fromBcs(T0, data),
      bcs: RuleKey.bcs,
      fromJSONField: (field: any) => RuleKey.fromJSONField(T0, field),
      __class: null as unknown as ReturnType<typeof RuleKey.new<ToTypeArgument<T0>>>,
    }
  }

  static fromFields<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    fields: Record<string, any>
  ): RuleKey<ToPhantomTypeArgument<T0>> {
    return RuleKey.new(typeArg, decodeFromFields('bool', fields.is_protected))
  }

  static fromFieldsWithTypes<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    item: FieldsWithTypes
  ): RuleKey<ToPhantomTypeArgument<T0>> {
    if (!isRuleKey(item.type)) {
      throw new Error('not a RuleKey type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return RuleKey.new(typeArg, decodeFromFieldsWithTypes('bool', item.fields.is_protected))
  }

  static fromBcs<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    data: Uint8Array
  ): RuleKey<ToPhantomTypeArgument<T0>> {
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

  static fromJSONField<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    field: any
  ): RuleKey<ToPhantomTypeArgument<T0>> {
    return RuleKey.new(typeArg, decodeFromJSONField('bool', field.isProtected))
  }

  static fromJSON<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    json: Record<string, any>
  ): RuleKey<ToPhantomTypeArgument<T0>> {
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

/* ============================== TokenPolicyCreated =============================== */

export function isTokenPolicyCreated(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::token::TokenPolicyCreated<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface TokenPolicyCreatedFields<T0 extends PhantomTypeArgument> {
  id: ToField<ID>
  isMutable: ToField<'bool'>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class TokenPolicyCreated<T0 extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::token::TokenPolicyCreated'
  static readonly $numTypeParams = 1

  __reifiedFullTypeString = null as unknown as `0x2::token::TokenPolicyCreated<${T0}>`

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

  private constructor(typeArg: string, fields: TokenPolicyCreatedFields<T0>) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.isMutable = fields.isMutable
  }

  static new<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    fields: TokenPolicyCreatedFields<ToPhantomTypeArgument<T0>>
  ): TokenPolicyCreated<ToPhantomTypeArgument<T0>> {
    return new TokenPolicyCreated(extractType(typeArg), fields)
  }

  static reified<T0 extends ReifiedPhantomTypeArgument>(T0: T0) {
    return {
      typeName: TokenPolicyCreated.$typeName,
      typeArgs: [T0],
      fullTypeName: composeSuiType(
        TokenPolicyCreated.$typeName,
        ...[extractType(T0)]
      ) as `0x2::token::TokenPolicyCreated<${ToPhantomTypeArgument<T0>}>`,
      fromFields: (fields: Record<string, any>) => TokenPolicyCreated.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        TokenPolicyCreated.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => TokenPolicyCreated.fromBcs(T0, data),
      bcs: TokenPolicyCreated.bcs,
      fromJSONField: (field: any) => TokenPolicyCreated.fromJSONField(T0, field),
      __class: null as unknown as ReturnType<typeof TokenPolicyCreated.new<ToTypeArgument<T0>>>,
    }
  }

  static fromFields<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    fields: Record<string, any>
  ): TokenPolicyCreated<ToPhantomTypeArgument<T0>> {
    return TokenPolicyCreated.new(typeArg, {
      id: decodeFromFields(ID.reified(), fields.id),
      isMutable: decodeFromFields('bool', fields.is_mutable),
    })
  }

  static fromFieldsWithTypes<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    item: FieldsWithTypes
  ): TokenPolicyCreated<ToPhantomTypeArgument<T0>> {
    if (!isTokenPolicyCreated(item.type)) {
      throw new Error('not a TokenPolicyCreated type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return TokenPolicyCreated.new(typeArg, {
      id: decodeFromFieldsWithTypes(ID.reified(), item.fields.id),
      isMutable: decodeFromFieldsWithTypes('bool', item.fields.is_mutable),
    })
  }

  static fromBcs<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    data: Uint8Array
  ): TokenPolicyCreated<ToPhantomTypeArgument<T0>> {
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

  static fromJSONField<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    field: any
  ): TokenPolicyCreated<ToPhantomTypeArgument<T0>> {
    return TokenPolicyCreated.new(typeArg, {
      id: decodeFromJSONField(ID.reified(), field.id),
      isMutable: decodeFromJSONField('bool', field.isMutable),
    })
  }

  static fromJSON<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    json: Record<string, any>
  ): TokenPolicyCreated<ToPhantomTypeArgument<T0>> {
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
