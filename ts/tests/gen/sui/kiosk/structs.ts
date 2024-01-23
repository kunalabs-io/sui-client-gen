import { FieldsWithTypes, Type, compressSuiType, parseTypeName } from '../../_framework/util'
import { Balance } from '../balance/structs'
import { ID, UID } from '../object/structs'
import { bcs, fromHEX, toHEX } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== Borrow =============================== */

export function isBorrow(type: Type): boolean {
  type = compressSuiType(type)
  return type === '0x2::kiosk::Borrow'
}

export interface BorrowFields {
  kioskId: string
  itemId: string
}

export class Borrow {
  static readonly $typeName = '0x2::kiosk::Borrow'
  static readonly $numTypeParams = 0

  static get bcs() {
    return bcs.struct('Borrow', {
      kiosk_id: ID.bcs,
      item_id: ID.bcs,
    })
  }

  readonly kioskId: string
  readonly itemId: string

  constructor(fields: BorrowFields) {
    this.kioskId = fields.kioskId
    this.itemId = fields.itemId
  }

  static fromFields(fields: Record<string, any>): Borrow {
    return new Borrow({
      kioskId: ID.fromFields(fields.kiosk_id).bytes,
      itemId: ID.fromFields(fields.item_id).bytes,
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Borrow {
    if (!isBorrow(item.type)) {
      throw new Error('not a Borrow type')
    }
    return new Borrow({ kioskId: item.fields.kiosk_id, itemId: item.fields.item_id })
  }

  static fromBcs(data: Uint8Array): Borrow {
    return Borrow.fromFields(Borrow.bcs.parse(data))
  }
}

/* ============================== Item =============================== */

export function isItem(type: Type): boolean {
  type = compressSuiType(type)
  return type === '0x2::kiosk::Item'
}

export interface ItemFields {
  id: string
}

export class Item {
  static readonly $typeName = '0x2::kiosk::Item'
  static readonly $numTypeParams = 0

  static get bcs() {
    return bcs.struct('Item', {
      id: ID.bcs,
    })
  }

  readonly id: string

  constructor(id: string) {
    this.id = id
  }

  static fromFields(fields: Record<string, any>): Item {
    return new Item(ID.fromFields(fields.id).bytes)
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Item {
    if (!isItem(item.type)) {
      throw new Error('not a Item type')
    }
    return new Item(item.fields.id)
  }

  static fromBcs(data: Uint8Array): Item {
    return Item.fromFields(Item.bcs.parse(data))
  }
}

/* ============================== ItemDelisted =============================== */

export function isItemDelisted(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::kiosk::ItemDelisted<')
}

export interface ItemDelistedFields {
  kiosk: string
  id: string
}

export class ItemDelisted {
  static readonly $typeName = '0x2::kiosk::ItemDelisted'
  static readonly $numTypeParams = 1

  static get bcs() {
    return bcs.struct('ItemDelisted', {
      kiosk: ID.bcs,
      id: ID.bcs,
    })
  }

  readonly $typeArg: Type

  readonly kiosk: string
  readonly id: string

  constructor(typeArg: Type, fields: ItemDelistedFields) {
    this.$typeArg = typeArg

    this.kiosk = fields.kiosk
    this.id = fields.id
  }

  static fromFields(typeArg: Type, fields: Record<string, any>): ItemDelisted {
    return new ItemDelisted(typeArg, {
      kiosk: ID.fromFields(fields.kiosk).bytes,
      id: ID.fromFields(fields.id).bytes,
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): ItemDelisted {
    if (!isItemDelisted(item.type)) {
      throw new Error('not a ItemDelisted type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new ItemDelisted(typeArgs[0], { kiosk: item.fields.kiosk, id: item.fields.id })
  }

  static fromBcs(typeArg: Type, data: Uint8Array): ItemDelisted {
    return ItemDelisted.fromFields(typeArg, ItemDelisted.bcs.parse(data))
  }
}

/* ============================== ItemListed =============================== */

export function isItemListed(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::kiosk::ItemListed<')
}

export interface ItemListedFields {
  kiosk: string
  id: string
  price: bigint
}

export class ItemListed {
  static readonly $typeName = '0x2::kiosk::ItemListed'
  static readonly $numTypeParams = 1

  static get bcs() {
    return bcs.struct('ItemListed', {
      kiosk: ID.bcs,
      id: ID.bcs,
      price: bcs.u64(),
    })
  }

  readonly $typeArg: Type

  readonly kiosk: string
  readonly id: string
  readonly price: bigint

  constructor(typeArg: Type, fields: ItemListedFields) {
    this.$typeArg = typeArg

    this.kiosk = fields.kiosk
    this.id = fields.id
    this.price = fields.price
  }

  static fromFields(typeArg: Type, fields: Record<string, any>): ItemListed {
    return new ItemListed(typeArg, {
      kiosk: ID.fromFields(fields.kiosk).bytes,
      id: ID.fromFields(fields.id).bytes,
      price: BigInt(fields.price),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): ItemListed {
    if (!isItemListed(item.type)) {
      throw new Error('not a ItemListed type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new ItemListed(typeArgs[0], {
      kiosk: item.fields.kiosk,
      id: item.fields.id,
      price: BigInt(item.fields.price),
    })
  }

  static fromBcs(typeArg: Type, data: Uint8Array): ItemListed {
    return ItemListed.fromFields(typeArg, ItemListed.bcs.parse(data))
  }
}

/* ============================== ItemPurchased =============================== */

export function isItemPurchased(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::kiosk::ItemPurchased<')
}

export interface ItemPurchasedFields {
  kiosk: string
  id: string
  price: bigint
}

export class ItemPurchased {
  static readonly $typeName = '0x2::kiosk::ItemPurchased'
  static readonly $numTypeParams = 1

  static get bcs() {
    return bcs.struct('ItemPurchased', {
      kiosk: ID.bcs,
      id: ID.bcs,
      price: bcs.u64(),
    })
  }

  readonly $typeArg: Type

  readonly kiosk: string
  readonly id: string
  readonly price: bigint

  constructor(typeArg: Type, fields: ItemPurchasedFields) {
    this.$typeArg = typeArg

    this.kiosk = fields.kiosk
    this.id = fields.id
    this.price = fields.price
  }

  static fromFields(typeArg: Type, fields: Record<string, any>): ItemPurchased {
    return new ItemPurchased(typeArg, {
      kiosk: ID.fromFields(fields.kiosk).bytes,
      id: ID.fromFields(fields.id).bytes,
      price: BigInt(fields.price),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): ItemPurchased {
    if (!isItemPurchased(item.type)) {
      throw new Error('not a ItemPurchased type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new ItemPurchased(typeArgs[0], {
      kiosk: item.fields.kiosk,
      id: item.fields.id,
      price: BigInt(item.fields.price),
    })
  }

  static fromBcs(typeArg: Type, data: Uint8Array): ItemPurchased {
    return ItemPurchased.fromFields(typeArg, ItemPurchased.bcs.parse(data))
  }
}

/* ============================== Kiosk =============================== */

export function isKiosk(type: Type): boolean {
  type = compressSuiType(type)
  return type === '0x2::kiosk::Kiosk'
}

export interface KioskFields {
  id: string
  profits: Balance
  owner: string
  itemCount: number
  allowExtensions: boolean
}

export class Kiosk {
  static readonly $typeName = '0x2::kiosk::Kiosk'
  static readonly $numTypeParams = 0

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

  readonly id: string
  readonly profits: Balance
  readonly owner: string
  readonly itemCount: number
  readonly allowExtensions: boolean

  constructor(fields: KioskFields) {
    this.id = fields.id
    this.profits = fields.profits
    this.owner = fields.owner
    this.itemCount = fields.itemCount
    this.allowExtensions = fields.allowExtensions
  }

  static fromFields(fields: Record<string, any>): Kiosk {
    return new Kiosk({
      id: UID.fromFields(fields.id).id,
      profits: Balance.fromFields(`0x2::sui::SUI`, fields.profits),
      owner: `0x${fields.owner}`,
      itemCount: fields.item_count,
      allowExtensions: fields.allow_extensions,
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Kiosk {
    if (!isKiosk(item.type)) {
      throw new Error('not a Kiosk type')
    }
    return new Kiosk({
      id: item.fields.id.id,
      profits: new Balance(`0x2::sui::SUI`, BigInt(item.fields.profits)),
      owner: item.fields.owner,
      itemCount: item.fields.item_count,
      allowExtensions: item.fields.allow_extensions,
    })
  }

  static fromBcs(data: Uint8Array): Kiosk {
    return Kiosk.fromFields(Kiosk.bcs.parse(data))
  }

  static fromSuiParsedData(content: SuiParsedData) {
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

export function isKioskOwnerCap(type: Type): boolean {
  type = compressSuiType(type)
  return type === '0x2::kiosk::KioskOwnerCap'
}

export interface KioskOwnerCapFields {
  id: string
  for: string
}

export class KioskOwnerCap {
  static readonly $typeName = '0x2::kiosk::KioskOwnerCap'
  static readonly $numTypeParams = 0

  static get bcs() {
    return bcs.struct('KioskOwnerCap', {
      id: UID.bcs,
      for: ID.bcs,
    })
  }

  readonly id: string
  readonly for: string

  constructor(fields: KioskOwnerCapFields) {
    this.id = fields.id
    this.for = fields.for
  }

  static fromFields(fields: Record<string, any>): KioskOwnerCap {
    return new KioskOwnerCap({
      id: UID.fromFields(fields.id).id,
      for: ID.fromFields(fields.for).bytes,
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): KioskOwnerCap {
    if (!isKioskOwnerCap(item.type)) {
      throw new Error('not a KioskOwnerCap type')
    }
    return new KioskOwnerCap({ id: item.fields.id.id, for: item.fields.for })
  }

  static fromBcs(data: Uint8Array): KioskOwnerCap {
    return KioskOwnerCap.fromFields(KioskOwnerCap.bcs.parse(data))
  }

  static fromSuiParsedData(content: SuiParsedData) {
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

/* ============================== Listing =============================== */

export function isListing(type: Type): boolean {
  type = compressSuiType(type)
  return type === '0x2::kiosk::Listing'
}

export interface ListingFields {
  id: string
  isExclusive: boolean
}

export class Listing {
  static readonly $typeName = '0x2::kiosk::Listing'
  static readonly $numTypeParams = 0

  static get bcs() {
    return bcs.struct('Listing', {
      id: ID.bcs,
      is_exclusive: bcs.bool(),
    })
  }

  readonly id: string
  readonly isExclusive: boolean

  constructor(fields: ListingFields) {
    this.id = fields.id
    this.isExclusive = fields.isExclusive
  }

  static fromFields(fields: Record<string, any>): Listing {
    return new Listing({ id: ID.fromFields(fields.id).bytes, isExclusive: fields.is_exclusive })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Listing {
    if (!isListing(item.type)) {
      throw new Error('not a Listing type')
    }
    return new Listing({ id: item.fields.id, isExclusive: item.fields.is_exclusive })
  }

  static fromBcs(data: Uint8Array): Listing {
    return Listing.fromFields(Listing.bcs.parse(data))
  }
}

/* ============================== Lock =============================== */

export function isLock(type: Type): boolean {
  type = compressSuiType(type)
  return type === '0x2::kiosk::Lock'
}

export interface LockFields {
  id: string
}

export class Lock {
  static readonly $typeName = '0x2::kiosk::Lock'
  static readonly $numTypeParams = 0

  static get bcs() {
    return bcs.struct('Lock', {
      id: ID.bcs,
    })
  }

  readonly id: string

  constructor(id: string) {
    this.id = id
  }

  static fromFields(fields: Record<string, any>): Lock {
    return new Lock(ID.fromFields(fields.id).bytes)
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Lock {
    if (!isLock(item.type)) {
      throw new Error('not a Lock type')
    }
    return new Lock(item.fields.id)
  }

  static fromBcs(data: Uint8Array): Lock {
    return Lock.fromFields(Lock.bcs.parse(data))
  }
}

/* ============================== PurchaseCap =============================== */

export function isPurchaseCap(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::kiosk::PurchaseCap<')
}

export interface PurchaseCapFields {
  id: string
  kioskId: string
  itemId: string
  minPrice: bigint
}

export class PurchaseCap {
  static readonly $typeName = '0x2::kiosk::PurchaseCap'
  static readonly $numTypeParams = 1

  static get bcs() {
    return bcs.struct('PurchaseCap', {
      id: UID.bcs,
      kiosk_id: ID.bcs,
      item_id: ID.bcs,
      min_price: bcs.u64(),
    })
  }

  readonly $typeArg: Type

  readonly id: string
  readonly kioskId: string
  readonly itemId: string
  readonly minPrice: bigint

  constructor(typeArg: Type, fields: PurchaseCapFields) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.kioskId = fields.kioskId
    this.itemId = fields.itemId
    this.minPrice = fields.minPrice
  }

  static fromFields(typeArg: Type, fields: Record<string, any>): PurchaseCap {
    return new PurchaseCap(typeArg, {
      id: UID.fromFields(fields.id).id,
      kioskId: ID.fromFields(fields.kiosk_id).bytes,
      itemId: ID.fromFields(fields.item_id).bytes,
      minPrice: BigInt(fields.min_price),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): PurchaseCap {
    if (!isPurchaseCap(item.type)) {
      throw new Error('not a PurchaseCap type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new PurchaseCap(typeArgs[0], {
      id: item.fields.id.id,
      kioskId: item.fields.kiosk_id,
      itemId: item.fields.item_id,
      minPrice: BigInt(item.fields.min_price),
    })
  }

  static fromBcs(typeArg: Type, data: Uint8Array): PurchaseCap {
    return PurchaseCap.fromFields(typeArg, PurchaseCap.bcs.parse(data))
  }

  static fromSuiParsedData(content: SuiParsedData) {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isPurchaseCap(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a PurchaseCap object`)
    }
    return PurchaseCap.fromFieldsWithTypes(content)
  }

  static async fetch(client: SuiClient, id: string): Promise<PurchaseCap> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching PurchaseCap object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isPurchaseCap(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a PurchaseCap object`)
    }
    return PurchaseCap.fromFieldsWithTypes(res.data.content)
  }
}
