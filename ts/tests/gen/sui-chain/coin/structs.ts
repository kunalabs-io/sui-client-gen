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
import { String as String1 } from '../../move-stdlib-chain/ascii/structs'
import { Option } from '../../move-stdlib-chain/option/structs'
import { String } from '../../move-stdlib-chain/string/structs'
import { Balance, Supply } from '../balance/structs'
import { PKG_V29 } from '../index'
import { ID, UID } from '../object/structs'
import { Url } from '../url/structs'
import { bcs } from '@mysten/sui/bcs'
import { SuiClient, SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromB64 } from '@mysten/sui/utils'

/* ============================== Coin =============================== */

export function isCoin(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`${PKG_V29}::coin::Coin` + '<')
}

export interface CoinFields<T0 extends PhantomTypeArgument> {
  id: ToField<UID>
  balance: ToField<Balance<T0>>
}

export type CoinReified<T0 extends PhantomTypeArgument> = Reified<Coin<T0>, CoinFields<T0>>

export class Coin<T0 extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `${PKG_V29}::coin::Coin`
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName = Coin.$typeName
  readonly $fullTypeName: `${typeof PKG_V29}::coin::Coin<${PhantomToTypeStr<T0>}>`
  readonly $typeArgs: [PhantomToTypeStr<T0>]
  readonly $isPhantom = Coin.$isPhantom

  readonly id: ToField<UID>
  readonly balance: ToField<Balance<T0>>

  private constructor(typeArgs: [PhantomToTypeStr<T0>], fields: CoinFields<T0>) {
    this.$fullTypeName = composeSuiType(
      Coin.$typeName,
      ...typeArgs
    ) as `${typeof PKG_V29}::coin::Coin<${PhantomToTypeStr<T0>}>`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.balance = fields.balance
  }

  static reified<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): CoinReified<ToPhantomTypeArgument<T0>> {
    return {
      typeName: Coin.$typeName,
      fullTypeName: composeSuiType(
        Coin.$typeName,
        ...[extractType(T0)]
      ) as `${typeof PKG_V29}::coin::Coin<${PhantomToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [extractType(T0)] as [PhantomToTypeStr<ToPhantomTypeArgument<T0>>],
      isPhantom: Coin.$isPhantom,
      reifiedTypeArgs: [T0],
      fromFields: (fields: Record<string, any>) => Coin.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Coin.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => Coin.fromBcs(T0, data),
      bcs: Coin.bcs,
      fromJSONField: (field: any) => Coin.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => Coin.fromJSON(T0, json),
      fromSuiParsedData: (content: SuiParsedData) => Coin.fromSuiParsedData(T0, content),
      fromSuiObjectData: (content: SuiObjectData) => Coin.fromSuiObjectData(T0, content),
      fetch: async (client: SuiClient, id: string) => Coin.fetch(client, T0, id),
      new: (fields: CoinFields<ToPhantomTypeArgument<T0>>) => {
        return new Coin([extractType(T0)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Coin.reified
  }

  static phantom<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): PhantomReified<ToTypeStr<Coin<ToPhantomTypeArgument<T0>>>> {
    return phantom(Coin.reified(T0))
  }
  static get p() {
    return Coin.phantom
  }

  static get bcs() {
    return bcs.struct('Coin', {
      id: UID.bcs,
      balance: Balance.bcs,
    })
  }

  static fromFields<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    fields: Record<string, any>
  ): Coin<ToPhantomTypeArgument<T0>> {
    return Coin.reified(typeArg).new({
      id: decodeFromFields(UID.reified(), fields.id),
      balance: decodeFromFields(Balance.reified(typeArg), fields.balance),
    })
  }

  static fromFieldsWithTypes<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    item: FieldsWithTypes
  ): Coin<ToPhantomTypeArgument<T0>> {
    if (!isCoin(item.type)) {
      throw new Error('not a Coin type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Coin.reified(typeArg).new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      balance: decodeFromFieldsWithTypes(Balance.reified(typeArg), item.fields.balance),
    })
  }

  static fromBcs<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: Uint8Array
  ): Coin<ToPhantomTypeArgument<T0>> {
    return Coin.fromFields(typeArg, Coin.bcs.parse(data))
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
  ): Coin<ToPhantomTypeArgument<T0>> {
    return Coin.reified(typeArg).new({
      id: decodeFromJSONField(UID.reified(), field.id),
      balance: decodeFromJSONField(Balance.reified(typeArg), field.balance),
    })
  }

  static fromJSON<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    json: Record<string, any>
  ): Coin<ToPhantomTypeArgument<T0>> {
    if (json.$typeName !== Coin.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Coin.$typeName, extractType(typeArg)),
      json.$typeArgs,
      [typeArg]
    )

    return Coin.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    content: SuiParsedData
  ): Coin<ToPhantomTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isCoin(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Coin object`)
    }
    return Coin.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: SuiObjectData
  ): Coin<ToPhantomTypeArgument<T0>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isCoin(data.bcs.type)) {
        throw new Error(`object at is not a Coin object`)
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

      return Coin.fromBcs(typeArg, fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Coin.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<T0 extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<Coin<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching Coin object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isCoin(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a Coin object`)
    }

    return Coin.fromSuiObjectData(typeArg, res.data)
  }
}

/* ============================== CoinMetadata =============================== */

export function isCoinMetadata(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`${PKG_V29}::coin::CoinMetadata` + '<')
}

export interface CoinMetadataFields<T0 extends PhantomTypeArgument> {
  id: ToField<UID>
  decimals: ToField<'u8'>
  name: ToField<String>
  symbol: ToField<String1>
  description: ToField<String>
  iconUrl: ToField<Option<Url>>
}

export type CoinMetadataReified<T0 extends PhantomTypeArgument> = Reified<
  CoinMetadata<T0>,
  CoinMetadataFields<T0>
>

export class CoinMetadata<T0 extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `${PKG_V29}::coin::CoinMetadata`
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName = CoinMetadata.$typeName
  readonly $fullTypeName: `${typeof PKG_V29}::coin::CoinMetadata<${PhantomToTypeStr<T0>}>`
  readonly $typeArgs: [PhantomToTypeStr<T0>]
  readonly $isPhantom = CoinMetadata.$isPhantom

  readonly id: ToField<UID>
  readonly decimals: ToField<'u8'>
  readonly name: ToField<String>
  readonly symbol: ToField<String1>
  readonly description: ToField<String>
  readonly iconUrl: ToField<Option<Url>>

  private constructor(typeArgs: [PhantomToTypeStr<T0>], fields: CoinMetadataFields<T0>) {
    this.$fullTypeName = composeSuiType(
      CoinMetadata.$typeName,
      ...typeArgs
    ) as `${typeof PKG_V29}::coin::CoinMetadata<${PhantomToTypeStr<T0>}>`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.decimals = fields.decimals
    this.name = fields.name
    this.symbol = fields.symbol
    this.description = fields.description
    this.iconUrl = fields.iconUrl
  }

  static reified<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): CoinMetadataReified<ToPhantomTypeArgument<T0>> {
    return {
      typeName: CoinMetadata.$typeName,
      fullTypeName: composeSuiType(
        CoinMetadata.$typeName,
        ...[extractType(T0)]
      ) as `${typeof PKG_V29}::coin::CoinMetadata<${PhantomToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [extractType(T0)] as [PhantomToTypeStr<ToPhantomTypeArgument<T0>>],
      isPhantom: CoinMetadata.$isPhantom,
      reifiedTypeArgs: [T0],
      fromFields: (fields: Record<string, any>) => CoinMetadata.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => CoinMetadata.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => CoinMetadata.fromBcs(T0, data),
      bcs: CoinMetadata.bcs,
      fromJSONField: (field: any) => CoinMetadata.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => CoinMetadata.fromJSON(T0, json),
      fromSuiParsedData: (content: SuiParsedData) => CoinMetadata.fromSuiParsedData(T0, content),
      fromSuiObjectData: (content: SuiObjectData) => CoinMetadata.fromSuiObjectData(T0, content),
      fetch: async (client: SuiClient, id: string) => CoinMetadata.fetch(client, T0, id),
      new: (fields: CoinMetadataFields<ToPhantomTypeArgument<T0>>) => {
        return new CoinMetadata([extractType(T0)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return CoinMetadata.reified
  }

  static phantom<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): PhantomReified<ToTypeStr<CoinMetadata<ToPhantomTypeArgument<T0>>>> {
    return phantom(CoinMetadata.reified(T0))
  }
  static get p() {
    return CoinMetadata.phantom
  }

  static get bcs() {
    return bcs.struct('CoinMetadata', {
      id: UID.bcs,
      decimals: bcs.u8(),
      name: String.bcs,
      symbol: String1.bcs,
      description: String.bcs,
      icon_url: Option.bcs(Url.bcs),
    })
  }

  static fromFields<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    fields: Record<string, any>
  ): CoinMetadata<ToPhantomTypeArgument<T0>> {
    return CoinMetadata.reified(typeArg).new({
      id: decodeFromFields(UID.reified(), fields.id),
      decimals: decodeFromFields('u8', fields.decimals),
      name: decodeFromFields(String.reified(), fields.name),
      symbol: decodeFromFields(String1.reified(), fields.symbol),
      description: decodeFromFields(String.reified(), fields.description),
      iconUrl: decodeFromFields(Option.reified(Url.reified()), fields.icon_url),
    })
  }

  static fromFieldsWithTypes<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    item: FieldsWithTypes
  ): CoinMetadata<ToPhantomTypeArgument<T0>> {
    if (!isCoinMetadata(item.type)) {
      throw new Error('not a CoinMetadata type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return CoinMetadata.reified(typeArg).new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      decimals: decodeFromFieldsWithTypes('u8', item.fields.decimals),
      name: decodeFromFieldsWithTypes(String.reified(), item.fields.name),
      symbol: decodeFromFieldsWithTypes(String1.reified(), item.fields.symbol),
      description: decodeFromFieldsWithTypes(String.reified(), item.fields.description),
      iconUrl: decodeFromFieldsWithTypes(Option.reified(Url.reified()), item.fields.icon_url),
    })
  }

  static fromBcs<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: Uint8Array
  ): CoinMetadata<ToPhantomTypeArgument<T0>> {
    return CoinMetadata.fromFields(typeArg, CoinMetadata.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
      decimals: this.decimals,
      name: this.name,
      symbol: this.symbol,
      description: this.description,
      iconUrl: fieldToJSON<Option<Url>>(`${Option.$typeName}<${Url.$typeName}>`, this.iconUrl),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    field: any
  ): CoinMetadata<ToPhantomTypeArgument<T0>> {
    return CoinMetadata.reified(typeArg).new({
      id: decodeFromJSONField(UID.reified(), field.id),
      decimals: decodeFromJSONField('u8', field.decimals),
      name: decodeFromJSONField(String.reified(), field.name),
      symbol: decodeFromJSONField(String1.reified(), field.symbol),
      description: decodeFromJSONField(String.reified(), field.description),
      iconUrl: decodeFromJSONField(Option.reified(Url.reified()), field.iconUrl),
    })
  }

  static fromJSON<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    json: Record<string, any>
  ): CoinMetadata<ToPhantomTypeArgument<T0>> {
    if (json.$typeName !== CoinMetadata.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(CoinMetadata.$typeName, extractType(typeArg)),
      json.$typeArgs,
      [typeArg]
    )

    return CoinMetadata.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    content: SuiParsedData
  ): CoinMetadata<ToPhantomTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isCoinMetadata(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a CoinMetadata object`)
    }
    return CoinMetadata.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: SuiObjectData
  ): CoinMetadata<ToPhantomTypeArgument<T0>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isCoinMetadata(data.bcs.type)) {
        throw new Error(`object at is not a CoinMetadata object`)
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

      return CoinMetadata.fromBcs(typeArg, fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return CoinMetadata.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<T0 extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<CoinMetadata<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching CoinMetadata object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isCoinMetadata(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a CoinMetadata object`)
    }

    return CoinMetadata.fromSuiObjectData(typeArg, res.data)
  }
}

