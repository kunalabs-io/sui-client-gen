/**
 * A storable handler for Balances in general. Is used in the `Coin`
 * module to allow balance operations and can be used to implement
 * custom coins with `Supply` and `Balance`s.
 */

import { bcs } from '@mysten/sui/bcs'
import { SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromBase64 } from '@mysten/sui/utils'
import {
  assertFieldsWithTypesArgsMatch,
  assertReifiedTypeArgsMatch,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  extractType,
  phantom,
  PhantomReified,
  PhantomToTypeStr,
  PhantomTypeArgument,
  Reified,
  StructClass,
  ToField,
  ToJSON,
  ToPhantomTypeArgument,
  ToTypeStr,
} from '../../_framework/reified'
import {
  composeSuiType,
  compressSuiType,
  fetchObjectBcs,
  FieldsWithTypes,
  parseTypeName,
  SupportedSuiClient,
} from '../../_framework/util'

/* ============================== Supply =============================== */

export function isSupply(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::balance::Supply` + '<')
}

export interface SupplyFields<T extends PhantomTypeArgument> {
  value: ToField<'u64'>
}

export type SupplyReified<T extends PhantomTypeArgument> = Reified<Supply<T>, SupplyFields<T>>

export type SupplyJSONField<T extends PhantomTypeArgument> = {
  value: string
}

export type SupplyJSON<T extends PhantomTypeArgument> = {
  $typeName: typeof Supply.$typeName
  $typeArgs: [PhantomToTypeStr<T>]
} & SupplyJSONField<T>

/**
 * A Supply of T. Used for minting and burning.
 * Wrapped into a `TreasuryCap` in the `Coin` module.
 */
export class Supply<T extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::balance::Supply` = `0x2::balance::Supply` as const
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName: typeof Supply.$typeName = Supply.$typeName
  readonly $fullTypeName: `0x2::balance::Supply<${PhantomToTypeStr<T>}>`
  readonly $typeArgs: [PhantomToTypeStr<T>]
  readonly $isPhantom: typeof Supply.$isPhantom = Supply.$isPhantom

  readonly value: ToField<'u64'>

  private constructor(typeArgs: [PhantomToTypeStr<T>], fields: SupplyFields<T>) {
    this.$fullTypeName = composeSuiType(
      Supply.$typeName,
      ...typeArgs,
    ) as `0x2::balance::Supply<${PhantomToTypeStr<T>}>`
    this.$typeArgs = typeArgs

    this.value = fields.value
  }

  static reified<T extends PhantomReified<PhantomTypeArgument>>(
    T: T,
  ): SupplyReified<ToPhantomTypeArgument<T>> {
    const reifiedBcs = Supply.bcs
    return {
      typeName: Supply.$typeName,
      fullTypeName: composeSuiType(
        Supply.$typeName,
        ...[extractType(T)],
      ) as `0x2::balance::Supply<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`,
      typeArgs: [extractType(T)] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>],
      isPhantom: Supply.$isPhantom,
      reifiedTypeArgs: [T],
      fromFields: (fields: Record<string, any>) => Supply.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Supply.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => Supply.fromFields(T, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => Supply.fromJSONField(T, field),
      fromJSON: (json: Record<string, any>) => Supply.fromJSON(T, json),
      fromSuiParsedData: (content: SuiParsedData) => Supply.fromSuiParsedData(T, content),
      fromSuiObjectData: (content: SuiObjectData) => Supply.fromSuiObjectData(T, content),
      fetch: async (client: SupportedSuiClient, id: string) => Supply.fetch(client, T, id),
      new: (fields: SupplyFields<ToPhantomTypeArgument<T>>) => {
        return new Supply([extractType(T)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): typeof Supply.reified {
    return Supply.reified
  }

  static phantom<T extends PhantomReified<PhantomTypeArgument>>(
    T: T,
  ): PhantomReified<ToTypeStr<Supply<ToPhantomTypeArgument<T>>>> {
    return phantom(Supply.reified(T))
  }

  static get p(): typeof Supply.phantom {
    return Supply.phantom
  }

  private static instantiateBcs() {
    return bcs.struct('Supply', {
      value: bcs.u64(),
    })
  }

  private static cachedBcs: ReturnType<typeof Supply.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof Supply.instantiateBcs> {
    if (!Supply.cachedBcs) {
      Supply.cachedBcs = Supply.instantiateBcs()
    }
    return Supply.cachedBcs
  }

  static fromFields<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    fields: Record<string, any>,
  ): Supply<ToPhantomTypeArgument<T>> {
    return Supply.reified(typeArg).new({
      value: decodeFromFields('u64', fields.value),
    })
  }

  static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    item: FieldsWithTypes,
  ): Supply<ToPhantomTypeArgument<T>> {
    if (!isSupply(item.type)) {
      throw new Error('not a Supply type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Supply.reified(typeArg).new({
      value: decodeFromFieldsWithTypes('u64', item.fields.value),
    })
  }

  static fromBcs<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    data: Uint8Array,
  ): Supply<ToPhantomTypeArgument<T>> {
    return Supply.fromFields(typeArg, Supply.bcs.parse(data))
  }

  toJSONField(): SupplyJSONField<T> {
    return {
      value: this.value.toString(),
    }
  }

  toJSON(): SupplyJSON<T> {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    field: any,
  ): Supply<ToPhantomTypeArgument<T>> {
    return Supply.reified(typeArg).new({
      value: decodeFromJSONField('u64', field.value),
    })
  }

  static fromJSON<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    json: Record<string, any>,
  ): Supply<ToPhantomTypeArgument<T>> {
    if (json.$typeName !== Supply.$typeName) {
      throw new Error(
        `not a Supply json object: expected '${Supply.$typeName}' but got '${json.$typeName}'`,
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Supply.$typeName, ...[extractType(typeArg)]),
      json.$typeArgs,
      [typeArg],
    )

    return Supply.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    content: SuiParsedData,
  ): Supply<ToPhantomTypeArgument<T>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isSupply(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Supply object`)
    }
    return Supply.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    data: SuiObjectData,
  ): Supply<ToPhantomTypeArgument<T>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isSupply(data.bcs.type)) {
        throw new Error(`object at is not a Supply object`)
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs
      if (gotTypeArgs.length !== 1) {
        throw new Error(
          `type argument mismatch: expected 1 type arguments but got '${gotTypeArgs.length}'`,
        )
      }
      for (let i = 0; i < 1; i++) {
        const gotTypeArg = compressSuiType(gotTypeArgs[i])
        const expectedTypeArg = compressSuiType(extractType([typeArg][i]))
        if (gotTypeArg !== expectedTypeArg) {
          throw new Error(
            `type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`,
          )
        }
      }

      return Supply.fromBcs(typeArg, fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Supply.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.',
    )
  }

  static async fetch<T extends PhantomReified<PhantomTypeArgument>>(
    client: SupportedSuiClient,
    typeArg: T,
    id: string,
  ): Promise<Supply<ToPhantomTypeArgument<T>>> {
    const res = await fetchObjectBcs(client, id)
    if (!isSupply(res.type)) {
      throw new Error(`object at id ${id} is not a Supply object`)
    }

    const gotTypeArgs = parseTypeName(res.type).typeArgs
    if (gotTypeArgs.length !== 1) {
      throw new Error(
        `type argument mismatch: expected 1 type arguments but got '${gotTypeArgs.length}'`,
      )
    }
    for (let i = 0; i < 1; i++) {
      const gotTypeArg = compressSuiType(gotTypeArgs[i])
      const expectedTypeArg = compressSuiType(extractType([typeArg][i]))
      if (gotTypeArg !== expectedTypeArg) {
        throw new Error(
          `type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`,
        )
      }
    }

    return Supply.fromBcs(typeArg, res.bcsBytes)
  }
}

/* ============================== Balance =============================== */

export function isBalance(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::balance::Balance` + '<')
}

