import {
  PhantomReified,
  PhantomToTypeStr,
  PhantomTypeArgument,
  Reified,
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
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../_framework/util'
import { String } from '../../move-stdlib-chain/string/structs'
import { ID, UID } from '../object/structs'
import { VecMap } from '../vec-map/structs'
import { bcs, fromB64 } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== Display =============================== */

export function isDisplay(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::display::Display<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface DisplayFields<T0 extends PhantomTypeArgument> {
  id: ToField<UID>
  fields: ToField<VecMap<String, String>>
  version: ToField<'u16'>
}

export type DisplayReified<T0 extends PhantomTypeArgument> = Reified<Display<T0>, DisplayFields<T0>>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Display<T0 extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::display::Display'
  static readonly $numTypeParams = 1

  readonly $typeName = Display.$typeName

  readonly $fullTypeName: `0x2::display::Display<${string}>`

  readonly $typeArg: string

  readonly id: ToField<UID>
  readonly fields: ToField<VecMap<String, String>>
  readonly version: ToField<'u16'>

  private constructor(typeArg: string, fields: DisplayFields<T0>) {
    this.$fullTypeName = composeSuiType(
      Display.$typeName,
      typeArg
    ) as `0x2::display::Display<${PhantomToTypeStr<T0>}>`

    this.$typeArg = typeArg

    this.id = fields.id
    this.fields = fields.fields
    this.version = fields.version
  }

  static reified<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): DisplayReified<ToPhantomTypeArgument<T0>> {
    return {
      typeName: Display.$typeName,
      fullTypeName: composeSuiType(
        Display.$typeName,
        ...[extractType(T0)]
      ) as `0x2::display::Display<${PhantomToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [T0],
      fromFields: (fields: Record<string, any>) => Display.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Display.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => Display.fromBcs(T0, data),
      bcs: Display.bcs,
      fromJSONField: (field: any) => Display.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => Display.fromJSON(T0, json),
      fetch: async (client: SuiClient, id: string) => Display.fetch(client, T0, id),
      new: (fields: DisplayFields<ToPhantomTypeArgument<T0>>) => {
        return new Display(extractType(T0), fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Display.reified
  }

  static phantom<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): PhantomReified<ToTypeStr<Display<ToPhantomTypeArgument<T0>>>> {
    return phantom(Display.reified(T0))
  }
  static get p() {
    return Display.phantom
  }

  static get bcs() {
    return bcs.struct('Display', {
      id: UID.bcs,
      fields: VecMap.bcs(String.bcs, String.bcs),
      version: bcs.u16(),
    })
  }

  static fromFields<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    fields: Record<string, any>
  ): Display<ToPhantomTypeArgument<T0>> {
    return Display.reified(typeArg).new({
      id: decodeFromFields(UID.reified(), fields.id),
      fields: decodeFromFields(VecMap.reified(String.reified(), String.reified()), fields.fields),
      version: decodeFromFields('u16', fields.version),
    })
  }

  static fromFieldsWithTypes<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    item: FieldsWithTypes
  ): Display<ToPhantomTypeArgument<T0>> {
    if (!isDisplay(item.type)) {
      throw new Error('not a Display type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Display.reified(typeArg).new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      fields: decodeFromFieldsWithTypes(
        VecMap.reified(String.reified(), String.reified()),
        item.fields.fields
      ),
      version: decodeFromFieldsWithTypes('u16', item.fields.version),
    })
  }

  static fromBcs<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: Uint8Array
  ): Display<ToPhantomTypeArgument<T0>> {
    return Display.fromFields(typeArg, Display.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
      fields: this.fields.toJSONField(),
      version: this.version,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArg: this.$typeArg, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    field: any
  ): Display<ToPhantomTypeArgument<T0>> {
    return Display.reified(typeArg).new({
      id: decodeFromJSONField(UID.reified(), field.id),
      fields: decodeFromJSONField(VecMap.reified(String.reified(), String.reified()), field.fields),
      version: decodeFromJSONField('u16', field.version),
    })
  }

  static fromJSON<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    json: Record<string, any>
  ): Display<ToPhantomTypeArgument<T0>> {
    if (json.$typeName !== Display.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Display.$typeName, extractType(typeArg)),
      [json.$typeArg],
      [typeArg]
    )

    return Display.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    content: SuiParsedData
  ): Display<ToPhantomTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isDisplay(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Display object`)
    }
    return Display.fromFieldsWithTypes(typeArg, content)
  }

  static async fetch<T0 extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<Display<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching Display object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isDisplay(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a Display object`)
    }
    return Display.fromBcs(typeArg, fromB64(res.data.bcs.bcsBytes))
  }
}

/* ============================== DisplayCreated =============================== */

export function isDisplayCreated(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::display::DisplayCreated<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface DisplayCreatedFields<T0 extends PhantomTypeArgument> {
  id: ToField<ID>
}

export type DisplayCreatedReified<T0 extends PhantomTypeArgument> = Reified<
  DisplayCreated<T0>,
  DisplayCreatedFields<T0>
>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class DisplayCreated<T0 extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::display::DisplayCreated'
  static readonly $numTypeParams = 1

  readonly $typeName = DisplayCreated.$typeName

  readonly $fullTypeName: `0x2::display::DisplayCreated<${string}>`

  readonly $typeArg: string

  readonly id: ToField<ID>

  private constructor(typeArg: string, fields: DisplayCreatedFields<T0>) {
    this.$fullTypeName = composeSuiType(
      DisplayCreated.$typeName,
      typeArg
    ) as `0x2::display::DisplayCreated<${PhantomToTypeStr<T0>}>`

    this.$typeArg = typeArg

    this.id = fields.id
  }

  static reified<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): DisplayCreatedReified<ToPhantomTypeArgument<T0>> {
    return {
      typeName: DisplayCreated.$typeName,
      fullTypeName: composeSuiType(
        DisplayCreated.$typeName,
        ...[extractType(T0)]
      ) as `0x2::display::DisplayCreated<${PhantomToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [T0],
      fromFields: (fields: Record<string, any>) => DisplayCreated.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => DisplayCreated.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => DisplayCreated.fromBcs(T0, data),
      bcs: DisplayCreated.bcs,
      fromJSONField: (field: any) => DisplayCreated.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => DisplayCreated.fromJSON(T0, json),
      fetch: async (client: SuiClient, id: string) => DisplayCreated.fetch(client, T0, id),
      new: (fields: DisplayCreatedFields<ToPhantomTypeArgument<T0>>) => {
        return new DisplayCreated(extractType(T0), fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return DisplayCreated.reified
  }

  static phantom<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): PhantomReified<ToTypeStr<DisplayCreated<ToPhantomTypeArgument<T0>>>> {
    return phantom(DisplayCreated.reified(T0))
  }
  static get p() {
    return DisplayCreated.phantom
  }

  static get bcs() {
    return bcs.struct('DisplayCreated', {
      id: ID.bcs,
    })
  }

  static fromFields<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    fields: Record<string, any>
  ): DisplayCreated<ToPhantomTypeArgument<T0>> {
    return DisplayCreated.reified(typeArg).new({ id: decodeFromFields(ID.reified(), fields.id) })
  }

  static fromFieldsWithTypes<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    item: FieldsWithTypes
  ): DisplayCreated<ToPhantomTypeArgument<T0>> {
    if (!isDisplayCreated(item.type)) {
      throw new Error('not a DisplayCreated type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return DisplayCreated.reified(typeArg).new({
      id: decodeFromFieldsWithTypes(ID.reified(), item.fields.id),
    })
  }

  static fromBcs<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: Uint8Array
  ): DisplayCreated<ToPhantomTypeArgument<T0>> {
    return DisplayCreated.fromFields(typeArg, DisplayCreated.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArg: this.$typeArg, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    field: any
  ): DisplayCreated<ToPhantomTypeArgument<T0>> {
    return DisplayCreated.reified(typeArg).new({ id: decodeFromJSONField(ID.reified(), field.id) })
  }

  static fromJSON<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    json: Record<string, any>
  ): DisplayCreated<ToPhantomTypeArgument<T0>> {
    if (json.$typeName !== DisplayCreated.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(DisplayCreated.$typeName, extractType(typeArg)),
      [json.$typeArg],
      [typeArg]
    )

    return DisplayCreated.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    content: SuiParsedData
  ): DisplayCreated<ToPhantomTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isDisplayCreated(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a DisplayCreated object`)
    }
    return DisplayCreated.fromFieldsWithTypes(typeArg, content)
  }

  static async fetch<T0 extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<DisplayCreated<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching DisplayCreated object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isDisplayCreated(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a DisplayCreated object`)
    }
    return DisplayCreated.fromBcs(typeArg, fromB64(res.data.bcs.bcsBytes))
  }
}

