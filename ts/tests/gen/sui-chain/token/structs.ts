import {
  PhantomReified,
  PhantomToTypeStr,
  PhantomTypeArgument,
  Reified,
  StructClass,
  ToField,
  ToPhantomTypeArgument,
  ToTypeStr,
  assertFieldsWithTypesArgsMatch,
  assertReifiedTypeArgsMatch,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  extractType,
  fieldToJSON,
  phantom,
} from '../../_framework/reified'
import {
  FieldsWithTypes,
  composeSuiType,
  compressSuiType,
  parseTypeName,
} from '../../_framework/util'
import { Option } from '../../move-stdlib-chain/option/structs'
import { String } from '../../move-stdlib-chain/string/structs'
import { TypeName } from '../../move-stdlib-chain/type-name/structs'
import { Balance } from '../balance/structs'
import { PKG_V27 } from '../index'
import { ID, UID } from '../object/structs'
import { VecMap } from '../vec-map/structs'
import { VecSet } from '../vec-set/structs'
import { bcs } from '@mysten/sui/bcs'
import { SuiClient, SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromB64, fromHEX, toHEX } from '@mysten/sui/utils'

/* ============================== ActionRequest =============================== */

export function isActionRequest(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`${PKG_V27}::token::ActionRequest` + '<')
}

export interface ActionRequestFields<T0 extends PhantomTypeArgument> {
  name: ToField<String>
  amount: ToField<'u64'>
  sender: ToField<'address'>
  recipient: ToField<Option<'address'>>
  spentBalance: ToField<Option<Balance<T0>>>
  approvals: ToField<VecSet<TypeName>>
}

export type ActionRequestReified<T0 extends PhantomTypeArgument> = Reified<
  ActionRequest<T0>,
  ActionRequestFields<T0>
>

