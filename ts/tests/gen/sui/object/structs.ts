import { initLoaderIfNeeded } from '../../_framework/init-source'
import { structClassLoaderSource } from '../../_framework/loader'
import {
  FieldsWithTypes,
  Type,
  compressSuiType,
  genericToJSON,
  parseTypeName,
} from '../../_framework/util'
import { BcsType, bcs, fromHEX, toHEX } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== DynamicFields =============================== */

export function isDynamicFields(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::object::DynamicFields<')
}

export interface DynamicFieldsFields<K> {
  names: Array<K>
}

export class DynamicFields<K> {
  static readonly $typeName = '0x2::object::DynamicFields'
  static readonly $numTypeParams = 1

  static get bcs() {
    return <K extends BcsType<any>>(K: K) =>
      bcs.struct(`DynamicFields<${K.name}>`, {
        names: bcs.vector(K),
      })
  }

  readonly $typeArg: Type

  readonly names: Array<K>

  constructor(typeArg: Type, names: Array<K>) {
    this.$typeArg = typeArg

    this.names = names
  }

  static fromFields<K>(typeArg: Type, fields: Record<string, any>): DynamicFields<K> {
    initLoaderIfNeeded()

    return new DynamicFields(
      typeArg,
      fields.names.map((item: any) => structClassLoaderSource.fromFields(typeArg, item))
    )
  }

  static fromFieldsWithTypes<K>(item: FieldsWithTypes): DynamicFields<K> {
    initLoaderIfNeeded()

    if (!isDynamicFields(item.type)) {
      throw new Error('not a DynamicFields type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new DynamicFields(
      typeArgs[0],
      item.fields.names.map((item: any) =>
        structClassLoaderSource.fromFieldsWithTypes(typeArgs[0], item)
      )
    )
  }

  static fromBcs<K>(typeArg: Type, data: Uint8Array): DynamicFields<K> {
    initLoaderIfNeeded()

    const typeArgs = [typeArg]

    return DynamicFields.fromFields(
      typeArg,
      DynamicFields.bcs(structClassLoaderSource.getBcsType(typeArgs[0])).parse(data)
    )
  }

  toJSON() {
    return {
      $typeArg: this.$typeArg,
      names: genericToJSON(`vector<${this.$typeArg}>`, this.names),
    }
  }

  static fromSuiParsedData(content: SuiParsedData) {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isDynamicFields(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a DynamicFields object`)
    }
    return DynamicFields.fromFieldsWithTypes(content)
  }

  static async fetch<K>(client: SuiClient, id: string): Promise<DynamicFields<K>> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching DynamicFields object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isDynamicFields(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a DynamicFields object`)
    }
    return DynamicFields.fromFieldsWithTypes(res.data.content)
  }
}

/* ============================== ID =============================== */

export function isID(type: Type): boolean {
  type = compressSuiType(type)
  return type === '0x2::object::ID'
}

export interface IDFields {
  bytes: string
}

export class ID {
  static readonly $typeName = '0x2::object::ID'
  static readonly $numTypeParams = 0

  static get bcs() {
    return bcs.struct('ID', {
      bytes: bcs.bytes(32).transform({
        input: (val: string) => fromHEX(val),
        output: (val: Uint8Array) => toHEX(val),
      }),
    })
  }

  readonly bytes: string

  constructor(bytes: string) {
    this.bytes = bytes
  }

  static fromFields(fields: Record<string, any>): ID {
    return new ID(`0x${fields.bytes}`)
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): ID {
    if (!isID(item.type)) {
      throw new Error('not a ID type')
    }
    return new ID(item.fields.bytes)
  }

  static fromBcs(data: Uint8Array): ID {
    return ID.fromFields(ID.bcs.parse(data))
  }

  toJSON() {
    return {
      bytes: this.bytes,
    }
  }
}

/* ============================== Ownership =============================== */

export function isOwnership(type: Type): boolean {
  type = compressSuiType(type)
  return type === '0x2::object::Ownership'
}

export interface OwnershipFields {
  owner: string
  status: bigint
}

export class Ownership {
  static readonly $typeName = '0x2::object::Ownership'
  static readonly $numTypeParams = 0

  static get bcs() {
    return bcs.struct('Ownership', {
      owner: bcs.bytes(32).transform({
        input: (val: string) => fromHEX(val),
        output: (val: Uint8Array) => toHEX(val),
      }),
      status: bcs.u64(),
    })
  }

  readonly owner: string
  readonly status: bigint

  constructor(fields: OwnershipFields) {
    this.owner = fields.owner
    this.status = fields.status
  }

  static fromFields(fields: Record<string, any>): Ownership {
    return new Ownership({ owner: `0x${fields.owner}`, status: BigInt(fields.status) })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Ownership {
    if (!isOwnership(item.type)) {
      throw new Error('not a Ownership type')
    }
    return new Ownership({ owner: item.fields.owner, status: BigInt(item.fields.status) })
  }

  static fromBcs(data: Uint8Array): Ownership {
    return Ownership.fromFields(Ownership.bcs.parse(data))
  }

  toJSON() {
    return {
      owner: this.owner,
      status: this.status.toString(),
    }
  }

  static fromSuiParsedData(content: SuiParsedData) {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isOwnership(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Ownership object`)
    }
    return Ownership.fromFieldsWithTypes(content)
  }

  static async fetch(client: SuiClient, id: string): Promise<Ownership> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching Ownership object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isOwnership(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a Ownership object`)
    }
    return Ownership.fromFieldsWithTypes(res.data.content)
  }
}

/* ============================== UID =============================== */

export function isUID(type: Type): boolean {
  type = compressSuiType(type)
  return type === '0x2::object::UID'
}

export interface UIDFields {
  id: string
}

export class UID {
  static readonly $typeName = '0x2::object::UID'
  static readonly $numTypeParams = 0

  static get bcs() {
    return bcs.struct('UID', {
      id: ID.bcs,
    })
  }

  readonly id: string

  constructor(id: string) {
    this.id = id
  }

  static fromFields(fields: Record<string, any>): UID {
    return new UID(ID.fromFields(fields.id).bytes)
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): UID {
    if (!isUID(item.type)) {
      throw new Error('not a UID type')
    }
    return new UID(item.fields.id)
  }

  static fromBcs(data: Uint8Array): UID {
    return UID.fromFields(UID.bcs.parse(data))
  }

  toJSON() {
    return {
      id: this.id,
    }
  }
}
