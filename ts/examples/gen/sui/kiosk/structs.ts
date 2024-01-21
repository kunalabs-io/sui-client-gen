import {
  PhantomTypeArgument,
  ReifiedPhantomTypeArgument,
  ToField,
  ToPhantomTypeArgument,
  ToTypeArgument,
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

  __reifiedFullTypeString = null as unknown as '0x2::kiosk::Borrow'

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
      fullTypeName: composeSuiType(Borrow.$typeName, ...[]) as '0x2::kiosk::Borrow',
      fromFields: (fields: Record<string, any>) => Borrow.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Borrow.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => Borrow.fromBcs(data),
      bcs: Borrow.bcs,
      fromJSONField: (field: any) => Borrow.fromJSONField(field),
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

  __reifiedFullTypeString = null as unknown as '0x2::kiosk::Item'

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
      fullTypeName: composeSuiType(Item.$typeName, ...[]) as '0x2::kiosk::Item',
      fromFields: (fields: Record<string, any>) => Item.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Item.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => Item.fromBcs(data),
      bcs: Item.bcs,
      fromJSONField: (field: any) => Item.fromJSONField(field),
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
}

/* ============================== ItemDelisted =============================== */

export function isItemDelisted(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::kiosk::ItemDelisted<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface ItemDelistedFields<T extends PhantomTypeArgument> {
  kiosk: ToField<ID>
  id: ToField<ID>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class ItemDelisted<T extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::kiosk::ItemDelisted'
  static readonly $numTypeParams = 1

  __reifiedFullTypeString = null as unknown as `0x2::kiosk::ItemDelisted<${T}>`

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

  private constructor(typeArg: string, fields: ItemDelistedFields<T>) {
    this.$typeArg = typeArg

    this.kiosk = fields.kiosk
    this.id = fields.id
  }

  static new<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    fields: ItemDelistedFields<ToPhantomTypeArgument<T>>
  ): ItemDelisted<ToPhantomTypeArgument<T>> {
    return new ItemDelisted(extractType(typeArg), fields)
  }

  static reified<T extends ReifiedPhantomTypeArgument>(T: T) {
    return {
      typeName: ItemDelisted.$typeName,
      typeArgs: [T],
      fullTypeName: composeSuiType(
        ItemDelisted.$typeName,
        ...[extractType(T)]
      ) as `0x2::kiosk::ItemDelisted<${ToPhantomTypeArgument<T>}>`,
      fromFields: (fields: Record<string, any>) => ItemDelisted.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => ItemDelisted.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => ItemDelisted.fromBcs(T, data),
      bcs: ItemDelisted.bcs,
      fromJSONField: (field: any) => ItemDelisted.fromJSONField(T, field),
      __class: null as unknown as ReturnType<typeof ItemDelisted.new<ToTypeArgument<T>>>,
    }
  }

  static fromFields<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    fields: Record<string, any>
  ): ItemDelisted<ToPhantomTypeArgument<T>> {
    return ItemDelisted.new(typeArg, {
      kiosk: decodeFromFields(ID.reified(), fields.kiosk),
      id: decodeFromFields(ID.reified(), fields.id),
    })
  }

  static fromFieldsWithTypes<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    item: FieldsWithTypes
  ): ItemDelisted<ToPhantomTypeArgument<T>> {
    if (!isItemDelisted(item.type)) {
      throw new Error('not a ItemDelisted type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return ItemDelisted.new(typeArg, {
      kiosk: decodeFromFieldsWithTypes(ID.reified(), item.fields.kiosk),
      id: decodeFromFieldsWithTypes(ID.reified(), item.fields.id),
    })
  }

  static fromBcs<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    data: Uint8Array
  ): ItemDelisted<ToPhantomTypeArgument<T>> {
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

  static fromJSONField<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    field: any
  ): ItemDelisted<ToPhantomTypeArgument<T>> {
    return ItemDelisted.new(typeArg, {
      kiosk: decodeFromJSONField(ID.reified(), field.kiosk),
      id: decodeFromJSONField(ID.reified(), field.id),
    })
  }

  static fromJSON<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    json: Record<string, any>
  ): ItemDelisted<ToPhantomTypeArgument<T>> {
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
}

/* ============================== ItemListed =============================== */

