import {
  EnumVariantClass,
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
  vector,
} from '../../_framework/reified'
import {
  FieldsWithTypes,
  composeSuiType,
  compressSuiType,
  parseTypeName,
} from '../../_framework/util'
import { Vector } from '../../_framework/vector'
import { Option } from '../../move-stdlib-chain/option/structs'
import { String } from '../../move-stdlib-chain/string/structs'
import { TypeName } from '../../move-stdlib-chain/type-name/structs'
import { Bag } from '../bag/structs'
import { Supply } from '../balance/structs'
import { ID, UID } from '../object/structs'
import { VecMap } from '../vec-map/structs'
import { bcs } from '@mysten/sui/bcs'
import { SuiClient, SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromB64 } from '@mysten/sui/utils'

/* ============================== CoinRegistry =============================== */

export function isCoinRegistry(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::coin_registry::CoinRegistry`
}

export interface CoinRegistryFields {
  id: ToField<UID>
}

export type CoinRegistryReified = Reified<CoinRegistry, CoinRegistryFields>

export class CoinRegistry implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::coin_registry::CoinRegistry`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = CoinRegistry.$typeName
  readonly $fullTypeName: `0x2::coin_registry::CoinRegistry`
  readonly $typeArgs: []
  readonly $isPhantom = CoinRegistry.$isPhantom

  readonly id: ToField<UID>

  private constructor(typeArgs: [], fields: CoinRegistryFields) {
    this.$fullTypeName = composeSuiType(
      CoinRegistry.$typeName,
      ...typeArgs
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
        ...[]
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
      fetch: async (client: SuiClient, id: string) => CoinRegistry.fetch(client, id),
      new: (fields: CoinRegistryFields) => {
        return new CoinRegistry([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return CoinRegistry.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<CoinRegistry>> {
    return phantom(CoinRegistry.reified())
  }

  static get p() {
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

  toJSONField() {
    return {
      id: this.id,
    }
  }

  toJSON() {
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
        `not a CoinRegistry json object: expected '${CoinRegistry.$typeName}' but got '${json.$typeName}'`
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

      return CoinRegistry.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return CoinRegistry.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<CoinRegistry> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching CoinRegistry object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isCoinRegistry(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a CoinRegistry object`)
    }

    return CoinRegistry.fromSuiObjectData(res.data)
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

export class ExtraField implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::coin_registry::ExtraField`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = ExtraField.$typeName
  readonly $fullTypeName: `0x2::coin_registry::ExtraField`
  readonly $typeArgs: []
  readonly $isPhantom = ExtraField.$isPhantom

  readonly pos0: ToField<TypeName>
  readonly pos1: ToField<Vector<'u8'>>

  private constructor(typeArgs: [], fields: ExtraFieldFields) {
    this.$fullTypeName = composeSuiType(
      ExtraField.$typeName,
      ...typeArgs
    ) as `0x2::coin_registry::ExtraField`
    this.$typeArgs = typeArgs

    this.pos0 = fields.pos0
    this.pos1 = fields.pos1
  }

  static reified(): ExtraFieldReified {
    const reifiedBcs = ExtraField.bcs
    return {
      typeName: ExtraField.$typeName,
      fullTypeName: composeSuiType(ExtraField.$typeName, ...[]) as `0x2::coin_registry::ExtraField`,
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
      fetch: async (client: SuiClient, id: string) => ExtraField.fetch(client, id),
      new: (fields: ExtraFieldFields) => {
        return new ExtraField([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return ExtraField.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<ExtraField>> {
    return phantom(ExtraField.reified())
  }

  static get p() {
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

  toJSONField() {
    return {
      pos0: this.pos0,
      pos1: fieldToJSON<Vector<'u8'>>(`vector<u8>`, this.pos1),
    }
  }

  toJSON() {
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
        `not a ExtraField json object: expected '${ExtraField.$typeName}' but got '${json.$typeName}'`
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

      return ExtraField.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return ExtraField.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<ExtraField> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching ExtraField object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isExtraField(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a ExtraField object`)
    }

    return ExtraField.fromSuiObjectData(res.data)
  }
}

/* ============================== CurrencyKey =============================== */

export function isCurrencyKey(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::coin_registry::CurrencyKey` + '<')
}

export interface CurrencyKeyFields<T0 extends PhantomTypeArgument> {
  dummyField: ToField<'bool'>
}

export type CurrencyKeyReified<T0 extends PhantomTypeArgument> = Reified<
  CurrencyKey<T0>,
  CurrencyKeyFields<T0>
>

export class CurrencyKey<T0 extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::coin_registry::CurrencyKey`
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName = CurrencyKey.$typeName
  readonly $fullTypeName: `0x2::coin_registry::CurrencyKey<${PhantomToTypeStr<T0>}>`
  readonly $typeArgs: [PhantomToTypeStr<T0>]
  readonly $isPhantom = CurrencyKey.$isPhantom

  readonly dummyField: ToField<'bool'>

  private constructor(typeArgs: [PhantomToTypeStr<T0>], fields: CurrencyKeyFields<T0>) {
    this.$fullTypeName = composeSuiType(
      CurrencyKey.$typeName,
      ...typeArgs
    ) as `0x2::coin_registry::CurrencyKey<${PhantomToTypeStr<T0>}>`
    this.$typeArgs = typeArgs

    this.dummyField = fields.dummyField
  }

  static reified<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): CurrencyKeyReified<ToPhantomTypeArgument<T0>> {
    const reifiedBcs = CurrencyKey.bcs
    return {
      typeName: CurrencyKey.$typeName,
      fullTypeName: composeSuiType(
        CurrencyKey.$typeName,
        ...[extractType(T0)]
      ) as `0x2::coin_registry::CurrencyKey<${PhantomToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [extractType(T0)] as [PhantomToTypeStr<ToPhantomTypeArgument<T0>>],
      isPhantom: CurrencyKey.$isPhantom,
      reifiedTypeArgs: [T0],
      fromFields: (fields: Record<string, any>) => CurrencyKey.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => CurrencyKey.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => CurrencyKey.fromFields(T0, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => CurrencyKey.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => CurrencyKey.fromJSON(T0, json),
      fromSuiParsedData: (content: SuiParsedData) => CurrencyKey.fromSuiParsedData(T0, content),
      fromSuiObjectData: (content: SuiObjectData) => CurrencyKey.fromSuiObjectData(T0, content),
      fetch: async (client: SuiClient, id: string) => CurrencyKey.fetch(client, T0, id),
      new: (fields: CurrencyKeyFields<ToPhantomTypeArgument<T0>>) => {
        return new CurrencyKey([extractType(T0)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return CurrencyKey.reified
  }

  static phantom<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): PhantomReified<ToTypeStr<CurrencyKey<ToPhantomTypeArgument<T0>>>> {
    return phantom(CurrencyKey.reified(T0))
  }

  static get p() {
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

  static fromFields<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    fields: Record<string, any>
  ): CurrencyKey<ToPhantomTypeArgument<T0>> {
    return CurrencyKey.reified(typeArg).new({
      dummyField: decodeFromFields('bool', fields.dummy_field),
    })
  }

  static fromFieldsWithTypes<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    item: FieldsWithTypes
  ): CurrencyKey<ToPhantomTypeArgument<T0>> {
    if (!isCurrencyKey(item.type)) {
      throw new Error('not a CurrencyKey type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return CurrencyKey.reified(typeArg).new({
      dummyField: decodeFromFieldsWithTypes('bool', item.fields.dummy_field),
    })
  }

  static fromBcs<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: Uint8Array
  ): CurrencyKey<ToPhantomTypeArgument<T0>> {
    return CurrencyKey.fromFields(typeArg, CurrencyKey.bcs.parse(data))
  }

  toJSONField() {
    return {
      dummyField: this.dummyField,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    field: any
  ): CurrencyKey<ToPhantomTypeArgument<T0>> {
    return CurrencyKey.reified(typeArg).new({
      dummyField: decodeFromJSONField('bool', field.dummyField),
    })
  }

  static fromJSON<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    json: Record<string, any>
  ): CurrencyKey<ToPhantomTypeArgument<T0>> {
    if (json.$typeName !== CurrencyKey.$typeName) {
      throw new Error(
        `not a CurrencyKey json object: expected '${CurrencyKey.$typeName}' but got '${json.$typeName}'`
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(CurrencyKey.$typeName, ...[extractType(typeArg)]),
      json.$typeArgs,
      [typeArg]
    )

    return CurrencyKey.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    content: SuiParsedData
  ): CurrencyKey<ToPhantomTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isCurrencyKey(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a CurrencyKey object`)
    }
    return CurrencyKey.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: SuiObjectData
  ): CurrencyKey<ToPhantomTypeArgument<T0>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isCurrencyKey(data.bcs.type)) {
        throw new Error(`object at is not a CurrencyKey object`)
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

      return CurrencyKey.fromBcs(typeArg, fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return CurrencyKey.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<T0 extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<CurrencyKey<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching CurrencyKey object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isCurrencyKey(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a CurrencyKey object`)
    }

    return CurrencyKey.fromSuiObjectData(typeArg, res.data)
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

export class LegacyMetadataKey implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::coin_registry::LegacyMetadataKey`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = LegacyMetadataKey.$typeName
  readonly $fullTypeName: `0x2::coin_registry::LegacyMetadataKey`
  readonly $typeArgs: []
  readonly $isPhantom = LegacyMetadataKey.$isPhantom

  readonly dummyField: ToField<'bool'>

  private constructor(typeArgs: [], fields: LegacyMetadataKeyFields) {
    this.$fullTypeName = composeSuiType(
      LegacyMetadataKey.$typeName,
      ...typeArgs
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
        ...[]
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
      fetch: async (client: SuiClient, id: string) => LegacyMetadataKey.fetch(client, id),
      new: (fields: LegacyMetadataKeyFields) => {
        return new LegacyMetadataKey([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return LegacyMetadataKey.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<LegacyMetadataKey>> {
    return phantom(LegacyMetadataKey.reified())
  }

  static get p() {
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

  toJSONField() {
    return {
      dummyField: this.dummyField,
    }
  }

  toJSON() {
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
        `not a LegacyMetadataKey json object: expected '${LegacyMetadataKey.$typeName}' but got '${json.$typeName}'`
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

      return LegacyMetadataKey.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return LegacyMetadataKey.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<LegacyMetadataKey> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching LegacyMetadataKey object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isLegacyMetadataKey(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a LegacyMetadataKey object`)
    }

    return LegacyMetadataKey.fromSuiObjectData(res.data)
  }
}

/* ============================== MetadataCap =============================== */

export function isMetadataCap(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::coin_registry::MetadataCap` + '<')
}

export interface MetadataCapFields<T0 extends PhantomTypeArgument> {
  id: ToField<UID>
}

export type MetadataCapReified<T0 extends PhantomTypeArgument> = Reified<
  MetadataCap<T0>,
  MetadataCapFields<T0>
>

export class MetadataCap<T0 extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::coin_registry::MetadataCap`
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName = MetadataCap.$typeName
  readonly $fullTypeName: `0x2::coin_registry::MetadataCap<${PhantomToTypeStr<T0>}>`
  readonly $typeArgs: [PhantomToTypeStr<T0>]
  readonly $isPhantom = MetadataCap.$isPhantom

  readonly id: ToField<UID>

  private constructor(typeArgs: [PhantomToTypeStr<T0>], fields: MetadataCapFields<T0>) {
    this.$fullTypeName = composeSuiType(
      MetadataCap.$typeName,
      ...typeArgs
    ) as `0x2::coin_registry::MetadataCap<${PhantomToTypeStr<T0>}>`
    this.$typeArgs = typeArgs

    this.id = fields.id
  }

  static reified<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): MetadataCapReified<ToPhantomTypeArgument<T0>> {
    const reifiedBcs = MetadataCap.bcs
    return {
      typeName: MetadataCap.$typeName,
      fullTypeName: composeSuiType(
        MetadataCap.$typeName,
        ...[extractType(T0)]
      ) as `0x2::coin_registry::MetadataCap<${PhantomToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [extractType(T0)] as [PhantomToTypeStr<ToPhantomTypeArgument<T0>>],
      isPhantom: MetadataCap.$isPhantom,
      reifiedTypeArgs: [T0],
      fromFields: (fields: Record<string, any>) => MetadataCap.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => MetadataCap.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => MetadataCap.fromFields(T0, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => MetadataCap.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => MetadataCap.fromJSON(T0, json),
      fromSuiParsedData: (content: SuiParsedData) => MetadataCap.fromSuiParsedData(T0, content),
      fromSuiObjectData: (content: SuiObjectData) => MetadataCap.fromSuiObjectData(T0, content),
      fetch: async (client: SuiClient, id: string) => MetadataCap.fetch(client, T0, id),
      new: (fields: MetadataCapFields<ToPhantomTypeArgument<T0>>) => {
        return new MetadataCap([extractType(T0)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return MetadataCap.reified
  }

  static phantom<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): PhantomReified<ToTypeStr<MetadataCap<ToPhantomTypeArgument<T0>>>> {
    return phantom(MetadataCap.reified(T0))
  }

  static get p() {
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

  static fromFields<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    fields: Record<string, any>
  ): MetadataCap<ToPhantomTypeArgument<T0>> {
    return MetadataCap.reified(typeArg).new({
      id: decodeFromFields(UID.reified(), fields.id),
    })
  }

  static fromFieldsWithTypes<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    item: FieldsWithTypes
  ): MetadataCap<ToPhantomTypeArgument<T0>> {
    if (!isMetadataCap(item.type)) {
      throw new Error('not a MetadataCap type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return MetadataCap.reified(typeArg).new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
    })
  }

  static fromBcs<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: Uint8Array
  ): MetadataCap<ToPhantomTypeArgument<T0>> {
    return MetadataCap.fromFields(typeArg, MetadataCap.bcs.parse(data))
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
  ): MetadataCap<ToPhantomTypeArgument<T0>> {
    return MetadataCap.reified(typeArg).new({
      id: decodeFromJSONField(UID.reified(), field.id),
    })
  }

  static fromJSON<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    json: Record<string, any>
  ): MetadataCap<ToPhantomTypeArgument<T0>> {
    if (json.$typeName !== MetadataCap.$typeName) {
      throw new Error(
        `not a MetadataCap json object: expected '${MetadataCap.$typeName}' but got '${json.$typeName}'`
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(MetadataCap.$typeName, ...[extractType(typeArg)]),
      json.$typeArgs,
      [typeArg]
    )

    return MetadataCap.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    content: SuiParsedData
  ): MetadataCap<ToPhantomTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isMetadataCap(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a MetadataCap object`)
    }
    return MetadataCap.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: SuiObjectData
  ): MetadataCap<ToPhantomTypeArgument<T0>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isMetadataCap(data.bcs.type)) {
        throw new Error(`object at is not a MetadataCap object`)
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

      return MetadataCap.fromBcs(typeArg, fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return MetadataCap.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<T0 extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<MetadataCap<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching MetadataCap object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isMetadataCap(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a MetadataCap object`)
    }

    return MetadataCap.fromSuiObjectData(typeArg, res.data)
  }
}

/* ============================== Borrow =============================== */

export function isBorrow(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::coin_registry::Borrow` + '<')
}

export interface BorrowFields<T0 extends PhantomTypeArgument> {
  dummyField: ToField<'bool'>
}

export type BorrowReified<T0 extends PhantomTypeArgument> = Reified<Borrow<T0>, BorrowFields<T0>>

export class Borrow<T0 extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::coin_registry::Borrow`
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName = Borrow.$typeName
  readonly $fullTypeName: `0x2::coin_registry::Borrow<${PhantomToTypeStr<T0>}>`
  readonly $typeArgs: [PhantomToTypeStr<T0>]
  readonly $isPhantom = Borrow.$isPhantom

  readonly dummyField: ToField<'bool'>

  private constructor(typeArgs: [PhantomToTypeStr<T0>], fields: BorrowFields<T0>) {
    this.$fullTypeName = composeSuiType(
      Borrow.$typeName,
      ...typeArgs
    ) as `0x2::coin_registry::Borrow<${PhantomToTypeStr<T0>}>`
    this.$typeArgs = typeArgs

    this.dummyField = fields.dummyField
  }

  static reified<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): BorrowReified<ToPhantomTypeArgument<T0>> {
    const reifiedBcs = Borrow.bcs
    return {
      typeName: Borrow.$typeName,
      fullTypeName: composeSuiType(
        Borrow.$typeName,
        ...[extractType(T0)]
      ) as `0x2::coin_registry::Borrow<${PhantomToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [extractType(T0)] as [PhantomToTypeStr<ToPhantomTypeArgument<T0>>],
      isPhantom: Borrow.$isPhantom,
      reifiedTypeArgs: [T0],
      fromFields: (fields: Record<string, any>) => Borrow.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Borrow.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => Borrow.fromFields(T0, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => Borrow.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => Borrow.fromJSON(T0, json),
      fromSuiParsedData: (content: SuiParsedData) => Borrow.fromSuiParsedData(T0, content),
      fromSuiObjectData: (content: SuiObjectData) => Borrow.fromSuiObjectData(T0, content),
      fetch: async (client: SuiClient, id: string) => Borrow.fetch(client, T0, id),
      new: (fields: BorrowFields<ToPhantomTypeArgument<T0>>) => {
        return new Borrow([extractType(T0)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Borrow.reified
  }

  static phantom<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): PhantomReified<ToTypeStr<Borrow<ToPhantomTypeArgument<T0>>>> {
    return phantom(Borrow.reified(T0))
  }

  static get p() {
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

  static fromFields<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    fields: Record<string, any>
  ): Borrow<ToPhantomTypeArgument<T0>> {
    return Borrow.reified(typeArg).new({
      dummyField: decodeFromFields('bool', fields.dummy_field),
    })
  }

  static fromFieldsWithTypes<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    item: FieldsWithTypes
  ): Borrow<ToPhantomTypeArgument<T0>> {
    if (!isBorrow(item.type)) {
      throw new Error('not a Borrow type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Borrow.reified(typeArg).new({
      dummyField: decodeFromFieldsWithTypes('bool', item.fields.dummy_field),
    })
  }

  static fromBcs<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: Uint8Array
  ): Borrow<ToPhantomTypeArgument<T0>> {
    return Borrow.fromFields(typeArg, Borrow.bcs.parse(data))
  }

  toJSONField() {
    return {
      dummyField: this.dummyField,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    field: any
  ): Borrow<ToPhantomTypeArgument<T0>> {
    return Borrow.reified(typeArg).new({
      dummyField: decodeFromJSONField('bool', field.dummyField),
    })
  }

  static fromJSON<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    json: Record<string, any>
  ): Borrow<ToPhantomTypeArgument<T0>> {
    if (json.$typeName !== Borrow.$typeName) {
      throw new Error(
        `not a Borrow json object: expected '${Borrow.$typeName}' but got '${json.$typeName}'`
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Borrow.$typeName, ...[extractType(typeArg)]),
      json.$typeArgs,
      [typeArg]
    )

    return Borrow.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    content: SuiParsedData
  ): Borrow<ToPhantomTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isBorrow(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Borrow object`)
    }
    return Borrow.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: SuiObjectData
  ): Borrow<ToPhantomTypeArgument<T0>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isBorrow(data.bcs.type)) {
        throw new Error(`object at is not a Borrow object`)
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

      return Borrow.fromBcs(typeArg, fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Borrow.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<T0 extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<Borrow<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching Borrow object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isBorrow(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a Borrow object`)
    }

    return Borrow.fromSuiObjectData(typeArg, res.data)
  }
}

/* ============================== Currency =============================== */

export function isCurrency(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::coin_registry::Currency` + '<')
}

export interface CurrencyFields<T0 extends PhantomTypeArgument> {
  id: ToField<UID>
  decimals: ToField<'u8'>
  name: ToField<String>
  symbol: ToField<String>
  description: ToField<String>
  iconUrl: ToField<String>
  supply: ToField<Option<SupplyStateVariant<T0>>>
  regulated: ToField<RegulatedStateVariant>
  treasuryCapId: ToField<Option<ID>>
  metadataCapId: ToField<MetadataCapStateVariant>
  extraFields: ToField<VecMap<String, ExtraField>>
}

export type CurrencyReified<T0 extends PhantomTypeArgument> = Reified<
  Currency<T0>,
  CurrencyFields<T0>
>

export class Currency<T0 extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::coin_registry::Currency`
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName = Currency.$typeName
  readonly $fullTypeName: `0x2::coin_registry::Currency<${PhantomToTypeStr<T0>}>`
  readonly $typeArgs: [PhantomToTypeStr<T0>]
  readonly $isPhantom = Currency.$isPhantom

  readonly id: ToField<UID>
  readonly decimals: ToField<'u8'>
  readonly name: ToField<String>
  readonly symbol: ToField<String>
  readonly description: ToField<String>
  readonly iconUrl: ToField<String>
  readonly supply: ToField<Option<SupplyStateVariant<T0>>>
  readonly regulated: ToField<RegulatedStateVariant>
  readonly treasuryCapId: ToField<Option<ID>>
  readonly metadataCapId: ToField<MetadataCapStateVariant>
  readonly extraFields: ToField<VecMap<String, ExtraField>>

  private constructor(typeArgs: [PhantomToTypeStr<T0>], fields: CurrencyFields<T0>) {
    this.$fullTypeName = composeSuiType(
      Currency.$typeName,
      ...typeArgs
    ) as `0x2::coin_registry::Currency<${PhantomToTypeStr<T0>}>`
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

  static reified<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): CurrencyReified<ToPhantomTypeArgument<T0>> {
    const reifiedBcs = Currency.bcs
    return {
      typeName: Currency.$typeName,
      fullTypeName: composeSuiType(
        Currency.$typeName,
        ...[extractType(T0)]
      ) as `0x2::coin_registry::Currency<${PhantomToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [extractType(T0)] as [PhantomToTypeStr<ToPhantomTypeArgument<T0>>],
      isPhantom: Currency.$isPhantom,
      reifiedTypeArgs: [T0],
      fromFields: (fields: Record<string, any>) => Currency.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Currency.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => Currency.fromFields(T0, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => Currency.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => Currency.fromJSON(T0, json),
      fromSuiParsedData: (content: SuiParsedData) => Currency.fromSuiParsedData(T0, content),
      fromSuiObjectData: (content: SuiObjectData) => Currency.fromSuiObjectData(T0, content),
      fetch: async (client: SuiClient, id: string) => Currency.fetch(client, T0, id),
      new: (fields: CurrencyFields<ToPhantomTypeArgument<T0>>) => {
        return new Currency([extractType(T0)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Currency.reified
  }

  static phantom<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): PhantomReified<ToTypeStr<Currency<ToPhantomTypeArgument<T0>>>> {
    return phantom(Currency.reified(T0))
  }

  static get p() {
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

  static fromFields<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    fields: Record<string, any>
  ): Currency<ToPhantomTypeArgument<T0>> {
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
        fields.extra_fields
      ),
    })
  }

  static fromFieldsWithTypes<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    item: FieldsWithTypes
  ): Currency<ToPhantomTypeArgument<T0>> {
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
        item.fields.supply
      ),
      regulated: decodeFromFieldsWithTypes(RegulatedState.reified(), item.fields.regulated),
      treasuryCapId: decodeFromFieldsWithTypes(
        Option.reified(ID.reified()),
        item.fields.treasury_cap_id
      ),
      metadataCapId: decodeFromFieldsWithTypes(
        MetadataCapState.reified(),
        item.fields.metadata_cap_id
      ),
      extraFields: decodeFromFieldsWithTypes(
        VecMap.reified(String.reified(), ExtraField.reified()),
        item.fields.extra_fields
      ),
    })
  }

  static fromBcs<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: Uint8Array
  ): Currency<ToPhantomTypeArgument<T0>> {
    return Currency.fromFields(typeArg, Currency.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
      decimals: this.decimals,
      name: this.name,
      symbol: this.symbol,
      description: this.description,
      iconUrl: this.iconUrl,
      supply: fieldToJSON<Option<SupplyStateVariant<T0>>>(
        `${Option.$typeName}<${SupplyState.$typeName}<${this.$typeArgs[0]}>>`,
        this.supply
      ),
      regulated: this.regulated.toJSONField(),
      treasuryCapId: fieldToJSON<Option<ID>>(
        `${Option.$typeName}<${ID.$typeName}>`,
        this.treasuryCapId
      ),
      metadataCapId: this.metadataCapId.toJSONField(),
      extraFields: this.extraFields.toJSONField(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    field: any
  ): Currency<ToPhantomTypeArgument<T0>> {
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
        field.extraFields
      ),
    })
  }

  static fromJSON<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    json: Record<string, any>
  ): Currency<ToPhantomTypeArgument<T0>> {
    if (json.$typeName !== Currency.$typeName) {
      throw new Error(
        `not a Currency json object: expected '${Currency.$typeName}' but got '${json.$typeName}'`
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Currency.$typeName, ...[extractType(typeArg)]),
      json.$typeArgs,
      [typeArg]
    )

    return Currency.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    content: SuiParsedData
  ): Currency<ToPhantomTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isCurrency(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Currency object`)
    }
    return Currency.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: SuiObjectData
  ): Currency<ToPhantomTypeArgument<T0>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isCurrency(data.bcs.type)) {
        throw new Error(`object at is not a Currency object`)
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

      return Currency.fromBcs(typeArg, fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Currency.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<T0 extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<Currency<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching Currency object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isCurrency(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a Currency object`)
    }

    return Currency.fromSuiObjectData(typeArg, res.data)
  }
}

/* ============================== CurrencyInitializer =============================== */

export function isCurrencyInitializer(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::coin_registry::CurrencyInitializer` + '<')
}

export interface CurrencyInitializerFields<T0 extends PhantomTypeArgument> {
  currency: ToField<Currency<T0>>
  extraFields: ToField<Bag>
  isOtw: ToField<'bool'>
}

export type CurrencyInitializerReified<T0 extends PhantomTypeArgument> = Reified<
  CurrencyInitializer<T0>,
  CurrencyInitializerFields<T0>
>

export class CurrencyInitializer<T0 extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::coin_registry::CurrencyInitializer`
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName = CurrencyInitializer.$typeName
  readonly $fullTypeName: `0x2::coin_registry::CurrencyInitializer<${PhantomToTypeStr<T0>}>`
  readonly $typeArgs: [PhantomToTypeStr<T0>]
  readonly $isPhantom = CurrencyInitializer.$isPhantom

  readonly currency: ToField<Currency<T0>>
  readonly extraFields: ToField<Bag>
  readonly isOtw: ToField<'bool'>

  private constructor(typeArgs: [PhantomToTypeStr<T0>], fields: CurrencyInitializerFields<T0>) {
    this.$fullTypeName = composeSuiType(
      CurrencyInitializer.$typeName,
      ...typeArgs
    ) as `0x2::coin_registry::CurrencyInitializer<${PhantomToTypeStr<T0>}>`
    this.$typeArgs = typeArgs

    this.currency = fields.currency
    this.extraFields = fields.extraFields
    this.isOtw = fields.isOtw
  }

  static reified<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): CurrencyInitializerReified<ToPhantomTypeArgument<T0>> {
    const reifiedBcs = CurrencyInitializer.bcs
    return {
      typeName: CurrencyInitializer.$typeName,
      fullTypeName: composeSuiType(
        CurrencyInitializer.$typeName,
        ...[extractType(T0)]
      ) as `0x2::coin_registry::CurrencyInitializer<${PhantomToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [extractType(T0)] as [PhantomToTypeStr<ToPhantomTypeArgument<T0>>],
      isPhantom: CurrencyInitializer.$isPhantom,
      reifiedTypeArgs: [T0],
      fromFields: (fields: Record<string, any>) => CurrencyInitializer.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        CurrencyInitializer.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => CurrencyInitializer.fromFields(T0, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => CurrencyInitializer.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => CurrencyInitializer.fromJSON(T0, json),
      fromSuiParsedData: (content: SuiParsedData) =>
        CurrencyInitializer.fromSuiParsedData(T0, content),
      fromSuiObjectData: (content: SuiObjectData) =>
        CurrencyInitializer.fromSuiObjectData(T0, content),
      fetch: async (client: SuiClient, id: string) => CurrencyInitializer.fetch(client, T0, id),
      new: (fields: CurrencyInitializerFields<ToPhantomTypeArgument<T0>>) => {
        return new CurrencyInitializer([extractType(T0)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return CurrencyInitializer.reified
  }

  static phantom<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): PhantomReified<ToTypeStr<CurrencyInitializer<ToPhantomTypeArgument<T0>>>> {
    return phantom(CurrencyInitializer.reified(T0))
  }

  static get p() {
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

  static fromFields<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    fields: Record<string, any>
  ): CurrencyInitializer<ToPhantomTypeArgument<T0>> {
    return CurrencyInitializer.reified(typeArg).new({
      currency: decodeFromFields(Currency.reified(typeArg), fields.currency),
      extraFields: decodeFromFields(Bag.reified(), fields.extra_fields),
      isOtw: decodeFromFields('bool', fields.is_otw),
    })
  }

  static fromFieldsWithTypes<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    item: FieldsWithTypes
  ): CurrencyInitializer<ToPhantomTypeArgument<T0>> {
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

  static fromBcs<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: Uint8Array
  ): CurrencyInitializer<ToPhantomTypeArgument<T0>> {
    return CurrencyInitializer.fromFields(typeArg, CurrencyInitializer.bcs.parse(data))
  }

  toJSONField() {
    return {
      currency: this.currency.toJSONField(),
      extraFields: this.extraFields.toJSONField(),
      isOtw: this.isOtw,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    field: any
  ): CurrencyInitializer<ToPhantomTypeArgument<T0>> {
    return CurrencyInitializer.reified(typeArg).new({
      currency: decodeFromJSONField(Currency.reified(typeArg), field.currency),
      extraFields: decodeFromJSONField(Bag.reified(), field.extraFields),
      isOtw: decodeFromJSONField('bool', field.isOtw),
    })
  }

  static fromJSON<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    json: Record<string, any>
  ): CurrencyInitializer<ToPhantomTypeArgument<T0>> {
    if (json.$typeName !== CurrencyInitializer.$typeName) {
      throw new Error(
        `not a CurrencyInitializer json object: expected '${CurrencyInitializer.$typeName}' but got '${json.$typeName}'`
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(CurrencyInitializer.$typeName, ...[extractType(typeArg)]),
      json.$typeArgs,
      [typeArg]
    )

    return CurrencyInitializer.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    content: SuiParsedData
  ): CurrencyInitializer<ToPhantomTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isCurrencyInitializer(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a CurrencyInitializer object`)
    }
    return CurrencyInitializer.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: SuiObjectData
  ): CurrencyInitializer<ToPhantomTypeArgument<T0>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isCurrencyInitializer(data.bcs.type)) {
        throw new Error(`object at is not a CurrencyInitializer object`)
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

      return CurrencyInitializer.fromBcs(typeArg, fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return CurrencyInitializer.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<T0 extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<CurrencyInitializer<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching CurrencyInitializer object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isCurrencyInitializer(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a CurrencyInitializer object`)
    }

    return CurrencyInitializer.fromSuiObjectData(typeArg, res.data)
  }
}

/* ============================== SupplyState =============================== */

export function isSupplyState(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::coin_registry::SupplyState` + '<')
}

export type SupplyStateVariant<T0 extends PhantomTypeArgument> =
  | SupplyStateFixed<T0>
  | SupplyStateBurnOnly<T0>
  | SupplyStateUnknown<T0>

export type SupplyStateVariantName = 'Fixed' | 'BurnOnly' | 'Unknown'

export function isSupplyStateVariantName(variant: string): variant is SupplyStateVariantName {
  return variant === 'Fixed' || variant === 'BurnOnly' || variant === 'Unknown'
}

export type SupplyStateFields<T0 extends PhantomTypeArgument> =
  | SupplyStateFixedFields<T0>
  | SupplyStateBurnOnlyFields<T0>
  | SupplyStateUnknownFields

export type SupplyStateReified<T0 extends PhantomTypeArgument> = Reified<
  SupplyStateVariant<T0>,
  SupplyStateFields<T0>
>

export class SupplyState {
  static readonly $typeName = `0x2::coin_registry::SupplyState`
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  static reified<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): SupplyStateReified<ToPhantomTypeArgument<T0>> {
    const reifiedBcs = SupplyState.bcs
    return {
      typeName: SupplyState.$typeName,
      fullTypeName: composeSuiType(
        SupplyState.$typeName,
        ...[extractType(T0)]
      ) as `0x2::coin_registry::SupplyState<${PhantomToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [extractType(T0)] as [PhantomToTypeStr<ToPhantomTypeArgument<T0>>],
      isPhantom: SupplyState.$isPhantom,
      reifiedTypeArgs: [T0],
      fromFields: (fields: Record<string, any>) => SupplyState.fromFields([T0], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => SupplyState.fromFieldsWithTypes([T0], item),
      fromBcs: (data: Uint8Array) => SupplyState.fromBcs([T0], data),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => SupplyState.fromJSONField([T0], field),
      fromJSON: (json: Record<string, any>) => SupplyState.fromJSON([T0], json),
      new: (
        variant: SupplyStateVariantName,
        fields: SupplyStateFields<ToPhantomTypeArgument<T0>>
      ) => {
        switch (variant) {
          case 'Fixed':
            return new SupplyStateFixed(
              [extractType(T0)],
              fields as SupplyStateFixedFields<ToPhantomTypeArgument<T0>>
            )
          case 'BurnOnly':
            return new SupplyStateBurnOnly(
              [extractType(T0)],
              fields as SupplyStateBurnOnlyFields<ToPhantomTypeArgument<T0>>
            )
          case 'Unknown':
            return new SupplyStateUnknown([extractType(T0)], fields as SupplyStateUnknownFields)
        }
      },
      kind: 'EnumClassReified',
    } as SupplyStateReified<ToPhantomTypeArgument<T0>>
  }

  static get r() {
    return SupplyState.reified
  }

  static phantom<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): PhantomReified<ToTypeStr<SupplyStateVariant<ToPhantomTypeArgument<T0>>>> {
    return phantom(SupplyState.reified(T0))
  }

  static get p() {
    return SupplyState.phantom
  }

  private static instantiateBcs() {
    return bcs.enum('SupplyState', {
      Fixed: bcs.struct('SupplyStateFixed', {
        pos0: Supply.bcs,
      }),
      BurnOnly: bcs.struct('SupplyStateBurnOnly', {
        pos0: Supply.bcs,
      }),
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

  static fromFields<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArgs: [T0],
    fields: Record<string, any>
  ): SupplyStateVariant<ToPhantomTypeArgument<T0>> {
    const r = SupplyState.reified(typeArgs[0])

    if (!fields.$kind || !isSupplyStateVariantName(fields.$kind)) {
      throw new Error(`Invalid supplystate variant: ${fields.$kind}`)
    }
    switch (fields.$kind) {
      case 'Fixed':
        return r.new('Fixed', {
          pos0: decodeFromFields(Supply.reified(typeArgs[0]), fields.Fixed.pos0),
        })
      case 'BurnOnly':
        return r.new('BurnOnly', {
          pos0: decodeFromFields(Supply.reified(typeArgs[0]), fields.BurnOnly.pos0),
        })
      case 'Unknown':
        return r.new('Unknown', fields.Unknown)
    }
  }

  static fromFieldsWithTypes<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArgs: [T0],
    item: FieldsWithTypes
  ): SupplyStateVariant<ToPhantomTypeArgument<T0>> {
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
        return r.new('Fixed', {
          pos0: decodeFromFieldsWithTypes(Supply.reified(typeArgs[0]), item.fields.pos0),
        })
      case 'BurnOnly':
        return r.new('BurnOnly', {
          pos0: decodeFromFieldsWithTypes(Supply.reified(typeArgs[0]), item.fields.pos0),
        })
      case 'Unknown':
        return r.new('Unknown', {})
    }
  }

  static fromBcs<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArgs: [T0],
    data: Uint8Array
  ): SupplyStateVariant<ToPhantomTypeArgument<T0>> {
    const parsed = SupplyState.bcs.parse(data)
    return SupplyState.fromFields(typeArgs, parsed)
  }

  static fromJSONField<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArgs: [T0],
    field: any
  ): SupplyStateVariant<ToPhantomTypeArgument<T0>> {
    const r = SupplyState.reified(typeArgs[0])

    const kind = field.$kind
    if (!kind || !isSupplyStateVariantName(kind)) {
      throw new Error(`Invalid supplystate variant: ${kind}`)
    }
    switch (kind) {
      case 'Fixed':
        return r.new('Fixed', {
          pos0: decodeFromJSONField(Supply.reified(typeArgs[0]), field.pos0),
        })
      case 'BurnOnly':
        return r.new('BurnOnly', {
          pos0: decodeFromJSONField(Supply.reified(typeArgs[0]), field.pos0),
        })
      case 'Unknown':
        return r.new('Unknown', {})
    }
  }

  static fromJSON<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArgs: [T0],
    json: Record<string, any>
  ): SupplyStateVariant<ToPhantomTypeArgument<T0>> {
    if (json.$typeName !== SupplyState.$typeName) {
      throw new Error(
        `not a SupplyState json object: expected '${SupplyState.$typeName}' but got '${json.$typeName}'`
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(SupplyState.$typeName, ...typeArgs.map(extractType)),
      json.$typeArgs,
      typeArgs
    )

    return SupplyState.fromJSONField(typeArgs, json)
  }
}

export interface SupplyStateFixedFields<T0 extends PhantomTypeArgument> {
  pos0: ToField<Supply<T0>>
}

export class SupplyStateFixed<T0 extends PhantomTypeArgument> implements EnumVariantClass {
  __EnumVariantClass = true as const

  static readonly $typeName = SupplyState.$typeName
  static readonly $numTypeParams = SupplyState.$numTypeParams
  static readonly $isPhantom = SupplyState.$isPhantom
  static readonly $variantName = 'Fixed'

  readonly $typeName = SupplyStateFixed.$typeName
  readonly $fullTypeName: `${typeof SupplyState.$typeName}<${PhantomToTypeStr<T0>}>`
  readonly $typeArgs: [PhantomToTypeStr<T0>]
  readonly $isPhantom = SupplyState.$isPhantom
  readonly $variantName = SupplyStateFixed.$variantName

  readonly pos0: ToField<Supply<T0>>

  constructor(typeArgs: [PhantomToTypeStr<T0>], fields: SupplyStateFixedFields<T0>) {
    this.$fullTypeName = composeSuiType(
      SupplyState.$typeName,
      ...typeArgs
    ) as `${typeof SupplyState.$typeName}<${PhantomToTypeStr<T0>}>`
    this.$typeArgs = typeArgs

    this.pos0 = fields.pos0
  }

  toJSONField() {
    return {
      $kind: this.$variantName,
      pos0: fieldToJSON<Supply<T0>>(`${Supply.$typeName}<${this.$typeArgs[0]}>`, this.pos0),
    }
  }

  toJSON() {
    return {
      $typeName: this.$typeName,
      $typeArgs: this.$typeArgs,
      $variantName: this.$variantName,
      ...this.toJSONField(),
    }
  }
}

export interface SupplyStateBurnOnlyFields<T0 extends PhantomTypeArgument> {
  pos0: ToField<Supply<T0>>
}

export class SupplyStateBurnOnly<T0 extends PhantomTypeArgument> implements EnumVariantClass {
  __EnumVariantClass = true as const

  static readonly $typeName = SupplyState.$typeName
  static readonly $numTypeParams = SupplyState.$numTypeParams
  static readonly $isPhantom = SupplyState.$isPhantom
  static readonly $variantName = 'BurnOnly'

  readonly $typeName = SupplyStateBurnOnly.$typeName
  readonly $fullTypeName: `${typeof SupplyState.$typeName}<${PhantomToTypeStr<T0>}>`
  readonly $typeArgs: [PhantomToTypeStr<T0>]
  readonly $isPhantom = SupplyState.$isPhantom
  readonly $variantName = SupplyStateBurnOnly.$variantName

  readonly pos0: ToField<Supply<T0>>

  constructor(typeArgs: [PhantomToTypeStr<T0>], fields: SupplyStateBurnOnlyFields<T0>) {
    this.$fullTypeName = composeSuiType(
      SupplyState.$typeName,
      ...typeArgs
    ) as `${typeof SupplyState.$typeName}<${PhantomToTypeStr<T0>}>`
    this.$typeArgs = typeArgs

    this.pos0 = fields.pos0
  }

  toJSONField() {
    return {
      $kind: this.$variantName,
      pos0: fieldToJSON<Supply<T0>>(`${Supply.$typeName}<${this.$typeArgs[0]}>`, this.pos0),
    }
  }

  toJSON() {
    return {
      $typeName: this.$typeName,
      $typeArgs: this.$typeArgs,
      $variantName: this.$variantName,
      ...this.toJSONField(),
    }
  }
}

export type SupplyStateUnknownFields = Record<string, never>

export class SupplyStateUnknown<T0 extends PhantomTypeArgument> implements EnumVariantClass {
  __EnumVariantClass = true as const

  static readonly $typeName = SupplyState.$typeName
  static readonly $numTypeParams = SupplyState.$numTypeParams
  static readonly $isPhantom = SupplyState.$isPhantom
  static readonly $variantName = 'Unknown'

  readonly $typeName = SupplyStateUnknown.$typeName
  readonly $fullTypeName: `${typeof SupplyState.$typeName}<${PhantomToTypeStr<T0>}>`
  readonly $typeArgs: [PhantomToTypeStr<T0>]
  readonly $isPhantom = SupplyState.$isPhantom
  readonly $variantName = SupplyStateUnknown.$variantName

  constructor(typeArgs: [PhantomToTypeStr<T0>], fields: SupplyStateUnknownFields) {
    this.$fullTypeName = composeSuiType(
      SupplyState.$typeName,
      ...typeArgs
    ) as `${typeof SupplyState.$typeName}<${PhantomToTypeStr<T0>}>`
    this.$typeArgs = typeArgs
  }

  toJSONField() {
    return { $kind: this.$variantName }
  }

  toJSON() {
    return {
      $typeName: this.$typeName,
      $typeArgs: this.$typeArgs,
      $variantName: this.$variantName,
      ...this.toJSONField(),
    }
  }
}

/* ============================== RegulatedState =============================== */

export function isRegulatedState(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::coin_registry::RegulatedState`
}

export type RegulatedStateVariant =
  | RegulatedStateRegulated
  | RegulatedStateUnregulated
  | RegulatedStateUnknown

export type RegulatedStateVariantName = 'Regulated' | 'Unregulated' | 'Unknown'

export function isRegulatedStateVariantName(variant: string): variant is RegulatedStateVariantName {
  return variant === 'Regulated' || variant === 'Unregulated' || variant === 'Unknown'
}

export type RegulatedStateFields =
  | RegulatedStateRegulatedFields
  | RegulatedStateUnregulatedFields
  | RegulatedStateUnknownFields

export type RegulatedStateReified = Reified<RegulatedStateVariant, RegulatedStateFields>

export class RegulatedState {
  static readonly $typeName = `0x2::coin_registry::RegulatedState`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  static reified(): RegulatedStateReified {
    const reifiedBcs = RegulatedState.bcs
    return {
      typeName: RegulatedState.$typeName,
      fullTypeName: composeSuiType(
        RegulatedState.$typeName
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

  static get r() {
    return RegulatedState.reified
  }

  static phantom(): PhantomReified<ToTypeStr<RegulatedStateVariant>> {
    return phantom(RegulatedState.reified())
  }

  static get p() {
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
            fields.Regulated.allow_global_pause
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
            item.fields.allow_global_pause
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
        `not a RegulatedState json object: expected '${RegulatedState.$typeName}' but got '${json.$typeName}'`
      )
    }

    return RegulatedState.fromJSONField(typeArgs, json)
  }
}

export interface RegulatedStateRegulatedFields {
  cap: ToField<ID>
  allowGlobalPause: ToField<Option<'bool'>>
  variant: ToField<'u8'>
}

export class RegulatedStateRegulated implements EnumVariantClass {
  __EnumVariantClass = true as const

  static readonly $typeName = RegulatedState.$typeName
  static readonly $numTypeParams = RegulatedState.$numTypeParams
  static readonly $isPhantom = RegulatedState.$isPhantom
  static readonly $variantName = 'Regulated'

  readonly $typeName = RegulatedStateRegulated.$typeName
  readonly $fullTypeName: `${typeof RegulatedState.$typeName}`
  readonly $typeArgs: []
  readonly $isPhantom = RegulatedState.$isPhantom
  readonly $variantName = RegulatedStateRegulated.$variantName

  readonly cap: ToField<ID>
  readonly allowGlobalPause: ToField<Option<'bool'>>
  readonly variant: ToField<'u8'>

  constructor(typeArgs: [], fields: RegulatedStateRegulatedFields) {
    this.$fullTypeName = composeSuiType(
      RegulatedState.$typeName,
      ...typeArgs
    ) as `${typeof RegulatedState.$typeName}`
    this.$typeArgs = typeArgs

    this.cap = fields.cap
    this.allowGlobalPause = fields.allowGlobalPause
    this.variant = fields.variant
  }

  toJSONField() {
    return {
      $kind: this.$variantName,
      cap: fieldToJSON<ID>(`${ID.$typeName}`, this.cap),
      allowGlobalPause: fieldToJSON<Option<'bool'>>(
        `${Option.$typeName}<bool>`,
        this.allowGlobalPause
      ),
      variant: fieldToJSON<'u8'>(`u8`, this.variant),
    }
  }

  toJSON() {
    return {
      $typeName: this.$typeName,
      $typeArgs: this.$typeArgs,
      $variantName: this.$variantName,
      ...this.toJSONField(),
    }
  }
}

export type RegulatedStateUnregulatedFields = Record<string, never>

export class RegulatedStateUnregulated implements EnumVariantClass {
  __EnumVariantClass = true as const

  static readonly $typeName = RegulatedState.$typeName
  static readonly $numTypeParams = RegulatedState.$numTypeParams
  static readonly $isPhantom = RegulatedState.$isPhantom
  static readonly $variantName = 'Unregulated'

  readonly $typeName = RegulatedStateUnregulated.$typeName
  readonly $fullTypeName: `${typeof RegulatedState.$typeName}`
  readonly $typeArgs: []
  readonly $isPhantom = RegulatedState.$isPhantom
  readonly $variantName = RegulatedStateUnregulated.$variantName

  constructor(typeArgs: [], fields: RegulatedStateUnregulatedFields) {
    this.$fullTypeName = composeSuiType(
      RegulatedState.$typeName,
      ...typeArgs
    ) as `${typeof RegulatedState.$typeName}`
    this.$typeArgs = typeArgs
  }

  toJSONField() {
    return { $kind: this.$variantName }
  }

  toJSON() {
    return {
      $typeName: this.$typeName,
      $typeArgs: this.$typeArgs,
      $variantName: this.$variantName,
      ...this.toJSONField(),
    }
  }
}

export type RegulatedStateUnknownFields = Record<string, never>

export class RegulatedStateUnknown implements EnumVariantClass {
  __EnumVariantClass = true as const

  static readonly $typeName = RegulatedState.$typeName
  static readonly $numTypeParams = RegulatedState.$numTypeParams
  static readonly $isPhantom = RegulatedState.$isPhantom
  static readonly $variantName = 'Unknown'

  readonly $typeName = RegulatedStateUnknown.$typeName
  readonly $fullTypeName: `${typeof RegulatedState.$typeName}`
  readonly $typeArgs: []
  readonly $isPhantom = RegulatedState.$isPhantom
  readonly $variantName = RegulatedStateUnknown.$variantName

  constructor(typeArgs: [], fields: RegulatedStateUnknownFields) {
    this.$fullTypeName = composeSuiType(
      RegulatedState.$typeName,
      ...typeArgs
    ) as `${typeof RegulatedState.$typeName}`
    this.$typeArgs = typeArgs
  }

  toJSONField() {
    return { $kind: this.$variantName }
  }

  toJSON() {
    return {
      $typeName: this.$typeName,
      $typeArgs: this.$typeArgs,
      $variantName: this.$variantName,
      ...this.toJSONField(),
    }
  }
}

/* ============================== MetadataCapState =============================== */

export function isMetadataCapState(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::coin_registry::MetadataCapState`
}

export type MetadataCapStateVariant =
  | MetadataCapStateClaimed
  | MetadataCapStateUnclaimed
  | MetadataCapStateDeleted

export type MetadataCapStateVariantName = 'Claimed' | 'Unclaimed' | 'Deleted'

export function isMetadataCapStateVariantName(
  variant: string
): variant is MetadataCapStateVariantName {
  return variant === 'Claimed' || variant === 'Unclaimed' || variant === 'Deleted'
}

export type MetadataCapStateFields =
  | MetadataCapStateClaimedFields
  | MetadataCapStateUnclaimedFields
  | MetadataCapStateDeletedFields

export type MetadataCapStateReified = Reified<MetadataCapStateVariant, MetadataCapStateFields>

export class MetadataCapState {
  static readonly $typeName = `0x2::coin_registry::MetadataCapState`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  static reified(): MetadataCapStateReified {
    const reifiedBcs = MetadataCapState.bcs
    return {
      typeName: MetadataCapState.$typeName,
      fullTypeName: composeSuiType(
        MetadataCapState.$typeName
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

  static get r() {
    return MetadataCapState.reified
  }

  static phantom(): PhantomReified<ToTypeStr<MetadataCapStateVariant>> {
    return phantom(MetadataCapState.reified())
  }

  static get p() {
    return MetadataCapState.phantom
  }

  private static instantiateBcs() {
    return bcs.enum('MetadataCapState', {
      Claimed: bcs.struct('MetadataCapStateClaimed', {
        pos0: ID.bcs,
      }),
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
        return r.new('Claimed', {
          pos0: decodeFromFields(ID.reified(), fields.Claimed.pos0),
        })
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
        return r.new('Claimed', {
          pos0: decodeFromFieldsWithTypes(ID.reified(), item.fields.pos0),
        })
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
        return r.new('Claimed', {
          pos0: decodeFromJSONField(ID.reified(), field.pos0),
        })
      case 'Unclaimed':
        return r.new('Unclaimed', {})
      case 'Deleted':
        return r.new('Deleted', {})
    }
  }

  static fromJSON(typeArgs: [], json: Record<string, any>): MetadataCapStateVariant {
    if (json.$typeName !== MetadataCapState.$typeName) {
      throw new Error(
        `not a MetadataCapState json object: expected '${MetadataCapState.$typeName}' but got '${json.$typeName}'`
      )
    }

    return MetadataCapState.fromJSONField(typeArgs, json)
  }
}

export interface MetadataCapStateClaimedFields {
  pos0: ToField<ID>
}

export class MetadataCapStateClaimed implements EnumVariantClass {
  __EnumVariantClass = true as const

  static readonly $typeName = MetadataCapState.$typeName
  static readonly $numTypeParams = MetadataCapState.$numTypeParams
  static readonly $isPhantom = MetadataCapState.$isPhantom
  static readonly $variantName = 'Claimed'

  readonly $typeName = MetadataCapStateClaimed.$typeName
  readonly $fullTypeName: `${typeof MetadataCapState.$typeName}`
  readonly $typeArgs: []
  readonly $isPhantom = MetadataCapState.$isPhantom
  readonly $variantName = MetadataCapStateClaimed.$variantName

  readonly pos0: ToField<ID>

  constructor(typeArgs: [], fields: MetadataCapStateClaimedFields) {
    this.$fullTypeName = composeSuiType(
      MetadataCapState.$typeName,
      ...typeArgs
    ) as `${typeof MetadataCapState.$typeName}`
    this.$typeArgs = typeArgs

    this.pos0 = fields.pos0
  }

  toJSONField() {
    return {
      $kind: this.$variantName,
      pos0: fieldToJSON<ID>(`${ID.$typeName}`, this.pos0),
    }
  }

  toJSON() {
    return {
      $typeName: this.$typeName,
      $typeArgs: this.$typeArgs,
      $variantName: this.$variantName,
      ...this.toJSONField(),
    }
  }
}

export type MetadataCapStateUnclaimedFields = Record<string, never>

export class MetadataCapStateUnclaimed implements EnumVariantClass {
  __EnumVariantClass = true as const

  static readonly $typeName = MetadataCapState.$typeName
  static readonly $numTypeParams = MetadataCapState.$numTypeParams
  static readonly $isPhantom = MetadataCapState.$isPhantom
  static readonly $variantName = 'Unclaimed'

  readonly $typeName = MetadataCapStateUnclaimed.$typeName
  readonly $fullTypeName: `${typeof MetadataCapState.$typeName}`
  readonly $typeArgs: []
  readonly $isPhantom = MetadataCapState.$isPhantom
  readonly $variantName = MetadataCapStateUnclaimed.$variantName

  constructor(typeArgs: [], fields: MetadataCapStateUnclaimedFields) {
    this.$fullTypeName = composeSuiType(
      MetadataCapState.$typeName,
      ...typeArgs
    ) as `${typeof MetadataCapState.$typeName}`
    this.$typeArgs = typeArgs
  }

  toJSONField() {
    return { $kind: this.$variantName }
  }

  toJSON() {
    return {
      $typeName: this.$typeName,
      $typeArgs: this.$typeArgs,
      $variantName: this.$variantName,
      ...this.toJSONField(),
    }
  }
}

export type MetadataCapStateDeletedFields = Record<string, never>

export class MetadataCapStateDeleted implements EnumVariantClass {
  __EnumVariantClass = true as const

  static readonly $typeName = MetadataCapState.$typeName
  static readonly $numTypeParams = MetadataCapState.$numTypeParams
  static readonly $isPhantom = MetadataCapState.$isPhantom
  static readonly $variantName = 'Deleted'

  readonly $typeName = MetadataCapStateDeleted.$typeName
  readonly $fullTypeName: `${typeof MetadataCapState.$typeName}`
  readonly $typeArgs: []
  readonly $isPhantom = MetadataCapState.$isPhantom
  readonly $variantName = MetadataCapStateDeleted.$variantName

  constructor(typeArgs: [], fields: MetadataCapStateDeletedFields) {
    this.$fullTypeName = composeSuiType(
      MetadataCapState.$typeName,
      ...typeArgs
    ) as `${typeof MetadataCapState.$typeName}`
    this.$typeArgs = typeArgs
  }

  toJSONField() {
    return { $kind: this.$variantName }
  }

  toJSON() {
    return {
      $typeName: this.$typeName,
      $typeArgs: this.$typeArgs,
      $variantName: this.$variantName,
      ...this.toJSONField(),
    }
  }
}
