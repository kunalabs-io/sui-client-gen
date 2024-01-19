import {
  ReifiedTypeArgument,
  ToField,
  assertFieldsWithTypesArgsMatch,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  extractType,
} from '../../_framework/reified'
import { FieldsWithTypes, compressSuiType } from '../../_framework/util'
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

export interface BorrowFields {
  kioskId: ToField<ID>
  itemId: ToField<ID>
}

export class Borrow {
  static readonly $typeName = '0x2::kiosk::Borrow'
  static readonly $numTypeParams = 0

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

  static reified() {
    return {
      typeName: Borrow.$typeName,
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => Borrow.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Borrow.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => Borrow.fromBcs(data),
      bcs: Borrow.bcs,
      __class: null as unknown as ReturnType<typeof Borrow.new>,
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

  toJSON() {
    return {
      kioskId: this.kioskId,
      itemId: this.itemId,
    }
  }
}

/* ============================== Kiosk =============================== */

export function isKiosk(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x2::kiosk::Kiosk'
}

export interface KioskFields {
  id: ToField<UID>
  profits: ToField<Balance>
  owner: ToField<'address'>
  itemCount: ToField<'u32'>
  allowExtensions: ToField<'bool'>
}

export class Kiosk {
  static readonly $typeName = '0x2::kiosk::Kiosk'
  static readonly $numTypeParams = 0

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
  readonly profits: ToField<Balance>
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

  static reified() {
    return {
      typeName: Kiosk.$typeName,
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => Kiosk.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Kiosk.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => Kiosk.fromBcs(data),
      bcs: Kiosk.bcs,
      __class: null as unknown as ReturnType<typeof Kiosk.new>,
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

  toJSON() {
    return {
      id: this.id,
      profits: this.profits.toJSON(),
      owner: this.owner,
      itemCount: this.itemCount,
      allowExtensions: this.allowExtensions,
    }
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

export interface KioskOwnerCapFields {
  id: ToField<UID>
  for: ToField<ID>
}

export class KioskOwnerCap {
  static readonly $typeName = '0x2::kiosk::KioskOwnerCap'
  static readonly $numTypeParams = 0

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

  static reified() {
    return {
      typeName: KioskOwnerCap.$typeName,
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => KioskOwnerCap.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => KioskOwnerCap.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => KioskOwnerCap.fromBcs(data),
      bcs: KioskOwnerCap.bcs,
      __class: null as unknown as ReturnType<typeof KioskOwnerCap.new>,
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

  toJSON() {
    return {
      id: this.id,
      for: this.for,
    }
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

export interface PurchaseCapFields {
  id: ToField<UID>
  kioskId: ToField<ID>
  itemId: ToField<ID>
  minPrice: ToField<'u64'>
}

export class PurchaseCap {
  static readonly $typeName = '0x2::kiosk::PurchaseCap'
  static readonly $numTypeParams = 1

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

  private constructor(typeArg: string, fields: PurchaseCapFields) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.kioskId = fields.kioskId
    this.itemId = fields.itemId
    this.minPrice = fields.minPrice
  }

  static new(typeArg: ReifiedTypeArgument, fields: PurchaseCapFields): PurchaseCap {
    return new PurchaseCap(extractType(typeArg), fields)
  }

  static reified(T0: ReifiedTypeArgument) {
    return {
      typeName: PurchaseCap.$typeName,
      typeArgs: [T0],
      fromFields: (fields: Record<string, any>) => PurchaseCap.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => PurchaseCap.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => PurchaseCap.fromBcs(T0, data),
      bcs: PurchaseCap.bcs,
      __class: null as unknown as ReturnType<typeof PurchaseCap.new>,
    }
  }

  static fromFields(typeArg: ReifiedTypeArgument, fields: Record<string, any>): PurchaseCap {
    return PurchaseCap.new(typeArg, {
      id: decodeFromFields(UID.reified(), fields.id),
      kioskId: decodeFromFields(ID.reified(), fields.kiosk_id),
      itemId: decodeFromFields(ID.reified(), fields.item_id),
      minPrice: decodeFromFields('u64', fields.min_price),
    })
  }

  static fromFieldsWithTypes(typeArg: ReifiedTypeArgument, item: FieldsWithTypes): PurchaseCap {
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

  static fromBcs(typeArg: ReifiedTypeArgument, data: Uint8Array): PurchaseCap {
    return PurchaseCap.fromFields(typeArg, PurchaseCap.bcs.parse(data))
  }

  toJSON() {
    return {
      $typeArg: this.$typeArg,
      id: this.id,
      kioskId: this.kioskId,
      itemId: this.itemId,
      minPrice: this.minPrice.toString(),
    }
  }

  static fromSuiParsedData(typeArg: ReifiedTypeArgument, content: SuiParsedData): PurchaseCap {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isPurchaseCap(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a PurchaseCap object`)
    }
    return PurchaseCap.fromFieldsWithTypes(typeArg, content)
  }

  static async fetch(
    client: SuiClient,
    typeArg: ReifiedTypeArgument,
    id: string
  ): Promise<PurchaseCap> {
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

export interface ItemFields {
  id: ToField<ID>
}

export class Item {
  static readonly $typeName = '0x2::kiosk::Item'
  static readonly $numTypeParams = 0

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

  static reified() {
    return {
      typeName: Item.$typeName,
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => Item.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Item.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => Item.fromBcs(data),
      bcs: Item.bcs,
      __class: null as unknown as ReturnType<typeof Item.new>,
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

  toJSON() {
    return {
      id: this.id,
    }
  }
}

/* ============================== Listing =============================== */

export function isListing(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x2::kiosk::Listing'
}

export interface ListingFields {
  id: ToField<ID>
  isExclusive: ToField<'bool'>
}

export class Listing {
  static readonly $typeName = '0x2::kiosk::Listing'
  static readonly $numTypeParams = 0

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

  static reified() {
    return {
      typeName: Listing.$typeName,
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => Listing.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Listing.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => Listing.fromBcs(data),
      bcs: Listing.bcs,
      __class: null as unknown as ReturnType<typeof Listing.new>,
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

  toJSON() {
    return {
      id: this.id,
      isExclusive: this.isExclusive,
    }
  }
}

/* ============================== Lock =============================== */

export function isLock(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x2::kiosk::Lock'
}

export interface LockFields {
  id: ToField<ID>
}

export class Lock {
  static readonly $typeName = '0x2::kiosk::Lock'
  static readonly $numTypeParams = 0

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

  static reified() {
    return {
      typeName: Lock.$typeName,
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => Lock.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Lock.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => Lock.fromBcs(data),
      bcs: Lock.bcs,
      __class: null as unknown as ReturnType<typeof Lock.new>,
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

  toJSON() {
    return {
      id: this.id,
    }
  }
}

/* ============================== ItemListed =============================== */

export function isItemListed(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::kiosk::ItemListed<')
}

export interface ItemListedFields {
  kiosk: ToField<ID>
  id: ToField<ID>
  price: ToField<'u64'>
}

export class ItemListed {
  static readonly $typeName = '0x2::kiosk::ItemListed'
  static readonly $numTypeParams = 1

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

  private constructor(typeArg: string, fields: ItemListedFields) {
    this.$typeArg = typeArg

    this.kiosk = fields.kiosk
    this.id = fields.id
    this.price = fields.price
  }

  static new(typeArg: ReifiedTypeArgument, fields: ItemListedFields): ItemListed {
    return new ItemListed(extractType(typeArg), fields)
  }

  static reified(T0: ReifiedTypeArgument) {
    return {
      typeName: ItemListed.$typeName,
      typeArgs: [T0],
      fromFields: (fields: Record<string, any>) => ItemListed.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => ItemListed.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => ItemListed.fromBcs(T0, data),
      bcs: ItemListed.bcs,
      __class: null as unknown as ReturnType<typeof ItemListed.new>,
    }
  }

  static fromFields(typeArg: ReifiedTypeArgument, fields: Record<string, any>): ItemListed {
    return ItemListed.new(typeArg, {
      kiosk: decodeFromFields(ID.reified(), fields.kiosk),
      id: decodeFromFields(ID.reified(), fields.id),
      price: decodeFromFields('u64', fields.price),
    })
  }

  static fromFieldsWithTypes(typeArg: ReifiedTypeArgument, item: FieldsWithTypes): ItemListed {
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

  static fromBcs(typeArg: ReifiedTypeArgument, data: Uint8Array): ItemListed {
    return ItemListed.fromFields(typeArg, ItemListed.bcs.parse(data))
  }

  toJSON() {
    return {
      $typeArg: this.$typeArg,
      kiosk: this.kiosk,
      id: this.id,
      price: this.price.toString(),
    }
  }
}

/* ============================== ItemPurchased =============================== */

export function isItemPurchased(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::kiosk::ItemPurchased<')
}

export interface ItemPurchasedFields {
  kiosk: ToField<ID>
  id: ToField<ID>
  price: ToField<'u64'>
}

export class ItemPurchased {
  static readonly $typeName = '0x2::kiosk::ItemPurchased'
  static readonly $numTypeParams = 1

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

  private constructor(typeArg: string, fields: ItemPurchasedFields) {
    this.$typeArg = typeArg

    this.kiosk = fields.kiosk
    this.id = fields.id
    this.price = fields.price
  }

  static new(typeArg: ReifiedTypeArgument, fields: ItemPurchasedFields): ItemPurchased {
    return new ItemPurchased(extractType(typeArg), fields)
  }

  static reified(T0: ReifiedTypeArgument) {
    return {
      typeName: ItemPurchased.$typeName,
      typeArgs: [T0],
      fromFields: (fields: Record<string, any>) => ItemPurchased.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => ItemPurchased.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => ItemPurchased.fromBcs(T0, data),
      bcs: ItemPurchased.bcs,
      __class: null as unknown as ReturnType<typeof ItemPurchased.new>,
    }
  }

  static fromFields(typeArg: ReifiedTypeArgument, fields: Record<string, any>): ItemPurchased {
    return ItemPurchased.new(typeArg, {
      kiosk: decodeFromFields(ID.reified(), fields.kiosk),
      id: decodeFromFields(ID.reified(), fields.id),
      price: decodeFromFields('u64', fields.price),
    })
  }

  static fromFieldsWithTypes(typeArg: ReifiedTypeArgument, item: FieldsWithTypes): ItemPurchased {
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

  static fromBcs(typeArg: ReifiedTypeArgument, data: Uint8Array): ItemPurchased {
    return ItemPurchased.fromFields(typeArg, ItemPurchased.bcs.parse(data))
  }

  toJSON() {
    return {
      $typeArg: this.$typeArg,
      kiosk: this.kiosk,
      id: this.id,
      price: this.price.toString(),
    }
  }
}

/* ============================== ItemDelisted =============================== */

export function isItemDelisted(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::kiosk::ItemDelisted<')
}

export interface ItemDelistedFields {
  kiosk: ToField<ID>
  id: ToField<ID>
}

export class ItemDelisted {
  static readonly $typeName = '0x2::kiosk::ItemDelisted'
  static readonly $numTypeParams = 1

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

  private constructor(typeArg: string, fields: ItemDelistedFields) {
    this.$typeArg = typeArg

    this.kiosk = fields.kiosk
    this.id = fields.id
  }

  static new(typeArg: ReifiedTypeArgument, fields: ItemDelistedFields): ItemDelisted {
    return new ItemDelisted(extractType(typeArg), fields)
  }

  static reified(T0: ReifiedTypeArgument) {
    return {
      typeName: ItemDelisted.$typeName,
      typeArgs: [T0],
      fromFields: (fields: Record<string, any>) => ItemDelisted.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => ItemDelisted.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => ItemDelisted.fromBcs(T0, data),
      bcs: ItemDelisted.bcs,
      __class: null as unknown as ReturnType<typeof ItemDelisted.new>,
    }
  }

  static fromFields(typeArg: ReifiedTypeArgument, fields: Record<string, any>): ItemDelisted {
    return ItemDelisted.new(typeArg, {
      kiosk: decodeFromFields(ID.reified(), fields.kiosk),
      id: decodeFromFields(ID.reified(), fields.id),
    })
  }

  static fromFieldsWithTypes(typeArg: ReifiedTypeArgument, item: FieldsWithTypes): ItemDelisted {
    if (!isItemDelisted(item.type)) {
      throw new Error('not a ItemDelisted type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return ItemDelisted.new(typeArg, {
      kiosk: decodeFromFieldsWithTypes(ID.reified(), item.fields.kiosk),
      id: decodeFromFieldsWithTypes(ID.reified(), item.fields.id),
    })
  }

  static fromBcs(typeArg: ReifiedTypeArgument, data: Uint8Array): ItemDelisted {
    return ItemDelisted.fromFields(typeArg, ItemDelisted.bcs.parse(data))
  }

  toJSON() {
    return {
      $typeArg: this.$typeArg,
      kiosk: this.kiosk,
      id: this.id,
    }
  }
}
