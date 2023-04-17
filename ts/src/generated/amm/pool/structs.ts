import { JsonRpcProvider, ObjectId, SuiParsedData } from '@mysten/sui.js'
import { PACKAGE_ID } from '..'
import { Balance, Supply } from 'framework/balance'
import { parseTypeName, Type } from 'framework/type'
import { Table } from 'framework/table'
import { bcs } from 'framework/bcs'
import { BCS, Encoding } from '@mysten/bcs'
import { FieldsWithTypes } from 'framework/util'
import { TypeName } from 'framework/type-name'
import { ID, UID } from 'framework/object'

/* ============================== PoolCreationEvent ============================== */

bcs.registerStructType(`${PACKAGE_ID}::pool::PoolCreationEvent`, { pool_id: '0x2::object::ID' })

export function isPoolCreationEvent(type: Type): boolean {
  return type === `${PACKAGE_ID}::pool::PoolCreationEvent`
}

export class PoolCreationEvent {
  static readonly $typeName = `${PACKAGE_ID}::pool::PoolCreationEvent`
  static readonly $numTypeParams = 0

  readonly poolId: ObjectId

  constructor(poolId: ObjectId) {
    this.poolId = poolId
  }

  static fromFields(fields: Record<string, any>): PoolCreationEvent {
    return new PoolCreationEvent(ID.fromFields(fields.pool_id).bytes)
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): PoolCreationEvent {
    if (!isPoolCreationEvent(item.type)) {
      throw new Error(`not a PoolCreationEvent type`)
    }

    return new PoolCreationEvent(item.fields.pool_id)
  }

  static fromBcs(data: Uint8Array | string, encoding?: Encoding): PoolCreationEvent {
    return PoolCreationEvent.fromFields(
      bcs.de(`${PACKAGE_ID}::pool::PoolCreationEvent`, data, encoding)
    )
  }
}

/* ===================================== LP ====================================== */

bcs.registerStructType([`${PACKAGE_ID}::pool::LP`, 'A', 'B'], {})

export function isLp(type: Type): boolean {
  return type.startsWith(`${PACKAGE_ID}::pool::LP<`)
}

export class LP {
  static readonly $typeName = `${PACKAGE_ID}::pool::LP`
  static readonly $numTypeParams = 2

  readonly $typeArgs: [Type, Type]

  constructor(typeArgs: [Type, Type]) {
    this.$typeArgs = typeArgs
  }

  static fromFields(typeArgs: [Type, Type]): LP {
    return new LP(typeArgs)
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): LP {
    if (!isLp(item.type)) {
      throw new Error(`not a LP type`)
    }
    const { typeArgs } = parseTypeName(item.type)

    return new LP(typeArgs as [Type, Type])
  }

  static fromBcs(typeArgs: [Type, Type]): LP {
    return LP.fromFields(typeArgs)
  }
}

/* ==================================== Pool ===================================== */

bcs.registerStructType([`${PACKAGE_ID}::pool::Pool`, 'A', 'B'], {
  id: '0x2::object::UID',
  balance_a: ['0x2::balance::Balance', 'A'],
  balance_b: ['0x2::balance::Balance', 'B'],
  lp_supply: ['0x2::balance::Supply', [`${PACKAGE_ID}::pool::LP`, 'A', 'B']],
  lp_fee_bps: BCS.U64,
  admin_fee_pct: BCS.U64,
  admin_fee_balance: ['0x2::balance::Balance', [`${PACKAGE_ID}::pool::LP`, 'A', 'B']],
})

export function isPool(type: Type) {
  return type.startsWith(`${PACKAGE_ID}::pool::Pool<`)
}

export interface PoolFields {
  id: ObjectId
  balanceA: Balance
  balanceB: Balance
  lpSupply: Supply
  lpFeeBps: bigint
  adminFeePct: bigint
  adminFeeBalance: Balance
}

/** Pool represents an AMM Pool. */
export class Pool {
  static readonly $typeName = `${PACKAGE_ID}::pool::Pool`
  static readonly $numTypeParams = 2

  readonly $typeArgs: [Type, Type]

