import {
  PhantomTypeArgument,
  Reified,
  ReifiedPhantomTypeArgument,
  ToField,
  ToPhantomTypeArgument,
  ToTypeStr,
  assertFieldsWithTypesArgsMatch,
  assertReifiedTypeArgsMatch,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  extractType,
  ToTypeStr as ToPhantom,
} from '../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../_framework/util'
import { Balance } from '../balance/structs'
import { ID, UID } from '../object/structs'
import { SUI } from '../sui/structs'
import { bcs, fromHEX, toHEX } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== Borrow =============================== */

export function isBorrow(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x2::kiosk::Borrow'
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface BorrowFields {
  kioskId: ToField<ID>
  itemId: ToField<ID>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Borrow {
  static readonly $typeName = '0x2::kiosk::Borrow'
  static readonly $numTypeParams = 0

  readonly $fullTypeName = null as unknown as '0x2::kiosk::Borrow'

  readonly $typeName = Borrow.$typeName

  static get bcs() {
    return bcs.struct('Borrow', {
      kiosk_id: ID.bcs,
      item_id: ID.bcs,
    })
  }

  readonly kioskId: ToField<ID>
  readonly itemId: ToField<ID>

  private constructor(fields: BorrowFields) {
    this.kioskId = fields.kioskId
    this.itemId = fields.itemId
  }

  static new(fields: BorrowFields): Borrow {
    return new Borrow(fields)
  }

  static reified(): Reified<Borrow> {
    return {
      typeName: Borrow.$typeName,
      fullTypeName: composeSuiType(Borrow.$typeName, ...[]) as '0x2::kiosk::Borrow',
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => Borrow.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Borrow.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => Borrow.fromBcs(data),
      bcs: Borrow.bcs,
      fromJSONField: (field: any) => Borrow.fromJSONField(field),
      fetch: async (client: SuiClient, id: string) => Borrow.fetch(client, id),
      kind: 'StructClassReified',
    }
  }

  static fromFields(fields: Record<string, any>): Borrow {
    return Borrow.new({
      kioskId: decodeFromFields(ID.reified(), fields.kiosk_id),
      itemId: decodeFromFields(ID.reified(), fields.item_id),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Borrow {
    if (!isBorrow(item.type)) {
      throw new Error('not a Borrow type')
    }

    return Borrow.new({
      kioskId: decodeFromFieldsWithTypes(ID.reified(), item.fields.kiosk_id),
      itemId: decodeFromFieldsWithTypes(ID.reified(), item.fields.item_id),
    })
  }

  static fromBcs(data: Uint8Array): Borrow {
    return Borrow.fromFields(Borrow.bcs.parse(data))
  }

  toJSONField() {
    return {
      kioskId: this.kioskId,
      itemId: this.itemId,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, ...this.toJSONField() }
  }

  static fromJSONField(field: any): Borrow {
    return Borrow.new({
      kioskId: decodeFromJSONField(ID.reified(), field.kioskId),
      itemId: decodeFromJSONField(ID.reified(), field.itemId),
    })
  }

  static fromJSON(json: Record<string, any>): Borrow {
    if (json.$typeName !== Borrow.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return Borrow.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): Borrow {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isBorrow(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Borrow object`)
    }
    return Borrow.fromFieldsWithTypes(content)
  }

  static async fetch(client: SuiClient, id: string): Promise<Borrow> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching Borrow object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isBorrow(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a Borrow object`)
    }
    return Borrow.fromFieldsWithTypes(res.data.content)
  }
}

/* ============================== Kiosk =============================== */

export function isKiosk(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x2::kiosk::Kiosk'
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface KioskFields {
  id: ToField<UID>
  profits: ToField<Balance<ToPhantom<SUI>>>
  owner: ToField<'address'>
  itemCount: ToField<'u32'>
  allowExtensions: ToField<'bool'>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Kiosk {
  static readonly $typeName = '0x2::kiosk::Kiosk'
  static readonly $numTypeParams = 0

  readonly $fullTypeName = null as unknown as '0x2::kiosk::Kiosk'

  readonly $typeName = Kiosk.$typeName

  static get bcs() {
    return bcs.struct('Kiosk', {
      id: UID.bcs,
      profits: Balance.bcs,
      owner: bcs.bytes(32).transform({
        input: (val: string) => fromHEX(val),
        output: (val: Uint8Array) => toHEX(val),
      }),
      item_count: bcs.u32(),
      allow_extensions: bcs.bool(),
    })
  }

  readonly id: ToField<UID>
  readonly profits: ToField<Balance<ToPhantom<SUI>>>
  readonly owner: ToField<'address'>
  readonly itemCount: ToField<'u32'>
  readonly allowExtensions: ToField<'bool'>

  private constructor(fields: KioskFields) {
    this.id = fields.id
    this.profits = fields.profits
    this.owner = fields.owner
    this.itemCount = fields.itemCount
    this.allowExtensions = fields.allowExtensions
  }

  static new(fields: KioskFields): Kiosk {
    return new Kiosk(fields)
  }

  static reified(): Reified<Kiosk> {
    return {
      typeName: Kiosk.$typeName,
      fullTypeName: composeSuiType(Kiosk.$typeName, ...[]) as '0x2::kiosk::Kiosk',
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => Kiosk.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Kiosk.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => Kiosk.fromBcs(data),
      bcs: Kiosk.bcs,
      fromJSONField: (field: any) => Kiosk.fromJSONField(field),
      fetch: async (client: SuiClient, id: string) => Kiosk.fetch(client, id),
      kind: 'StructClassReified',
    }
  }

  static fromFields(fields: Record<string, any>): Kiosk {
    return Kiosk.new({
      id: decodeFromFields(UID.reified(), fields.id),
      profits: decodeFromFields(Balance.reified(SUI.reified()), fields.profits),
      owner: decodeFromFields('address', fields.owner),
      itemCount: decodeFromFields('u32', fields.item_count),
      allowExtensions: decodeFromFields('bool', fields.allow_extensions),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Kiosk {
    if (!isKiosk(item.type)) {
      throw new Error('not a Kiosk type')
    }

    return Kiosk.new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      profits: decodeFromFieldsWithTypes(Balance.reified(SUI.reified()), item.fields.profits),
      owner: decodeFromFieldsWithTypes('address', item.fields.owner),
      itemCount: decodeFromFieldsWithTypes('u32', item.fields.item_count),
      allowExtensions: decodeFromFieldsWithTypes('bool', item.fields.allow_extensions),
    })
  }

  static fromBcs(data: Uint8Array): Kiosk {
    return Kiosk.fromFields(Kiosk.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
      profits: this.profits.toJSONField(),
      owner: this.owner,
      itemCount: this.itemCount,
      allowExtensions: this.allowExtensions,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, ...this.toJSONField() }
  }

  static fromJSONField(field: any): Kiosk {
    return Kiosk.new({
      id: decodeFromJSONField(UID.reified(), field.id),
      profits: decodeFromJSONField(Balance.reified(SUI.reified()), field.profits),
      owner: decodeFromJSONField('address', field.owner),
      itemCount: decodeFromJSONField('u32', field.itemCount),
      allowExtensions: decodeFromJSONField('bool', field.allowExtensions),
    })
  }

  static fromJSON(json: Record<string, any>): Kiosk {
    if (json.$typeName !== Kiosk.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return Kiosk.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): Kiosk {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isKiosk(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Kiosk object`)
    }
    return Kiosk.fromFieldsWithTypes(content)
  }

  static async fetch(client: SuiClient, id: string): Promise<Kiosk> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching Kiosk object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isKiosk(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a Kiosk object`)
    }
    return Kiosk.fromFieldsWithTypes(res.data.content)
  }
}

/* ============================== KioskOwnerCap =============================== */

export function isKioskOwnerCap(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x2::kiosk::KioskOwnerCap'
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface KioskOwnerCapFields {
  id: ToField<UID>
  for: ToField<ID>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class KioskOwnerCap {
  static readonly $typeName = '0x2::kiosk::KioskOwnerCap'
  static readonly $numTypeParams = 0

  readonly $fullTypeName = null as unknown as '0x2::kiosk::KioskOwnerCap'

  readonly $typeName = KioskOwnerCap.$typeName

  static get bcs() {
    return bcs.struct('KioskOwnerCap', {
      id: UID.bcs,
      for: ID.bcs,
    })
  }

  readonly id: ToField<UID>
  readonly for: ToField<ID>

  private constructor(fields: KioskOwnerCapFields) {
    this.id = fields.id
    this.for = fields.for
  }

  static new(fields: KioskOwnerCapFields): KioskOwnerCap {
    return new KioskOwnerCap(fields)
  }

  static reified(): Reified<KioskOwnerCap> {
    return {
      typeName: KioskOwnerCap.$typeName,
      fullTypeName: composeSuiType(KioskOwnerCap.$typeName, ...[]) as '0x2::kiosk::KioskOwnerCap',
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => KioskOwnerCap.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => KioskOwnerCap.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => KioskOwnerCap.fromBcs(data),
      bcs: KioskOwnerCap.bcs,
      fromJSONField: (field: any) => KioskOwnerCap.fromJSONField(field),
      fetch: async (client: SuiClient, id: string) => KioskOwnerCap.fetch(client, id),
      kind: 'StructClassReified',
    }
  }

  static fromFields(fields: Record<string, any>): KioskOwnerCap {
    return KioskOwnerCap.new({
      id: decodeFromFields(UID.reified(), fields.id),
      for: decodeFromFields(ID.reified(), fields.for),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): KioskOwnerCap {
    if (!isKioskOwnerCap(item.type)) {
      throw new Error('not a KioskOwnerCap type')
    }

    return KioskOwnerCap.new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      for: decodeFromFieldsWithTypes(ID.reified(), item.fields.for),
    })
  }

  static fromBcs(data: Uint8Array): KioskOwnerCap {
    return KioskOwnerCap.fromFields(KioskOwnerCap.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
      for: this.for,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, ...this.toJSONField() }
  }

  static fromJSONField(field: any): KioskOwnerCap {
    return KioskOwnerCap.new({
      id: decodeFromJSONField(UID.reified(), field.id),
      for: decodeFromJSONField(ID.reified(), field.for),
    })
  }

  static fromJSON(json: Record<string, any>): KioskOwnerCap {
    if (json.$typeName !== KioskOwnerCap.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return KioskOwnerCap.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): KioskOwnerCap {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isKioskOwnerCap(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a KioskOwnerCap object`)
    }
    return KioskOwnerCap.fromFieldsWithTypes(content)
  }

  static async fetch(client: SuiClient, id: string): Promise<KioskOwnerCap> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching KioskOwnerCap object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isKioskOwnerCap(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a KioskOwnerCap object`)
    }
    return KioskOwnerCap.fromFieldsWithTypes(res.data.content)
  }
}

/* ============================== PurchaseCap =============================== */

export function isPurchaseCap(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::kiosk::PurchaseCap<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface PurchaseCapFields<T0 extends PhantomTypeArgument> {
  id: ToField<UID>
  kioskId: ToField<ID>
  itemId: ToField<ID>
  minPrice: ToField<'u64'>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class PurchaseCap<T0 extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::kiosk::PurchaseCap'
  static readonly $numTypeParams = 1

  readonly $fullTypeName = null as unknown as `0x2::kiosk::PurchaseCap<${ToTypeStr<T0>}>`

  readonly $typeName = PurchaseCap.$typeName

  static get bcs() {
    return bcs.struct('PurchaseCap', {
      id: UID.bcs,
      kiosk_id: ID.bcs,
      item_id: ID.bcs,
      min_price: bcs.u64(),
    })
  }

  readonly $typeArg: string

  readonly id: ToField<UID>
  readonly kioskId: ToField<ID>
  readonly itemId: ToField<ID>
  readonly minPrice: ToField<'u64'>

  private constructor(typeArg: string, fields: PurchaseCapFields<T0>) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.kioskId = fields.kioskId
    this.itemId = fields.itemId
    this.minPrice = fields.minPrice
  }

  static new<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    fields: PurchaseCapFields<ToPhantomTypeArgument<T0>>
  ): PurchaseCap<ToPhantomTypeArgument<T0>> {
    return new PurchaseCap(extractType(typeArg), fields)
  }

  static reified<T0 extends ReifiedPhantomTypeArgument>(
    T0: T0
  ): Reified<PurchaseCap<ToPhantomTypeArgument<T0>>> {
    return {
      typeName: PurchaseCap.$typeName,
      fullTypeName: composeSuiType(
        PurchaseCap.$typeName,
        ...[extractType(T0)]
      ) as `0x2::kiosk::PurchaseCap<${ToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [T0],
      fromFields: (fields: Record<string, any>) => PurchaseCap.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => PurchaseCap.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => PurchaseCap.fromBcs(T0, data),
      bcs: PurchaseCap.bcs,
      fromJSONField: (field: any) => PurchaseCap.fromJSONField(T0, field),
      fetch: async (client: SuiClient, id: string) => PurchaseCap.fetch(client, T0, id),
      kind: 'StructClassReified',
    }
  }

  static fromFields<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    fields: Record<string, any>
  ): PurchaseCap<ToPhantomTypeArgument<T0>> {
    return PurchaseCap.new(typeArg, {
      id: decodeFromFields(UID.reified(), fields.id),
      kioskId: decodeFromFields(ID.reified(), fields.kiosk_id),
      itemId: decodeFromFields(ID.reified(), fields.item_id),
      minPrice: decodeFromFields('u64', fields.min_price),
    })
  }

  static fromFieldsWithTypes<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    item: FieldsWithTypes
  ): PurchaseCap<ToPhantomTypeArgument<T0>> {
    if (!isPurchaseCap(item.type)) {
      throw new Error('not a PurchaseCap type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return PurchaseCap.new(typeArg, {
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      kioskId: decodeFromFieldsWithTypes(ID.reified(), item.fields.kiosk_id),
      itemId: decodeFromFieldsWithTypes(ID.reified(), item.fields.item_id),
      minPrice: decodeFromFieldsWithTypes('u64', item.fields.min_price),
    })
  }

  static fromBcs<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    data: Uint8Array
  ): PurchaseCap<ToPhantomTypeArgument<T0>> {
    return PurchaseCap.fromFields(typeArg, PurchaseCap.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
      kioskId: this.kioskId,
      itemId: this.itemId,
      minPrice: this.minPrice.toString(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArg: this.$typeArg, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    field: any
  ): PurchaseCap<ToPhantomTypeArgument<T0>> {
    return PurchaseCap.new(typeArg, {
      id: decodeFromJSONField(UID.reified(), field.id),
      kioskId: decodeFromJSONField(ID.reified(), field.kioskId),
      itemId: decodeFromJSONField(ID.reified(), field.itemId),
      minPrice: decodeFromJSONField('u64', field.minPrice),
    })
  }

  static fromJSON<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    json: Record<string, any>
  ): PurchaseCap<ToPhantomTypeArgument<T0>> {
    if (json.$typeName !== PurchaseCap.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(PurchaseCap.$typeName, extractType(typeArg)),
      [json.$typeArg],
      [typeArg]
    )

    return PurchaseCap.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    content: SuiParsedData
  ): PurchaseCap<ToPhantomTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isPurchaseCap(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a PurchaseCap object`)
    }
    return PurchaseCap.fromFieldsWithTypes(typeArg, content)
  }

  static async fetch<T0 extends ReifiedPhantomTypeArgument>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<PurchaseCap<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching PurchaseCap object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isPurchaseCap(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a PurchaseCap object`)
    }
    return PurchaseCap.fromFieldsWithTypes(typeArg, res.data.content)
  }
}

/* ============================== Item =============================== */

export function isItem(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x2::kiosk::Item'
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface ItemFields {
  id: ToField<ID>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Item {
  static readonly $typeName = '0x2::kiosk::Item'
  static readonly $numTypeParams = 0

  readonly $fullTypeName = null as unknown as '0x2::kiosk::Item'

  readonly $typeName = Item.$typeName

  static get bcs() {
    return bcs.struct('Item', {
      id: ID.bcs,
    })
  }

  readonly id: ToField<ID>

  private constructor(id: ToField<ID>) {
    this.id = id
  }

  static new(id: ToField<ID>): Item {
    return new Item(id)
  }

  static reified(): Reified<Item> {
    return {
      typeName: Item.$typeName,
      fullTypeName: composeSuiType(Item.$typeName, ...[]) as '0x2::kiosk::Item',
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => Item.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Item.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => Item.fromBcs(data),
      bcs: Item.bcs,
      fromJSONField: (field: any) => Item.fromJSONField(field),
      fetch: async (client: SuiClient, id: string) => Item.fetch(client, id),
      kind: 'StructClassReified',
    }
  }

  static fromFields(fields: Record<string, any>): Item {
    return Item.new(decodeFromFields(ID.reified(), fields.id))
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Item {
    if (!isItem(item.type)) {
      throw new Error('not a Item type')
    }

    return Item.new(decodeFromFieldsWithTypes(ID.reified(), item.fields.id))
  }

  static fromBcs(data: Uint8Array): Item {
    return Item.fromFields(Item.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, ...this.toJSONField() }
  }

  static fromJSONField(field: any): Item {
    return Item.new(decodeFromJSONField(ID.reified(), field.id))
  }

  static fromJSON(json: Record<string, any>): Item {
    if (json.$typeName !== Item.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return Item.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): Item {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isItem(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Item object`)
    }
    return Item.fromFieldsWithTypes(content)
  }

  static async fetch(client: SuiClient, id: string): Promise<Item> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching Item object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isItem(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a Item object`)
    }
    return Item.fromFieldsWithTypes(res.data.content)
  }
}

/* ============================== Listing =============================== */

export function isListing(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x2::kiosk::Listing'
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface ListingFields {
  id: ToField<ID>
  isExclusive: ToField<'bool'>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Listing {
  static readonly $typeName = '0x2::kiosk::Listing'
  static readonly $numTypeParams = 0

  readonly $fullTypeName = null as unknown as '0x2::kiosk::Listing'

  readonly $typeName = Listing.$typeName

  static get bcs() {
    return bcs.struct('Listing', {
      id: ID.bcs,
      is_exclusive: bcs.bool(),
    })
  }

  readonly id: ToField<ID>
  readonly isExclusive: ToField<'bool'>

  private constructor(fields: ListingFields) {
    this.id = fields.id
    this.isExclusive = fields.isExclusive
  }

  static new(fields: ListingFields): Listing {
    return new Listing(fields)
  }

  static reified(): Reified<Listing> {
    return {
      typeName: Listing.$typeName,
      fullTypeName: composeSuiType(Listing.$typeName, ...[]) as '0x2::kiosk::Listing',
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => Listing.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Listing.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => Listing.fromBcs(data),
      bcs: Listing.bcs,
      fromJSONField: (field: any) => Listing.fromJSONField(field),
      fetch: async (client: SuiClient, id: string) => Listing.fetch(client, id),
      kind: 'StructClassReified',
    }
  }

  static fromFields(fields: Record<string, any>): Listing {
    return Listing.new({
      id: decodeFromFields(ID.reified(), fields.id),
      isExclusive: decodeFromFields('bool', fields.is_exclusive),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Listing {
    if (!isListing(item.type)) {
      throw new Error('not a Listing type')
    }

    return Listing.new({
      id: decodeFromFieldsWithTypes(ID.reified(), item.fields.id),
      isExclusive: decodeFromFieldsWithTypes('bool', item.fields.is_exclusive),
    })
  }

  static fromBcs(data: Uint8Array): Listing {
    return Listing.fromFields(Listing.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
      isExclusive: this.isExclusive,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, ...this.toJSONField() }
  }

  static fromJSONField(field: any): Listing {
    return Listing.new({
      id: decodeFromJSONField(ID.reified(), field.id),
      isExclusive: decodeFromJSONField('bool', field.isExclusive),
    })
  }

  static fromJSON(json: Record<string, any>): Listing {
    if (json.$typeName !== Listing.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return Listing.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): Listing {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isListing(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Listing object`)
    }
    return Listing.fromFieldsWithTypes(content)
  }

  static async fetch(client: SuiClient, id: string): Promise<Listing> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching Listing object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isListing(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a Listing object`)
    }
    return Listing.fromFieldsWithTypes(res.data.content)
  }
}

/* ============================== Lock =============================== */

export function isLock(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x2::kiosk::Lock'
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface LockFields {
  id: ToField<ID>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Lock {
  static readonly $typeName = '0x2::kiosk::Lock'
  static readonly $numTypeParams = 0

  readonly $fullTypeName = null as unknown as '0x2::kiosk::Lock'

  readonly $typeName = Lock.$typeName

  static get bcs() {
    return bcs.struct('Lock', {
      id: ID.bcs,
    })
  }

  readonly id: ToField<ID>

  private constructor(id: ToField<ID>) {
    this.id = id
  }

  static new(id: ToField<ID>): Lock {
    return new Lock(id)
  }

  static reified(): Reified<Lock> {
    return {
      typeName: Lock.$typeName,
      fullTypeName: composeSuiType(Lock.$typeName, ...[]) as '0x2::kiosk::Lock',
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => Lock.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Lock.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => Lock.fromBcs(data),
      bcs: Lock.bcs,
      fromJSONField: (field: any) => Lock.fromJSONField(field),
      fetch: async (client: SuiClient, id: string) => Lock.fetch(client, id),
      kind: 'StructClassReified',
    }
  }

  static fromFields(fields: Record<string, any>): Lock {
    return Lock.new(decodeFromFields(ID.reified(), fields.id))
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Lock {
    if (!isLock(item.type)) {
      throw new Error('not a Lock type')
    }

    return Lock.new(decodeFromFieldsWithTypes(ID.reified(), item.fields.id))
  }

  static fromBcs(data: Uint8Array): Lock {
    return Lock.fromFields(Lock.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, ...this.toJSONField() }
  }

  static fromJSONField(field: any): Lock {
    return Lock.new(decodeFromJSONField(ID.reified(), field.id))
  }

  static fromJSON(json: Record<string, any>): Lock {
    if (json.$typeName !== Lock.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return Lock.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): Lock {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isLock(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Lock object`)
    }
    return Lock.fromFieldsWithTypes(content)
  }

  static async fetch(client: SuiClient, id: string): Promise<Lock> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching Lock object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isLock(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a Lock object`)
    }
    return Lock.fromFieldsWithTypes(res.data.content)
  }
}

/* ============================== ItemListed =============================== */

export function isItemListed(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::kiosk::ItemListed<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface ItemListedFields<T0 extends PhantomTypeArgument> {
  kiosk: ToField<ID>
  id: ToField<ID>
  price: ToField<'u64'>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class ItemListed<T0 extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::kiosk::ItemListed'
  static readonly $numTypeParams = 1

  readonly $fullTypeName = null as unknown as `0x2::kiosk::ItemListed<${ToTypeStr<T0>}>`

  readonly $typeName = ItemListed.$typeName

  static get bcs() {
    return bcs.struct('ItemListed', {
      kiosk: ID.bcs,
      id: ID.bcs,
      price: bcs.u64(),
    })
  }

  readonly $typeArg: string

  readonly kiosk: ToField<ID>
  readonly id: ToField<ID>
  readonly price: ToField<'u64'>

  private constructor(typeArg: string, fields: ItemListedFields<T0>) {
    this.$typeArg = typeArg

    this.kiosk = fields.kiosk
    this.id = fields.id
    this.price = fields.price
  }

  static new<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    fields: ItemListedFields<ToPhantomTypeArgument<T0>>
  ): ItemListed<ToPhantomTypeArgument<T0>> {
    return new ItemListed(extractType(typeArg), fields)
  }

  static reified<T0 extends ReifiedPhantomTypeArgument>(
    T0: T0
  ): Reified<ItemListed<ToPhantomTypeArgument<T0>>> {
    return {
      typeName: ItemListed.$typeName,
      fullTypeName: composeSuiType(
        ItemListed.$typeName,
        ...[extractType(T0)]
      ) as `0x2::kiosk::ItemListed<${ToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [T0],
      fromFields: (fields: Record<string, any>) => ItemListed.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => ItemListed.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => ItemListed.fromBcs(T0, data),
      bcs: ItemListed.bcs,
      fromJSONField: (field: any) => ItemListed.fromJSONField(T0, field),
      fetch: async (client: SuiClient, id: string) => ItemListed.fetch(client, T0, id),
      kind: 'StructClassReified',
    }
  }

  static fromFields<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    fields: Record<string, any>
  ): ItemListed<ToPhantomTypeArgument<T0>> {
    return ItemListed.new(typeArg, {
      kiosk: decodeFromFields(ID.reified(), fields.kiosk),
      id: decodeFromFields(ID.reified(), fields.id),
      price: decodeFromFields('u64', fields.price),
    })
  }

  static fromFieldsWithTypes<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    item: FieldsWithTypes
  ): ItemListed<ToPhantomTypeArgument<T0>> {
    if (!isItemListed(item.type)) {
      throw new Error('not a ItemListed type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return ItemListed.new(typeArg, {
      kiosk: decodeFromFieldsWithTypes(ID.reified(), item.fields.kiosk),
      id: decodeFromFieldsWithTypes(ID.reified(), item.fields.id),
      price: decodeFromFieldsWithTypes('u64', item.fields.price),
    })
  }

  static fromBcs<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    data: Uint8Array
  ): ItemListed<ToPhantomTypeArgument<T0>> {
    return ItemListed.fromFields(typeArg, ItemListed.bcs.parse(data))
  }

  toJSONField() {
    return {
      kiosk: this.kiosk,
      id: this.id,
      price: this.price.toString(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArg: this.$typeArg, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    field: any
  ): ItemListed<ToPhantomTypeArgument<T0>> {
    return ItemListed.new(typeArg, {
      kiosk: decodeFromJSONField(ID.reified(), field.kiosk),
      id: decodeFromJSONField(ID.reified(), field.id),
      price: decodeFromJSONField('u64', field.price),
    })
  }

  static fromJSON<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    json: Record<string, any>
  ): ItemListed<ToPhantomTypeArgument<T0>> {
    if (json.$typeName !== ItemListed.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(ItemListed.$typeName, extractType(typeArg)),
      [json.$typeArg],
      [typeArg]
    )

    return ItemListed.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    content: SuiParsedData
  ): ItemListed<ToPhantomTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isItemListed(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a ItemListed object`)
    }
    return ItemListed.fromFieldsWithTypes(typeArg, content)
  }

  static async fetch<T0 extends ReifiedPhantomTypeArgument>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<ItemListed<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching ItemListed object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isItemListed(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a ItemListed object`)
    }
    return ItemListed.fromFieldsWithTypes(typeArg, res.data.content)
  }
}

