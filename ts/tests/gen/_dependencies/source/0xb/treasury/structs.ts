import {
  PhantomReified,
  Reified,
  StructClass,
  ToField,
  ToTypeStr,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  phantom,
} from '../../../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../../../_framework/util'
import { TypeName } from '../../../../move-stdlib/type-name/structs'
import { Bag } from '../../../../sui/bag/structs'
import { ObjectBag } from '../../../../sui/object-bag/structs'
import { UpgradeCap } from '../../../../sui/package/structs'
import { VecMap } from '../../../../sui/vec-map/structs'
import { bcs } from '@mysten/sui/bcs'
import { SuiClient, SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromB64 } from '@mysten/sui/utils'

/* ============================== BridgeTreasury =============================== */

export function isBridgeTreasury(type: string): boolean {
  type = compressSuiType(type)
  return type === `0xb::treasury::BridgeTreasury`
}

export interface BridgeTreasuryFields {
  treasuries: ToField<ObjectBag>
  supportedTokens: ToField<VecMap<TypeName, BridgeTokenMetadata>>
  idTokenTypeMap: ToField<VecMap<'u8', TypeName>>
  waitingRoom: ToField<Bag>
}

export type BridgeTreasuryReified = Reified<BridgeTreasury, BridgeTreasuryFields>

