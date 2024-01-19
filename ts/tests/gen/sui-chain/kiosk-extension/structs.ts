import {
  ReifiedTypeArgument,
  ToField,
  assertFieldsWithTypesArgsMatch,
  assertReifiedTypeArgsMatch,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  extractType,
} from '../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../_framework/util'
import { Bag } from '../bag/structs'
import { bcs } from '@mysten/bcs'

/* ============================== Extension =============================== */

export function isExtension(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x2::kiosk_extension::Extension'
}

export interface ExtensionFields {
  storage: ToField<Bag>
  permissions: ToField<'u128'>
  isEnabled: ToField<'bool'>
}

export class Extension {
  static readonly $typeName = '0x2::kiosk_extension::Extension'
  static readonly $numTypeParams = 0

  readonly $typeName = Extension.$typeName

  static get bcs() {
    return bcs.struct('Extension', {
      storage: Bag.bcs,
      permissions: bcs.u128(),
      is_enabled: bcs.bool(),
    })
  }

  readonly storage: ToField<Bag>
  readonly permissions: ToField<'u128'>
  readonly isEnabled: ToField<'bool'>

  private constructor(fields: ExtensionFields) {
    this.storage = fields.storage
    this.permissions = fields.permissions
    this.isEnabled = fields.isEnabled
  }

  static new(fields: ExtensionFields): Extension {
    return new Extension(fields)
  }

  static reified() {
    return {
      typeName: Extension.$typeName,
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => Extension.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Extension.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => Extension.fromBcs(data),
      bcs: Extension.bcs,
      fromJSONField: (field: any) => Extension.fromJSONField(field),
      __class: null as unknown as ReturnType<typeof Extension.new>,
    }
  }

  static fromFields(fields: Record<string, any>): Extension {
    return Extension.new({
      storage: decodeFromFields(Bag.reified(), fields.storage),
      permissions: decodeFromFields('u128', fields.permissions),
      isEnabled: decodeFromFields('bool', fields.is_enabled),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Extension {
    if (!isExtension(item.type)) {
      throw new Error('not a Extension type')
    }

    return Extension.new({
      storage: decodeFromFieldsWithTypes(Bag.reified(), item.fields.storage),
      permissions: decodeFromFieldsWithTypes('u128', item.fields.permissions),
      isEnabled: decodeFromFieldsWithTypes('bool', item.fields.is_enabled),
    })
  }

  static fromBcs(data: Uint8Array): Extension {
    return Extension.fromFields(Extension.bcs.parse(data))
  }

  toJSONField() {
    return {
      storage: this.storage.toJSONField(),
      permissions: this.permissions.toString(),
      isEnabled: this.isEnabled,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, ...this.toJSONField() }
  }

  static fromJSONField(field: any): Extension {
    return Extension.new({
      storage: decodeFromJSONField(Bag.reified(), field.storage),
      permissions: decodeFromJSONField('u128', field.permissions),
      isEnabled: decodeFromJSONField('bool', field.isEnabled),
    })
  }

  static fromJSON(json: Record<string, any>): Extension {
    if (json.$typeName !== Extension.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return Extension.fromJSONField(json)
  }
}

/* ============================== ExtensionKey =============================== */

export function isExtensionKey(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::kiosk_extension::ExtensionKey<')
}

export interface ExtensionKeyFields {
  dummyField: ToField<'bool'>
}

export class ExtensionKey {
  static readonly $typeName = '0x2::kiosk_extension::ExtensionKey'
  static readonly $numTypeParams = 1

  readonly $typeName = ExtensionKey.$typeName

  static get bcs() {
    return bcs.struct('ExtensionKey', {
      dummy_field: bcs.bool(),
    })
  }

  readonly $typeArg: string

  readonly dummyField: ToField<'bool'>

  private constructor(typeArg: string, dummyField: ToField<'bool'>) {
    this.$typeArg = typeArg

    this.dummyField = dummyField
  }

  static new(typeArg: ReifiedTypeArgument, dummyField: ToField<'bool'>): ExtensionKey {
    return new ExtensionKey(extractType(typeArg), dummyField)
  }

  static reified(T0: ReifiedTypeArgument) {
    return {
      typeName: ExtensionKey.$typeName,
      typeArgs: [T0],
      fromFields: (fields: Record<string, any>) => ExtensionKey.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => ExtensionKey.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => ExtensionKey.fromBcs(T0, data),
      bcs: ExtensionKey.bcs,
      fromJSONField: (field: any) => ExtensionKey.fromJSONField(T0, field),
      __class: null as unknown as ReturnType<typeof ExtensionKey.new>,
    }
  }

  static fromFields(typeArg: ReifiedTypeArgument, fields: Record<string, any>): ExtensionKey {
    return ExtensionKey.new(typeArg, decodeFromFields('bool', fields.dummy_field))
  }

  static fromFieldsWithTypes(typeArg: ReifiedTypeArgument, item: FieldsWithTypes): ExtensionKey {
    if (!isExtensionKey(item.type)) {
      throw new Error('not a ExtensionKey type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return ExtensionKey.new(typeArg, decodeFromFieldsWithTypes('bool', item.fields.dummy_field))
  }

  static fromBcs(typeArg: ReifiedTypeArgument, data: Uint8Array): ExtensionKey {
    return ExtensionKey.fromFields(typeArg, ExtensionKey.bcs.parse(data))
  }

  toJSONField() {
    return {
      dummyField: this.dummyField,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArg: this.$typeArg, ...this.toJSONField() }
  }

  static fromJSONField(typeArg: ReifiedTypeArgument, field: any): ExtensionKey {
    return ExtensionKey.new(typeArg, decodeFromJSONField('bool', field.dummyField))
  }

  static fromJSON(typeArg: ReifiedTypeArgument, json: Record<string, any>): ExtensionKey {
    if (json.$typeName !== ExtensionKey.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(ExtensionKey.$typeName, extractType(typeArg)),
      [json.$typeArg],
      [typeArg]
    )

    return ExtensionKey.fromJSONField(typeArg, json)
  }
}