export interface BalanceFields<T extends PhantomTypeArgument> {
  value: ToField<'u64'>
}

export type BalanceReified<T extends PhantomTypeArgument> = Reified<Balance<T>, BalanceFields<T>>

export type BalanceJSONField<T extends PhantomTypeArgument> = {
  value: string
}

export type BalanceJSON<T extends PhantomTypeArgument> = {
  $typeName: typeof Balance.$typeName
  $typeArgs: [PhantomToTypeStr<T>]
} & BalanceJSONField<T>

/**
 * Storable balance - an inner struct of a Coin type.
 * Can be used to store coins which don't need the key ability.
 */
export class Balance<T extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::balance::Balance` = `0x2::balance::Balance` as const
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName: typeof Balance.$typeName = Balance.$typeName
  readonly $fullTypeName: `0x2::balance::Balance<${PhantomToTypeStr<T>}>`
  readonly $typeArgs: [PhantomToTypeStr<T>]
  readonly $isPhantom: typeof Balance.$isPhantom = Balance.$isPhantom

  readonly value: ToField<'u64'>

  private constructor(typeArgs: [PhantomToTypeStr<T>], fields: BalanceFields<T>) {
    this.$fullTypeName = composeSuiType(
      Balance.$typeName,
      ...typeArgs,
    ) as `0x2::balance::Balance<${PhantomToTypeStr<T>}>`
    this.$typeArgs = typeArgs

    this.value = fields.value
  }

  static reified<T extends PhantomReified<PhantomTypeArgument>>(
    T: T,
  ): BalanceReified<ToPhantomTypeArgument<T>> {
    const reifiedBcs = Balance.bcs
    return {
      typeName: Balance.$typeName,
      fullTypeName: composeSuiType(
        Balance.$typeName,
        ...[extractType(T)],
      ) as `0x2::balance::Balance<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`,
      typeArgs: [extractType(T)] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>],
      isPhantom: Balance.$isPhantom,
      reifiedTypeArgs: [T],
      fromFields: (fields: Record<string, any>) => Balance.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Balance.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => Balance.fromFields(T, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => Balance.fromJSONField(T, field),
      fromJSON: (json: Record<string, any>) => Balance.fromJSON(T, json),
      fromSuiParsedData: (content: SuiParsedData) => Balance.fromSuiParsedData(T, content),
      fromSuiObjectData: (content: SuiObjectData) => Balance.fromSuiObjectData(T, content),
      fetch: async (client: SupportedSuiClient, id: string) => Balance.fetch(client, T, id),
      new: (fields: BalanceFields<ToPhantomTypeArgument<T>>) => {
        return new Balance([extractType(T)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): typeof Balance.reified {
    return Balance.reified
  }

  static phantom<T extends PhantomReified<PhantomTypeArgument>>(
    T: T,
  ): PhantomReified<ToTypeStr<Balance<ToPhantomTypeArgument<T>>>> {
    return phantom(Balance.reified(T))
  }

  static get p(): typeof Balance.phantom {
    return Balance.phantom
  }

  private static instantiateBcs() {
    return bcs.struct('Balance', {
      value: bcs.u64(),
    })
  }

  private static cachedBcs: ReturnType<typeof Balance.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof Balance.instantiateBcs> {
    if (!Balance.cachedBcs) {
      Balance.cachedBcs = Balance.instantiateBcs()
    }
    return Balance.cachedBcs
  }

  static fromFields<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    fields: Record<string, any>,
  ): Balance<ToPhantomTypeArgument<T>> {
    return Balance.reified(typeArg).new({
      value: decodeFromFields('u64', fields.value),
    })
  }

  static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    item: FieldsWithTypes,
  ): Balance<ToPhantomTypeArgument<T>> {
    if (!isBalance(item.type)) {
      throw new Error('not a Balance type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Balance.reified(typeArg).new({
      value: decodeFromFieldsWithTypes('u64', item.fields.value),
    })
  }

  static fromBcs<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    data: Uint8Array,
  ): Balance<ToPhantomTypeArgument<T>> {
    return Balance.fromFields(typeArg, Balance.bcs.parse(data))
  }

  toJSONField(): BalanceJSONField<T> {
    return {
      value: this.value.toString(),
    }
  }

  toJSON(): BalanceJSON<T> {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    field: any,
  ): Balance<ToPhantomTypeArgument<T>> {
    return Balance.reified(typeArg).new({
      value: decodeFromJSONField('u64', field.value),
    })
  }

  static fromJSON<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    json: Record<string, any>,
  ): Balance<ToPhantomTypeArgument<T>> {
    if (json.$typeName !== Balance.$typeName) {
      throw new Error(
        `not a Balance json object: expected '${Balance.$typeName}' but got '${json.$typeName}'`,
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Balance.$typeName, ...[extractType(typeArg)]),
      json.$typeArgs,
      [typeArg],
    )

    return Balance.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    content: SuiParsedData,
  ): Balance<ToPhantomTypeArgument<T>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isBalance(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Balance object`)
    }
    return Balance.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    data: SuiObjectData,
  ): Balance<ToPhantomTypeArgument<T>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isBalance(data.bcs.type)) {
        throw new Error(`object at is not a Balance object`)
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs
      if (gotTypeArgs.length !== 1) {
        throw new Error(
          `type argument mismatch: expected 1 type arguments but got '${gotTypeArgs.length}'`,
        )
      }
      for (let i = 0; i < 1; i++) {
        const gotTypeArg = compressSuiType(gotTypeArgs[i])
        const expectedTypeArg = compressSuiType(extractType([typeArg][i]))
        if (gotTypeArg !== expectedTypeArg) {
          throw new Error(
            `type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`,
          )
        }
      }

      return Balance.fromBcs(typeArg, fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Balance.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.',
    )
  }

  static async fetch<T extends PhantomReified<PhantomTypeArgument>>(
    client: SupportedSuiClient,
    typeArg: T,
    id: string,
  ): Promise<Balance<ToPhantomTypeArgument<T>>> {
    const res = await fetchObjectBcs(client, id)
    if (!isBalance(res.type)) {
      throw new Error(`object at id ${id} is not a Balance object`)
    }

    const gotTypeArgs = parseTypeName(res.type).typeArgs
    if (gotTypeArgs.length !== 1) {
      throw new Error(
        `type argument mismatch: expected 1 type arguments but got '${gotTypeArgs.length}'`,
      )
    }
    for (let i = 0; i < 1; i++) {
      const gotTypeArg = compressSuiType(gotTypeArgs[i])
      const expectedTypeArg = compressSuiType(extractType([typeArg][i]))
      if (gotTypeArg !== expectedTypeArg) {
        throw new Error(
          `type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`,
        )
      }
    }

    return Balance.fromBcs(typeArg, res.bcsBytes)
  }
}
