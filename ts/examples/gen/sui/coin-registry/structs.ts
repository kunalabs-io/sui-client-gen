/**
 * Defines the system object for managing coin data in a central
 * registry. This module provides a centralized way to store and manage
 * metadata for all currencies in the Sui ecosystem, including their
 * supply information, regulatory status, and metadata capabilities.
 */

import { bcs } from '@mysten/sui/bcs'
import { SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromBase64 } from '@mysten/sui/utils'
import { Option } from '../../_dependencies/std/option/structs'
import { String } from '../../_dependencies/std/string/structs'
import { TypeName } from '../../_dependencies/std/type-name/structs'
import {
  assertFieldsWithTypesArgsMatch,
  assertReifiedTypeArgsMatch,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  EnumVariantClass,
  extractType,
  fieldToJSON,
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
  vector,
} from '../../_framework/reified'
import {
  composeSuiType,
  compressSuiType,
  fetchObjectBcs,
  FieldsWithTypes,
  parseTypeName,
  SupportedSuiClient,
} from '../../_framework/util'
import { Vector } from '../../_framework/vector'
import { Bag } from '../bag/structs'
import { Supply } from '../balance/structs'
import { ID, UID } from '../object/structs'
import { VecMap } from '../vec-map/structs'

/* ============================== CoinRegistry =============================== */