/* ============================== RegulatedCoinMetadata =============================== */

export function isRegulatedCoinMetadata(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`${PKG_V29}::coin::RegulatedCoinMetadata` + '<')
}

export interface RegulatedCoinMetadataFields<T0 extends PhantomTypeArgument> {
  id: ToField<UID>
  coinMetadataObject: ToField<ID>
  denyCapObject: ToField<ID>
}

export type RegulatedCoinMetadataReified<T0 extends PhantomTypeArgument> = Reified<
  RegulatedCoinMetadata<T0>,
  RegulatedCoinMetadataFields<T0>
>

export class RegulatedCoinMetadata<T0 extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `${PKG_V29}::coin::RegulatedCoinMetadata`
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName = RegulatedCoinMetadata.$typeName
  readonly $fullTypeName: `${typeof PKG_V29}::coin::RegulatedCoinMetadata<${PhantomToTypeStr<T0>}>`
  readonly $typeArgs: [PhantomToTypeStr<T0>]
  readonly $isPhantom = RegulatedCoinMetadata.$isPhantom

  readonly id: ToField<UID>
  readonly coinMetadataObject: ToField<ID>
  readonly denyCapObject: ToField<ID>

  private constructor(typeArgs: [PhantomToTypeStr<T0>], fields: RegulatedCoinMetadataFields<T0>) {
    this.$fullTypeName = composeSuiType(
      RegulatedCoinMetadata.$typeName,
      ...typeArgs
    ) as `${typeof PKG_V29}::coin::RegulatedCoinMetadata<${PhantomToTypeStr<T0>}>`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.coinMetadataObject = fields.coinMetadataObject
    this.denyCapObject = fields.denyCapObject
  }

  static reified<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): RegulatedCoinMetadataReified<ToPhantomTypeArgument<T0>> {
    return {
      typeName: RegulatedCoinMetadata.$typeName,
      fullTypeName: composeSuiType(
        RegulatedCoinMetadata.$typeName,
        ...[extractType(T0)]
      ) as `${typeof PKG_V29}::coin::RegulatedCoinMetadata<${PhantomToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [extractType(T0)] as [PhantomToTypeStr<ToPhantomTypeArgument<T0>>],
      isPhantom: RegulatedCoinMetadata.$isPhantom,
      reifiedTypeArgs: [T0],
      fromFields: (fields: Record<string, any>) => RegulatedCoinMetadata.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        RegulatedCoinMetadata.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => RegulatedCoinMetadata.fromBcs(T0, data),
      bcs: RegulatedCoinMetadata.bcs,
      fromJSONField: (field: any) => RegulatedCoinMetadata.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => RegulatedCoinMetadata.fromJSON(T0, json),
      fromSuiParsedData: (content: SuiParsedData) =>
        RegulatedCoinMetadata.fromSuiParsedData(T0, content),
      fromSuiObjectData: (content: SuiObjectData) =>
        RegulatedCoinMetadata.fromSuiObjectData(T0, content),
      fetch: async (client: SuiClient, id: string) => RegulatedCoinMetadata.fetch(client, T0, id),
      new: (fields: RegulatedCoinMetadataFields<ToPhantomTypeArgument<T0>>) => {
        return new RegulatedCoinMetadata([extractType(T0)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return RegulatedCoinMetadata.reified
  }

  static phantom<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): PhantomReified<ToTypeStr<RegulatedCoinMetadata<ToPhantomTypeArgument<T0>>>> {
    return phantom(RegulatedCoinMetadata.reified(T0))
  }
  static get p() {
    return RegulatedCoinMetadata.phantom
  }

  static get bcs() {
    return bcs.struct('RegulatedCoinMetadata', {
      id: UID.bcs,
      coin_metadata_object: ID.bcs,
      deny_cap_object: ID.bcs,
    })
  }

  static fromFields<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    fields: Record<string, any>
  ): RegulatedCoinMetadata<ToPhantomTypeArgument<T0>> {
    return RegulatedCoinMetadata.reified(typeArg).new({
      id: decodeFromFields(UID.reified(), fields.id),
      coinMetadataObject: decodeFromFields(ID.reified(), fields.coin_metadata_object),
      denyCapObject: decodeFromFields(ID.reified(), fields.deny_cap_object),
    })
  }

  static fromFieldsWithTypes<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    item: FieldsWithTypes
  ): RegulatedCoinMetadata<ToPhantomTypeArgument<T0>> {
    if (!isRegulatedCoinMetadata(item.type)) {
      throw new Error('not a RegulatedCoinMetadata type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return RegulatedCoinMetadata.reified(typeArg).new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      coinMetadataObject: decodeFromFieldsWithTypes(ID.reified(), item.fields.coin_metadata_object),
      denyCapObject: decodeFromFieldsWithTypes(ID.reified(), item.fields.deny_cap_object),
    })
  }

  static fromBcs<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: Uint8Array
  ): RegulatedCoinMetadata<ToPhantomTypeArgument<T0>> {
    return RegulatedCoinMetadata.fromFields(typeArg, RegulatedCoinMetadata.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
      coinMetadataObject: this.coinMetadataObject,
      denyCapObject: this.denyCapObject,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    field: any
  ): RegulatedCoinMetadata<ToPhantomTypeArgument<T0>> {
    return RegulatedCoinMetadata.reified(typeArg).new({
      id: decodeFromJSONField(UID.reified(), field.id),
      coinMetadataObject: decodeFromJSONField(ID.reified(), field.coinMetadataObject),
      denyCapObject: decodeFromJSONField(ID.reified(), field.denyCapObject),
    })
  }

  static fromJSON<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    json: Record<string, any>
  ): RegulatedCoinMetadata<ToPhantomTypeArgument<T0>> {
    if (json.$typeName !== RegulatedCoinMetadata.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(RegulatedCoinMetadata.$typeName, extractType(typeArg)),
      json.$typeArgs,
      [typeArg]
    )

    return RegulatedCoinMetadata.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    content: SuiParsedData
  ): RegulatedCoinMetadata<ToPhantomTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isRegulatedCoinMetadata(content.type)) {
      throw new Error(
        `object at ${(content.fields as any).id} is not a RegulatedCoinMetadata object`
      )
    }
    return RegulatedCoinMetadata.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: SuiObjectData
  ): RegulatedCoinMetadata<ToPhantomTypeArgument<T0>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isRegulatedCoinMetadata(data.bcs.type)) {
        throw new Error(`object at is not a RegulatedCoinMetadata object`)
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

      return RegulatedCoinMetadata.fromBcs(typeArg, fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return RegulatedCoinMetadata.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<T0 extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<RegulatedCoinMetadata<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching RegulatedCoinMetadata object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isRegulatedCoinMetadata(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a RegulatedCoinMetadata object`)
    }

    return RegulatedCoinMetadata.fromSuiObjectData(typeArg, res.data)
  }
}

