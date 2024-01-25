import {
  PhantomReified,
  PhantomToTypeStr,
  PhantomTypeArgument,
  Reified,
  ToField,
  ToPhantomTypeArgument,
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
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== Extension =============================== */

export function isExtension(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x2::kiosk_extension::Extension'
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface ExtensionFields {
  storage: ToField<Bag>
  permissions: ToField<'u128'>
  isEnabled: ToField<'bool'>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Extension {
  static readonly $typeName = '0x2::kiosk_extension::Extension'
  static readonly $numTypeParams = 0

  readonly $typeName = Extension.$typeName

  readonly $fullTypeName: '0x2::kiosk_extension::Extension'

  readonly storage: ToField<Bag>
  readonly permissions: ToField<'u128'>
  readonly isEnabled: ToField<'bool'>

  private constructor(fields: ExtensionFields) {
    this.$fullTypeName = Extension.$typeName

    this.storage = fields.storage
    this.permissions = fields.permissions
    this.isEnabled = fields.isEnabled
  }

  static reified(): Reified<Extension, ExtensionFields> {
    return {
      typeName: Extension.$typeName,
      fullTypeName: composeSuiType(Extension.$typeName, ...[]) as '0x2::kiosk_extension::Extension',
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => Extension.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Extension.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => Extension.fromBcs(data),
      bcs: Extension.bcs,
      fromJSONField: (field: any) => Extension.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => Extension.fromJSON(json),
      fetch: async (client: SuiClient, id: string) => Extension.fetch(client, id),
      new: (fields: ExtensionFields) => {
        return new Extension(fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Extension.reified()
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
    return { $typeName: this.$typeName, ...this.toJSONField() }
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

  static async fetch(client: SuiClient, id: string): Promise<Extension> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching Extension object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isExtension(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a Extension object`)
    }
    return Extension.fromFieldsWithTypes(res.data.content)
  }
}

/* ============================== ExtensionKey =============================== */

export function isExtensionKey(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::kiosk_extension::ExtensionKey<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface ExtensionKeyFields<T0 extends PhantomTypeArgument> {
  dummyField: ToField<'bool'>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class ExtensionKey<T0 extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::kiosk_extension::ExtensionKey'
  static readonly $numTypeParams = 1

  readonly $typeName = ExtensionKey.$typeName

  readonly $fullTypeName: `0x2::kiosk_extension::ExtensionKey<${string}>`

  readonly $typeArg: string

  readonly dummyField: ToField<'bool'>

  private constructor(typeArg: string, fields: ExtensionKeyFields<T0>) {
    this.$fullTypeName = composeSuiType(
      ExtensionKey.$typeName,
      typeArg
    ) as `0x2::kiosk_extension::ExtensionKey<${PhantomToTypeStr<T0>}>`

    this.$typeArg = typeArg

    this.dummyField = fields.dummyField
  }

  static reified<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): Reified<
    ExtensionKey<ToPhantomTypeArgument<T0>>,
    ExtensionKeyFields<ToPhantomTypeArgument<T0>>
  > {
    return {
      typeName: ExtensionKey.$typeName,
      fullTypeName: composeSuiType(
        ExtensionKey.$typeName,
        ...[extractType(T0)]
      ) as `0x2::kiosk_extension::ExtensionKey<${PhantomToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [T0],
      fromFields: (fields: Record<string, any>) => ExtensionKey.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => ExtensionKey.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => ExtensionKey.fromBcs(T0, data),
      bcs: ExtensionKey.bcs,
      fromJSONField: (field: any) => ExtensionKey.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => ExtensionKey.fromJSON(T0, json),
      fetch: async (client: SuiClient, id: string) => ExtensionKey.fetch(client, T0, id),
      new: (fields: ExtensionKeyFields<ToPhantomTypeArgument<T0>>) => {
        return new ExtensionKey(extractType(T0), fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return ExtensionKey.reified
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
    return { $typeName: this.$typeName, $typeArg: this.$typeArg, ...this.toJSONField() }
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
      [json.$typeArg],
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

  static async fetch<T0 extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<ExtensionKey<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching ExtensionKey object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isExtensionKey(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a ExtensionKey object`)
    }
    return ExtensionKey.fromFieldsWithTypes(typeArg, res.data.content)
  }
}