export function isCoinRegistry(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::coin_registry::CoinRegistry`
}

export interface CoinRegistryFields {
  id: ToField<UID>
}

export type CoinRegistryReified = Reified<CoinRegistry, CoinRegistryFields>

export type CoinRegistryJSONField = {
  id: string
}

export type CoinRegistryJSON = {
  $typeName: typeof CoinRegistry.$typeName
  $typeArgs: []
} & CoinRegistryJSONField

/**
 * System object found at address `0xc` that stores coin data for all
 * registered coin types. This is a shared object that acts as a central
 * registry for coin metadata, supply information, and regulatory status.
 */
export class CoinRegistry implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::coin_registry::CoinRegistry` =
    `0x2::coin_registry::CoinRegistry` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName: typeof CoinRegistry.$typeName = CoinRegistry.$typeName
  readonly $fullTypeName: `0x2::coin_registry::CoinRegistry`
  readonly $typeArgs: []
  readonly $isPhantom: typeof CoinRegistry.$isPhantom = CoinRegistry.$isPhantom

  readonly id: ToField<UID>

  private constructor(typeArgs: [], fields: CoinRegistryFields) {
    this.$fullTypeName = composeSuiType(
      CoinRegistry.$typeName,
      ...typeArgs,
    ) as `0x2::coin_registry::CoinRegistry`
    this.$typeArgs = typeArgs

    this.id = fields.id
  }

  static reified(): CoinRegistryReified {
    const reifiedBcs = CoinRegistry.bcs
    return {
      typeName: CoinRegistry.$typeName,
      fullTypeName: composeSuiType(
        CoinRegistry.$typeName,
        ...[],
      ) as `0x2::coin_registry::CoinRegistry`,
      typeArgs: [] as [],
      isPhantom: CoinRegistry.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => CoinRegistry.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => CoinRegistry.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => CoinRegistry.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => CoinRegistry.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => CoinRegistry.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => CoinRegistry.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => CoinRegistry.fromSuiObjectData(content),
      fetch: async (client: SupportedSuiClient, id: string) => CoinRegistry.fetch(client, id),
      new: (fields: CoinRegistryFields) => {
        return new CoinRegistry([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): CoinRegistryReified {
    return CoinRegistry.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<CoinRegistry>> {
    return phantom(CoinRegistry.reified())
  }

  static get p(): PhantomReified<ToTypeStr<CoinRegistry>> {
    return CoinRegistry.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('CoinRegistry', {
      id: UID.bcs,
    })
  }

  private static cachedBcs: ReturnType<typeof CoinRegistry.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof CoinRegistry.instantiateBcs> {
    if (!CoinRegistry.cachedBcs) {
      CoinRegistry.cachedBcs = CoinRegistry.instantiateBcs()
    }
    return CoinRegistry.cachedBcs
  }

  static fromFields(fields: Record<string, any>): CoinRegistry {
    return CoinRegistry.reified().new({
      id: decodeFromFields(UID.reified(), fields.id),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): CoinRegistry {
    if (!isCoinRegistry(item.type)) {
      throw new Error('not a CoinRegistry type')
    }

    return CoinRegistry.reified().new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
    })
  }

  static fromBcs(data: Uint8Array): CoinRegistry {
    return CoinRegistry.fromFields(CoinRegistry.bcs.parse(data))
  }

  toJSONField(): CoinRegistryJSONField {
    return {
      id: this.id,
    }
  }

  toJSON(): CoinRegistryJSON {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): CoinRegistry {
    return CoinRegistry.reified().new({
      id: decodeFromJSONField(UID.reified(), field.id),
    })
  }

  static fromJSON(json: Record<string, any>): CoinRegistry {
    if (json.$typeName !== CoinRegistry.$typeName) {
      throw new Error(
        `not a CoinRegistry json object: expected '${CoinRegistry.$typeName}' but got '${json.$typeName}'`,
      )
    }

    return CoinRegistry.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): CoinRegistry {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isCoinRegistry(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a CoinRegistry object`)
    }
    return CoinRegistry.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): CoinRegistry {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isCoinRegistry(data.bcs.type)) {
        throw new Error(`object at is not a CoinRegistry object`)
      }

      return CoinRegistry.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return CoinRegistry.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.',
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<CoinRegistry> {
    const res = await fetchObjectBcs(client, id)
    if (!isCoinRegistry(res.type)) {
      throw new Error(`object at id ${id} is not a CoinRegistry object`)
    }

    return CoinRegistry.fromBcs(res.bcsBytes)
  }
}

/* ============================== ExtraField =============================== */

export function isExtraField(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::coin_registry::ExtraField`
}

export interface ExtraFieldFields {
  pos0: ToField<TypeName>
  pos1: ToField<Vector<'u8'>>
}

export type ExtraFieldReified = Reified<ExtraField, ExtraFieldFields>

export type ExtraFieldJSONField = {
  pos0: string
  pos1: number[]
}

export type ExtraFieldJSON = {
  $typeName: typeof ExtraField.$typeName
  $typeArgs: []
} & ExtraFieldJSONField

/**
 * Store only object that enables more flexible coin data
 * registration, allowing for additional fields to be added
 * without changing the `Currency` structure.
 */
export class ExtraField implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::coin_registry::ExtraField` =
    `0x2::coin_registry::ExtraField` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName: typeof ExtraField.$typeName = ExtraField.$typeName
  readonly $fullTypeName: `0x2::coin_registry::ExtraField`
  readonly $typeArgs: []
  readonly $isPhantom: typeof ExtraField.$isPhantom = ExtraField.$isPhantom

  readonly pos0: ToField<TypeName>
  readonly pos1: ToField<Vector<'u8'>>

  private constructor(typeArgs: [], fields: ExtraFieldFields) {
    this.$fullTypeName = composeSuiType(
      ExtraField.$typeName,
      ...typeArgs,
    ) as `0x2::coin_registry::ExtraField`
    this.$typeArgs = typeArgs

    this.pos0 = fields.pos0
    this.pos1 = fields.pos1
  }

  static reified(): ExtraFieldReified {
    const reifiedBcs = ExtraField.bcs
    return {
      typeName: ExtraField.$typeName,
      fullTypeName: composeSuiType(
        ExtraField.$typeName,
        ...[],
      ) as `0x2::coin_registry::ExtraField`,
      typeArgs: [] as [],
      isPhantom: ExtraField.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => ExtraField.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => ExtraField.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => ExtraField.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => ExtraField.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => ExtraField.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => ExtraField.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => ExtraField.fromSuiObjectData(content),
      fetch: async (client: SupportedSuiClient, id: string) => ExtraField.fetch(client, id),
      new: (fields: ExtraFieldFields) => {
        return new ExtraField([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): ExtraFieldReified {
    return ExtraField.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<ExtraField>> {
    return phantom(ExtraField.reified())
  }

  static get p(): PhantomReified<ToTypeStr<ExtraField>> {
    return ExtraField.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('ExtraField', {
      pos0: TypeName.bcs,
      pos1: bcs.vector(bcs.u8()),
    })
  }

  private static cachedBcs: ReturnType<typeof ExtraField.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof ExtraField.instantiateBcs> {
    if (!ExtraField.cachedBcs) {
      ExtraField.cachedBcs = ExtraField.instantiateBcs()
    }
    return ExtraField.cachedBcs
  }

  static fromFields(fields: Record<string, any>): ExtraField {
    return ExtraField.reified().new({
      pos0: decodeFromFields(TypeName.reified(), fields.pos0),
      pos1: decodeFromFields(vector('u8'), fields.pos1),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): ExtraField {
    if (!isExtraField(item.type)) {
      throw new Error('not a ExtraField type')
    }

    return ExtraField.reified().new({
      pos0: decodeFromFieldsWithTypes(TypeName.reified(), item.fields.pos0),
      pos1: decodeFromFieldsWithTypes(vector('u8'), item.fields.pos1),
    })
  }

  static fromBcs(data: Uint8Array): ExtraField {
    return ExtraField.fromFields(ExtraField.bcs.parse(data))
  }

  toJSONField(): ExtraFieldJSONField {
    return {
      pos0: this.pos0,
      pos1: fieldToJSON<Vector<'u8'>>(`vector<u8>`, this.pos1),
    }
  }

  toJSON(): ExtraFieldJSON {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): ExtraField {
    return ExtraField.reified().new({
      pos0: decodeFromJSONField(TypeName.reified(), field.pos0),
      pos1: decodeFromJSONField(vector('u8'), field.pos1),
    })
  }

  static fromJSON(json: Record<string, any>): ExtraField {
    if (json.$typeName !== ExtraField.$typeName) {
      throw new Error(
        `not a ExtraField json object: expected '${ExtraField.$typeName}' but got '${json.$typeName}'`,
      )
    }

    return ExtraField.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): ExtraField {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isExtraField(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a ExtraField object`)
    }
    return ExtraField.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): ExtraField {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isExtraField(data.bcs.type)) {
        throw new Error(`object at is not a ExtraField object`)
      }

      return ExtraField.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return ExtraField.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.',
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<ExtraField> {
    const res = await fetchObjectBcs(client, id)
    if (!isExtraField(res.type)) {
      throw new Error(`object at id ${id} is not a ExtraField object`)
    }

    return ExtraField.fromBcs(res.bcsBytes)
  }
}

/* ============================== CurrencyKey =============================== */

export function isCurrencyKey(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::coin_registry::CurrencyKey` + '<')
}

export interface CurrencyKeyFields<T extends PhantomTypeArgument> {
  dummyField: ToField<'bool'>
}

export type CurrencyKeyReified<T extends PhantomTypeArgument> = Reified<
  CurrencyKey<T>,
  CurrencyKeyFields<T>
>

export type CurrencyKeyJSONField<T extends PhantomTypeArgument> = {
  dummyField: boolean
}

export type CurrencyKeyJSON<T extends PhantomTypeArgument> = {
  $typeName: typeof CurrencyKey.$typeName
  $typeArgs: [PhantomToTypeStr<T>]
} & CurrencyKeyJSONField<T>

/** Key used to derive addresses when creating `Currency<T>` objects. */
export class CurrencyKey<T extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::coin_registry::CurrencyKey` =
    `0x2::coin_registry::CurrencyKey` as const
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName: typeof CurrencyKey.$typeName = CurrencyKey.$typeName
  readonly $fullTypeName: `0x2::coin_registry::CurrencyKey<${PhantomToTypeStr<T>}>`
  readonly $typeArgs: [PhantomToTypeStr<T>]
  readonly $isPhantom: typeof CurrencyKey.$isPhantom = CurrencyKey.$isPhantom

  readonly dummyField: ToField<'bool'>

  private constructor(typeArgs: [PhantomToTypeStr<T>], fields: CurrencyKeyFields<T>) {
    this.$fullTypeName = composeSuiType(
      CurrencyKey.$typeName,
      ...typeArgs,
    ) as `0x2::coin_registry::CurrencyKey<${PhantomToTypeStr<T>}>`
    this.$typeArgs = typeArgs

    this.dummyField = fields.dummyField
  }

  static reified<T extends PhantomReified<PhantomTypeArgument>>(
    T: T,
  ): CurrencyKeyReified<ToPhantomTypeArgument<T>> {
    const reifiedBcs = CurrencyKey.bcs
    return {
      typeName: CurrencyKey.$typeName,
      fullTypeName: composeSuiType(
        CurrencyKey.$typeName,
        ...[extractType(T)],
      ) as `0x2::coin_registry::CurrencyKey<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`,
      typeArgs: [extractType(T)] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>],
      isPhantom: CurrencyKey.$isPhantom,
      reifiedTypeArgs: [T],
      fromFields: (fields: Record<string, any>) => CurrencyKey.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => CurrencyKey.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => CurrencyKey.fromFields(T, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => CurrencyKey.fromJSONField(T, field),
      fromJSON: (json: Record<string, any>) => CurrencyKey.fromJSON(T, json),
      fromSuiParsedData: (content: SuiParsedData) => CurrencyKey.fromSuiParsedData(T, content),
      fromSuiObjectData: (content: SuiObjectData) => CurrencyKey.fromSuiObjectData(T, content),
      fetch: async (client: SupportedSuiClient, id: string) => CurrencyKey.fetch(client, T, id),
      new: (fields: CurrencyKeyFields<ToPhantomTypeArgument<T>>) => {
        return new CurrencyKey([extractType(T)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): typeof CurrencyKey.reified {
    return CurrencyKey.reified
  }

  static phantom<T extends PhantomReified<PhantomTypeArgument>>(
    T: T,
  ): PhantomReified<ToTypeStr<CurrencyKey<ToPhantomTypeArgument<T>>>> {
    return phantom(CurrencyKey.reified(T))
  }

  static get p(): typeof CurrencyKey.phantom {
    return CurrencyKey.phantom
  }

  private static instantiateBcs() {
    return bcs.struct('CurrencyKey', {
      dummy_field: bcs.bool(),
    })
  }

  private static cachedBcs: ReturnType<typeof CurrencyKey.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof CurrencyKey.instantiateBcs> {
    if (!CurrencyKey.cachedBcs) {
      CurrencyKey.cachedBcs = CurrencyKey.instantiateBcs()
    }
    return CurrencyKey.cachedBcs
  }

  static fromFields<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    fields: Record<string, any>,
  ): CurrencyKey<ToPhantomTypeArgument<T>> {
    return CurrencyKey.reified(typeArg).new({
      dummyField: decodeFromFields('bool', fields.dummy_field),
    })
  }

  static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    item: FieldsWithTypes,
  ): CurrencyKey<ToPhantomTypeArgument<T>> {
    if (!isCurrencyKey(item.type)) {
      throw new Error('not a CurrencyKey type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return CurrencyKey.reified(typeArg).new({
      dummyField: decodeFromFieldsWithTypes('bool', item.fields.dummy_field),
    })
  }

  static fromBcs<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    data: Uint8Array,
  ): CurrencyKey<ToPhantomTypeArgument<T>> {
    return CurrencyKey.fromFields(typeArg, CurrencyKey.bcs.parse(data))
  }

  toJSONField(): CurrencyKeyJSONField<T> {
    return {
      dummyField: this.dummyField,
    }
  }

  toJSON(): CurrencyKeyJSON<T> {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    field: any,
  ): CurrencyKey<ToPhantomTypeArgument<T>> {
    return CurrencyKey.reified(typeArg).new({
      dummyField: decodeFromJSONField('bool', field.dummyField),
    })
  }

  static fromJSON<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    json: Record<string, any>,
  ): CurrencyKey<ToPhantomTypeArgument<T>> {
    if (json.$typeName !== CurrencyKey.$typeName) {
      throw new Error(
        `not a CurrencyKey json object: expected '${CurrencyKey.$typeName}' but got '${json.$typeName}'`,
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(CurrencyKey.$typeName, ...[extractType(typeArg)]),
      json.$typeArgs,
      [typeArg],
    )

    return CurrencyKey.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    content: SuiParsedData,
  ): CurrencyKey<ToPhantomTypeArgument<T>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isCurrencyKey(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a CurrencyKey object`)
    }
    return CurrencyKey.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    data: SuiObjectData,
  ): CurrencyKey<ToPhantomTypeArgument<T>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isCurrencyKey(data.bcs.type)) {
        throw new Error(`object at is not a CurrencyKey object`)
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

      return CurrencyKey.fromBcs(typeArg, fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return CurrencyKey.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.',
    )
  }

  static async fetch<T extends PhantomReified<PhantomTypeArgument>>(
    client: SupportedSuiClient,
    typeArg: T,
    id: string,
  ): Promise<CurrencyKey<ToPhantomTypeArgument<T>>> {
    const res = await fetchObjectBcs(client, id)
    if (!isCurrencyKey(res.type)) {
      throw new Error(`object at id ${id} is not a CurrencyKey object`)
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

    return CurrencyKey.fromBcs(typeArg, res.bcsBytes)
  }
}

/* ============================== LegacyMetadataKey =============================== */

export function isLegacyMetadataKey(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::coin_registry::LegacyMetadataKey`
}

export interface LegacyMetadataKeyFields {
  dummyField: ToField<'bool'>
}

export type LegacyMetadataKeyReified = Reified<LegacyMetadataKey, LegacyMetadataKeyFields>

export type LegacyMetadataKeyJSONField = {
  dummyField: boolean
}

export type LegacyMetadataKeyJSON = {
  $typeName: typeof LegacyMetadataKey.$typeName
  $typeArgs: []
} & LegacyMetadataKeyJSONField

/** Key used to store the legacy `CoinMetadata` for a `Currency`. */
export class LegacyMetadataKey implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::coin_registry::LegacyMetadataKey` =
    `0x2::coin_registry::LegacyMetadataKey` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName: typeof LegacyMetadataKey.$typeName = LegacyMetadataKey.$typeName
  readonly $fullTypeName: `0x2::coin_registry::LegacyMetadataKey`
  readonly $typeArgs: []
  readonly $isPhantom: typeof LegacyMetadataKey.$isPhantom = LegacyMetadataKey.$isPhantom

  readonly dummyField: ToField<'bool'>

  private constructor(typeArgs: [], fields: LegacyMetadataKeyFields) {
    this.$fullTypeName = composeSuiType(
      LegacyMetadataKey.$typeName,
      ...typeArgs,
    ) as `0x2::coin_registry::LegacyMetadataKey`
    this.$typeArgs = typeArgs

    this.dummyField = fields.dummyField
  }

  static reified(): LegacyMetadataKeyReified {
    const reifiedBcs = LegacyMetadataKey.bcs
    return {
      typeName: LegacyMetadataKey.$typeName,
      fullTypeName: composeSuiType(
        LegacyMetadataKey.$typeName,
        ...[],
      ) as `0x2::coin_registry::LegacyMetadataKey`,
      typeArgs: [] as [],
      isPhantom: LegacyMetadataKey.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => LegacyMetadataKey.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => LegacyMetadataKey.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => LegacyMetadataKey.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => LegacyMetadataKey.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => LegacyMetadataKey.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => LegacyMetadataKey.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => LegacyMetadataKey.fromSuiObjectData(content),
      fetch: async (client: SupportedSuiClient, id: string) => LegacyMetadataKey.fetch(client, id),
      new: (fields: LegacyMetadataKeyFields) => {
        return new LegacyMetadataKey([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): LegacyMetadataKeyReified {
    return LegacyMetadataKey.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<LegacyMetadataKey>> {
    return phantom(LegacyMetadataKey.reified())
  }

  static get p(): PhantomReified<ToTypeStr<LegacyMetadataKey>> {
    return LegacyMetadataKey.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('LegacyMetadataKey', {
      dummy_field: bcs.bool(),
    })
  }

  private static cachedBcs: ReturnType<typeof LegacyMetadataKey.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof LegacyMetadataKey.instantiateBcs> {
    if (!LegacyMetadataKey.cachedBcs) {
      LegacyMetadataKey.cachedBcs = LegacyMetadataKey.instantiateBcs()
    }
    return LegacyMetadataKey.cachedBcs
  }

  static fromFields(fields: Record<string, any>): LegacyMetadataKey {
    return LegacyMetadataKey.reified().new({
      dummyField: decodeFromFields('bool', fields.dummy_field),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): LegacyMetadataKey {
    if (!isLegacyMetadataKey(item.type)) {
      throw new Error('not a LegacyMetadataKey type')
    }

    return LegacyMetadataKey.reified().new({
      dummyField: decodeFromFieldsWithTypes('bool', item.fields.dummy_field),
    })
  }

  static fromBcs(data: Uint8Array): LegacyMetadataKey {
    return LegacyMetadataKey.fromFields(LegacyMetadataKey.bcs.parse(data))
  }

  toJSONField(): LegacyMetadataKeyJSONField {
    return {
      dummyField: this.dummyField,
    }
  }

  toJSON(): LegacyMetadataKeyJSON {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): LegacyMetadataKey {
    return LegacyMetadataKey.reified().new({
      dummyField: decodeFromJSONField('bool', field.dummyField),
    })
  }

  static fromJSON(json: Record<string, any>): LegacyMetadataKey {
    if (json.$typeName !== LegacyMetadataKey.$typeName) {
      throw new Error(
        `not a LegacyMetadataKey json object: expected '${LegacyMetadataKey.$typeName}' but got '${json.$typeName}'`,
      )
    }

    return LegacyMetadataKey.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): LegacyMetadataKey {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isLegacyMetadataKey(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a LegacyMetadataKey object`)
    }
    return LegacyMetadataKey.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): LegacyMetadataKey {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isLegacyMetadataKey(data.bcs.type)) {
        throw new Error(`object at is not a LegacyMetadataKey object`)
      }

      return LegacyMetadataKey.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return LegacyMetadataKey.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.',
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<LegacyMetadataKey> {
    const res = await fetchObjectBcs(client, id)
    if (!isLegacyMetadataKey(res.type)) {
      throw new Error(`object at id ${id} is not a LegacyMetadataKey object`)
    }

    return LegacyMetadataKey.fromBcs(res.bcsBytes)
  }
}

/* ============================== MetadataCap =============================== */

export function isMetadataCap(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::coin_registry::MetadataCap` + '<')
}

export interface MetadataCapFields<T extends PhantomTypeArgument> {
  id: ToField<UID>
}

export type MetadataCapReified<T extends PhantomTypeArgument> = Reified<
  MetadataCap<T>,
  MetadataCapFields<T>
>

export type MetadataCapJSONField<T extends PhantomTypeArgument> = {
  id: string
}

export type MetadataCapJSON<T extends PhantomTypeArgument> = {
  $typeName: typeof MetadataCap.$typeName
  $typeArgs: [PhantomToTypeStr<T>]
} & MetadataCapJSONField<T>

/**
 * Capability object that gates metadata (name, description, icon_url, symbol)
 * changes in the `Currency`. It can only be created (or claimed) once, and can
 * be deleted to prevent changes to the `Currency` metadata.
 */
export class MetadataCap<T extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::coin_registry::MetadataCap` =
    `0x2::coin_registry::MetadataCap` as const
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName: typeof MetadataCap.$typeName = MetadataCap.$typeName
  readonly $fullTypeName: `0x2::coin_registry::MetadataCap<${PhantomToTypeStr<T>}>`
  readonly $typeArgs: [PhantomToTypeStr<T>]
  readonly $isPhantom: typeof MetadataCap.$isPhantom = MetadataCap.$isPhantom

  readonly id: ToField<UID>

  private constructor(typeArgs: [PhantomToTypeStr<T>], fields: MetadataCapFields<T>) {
    this.$fullTypeName = composeSuiType(
      MetadataCap.$typeName,
      ...typeArgs,
    ) as `0x2::coin_registry::MetadataCap<${PhantomToTypeStr<T>}>`
    this.$typeArgs = typeArgs

    this.id = fields.id
  }

  static reified<T extends PhantomReified<PhantomTypeArgument>>(
    T: T,
  ): MetadataCapReified<ToPhantomTypeArgument<T>> {
    const reifiedBcs = MetadataCap.bcs
    return {
      typeName: MetadataCap.$typeName,
      fullTypeName: composeSuiType(
        MetadataCap.$typeName,
        ...[extractType(T)],
      ) as `0x2::coin_registry::MetadataCap<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`,
      typeArgs: [extractType(T)] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>],
      isPhantom: MetadataCap.$isPhantom,
      reifiedTypeArgs: [T],
      fromFields: (fields: Record<string, any>) => MetadataCap.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => MetadataCap.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => MetadataCap.fromFields(T, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => MetadataCap.fromJSONField(T, field),
      fromJSON: (json: Record<string, any>) => MetadataCap.fromJSON(T, json),
      fromSuiParsedData: (content: SuiParsedData) => MetadataCap.fromSuiParsedData(T, content),
      fromSuiObjectData: (content: SuiObjectData) => MetadataCap.fromSuiObjectData(T, content),
      fetch: async (client: SupportedSuiClient, id: string) => MetadataCap.fetch(client, T, id),
      new: (fields: MetadataCapFields<ToPhantomTypeArgument<T>>) => {
        return new MetadataCap([extractType(T)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): typeof MetadataCap.reified {
    return MetadataCap.reified
  }

  static phantom<T extends PhantomReified<PhantomTypeArgument>>(
    T: T,
  ): PhantomReified<ToTypeStr<MetadataCap<ToPhantomTypeArgument<T>>>> {
    return phantom(MetadataCap.reified(T))
  }

  static get p(): typeof MetadataCap.phantom {
    return MetadataCap.phantom
  }

  private static instantiateBcs() {
    return bcs.struct('MetadataCap', {
      id: UID.bcs,
    })
  }

  private static cachedBcs: ReturnType<typeof MetadataCap.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof MetadataCap.instantiateBcs> {
    if (!MetadataCap.cachedBcs) {
      MetadataCap.cachedBcs = MetadataCap.instantiateBcs()
    }
    return MetadataCap.cachedBcs
  }

  static fromFields<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    fields: Record<string, any>,
  ): MetadataCap<ToPhantomTypeArgument<T>> {
    return MetadataCap.reified(typeArg).new({
      id: decodeFromFields(UID.reified(), fields.id),
    })
  }

  static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    item: FieldsWithTypes,
  ): MetadataCap<ToPhantomTypeArgument<T>> {
    if (!isMetadataCap(item.type)) {
      throw new Error('not a MetadataCap type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return MetadataCap.reified(typeArg).new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
    })
  }

  static fromBcs<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    data: Uint8Array,
  ): MetadataCap<ToPhantomTypeArgument<T>> {
    return MetadataCap.fromFields(typeArg, MetadataCap.bcs.parse(data))
  }

  toJSONField(): MetadataCapJSONField<T> {
    return {
      id: this.id,
    }
  }

  toJSON(): MetadataCapJSON<T> {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    field: any,
  ): MetadataCap<ToPhantomTypeArgument<T>> {
    return MetadataCap.reified(typeArg).new({
      id: decodeFromJSONField(UID.reified(), field.id),
    })
  }

  static fromJSON<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    json: Record<string, any>,
  ): MetadataCap<ToPhantomTypeArgument<T>> {
    if (json.$typeName !== MetadataCap.$typeName) {
      throw new Error(
        `not a MetadataCap json object: expected '${MetadataCap.$typeName}' but got '${json.$typeName}'`,
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(MetadataCap.$typeName, ...[extractType(typeArg)]),
      json.$typeArgs,
      [typeArg],
    )

    return MetadataCap.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    content: SuiParsedData,
  ): MetadataCap<ToPhantomTypeArgument<T>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isMetadataCap(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a MetadataCap object`)
    }
    return MetadataCap.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    data: SuiObjectData,
  ): MetadataCap<ToPhantomTypeArgument<T>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isMetadataCap(data.bcs.type)) {
        throw new Error(`object at is not a MetadataCap object`)
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

      return MetadataCap.fromBcs(typeArg, fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return MetadataCap.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.',
    )
  }

  static async fetch<T extends PhantomReified<PhantomTypeArgument>>(
    client: SupportedSuiClient,
    typeArg: T,
    id: string,
  ): Promise<MetadataCap<ToPhantomTypeArgument<T>>> {
    const res = await fetchObjectBcs(client, id)
    if (!isMetadataCap(res.type)) {
      throw new Error(`object at id ${id} is not a MetadataCap object`)
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

    return MetadataCap.fromBcs(typeArg, res.bcsBytes)
  }
}

/* ============================== Borrow =============================== */

export function isBorrow(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::coin_registry::Borrow` + '<')
}

export interface BorrowFields<T extends PhantomTypeArgument> {
  dummyField: ToField<'bool'>
}

export type BorrowReified<T extends PhantomTypeArgument> = Reified<Borrow<T>, BorrowFields<T>>

export type BorrowJSONField<T extends PhantomTypeArgument> = {
  dummyField: boolean
}

export type BorrowJSON<T extends PhantomTypeArgument> = {
  $typeName: typeof Borrow.$typeName
  $typeArgs: [PhantomToTypeStr<T>]
} & BorrowJSONField<T>

/** Potato callback for the legacy `CoinMetadata` borrowing. */
export class Borrow<T extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::coin_registry::Borrow` = `0x2::coin_registry::Borrow` as const
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName: typeof Borrow.$typeName = Borrow.$typeName
  readonly $fullTypeName: `0x2::coin_registry::Borrow<${PhantomToTypeStr<T>}>`
  readonly $typeArgs: [PhantomToTypeStr<T>]
  readonly $isPhantom: typeof Borrow.$isPhantom = Borrow.$isPhantom

  readonly dummyField: ToField<'bool'>

  private constructor(typeArgs: [PhantomToTypeStr<T>], fields: BorrowFields<T>) {
    this.$fullTypeName = composeSuiType(
      Borrow.$typeName,
      ...typeArgs,
    ) as `0x2::coin_registry::Borrow<${PhantomToTypeStr<T>}>`
    this.$typeArgs = typeArgs

    this.dummyField = fields.dummyField
  }

  static reified<T extends PhantomReified<PhantomTypeArgument>>(
    T: T,
  ): BorrowReified<ToPhantomTypeArgument<T>> {
    const reifiedBcs = Borrow.bcs
    return {
      typeName: Borrow.$typeName,
      fullTypeName: composeSuiType(
        Borrow.$typeName,
        ...[extractType(T)],
      ) as `0x2::coin_registry::Borrow<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`,
      typeArgs: [extractType(T)] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>],
      isPhantom: Borrow.$isPhantom,
      reifiedTypeArgs: [T],
      fromFields: (fields: Record<string, any>) => Borrow.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Borrow.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => Borrow.fromFields(T, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => Borrow.fromJSONField(T, field),
      fromJSON: (json: Record<string, any>) => Borrow.fromJSON(T, json),
      fromSuiParsedData: (content: SuiParsedData) => Borrow.fromSuiParsedData(T, content),
      fromSuiObjectData: (content: SuiObjectData) => Borrow.fromSuiObjectData(T, content),
      fetch: async (client: SupportedSuiClient, id: string) => Borrow.fetch(client, T, id),
      new: (fields: BorrowFields<ToPhantomTypeArgument<T>>) => {
        return new Borrow([extractType(T)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): typeof Borrow.reified {
    return Borrow.reified
  }

  static phantom<T extends PhantomReified<PhantomTypeArgument>>(
    T: T,
  ): PhantomReified<ToTypeStr<Borrow<ToPhantomTypeArgument<T>>>> {
    return phantom(Borrow.reified(T))
  }

  static get p(): typeof Borrow.phantom {
    return Borrow.phantom
  }

  private static instantiateBcs() {
    return bcs.struct('Borrow', {
      dummy_field: bcs.bool(),
    })
  }

  private static cachedBcs: ReturnType<typeof Borrow.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof Borrow.instantiateBcs> {
    if (!Borrow.cachedBcs) {
      Borrow.cachedBcs = Borrow.instantiateBcs()
    }
    return Borrow.cachedBcs
  }

  static fromFields<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    fields: Record<string, any>,
  ): Borrow<ToPhantomTypeArgument<T>> {
    return Borrow.reified(typeArg).new({
      dummyField: decodeFromFields('bool', fields.dummy_field),
    })
  }

  static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    item: FieldsWithTypes,
  ): Borrow<ToPhantomTypeArgument<T>> {
    if (!isBorrow(item.type)) {
      throw new Error('not a Borrow type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Borrow.reified(typeArg).new({
      dummyField: decodeFromFieldsWithTypes('bool', item.fields.dummy_field),
    })
  }

  static fromBcs<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    data: Uint8Array,
  ): Borrow<ToPhantomTypeArgument<T>> {
    return Borrow.fromFields(typeArg, Borrow.bcs.parse(data))
  }

  toJSONField(): BorrowJSONField<T> {
    return {
      dummyField: this.dummyField,
    }
  }

  toJSON(): BorrowJSON<T> {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    field: any,
  ): Borrow<ToPhantomTypeArgument<T>> {
    return Borrow.reified(typeArg).new({
      dummyField: decodeFromJSONField('bool', field.dummyField),
    })
  }

  static fromJSON<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    json: Record<string, any>,
  ): Borrow<ToPhantomTypeArgument<T>> {
    if (json.$typeName !== Borrow.$typeName) {
      throw new Error(
        `not a Borrow json object: expected '${Borrow.$typeName}' but got '${json.$typeName}'`,
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Borrow.$typeName, ...[extractType(typeArg)]),
      json.$typeArgs,
      [typeArg],
    )

    return Borrow.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    content: SuiParsedData,
  ): Borrow<ToPhantomTypeArgument<T>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isBorrow(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Borrow object`)
    }
    return Borrow.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    data: SuiObjectData,
  ): Borrow<ToPhantomTypeArgument<T>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isBorrow(data.bcs.type)) {
        throw new Error(`object at is not a Borrow object`)
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

      return Borrow.fromBcs(typeArg, fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Borrow.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.',
    )
  }

  static async fetch<T extends PhantomReified<PhantomTypeArgument>>(
    client: SupportedSuiClient,
    typeArg: T,
    id: string,
  ): Promise<Borrow<ToPhantomTypeArgument<T>>> {
    const res = await fetchObjectBcs(client, id)
    if (!isBorrow(res.type)) {
      throw new Error(`object at id ${id} is not a Borrow object`)
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

    return Borrow.fromBcs(typeArg, res.bcsBytes)
  }
}

