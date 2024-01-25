import * as reified from '../../_framework/reified'
import { TypeName } from '../../_dependencies/source/0x1/type-name/structs'
import {
  PhantomReified,
  PhantomToTypeStr,
  PhantomTypeArgument,
  Reified,
  ToField,
  ToPhantomTypeArgument,
  ToTypeStr,
  assertFieldsWithTypesArgsMatch,
  assertReifiedTypeArgsMatch,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  extractType,
  phantom,
  ToTypeStr as ToPhantom,
} from '../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../_framework/util'
import { Balance, Supply } from '../../sui/balance/structs'
import { ID, UID } from '../../sui/object/structs'
import { Table } from '../../sui/table/structs'
import { bcs, fromB64 } from '@mysten/bcs'
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

export type AdminCapReified = Reified<AdminCap, AdminCapFields>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class AdminCap {
  static readonly $typeName =
    '0xf917eb03d02b9221b10276064b2c10296276cb43feb24aac35113a272dd691c7::pool::AdminCap'
  static readonly $numTypeParams = 0

  readonly $typeName = AdminCap.$typeName

  readonly $fullTypeName: '0xf917eb03d02b9221b10276064b2c10296276cb43feb24aac35113a272dd691c7::pool::AdminCap'

  readonly id: ToField<UID>

  private constructor(fields: AdminCapFields) {
    this.$fullTypeName = AdminCap.$typeName

    this.id = fields.id
  }

  static reified(): AdminCapReified {
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
      fromJSON: (json: Record<string, any>) => AdminCap.fromJSON(json),
      fetch: async (client: SuiClient, id: string) => AdminCap.fetch(client, id),
      new: (fields: AdminCapFields) => {
        return new AdminCap(fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return AdminCap.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<AdminCap>> {
    return phantom(AdminCap.reified())
  }
  static get p() {
    return AdminCap.phantom()
  }

  static get bcs() {
    return bcs.struct('AdminCap', {
      id: UID.bcs,
    })
  }

  static fromFields(fields: Record<string, any>): AdminCap {
    return AdminCap.reified().new({ id: decodeFromFields(UID.reified(), fields.id) })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): AdminCap {
    if (!isAdminCap(item.type)) {
      throw new Error('not a AdminCap type')
    }

    return AdminCap.reified().new({ id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id) })
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
    return AdminCap.reified().new({ id: decodeFromJSONField(UID.reified(), field.id) })
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
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching AdminCap object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isAdminCap(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a AdminCap object`)
    }
    return AdminCap.fromBcs(fromB64(res.data.bcs.bcsBytes))
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

export type LPReified<
  A extends PhantomReified<PhantomTypeArgument>,
  B extends PhantomReified<PhantomTypeArgument>,
> = Reified<
  LP<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>>,
  LPFields<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>>
>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class LP<A extends PhantomTypeArgument, B extends PhantomTypeArgument> {
  static readonly $typeName =
    '0xf917eb03d02b9221b10276064b2c10296276cb43feb24aac35113a272dd691c7::pool::LP'
  static readonly $numTypeParams = 2

  readonly $typeName = LP.$typeName

  readonly $fullTypeName: `0xf917eb03d02b9221b10276064b2c10296276cb43feb24aac35113a272dd691c7::pool::LP<${string}, ${string}>`

  readonly $typeArgs: [string, string]

  readonly dummyField: ToField<'bool'>

  private constructor(typeArgs: [string, string], fields: LPFields<A, B>) {
    this.$fullTypeName = composeSuiType(
      LP.$typeName,
      ...typeArgs
    ) as `0xf917eb03d02b9221b10276064b2c10296276cb43feb24aac35113a272dd691c7::pool::LP<${PhantomToTypeStr<A>}, ${PhantomToTypeStr<B>}>`

    this.$typeArgs = typeArgs

    this.dummyField = fields.dummyField
  }

  static reified<
    A extends PhantomReified<PhantomTypeArgument>,
    B extends PhantomReified<PhantomTypeArgument>,
  >(A: A, B: B): LPReified<A, B> {
    return {
      typeName: LP.$typeName,
      fullTypeName: composeSuiType(
        LP.$typeName,
        ...[extractType(A), extractType(B)]
      ) as `0xf917eb03d02b9221b10276064b2c10296276cb43feb24aac35113a272dd691c7::pool::LP<${PhantomToTypeStr<
        ToPhantomTypeArgument<A>
      >}, ${PhantomToTypeStr<ToPhantomTypeArgument<B>>}>`,
      typeArgs: [A, B],
      fromFields: (fields: Record<string, any>) => LP.fromFields([A, B], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => LP.fromFieldsWithTypes([A, B], item),
      fromBcs: (data: Uint8Array) => LP.fromBcs([A, B], data),
      bcs: LP.bcs,
      fromJSONField: (field: any) => LP.fromJSONField([A, B], field),
      fromJSON: (json: Record<string, any>) => LP.fromJSON([A, B], json),
      fetch: async (client: SuiClient, id: string) => LP.fetch(client, [A, B], id),
      new: (fields: LPFields<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>>) => {
        return new LP([extractType(A), extractType(B)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return LP.reified
  }

  static phantom<
    A extends PhantomReified<PhantomTypeArgument>,
    B extends PhantomReified<PhantomTypeArgument>,
  >(A: A, B: B): PhantomReified<ToTypeStr<LP<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>>>> {
    return phantom(LP.reified(A, B))
  }
  static get p() {
    return LP.phantom
  }

  static get bcs() {
    return bcs.struct('LP', {
      dummy_field: bcs.bool(),
    })
  }

  static fromFields<
    A extends PhantomReified<PhantomTypeArgument>,
    B extends PhantomReified<PhantomTypeArgument>,
  >(
    typeArgs: [A, B],
    fields: Record<string, any>
  ): LP<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>> {
    return LP.reified(typeArgs[0], typeArgs[1]).new({
      dummyField: decodeFromFields('bool', fields.dummy_field),
    })
  }

  static fromFieldsWithTypes<
    A extends PhantomReified<PhantomTypeArgument>,
    B extends PhantomReified<PhantomTypeArgument>,
  >(
    typeArgs: [A, B],
    item: FieldsWithTypes
  ): LP<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>> {
    if (!isLP(item.type)) {
      throw new Error('not a LP type')
    }
    assertFieldsWithTypesArgsMatch(item, typeArgs)

    return LP.reified(typeArgs[0], typeArgs[1]).new({
      dummyField: decodeFromFieldsWithTypes('bool', item.fields.dummy_field),
    })
  }

  static fromBcs<
    A extends PhantomReified<PhantomTypeArgument>,
    B extends PhantomReified<PhantomTypeArgument>,
  >(typeArgs: [A, B], data: Uint8Array): LP<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>> {
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

  static fromJSONField<
    A extends PhantomReified<PhantomTypeArgument>,
    B extends PhantomReified<PhantomTypeArgument>,
  >(typeArgs: [A, B], field: any): LP<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>> {
    return LP.reified(typeArgs[0], typeArgs[1]).new({
      dummyField: decodeFromJSONField('bool', field.dummyField),
    })
  }

  static fromJSON<
    A extends PhantomReified<PhantomTypeArgument>,
    B extends PhantomReified<PhantomTypeArgument>,
  >(
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
    A extends PhantomReified<PhantomTypeArgument>,
    B extends PhantomReified<PhantomTypeArgument>,
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

  static async fetch<
    A extends PhantomReified<PhantomTypeArgument>,
    B extends PhantomReified<PhantomTypeArgument>,
  >(
    client: SuiClient,
    typeArgs: [A, B],
    id: string
  ): Promise<LP<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching LP object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isLP(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a LP object`)
    }
    return LP.fromBcs(typeArgs, fromB64(res.data.bcs.bcsBytes))
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

export type PoolReified<
  A extends PhantomReified<PhantomTypeArgument>,
  B extends PhantomReified<PhantomTypeArgument>,
> = Reified<
  Pool<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>>,
  PoolFields<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>>
>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Pool<A extends PhantomTypeArgument, B extends PhantomTypeArgument> {
  static readonly $typeName =
    '0xf917eb03d02b9221b10276064b2c10296276cb43feb24aac35113a272dd691c7::pool::Pool'
  static readonly $numTypeParams = 2

  readonly $typeName = Pool.$typeName

  readonly $fullTypeName: `0xf917eb03d02b9221b10276064b2c10296276cb43feb24aac35113a272dd691c7::pool::Pool<${string}, ${string}>`

  readonly $typeArgs: [string, string]

  readonly id: ToField<UID>
  readonly balanceA: ToField<Balance<A>>
  readonly balanceB: ToField<Balance<B>>
  readonly lpSupply: ToField<Supply<ToPhantom<LP<A, B>>>>
  readonly lpFeeBps: ToField<'u64'>
  readonly adminFeePct: ToField<'u64'>
  readonly adminFeeBalance: ToField<Balance<ToPhantom<LP<A, B>>>>

  private constructor(typeArgs: [string, string], fields: PoolFields<A, B>) {
    this.$fullTypeName = composeSuiType(
      Pool.$typeName,
      ...typeArgs
    ) as `0xf917eb03d02b9221b10276064b2c10296276cb43feb24aac35113a272dd691c7::pool::Pool<${PhantomToTypeStr<A>}, ${PhantomToTypeStr<B>}>`

    this.$typeArgs = typeArgs

    this.id = fields.id
    this.balanceA = fields.balanceA
    this.balanceB = fields.balanceB
    this.lpSupply = fields.lpSupply
    this.lpFeeBps = fields.lpFeeBps
    this.adminFeePct = fields.adminFeePct
    this.adminFeeBalance = fields.adminFeeBalance
  }

  static reified<
    A extends PhantomReified<PhantomTypeArgument>,
    B extends PhantomReified<PhantomTypeArgument>,
  >(A: A, B: B): PoolReified<A, B> {
    return {
      typeName: Pool.$typeName,
      fullTypeName: composeSuiType(
        Pool.$typeName,
        ...[extractType(A), extractType(B)]
      ) as `0xf917eb03d02b9221b10276064b2c10296276cb43feb24aac35113a272dd691c7::pool::Pool<${PhantomToTypeStr<
        ToPhantomTypeArgument<A>
      >}, ${PhantomToTypeStr<ToPhantomTypeArgument<B>>}>`,
      typeArgs: [A, B],
      fromFields: (fields: Record<string, any>) => Pool.fromFields([A, B], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Pool.fromFieldsWithTypes([A, B], item),
      fromBcs: (data: Uint8Array) => Pool.fromBcs([A, B], data),
      bcs: Pool.bcs,
      fromJSONField: (field: any) => Pool.fromJSONField([A, B], field),
      fromJSON: (json: Record<string, any>) => Pool.fromJSON([A, B], json),
      fetch: async (client: SuiClient, id: string) => Pool.fetch(client, [A, B], id),
      new: (fields: PoolFields<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>>) => {
        return new Pool([extractType(A), extractType(B)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Pool.reified
  }

  static phantom<
    A extends PhantomReified<PhantomTypeArgument>,
    B extends PhantomReified<PhantomTypeArgument>,
  >(
    A: A,
    B: B
  ): PhantomReified<ToTypeStr<Pool<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>>>> {
    return phantom(Pool.reified(A, B))
  }
  static get p() {
    return Pool.phantom
  }

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

  static fromFields<
    A extends PhantomReified<PhantomTypeArgument>,
    B extends PhantomReified<PhantomTypeArgument>,
  >(
    typeArgs: [A, B],
    fields: Record<string, any>
  ): Pool<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>> {
    return Pool.reified(typeArgs[0], typeArgs[1]).new({
      id: decodeFromFields(UID.reified(), fields.id),
      balanceA: decodeFromFields(Balance.reified(typeArgs[0]), fields.balance_a),
      balanceB: decodeFromFields(Balance.reified(typeArgs[1]), fields.balance_b),
      lpSupply: decodeFromFields(
        Supply.reified(reified.phantom(LP.reified(typeArgs[0], typeArgs[1]))),
        fields.lp_supply
      ),
      lpFeeBps: decodeFromFields('u64', fields.lp_fee_bps),
      adminFeePct: decodeFromFields('u64', fields.admin_fee_pct),
      adminFeeBalance: decodeFromFields(
        Balance.reified(reified.phantom(LP.reified(typeArgs[0], typeArgs[1]))),
        fields.admin_fee_balance
      ),
    })
  }

  static fromFieldsWithTypes<
    A extends PhantomReified<PhantomTypeArgument>,
    B extends PhantomReified<PhantomTypeArgument>,
  >(
    typeArgs: [A, B],
    item: FieldsWithTypes
  ): Pool<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>> {
    if (!isPool(item.type)) {
      throw new Error('not a Pool type')
    }
    assertFieldsWithTypesArgsMatch(item, typeArgs)

    return Pool.reified(typeArgs[0], typeArgs[1]).new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      balanceA: decodeFromFieldsWithTypes(Balance.reified(typeArgs[0]), item.fields.balance_a),
      balanceB: decodeFromFieldsWithTypes(Balance.reified(typeArgs[1]), item.fields.balance_b),
      lpSupply: decodeFromFieldsWithTypes(
        Supply.reified(reified.phantom(LP.reified(typeArgs[0], typeArgs[1]))),
        item.fields.lp_supply
      ),
      lpFeeBps: decodeFromFieldsWithTypes('u64', item.fields.lp_fee_bps),
      adminFeePct: decodeFromFieldsWithTypes('u64', item.fields.admin_fee_pct),
      adminFeeBalance: decodeFromFieldsWithTypes(
        Balance.reified(reified.phantom(LP.reified(typeArgs[0], typeArgs[1]))),
        item.fields.admin_fee_balance
      ),
    })
  }

  static fromBcs<
    A extends PhantomReified<PhantomTypeArgument>,
    B extends PhantomReified<PhantomTypeArgument>,
  >(typeArgs: [A, B], data: Uint8Array): Pool<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>> {
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

  static fromJSONField<
    A extends PhantomReified<PhantomTypeArgument>,
    B extends PhantomReified<PhantomTypeArgument>,
  >(typeArgs: [A, B], field: any): Pool<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>> {
    return Pool.reified(typeArgs[0], typeArgs[1]).new({
      id: decodeFromJSONField(UID.reified(), field.id),
      balanceA: decodeFromJSONField(Balance.reified(typeArgs[0]), field.balanceA),
      balanceB: decodeFromJSONField(Balance.reified(typeArgs[1]), field.balanceB),
      lpSupply: decodeFromJSONField(
        Supply.reified(reified.phantom(LP.reified(typeArgs[0], typeArgs[1]))),
        field.lpSupply
      ),
      lpFeeBps: decodeFromJSONField('u64', field.lpFeeBps),
      adminFeePct: decodeFromJSONField('u64', field.adminFeePct),
      adminFeeBalance: decodeFromJSONField(
        Balance.reified(reified.phantom(LP.reified(typeArgs[0], typeArgs[1]))),
        field.adminFeeBalance
      ),
    })
  }

  static fromJSON<
    A extends PhantomReified<PhantomTypeArgument>,
    B extends PhantomReified<PhantomTypeArgument>,
  >(
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
    A extends PhantomReified<PhantomTypeArgument>,
    B extends PhantomReified<PhantomTypeArgument>,
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

  static async fetch<
    A extends PhantomReified<PhantomTypeArgument>,
    B extends PhantomReified<PhantomTypeArgument>,
  >(
    client: SuiClient,
    typeArgs: [A, B],
    id: string
  ): Promise<Pool<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching Pool object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isPool(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a Pool object`)
    }
    return Pool.fromBcs(typeArgs, fromB64(res.data.bcs.bcsBytes))
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

export type PoolCreationEventReified = Reified<PoolCreationEvent, PoolCreationEventFields>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class PoolCreationEvent {
  static readonly $typeName =
    '0xf917eb03d02b9221b10276064b2c10296276cb43feb24aac35113a272dd691c7::pool::PoolCreationEvent'
  static readonly $numTypeParams = 0

  readonly $typeName = PoolCreationEvent.$typeName

  readonly $fullTypeName: '0xf917eb03d02b9221b10276064b2c10296276cb43feb24aac35113a272dd691c7::pool::PoolCreationEvent'

  readonly poolId: ToField<ID>

  private constructor(fields: PoolCreationEventFields) {
    this.$fullTypeName = PoolCreationEvent.$typeName

    this.poolId = fields.poolId
  }

  static reified(): PoolCreationEventReified {
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
      fromJSON: (json: Record<string, any>) => PoolCreationEvent.fromJSON(json),
      fetch: async (client: SuiClient, id: string) => PoolCreationEvent.fetch(client, id),
      new: (fields: PoolCreationEventFields) => {
        return new PoolCreationEvent(fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return PoolCreationEvent.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<PoolCreationEvent>> {
    return phantom(PoolCreationEvent.reified())
  }
  static get p() {
    return PoolCreationEvent.phantom()
  }

  static get bcs() {
    return bcs.struct('PoolCreationEvent', {
      pool_id: ID.bcs,
    })
  }

  static fromFields(fields: Record<string, any>): PoolCreationEvent {
    return PoolCreationEvent.reified().new({
      poolId: decodeFromFields(ID.reified(), fields.pool_id),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): PoolCreationEvent {
    if (!isPoolCreationEvent(item.type)) {
      throw new Error('not a PoolCreationEvent type')
    }

    return PoolCreationEvent.reified().new({
      poolId: decodeFromFieldsWithTypes(ID.reified(), item.fields.pool_id),
    })
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
    return PoolCreationEvent.reified().new({
      poolId: decodeFromJSONField(ID.reified(), field.poolId),
    })
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
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching PoolCreationEvent object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isPoolCreationEvent(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a PoolCreationEvent object`)
    }
    return PoolCreationEvent.fromBcs(fromB64(res.data.bcs.bcsBytes))
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

export type PoolRegistryReified = Reified<PoolRegistry, PoolRegistryFields>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class PoolRegistry {
  static readonly $typeName =
    '0xf917eb03d02b9221b10276064b2c10296276cb43feb24aac35113a272dd691c7::pool::PoolRegistry'
  static readonly $numTypeParams = 0

  readonly $typeName = PoolRegistry.$typeName

  readonly $fullTypeName: '0xf917eb03d02b9221b10276064b2c10296276cb43feb24aac35113a272dd691c7::pool::PoolRegistry'

  readonly id: ToField<UID>
  readonly table: ToField<Table<ToPhantom<PoolRegistryItem>, 'bool'>>

  private constructor(fields: PoolRegistryFields) {
    this.$fullTypeName = PoolRegistry.$typeName

    this.id = fields.id
    this.table = fields.table
  }

  static reified(): PoolRegistryReified {
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
      fromJSON: (json: Record<string, any>) => PoolRegistry.fromJSON(json),
      fetch: async (client: SuiClient, id: string) => PoolRegistry.fetch(client, id),
      new: (fields: PoolRegistryFields) => {
        return new PoolRegistry(fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return PoolRegistry.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<PoolRegistry>> {
    return phantom(PoolRegistry.reified())
  }
  static get p() {
    return PoolRegistry.phantom()
  }

  static get bcs() {
    return bcs.struct('PoolRegistry', {
      id: UID.bcs,
      table: Table.bcs,
    })
  }

  static fromFields(fields: Record<string, any>): PoolRegistry {
    return PoolRegistry.reified().new({
      id: decodeFromFields(UID.reified(), fields.id),
      table: decodeFromFields(
        Table.reified(reified.phantom(PoolRegistryItem.reified()), reified.phantom('bool')),
        fields.table
      ),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): PoolRegistry {
    if (!isPoolRegistry(item.type)) {
      throw new Error('not a PoolRegistry type')
    }

    return PoolRegistry.reified().new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      table: decodeFromFieldsWithTypes(
        Table.reified(reified.phantom(PoolRegistryItem.reified()), reified.phantom('bool')),
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
    return PoolRegistry.reified().new({
      id: decodeFromJSONField(UID.reified(), field.id),
      table: decodeFromJSONField(
        Table.reified(reified.phantom(PoolRegistryItem.reified()), reified.phantom('bool')),
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
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching PoolRegistry object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isPoolRegistry(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a PoolRegistry object`)
    }
    return PoolRegistry.fromBcs(fromB64(res.data.bcs.bcsBytes))
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

export type PoolRegistryItemReified = Reified<PoolRegistryItem, PoolRegistryItemFields>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class PoolRegistryItem {
  static readonly $typeName =
    '0xf917eb03d02b9221b10276064b2c10296276cb43feb24aac35113a272dd691c7::pool::PoolRegistryItem'
  static readonly $numTypeParams = 0

  readonly $typeName = PoolRegistryItem.$typeName

  readonly $fullTypeName: '0xf917eb03d02b9221b10276064b2c10296276cb43feb24aac35113a272dd691c7::pool::PoolRegistryItem'

  readonly a: ToField<TypeName>
  readonly b: ToField<TypeName>

  private constructor(fields: PoolRegistryItemFields) {
    this.$fullTypeName = PoolRegistryItem.$typeName

    this.a = fields.a
    this.b = fields.b
  }

  static reified(): PoolRegistryItemReified {
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
      fromJSON: (json: Record<string, any>) => PoolRegistryItem.fromJSON(json),
      fetch: async (client: SuiClient, id: string) => PoolRegistryItem.fetch(client, id),
      new: (fields: PoolRegistryItemFields) => {
        return new PoolRegistryItem(fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return PoolRegistryItem.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<PoolRegistryItem>> {
    return phantom(PoolRegistryItem.reified())
  }
  static get p() {
    return PoolRegistryItem.phantom()
  }

  static get bcs() {
    return bcs.struct('PoolRegistryItem', {
      a: TypeName.bcs,
      b: TypeName.bcs,
    })
  }

  static fromFields(fields: Record<string, any>): PoolRegistryItem {
    return PoolRegistryItem.reified().new({
      a: decodeFromFields(TypeName.reified(), fields.a),
      b: decodeFromFields(TypeName.reified(), fields.b),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): PoolRegistryItem {
    if (!isPoolRegistryItem(item.type)) {
      throw new Error('not a PoolRegistryItem type')
    }

    return PoolRegistryItem.reified().new({
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
    return PoolRegistryItem.reified().new({
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
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching PoolRegistryItem object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isPoolRegistryItem(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a PoolRegistryItem object`)
    }
    return PoolRegistryItem.fromBcs(fromB64(res.data.bcs.bcsBytes))
  }
}