/* ============================== TreasuryCap =============================== */

export function isTreasuryCap(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`${PKG_V29}::coin::TreasuryCap` + '<')
}

export interface TreasuryCapFields<T0 extends PhantomTypeArgument> {
  id: ToField<UID>
  totalSupply: ToField<Supply<T0>>
}

export type TreasuryCapReified<T0 extends PhantomTypeArgument> = Reified<
  TreasuryCap<T0>,
  TreasuryCapFields<T0>
>

export class TreasuryCap<T0 extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `${PKG_V29}::coin::TreasuryCap`
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName = TreasuryCap.$typeName
  readonly $fullTypeName: `${typeof PKG_V29}::coin::TreasuryCap<${PhantomToTypeStr<T0>}>`
  readonly $typeArgs: [PhantomToTypeStr<T0>]
  readonly $isPhantom = TreasuryCap.$isPhantom

  readonly id: ToField<UID>
  readonly totalSupply: ToField<Supply<T0>>

  private constructor(typeArgs: [PhantomToTypeStr<T0>], fields: TreasuryCapFields<T0>) {
    this.$fullTypeName = composeSuiType(
      TreasuryCap.$typeName,
      ...typeArgs
    ) as `${typeof PKG_V29}::coin::TreasuryCap<${PhantomToTypeStr<T0>}>`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.totalSupply = fields.totalSupply
  }

  static reified<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): TreasuryCapReified<ToPhantomTypeArgument<T0>> {
    return {
      typeName: TreasuryCap.$typeName,
      fullTypeName: composeSuiType(
        TreasuryCap.$typeName,
        ...[extractType(T0)]
      ) as `${typeof PKG_V29}::coin::TreasuryCap<${PhantomToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [extractType(T0)] as [PhantomToTypeStr<ToPhantomTypeArgument<T0>>],
      isPhantom: TreasuryCap.$isPhantom,
      reifiedTypeArgs: [T0],
      fromFields: (fields: Record<string, any>) => TreasuryCap.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => TreasuryCap.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => TreasuryCap.fromBcs(T0, data),
      bcs: TreasuryCap.bcs,
      fromJSONField: (field: any) => TreasuryCap.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => TreasuryCap.fromJSON(T0, json),
      fromSuiParsedData: (content: SuiParsedData) => TreasuryCap.fromSuiParsedData(T0, content),
      fromSuiObjectData: (content: SuiObjectData) => TreasuryCap.fromSuiObjectData(T0, content),
      fetch: async (client: SuiClient, id: string) => TreasuryCap.fetch(client, T0, id),
      new: (fields: TreasuryCapFields<ToPhantomTypeArgument<T0>>) => {
        return new TreasuryCap([extractType(T0)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return TreasuryCap.reified
  }

  static phantom<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): PhantomReified<ToTypeStr<TreasuryCap<ToPhantomTypeArgument<T0>>>> {
    return phantom(TreasuryCap.reified(T0))
  }
  static get p() {
    return TreasuryCap.phantom
  }

  static get bcs() {
    return bcs.struct('TreasuryCap', {
      id: UID.bcs,
      total_supply: Supply.bcs,
    })
  }

  static fromFields<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    fields: Record<string, any>
  ): TreasuryCap<ToPhantomTypeArgument<T0>> {
    return TreasuryCap.reified(typeArg).new({
      id: decodeFromFields(UID.reified(), fields.id),
      totalSupply: decodeFromFields(Supply.reified(typeArg), fields.total_supply),
    })
  }

  static fromFieldsWithTypes<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    item: FieldsWithTypes
  ): TreasuryCap<ToPhantomTypeArgument<T0>> {
    if (!isTreasuryCap(item.type)) {
      throw new Error('not a TreasuryCap type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return TreasuryCap.reified(typeArg).new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      totalSupply: decodeFromFieldsWithTypes(Supply.reified(typeArg), item.fields.total_supply),
    })
  }

  static fromBcs<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: Uint8Array
  ): TreasuryCap<ToPhantomTypeArgument<T0>> {
    return TreasuryCap.fromFields(typeArg, TreasuryCap.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
      totalSupply: this.totalSupply.toJSONField(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    field: any
  ): TreasuryCap<ToPhantomTypeArgument<T0>> {
    return TreasuryCap.reified(typeArg).new({
      id: decodeFromJSONField(UID.reified(), field.id),
      totalSupply: decodeFromJSONField(Supply.reified(typeArg), field.totalSupply),
    })
  }

  static fromJSON<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    json: Record<string, any>
  ): TreasuryCap<ToPhantomTypeArgument<T0>> {
    if (json.$typeName !== TreasuryCap.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(TreasuryCap.$typeName, extractType(typeArg)),
      json.$typeArgs,
      [typeArg]
    )

    return TreasuryCap.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    content: SuiParsedData
  ): TreasuryCap<ToPhantomTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isTreasuryCap(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a TreasuryCap object`)
    }
    return TreasuryCap.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: SuiObjectData
  ): TreasuryCap<ToPhantomTypeArgument<T0>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isTreasuryCap(data.bcs.type)) {
        throw new Error(`object at is not a TreasuryCap object`)
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

      return TreasuryCap.fromBcs(typeArg, fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return TreasuryCap.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<T0 extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<TreasuryCap<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching TreasuryCap object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isTreasuryCap(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a TreasuryCap object`)
    }

    return TreasuryCap.fromSuiObjectData(typeArg, res.data)
  }
}

/* ============================== DenyCapV2 =============================== */

export function isDenyCapV2(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`${PKG_V29}::coin::DenyCapV2` + '<')
}

export interface DenyCapV2Fields<T0 extends PhantomTypeArgument> {
  id: ToField<UID>
  allowGlobalPause: ToField<'bool'>
}

export type DenyCapV2Reified<T0 extends PhantomTypeArgument> = Reified<
  DenyCapV2<T0>,
  DenyCapV2Fields<T0>
>

export class DenyCapV2<T0 extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `${PKG_V29}::coin::DenyCapV2`
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName = DenyCapV2.$typeName
  readonly $fullTypeName: `${typeof PKG_V29}::coin::DenyCapV2<${PhantomToTypeStr<T0>}>`
  readonly $typeArgs: [PhantomToTypeStr<T0>]
  readonly $isPhantom = DenyCapV2.$isPhantom

  readonly id: ToField<UID>
  readonly allowGlobalPause: ToField<'bool'>

  private constructor(typeArgs: [PhantomToTypeStr<T0>], fields: DenyCapV2Fields<T0>) {
    this.$fullTypeName = composeSuiType(
      DenyCapV2.$typeName,
      ...typeArgs
    ) as `${typeof PKG_V29}::coin::DenyCapV2<${PhantomToTypeStr<T0>}>`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.allowGlobalPause = fields.allowGlobalPause
  }

  static reified<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): DenyCapV2Reified<ToPhantomTypeArgument<T0>> {
    return {
      typeName: DenyCapV2.$typeName,
      fullTypeName: composeSuiType(
        DenyCapV2.$typeName,
        ...[extractType(T0)]
      ) as `${typeof PKG_V29}::coin::DenyCapV2<${PhantomToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [extractType(T0)] as [PhantomToTypeStr<ToPhantomTypeArgument<T0>>],
      isPhantom: DenyCapV2.$isPhantom,
      reifiedTypeArgs: [T0],
      fromFields: (fields: Record<string, any>) => DenyCapV2.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => DenyCapV2.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => DenyCapV2.fromBcs(T0, data),
      bcs: DenyCapV2.bcs,
      fromJSONField: (field: any) => DenyCapV2.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => DenyCapV2.fromJSON(T0, json),
      fromSuiParsedData: (content: SuiParsedData) => DenyCapV2.fromSuiParsedData(T0, content),
      fromSuiObjectData: (content: SuiObjectData) => DenyCapV2.fromSuiObjectData(T0, content),
      fetch: async (client: SuiClient, id: string) => DenyCapV2.fetch(client, T0, id),
      new: (fields: DenyCapV2Fields<ToPhantomTypeArgument<T0>>) => {
        return new DenyCapV2([extractType(T0)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return DenyCapV2.reified
  }

  static phantom<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): PhantomReified<ToTypeStr<DenyCapV2<ToPhantomTypeArgument<T0>>>> {
    return phantom(DenyCapV2.reified(T0))
  }
  static get p() {
    return DenyCapV2.phantom
  }

  static get bcs() {
    return bcs.struct('DenyCapV2', {
      id: UID.bcs,
      allow_global_pause: bcs.bool(),
    })
  }

  static fromFields<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    fields: Record<string, any>
  ): DenyCapV2<ToPhantomTypeArgument<T0>> {
    return DenyCapV2.reified(typeArg).new({
      id: decodeFromFields(UID.reified(), fields.id),
      allowGlobalPause: decodeFromFields('bool', fields.allow_global_pause),
    })
  }

  static fromFieldsWithTypes<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    item: FieldsWithTypes
  ): DenyCapV2<ToPhantomTypeArgument<T0>> {
    if (!isDenyCapV2(item.type)) {
      throw new Error('not a DenyCapV2 type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return DenyCapV2.reified(typeArg).new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      allowGlobalPause: decodeFromFieldsWithTypes('bool', item.fields.allow_global_pause),
    })
  }

  static fromBcs<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: Uint8Array
  ): DenyCapV2<ToPhantomTypeArgument<T0>> {
    return DenyCapV2.fromFields(typeArg, DenyCapV2.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
      allowGlobalPause: this.allowGlobalPause,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    field: any
  ): DenyCapV2<ToPhantomTypeArgument<T0>> {
    return DenyCapV2.reified(typeArg).new({
      id: decodeFromJSONField(UID.reified(), field.id),
      allowGlobalPause: decodeFromJSONField('bool', field.allowGlobalPause),
    })
  }

  static fromJSON<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    json: Record<string, any>
  ): DenyCapV2<ToPhantomTypeArgument<T0>> {
    if (json.$typeName !== DenyCapV2.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(DenyCapV2.$typeName, extractType(typeArg)),
      json.$typeArgs,
      [typeArg]
    )

    return DenyCapV2.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    content: SuiParsedData
  ): DenyCapV2<ToPhantomTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isDenyCapV2(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a DenyCapV2 object`)
    }
    return DenyCapV2.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: SuiObjectData
  ): DenyCapV2<ToPhantomTypeArgument<T0>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isDenyCapV2(data.bcs.type)) {
        throw new Error(`object at is not a DenyCapV2 object`)
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

      return DenyCapV2.fromBcs(typeArg, fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return DenyCapV2.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<T0 extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<DenyCapV2<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching DenyCapV2 object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isDenyCapV2(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a DenyCapV2 object`)
    }

    return DenyCapV2.fromSuiObjectData(typeArg, res.data)
  }
}

