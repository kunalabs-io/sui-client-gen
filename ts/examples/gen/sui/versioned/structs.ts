import { FieldsWithTypes, Type, compressSuiType } from '../../_framework/util'
import { ID, UID } from '../object/structs'
import { bcs } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== VersionChangeCap =============================== */

export function isVersionChangeCap(type: Type): boolean {
  type = compressSuiType(type)
  return type === '0x2::versioned::VersionChangeCap'
}

export interface VersionChangeCapFields {
  versionedId: string
  oldVersion: bigint
}

export class VersionChangeCap {
  static readonly $typeName = '0x2::versioned::VersionChangeCap'
  static readonly $numTypeParams = 0

  static get bcs() {
    return bcs.struct('VersionChangeCap', {
      versioned_id: ID.bcs,
      old_version: bcs.u64(),
    })
  }

  readonly versionedId: string
  readonly oldVersion: bigint

  constructor(fields: VersionChangeCapFields) {
    this.versionedId = fields.versionedId
    this.oldVersion = fields.oldVersion
  }

  static fromFields(fields: Record<string, any>): VersionChangeCap {
    return new VersionChangeCap({
      versionedId: ID.fromFields(fields.versioned_id).bytes,
      oldVersion: BigInt(fields.old_version),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): VersionChangeCap {
    if (!isVersionChangeCap(item.type)) {
      throw new Error('not a VersionChangeCap type')
    }
    return new VersionChangeCap({
      versionedId: item.fields.versioned_id,
      oldVersion: BigInt(item.fields.old_version),
    })
  }

  static fromBcs(data: Uint8Array): VersionChangeCap {
    return VersionChangeCap.fromFields(VersionChangeCap.bcs.parse(data))
  }
}

/* ============================== Versioned =============================== */

export function isVersioned(type: Type): boolean {
  type = compressSuiType(type)
  return type === '0x2::versioned::Versioned'
}

export interface VersionedFields {
  id: string
  version: bigint
}

export class Versioned {
  static readonly $typeName = '0x2::versioned::Versioned'
  static readonly $numTypeParams = 0

  static get bcs() {
    return bcs.struct('Versioned', {
      id: UID.bcs,
      version: bcs.u64(),
    })
  }

  readonly id: string
  readonly version: bigint

  constructor(fields: VersionedFields) {
    this.id = fields.id
    this.version = fields.version
  }

  static fromFields(fields: Record<string, any>): Versioned {
    return new Versioned({ id: UID.fromFields(fields.id).id, version: BigInt(fields.version) })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Versioned {
    if (!isVersioned(item.type)) {
      throw new Error('not a Versioned type')
    }
    return new Versioned({ id: item.fields.id.id, version: BigInt(item.fields.version) })
  }

  static fromBcs(data: Uint8Array): Versioned {
    return Versioned.fromFields(Versioned.bcs.parse(data))
  }

  static fromSuiParsedData(content: SuiParsedData) {
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