/* ============================== Currency =============================== */

export function isCurrency(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::coin_registry::Currency` + '<')
}

export interface CurrencyFields<T extends PhantomTypeArgument> {
  id: ToField<UID>
  /** Number of decimal places the coin uses for display purposes. */
  decimals: ToField<'u8'>
  /** Human-readable name for the coin. */
  name: ToField<String>
  /** Short symbol/ticker for the coin. */
  symbol: ToField<String>
  /** Detailed description of the coin. */
  description: ToField<String>
  /** URL for the coin's icon/logo. */
  iconUrl: ToField<String>
  /**
   * Current supply state of the coin (fixed supply or unknown)
   * Note: We're using `Option` because `SupplyState` does not have drop,
   * meaning we cannot swap out its value at a later state.
   */
  supply: ToField<Option<SupplyStateVariant<T>>>
  /** Regulatory status of the coin (regulated with deny cap or unknown) */
  regulated: ToField<RegulatedStateVariant>
  /** ID of the treasury cap for this coin type, if registered. */
  treasuryCapId: ToField<Option<ID>>
  /** ID of the metadata capability for this coin type, if claimed. */
  metadataCapId: ToField<MetadataCapStateVariant>
  /** Additional fields for extensibility. */
  extraFields: ToField<VecMap<String, ExtraField>>
}

export type CurrencyReified<T extends PhantomTypeArgument> = Reified<Currency<T>, CurrencyFields<T>>

export type CurrencyJSONField<T extends PhantomTypeArgument> = {
  id: string
  decimals: number
  name: string
  symbol: string
  description: string
  iconUrl: string
  supply: ToJSON<SupplyStateVariant<T>> | null
  regulated: ToJSON<RegulatedStateVariant>
  treasuryCapId: string | null
  metadataCapId: ToJSON<MetadataCapStateVariant>
  extraFields: ToJSON<VecMap<String, ExtraField>>
}

export type CurrencyJSON<T extends PhantomTypeArgument> = {
  $typeName: typeof Currency.$typeName
  $typeArgs: [PhantomToTypeStr<T>]
} & CurrencyJSONField<T>

/**
 * Currency stores metadata such as name, symbol, decimals, icon_url and description,
 * as well as supply states (optional) and regulatory status.
 */
export class Currency<T extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::coin_registry::Currency` =
    `0x2::coin_registry::Currency` as const
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName: typeof Currency.$typeName = Currency.$typeName
  readonly $fullTypeName: `0x2::coin_registry::Currency<${PhantomToTypeStr<T>}>`
  readonly $typeArgs: [PhantomToTypeStr<T>]
  readonly $isPhantom: typeof Currency.$isPhantom = Currency.$isPhantom

  readonly id: ToField<UID>
  /** Number of decimal places the coin uses for display purposes. */
  readonly decimals: ToField<'u8'>
  /** Human-readable name for the coin. */
  readonly name: ToField<String>
  /** Short symbol/ticker for the coin. */
  readonly symbol: ToField<String>
  /** Detailed description of the coin. */
  readonly description: ToField<String>
  /** URL for the coin's icon/logo. */
  readonly iconUrl: ToField<String>
  /**
   * Current supply state of the coin (fixed supply or unknown)
   * Note: We're using `Option` because `SupplyState` does not have drop,
   * meaning we cannot swap out its value at a later state.
   */
  readonly supply: ToField<Option<SupplyStateVariant<T>>>
  /** Regulatory status of the coin (regulated with deny cap or unknown) */
  readonly regulated: ToField<RegulatedStateVariant>
  /** ID of the treasury cap for this coin type, if registered. */
  readonly treasuryCapId: ToField<Option<ID>>
  /** ID of the metadata capability for this coin type, if claimed. */
  readonly metadataCapId: ToField<MetadataCapStateVariant>
  /** Additional fields for extensibility. */
  readonly extraFields: ToField<VecMap<String, ExtraField>>

  private constructor(typeArgs: [PhantomToTypeStr<T>], fields: CurrencyFields<T>) {
    this.$fullTypeName = composeSuiType(
      Currency.$typeName,
      ...typeArgs,
    ) as `0x2::coin_registry::Currency<${PhantomToTypeStr<T>}>`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.decimals = fields.decimals
    this.name = fields.name
    this.symbol = fields.symbol
    this.description = fields.description
    this.iconUrl = fields.iconUrl
    this.supply = fields.supply
    this.regulated = fields.regulated
    this.treasuryCapId = fields.treasuryCapId
    this.metadataCapId = fields.metadataCapId
    this.extraFields = fields.extraFields
  }

  static reified<T extends PhantomReified<PhantomTypeArgument>>(
    T: T,
  ): CurrencyReified<ToPhantomTypeArgument<T>> {
    const reifiedBcs = Currency.bcs
    return {
      typeName: Currency.$typeName,
      fullTypeName: composeSuiType(
        Currency.$typeName,
        ...[extractType(T)],
      ) as `0x2::coin_registry::Currency<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`,
      typeArgs: [extractType(T)] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>],
      isPhantom: Currency.$isPhantom,
      reifiedTypeArgs: [T],
      fromFields: (fields: Record<string, any>) => Currency.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Currency.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => Currency.fromFields(T, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => Currency.fromJSONField(T, field),
      fromJSON: (json: Record<string, any>) => Currency.fromJSON(T, json),
      fromSuiParsedData: (content: SuiParsedData) => Currency.fromSuiParsedData(T, content),
      fromSuiObjectData: (content: SuiObjectData) => Currency.fromSuiObjectData(T, content),
      fetch: async (client: SupportedSuiClient, id: string) => Currency.fetch(client, T, id),
      new: (fields: CurrencyFields<ToPhantomTypeArgument<T>>) => {
        return new Currency([extractType(T)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): typeof Currency.reified {
    return Currency.reified
  }

  static phantom<T extends PhantomReified<PhantomTypeArgument>>(
    T: T,
  ): PhantomReified<ToTypeStr<Currency<ToPhantomTypeArgument<T>>>> {
    return phantom(Currency.reified(T))
  }

  static get p(): typeof Currency.phantom {
    return Currency.phantom
  }

  private static instantiateBcs() {
    return bcs.struct('Currency', {
      id: UID.bcs,
      decimals: bcs.u8(),
      name: String.bcs,
      symbol: String.bcs,
      description: String.bcs,
      icon_url: String.bcs,
      supply: Option.bcs(SupplyState.bcs),
      regulated: RegulatedState.bcs,
      treasury_cap_id: Option.bcs(ID.bcs),
      metadata_cap_id: MetadataCapState.bcs,
      extra_fields: VecMap.bcs(String.bcs, ExtraField.bcs),
    })
  }

  private static cachedBcs: ReturnType<typeof Currency.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof Currency.instantiateBcs> {
    if (!Currency.cachedBcs) {
      Currency.cachedBcs = Currency.instantiateBcs()
    }
    return Currency.cachedBcs
  }

  static fromFields<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    fields: Record<string, any>,
  ): Currency<ToPhantomTypeArgument<T>> {
    return Currency.reified(typeArg).new({
      id: decodeFromFields(UID.reified(), fields.id),
      decimals: decodeFromFields('u8', fields.decimals),
      name: decodeFromFields(String.reified(), fields.name),
      symbol: decodeFromFields(String.reified(), fields.symbol),
      description: decodeFromFields(String.reified(), fields.description),
      iconUrl: decodeFromFields(String.reified(), fields.icon_url),
      supply: decodeFromFields(Option.reified(SupplyState.reified(typeArg)), fields.supply),
      regulated: decodeFromFields(RegulatedState.reified(), fields.regulated),
      treasuryCapId: decodeFromFields(Option.reified(ID.reified()), fields.treasury_cap_id),
      metadataCapId: decodeFromFields(MetadataCapState.reified(), fields.metadata_cap_id),
      extraFields: decodeFromFields(
        VecMap.reified(String.reified(), ExtraField.reified()),
        fields.extra_fields,
      ),
    })
  }

  static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    item: FieldsWithTypes,
  ): Currency<ToPhantomTypeArgument<T>> {
    if (!isCurrency(item.type)) {
      throw new Error('not a Currency type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Currency.reified(typeArg).new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      decimals: decodeFromFieldsWithTypes('u8', item.fields.decimals),
      name: decodeFromFieldsWithTypes(String.reified(), item.fields.name),
      symbol: decodeFromFieldsWithTypes(String.reified(), item.fields.symbol),
      description: decodeFromFieldsWithTypes(String.reified(), item.fields.description),
      iconUrl: decodeFromFieldsWithTypes(String.reified(), item.fields.icon_url),
      supply: decodeFromFieldsWithTypes(
        Option.reified(SupplyState.reified(typeArg)),
        item.fields.supply,
      ),
      regulated: decodeFromFieldsWithTypes(RegulatedState.reified(), item.fields.regulated),
      treasuryCapId: decodeFromFieldsWithTypes(
        Option.reified(ID.reified()),
        item.fields.treasury_cap_id,
      ),
      metadataCapId: decodeFromFieldsWithTypes(
        MetadataCapState.reified(),
        item.fields.metadata_cap_id,
      ),
      extraFields: decodeFromFieldsWithTypes(
        VecMap.reified(String.reified(), ExtraField.reified()),
        item.fields.extra_fields,
      ),
    })
  }

  static fromBcs<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    data: Uint8Array,
  ): Currency<ToPhantomTypeArgument<T>> {
    return Currency.fromFields(typeArg, Currency.bcs.parse(data))
  }

  toJSONField(): CurrencyJSONField<T> {
    return {
      id: this.id,
      decimals: this.decimals,
      name: this.name,
      symbol: this.symbol,
      description: this.description,
      iconUrl: this.iconUrl,
      supply: fieldToJSON<Option<SupplyStateVariant<T>>>(
        `${Option.$typeName}<${SupplyState.$typeName}<${this.$typeArgs[0]}>>`,
        this.supply,
      ),
      regulated: this.regulated.toJSONField(),
      treasuryCapId: fieldToJSON<Option<ID>>(
        `${Option.$typeName}<${ID.$typeName}>`,
        this.treasuryCapId,
      ),
      metadataCapId: this.metadataCapId.toJSONField(),
      extraFields: this.extraFields.toJSONField(),
    }
  }

  toJSON(): CurrencyJSON<T> {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    field: any,
  ): Currency<ToPhantomTypeArgument<T>> {
    return Currency.reified(typeArg).new({
      id: decodeFromJSONField(UID.reified(), field.id),
      decimals: decodeFromJSONField('u8', field.decimals),
      name: decodeFromJSONField(String.reified(), field.name),
      symbol: decodeFromJSONField(String.reified(), field.symbol),
      description: decodeFromJSONField(String.reified(), field.description),
      iconUrl: decodeFromJSONField(String.reified(), field.iconUrl),
      supply: decodeFromJSONField(Option.reified(SupplyState.reified(typeArg)), field.supply),
      regulated: decodeFromJSONField(RegulatedState.reified(), field.regulated),
      treasuryCapId: decodeFromJSONField(Option.reified(ID.reified()), field.treasuryCapId),
      metadataCapId: decodeFromJSONField(MetadataCapState.reified(), field.metadataCapId),
      extraFields: decodeFromJSONField(
        VecMap.reified(String.reified(), ExtraField.reified()),
        field.extraFields,
      ),
    })
  }

  static fromJSON<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    json: Record<string, any>,
  ): Currency<ToPhantomTypeArgument<T>> {
    if (json.$typeName !== Currency.$typeName) {
      throw new Error(
        `not a Currency json object: expected '${Currency.$typeName}' but got '${json.$typeName}'`,
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Currency.$typeName, ...[extractType(typeArg)]),
      json.$typeArgs,
      [typeArg],
    )

    return Currency.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    content: SuiParsedData,
  ): Currency<ToPhantomTypeArgument<T>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isCurrency(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Currency object`)
    }
    return Currency.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    data: SuiObjectData,
  ): Currency<ToPhantomTypeArgument<T>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isCurrency(data.bcs.type)) {
        throw new Error(`object at is not a Currency object`)
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

      return Currency.fromBcs(typeArg, fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Currency.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.',
    )
  }

  static async fetch<T extends PhantomReified<PhantomTypeArgument>>(
    client: SupportedSuiClient,
    typeArg: T,
    id: string,
  ): Promise<Currency<ToPhantomTypeArgument<T>>> {
    const res = await fetchObjectBcs(client, id)
    if (!isCurrency(res.type)) {
      throw new Error(`object at id ${id} is not a Currency object`)
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

    return Currency.fromBcs(typeArg, res.bcsBytes)
  }
}

/* ============================== CurrencyInitializer =============================== */

export function isCurrencyInitializer(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::coin_registry::CurrencyInitializer` + '<')
}