export class ActionRequest<T0 extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `${PKG_V27}::token::ActionRequest`
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName = ActionRequest.$typeName
  readonly $fullTypeName: `${typeof PKG_V27}::token::ActionRequest<${PhantomToTypeStr<T0>}>`
  readonly $typeArgs: [PhantomToTypeStr<T0>]
  readonly $isPhantom = ActionRequest.$isPhantom

  readonly name: ToField<String>
  readonly amount: ToField<'u64'>
  readonly sender: ToField<'address'>
  readonly recipient: ToField<Option<'address'>>
  readonly spentBalance: ToField<Option<Balance<T0>>>
  readonly approvals: ToField<VecSet<TypeName>>

  private constructor(typeArgs: [PhantomToTypeStr<T0>], fields: ActionRequestFields<T0>) {
    this.$fullTypeName = composeSuiType(
      ActionRequest.$typeName,
      ...typeArgs
    ) as `${typeof PKG_V27}::token::ActionRequest<${PhantomToTypeStr<T0>}>`
    this.$typeArgs = typeArgs

    this.name = fields.name
    this.amount = fields.amount
    this.sender = fields.sender
    this.recipient = fields.recipient
    this.spentBalance = fields.spentBalance
    this.approvals = fields.approvals
  }

  static reified<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): ActionRequestReified<ToPhantomTypeArgument<T0>> {
    return {
      typeName: ActionRequest.$typeName,
      fullTypeName: composeSuiType(
        ActionRequest.$typeName,
        ...[extractType(T0)]
      ) as `${typeof PKG_V27}::token::ActionRequest<${PhantomToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [extractType(T0)] as [PhantomToTypeStr<ToPhantomTypeArgument<T0>>],
      isPhantom: ActionRequest.$isPhantom,
      reifiedTypeArgs: [T0],
      fromFields: (fields: Record<string, any>) => ActionRequest.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => ActionRequest.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => ActionRequest.fromBcs(T0, data),
      bcs: ActionRequest.bcs,
      fromJSONField: (field: any) => ActionRequest.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => ActionRequest.fromJSON(T0, json),
      fromSuiParsedData: (content: SuiParsedData) => ActionRequest.fromSuiParsedData(T0, content),
      fromSuiObjectData: (content: SuiObjectData) => ActionRequest.fromSuiObjectData(T0, content),
      fetch: async (client: SuiClient, id: string) => ActionRequest.fetch(client, T0, id),
      new: (fields: ActionRequestFields<ToPhantomTypeArgument<T0>>) => {
        return new ActionRequest([extractType(T0)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return ActionRequest.reified
  }

  static phantom<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): PhantomReified<ToTypeStr<ActionRequest<ToPhantomTypeArgument<T0>>>> {
    return phantom(ActionRequest.reified(T0))
  }
  static get p() {
    return ActionRequest.phantom
  }

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

  static fromFields<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    fields: Record<string, any>
  ): ActionRequest<ToPhantomTypeArgument<T0>> {
    return ActionRequest.reified(typeArg).new({
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

  static fromFieldsWithTypes<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    item: FieldsWithTypes
  ): ActionRequest<ToPhantomTypeArgument<T0>> {
    if (!isActionRequest(item.type)) {
      throw new Error('not a ActionRequest type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return ActionRequest.reified(typeArg).new({
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

  static fromBcs<T0 extends PhantomReified<PhantomTypeArgument>>(
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
      recipient: fieldToJSON<Option<'address'>>(`${Option.$typeName}<address>`, this.recipient),
      spentBalance: fieldToJSON<Option<Balance<T0>>>(
        `${Option.$typeName}<${Balance.$typeName}<${this.$typeArgs[0]}>>`,
        this.spentBalance
      ),
      approvals: this.approvals.toJSONField(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    field: any
  ): ActionRequest<ToPhantomTypeArgument<T0>> {
    return ActionRequest.reified(typeArg).new({
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

  static fromJSON<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    json: Record<string, any>
  ): ActionRequest<ToPhantomTypeArgument<T0>> {
    if (json.$typeName !== ActionRequest.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(ActionRequest.$typeName, extractType(typeArg)),
      json.$typeArgs,
      [typeArg]
    )

    return ActionRequest.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    content: SuiParsedData
  ): ActionRequest<ToPhantomTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isActionRequest(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a ActionRequest object`)
    }
    return ActionRequest.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: SuiObjectData
  ): ActionRequest<ToPhantomTypeArgument<T0>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isActionRequest(data.bcs.type)) {
        throw new Error(`object at is not a ActionRequest object`)
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs
      if (gotTypeArgs.length !== 1) {
        throw new Error(
          `type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`
        )
      }
      const gotTypeArg = compressSuiType(gotTypeArgs[0])
      const expectedTypeArg = compressSuiType(extractType(typeArg))
      if (gotTypeArg !== compressSuiType(extractType(typeArg))) {
        throw new Error(
          `type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`
        )
      }

      return ActionRequest.fromBcs(typeArg, fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return ActionRequest.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<T0 extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<ActionRequest<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching ActionRequest object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isActionRequest(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a ActionRequest object`)
    }

    return ActionRequest.fromSuiObjectData(typeArg, res.data)
  }
}

/* ============================== RuleKey =============================== */

export function isRuleKey(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`${PKG_V27}::token::RuleKey` + '<')
}

export interface RuleKeyFields<T0 extends PhantomTypeArgument> {
  isProtected: ToField<'bool'>
}

export type RuleKeyReified<T0 extends PhantomTypeArgument> = Reified<RuleKey<T0>, RuleKeyFields<T0>>

export class RuleKey<T0 extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `${PKG_V27}::token::RuleKey`
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName = RuleKey.$typeName
  readonly $fullTypeName: `${typeof PKG_V27}::token::RuleKey<${PhantomToTypeStr<T0>}>`
  readonly $typeArgs: [PhantomToTypeStr<T0>]
  readonly $isPhantom = RuleKey.$isPhantom

  readonly isProtected: ToField<'bool'>

  private constructor(typeArgs: [PhantomToTypeStr<T0>], fields: RuleKeyFields<T0>) {
    this.$fullTypeName = composeSuiType(
      RuleKey.$typeName,
      ...typeArgs
    ) as `${typeof PKG_V27}::token::RuleKey<${PhantomToTypeStr<T0>}>`
    this.$typeArgs = typeArgs

    this.isProtected = fields.isProtected
  }

  static reified<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): RuleKeyReified<ToPhantomTypeArgument<T0>> {
    return {
      typeName: RuleKey.$typeName,
      fullTypeName: composeSuiType(
        RuleKey.$typeName,
        ...[extractType(T0)]
      ) as `${typeof PKG_V27}::token::RuleKey<${PhantomToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [extractType(T0)] as [PhantomToTypeStr<ToPhantomTypeArgument<T0>>],
      isPhantom: RuleKey.$isPhantom,
      reifiedTypeArgs: [T0],
      fromFields: (fields: Record<string, any>) => RuleKey.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => RuleKey.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => RuleKey.fromBcs(T0, data),
      bcs: RuleKey.bcs,
      fromJSONField: (field: any) => RuleKey.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => RuleKey.fromJSON(T0, json),
      fromSuiParsedData: (content: SuiParsedData) => RuleKey.fromSuiParsedData(T0, content),
      fromSuiObjectData: (content: SuiObjectData) => RuleKey.fromSuiObjectData(T0, content),
      fetch: async (client: SuiClient, id: string) => RuleKey.fetch(client, T0, id),
      new: (fields: RuleKeyFields<ToPhantomTypeArgument<T0>>) => {
        return new RuleKey([extractType(T0)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return RuleKey.reified
  }

  static phantom<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): PhantomReified<ToTypeStr<RuleKey<ToPhantomTypeArgument<T0>>>> {
    return phantom(RuleKey.reified(T0))
  }
  static get p() {
    return RuleKey.phantom
  }

  static get bcs() {
    return bcs.struct('RuleKey', {
      is_protected: bcs.bool(),
    })
  }

  static fromFields<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    fields: Record<string, any>
  ): RuleKey<ToPhantomTypeArgument<T0>> {
    return RuleKey.reified(typeArg).new({
      isProtected: decodeFromFields('bool', fields.is_protected),
    })
  }

  static fromFieldsWithTypes<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    item: FieldsWithTypes
  ): RuleKey<ToPhantomTypeArgument<T0>> {
    if (!isRuleKey(item.type)) {
      throw new Error('not a RuleKey type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return RuleKey.reified(typeArg).new({
      isProtected: decodeFromFieldsWithTypes('bool', item.fields.is_protected),
    })
  }

  static fromBcs<T0 extends PhantomReified<PhantomTypeArgument>>(
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
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    field: any
  ): RuleKey<ToPhantomTypeArgument<T0>> {
    return RuleKey.reified(typeArg).new({
      isProtected: decodeFromJSONField('bool', field.isProtected),
    })
  }

  static fromJSON<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    json: Record<string, any>
  ): RuleKey<ToPhantomTypeArgument<T0>> {
    if (json.$typeName !== RuleKey.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(RuleKey.$typeName, extractType(typeArg)),
      json.$typeArgs,
      [typeArg]
    )

    return RuleKey.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    content: SuiParsedData
  ): RuleKey<ToPhantomTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isRuleKey(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a RuleKey object`)
    }
    return RuleKey.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: SuiObjectData
  ): RuleKey<ToPhantomTypeArgument<T0>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isRuleKey(data.bcs.type)) {
        throw new Error(`object at is not a RuleKey object`)
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs
      if (gotTypeArgs.length !== 1) {
        throw new Error(
          `type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`
        )
      }
      const gotTypeArg = compressSuiType(gotTypeArgs[0])
      const expectedTypeArg = compressSuiType(extractType(typeArg))
      if (gotTypeArg !== compressSuiType(extractType(typeArg))) {
        throw new Error(
          `type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`
        )
      }

      return RuleKey.fromBcs(typeArg, fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return RuleKey.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<T0 extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<RuleKey<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching RuleKey object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isRuleKey(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a RuleKey object`)
    }

    return RuleKey.fromSuiObjectData(typeArg, res.data)
  }
}

