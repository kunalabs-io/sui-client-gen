import * as reified from '../../_framework/reified'
import { TypeName } from '../../_dependencies/source/0x1/type-name/structs'
import {
  PhantomTypeArgument,
  Reified,
  ReifiedPhantomTypeArgument,
  ToField,
  ToPhantomTypeArgument,
  ToTypeStr,
  assertFieldsWithTypesArgsMatch,
  assertReifiedTypeArgsMatch,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  extractType,
  ToTypeStr as ToPhantom,
} from '../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../_framework/util'
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface AdminCapFields {
  id: ToField<UID>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class AdminCap {
  static readonly $typeName =
    '0xf917eb03d02b9221b10276064b2c10296276cb43feb24aac35113a272dd691c7::pool::AdminCap'
  static readonly $numTypeParams = 0

  readonly $fullTypeName =
    null as unknown as '0xf917eb03d02b9221b10276064b2c10296276cb43feb24aac35113a272dd691c7::pool::AdminCap'

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

  static reified(): Reified<AdminCap> {
    return {
      typeName: AdminCap.$typeName,
      fullTypeName: composeSuiType(
        AdminCap.$typeName,
        ...[]
      ) as '0xf917eb03d02b9221b10276064b2c10296276cb43feb24aac35113a272dd691c7::pool::AdminCap',
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => AdminCap.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => AdminCap.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => AdminCap.fromBcs(data),
      bcs: AdminCap.bcs,
      fromJSONField: (field: any) => AdminCap.fromJSONField(field),
      fetch: async (client: SuiClient, id: string) => AdminCap.fetch(client, id),
      kind: 'StructClassReified',
    }
  }

  static fromFields(fields: Record<string, any>): AdminCap {
    return AdminCap.new(decodeFromFields(UID.reified(), fields.id))
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): AdminCap {
    if (!isAdminCap(item.type)) {
      throw new Error('not a AdminCap type')
    }

    return AdminCap.new(decodeFromFieldsWithTypes(UID.reified(), item.fields.id))
  }

  static fromBcs(data: Uint8Array): AdminCap {
    return AdminCap.fromFields(AdminCap.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, ...this.toJSONField() }
  }

  static fromJSONField(field: any): AdminCap {
    return AdminCap.new(decodeFromJSONField(UID.reified(), field.id))
  }

  static fromJSON(json: Record<string, any>): AdminCap {
    if (json.$typeName !== AdminCap.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return AdminCap.fromJSONField(json)
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface LPFields<A extends PhantomTypeArgument, B extends PhantomTypeArgument> {
  dummyField: ToField<'bool'>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class LP<A extends PhantomTypeArgument, B extends PhantomTypeArgument> {
  static readonly $typeName =
    '0xf917eb03d02b9221b10276064b2c10296276cb43feb24aac35113a272dd691c7::pool::LP'
  static readonly $numTypeParams = 2

  readonly $fullTypeName =
    null as unknown as `0xf917eb03d02b9221b10276064b2c10296276cb43feb24aac35113a272dd691c7::pool::LP<${ToTypeStr<A>}, ${ToTypeStr<B>}>`

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

  static new<A extends ReifiedPhantomTypeArgument, B extends ReifiedPhantomTypeArgument>(
    typeArgs: [A, B],
    dummyField: ToField<'bool'>
  ): LP<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>> {
    return new LP(typeArgs.map(extractType) as [string, string], dummyField)
  }

  static reified<A extends ReifiedPhantomTypeArgument, B extends ReifiedPhantomTypeArgument>(
    A: A,
    B: B
  ): Reified<LP<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>>> {
    return {
      typeName: LP.$typeName,
      fullTypeName: composeSuiType(
        LP.$typeName,
        ...[extractType(A), extractType(B)]
      ) as `0xf917eb03d02b9221b10276064b2c10296276cb43feb24aac35113a272dd691c7::pool::LP<${ToTypeStr<
        ToPhantomTypeArgument<A>
      >}, ${ToTypeStr<ToPhantomTypeArgument<B>>}>`,
      typeArgs: [A, B],
      fromFields: (fields: Record<string, any>) => LP.fromFields([A, B], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => LP.fromFieldsWithTypes([A, B], item),
      fromBcs: (data: Uint8Array) => LP.fromBcs([A, B], data),
      bcs: LP.bcs,
      fromJSONField: (field: any) => LP.fromJSONField([A, B], field),
      fetch: async (client: SuiClient, id: string) => LP.fetch(client, [A, B], id),
      kind: 'StructClassReified',
    }
  }

  static fromFields<A extends ReifiedPhantomTypeArgument, B extends ReifiedPhantomTypeArgument>(
    typeArgs: [A, B],
    fields: Record<string, any>
  ): LP<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>> {
    return LP.new(typeArgs, decodeFromFields('bool', fields.dummy_field))
  }

  static fromFieldsWithTypes<
    A extends ReifiedPhantomTypeArgument,
    B extends ReifiedPhantomTypeArgument,
  >(
    typeArgs: [A, B],
    item: FieldsWithTypes
  ): LP<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>> {
    if (!isLP(item.type)) {
      throw new Error('not a LP type')
    }
    assertFieldsWithTypesArgsMatch(item, typeArgs)

    return LP.new(typeArgs, decodeFromFieldsWithTypes('bool', item.fields.dummy_field))
  }

  static fromBcs<A extends ReifiedPhantomTypeArgument, B extends ReifiedPhantomTypeArgument>(
    typeArgs: [A, B],
    data: Uint8Array
  ): LP<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>> {
    return LP.fromFields(typeArgs, LP.bcs.parse(data))
  }

  toJSONField() {
    return {
      dummyField: this.dummyField,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<A extends ReifiedPhantomTypeArgument, B extends ReifiedPhantomTypeArgument>(
    typeArgs: [A, B],
    field: any
  ): LP<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>> {
    return LP.new(typeArgs, decodeFromJSONField('bool', field.dummyField))
  }

  static fromJSON<A extends ReifiedPhantomTypeArgument, B extends ReifiedPhantomTypeArgument>(
    typeArgs: [A, B],
    json: Record<string, any>
  ): LP<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>> {
    if (json.$typeName !== LP.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(LP.$typeName, ...typeArgs.map(extractType)),
      json.$typeArgs,
      typeArgs
    )

    return LP.fromJSONField(typeArgs, json)
  }

  static fromSuiParsedData<
    A extends ReifiedPhantomTypeArgument,
    B extends ReifiedPhantomTypeArgument,
  >(
    typeArgs: [A, B],
    content: SuiParsedData
  ): LP<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isLP(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a LP object`)
    }
    return LP.fromFieldsWithTypes(typeArgs, content)
  }

  static async fetch<A extends ReifiedPhantomTypeArgument, B extends ReifiedPhantomTypeArgument>(
    client: SuiClient,
    typeArgs: [A, B],
    id: string
  ): Promise<LP<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>>> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching LP object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isLP(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a LP object`)
    }
    return LP.fromFieldsWithTypes(typeArgs, res.data.content)
  }
}

/* ============================== Pool =============================== */

export function isPool(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(
    '0xf917eb03d02b9221b10276064b2c10296276cb43feb24aac35113a272dd691c7::pool::Pool<'
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface PoolFields<A extends PhantomTypeArgument, B extends PhantomTypeArgument> {
  id: ToField<UID>
  balanceA: ToField<Balance<A>>
  balanceB: ToField<Balance<B>>
  lpSupply: ToField<Supply<ToPhantom<LP<A, B>>>>
  lpFeeBps: ToField<'u64'>
  adminFeePct: ToField<'u64'>
  adminFeeBalance: ToField<Balance<ToPhantom<LP<A, B>>>>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Pool<A extends PhantomTypeArgument, B extends PhantomTypeArgument> {
  static readonly $typeName =
    '0xf917eb03d02b9221b10276064b2c10296276cb43feb24aac35113a272dd691c7::pool::Pool'
  static readonly $numTypeParams = 2

  readonly $fullTypeName =
    null as unknown as `0xf917eb03d02b9221b10276064b2c10296276cb43feb24aac35113a272dd691c7::pool::Pool<${ToTypeStr<A>}, ${ToTypeStr<B>}>`

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
  readonly balanceA: ToField<Balance<A>>
  readonly balanceB: ToField<Balance<B>>
  readonly lpSupply: ToField<Supply<ToPhantom<LP<A, B>>>>
  readonly lpFeeBps: ToField<'u64'>
  readonly adminFeePct: ToField<'u64'>
  readonly adminFeeBalance: ToField<Balance<ToPhantom<LP<A, B>>>>

  private constructor(typeArgs: [string, string], fields: PoolFields<A, B>) {
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.balanceA = fields.balanceA
    this.balanceB = fields.balanceB
    this.lpSupply = fields.lpSupply
    this.lpFeeBps = fields.lpFeeBps
    this.adminFeePct = fields.adminFeePct
    this.adminFeeBalance = fields.adminFeeBalance
  }

  static new<A extends ReifiedPhantomTypeArgument, B extends ReifiedPhantomTypeArgument>(
    typeArgs: [A, B],
    fields: PoolFields<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>>
  ): Pool<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>> {
    return new Pool(typeArgs.map(extractType) as [string, string], fields)
  }

  static reified<A extends ReifiedPhantomTypeArgument, B extends ReifiedPhantomTypeArgument>(
    A: A,
    B: B
  ): Reified<Pool<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>>> {
    return {
      typeName: Pool.$typeName,
      fullTypeName: composeSuiType(
        Pool.$typeName,
        ...[extractType(A), extractType(B)]
      ) as `0xf917eb03d02b9221b10276064b2c10296276cb43feb24aac35113a272dd691c7::pool::Pool<${ToTypeStr<
        ToPhantomTypeArgument<A>
      >}, ${ToTypeStr<ToPhantomTypeArgument<B>>}>`,
      typeArgs: [A, B],
      fromFields: (fields: Record<string, any>) => Pool.fromFields([A, B], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Pool.fromFieldsWithTypes([A, B], item),
      fromBcs: (data: Uint8Array) => Pool.fromBcs([A, B], data),
      bcs: Pool.bcs,
      fromJSONField: (field: any) => Pool.fromJSONField([A, B], field),
      fetch: async (client: SuiClient, id: string) => Pool.fetch(client, [A, B], id),
      kind: 'StructClassReified',
    }
  }

  static fromFields<A extends ReifiedPhantomTypeArgument, B extends ReifiedPhantomTypeArgument>(
    typeArgs: [A, B],
    fields: Record<string, any>
  ): Pool<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>> {
    return Pool.new(typeArgs, {
      id: decodeFromFields(UID.reified(), fields.id),
      balanceA: decodeFromFields(Balance.reified(typeArgs[0]), fields.balance_a),
      balanceB: decodeFromFields(Balance.reified(typeArgs[1]), fields.balance_b),
      lpSupply: decodeFromFields(
        Supply.reified(LP.reified(typeArgs[0], typeArgs[1])),
        fields.lp_supply
      ),
      lpFeeBps: decodeFromFields('u64', fields.lp_fee_bps),
      adminFeePct: decodeFromFields('u64', fields.admin_fee_pct),
      adminFeeBalance: decodeFromFields(
        Balance.reified(LP.reified(typeArgs[0], typeArgs[1])),
        fields.admin_fee_balance
      ),
    })
  }

  static fromFieldsWithTypes<
    A extends ReifiedPhantomTypeArgument,
    B extends ReifiedPhantomTypeArgument,
  >(
    typeArgs: [A, B],
    item: FieldsWithTypes
  ): Pool<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>> {
    if (!isPool(item.type)) {
      throw new Error('not a Pool type')
    }
    assertFieldsWithTypesArgsMatch(item, typeArgs)

    return Pool.new(typeArgs, {
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      balanceA: decodeFromFieldsWithTypes(Balance.reified(typeArgs[0]), item.fields.balance_a),
      balanceB: decodeFromFieldsWithTypes(Balance.reified(typeArgs[1]), item.fields.balance_b),
      lpSupply: decodeFromFieldsWithTypes(
        Supply.reified(LP.reified(typeArgs[0], typeArgs[1])),
        item.fields.lp_supply
      ),
      lpFeeBps: decodeFromFieldsWithTypes('u64', item.fields.lp_fee_bps),
      adminFeePct: decodeFromFieldsWithTypes('u64', item.fields.admin_fee_pct),
      adminFeeBalance: decodeFromFieldsWithTypes(
        Balance.reified(LP.reified(typeArgs[0], typeArgs[1])),
        item.fields.admin_fee_balance
      ),
    })
  }

  static fromBcs<A extends ReifiedPhantomTypeArgument, B extends ReifiedPhantomTypeArgument>(
    typeArgs: [A, B],
    data: Uint8Array
  ): Pool<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>> {
    return Pool.fromFields(typeArgs, Pool.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
      balanceA: this.balanceA.toJSONField(),
      balanceB: this.balanceB.toJSONField(),
      lpSupply: this.lpSupply.toJSONField(),
      lpFeeBps: this.lpFeeBps.toString(),
      adminFeePct: this.adminFeePct.toString(),
      adminFeeBalance: this.adminFeeBalance.toJSONField(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<A extends ReifiedPhantomTypeArgument, B extends ReifiedPhantomTypeArgument>(
    typeArgs: [A, B],
    field: any
  ): Pool<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>> {
    return Pool.new(typeArgs, {
      id: decodeFromJSONField(UID.reified(), field.id),
      balanceA: decodeFromJSONField(Balance.reified(typeArgs[0]), field.balanceA),
      balanceB: decodeFromJSONField(Balance.reified(typeArgs[1]), field.balanceB),
      lpSupply: decodeFromJSONField(
        Supply.reified(LP.reified(typeArgs[0], typeArgs[1])),
        field.lpSupply
      ),
      lpFeeBps: decodeFromJSONField('u64', field.lpFeeBps),
      adminFeePct: decodeFromJSONField('u64', field.adminFeePct),
      adminFeeBalance: decodeFromJSONField(
        Balance.reified(LP.reified(typeArgs[0], typeArgs[1])),
        field.adminFeeBalance
      ),
    })
  }

  static fromJSON<A extends ReifiedPhantomTypeArgument, B extends ReifiedPhantomTypeArgument>(
    typeArgs: [A, B],
    json: Record<string, any>
  ): Pool<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>> {
    if (json.$typeName !== Pool.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Pool.$typeName, ...typeArgs.map(extractType)),
      json.$typeArgs,
      typeArgs
    )

    return Pool.fromJSONField(typeArgs, json)
  }

  static fromSuiParsedData<
    A extends ReifiedPhantomTypeArgument,
    B extends ReifiedPhantomTypeArgument,
  >(
    typeArgs: [A, B],
    content: SuiParsedData
  ): Pool<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isPool(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Pool object`)
    }
    return Pool.fromFieldsWithTypes(typeArgs, content)
  }

  static async fetch<A extends ReifiedPhantomTypeArgument, B extends ReifiedPhantomTypeArgument>(
    client: SuiClient,
    typeArgs: [A, B],
    id: string
  ): Promise<Pool<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>>> {
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface PoolCreationEventFields {
  poolId: ToField<ID>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class PoolCreationEvent {
  static readonly $typeName =
    '0xf917eb03d02b9221b10276064b2c10296276cb43feb24aac35113a272dd691c7::pool::PoolCreationEvent'
  static readonly $numTypeParams = 0

  readonly $fullTypeName =
    null as unknown as '0xf917eb03d02b9221b10276064b2c10296276cb43feb24aac35113a272dd691c7::pool::PoolCreationEvent'

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

  static reified(): Reified<PoolCreationEvent> {
    return {
      typeName: PoolCreationEvent.$typeName,
      fullTypeName: composeSuiType(
        PoolCreationEvent.$typeName,
        ...[]
      ) as '0xf917eb03d02b9221b10276064b2c10296276cb43feb24aac35113a272dd691c7::pool::PoolCreationEvent',
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => PoolCreationEvent.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => PoolCreationEvent.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => PoolCreationEvent.fromBcs(data),
      bcs: PoolCreationEvent.bcs,
      fromJSONField: (field: any) => PoolCreationEvent.fromJSONField(field),
      fetch: async (client: SuiClient, id: string) => PoolCreationEvent.fetch(client, id),
      kind: 'StructClassReified',
    }
  }

  static fromFields(fields: Record<string, any>): PoolCreationEvent {
    return PoolCreationEvent.new(decodeFromFields(ID.reified(), fields.pool_id))
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): PoolCreationEvent {
    if (!isPoolCreationEvent(item.type)) {
      throw new Error('not a PoolCreationEvent type')
    }

    return PoolCreationEvent.new(decodeFromFieldsWithTypes(ID.reified(), item.fields.pool_id))
  }

  static fromBcs(data: Uint8Array): PoolCreationEvent {
    return PoolCreationEvent.fromFields(PoolCreationEvent.bcs.parse(data))
  }

  toJSONField() {
    return {
      poolId: this.poolId,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, ...this.toJSONField() }
  }

  static fromJSONField(field: any): PoolCreationEvent {
    return PoolCreationEvent.new(decodeFromJSONField(ID.reified(), field.poolId))
  }

  static fromJSON(json: Record<string, any>): PoolCreationEvent {
    if (json.$typeName !== PoolCreationEvent.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return PoolCreationEvent.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): PoolCreationEvent {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isPoolCreationEvent(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a PoolCreationEvent object`)
    }
    return PoolCreationEvent.fromFieldsWithTypes(content)
  }

  static async fetch(client: SuiClient, id: string): Promise<PoolCreationEvent> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching PoolCreationEvent object at id ${id}: ${res.error.code}`)
    }
    if (
      res.data?.content?.dataType !== 'moveObject' ||
      !isPoolCreationEvent(res.data.content.type)
    ) {
      throw new Error(`object at id ${id} is not a PoolCreationEvent object`)
    }
    return PoolCreationEvent.fromFieldsWithTypes(res.data.content)
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface PoolRegistryFields {
  id: ToField<UID>
  table: ToField<Table<ToPhantom<PoolRegistryItem>, 'bool'>>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class PoolRegistry {
  static readonly $typeName =
    '0xf917eb03d02b9221b10276064b2c10296276cb43feb24aac35113a272dd691c7::pool::PoolRegistry'
  static readonly $numTypeParams = 0

  readonly $fullTypeName =
    null as unknown as '0xf917eb03d02b9221b10276064b2c10296276cb43feb24aac35113a272dd691c7::pool::PoolRegistry'

  readonly $typeName = PoolRegistry.$typeName

  static get bcs() {
    return bcs.struct('PoolRegistry', {
      id: UID.bcs,
      table: Table.bcs,
    })
  }

  readonly id: ToField<UID>
  readonly table: ToField<Table<ToPhantom<PoolRegistryItem>, 'bool'>>

  private constructor(fields: PoolRegistryFields) {
    this.id = fields.id
    this.table = fields.table
  }

  static new(fields: PoolRegistryFields): PoolRegistry {
    return new PoolRegistry(fields)
  }

  static reified(): Reified<PoolRegistry> {
    return {
      typeName: PoolRegistry.$typeName,
      fullTypeName: composeSuiType(
        PoolRegistry.$typeName,
        ...[]
      ) as '0xf917eb03d02b9221b10276064b2c10296276cb43feb24aac35113a272dd691c7::pool::PoolRegistry',
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => PoolRegistry.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => PoolRegistry.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => PoolRegistry.fromBcs(data),
      bcs: PoolRegistry.bcs,
      fromJSONField: (field: any) => PoolRegistry.fromJSONField(field),
      fetch: async (client: SuiClient, id: string) => PoolRegistry.fetch(client, id),
      kind: 'StructClassReified',
    }
  }

  static fromFields(fields: Record<string, any>): PoolRegistry {
    return PoolRegistry.new({
      id: decodeFromFields(UID.reified(), fields.id),
      table: decodeFromFields(
        Table.reified(PoolRegistryItem.reified(), reified.phantom('bool')),
        fields.table
      ),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): PoolRegistry {
    if (!isPoolRegistry(item.type)) {
      throw new Error('not a PoolRegistry type')
    }

    return PoolRegistry.new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      table: decodeFromFieldsWithTypes(
        Table.reified(PoolRegistryItem.reified(), reified.phantom('bool')),
        item.fields.table
      ),
    })
  }

  static fromBcs(data: Uint8Array): PoolRegistry {
    return PoolRegistry.fromFields(PoolRegistry.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
      table: this.table.toJSONField(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, ...this.toJSONField() }
  }

  static fromJSONField(field: any): PoolRegistry {
    return PoolRegistry.new({
      id: decodeFromJSONField(UID.reified(), field.id),
      table: decodeFromJSONField(
        Table.reified(PoolRegistryItem.reified(), reified.phantom('bool')),
        field.table
      ),
    })
  }

  static fromJSON(json: Record<string, any>): PoolRegistry {
    if (json.$typeName !== PoolRegistry.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return PoolRegistry.fromJSONField(json)
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface PoolRegistryItemFields {
  a: ToField<TypeName>
  b: ToField<TypeName>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class PoolRegistryItem {
  static readonly $typeName =
    '0xf917eb03d02b9221b10276064b2c10296276cb43feb24aac35113a272dd691c7::pool::PoolRegistryItem'
  static readonly $numTypeParams = 0

  readonly $fullTypeName =
    null as unknown as '0xf917eb03d02b9221b10276064b2c10296276cb43feb24aac35113a272dd691c7::pool::PoolRegistryItem'

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

  static reified(): Reified<PoolRegistryItem> {
    return {
      typeName: PoolRegistryItem.$typeName,
      fullTypeName: composeSuiType(
        PoolRegistryItem.$typeName,
        ...[]
      ) as '0xf917eb03d02b9221b10276064b2c10296276cb43feb24aac35113a272dd691c7::pool::PoolRegistryItem',
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => PoolRegistryItem.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => PoolRegistryItem.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => PoolRegistryItem.fromBcs(data),
      bcs: PoolRegistryItem.bcs,
      fromJSONField: (field: any) => PoolRegistryItem.fromJSONField(field),
      fetch: async (client: SuiClient, id: string) => PoolRegistryItem.fetch(client, id),
      kind: 'StructClassReified',
    }
  }

  static fromFields(fields: Record<string, any>): PoolRegistryItem {
    return PoolRegistryItem.new({
      a: decodeFromFields(TypeName.reified(), fields.a),
      b: decodeFromFields(TypeName.reified(), fields.b),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): PoolRegistryItem {
    if (!isPoolRegistryItem(item.type)) {
      throw new Error('not a PoolRegistryItem type')
    }

    return PoolRegistryItem.new({
      a: decodeFromFieldsWithTypes(TypeName.reified(), item.fields.a),
      b: decodeFromFieldsWithTypes(TypeName.reified(), item.fields.b),
    })
  }

  static fromBcs(data: Uint8Array): PoolRegistryItem {
    return PoolRegistryItem.fromFields(PoolRegistryItem.bcs.parse(data))
  }

  toJSONField() {
    return {
      a: this.a.toJSONField(),
      b: this.b.toJSONField(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, ...this.toJSONField() }
  }

  static fromJSONField(field: any): PoolRegistryItem {
    return PoolRegistryItem.new({
      a: decodeFromJSONField(TypeName.reified(), field.a),
      b: decodeFromJSONField(TypeName.reified(), field.b),
    })
  }

  static fromJSON(json: Record<string, any>): PoolRegistryItem {
    if (json.$typeName !== PoolRegistryItem.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return PoolRegistryItem.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): PoolRegistryItem {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isPoolRegistryItem(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a PoolRegistryItem object`)
    }
    return PoolRegistryItem.fromFieldsWithTypes(content)
  }

  static async fetch(client: SuiClient, id: string): Promise<PoolRegistryItem> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching PoolRegistryItem object at id ${id}: ${res.error.code}`)
    }
    if (
      res.data?.content?.dataType !== 'moveObject' ||
      !isPoolRegistryItem(res.data.content.type)
    ) {
      throw new Error(`object at id ${id} is not a PoolRegistryItem object`)
    }
    return PoolRegistryItem.fromFieldsWithTypes(res.data.content)
  }
}