export interface CurrencyInitializerFields<T extends PhantomTypeArgument> {
  currency: ToField<Currency<T>>
  extraFields: ToField<Bag>
  isOtw: ToField<'bool'>
}

export type CurrencyInitializerReified<T extends PhantomTypeArgument> = Reified<
  CurrencyInitializer<T>,
  CurrencyInitializerFields<T>
>

export type CurrencyInitializerJSONField<T extends PhantomTypeArgument> = {
  currency: ToJSON<Currency<T>>
  extraFields: ToJSON<Bag>
  isOtw: boolean
}

export type CurrencyInitializerJSON<T extends PhantomTypeArgument> = {
  $typeName: typeof CurrencyInitializer.$typeName
  $typeArgs: [PhantomToTypeStr<T>]
} & CurrencyInitializerJSONField<T>

/**
 * Hot potato wrapper to enforce registration after "new_currency" data creation.
 * Destroyed in the `finalize` call and either transferred to the `CoinRegistry`
 * (in case of an OTW registration) or shared directly (for dynamically created
 * currencies).
 */
export class CurrencyInitializer<T extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::coin_registry::CurrencyInitializer` =
    `0x2::coin_registry::CurrencyInitializer` as const
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName: typeof CurrencyInitializer.$typeName = CurrencyInitializer.$typeName
  readonly $fullTypeName: `0x2::coin_registry::CurrencyInitializer<${PhantomToTypeStr<T>}>`
  readonly $typeArgs: [PhantomToTypeStr<T>]
  readonly $isPhantom: typeof CurrencyInitializer.$isPhantom = CurrencyInitializer.$isPhantom

  readonly currency: ToField<Currency<T>>
  readonly extraFields: ToField<Bag>
  readonly isOtw: ToField<'bool'>

  private constructor(typeArgs: [PhantomToTypeStr<T>], fields: CurrencyInitializerFields<T>) {
    this.$fullTypeName = composeSuiType(
      CurrencyInitializer.$typeName,
      ...typeArgs,
    ) as `0x2::coin_registry::CurrencyInitializer<${PhantomToTypeStr<T>}>`
    this.$typeArgs = typeArgs

    this.currency = fields.currency
    this.extraFields = fields.extraFields
    this.isOtw = fields.isOtw
  }

  static reified<T extends PhantomReified<PhantomTypeArgument>>(
    T: T,
  ): CurrencyInitializerReified<ToPhantomTypeArgument<T>> {
    const reifiedBcs = CurrencyInitializer.bcs
    return {
      typeName: CurrencyInitializer.$typeName,
      fullTypeName: composeSuiType(
        CurrencyInitializer.$typeName,
        ...[extractType(T)],
      ) as `0x2::coin_registry::CurrencyInitializer<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`,
      typeArgs: [extractType(T)] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>],
      isPhantom: CurrencyInitializer.$isPhantom,
      reifiedTypeArgs: [T],
      fromFields: (fields: Record<string, any>) => CurrencyInitializer.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        CurrencyInitializer.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => CurrencyInitializer.fromFields(T, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => CurrencyInitializer.fromJSONField(T, field),
      fromJSON: (json: Record<string, any>) => CurrencyInitializer.fromJSON(T, json),
      fromSuiParsedData: (content: SuiParsedData) =>
        CurrencyInitializer.fromSuiParsedData(T, content),
      fromSuiObjectData: (content: SuiObjectData) =>
        CurrencyInitializer.fromSuiObjectData(T, content),
      fetch: async (client: SupportedSuiClient, id: string) =>
        CurrencyInitializer.fetch(client, T, id),
      new: (fields: CurrencyInitializerFields<ToPhantomTypeArgument<T>>) => {
        return new CurrencyInitializer([extractType(T)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): typeof CurrencyInitializer.reified {
    return CurrencyInitializer.reified
  }

  static phantom<T extends PhantomReified<PhantomTypeArgument>>(
    T: T,
  ): PhantomReified<ToTypeStr<CurrencyInitializer<ToPhantomTypeArgument<T>>>> {
    return phantom(CurrencyInitializer.reified(T))
  }

  static get p(): typeof CurrencyInitializer.phantom {
    return CurrencyInitializer.phantom
  }

  private static instantiateBcs() {
    return bcs.struct('CurrencyInitializer', {
      currency: Currency.bcs,
      extra_fields: Bag.bcs,
      is_otw: bcs.bool(),
    })
  }

  private static cachedBcs: ReturnType<typeof CurrencyInitializer.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof CurrencyInitializer.instantiateBcs> {
    if (!CurrencyInitializer.cachedBcs) {
      CurrencyInitializer.cachedBcs = CurrencyInitializer.instantiateBcs()
    }
    return CurrencyInitializer.cachedBcs
  }

  static fromFields<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    fields: Record<string, any>,
  ): CurrencyInitializer<ToPhantomTypeArgument<T>> {
    return CurrencyInitializer.reified(typeArg).new({
      currency: decodeFromFields(Currency.reified(typeArg), fields.currency),
      extraFields: decodeFromFields(Bag.reified(), fields.extra_fields),
      isOtw: decodeFromFields('bool', fields.is_otw),
    })
  }

  static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    item: FieldsWithTypes,
  ): CurrencyInitializer<ToPhantomTypeArgument<T>> {
    if (!isCurrencyInitializer(item.type)) {
      throw new Error('not a CurrencyInitializer type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return CurrencyInitializer.reified(typeArg).new({
      currency: decodeFromFieldsWithTypes(Currency.reified(typeArg), item.fields.currency),
      extraFields: decodeFromFieldsWithTypes(Bag.reified(), item.fields.extra_fields),
      isOtw: decodeFromFieldsWithTypes('bool', item.fields.is_otw),
    })
  }

  static fromBcs<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    data: Uint8Array,
  ): CurrencyInitializer<ToPhantomTypeArgument<T>> {
    return CurrencyInitializer.fromFields(typeArg, CurrencyInitializer.bcs.parse(data))
  }

  toJSONField(): CurrencyInitializerJSONField<T> {
    return {
      currency: this.currency.toJSONField(),
      extraFields: this.extraFields.toJSONField(),
      isOtw: this.isOtw,
    }
  }

  toJSON(): CurrencyInitializerJSON<T> {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    field: any,
  ): CurrencyInitializer<ToPhantomTypeArgument<T>> {
    return CurrencyInitializer.reified(typeArg).new({
      currency: decodeFromJSONField(Currency.reified(typeArg), field.currency),
      extraFields: decodeFromJSONField(Bag.reified(), field.extraFields),
      isOtw: decodeFromJSONField('bool', field.isOtw),
    })
  }

  static fromJSON<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    json: Record<string, any>,
  ): CurrencyInitializer<ToPhantomTypeArgument<T>> {
    if (json.$typeName !== CurrencyInitializer.$typeName) {
      throw new Error(
        `not a CurrencyInitializer json object: expected '${CurrencyInitializer.$typeName}' but got '${json.$typeName}'`,
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(CurrencyInitializer.$typeName, ...[extractType(typeArg)]),
      json.$typeArgs,
      [typeArg],
    )

    return CurrencyInitializer.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    content: SuiParsedData,
  ): CurrencyInitializer<ToPhantomTypeArgument<T>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isCurrencyInitializer(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a CurrencyInitializer object`)
    }
    return CurrencyInitializer.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    data: SuiObjectData,
  ): CurrencyInitializer<ToPhantomTypeArgument<T>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isCurrencyInitializer(data.bcs.type)) {
        throw new Error(`object at is not a CurrencyInitializer object`)
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

      return CurrencyInitializer.fromBcs(typeArg, fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return CurrencyInitializer.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.',
    )
  }

  static async fetch<T extends PhantomReified<PhantomTypeArgument>>(
    client: SupportedSuiClient,
    typeArg: T,
    id: string,
  ): Promise<CurrencyInitializer<ToPhantomTypeArgument<T>>> {
    const res = await fetchObjectBcs(client, id)
    if (!isCurrencyInitializer(res.type)) {
      throw new Error(`object at id ${id} is not a CurrencyInitializer object`)
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

    return CurrencyInitializer.fromBcs(typeArg, res.bcsBytes)
  }
}

