import {
  ReifiedTypeArgument,
  ToField,
  assertFieldsWithTypesArgsMatch,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  extractType,
} from '../../_framework/reified'
import { FieldsWithTypes, compressSuiType } from '../../_framework/util'
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

  toJSON() {
    return {
      storage: this.storage.toJSON(),
      permissions: this.permissions.toString(),
      isEnabled: this.isEnabled,
    }
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

  static reified(Ext: ReifiedTypeArgument) {
    return {
      typeName: ExtensionKey.$typeName,
      typeArgs: [Ext],
      fromFields: (fields: Record<string, any>) => ExtensionKey.fromFields(Ext, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => ExtensionKey.fromFieldsWithTypes(Ext, item),
      fromBcs: (data: Uint8Array) => ExtensionKey.fromBcs(Ext, data),
      bcs: ExtensionKey.bcs,
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

  toJSON() {
    return {
      $typeArg: this.$typeArg,
      dummyField: this.dummyField,
    }
  }
}