export function isItemListed(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::kiosk::ItemListed<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface ItemListedFields<T extends PhantomTypeArgument> {
  kiosk: ToField<ID>
  id: ToField<ID>
  price: ToField<'u64'>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class ItemListed<T extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::kiosk::ItemListed'
  static readonly $numTypeParams = 1

  __reifiedFullTypeString = null as unknown as `0x2::kiosk::ItemListed<${T}>`

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

  private constructor(typeArg: string, fields: ItemListedFields<T>) {
    this.$typeArg = typeArg

    this.kiosk = fields.kiosk
    this.id = fields.id
    this.price = fields.price
  }

  static new<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    fields: ItemListedFields<ToPhantomTypeArgument<T>>
  ): ItemListed<ToPhantomTypeArgument<T>> {
    return new ItemListed(extractType(typeArg), fields)
  }

  static reified<T extends ReifiedPhantomTypeArgument>(T: T) {
    return {
      typeName: ItemListed.$typeName,
      typeArgs: [T],
      fullTypeName: composeSuiType(
        ItemListed.$typeName,
        ...[extractType(T)]
      ) as `0x2::kiosk::ItemListed<${ToPhantomTypeArgument<T>}>`,
      fromFields: (fields: Record<string, any>) => ItemListed.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => ItemListed.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => ItemListed.fromBcs(T, data),
      bcs: ItemListed.bcs,
      fromJSONField: (field: any) => ItemListed.fromJSONField(T, field),
      __class: null as unknown as ReturnType<typeof ItemListed.new<ToTypeArgument<T>>>,
    }
  }

  static fromFields<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    fields: Record<string, any>
  ): ItemListed<ToPhantomTypeArgument<T>> {
    return ItemListed.new(typeArg, {
      kiosk: decodeFromFields(ID.reified(), fields.kiosk),
      id: decodeFromFields(ID.reified(), fields.id),
      price: decodeFromFields('u64', fields.price),
    })
  }

  static fromFieldsWithTypes<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    item: FieldsWithTypes
  ): ItemListed<ToPhantomTypeArgument<T>> {
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

  static fromBcs<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    data: Uint8Array
  ): ItemListed<ToPhantomTypeArgument<T>> {
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

  static fromJSONField<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    field: any
  ): ItemListed<ToPhantomTypeArgument<T>> {
    return ItemListed.new(typeArg, {
      kiosk: decodeFromJSONField(ID.reified(), field.kiosk),
      id: decodeFromJSONField(ID.reified(), field.id),
      price: decodeFromJSONField('u64', field.price),
    })
  }

  static fromJSON<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    json: Record<string, any>
  ): ItemListed<ToPhantomTypeArgument<T>> {
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
}

/* ============================== ItemPurchased =============================== */

