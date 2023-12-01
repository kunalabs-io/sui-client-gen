import { String } from '../../_dependencies/source/0x1/string/structs'
import { FieldsWithTypes, Type, compressSuiType, parseTypeName } from '../../_framework/util'
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
  id: string
  fields: VecMap<string, string>
  version: number
}

export class Display {
  static readonly $typeName = '0x2::display::Display'
  static readonly $numTypeParams = 1

  static get bcs() {
    return bcs.struct('Display', {
      id: UID.bcs,
      fields: VecMap.bcs(String.bcs, String.bcs),
      version: bcs.u16(),
    })
  }

  readonly $typeArg: Type

  readonly id: string
  readonly fields: VecMap<string, string>
  readonly version: number

  constructor(typeArg: Type, fields: DisplayFields) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.fields = fields.fields
    this.version = fields.version
  }

  static fromFields(typeArg: Type, fields: Record<string, any>): Display {
    return new Display(typeArg, {
      id: UID.fromFields(fields.id).id,
      fields: VecMap.fromFields<string, string>(
        [`0x1::string::String`, `0x1::string::String`],
        fields.fields
      ),
      version: fields.version,
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Display {
    if (!isDisplay(item.type)) {
      throw new Error('not a Display type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new Display(typeArgs[0], {
      id: item.fields.id.id,
      fields: VecMap.fromFieldsWithTypes<string, string>(item.fields.fields),
      version: item.fields.version,
    })
  }

  static fromBcs(typeArg: Type, data: Uint8Array): Display {
    return Display.fromFields(typeArg, Display.bcs.parse(data))
  }

  static fromSuiParsedData(content: SuiParsedData) {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isDisplay(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Display object`)
    }
    return Display.fromFieldsWithTypes(content)
  }

  static async fetch(client: SuiClient, id: string): Promise<Display> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching Display object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isDisplay(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a Display object`)
    }
    return Display.fromFieldsWithTypes(res.data.content)
  }
}

/* ============================== DisplayCreated =============================== */

export function isDisplayCreated(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::display::DisplayCreated<')
}

export interface DisplayCreatedFields {
  id: string
}

export class DisplayCreated {
  static readonly $typeName = '0x2::display::DisplayCreated'
  static readonly $numTypeParams = 1

  static get bcs() {
    return bcs.struct('DisplayCreated', {
      id: ID.bcs,
    })
  }

  readonly $typeArg: Type

  readonly id: string

  constructor(typeArg: Type, id: string) {
    this.$typeArg = typeArg

    this.id = id
  }

  static fromFields(typeArg: Type, fields: Record<string, any>): DisplayCreated {
    return new DisplayCreated(typeArg, ID.fromFields(fields.id).bytes)
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): DisplayCreated {
    if (!isDisplayCreated(item.type)) {
      throw new Error('not a DisplayCreated type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new DisplayCreated(typeArgs[0], item.fields.id)
  }

  static fromBcs(typeArg: Type, data: Uint8Array): DisplayCreated {
    return DisplayCreated.fromFields(typeArg, DisplayCreated.bcs.parse(data))
  }
}

/* ============================== VersionUpdated =============================== */

export function isVersionUpdated(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::display::VersionUpdated<')
}

export interface VersionUpdatedFields {
  id: string
  version: number
  fields: VecMap<string, string>
}

export class VersionUpdated {
  static readonly $typeName = '0x2::display::VersionUpdated'
  static readonly $numTypeParams = 1

  static get bcs() {
    return bcs.struct('VersionUpdated', {
      id: ID.bcs,
      version: bcs.u16(),
      fields: VecMap.bcs(String.bcs, String.bcs),
    })
  }

  readonly $typeArg: Type

  readonly id: string
  readonly version: number
  readonly fields: VecMap<string, string>

  constructor(typeArg: Type, fields: VersionUpdatedFields) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.version = fields.version
    this.fields = fields.fields
  }

  static fromFields(typeArg: Type, fields: Record<string, any>): VersionUpdated {
    return new VersionUpdated(typeArg, {
      id: ID.fromFields(fields.id).bytes,
      version: fields.version,
      fields: VecMap.fromFields<string, string>(
        [`0x1::string::String`, `0x1::string::String`],
        fields.fields
      ),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): VersionUpdated {
    if (!isVersionUpdated(item.type)) {
      throw new Error('not a VersionUpdated type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new VersionUpdated(typeArgs[0], {
      id: item.fields.id,
      version: item.fields.version,
      fields: VecMap.fromFieldsWithTypes<string, string>(item.fields.fields),
    })
  }

  static fromBcs(typeArg: Type, data: Uint8Array): VersionUpdated {
    return VersionUpdated.fromFields(typeArg, VersionUpdated.bcs.parse(data))
  }
}
