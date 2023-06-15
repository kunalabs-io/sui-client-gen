import { bcsSource as bcs } from '../../_framework/bcs'
import { initLoaderIfNeeded } from '../../_framework/init-source'
import { structClassLoaderSource } from '../../_framework/loader'
import { FieldsWithTypes, Type, parseTypeName } from '../../_framework/util'
import { Encoding } from '@mysten/bcs'
import { JsonRpcProvider, ObjectId, SuiParsedData } from '@mysten/sui.js'

/* ============================== DynamicFields =============================== */

bcs.registerStructType('0x2::object::DynamicFields<K>', {
  names: `vector<K>`,
})

export function isDynamicFields(type: Type): boolean {
  return type.startsWith('0x2::object::DynamicFields<')
}

export interface DynamicFieldsFields<K> {
  names: Array<K>
}

export class DynamicFields<K> {
  static readonly $typeName = '0x2::object::DynamicFields'
  static readonly $numTypeParams = 1

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

  static fromBcs<K>(
    typeArg: Type,
    data: Uint8Array | string,
    encoding?: Encoding
  ): DynamicFields<K> {
    return DynamicFields.fromFields(
      typeArg,
      bcs.de([DynamicFields.$typeName, typeArg], data, encoding)
    )
  }

  static fromSuiParsedData(content: SuiParsedData) {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isDynamicFields(content.type)) {
      throw new Error(`object at ${content.fields.id} is not a DynamicFields object`)
    }
    return DynamicFields.fromFieldsWithTypes(content)
  }

  static async fetch<K>(provider: JsonRpcProvider, id: ObjectId): Promise<DynamicFields<K>> {
    const res = await provider.getObject({ id, options: { showContent: true } })
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

bcs.registerStructType('0x2::object::ID', {
  bytes: `address`,
})

export function isID(type: Type): boolean {
  return type === '0x2::object::ID'
}

export interface IDFields {
  bytes: string
}

export class ID {
  static readonly $typeName = '0x2::object::ID'
  static readonly $numTypeParams = 0

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
    return new ID(`0x${item.fields.bytes}`)
  }

  static fromBcs(data: Uint8Array | string, encoding?: Encoding): ID {
    return ID.fromFields(bcs.de([ID.$typeName], data, encoding))
  }
}

/* ============================== Ownership =============================== */

bcs.registerStructType('0x2::object::Ownership', {
  owner: `address`,
  status: `u64`,
})

export function isOwnership(type: Type): boolean {
  return type === '0x2::object::Ownership'
}

export interface OwnershipFields {
  owner: string
  status: bigint
}

export class Ownership {
  static readonly $typeName = '0x2::object::Ownership'
  static readonly $numTypeParams = 0

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
    return new Ownership({ owner: `0x${item.fields.owner}`, status: BigInt(item.fields.status) })
  }

  static fromBcs(data: Uint8Array | string, encoding?: Encoding): Ownership {
    return Ownership.fromFields(bcs.de([Ownership.$typeName], data, encoding))
  }

  static fromSuiParsedData(content: SuiParsedData) {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isOwnership(content.type)) {
      throw new Error(`object at ${content.fields.id} is not a Ownership object`)
    }
    return Ownership.fromFieldsWithTypes(content)
  }

  static async fetch(provider: JsonRpcProvider, id: ObjectId): Promise<Ownership> {
    const res = await provider.getObject({ id, options: { showContent: true } })
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

bcs.registerStructType('0x2::object::UID', {
  id: `0x2::object::ID`,
})

export function isUID(type: Type): boolean {
  return type === '0x2::object::UID'
}

export interface UIDFields {
  id: ObjectId
}

export class UID {
  static readonly $typeName = '0x2::object::UID'
  static readonly $numTypeParams = 0

  readonly id: ObjectId

  constructor(id: ObjectId) {
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

  static fromBcs(data: Uint8Array | string, encoding?: Encoding): UID {
    return UID.fromFields(bcs.de([UID.$typeName], data, encoding))
  }
}
