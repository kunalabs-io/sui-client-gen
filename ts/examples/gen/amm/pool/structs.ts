import { TypeName } from '../../_dependencies/source/0x1/type-name/structs'
import {
  ReifiedTypeArgument,
  ToField,
  assertFieldsWithTypesArgsMatch,
  decodeFromFieldsGenericOrSpecial,
  decodeFromFieldsWithTypesGenericOrSpecial,
  extractType,
} from '../../_framework/types'
import { FieldsWithTypes, compressSuiType } from '../../_framework/util'
import { Balance, Supply } from '../../sui/balance/structs'
import { ID, UID } from '../../sui/object/structs'
import { Table } from '../../sui/table/structs'
import { bcs } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== AdminCap =============================== */

export function isAdminCap(type: string): boolean {
  type = compressSuiType(type)
  return (
    type === '0xf917eb03d02b9221b10276064b2c10296276cb43feb24aac35113a272dd691c7::pool::AdminCap'
  )
}

export interface AdminCapFields {
  id: ToField<UID>
}

export class AdminCap {
  static readonly $typeName =
    '0xf917eb03d02b9221b10276064b2c10296276cb43feb24aac35113a272dd691c7::pool::AdminCap'
  static readonly $numTypeParams = 0

  readonly $typeName = AdminCap.$typeName

  static get bcs() {
    return bcs.struct('AdminCap', {
      id: UID.bcs,
    })
  }

  readonly id: ToField<UID>

  private constructor(id: ToField<UID>) {
    this.id = id
  }

  static new(id: ToField<UID>): AdminCap {
    return new AdminCap(id)
  }

  static reified() {
    return {
      typeName: AdminCap.$typeName,
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => AdminCap.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => AdminCap.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => AdminCap.fromBcs(data),
      bcs: AdminCap.bcs,
      __class: null as unknown as ReturnType<typeof AdminCap.new>,
    }
  }

  static fromFields(fields: Record<string, any>): AdminCap {
    return AdminCap.new(decodeFromFieldsGenericOrSpecial(UID.reified(), fields.id))
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): AdminCap {
    if (!isAdminCap(item.type)) {
      throw new Error('not a AdminCap type')
    }

    return AdminCap.new(decodeFromFieldsWithTypesGenericOrSpecial(UID.reified(), item.fields.id))
  }

  static fromBcs(data: Uint8Array): AdminCap {
    return AdminCap.fromFields(AdminCap.bcs.parse(data))
  }

  toJSON() {
    return {
      id: this.id,
    }
  }