/* ============================== SupplyState =============================== */

/**
 * Supply state marks the type of Currency Supply, which can be
 * - Fixed: no minting or burning;
 * - BurnOnly: no minting, burning is allowed;
 * - Unknown: flexible (supply is controlled by its `TreasuryCap`);
 */

export function isSupplyState(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::coin_registry::SupplyState` + '<')
}

export type SupplyStateVariant<T extends PhantomTypeArgument> =
  | SupplyStateFixed<T>
  | SupplyStateBurnOnly<T>
  | SupplyStateUnknown<T>

export type SupplyStateVariantJSON<T extends PhantomTypeArgument> =
  | SupplyStateFixedJSON<T>
  | SupplyStateBurnOnlyJSON<T>
  | SupplyStateUnknownJSON<T>

export type SupplyStateVariantName = 'Fixed' | 'BurnOnly' | 'Unknown'

export function isSupplyStateVariantName(variant: string): variant is SupplyStateVariantName {
  return variant === 'Fixed' || variant === 'BurnOnly' || variant === 'Unknown'
}

export type SupplyStateFields<T extends PhantomTypeArgument> =
  | SupplyStateFixedFields<T>
  | SupplyStateBurnOnlyFields<T>
  | SupplyStateUnknownFields

export type SupplyStateReified<T extends PhantomTypeArgument> = Reified<
  SupplyStateVariant<T>,
  SupplyStateFields<T>
>

export class SupplyState {
  static readonly $typeName: `0x2::coin_registry::SupplyState` =
    `0x2::coin_registry::SupplyState` as const
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  static reified<T extends PhantomReified<PhantomTypeArgument>>(
    T: T,
  ): SupplyStateReified<ToPhantomTypeArgument<T>> {
    const reifiedBcs = SupplyState.bcs
    return {
      typeName: SupplyState.$typeName,
      fullTypeName: composeSuiType(
        SupplyState.$typeName,
        ...[extractType(T)],
      ) as `0x2::coin_registry::SupplyState<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`,
      typeArgs: [extractType(T)] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>],
      isPhantom: SupplyState.$isPhantom,
      reifiedTypeArgs: [T],
      fromFields: (fields: Record<string, any>) => SupplyState.fromFields([T], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => SupplyState.fromFieldsWithTypes([T], item),
      fromBcs: (data: Uint8Array) => SupplyState.fromBcs([T], data),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => SupplyState.fromJSONField([T], field),
      fromJSON: (json: Record<string, any>) => SupplyState.fromJSON([T], json),
      new: (
        variant: SupplyStateVariantName,
        fields: SupplyStateFields<ToPhantomTypeArgument<T>>,
      ) => {
        switch (variant) {
          case 'Fixed':
            return new SupplyStateFixed(
              [extractType(T)],
              fields as SupplyStateFixedFields<ToPhantomTypeArgument<T>>,
            )
          case 'BurnOnly':
            return new SupplyStateBurnOnly(
              [extractType(T)],
              fields as SupplyStateBurnOnlyFields<ToPhantomTypeArgument<T>>,
            )
          case 'Unknown':
            return new SupplyStateUnknown([extractType(T)], fields as SupplyStateUnknownFields)
        }
      },
      kind: 'EnumClassReified',
    } as SupplyStateReified<ToPhantomTypeArgument<T>>
  }

  static get r(): typeof SupplyState.reified {
    return SupplyState.reified
  }

  static phantom<T extends PhantomReified<PhantomTypeArgument>>(
    T: T,
  ): PhantomReified<ToTypeStr<SupplyStateVariant<ToPhantomTypeArgument<T>>>> {
    return phantom(SupplyState.reified(T))
  }

  static get p(): typeof SupplyState.phantom {
    return SupplyState.phantom
  }

  private static instantiateBcs() {
    return bcs.enum('SupplyState', {
      Fixed: bcs.tuple([Supply.bcs]),
      BurnOnly: bcs.tuple([Supply.bcs]),
      Unknown: null,
    })
  }

  private static cachedBcs: ReturnType<typeof SupplyState.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof SupplyState.instantiateBcs> {
    if (!SupplyState.cachedBcs) {
      SupplyState.cachedBcs = SupplyState.instantiateBcs()
    }
    return SupplyState.cachedBcs
  }

  static fromFields<T extends PhantomReified<PhantomTypeArgument>>(
    typeArgs: [T],
    fields: Record<string, any>,
  ): SupplyStateVariant<ToPhantomTypeArgument<T>> {
    const r = SupplyState.reified(typeArgs[0])

    if (!fields.$kind || !isSupplyStateVariantName(fields.$kind)) {
      throw new Error(`Invalid supplystate variant: ${fields.$kind}`)
    }
    switch (fields.$kind) {
      case 'Fixed':
        return r.new('Fixed', [
          decodeFromFields(Supply.reified(typeArgs[0]), fields.Fixed[0]),
        ])
      case 'BurnOnly':
        return r.new('BurnOnly', [
          decodeFromFields(Supply.reified(typeArgs[0]), fields.BurnOnly[0]),
        ])
      case 'Unknown':
        return r.new('Unknown', fields.Unknown)
    }
  }

  static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>(
    typeArgs: [T],
    item: FieldsWithTypes,
  ): SupplyStateVariant<ToPhantomTypeArgument<T>> {
    if (!isSupplyState(item.type)) {
      throw new Error('not a SupplyState type')
    }
    assertFieldsWithTypesArgsMatch(item, typeArgs)

    const variant = (item as FieldsWithTypes & { variant: SupplyStateVariantName }).variant
    if (!variant || !isSupplyStateVariantName(variant)) {
      throw new Error(`Invalid supplystate variant: ${variant}`)
    }

    const r = SupplyState.reified(typeArgs[0])
    switch (variant) {
      case 'Fixed':
        return r.new('Fixed', [
          decodeFromFieldsWithTypes(Supply.reified(typeArgs[0]), item.fields.pos0),
        ])
      case 'BurnOnly':
        return r.new('BurnOnly', [
          decodeFromFieldsWithTypes(Supply.reified(typeArgs[0]), item.fields.pos0),
        ])
      case 'Unknown':
        return r.new('Unknown', {})
    }
  }

  static fromBcs<T extends PhantomReified<PhantomTypeArgument>>(
    typeArgs: [T],
    data: Uint8Array,
  ): SupplyStateVariant<ToPhantomTypeArgument<T>> {
    const parsed = SupplyState.bcs.parse(data)
    return SupplyState.fromFields(typeArgs, parsed)
  }

  static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>(
    typeArgs: [T],
    field: any,
  ): SupplyStateVariant<ToPhantomTypeArgument<T>> {
    const r = SupplyState.reified(typeArgs[0])

    const kind = field.$kind
    if (!kind || !isSupplyStateVariantName(kind)) {
      throw new Error(`Invalid supplystate variant: ${kind}`)
    }
    switch (kind) {
      case 'Fixed':
        return r.new('Fixed', [
          decodeFromJSONField(Supply.reified(typeArgs[0]), field.vec[0]),
        ])
      case 'BurnOnly':
        return r.new('BurnOnly', [
          decodeFromJSONField(Supply.reified(typeArgs[0]), field.vec[0]),
        ])
      case 'Unknown':
        return r.new('Unknown', {})
    }
  }

  static fromJSON<T extends PhantomReified<PhantomTypeArgument>>(
    typeArgs: [T],
    json: Record<string, any>,
  ): SupplyStateVariant<ToPhantomTypeArgument<T>> {
    if (json.$typeName !== SupplyState.$typeName) {
      throw new Error(
        `not a SupplyState json object: expected '${SupplyState.$typeName}' but got '${json.$typeName}'`,
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(SupplyState.$typeName, ...typeArgs.map(extractType)),
      json.$typeArgs,
      typeArgs,
    )

    return SupplyState.fromJSONField(typeArgs, json)
  }
}

/** Coin has a fixed supply with the given Supply object. */
export type SupplyStateFixedFields<T extends PhantomTypeArgument> = [
  ToField<Supply<T>>,
]

export type SupplyStateFixedJSONField<T extends PhantomTypeArgument> = {
  $kind: 'Fixed'
  vec: [ToJSON<Supply<T>>]
}

export type SupplyStateFixedJSON<T extends PhantomTypeArgument> = {
  $typeName: typeof SupplyState.$typeName
  $typeArgs: [PhantomToTypeStr<T>]
  $variantName: 'Fixed'
} & SupplyStateFixedJSONField<T>

export class SupplyStateFixed<T extends PhantomTypeArgument> implements EnumVariantClass {
  __EnumVariantClass = true as const

  static readonly $typeName: typeof SupplyState.$typeName = SupplyState.$typeName
  static readonly $numTypeParams: typeof SupplyState.$numTypeParams = SupplyState.$numTypeParams
  static readonly $isPhantom: typeof SupplyState.$isPhantom = SupplyState.$isPhantom
  static readonly $variantName = 'Fixed' as const

  readonly $typeName: typeof SupplyStateFixed.$typeName = SupplyStateFixed.$typeName
  readonly $fullTypeName: `${typeof SupplyState.$typeName}<${PhantomToTypeStr<T>}>`
  readonly $typeArgs: [PhantomToTypeStr<T>]
  readonly $isPhantom: typeof SupplyState.$isPhantom = SupplyState.$isPhantom
  readonly $variantName: typeof SupplyStateFixed.$variantName = SupplyStateFixed.$variantName

  readonly 0: ToField<Supply<T>>

  constructor(typeArgs: [PhantomToTypeStr<T>], fields: SupplyStateFixedFields<T>) {
    this.$fullTypeName = composeSuiType(
      SupplyState.$typeName,
      ...typeArgs,
    ) as `${typeof SupplyState.$typeName}<${PhantomToTypeStr<T>}>`
    this.$typeArgs = typeArgs

    this[0] = fields[0]
  }

  toJSONField(): SupplyStateFixedJSONField<T> {
    return {
      $kind: this.$variantName,
      vec: [
        fieldToJSON<Supply<T>>(`${Supply.$typeName}<${this.$typeArgs[0]}>`, this[0]),
      ],
    }
  }

  toJSON(): SupplyStateFixedJSON<T> {
    return {
      $typeName: this.$typeName,
      $typeArgs: this.$typeArgs,
      $variantName: this.$variantName,
      ...this.toJSONField(),
    }
  }
}

/** Coin has a supply that can ONLY decrease. */
export type SupplyStateBurnOnlyFields<T extends PhantomTypeArgument> = [
  ToField<Supply<T>>,
]

export type SupplyStateBurnOnlyJSONField<T extends PhantomTypeArgument> = {
  $kind: 'BurnOnly'
  vec: [ToJSON<Supply<T>>]
}

export type SupplyStateBurnOnlyJSON<T extends PhantomTypeArgument> = {
  $typeName: typeof SupplyState.$typeName
  $typeArgs: [PhantomToTypeStr<T>]
  $variantName: 'BurnOnly'
} & SupplyStateBurnOnlyJSONField<T>

export class SupplyStateBurnOnly<T extends PhantomTypeArgument> implements EnumVariantClass {
  __EnumVariantClass = true as const

  static readonly $typeName: typeof SupplyState.$typeName = SupplyState.$typeName
  static readonly $numTypeParams: typeof SupplyState.$numTypeParams = SupplyState.$numTypeParams
  static readonly $isPhantom: typeof SupplyState.$isPhantom = SupplyState.$isPhantom
  static readonly $variantName = 'BurnOnly' as const

  readonly $typeName: typeof SupplyStateBurnOnly.$typeName = SupplyStateBurnOnly.$typeName
  readonly $fullTypeName: `${typeof SupplyState.$typeName}<${PhantomToTypeStr<T>}>`
  readonly $typeArgs: [PhantomToTypeStr<T>]
  readonly $isPhantom: typeof SupplyState.$isPhantom = SupplyState.$isPhantom
  readonly $variantName: typeof SupplyStateBurnOnly.$variantName = SupplyStateBurnOnly.$variantName

  readonly 0: ToField<Supply<T>>

  constructor(typeArgs: [PhantomToTypeStr<T>], fields: SupplyStateBurnOnlyFields<T>) {
    this.$fullTypeName = composeSuiType(
      SupplyState.$typeName,
      ...typeArgs,
    ) as `${typeof SupplyState.$typeName}<${PhantomToTypeStr<T>}>`
    this.$typeArgs = typeArgs

    this[0] = fields[0]
  }

  toJSONField(): SupplyStateBurnOnlyJSONField<T> {
    return {
      $kind: this.$variantName,
      vec: [
        fieldToJSON<Supply<T>>(`${Supply.$typeName}<${this.$typeArgs[0]}>`, this[0]),
      ],
    }
  }

  toJSON(): SupplyStateBurnOnlyJSON<T> {
    return {
      $typeName: this.$typeName,
      $typeArgs: this.$typeArgs,
      $variantName: this.$variantName,
      ...this.toJSONField(),
    }
  }
}

/** Supply information is not yet known or registered. */
export type SupplyStateUnknownFields = Record<string, never>

export type SupplyStateUnknownJSONField<T extends PhantomTypeArgument> = {
  $kind: 'Unknown'
}

export type SupplyStateUnknownJSON<T extends PhantomTypeArgument> = {
  $typeName: typeof SupplyState.$typeName
  $typeArgs: [PhantomToTypeStr<T>]
  $variantName: 'Unknown'
} & SupplyStateUnknownJSONField<T>

export class SupplyStateUnknown<T extends PhantomTypeArgument> implements EnumVariantClass {
  __EnumVariantClass = true as const

  static readonly $typeName: typeof SupplyState.$typeName = SupplyState.$typeName
  static readonly $numTypeParams: typeof SupplyState.$numTypeParams = SupplyState.$numTypeParams
  static readonly $isPhantom: typeof SupplyState.$isPhantom = SupplyState.$isPhantom
  static readonly $variantName = 'Unknown' as const

  readonly $typeName: typeof SupplyStateUnknown.$typeName = SupplyStateUnknown.$typeName
  readonly $fullTypeName: `${typeof SupplyState.$typeName}<${PhantomToTypeStr<T>}>`
  readonly $typeArgs: [PhantomToTypeStr<T>]
  readonly $isPhantom: typeof SupplyState.$isPhantom = SupplyState.$isPhantom
  readonly $variantName: typeof SupplyStateUnknown.$variantName = SupplyStateUnknown.$variantName

  constructor(typeArgs: [PhantomToTypeStr<T>], fields: SupplyStateUnknownFields) {
    this.$fullTypeName = composeSuiType(
      SupplyState.$typeName,
      ...typeArgs,
    ) as `${typeof SupplyState.$typeName}<${PhantomToTypeStr<T>}>`
    this.$typeArgs = typeArgs
  }

  toJSONField(): SupplyStateUnknownJSONField<T> {
    return { $kind: this.$variantName }
  }

  toJSON(): SupplyStateUnknownJSON<T> {
    return {
      $typeName: this.$typeName,
      $typeArgs: this.$typeArgs,
      $variantName: this.$variantName,
      ...this.toJSONField(),
    }
  }
}

/* ============================== RegulatedState =============================== */

/**
 * Regulated state of a coin type.
 * - Regulated: `DenyCap` exists or a `RegulatedCoinMetadata` used to mark currency as regulated;
 * - Unregulated: the currency was created without deny list;
 * - Unknown: the regulatory status is unknown.
 */

export function isRegulatedState(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::coin_registry::RegulatedState`
}