/* ============================== Token =============================== */

export function isToken(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`${PKG_V27}::token::Token` + '<')
}

export interface TokenFields<T0 extends PhantomTypeArgument> {
  id: ToField<UID>
  balance: ToField<Balance<T0>>
}

export type TokenReified<T0 extends PhantomTypeArgument> = Reified<Token<T0>, TokenFields<T0>>

export class Token<T0 extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `${PKG_V27}::token::Token`
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName = Token.$typeName
  readonly $fullTypeName: `${typeof PKG_V27}::token::Token<${PhantomToTypeStr<T0>}>`
  readonly $typeArgs: [PhantomToTypeStr<T0>]
  readonly $isPhantom = Token.$isPhantom

  readonly id: ToField<UID>
  readonly balance: ToField<Balance<T0>>

  private constructor(typeArgs: [PhantomToTypeStr<T0>], fields: TokenFields<T0>) {
    this.$fullTypeName = composeSuiType(
      Token.$typeName,
      ...typeArgs
    ) as `${typeof PKG_V27}::token::Token<${PhantomToTypeStr<T0>}>`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.balance = fields.balance
  }

  static reified<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): TokenReified<ToPhantomTypeArgument<T0>> {
    return {
      typeName: Token.$typeName,
      fullTypeName: composeSuiType(
        Token.$typeName,
        ...[extractType(T0)]
      ) as `${typeof PKG_V27}::token::Token<${PhantomToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [extractType(T0)] as [PhantomToTypeStr<ToPhantomTypeArgument<T0>>],
      isPhantom: Token.$isPhantom,
      reifiedTypeArgs: [T0],
      fromFields: (fields: Record<string, any>) => Token.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Token.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => Token.fromBcs(T0, data),
      bcs: Token.bcs,
      fromJSONField: (field: any) => Token.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => Token.fromJSON(T0, json),
      fromSuiParsedData: (content: SuiParsedData) => Token.fromSuiParsedData(T0, content),
      fromSuiObjectData: (content: SuiObjectData) => Token.fromSuiObjectData(T0, content),
      fetch: async (client: SuiClient, id: string) => Token.fetch(client, T0, id),
      new: (fields: TokenFields<ToPhantomTypeArgument<T0>>) => {
        return new Token([extractType(T0)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Token.reified
  }

  static phantom<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): PhantomReified<ToTypeStr<Token<ToPhantomTypeArgument<T0>>>> {
    return phantom(Token.reified(T0))
  }
  static get p() {
    return Token.phantom
  }

  static get bcs() {
    return bcs.struct('Token', {
      id: UID.bcs,
      balance: Balance.bcs,
    })
  }

  static fromFields<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    fields: Record<string, any>
  ): Token<ToPhantomTypeArgument<T0>> {
    return Token.reified(typeArg).new({
      id: decodeFromFields(UID.reified(), fields.id),
      balance: decodeFromFields(Balance.reified(typeArg), fields.balance),
    })
  }

  static fromFieldsWithTypes<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    item: FieldsWithTypes
  ): Token<ToPhantomTypeArgument<T0>> {
    if (!isToken(item.type)) {
      throw new Error('not a Token type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Token.reified(typeArg).new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      balance: decodeFromFieldsWithTypes(Balance.reified(typeArg), item.fields.balance),
    })
  }

  static fromBcs<T0 extends PhantomReified<PhantomTypeArgument>>(
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
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    field: any
  ): Token<ToPhantomTypeArgument<T0>> {
    return Token.reified(typeArg).new({
      id: decodeFromJSONField(UID.reified(), field.id),
      balance: decodeFromJSONField(Balance.reified(typeArg), field.balance),
    })
  }

  static fromJSON<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    json: Record<string, any>
  ): Token<ToPhantomTypeArgument<T0>> {
    if (json.$typeName !== Token.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Token.$typeName, extractType(typeArg)),
      json.$typeArgs,
      [typeArg]
    )

    return Token.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends PhantomReified<PhantomTypeArgument>>(
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

  static fromSuiObjectData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: SuiObjectData
  ): Token<ToPhantomTypeArgument<T0>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isToken(data.bcs.type)) {
        throw new Error(`object at is not a Token object`)
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs
      if (gotTypeArgs.length !== 1) {
        throw new Error(
          `type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`
        )
      }
      const gotTypeArg = compressSuiType(gotTypeArgs[0])
      const expectedTypeArg = compressSuiType(extractType(typeArg))
      if (gotTypeArg !== compressSuiType(extractType(typeArg))) {
        throw new Error(
          `type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`
        )
      }

      return Token.fromBcs(typeArg, fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Token.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<T0 extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<Token<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching Token object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isToken(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a Token object`)
    }

    return Token.fromSuiObjectData(typeArg, res.data)
  }
}