  readonly id: ObjectId
  readonly balanceA: Balance
  readonly balanceB: Balance
  readonly lpSupply: Supply
  readonly lpFeeBps: bigint
  readonly adminFeePct: bigint
  readonly adminFeeBalance: Balance

  constructor(typeArgs: [Type, Type], fields: PoolFields) {
    this.$typeArgs = typeArgs
    this.id = fields.id
    this.balanceA = fields.balanceA
    this.balanceB = fields.balanceB
    this.lpSupply = fields.lpSupply
    this.lpFeeBps = fields.lpFeeBps
    this.adminFeePct = fields.adminFeePct
    this.adminFeeBalance = fields.adminFeeBalance
  }

  static fromFields(typeArgs: [Type, Type], fields: Record<string, any>): Pool {
    return new Pool(typeArgs, {
      id: UID.fromFields(fields.id).id.bytes,
      balanceA: Balance.fromFields(typeArgs[0], fields.balance_a),
      balanceB: Balance.fromFields(typeArgs[1], fields.balance_b),
      lpSupply: Supply.fromFields(
        `${PACKAGE_ID}::pool::LP<${typeArgs[0]}, ${typeArgs[1]}>`,
        fields.lp_supply
      ),
      lpFeeBps: BigInt(fields.lp_fee_bps),
      adminFeePct: BigInt(fields.admin_fee_pct),
      adminFeeBalance: Balance.fromFields(
        `${PACKAGE_ID}::pool::LP<${typeArgs[0]}, ${typeArgs[1]}>`,
        fields.admin_fee_balance
      ),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Pool {
    if (!isPool(item.type)) {
      throw new Error(`not a Pool type`)
    }

    const { typeArgs } = parseTypeName(item.type)
    const [typeA, typeB] = typeArgs

    return new Pool([typeA, typeB], {
      id: UID.fromFieldsWithTypes(item.fields.id).id.bytes,
      balanceA: Balance.fromFieldsWithTypes(typeA, item.fields.balance_a),
      balanceB: Balance.fromFieldsWithTypes(typeB, item.fields.balance_b),
      lpSupply: Supply.fromFieldsWithTypes(item.fields.lp_supply),
      lpFeeBps: BigInt(item.fields.lp_fee_bps),
      adminFeePct: BigInt(item.fields.admin_fee_pct),
      adminFeeBalance: Balance.fromFieldsWithTypes(typeB, item.fields.admin_fee_balance),
    })
  }

  static fromBcs(typeArgs: [Type, Type], data: Uint8Array | string, encoding?: Encoding): Pool {
    return Pool.fromFields(
      typeArgs,
      bcs.de([`${PACKAGE_ID}::pool::Pool`, ...typeArgs], data, encoding)
    )
  }

  static fromSuiParsedData(content: SuiParsedData): Pool {
    if (content.dataType !== 'moveObject') {
      throw new Error(`not an object`)
    }
    if (!isPool(content.type)) {
      throw new Error(`object at ${content.fields.id.id} is not a Pool`)
    }
    return Pool.fromFieldsWithTypes(content)
  }

  static async fetch(provider: JsonRpcProvider, id: ObjectId): Promise<Pool> {
    const res = await provider.getObject({
      id,
      options: {
        showBcs: true,
      },
    })
    if (res.error) {
      throw new Error(`Error fetching Pool object at ${id}: ${res.error.code}`)
    }
    if (res.data!.bcs!.dataType !== 'moveObject' || !isPool(res.data!.bcs!.type)) {
      throw new Error(`object at ${id} is not a Pool`)
    }
    const { typeArgs } = parseTypeName(res.data!.bcs!.type)

    return this.fromBcs(typeArgs as [Type, Type], res.data!.bcs!.bcsBytes, 'base64')
  }
}

/* ================================ PoolRegistry ================================= */

bcs.registerStructType(`${PACKAGE_ID}::pool::PoolRegistry`, {
  id: '0x2::object::UID',
  table: ['0x2::table::Table', `${PACKAGE_ID}::pool::PoolRegistryItem`, 'bool'],
})

export function isPoolRegistry(type: Type) {
  return type === `${PACKAGE_ID}::pool::PoolRegistry`
}

export interface PoolRegistryFields {
  id: ObjectId
  table: Table
}

/**
 * `PoolRegistry` stores a table of all pools created which is used to guarantee
 * that only one pool per currency pair can exist.
 */
export class PoolRegistry {
  static readonly $typeName = `${PACKAGE_ID}::pool::PoolRegistry`
  static readonly $numTypeParams = 0

  readonly id: ObjectId
  readonly table: Table

  constructor(fields: PoolRegistryFields) {
    this.id = fields.id
    this.table = fields.table
  }

  static fromFields(fields: Record<string, any>): PoolRegistry {
    return new PoolRegistry({
      id: UID.fromFields(fields.id).id.bytes,
      table: Table.fromFields([`${PACKAGE_ID}::pool::PoolRegistryItem`, 'bool'], fields.table),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): PoolRegistry {
    if (!isPoolRegistry(item.type)) {
      throw new Error(`not a PoolRegistry type`)
    }

    return new PoolRegistry({
      id: item.fields.id.id,
      table: Table.fromFieldsWithTypes(item.fields.table),
    })
  }

  static fromBcs(data: Uint8Array | string, encoding?: Encoding): PoolRegistry {
    return PoolRegistry.fromFields(bcs.de(`${PACKAGE_ID}::pool::PoolRegistry`, data, encoding))
  }

  static fromSuiParsedData(content: SuiParsedData): PoolRegistry {
    if (content.dataType !== 'moveObject') {
      throw new Error(`not an object`)
    }
    if (!isPoolRegistry(content.type)) {
      throw new Error(`object at ${content.fields.id.id} is not a PoolRegistry`)
    }
    return PoolRegistry.fromFields(content.fields)
  }

  static async fetch(provider: JsonRpcProvider, id: ObjectId): Promise<PoolRegistry> {
    const res = await provider.getObject({
      id,
      options: {
        showBcs: true,
      },
    })
    if (res.error) {
      throw new Error(`Error fetching PoolRegistry object at ${id}: ${res.error.tag}`)
    }
    if (res.data!.bcs!.dataType !== 'moveObject' || !isPoolRegistry(res.data!.bcs!.type)) {
      throw new Error(`object at ${id} is not a PoolRegistry`)
    }

    return this.fromBcs(res.data!.bcs!.bcsBytes, 'base64')
  }
}

/* =============================== PoolRegistryItem ============================== */

export const poolRegistryItemType = `${PACKAGE_ID}::pool::PoolRegistryItem`

bcs.registerStructType(poolRegistryItemType, {
  a: '0x1::type_name::TypeName',
  b: '0x1::type_name::TypeName',
})

export function isPoolRegistryItem(type: Type) {
  return type === `${PACKAGE_ID}::pool::PoolRegistryItem`
}

export interface PoolRegistryItemFields {
  a: TypeName
  b: TypeName
}

export class PoolRegistryItem {
  static readonly $typeName = `${PACKAGE_ID}::pool::PoolRegistryItem`
  static readonly $numTypeParams = 0

  readonly a: TypeName
  readonly b: TypeName

  constructor(fields: PoolRegistryItemFields) {
    this.a = fields.a
    this.b = fields.b
  }

  static fromFields(fields: Record<string, any>): PoolRegistryItem {
    return new PoolRegistryItem({
      a: TypeName.fromFields(fields.a),
      b: TypeName.fromFields(fields.b),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): PoolRegistryItem {
    if (!isPoolRegistryItem(item.type)) {
      throw new Error(`not a PoolRegistryItem type`)
    }

    return new PoolRegistryItem({
      a: TypeName.fromFieldsWithTypes(item.fields.a),
      b: TypeName.fromFieldsWithTypes(item.fields.b),
    })
  }

  static fromBcs(data: string | Uint8Array, encoding?: Encoding): PoolRegistryItem {
    return PoolRegistryItem.fromFields(bcs.de(poolRegistryItemType, data, encoding))
  }
}