  static fromSuiParsedData(content: SuiParsedData): AdminCap {
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

export function isLP(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(
    '0xf917eb03d02b9221b10276064b2c10296276cb43feb24aac35113a272dd691c7::pool::LP<'
  )
}

export interface LPFields {
  dummyField: ToField<'bool'>
}

export class LP {
  static readonly $typeName =
    '0xf917eb03d02b9221b10276064b2c10296276cb43feb24aac35113a272dd691c7::pool::LP'
  static readonly $numTypeParams = 2

  readonly $typeName = LP.$typeName

  static get bcs() {
    return bcs.struct('LP', {
      dummy_field: bcs.bool(),
    })
  }

  readonly $typeArgs: [string, string]

  readonly dummyField: ToField<'bool'>

  private constructor(typeArgs: [string, string], dummyField: ToField<'bool'>) {
    this.$typeArgs = typeArgs

    this.dummyField = dummyField
  }

  static new(
    typeArgs: [ReifiedTypeArgument, ReifiedTypeArgument],
    dummyField: ToField<'bool'>
  ): LP {
    return new LP(typeArgs.map(extractType) as [string, string], dummyField)
  }

  static reified(A: ReifiedTypeArgument, B: ReifiedTypeArgument) {
    return {
      typeName: LP.$typeName,
      typeArgs: [A, B],
      fromFields: (fields: Record<string, any>) => LP.fromFields([A, B], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => LP.fromFieldsWithTypes([A, B], item),
      fromBcs: (data: Uint8Array) => LP.fromBcs([A, B], data),
      bcs: LP.bcs,
      __class: null as unknown as ReturnType<typeof LP.new>,
    }
  }

  static fromFields(
    typeArgs: [ReifiedTypeArgument, ReifiedTypeArgument],
    fields: Record<string, any>
  ): LP {
    return LP.new(typeArgs, decodeFromFieldsGenericOrSpecial('bool', fields.dummy_field))
  }

  static fromFieldsWithTypes(
    typeArgs: [ReifiedTypeArgument, ReifiedTypeArgument],
    item: FieldsWithTypes
  ): LP {
    if (!isLP(item.type)) {
      throw new Error('not a LP type')
    }
    assertFieldsWithTypesArgsMatch(item, typeArgs)

    return LP.new(
      typeArgs,
      decodeFromFieldsWithTypesGenericOrSpecial('bool', item.fields.dummy_field)
    )
  }

  static fromBcs(typeArgs: [ReifiedTypeArgument, ReifiedTypeArgument], data: Uint8Array): LP {
    return LP.fromFields(typeArgs, LP.bcs.parse(data))
  }

  toJSON() {
    return {
      $typeArgs: this.$typeArgs,
      dummyField: this.dummyField,
    }
  }
}

/* ============================== Pool =============================== */

export function isPool(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(
    '0xf917eb03d02b9221b10276064b2c10296276cb43feb24aac35113a272dd691c7::pool::Pool<'
  )
}

export interface PoolFields {
  id: ToField<UID>
  balanceA: ToField<Balance>
  balanceB: ToField<Balance>
  lpSupply: ToField<Supply>
  lpFeeBps: ToField<'u64'>
  adminFeePct: ToField<'u64'>
  adminFeeBalance: ToField<Balance>
}

export class Pool {
  static readonly $typeName =
    '0xf917eb03d02b9221b10276064b2c10296276cb43feb24aac35113a272dd691c7::pool::Pool'
  static readonly $numTypeParams = 2

  readonly $typeName = Pool.$typeName

  static get bcs() {
    return bcs.struct('Pool', {
      id: UID.bcs,
      balance_a: Balance.bcs,
      balance_b: Balance.bcs,
      lp_supply: Supply.bcs,
      lp_fee_bps: bcs.u64(),
      admin_fee_pct: bcs.u64(),
      admin_fee_balance: Balance.bcs,
    })
  }

  readonly $typeArgs: [string, string]

  readonly id: ToField<UID>
  readonly balanceA: ToField<Balance>
  readonly balanceB: ToField<Balance>
  readonly lpSupply: ToField<Supply>
  readonly lpFeeBps: ToField<'u64'>
  readonly adminFeePct: ToField<'u64'>
  readonly adminFeeBalance: ToField<Balance>

  private constructor(typeArgs: [string, string], fields: PoolFields) {
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.balanceA = fields.balanceA
    this.balanceB = fields.balanceB
    this.lpSupply = fields.lpSupply
    this.lpFeeBps = fields.lpFeeBps
    this.adminFeePct = fields.adminFeePct
    this.adminFeeBalance = fields.adminFeeBalance
  }

  static new(typeArgs: [ReifiedTypeArgument, ReifiedTypeArgument], fields: PoolFields): Pool {
    return new Pool(typeArgs.map(extractType) as [string, string], fields)
  }

  static reified(A: ReifiedTypeArgument, B: ReifiedTypeArgument) {
    return {
      typeName: Pool.$typeName,
      typeArgs: [A, B],
      fromFields: (fields: Record<string, any>) => Pool.fromFields([A, B], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Pool.fromFieldsWithTypes([A, B], item),
      fromBcs: (data: Uint8Array) => Pool.fromBcs([A, B], data),
      bcs: Pool.bcs,
      __class: null as unknown as ReturnType<typeof Pool.new>,
    }
  }

  static fromFields(
    typeArgs: [ReifiedTypeArgument, ReifiedTypeArgument],
    fields: Record<string, any>
  ): Pool {
    return Pool.new(typeArgs, {
      id: decodeFromFieldsGenericOrSpecial(UID.reified(), fields.id),
      balanceA: decodeFromFieldsGenericOrSpecial(Balance.reified(typeArgs[0]), fields.balance_a),
      balanceB: decodeFromFieldsGenericOrSpecial(Balance.reified(typeArgs[1]), fields.balance_b),
      lpSupply: decodeFromFieldsGenericOrSpecial(
        Supply.reified(LP.reified(typeArgs[0], typeArgs[1])),
        fields.lp_supply
      ),
      lpFeeBps: decodeFromFieldsGenericOrSpecial('u64', fields.lp_fee_bps),
      adminFeePct: decodeFromFieldsGenericOrSpecial('u64', fields.admin_fee_pct),
      adminFeeBalance: decodeFromFieldsGenericOrSpecial(
        Balance.reified(LP.reified(typeArgs[0], typeArgs[1])),
        fields.admin_fee_balance
      ),
    })
  }

  static fromFieldsWithTypes(
    typeArgs: [ReifiedTypeArgument, ReifiedTypeArgument],
    item: FieldsWithTypes
  ): Pool {
    if (!isPool(item.type)) {
      throw new Error('not a Pool type')
    }
    assertFieldsWithTypesArgsMatch(item, typeArgs)

    return Pool.new(typeArgs, {
      id: decodeFromFieldsWithTypesGenericOrSpecial(UID.reified(), item.fields.id),
      balanceA: decodeFromFieldsWithTypesGenericOrSpecial(
        Balance.reified(typeArgs[0]),
        item.fields.balance_a
      ),
      balanceB: decodeFromFieldsWithTypesGenericOrSpecial(
        Balance.reified(typeArgs[1]),
        item.fields.balance_b
      ),
      lpSupply: decodeFromFieldsWithTypesGenericOrSpecial(
        Supply.reified(LP.reified(typeArgs[0], typeArgs[1])),
        item.fields.lp_supply
      ),
      lpFeeBps: decodeFromFieldsWithTypesGenericOrSpecial('u64', item.fields.lp_fee_bps),
      adminFeePct: decodeFromFieldsWithTypesGenericOrSpecial('u64', item.fields.admin_fee_pct),
      adminFeeBalance: decodeFromFieldsWithTypesGenericOrSpecial(
        Balance.reified(LP.reified(typeArgs[0], typeArgs[1])),
        item.fields.admin_fee_balance
      ),
    })
  }

  static fromBcs(typeArgs: [ReifiedTypeArgument, ReifiedTypeArgument], data: Uint8Array): Pool {
    return Pool.fromFields(typeArgs, Pool.bcs.parse(data))
  }

  toJSON() {
    return {
      $typeArgs: this.$typeArgs,
      id: this.id,
      balanceA: this.balanceA.toJSON(),
      balanceB: this.balanceB.toJSON(),
      lpSupply: this.lpSupply.toJSON(),
      lpFeeBps: this.lpFeeBps.toString(),
      adminFeePct: this.adminFeePct.toString(),
      adminFeeBalance: this.adminFeeBalance.toJSON(),
    }
  }

  static fromSuiParsedData(
    typeArgs: [ReifiedTypeArgument, ReifiedTypeArgument],
    content: SuiParsedData
  ): Pool {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isPool(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Pool object`)
    }
    return Pool.fromFieldsWithTypes(typeArgs, content)
  }

  static async fetch(
    client: SuiClient,
    typeArgs: [ReifiedTypeArgument, ReifiedTypeArgument],
    id: string
  ): Promise<Pool> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching Pool object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isPool(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a Pool object`)
    }
    return Pool.fromFieldsWithTypes(typeArgs, res.data.content)
  }
}

/* ============================== PoolCreationEvent =============================== */

export function isPoolCreationEvent(type: string): boolean {
  type = compressSuiType(type)
  return (
    type ===
    '0xf917eb03d02b9221b10276064b2c10296276cb43feb24aac35113a272dd691c7::pool::PoolCreationEvent'
  )
}

export interface PoolCreationEventFields {
  poolId: ToField<ID>
}

export class PoolCreationEvent {
  static readonly $typeName =
    '0xf917eb03d02b9221b10276064b2c10296276cb43feb24aac35113a272dd691c7::pool::PoolCreationEvent'
  static readonly $numTypeParams = 0

  readonly $typeName = PoolCreationEvent.$typeName

  static get bcs() {
    return bcs.struct('PoolCreationEvent', {
      pool_id: ID.bcs,
    })
  }

  readonly poolId: ToField<ID>

  private constructor(poolId: ToField<ID>) {
    this.poolId = poolId
  }

  static new(poolId: ToField<ID>): PoolCreationEvent {
    return new PoolCreationEvent(poolId)
  }

  static reified() {
    return {
      typeName: PoolCreationEvent.$typeName,
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => PoolCreationEvent.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => PoolCreationEvent.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => PoolCreationEvent.fromBcs(data),
      bcs: PoolCreationEvent.bcs,
      __class: null as unknown as ReturnType<typeof PoolCreationEvent.new>,
    }
  }

  static fromFields(fields: Record<string, any>): PoolCreationEvent {
    return PoolCreationEvent.new(decodeFromFieldsGenericOrSpecial(ID.reified(), fields.pool_id))
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): PoolCreationEvent {
    if (!isPoolCreationEvent(item.type)) {
      throw new Error('not a PoolCreationEvent type')
    }

    return PoolCreationEvent.new(
      decodeFromFieldsWithTypesGenericOrSpecial(ID.reified(), item.fields.pool_id)
    )
  }

  static fromBcs(data: Uint8Array): PoolCreationEvent {
    return PoolCreationEvent.fromFields(PoolCreationEvent.bcs.parse(data))
  }

  toJSON() {
    return {
      poolId: this.poolId,
    }
  }
}

/* ============================== PoolRegistry =============================== */

export function isPoolRegistry(type: string): boolean {
  type = compressSuiType(type)
  return (
    type ===
    '0xf917eb03d02b9221b10276064b2c10296276cb43feb24aac35113a272dd691c7::pool::PoolRegistry'
  )
}

export interface PoolRegistryFields {
  id: ToField<UID>
  table: ToField<Table>
}

export class PoolRegistry {
  static readonly $typeName =
    '0xf917eb03d02b9221b10276064b2c10296276cb43feb24aac35113a272dd691c7::pool::PoolRegistry'
  static readonly $numTypeParams = 0

  readonly $typeName = PoolRegistry.$typeName

  static get bcs() {
    return bcs.struct('PoolRegistry', {
      id: UID.bcs,
      table: Table.bcs,
    })
  }

  readonly id: ToField<UID>
  readonly table: ToField<Table>

  private constructor(fields: PoolRegistryFields) {
    this.id = fields.id
    this.table = fields.table
  }

  static new(fields: PoolRegistryFields): PoolRegistry {
    return new PoolRegistry(fields)
  }

  static reified() {
    return {
      typeName: PoolRegistry.$typeName,
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => PoolRegistry.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => PoolRegistry.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => PoolRegistry.fromBcs(data),
      bcs: PoolRegistry.bcs,
      __class: null as unknown as ReturnType<typeof PoolRegistry.new>,
    }
  }

  static fromFields(fields: Record<string, any>): PoolRegistry {
    return PoolRegistry.new({
      id: decodeFromFieldsGenericOrSpecial(UID.reified(), fields.id),
      table: decodeFromFieldsGenericOrSpecial(
        Table.reified(PoolRegistryItem.reified(), 'bool'),
        fields.table
      ),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): PoolRegistry {
    if (!isPoolRegistry(item.type)) {
      throw new Error('not a PoolRegistry type')
    }

    return PoolRegistry.new({
      id: decodeFromFieldsWithTypesGenericOrSpecial(UID.reified(), item.fields.id),
      table: decodeFromFieldsWithTypesGenericOrSpecial(
        Table.reified(PoolRegistryItem.reified(), 'bool'),
        item.fields.table
      ),
    })
  }

  static fromBcs(data: Uint8Array): PoolRegistry {
    return PoolRegistry.fromFields(PoolRegistry.bcs.parse(data))
  }

  toJSON() {
    return {
      id: this.id,
      table: this.table.toJSON(),
    }
  }

  static fromSuiParsedData(content: SuiParsedData): PoolRegistry {
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

export function isPoolRegistryItem(type: string): boolean {
  type = compressSuiType(type)
  return (
    type ===
    '0xf917eb03d02b9221b10276064b2c10296276cb43feb24aac35113a272dd691c7::pool::PoolRegistryItem'
  )
}

export interface PoolRegistryItemFields {
  a: ToField<TypeName>
  b: ToField<TypeName>
}

export class PoolRegistryItem {
  static readonly $typeName =
    '0xf917eb03d02b9221b10276064b2c10296276cb43feb24aac35113a272dd691c7::pool::PoolRegistryItem'
  static readonly $numTypeParams = 0

  readonly $typeName = PoolRegistryItem.$typeName

  static get bcs() {
    return bcs.struct('PoolRegistryItem', {
      a: TypeName.bcs,
      b: TypeName.bcs,
    })
  }

  readonly a: ToField<TypeName>
  readonly b: ToField<TypeName>

  private constructor(fields: PoolRegistryItemFields) {
    this.a = fields.a
    this.b = fields.b
  }

  static new(fields: PoolRegistryItemFields): PoolRegistryItem {
    return new PoolRegistryItem(fields)
  }

  static reified() {
    return {
      typeName: PoolRegistryItem.$typeName,
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => PoolRegistryItem.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => PoolRegistryItem.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => PoolRegistryItem.fromBcs(data),
      bcs: PoolRegistryItem.bcs,
      __class: null as unknown as ReturnType<typeof PoolRegistryItem.new>,
    }
  }

  static fromFields(fields: Record<string, any>): PoolRegistryItem {
    return PoolRegistryItem.new({
      a: decodeFromFieldsGenericOrSpecial(TypeName.reified(), fields.a),
      b: decodeFromFieldsGenericOrSpecial(TypeName.reified(), fields.b),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): PoolRegistryItem {
    if (!isPoolRegistryItem(item.type)) {
      throw new Error('not a PoolRegistryItem type')
    }

    return PoolRegistryItem.new({
      a: decodeFromFieldsWithTypesGenericOrSpecial(TypeName.reified(), item.fields.a),
      b: decodeFromFieldsWithTypesGenericOrSpecial(TypeName.reified(), item.fields.b),
    })
  }

  static fromBcs(data: Uint8Array): PoolRegistryItem {
    return PoolRegistryItem.fromFields(PoolRegistryItem.bcs.parse(data))
  }

  toJSON() {
    return {
      a: this.a.toJSON(),
      b: this.b.toJSON(),
    }
  }
}
