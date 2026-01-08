/**
 * This module implements the Kiosk Extensions functionality. It allows
 * exposing previously protected (only-owner) methods to third-party apps.
 *
 * A Kiosk Extension is a module that implements any functionality on top of
 * the `Kiosk` without discarding nor blocking the base. Given that `Kiosk`
 * itself is a trading primitive, most of the extensions are expected to be
 * related to trading. However, there's no limit to what can be built using the
 * `kiosk_extension` module, as it gives certain benefits such as using `Kiosk`
 * as the storage for any type of data / assets.
 *
 * ### Flow:
 * - An extension can only be installed by the Kiosk Owner and requires an
 * authorization via the `KioskOwnerCap`.
 * - When installed, the extension is given a permission bitmap that allows it
 * to perform certain protected actions (eg `place`, `lock`). However, it is
 * possible to install an extension that does not have any permissions.
 * - Kiosk Owner can `disable` the extension at any time, which prevents it
 * from performing any protected actions. The storage is still available to the
 * extension until it is completely removed.
 * - A disabled extension can be `enable`d at any time giving the permissions
 * back to the extension.
 * - An extension permissions follow the all-or-nothing policy. Either all of
 * the requested permissions are granted or none of them (can't install).
 *
 * ### Examples:
 * - An Auction extension can utilize the storage to store Auction-related data
 * while utilizing the same `Kiosk` object that the items are stored in.
 * - A Marketplace extension that implements custom events and fees for the
 * default trading functionality.
 *
 * ### Notes:
 * - Trading functionality can utilize the `PurchaseCap` to build a custom
 * logic around the purchase flow. However, it should be carefully managed to
 * prevent asset locking.
 * - `kiosk_extension` is a friend module to `kiosk` and has access to its
 * internal functions (such as `place_internal` and `lock_internal` to
 * implement custom authorization scheme for `place` and `lock` respectively).
 */

import {
  PhantomReified,
  PhantomToTypeStr,
  PhantomTypeArgument,
  Reified,
  StructClass,
  ToField,
  ToPhantomTypeArgument,
  ToTypeStr,
  assertFieldsWithTypesArgsMatch,
  assertReifiedTypeArgsMatch,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  extractType,
  phantom,
} from '../../_framework/reified'
import {
  FieldsWithTypes,
  composeSuiType,
  compressSuiType,
  parseTypeName,
} from '../../_framework/util'
import { Bag } from '../bag/structs'
import { bcs } from '@mysten/sui/bcs'
import { SuiClient, SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromBase64 } from '@mysten/sui/utils'

/* ============================== Extension =============================== */