export type RegulatedStateVariant =
  | RegulatedStateRegulated
  | RegulatedStateUnregulated
  | RegulatedStateUnknown

export type RegulatedStateVariantJSON =
  | RegulatedStateRegulatedJSON
  | RegulatedStateUnregulatedJSON
  | RegulatedStateUnknownJSON

export type RegulatedStateVariantName = 'Regulated' | 'Unregulated' | 'Unknown'

export function isRegulatedStateVariantName(variant: string): variant is RegulatedStateVariantName {
  return variant === 'Regulated' || variant === 'Unregulated' || variant === 'Unknown'
}

export type RegulatedStateFields =
  | RegulatedStateRegulatedFields
  | RegulatedStateUnregulatedFields
  | RegulatedStateUnknownFields

export type RegulatedStateReified = Reified<
  RegulatedStateVariant,
  RegulatedStateFields
>

export class RegulatedState {
  static readonly $typeName: `0x2::coin_registry::RegulatedState` =
    `0x2::coin_registry::RegulatedState` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  static reified(): RegulatedStateReified {
    const reifiedBcs = RegulatedState.bcs
    return {
      typeName: RegulatedState.$typeName,
      fullTypeName: composeSuiType(
        RegulatedState.$typeName,
      ) as `0x2::coin_registry::RegulatedState`,
      typeArgs: [] as [],
      isPhantom: RegulatedState.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => RegulatedState.fromFields([], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => RegulatedState.fromFieldsWithTypes([], item),
      fromBcs: (data: Uint8Array) => RegulatedState.fromBcs([], data),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => RegulatedState.fromJSONField([], field),
      fromJSON: (json: Record<string, any>) => RegulatedState.fromJSON([], json),
      new: (variant: RegulatedStateVariantName, fields: RegulatedStateFields) => {
        switch (variant) {
          case 'Regulated':
            return new RegulatedStateRegulated([], fields as RegulatedStateRegulatedFields)
          case 'Unregulated':
            return new RegulatedStateUnregulated([], fields as RegulatedStateUnregulatedFields)
          case 'Unknown':
            return new RegulatedStateUnknown([], fields as RegulatedStateUnknownFields)
        }
      },
      kind: 'EnumClassReified',
    } as RegulatedStateReified
  }

  static get r(): typeof RegulatedState.reified {
    return RegulatedState.reified
  }

  static phantom(): PhantomReified<ToTypeStr<RegulatedStateVariant>> {
    return phantom(RegulatedState.reified())
  }

  static get p(): typeof RegulatedState.phantom {
    return RegulatedState.phantom
  }

  private static instantiateBcs() {
    return bcs.enum('RegulatedState', {
      Regulated: bcs.struct('RegulatedStateRegulated', {
        cap: ID.bcs,
        allow_global_pause: Option.bcs(bcs.bool()),
        variant: bcs.u8(),
      }),
      Unregulated: null,
      Unknown: null,
    })
  }

  private static cachedBcs: ReturnType<typeof RegulatedState.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof RegulatedState.instantiateBcs> {
    if (!RegulatedState.cachedBcs) {
      RegulatedState.cachedBcs = RegulatedState.instantiateBcs()
    }
    return RegulatedState.cachedBcs
  }

  static fromFields(typeArgs: [], fields: Record<string, any>): RegulatedStateVariant {
    const r = RegulatedState.reified()

    if (!fields.$kind || !isRegulatedStateVariantName(fields.$kind)) {
      throw new Error(`Invalid regulatedstate variant: ${fields.$kind}`)
    }
    switch (fields.$kind) {
      case 'Regulated':
        return r.new('Regulated', {
          cap: decodeFromFields(ID.reified(), fields.Regulated.cap),
          allowGlobalPause: decodeFromFields(
            Option.reified('bool'),
            fields.Regulated.allow_global_pause,
          ),
          variant: decodeFromFields('u8', fields.Regulated.variant),
        })
      case 'Unregulated':
        return r.new('Unregulated', fields.Unregulated)
      case 'Unknown':
        return r.new('Unknown', fields.Unknown)
    }
  }

  static fromFieldsWithTypes(typeArgs: [], item: FieldsWithTypes): RegulatedStateVariant {
    if (!isRegulatedState(item.type)) {
      throw new Error('not a RegulatedState type')
    }

    const variant = (item as FieldsWithTypes & { variant: RegulatedStateVariantName }).variant
    if (!variant || !isRegulatedStateVariantName(variant)) {
      throw new Error(`Invalid regulatedstate variant: ${variant}`)
    }

    const r = RegulatedState.reified()
    switch (variant) {
      case 'Regulated':
        return r.new('Regulated', {
          cap: decodeFromFieldsWithTypes(ID.reified(), item.fields.cap),
          allowGlobalPause: decodeFromFieldsWithTypes(
            Option.reified('bool'),
            item.fields.allow_global_pause,
          ),
          variant: decodeFromFieldsWithTypes('u8', item.fields.variant),
        })
      case 'Unregulated':
        return r.new('Unregulated', {})
      case 'Unknown':
        return r.new('Unknown', {})
    }
  }

  static fromBcs(typeArgs: [], data: Uint8Array): RegulatedStateVariant {
    const parsed = RegulatedState.bcs.parse(data)
    return RegulatedState.fromFields([], parsed)
  }

  static fromJSONField(typeArgs: [], field: any): RegulatedStateVariant {
    const r = RegulatedState.reified()

    const kind = field.$kind
    if (!kind || !isRegulatedStateVariantName(kind)) {
      throw new Error(`Invalid regulatedstate variant: ${kind}`)
    }
    switch (kind) {
      case 'Regulated':
        return r.new('Regulated', {
          cap: decodeFromJSONField(ID.reified(), field.cap),
          allowGlobalPause: decodeFromJSONField(Option.reified('bool'), field.allowGlobalPause),
          variant: decodeFromJSONField('u8', field.variant),
        })
      case 'Unregulated':
        return r.new('Unregulated', {})
      case 'Unknown':
        return r.new('Unknown', {})
    }
  }

  static fromJSON(typeArgs: [], json: Record<string, any>): RegulatedStateVariant {
    if (json.$typeName !== RegulatedState.$typeName) {
      throw new Error(
        `not a RegulatedState json object: expected '${RegulatedState.$typeName}' but got '${json.$typeName}'`,
      )
    }

    return RegulatedState.fromJSONField(typeArgs, json)
  }
}

/**
 * Coin is regulated with a deny cap for address restrictions.
 * `allow_global_pause` is `None` if the information is unknown (has not been migrated from `DenyCapV2`).
 */
export interface RegulatedStateRegulatedFields {
  cap: ToField<ID>
  allowGlobalPause: ToField<Option<'bool'>>
  variant: ToField<'u8'>
}

export type RegulatedStateRegulatedJSONField = {
  $kind: 'Regulated'
  cap: string
  allowGlobalPause: boolean | null
  variant: number
}

export type RegulatedStateRegulatedJSON = {
  $typeName: typeof RegulatedState.$typeName
  $typeArgs: []
  $variantName: 'Regulated'
} & RegulatedStateRegulatedJSONField

export class RegulatedStateRegulated implements EnumVariantClass {
  __EnumVariantClass = true as const