/* ============================== ItemPurchased =============================== */

export function isItemPurchased(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::kiosk::ItemPurchased<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface ItemPurchasedFields<T0 extends PhantomTypeArgument> {
  kiosk: ToField<ID>
  id: ToField<ID>
  price: ToField<'u64'>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class ItemPurchased<T0 extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::kiosk::ItemPurchased'
  static readonly $numTypeParams = 1

  readonly $fullTypeName = null as unknown as `0x2::kiosk::ItemPurchased<${ToTypeStr<T0>}>`

  readonly $typeName = ItemPurchased.$typeName

  static get bcs() {
    return bcs.struct('ItemPurchased', {
      kiosk: ID.bcs,
      id: ID.bcs,
      price: bcs.u64(),
    })
  }

  readonly $typeArg: string

  readonly kiosk: ToField<ID>
  readonly id: ToField<ID>
  readonly price: ToField<'u64'>

  private constructor(typeArg: string, fields: ItemPurchasedFields<T0>) {
    this.$typeArg = typeArg

    this.kiosk = fields.kiosk
    this.id = fields.id
    this.price = fields.price
  }

  static new<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    fields: ItemPurchasedFields<ToPhantomTypeArgument<T0>>
  ): ItemPurchased<ToPhantomTypeArgument<T0>> {
    return new ItemPurchased(extractType(typeArg), fields)
  }

  static reified<T0 extends ReifiedPhantomTypeArgument>(
    T0: T0
  ): Reified<ItemPurchased<ToPhantomTypeArgument<T0>>> {
    return {
      typeName: ItemPurchased.$typeName,
      fullTypeName: composeSuiType(
        ItemPurchased.$typeName,
        ...[extractType(T0)]
      ) as `0x2::kiosk::ItemPurchased<${ToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [T0],
      fromFields: (fields: Record<string, any>) => ItemPurchased.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => ItemPurchased.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => ItemPurchased.fromBcs(T0, data),
      bcs: ItemPurchased.bcs,
      fromJSONField: (field: any) => ItemPurchased.fromJSONField(T0, field),
      fetch: async (client: SuiClient, id: string) => ItemPurchased.fetch(client, T0, id),
      kind: 'StructClassReified',
    }
  }

  static fromFields<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    fields: Record<string, any>
  ): ItemPurchased<ToPhantomTypeArgument<T0>> {
    return ItemPurchased.new(typeArg, {
      kiosk: decodeFromFields(ID.reified(), fields.kiosk),
      id: decodeFromFields(ID.reified(), fields.id),
      price: decodeFromFields('u64', fields.price),
    })
  }

  static fromFieldsWithTypes<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    item: FieldsWithTypes
  ): ItemPurchased<ToPhantomTypeArgument<T0>> {
    if (!isItemPurchased(item.type)) {
      throw new Error('not a ItemPurchased type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return ItemPurchased.new(typeArg, {
      kiosk: decodeFromFieldsWithTypes(ID.reified(), item.fields.kiosk),
      id: decodeFromFieldsWithTypes(ID.reified(), item.fields.id),
      price: decodeFromFieldsWithTypes('u64', item.fields.price),
    })
  }

  static fromBcs<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    data: Uint8Array
  ): ItemPurchased<ToPhantomTypeArgument<T0>> {
    return ItemPurchased.fromFields(typeArg, ItemPurchased.bcs.parse(data))
  }

  toJSONField() {
    return {
      kiosk: this.kiosk,
      id: this.id,
      price: this.price.toString(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArg: this.$typeArg, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    field: any
  ): ItemPurchased<ToPhantomTypeArgument<T0>> {
    return ItemPurchased.new(typeArg, {
      kiosk: decodeFromJSONField(ID.reified(), field.kiosk),
      id: decodeFromJSONField(ID.reified(), field.id),
      price: decodeFromJSONField('u64', field.price),
    })
  }

  static fromJSON<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    json: Record<string, any>
  ): ItemPurchased<ToPhantomTypeArgument<T0>> {
    if (json.$typeName !== ItemPurchased.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(ItemPurchased.$typeName, extractType(typeArg)),
      [json.$typeArg],
      [typeArg]
    )

    return ItemPurchased.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    content: SuiParsedData
  ): ItemPurchased<ToPhantomTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isItemPurchased(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a ItemPurchased object`)
    }
    return ItemPurchased.fromFieldsWithTypes(typeArg, content)
  }

  static async fetch<T0 extends ReifiedPhantomTypeArgument>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<ItemPurchased<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching ItemPurchased object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isItemPurchased(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a ItemPurchased object`)
    }
    return ItemPurchased.fromFieldsWithTypes(typeArg, res.data.content)
  }
}

/* ============================== ItemDelisted =============================== */

export function isItemDelisted(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::kiosk::ItemDelisted<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface ItemDelistedFields<T0 extends PhantomTypeArgument> {
  kiosk: ToField<ID>
  id: ToField<ID>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class ItemDelisted<T0 extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::kiosk::ItemDelisted'
  static readonly $numTypeParams = 1

  readonly $fullTypeName = null as unknown as `0x2::kiosk::ItemDelisted<${ToTypeStr<T0>}>`

  readonly $typeName = ItemDelisted.$typeName

  static get bcs() {
    return bcs.struct('ItemDelisted', {
      kiosk: ID.bcs,
      id: ID.bcs,
    })
  }

  readonly $typeArg: string

  readonly kiosk: ToField<ID>
  readonly id: ToField<ID>

  private constructor(typeArg: string, fields: ItemDelistedFields<T0>) {
    this.$typeArg = typeArg

    this.kiosk = fields.kiosk
    this.id = fields.id
  }

  static new<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    fields: ItemDelistedFields<ToPhantomTypeArgument<T0>>
  ): ItemDelisted<ToPhantomTypeArgument<T0>> {
    return new ItemDelisted(extractType(typeArg), fields)
  }

  static reified<T0 extends ReifiedPhantomTypeArgument>(
    T0: T0
  ): Reified<ItemDelisted<ToPhantomTypeArgument<T0>>> {
    return {
      typeName: ItemDelisted.$typeName,
      fullTypeName: composeSuiType(
        ItemDelisted.$typeName,
        ...[extractType(T0)]
      ) as `0x2::kiosk::ItemDelisted<${ToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [T0],
      fromFields: (fields: Record<string, any>) => ItemDelisted.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => ItemDelisted.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => ItemDelisted.fromBcs(T0, data),
      bcs: ItemDelisted.bcs,
      fromJSONField: (field: any) => ItemDelisted.fromJSONField(T0, field),
      fetch: async (client: SuiClient, id: string) => ItemDelisted.fetch(client, T0, id),
      kind: 'StructClassReified',
    }
  }

  static fromFields<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    fields: Record<string, any>
  ): ItemDelisted<ToPhantomTypeArgument<T0>> {
    return ItemDelisted.new(typeArg, {
      kiosk: decodeFromFields(ID.reified(), fields.kiosk),
      id: decodeFromFields(ID.reified(), fields.id),
    })
  }

  static fromFieldsWithTypes<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    item: FieldsWithTypes
  ): ItemDelisted<ToPhantomTypeArgument<T0>> {
    if (!isItemDelisted(item.type)) {
      throw new Error('not a ItemDelisted type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return ItemDelisted.new(typeArg, {
      kiosk: decodeFromFieldsWithTypes(ID.reified(), item.fields.kiosk),
      id: decodeFromFieldsWithTypes(ID.reified(), item.fields.id),
    })
  }

  static fromBcs<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    data: Uint8Array
  ): ItemDelisted<ToPhantomTypeArgument<T0>> {
    return ItemDelisted.fromFields(typeArg, ItemDelisted.bcs.parse(data))
  }

  toJSONField() {
    return {
      kiosk: this.kiosk,
      id: this.id,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArg: this.$typeArg, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    field: any
  ): ItemDelisted<ToPhantomTypeArgument<T0>> {
    return ItemDelisted.new(typeArg, {
      kiosk: decodeFromJSONField(ID.reified(), field.kiosk),
      id: decodeFromJSONField(ID.reified(), field.id),
    })
  }

  static fromJSON<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    json: Record<string, any>
  ): ItemDelisted<ToPhantomTypeArgument<T0>> {
    if (json.$typeName !== ItemDelisted.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(ItemDelisted.$typeName, extractType(typeArg)),
      [json.$typeArg],
      [typeArg]
    )

    return ItemDelisted.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    content: SuiParsedData
  ): ItemDelisted<ToPhantomTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isItemDelisted(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a ItemDelisted object`)
    }
    return ItemDelisted.fromFieldsWithTypes(typeArg, content)
  }

  static async fetch<T0 extends ReifiedPhantomTypeArgument>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<ItemDelisted<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching ItemDelisted object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isItemDelisted(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a ItemDelisted object`)
    }
    return ItemDelisted.fromFieldsWithTypes(typeArg, res.data.content)
  }
}