/* ============================== CurrencyCreated =============================== */

export function isCurrencyCreated(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`${PKG_V29}::coin::CurrencyCreated` + '<')
}

export interface CurrencyCreatedFields<T0 extends PhantomTypeArgument> {
  decimals: ToField<'u8'>
}

export type CurrencyCreatedReified<T0 extends PhantomTypeArgument> = Reified<
  CurrencyCreated<T0>,
  CurrencyCreatedFields<T0>
>

export class CurrencyCreated<T0 extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `${PKG_V29}::coin::CurrencyCreated`
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName = CurrencyCreated.$typeName
  readonly $fullTypeName: `${typeof PKG_V29}::coin::CurrencyCreated<${PhantomToTypeStr<T0>}>`
  readonly $typeArgs: [PhantomToTypeStr<T0>]
  readonly $isPhantom = CurrencyCreated.$isPhantom

  readonly decimals: ToField<'u8'>

  private constructor(typeArgs: [PhantomToTypeStr<T0>], fields: CurrencyCreatedFields<T0>) {
    this.$fullTypeName = composeSuiType(
      CurrencyCreated.$typeName,
      ...typeArgs
    ) as `${typeof PKG_V29}::coin::CurrencyCreated<${PhantomToTypeStr<T0>}>`
    this.$typeArgs = typeArgs

    this.decimals = fields.decimals
  }

  static reified<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): CurrencyCreatedReified<ToPhantomTypeArgument<T0>> {
    return {
      typeName: CurrencyCreated.$typeName,
      fullTypeName: composeSuiType(
        CurrencyCreated.$typeName,
        ...[extractType(T0)]
      ) as `${typeof PKG_V29}::coin::CurrencyCreated<${PhantomToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [extractType(T0)] as [PhantomToTypeStr<ToPhantomTypeArgument<T0>>],
      isPhantom: CurrencyCreated.$isPhantom,
      reifiedTypeArgs: [T0],
      fromFields: (fields: Record<string, any>) => CurrencyCreated.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => CurrencyCreated.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => CurrencyCreated.fromBcs(T0, data),
      bcs: CurrencyCreated.bcs,
      fromJSONField: (field: any) => CurrencyCreated.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => CurrencyCreated.fromJSON(T0, json),
      fromSuiParsedData: (content: SuiParsedData) => CurrencyCreated.fromSuiParsedData(T0, content),
      fromSuiObjectData: (content: SuiObjectData) => CurrencyCreated.fromSuiObjectData(T0, content),
      fetch: async (client: SuiClient, id: string) => CurrencyCreated.fetch(client, T0, id),
      new: (fields: CurrencyCreatedFields<ToPhantomTypeArgument<T0>>) => {
        return new CurrencyCreated([extractType(T0)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return CurrencyCreated.reified
  }

  static phantom<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): PhantomReified<ToTypeStr<CurrencyCreated<ToPhantomTypeArgument<T0>>>> {
    return phantom(CurrencyCreated.reified(T0))
  }
  static get p() {
    return CurrencyCreated.phantom
  }

  static get bcs() {
    return bcs.struct('CurrencyCreated', {
      decimals: bcs.u8(),
    })
  }

  static fromFields<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    fields: Record<string, any>
  ): CurrencyCreated<ToPhantomTypeArgument<T0>> {
    return CurrencyCreated.reified(typeArg).new({
      decimals: decodeFromFields('u8', fields.decimals),
    })
  }

  static fromFieldsWithTypes<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    item: FieldsWithTypes
  ): CurrencyCreated<ToPhantomTypeArgument<T0>> {
    if (!isCurrencyCreated(item.type)) {
      throw new Error('not a CurrencyCreated type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return CurrencyCreated.reified(typeArg).new({
      decimals: decodeFromFieldsWithTypes('u8', item.fields.decimals),
    })
  }

  static fromBcs<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: Uint8Array
  ): CurrencyCreated<ToPhantomTypeArgument<T0>> {
    return CurrencyCreated.fromFields(typeArg, CurrencyCreated.bcs.parse(data))
  }

  toJSONField() {
    return {
      decimals: this.decimals,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    field: any
  ): CurrencyCreated<ToPhantomTypeArgument<T0>> {
    return CurrencyCreated.reified(typeArg).new({
      decimals: decodeFromJSONField('u8', field.decimals),
    })
  }

  static fromJSON<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    json: Record<string, any>
  ): CurrencyCreated<ToPhantomTypeArgument<T0>> {
    if (json.$typeName !== CurrencyCreated.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(CurrencyCreated.$typeName, extractType(typeArg)),
      json.$typeArgs,
      [typeArg]
    )

    return CurrencyCreated.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    content: SuiParsedData
  ): CurrencyCreated<ToPhantomTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isCurrencyCreated(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a CurrencyCreated object`)
    }
    return CurrencyCreated.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: SuiObjectData
  ): CurrencyCreated<ToPhantomTypeArgument<T0>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isCurrencyCreated(data.bcs.type)) {
        throw new Error(`object at is not a CurrencyCreated object`)
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

      return CurrencyCreated.fromBcs(typeArg, fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return CurrencyCreated.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<T0 extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<CurrencyCreated<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching CurrencyCreated object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isCurrencyCreated(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a CurrencyCreated object`)
    }

    return CurrencyCreated.fromSuiObjectData(typeArg, res.data)
  }
}

/* ============================== DenyCap =============================== */

export function isDenyCap(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`${PKG_V29}::coin::DenyCap` + '<')
}

export interface DenyCapFields<T0 extends PhantomTypeArgument> {
  id: ToField<UID>
}

export type DenyCapReified<T0 extends PhantomTypeArgument> = Reified<DenyCap<T0>, DenyCapFields<T0>>

export class DenyCap<T0 extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `${PKG_V29}::coin::DenyCap`
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName = DenyCap.$typeName
  readonly $fullTypeName: `${typeof PKG_V29}::coin::DenyCap<${PhantomToTypeStr<T0>}>`
  readonly $typeArgs: [PhantomToTypeStr<T0>]
  readonly $isPhantom = DenyCap.$isPhantom

  readonly id: ToField<UID>

  private constructor(typeArgs: [PhantomToTypeStr<T0>], fields: DenyCapFields<T0>) {
    this.$fullTypeName = composeSuiType(
      DenyCap.$typeName,
      ...typeArgs
    ) as `${typeof PKG_V29}::coin::DenyCap<${PhantomToTypeStr<T0>}>`
    this.$typeArgs = typeArgs

    this.id = fields.id
  }

  static reified<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): DenyCapReified<ToPhantomTypeArgument<T0>> {
    return {
      typeName: DenyCap.$typeName,
      fullTypeName: composeSuiType(
        DenyCap.$typeName,
        ...[extractType(T0)]
      ) as `${typeof PKG_V29}::coin::DenyCap<${PhantomToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [extractType(T0)] as [PhantomToTypeStr<ToPhantomTypeArgument<T0>>],
      isPhantom: DenyCap.$isPhantom,
      reifiedTypeArgs: [T0],
      fromFields: (fields: Record<string, any>) => DenyCap.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => DenyCap.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => DenyCap.fromBcs(T0, data),
      bcs: DenyCap.bcs,
      fromJSONField: (field: any) => DenyCap.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => DenyCap.fromJSON(T0, json),
      fromSuiParsedData: (content: SuiParsedData) => DenyCap.fromSuiParsedData(T0, content),
      fromSuiObjectData: (content: SuiObjectData) => DenyCap.fromSuiObjectData(T0, content),
      fetch: async (client: SuiClient, id: string) => DenyCap.fetch(client, T0, id),
      new: (fields: DenyCapFields<ToPhantomTypeArgument<T0>>) => {
        return new DenyCap([extractType(T0)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return DenyCap.reified
  }

  static phantom<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): PhantomReified<ToTypeStr<DenyCap<ToPhantomTypeArgument<T0>>>> {
    return phantom(DenyCap.reified(T0))
  }
  static get p() {
    return DenyCap.phantom
  }

  static get bcs() {
    return bcs.struct('DenyCap', {
      id: UID.bcs,
    })
  }

  static fromFields<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    fields: Record<string, any>
  ): DenyCap<ToPhantomTypeArgument<T0>> {
    return DenyCap.reified(typeArg).new({ id: decodeFromFields(UID.reified(), fields.id) })
  }

  static fromFieldsWithTypes<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    item: FieldsWithTypes
  ): DenyCap<ToPhantomTypeArgument<T0>> {
    if (!isDenyCap(item.type)) {
      throw new Error('not a DenyCap type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return DenyCap.reified(typeArg).new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
    })
  }

  static fromBcs<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: Uint8Array
  ): DenyCap<ToPhantomTypeArgument<T0>> {
    return DenyCap.fromFields(typeArg, DenyCap.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    field: any
  ): DenyCap<ToPhantomTypeArgument<T0>> {
    return DenyCap.reified(typeArg).new({ id: decodeFromJSONField(UID.reified(), field.id) })
  }

  static fromJSON<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    json: Record<string, any>
  ): DenyCap<ToPhantomTypeArgument<T0>> {
    if (json.$typeName !== DenyCap.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(DenyCap.$typeName, extractType(typeArg)),
      json.$typeArgs,
      [typeArg]
    )

    return DenyCap.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    content: SuiParsedData
  ): DenyCap<ToPhantomTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isDenyCap(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a DenyCap object`)
    }
    return DenyCap.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: SuiObjectData
  ): DenyCap<ToPhantomTypeArgument<T0>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isDenyCap(data.bcs.type)) {
        throw new Error(`object at is not a DenyCap object`)
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

      return DenyCap.fromBcs(typeArg, fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return DenyCap.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<T0 extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<DenyCap<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching DenyCap object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isDenyCap(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a DenyCap object`)
    }

    return DenyCap.fromSuiObjectData(typeArg, res.data)
  }
}
