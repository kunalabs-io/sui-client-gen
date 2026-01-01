import * as reified from '../../../../_framework/reified'
import {
  PhantomReified,
  Reified,
  StructClass,
  ToField,
  ToTypeStr,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  fieldToJSON,
  phantom,
  ToTypeStr as ToPhantom,
} from '../../../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../../../_framework/util'
import { Option } from '../../../../move-stdlib/option/structs'
import { Bag } from '../../../../sui/bag/structs'
import { Balance } from '../../../../sui/balance/structs'
import { ID, UID } from '../../../../sui/object/structs'
import { SUI } from '../../../../sui/sui/structs'
import { Table } from '../../../../sui/table/structs'
import { bcs } from '@mysten/sui/bcs'
import { SuiClient, SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromB64 } from '@mysten/sui/utils'

/* ============================== StakingPool =============================== */

export function isStakingPool(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x3::staking_pool::StakingPool`
}

export interface StakingPoolFields {
  id: ToField<UID>
  activationEpoch: ToField<Option<'u64'>>
  deactivationEpoch: ToField<Option<'u64'>>
  suiBalance: ToField<'u64'>
  rewardsPool: ToField<Balance<ToPhantom<SUI>>>
  poolTokenBalance: ToField<'u64'>
  exchangeRates: ToField<Table<'u64', ToPhantom<PoolTokenExchangeRate>>>
  pendingStake: ToField<'u64'>
  pendingTotalSuiWithdraw: ToField<'u64'>
  pendingPoolTokenWithdraw: ToField<'u64'>
  extraFields: ToField<Bag>
}

export type StakingPoolReified = Reified<StakingPool, StakingPoolFields>

export class StakingPool implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x3::staking_pool::StakingPool`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = StakingPool.$typeName
  readonly $fullTypeName: `0x3::staking_pool::StakingPool`
  readonly $typeArgs: []
  readonly $isPhantom = StakingPool.$isPhantom

  readonly id: ToField<UID>
  readonly activationEpoch: ToField<Option<'u64'>>
  readonly deactivationEpoch: ToField<Option<'u64'>>
  readonly suiBalance: ToField<'u64'>
  readonly rewardsPool: ToField<Balance<ToPhantom<SUI>>>
  readonly poolTokenBalance: ToField<'u64'>
  readonly exchangeRates: ToField<Table<'u64', ToPhantom<PoolTokenExchangeRate>>>
  readonly pendingStake: ToField<'u64'>
  readonly pendingTotalSuiWithdraw: ToField<'u64'>
  readonly pendingPoolTokenWithdraw: ToField<'u64'>
  readonly extraFields: ToField<Bag>

  private constructor(typeArgs: [], fields: StakingPoolFields) {
    this.$fullTypeName = composeSuiType(
      StakingPool.$typeName,
      ...typeArgs
    ) as `0x3::staking_pool::StakingPool`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.activationEpoch = fields.activationEpoch
    this.deactivationEpoch = fields.deactivationEpoch
    this.suiBalance = fields.suiBalance
    this.rewardsPool = fields.rewardsPool
    this.poolTokenBalance = fields.poolTokenBalance
    this.exchangeRates = fields.exchangeRates
    this.pendingStake = fields.pendingStake
    this.pendingTotalSuiWithdraw = fields.pendingTotalSuiWithdraw
    this.pendingPoolTokenWithdraw = fields.pendingPoolTokenWithdraw
    this.extraFields = fields.extraFields
  }

  static reified(): StakingPoolReified {
    const reifiedBcs = StakingPool.bcs
    return {
      typeName: StakingPool.$typeName,
      fullTypeName: composeSuiType(
        StakingPool.$typeName,
        ...[]
      ) as `0x3::staking_pool::StakingPool`,
      typeArgs: [] as [],
      isPhantom: StakingPool.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => StakingPool.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => StakingPool.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => StakingPool.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => StakingPool.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => StakingPool.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => StakingPool.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => StakingPool.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => StakingPool.fetch(client, id),
      new: (fields: StakingPoolFields) => {
        return new StakingPool([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return StakingPool.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<StakingPool>> {
    return phantom(StakingPool.reified())
  }

  static get p() {
    return StakingPool.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('StakingPool', {
      id: UID.bcs,
      activation_epoch: Option.bcs(bcs.u64()),
      deactivation_epoch: Option.bcs(bcs.u64()),
      sui_balance: bcs.u64(),
      rewards_pool: Balance.bcs,
      pool_token_balance: bcs.u64(),
      exchange_rates: Table.bcs,
      pending_stake: bcs.u64(),
      pending_total_sui_withdraw: bcs.u64(),
      pending_pool_token_withdraw: bcs.u64(),
      extra_fields: Bag.bcs,
    })
  }

  private static cachedBcs: ReturnType<typeof StakingPool.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof StakingPool.instantiateBcs> {
    if (!StakingPool.cachedBcs) {
      StakingPool.cachedBcs = StakingPool.instantiateBcs()
    }
    return StakingPool.cachedBcs
  }

  static fromFields(fields: Record<string, any>): StakingPool {
    return StakingPool.reified().new({
      id: decodeFromFields(UID.reified(), fields.id),
      activationEpoch: decodeFromFields(Option.reified('u64'), fields.activation_epoch),
      deactivationEpoch: decodeFromFields(Option.reified('u64'), fields.deactivation_epoch),
      suiBalance: decodeFromFields('u64', fields.sui_balance),
      rewardsPool: decodeFromFields(
        Balance.reified(reified.phantom(SUI.reified())),
        fields.rewards_pool
      ),
      poolTokenBalance: decodeFromFields('u64', fields.pool_token_balance),
      exchangeRates: decodeFromFields(
        Table.reified(reified.phantom('u64'), reified.phantom(PoolTokenExchangeRate.reified())),
        fields.exchange_rates
      ),
      pendingStake: decodeFromFields('u64', fields.pending_stake),
      pendingTotalSuiWithdraw: decodeFromFields('u64', fields.pending_total_sui_withdraw),
      pendingPoolTokenWithdraw: decodeFromFields('u64', fields.pending_pool_token_withdraw),
      extraFields: decodeFromFields(Bag.reified(), fields.extra_fields),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): StakingPool {
    if (!isStakingPool(item.type)) {
      throw new Error('not a StakingPool type')
    }

    return StakingPool.reified().new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      activationEpoch: decodeFromFieldsWithTypes(
        Option.reified('u64'),
        item.fields.activation_epoch
      ),
      deactivationEpoch: decodeFromFieldsWithTypes(
        Option.reified('u64'),
        item.fields.deactivation_epoch
      ),
      suiBalance: decodeFromFieldsWithTypes('u64', item.fields.sui_balance),
      rewardsPool: decodeFromFieldsWithTypes(
        Balance.reified(reified.phantom(SUI.reified())),
        item.fields.rewards_pool
      ),
      poolTokenBalance: decodeFromFieldsWithTypes('u64', item.fields.pool_token_balance),
      exchangeRates: decodeFromFieldsWithTypes(
        Table.reified(reified.phantom('u64'), reified.phantom(PoolTokenExchangeRate.reified())),
        item.fields.exchange_rates
      ),
      pendingStake: decodeFromFieldsWithTypes('u64', item.fields.pending_stake),
      pendingTotalSuiWithdraw: decodeFromFieldsWithTypes(
        'u64',
        item.fields.pending_total_sui_withdraw
      ),
      pendingPoolTokenWithdraw: decodeFromFieldsWithTypes(
        'u64',
        item.fields.pending_pool_token_withdraw
      ),
      extraFields: decodeFromFieldsWithTypes(Bag.reified(), item.fields.extra_fields),
    })
  }

  static fromBcs(data: Uint8Array): StakingPool {
    return StakingPool.fromFields(StakingPool.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
      activationEpoch: fieldToJSON<Option<'u64'>>(`${Option.$typeName}<u64>`, this.activationEpoch),
      deactivationEpoch: fieldToJSON<Option<'u64'>>(
        `${Option.$typeName}<u64>`,
        this.deactivationEpoch
      ),
      suiBalance: this.suiBalance.toString(),
      rewardsPool: this.rewardsPool.toJSONField(),
      poolTokenBalance: this.poolTokenBalance.toString(),
      exchangeRates: this.exchangeRates.toJSONField(),
      pendingStake: this.pendingStake.toString(),
      pendingTotalSuiWithdraw: this.pendingTotalSuiWithdraw.toString(),
      pendingPoolTokenWithdraw: this.pendingPoolTokenWithdraw.toString(),
      extraFields: this.extraFields.toJSONField(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): StakingPool {
    return StakingPool.reified().new({
      id: decodeFromJSONField(UID.reified(), field.id),
      activationEpoch: decodeFromJSONField(Option.reified('u64'), field.activationEpoch),
      deactivationEpoch: decodeFromJSONField(Option.reified('u64'), field.deactivationEpoch),
      suiBalance: decodeFromJSONField('u64', field.suiBalance),
      rewardsPool: decodeFromJSONField(
        Balance.reified(reified.phantom(SUI.reified())),
        field.rewardsPool
      ),
      poolTokenBalance: decodeFromJSONField('u64', field.poolTokenBalance),
      exchangeRates: decodeFromJSONField(
        Table.reified(reified.phantom('u64'), reified.phantom(PoolTokenExchangeRate.reified())),
        field.exchangeRates
      ),
      pendingStake: decodeFromJSONField('u64', field.pendingStake),
      pendingTotalSuiWithdraw: decodeFromJSONField('u64', field.pendingTotalSuiWithdraw),
      pendingPoolTokenWithdraw: decodeFromJSONField('u64', field.pendingPoolTokenWithdraw),
      extraFields: decodeFromJSONField(Bag.reified(), field.extraFields),
    })
  }

  static fromJSON(json: Record<string, any>): StakingPool {
    if (json.$typeName !== StakingPool.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return StakingPool.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): StakingPool {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isStakingPool(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a StakingPool object`)
    }
    return StakingPool.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): StakingPool {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isStakingPool(data.bcs.type)) {
        throw new Error(`object at is not a StakingPool object`)
      }

      return StakingPool.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return StakingPool.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<StakingPool> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching StakingPool object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isStakingPool(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a StakingPool object`)
    }

    return StakingPool.fromSuiObjectData(res.data)
  }
}

/* ============================== PoolTokenExchangeRate =============================== */

export function isPoolTokenExchangeRate(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x3::staking_pool::PoolTokenExchangeRate`
}

export interface PoolTokenExchangeRateFields {
  suiAmount: ToField<'u64'>
  poolTokenAmount: ToField<'u64'>
}

export type PoolTokenExchangeRateReified = Reified<
  PoolTokenExchangeRate,
  PoolTokenExchangeRateFields
>

export class PoolTokenExchangeRate implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x3::staking_pool::PoolTokenExchangeRate`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = PoolTokenExchangeRate.$typeName
  readonly $fullTypeName: `0x3::staking_pool::PoolTokenExchangeRate`
  readonly $typeArgs: []
  readonly $isPhantom = PoolTokenExchangeRate.$isPhantom

  readonly suiAmount: ToField<'u64'>
  readonly poolTokenAmount: ToField<'u64'>

  private constructor(typeArgs: [], fields: PoolTokenExchangeRateFields) {
    this.$fullTypeName = composeSuiType(
      PoolTokenExchangeRate.$typeName,
      ...typeArgs
    ) as `0x3::staking_pool::PoolTokenExchangeRate`
    this.$typeArgs = typeArgs

    this.suiAmount = fields.suiAmount
    this.poolTokenAmount = fields.poolTokenAmount
  }

  static reified(): PoolTokenExchangeRateReified {
    const reifiedBcs = PoolTokenExchangeRate.bcs
    return {
      typeName: PoolTokenExchangeRate.$typeName,
      fullTypeName: composeSuiType(
        PoolTokenExchangeRate.$typeName,
        ...[]
      ) as `0x3::staking_pool::PoolTokenExchangeRate`,
      typeArgs: [] as [],
      isPhantom: PoolTokenExchangeRate.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => PoolTokenExchangeRate.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        PoolTokenExchangeRate.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => PoolTokenExchangeRate.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => PoolTokenExchangeRate.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => PoolTokenExchangeRate.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) =>
        PoolTokenExchangeRate.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) =>
        PoolTokenExchangeRate.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => PoolTokenExchangeRate.fetch(client, id),
      new: (fields: PoolTokenExchangeRateFields) => {
        return new PoolTokenExchangeRate([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return PoolTokenExchangeRate.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<PoolTokenExchangeRate>> {
    return phantom(PoolTokenExchangeRate.reified())
  }

  static get p() {
    return PoolTokenExchangeRate.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('PoolTokenExchangeRate', {
      sui_amount: bcs.u64(),
      pool_token_amount: bcs.u64(),
    })
  }

  private static cachedBcs: ReturnType<typeof PoolTokenExchangeRate.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof PoolTokenExchangeRate.instantiateBcs> {
    if (!PoolTokenExchangeRate.cachedBcs) {
      PoolTokenExchangeRate.cachedBcs = PoolTokenExchangeRate.instantiateBcs()
    }
    return PoolTokenExchangeRate.cachedBcs
  }

  static fromFields(fields: Record<string, any>): PoolTokenExchangeRate {
    return PoolTokenExchangeRate.reified().new({
      suiAmount: decodeFromFields('u64', fields.sui_amount),
      poolTokenAmount: decodeFromFields('u64', fields.pool_token_amount),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): PoolTokenExchangeRate {
    if (!isPoolTokenExchangeRate(item.type)) {
      throw new Error('not a PoolTokenExchangeRate type')
    }

    return PoolTokenExchangeRate.reified().new({
      suiAmount: decodeFromFieldsWithTypes('u64', item.fields.sui_amount),
      poolTokenAmount: decodeFromFieldsWithTypes('u64', item.fields.pool_token_amount),
    })
  }

  static fromBcs(data: Uint8Array): PoolTokenExchangeRate {
    return PoolTokenExchangeRate.fromFields(PoolTokenExchangeRate.bcs.parse(data))
  }

  toJSONField() {
    return {
      suiAmount: this.suiAmount.toString(),
      poolTokenAmount: this.poolTokenAmount.toString(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): PoolTokenExchangeRate {
    return PoolTokenExchangeRate.reified().new({
      suiAmount: decodeFromJSONField('u64', field.suiAmount),
      poolTokenAmount: decodeFromJSONField('u64', field.poolTokenAmount),
    })
  }

  static fromJSON(json: Record<string, any>): PoolTokenExchangeRate {
    if (json.$typeName !== PoolTokenExchangeRate.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return PoolTokenExchangeRate.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): PoolTokenExchangeRate {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isPoolTokenExchangeRate(content.type)) {
      throw new Error(
        `object at ${(content.fields as any).id} is not a PoolTokenExchangeRate object`
      )
    }
    return PoolTokenExchangeRate.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): PoolTokenExchangeRate {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isPoolTokenExchangeRate(data.bcs.type)) {
        throw new Error(`object at is not a PoolTokenExchangeRate object`)
      }

      return PoolTokenExchangeRate.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return PoolTokenExchangeRate.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<PoolTokenExchangeRate> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching PoolTokenExchangeRate object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isPoolTokenExchangeRate(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a PoolTokenExchangeRate object`)
    }

    return PoolTokenExchangeRate.fromSuiObjectData(res.data)
  }
}

/* ============================== StakedSui =============================== */

export function isStakedSui(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x3::staking_pool::StakedSui`
}

export interface StakedSuiFields {
  id: ToField<UID>
  poolId: ToField<ID>
  stakeActivationEpoch: ToField<'u64'>
  principal: ToField<Balance<ToPhantom<SUI>>>
}

export type StakedSuiReified = Reified<StakedSui, StakedSuiFields>

export class StakedSui implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x3::staking_pool::StakedSui`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = StakedSui.$typeName
  readonly $fullTypeName: `0x3::staking_pool::StakedSui`
  readonly $typeArgs: []
  readonly $isPhantom = StakedSui.$isPhantom

  readonly id: ToField<UID>
  readonly poolId: ToField<ID>
  readonly stakeActivationEpoch: ToField<'u64'>
  readonly principal: ToField<Balance<ToPhantom<SUI>>>

  private constructor(typeArgs: [], fields: StakedSuiFields) {
    this.$fullTypeName = composeSuiType(
      StakedSui.$typeName,
      ...typeArgs
    ) as `0x3::staking_pool::StakedSui`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.poolId = fields.poolId
    this.stakeActivationEpoch = fields.stakeActivationEpoch
    this.principal = fields.principal
  }

  static reified(): StakedSuiReified {
    const reifiedBcs = StakedSui.bcs
    return {
      typeName: StakedSui.$typeName,
      fullTypeName: composeSuiType(StakedSui.$typeName, ...[]) as `0x3::staking_pool::StakedSui`,
      typeArgs: [] as [],
      isPhantom: StakedSui.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => StakedSui.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => StakedSui.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => StakedSui.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => StakedSui.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => StakedSui.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => StakedSui.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => StakedSui.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => StakedSui.fetch(client, id),
      new: (fields: StakedSuiFields) => {
        return new StakedSui([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return StakedSui.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<StakedSui>> {
    return phantom(StakedSui.reified())
  }

  static get p() {
    return StakedSui.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('StakedSui', {
      id: UID.bcs,
      pool_id: ID.bcs,
      stake_activation_epoch: bcs.u64(),
      principal: Balance.bcs,
    })
  }

  private static cachedBcs: ReturnType<typeof StakedSui.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof StakedSui.instantiateBcs> {
    if (!StakedSui.cachedBcs) {
      StakedSui.cachedBcs = StakedSui.instantiateBcs()
    }
    return StakedSui.cachedBcs
  }

  static fromFields(fields: Record<string, any>): StakedSui {
    return StakedSui.reified().new({
      id: decodeFromFields(UID.reified(), fields.id),
      poolId: decodeFromFields(ID.reified(), fields.pool_id),
      stakeActivationEpoch: decodeFromFields('u64', fields.stake_activation_epoch),
      principal: decodeFromFields(
        Balance.reified(reified.phantom(SUI.reified())),
        fields.principal
      ),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): StakedSui {
    if (!isStakedSui(item.type)) {
      throw new Error('not a StakedSui type')
    }

    return StakedSui.reified().new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      poolId: decodeFromFieldsWithTypes(ID.reified(), item.fields.pool_id),
      stakeActivationEpoch: decodeFromFieldsWithTypes('u64', item.fields.stake_activation_epoch),
      principal: decodeFromFieldsWithTypes(
        Balance.reified(reified.phantom(SUI.reified())),
        item.fields.principal
      ),
    })
  }

  static fromBcs(data: Uint8Array): StakedSui {
    return StakedSui.fromFields(StakedSui.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
      poolId: this.poolId,
      stakeActivationEpoch: this.stakeActivationEpoch.toString(),
      principal: this.principal.toJSONField(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): StakedSui {
    return StakedSui.reified().new({
      id: decodeFromJSONField(UID.reified(), field.id),
      poolId: decodeFromJSONField(ID.reified(), field.poolId),
      stakeActivationEpoch: decodeFromJSONField('u64', field.stakeActivationEpoch),
      principal: decodeFromJSONField(
        Balance.reified(reified.phantom(SUI.reified())),
        field.principal
      ),
    })
  }

  static fromJSON(json: Record<string, any>): StakedSui {
    if (json.$typeName !== StakedSui.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return StakedSui.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): StakedSui {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isStakedSui(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a StakedSui object`)
    }
    return StakedSui.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): StakedSui {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isStakedSui(data.bcs.type)) {
        throw new Error(`object at is not a StakedSui object`)
      }

      return StakedSui.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return StakedSui.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<StakedSui> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching StakedSui object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isStakedSui(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a StakedSui object`)
    }

    return StakedSui.fromSuiObjectData(res.data)
  }
}

/* ============================== FungibleStakedSui =============================== */

export function isFungibleStakedSui(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x3::staking_pool::FungibleStakedSui`
}

export interface FungibleStakedSuiFields {
  id: ToField<UID>
  poolId: ToField<ID>
  value: ToField<'u64'>
}

export type FungibleStakedSuiReified = Reified<FungibleStakedSui, FungibleStakedSuiFields>

export class FungibleStakedSui implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x3::staking_pool::FungibleStakedSui`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = FungibleStakedSui.$typeName
  readonly $fullTypeName: `0x3::staking_pool::FungibleStakedSui`
  readonly $typeArgs: []
  readonly $isPhantom = FungibleStakedSui.$isPhantom

  readonly id: ToField<UID>
  readonly poolId: ToField<ID>
  readonly value: ToField<'u64'>

  private constructor(typeArgs: [], fields: FungibleStakedSuiFields) {
    this.$fullTypeName = composeSuiType(
      FungibleStakedSui.$typeName,
      ...typeArgs
    ) as `0x3::staking_pool::FungibleStakedSui`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.poolId = fields.poolId
    this.value = fields.value
  }

  static reified(): FungibleStakedSuiReified {
    const reifiedBcs = FungibleStakedSui.bcs
    return {
      typeName: FungibleStakedSui.$typeName,
      fullTypeName: composeSuiType(
        FungibleStakedSui.$typeName,
        ...[]
      ) as `0x3::staking_pool::FungibleStakedSui`,
      typeArgs: [] as [],
      isPhantom: FungibleStakedSui.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => FungibleStakedSui.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => FungibleStakedSui.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => FungibleStakedSui.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => FungibleStakedSui.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => FungibleStakedSui.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => FungibleStakedSui.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => FungibleStakedSui.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => FungibleStakedSui.fetch(client, id),
      new: (fields: FungibleStakedSuiFields) => {
        return new FungibleStakedSui([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return FungibleStakedSui.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<FungibleStakedSui>> {
    return phantom(FungibleStakedSui.reified())
  }

  static get p() {
    return FungibleStakedSui.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('FungibleStakedSui', {
      id: UID.bcs,
      pool_id: ID.bcs,
      value: bcs.u64(),
    })
  }

  private static cachedBcs: ReturnType<typeof FungibleStakedSui.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof FungibleStakedSui.instantiateBcs> {
    if (!FungibleStakedSui.cachedBcs) {
      FungibleStakedSui.cachedBcs = FungibleStakedSui.instantiateBcs()
    }
    return FungibleStakedSui.cachedBcs
  }

  static fromFields(fields: Record<string, any>): FungibleStakedSui {
    return FungibleStakedSui.reified().new({
      id: decodeFromFields(UID.reified(), fields.id),
      poolId: decodeFromFields(ID.reified(), fields.pool_id),
      value: decodeFromFields('u64', fields.value),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): FungibleStakedSui {
    if (!isFungibleStakedSui(item.type)) {
      throw new Error('not a FungibleStakedSui type')
    }

    return FungibleStakedSui.reified().new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      poolId: decodeFromFieldsWithTypes(ID.reified(), item.fields.pool_id),
      value: decodeFromFieldsWithTypes('u64', item.fields.value),
    })
  }

  static fromBcs(data: Uint8Array): FungibleStakedSui {
    return FungibleStakedSui.fromFields(FungibleStakedSui.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
      poolId: this.poolId,
      value: this.value.toString(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): FungibleStakedSui {
    return FungibleStakedSui.reified().new({
      id: decodeFromJSONField(UID.reified(), field.id),
      poolId: decodeFromJSONField(ID.reified(), field.poolId),
      value: decodeFromJSONField('u64', field.value),
    })
  }

  static fromJSON(json: Record<string, any>): FungibleStakedSui {
    if (json.$typeName !== FungibleStakedSui.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return FungibleStakedSui.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): FungibleStakedSui {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isFungibleStakedSui(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a FungibleStakedSui object`)
    }
    return FungibleStakedSui.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): FungibleStakedSui {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isFungibleStakedSui(data.bcs.type)) {
        throw new Error(`object at is not a FungibleStakedSui object`)
      }

      return FungibleStakedSui.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return FungibleStakedSui.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<FungibleStakedSui> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching FungibleStakedSui object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isFungibleStakedSui(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a FungibleStakedSui object`)
    }

    return FungibleStakedSui.fromSuiObjectData(res.data)
  }
}

/* ============================== FungibleStakedSuiData =============================== */

export function isFungibleStakedSuiData(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x3::staking_pool::FungibleStakedSuiData`
}

export interface FungibleStakedSuiDataFields {
  id: ToField<UID>
  totalSupply: ToField<'u64'>
  principal: ToField<Balance<ToPhantom<SUI>>>
}

export type FungibleStakedSuiDataReified = Reified<
  FungibleStakedSuiData,
  FungibleStakedSuiDataFields
>

export class FungibleStakedSuiData implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x3::staking_pool::FungibleStakedSuiData`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = FungibleStakedSuiData.$typeName
  readonly $fullTypeName: `0x3::staking_pool::FungibleStakedSuiData`
  readonly $typeArgs: []
  readonly $isPhantom = FungibleStakedSuiData.$isPhantom

  readonly id: ToField<UID>
  readonly totalSupply: ToField<'u64'>
  readonly principal: ToField<Balance<ToPhantom<SUI>>>

  private constructor(typeArgs: [], fields: FungibleStakedSuiDataFields) {
    this.$fullTypeName = composeSuiType(
      FungibleStakedSuiData.$typeName,
      ...typeArgs
    ) as `0x3::staking_pool::FungibleStakedSuiData`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.totalSupply = fields.totalSupply
    this.principal = fields.principal
  }

  static reified(): FungibleStakedSuiDataReified {
    const reifiedBcs = FungibleStakedSuiData.bcs
    return {
      typeName: FungibleStakedSuiData.$typeName,
      fullTypeName: composeSuiType(
        FungibleStakedSuiData.$typeName,
        ...[]
      ) as `0x3::staking_pool::FungibleStakedSuiData`,
      typeArgs: [] as [],
      isPhantom: FungibleStakedSuiData.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => FungibleStakedSuiData.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        FungibleStakedSuiData.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => FungibleStakedSuiData.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => FungibleStakedSuiData.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => FungibleStakedSuiData.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) =>
        FungibleStakedSuiData.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) =>
        FungibleStakedSuiData.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => FungibleStakedSuiData.fetch(client, id),
      new: (fields: FungibleStakedSuiDataFields) => {
        return new FungibleStakedSuiData([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return FungibleStakedSuiData.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<FungibleStakedSuiData>> {
    return phantom(FungibleStakedSuiData.reified())
  }

  static get p() {
    return FungibleStakedSuiData.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('FungibleStakedSuiData', {
      id: UID.bcs,
      total_supply: bcs.u64(),
      principal: Balance.bcs,
    })
  }

  private static cachedBcs: ReturnType<typeof FungibleStakedSuiData.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof FungibleStakedSuiData.instantiateBcs> {
    if (!FungibleStakedSuiData.cachedBcs) {
      FungibleStakedSuiData.cachedBcs = FungibleStakedSuiData.instantiateBcs()
    }
    return FungibleStakedSuiData.cachedBcs
  }

  static fromFields(fields: Record<string, any>): FungibleStakedSuiData {
    return FungibleStakedSuiData.reified().new({
      id: decodeFromFields(UID.reified(), fields.id),
      totalSupply: decodeFromFields('u64', fields.total_supply),
      principal: decodeFromFields(
        Balance.reified(reified.phantom(SUI.reified())),
        fields.principal
      ),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): FungibleStakedSuiData {
    if (!isFungibleStakedSuiData(item.type)) {
      throw new Error('not a FungibleStakedSuiData type')
    }

    return FungibleStakedSuiData.reified().new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      totalSupply: decodeFromFieldsWithTypes('u64', item.fields.total_supply),
      principal: decodeFromFieldsWithTypes(
        Balance.reified(reified.phantom(SUI.reified())),
        item.fields.principal
      ),
    })
  }

  static fromBcs(data: Uint8Array): FungibleStakedSuiData {
    return FungibleStakedSuiData.fromFields(FungibleStakedSuiData.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
      totalSupply: this.totalSupply.toString(),
      principal: this.principal.toJSONField(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): FungibleStakedSuiData {
    return FungibleStakedSuiData.reified().new({
      id: decodeFromJSONField(UID.reified(), field.id),
      totalSupply: decodeFromJSONField('u64', field.totalSupply),
      principal: decodeFromJSONField(
        Balance.reified(reified.phantom(SUI.reified())),
        field.principal
      ),
    })
  }

  static fromJSON(json: Record<string, any>): FungibleStakedSuiData {
    if (json.$typeName !== FungibleStakedSuiData.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return FungibleStakedSuiData.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): FungibleStakedSuiData {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isFungibleStakedSuiData(content.type)) {
      throw new Error(
        `object at ${(content.fields as any).id} is not a FungibleStakedSuiData object`
      )
    }
    return FungibleStakedSuiData.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): FungibleStakedSuiData {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isFungibleStakedSuiData(data.bcs.type)) {
        throw new Error(`object at is not a FungibleStakedSuiData object`)
      }

      return FungibleStakedSuiData.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return FungibleStakedSuiData.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<FungibleStakedSuiData> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching FungibleStakedSuiData object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isFungibleStakedSuiData(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a FungibleStakedSuiData object`)
    }

    return FungibleStakedSuiData.fromSuiObjectData(res.data)
  }
}

/* ============================== FungibleStakedSuiDataKey =============================== */

export function isFungibleStakedSuiDataKey(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x3::staking_pool::FungibleStakedSuiDataKey`
}

export interface FungibleStakedSuiDataKeyFields {
  dummyField: ToField<'bool'>
}

export type FungibleStakedSuiDataKeyReified = Reified<
  FungibleStakedSuiDataKey,
  FungibleStakedSuiDataKeyFields
>

export class FungibleStakedSuiDataKey implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x3::staking_pool::FungibleStakedSuiDataKey`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = FungibleStakedSuiDataKey.$typeName
  readonly $fullTypeName: `0x3::staking_pool::FungibleStakedSuiDataKey`
  readonly $typeArgs: []
  readonly $isPhantom = FungibleStakedSuiDataKey.$isPhantom

  readonly dummyField: ToField<'bool'>

  private constructor(typeArgs: [], fields: FungibleStakedSuiDataKeyFields) {
    this.$fullTypeName = composeSuiType(
      FungibleStakedSuiDataKey.$typeName,
      ...typeArgs
    ) as `0x3::staking_pool::FungibleStakedSuiDataKey`
    this.$typeArgs = typeArgs

    this.dummyField = fields.dummyField
  }

  static reified(): FungibleStakedSuiDataKeyReified {
    const reifiedBcs = FungibleStakedSuiDataKey.bcs
    return {
      typeName: FungibleStakedSuiDataKey.$typeName,
      fullTypeName: composeSuiType(
        FungibleStakedSuiDataKey.$typeName,
        ...[]
      ) as `0x3::staking_pool::FungibleStakedSuiDataKey`,
      typeArgs: [] as [],
      isPhantom: FungibleStakedSuiDataKey.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => FungibleStakedSuiDataKey.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        FungibleStakedSuiDataKey.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => FungibleStakedSuiDataKey.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => FungibleStakedSuiDataKey.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => FungibleStakedSuiDataKey.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) =>
        FungibleStakedSuiDataKey.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) =>
        FungibleStakedSuiDataKey.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => FungibleStakedSuiDataKey.fetch(client, id),
      new: (fields: FungibleStakedSuiDataKeyFields) => {
        return new FungibleStakedSuiDataKey([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return FungibleStakedSuiDataKey.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<FungibleStakedSuiDataKey>> {
    return phantom(FungibleStakedSuiDataKey.reified())
  }

  static get p() {
    return FungibleStakedSuiDataKey.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('FungibleStakedSuiDataKey', {
      dummy_field: bcs.bool(),
    })
  }

  private static cachedBcs: ReturnType<typeof FungibleStakedSuiDataKey.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof FungibleStakedSuiDataKey.instantiateBcs> {
    if (!FungibleStakedSuiDataKey.cachedBcs) {
      FungibleStakedSuiDataKey.cachedBcs = FungibleStakedSuiDataKey.instantiateBcs()
    }
    return FungibleStakedSuiDataKey.cachedBcs
  }

  static fromFields(fields: Record<string, any>): FungibleStakedSuiDataKey {
    return FungibleStakedSuiDataKey.reified().new({
      dummyField: decodeFromFields('bool', fields.dummy_field),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): FungibleStakedSuiDataKey {
    if (!isFungibleStakedSuiDataKey(item.type)) {
      throw new Error('not a FungibleStakedSuiDataKey type')
    }

    return FungibleStakedSuiDataKey.reified().new({
      dummyField: decodeFromFieldsWithTypes('bool', item.fields.dummy_field),
    })
  }

  static fromBcs(data: Uint8Array): FungibleStakedSuiDataKey {
    return FungibleStakedSuiDataKey.fromFields(FungibleStakedSuiDataKey.bcs.parse(data))
  }

  toJSONField() {
    return {
      dummyField: this.dummyField,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): FungibleStakedSuiDataKey {
    return FungibleStakedSuiDataKey.reified().new({
      dummyField: decodeFromJSONField('bool', field.dummyField),
    })
  }

  static fromJSON(json: Record<string, any>): FungibleStakedSuiDataKey {
    if (json.$typeName !== FungibleStakedSuiDataKey.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return FungibleStakedSuiDataKey.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): FungibleStakedSuiDataKey {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isFungibleStakedSuiDataKey(content.type)) {
      throw new Error(
        `object at ${(content.fields as any).id} is not a FungibleStakedSuiDataKey object`
      )
    }
    return FungibleStakedSuiDataKey.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): FungibleStakedSuiDataKey {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isFungibleStakedSuiDataKey(data.bcs.type)) {
        throw new Error(`object at is not a FungibleStakedSuiDataKey object`)
      }

      return FungibleStakedSuiDataKey.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return FungibleStakedSuiDataKey.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<FungibleStakedSuiDataKey> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(
        `error fetching FungibleStakedSuiDataKey object at id ${id}: ${res.error.code}`
      )
    }
    if (
      res.data?.bcs?.dataType !== 'moveObject' ||
      !isFungibleStakedSuiDataKey(res.data.bcs.type)
    ) {
      throw new Error(`object at id ${id} is not a FungibleStakedSuiDataKey object`)
    }

    return FungibleStakedSuiDataKey.fromSuiObjectData(res.data)
  }
}

/* ============================== UnderflowSuiBalance =============================== */

export function isUnderflowSuiBalance(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x3::staking_pool::UnderflowSuiBalance`
}

export interface UnderflowSuiBalanceFields {
  dummyField: ToField<'bool'>
}

export type UnderflowSuiBalanceReified = Reified<UnderflowSuiBalance, UnderflowSuiBalanceFields>

export class UnderflowSuiBalance implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x3::staking_pool::UnderflowSuiBalance`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = UnderflowSuiBalance.$typeName
  readonly $fullTypeName: `0x3::staking_pool::UnderflowSuiBalance`
  readonly $typeArgs: []
  readonly $isPhantom = UnderflowSuiBalance.$isPhantom

  readonly dummyField: ToField<'bool'>

  private constructor(typeArgs: [], fields: UnderflowSuiBalanceFields) {
    this.$fullTypeName = composeSuiType(
      UnderflowSuiBalance.$typeName,
      ...typeArgs
    ) as `0x3::staking_pool::UnderflowSuiBalance`
    this.$typeArgs = typeArgs

    this.dummyField = fields.dummyField
  }

  static reified(): UnderflowSuiBalanceReified {
    const reifiedBcs = UnderflowSuiBalance.bcs
    return {
      typeName: UnderflowSuiBalance.$typeName,
      fullTypeName: composeSuiType(
        UnderflowSuiBalance.$typeName,
        ...[]
      ) as `0x3::staking_pool::UnderflowSuiBalance`,
      typeArgs: [] as [],
      isPhantom: UnderflowSuiBalance.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => UnderflowSuiBalance.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => UnderflowSuiBalance.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => UnderflowSuiBalance.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => UnderflowSuiBalance.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => UnderflowSuiBalance.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => UnderflowSuiBalance.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => UnderflowSuiBalance.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => UnderflowSuiBalance.fetch(client, id),
      new: (fields: UnderflowSuiBalanceFields) => {
        return new UnderflowSuiBalance([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return UnderflowSuiBalance.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<UnderflowSuiBalance>> {
    return phantom(UnderflowSuiBalance.reified())
  }

  static get p() {
    return UnderflowSuiBalance.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('UnderflowSuiBalance', {
      dummy_field: bcs.bool(),
    })
  }

  private static cachedBcs: ReturnType<typeof UnderflowSuiBalance.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof UnderflowSuiBalance.instantiateBcs> {
    if (!UnderflowSuiBalance.cachedBcs) {
      UnderflowSuiBalance.cachedBcs = UnderflowSuiBalance.instantiateBcs()
    }
    return UnderflowSuiBalance.cachedBcs
  }

  static fromFields(fields: Record<string, any>): UnderflowSuiBalance {
    return UnderflowSuiBalance.reified().new({
      dummyField: decodeFromFields('bool', fields.dummy_field),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): UnderflowSuiBalance {
    if (!isUnderflowSuiBalance(item.type)) {
      throw new Error('not a UnderflowSuiBalance type')
    }

    return UnderflowSuiBalance.reified().new({
      dummyField: decodeFromFieldsWithTypes('bool', item.fields.dummy_field),
    })
  }

  static fromBcs(data: Uint8Array): UnderflowSuiBalance {
    return UnderflowSuiBalance.fromFields(UnderflowSuiBalance.bcs.parse(data))
  }

  toJSONField() {
    return {
      dummyField: this.dummyField,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): UnderflowSuiBalance {
    return UnderflowSuiBalance.reified().new({
      dummyField: decodeFromJSONField('bool', field.dummyField),
    })
  }

  static fromJSON(json: Record<string, any>): UnderflowSuiBalance {
    if (json.$typeName !== UnderflowSuiBalance.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return UnderflowSuiBalance.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): UnderflowSuiBalance {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isUnderflowSuiBalance(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a UnderflowSuiBalance object`)
    }
    return UnderflowSuiBalance.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): UnderflowSuiBalance {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isUnderflowSuiBalance(data.bcs.type)) {
        throw new Error(`object at is not a UnderflowSuiBalance object`)
      }

      return UnderflowSuiBalance.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return UnderflowSuiBalance.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<UnderflowSuiBalance> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching UnderflowSuiBalance object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isUnderflowSuiBalance(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a UnderflowSuiBalance object`)
    }

    return UnderflowSuiBalance.fromSuiObjectData(res.data)
  }
}