export function isExtension(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::kiosk_extension::Extension`
}

export interface ExtensionFields {
  /**
   * Storage for the extension, an isolated Bag. By putting the extension
   * into a single dynamic field, we reduce the amount of fields on the
   * top level (eg items / listings) while giving extension developers
   * the ability to store any data they want.
   */
  storage: ToField<Bag>
  /**
   * Bitmap of permissions that the extension has (can be revoked any
   * moment). It's all or nothing policy - either the extension has the
   * required permissions or no permissions at all.
   *
   * 1st bit - `place` - allows to place items for sale
   * 2nd bit - `lock` and `place` - allows to lock items (and place)
   *
   * For example:
   * - `10` - allows to place items and lock them.
   * - `11` - allows to place items and lock them (`lock` includes `place`).
   * - `01` - allows to place items, but not lock them.
   * - `00` - no permissions.
   */
  permissions: ToField<'u128'>
  /**
   * Whether the extension can call protected actions. By default, all
   * extensions are enabled (on `add` call), however the Kiosk
   * owner can disable them at any time.
   *
   * Disabling the extension does not limit its access to the storage.
   */
  isEnabled: ToField<'bool'>
}

export type ExtensionReified = Reified<Extension, ExtensionFields>

/**
 * The Extension struct contains the data used by the extension and the
 * configuration for this extension. Stored under the `ExtensionKey`
 * dynamic field.
 */
export class Extension implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::kiosk_extension::Extension` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = Extension.$typeName
  readonly $fullTypeName: `0x2::kiosk_extension::Extension`
  readonly $typeArgs: []
  readonly $isPhantom = Extension.$isPhantom

  /**
   * Storage for the extension, an isolated Bag. By putting the extension
   * into a single dynamic field, we reduce the amount of fields on the
   * top level (eg items / listings) while giving extension developers
   * the ability to store any data they want.
   */
  readonly storage: ToField<Bag>
  /**
   * Bitmap of permissions that the extension has (can be revoked any
   * moment). It's all or nothing policy - either the extension has the
   * required permissions or no permissions at all.
   *
   * 1st bit - `place` - allows to place items for sale
   * 2nd bit - `lock` and `place` - allows to lock items (and place)
   *
   * For example:
   * - `10` - allows to place items and lock them.
   * - `11` - allows to place items and lock them (`lock` includes `place`).
   * - `01` - allows to place items, but not lock them.
   * - `00` - no permissions.
   */
  readonly permissions: ToField<'u128'>
  /**
   * Whether the extension can call protected actions. By default, all
   * extensions are enabled (on `add` call), however the Kiosk
   * owner can disable them at any time.
   *
   * Disabling the extension does not limit its access to the storage.
   */
  readonly isEnabled: ToField<'bool'>

  private constructor(typeArgs: [], fields: ExtensionFields) {
    this.$fullTypeName = composeSuiType(
      Extension.$typeName,
      ...typeArgs
    ) as `0x2::kiosk_extension::Extension`
    this.$typeArgs = typeArgs

    this.storage = fields.storage
    this.permissions = fields.permissions
    this.isEnabled = fields.isEnabled
  }

  static reified(): ExtensionReified {
    const reifiedBcs = Extension.bcs
    return {
      typeName: Extension.$typeName,
      fullTypeName: composeSuiType(Extension.$typeName, ...[]) as `0x2::kiosk_extension::Extension`,
      typeArgs: [] as [],
      isPhantom: Extension.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => Extension.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Extension.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => Extension.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => Extension.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => Extension.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => Extension.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => Extension.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => Extension.fetch(client, id),
      new: (fields: ExtensionFields) => {
        return new Extension([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Extension.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<Extension>> {
    return phantom(Extension.reified())
  }

  static get p() {
    return Extension.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('Extension', {
      storage: Bag.bcs,
      permissions: bcs.u128(),
      is_enabled: bcs.bool(),
    })
  }

  private static cachedBcs: ReturnType<typeof Extension.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof Extension.instantiateBcs> {
    if (!Extension.cachedBcs) {
      Extension.cachedBcs = Extension.instantiateBcs()
    }
    return Extension.cachedBcs
  }

  static fromFields(fields: Record<string, any>): Extension {
    return Extension.reified().new({
      storage: decodeFromFields(Bag.reified(), fields.storage),
      permissions: decodeFromFields('u128', fields.permissions),
      isEnabled: decodeFromFields('bool', fields.is_enabled),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Extension {
    if (!isExtension(item.type)) {
      throw new Error('not a Extension type')
    }

    return Extension.reified().new({
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
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): Extension {
    return Extension.reified().new({
      storage: decodeFromJSONField(Bag.reified(), field.storage),
      permissions: decodeFromJSONField('u128', field.permissions),
      isEnabled: decodeFromJSONField('bool', field.isEnabled),
    })
  }

  static fromJSON(json: Record<string, any>): Extension {
    if (json.$typeName !== Extension.$typeName) {
      throw new Error(
        `not a Extension json object: expected '${Extension.$typeName}' but got '${json.$typeName}'`
      )
    }

    return Extension.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): Extension {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isExtension(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Extension object`)
    }
    return Extension.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): Extension {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isExtension(data.bcs.type)) {
        throw new Error(`object at is not a Extension object`)
      }

      return Extension.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Extension.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<Extension> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching Extension object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isExtension(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a Extension object`)
    }

    return Extension.fromSuiObjectData(res.data)
  }
}

/* ============================== ExtensionKey =============================== */

export function isExtensionKey(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::kiosk_extension::ExtensionKey` + '<')
}

export interface ExtensionKeyFields<Ext extends PhantomTypeArgument> {
  dummyField: ToField<'bool'>
}

export type ExtensionKeyReified<Ext extends PhantomTypeArgument> = Reified<
  ExtensionKey<Ext>,
  ExtensionKeyFields<Ext>
>

/**
 * The `ExtensionKey` is a typed dynamic field key used to store the
 * extension configuration and data. `Ext` is a phantom type that is used
 * to identify the extension witness.
 */
export class ExtensionKey<Ext extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::kiosk_extension::ExtensionKey` as const
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName = ExtensionKey.$typeName
  readonly $fullTypeName: `0x2::kiosk_extension::ExtensionKey<${PhantomToTypeStr<Ext>}>`
  readonly $typeArgs: [PhantomToTypeStr<Ext>]
  readonly $isPhantom = ExtensionKey.$isPhantom

  readonly dummyField: ToField<'bool'>

  private constructor(typeArgs: [PhantomToTypeStr<Ext>], fields: ExtensionKeyFields<Ext>) {
    this.$fullTypeName = composeSuiType(
      ExtensionKey.$typeName,
      ...typeArgs
    ) as `0x2::kiosk_extension::ExtensionKey<${PhantomToTypeStr<Ext>}>`
    this.$typeArgs = typeArgs

    this.dummyField = fields.dummyField
  }

  static reified<Ext extends PhantomReified<PhantomTypeArgument>>(
    Ext: Ext
  ): ExtensionKeyReified<ToPhantomTypeArgument<Ext>> {
    const reifiedBcs = ExtensionKey.bcs
    return {
      typeName: ExtensionKey.$typeName,
      fullTypeName: composeSuiType(
        ExtensionKey.$typeName,
        ...[extractType(Ext)]
      ) as `0x2::kiosk_extension::ExtensionKey<${PhantomToTypeStr<ToPhantomTypeArgument<Ext>>}>`,
      typeArgs: [extractType(Ext)] as [PhantomToTypeStr<ToPhantomTypeArgument<Ext>>],
      isPhantom: ExtensionKey.$isPhantom,
      reifiedTypeArgs: [Ext],
      fromFields: (fields: Record<string, any>) => ExtensionKey.fromFields(Ext, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => ExtensionKey.fromFieldsWithTypes(Ext, item),
      fromBcs: (data: Uint8Array) => ExtensionKey.fromFields(Ext, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => ExtensionKey.fromJSONField(Ext, field),
      fromJSON: (json: Record<string, any>) => ExtensionKey.fromJSON(Ext, json),
      fromSuiParsedData: (content: SuiParsedData) => ExtensionKey.fromSuiParsedData(Ext, content),
      fromSuiObjectData: (content: SuiObjectData) => ExtensionKey.fromSuiObjectData(Ext, content),
      fetch: async (client: SuiClient, id: string) => ExtensionKey.fetch(client, Ext, id),
      new: (fields: ExtensionKeyFields<ToPhantomTypeArgument<Ext>>) => {
        return new ExtensionKey([extractType(Ext)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return ExtensionKey.reified
  }

  static phantom<Ext extends PhantomReified<PhantomTypeArgument>>(
    Ext: Ext
  ): PhantomReified<ToTypeStr<ExtensionKey<ToPhantomTypeArgument<Ext>>>> {
    return phantom(ExtensionKey.reified(Ext))
  }

  static get p() {
    return ExtensionKey.phantom
  }

  private static instantiateBcs() {
    return bcs.struct('ExtensionKey', {
      dummy_field: bcs.bool(),
    })
  }

  private static cachedBcs: ReturnType<typeof ExtensionKey.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof ExtensionKey.instantiateBcs> {
    if (!ExtensionKey.cachedBcs) {
      ExtensionKey.cachedBcs = ExtensionKey.instantiateBcs()
    }
    return ExtensionKey.cachedBcs
  }

  static fromFields<Ext extends PhantomReified<PhantomTypeArgument>>(
    typeArg: Ext,
    fields: Record<string, any>
  ): ExtensionKey<ToPhantomTypeArgument<Ext>> {
    return ExtensionKey.reified(typeArg).new({
      dummyField: decodeFromFields('bool', fields.dummy_field),
    })
  }

  static fromFieldsWithTypes<Ext extends PhantomReified<PhantomTypeArgument>>(
    typeArg: Ext,
    item: FieldsWithTypes
  ): ExtensionKey<ToPhantomTypeArgument<Ext>> {
    if (!isExtensionKey(item.type)) {
      throw new Error('not a ExtensionKey type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return ExtensionKey.reified(typeArg).new({
      dummyField: decodeFromFieldsWithTypes('bool', item.fields.dummy_field),
    })
  }

  static fromBcs<Ext extends PhantomReified<PhantomTypeArgument>>(
    typeArg: Ext,
    data: Uint8Array
  ): ExtensionKey<ToPhantomTypeArgument<Ext>> {
    return ExtensionKey.fromFields(typeArg, ExtensionKey.bcs.parse(data))
  }

  toJSONField() {
    return {
      dummyField: this.dummyField,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<Ext extends PhantomReified<PhantomTypeArgument>>(
    typeArg: Ext,
    field: any
  ): ExtensionKey<ToPhantomTypeArgument<Ext>> {
    return ExtensionKey.reified(typeArg).new({
      dummyField: decodeFromJSONField('bool', field.dummyField),
    })
  }

  static fromJSON<Ext extends PhantomReified<PhantomTypeArgument>>(
    typeArg: Ext,
    json: Record<string, any>
  ): ExtensionKey<ToPhantomTypeArgument<Ext>> {
    if (json.$typeName !== ExtensionKey.$typeName) {
      throw new Error(
        `not a ExtensionKey json object: expected '${ExtensionKey.$typeName}' but got '${json.$typeName}'`
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(ExtensionKey.$typeName, ...[extractType(typeArg)]),
      json.$typeArgs,
      [typeArg]
    )

    return ExtensionKey.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<Ext extends PhantomReified<PhantomTypeArgument>>(
    typeArg: Ext,
    content: SuiParsedData
  ): ExtensionKey<ToPhantomTypeArgument<Ext>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isExtensionKey(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a ExtensionKey object`)
    }
    return ExtensionKey.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<Ext extends PhantomReified<PhantomTypeArgument>>(
    typeArg: Ext,
    data: SuiObjectData
  ): ExtensionKey<ToPhantomTypeArgument<Ext>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isExtensionKey(data.bcs.type)) {
        throw new Error(`object at is not a ExtensionKey object`)
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs
      if (gotTypeArgs.length !== 1) {
        throw new Error(
          `type argument mismatch: expected 1 type arguments but got '${gotTypeArgs.length}'`
        )
      }
      for (let i = 0; i < 1; i++) {
        const gotTypeArg = compressSuiType(gotTypeArgs[i])
        const expectedTypeArg = compressSuiType(extractType([typeArg][i]))
        if (gotTypeArg !== expectedTypeArg) {
          throw new Error(
            `type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`
          )
        }
      }

      return ExtensionKey.fromBcs(typeArg, fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return ExtensionKey.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<Ext extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: Ext,
    id: string
  ): Promise<ExtensionKey<ToPhantomTypeArgument<Ext>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching ExtensionKey object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isExtensionKey(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a ExtensionKey object`)
    }

    return ExtensionKey.fromSuiObjectData(typeArg, res.data)
  }
}