/* ============================== TokenPolicy =============================== */

export function isTokenPolicy(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`${PKG_V27}::token::TokenPolicy` + '<')
}

export interface TokenPolicyFields<T0 extends PhantomTypeArgument> {
  id: ToField<UID>
  spentBalance: ToField<Balance<T0>>
  rules: ToField<VecMap<String, VecSet<TypeName>>>
}

export type TokenPolicyReified<T0 extends PhantomTypeArgument> = Reified<
  TokenPolicy<T0>,
  TokenPolicyFields<T0>
>

export class TokenPolicy<T0 extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `${PKG_V27}::token::TokenPolicy`
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName = TokenPolicy.$typeName
  readonly $fullTypeName: `${typeof PKG_V27}::token::TokenPolicy<${PhantomToTypeStr<T0>}>`
  readonly $typeArgs: [PhantomToTypeStr<T0>]
  readonly $isPhantom = TokenPolicy.$isPhantom

  readonly id: ToField<UID>
  readonly spentBalance: ToField<Balance<T0>>
  readonly rules: ToField<VecMap<String, VecSet<TypeName>>>

  private constructor(typeArgs: [PhantomToTypeStr<T0>], fields: TokenPolicyFields<T0>) {
    this.$fullTypeName = composeSuiType(
      TokenPolicy.$typeName,
      ...typeArgs
    ) as `${typeof PKG_V27}::token::TokenPolicy<${PhantomToTypeStr<T0>}>`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.spentBalance = fields.spentBalance
    this.rules = fields.rules
  }

  static reified<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): TokenPolicyReified<ToPhantomTypeArgument<T0>> {
    return {
      typeName: TokenPolicy.$typeName,
      fullTypeName: composeSuiType(
        TokenPolicy.$typeName,
        ...[extractType(T0)]
      ) as `${typeof PKG_V27}::token::TokenPolicy<${PhantomToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [extractType(T0)] as [PhantomToTypeStr<ToPhantomTypeArgument<T0>>],
      isPhantom: TokenPolicy.$isPhantom,
      reifiedTypeArgs: [T0],
      fromFields: (fields: Record<string, any>) => TokenPolicy.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => TokenPolicy.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => TokenPolicy.fromBcs(T0, data),
      bcs: TokenPolicy.bcs,
      fromJSONField: (field: any) => TokenPolicy.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => TokenPolicy.fromJSON(T0, json),
      fromSuiParsedData: (content: SuiParsedData) => TokenPolicy.fromSuiParsedData(T0, content),
      fromSuiObjectData: (content: SuiObjectData) => TokenPolicy.fromSuiObjectData(T0, content),
      fetch: async (client: SuiClient, id: string) => TokenPolicy.fetch(client, T0, id),
      new: (fields: TokenPolicyFields<ToPhantomTypeArgument<T0>>) => {
        return new TokenPolicy([extractType(T0)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return TokenPolicy.reified
  }

  static phantom<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): PhantomReified<ToTypeStr<TokenPolicy<ToPhantomTypeArgument<T0>>>> {
    return phantom(TokenPolicy.reified(T0))
  }
  static get p() {
    return TokenPolicy.phantom
  }

  static get bcs() {
    return bcs.struct('TokenPolicy', {
      id: UID.bcs,
      spent_balance: Balance.bcs,
      rules: VecMap.bcs(String.bcs, VecSet.bcs(TypeName.bcs)),
    })
  }

  static fromFields<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    fields: Record<string, any>
  ): TokenPolicy<ToPhantomTypeArgument<T0>> {
    return TokenPolicy.reified(typeArg).new({
      id: decodeFromFields(UID.reified(), fields.id),
      spentBalance: decodeFromFields(Balance.reified(typeArg), fields.spent_balance),
      rules: decodeFromFields(
        VecMap.reified(String.reified(), VecSet.reified(TypeName.reified())),
        fields.rules
      ),
    })
  }

  static fromFieldsWithTypes<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    item: FieldsWithTypes
  ): TokenPolicy<ToPhantomTypeArgument<T0>> {
    if (!isTokenPolicy(item.type)) {
      throw new Error('not a TokenPolicy type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return TokenPolicy.reified(typeArg).new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      spentBalance: decodeFromFieldsWithTypes(Balance.reified(typeArg), item.fields.spent_balance),
      rules: decodeFromFieldsWithTypes(
        VecMap.reified(String.reified(), VecSet.reified(TypeName.reified())),
        item.fields.rules
      ),
    })
  }

  static fromBcs<T0 extends PhantomReified<PhantomTypeArgument>>(
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
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    field: any
  ): TokenPolicy<ToPhantomTypeArgument<T0>> {
    return TokenPolicy.reified(typeArg).new({
      id: decodeFromJSONField(UID.reified(), field.id),
      spentBalance: decodeFromJSONField(Balance.reified(typeArg), field.spentBalance),
      rules: decodeFromJSONField(
        VecMap.reified(String.reified(), VecSet.reified(TypeName.reified())),
        field.rules
      ),
    })
  }

  static fromJSON<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    json: Record<string, any>
  ): TokenPolicy<ToPhantomTypeArgument<T0>> {
    if (json.$typeName !== TokenPolicy.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(TokenPolicy.$typeName, extractType(typeArg)),
      json.$typeArgs,
      [typeArg]
    )

    return TokenPolicy.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends PhantomReified<PhantomTypeArgument>>(
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

  static fromSuiObjectData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: SuiObjectData
  ): TokenPolicy<ToPhantomTypeArgument<T0>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isTokenPolicy(data.bcs.type)) {
        throw new Error(`object at is not a TokenPolicy object`)
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs
      if (gotTypeArgs.length !== 1) {
        throw new Error(
          `type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`
        )
      }
      const gotTypeArg = compressSuiType(gotTypeArgs[0])
      const expectedTypeArg = compressSuiType(extractType(typeArg))
      if (gotTypeArg !== compressSuiType(extractType(typeArg))) {
        throw new Error(
          `type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`
        )
      }

      return TokenPolicy.fromBcs(typeArg, fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return TokenPolicy.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<T0 extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<TokenPolicy<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching TokenPolicy object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isTokenPolicy(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a TokenPolicy object`)
    }

    return TokenPolicy.fromSuiObjectData(typeArg, res.data)
  }
}

