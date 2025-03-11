import * as reified from '../../_framework/reified'
import {
  PhantomReified,
  Reified,
  StructClass,
  ToField,
  ToTypeStr,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  fieldToJSON,
  phantom,
  ToTypeStr as ToPhantom,
} from '../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../_framework/util'
import { Vector } from '../../_framework/vector'
import { Bag } from '../bag/structs'
import { PKG_V27 } from '../index'
import { ID, UID } from '../object/structs'
import { Table } from '../table/structs'
import { VecSet } from '../vec-set/structs'
import { bcs } from '@mysten/sui/bcs'
import { SuiClient, SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromB64, fromHEX, toHEX } from '@mysten/sui/utils'

/* ============================== DenyList =============================== */

export function isDenyList(type: string): boolean {
  type = compressSuiType(type)
  return type === `${PKG_V27}::deny_list::DenyList`
}

export interface DenyListFields {
  id: ToField<UID>
  lists: ToField<Bag>
}

export type DenyListReified = Reified<DenyList, DenyListFields>

export class DenyList implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `${PKG_V27}::deny_list::DenyList`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = DenyList.$typeName
  readonly $fullTypeName: `${typeof PKG_V27}::deny_list::DenyList`
  readonly $typeArgs: []
  readonly $isPhantom = DenyList.$isPhantom

  readonly id: ToField<UID>
  readonly lists: ToField<Bag>

  private constructor(typeArgs: [], fields: DenyListFields) {
    this.$fullTypeName = composeSuiType(
      DenyList.$typeName,
      ...typeArgs
    ) as `${typeof PKG_V27}::deny_list::DenyList`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.lists = fields.lists
  }

  static reified(): DenyListReified {
    return {
      typeName: DenyList.$typeName,
      fullTypeName: composeSuiType(
        DenyList.$typeName,
        ...[]
      ) as `${typeof PKG_V27}::deny_list::DenyList`,
      typeArgs: [] as [],
      isPhantom: DenyList.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => DenyList.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => DenyList.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => DenyList.fromBcs(data),
      bcs: DenyList.bcs,
      fromJSONField: (field: any) => DenyList.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => DenyList.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => DenyList.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => DenyList.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => DenyList.fetch(client, id),
      new: (fields: DenyListFields) => {
        return new DenyList([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return DenyList.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<DenyList>> {
    return phantom(DenyList.reified())
  }
  static get p() {
    return DenyList.phantom()
  }

  static get bcs() {
    return bcs.struct('DenyList', {
      id: UID.bcs,
      lists: Bag.bcs,
    })
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

  toJSONField() {
    return {
      id: this.id,
      lists: this.lists.toJSONField(),
    }
  }

  toJSON() {
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
      throw new Error('not a WithTwoGenerics json object')
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

      return DenyList.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return DenyList.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<DenyList> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching DenyList object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isDenyList(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a DenyList object`)
    }

    return DenyList.fromSuiObjectData(res.data)
  }
}

/* ============================== ConfigWriteCap =============================== */

export function isConfigWriteCap(type: string): boolean {
  type = compressSuiType(type)
  return type === `${PKG_V27}::deny_list::ConfigWriteCap`
}

export interface ConfigWriteCapFields {
  dummyField: ToField<'bool'>
}

export type ConfigWriteCapReified = Reified<ConfigWriteCap, ConfigWriteCapFields>

export class ConfigWriteCap implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `${PKG_V27}::deny_list::ConfigWriteCap`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = ConfigWriteCap.$typeName
  readonly $fullTypeName: `${typeof PKG_V27}::deny_list::ConfigWriteCap`
  readonly $typeArgs: []
  readonly $isPhantom = ConfigWriteCap.$isPhantom

  readonly dummyField: ToField<'bool'>

  private constructor(typeArgs: [], fields: ConfigWriteCapFields) {
    this.$fullTypeName = composeSuiType(
      ConfigWriteCap.$typeName,
      ...typeArgs
    ) as `${typeof PKG_V27}::deny_list::ConfigWriteCap`
    this.$typeArgs = typeArgs

    this.dummyField = fields.dummyField
  }

  static reified(): ConfigWriteCapReified {
    return {
      typeName: ConfigWriteCap.$typeName,
      fullTypeName: composeSuiType(
        ConfigWriteCap.$typeName,
        ...[]
      ) as `${typeof PKG_V27}::deny_list::ConfigWriteCap`,
      typeArgs: [] as [],
      isPhantom: ConfigWriteCap.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => ConfigWriteCap.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => ConfigWriteCap.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => ConfigWriteCap.fromBcs(data),
      bcs: ConfigWriteCap.bcs,
      fromJSONField: (field: any) => ConfigWriteCap.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => ConfigWriteCap.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => ConfigWriteCap.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => ConfigWriteCap.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => ConfigWriteCap.fetch(client, id),
      new: (fields: ConfigWriteCapFields) => {
        return new ConfigWriteCap([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return ConfigWriteCap.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<ConfigWriteCap>> {
    return phantom(ConfigWriteCap.reified())
  }
  static get p() {
    return ConfigWriteCap.phantom()
  }

  static get bcs() {
    return bcs.struct('ConfigWriteCap', {
      dummy_field: bcs.bool(),
    })
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

  toJSONField() {
    return {
      dummyField: this.dummyField,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): ConfigWriteCap {
    return ConfigWriteCap.reified().new({
      dummyField: decodeFromJSONField('bool', field.dummyField),
    })
  }

  static fromJSON(json: Record<string, any>): ConfigWriteCap {
    if (json.$typeName !== ConfigWriteCap.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
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

      return ConfigWriteCap.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return ConfigWriteCap.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<ConfigWriteCap> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching ConfigWriteCap object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isConfigWriteCap(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a ConfigWriteCap object`)
    }

    return ConfigWriteCap.fromSuiObjectData(res.data)
  }
}

/* ============================== ConfigKey =============================== */

export function isConfigKey(type: string): boolean {
  type = compressSuiType(type)
  return type === `${PKG_V27}::deny_list::ConfigKey`
}

export interface ConfigKeyFields {
  perTypeIndex: ToField<'u64'>
  perTypeKey: ToField<Vector<'u8'>>
}

export type ConfigKeyReified = Reified<ConfigKey, ConfigKeyFields>

export class ConfigKey implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `${PKG_V27}::deny_list::ConfigKey`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = ConfigKey.$typeName
  readonly $fullTypeName: `${typeof PKG_V27}::deny_list::ConfigKey`
  readonly $typeArgs: []
  readonly $isPhantom = ConfigKey.$isPhantom

  readonly perTypeIndex: ToField<'u64'>
  readonly perTypeKey: ToField<Vector<'u8'>>

  private constructor(typeArgs: [], fields: ConfigKeyFields) {
    this.$fullTypeName = composeSuiType(
      ConfigKey.$typeName,
      ...typeArgs
    ) as `${typeof PKG_V27}::deny_list::ConfigKey`
    this.$typeArgs = typeArgs

    this.perTypeIndex = fields.perTypeIndex
    this.perTypeKey = fields.perTypeKey
  }

  static reified(): ConfigKeyReified {
    return {
      typeName: ConfigKey.$typeName,
      fullTypeName: composeSuiType(
        ConfigKey.$typeName,
        ...[]
      ) as `${typeof PKG_V27}::deny_list::ConfigKey`,
      typeArgs: [] as [],
      isPhantom: ConfigKey.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => ConfigKey.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => ConfigKey.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => ConfigKey.fromBcs(data),
      bcs: ConfigKey.bcs,
      fromJSONField: (field: any) => ConfigKey.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => ConfigKey.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => ConfigKey.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => ConfigKey.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => ConfigKey.fetch(client, id),
      new: (fields: ConfigKeyFields) => {
        return new ConfigKey([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return ConfigKey.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<ConfigKey>> {
    return phantom(ConfigKey.reified())
  }
  static get p() {
    return ConfigKey.phantom()
  }

  static get bcs() {
    return bcs.struct('ConfigKey', {
      per_type_index: bcs.u64(),
      per_type_key: bcs.vector(bcs.u8()),
    })
  }

  static fromFields(fields: Record<string, any>): ConfigKey {
    return ConfigKey.reified().new({
      perTypeIndex: decodeFromFields('u64', fields.per_type_index),
      perTypeKey: decodeFromFields(reified.vector('u8'), fields.per_type_key),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): ConfigKey {
    if (!isConfigKey(item.type)) {
      throw new Error('not a ConfigKey type')
    }

    return ConfigKey.reified().new({
      perTypeIndex: decodeFromFieldsWithTypes('u64', item.fields.per_type_index),
      perTypeKey: decodeFromFieldsWithTypes(reified.vector('u8'), item.fields.per_type_key),
    })
  }

  static fromBcs(data: Uint8Array): ConfigKey {
    return ConfigKey.fromFields(ConfigKey.bcs.parse(data))
  }

  toJSONField() {
    return {
      perTypeIndex: this.perTypeIndex.toString(),
      perTypeKey: fieldToJSON<Vector<'u8'>>(`vector<u8>`, this.perTypeKey),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): ConfigKey {
    return ConfigKey.reified().new({
      perTypeIndex: decodeFromJSONField('u64', field.perTypeIndex),
      perTypeKey: decodeFromJSONField(reified.vector('u8'), field.perTypeKey),
    })
  }

  static fromJSON(json: Record<string, any>): ConfigKey {
    if (json.$typeName !== ConfigKey.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
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

      return ConfigKey.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return ConfigKey.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<ConfigKey> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching ConfigKey object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isConfigKey(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a ConfigKey object`)
    }

    return ConfigKey.fromSuiObjectData(res.data)
  }
}

/* ============================== AddressKey =============================== */

export function isAddressKey(type: string): boolean {
  type = compressSuiType(type)
  return type === `${PKG_V27}::deny_list::AddressKey`
}

export interface AddressKeyFields {
  pos0: ToField<'address'>
}

export type AddressKeyReified = Reified<AddressKey, AddressKeyFields>

export class AddressKey implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `${PKG_V27}::deny_list::AddressKey`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = AddressKey.$typeName
  readonly $fullTypeName: `${typeof PKG_V27}::deny_list::AddressKey`
  readonly $typeArgs: []
  readonly $isPhantom = AddressKey.$isPhantom

  readonly pos0: ToField<'address'>

  private constructor(typeArgs: [], fields: AddressKeyFields) {
    this.$fullTypeName = composeSuiType(
      AddressKey.$typeName,
      ...typeArgs
    ) as `${typeof PKG_V27}::deny_list::AddressKey`
    this.$typeArgs = typeArgs

    this.pos0 = fields.pos0
  }

  static reified(): AddressKeyReified {
    return {
      typeName: AddressKey.$typeName,
      fullTypeName: composeSuiType(
        AddressKey.$typeName,
        ...[]
      ) as `${typeof PKG_V27}::deny_list::AddressKey`,
      typeArgs: [] as [],
      isPhantom: AddressKey.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => AddressKey.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => AddressKey.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => AddressKey.fromBcs(data),
      bcs: AddressKey.bcs,
      fromJSONField: (field: any) => AddressKey.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => AddressKey.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => AddressKey.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => AddressKey.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => AddressKey.fetch(client, id),
      new: (fields: AddressKeyFields) => {
        return new AddressKey([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return AddressKey.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<AddressKey>> {
    return phantom(AddressKey.reified())
  }
  static get p() {
    return AddressKey.phantom()
  }

  static get bcs() {
    return bcs.struct('AddressKey', {
      pos0: bcs.bytes(32).transform({
        input: (val: string) => fromHEX(val),
        output: (val: Uint8Array) => toHEX(val),
      }),
    })
  }

  static fromFields(fields: Record<string, any>): AddressKey {
    return AddressKey.reified().new({ pos0: decodeFromFields('address', fields.pos0) })
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

  toJSONField() {
    return {
      pos0: this.pos0,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): AddressKey {
    return AddressKey.reified().new({ pos0: decodeFromJSONField('address', field.pos0) })
  }

  static fromJSON(json: Record<string, any>): AddressKey {
    if (json.$typeName !== AddressKey.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
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

      return AddressKey.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return AddressKey.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<AddressKey> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching AddressKey object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isAddressKey(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a AddressKey object`)
    }

    return AddressKey.fromSuiObjectData(res.data)
  }
}

/* ============================== GlobalPauseKey =============================== */

export function isGlobalPauseKey(type: string): boolean {
  type = compressSuiType(type)
  return type === `${PKG_V27}::deny_list::GlobalPauseKey`
}

export interface GlobalPauseKeyFields {
  dummyField: ToField<'bool'>
}

export type GlobalPauseKeyReified = Reified<GlobalPauseKey, GlobalPauseKeyFields>

export class GlobalPauseKey implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `${PKG_V27}::deny_list::GlobalPauseKey`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = GlobalPauseKey.$typeName
  readonly $fullTypeName: `${typeof PKG_V27}::deny_list::GlobalPauseKey`
  readonly $typeArgs: []
  readonly $isPhantom = GlobalPauseKey.$isPhantom

  readonly dummyField: ToField<'bool'>

  private constructor(typeArgs: [], fields: GlobalPauseKeyFields) {
    this.$fullTypeName = composeSuiType(
      GlobalPauseKey.$typeName,
      ...typeArgs
    ) as `${typeof PKG_V27}::deny_list::GlobalPauseKey`
    this.$typeArgs = typeArgs

    this.dummyField = fields.dummyField
  }

  static reified(): GlobalPauseKeyReified {
    return {
      typeName: GlobalPauseKey.$typeName,
      fullTypeName: composeSuiType(
        GlobalPauseKey.$typeName,
        ...[]
      ) as `${typeof PKG_V27}::deny_list::GlobalPauseKey`,
      typeArgs: [] as [],
      isPhantom: GlobalPauseKey.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => GlobalPauseKey.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => GlobalPauseKey.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => GlobalPauseKey.fromBcs(data),
      bcs: GlobalPauseKey.bcs,
      fromJSONField: (field: any) => GlobalPauseKey.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => GlobalPauseKey.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => GlobalPauseKey.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => GlobalPauseKey.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => GlobalPauseKey.fetch(client, id),
      new: (fields: GlobalPauseKeyFields) => {
        return new GlobalPauseKey([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return GlobalPauseKey.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<GlobalPauseKey>> {
    return phantom(GlobalPauseKey.reified())
  }
  static get p() {
    return GlobalPauseKey.phantom()
  }

  static get bcs() {
    return bcs.struct('GlobalPauseKey', {
      dummy_field: bcs.bool(),
    })
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

  toJSONField() {
    return {
      dummyField: this.dummyField,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): GlobalPauseKey {
    return GlobalPauseKey.reified().new({
      dummyField: decodeFromJSONField('bool', field.dummyField),
    })
  }

  static fromJSON(json: Record<string, any>): GlobalPauseKey {
    if (json.$typeName !== GlobalPauseKey.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
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

      return GlobalPauseKey.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return GlobalPauseKey.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<GlobalPauseKey> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching GlobalPauseKey object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isGlobalPauseKey(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a GlobalPauseKey object`)
    }

    return GlobalPauseKey.fromSuiObjectData(res.data)
  }
}

/* ============================== PerTypeConfigCreated =============================== */

export function isPerTypeConfigCreated(type: string): boolean {
  type = compressSuiType(type)
  return type === `${PKG_V27}::deny_list::PerTypeConfigCreated`
}

export interface PerTypeConfigCreatedFields {
  key: ToField<ConfigKey>
  configId: ToField<ID>
}

export type PerTypeConfigCreatedReified = Reified<PerTypeConfigCreated, PerTypeConfigCreatedFields>

export class PerTypeConfigCreated implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `${PKG_V27}::deny_list::PerTypeConfigCreated`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = PerTypeConfigCreated.$typeName
  readonly $fullTypeName: `${typeof PKG_V27}::deny_list::PerTypeConfigCreated`
  readonly $typeArgs: []
  readonly $isPhantom = PerTypeConfigCreated.$isPhantom

  readonly key: ToField<ConfigKey>
  readonly configId: ToField<ID>

  private constructor(typeArgs: [], fields: PerTypeConfigCreatedFields) {
    this.$fullTypeName = composeSuiType(
      PerTypeConfigCreated.$typeName,
      ...typeArgs
    ) as `${typeof PKG_V27}::deny_list::PerTypeConfigCreated`
    this.$typeArgs = typeArgs

    this.key = fields.key
    this.configId = fields.configId
  }

  static reified(): PerTypeConfigCreatedReified {
    return {
      typeName: PerTypeConfigCreated.$typeName,
      fullTypeName: composeSuiType(
        PerTypeConfigCreated.$typeName,
        ...[]
      ) as `${typeof PKG_V27}::deny_list::PerTypeConfigCreated`,
      typeArgs: [] as [],
      isPhantom: PerTypeConfigCreated.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => PerTypeConfigCreated.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        PerTypeConfigCreated.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => PerTypeConfigCreated.fromBcs(data),
      bcs: PerTypeConfigCreated.bcs,
      fromJSONField: (field: any) => PerTypeConfigCreated.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => PerTypeConfigCreated.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) =>
        PerTypeConfigCreated.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) =>
        PerTypeConfigCreated.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => PerTypeConfigCreated.fetch(client, id),
      new: (fields: PerTypeConfigCreatedFields) => {
        return new PerTypeConfigCreated([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return PerTypeConfigCreated.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<PerTypeConfigCreated>> {
    return phantom(PerTypeConfigCreated.reified())
  }
  static get p() {
    return PerTypeConfigCreated.phantom()
  }

  static get bcs() {
    return bcs.struct('PerTypeConfigCreated', {
      key: ConfigKey.bcs,
      config_id: ID.bcs,
    })
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

  toJSONField() {
    return {
      key: this.key.toJSONField(),
      configId: this.configId,
    }
  }

  toJSON() {
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
      throw new Error('not a WithTwoGenerics json object')
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

      return PerTypeConfigCreated.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return PerTypeConfigCreated.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<PerTypeConfigCreated> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching PerTypeConfigCreated object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isPerTypeConfigCreated(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a PerTypeConfigCreated object`)
    }

    return PerTypeConfigCreated.fromSuiObjectData(res.data)
  }
}

/* ============================== PerTypeList =============================== */

export function isPerTypeList(type: string): boolean {
  type = compressSuiType(type)
  return type === `${PKG_V27}::deny_list::PerTypeList`
}

export interface PerTypeListFields {
  id: ToField<UID>
  deniedCount: ToField<Table<'address', 'u64'>>
  deniedAddresses: ToField<Table<ToPhantom<Vector<'u8'>>, ToPhantom<VecSet<'address'>>>>
}

export type PerTypeListReified = Reified<PerTypeList, PerTypeListFields>

export class PerTypeList implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `${PKG_V27}::deny_list::PerTypeList`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = PerTypeList.$typeName
  readonly $fullTypeName: `${typeof PKG_V27}::deny_list::PerTypeList`
  readonly $typeArgs: []
  readonly $isPhantom = PerTypeList.$isPhantom

  readonly id: ToField<UID>
  readonly deniedCount: ToField<Table<'address', 'u64'>>
  readonly deniedAddresses: ToField<Table<ToPhantom<Vector<'u8'>>, ToPhantom<VecSet<'address'>>>>

  private constructor(typeArgs: [], fields: PerTypeListFields) {
    this.$fullTypeName = composeSuiType(
      PerTypeList.$typeName,
      ...typeArgs
    ) as `${typeof PKG_V27}::deny_list::PerTypeList`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.deniedCount = fields.deniedCount
    this.deniedAddresses = fields.deniedAddresses
  }

  static reified(): PerTypeListReified {
    return {
      typeName: PerTypeList.$typeName,
      fullTypeName: composeSuiType(
        PerTypeList.$typeName,
        ...[]
      ) as `${typeof PKG_V27}::deny_list::PerTypeList`,
      typeArgs: [] as [],
      isPhantom: PerTypeList.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => PerTypeList.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => PerTypeList.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => PerTypeList.fromBcs(data),
      bcs: PerTypeList.bcs,
      fromJSONField: (field: any) => PerTypeList.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => PerTypeList.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => PerTypeList.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => PerTypeList.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => PerTypeList.fetch(client, id),
      new: (fields: PerTypeListFields) => {
        return new PerTypeList([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return PerTypeList.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<PerTypeList>> {
    return phantom(PerTypeList.reified())
  }
  static get p() {
    return PerTypeList.phantom()
  }

  static get bcs() {
    return bcs.struct('PerTypeList', {
      id: UID.bcs,
      denied_count: Table.bcs,
      denied_addresses: Table.bcs,
    })
  }

  static fromFields(fields: Record<string, any>): PerTypeList {
    return PerTypeList.reified().new({
      id: decodeFromFields(UID.reified(), fields.id),
      deniedCount: decodeFromFields(
        Table.reified(reified.phantom('address'), reified.phantom('u64')),
        fields.denied_count
      ),
      deniedAddresses: decodeFromFields(
        Table.reified(
          reified.phantom(reified.vector('u8')),
          reified.phantom(VecSet.reified('address'))
        ),
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
        Table.reified(reified.phantom('address'), reified.phantom('u64')),
        item.fields.denied_count
      ),
      deniedAddresses: decodeFromFieldsWithTypes(
        Table.reified(
          reified.phantom(reified.vector('u8')),
          reified.phantom(VecSet.reified('address'))
        ),
        item.fields.denied_addresses
      ),
    })
  }

  static fromBcs(data: Uint8Array): PerTypeList {
    return PerTypeList.fromFields(PerTypeList.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
      deniedCount: this.deniedCount.toJSONField(),
      deniedAddresses: this.deniedAddresses.toJSONField(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): PerTypeList {
    return PerTypeList.reified().new({
      id: decodeFromJSONField(UID.reified(), field.id),
      deniedCount: decodeFromJSONField(
        Table.reified(reified.phantom('address'), reified.phantom('u64')),
        field.deniedCount
      ),
      deniedAddresses: decodeFromJSONField(
        Table.reified(
          reified.phantom(reified.vector('u8')),
          reified.phantom(VecSet.reified('address'))
        ),
        field.deniedAddresses
      ),
    })
  }

  static fromJSON(json: Record<string, any>): PerTypeList {
    if (json.$typeName !== PerTypeList.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
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

      return PerTypeList.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return PerTypeList.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<PerTypeList> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching PerTypeList object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isPerTypeList(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a PerTypeList object`)
    }

    return PerTypeList.fromSuiObjectData(res.data)
  }
}
