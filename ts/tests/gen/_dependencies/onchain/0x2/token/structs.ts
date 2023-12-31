import {
  FieldsWithTypes,
  Type,
  compressSuiType,
  genericToJSON,
  parseTypeName,
} from '../../../../_framework/util'
import { Option } from '../../0x1/option/structs'
import { String } from '../../0x1/string/structs'
import { TypeName } from '../../0x1/type-name/structs'
import { Balance } from '../balance/structs'
import { ID, UID } from '../object/structs'
import { VecMap } from '../vec-map/structs'
import { VecSet } from '../vec-set/structs'
import { bcs, fromHEX, toHEX } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== Token =============================== */

export function isToken(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::token::Token<')
}

export interface TokenFields {
  id: string
  balance: Balance
}

export class Token {
  static readonly $typeName = '0x2::token::Token'
  static readonly $numTypeParams = 1

  static get bcs() {
    return bcs.struct('Token', {
      id: UID.bcs,
      balance: Balance.bcs,
    })
  }

  readonly $typeArg: Type

  readonly id: string
  readonly balance: Balance

  constructor(typeArg: Type, fields: TokenFields) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.balance = fields.balance
  }

  static fromFields(typeArg: Type, fields: Record<string, any>): Token {
    return new Token(typeArg, {
      id: UID.fromFields(fields.id).id,
      balance: Balance.fromFields(`${typeArg}`, fields.balance),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Token {
    if (!isToken(item.type)) {
      throw new Error('not a Token type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new Token(typeArgs[0], {
      id: item.fields.id.id,
      balance: new Balance(`${typeArgs[0]}`, BigInt(item.fields.balance)),
    })
  }

  static fromBcs(typeArg: Type, data: Uint8Array): Token {
    return Token.fromFields(typeArg, Token.bcs.parse(data))
  }

  toJSON() {
    return {
      $typeArg: this.$typeArg,
      id: this.id,
      balance: this.balance.toJSON(),
    }
  }

  static fromSuiParsedData(content: SuiParsedData) {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isToken(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Token object`)
    }
    return Token.fromFieldsWithTypes(content)
  }

  static async fetch(client: SuiClient, id: string): Promise<Token> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching Token object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isToken(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a Token object`)
    }
    return Token.fromFieldsWithTypes(res.data.content)
  }
}

/* ============================== TokenPolicyCap =============================== */

export function isTokenPolicyCap(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::token::TokenPolicyCap<')
}

export interface TokenPolicyCapFields {
  id: string
  for: string
}

export class TokenPolicyCap {
  static readonly $typeName = '0x2::token::TokenPolicyCap'
  static readonly $numTypeParams = 1

  static get bcs() {
    return bcs.struct('TokenPolicyCap', {
      id: UID.bcs,
      for: ID.bcs,
    })
  }

  readonly $typeArg: Type

  readonly id: string
  readonly for: string

  constructor(typeArg: Type, fields: TokenPolicyCapFields) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.for = fields.for
  }

  static fromFields(typeArg: Type, fields: Record<string, any>): TokenPolicyCap {
    return new TokenPolicyCap(typeArg, {
      id: UID.fromFields(fields.id).id,
      for: ID.fromFields(fields.for).bytes,
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): TokenPolicyCap {
    if (!isTokenPolicyCap(item.type)) {
      throw new Error('not a TokenPolicyCap type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new TokenPolicyCap(typeArgs[0], { id: item.fields.id.id, for: item.fields.for })
  }

  static fromBcs(typeArg: Type, data: Uint8Array): TokenPolicyCap {
    return TokenPolicyCap.fromFields(typeArg, TokenPolicyCap.bcs.parse(data))
  }

  toJSON() {
    return {
      $typeArg: this.$typeArg,
      id: this.id,
      for: this.for,
    }
  }

  static fromSuiParsedData(content: SuiParsedData) {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isTokenPolicyCap(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a TokenPolicyCap object`)
    }
    return TokenPolicyCap.fromFieldsWithTypes(content)
  }

  static async fetch(client: SuiClient, id: string): Promise<TokenPolicyCap> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching TokenPolicyCap object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isTokenPolicyCap(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a TokenPolicyCap object`)
    }
    return TokenPolicyCap.fromFieldsWithTypes(res.data.content)
  }
}

/* ============================== TokenPolicy =============================== */

export function isTokenPolicy(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::token::TokenPolicy<')
}

export interface TokenPolicyFields {
  id: string
  spentBalance: Balance
  rules: VecMap<string, VecSet<TypeName>>
}

export class TokenPolicy {
  static readonly $typeName = '0x2::token::TokenPolicy'
  static readonly $numTypeParams = 1

  static get bcs() {
    return bcs.struct('TokenPolicy', {
      id: UID.bcs,
      spent_balance: Balance.bcs,
      rules: VecMap.bcs(String.bcs, VecSet.bcs(TypeName.bcs)),
    })
  }

  readonly $typeArg: Type

  readonly id: string
  readonly spentBalance: Balance
  readonly rules: VecMap<string, VecSet<TypeName>>

  constructor(typeArg: Type, fields: TokenPolicyFields) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.spentBalance = fields.spentBalance
    this.rules = fields.rules
  }

  static fromFields(typeArg: Type, fields: Record<string, any>): TokenPolicy {
    return new TokenPolicy(typeArg, {
      id: UID.fromFields(fields.id).id,
      spentBalance: Balance.fromFields(`${typeArg}`, fields.spent_balance),
      rules: VecMap.fromFields<string, VecSet<TypeName>>(
        [`0x1::string::String`, `0x2::vec_set::VecSet<0x1::type_name::TypeName>`],
        fields.rules
      ),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): TokenPolicy {
    if (!isTokenPolicy(item.type)) {
      throw new Error('not a TokenPolicy type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new TokenPolicy(typeArgs[0], {
      id: item.fields.id.id,
      spentBalance: new Balance(`${typeArgs[0]}`, BigInt(item.fields.spent_balance)),
      rules: VecMap.fromFieldsWithTypes<string, VecSet<TypeName>>(item.fields.rules),
    })
  }

  static fromBcs(typeArg: Type, data: Uint8Array): TokenPolicy {
    return TokenPolicy.fromFields(typeArg, TokenPolicy.bcs.parse(data))
  }

  toJSON() {
    return {
      $typeArg: this.$typeArg,
      id: this.id,
      spentBalance: this.spentBalance.toJSON(),
      rules: this.rules.toJSON(),
    }
  }

  static fromSuiParsedData(content: SuiParsedData) {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isTokenPolicy(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a TokenPolicy object`)
    }
    return TokenPolicy.fromFieldsWithTypes(content)
  }

  static async fetch(client: SuiClient, id: string): Promise<TokenPolicy> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching TokenPolicy object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isTokenPolicy(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a TokenPolicy object`)
    }
    return TokenPolicy.fromFieldsWithTypes(res.data.content)
  }
}

/* ============================== ActionRequest =============================== */

export function isActionRequest(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::token::ActionRequest<')
}

export interface ActionRequestFields {
  name: string
  amount: bigint
  sender: string
  recipient: string | null
  spentBalance: Balance | null
  approvals: VecSet<TypeName>
}

export class ActionRequest {
  static readonly $typeName = '0x2::token::ActionRequest'
  static readonly $numTypeParams = 1

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

  readonly $typeArg: Type

  readonly name: string
  readonly amount: bigint
  readonly sender: string
  readonly recipient: string | null
  readonly spentBalance: Balance | null
  readonly approvals: VecSet<TypeName>

  constructor(typeArg: Type, fields: ActionRequestFields) {
    this.$typeArg = typeArg

    this.name = fields.name
    this.amount = fields.amount
    this.sender = fields.sender
    this.recipient = fields.recipient
    this.spentBalance = fields.spentBalance
    this.approvals = fields.approvals
  }

  static fromFields(typeArg: Type, fields: Record<string, any>): ActionRequest {
    return new ActionRequest(typeArg, {
      name: new TextDecoder()
        .decode(Uint8Array.from(String.fromFields(fields.name).bytes))
        .toString(),
      amount: BigInt(fields.amount),
      sender: `0x${fields.sender}`,
      recipient: Option.fromFields<string>(`address`, fields.recipient).vec[0] || null,
      spentBalance:
        Option.fromFields<Balance>(`0x2::balance::Balance<${typeArg}>`, fields.spent_balance)
          .vec[0] || null,
      approvals: VecSet.fromFields<TypeName>(`0x1::type_name::TypeName`, fields.approvals),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): ActionRequest {
    if (!isActionRequest(item.type)) {
      throw new Error('not a ActionRequest type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new ActionRequest(typeArgs[0], {
      name: item.fields.name,
      amount: BigInt(item.fields.amount),
      sender: `0x${item.fields.sender}`,
      recipient:
        item.fields.recipient !== null
          ? Option.fromFieldsWithTypes<string>({
              type: '0x1::option::Option<' + `address` + '>',
              fields: { vec: [item.fields.recipient] },
            }).vec[0]
          : null,
      spentBalance:
        item.fields.spent_balance !== null
          ? Option.fromFieldsWithTypes<Balance>({
              type: '0x1::option::Option<' + `0x2::balance::Balance<${typeArgs[0]}>` + '>',
              fields: { vec: [item.fields.spent_balance] },
            }).vec[0]
          : null,
      approvals: VecSet.fromFieldsWithTypes<TypeName>(item.fields.approvals),
    })
  }

  static fromBcs(typeArg: Type, data: Uint8Array): ActionRequest {
    return ActionRequest.fromFields(typeArg, ActionRequest.bcs.parse(data))
  }

  toJSON() {
    return {
      $typeArg: this.$typeArg,
      name: this.name,
      amount: this.amount.toString(),
      sender: this.sender,
      recipient: genericToJSON(`0x1::option::Option<address>`, this.recipient),
      spentBalance: genericToJSON(
        `0x1::option::Option<0x2::balance::Balance<${this.$typeArg}>>`,
        this.spentBalance
      ),
      approvals: this.approvals.toJSON(),
    }
  }
}

/* ============================== RuleKey =============================== */

export function isRuleKey(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::token::RuleKey<')
}

export interface RuleKeyFields {
  isProtected: boolean
}

export class RuleKey {
  static readonly $typeName = '0x2::token::RuleKey'
  static readonly $numTypeParams = 1

  static get bcs() {
    return bcs.struct('RuleKey', {
      is_protected: bcs.bool(),
    })
  }

  readonly $typeArg: Type

  readonly isProtected: boolean

  constructor(typeArg: Type, isProtected: boolean) {
    this.$typeArg = typeArg

    this.isProtected = isProtected
  }

  static fromFields(typeArg: Type, fields: Record<string, any>): RuleKey {
    return new RuleKey(typeArg, fields.is_protected)
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): RuleKey {
    if (!isRuleKey(item.type)) {
      throw new Error('not a RuleKey type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new RuleKey(typeArgs[0], item.fields.is_protected)
  }

  static fromBcs(typeArg: Type, data: Uint8Array): RuleKey {
    return RuleKey.fromFields(typeArg, RuleKey.bcs.parse(data))
  }

  toJSON() {
    return {
      $typeArg: this.$typeArg,
      isProtected: this.isProtected,
    }
  }
}

/* ============================== TokenPolicyCreated =============================== */

export function isTokenPolicyCreated(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::token::TokenPolicyCreated<')
}

export interface TokenPolicyCreatedFields {
  id: string
  isMutable: boolean
}

export class TokenPolicyCreated {
  static readonly $typeName = '0x2::token::TokenPolicyCreated'
  static readonly $numTypeParams = 1

  static get bcs() {
    return bcs.struct('TokenPolicyCreated', {
      id: ID.bcs,
      is_mutable: bcs.bool(),
    })
  }

  readonly $typeArg: Type

  readonly id: string
  readonly isMutable: boolean

  constructor(typeArg: Type, fields: TokenPolicyCreatedFields) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.isMutable = fields.isMutable
  }

  static fromFields(typeArg: Type, fields: Record<string, any>): TokenPolicyCreated {
    return new TokenPolicyCreated(typeArg, {
      id: ID.fromFields(fields.id).bytes,
      isMutable: fields.is_mutable,
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): TokenPolicyCreated {
    if (!isTokenPolicyCreated(item.type)) {
      throw new Error('not a TokenPolicyCreated type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new TokenPolicyCreated(typeArgs[0], {
      id: item.fields.id,
      isMutable: item.fields.is_mutable,
    })
  }

  static fromBcs(typeArg: Type, data: Uint8Array): TokenPolicyCreated {
    return TokenPolicyCreated.fromFields(typeArg, TokenPolicyCreated.bcs.parse(data))
  }

  toJSON() {
    return {
      $typeArg: this.$typeArg,
      id: this.id,
      isMutable: this.isMutable,
    }
  }
}