export class BridgeTreasury implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0xb::treasury::BridgeTreasury`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = BridgeTreasury.$typeName
  readonly $fullTypeName: `0xb::treasury::BridgeTreasury`
  readonly $typeArgs: []
  readonly $isPhantom = BridgeTreasury.$isPhantom

  readonly treasuries: ToField<ObjectBag>
  readonly supportedTokens: ToField<VecMap<TypeName, BridgeTokenMetadata>>
  readonly idTokenTypeMap: ToField<VecMap<'u8', TypeName>>
  readonly waitingRoom: ToField<Bag>

  private constructor(typeArgs: [], fields: BridgeTreasuryFields) {
    this.$fullTypeName = composeSuiType(
      BridgeTreasury.$typeName,
      ...typeArgs
    ) as `0xb::treasury::BridgeTreasury`
    this.$typeArgs = typeArgs

    this.treasuries = fields.treasuries
    this.supportedTokens = fields.supportedTokens
    this.idTokenTypeMap = fields.idTokenTypeMap
    this.waitingRoom = fields.waitingRoom
  }

  static reified(): BridgeTreasuryReified {
    const reifiedBcs = BridgeTreasury.bcs
    return {
      typeName: BridgeTreasury.$typeName,
      fullTypeName: composeSuiType(
        BridgeTreasury.$typeName,
        ...[]
      ) as `0xb::treasury::BridgeTreasury`,
      typeArgs: [] as [],
      isPhantom: BridgeTreasury.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => BridgeTreasury.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => BridgeTreasury.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => BridgeTreasury.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => BridgeTreasury.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => BridgeTreasury.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => BridgeTreasury.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => BridgeTreasury.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => BridgeTreasury.fetch(client, id),
      new: (fields: BridgeTreasuryFields) => {
        return new BridgeTreasury([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return BridgeTreasury.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<BridgeTreasury>> {
    return phantom(BridgeTreasury.reified())
  }

  static get p() {
    return BridgeTreasury.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('BridgeTreasury', {
      treasuries: ObjectBag.bcs,
      supported_tokens: VecMap.bcs(TypeName.bcs, BridgeTokenMetadata.bcs),
      id_token_type_map: VecMap.bcs(bcs.u8(), TypeName.bcs),
      waiting_room: Bag.bcs,
    })
  }

  private static cachedBcs: ReturnType<typeof BridgeTreasury.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof BridgeTreasury.instantiateBcs> {
    if (!BridgeTreasury.cachedBcs) {
      BridgeTreasury.cachedBcs = BridgeTreasury.instantiateBcs()
    }
    return BridgeTreasury.cachedBcs
  }

  static fromFields(fields: Record<string, any>): BridgeTreasury {
    return BridgeTreasury.reified().new({
      treasuries: decodeFromFields(ObjectBag.reified(), fields.treasuries),
      supportedTokens: decodeFromFields(
        VecMap.reified(TypeName.reified(), BridgeTokenMetadata.reified()),
        fields.supported_tokens
      ),
      idTokenTypeMap: decodeFromFields(
        VecMap.reified('u8', TypeName.reified()),
        fields.id_token_type_map
      ),
      waitingRoom: decodeFromFields(Bag.reified(), fields.waiting_room),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): BridgeTreasury {
    if (!isBridgeTreasury(item.type)) {
      throw new Error('not a BridgeTreasury type')
    }

    return BridgeTreasury.reified().new({
      treasuries: decodeFromFieldsWithTypes(ObjectBag.reified(), item.fields.treasuries),
      supportedTokens: decodeFromFieldsWithTypes(
        VecMap.reified(TypeName.reified(), BridgeTokenMetadata.reified()),
        item.fields.supported_tokens
      ),
      idTokenTypeMap: decodeFromFieldsWithTypes(
        VecMap.reified('u8', TypeName.reified()),
        item.fields.id_token_type_map
      ),
      waitingRoom: decodeFromFieldsWithTypes(Bag.reified(), item.fields.waiting_room),
    })
  }

  static fromBcs(data: Uint8Array): BridgeTreasury {
    return BridgeTreasury.fromFields(BridgeTreasury.bcs.parse(data))
  }

  toJSONField() {
    return {
      treasuries: this.treasuries.toJSONField(),
      supportedTokens: this.supportedTokens.toJSONField(),
      idTokenTypeMap: this.idTokenTypeMap.toJSONField(),
      waitingRoom: this.waitingRoom.toJSONField(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): BridgeTreasury {
    return BridgeTreasury.reified().new({
      treasuries: decodeFromJSONField(ObjectBag.reified(), field.treasuries),
      supportedTokens: decodeFromJSONField(
        VecMap.reified(TypeName.reified(), BridgeTokenMetadata.reified()),
        field.supportedTokens
      ),
      idTokenTypeMap: decodeFromJSONField(
        VecMap.reified('u8', TypeName.reified()),
        field.idTokenTypeMap
      ),
      waitingRoom: decodeFromJSONField(Bag.reified(), field.waitingRoom),
    })
  }

  static fromJSON(json: Record<string, any>): BridgeTreasury {
    if (json.$typeName !== BridgeTreasury.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return BridgeTreasury.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): BridgeTreasury {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isBridgeTreasury(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a BridgeTreasury object`)
    }
    return BridgeTreasury.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): BridgeTreasury {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isBridgeTreasury(data.bcs.type)) {
        throw new Error(`object at is not a BridgeTreasury object`)
      }

      return BridgeTreasury.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return BridgeTreasury.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<BridgeTreasury> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching BridgeTreasury object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isBridgeTreasury(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a BridgeTreasury object`)
    }

    return BridgeTreasury.fromSuiObjectData(res.data)
  }
}

/* ============================== BridgeTokenMetadata =============================== */

export function isBridgeTokenMetadata(type: string): boolean {
  type = compressSuiType(type)
  return type === `0xb::treasury::BridgeTokenMetadata`
}

export interface BridgeTokenMetadataFields {
  id: ToField<'u8'>
  decimalMultiplier: ToField<'u64'>
  notionalValue: ToField<'u64'>
  nativeToken: ToField<'bool'>
}

export type BridgeTokenMetadataReified = Reified<BridgeTokenMetadata, BridgeTokenMetadataFields>

export class BridgeTokenMetadata implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0xb::treasury::BridgeTokenMetadata`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = BridgeTokenMetadata.$typeName
  readonly $fullTypeName: `0xb::treasury::BridgeTokenMetadata`
  readonly $typeArgs: []
  readonly $isPhantom = BridgeTokenMetadata.$isPhantom

  readonly id: ToField<'u8'>
  readonly decimalMultiplier: ToField<'u64'>
  readonly notionalValue: ToField<'u64'>
  readonly nativeToken: ToField<'bool'>

  private constructor(typeArgs: [], fields: BridgeTokenMetadataFields) {
    this.$fullTypeName = composeSuiType(
      BridgeTokenMetadata.$typeName,
      ...typeArgs
    ) as `0xb::treasury::BridgeTokenMetadata`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.decimalMultiplier = fields.decimalMultiplier
    this.notionalValue = fields.notionalValue
    this.nativeToken = fields.nativeToken
  }

  static reified(): BridgeTokenMetadataReified {
    const reifiedBcs = BridgeTokenMetadata.bcs
    return {
      typeName: BridgeTokenMetadata.$typeName,
      fullTypeName: composeSuiType(
        BridgeTokenMetadata.$typeName,
        ...[]
      ) as `0xb::treasury::BridgeTokenMetadata`,
      typeArgs: [] as [],
      isPhantom: BridgeTokenMetadata.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => BridgeTokenMetadata.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => BridgeTokenMetadata.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => BridgeTokenMetadata.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => BridgeTokenMetadata.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => BridgeTokenMetadata.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => BridgeTokenMetadata.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => BridgeTokenMetadata.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => BridgeTokenMetadata.fetch(client, id),
      new: (fields: BridgeTokenMetadataFields) => {
        return new BridgeTokenMetadata([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return BridgeTokenMetadata.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<BridgeTokenMetadata>> {
    return phantom(BridgeTokenMetadata.reified())
  }

  static get p() {
    return BridgeTokenMetadata.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('BridgeTokenMetadata', {
      id: bcs.u8(),
      decimal_multiplier: bcs.u64(),
      notional_value: bcs.u64(),
      native_token: bcs.bool(),
    })
  }

  private static cachedBcs: ReturnType<typeof BridgeTokenMetadata.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof BridgeTokenMetadata.instantiateBcs> {
    if (!BridgeTokenMetadata.cachedBcs) {
      BridgeTokenMetadata.cachedBcs = BridgeTokenMetadata.instantiateBcs()
    }
    return BridgeTokenMetadata.cachedBcs
  }

  static fromFields(fields: Record<string, any>): BridgeTokenMetadata {
    return BridgeTokenMetadata.reified().new({
      id: decodeFromFields('u8', fields.id),
      decimalMultiplier: decodeFromFields('u64', fields.decimal_multiplier),
      notionalValue: decodeFromFields('u64', fields.notional_value),
      nativeToken: decodeFromFields('bool', fields.native_token),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): BridgeTokenMetadata {
    if (!isBridgeTokenMetadata(item.type)) {
      throw new Error('not a BridgeTokenMetadata type')
    }

    return BridgeTokenMetadata.reified().new({
      id: decodeFromFieldsWithTypes('u8', item.fields.id),
      decimalMultiplier: decodeFromFieldsWithTypes('u64', item.fields.decimal_multiplier),
      notionalValue: decodeFromFieldsWithTypes('u64', item.fields.notional_value),
      nativeToken: decodeFromFieldsWithTypes('bool', item.fields.native_token),
    })
  }

  static fromBcs(data: Uint8Array): BridgeTokenMetadata {
    return BridgeTokenMetadata.fromFields(BridgeTokenMetadata.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
      decimalMultiplier: this.decimalMultiplier.toString(),
      notionalValue: this.notionalValue.toString(),
      nativeToken: this.nativeToken,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): BridgeTokenMetadata {
    return BridgeTokenMetadata.reified().new({
      id: decodeFromJSONField('u8', field.id),
      decimalMultiplier: decodeFromJSONField('u64', field.decimalMultiplier),
      notionalValue: decodeFromJSONField('u64', field.notionalValue),
      nativeToken: decodeFromJSONField('bool', field.nativeToken),
    })
  }

  static fromJSON(json: Record<string, any>): BridgeTokenMetadata {
    if (json.$typeName !== BridgeTokenMetadata.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return BridgeTokenMetadata.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): BridgeTokenMetadata {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isBridgeTokenMetadata(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a BridgeTokenMetadata object`)
    }
    return BridgeTokenMetadata.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): BridgeTokenMetadata {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isBridgeTokenMetadata(data.bcs.type)) {
        throw new Error(`object at is not a BridgeTokenMetadata object`)
      }

      return BridgeTokenMetadata.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return BridgeTokenMetadata.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<BridgeTokenMetadata> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching BridgeTokenMetadata object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isBridgeTokenMetadata(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a BridgeTokenMetadata object`)
    }

    return BridgeTokenMetadata.fromSuiObjectData(res.data)
  }
}

/* ============================== ForeignTokenRegistration =============================== */

export function isForeignTokenRegistration(type: string): boolean {
  type = compressSuiType(type)
  return type === `0xb::treasury::ForeignTokenRegistration`
}

export interface ForeignTokenRegistrationFields {
  typeName: ToField<TypeName>
  uc: ToField<UpgradeCap>
  decimal: ToField<'u8'>
}

export type ForeignTokenRegistrationReified = Reified<
  ForeignTokenRegistration,
  ForeignTokenRegistrationFields
>

export class ForeignTokenRegistration implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0xb::treasury::ForeignTokenRegistration`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = ForeignTokenRegistration.$typeName
  readonly $fullTypeName: `0xb::treasury::ForeignTokenRegistration`
  readonly $typeArgs: []
  readonly $isPhantom = ForeignTokenRegistration.$isPhantom

  readonly typeName: ToField<TypeName>
  readonly uc: ToField<UpgradeCap>
  readonly decimal: ToField<'u8'>

  private constructor(typeArgs: [], fields: ForeignTokenRegistrationFields) {
    this.$fullTypeName = composeSuiType(
      ForeignTokenRegistration.$typeName,
      ...typeArgs
    ) as `0xb::treasury::ForeignTokenRegistration`
    this.$typeArgs = typeArgs

    this.typeName = fields.typeName
    this.uc = fields.uc
    this.decimal = fields.decimal
  }

  static reified(): ForeignTokenRegistrationReified {
    const reifiedBcs = ForeignTokenRegistration.bcs
    return {
      typeName: ForeignTokenRegistration.$typeName,
      fullTypeName: composeSuiType(
        ForeignTokenRegistration.$typeName,
        ...[]
      ) as `0xb::treasury::ForeignTokenRegistration`,
      typeArgs: [] as [],
      isPhantom: ForeignTokenRegistration.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => ForeignTokenRegistration.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        ForeignTokenRegistration.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => ForeignTokenRegistration.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => ForeignTokenRegistration.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => ForeignTokenRegistration.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) =>
        ForeignTokenRegistration.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) =>
        ForeignTokenRegistration.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => ForeignTokenRegistration.fetch(client, id),
      new: (fields: ForeignTokenRegistrationFields) => {
        return new ForeignTokenRegistration([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return ForeignTokenRegistration.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<ForeignTokenRegistration>> {
    return phantom(ForeignTokenRegistration.reified())
  }

  static get p() {
    return ForeignTokenRegistration.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('ForeignTokenRegistration', {
      type_name: TypeName.bcs,
      uc: UpgradeCap.bcs,
      decimal: bcs.u8(),
    })
  }

  private static cachedBcs: ReturnType<typeof ForeignTokenRegistration.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof ForeignTokenRegistration.instantiateBcs> {
    if (!ForeignTokenRegistration.cachedBcs) {
      ForeignTokenRegistration.cachedBcs = ForeignTokenRegistration.instantiateBcs()
    }
    return ForeignTokenRegistration.cachedBcs
  }

  static fromFields(fields: Record<string, any>): ForeignTokenRegistration {
    return ForeignTokenRegistration.reified().new({
      typeName: decodeFromFields(TypeName.reified(), fields.type_name),
      uc: decodeFromFields(UpgradeCap.reified(), fields.uc),
      decimal: decodeFromFields('u8', fields.decimal),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): ForeignTokenRegistration {
    if (!isForeignTokenRegistration(item.type)) {
      throw new Error('not a ForeignTokenRegistration type')
    }

    return ForeignTokenRegistration.reified().new({
      typeName: decodeFromFieldsWithTypes(TypeName.reified(), item.fields.type_name),
      uc: decodeFromFieldsWithTypes(UpgradeCap.reified(), item.fields.uc),
      decimal: decodeFromFieldsWithTypes('u8', item.fields.decimal),
    })
  }

  static fromBcs(data: Uint8Array): ForeignTokenRegistration {
    return ForeignTokenRegistration.fromFields(ForeignTokenRegistration.bcs.parse(data))
  }

  toJSONField() {
    return {
      typeName: this.typeName.toJSONField(),
      uc: this.uc.toJSONField(),
      decimal: this.decimal,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): ForeignTokenRegistration {
    return ForeignTokenRegistration.reified().new({
      typeName: decodeFromJSONField(TypeName.reified(), field.typeName),
      uc: decodeFromJSONField(UpgradeCap.reified(), field.uc),
      decimal: decodeFromJSONField('u8', field.decimal),
    })
  }

  static fromJSON(json: Record<string, any>): ForeignTokenRegistration {
    if (json.$typeName !== ForeignTokenRegistration.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return ForeignTokenRegistration.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): ForeignTokenRegistration {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isForeignTokenRegistration(content.type)) {
      throw new Error(
        `object at ${(content.fields as any).id} is not a ForeignTokenRegistration object`
      )
    }
    return ForeignTokenRegistration.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): ForeignTokenRegistration {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isForeignTokenRegistration(data.bcs.type)) {
        throw new Error(`object at is not a ForeignTokenRegistration object`)
      }

      return ForeignTokenRegistration.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return ForeignTokenRegistration.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<ForeignTokenRegistration> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(
        `error fetching ForeignTokenRegistration object at id ${id}: ${res.error.code}`
      )
    }
    if (
      res.data?.bcs?.dataType !== 'moveObject' ||
      !isForeignTokenRegistration(res.data.bcs.type)
    ) {
      throw new Error(`object at id ${id} is not a ForeignTokenRegistration object`)
    }

    return ForeignTokenRegistration.fromSuiObjectData(res.data)
  }
}

/* ============================== UpdateTokenPriceEvent =============================== */

export function isUpdateTokenPriceEvent(type: string): boolean {
  type = compressSuiType(type)
  return type === `0xb::treasury::UpdateTokenPriceEvent`
}

export interface UpdateTokenPriceEventFields {
  tokenId: ToField<'u8'>
  newPrice: ToField<'u64'>
}

export type UpdateTokenPriceEventReified = Reified<
  UpdateTokenPriceEvent,
  UpdateTokenPriceEventFields
>

export class UpdateTokenPriceEvent implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0xb::treasury::UpdateTokenPriceEvent`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = UpdateTokenPriceEvent.$typeName
  readonly $fullTypeName: `0xb::treasury::UpdateTokenPriceEvent`
  readonly $typeArgs: []
  readonly $isPhantom = UpdateTokenPriceEvent.$isPhantom

  readonly tokenId: ToField<'u8'>
  readonly newPrice: ToField<'u64'>

  private constructor(typeArgs: [], fields: UpdateTokenPriceEventFields) {
    this.$fullTypeName = composeSuiType(
      UpdateTokenPriceEvent.$typeName,
      ...typeArgs
    ) as `0xb::treasury::UpdateTokenPriceEvent`
    this.$typeArgs = typeArgs

    this.tokenId = fields.tokenId
    this.newPrice = fields.newPrice
  }

  static reified(): UpdateTokenPriceEventReified {
    const reifiedBcs = UpdateTokenPriceEvent.bcs
    return {
      typeName: UpdateTokenPriceEvent.$typeName,
      fullTypeName: composeSuiType(
        UpdateTokenPriceEvent.$typeName,
        ...[]
      ) as `0xb::treasury::UpdateTokenPriceEvent`,
      typeArgs: [] as [],
      isPhantom: UpdateTokenPriceEvent.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => UpdateTokenPriceEvent.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        UpdateTokenPriceEvent.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => UpdateTokenPriceEvent.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => UpdateTokenPriceEvent.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => UpdateTokenPriceEvent.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) =>
        UpdateTokenPriceEvent.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) =>
        UpdateTokenPriceEvent.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => UpdateTokenPriceEvent.fetch(client, id),
      new: (fields: UpdateTokenPriceEventFields) => {
        return new UpdateTokenPriceEvent([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return UpdateTokenPriceEvent.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<UpdateTokenPriceEvent>> {
    return phantom(UpdateTokenPriceEvent.reified())
  }

  static get p() {
    return UpdateTokenPriceEvent.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('UpdateTokenPriceEvent', {
      token_id: bcs.u8(),
      new_price: bcs.u64(),
    })
  }

  private static cachedBcs: ReturnType<typeof UpdateTokenPriceEvent.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof UpdateTokenPriceEvent.instantiateBcs> {
    if (!UpdateTokenPriceEvent.cachedBcs) {
      UpdateTokenPriceEvent.cachedBcs = UpdateTokenPriceEvent.instantiateBcs()
    }
    return UpdateTokenPriceEvent.cachedBcs
  }

  static fromFields(fields: Record<string, any>): UpdateTokenPriceEvent {
    return UpdateTokenPriceEvent.reified().new({
      tokenId: decodeFromFields('u8', fields.token_id),
      newPrice: decodeFromFields('u64', fields.new_price),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): UpdateTokenPriceEvent {
    if (!isUpdateTokenPriceEvent(item.type)) {
      throw new Error('not a UpdateTokenPriceEvent type')
    }

    return UpdateTokenPriceEvent.reified().new({
      tokenId: decodeFromFieldsWithTypes('u8', item.fields.token_id),
      newPrice: decodeFromFieldsWithTypes('u64', item.fields.new_price),
    })
  }

  static fromBcs(data: Uint8Array): UpdateTokenPriceEvent {
    return UpdateTokenPriceEvent.fromFields(UpdateTokenPriceEvent.bcs.parse(data))
  }

  toJSONField() {
    return {
      tokenId: this.tokenId,
      newPrice: this.newPrice.toString(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): UpdateTokenPriceEvent {
    return UpdateTokenPriceEvent.reified().new({
      tokenId: decodeFromJSONField('u8', field.tokenId),
      newPrice: decodeFromJSONField('u64', field.newPrice),
    })
  }

  static fromJSON(json: Record<string, any>): UpdateTokenPriceEvent {
    if (json.$typeName !== UpdateTokenPriceEvent.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return UpdateTokenPriceEvent.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): UpdateTokenPriceEvent {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isUpdateTokenPriceEvent(content.type)) {
      throw new Error(
        `object at ${(content.fields as any).id} is not a UpdateTokenPriceEvent object`
      )
    }
    return UpdateTokenPriceEvent.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): UpdateTokenPriceEvent {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isUpdateTokenPriceEvent(data.bcs.type)) {
        throw new Error(`object at is not a UpdateTokenPriceEvent object`)
      }

      return UpdateTokenPriceEvent.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return UpdateTokenPriceEvent.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<UpdateTokenPriceEvent> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching UpdateTokenPriceEvent object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isUpdateTokenPriceEvent(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a UpdateTokenPriceEvent object`)
    }

    return UpdateTokenPriceEvent.fromSuiObjectData(res.data)
  }
}

/* ============================== NewTokenEvent =============================== */

export function isNewTokenEvent(type: string): boolean {
  type = compressSuiType(type)
  return type === `0xb::treasury::NewTokenEvent`
}

export interface NewTokenEventFields {
  tokenId: ToField<'u8'>
  typeName: ToField<TypeName>
  nativeToken: ToField<'bool'>
  decimalMultiplier: ToField<'u64'>
  notionalValue: ToField<'u64'>
}

export type NewTokenEventReified = Reified<NewTokenEvent, NewTokenEventFields>

export class NewTokenEvent implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0xb::treasury::NewTokenEvent`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = NewTokenEvent.$typeName
  readonly $fullTypeName: `0xb::treasury::NewTokenEvent`
  readonly $typeArgs: []
  readonly $isPhantom = NewTokenEvent.$isPhantom

  readonly tokenId: ToField<'u8'>
  readonly typeName: ToField<TypeName>
  readonly nativeToken: ToField<'bool'>
  readonly decimalMultiplier: ToField<'u64'>
  readonly notionalValue: ToField<'u64'>

  private constructor(typeArgs: [], fields: NewTokenEventFields) {
    this.$fullTypeName = composeSuiType(
      NewTokenEvent.$typeName,
      ...typeArgs
    ) as `0xb::treasury::NewTokenEvent`
    this.$typeArgs = typeArgs

    this.tokenId = fields.tokenId
    this.typeName = fields.typeName
    this.nativeToken = fields.nativeToken
    this.decimalMultiplier = fields.decimalMultiplier
    this.notionalValue = fields.notionalValue
  }

  static reified(): NewTokenEventReified {
    const reifiedBcs = NewTokenEvent.bcs
    return {
      typeName: NewTokenEvent.$typeName,
      fullTypeName: composeSuiType(
        NewTokenEvent.$typeName,
        ...[]
      ) as `0xb::treasury::NewTokenEvent`,
      typeArgs: [] as [],
      isPhantom: NewTokenEvent.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => NewTokenEvent.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => NewTokenEvent.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => NewTokenEvent.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => NewTokenEvent.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => NewTokenEvent.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => NewTokenEvent.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => NewTokenEvent.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => NewTokenEvent.fetch(client, id),
      new: (fields: NewTokenEventFields) => {
        return new NewTokenEvent([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return NewTokenEvent.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<NewTokenEvent>> {
    return phantom(NewTokenEvent.reified())
  }

  static get p() {
    return NewTokenEvent.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('NewTokenEvent', {
      token_id: bcs.u8(),
      type_name: TypeName.bcs,
      native_token: bcs.bool(),
      decimal_multiplier: bcs.u64(),
      notional_value: bcs.u64(),
    })
  }

  private static cachedBcs: ReturnType<typeof NewTokenEvent.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof NewTokenEvent.instantiateBcs> {
    if (!NewTokenEvent.cachedBcs) {
      NewTokenEvent.cachedBcs = NewTokenEvent.instantiateBcs()
    }
    return NewTokenEvent.cachedBcs
  }

  static fromFields(fields: Record<string, any>): NewTokenEvent {
    return NewTokenEvent.reified().new({
      tokenId: decodeFromFields('u8', fields.token_id),
      typeName: decodeFromFields(TypeName.reified(), fields.type_name),
      nativeToken: decodeFromFields('bool', fields.native_token),
      decimalMultiplier: decodeFromFields('u64', fields.decimal_multiplier),
      notionalValue: decodeFromFields('u64', fields.notional_value),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): NewTokenEvent {
    if (!isNewTokenEvent(item.type)) {
      throw new Error('not a NewTokenEvent type')
    }

    return NewTokenEvent.reified().new({
      tokenId: decodeFromFieldsWithTypes('u8', item.fields.token_id),
      typeName: decodeFromFieldsWithTypes(TypeName.reified(), item.fields.type_name),
      nativeToken: decodeFromFieldsWithTypes('bool', item.fields.native_token),
      decimalMultiplier: decodeFromFieldsWithTypes('u64', item.fields.decimal_multiplier),
      notionalValue: decodeFromFieldsWithTypes('u64', item.fields.notional_value),
    })
  }

  static fromBcs(data: Uint8Array): NewTokenEvent {
    return NewTokenEvent.fromFields(NewTokenEvent.bcs.parse(data))
  }

  toJSONField() {
    return {
      tokenId: this.tokenId,
      typeName: this.typeName.toJSONField(),
      nativeToken: this.nativeToken,
      decimalMultiplier: this.decimalMultiplier.toString(),
      notionalValue: this.notionalValue.toString(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): NewTokenEvent {
    return NewTokenEvent.reified().new({
      tokenId: decodeFromJSONField('u8', field.tokenId),
      typeName: decodeFromJSONField(TypeName.reified(), field.typeName),
      nativeToken: decodeFromJSONField('bool', field.nativeToken),
      decimalMultiplier: decodeFromJSONField('u64', field.decimalMultiplier),
      notionalValue: decodeFromJSONField('u64', field.notionalValue),
    })
  }

  static fromJSON(json: Record<string, any>): NewTokenEvent {
    if (json.$typeName !== NewTokenEvent.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return NewTokenEvent.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): NewTokenEvent {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isNewTokenEvent(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a NewTokenEvent object`)
    }
    return NewTokenEvent.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): NewTokenEvent {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isNewTokenEvent(data.bcs.type)) {
        throw new Error(`object at is not a NewTokenEvent object`)
      }

      return NewTokenEvent.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return NewTokenEvent.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<NewTokenEvent> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching NewTokenEvent object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isNewTokenEvent(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a NewTokenEvent object`)
    }

    return NewTokenEvent.fromSuiObjectData(res.data)
  }
}

/* ============================== TokenRegistrationEvent =============================== */

export function isTokenRegistrationEvent(type: string): boolean {
  type = compressSuiType(type)
  return type === `0xb::treasury::TokenRegistrationEvent`
}

export interface TokenRegistrationEventFields {
  typeName: ToField<TypeName>
  decimal: ToField<'u8'>
  nativeToken: ToField<'bool'>
}

export type TokenRegistrationEventReified = Reified<
  TokenRegistrationEvent,
  TokenRegistrationEventFields
>

export class TokenRegistrationEvent implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0xb::treasury::TokenRegistrationEvent`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = TokenRegistrationEvent.$typeName
  readonly $fullTypeName: `0xb::treasury::TokenRegistrationEvent`
  readonly $typeArgs: []
  readonly $isPhantom = TokenRegistrationEvent.$isPhantom

  readonly typeName: ToField<TypeName>
  readonly decimal: ToField<'u8'>
  readonly nativeToken: ToField<'bool'>

  private constructor(typeArgs: [], fields: TokenRegistrationEventFields) {
    this.$fullTypeName = composeSuiType(
      TokenRegistrationEvent.$typeName,
      ...typeArgs
    ) as `0xb::treasury::TokenRegistrationEvent`
    this.$typeArgs = typeArgs

    this.typeName = fields.typeName
    this.decimal = fields.decimal
    this.nativeToken = fields.nativeToken
  }

  static reified(): TokenRegistrationEventReified {
    const reifiedBcs = TokenRegistrationEvent.bcs
    return {
      typeName: TokenRegistrationEvent.$typeName,
      fullTypeName: composeSuiType(
        TokenRegistrationEvent.$typeName,
        ...[]
      ) as `0xb::treasury::TokenRegistrationEvent`,
      typeArgs: [] as [],
      isPhantom: TokenRegistrationEvent.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => TokenRegistrationEvent.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        TokenRegistrationEvent.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => TokenRegistrationEvent.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => TokenRegistrationEvent.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => TokenRegistrationEvent.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) =>
        TokenRegistrationEvent.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) =>
        TokenRegistrationEvent.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => TokenRegistrationEvent.fetch(client, id),
      new: (fields: TokenRegistrationEventFields) => {
        return new TokenRegistrationEvent([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return TokenRegistrationEvent.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<TokenRegistrationEvent>> {
    return phantom(TokenRegistrationEvent.reified())
  }

  static get p() {
    return TokenRegistrationEvent.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('TokenRegistrationEvent', {
      type_name: TypeName.bcs,
      decimal: bcs.u8(),
      native_token: bcs.bool(),
    })
  }

  private static cachedBcs: ReturnType<typeof TokenRegistrationEvent.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof TokenRegistrationEvent.instantiateBcs> {
    if (!TokenRegistrationEvent.cachedBcs) {
      TokenRegistrationEvent.cachedBcs = TokenRegistrationEvent.instantiateBcs()
    }
    return TokenRegistrationEvent.cachedBcs
  }

  static fromFields(fields: Record<string, any>): TokenRegistrationEvent {
    return TokenRegistrationEvent.reified().new({
      typeName: decodeFromFields(TypeName.reified(), fields.type_name),
      decimal: decodeFromFields('u8', fields.decimal),
      nativeToken: decodeFromFields('bool', fields.native_token),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): TokenRegistrationEvent {
    if (!isTokenRegistrationEvent(item.type)) {
      throw new Error('not a TokenRegistrationEvent type')
    }

    return TokenRegistrationEvent.reified().new({
      typeName: decodeFromFieldsWithTypes(TypeName.reified(), item.fields.type_name),
      decimal: decodeFromFieldsWithTypes('u8', item.fields.decimal),
      nativeToken: decodeFromFieldsWithTypes('bool', item.fields.native_token),
    })
  }

  static fromBcs(data: Uint8Array): TokenRegistrationEvent {
    return TokenRegistrationEvent.fromFields(TokenRegistrationEvent.bcs.parse(data))
  }

  toJSONField() {
    return {
      typeName: this.typeName.toJSONField(),
      decimal: this.decimal,
      nativeToken: this.nativeToken,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): TokenRegistrationEvent {
    return TokenRegistrationEvent.reified().new({
      typeName: decodeFromJSONField(TypeName.reified(), field.typeName),
      decimal: decodeFromJSONField('u8', field.decimal),
      nativeToken: decodeFromJSONField('bool', field.nativeToken),
    })
  }

  static fromJSON(json: Record<string, any>): TokenRegistrationEvent {
    if (json.$typeName !== TokenRegistrationEvent.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return TokenRegistrationEvent.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): TokenRegistrationEvent {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isTokenRegistrationEvent(content.type)) {
      throw new Error(
        `object at ${(content.fields as any).id} is not a TokenRegistrationEvent object`
      )
    }
    return TokenRegistrationEvent.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): TokenRegistrationEvent {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isTokenRegistrationEvent(data.bcs.type)) {
        throw new Error(`object at is not a TokenRegistrationEvent object`)
      }

      return TokenRegistrationEvent.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return TokenRegistrationEvent.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<TokenRegistrationEvent> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching TokenRegistrationEvent object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isTokenRegistrationEvent(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a TokenRegistrationEvent object`)
    }

    return TokenRegistrationEvent.fromSuiObjectData(res.data)
  }
}