export function isItemPurchased(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::kiosk::ItemPurchased<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface ItemPurchasedFields<T extends PhantomTypeArgument> {
  kiosk: ToField<ID>
  id: ToField<ID>
  price: ToField<'u64'>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class ItemPurchased<T extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::kiosk::ItemPurchased'
  static readonly $numTypeParams = 1

  __reifiedFullTypeString = null as unknown as `0x2::kiosk::ItemPurchased<${T}>`

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

  private constructor(typeArg: string, fields: ItemPurchasedFields<T>) {
    this.$typeArg = typeArg

    this.kiosk = fields.kiosk
    this.id = fields.id
    this.price = fields.price
  }

  static new<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    fields: ItemPurchasedFields<ToPhantomTypeArgument<T>>
  ): ItemPurchased<ToPhantomTypeArgument<T>> {
    return new ItemPurchased(extractType(typeArg), fields)
  }

  static reified<T extends ReifiedPhantomTypeArgument>(T: T) {
    return {
      typeName: ItemPurchased.$typeName,
      typeArgs: [T],
      fullTypeName: composeSuiType(
        ItemPurchased.$typeName,
        ...[extractType(T)]
      ) as `0x2::kiosk::ItemPurchased<${ToPhantomTypeArgument<T>}>`,
      fromFields: (fields: Record<string, any>) => ItemPurchased.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => ItemPurchased.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => ItemPurchased.fromBcs(T, data),
      bcs: ItemPurchased.bcs,
      fromJSONField: (field: any) => ItemPurchased.fromJSONField(T, field),
      __class: null as unknown as ReturnType<typeof ItemPurchased.new<ToTypeArgument<T>>>,
    }
  }

  static fromFields<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    fields: Record<string, any>
  ): ItemPurchased<ToPhantomTypeArgument<T>> {
    return ItemPurchased.new(typeArg, {
      kiosk: decodeFromFields(ID.reified(), fields.kiosk),
      id: decodeFromFields(ID.reified(), fields.id),
      price: decodeFromFields('u64', fields.price),
    })
  }

  static fromFieldsWithTypes<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    item: FieldsWithTypes
  ): ItemPurchased<ToPhantomTypeArgument<T>> {
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

  static fromBcs<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    data: Uint8Array
  ): ItemPurchased<ToPhantomTypeArgument<T>> {
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

  static fromJSONField<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    field: any
  ): ItemPurchased<ToPhantomTypeArgument<T>> {
    return ItemPurchased.new(typeArg, {
      kiosk: decodeFromJSONField(ID.reified(), field.kiosk),
      id: decodeFromJSONField(ID.reified(), field.id),
      price: decodeFromJSONField('u64', field.price),
    })
  }

  static fromJSON<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    json: Record<string, any>
  ): ItemPurchased<ToPhantomTypeArgument<T>> {
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

  __reifiedFullTypeString = null as unknown as '0x2::kiosk::Kiosk'

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

  static reified() {
    return {
      typeName: Kiosk.$typeName,
      typeArgs: [],
      fullTypeName: composeSuiType(Kiosk.$typeName, ...[]) as '0x2::kiosk::Kiosk',
      fromFields: (fields: Record<string, any>) => Kiosk.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Kiosk.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => Kiosk.fromBcs(data),
      bcs: Kiosk.bcs,
      fromJSONField: (field: any) => Kiosk.fromJSONField(field),
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

  __reifiedFullTypeString = null as unknown as '0x2::kiosk::KioskOwnerCap'

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
      fullTypeName: composeSuiType(KioskOwnerCap.$typeName, ...[]) as '0x2::kiosk::KioskOwnerCap',
      fromFields: (fields: Record<string, any>) => KioskOwnerCap.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => KioskOwnerCap.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => KioskOwnerCap.fromBcs(data),
      bcs: KioskOwnerCap.bcs,
      fromJSONField: (field: any) => KioskOwnerCap.fromJSONField(field),
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

  __reifiedFullTypeString = null as unknown as '0x2::kiosk::Listing'

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
      fullTypeName: composeSuiType(Listing.$typeName, ...[]) as '0x2::kiosk::Listing',
      fromFields: (fields: Record<string, any>) => Listing.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Listing.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => Listing.fromBcs(data),
      bcs: Listing.bcs,
      fromJSONField: (field: any) => Listing.fromJSONField(field),
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

  __reifiedFullTypeString = null as unknown as '0x2::kiosk::Lock'

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
      fullTypeName: composeSuiType(Lock.$typeName, ...[]) as '0x2::kiosk::Lock',
      fromFields: (fields: Record<string, any>) => Lock.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Lock.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => Lock.fromBcs(data),
      bcs: Lock.bcs,
      fromJSONField: (field: any) => Lock.fromJSONField(field),
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
}

/* ============================== PurchaseCap =============================== */

export function isPurchaseCap(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::kiosk::PurchaseCap<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface PurchaseCapFields<T extends PhantomTypeArgument> {
  id: ToField<UID>
  kioskId: ToField<ID>
  itemId: ToField<ID>
  minPrice: ToField<'u64'>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class PurchaseCap<T extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::kiosk::PurchaseCap'
  static readonly $numTypeParams = 1

  __reifiedFullTypeString = null as unknown as `0x2::kiosk::PurchaseCap<${T}>`

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

  private constructor(typeArg: string, fields: PurchaseCapFields<T>) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.kioskId = fields.kioskId
    this.itemId = fields.itemId
    this.minPrice = fields.minPrice
  }

  static new<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    fields: PurchaseCapFields<ToPhantomTypeArgument<T>>
  ): PurchaseCap<ToPhantomTypeArgument<T>> {
    return new PurchaseCap(extractType(typeArg), fields)
  }

  static reified<T extends ReifiedPhantomTypeArgument>(T: T) {
    return {
      typeName: PurchaseCap.$typeName,
      typeArgs: [T],
      fullTypeName: composeSuiType(
        PurchaseCap.$typeName,
        ...[extractType(T)]
      ) as `0x2::kiosk::PurchaseCap<${ToPhantomTypeArgument<T>}>`,
      fromFields: (fields: Record<string, any>) => PurchaseCap.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => PurchaseCap.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => PurchaseCap.fromBcs(T, data),
      bcs: PurchaseCap.bcs,
      fromJSONField: (field: any) => PurchaseCap.fromJSONField(T, field),
      __class: null as unknown as ReturnType<typeof PurchaseCap.new<ToTypeArgument<T>>>,
    }
  }

  static fromFields<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    fields: Record<string, any>
  ): PurchaseCap<ToPhantomTypeArgument<T>> {
    return PurchaseCap.new(typeArg, {
      id: decodeFromFields(UID.reified(), fields.id),
      kioskId: decodeFromFields(ID.reified(), fields.kiosk_id),
      itemId: decodeFromFields(ID.reified(), fields.item_id),
      minPrice: decodeFromFields('u64', fields.min_price),
    })
  }

  static fromFieldsWithTypes<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    item: FieldsWithTypes
  ): PurchaseCap<ToPhantomTypeArgument<T>> {
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

  static fromBcs<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    data: Uint8Array
  ): PurchaseCap<ToPhantomTypeArgument<T>> {
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

  static fromJSONField<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    field: any
  ): PurchaseCap<ToPhantomTypeArgument<T>> {
    return PurchaseCap.new(typeArg, {
      id: decodeFromJSONField(UID.reified(), field.id),
      kioskId: decodeFromJSONField(ID.reified(), field.kioskId),
      itemId: decodeFromJSONField(ID.reified(), field.itemId),
      minPrice: decodeFromJSONField('u64', field.minPrice),
    })
  }

  static fromJSON<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    json: Record<string, any>
  ): PurchaseCap<ToPhantomTypeArgument<T>> {
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

  static fromSuiParsedData<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    content: SuiParsedData
  ): PurchaseCap<ToPhantomTypeArgument<T>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isPurchaseCap(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a PurchaseCap object`)
    }
    return PurchaseCap.fromFieldsWithTypes(typeArg, content)
  }

  static async fetch<T extends ReifiedPhantomTypeArgument>(
    client: SuiClient,
    typeArg: T,
    id: string
  ): Promise<PurchaseCap<ToPhantomTypeArgument<T>>> {
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
