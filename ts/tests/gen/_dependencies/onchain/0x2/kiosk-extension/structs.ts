import { FieldsWithTypes, Type, compressSuiType, parseTypeName } from '../../../../_framework/util'
import { Bag } from '../bag/structs'
import { bcs } from '@mysten/bcs'

/* ============================== Extension =============================== */

export function isExtension(type: Type): boolean {
  type = compressSuiType(type)
  return type === '0x2::kiosk_extension::Extension'
}

export interface ExtensionFields {
  storage: Bag
  permissions: bigint
  isEnabled: boolean
}

export class Extension {
  static readonly $typeName = '0x2::kiosk_extension::Extension'
  static readonly $numTypeParams = 0

  static get bcs() {
    return bcs.struct('Extension', {
      storage: Bag.bcs,
      permissions: bcs.u128(),
      is_enabled: bcs.bool(),
    })
  }

  readonly storage: Bag
  readonly permissions: bigint
  readonly isEnabled: boolean

  constructor(fields: ExtensionFields) {
    this.storage = fields.storage
    this.permissions = fields.permissions
    this.isEnabled = fields.isEnabled
  }

  static fromFields(fields: Record<string, any>): Extension {
    return new Extension({
      storage: Bag.fromFields(fields.storage),
      permissions: BigInt(fields.permissions),
      isEnabled: fields.is_enabled,
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Extension {
    if (!isExtension(item.type)) {
      throw new Error('not a Extension type')
    }
    return new Extension({
      storage: Bag.fromFieldsWithTypes(item.fields.storage),
      permissions: BigInt(item.fields.permissions),
      isEnabled: item.fields.is_enabled,
    })
  }

  static fromBcs(data: Uint8Array): Extension {
    return Extension.fromFields(Extension.bcs.parse(data))
  }
}

/* ============================== ExtensionKey =============================== */

export function isExtensionKey(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::kiosk_extension::ExtensionKey<')
}

export interface ExtensionKeyFields {
  dummyField: boolean
}

export class ExtensionKey {
  static readonly $typeName = '0x2::kiosk_extension::ExtensionKey'
  static readonly $numTypeParams = 1

  static get bcs() {
    return bcs.struct('ExtensionKey', {
      dummy_field: bcs.bool(),
    })
  }

  readonly $typeArg: Type

  readonly dummyField: boolean

  constructor(typeArg: Type, dummyField: boolean) {
    this.$typeArg = typeArg

    this.dummyField = dummyField
  }

  static fromFields(typeArg: Type, fields: Record<string, any>): ExtensionKey {
    return new ExtensionKey(typeArg, fields.dummy_field)
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): ExtensionKey {
    if (!isExtensionKey(item.type)) {
      throw new Error('not a ExtensionKey type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new ExtensionKey(typeArgs[0], item.fields.dummy_field)
  }

  static fromBcs(typeArg: Type, data: Uint8Array): ExtensionKey {
    return ExtensionKey.fromFields(typeArg, ExtensionKey.bcs.parse(data))
  }
}
