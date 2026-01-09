/**
 * The Token module which implements a Closed Loop Token with a configurable
 * policy. The policy is defined by a set of rules that must be satisfied for
 * an action to be performed on the token.
 *
 * The module is designed to be used with a `TreasuryCap` to allow for minting
 * and burning of the `Token`s. And can act as a replacement / extension or a
 * companion to existing open-loop (`Coin`) systems.
 *
 * ```
 * Module:      sui::balance       sui::coin             sui::token
 * Main type:   Balance<T>         Coin<T>               Token<T>
 * Capability:  Supply<T>  <---->  TreasuryCap<T> <----> TreasuryCap<T>
 * Abilities:   store              key + store           key
 * ```
 *
 * The Token system allows for fine-grained control over the actions performed
 * on the token. And hence it is highly suitable for applications that require
 * control over the currency which a simple open-loop system can't provide.
 */

import { Option } from '../../_dependencies/std/option/structs'
import { String } from '../../_dependencies/std/string/structs'
import { TypeName } from '../../_dependencies/std/type-name/structs'
import {
  PhantomReified,
  PhantomToTypeStr,
  PhantomTypeArgument,
  Reified,
  StructClass,
  ToField,
  ToJSON,
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
  SupportedSuiClient,
  composeSuiType,
  compressSuiType,
  fetchObjectBcs,
  parseTypeName,
} from '../../_framework/util'
import { Balance } from '../balance/structs'
import { ID, UID } from '../object/structs'
import { VecMap } from '../vec-map/structs'
import { VecSet } from '../vec-set/structs'
import { bcs } from '@mysten/sui/bcs'
import { SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromBase64, fromHex, toHex } from '@mysten/sui/utils'

/* ============================== Token =============================== */

