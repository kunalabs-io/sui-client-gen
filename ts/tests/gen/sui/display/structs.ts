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

export interface DisplayFields {
  id: ToField<UID>
  fields: ToField<VecMap<String, String>>
  version: ToField<'u16'>
}

export class Display {
  static readonly $typeName = '0x2::display::Display'
  static readonly $numTypeParams = 1

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

  private constructor(typeArg: string, fields: DisplayFields) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.fields = fields.fields
    this.version = fields.version
  }

  static new(typeArg: ReifiedTypeArgument, fields: DisplayFields): Display {
    return new Display(extractType(typeArg), fields)
  }

  static reified(T: ReifiedTypeArgument) {
    return {
      typeName: Display.$typeName,
      typeArgs: [T],
      fromFields: (fields: Record<string, any>) => Display.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Display.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => Display.fromBcs(T, data),
      bcs: Display.bcs,
      fromJSONField: (field: any) => Display.fromJSONField(T, field),
      __class: null as unknown as ReturnType<typeof Display.new>,
    }
  }

  static fromFields(typeArg: ReifiedTypeArgument, fields: Record<string, any>): Display {
    return Display.new(typeArg, {
      id: decodeFromFields(UID.reified(), fields.id),
      fields: decodeFromFields(VecMap.reified(String.reified(), String.reified()), fields.fields),
      version: decodeFromFields('u16', fields.version),
    })
  }

  static fromFieldsWithTypes(typeArg: ReifiedTypeArgument, item: FieldsWithTypes): Display {
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

  static fromBcs(typeArg: ReifiedTypeArgument, data: Uint8Array): Display {
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

  static fromJSONField(typeArg: ReifiedTypeArgument, field: any): Display {
    return Display.new(typeArg, {
      id: decodeFromJSONField(UID.reified(), field.id),
      fields: decodeFromJSONField(VecMap.reified(String.reified(), String.reified()), field.fields),
      version: decodeFromJSONField('u16', field.version),
    })
  }

  static fromJSON(typeArg: ReifiedTypeArgument, json: Record<string, any>): Display {
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

  static fromSuiParsedData(typeArg: ReifiedTypeArgument, content: SuiParsedData): Display {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isDisplay(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Display object`)
    }
    return Display.fromFieldsWithTypes(typeArg, content)
  }

  static async fetch(
    client: SuiClient,
    typeArg: ReifiedTypeArgument,
    id: string
  ): Promise<Display> {
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

export interface DisplayCreatedFields {
  id: ToField<ID>
}

export class DisplayCreated {
  static readonly $typeName = '0x2::display::DisplayCreated'
  static readonly $numTypeParams = 1

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

  static new(typeArg: ReifiedTypeArgument, id: ToField<ID>): DisplayCreated {
    return new DisplayCreated(extractType(typeArg), id)
  }

  static reified(T: ReifiedTypeArgument) {
    return {
      typeName: DisplayCreated.$typeName,
      typeArgs: [T],
      fromFields: (fields: Record<string, any>) => DisplayCreated.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => DisplayCreated.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => DisplayCreated.fromBcs(T, data),
      bcs: DisplayCreated.bcs,
      fromJSONField: (field: any) => DisplayCreated.fromJSONField(T, field),
      __class: null as unknown as ReturnType<typeof DisplayCreated.new>,
    }
  }

  static fromFields(typeArg: ReifiedTypeArgument, fields: Record<string, any>): DisplayCreated {
    return DisplayCreated.new(typeArg, decodeFromFields(ID.reified(), fields.id))
  }

  static fromFieldsWithTypes(typeArg: ReifiedTypeArgument, item: FieldsWithTypes): DisplayCreated {
    if (!isDisplayCreated(item.type)) {
      throw new Error('not a DisplayCreated type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return DisplayCreated.new(typeArg, decodeFromFieldsWithTypes(ID.reified(), item.fields.id))
  }

  static fromBcs(typeArg: ReifiedTypeArgument, data: Uint8Array): DisplayCreated {
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

  static fromJSONField(typeArg: ReifiedTypeArgument, field: any): DisplayCreated {
    return DisplayCreated.new(typeArg, decodeFromJSONField(ID.reified(), field.id))
  }

  static fromJSON(typeArg: ReifiedTypeArgument, json: Record<string, any>): DisplayCreated {
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
}

/* ============================== VersionUpdated =============================== */

export function isVersionUpdated(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::display::VersionUpdated<')
}

export interface VersionUpdatedFields {
  id: ToField<ID>
  version: ToField<'u16'>
  fields: ToField<VecMap<String, String>>
}

export class VersionUpdated {
  static readonly $typeName = '0x2::display::VersionUpdated'
  static readonly $numTypeParams = 1

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

  private constructor(typeArg: string, fields: VersionUpdatedFields) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.version = fields.version
    this.fields = fields.fields
  }

  static new(typeArg: ReifiedTypeArgument, fields: VersionUpdatedFields): VersionUpdated {
    return new VersionUpdated(extractType(typeArg), fields)
  }

  static reified(T: ReifiedTypeArgument) {
    return {
      typeName: VersionUpdated.$typeName,
      typeArgs: [T],
      fromFields: (fields: Record<string, any>) => VersionUpdated.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => VersionUpdated.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => VersionUpdated.fromBcs(T, data),
      bcs: VersionUpdated.bcs,
      fromJSONField: (field: any) => VersionUpdated.fromJSONField(T, field),
      __class: null as unknown as ReturnType<typeof VersionUpdated.new>,
    }
  }

  static fromFields(typeArg: ReifiedTypeArgument, fields: Record<string, any>): VersionUpdated {
    return VersionUpdated.new(typeArg, {
      id: decodeFromFields(ID.reified(), fields.id),
      version: decodeFromFields('u16', fields.version),
      fields: decodeFromFields(VecMap.reified(String.reified(), String.reified()), fields.fields),
    })
  }

  static fromFieldsWithTypes(typeArg: ReifiedTypeArgument, item: FieldsWithTypes): VersionUpdated {
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

  static fromBcs(typeArg: ReifiedTypeArgument, data: Uint8Array): VersionUpdated {
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

  static fromJSONField(typeArg: ReifiedTypeArgument, field: any): VersionUpdated {
    return VersionUpdated.new(typeArg, {
      id: decodeFromJSONField(ID.reified(), field.id),
      version: decodeFromJSONField('u16', field.version),
      fields: decodeFromJSONField(VecMap.reified(String.reified(), String.reified()), field.fields),
    })
  }

  static fromJSON(typeArg: ReifiedTypeArgument, json: Record<string, any>): VersionUpdated {
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
}
