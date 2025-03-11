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
import { PKG_V27 } from '../index'
import { bcs } from '@mysten/sui/bcs'
import { SuiClient, SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromB64 } from '@mysten/sui/utils'

/* ============================== Extension =============================== */

export function isExtension(type: string): boolean {
  type = compressSuiType(type)
  return type === `${PKG_V27}::kiosk_extension::Extension`
}

export interface ExtensionFields {
  storage: ToField<Bag>
  permissions: ToField<'u128'>
  isEnabled: ToField<'bool'>
}

export type ExtensionReified = Reified<Extension, ExtensionFields>

export class Extension implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `${PKG_V27}::kiosk_extension::Extension`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = Extension.$typeName
  readonly $fullTypeName: `${typeof PKG_V27}::kiosk_extension::Extension`
  readonly $typeArgs: []
  readonly $isPhantom = Extension.$isPhantom

  readonly storage: ToField<Bag>
  readonly permissions: ToField<'u128'>
  readonly isEnabled: ToField<'bool'>

  private constructor(typeArgs: [], fields: ExtensionFields) {
    this.$fullTypeName = composeSuiType(
      Extension.$typeName,
      ...typeArgs
    ) as `${typeof PKG_V27}::kiosk_extension::Extension`
    this.$typeArgs = typeArgs

    this.storage = fields.storage
    this.permissions = fields.permissions
    this.isEnabled = fields.isEnabled
  }

  static reified(): ExtensionReified {
    return {
      typeName: Extension.$typeName,
      fullTypeName: composeSuiType(
        Extension.$typeName,
        ...[]
      ) as `${typeof PKG_V27}::kiosk_extension::Extension`,
      typeArgs: [] as [],
      isPhantom: Extension.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => Extension.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Extension.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => Extension.fromBcs(data),
      bcs: Extension.bcs,
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

  static get bcs() {
    return bcs.struct('Extension', {
      storage: Bag.bcs,
      permissions: bcs.u128(),
      is_enabled: bcs.bool(),
    })
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
      throw new Error('not a WithTwoGenerics json object')
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

      return Extension.fromBcs(fromB64(data.bcs.bcsBytes))
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
  return type.startsWith(`${PKG_V27}::kiosk_extension::ExtensionKey` + '<')
}

export interface ExtensionKeyFields<T0 extends PhantomTypeArgument> {
  dummyField: ToField<'bool'>
}

export type ExtensionKeyReified<T0 extends PhantomTypeArgument> = Reified<
  ExtensionKey<T0>,
  ExtensionKeyFields<T0>
>

export class ExtensionKey<T0 extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `${PKG_V27}::kiosk_extension::ExtensionKey`
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName = ExtensionKey.$typeName
  readonly $fullTypeName: `${typeof PKG_V27}::kiosk_extension::ExtensionKey<${PhantomToTypeStr<T0>}>`
  readonly $typeArgs: [PhantomToTypeStr<T0>]
  readonly $isPhantom = ExtensionKey.$isPhantom

  readonly dummyField: ToField<'bool'>

  private constructor(typeArgs: [PhantomToTypeStr<T0>], fields: ExtensionKeyFields<T0>) {
    this.$fullTypeName = composeSuiType(
      ExtensionKey.$typeName,
      ...typeArgs
    ) as `${typeof PKG_V27}::kiosk_extension::ExtensionKey<${PhantomToTypeStr<T0>}>`
    this.$typeArgs = typeArgs

    this.dummyField = fields.dummyField
  }

  static reified<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): ExtensionKeyReified<ToPhantomTypeArgument<T0>> {
    return {
      typeName: ExtensionKey.$typeName,
      fullTypeName: composeSuiType(
        ExtensionKey.$typeName,
        ...[extractType(T0)]
      ) as `${typeof PKG_V27}::kiosk_extension::ExtensionKey<${PhantomToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [extractType(T0)] as [PhantomToTypeStr<ToPhantomTypeArgument<T0>>],
      isPhantom: ExtensionKey.$isPhantom,
      reifiedTypeArgs: [T0],
      fromFields: (fields: Record<string, any>) => ExtensionKey.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => ExtensionKey.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => ExtensionKey.fromBcs(T0, data),
      bcs: ExtensionKey.bcs,
      fromJSONField: (field: any) => ExtensionKey.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => ExtensionKey.fromJSON(T0, json),
      fromSuiParsedData: (content: SuiParsedData) => ExtensionKey.fromSuiParsedData(T0, content),
      fromSuiObjectData: (content: SuiObjectData) => ExtensionKey.fromSuiObjectData(T0, content),
      fetch: async (client: SuiClient, id: string) => ExtensionKey.fetch(client, T0, id),
      new: (fields: ExtensionKeyFields<ToPhantomTypeArgument<T0>>) => {
        return new ExtensionKey([extractType(T0)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return ExtensionKey.reified
  }

  static phantom<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): PhantomReified<ToTypeStr<ExtensionKey<ToPhantomTypeArgument<T0>>>> {
    return phantom(ExtensionKey.reified(T0))
  }
  static get p() {
    return ExtensionKey.phantom
  }

  static get bcs() {
    return bcs.struct('ExtensionKey', {
      dummy_field: bcs.bool(),
    })
  }

  static fromFields<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    fields: Record<string, any>
  ): ExtensionKey<ToPhantomTypeArgument<T0>> {
    return ExtensionKey.reified(typeArg).new({
      dummyField: decodeFromFields('bool', fields.dummy_field),
    })
  }

  static fromFieldsWithTypes<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    item: FieldsWithTypes
  ): ExtensionKey<ToPhantomTypeArgument<T0>> {
    if (!isExtensionKey(item.type)) {
      throw new Error('not a ExtensionKey type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return ExtensionKey.reified(typeArg).new({
      dummyField: decodeFromFieldsWithTypes('bool', item.fields.dummy_field),
    })
  }

  static fromBcs<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: Uint8Array
  ): ExtensionKey<ToPhantomTypeArgument<T0>> {
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

  static fromJSONField<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    field: any
  ): ExtensionKey<ToPhantomTypeArgument<T0>> {
    return ExtensionKey.reified(typeArg).new({
      dummyField: decodeFromJSONField('bool', field.dummyField),
    })
  }

  static fromJSON<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    json: Record<string, any>
  ): ExtensionKey<ToPhantomTypeArgument<T0>> {
    if (json.$typeName !== ExtensionKey.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(ExtensionKey.$typeName, extractType(typeArg)),
      json.$typeArgs,
      [typeArg]
    )

    return ExtensionKey.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    content: SuiParsedData
  ): ExtensionKey<ToPhantomTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isExtensionKey(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a ExtensionKey object`)
    }
    return ExtensionKey.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: SuiObjectData
  ): ExtensionKey<ToPhantomTypeArgument<T0>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isExtensionKey(data.bcs.type)) {
        throw new Error(`object at is not a ExtensionKey object`)
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs
      if (gotTypeArgs.length !== 1) {
        throw new Error(
          `type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`
        )
      }
      const gotTypeArg = compressSuiType(gotTypeArgs[0])
      const expectedTypeArg = compressSuiType(extractType(typeArg))
      if (gotTypeArg !== compressSuiType(extractType(typeArg))) {
        throw new Error(
          `type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`
        )
      }

      return ExtensionKey.fromBcs(typeArg, fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return ExtensionKey.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<T0 extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<ExtensionKey<ToPhantomTypeArgument<T0>>> {
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