/* ============================== VersionUpdated =============================== */

export function isVersionUpdated(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::display::VersionUpdated<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface VersionUpdatedFields<T0 extends PhantomTypeArgument> {
  id: ToField<ID>
  version: ToField<'u16'>
  fields: ToField<VecMap<String, String>>
}

export type VersionUpdatedReified<T0 extends PhantomTypeArgument> = Reified<
  VersionUpdated<T0>,
  VersionUpdatedFields<T0>
>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class VersionUpdated<T0 extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::display::VersionUpdated'
  static readonly $numTypeParams = 1

  readonly $typeName = VersionUpdated.$typeName

  readonly $fullTypeName: `0x2::display::VersionUpdated<${string}>`

  readonly $typeArg: string

  readonly id: ToField<ID>
  readonly version: ToField<'u16'>
  readonly fields: ToField<VecMap<String, String>>

  private constructor(typeArg: string, fields: VersionUpdatedFields<T0>) {
    this.$fullTypeName = composeSuiType(
      VersionUpdated.$typeName,
      typeArg
    ) as `0x2::display::VersionUpdated<${PhantomToTypeStr<T0>}>`

    this.$typeArg = typeArg

    this.id = fields.id
    this.version = fields.version
    this.fields = fields.fields
  }

  static reified<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): VersionUpdatedReified<ToPhantomTypeArgument<T0>> {
    return {
      typeName: VersionUpdated.$typeName,
      fullTypeName: composeSuiType(
        VersionUpdated.$typeName,
        ...[extractType(T0)]
      ) as `0x2::display::VersionUpdated<${PhantomToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [T0],
      fromFields: (fields: Record<string, any>) => VersionUpdated.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => VersionUpdated.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => VersionUpdated.fromBcs(T0, data),
      bcs: VersionUpdated.bcs,
      fromJSONField: (field: any) => VersionUpdated.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => VersionUpdated.fromJSON(T0, json),
      fetch: async (client: SuiClient, id: string) => VersionUpdated.fetch(client, T0, id),
      new: (fields: VersionUpdatedFields<ToPhantomTypeArgument<T0>>) => {
        return new VersionUpdated(extractType(T0), fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return VersionUpdated.reified
  }

  static phantom<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): PhantomReified<ToTypeStr<VersionUpdated<ToPhantomTypeArgument<T0>>>> {
    return phantom(VersionUpdated.reified(T0))
  }
  static get p() {
    return VersionUpdated.phantom
  }

  static get bcs() {
    return bcs.struct('VersionUpdated', {
      id: ID.bcs,
      version: bcs.u16(),
      fields: VecMap.bcs(String.bcs, String.bcs),
    })
  }

  static fromFields<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    fields: Record<string, any>
  ): VersionUpdated<ToPhantomTypeArgument<T0>> {
    return VersionUpdated.reified(typeArg).new({
      id: decodeFromFields(ID.reified(), fields.id),
      version: decodeFromFields('u16', fields.version),
      fields: decodeFromFields(VecMap.reified(String.reified(), String.reified()), fields.fields),
    })
  }

  static fromFieldsWithTypes<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    item: FieldsWithTypes
  ): VersionUpdated<ToPhantomTypeArgument<T0>> {
    if (!isVersionUpdated(item.type)) {
      throw new Error('not a VersionUpdated type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return VersionUpdated.reified(typeArg).new({
      id: decodeFromFieldsWithTypes(ID.reified(), item.fields.id),
      version: decodeFromFieldsWithTypes('u16', item.fields.version),
      fields: decodeFromFieldsWithTypes(
        VecMap.reified(String.reified(), String.reified()),
        item.fields.fields
      ),
    })
  }

  static fromBcs<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: Uint8Array
  ): VersionUpdated<ToPhantomTypeArgument<T0>> {
    return VersionUpdated.fromFields(typeArg, VersionUpdated.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
      version: this.version,
      fields: this.fields.toJSONField(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArg: this.$typeArg, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    field: any
  ): VersionUpdated<ToPhantomTypeArgument<T0>> {
    return VersionUpdated.reified(typeArg).new({
      id: decodeFromJSONField(ID.reified(), field.id),
      version: decodeFromJSONField('u16', field.version),
      fields: decodeFromJSONField(VecMap.reified(String.reified(), String.reified()), field.fields),
    })
  }

  static fromJSON<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    json: Record<string, any>
  ): VersionUpdated<ToPhantomTypeArgument<T0>> {
    if (json.$typeName !== VersionUpdated.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(VersionUpdated.$typeName, extractType(typeArg)),
      [json.$typeArg],
      [typeArg]
    )

    return VersionUpdated.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    content: SuiParsedData
  ): VersionUpdated<ToPhantomTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isVersionUpdated(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a VersionUpdated object`)
    }
    return VersionUpdated.fromFieldsWithTypes(typeArg, content)
  }

  static async fetch<T0 extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<VersionUpdated<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching VersionUpdated object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isVersionUpdated(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a VersionUpdated object`)
    }
    return VersionUpdated.fromBcs(typeArg, fromB64(res.data.bcs.bcsBytes))
  }
}
