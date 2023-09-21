import { bcsOnchain as bcs } from '../../../../_framework/bcs'
import { FieldsWithTypes, Type, parseTypeName } from '../../../../_framework/util'
import { Bag } from '../bag/structs'
import { Encoding } from '@mysten/bcs'

/* ============================== Extension =============================== */

bcs.registerStructType('0x2::kiosk_extension::Extension', {
  storage: `0x2::bag::Bag`,
  permissions: `u128`,
  is_enabled: `bool`,
})

export function isExtension(type: Type): boolean {
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

  static fromBcs(data: Uint8Array | string, encoding?: Encoding): Extension {
    return Extension.fromFields(bcs.de([Extension.$typeName], data, encoding))
  }
}

/* ============================== ExtensionKey =============================== */

bcs.registerStructType('0x2::kiosk_extension::ExtensionKey<T0>', {
  dummy_field: `bool`,
})

export function isExtensionKey(type: Type): boolean {
  return type.startsWith('0x2::kiosk_extension::ExtensionKey<')
}

export interface ExtensionKeyFields {
  dummyField: boolean
}

export class ExtensionKey {
  static readonly $typeName = '0x2::kiosk_extension::ExtensionKey'
  static readonly $numTypeParams = 1

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

  static fromBcs(typeArg: Type, data: Uint8Array | string, encoding?: Encoding): ExtensionKey {
    return ExtensionKey.fromFields(
      typeArg,
      bcs.de([ExtensionKey.$typeName, typeArg], data, encoding)
    )
  }
}