export function isToken(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::token::Token` + '<')
}

export interface TokenFields<T extends PhantomTypeArgument> {
  id: ToField<UID>
  /** The Balance of the `Token`. */
  balance: ToField<Balance<T>>
}

export type TokenReified<T extends PhantomTypeArgument> = Reified<Token<T>, TokenFields<T>>

export type TokenJSONField<T extends PhantomTypeArgument> = {
  id: string
  balance: ToJSON<Balance<T>>
}

export type TokenJSON<T extends PhantomTypeArgument> = {
  $typeName: typeof Token.$typeName
  $typeArgs: [PhantomToTypeStr<T>]
} & TokenJSONField<T>

/**
 * A single `Token` with `Balance` inside. Can only be owned by an address,
 * and actions performed on it must be confirmed in a matching `TokenPolicy`.
 */
export class Token<T extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::token::Token` = `0x2::token::Token` as const
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName: typeof Token.$typeName = Token.$typeName
  readonly $fullTypeName: `0x2::token::Token<${PhantomToTypeStr<T>}>`
  readonly $typeArgs: [PhantomToTypeStr<T>]
  readonly $isPhantom: typeof Token.$isPhantom = Token.$isPhantom

  readonly id: ToField<UID>
  /** The Balance of the `Token`. */
  readonly balance: ToField<Balance<T>>

  private constructor(typeArgs: [PhantomToTypeStr<T>], fields: TokenFields<T>) {
    this.$fullTypeName = composeSuiType(
      Token.$typeName,
      ...typeArgs
    ) as `0x2::token::Token<${PhantomToTypeStr<T>}>`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.balance = fields.balance
  }

  static reified<T extends PhantomReified<PhantomTypeArgument>>(
    T: T
  ): TokenReified<ToPhantomTypeArgument<T>> {
    const reifiedBcs = Token.bcs
    return {
      typeName: Token.$typeName,
      fullTypeName: composeSuiType(
        Token.$typeName,
        ...[extractType(T)]
      ) as `0x2::token::Token<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`,
      typeArgs: [extractType(T)] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>],
      isPhantom: Token.$isPhantom,
      reifiedTypeArgs: [T],
      fromFields: (fields: Record<string, any>) => Token.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Token.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => Token.fromFields(T, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => Token.fromJSONField(T, field),
      fromJSON: (json: Record<string, any>) => Token.fromJSON(T, json),
      fromSuiParsedData: (content: SuiParsedData) => Token.fromSuiParsedData(T, content),
      fromSuiObjectData: (content: SuiObjectData) => Token.fromSuiObjectData(T, content),
      fetch: async (client: SupportedSuiClient, id: string) => Token.fetch(client, T, id),
      new: (fields: TokenFields<ToPhantomTypeArgument<T>>) => {
        return new Token([extractType(T)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): typeof Token.reified {
    return Token.reified
  }

  static phantom<T extends PhantomReified<PhantomTypeArgument>>(
    T: T
  ): PhantomReified<ToTypeStr<Token<ToPhantomTypeArgument<T>>>> {
    return phantom(Token.reified(T))
  }

  static get p(): typeof Token.phantom {
    return Token.phantom
  }

  private static instantiateBcs() {
    return bcs.struct('Token', {
      id: UID.bcs,
      balance: Balance.bcs,
    })
  }

  private static cachedBcs: ReturnType<typeof Token.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof Token.instantiateBcs> {
    if (!Token.cachedBcs) {
      Token.cachedBcs = Token.instantiateBcs()
    }
    return Token.cachedBcs
  }

  static fromFields<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    fields: Record<string, any>
  ): Token<ToPhantomTypeArgument<T>> {
    return Token.reified(typeArg).new({
      id: decodeFromFields(UID.reified(), fields.id),
      balance: decodeFromFields(Balance.reified(typeArg), fields.balance),
    })
  }

  static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    item: FieldsWithTypes
  ): Token<ToPhantomTypeArgument<T>> {
    if (!isToken(item.type)) {
      throw new Error('not a Token type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Token.reified(typeArg).new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      balance: decodeFromFieldsWithTypes(Balance.reified(typeArg), item.fields.balance),
    })
  }

  static fromBcs<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    data: Uint8Array
  ): Token<ToPhantomTypeArgument<T>> {
    return Token.fromFields(typeArg, Token.bcs.parse(data))
  }

  toJSONField(): TokenJSONField<T> {
    return {
      id: this.id,
      balance: this.balance.toJSONField(),
    }
  }

  toJSON(): TokenJSON<T> {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    field: any
  ): Token<ToPhantomTypeArgument<T>> {
    return Token.reified(typeArg).new({
      id: decodeFromJSONField(UID.reified(), field.id),
      balance: decodeFromJSONField(Balance.reified(typeArg), field.balance),
    })
  }

  static fromJSON<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    json: Record<string, any>
  ): Token<ToPhantomTypeArgument<T>> {
    if (json.$typeName !== Token.$typeName) {
      throw new Error(
        `not a Token json object: expected '${Token.$typeName}' but got '${json.$typeName}'`
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Token.$typeName, ...[extractType(typeArg)]),
      json.$typeArgs,
      [typeArg]
    )

    return Token.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>>(
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

  static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    data: SuiObjectData
  ): Token<ToPhantomTypeArgument<T>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isToken(data.bcs.type)) {
        throw new Error(`object at is not a Token object`)
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs
      if (gotTypeArgs.length !== 1) {
        throw new Error(
          `type argument mismatch: expected 1 type arguments but got '${gotTypeArgs.length}'`
        )
      }
      for (let i = 0; i < 1; i++) {
        const gotTypeArg = compressSuiType(gotTypeArgs[i])
        const expectedTypeArg = compressSuiType(extractType([typeArg][i]))
        if (gotTypeArg !== expectedTypeArg) {
          throw new Error(
            `type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`
          )
        }
      }

      return Token.fromBcs(typeArg, fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Token.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<T extends PhantomReified<PhantomTypeArgument>>(
    client: SupportedSuiClient,
    typeArg: T,
    id: string
  ): Promise<Token<ToPhantomTypeArgument<T>>> {
    const res = await fetchObjectBcs(client, id)
    if (!isToken(res.type)) {
      throw new Error(`object at id ${id} is not a Token object`)
    }

    const gotTypeArgs = parseTypeName(res.type).typeArgs
    if (gotTypeArgs.length !== 1) {
      throw new Error(
        `type argument mismatch: expected 1 type arguments but got '${gotTypeArgs.length}'`
      )
    }
    for (let i = 0; i < 1; i++) {
      const gotTypeArg = compressSuiType(gotTypeArgs[i])
      const expectedTypeArg = compressSuiType(extractType([typeArg][i]))
      if (gotTypeArg !== expectedTypeArg) {
        throw new Error(
          `type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`
        )
      }
    }

    return Token.fromBcs(typeArg, res.bcsBytes)
  }
}

/* ============================== TokenPolicyCap =============================== */

export function isTokenPolicyCap(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::token::TokenPolicyCap` + '<')
}

export interface TokenPolicyCapFields<T extends PhantomTypeArgument> {
  id: ToField<UID>
  for: ToField<ID>
}

export type TokenPolicyCapReified<T extends PhantomTypeArgument> = Reified<
  TokenPolicyCap<T>,
  TokenPolicyCapFields<T>
>

export type TokenPolicyCapJSONField<T extends PhantomTypeArgument> = {
  id: string
  for: string
}

export type TokenPolicyCapJSON<T extends PhantomTypeArgument> = {
  $typeName: typeof TokenPolicyCap.$typeName
  $typeArgs: [PhantomToTypeStr<T>]
} & TokenPolicyCapJSONField<T>

/**
 * A Capability that manages a single `TokenPolicy` specified in the `for`
 * field. Created together with `TokenPolicy` in the `new` function.
 */
export class TokenPolicyCap<T extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::token::TokenPolicyCap` = `0x2::token::TokenPolicyCap` as const
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName: typeof TokenPolicyCap.$typeName = TokenPolicyCap.$typeName
  readonly $fullTypeName: `0x2::token::TokenPolicyCap<${PhantomToTypeStr<T>}>`
  readonly $typeArgs: [PhantomToTypeStr<T>]
  readonly $isPhantom: typeof TokenPolicyCap.$isPhantom = TokenPolicyCap.$isPhantom

  readonly id: ToField<UID>
  readonly for: ToField<ID>

  private constructor(typeArgs: [PhantomToTypeStr<T>], fields: TokenPolicyCapFields<T>) {
    this.$fullTypeName = composeSuiType(
      TokenPolicyCap.$typeName,
      ...typeArgs
    ) as `0x2::token::TokenPolicyCap<${PhantomToTypeStr<T>}>`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.for = fields.for
  }

  static reified<T extends PhantomReified<PhantomTypeArgument>>(
    T: T
  ): TokenPolicyCapReified<ToPhantomTypeArgument<T>> {
    const reifiedBcs = TokenPolicyCap.bcs
    return {
      typeName: TokenPolicyCap.$typeName,
      fullTypeName: composeSuiType(
        TokenPolicyCap.$typeName,
        ...[extractType(T)]
      ) as `0x2::token::TokenPolicyCap<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`,
      typeArgs: [extractType(T)] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>],
      isPhantom: TokenPolicyCap.$isPhantom,
      reifiedTypeArgs: [T],
      fromFields: (fields: Record<string, any>) => TokenPolicyCap.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => TokenPolicyCap.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => TokenPolicyCap.fromFields(T, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => TokenPolicyCap.fromJSONField(T, field),
      fromJSON: (json: Record<string, any>) => TokenPolicyCap.fromJSON(T, json),
      fromSuiParsedData: (content: SuiParsedData) => TokenPolicyCap.fromSuiParsedData(T, content),
      fromSuiObjectData: (content: SuiObjectData) => TokenPolicyCap.fromSuiObjectData(T, content),
      fetch: async (client: SupportedSuiClient, id: string) => TokenPolicyCap.fetch(client, T, id),
      new: (fields: TokenPolicyCapFields<ToPhantomTypeArgument<T>>) => {
        return new TokenPolicyCap([extractType(T)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): typeof TokenPolicyCap.reified {
    return TokenPolicyCap.reified
  }

  static phantom<T extends PhantomReified<PhantomTypeArgument>>(
    T: T
  ): PhantomReified<ToTypeStr<TokenPolicyCap<ToPhantomTypeArgument<T>>>> {
    return phantom(TokenPolicyCap.reified(T))
  }

  static get p(): typeof TokenPolicyCap.phantom {
    return TokenPolicyCap.phantom
  }

  private static instantiateBcs() {
    return bcs.struct('TokenPolicyCap', {
      id: UID.bcs,
      for: ID.bcs,
    })
  }

  private static cachedBcs: ReturnType<typeof TokenPolicyCap.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof TokenPolicyCap.instantiateBcs> {
    if (!TokenPolicyCap.cachedBcs) {
      TokenPolicyCap.cachedBcs = TokenPolicyCap.instantiateBcs()
    }
    return TokenPolicyCap.cachedBcs
  }

  static fromFields<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    fields: Record<string, any>
  ): TokenPolicyCap<ToPhantomTypeArgument<T>> {
    return TokenPolicyCap.reified(typeArg).new({
      id: decodeFromFields(UID.reified(), fields.id),
      for: decodeFromFields(ID.reified(), fields.for),
    })
  }

  static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    item: FieldsWithTypes
  ): TokenPolicyCap<ToPhantomTypeArgument<T>> {
    if (!isTokenPolicyCap(item.type)) {
      throw new Error('not a TokenPolicyCap type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return TokenPolicyCap.reified(typeArg).new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      for: decodeFromFieldsWithTypes(ID.reified(), item.fields.for),
    })
  }

  static fromBcs<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    data: Uint8Array
  ): TokenPolicyCap<ToPhantomTypeArgument<T>> {
    return TokenPolicyCap.fromFields(typeArg, TokenPolicyCap.bcs.parse(data))
  }

  toJSONField(): TokenPolicyCapJSONField<T> {
    return {
      id: this.id,
      for: this.for,
    }
  }

  toJSON(): TokenPolicyCapJSON<T> {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    field: any
  ): TokenPolicyCap<ToPhantomTypeArgument<T>> {
    return TokenPolicyCap.reified(typeArg).new({
      id: decodeFromJSONField(UID.reified(), field.id),
      for: decodeFromJSONField(ID.reified(), field.for),
    })
  }

  static fromJSON<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    json: Record<string, any>
  ): TokenPolicyCap<ToPhantomTypeArgument<T>> {
    if (json.$typeName !== TokenPolicyCap.$typeName) {
      throw new Error(
        `not a TokenPolicyCap json object: expected '${TokenPolicyCap.$typeName}' but got '${json.$typeName}'`
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(TokenPolicyCap.$typeName, ...[extractType(typeArg)]),
      json.$typeArgs,
      [typeArg]
    )

    return TokenPolicyCap.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>>(
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

  static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    data: SuiObjectData
  ): TokenPolicyCap<ToPhantomTypeArgument<T>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isTokenPolicyCap(data.bcs.type)) {
        throw new Error(`object at is not a TokenPolicyCap object`)
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs
      if (gotTypeArgs.length !== 1) {
        throw new Error(
          `type argument mismatch: expected 1 type arguments but got '${gotTypeArgs.length}'`
        )
      }
      for (let i = 0; i < 1; i++) {
        const gotTypeArg = compressSuiType(gotTypeArgs[i])
        const expectedTypeArg = compressSuiType(extractType([typeArg][i]))
        if (gotTypeArg !== expectedTypeArg) {
          throw new Error(
            `type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`
          )
        }
      }

      return TokenPolicyCap.fromBcs(typeArg, fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return TokenPolicyCap.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<T extends PhantomReified<PhantomTypeArgument>>(
    client: SupportedSuiClient,
    typeArg: T,
    id: string
  ): Promise<TokenPolicyCap<ToPhantomTypeArgument<T>>> {
    const res = await fetchObjectBcs(client, id)
    if (!isTokenPolicyCap(res.type)) {
      throw new Error(`object at id ${id} is not a TokenPolicyCap object`)
    }

    const gotTypeArgs = parseTypeName(res.type).typeArgs
    if (gotTypeArgs.length !== 1) {
      throw new Error(
        `type argument mismatch: expected 1 type arguments but got '${gotTypeArgs.length}'`
      )
    }
    for (let i = 0; i < 1; i++) {
      const gotTypeArg = compressSuiType(gotTypeArgs[i])
      const expectedTypeArg = compressSuiType(extractType([typeArg][i]))
      if (gotTypeArg !== expectedTypeArg) {
        throw new Error(
          `type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`
        )
      }
    }

    return TokenPolicyCap.fromBcs(typeArg, res.bcsBytes)
  }
}

/* ============================== TokenPolicy =============================== */

export function isTokenPolicy(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::token::TokenPolicy` + '<')
}

export interface TokenPolicyFields<T extends PhantomTypeArgument> {
  id: ToField<UID>
  /**
   * The balance that is effectively spent by the user on the "spend"
   * action. However, actual decrease of the supply can only be done by
   * the `TreasuryCap` owner when `flush` is called.
   *
   * This balance is effectively spent and cannot be accessed by anyone
   * but the `TreasuryCap` owner.
   */
  spentBalance: ToField<Balance<T>>
  /**
   * The set of rules that define what actions can be performed on the
   * token. For each "action" there's a set of Rules that must be
   * satisfied for the `ActionRequest` to be confirmed.
   */
  rules: ToField<VecMap<String, VecSet<TypeName>>>
}

export type TokenPolicyReified<T extends PhantomTypeArgument> = Reified<
  TokenPolicy<T>,
  TokenPolicyFields<T>
>

export type TokenPolicyJSONField<T extends PhantomTypeArgument> = {
  id: string
  spentBalance: ToJSON<Balance<T>>
  rules: ToJSON<VecMap<String, VecSet<TypeName>>>
}

export type TokenPolicyJSON<T extends PhantomTypeArgument> = {
  $typeName: typeof TokenPolicy.$typeName
  $typeArgs: [PhantomToTypeStr<T>]
} & TokenPolicyJSONField<T>

/**
 * `TokenPolicy` represents a set of rules that define what actions can be
 * performed on a `Token` and which `Rules` must be satisfied for the
 * action to succeed.
 *
 * - For the sake of availability, `TokenPolicy` is a `key`-only object.
 * - Each `TokenPolicy` is managed by a matching `TokenPolicyCap`.
 * - For an action to become available, there needs to be a record in the
 * `rules` VecMap. To allow an action to be performed freely, there's an
 * `allow` function that can be called by the `TokenPolicyCap` owner.
 */
export class TokenPolicy<T extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::token::TokenPolicy` = `0x2::token::TokenPolicy` as const
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName: typeof TokenPolicy.$typeName = TokenPolicy.$typeName
  readonly $fullTypeName: `0x2::token::TokenPolicy<${PhantomToTypeStr<T>}>`
  readonly $typeArgs: [PhantomToTypeStr<T>]
  readonly $isPhantom: typeof TokenPolicy.$isPhantom = TokenPolicy.$isPhantom

  readonly id: ToField<UID>
  /**
   * The balance that is effectively spent by the user on the "spend"
   * action. However, actual decrease of the supply can only be done by
   * the `TreasuryCap` owner when `flush` is called.
   *
   * This balance is effectively spent and cannot be accessed by anyone
   * but the `TreasuryCap` owner.
   */
  readonly spentBalance: ToField<Balance<T>>
  /**
   * The set of rules that define what actions can be performed on the
   * token. For each "action" there's a set of Rules that must be
   * satisfied for the `ActionRequest` to be confirmed.
   */
  readonly rules: ToField<VecMap<String, VecSet<TypeName>>>

  private constructor(typeArgs: [PhantomToTypeStr<T>], fields: TokenPolicyFields<T>) {
    this.$fullTypeName = composeSuiType(
      TokenPolicy.$typeName,
      ...typeArgs
    ) as `0x2::token::TokenPolicy<${PhantomToTypeStr<T>}>`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.spentBalance = fields.spentBalance
    this.rules = fields.rules
  }

  static reified<T extends PhantomReified<PhantomTypeArgument>>(
    T: T
  ): TokenPolicyReified<ToPhantomTypeArgument<T>> {
    const reifiedBcs = TokenPolicy.bcs
    return {
      typeName: TokenPolicy.$typeName,
      fullTypeName: composeSuiType(
        TokenPolicy.$typeName,
        ...[extractType(T)]
      ) as `0x2::token::TokenPolicy<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`,
      typeArgs: [extractType(T)] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>],
      isPhantom: TokenPolicy.$isPhantom,
      reifiedTypeArgs: [T],
      fromFields: (fields: Record<string, any>) => TokenPolicy.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => TokenPolicy.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => TokenPolicy.fromFields(T, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => TokenPolicy.fromJSONField(T, field),
      fromJSON: (json: Record<string, any>) => TokenPolicy.fromJSON(T, json),
      fromSuiParsedData: (content: SuiParsedData) => TokenPolicy.fromSuiParsedData(T, content),
      fromSuiObjectData: (content: SuiObjectData) => TokenPolicy.fromSuiObjectData(T, content),
      fetch: async (client: SupportedSuiClient, id: string) => TokenPolicy.fetch(client, T, id),
      new: (fields: TokenPolicyFields<ToPhantomTypeArgument<T>>) => {
        return new TokenPolicy([extractType(T)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): typeof TokenPolicy.reified {
    return TokenPolicy.reified
  }

  static phantom<T extends PhantomReified<PhantomTypeArgument>>(
    T: T
  ): PhantomReified<ToTypeStr<TokenPolicy<ToPhantomTypeArgument<T>>>> {
    return phantom(TokenPolicy.reified(T))
  }

  static get p(): typeof TokenPolicy.phantom {
    return TokenPolicy.phantom
  }

  private static instantiateBcs() {
    return bcs.struct('TokenPolicy', {
      id: UID.bcs,
      spent_balance: Balance.bcs,
      rules: VecMap.bcs(String.bcs, VecSet.bcs(TypeName.bcs)),
    })
  }

  private static cachedBcs: ReturnType<typeof TokenPolicy.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof TokenPolicy.instantiateBcs> {
    if (!TokenPolicy.cachedBcs) {
      TokenPolicy.cachedBcs = TokenPolicy.instantiateBcs()
    }
    return TokenPolicy.cachedBcs
  }

  static fromFields<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    fields: Record<string, any>
  ): TokenPolicy<ToPhantomTypeArgument<T>> {
    return TokenPolicy.reified(typeArg).new({
      id: decodeFromFields(UID.reified(), fields.id),
      spentBalance: decodeFromFields(Balance.reified(typeArg), fields.spent_balance),
      rules: decodeFromFields(
        VecMap.reified(String.reified(), VecSet.reified(TypeName.reified())),
        fields.rules
      ),
    })
  }

  static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    item: FieldsWithTypes
  ): TokenPolicy<ToPhantomTypeArgument<T>> {
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

  static fromBcs<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    data: Uint8Array
  ): TokenPolicy<ToPhantomTypeArgument<T>> {
    return TokenPolicy.fromFields(typeArg, TokenPolicy.bcs.parse(data))
  }

  toJSONField(): TokenPolicyJSONField<T> {
    return {
      id: this.id,
      spentBalance: this.spentBalance.toJSONField(),
      rules: this.rules.toJSONField(),
    }
  }

  toJSON(): TokenPolicyJSON<T> {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    field: any
  ): TokenPolicy<ToPhantomTypeArgument<T>> {
    return TokenPolicy.reified(typeArg).new({
      id: decodeFromJSONField(UID.reified(), field.id),
      spentBalance: decodeFromJSONField(Balance.reified(typeArg), field.spentBalance),
      rules: decodeFromJSONField(
        VecMap.reified(String.reified(), VecSet.reified(TypeName.reified())),
        field.rules
      ),
    })
  }

  static fromJSON<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    json: Record<string, any>
  ): TokenPolicy<ToPhantomTypeArgument<T>> {
    if (json.$typeName !== TokenPolicy.$typeName) {
      throw new Error(
        `not a TokenPolicy json object: expected '${TokenPolicy.$typeName}' but got '${json.$typeName}'`
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(TokenPolicy.$typeName, ...[extractType(typeArg)]),
      json.$typeArgs,
      [typeArg]
    )

    return TokenPolicy.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>>(
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

  static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    data: SuiObjectData
  ): TokenPolicy<ToPhantomTypeArgument<T>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isTokenPolicy(data.bcs.type)) {
        throw new Error(`object at is not a TokenPolicy object`)
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs
      if (gotTypeArgs.length !== 1) {
        throw new Error(
          `type argument mismatch: expected 1 type arguments but got '${gotTypeArgs.length}'`
        )
      }
      for (let i = 0; i < 1; i++) {
        const gotTypeArg = compressSuiType(gotTypeArgs[i])
        const expectedTypeArg = compressSuiType(extractType([typeArg][i]))
        if (gotTypeArg !== expectedTypeArg) {
          throw new Error(
            `type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`
          )
        }
      }

      return TokenPolicy.fromBcs(typeArg, fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return TokenPolicy.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<T extends PhantomReified<PhantomTypeArgument>>(
    client: SupportedSuiClient,
    typeArg: T,
    id: string
  ): Promise<TokenPolicy<ToPhantomTypeArgument<T>>> {
    const res = await fetchObjectBcs(client, id)
    if (!isTokenPolicy(res.type)) {
      throw new Error(`object at id ${id} is not a TokenPolicy object`)
    }

    const gotTypeArgs = parseTypeName(res.type).typeArgs
    if (gotTypeArgs.length !== 1) {
      throw new Error(
        `type argument mismatch: expected 1 type arguments but got '${gotTypeArgs.length}'`
      )
    }
    for (let i = 0; i < 1; i++) {
      const gotTypeArg = compressSuiType(gotTypeArgs[i])
      const expectedTypeArg = compressSuiType(extractType([typeArg][i]))
      if (gotTypeArg !== expectedTypeArg) {
        throw new Error(
          `type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`
        )
      }
    }

    return TokenPolicy.fromBcs(typeArg, res.bcsBytes)
  }
}

/* ============================== ActionRequest =============================== */

export function isActionRequest(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::token::ActionRequest` + '<')
}

export interface ActionRequestFields<T extends PhantomTypeArgument> {
  /**
   * Name of the Action to look up in the Policy. Name can be one of the
   * default actions: `transfer`, `spend`, `to_coin`, `from_coin` or a
   * custom action.
   */
  name: ToField<String>
  /** Amount is present in all of the txs */
  amount: ToField<'u64'>
  /** Sender is a permanent field always */
  sender: ToField<'address'>
  /** Recipient is only available in `transfer` action. */
  recipient: ToField<Option<'address'>>
  /**
   * The balance to be "spent" in the `TokenPolicy`, only available
   * in the `spend` action.
   */
  spentBalance: ToField<Option<Balance<T>>>
  /**
   * Collected approvals (stamps) from completed `Rules`. They're matched
   * against `TokenPolicy.rules` to determine if the request can be
   * confirmed.
   */
  approvals: ToField<VecSet<TypeName>>
}

export type ActionRequestReified<T extends PhantomTypeArgument> = Reified<
  ActionRequest<T>,
  ActionRequestFields<T>
>

export type ActionRequestJSONField<T extends PhantomTypeArgument> = {
  name: string
  amount: string
  sender: string
  recipient: string | null
  spentBalance: ToJSON<Balance<T>> | null
  approvals: ToJSON<VecSet<TypeName>>
}

export type ActionRequestJSON<T extends PhantomTypeArgument> = {
  $typeName: typeof ActionRequest.$typeName
  $typeArgs: [PhantomToTypeStr<T>]
} & ActionRequestJSONField<T>

/**
 * A request to perform an "Action" on a token. Stores the information
 * about the action to be performed and must be consumed by the `confirm_request`
 * or `confirm_request_mut` functions when the Rules are satisfied.
 */
export class ActionRequest<T extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::token::ActionRequest` = `0x2::token::ActionRequest` as const
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName: typeof ActionRequest.$typeName = ActionRequest.$typeName
  readonly $fullTypeName: `0x2::token::ActionRequest<${PhantomToTypeStr<T>}>`
  readonly $typeArgs: [PhantomToTypeStr<T>]
  readonly $isPhantom: typeof ActionRequest.$isPhantom = ActionRequest.$isPhantom

  /**
   * Name of the Action to look up in the Policy. Name can be one of the
   * default actions: `transfer`, `spend`, `to_coin`, `from_coin` or a
   * custom action.
   */
  readonly name: ToField<String>
  /** Amount is present in all of the txs */
  readonly amount: ToField<'u64'>
  /** Sender is a permanent field always */
  readonly sender: ToField<'address'>
  /** Recipient is only available in `transfer` action. */
  readonly recipient: ToField<Option<'address'>>
  /**
   * The balance to be "spent" in the `TokenPolicy`, only available
   * in the `spend` action.
   */
  readonly spentBalance: ToField<Option<Balance<T>>>
  /**
   * Collected approvals (stamps) from completed `Rules`. They're matched
   * against `TokenPolicy.rules` to determine if the request can be
   * confirmed.
   */
  readonly approvals: ToField<VecSet<TypeName>>

  private constructor(typeArgs: [PhantomToTypeStr<T>], fields: ActionRequestFields<T>) {
    this.$fullTypeName = composeSuiType(
      ActionRequest.$typeName,
      ...typeArgs
    ) as `0x2::token::ActionRequest<${PhantomToTypeStr<T>}>`
    this.$typeArgs = typeArgs

    this.name = fields.name
    this.amount = fields.amount
    this.sender = fields.sender
    this.recipient = fields.recipient
    this.spentBalance = fields.spentBalance
    this.approvals = fields.approvals
  }

  static reified<T extends PhantomReified<PhantomTypeArgument>>(
    T: T
  ): ActionRequestReified<ToPhantomTypeArgument<T>> {
    const reifiedBcs = ActionRequest.bcs
    return {
      typeName: ActionRequest.$typeName,
      fullTypeName: composeSuiType(
        ActionRequest.$typeName,
        ...[extractType(T)]
      ) as `0x2::token::ActionRequest<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`,
      typeArgs: [extractType(T)] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>],
      isPhantom: ActionRequest.$isPhantom,
      reifiedTypeArgs: [T],
      fromFields: (fields: Record<string, any>) => ActionRequest.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => ActionRequest.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => ActionRequest.fromFields(T, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => ActionRequest.fromJSONField(T, field),
      fromJSON: (json: Record<string, any>) => ActionRequest.fromJSON(T, json),
      fromSuiParsedData: (content: SuiParsedData) => ActionRequest.fromSuiParsedData(T, content),
      fromSuiObjectData: (content: SuiObjectData) => ActionRequest.fromSuiObjectData(T, content),
      fetch: async (client: SupportedSuiClient, id: string) => ActionRequest.fetch(client, T, id),
      new: (fields: ActionRequestFields<ToPhantomTypeArgument<T>>) => {
        return new ActionRequest([extractType(T)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): typeof ActionRequest.reified {
    return ActionRequest.reified
  }

  static phantom<T extends PhantomReified<PhantomTypeArgument>>(
    T: T
  ): PhantomReified<ToTypeStr<ActionRequest<ToPhantomTypeArgument<T>>>> {
    return phantom(ActionRequest.reified(T))
  }

  static get p(): typeof ActionRequest.phantom {
    return ActionRequest.phantom
  }

  private static instantiateBcs() {
    return bcs.struct('ActionRequest', {
      name: String.bcs,
      amount: bcs.u64(),
      sender: bcs.bytes(32).transform({
        input: (val: string) => fromHex(val),
        output: (val: Uint8Array) => toHex(val),
      }),
      recipient: Option.bcs(
        bcs.bytes(32).transform({
          input: (val: string) => fromHex(val),
          output: (val: Uint8Array) => toHex(val),
        })
      ),
      spent_balance: Option.bcs(Balance.bcs),
      approvals: VecSet.bcs(TypeName.bcs),
    })
  }

  private static cachedBcs: ReturnType<typeof ActionRequest.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof ActionRequest.instantiateBcs> {
    if (!ActionRequest.cachedBcs) {
      ActionRequest.cachedBcs = ActionRequest.instantiateBcs()
    }
    return ActionRequest.cachedBcs
  }

  static fromFields<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    fields: Record<string, any>
  ): ActionRequest<ToPhantomTypeArgument<T>> {
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

  static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    item: FieldsWithTypes
  ): ActionRequest<ToPhantomTypeArgument<T>> {
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

  static fromBcs<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    data: Uint8Array
  ): ActionRequest<ToPhantomTypeArgument<T>> {
    return ActionRequest.fromFields(typeArg, ActionRequest.bcs.parse(data))
  }

  toJSONField(): ActionRequestJSONField<T> {
    return {
      name: this.name,
      amount: this.amount.toString(),
      sender: this.sender,
      recipient: fieldToJSON<Option<'address'>>(`${Option.$typeName}<address>`, this.recipient),
      spentBalance: fieldToJSON<Option<Balance<T>>>(
        `${Option.$typeName}<${Balance.$typeName}<${this.$typeArgs[0]}>>`,
        this.spentBalance
      ),
      approvals: this.approvals.toJSONField(),
    }
  }

  toJSON(): ActionRequestJSON<T> {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    field: any
  ): ActionRequest<ToPhantomTypeArgument<T>> {
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

  static fromJSON<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    json: Record<string, any>
  ): ActionRequest<ToPhantomTypeArgument<T>> {
    if (json.$typeName !== ActionRequest.$typeName) {
      throw new Error(
        `not a ActionRequest json object: expected '${ActionRequest.$typeName}' but got '${json.$typeName}'`
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(ActionRequest.$typeName, ...[extractType(typeArg)]),
      json.$typeArgs,
      [typeArg]
    )

    return ActionRequest.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    content: SuiParsedData
  ): ActionRequest<ToPhantomTypeArgument<T>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isActionRequest(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a ActionRequest object`)
    }
    return ActionRequest.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    data: SuiObjectData
  ): ActionRequest<ToPhantomTypeArgument<T>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isActionRequest(data.bcs.type)) {
        throw new Error(`object at is not a ActionRequest object`)
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs
      if (gotTypeArgs.length !== 1) {
        throw new Error(
          `type argument mismatch: expected 1 type arguments but got '${gotTypeArgs.length}'`
        )
      }
      for (let i = 0; i < 1; i++) {
        const gotTypeArg = compressSuiType(gotTypeArgs[i])
        const expectedTypeArg = compressSuiType(extractType([typeArg][i]))
        if (gotTypeArg !== expectedTypeArg) {
          throw new Error(
            `type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`
          )
        }
      }

      return ActionRequest.fromBcs(typeArg, fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return ActionRequest.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<T extends PhantomReified<PhantomTypeArgument>>(
    client: SupportedSuiClient,
    typeArg: T,
    id: string
  ): Promise<ActionRequest<ToPhantomTypeArgument<T>>> {
    const res = await fetchObjectBcs(client, id)
    if (!isActionRequest(res.type)) {
      throw new Error(`object at id ${id} is not a ActionRequest object`)
    }

    const gotTypeArgs = parseTypeName(res.type).typeArgs
    if (gotTypeArgs.length !== 1) {
      throw new Error(
        `type argument mismatch: expected 1 type arguments but got '${gotTypeArgs.length}'`
      )
    }
    for (let i = 0; i < 1; i++) {
      const gotTypeArg = compressSuiType(gotTypeArgs[i])
      const expectedTypeArg = compressSuiType(extractType([typeArg][i]))
      if (gotTypeArg !== expectedTypeArg) {
        throw new Error(
          `type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`
        )
      }
    }

    return ActionRequest.fromBcs(typeArg, res.bcsBytes)
  }
}

/* ============================== RuleKey =============================== */

export function isRuleKey(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::token::RuleKey` + '<')
}

export interface RuleKeyFields<T extends PhantomTypeArgument> {
  isProtected: ToField<'bool'>
}

export type RuleKeyReified<T extends PhantomTypeArgument> = Reified<RuleKey<T>, RuleKeyFields<T>>

export type RuleKeyJSONField<T extends PhantomTypeArgument> = {
  isProtected: boolean
}

export type RuleKeyJSON<T extends PhantomTypeArgument> = {
  $typeName: typeof RuleKey.$typeName
  $typeArgs: [PhantomToTypeStr<T>]
} & RuleKeyJSONField<T>

/**
 * Dynamic field key for the `TokenPolicy` to store the `Config` for a
 * specific action `Rule`. There can be only one configuration per
 * `Rule` per `TokenPolicy`.
 */
export class RuleKey<T extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::token::RuleKey` = `0x2::token::RuleKey` as const
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName: typeof RuleKey.$typeName = RuleKey.$typeName
  readonly $fullTypeName: `0x2::token::RuleKey<${PhantomToTypeStr<T>}>`
  readonly $typeArgs: [PhantomToTypeStr<T>]
  readonly $isPhantom: typeof RuleKey.$isPhantom = RuleKey.$isPhantom

  readonly isProtected: ToField<'bool'>

  private constructor(typeArgs: [PhantomToTypeStr<T>], fields: RuleKeyFields<T>) {
    this.$fullTypeName = composeSuiType(
      RuleKey.$typeName,
      ...typeArgs
    ) as `0x2::token::RuleKey<${PhantomToTypeStr<T>}>`
    this.$typeArgs = typeArgs

    this.isProtected = fields.isProtected
  }

  static reified<T extends PhantomReified<PhantomTypeArgument>>(
    T: T
  ): RuleKeyReified<ToPhantomTypeArgument<T>> {
    const reifiedBcs = RuleKey.bcs
    return {
      typeName: RuleKey.$typeName,
      fullTypeName: composeSuiType(
        RuleKey.$typeName,
        ...[extractType(T)]
      ) as `0x2::token::RuleKey<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`,
      typeArgs: [extractType(T)] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>],
      isPhantom: RuleKey.$isPhantom,
      reifiedTypeArgs: [T],
      fromFields: (fields: Record<string, any>) => RuleKey.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => RuleKey.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => RuleKey.fromFields(T, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => RuleKey.fromJSONField(T, field),
      fromJSON: (json: Record<string, any>) => RuleKey.fromJSON(T, json),
      fromSuiParsedData: (content: SuiParsedData) => RuleKey.fromSuiParsedData(T, content),
      fromSuiObjectData: (content: SuiObjectData) => RuleKey.fromSuiObjectData(T, content),
      fetch: async (client: SupportedSuiClient, id: string) => RuleKey.fetch(client, T, id),
      new: (fields: RuleKeyFields<ToPhantomTypeArgument<T>>) => {
        return new RuleKey([extractType(T)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): typeof RuleKey.reified {
    return RuleKey.reified
  }

  static phantom<T extends PhantomReified<PhantomTypeArgument>>(
    T: T
  ): PhantomReified<ToTypeStr<RuleKey<ToPhantomTypeArgument<T>>>> {
    return phantom(RuleKey.reified(T))
  }

  static get p(): typeof RuleKey.phantom {
    return RuleKey.phantom
  }

  private static instantiateBcs() {
    return bcs.struct('RuleKey', {
      is_protected: bcs.bool(),
    })
  }

  private static cachedBcs: ReturnType<typeof RuleKey.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof RuleKey.instantiateBcs> {
    if (!RuleKey.cachedBcs) {
      RuleKey.cachedBcs = RuleKey.instantiateBcs()
    }
    return RuleKey.cachedBcs
  }

  static fromFields<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    fields: Record<string, any>
  ): RuleKey<ToPhantomTypeArgument<T>> {
    return RuleKey.reified(typeArg).new({
      isProtected: decodeFromFields('bool', fields.is_protected),
    })
  }

  static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    item: FieldsWithTypes
  ): RuleKey<ToPhantomTypeArgument<T>> {
    if (!isRuleKey(item.type)) {
      throw new Error('not a RuleKey type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return RuleKey.reified(typeArg).new({
      isProtected: decodeFromFieldsWithTypes('bool', item.fields.is_protected),
    })
  }

  static fromBcs<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    data: Uint8Array
  ): RuleKey<ToPhantomTypeArgument<T>> {
    return RuleKey.fromFields(typeArg, RuleKey.bcs.parse(data))
  }

  toJSONField(): RuleKeyJSONField<T> {
    return {
      isProtected: this.isProtected,
    }
  }

  toJSON(): RuleKeyJSON<T> {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    field: any
  ): RuleKey<ToPhantomTypeArgument<T>> {
    return RuleKey.reified(typeArg).new({
      isProtected: decodeFromJSONField('bool', field.isProtected),
    })
  }

  static fromJSON<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    json: Record<string, any>
  ): RuleKey<ToPhantomTypeArgument<T>> {
    if (json.$typeName !== RuleKey.$typeName) {
      throw new Error(
        `not a RuleKey json object: expected '${RuleKey.$typeName}' but got '${json.$typeName}'`
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(RuleKey.$typeName, ...[extractType(typeArg)]),
      json.$typeArgs,
      [typeArg]
    )

    return RuleKey.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    content: SuiParsedData
  ): RuleKey<ToPhantomTypeArgument<T>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isRuleKey(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a RuleKey object`)
    }
    return RuleKey.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    data: SuiObjectData
  ): RuleKey<ToPhantomTypeArgument<T>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isRuleKey(data.bcs.type)) {
        throw new Error(`object at is not a RuleKey object`)
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs
      if (gotTypeArgs.length !== 1) {
        throw new Error(
          `type argument mismatch: expected 1 type arguments but got '${gotTypeArgs.length}'`
        )
      }
      for (let i = 0; i < 1; i++) {
        const gotTypeArg = compressSuiType(gotTypeArgs[i])
        const expectedTypeArg = compressSuiType(extractType([typeArg][i]))
        if (gotTypeArg !== expectedTypeArg) {
          throw new Error(
            `type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`
          )
        }
      }

      return RuleKey.fromBcs(typeArg, fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return RuleKey.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<T extends PhantomReified<PhantomTypeArgument>>(
    client: SupportedSuiClient,
    typeArg: T,
    id: string
  ): Promise<RuleKey<ToPhantomTypeArgument<T>>> {
    const res = await fetchObjectBcs(client, id)
    if (!isRuleKey(res.type)) {
      throw new Error(`object at id ${id} is not a RuleKey object`)
    }

    const gotTypeArgs = parseTypeName(res.type).typeArgs
    if (gotTypeArgs.length !== 1) {
      throw new Error(
        `type argument mismatch: expected 1 type arguments but got '${gotTypeArgs.length}'`
      )
    }
    for (let i = 0; i < 1; i++) {
      const gotTypeArg = compressSuiType(gotTypeArgs[i])
      const expectedTypeArg = compressSuiType(extractType([typeArg][i]))
      if (gotTypeArg !== expectedTypeArg) {
        throw new Error(
          `type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`
        )
      }
    }

    return RuleKey.fromBcs(typeArg, res.bcsBytes)
  }
}

/* ============================== TokenPolicyCreated =============================== */

export function isTokenPolicyCreated(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::token::TokenPolicyCreated` + '<')
}

export interface TokenPolicyCreatedFields<T extends PhantomTypeArgument> {
  /** ID of the `TokenPolicy` that was created. */
  id: ToField<ID>
  /**
   * Whether the `TokenPolicy` is "shared" (mutable) or "frozen"
   * (immutable) - TBD.
   */
  isMutable: ToField<'bool'>
}

export type TokenPolicyCreatedReified<T extends PhantomTypeArgument> = Reified<
  TokenPolicyCreated<T>,
  TokenPolicyCreatedFields<T>
>

export type TokenPolicyCreatedJSONField<T extends PhantomTypeArgument> = {
  id: string
  isMutable: boolean
}

export type TokenPolicyCreatedJSON<T extends PhantomTypeArgument> = {
  $typeName: typeof TokenPolicyCreated.$typeName
  $typeArgs: [PhantomToTypeStr<T>]
} & TokenPolicyCreatedJSONField<T>

/**
 * An event emitted when a `TokenPolicy` is created and shared. Because
 * `TokenPolicy` can only be shared (and potentially frozen in the future),
 * we emit this event in the `share_policy` function and mark it as mutable.
 */
export class TokenPolicyCreated<T extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::token::TokenPolicyCreated` =
    `0x2::token::TokenPolicyCreated` as const
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName: typeof TokenPolicyCreated.$typeName = TokenPolicyCreated.$typeName
  readonly $fullTypeName: `0x2::token::TokenPolicyCreated<${PhantomToTypeStr<T>}>`
  readonly $typeArgs: [PhantomToTypeStr<T>]
  readonly $isPhantom: typeof TokenPolicyCreated.$isPhantom = TokenPolicyCreated.$isPhantom

  /** ID of the `TokenPolicy` that was created. */
  readonly id: ToField<ID>
  /**
   * Whether the `TokenPolicy` is "shared" (mutable) or "frozen"
   * (immutable) - TBD.
   */
  readonly isMutable: ToField<'bool'>

  private constructor(typeArgs: [PhantomToTypeStr<T>], fields: TokenPolicyCreatedFields<T>) {
    this.$fullTypeName = composeSuiType(
      TokenPolicyCreated.$typeName,
      ...typeArgs
    ) as `0x2::token::TokenPolicyCreated<${PhantomToTypeStr<T>}>`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.isMutable = fields.isMutable
  }

  static reified<T extends PhantomReified<PhantomTypeArgument>>(
    T: T
  ): TokenPolicyCreatedReified<ToPhantomTypeArgument<T>> {
    const reifiedBcs = TokenPolicyCreated.bcs
    return {
      typeName: TokenPolicyCreated.$typeName,
      fullTypeName: composeSuiType(
        TokenPolicyCreated.$typeName,
        ...[extractType(T)]
      ) as `0x2::token::TokenPolicyCreated<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`,
      typeArgs: [extractType(T)] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>],
      isPhantom: TokenPolicyCreated.$isPhantom,
      reifiedTypeArgs: [T],
      fromFields: (fields: Record<string, any>) => TokenPolicyCreated.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        TokenPolicyCreated.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => TokenPolicyCreated.fromFields(T, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => TokenPolicyCreated.fromJSONField(T, field),
      fromJSON: (json: Record<string, any>) => TokenPolicyCreated.fromJSON(T, json),
      fromSuiParsedData: (content: SuiParsedData) =>
        TokenPolicyCreated.fromSuiParsedData(T, content),
      fromSuiObjectData: (content: SuiObjectData) =>
        TokenPolicyCreated.fromSuiObjectData(T, content),
      fetch: async (client: SupportedSuiClient, id: string) =>
        TokenPolicyCreated.fetch(client, T, id),
      new: (fields: TokenPolicyCreatedFields<ToPhantomTypeArgument<T>>) => {
        return new TokenPolicyCreated([extractType(T)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): typeof TokenPolicyCreated.reified {
    return TokenPolicyCreated.reified
  }

  static phantom<T extends PhantomReified<PhantomTypeArgument>>(
    T: T
  ): PhantomReified<ToTypeStr<TokenPolicyCreated<ToPhantomTypeArgument<T>>>> {
    return phantom(TokenPolicyCreated.reified(T))
  }

  static get p(): typeof TokenPolicyCreated.phantom {
    return TokenPolicyCreated.phantom
  }

  private static instantiateBcs() {
    return bcs.struct('TokenPolicyCreated', {
      id: ID.bcs,
      is_mutable: bcs.bool(),
    })
  }

  private static cachedBcs: ReturnType<typeof TokenPolicyCreated.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof TokenPolicyCreated.instantiateBcs> {
    if (!TokenPolicyCreated.cachedBcs) {
      TokenPolicyCreated.cachedBcs = TokenPolicyCreated.instantiateBcs()
    }
    return TokenPolicyCreated.cachedBcs
  }

  static fromFields<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    fields: Record<string, any>
  ): TokenPolicyCreated<ToPhantomTypeArgument<T>> {
    return TokenPolicyCreated.reified(typeArg).new({
      id: decodeFromFields(ID.reified(), fields.id),
      isMutable: decodeFromFields('bool', fields.is_mutable),
    })
  }

  static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    item: FieldsWithTypes
  ): TokenPolicyCreated<ToPhantomTypeArgument<T>> {
    if (!isTokenPolicyCreated(item.type)) {
      throw new Error('not a TokenPolicyCreated type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return TokenPolicyCreated.reified(typeArg).new({
      id: decodeFromFieldsWithTypes(ID.reified(), item.fields.id),
      isMutable: decodeFromFieldsWithTypes('bool', item.fields.is_mutable),
    })
  }

  static fromBcs<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    data: Uint8Array
  ): TokenPolicyCreated<ToPhantomTypeArgument<T>> {
    return TokenPolicyCreated.fromFields(typeArg, TokenPolicyCreated.bcs.parse(data))
  }

  toJSONField(): TokenPolicyCreatedJSONField<T> {
    return {
      id: this.id,
      isMutable: this.isMutable,
    }
  }

  toJSON(): TokenPolicyCreatedJSON<T> {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    field: any
  ): TokenPolicyCreated<ToPhantomTypeArgument<T>> {
    return TokenPolicyCreated.reified(typeArg).new({
      id: decodeFromJSONField(ID.reified(), field.id),
      isMutable: decodeFromJSONField('bool', field.isMutable),
    })
  }

  static fromJSON<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    json: Record<string, any>
  ): TokenPolicyCreated<ToPhantomTypeArgument<T>> {
    if (json.$typeName !== TokenPolicyCreated.$typeName) {
      throw new Error(
        `not a TokenPolicyCreated json object: expected '${TokenPolicyCreated.$typeName}' but got '${json.$typeName}'`
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(TokenPolicyCreated.$typeName, ...[extractType(typeArg)]),
      json.$typeArgs,
      [typeArg]
    )

    return TokenPolicyCreated.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    content: SuiParsedData
  ): TokenPolicyCreated<ToPhantomTypeArgument<T>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isTokenPolicyCreated(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a TokenPolicyCreated object`)
    }
    return TokenPolicyCreated.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    data: SuiObjectData
  ): TokenPolicyCreated<ToPhantomTypeArgument<T>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isTokenPolicyCreated(data.bcs.type)) {
        throw new Error(`object at is not a TokenPolicyCreated object`)
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs
      if (gotTypeArgs.length !== 1) {
        throw new Error(
          `type argument mismatch: expected 1 type arguments but got '${gotTypeArgs.length}'`
        )
      }
      for (let i = 0; i < 1; i++) {
        const gotTypeArg = compressSuiType(gotTypeArgs[i])
        const expectedTypeArg = compressSuiType(extractType([typeArg][i]))
        if (gotTypeArg !== expectedTypeArg) {
          throw new Error(
            `type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`
          )
        }
      }

      return TokenPolicyCreated.fromBcs(typeArg, fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return TokenPolicyCreated.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<T extends PhantomReified<PhantomTypeArgument>>(
    client: SupportedSuiClient,
    typeArg: T,
    id: string
  ): Promise<TokenPolicyCreated<ToPhantomTypeArgument<T>>> {
    const res = await fetchObjectBcs(client, id)
    if (!isTokenPolicyCreated(res.type)) {
      throw new Error(`object at id ${id} is not a TokenPolicyCreated object`)
    }

    const gotTypeArgs = parseTypeName(res.type).typeArgs
    if (gotTypeArgs.length !== 1) {
      throw new Error(
        `type argument mismatch: expected 1 type arguments but got '${gotTypeArgs.length}'`
      )
    }
    for (let i = 0; i < 1; i++) {
      const gotTypeArg = compressSuiType(gotTypeArgs[i])
      const expectedTypeArg = compressSuiType(extractType([typeArg][i]))
      if (gotTypeArg !== expectedTypeArg) {
        throw new Error(
          `type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`
        )
      }
    }

    return TokenPolicyCreated.fromBcs(typeArg, res.bcsBytes)
  }
}
