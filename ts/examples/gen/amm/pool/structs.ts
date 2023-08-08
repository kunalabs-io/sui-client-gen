import { TypeName } from '../../_dependencies/source/0x1/type-name/structs'
import { bcsSource as bcs } from '../../_framework/bcs'
import { FieldsWithTypes, Type, parseTypeName } from '../../_framework/util'
import { Balance, Supply } from '../../sui/balance/structs'
import { ID, UID } from '../../sui/object/structs'
import { Table } from '../../sui/table/structs'
import { Encoding } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== AdminCap =============================== */

bcs.registerStructType(
  '0xa2e606bf4fc2f98902fea611310f9f3d826aeacef767db704126b63ce16670bc::pool::AdminCap',
  {
    id: `0x2::object::UID`,
  }
)

export function isAdminCap(type: Type): boolean {
  return (
    type === '0xa2e606bf4fc2f98902fea611310f9f3d826aeacef767db704126b63ce16670bc::pool::AdminCap'
  )
}

export interface AdminCapFields {
  id: string
}

export class AdminCap {
  static readonly $typeName =
    '0xa2e606bf4fc2f98902fea611310f9f3d826aeacef767db704126b63ce16670bc::pool::AdminCap'
  static readonly $numTypeParams = 0

  readonly id: string

  constructor(id: string) {
    this.id = id
  }

  static fromFields(fields: Record<string, any>): AdminCap {
    return new AdminCap(UID.fromFields(fields.id).id)
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): AdminCap {
    if (!isAdminCap(item.type)) {
      throw new Error('not a AdminCap type')
    }
    return new AdminCap(item.fields.id.id)
  }

  static fromBcs(data: Uint8Array | string, encoding?: Encoding): AdminCap {
    return AdminCap.fromFields(bcs.de([AdminCap.$typeName], data, encoding))
  }

  static fromSuiParsedData(content: SuiParsedData) {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isAdminCap(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a AdminCap object`)
    }
    return AdminCap.fromFieldsWithTypes(content)
  }

  static async fetch(client: SuiClient, id: string): Promise<AdminCap> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching AdminCap object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isAdminCap(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a AdminCap object`)
    }
    return AdminCap.fromFieldsWithTypes(res.data.content)
  }
}

/* ============================== LP =============================== */

bcs.registerStructType(
  '0xa2e606bf4fc2f98902fea611310f9f3d826aeacef767db704126b63ce16670bc::pool::LP<A, B>',
  {
    dummy_field: `bool`,
  }
)

export function isLP(type: Type): boolean {
  return type.startsWith(
    '0xa2e606bf4fc2f98902fea611310f9f3d826aeacef767db704126b63ce16670bc::pool::LP<'
  )
}

export interface LPFields {
  dummyField: boolean
}

export class LP {
  static readonly $typeName =
    '0xa2e606bf4fc2f98902fea611310f9f3d826aeacef767db704126b63ce16670bc::pool::LP'
  static readonly $numTypeParams = 2

  readonly $typeArgs: [Type, Type]

  readonly dummyField: boolean

  constructor(typeArgs: [Type, Type], dummyField: boolean) {
    this.$typeArgs = typeArgs

    this.dummyField = dummyField
  }