/* ============================== TokenPolicyCap =============================== */

export function isTokenPolicyCap(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`${PKG_V27}::token::TokenPolicyCap` + '<')
}

export interface TokenPolicyCapFields<T0 extends PhantomTypeArgument> {
  id: ToField<UID>
  for: ToField<ID>
}

export type TokenPolicyCapReified<T0 extends PhantomTypeArgument> = Reified<
  TokenPolicyCap<T0>,
  TokenPolicyCapFields<T0>
>

export class TokenPolicyCap<T0 extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `${PKG_V27}::token::TokenPolicyCap`
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName = TokenPolicyCap.$typeName
  readonly $fullTypeName: `${typeof PKG_V27}::token::TokenPolicyCap<${PhantomToTypeStr<T0>}>`
  readonly $typeArgs: [PhantomToTypeStr<T0>]
  readonly $isPhantom = TokenPolicyCap.$isPhantom

  readonly id: ToField<UID>
  readonly for: ToField<ID>

  private constructor(typeArgs: [PhantomToTypeStr<T0>], fields: TokenPolicyCapFields<T0>) {
    this.$fullTypeName = composeSuiType(
      TokenPolicyCap.$typeName,
      ...typeArgs
    ) as `${typeof PKG_V27}::token::TokenPolicyCap<${PhantomToTypeStr<T0>}>`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.for = fields.for
  }

  static reified<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): TokenPolicyCapReified<ToPhantomTypeArgument<T0>> {
    return {
      typeName: TokenPolicyCap.$typeName,
      fullTypeName: composeSuiType(
        TokenPolicyCap.$typeName,
        ...[extractType(T0)]
      ) as `${typeof PKG_V27}::token::TokenPolicyCap<${PhantomToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [extractType(T0)] as [PhantomToTypeStr<ToPhantomTypeArgument<T0>>],
      isPhantom: TokenPolicyCap.$isPhantom,
      reifiedTypeArgs: [T0],
      fromFields: (fields: Record<string, any>) => TokenPolicyCap.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => TokenPolicyCap.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => TokenPolicyCap.fromBcs(T0, data),
      bcs: TokenPolicyCap.bcs,
      fromJSONField: (field: any) => TokenPolicyCap.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => TokenPolicyCap.fromJSON(T0, json),
      fromSuiParsedData: (content: SuiParsedData) => TokenPolicyCap.fromSuiParsedData(T0, content),
      fromSuiObjectData: (content: SuiObjectData) => TokenPolicyCap.fromSuiObjectData(T0, content),
      fetch: async (client: SuiClient, id: string) => TokenPolicyCap.fetch(client, T0, id),
      new: (fields: TokenPolicyCapFields<ToPhantomTypeArgument<T0>>) => {
        return new TokenPolicyCap([extractType(T0)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return TokenPolicyCap.reified
  }

  static phantom<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): PhantomReified<ToTypeStr<TokenPolicyCap<ToPhantomTypeArgument<T0>>>> {
    return phantom(TokenPolicyCap.reified(T0))
  }
  static get p() {
    return TokenPolicyCap.phantom
  }

  static get bcs() {
    return bcs.struct('TokenPolicyCap', {
      id: UID.bcs,
      for: ID.bcs,
    })
  }

  static fromFields<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    fields: Record<string, any>
  ): TokenPolicyCap<ToPhantomTypeArgument<T0>> {
    return TokenPolicyCap.reified(typeArg).new({
      id: decodeFromFields(UID.reified(), fields.id),
      for: decodeFromFields(ID.reified(), fields.for),
    })
  }

  static fromFieldsWithTypes<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    item: FieldsWithTypes
  ): TokenPolicyCap<ToPhantomTypeArgument<T0>> {
    if (!isTokenPolicyCap(item.type)) {
      throw new Error('not a TokenPolicyCap type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return TokenPolicyCap.reified(typeArg).new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      for: decodeFromFieldsWithTypes(ID.reified(), item.fields.for),
    })
  }

  static fromBcs<T0 extends PhantomReified<PhantomTypeArgument>>(
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
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    field: any
  ): TokenPolicyCap<ToPhantomTypeArgument<T0>> {
    return TokenPolicyCap.reified(typeArg).new({
      id: decodeFromJSONField(UID.reified(), field.id),
      for: decodeFromJSONField(ID.reified(), field.for),
    })
  }

  static fromJSON<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    json: Record<string, any>
  ): TokenPolicyCap<ToPhantomTypeArgument<T0>> {
    if (json.$typeName !== TokenPolicyCap.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(TokenPolicyCap.$typeName, extractType(typeArg)),
      json.$typeArgs,
      [typeArg]
    )

    return TokenPolicyCap.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends PhantomReified<PhantomTypeArgument>>(
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

  static fromSuiObjectData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: SuiObjectData
  ): TokenPolicyCap<ToPhantomTypeArgument<T0>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isTokenPolicyCap(data.bcs.type)) {
        throw new Error(`object at is not a TokenPolicyCap object`)
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs
      if (gotTypeArgs.length !== 1) {
        throw new Error(
          `type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`
        )
      }
      const gotTypeArg = compressSuiType(gotTypeArgs[0])
      const expectedTypeArg = compressSuiType(extractType(typeArg))
      if (gotTypeArg !== compressSuiType(extractType(typeArg))) {
        throw new Error(
          `type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`
        )
      }

      return TokenPolicyCap.fromBcs(typeArg, fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return TokenPolicyCap.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<T0 extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<TokenPolicyCap<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching TokenPolicyCap object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isTokenPolicyCap(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a TokenPolicyCap object`)
    }

    return TokenPolicyCap.fromSuiObjectData(typeArg, res.data)
  }
}