  static readonly $typeName: typeof RegulatedState.$typeName = RegulatedState.$typeName
  static readonly $numTypeParams: typeof RegulatedState.$numTypeParams =
    RegulatedState.$numTypeParams
  static readonly $isPhantom: typeof RegulatedState.$isPhantom = RegulatedState.$isPhantom
  static readonly $variantName = 'Regulated' as const

  readonly $typeName: typeof RegulatedStateRegulated.$typeName = RegulatedStateRegulated.$typeName
  readonly $fullTypeName: `${typeof RegulatedState.$typeName}`
  readonly $typeArgs: []
  readonly $isPhantom: typeof RegulatedState.$isPhantom = RegulatedState.$isPhantom
  readonly $variantName: typeof RegulatedStateRegulated.$variantName =
    RegulatedStateRegulated.$variantName

  readonly cap: ToField<ID>
  readonly allowGlobalPause: ToField<Option<'bool'>>
  readonly variant: ToField<'u8'>

  constructor(typeArgs: [], fields: RegulatedStateRegulatedFields) {
    this.$fullTypeName = composeSuiType(
      RegulatedState.$typeName,
      ...typeArgs,
    ) as `${typeof RegulatedState.$typeName}`
    this.$typeArgs = typeArgs

    this.cap = fields.cap
    this.allowGlobalPause = fields.allowGlobalPause
    this.variant = fields.variant
  }

  toJSONField(): RegulatedStateRegulatedJSONField {
    return {
      $kind: this.$variantName,
      cap: fieldToJSON<ID>(`${ID.$typeName}`, this.cap),
      allowGlobalPause: fieldToJSON<Option<'bool'>>(
        `${Option.$typeName}<bool>`,
        this.allowGlobalPause,
      ),
      variant: fieldToJSON<'u8'>(`u8`, this.variant),
    }
  }

  toJSON(): RegulatedStateRegulatedJSON {
    return {
      $typeName: this.$typeName,
      $typeArgs: this.$typeArgs,
      $variantName: this.$variantName,
      ...this.toJSONField(),
    }
  }
}

/** The coin has been created without deny list. */
export type RegulatedStateUnregulatedFields = Record<string, never>

export type RegulatedStateUnregulatedJSONField = {
  $kind: 'Unregulated'
}

export type RegulatedStateUnregulatedJSON = {
  $typeName: typeof RegulatedState.$typeName
  $typeArgs: []
  $variantName: 'Unregulated'
} & RegulatedStateUnregulatedJSONField

export class RegulatedStateUnregulated implements EnumVariantClass {
  __EnumVariantClass = true as const

  static readonly $typeName: typeof RegulatedState.$typeName = RegulatedState.$typeName
  static readonly $numTypeParams: typeof RegulatedState.$numTypeParams =
    RegulatedState.$numTypeParams
  static readonly $isPhantom: typeof RegulatedState.$isPhantom = RegulatedState.$isPhantom
  static readonly $variantName = 'Unregulated' as const

  readonly $typeName: typeof RegulatedStateUnregulated.$typeName =
    RegulatedStateUnregulated.$typeName
  readonly $fullTypeName: `${typeof RegulatedState.$typeName}`
  readonly $typeArgs: []
  readonly $isPhantom: typeof RegulatedState.$isPhantom = RegulatedState.$isPhantom
  readonly $variantName: typeof RegulatedStateUnregulated.$variantName =
    RegulatedStateUnregulated.$variantName

  constructor(typeArgs: [], fields: RegulatedStateUnregulatedFields) {
    this.$fullTypeName = composeSuiType(
      RegulatedState.$typeName,
      ...typeArgs,
    ) as `${typeof RegulatedState.$typeName}`
    this.$typeArgs = typeArgs
  }

  toJSONField(): RegulatedStateUnregulatedJSONField {
    return { $kind: this.$variantName }
  }

  toJSON(): RegulatedStateUnregulatedJSON {
    return {
      $typeName: this.$typeName,
      $typeArgs: this.$typeArgs,
      $variantName: this.$variantName,
      ...this.toJSONField(),
    }
  }
}

/**
 * Regulatory status is unknown.
 * Result of a legacy migration for that coin (from `coin.move` constructors)
 */
export type RegulatedStateUnknownFields = Record<string, never>

export type RegulatedStateUnknownJSONField = {
  $kind: 'Unknown'
}

export type RegulatedStateUnknownJSON = {
  $typeName: typeof RegulatedState.$typeName
  $typeArgs: []
  $variantName: 'Unknown'
} & RegulatedStateUnknownJSONField

export class RegulatedStateUnknown implements EnumVariantClass {
  __EnumVariantClass = true as const

  static readonly $typeName: typeof RegulatedState.$typeName = RegulatedState.$typeName
  static readonly $numTypeParams: typeof RegulatedState.$numTypeParams =
    RegulatedState.$numTypeParams
  static readonly $isPhantom: typeof RegulatedState.$isPhantom = RegulatedState.$isPhantom
  static readonly $variantName = 'Unknown' as const

  readonly $typeName: typeof RegulatedStateUnknown.$typeName = RegulatedStateUnknown.$typeName
  readonly $fullTypeName: `${typeof RegulatedState.$typeName}`
  readonly $typeArgs: []
  readonly $isPhantom: typeof RegulatedState.$isPhantom = RegulatedState.$isPhantom
  readonly $variantName: typeof RegulatedStateUnknown.$variantName =
    RegulatedStateUnknown.$variantName

  constructor(typeArgs: [], fields: RegulatedStateUnknownFields) {
    this.$fullTypeName = composeSuiType(
      RegulatedState.$typeName,
      ...typeArgs,
    ) as `${typeof RegulatedState.$typeName}`
    this.$typeArgs = typeArgs
  }

  toJSONField(): RegulatedStateUnknownJSONField {
    return { $kind: this.$variantName }
  }

