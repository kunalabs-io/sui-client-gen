import {
  PhantomTypeArgument,
  Reified,
  ReifiedPhantomTypeArgument,
  ToField,
  ToPhantomTypeArgument,
  ToTypeStr,
  assertFieldsWithTypesArgsMatch,
  assertReifiedTypeArgsMatch,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  extractType,
} from '../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../_framework/util'
import { String } from '../../move-stdlib/string/structs'
import { ID, UID } from '../object/structs'
import { VecMap } from '../vec-map/structs'
import { bcs } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== Display =============================== */

export function isDisplay(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::display::Display<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface DisplayFields<T extends PhantomTypeArgument> {
  id: ToField<UID>
  fields: ToField<VecMap<String, String>>
  version: ToField<'u16'>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Display<T extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::display::Display'
  static readonly $numTypeParams = 1

  readonly $fullTypeName = null as unknown as `0x2::display::Display<${ToTypeStr<T>}>`

  readonly $typeName = Display.$typeName

  static get bcs() {
    return bcs.struct('Display', {
      id: UID.bcs,
      fields: VecMap.bcs(String.bcs, String.bcs),
      version: bcs.u16(),
    })
  }

  readonly $typeArg: string

  readonly id: ToField<UID>
  readonly fields: ToField<VecMap<String, String>>
  readonly version: ToField<'u16'>

  private constructor(typeArg: string, fields: DisplayFields<T>) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.fields = fields.fields
    this.version = fields.version
  }

  static new<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    fields: DisplayFields<ToPhantomTypeArgument<T>>
  ): Display<ToPhantomTypeArgument<T>> {
    return new Display(extractType(typeArg), fields)
  }

  static reified<T extends ReifiedPhantomTypeArgument>(
    T: T
  ): Reified<Display<ToPhantomTypeArgument<T>>> {
    return {
      typeName: Display.$typeName,
      fullTypeName: composeSuiType(
        Display.$typeName,
        ...[extractType(T)]
      ) as `0x2::display::Display<${ToTypeStr<ToPhantomTypeArgument<T>>}>`,
      typeArgs: [T],
      fromFields: (fields: Record<string, any>) => Display.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Display.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => Display.fromBcs(T, data),
      bcs: Display.bcs,
      fromJSONField: (field: any) => Display.fromJSONField(T, field),
      fetch: async (client: SuiClient, id: string) => Display.fetch(client, T, id),
      kind: 'StructClassReified',
    }
  }

  static fromFields<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    fields: Record<string, any>
  ): Display<ToPhantomTypeArgument<T>> {
    return Display.new(typeArg, {
      id: decodeFromFields(UID.reified(), fields.id),
      fields: decodeFromFields(VecMap.reified(String.reified(), String.reified()), fields.fields),
      version: decodeFromFields('u16', fields.version),
    })
  }

  static fromFieldsWithTypes<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    item: FieldsWithTypes
  ): Display<ToPhantomTypeArgument<T>> {
    if (!isDisplay(item.type)) {
      throw new Error('not a Display type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Display.new(typeArg, {
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      fields: decodeFromFieldsWithTypes(
        VecMap.reified(String.reified(), String.reified()),
        item.fields.fields
      ),
      version: decodeFromFieldsWithTypes('u16', item.fields.version),
    })
  }

  static fromBcs<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    data: Uint8Array
  ): Display<ToPhantomTypeArgument<T>> {
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

  static fromJSONField<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    field: any
  ): Display<ToPhantomTypeArgument<T>> {
    return Display.new(typeArg, {
      id: decodeFromJSONField(UID.reified(), field.id),
      fields: decodeFromJSONField(VecMap.reified(String.reified(), String.reified()), field.fields),
      version: decodeFromJSONField('u16', field.version),
    })
  }

  static fromJSON<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    json: Record<string, any>
  ): Display<ToPhantomTypeArgument<T>> {
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

  static fromSuiParsedData<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    content: SuiParsedData
  ): Display<ToPhantomTypeArgument<T>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isDisplay(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Display object`)
    }
    return Display.fromFieldsWithTypes(typeArg, content)
  }

  static async fetch<T extends ReifiedPhantomTypeArgument>(
    client: SuiClient,
    typeArg: T,
    id: string
  ): Promise<Display<ToPhantomTypeArgument<T>>> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching Display object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isDisplay(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a Display object`)
    }
    return Display.fromFieldsWithTypes(typeArg, res.data.content)
  }
}