/* ============================== TokenPolicyCreated =============================== */

export function isTokenPolicyCreated(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`${PKG_V27}::token::TokenPolicyCreated` + '<')
}

export interface TokenPolicyCreatedFields<T0 extends PhantomTypeArgument> {
  id: ToField<ID>
  isMutable: ToField<'bool'>
}

export type TokenPolicyCreatedReified<T0 extends PhantomTypeArgument> = Reified<
  TokenPolicyCreated<T0>,
  TokenPolicyCreatedFields<T0>
>

export class TokenPolicyCreated<T0 extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `${PKG_V27}::token::TokenPolicyCreated`
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName = TokenPolicyCreated.$typeName
  readonly $fullTypeName: `${typeof PKG_V27}::token::TokenPolicyCreated<${PhantomToTypeStr<T0>}>`
  readonly $typeArgs: [PhantomToTypeStr<T0>]
  readonly $isPhantom = TokenPolicyCreated.$isPhantom

  readonly id: ToField<ID>
  readonly isMutable: ToField<'bool'>

  private constructor(typeArgs: [PhantomToTypeStr<T0>], fields: TokenPolicyCreatedFields<T0>) {
    this.$fullTypeName = composeSuiType(
      TokenPolicyCreated.$typeName,
      ...typeArgs
    ) as `${typeof PKG_V27}::token::TokenPolicyCreated<${PhantomToTypeStr<T0>}>`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.isMutable = fields.isMutable
  }

  static reified<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): TokenPolicyCreatedReified<ToPhantomTypeArgument<T0>> {
    return {
      typeName: TokenPolicyCreated.$typeName,
      fullTypeName: composeSuiType(
        TokenPolicyCreated.$typeName,
        ...[extractType(T0)]
      ) as `${typeof PKG_V27}::token::TokenPolicyCreated<${PhantomToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [extractType(T0)] as [PhantomToTypeStr<ToPhantomTypeArgument<T0>>],
      isPhantom: TokenPolicyCreated.$isPhantom,
      reifiedTypeArgs: [T0],
      fromFields: (fields: Record<string, any>) => TokenPolicyCreated.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        TokenPolicyCreated.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => TokenPolicyCreated.fromBcs(T0, data),
      bcs: TokenPolicyCreated.bcs,
      fromJSONField: (field: any) => TokenPolicyCreated.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => TokenPolicyCreated.fromJSON(T0, json),
      fromSuiParsedData: (content: SuiParsedData) =>
        TokenPolicyCreated.fromSuiParsedData(T0, content),
      fromSuiObjectData: (content: SuiObjectData) =>
        TokenPolicyCreated.fromSuiObjectData(T0, content),
      fetch: async (client: SuiClient, id: string) => TokenPolicyCreated.fetch(client, T0, id),
      new: (fields: TokenPolicyCreatedFields<ToPhantomTypeArgument<T0>>) => {
        return new TokenPolicyCreated([extractType(T0)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return TokenPolicyCreated.reified
  }

  static phantom<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): PhantomReified<ToTypeStr<TokenPolicyCreated<ToPhantomTypeArgument<T0>>>> {
    return phantom(TokenPolicyCreated.reified(T0))
  }
  static get p() {
    return TokenPolicyCreated.phantom
  }

  static get bcs() {
    return bcs.struct('TokenPolicyCreated', {
      id: ID.bcs,
      is_mutable: bcs.bool(),
    })
  }

  static fromFields<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    fields: Record<string, any>
  ): TokenPolicyCreated<ToPhantomTypeArgument<T0>> {
    return TokenPolicyCreated.reified(typeArg).new({
      id: decodeFromFields(ID.reified(), fields.id),
      isMutable: decodeFromFields('bool', fields.is_mutable),
    })
  }

  static fromFieldsWithTypes<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    item: FieldsWithTypes
  ): TokenPolicyCreated<ToPhantomTypeArgument<T0>> {
    if (!isTokenPolicyCreated(item.type)) {
      throw new Error('not a TokenPolicyCreated type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return TokenPolicyCreated.reified(typeArg).new({
      id: decodeFromFieldsWithTypes(ID.reified(), item.fields.id),
      isMutable: decodeFromFieldsWithTypes('bool', item.fields.is_mutable),
    })
  }

  static fromBcs<T0 extends PhantomReified<PhantomTypeArgument>>(
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
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    field: any
  ): TokenPolicyCreated<ToPhantomTypeArgument<T0>> {
    return TokenPolicyCreated.reified(typeArg).new({
      id: decodeFromJSONField(ID.reified(), field.id),
      isMutable: decodeFromJSONField('bool', field.isMutable),
    })
  }

  static fromJSON<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    json: Record<string, any>
  ): TokenPolicyCreated<ToPhantomTypeArgument<T0>> {
    if (json.$typeName !== TokenPolicyCreated.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(TokenPolicyCreated.$typeName, extractType(typeArg)),
      json.$typeArgs,
      [typeArg]
    )

    return TokenPolicyCreated.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    content: SuiParsedData
  ): TokenPolicyCreated<ToPhantomTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isTokenPolicyCreated(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a TokenPolicyCreated object`)
    }
    return TokenPolicyCreated.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: SuiObjectData
  ): TokenPolicyCreated<ToPhantomTypeArgument<T0>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isTokenPolicyCreated(data.bcs.type)) {
        throw new Error(`object at is not a TokenPolicyCreated object`)
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs
      if (gotTypeArgs.length !== 1) {
        throw new Error(
          `type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`
        )
      }
      const gotTypeArg = compressSuiType(gotTypeArgs[0])
      const expectedTypeArg = compressSuiType(extractType(typeArg))
      if (gotTypeArg !== compressSuiType(extractType(typeArg))) {
        throw new Error(
          `type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`
        )
      }

      return TokenPolicyCreated.fromBcs(typeArg, fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return TokenPolicyCreated.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<T0 extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<TokenPolicyCreated<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching TokenPolicyCreated object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isTokenPolicyCreated(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a TokenPolicyCreated object`)
    }

    return TokenPolicyCreated.fromSuiObjectData(typeArg, res.data)
  }
}
