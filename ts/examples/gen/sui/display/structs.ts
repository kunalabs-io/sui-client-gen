import { String } from '../../_dependencies/source/0x1/string/structs'
import {
  ReifiedTypeArgument,
  ToField,
  assertFieldsWithTypesArgsMatch,
  decodeFromFieldsGenericOrSpecial,
  decodeFromFieldsWithTypesGenericOrSpecial,
  extractType,
} from '../../_framework/types'
import { FieldsWithTypes, Type, compressSuiType } from '../../_framework/util'
import { ID, UID } from '../object/structs'
import { VecMap } from '../vec-map/structs'
import { bcs } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== Display =============================== */

export function isDisplay(type: Type): boolean {
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
      __class: null as unknown as ReturnType<typeof Display.new>,
    }
  }

  static fromFields(typeArg: ReifiedTypeArgument, fields: Record<string, any>): Display {
    return Display.new(typeArg, {
      id: decodeFromFieldsGenericOrSpecial(UID.reified(), fields.id),
      fields: decodeFromFieldsGenericOrSpecial(
        VecMap.reified(String.reified(), String.reified()),
        fields.fields
      ),
      version: decodeFromFieldsGenericOrSpecial('u16', fields.version),
    })
  }

  static fromFieldsWithTypes(typeArg: ReifiedTypeArgument, item: FieldsWithTypes): Display {
    if (!isDisplay(item.type)) {
      throw new Error('not a Display type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Display.new(typeArg, {
      id: decodeFromFieldsWithTypesGenericOrSpecial(UID.reified(), item.fields.id),
      fields: decodeFromFieldsWithTypesGenericOrSpecial(
        VecMap.reified(String.reified(), String.reified()),
        item.fields.fields
      ),
      version: decodeFromFieldsWithTypesGenericOrSpecial('u16', item.fields.version),
    })
  }

  static fromBcs(typeArg: ReifiedTypeArgument, data: Uint8Array): Display {
    return Display.fromFields(typeArg, Display.bcs.parse(data))
  }

  toJSON() {
    return {
      $typeArg: this.$typeArg,
      id: this.id,
      fields: this.fields.toJSON(),
      version: this.version,
    }
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

export function isDisplayCreated(type: Type): boolean {
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
      __class: null as unknown as ReturnType<typeof DisplayCreated.new>,
    }
  }

  static fromFields(typeArg: ReifiedTypeArgument, fields: Record<string, any>): DisplayCreated {
    return DisplayCreated.new(typeArg, decodeFromFieldsGenericOrSpecial(ID.reified(), fields.id))
  }

  static fromFieldsWithTypes(typeArg: ReifiedTypeArgument, item: FieldsWithTypes): DisplayCreated {
    if (!isDisplayCreated(item.type)) {
      throw new Error('not a DisplayCreated type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return DisplayCreated.new(
      typeArg,
      decodeFromFieldsWithTypesGenericOrSpecial(ID.reified(), item.fields.id)
    )
  }

  static fromBcs(typeArg: ReifiedTypeArgument, data: Uint8Array): DisplayCreated {
    return DisplayCreated.fromFields(typeArg, DisplayCreated.bcs.parse(data))
  }

  toJSON() {
    return {
      $typeArg: this.$typeArg,
      id: this.id,
    }
  }
}

/* ============================== VersionUpdated =============================== */

export function isVersionUpdated(type: Type): boolean {
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
      __class: null as unknown as ReturnType<typeof VersionUpdated.new>,
    }
  }

  static fromFields(typeArg: ReifiedTypeArgument, fields: Record<string, any>): VersionUpdated {
    return VersionUpdated.new(typeArg, {
      id: decodeFromFieldsGenericOrSpecial(ID.reified(), fields.id),
      version: decodeFromFieldsGenericOrSpecial('u16', fields.version),
      fields: decodeFromFieldsGenericOrSpecial(
        VecMap.reified(String.reified(), String.reified()),
        fields.fields
      ),
    })
  }

  static fromFieldsWithTypes(typeArg: ReifiedTypeArgument, item: FieldsWithTypes): VersionUpdated {
    if (!isVersionUpdated(item.type)) {
      throw new Error('not a VersionUpdated type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return VersionUpdated.new(typeArg, {
      id: decodeFromFieldsWithTypesGenericOrSpecial(ID.reified(), item.fields.id),
      version: decodeFromFieldsWithTypesGenericOrSpecial('u16', item.fields.version),
      fields: decodeFromFieldsWithTypesGenericOrSpecial(
        VecMap.reified(String.reified(), String.reified()),
        item.fields.fields
      ),
    })
  }

  static fromBcs(typeArg: ReifiedTypeArgument, data: Uint8Array): VersionUpdated {
    return VersionUpdated.fromFields(typeArg, VersionUpdated.bcs.parse(data))
  }

  toJSON() {
    return {
      $typeArg: this.$typeArg,
      id: this.id,
      version: this.version,
      fields: this.fields.toJSON(),
    }
  }
}