  toJSON(): RegulatedStateUnknownJSON {
    return {
      $typeName: this.$typeName,
      $typeArgs: this.$typeArgs,
      $variantName: this.$variantName,
      ...this.toJSONField(),
    }
  }
}

/* ============================== MetadataCapState =============================== */

/** State of the `MetadataCap` for a single `Currency`. */

export function isMetadataCapState(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::coin_registry::MetadataCapState`
}

export type MetadataCapStateVariant =
  | MetadataCapStateClaimed
  | MetadataCapStateUnclaimed
  | MetadataCapStateDeleted

export type MetadataCapStateVariantJSON =
  | MetadataCapStateClaimedJSON
  | MetadataCapStateUnclaimedJSON
  | MetadataCapStateDeletedJSON

export type MetadataCapStateVariantName = 'Claimed' | 'Unclaimed' | 'Deleted'

export function isMetadataCapStateVariantName(
  variant: string,
): variant is MetadataCapStateVariantName {
  return variant === 'Claimed' || variant === 'Unclaimed' || variant === 'Deleted'
}

export type MetadataCapStateFields =
  | MetadataCapStateClaimedFields
  | MetadataCapStateUnclaimedFields
  | MetadataCapStateDeletedFields

export type MetadataCapStateReified = Reified<
  MetadataCapStateVariant,
  MetadataCapStateFields
>

export class MetadataCapState {
  static readonly $typeName: `0x2::coin_registry::MetadataCapState` =
    `0x2::coin_registry::MetadataCapState` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  static reified(): MetadataCapStateReified {
    const reifiedBcs = MetadataCapState.bcs
    return {
      typeName: MetadataCapState.$typeName,
      fullTypeName: composeSuiType(
        MetadataCapState.$typeName,
      ) as `0x2::coin_registry::MetadataCapState`,
      typeArgs: [] as [],
      isPhantom: MetadataCapState.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => MetadataCapState.fromFields([], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        MetadataCapState.fromFieldsWithTypes([], item),
      fromBcs: (data: Uint8Array) => MetadataCapState.fromBcs([], data),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => MetadataCapState.fromJSONField([], field),
      fromJSON: (json: Record<string, any>) => MetadataCapState.fromJSON([], json),
      new: (variant: MetadataCapStateVariantName, fields: MetadataCapStateFields) => {
        switch (variant) {
          case 'Claimed':
            return new MetadataCapStateClaimed([], fields as MetadataCapStateClaimedFields)
          case 'Unclaimed':
            return new MetadataCapStateUnclaimed([], fields as MetadataCapStateUnclaimedFields)
          case 'Deleted':
            return new MetadataCapStateDeleted([], fields as MetadataCapStateDeletedFields)
        }
      },
      kind: 'EnumClassReified',
    } as MetadataCapStateReified
  }

  static get r(): typeof MetadataCapState.reified {
    return MetadataCapState.reified
  }

  static phantom(): PhantomReified<ToTypeStr<MetadataCapStateVariant>> {
    return phantom(MetadataCapState.reified())
  }

  static get p(): typeof MetadataCapState.phantom {
    return MetadataCapState.phantom
  }

  private static instantiateBcs() {
    return bcs.enum('MetadataCapState', {
      Claimed: bcs.tuple([ID.bcs]),
      Unclaimed: null,
      Deleted: null,
    })
  }

  private static cachedBcs: ReturnType<typeof MetadataCapState.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof MetadataCapState.instantiateBcs> {
    if (!MetadataCapState.cachedBcs) {
      MetadataCapState.cachedBcs = MetadataCapState.instantiateBcs()
    }
    return MetadataCapState.cachedBcs
  }

  static fromFields(typeArgs: [], fields: Record<string, any>): MetadataCapStateVariant {
    const r = MetadataCapState.reified()

    if (!fields.$kind || !isMetadataCapStateVariantName(fields.$kind)) {
      throw new Error(`Invalid metadatacapstate variant: ${fields.$kind}`)
    }
    switch (fields.$kind) {
      case 'Claimed':
        return r.new('Claimed', [
          decodeFromFields(ID.reified(), fields.Claimed[0]),
        ])
      case 'Unclaimed':
        return r.new('Unclaimed', fields.Unclaimed)
      case 'Deleted':
        return r.new('Deleted', fields.Deleted)
    }
  }

  static fromFieldsWithTypes(typeArgs: [], item: FieldsWithTypes): MetadataCapStateVariant {
    if (!isMetadataCapState(item.type)) {
      throw new Error('not a MetadataCapState type')
    }

    const variant = (item as FieldsWithTypes & { variant: MetadataCapStateVariantName }).variant
    if (!variant || !isMetadataCapStateVariantName(variant)) {
      throw new Error(`Invalid metadatacapstate variant: ${variant}`)
    }

    const r = MetadataCapState.reified()
    switch (variant) {
      case 'Claimed':
        return r.new('Claimed', [
          decodeFromFieldsWithTypes(ID.reified(), item.fields.pos0),
        ])
      case 'Unclaimed':
        return r.new('Unclaimed', {})
      case 'Deleted':
        return r.new('Deleted', {})
    }
  }

  static fromBcs(typeArgs: [], data: Uint8Array): MetadataCapStateVariant {
    const parsed = MetadataCapState.bcs.parse(data)
    return MetadataCapState.fromFields([], parsed)
  }

  static fromJSONField(typeArgs: [], field: any): MetadataCapStateVariant {
    const r = MetadataCapState.reified()

    const kind = field.$kind
    if (!kind || !isMetadataCapStateVariantName(kind)) {
      throw new Error(`Invalid metadatacapstate variant: ${kind}`)
    }
    switch (kind) {
      case 'Claimed':
        return r.new('Claimed', [
          decodeFromJSONField(ID.reified(), field.vec[0]),
        ])
      case 'Unclaimed':
        return r.new('Unclaimed', {})
      case 'Deleted':
        return r.new('Deleted', {})
    }
  }

  static fromJSON(typeArgs: [], json: Record<string, any>): MetadataCapStateVariant {
    if (json.$typeName !== MetadataCapState.$typeName) {
      throw new Error(
        `not a MetadataCapState json object: expected '${MetadataCapState.$typeName}' but got '${json.$typeName}'`,
      )
    }

    return MetadataCapState.fromJSONField(typeArgs, json)
  }
}

/** The metadata cap has been claimed. */
export type MetadataCapStateClaimedFields = [
  ToField<ID>,
]

export type MetadataCapStateClaimedJSONField = {
  $kind: 'Claimed'
  vec: [string]
}

export type MetadataCapStateClaimedJSON = {
  $typeName: typeof MetadataCapState.$typeName
  $typeArgs: []
  $variantName: 'Claimed'
} & MetadataCapStateClaimedJSONField

export class MetadataCapStateClaimed implements EnumVariantClass {
  __EnumVariantClass = true as const

  static readonly $typeName: typeof MetadataCapState.$typeName = MetadataCapState.$typeName
  static readonly $numTypeParams: typeof MetadataCapState.$numTypeParams =
    MetadataCapState.$numTypeParams
  static readonly $isPhantom: typeof MetadataCapState.$isPhantom = MetadataCapState.$isPhantom
  static readonly $variantName = 'Claimed' as const

  readonly $typeName: typeof MetadataCapStateClaimed.$typeName = MetadataCapStateClaimed.$typeName
  readonly $fullTypeName: `${typeof MetadataCapState.$typeName}`
  readonly $typeArgs: []
  readonly $isPhantom: typeof MetadataCapState.$isPhantom = MetadataCapState.$isPhantom
  readonly $variantName: typeof MetadataCapStateClaimed.$variantName =
    MetadataCapStateClaimed.$variantName

  readonly 0: ToField<ID>

  constructor(typeArgs: [], fields: MetadataCapStateClaimedFields) {
    this.$fullTypeName = composeSuiType(
      MetadataCapState.$typeName,
      ...typeArgs,
    ) as `${typeof MetadataCapState.$typeName}`
    this.$typeArgs = typeArgs

    this[0] = fields[0]
  }

  toJSONField(): MetadataCapStateClaimedJSONField {
    return {
      $kind: this.$variantName,
      vec: [
        this[0],
      ],
    }
  }

  toJSON(): MetadataCapStateClaimedJSON {
    return {
      $typeName: this.$typeName,
      $typeArgs: this.$typeArgs,
      $variantName: this.$variantName,
      ...this.toJSONField(),
    }
  }
}

/** The metadata cap has not been claimed. */
export type MetadataCapStateUnclaimedFields = Record<string, never>

export type MetadataCapStateUnclaimedJSONField = {
  $kind: 'Unclaimed'
}

export type MetadataCapStateUnclaimedJSON = {
  $typeName: typeof MetadataCapState.$typeName
  $typeArgs: []
  $variantName: 'Unclaimed'
} & MetadataCapStateUnclaimedJSONField

export class MetadataCapStateUnclaimed implements EnumVariantClass {
  __EnumVariantClass = true as const

  static readonly $typeName: typeof MetadataCapState.$typeName = MetadataCapState.$typeName
  static readonly $numTypeParams: typeof MetadataCapState.$numTypeParams =
    MetadataCapState.$numTypeParams
  static readonly $isPhantom: typeof MetadataCapState.$isPhantom = MetadataCapState.$isPhantom
  static readonly $variantName = 'Unclaimed' as const

  readonly $typeName: typeof MetadataCapStateUnclaimed.$typeName =
    MetadataCapStateUnclaimed.$typeName
  readonly $fullTypeName: `${typeof MetadataCapState.$typeName}`
  readonly $typeArgs: []
  readonly $isPhantom: typeof MetadataCapState.$isPhantom = MetadataCapState.$isPhantom
  readonly $variantName: typeof MetadataCapStateUnclaimed.$variantName =
    MetadataCapStateUnclaimed.$variantName

  constructor(typeArgs: [], fields: MetadataCapStateUnclaimedFields) {
    this.$fullTypeName = composeSuiType(
      MetadataCapState.$typeName,
      ...typeArgs,
    ) as `${typeof MetadataCapState.$typeName}`
    this.$typeArgs = typeArgs
  }

  toJSONField(): MetadataCapStateUnclaimedJSONField {
    return { $kind: this.$variantName }
  }

  toJSON(): MetadataCapStateUnclaimedJSON {
    return {
      $typeName: this.$typeName,
      $typeArgs: this.$typeArgs,
      $variantName: this.$variantName,
      ...this.toJSONField(),
    }
  }
}

/** The metadata cap has been claimed and then deleted. */
export type MetadataCapStateDeletedFields = Record<string, never>

export type MetadataCapStateDeletedJSONField = {
  $kind: 'Deleted'
}

export type MetadataCapStateDeletedJSON = {
  $typeName: typeof MetadataCapState.$typeName
  $typeArgs: []
  $variantName: 'Deleted'
} & MetadataCapStateDeletedJSONField

export class MetadataCapStateDeleted implements EnumVariantClass {
  __EnumVariantClass = true as const

  static readonly $typeName: typeof MetadataCapState.$typeName = MetadataCapState.$typeName
  static readonly $numTypeParams: typeof MetadataCapState.$numTypeParams =
    MetadataCapState.$numTypeParams
  static readonly $isPhantom: typeof MetadataCapState.$isPhantom = MetadataCapState.$isPhantom
  static readonly $variantName = 'Deleted' as const

  readonly $typeName: typeof MetadataCapStateDeleted.$typeName = MetadataCapStateDeleted.$typeName
  readonly $fullTypeName: `${typeof MetadataCapState.$typeName}`
  readonly $typeArgs: []
  readonly $isPhantom: typeof MetadataCapState.$isPhantom = MetadataCapState.$isPhantom
  readonly $variantName: typeof MetadataCapStateDeleted.$variantName =
    MetadataCapStateDeleted.$variantName

  constructor(typeArgs: [], fields: MetadataCapStateDeletedFields) {
    this.$fullTypeName = composeSuiType(
      MetadataCapState.$typeName,
      ...typeArgs,
    ) as `${typeof MetadataCapState.$typeName}`
    this.$typeArgs = typeArgs
  }

  toJSONField(): MetadataCapStateDeletedJSONField {
    return { $kind: this.$variantName }
  }

  toJSON(): MetadataCapStateDeletedJSON {
    return {
      $typeName: this.$typeName,
      $typeArgs: this.$typeArgs,
      $variantName: this.$variantName,
      ...this.toJSONField(),
    }
  }
}