/* ============================== DisplayCreated =============================== */

export function isDisplayCreated(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::display::DisplayCreated<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface DisplayCreatedFields<T extends PhantomTypeArgument> {
  id: ToField<ID>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class DisplayCreated<T extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::display::DisplayCreated'
  static readonly $numTypeParams = 1

  readonly $fullTypeName = null as unknown as `0x2::display::DisplayCreated<${ToTypeStr<T>}>`

  readonly $typeName = DisplayCreated.$typeName

  static get bcs() {
    return bcs.struct('DisplayCreated', {
      id: ID.bcs,
    })
  }

  readonly $typeArg: string

  readonly id: ToField<ID>

  private constructor(typeArg: string, id: ToField<ID>) {
    this.$typeArg = typeArg

    this.id = id
  }

  static new<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    id: ToField<ID>
  ): DisplayCreated<ToPhantomTypeArgument<T>> {
    return new DisplayCreated(extractType(typeArg), id)
  }

  static reified<T extends ReifiedPhantomTypeArgument>(
    T: T
  ): Reified<DisplayCreated<ToPhantomTypeArgument<T>>> {
    return {
      typeName: DisplayCreated.$typeName,
      fullTypeName: composeSuiType(
        DisplayCreated.$typeName,
        ...[extractType(T)]
      ) as `0x2::display::DisplayCreated<${ToTypeStr<ToPhantomTypeArgument<T>>}>`,
      typeArgs: [T],
      fromFields: (fields: Record<string, any>) => DisplayCreated.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => DisplayCreated.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => DisplayCreated.fromBcs(T, data),
      bcs: DisplayCreated.bcs,
      fromJSONField: (field: any) => DisplayCreated.fromJSONField(T, field),
      fetch: async (client: SuiClient, id: string) => DisplayCreated.fetch(client, T, id),
      kind: 'StructClassReified',
    }
  }

  static fromFields<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    fields: Record<string, any>
  ): DisplayCreated<ToPhantomTypeArgument<T>> {
    return DisplayCreated.new(typeArg, decodeFromFields(ID.reified(), fields.id))
  }

  static fromFieldsWithTypes<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    item: FieldsWithTypes
  ): DisplayCreated<ToPhantomTypeArgument<T>> {
    if (!isDisplayCreated(item.type)) {
      throw new Error('not a DisplayCreated type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return DisplayCreated.new(typeArg, decodeFromFieldsWithTypes(ID.reified(), item.fields.id))
  }

  static fromBcs<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    data: Uint8Array
  ): DisplayCreated<ToPhantomTypeArgument<T>> {
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

  static fromJSONField<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    field: any
  ): DisplayCreated<ToPhantomTypeArgument<T>> {
    return DisplayCreated.new(typeArg, decodeFromJSONField(ID.reified(), field.id))
  }

  static fromJSON<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    json: Record<string, any>
  ): DisplayCreated<ToPhantomTypeArgument<T>> {
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

  static fromSuiParsedData<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    content: SuiParsedData
  ): DisplayCreated<ToPhantomTypeArgument<T>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isDisplayCreated(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a DisplayCreated object`)
    }
    return DisplayCreated.fromFieldsWithTypes(typeArg, content)
  }

  static async fetch<T extends ReifiedPhantomTypeArgument>(
    client: SuiClient,
    typeArg: T,
    id: string
  ): Promise<DisplayCreated<ToPhantomTypeArgument<T>>> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching DisplayCreated object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isDisplayCreated(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a DisplayCreated object`)
    }
    return DisplayCreated.fromFieldsWithTypes(typeArg, res.data.content)
  }
}

/* ============================== VersionUpdated =============================== */