  static fromFields(typeArgs: [Type, Type], fields: Record<string, any>): LP {
    return new LP(typeArgs, fields.dummy_field)
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): LP {
    if (!isLP(item.type)) {
      throw new Error('not a LP type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new LP([typeArgs[0], typeArgs[1]], item.fields.dummy_field)
  }

  static fromBcs(typeArgs: [Type, Type], data: Uint8Array | string, encoding?: Encoding): LP {
    return LP.fromFields(typeArgs, bcs.de([LP.$typeName, ...typeArgs], data, encoding))
  }
}

/* ============================== Pool =============================== */

bcs.registerStructType(
  '0xa2e606bf4fc2f98902fea611310f9f3d826aeacef767db704126b63ce16670bc::pool::Pool<A, B>',
  {
    id: `0x2::object::UID`,
    balance_a: `0x2::balance::Balance<A>`,
    balance_b: `0x2::balance::Balance<B>`,
    lp_supply: `0x2::balance::Supply<0xa2e606bf4fc2f98902fea611310f9f3d826aeacef767db704126b63ce16670bc::pool::LP<A, B>>`,
    lp_fee_bps: `u64`,
    admin_fee_pct: `u64`,
    admin_fee_balance: `0x2::balance::Balance<0xa2e606bf4fc2f98902fea611310f9f3d826aeacef767db704126b63ce16670bc::pool::LP<A, B>>`,
  }
)

export function isPool(type: Type): boolean {
  return type.startsWith(
    '0xa2e606bf4fc2f98902fea611310f9f3d826aeacef767db704126b63ce16670bc::pool::Pool<'
  )
}

export interface PoolFields {
  id: string
  balanceA: Balance
  balanceB: Balance
  lpSupply: Supply
  lpFeeBps: bigint
  adminFeePct: bigint
  adminFeeBalance: Balance
}

export class Pool {
  static readonly $typeName =
    '0xa2e606bf4fc2f98902fea611310f9f3d826aeacef767db704126b63ce16670bc::pool::Pool'
  static readonly $numTypeParams = 2

  readonly $typeArgs: [Type, Type]

  readonly id: string
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
      id: UID.fromFields(fields.id).id,
      balanceA: Balance.fromFields(`${typeArgs[0]}`, fields.balance_a),
      balanceB: Balance.fromFields(`${typeArgs[1]}`, fields.balance_b),
      lpSupply: Supply.fromFields(
        `0xa2e606bf4fc2f98902fea611310f9f3d826aeacef767db704126b63ce16670bc::pool::LP<${typeArgs[0]}, ${typeArgs[1]}>`,
        fields.lp_supply
      ),
      lpFeeBps: BigInt(fields.lp_fee_bps),
      adminFeePct: BigInt(fields.admin_fee_pct),
      adminFeeBalance: Balance.fromFields(
        `0xa2e606bf4fc2f98902fea611310f9f3d826aeacef767db704126b63ce16670bc::pool::LP<${typeArgs[0]}, ${typeArgs[1]}>`,
        fields.admin_fee_balance
      ),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Pool {
    if (!isPool(item.type)) {
      throw new Error('not a Pool type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new Pool([typeArgs[0], typeArgs[1]], {
      id: item.fields.id.id,
      balanceA: new Balance(`${typeArgs[0]}`, BigInt(item.fields.balance_a)),
      balanceB: new Balance(`${typeArgs[1]}`, BigInt(item.fields.balance_b)),
      lpSupply: Supply.fromFieldsWithTypes(item.fields.lp_supply),
      lpFeeBps: BigInt(item.fields.lp_fee_bps),
      adminFeePct: BigInt(item.fields.admin_fee_pct),
      adminFeeBalance: new Balance(
        `0xa2e606bf4fc2f98902fea611310f9f3d826aeacef767db704126b63ce16670bc::pool::LP<${typeArgs[0]}, ${typeArgs[1]}>`,
        BigInt(item.fields.admin_fee_balance)
      ),
    })
  }

  static fromBcs(typeArgs: [Type, Type], data: Uint8Array | string, encoding?: Encoding): Pool {
    return Pool.fromFields(typeArgs, bcs.de([Pool.$typeName, ...typeArgs], data, encoding))
  }

  static fromSuiParsedData(content: SuiParsedData) {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isPool(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Pool object`)
    }
    return Pool.fromFieldsWithTypes(content)
  }

  static async fetch(client: SuiClient, id: string): Promise<Pool> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching Pool object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isPool(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a Pool object`)
    }
    return Pool.fromFieldsWithTypes(res.data.content)
  }
}

/* ============================== PoolCreationEvent =============================== */

bcs.registerStructType(
  '0xa2e606bf4fc2f98902fea611310f9f3d826aeacef767db704126b63ce16670bc::pool::PoolCreationEvent',
  {
    pool_id: `0x2::object::ID`,
  }
)

export function isPoolCreationEvent(type: Type): boolean {
  return (
    type ===
    '0xa2e606bf4fc2f98902fea611310f9f3d826aeacef767db704126b63ce16670bc::pool::PoolCreationEvent'
  )
}

export interface PoolCreationEventFields {
  poolId: string
}

export class PoolCreationEvent {
  static readonly $typeName =
    '0xa2e606bf4fc2f98902fea611310f9f3d826aeacef767db704126b63ce16670bc::pool::PoolCreationEvent'
  static readonly $numTypeParams = 0

  readonly poolId: string

  constructor(poolId: string) {
    this.poolId = poolId
  }

