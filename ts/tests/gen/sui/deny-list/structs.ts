/**
 * Defines the `DenyList` type. The `DenyList` shared object is used to restrict access to
 * instances of certain core types from being used as inputs by specified addresses in the deny
 * list.
 */

import {
  PhantomReified,
  Reified,
  StructClass,
  ToField,
  ToTypeStr,
  ToTypeStr as ToPhantom,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  fieldToJSON,
  phantom,
  vector,
} from '../../_framework/reified'
import {
  FieldsWithTypes,
  SupportedSuiClient,
  composeSuiType,
  compressSuiType,
  fetchObjectBcs,
} from '../../_framework/util'
import { Vector } from '../../_framework/vector'
import { Bag } from '../bag/structs'
import { ID, UID } from '../object/structs'
import { Table } from '../table/structs'
import { VecSet } from '../vec-set/structs'
import { bcs } from '@mysten/sui/bcs'
import { SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromBase64, fromHex, toHex } from '@mysten/sui/utils'

/* ============================== DenyList =============================== */

export function isDenyList(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::deny_list::DenyList`
}

export interface DenyListFields {
  id: ToField<UID>
  /** The individual deny lists. */
  lists: ToField<Bag>
}

export type DenyListReified = Reified<DenyList, DenyListFields>

/** A shared object that stores the addresses that are blocked for a given core type. */
export class DenyList implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::deny_list::DenyList` = `0x2::deny_list::DenyList` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName: typeof DenyList.$typeName = DenyList.$typeName
  readonly $fullTypeName: `0x2::deny_list::DenyList`
  readonly $typeArgs: []
  readonly $isPhantom: typeof DenyList.$isPhantom = DenyList.$isPhantom

  readonly id: ToField<UID>
  /** The individual deny lists. */
  readonly lists: ToField<Bag>

  private constructor(typeArgs: [], fields: DenyListFields) {
    this.$fullTypeName = composeSuiType(
      DenyList.$typeName,
      ...typeArgs
    ) as `0x2::deny_list::DenyList`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.lists = fields.lists
  }

  static reified(): DenyListReified {
    const reifiedBcs = DenyList.bcs
    return {
      typeName: DenyList.$typeName,
      fullTypeName: composeSuiType(DenyList.$typeName, ...[]) as `0x2::deny_list::DenyList`,
      typeArgs: [] as [],
      isPhantom: DenyList.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => DenyList.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => DenyList.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => DenyList.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => DenyList.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => DenyList.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => DenyList.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => DenyList.fromSuiObjectData(content),
      fetch: async (client: SupportedSuiClient, id: string) => DenyList.fetch(client, id),
      new: (fields: DenyListFields) => {
        return new DenyList([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): DenyListReified {
    return DenyList.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<DenyList>> {
    return phantom(DenyList.reified())
  }

  static get p(): PhantomReified<ToTypeStr<DenyList>> {
    return DenyList.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('DenyList', {
      id: UID.bcs,
      lists: Bag.bcs,
    })
  }

  private static cachedBcs: ReturnType<typeof DenyList.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof DenyList.instantiateBcs> {
    if (!DenyList.cachedBcs) {
      DenyList.cachedBcs = DenyList.instantiateBcs()
    }
    return DenyList.cachedBcs
  }

  static fromFields(fields: Record<string, any>): DenyList {
    return DenyList.reified().new({
      id: decodeFromFields(UID.reified(), fields.id),
      lists: decodeFromFields(Bag.reified(), fields.lists),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): DenyList {
    if (!isDenyList(item.type)) {
      throw new Error('not a DenyList type')
    }

    return DenyList.reified().new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      lists: decodeFromFieldsWithTypes(Bag.reified(), item.fields.lists),
    })
  }

  static fromBcs(data: Uint8Array): DenyList {
    return DenyList.fromFields(DenyList.bcs.parse(data))
  }

  toJSONField(): Record<string, any> {
    return {
      id: this.id,
      lists: this.lists.toJSONField(),
    }
  }

  toJSON(): Record<string, any> {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): DenyList {
    return DenyList.reified().new({
      id: decodeFromJSONField(UID.reified(), field.id),
      lists: decodeFromJSONField(Bag.reified(), field.lists),
    })
  }

  static fromJSON(json: Record<string, any>): DenyList {
    if (json.$typeName !== DenyList.$typeName) {
      throw new Error(
        `not a DenyList json object: expected '${DenyList.$typeName}' but got '${json.$typeName}'`
      )
    }

    return DenyList.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): DenyList {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isDenyList(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a DenyList object`)
    }
    return DenyList.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): DenyList {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isDenyList(data.bcs.type)) {
        throw new Error(`object at is not a DenyList object`)
      }

      return DenyList.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return DenyList.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<DenyList> {
    const res = await fetchObjectBcs(client, id)
    if (!isDenyList(res.type)) {
      throw new Error(`object at id ${id} is not a DenyList object`)
    }

    return DenyList.fromBcs(res.bcsBytes)
  }
}

/* ============================== ConfigWriteCap =============================== */

export function isConfigWriteCap(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::deny_list::ConfigWriteCap`
}

export interface ConfigWriteCapFields {
  dummyField: ToField<'bool'>
}

export type ConfigWriteCapReified = Reified<ConfigWriteCap, ConfigWriteCapFields>

/**
 * The capability used to write to the deny list config. Ensures that the Configs for the
 * DenyList are modified only by this module.
 */
export class ConfigWriteCap implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::deny_list::ConfigWriteCap` =
    `0x2::deny_list::ConfigWriteCap` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName: typeof ConfigWriteCap.$typeName = ConfigWriteCap.$typeName
  readonly $fullTypeName: `0x2::deny_list::ConfigWriteCap`
  readonly $typeArgs: []
  readonly $isPhantom: typeof ConfigWriteCap.$isPhantom = ConfigWriteCap.$isPhantom

  readonly dummyField: ToField<'bool'>

  private constructor(typeArgs: [], fields: ConfigWriteCapFields) {
    this.$fullTypeName = composeSuiType(
      ConfigWriteCap.$typeName,
      ...typeArgs
    ) as `0x2::deny_list::ConfigWriteCap`
    this.$typeArgs = typeArgs

    this.dummyField = fields.dummyField
  }

  static reified(): ConfigWriteCapReified {
    const reifiedBcs = ConfigWriteCap.bcs
    return {
      typeName: ConfigWriteCap.$typeName,
      fullTypeName: composeSuiType(
        ConfigWriteCap.$typeName,
        ...[]
      ) as `0x2::deny_list::ConfigWriteCap`,
      typeArgs: [] as [],
      isPhantom: ConfigWriteCap.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => ConfigWriteCap.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => ConfigWriteCap.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => ConfigWriteCap.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => ConfigWriteCap.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => ConfigWriteCap.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => ConfigWriteCap.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => ConfigWriteCap.fromSuiObjectData(content),
      fetch: async (client: SupportedSuiClient, id: string) => ConfigWriteCap.fetch(client, id),
      new: (fields: ConfigWriteCapFields) => {
        return new ConfigWriteCap([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): ConfigWriteCapReified {
    return ConfigWriteCap.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<ConfigWriteCap>> {
    return phantom(ConfigWriteCap.reified())
  }

  static get p(): PhantomReified<ToTypeStr<ConfigWriteCap>> {
    return ConfigWriteCap.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('ConfigWriteCap', {
      dummy_field: bcs.bool(),
    })
  }

  private static cachedBcs: ReturnType<typeof ConfigWriteCap.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof ConfigWriteCap.instantiateBcs> {
    if (!ConfigWriteCap.cachedBcs) {
      ConfigWriteCap.cachedBcs = ConfigWriteCap.instantiateBcs()
    }
    return ConfigWriteCap.cachedBcs
  }

  static fromFields(fields: Record<string, any>): ConfigWriteCap {
    return ConfigWriteCap.reified().new({
      dummyField: decodeFromFields('bool', fields.dummy_field),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): ConfigWriteCap {
    if (!isConfigWriteCap(item.type)) {
      throw new Error('not a ConfigWriteCap type')
    }

    return ConfigWriteCap.reified().new({
      dummyField: decodeFromFieldsWithTypes('bool', item.fields.dummy_field),
    })
  }

  static fromBcs(data: Uint8Array): ConfigWriteCap {
    return ConfigWriteCap.fromFields(ConfigWriteCap.bcs.parse(data))
  }

  toJSONField(): Record<string, any> {
    return {
      dummyField: this.dummyField,
    }
  }

  toJSON(): Record<string, any> {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): ConfigWriteCap {
    return ConfigWriteCap.reified().new({
      dummyField: decodeFromJSONField('bool', field.dummyField),
    })
  }

  static fromJSON(json: Record<string, any>): ConfigWriteCap {
    if (json.$typeName !== ConfigWriteCap.$typeName) {
      throw new Error(
        `not a ConfigWriteCap json object: expected '${ConfigWriteCap.$typeName}' but got '${json.$typeName}'`
      )
    }

    return ConfigWriteCap.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): ConfigWriteCap {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isConfigWriteCap(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a ConfigWriteCap object`)
    }
    return ConfigWriteCap.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): ConfigWriteCap {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isConfigWriteCap(data.bcs.type)) {
        throw new Error(`object at is not a ConfigWriteCap object`)
      }

      return ConfigWriteCap.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return ConfigWriteCap.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<ConfigWriteCap> {
    const res = await fetchObjectBcs(client, id)
    if (!isConfigWriteCap(res.type)) {
      throw new Error(`object at id ${id} is not a ConfigWriteCap object`)
    }

    return ConfigWriteCap.fromBcs(res.bcsBytes)
  }
}

/* ============================== ConfigKey =============================== */

export function isConfigKey(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::deny_list::ConfigKey`
}

export interface ConfigKeyFields {
  perTypeIndex: ToField<'u64'>
  perTypeKey: ToField<Vector<'u8'>>
}

export type ConfigKeyReified = Reified<ConfigKey, ConfigKeyFields>

/**
 * The dynamic object field key used to store the `Config` for a given type, essentially a
 * `(per_type_index, per_type_key)` pair.
 */
export class ConfigKey implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::deny_list::ConfigKey` = `0x2::deny_list::ConfigKey` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName: typeof ConfigKey.$typeName = ConfigKey.$typeName
  readonly $fullTypeName: `0x2::deny_list::ConfigKey`
  readonly $typeArgs: []
  readonly $isPhantom: typeof ConfigKey.$isPhantom = ConfigKey.$isPhantom

  readonly perTypeIndex: ToField<'u64'>
  readonly perTypeKey: ToField<Vector<'u8'>>

  private constructor(typeArgs: [], fields: ConfigKeyFields) {
    this.$fullTypeName = composeSuiType(
      ConfigKey.$typeName,
      ...typeArgs
    ) as `0x2::deny_list::ConfigKey`
    this.$typeArgs = typeArgs

    this.perTypeIndex = fields.perTypeIndex
    this.perTypeKey = fields.perTypeKey
  }

  static reified(): ConfigKeyReified {
    const reifiedBcs = ConfigKey.bcs
    return {
      typeName: ConfigKey.$typeName,
      fullTypeName: composeSuiType(ConfigKey.$typeName, ...[]) as `0x2::deny_list::ConfigKey`,
      typeArgs: [] as [],
      isPhantom: ConfigKey.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => ConfigKey.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => ConfigKey.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => ConfigKey.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => ConfigKey.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => ConfigKey.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => ConfigKey.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => ConfigKey.fromSuiObjectData(content),
      fetch: async (client: SupportedSuiClient, id: string) => ConfigKey.fetch(client, id),
      new: (fields: ConfigKeyFields) => {
        return new ConfigKey([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): ConfigKeyReified {
    return ConfigKey.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<ConfigKey>> {
    return phantom(ConfigKey.reified())
  }

  static get p(): PhantomReified<ToTypeStr<ConfigKey>> {
    return ConfigKey.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('ConfigKey', {
      per_type_index: bcs.u64(),
      per_type_key: bcs.vector(bcs.u8()),
    })
  }

  private static cachedBcs: ReturnType<typeof ConfigKey.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof ConfigKey.instantiateBcs> {
    if (!ConfigKey.cachedBcs) {
      ConfigKey.cachedBcs = ConfigKey.instantiateBcs()
    }
    return ConfigKey.cachedBcs
  }

  static fromFields(fields: Record<string, any>): ConfigKey {
    return ConfigKey.reified().new({
      perTypeIndex: decodeFromFields('u64', fields.per_type_index),
      perTypeKey: decodeFromFields(vector('u8'), fields.per_type_key),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): ConfigKey {
    if (!isConfigKey(item.type)) {
      throw new Error('not a ConfigKey type')
    }

    return ConfigKey.reified().new({
      perTypeIndex: decodeFromFieldsWithTypes('u64', item.fields.per_type_index),
      perTypeKey: decodeFromFieldsWithTypes(vector('u8'), item.fields.per_type_key),
    })
  }

  static fromBcs(data: Uint8Array): ConfigKey {
    return ConfigKey.fromFields(ConfigKey.bcs.parse(data))
  }

  toJSONField(): Record<string, any> {
    return {
      perTypeIndex: this.perTypeIndex.toString(),
      perTypeKey: fieldToJSON<Vector<'u8'>>(`vector<u8>`, this.perTypeKey),
    }
  }

  toJSON(): Record<string, any> {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): ConfigKey {
    return ConfigKey.reified().new({
      perTypeIndex: decodeFromJSONField('u64', field.perTypeIndex),
      perTypeKey: decodeFromJSONField(vector('u8'), field.perTypeKey),
    })
  }

  static fromJSON(json: Record<string, any>): ConfigKey {
    if (json.$typeName !== ConfigKey.$typeName) {
      throw new Error(
        `not a ConfigKey json object: expected '${ConfigKey.$typeName}' but got '${json.$typeName}'`
      )
    }

    return ConfigKey.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): ConfigKey {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isConfigKey(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a ConfigKey object`)
    }
    return ConfigKey.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): ConfigKey {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isConfigKey(data.bcs.type)) {
        throw new Error(`object at is not a ConfigKey object`)
      }

      return ConfigKey.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return ConfigKey.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<ConfigKey> {
    const res = await fetchObjectBcs(client, id)
    if (!isConfigKey(res.type)) {
      throw new Error(`object at id ${id} is not a ConfigKey object`)
    }

    return ConfigKey.fromBcs(res.bcsBytes)
  }
}

/* ============================== AddressKey =============================== */

export function isAddressKey(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::deny_list::AddressKey`
}

export interface AddressKeyFields {
  pos0: ToField<'address'>
}

export type AddressKeyReified = Reified<AddressKey, AddressKeyFields>

/** The setting key used to store the deny list for a given address in the `Config`. */
export class AddressKey implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::deny_list::AddressKey` = `0x2::deny_list::AddressKey` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName: typeof AddressKey.$typeName = AddressKey.$typeName
  readonly $fullTypeName: `0x2::deny_list::AddressKey`
  readonly $typeArgs: []
  readonly $isPhantom: typeof AddressKey.$isPhantom = AddressKey.$isPhantom

  readonly pos0: ToField<'address'>

  private constructor(typeArgs: [], fields: AddressKeyFields) {
    this.$fullTypeName = composeSuiType(
      AddressKey.$typeName,
      ...typeArgs
    ) as `0x2::deny_list::AddressKey`
    this.$typeArgs = typeArgs

    this.pos0 = fields.pos0
  }

  static reified(): AddressKeyReified {
    const reifiedBcs = AddressKey.bcs
    return {
      typeName: AddressKey.$typeName,
      fullTypeName: composeSuiType(AddressKey.$typeName, ...[]) as `0x2::deny_list::AddressKey`,
      typeArgs: [] as [],
      isPhantom: AddressKey.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => AddressKey.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => AddressKey.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => AddressKey.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => AddressKey.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => AddressKey.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => AddressKey.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => AddressKey.fromSuiObjectData(content),
      fetch: async (client: SupportedSuiClient, id: string) => AddressKey.fetch(client, id),
      new: (fields: AddressKeyFields) => {
        return new AddressKey([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): AddressKeyReified {
    return AddressKey.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<AddressKey>> {
    return phantom(AddressKey.reified())
  }

  static get p(): PhantomReified<ToTypeStr<AddressKey>> {
    return AddressKey.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('AddressKey', {
      pos0: bcs.bytes(32).transform({
        input: (val: string) => fromHex(val),
        output: (val: Uint8Array) => toHex(val),
      }),
    })
  }

  private static cachedBcs: ReturnType<typeof AddressKey.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof AddressKey.instantiateBcs> {
    if (!AddressKey.cachedBcs) {
      AddressKey.cachedBcs = AddressKey.instantiateBcs()
    }
    return AddressKey.cachedBcs
  }

  static fromFields(fields: Record<string, any>): AddressKey {
    return AddressKey.reified().new({
      pos0: decodeFromFields('address', fields.pos0),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): AddressKey {
    if (!isAddressKey(item.type)) {
      throw new Error('not a AddressKey type')
    }

    return AddressKey.reified().new({
      pos0: decodeFromFieldsWithTypes('address', item.fields.pos0),
    })
  }

  static fromBcs(data: Uint8Array): AddressKey {
    return AddressKey.fromFields(AddressKey.bcs.parse(data))
  }

  toJSONField(): Record<string, any> {
    return {
      pos0: this.pos0,
    }
  }

  toJSON(): Record<string, any> {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): AddressKey {
    return AddressKey.reified().new({
      pos0: decodeFromJSONField('address', field.pos0),
    })
  }

  static fromJSON(json: Record<string, any>): AddressKey {
    if (json.$typeName !== AddressKey.$typeName) {
      throw new Error(
        `not a AddressKey json object: expected '${AddressKey.$typeName}' but got '${json.$typeName}'`
      )
    }

    return AddressKey.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): AddressKey {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isAddressKey(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a AddressKey object`)
    }
    return AddressKey.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): AddressKey {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isAddressKey(data.bcs.type)) {
        throw new Error(`object at is not a AddressKey object`)
      }

      return AddressKey.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return AddressKey.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<AddressKey> {
    const res = await fetchObjectBcs(client, id)
    if (!isAddressKey(res.type)) {
      throw new Error(`object at id ${id} is not a AddressKey object`)
    }

    return AddressKey.fromBcs(res.bcsBytes)
  }
}

/* ============================== GlobalPauseKey =============================== */

export function isGlobalPauseKey(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::deny_list::GlobalPauseKey`
}

export interface GlobalPauseKeyFields {
  dummyField: ToField<'bool'>
}

export type GlobalPauseKeyReified = Reified<GlobalPauseKey, GlobalPauseKeyFields>

/** The setting key used to store the global pause setting in the `Config`. */
export class GlobalPauseKey implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::deny_list::GlobalPauseKey` =
    `0x2::deny_list::GlobalPauseKey` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName: typeof GlobalPauseKey.$typeName = GlobalPauseKey.$typeName
  readonly $fullTypeName: `0x2::deny_list::GlobalPauseKey`
  readonly $typeArgs: []
  readonly $isPhantom: typeof GlobalPauseKey.$isPhantom = GlobalPauseKey.$isPhantom

  readonly dummyField: ToField<'bool'>

  private constructor(typeArgs: [], fields: GlobalPauseKeyFields) {
    this.$fullTypeName = composeSuiType(
      GlobalPauseKey.$typeName,
      ...typeArgs
    ) as `0x2::deny_list::GlobalPauseKey`
    this.$typeArgs = typeArgs

    this.dummyField = fields.dummyField
  }

  static reified(): GlobalPauseKeyReified {
    const reifiedBcs = GlobalPauseKey.bcs
    return {
      typeName: GlobalPauseKey.$typeName,
      fullTypeName: composeSuiType(
        GlobalPauseKey.$typeName,
        ...[]
      ) as `0x2::deny_list::GlobalPauseKey`,
      typeArgs: [] as [],
      isPhantom: GlobalPauseKey.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => GlobalPauseKey.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => GlobalPauseKey.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => GlobalPauseKey.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => GlobalPauseKey.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => GlobalPauseKey.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => GlobalPauseKey.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => GlobalPauseKey.fromSuiObjectData(content),
      fetch: async (client: SupportedSuiClient, id: string) => GlobalPauseKey.fetch(client, id),
      new: (fields: GlobalPauseKeyFields) => {
        return new GlobalPauseKey([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): GlobalPauseKeyReified {
    return GlobalPauseKey.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<GlobalPauseKey>> {
    return phantom(GlobalPauseKey.reified())
  }

  static get p(): PhantomReified<ToTypeStr<GlobalPauseKey>> {
    return GlobalPauseKey.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('GlobalPauseKey', {
      dummy_field: bcs.bool(),
    })
  }

  private static cachedBcs: ReturnType<typeof GlobalPauseKey.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof GlobalPauseKey.instantiateBcs> {
    if (!GlobalPauseKey.cachedBcs) {
      GlobalPauseKey.cachedBcs = GlobalPauseKey.instantiateBcs()
    }
    return GlobalPauseKey.cachedBcs
  }

  static fromFields(fields: Record<string, any>): GlobalPauseKey {
    return GlobalPauseKey.reified().new({
      dummyField: decodeFromFields('bool', fields.dummy_field),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): GlobalPauseKey {
    if (!isGlobalPauseKey(item.type)) {
      throw new Error('not a GlobalPauseKey type')
    }

    return GlobalPauseKey.reified().new({
      dummyField: decodeFromFieldsWithTypes('bool', item.fields.dummy_field),
    })
  }

  static fromBcs(data: Uint8Array): GlobalPauseKey {
    return GlobalPauseKey.fromFields(GlobalPauseKey.bcs.parse(data))
  }

  toJSONField(): Record<string, any> {
    return {
      dummyField: this.dummyField,
    }
  }

  toJSON(): Record<string, any> {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): GlobalPauseKey {
    return GlobalPauseKey.reified().new({
      dummyField: decodeFromJSONField('bool', field.dummyField),
    })
  }

  static fromJSON(json: Record<string, any>): GlobalPauseKey {
    if (json.$typeName !== GlobalPauseKey.$typeName) {
      throw new Error(
        `not a GlobalPauseKey json object: expected '${GlobalPauseKey.$typeName}' but got '${json.$typeName}'`
      )
    }

    return GlobalPauseKey.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): GlobalPauseKey {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isGlobalPauseKey(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a GlobalPauseKey object`)
    }
    return GlobalPauseKey.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): GlobalPauseKey {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isGlobalPauseKey(data.bcs.type)) {
        throw new Error(`object at is not a GlobalPauseKey object`)
      }

      return GlobalPauseKey.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return GlobalPauseKey.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<GlobalPauseKey> {
    const res = await fetchObjectBcs(client, id)
    if (!isGlobalPauseKey(res.type)) {
      throw new Error(`object at id ${id} is not a GlobalPauseKey object`)
    }

    return GlobalPauseKey.fromBcs(res.bcsBytes)
  }
}

/* ============================== PerTypeConfigCreated =============================== */

export function isPerTypeConfigCreated(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::deny_list::PerTypeConfigCreated`
}

export interface PerTypeConfigCreatedFields {
  key: ToField<ConfigKey>
  configId: ToField<ID>
}

export type PerTypeConfigCreatedReified = Reified<PerTypeConfigCreated, PerTypeConfigCreatedFields>

/**
 * The event emitted when a new `Config` is created for a given type. This can be useful for
 * tracking the `ID` of a type's `Config` object.
 */
export class PerTypeConfigCreated implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::deny_list::PerTypeConfigCreated` =
    `0x2::deny_list::PerTypeConfigCreated` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName: typeof PerTypeConfigCreated.$typeName = PerTypeConfigCreated.$typeName
  readonly $fullTypeName: `0x2::deny_list::PerTypeConfigCreated`
  readonly $typeArgs: []
  readonly $isPhantom: typeof PerTypeConfigCreated.$isPhantom = PerTypeConfigCreated.$isPhantom

  readonly key: ToField<ConfigKey>
  readonly configId: ToField<ID>

  private constructor(typeArgs: [], fields: PerTypeConfigCreatedFields) {
    this.$fullTypeName = composeSuiType(
      PerTypeConfigCreated.$typeName,
      ...typeArgs
    ) as `0x2::deny_list::PerTypeConfigCreated`
    this.$typeArgs = typeArgs

    this.key = fields.key
    this.configId = fields.configId
  }

  static reified(): PerTypeConfigCreatedReified {
    const reifiedBcs = PerTypeConfigCreated.bcs
    return {
      typeName: PerTypeConfigCreated.$typeName,
      fullTypeName: composeSuiType(
        PerTypeConfigCreated.$typeName,
        ...[]
      ) as `0x2::deny_list::PerTypeConfigCreated`,
      typeArgs: [] as [],
      isPhantom: PerTypeConfigCreated.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => PerTypeConfigCreated.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        PerTypeConfigCreated.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => PerTypeConfigCreated.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => PerTypeConfigCreated.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => PerTypeConfigCreated.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) =>
        PerTypeConfigCreated.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) =>
        PerTypeConfigCreated.fromSuiObjectData(content),
      fetch: async (client: SupportedSuiClient, id: string) =>
        PerTypeConfigCreated.fetch(client, id),
      new: (fields: PerTypeConfigCreatedFields) => {
        return new PerTypeConfigCreated([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): PerTypeConfigCreatedReified {
    return PerTypeConfigCreated.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<PerTypeConfigCreated>> {
    return phantom(PerTypeConfigCreated.reified())
  }

  static get p(): PhantomReified<ToTypeStr<PerTypeConfigCreated>> {
    return PerTypeConfigCreated.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('PerTypeConfigCreated', {
      key: ConfigKey.bcs,
      config_id: ID.bcs,
    })
  }

  private static cachedBcs: ReturnType<typeof PerTypeConfigCreated.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof PerTypeConfigCreated.instantiateBcs> {
    if (!PerTypeConfigCreated.cachedBcs) {
      PerTypeConfigCreated.cachedBcs = PerTypeConfigCreated.instantiateBcs()
    }
    return PerTypeConfigCreated.cachedBcs
  }

  static fromFields(fields: Record<string, any>): PerTypeConfigCreated {
    return PerTypeConfigCreated.reified().new({
      key: decodeFromFields(ConfigKey.reified(), fields.key),
      configId: decodeFromFields(ID.reified(), fields.config_id),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): PerTypeConfigCreated {
    if (!isPerTypeConfigCreated(item.type)) {
      throw new Error('not a PerTypeConfigCreated type')
    }

    return PerTypeConfigCreated.reified().new({
      key: decodeFromFieldsWithTypes(ConfigKey.reified(), item.fields.key),
      configId: decodeFromFieldsWithTypes(ID.reified(), item.fields.config_id),
    })
  }

  static fromBcs(data: Uint8Array): PerTypeConfigCreated {
    return PerTypeConfigCreated.fromFields(PerTypeConfigCreated.bcs.parse(data))
  }

  toJSONField(): Record<string, any> {
    return {
      key: this.key.toJSONField(),
      configId: this.configId,
    }
  }

  toJSON(): Record<string, any> {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): PerTypeConfigCreated {
    return PerTypeConfigCreated.reified().new({
      key: decodeFromJSONField(ConfigKey.reified(), field.key),
      configId: decodeFromJSONField(ID.reified(), field.configId),
    })
  }

  static fromJSON(json: Record<string, any>): PerTypeConfigCreated {
    if (json.$typeName !== PerTypeConfigCreated.$typeName) {
      throw new Error(
        `not a PerTypeConfigCreated json object: expected '${PerTypeConfigCreated.$typeName}' but got '${json.$typeName}'`
      )
    }

    return PerTypeConfigCreated.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): PerTypeConfigCreated {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isPerTypeConfigCreated(content.type)) {
      throw new Error(
        `object at ${(content.fields as any).id} is not a PerTypeConfigCreated object`
      )
    }
    return PerTypeConfigCreated.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): PerTypeConfigCreated {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isPerTypeConfigCreated(data.bcs.type)) {
        throw new Error(`object at is not a PerTypeConfigCreated object`)
      }

      return PerTypeConfigCreated.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return PerTypeConfigCreated.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<PerTypeConfigCreated> {
    const res = await fetchObjectBcs(client, id)
    if (!isPerTypeConfigCreated(res.type)) {
      throw new Error(`object at id ${id} is not a PerTypeConfigCreated object`)
    }

    return PerTypeConfigCreated.fromBcs(res.bcsBytes)
  }
}

/* ============================== PerTypeList =============================== */

export function isPerTypeList(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::deny_list::PerTypeList`
}

export interface PerTypeListFields {
  id: ToField<UID>
  /**
   * Number of object types that have been banned for a given address.
   * Used to quickly skip checks for most addresses.
   */
  deniedCount: ToField<Table<'address', 'u64'>>
  /**
   * Set of addresses that are banned for a given type.
   * For example with `sui::coin::Coin`: If addresses A and B are banned from using
   * "0...0123::my_coin::MY_COIN", this will be "0...0123::my_coin::MY_COIN" -> {A, B}.
   */
  deniedAddresses: ToField<Table<ToPhantom<Vector<'u8'>>, ToPhantom<VecSet<'address'>>>>
}

export type PerTypeListReified = Reified<PerTypeList, PerTypeListFields>

/** Stores the addresses that are denied for a given core type. */
export class PerTypeList implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::deny_list::PerTypeList` = `0x2::deny_list::PerTypeList` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName: typeof PerTypeList.$typeName = PerTypeList.$typeName
  readonly $fullTypeName: `0x2::deny_list::PerTypeList`
  readonly $typeArgs: []
  readonly $isPhantom: typeof PerTypeList.$isPhantom = PerTypeList.$isPhantom

  readonly id: ToField<UID>
  /**
   * Number of object types that have been banned for a given address.
   * Used to quickly skip checks for most addresses.
   */
  readonly deniedCount: ToField<Table<'address', 'u64'>>
  /**
   * Set of addresses that are banned for a given type.
   * For example with `sui::coin::Coin`: If addresses A and B are banned from using
   * "0...0123::my_coin::MY_COIN", this will be "0...0123::my_coin::MY_COIN" -> {A, B}.
   */
  readonly deniedAddresses: ToField<Table<ToPhantom<Vector<'u8'>>, ToPhantom<VecSet<'address'>>>>

  private constructor(typeArgs: [], fields: PerTypeListFields) {
    this.$fullTypeName = composeSuiType(
      PerTypeList.$typeName,
      ...typeArgs
    ) as `0x2::deny_list::PerTypeList`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.deniedCount = fields.deniedCount
    this.deniedAddresses = fields.deniedAddresses
  }

  static reified(): PerTypeListReified {
    const reifiedBcs = PerTypeList.bcs
    return {
      typeName: PerTypeList.$typeName,
      fullTypeName: composeSuiType(PerTypeList.$typeName, ...[]) as `0x2::deny_list::PerTypeList`,
      typeArgs: [] as [],
      isPhantom: PerTypeList.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => PerTypeList.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => PerTypeList.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => PerTypeList.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => PerTypeList.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => PerTypeList.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => PerTypeList.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => PerTypeList.fromSuiObjectData(content),
      fetch: async (client: SupportedSuiClient, id: string) => PerTypeList.fetch(client, id),
      new: (fields: PerTypeListFields) => {
        return new PerTypeList([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): PerTypeListReified {
    return PerTypeList.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<PerTypeList>> {
    return phantom(PerTypeList.reified())
  }

  static get p(): PhantomReified<ToTypeStr<PerTypeList>> {
    return PerTypeList.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('PerTypeList', {
      id: UID.bcs,
      denied_count: Table.bcs,
      denied_addresses: Table.bcs,
    })
  }

  private static cachedBcs: ReturnType<typeof PerTypeList.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof PerTypeList.instantiateBcs> {
    if (!PerTypeList.cachedBcs) {
      PerTypeList.cachedBcs = PerTypeList.instantiateBcs()
    }
    return PerTypeList.cachedBcs
  }

  static fromFields(fields: Record<string, any>): PerTypeList {
    return PerTypeList.reified().new({
      id: decodeFromFields(UID.reified(), fields.id),
      deniedCount: decodeFromFields(
        Table.reified(phantom('address'), phantom('u64')),
        fields.denied_count
      ),
      deniedAddresses: decodeFromFields(
        Table.reified(phantom(vector('u8')), phantom(VecSet.reified('address'))),
        fields.denied_addresses
      ),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): PerTypeList {
    if (!isPerTypeList(item.type)) {
      throw new Error('not a PerTypeList type')
    }

    return PerTypeList.reified().new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      deniedCount: decodeFromFieldsWithTypes(
        Table.reified(phantom('address'), phantom('u64')),
        item.fields.denied_count
      ),
      deniedAddresses: decodeFromFieldsWithTypes(
        Table.reified(phantom(vector('u8')), phantom(VecSet.reified('address'))),
        item.fields.denied_addresses
      ),
    })
  }

  static fromBcs(data: Uint8Array): PerTypeList {
    return PerTypeList.fromFields(PerTypeList.bcs.parse(data))
  }

  toJSONField(): Record<string, any> {
    return {
      id: this.id,
      deniedCount: this.deniedCount.toJSONField(),
      deniedAddresses: this.deniedAddresses.toJSONField(),
    }
  }

  toJSON(): Record<string, any> {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): PerTypeList {
    return PerTypeList.reified().new({
      id: decodeFromJSONField(UID.reified(), field.id),
      deniedCount: decodeFromJSONField(
        Table.reified(phantom('address'), phantom('u64')),
        field.deniedCount
      ),
      deniedAddresses: decodeFromJSONField(
        Table.reified(phantom(vector('u8')), phantom(VecSet.reified('address'))),
        field.deniedAddresses
      ),
    })
  }

  static fromJSON(json: Record<string, any>): PerTypeList {
    if (json.$typeName !== PerTypeList.$typeName) {
      throw new Error(
        `not a PerTypeList json object: expected '${PerTypeList.$typeName}' but got '${json.$typeName}'`
      )
    }

    return PerTypeList.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): PerTypeList {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isPerTypeList(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a PerTypeList object`)
    }
    return PerTypeList.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): PerTypeList {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isPerTypeList(data.bcs.type)) {
        throw new Error(`object at is not a PerTypeList object`)
      }

      return PerTypeList.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return PerTypeList.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<PerTypeList> {
    const res = await fetchObjectBcs(client, id)
    if (!isPerTypeList(res.type)) {
      throw new Error(`object at id ${id} is not a PerTypeList object`)
    }

    return PerTypeList.fromBcs(res.bcsBytes)
  }
}
