import {
  Reified,
  ToField,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
} from '../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../_framework/util'
import { ID, UID } from '../object/structs'
import { bcs, fromB64 } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== Versioned =============================== */

export function isVersioned(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x2::versioned::Versioned'
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface VersionedFields {
  id: ToField<UID>
  version: ToField<'u64'>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Versioned {
  static readonly $typeName = '0x2::versioned::Versioned'
  static readonly $numTypeParams = 0

  readonly $typeName = Versioned.$typeName

  readonly $fullTypeName: '0x2::versioned::Versioned'

  readonly id: ToField<UID>
  readonly version: ToField<'u64'>

  private constructor(fields: VersionedFields) {
    this.$fullTypeName = Versioned.$typeName

    this.id = fields.id
    this.version = fields.version
  }

  static reified(): Reified<Versioned, VersionedFields> {
    return {
      typeName: Versioned.$typeName,
      fullTypeName: composeSuiType(Versioned.$typeName, ...[]) as '0x2::versioned::Versioned',
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => Versioned.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Versioned.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => Versioned.fromBcs(data),
      bcs: Versioned.bcs,
      fromJSONField: (field: any) => Versioned.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => Versioned.fromJSON(json),
      fetch: async (client: SuiClient, id: string) => Versioned.fetch(client, id),
      new: (fields: VersionedFields) => {
        return new Versioned(fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Versioned.reified()
  }

  static get bcs() {
    return bcs.struct('Versioned', {
      id: UID.bcs,
      version: bcs.u64(),
    })
  }

  static fromFields(fields: Record<string, any>): Versioned {
    return Versioned.reified().new({
      id: decodeFromFields(UID.reified(), fields.id),
      version: decodeFromFields('u64', fields.version),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Versioned {
    if (!isVersioned(item.type)) {
      throw new Error('not a Versioned type')
    }

    return Versioned.reified().new({
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

  static fromJSONField(field: any): Versioned {
    return Versioned.reified().new({
      id: decodeFromJSONField(UID.reified(), field.id),
      version: decodeFromJSONField('u64', field.version),
    })
  }

  static fromJSON(json: Record<string, any>): Versioned {
    if (json.$typeName !== Versioned.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return Versioned.fromJSONField(json)
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
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching Versioned object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isVersioned(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a Versioned object`)
    }
    return Versioned.fromBcs(fromB64(res.data.bcs.bcsBytes))
  }
}

/* ============================== VersionChangeCap =============================== */

export function isVersionChangeCap(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x2::versioned::VersionChangeCap'
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface VersionChangeCapFields {
  versionedId: ToField<ID>
  oldVersion: ToField<'u64'>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class VersionChangeCap {
  static readonly $typeName = '0x2::versioned::VersionChangeCap'
  static readonly $numTypeParams = 0

  readonly $typeName = VersionChangeCap.$typeName

  readonly $fullTypeName: '0x2::versioned::VersionChangeCap'

  readonly versionedId: ToField<ID>
  readonly oldVersion: ToField<'u64'>

  private constructor(fields: VersionChangeCapFields) {
    this.$fullTypeName = VersionChangeCap.$typeName

    this.versionedId = fields.versionedId
    this.oldVersion = fields.oldVersion
  }

  static reified(): Reified<VersionChangeCap, VersionChangeCapFields> {
    return {
      typeName: VersionChangeCap.$typeName,
      fullTypeName: composeSuiType(
        VersionChangeCap.$typeName,
        ...[]
      ) as '0x2::versioned::VersionChangeCap',
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => VersionChangeCap.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => VersionChangeCap.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => VersionChangeCap.fromBcs(data),
      bcs: VersionChangeCap.bcs,
      fromJSONField: (field: any) => VersionChangeCap.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => VersionChangeCap.fromJSON(json),
      fetch: async (client: SuiClient, id: string) => VersionChangeCap.fetch(client, id),
      new: (fields: VersionChangeCapFields) => {
        return new VersionChangeCap(fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return VersionChangeCap.reified()
  }

  static get bcs() {
    return bcs.struct('VersionChangeCap', {
      versioned_id: ID.bcs,
      old_version: bcs.u64(),
    })
  }

  static fromFields(fields: Record<string, any>): VersionChangeCap {
    return VersionChangeCap.reified().new({
      versionedId: decodeFromFields(ID.reified(), fields.versioned_id),
      oldVersion: decodeFromFields('u64', fields.old_version),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): VersionChangeCap {
    if (!isVersionChangeCap(item.type)) {
      throw new Error('not a VersionChangeCap type')
    }

    return VersionChangeCap.reified().new({
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

  static fromJSONField(field: any): VersionChangeCap {
    return VersionChangeCap.reified().new({
      versionedId: decodeFromJSONField(ID.reified(), field.versionedId),
      oldVersion: decodeFromJSONField('u64', field.oldVersion),
    })
  }

  static fromJSON(json: Record<string, any>): VersionChangeCap {
    if (json.$typeName !== VersionChangeCap.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return VersionChangeCap.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): VersionChangeCap {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isVersionChangeCap(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a VersionChangeCap object`)
    }
    return VersionChangeCap.fromFieldsWithTypes(content)
  }

  static async fetch(client: SuiClient, id: string): Promise<VersionChangeCap> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching VersionChangeCap object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isVersionChangeCap(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a VersionChangeCap object`)
    }
    return VersionChangeCap.fromBcs(fromB64(res.data.bcs.bcsBytes))
  }
}