  static fromFields(fields: Record<string, any>): PoolCreationEvent {
    return new PoolCreationEvent(ID.fromFields(fields.pool_id).bytes)
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): PoolCreationEvent {
    if (!isPoolCreationEvent(item.type)) {
      throw new Error('not a PoolCreationEvent type')
    }
    return new PoolCreationEvent(item.fields.pool_id)
  }

  static fromBcs(data: Uint8Array | string, encoding?: Encoding): PoolCreationEvent {
    return PoolCreationEvent.fromFields(bcs.de([PoolCreationEvent.$typeName], data, encoding))
  }
}

/* ============================== PoolRegistry =============================== */

bcs.registerStructType(
  '0xa2e606bf4fc2f98902fea611310f9f3d826aeacef767db704126b63ce16670bc::pool::PoolRegistry',
  {
    id: `0x2::object::UID`,
    table: `0x2::table::Table<0xa2e606bf4fc2f98902fea611310f9f3d826aeacef767db704126b63ce16670bc::pool::PoolRegistryItem, bool>`,
  }
)

export function isPoolRegistry(type: Type): boolean {
  return (
    type ===
    '0xa2e606bf4fc2f98902fea611310f9f3d826aeacef767db704126b63ce16670bc::pool::PoolRegistry'
  )
}

export interface PoolRegistryFields {
  id: string
  table: Table
}

export class PoolRegistry {
  static readonly $typeName =
    '0xa2e606bf4fc2f98902fea611310f9f3d826aeacef767db704126b63ce16670bc::pool::PoolRegistry'
  static readonly $numTypeParams = 0

  readonly id: string
  readonly table: Table

  constructor(fields: PoolRegistryFields) {
    this.id = fields.id
    this.table = fields.table
  }

  static fromFields(fields: Record<string, any>): PoolRegistry {
    return new PoolRegistry({
      id: UID.fromFields(fields.id).id,
      table: Table.fromFields(
        [
          `0xa2e606bf4fc2f98902fea611310f9f3d826aeacef767db704126b63ce16670bc::pool::PoolRegistryItem`,
          `bool`,
        ],
        fields.table
      ),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): PoolRegistry {
    if (!isPoolRegistry(item.type)) {
      throw new Error('not a PoolRegistry type')
    }
    return new PoolRegistry({
      id: item.fields.id.id,
      table: Table.fromFieldsWithTypes(item.fields.table),
    })
  }

  static fromBcs(data: Uint8Array | string, encoding?: Encoding): PoolRegistry {
    return PoolRegistry.fromFields(bcs.de([PoolRegistry.$typeName], data, encoding))
  }

  static fromSuiParsedData(content: SuiParsedData) {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isPoolRegistry(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a PoolRegistry object`)
    }
    return PoolRegistry.fromFieldsWithTypes(content)
  }

  static async fetch(client: SuiClient, id: string): Promise<PoolRegistry> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching PoolRegistry object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isPoolRegistry(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a PoolRegistry object`)
    }
    return PoolRegistry.fromFieldsWithTypes(res.data.content)
  }
}

/* ============================== PoolRegistryItem =============================== */

bcs.registerStructType(
  '0xa2e606bf4fc2f98902fea611310f9f3d826aeacef767db704126b63ce16670bc::pool::PoolRegistryItem',
  {
    a: `0x1::type_name::TypeName`,
    b: `0x1::type_name::TypeName`,
  }
)

export function isPoolRegistryItem(type: Type): boolean {
  return (
    type ===
    '0xa2e606bf4fc2f98902fea611310f9f3d826aeacef767db704126b63ce16670bc::pool::PoolRegistryItem'
  )
}

export interface PoolRegistryItemFields {
  a: TypeName
  b: TypeName
}

export class PoolRegistryItem {
  static readonly $typeName =
    '0xa2e606bf4fc2f98902fea611310f9f3d826aeacef767db704126b63ce16670bc::pool::PoolRegistryItem'
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
      throw new Error('not a PoolRegistryItem type')
    }
    return new PoolRegistryItem({
      a: TypeName.fromFieldsWithTypes(item.fields.a),
      b: TypeName.fromFieldsWithTypes(item.fields.b),
    })
  }

  static fromBcs(data: Uint8Array | string, encoding?: Encoding): PoolRegistryItem {
    return PoolRegistryItem.fromFields(bcs.de([PoolRegistryItem.$typeName], data, encoding))
  }
}