export function isVersionUpdated(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::display::VersionUpdated<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface VersionUpdatedFields<T extends PhantomTypeArgument> {
  id: ToField<ID>
  version: ToField<'u16'>
  fields: ToField<VecMap<String, String>>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class VersionUpdated<T extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::display::VersionUpdated'
  static readonly $numTypeParams = 1

  readonly $fullTypeName = null as unknown as `0x2::display::VersionUpdated<${ToTypeStr<T>}>`

  readonly $typeName = VersionUpdated.$typeName

  static get bcs() {
    return bcs.struct('VersionUpdated', {
      id: ID.bcs,
      version: bcs.u16(),
      fields: VecMap.bcs(String.bcs, String.bcs),
    })
  }

  readonly $typeArg: string

  readonly id: ToField<ID>
  readonly version: ToField<'u16'>
  readonly fields: ToField<VecMap<String, String>>

  private constructor(typeArg: string, fields: VersionUpdatedFields<T>) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.version = fields.version
    this.fields = fields.fields
  }

  static new<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    fields: VersionUpdatedFields<ToPhantomTypeArgument<T>>
  ): VersionUpdated<ToPhantomTypeArgument<T>> {
    return new VersionUpdated(extractType(typeArg), fields)
  }

  static reified<T extends ReifiedPhantomTypeArgument>(
    T: T
  ): Reified<VersionUpdated<ToPhantomTypeArgument<T>>> {
    return {
      typeName: VersionUpdated.$typeName,
      fullTypeName: composeSuiType(
        VersionUpdated.$typeName,
        ...[extractType(T)]
      ) as `0x2::display::VersionUpdated<${ToTypeStr<ToPhantomTypeArgument<T>>}>`,
      typeArgs: [T],
      fromFields: (fields: Record<string, any>) => VersionUpdated.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => VersionUpdated.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => VersionUpdated.fromBcs(T, data),
      bcs: VersionUpdated.bcs,
      fromJSONField: (field: any) => VersionUpdated.fromJSONField(T, field),
      fetch: async (client: SuiClient, id: string) => VersionUpdated.fetch(client, T, id),
      kind: 'StructClassReified',
    }
  }

  static fromFields<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    fields: Record<string, any>
  ): VersionUpdated<ToPhantomTypeArgument<T>> {
    return VersionUpdated.new(typeArg, {
      id: decodeFromFields(ID.reified(), fields.id),
      version: decodeFromFields('u16', fields.version),
      fields: decodeFromFields(VecMap.reified(String.reified(), String.reified()), fields.fields),
    })
  }

  static fromFieldsWithTypes<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    item: FieldsWithTypes
  ): VersionUpdated<ToPhantomTypeArgument<T>> {
    if (!isVersionUpdated(item.type)) {
      throw new Error('not a VersionUpdated type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return VersionUpdated.new(typeArg, {
      id: decodeFromFieldsWithTypes(ID.reified(), item.fields.id),
      version: decodeFromFieldsWithTypes('u16', item.fields.version),
      fields: decodeFromFieldsWithTypes(
        VecMap.reified(String.reified(), String.reified()),
        item.fields.fields
      ),
    })
  }

  static fromBcs<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    data: Uint8Array
  ): VersionUpdated<ToPhantomTypeArgument<T>> {
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

  static fromJSONField<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    field: any
  ): VersionUpdated<ToPhantomTypeArgument<T>> {
    return VersionUpdated.new(typeArg, {
      id: decodeFromJSONField(ID.reified(), field.id),
      version: decodeFromJSONField('u16', field.version),
      fields: decodeFromJSONField(VecMap.reified(String.reified(), String.reified()), field.fields),
    })
  }

  static fromJSON<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    json: Record<string, any>
  ): VersionUpdated<ToPhantomTypeArgument<T>> {
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

  static fromSuiParsedData<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    content: SuiParsedData
  ): VersionUpdated<ToPhantomTypeArgument<T>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isVersionUpdated(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a VersionUpdated object`)
    }
    return VersionUpdated.fromFieldsWithTypes(typeArg, content)
  }

  static async fetch<T extends ReifiedPhantomTypeArgument>(
    client: SuiClient,
    typeArg: T,
    id: string
  ): Promise<VersionUpdated<ToPhantomTypeArgument<T>>> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching VersionUpdated object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isVersionUpdated(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a VersionUpdated object`)
    }
    return VersionUpdated.fromFieldsWithTypes(typeArg, res.data.content)
  }
}
