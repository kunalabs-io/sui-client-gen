import { ToField, decodeFromFields, decodeFromFieldsWithTypes } from '../../_framework/reified'
import { FieldsWithTypes, compressSuiType } from '../../_framework/util'
import { ID, UID } from '../object/structs'
import { bcs } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== VersionChangeCap =============================== */

export function isVersionChangeCap(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x2::versioned::VersionChangeCap'
}

export interface VersionChangeCapFields {
  versionedId: ToField<ID>
  oldVersion: ToField<'u64'>
}

export class VersionChangeCap {
  static readonly $typeName = '0x2::versioned::VersionChangeCap'
  static readonly $numTypeParams = 0

  readonly $typeName = VersionChangeCap.$typeName

  static get bcs() {
    return bcs.struct('VersionChangeCap', {
      versioned_id: ID.bcs,
      old_version: bcs.u64(),
    })
  }

  readonly versionedId: ToField<ID>
  readonly oldVersion: ToField<'u64'>

  private constructor(fields: VersionChangeCapFields) {
    this.versionedId = fields.versionedId
    this.oldVersion = fields.oldVersion
  }

  static new(fields: VersionChangeCapFields): VersionChangeCap {
    return new VersionChangeCap(fields)
  }

  static reified() {
    return {
      typeName: VersionChangeCap.$typeName,
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => VersionChangeCap.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => VersionChangeCap.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => VersionChangeCap.fromBcs(data),
      bcs: VersionChangeCap.bcs,
      __class: null as unknown as ReturnType<typeof VersionChangeCap.new>,
    }
  }

  static fromFields(fields: Record<string, any>): VersionChangeCap {
    return VersionChangeCap.new({
      versionedId: decodeFromFields(ID.reified(), fields.versioned_id),
      oldVersion: decodeFromFields('u64', fields.old_version),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): VersionChangeCap {
    if (!isVersionChangeCap(item.type)) {
      throw new Error('not a VersionChangeCap type')
    }

    return VersionChangeCap.new({
      versionedId: decodeFromFieldsWithTypes(ID.reified(), item.fields.versioned_id),
      oldVersion: decodeFromFieldsWithTypes('u64', item.fields.old_version),
    })
  }

  static fromBcs(data: Uint8Array): VersionChangeCap {
    return VersionChangeCap.fromFields(VersionChangeCap.bcs.parse(data))
  }

  toJSONField() {
    return {
      versionedId: this.versionedId,
      oldVersion: this.oldVersion.toString(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, ...this.toJSONField() }
  }
}

/* ============================== Versioned =============================== */

export function isVersioned(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x2::versioned::Versioned'
}

export interface VersionedFields {
  id: ToField<UID>
  version: ToField<'u64'>
}

export class Versioned {
  static readonly $typeName = '0x2::versioned::Versioned'
  static readonly $numTypeParams = 0

  readonly $typeName = Versioned.$typeName

  static get bcs() {
    return bcs.struct('Versioned', {
      id: UID.bcs,
      version: bcs.u64(),
    })
  }

  readonly id: ToField<UID>
  readonly version: ToField<'u64'>

  private constructor(fields: VersionedFields) {
    this.id = fields.id
    this.version = fields.version
  }

  static new(fields: VersionedFields): Versioned {
    return new Versioned(fields)
  }

  static reified() {
    return {
      typeName: Versioned.$typeName,
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => Versioned.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Versioned.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => Versioned.fromBcs(data),
      bcs: Versioned.bcs,
      __class: null as unknown as ReturnType<typeof Versioned.new>,
    }
  }

  static fromFields(fields: Record<string, any>): Versioned {
    return Versioned.new({
      id: decodeFromFields(UID.reified(), fields.id),
      version: decodeFromFields('u64', fields.version),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Versioned {
    if (!isVersioned(item.type)) {
      throw new Error('not a Versioned type')
    }

    return Versioned.new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      version: decodeFromFieldsWithTypes('u64', item.fields.version),
    })
  }

  static fromBcs(data: Uint8Array): Versioned {
    return Versioned.fromFields(Versioned.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
      version: this.version.toString(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, ...this.toJSONField() }
  }

  static fromSuiParsedData(content: SuiParsedData): Versioned {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isVersioned(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Versioned object`)
    }
    return Versioned.fromFieldsWithTypes(content)
  }

  static async fetch(client: SuiClient, id: string): Promise<Versioned> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching Versioned object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isVersioned(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a Versioned object`)
    }
    return Versioned.fromFieldsWithTypes(res.data.content)
  }
}
