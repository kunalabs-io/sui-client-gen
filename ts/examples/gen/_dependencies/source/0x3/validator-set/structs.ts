import {
  PhantomReified,
  Reified,
  StructClass,
  ToField,
  ToTypeStr,
  ToTypeStr as ToPhantom,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  fieldToJSON,
  phantom,
  vector,
} from '../../../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../../../_framework/util'
import { Vector } from '../../../../_framework/vector'
import { Bag } from '../../../../sui/bag/structs'
import { ID } from '../../../../sui/object/structs'
import { TableVec } from '../../../../sui/table-vec/structs'
import { Table } from '../../../../sui/table/structs'
import { VecMap } from '../../../../sui/vec-map/structs'
import { PoolTokenExchangeRate } from '../staking-pool/structs'
import { ValidatorWrapper } from '../validator-wrapper/structs'
import { Validator } from '../validator/structs'
import { bcs } from '@mysten/sui/bcs'
import { SuiClient, SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromB64, fromHEX, toHEX } from '@mysten/sui/utils'

/* ============================== ValidatorSet =============================== */

export function isValidatorSet(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x3::validator_set::ValidatorSet`
}

export interface ValidatorSetFields {
  totalStake: ToField<'u64'>
  activeValidators: ToField<Vector<Validator>>
  pendingActiveValidators: ToField<TableVec<ToPhantom<Validator>>>
  pendingRemovals: ToField<Vector<'u64'>>
  stakingPoolMappings: ToField<Table<ToPhantom<ID>, 'address'>>
  inactiveValidators: ToField<Table<ToPhantom<ID>, ToPhantom<ValidatorWrapper>>>
  validatorCandidates: ToField<Table<'address', ToPhantom<ValidatorWrapper>>>
  atRiskValidators: ToField<VecMap<'address', 'u64'>>
  extraFields: ToField<Bag>
}

export type ValidatorSetReified = Reified<ValidatorSet, ValidatorSetFields>

export class ValidatorSet implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x3::validator_set::ValidatorSet`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = ValidatorSet.$typeName
  readonly $fullTypeName: `0x3::validator_set::ValidatorSet`
  readonly $typeArgs: []
  readonly $isPhantom = ValidatorSet.$isPhantom

  readonly totalStake: ToField<'u64'>
  readonly activeValidators: ToField<Vector<Validator>>
  readonly pendingActiveValidators: ToField<TableVec<ToPhantom<Validator>>>
  readonly pendingRemovals: ToField<Vector<'u64'>>
  readonly stakingPoolMappings: ToField<Table<ToPhantom<ID>, 'address'>>
  readonly inactiveValidators: ToField<Table<ToPhantom<ID>, ToPhantom<ValidatorWrapper>>>
  readonly validatorCandidates: ToField<Table<'address', ToPhantom<ValidatorWrapper>>>
  readonly atRiskValidators: ToField<VecMap<'address', 'u64'>>
  readonly extraFields: ToField<Bag>

  private constructor(typeArgs: [], fields: ValidatorSetFields) {
    this.$fullTypeName = composeSuiType(
      ValidatorSet.$typeName,
      ...typeArgs
    ) as `0x3::validator_set::ValidatorSet`
    this.$typeArgs = typeArgs

    this.totalStake = fields.totalStake
    this.activeValidators = fields.activeValidators
    this.pendingActiveValidators = fields.pendingActiveValidators
    this.pendingRemovals = fields.pendingRemovals
    this.stakingPoolMappings = fields.stakingPoolMappings
    this.inactiveValidators = fields.inactiveValidators
    this.validatorCandidates = fields.validatorCandidates
    this.atRiskValidators = fields.atRiskValidators
    this.extraFields = fields.extraFields
  }

  static reified(): ValidatorSetReified {
    const reifiedBcs = ValidatorSet.bcs
    return {
      typeName: ValidatorSet.$typeName,
      fullTypeName: composeSuiType(
        ValidatorSet.$typeName,
        ...[]
      ) as `0x3::validator_set::ValidatorSet`,
      typeArgs: [] as [],
      isPhantom: ValidatorSet.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => ValidatorSet.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => ValidatorSet.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => ValidatorSet.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => ValidatorSet.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => ValidatorSet.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => ValidatorSet.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => ValidatorSet.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => ValidatorSet.fetch(client, id),
      new: (fields: ValidatorSetFields) => {
        return new ValidatorSet([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return ValidatorSet.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<ValidatorSet>> {
    return phantom(ValidatorSet.reified())
  }

  static get p() {
    return ValidatorSet.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('ValidatorSet', {
      total_stake: bcs.u64(),
      active_validators: bcs.vector(Validator.bcs),
      pending_active_validators: TableVec.bcs,
      pending_removals: bcs.vector(bcs.u64()),
      staking_pool_mappings: Table.bcs,
      inactive_validators: Table.bcs,
      validator_candidates: Table.bcs,
      at_risk_validators: VecMap.bcs(
        bcs.bytes(32).transform({
          input: (val: string) => fromHEX(val),
          output: (val: Uint8Array) => toHEX(val),
        }),
        bcs.u64()
      ),
      extra_fields: Bag.bcs,
    })
  }

  private static cachedBcs: ReturnType<typeof ValidatorSet.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof ValidatorSet.instantiateBcs> {
    if (!ValidatorSet.cachedBcs) {
      ValidatorSet.cachedBcs = ValidatorSet.instantiateBcs()
    }
    return ValidatorSet.cachedBcs
  }

  static fromFields(fields: Record<string, any>): ValidatorSet {
    return ValidatorSet.reified().new({
      totalStake: decodeFromFields('u64', fields.total_stake),
      activeValidators: decodeFromFields(vector(Validator.reified()), fields.active_validators),
      pendingActiveValidators: decodeFromFields(
        TableVec.reified(phantom(Validator.reified())),
        fields.pending_active_validators
      ),
      pendingRemovals: decodeFromFields(vector('u64'), fields.pending_removals),
      stakingPoolMappings: decodeFromFields(
        Table.reified(phantom(ID.reified()), phantom('address')),
        fields.staking_pool_mappings
      ),
      inactiveValidators: decodeFromFields(
        Table.reified(phantom(ID.reified()), phantom(ValidatorWrapper.reified())),
        fields.inactive_validators
      ),
      validatorCandidates: decodeFromFields(
        Table.reified(phantom('address'), phantom(ValidatorWrapper.reified())),
        fields.validator_candidates
      ),
      atRiskValidators: decodeFromFields(
        VecMap.reified('address', 'u64'),
        fields.at_risk_validators
      ),
      extraFields: decodeFromFields(Bag.reified(), fields.extra_fields),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): ValidatorSet {
    if (!isValidatorSet(item.type)) {
      throw new Error('not a ValidatorSet type')
    }

    return ValidatorSet.reified().new({
      totalStake: decodeFromFieldsWithTypes('u64', item.fields.total_stake),
      activeValidators: decodeFromFieldsWithTypes(
        vector(Validator.reified()),
        item.fields.active_validators
      ),
      pendingActiveValidators: decodeFromFieldsWithTypes(
        TableVec.reified(phantom(Validator.reified())),
        item.fields.pending_active_validators
      ),
      pendingRemovals: decodeFromFieldsWithTypes(vector('u64'), item.fields.pending_removals),
      stakingPoolMappings: decodeFromFieldsWithTypes(
        Table.reified(phantom(ID.reified()), phantom('address')),
        item.fields.staking_pool_mappings
      ),
      inactiveValidators: decodeFromFieldsWithTypes(
        Table.reified(phantom(ID.reified()), phantom(ValidatorWrapper.reified())),
        item.fields.inactive_validators
      ),
      validatorCandidates: decodeFromFieldsWithTypes(
        Table.reified(phantom('address'), phantom(ValidatorWrapper.reified())),
        item.fields.validator_candidates
      ),
      atRiskValidators: decodeFromFieldsWithTypes(
        VecMap.reified('address', 'u64'),
        item.fields.at_risk_validators
      ),
      extraFields: decodeFromFieldsWithTypes(Bag.reified(), item.fields.extra_fields),
    })
  }

  static fromBcs(data: Uint8Array): ValidatorSet {
    return ValidatorSet.fromFields(ValidatorSet.bcs.parse(data))
  }

  toJSONField() {
    return {
      totalStake: this.totalStake.toString(),
      activeValidators: fieldToJSON<Vector<Validator>>(
        `vector<${Validator.$typeName}>`,
        this.activeValidators
      ),
      pendingActiveValidators: this.pendingActiveValidators.toJSONField(),
      pendingRemovals: fieldToJSON<Vector<'u64'>>(`vector<u64>`, this.pendingRemovals),
      stakingPoolMappings: this.stakingPoolMappings.toJSONField(),
      inactiveValidators: this.inactiveValidators.toJSONField(),
      validatorCandidates: this.validatorCandidates.toJSONField(),
      atRiskValidators: this.atRiskValidators.toJSONField(),
      extraFields: this.extraFields.toJSONField(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): ValidatorSet {
    return ValidatorSet.reified().new({
      totalStake: decodeFromJSONField('u64', field.totalStake),
      activeValidators: decodeFromJSONField(vector(Validator.reified()), field.activeValidators),
      pendingActiveValidators: decodeFromJSONField(
        TableVec.reified(phantom(Validator.reified())),
        field.pendingActiveValidators
      ),
      pendingRemovals: decodeFromJSONField(vector('u64'), field.pendingRemovals),
      stakingPoolMappings: decodeFromJSONField(
        Table.reified(phantom(ID.reified()), phantom('address')),
        field.stakingPoolMappings
      ),
      inactiveValidators: decodeFromJSONField(
        Table.reified(phantom(ID.reified()), phantom(ValidatorWrapper.reified())),
        field.inactiveValidators
      ),
      validatorCandidates: decodeFromJSONField(
        Table.reified(phantom('address'), phantom(ValidatorWrapper.reified())),
        field.validatorCandidates
      ),
      atRiskValidators: decodeFromJSONField(
        VecMap.reified('address', 'u64'),
        field.atRiskValidators
      ),
      extraFields: decodeFromJSONField(Bag.reified(), field.extraFields),
    })
  }

  static fromJSON(json: Record<string, any>): ValidatorSet {
    if (json.$typeName !== ValidatorSet.$typeName) {
      throw new Error(
        `not a ValidatorSet json object: expected '${ValidatorSet.$typeName}' but got '${json.$typeName}'`
      )
    }

    return ValidatorSet.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): ValidatorSet {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isValidatorSet(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a ValidatorSet object`)
    }
    return ValidatorSet.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): ValidatorSet {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isValidatorSet(data.bcs.type)) {
        throw new Error(`object at is not a ValidatorSet object`)
      }

      return ValidatorSet.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return ValidatorSet.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<ValidatorSet> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching ValidatorSet object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isValidatorSet(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a ValidatorSet object`)
    }

    return ValidatorSet.fromSuiObjectData(res.data)
  }
}

/* ============================== ValidatorEpochInfoEvent =============================== */

export function isValidatorEpochInfoEvent(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x3::validator_set::ValidatorEpochInfoEvent`
}

export interface ValidatorEpochInfoEventFields {
  epoch: ToField<'u64'>
  validatorAddress: ToField<'address'>
  referenceGasSurveyQuote: ToField<'u64'>
  stake: ToField<'u64'>
  commissionRate: ToField<'u64'>
  poolStakingReward: ToField<'u64'>
  storageFundStakingReward: ToField<'u64'>
  poolTokenExchangeRate: ToField<PoolTokenExchangeRate>
  tallyingRuleReporters: ToField<Vector<'address'>>
  tallyingRuleGlobalScore: ToField<'u64'>
}

export type ValidatorEpochInfoEventReified = Reified<
  ValidatorEpochInfoEvent,
  ValidatorEpochInfoEventFields
>

export class ValidatorEpochInfoEvent implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x3::validator_set::ValidatorEpochInfoEvent`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = ValidatorEpochInfoEvent.$typeName
  readonly $fullTypeName: `0x3::validator_set::ValidatorEpochInfoEvent`
  readonly $typeArgs: []
  readonly $isPhantom = ValidatorEpochInfoEvent.$isPhantom

  readonly epoch: ToField<'u64'>
  readonly validatorAddress: ToField<'address'>
  readonly referenceGasSurveyQuote: ToField<'u64'>
  readonly stake: ToField<'u64'>
  readonly commissionRate: ToField<'u64'>
  readonly poolStakingReward: ToField<'u64'>
  readonly storageFundStakingReward: ToField<'u64'>
  readonly poolTokenExchangeRate: ToField<PoolTokenExchangeRate>
  readonly tallyingRuleReporters: ToField<Vector<'address'>>
  readonly tallyingRuleGlobalScore: ToField<'u64'>

  private constructor(typeArgs: [], fields: ValidatorEpochInfoEventFields) {
    this.$fullTypeName = composeSuiType(
      ValidatorEpochInfoEvent.$typeName,
      ...typeArgs
    ) as `0x3::validator_set::ValidatorEpochInfoEvent`
    this.$typeArgs = typeArgs

    this.epoch = fields.epoch
    this.validatorAddress = fields.validatorAddress
    this.referenceGasSurveyQuote = fields.referenceGasSurveyQuote
    this.stake = fields.stake
    this.commissionRate = fields.commissionRate
    this.poolStakingReward = fields.poolStakingReward
    this.storageFundStakingReward = fields.storageFundStakingReward
    this.poolTokenExchangeRate = fields.poolTokenExchangeRate
    this.tallyingRuleReporters = fields.tallyingRuleReporters
    this.tallyingRuleGlobalScore = fields.tallyingRuleGlobalScore
  }

  static reified(): ValidatorEpochInfoEventReified {
    const reifiedBcs = ValidatorEpochInfoEvent.bcs
    return {
      typeName: ValidatorEpochInfoEvent.$typeName,
      fullTypeName: composeSuiType(
        ValidatorEpochInfoEvent.$typeName,
        ...[]
      ) as `0x3::validator_set::ValidatorEpochInfoEvent`,
      typeArgs: [] as [],
      isPhantom: ValidatorEpochInfoEvent.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => ValidatorEpochInfoEvent.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        ValidatorEpochInfoEvent.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => ValidatorEpochInfoEvent.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => ValidatorEpochInfoEvent.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => ValidatorEpochInfoEvent.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) =>
        ValidatorEpochInfoEvent.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) =>
        ValidatorEpochInfoEvent.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => ValidatorEpochInfoEvent.fetch(client, id),
      new: (fields: ValidatorEpochInfoEventFields) => {
        return new ValidatorEpochInfoEvent([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return ValidatorEpochInfoEvent.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<ValidatorEpochInfoEvent>> {
    return phantom(ValidatorEpochInfoEvent.reified())
  }

  static get p() {
    return ValidatorEpochInfoEvent.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('ValidatorEpochInfoEvent', {
      epoch: bcs.u64(),
      validator_address: bcs.bytes(32).transform({
        input: (val: string) => fromHEX(val),
        output: (val: Uint8Array) => toHEX(val),
      }),
      reference_gas_survey_quote: bcs.u64(),
      stake: bcs.u64(),
      commission_rate: bcs.u64(),
      pool_staking_reward: bcs.u64(),
      storage_fund_staking_reward: bcs.u64(),
      pool_token_exchange_rate: PoolTokenExchangeRate.bcs,
      tallying_rule_reporters: bcs.vector(
        bcs.bytes(32).transform({
          input: (val: string) => fromHEX(val),
          output: (val: Uint8Array) => toHEX(val),
        })
      ),
      tallying_rule_global_score: bcs.u64(),
    })
  }

  private static cachedBcs: ReturnType<typeof ValidatorEpochInfoEvent.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof ValidatorEpochInfoEvent.instantiateBcs> {
    if (!ValidatorEpochInfoEvent.cachedBcs) {
      ValidatorEpochInfoEvent.cachedBcs = ValidatorEpochInfoEvent.instantiateBcs()
    }
    return ValidatorEpochInfoEvent.cachedBcs
  }

  static fromFields(fields: Record<string, any>): ValidatorEpochInfoEvent {
    return ValidatorEpochInfoEvent.reified().new({
      epoch: decodeFromFields('u64', fields.epoch),
      validatorAddress: decodeFromFields('address', fields.validator_address),
      referenceGasSurveyQuote: decodeFromFields('u64', fields.reference_gas_survey_quote),
      stake: decodeFromFields('u64', fields.stake),
      commissionRate: decodeFromFields('u64', fields.commission_rate),
      poolStakingReward: decodeFromFields('u64', fields.pool_staking_reward),
      storageFundStakingReward: decodeFromFields('u64', fields.storage_fund_staking_reward),
      poolTokenExchangeRate: decodeFromFields(
        PoolTokenExchangeRate.reified(),
        fields.pool_token_exchange_rate
      ),
      tallyingRuleReporters: decodeFromFields(vector('address'), fields.tallying_rule_reporters),
      tallyingRuleGlobalScore: decodeFromFields('u64', fields.tallying_rule_global_score),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): ValidatorEpochInfoEvent {
    if (!isValidatorEpochInfoEvent(item.type)) {
      throw new Error('not a ValidatorEpochInfoEvent type')
    }

    return ValidatorEpochInfoEvent.reified().new({
      epoch: decodeFromFieldsWithTypes('u64', item.fields.epoch),
      validatorAddress: decodeFromFieldsWithTypes('address', item.fields.validator_address),
      referenceGasSurveyQuote: decodeFromFieldsWithTypes(
        'u64',
        item.fields.reference_gas_survey_quote
      ),
      stake: decodeFromFieldsWithTypes('u64', item.fields.stake),
      commissionRate: decodeFromFieldsWithTypes('u64', item.fields.commission_rate),
      poolStakingReward: decodeFromFieldsWithTypes('u64', item.fields.pool_staking_reward),
      storageFundStakingReward: decodeFromFieldsWithTypes(
        'u64',
        item.fields.storage_fund_staking_reward
      ),
      poolTokenExchangeRate: decodeFromFieldsWithTypes(
        PoolTokenExchangeRate.reified(),
        item.fields.pool_token_exchange_rate
      ),
      tallyingRuleReporters: decodeFromFieldsWithTypes(
        vector('address'),
        item.fields.tallying_rule_reporters
      ),
      tallyingRuleGlobalScore: decodeFromFieldsWithTypes(
        'u64',
        item.fields.tallying_rule_global_score
      ),
    })
  }

  static fromBcs(data: Uint8Array): ValidatorEpochInfoEvent {
    return ValidatorEpochInfoEvent.fromFields(ValidatorEpochInfoEvent.bcs.parse(data))
  }

  toJSONField() {
    return {
      epoch: this.epoch.toString(),
      validatorAddress: this.validatorAddress,
      referenceGasSurveyQuote: this.referenceGasSurveyQuote.toString(),
      stake: this.stake.toString(),
      commissionRate: this.commissionRate.toString(),
      poolStakingReward: this.poolStakingReward.toString(),
      storageFundStakingReward: this.storageFundStakingReward.toString(),
      poolTokenExchangeRate: this.poolTokenExchangeRate.toJSONField(),
      tallyingRuleReporters: fieldToJSON<Vector<'address'>>(
        `vector<address>`,
        this.tallyingRuleReporters
      ),
      tallyingRuleGlobalScore: this.tallyingRuleGlobalScore.toString(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): ValidatorEpochInfoEvent {
    return ValidatorEpochInfoEvent.reified().new({
      epoch: decodeFromJSONField('u64', field.epoch),
      validatorAddress: decodeFromJSONField('address', field.validatorAddress),
      referenceGasSurveyQuote: decodeFromJSONField('u64', field.referenceGasSurveyQuote),
      stake: decodeFromJSONField('u64', field.stake),
      commissionRate: decodeFromJSONField('u64', field.commissionRate),
      poolStakingReward: decodeFromJSONField('u64', field.poolStakingReward),
      storageFundStakingReward: decodeFromJSONField('u64', field.storageFundStakingReward),
      poolTokenExchangeRate: decodeFromJSONField(
        PoolTokenExchangeRate.reified(),
        field.poolTokenExchangeRate
      ),
      tallyingRuleReporters: decodeFromJSONField(vector('address'), field.tallyingRuleReporters),
      tallyingRuleGlobalScore: decodeFromJSONField('u64', field.tallyingRuleGlobalScore),
    })
  }

  static fromJSON(json: Record<string, any>): ValidatorEpochInfoEvent {
    if (json.$typeName !== ValidatorEpochInfoEvent.$typeName) {
      throw new Error(
        `not a ValidatorEpochInfoEvent json object: expected '${ValidatorEpochInfoEvent.$typeName}' but got '${json.$typeName}'`
      )
    }

    return ValidatorEpochInfoEvent.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): ValidatorEpochInfoEvent {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isValidatorEpochInfoEvent(content.type)) {
      throw new Error(
        `object at ${(content.fields as any).id} is not a ValidatorEpochInfoEvent object`
      )
    }
    return ValidatorEpochInfoEvent.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): ValidatorEpochInfoEvent {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isValidatorEpochInfoEvent(data.bcs.type)) {
        throw new Error(`object at is not a ValidatorEpochInfoEvent object`)
      }

      return ValidatorEpochInfoEvent.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return ValidatorEpochInfoEvent.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<ValidatorEpochInfoEvent> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(
        `error fetching ValidatorEpochInfoEvent object at id ${id}: ${res.error.code}`
      )
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isValidatorEpochInfoEvent(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a ValidatorEpochInfoEvent object`)
    }

    return ValidatorEpochInfoEvent.fromSuiObjectData(res.data)
  }
}

/* ============================== ValidatorEpochInfoEventV2 =============================== */

export function isValidatorEpochInfoEventV2(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x3::validator_set::ValidatorEpochInfoEventV2`
}

export interface ValidatorEpochInfoEventV2Fields {
  epoch: ToField<'u64'>
  validatorAddress: ToField<'address'>
  referenceGasSurveyQuote: ToField<'u64'>
  stake: ToField<'u64'>
  votingPower: ToField<'u64'>
  commissionRate: ToField<'u64'>
  poolStakingReward: ToField<'u64'>
  storageFundStakingReward: ToField<'u64'>
  poolTokenExchangeRate: ToField<PoolTokenExchangeRate>
  tallyingRuleReporters: ToField<Vector<'address'>>
  tallyingRuleGlobalScore: ToField<'u64'>
}

export type ValidatorEpochInfoEventV2Reified = Reified<
  ValidatorEpochInfoEventV2,
  ValidatorEpochInfoEventV2Fields
>

export class ValidatorEpochInfoEventV2 implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x3::validator_set::ValidatorEpochInfoEventV2`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = ValidatorEpochInfoEventV2.$typeName
  readonly $fullTypeName: `0x3::validator_set::ValidatorEpochInfoEventV2`
  readonly $typeArgs: []
  readonly $isPhantom = ValidatorEpochInfoEventV2.$isPhantom

  readonly epoch: ToField<'u64'>
  readonly validatorAddress: ToField<'address'>
  readonly referenceGasSurveyQuote: ToField<'u64'>
  readonly stake: ToField<'u64'>
  readonly votingPower: ToField<'u64'>
  readonly commissionRate: ToField<'u64'>
  readonly poolStakingReward: ToField<'u64'>
  readonly storageFundStakingReward: ToField<'u64'>
  readonly poolTokenExchangeRate: ToField<PoolTokenExchangeRate>
  readonly tallyingRuleReporters: ToField<Vector<'address'>>
  readonly tallyingRuleGlobalScore: ToField<'u64'>

  private constructor(typeArgs: [], fields: ValidatorEpochInfoEventV2Fields) {
    this.$fullTypeName = composeSuiType(
      ValidatorEpochInfoEventV2.$typeName,
      ...typeArgs
    ) as `0x3::validator_set::ValidatorEpochInfoEventV2`
    this.$typeArgs = typeArgs

    this.epoch = fields.epoch
    this.validatorAddress = fields.validatorAddress
    this.referenceGasSurveyQuote = fields.referenceGasSurveyQuote
    this.stake = fields.stake
    this.votingPower = fields.votingPower
    this.commissionRate = fields.commissionRate
    this.poolStakingReward = fields.poolStakingReward
    this.storageFundStakingReward = fields.storageFundStakingReward
    this.poolTokenExchangeRate = fields.poolTokenExchangeRate
    this.tallyingRuleReporters = fields.tallyingRuleReporters
    this.tallyingRuleGlobalScore = fields.tallyingRuleGlobalScore
  }

  static reified(): ValidatorEpochInfoEventV2Reified {
    const reifiedBcs = ValidatorEpochInfoEventV2.bcs
    return {
      typeName: ValidatorEpochInfoEventV2.$typeName,
      fullTypeName: composeSuiType(
        ValidatorEpochInfoEventV2.$typeName,
        ...[]
      ) as `0x3::validator_set::ValidatorEpochInfoEventV2`,
      typeArgs: [] as [],
      isPhantom: ValidatorEpochInfoEventV2.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => ValidatorEpochInfoEventV2.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        ValidatorEpochInfoEventV2.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => ValidatorEpochInfoEventV2.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => ValidatorEpochInfoEventV2.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => ValidatorEpochInfoEventV2.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) =>
        ValidatorEpochInfoEventV2.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) =>
        ValidatorEpochInfoEventV2.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => ValidatorEpochInfoEventV2.fetch(client, id),
      new: (fields: ValidatorEpochInfoEventV2Fields) => {
        return new ValidatorEpochInfoEventV2([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return ValidatorEpochInfoEventV2.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<ValidatorEpochInfoEventV2>> {
    return phantom(ValidatorEpochInfoEventV2.reified())
  }

  static get p() {
    return ValidatorEpochInfoEventV2.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('ValidatorEpochInfoEventV2', {
      epoch: bcs.u64(),
      validator_address: bcs.bytes(32).transform({
        input: (val: string) => fromHEX(val),
        output: (val: Uint8Array) => toHEX(val),
      }),
      reference_gas_survey_quote: bcs.u64(),
      stake: bcs.u64(),
      voting_power: bcs.u64(),
      commission_rate: bcs.u64(),
      pool_staking_reward: bcs.u64(),
      storage_fund_staking_reward: bcs.u64(),
      pool_token_exchange_rate: PoolTokenExchangeRate.bcs,
      tallying_rule_reporters: bcs.vector(
        bcs.bytes(32).transform({
          input: (val: string) => fromHEX(val),
          output: (val: Uint8Array) => toHEX(val),
        })
      ),
      tallying_rule_global_score: bcs.u64(),
    })
  }

  private static cachedBcs: ReturnType<typeof ValidatorEpochInfoEventV2.instantiateBcs> | null =
    null

  static get bcs(): ReturnType<typeof ValidatorEpochInfoEventV2.instantiateBcs> {
    if (!ValidatorEpochInfoEventV2.cachedBcs) {
      ValidatorEpochInfoEventV2.cachedBcs = ValidatorEpochInfoEventV2.instantiateBcs()
    }
    return ValidatorEpochInfoEventV2.cachedBcs
  }

  static fromFields(fields: Record<string, any>): ValidatorEpochInfoEventV2 {
    return ValidatorEpochInfoEventV2.reified().new({
      epoch: decodeFromFields('u64', fields.epoch),
      validatorAddress: decodeFromFields('address', fields.validator_address),
      referenceGasSurveyQuote: decodeFromFields('u64', fields.reference_gas_survey_quote),
      stake: decodeFromFields('u64', fields.stake),
      votingPower: decodeFromFields('u64', fields.voting_power),
      commissionRate: decodeFromFields('u64', fields.commission_rate),
      poolStakingReward: decodeFromFields('u64', fields.pool_staking_reward),
      storageFundStakingReward: decodeFromFields('u64', fields.storage_fund_staking_reward),
      poolTokenExchangeRate: decodeFromFields(
        PoolTokenExchangeRate.reified(),
        fields.pool_token_exchange_rate
      ),
      tallyingRuleReporters: decodeFromFields(vector('address'), fields.tallying_rule_reporters),
      tallyingRuleGlobalScore: decodeFromFields('u64', fields.tallying_rule_global_score),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): ValidatorEpochInfoEventV2 {
    if (!isValidatorEpochInfoEventV2(item.type)) {
      throw new Error('not a ValidatorEpochInfoEventV2 type')
    }

    return ValidatorEpochInfoEventV2.reified().new({
      epoch: decodeFromFieldsWithTypes('u64', item.fields.epoch),
      validatorAddress: decodeFromFieldsWithTypes('address', item.fields.validator_address),
      referenceGasSurveyQuote: decodeFromFieldsWithTypes(
        'u64',
        item.fields.reference_gas_survey_quote
      ),
      stake: decodeFromFieldsWithTypes('u64', item.fields.stake),
      votingPower: decodeFromFieldsWithTypes('u64', item.fields.voting_power),
      commissionRate: decodeFromFieldsWithTypes('u64', item.fields.commission_rate),
      poolStakingReward: decodeFromFieldsWithTypes('u64', item.fields.pool_staking_reward),
      storageFundStakingReward: decodeFromFieldsWithTypes(
        'u64',
        item.fields.storage_fund_staking_reward
      ),
      poolTokenExchangeRate: decodeFromFieldsWithTypes(
        PoolTokenExchangeRate.reified(),
        item.fields.pool_token_exchange_rate
      ),
      tallyingRuleReporters: decodeFromFieldsWithTypes(
        vector('address'),
        item.fields.tallying_rule_reporters
      ),
      tallyingRuleGlobalScore: decodeFromFieldsWithTypes(
        'u64',
        item.fields.tallying_rule_global_score
      ),
    })
  }

  static fromBcs(data: Uint8Array): ValidatorEpochInfoEventV2 {
    return ValidatorEpochInfoEventV2.fromFields(ValidatorEpochInfoEventV2.bcs.parse(data))
  }

  toJSONField() {
    return {
      epoch: this.epoch.toString(),
      validatorAddress: this.validatorAddress,
      referenceGasSurveyQuote: this.referenceGasSurveyQuote.toString(),
      stake: this.stake.toString(),
      votingPower: this.votingPower.toString(),
      commissionRate: this.commissionRate.toString(),
      poolStakingReward: this.poolStakingReward.toString(),
      storageFundStakingReward: this.storageFundStakingReward.toString(),
      poolTokenExchangeRate: this.poolTokenExchangeRate.toJSONField(),
      tallyingRuleReporters: fieldToJSON<Vector<'address'>>(
        `vector<address>`,
        this.tallyingRuleReporters
      ),
      tallyingRuleGlobalScore: this.tallyingRuleGlobalScore.toString(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): ValidatorEpochInfoEventV2 {
    return ValidatorEpochInfoEventV2.reified().new({
      epoch: decodeFromJSONField('u64', field.epoch),
      validatorAddress: decodeFromJSONField('address', field.validatorAddress),
      referenceGasSurveyQuote: decodeFromJSONField('u64', field.referenceGasSurveyQuote),
      stake: decodeFromJSONField('u64', field.stake),
      votingPower: decodeFromJSONField('u64', field.votingPower),
      commissionRate: decodeFromJSONField('u64', field.commissionRate),
      poolStakingReward: decodeFromJSONField('u64', field.poolStakingReward),
      storageFundStakingReward: decodeFromJSONField('u64', field.storageFundStakingReward),
      poolTokenExchangeRate: decodeFromJSONField(
        PoolTokenExchangeRate.reified(),
        field.poolTokenExchangeRate
      ),
      tallyingRuleReporters: decodeFromJSONField(vector('address'), field.tallyingRuleReporters),
      tallyingRuleGlobalScore: decodeFromJSONField('u64', field.tallyingRuleGlobalScore),
    })
  }

  static fromJSON(json: Record<string, any>): ValidatorEpochInfoEventV2 {
    if (json.$typeName !== ValidatorEpochInfoEventV2.$typeName) {
      throw new Error(
        `not a ValidatorEpochInfoEventV2 json object: expected '${ValidatorEpochInfoEventV2.$typeName}' but got '${json.$typeName}'`
      )
    }

    return ValidatorEpochInfoEventV2.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): ValidatorEpochInfoEventV2 {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isValidatorEpochInfoEventV2(content.type)) {
      throw new Error(
        `object at ${(content.fields as any).id} is not a ValidatorEpochInfoEventV2 object`
      )
    }
    return ValidatorEpochInfoEventV2.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): ValidatorEpochInfoEventV2 {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isValidatorEpochInfoEventV2(data.bcs.type)) {
        throw new Error(`object at is not a ValidatorEpochInfoEventV2 object`)
      }

      return ValidatorEpochInfoEventV2.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return ValidatorEpochInfoEventV2.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<ValidatorEpochInfoEventV2> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(
        `error fetching ValidatorEpochInfoEventV2 object at id ${id}: ${res.error.code}`
      )
    }
    if (
      res.data?.bcs?.dataType !== 'moveObject' ||
      !isValidatorEpochInfoEventV2(res.data.bcs.type)
    ) {
      throw new Error(`object at id ${id} is not a ValidatorEpochInfoEventV2 object`)
    }

    return ValidatorEpochInfoEventV2.fromSuiObjectData(res.data)
  }
}

/* ============================== ValidatorJoinEvent =============================== */

export function isValidatorJoinEvent(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x3::validator_set::ValidatorJoinEvent`
}

export interface ValidatorJoinEventFields {
  epoch: ToField<'u64'>
  validatorAddress: ToField<'address'>
  stakingPoolId: ToField<ID>
}

export type ValidatorJoinEventReified = Reified<ValidatorJoinEvent, ValidatorJoinEventFields>

export class ValidatorJoinEvent implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x3::validator_set::ValidatorJoinEvent`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = ValidatorJoinEvent.$typeName
  readonly $fullTypeName: `0x3::validator_set::ValidatorJoinEvent`
  readonly $typeArgs: []
  readonly $isPhantom = ValidatorJoinEvent.$isPhantom

  readonly epoch: ToField<'u64'>
  readonly validatorAddress: ToField<'address'>
  readonly stakingPoolId: ToField<ID>

  private constructor(typeArgs: [], fields: ValidatorJoinEventFields) {
    this.$fullTypeName = composeSuiType(
      ValidatorJoinEvent.$typeName,
      ...typeArgs
    ) as `0x3::validator_set::ValidatorJoinEvent`
    this.$typeArgs = typeArgs

    this.epoch = fields.epoch
    this.validatorAddress = fields.validatorAddress
    this.stakingPoolId = fields.stakingPoolId
  }

  static reified(): ValidatorJoinEventReified {
    const reifiedBcs = ValidatorJoinEvent.bcs
    return {
      typeName: ValidatorJoinEvent.$typeName,
      fullTypeName: composeSuiType(
        ValidatorJoinEvent.$typeName,
        ...[]
      ) as `0x3::validator_set::ValidatorJoinEvent`,
      typeArgs: [] as [],
      isPhantom: ValidatorJoinEvent.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => ValidatorJoinEvent.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => ValidatorJoinEvent.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => ValidatorJoinEvent.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => ValidatorJoinEvent.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => ValidatorJoinEvent.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => ValidatorJoinEvent.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => ValidatorJoinEvent.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => ValidatorJoinEvent.fetch(client, id),
      new: (fields: ValidatorJoinEventFields) => {
        return new ValidatorJoinEvent([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return ValidatorJoinEvent.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<ValidatorJoinEvent>> {
    return phantom(ValidatorJoinEvent.reified())
  }

  static get p() {
    return ValidatorJoinEvent.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('ValidatorJoinEvent', {
      epoch: bcs.u64(),
      validator_address: bcs.bytes(32).transform({
        input: (val: string) => fromHEX(val),
        output: (val: Uint8Array) => toHEX(val),
      }),
      staking_pool_id: ID.bcs,
    })
  }

  private static cachedBcs: ReturnType<typeof ValidatorJoinEvent.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof ValidatorJoinEvent.instantiateBcs> {
    if (!ValidatorJoinEvent.cachedBcs) {
      ValidatorJoinEvent.cachedBcs = ValidatorJoinEvent.instantiateBcs()
    }
    return ValidatorJoinEvent.cachedBcs
  }

  static fromFields(fields: Record<string, any>): ValidatorJoinEvent {
    return ValidatorJoinEvent.reified().new({
      epoch: decodeFromFields('u64', fields.epoch),
      validatorAddress: decodeFromFields('address', fields.validator_address),
      stakingPoolId: decodeFromFields(ID.reified(), fields.staking_pool_id),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): ValidatorJoinEvent {
    if (!isValidatorJoinEvent(item.type)) {
      throw new Error('not a ValidatorJoinEvent type')
    }

    return ValidatorJoinEvent.reified().new({
      epoch: decodeFromFieldsWithTypes('u64', item.fields.epoch),
      validatorAddress: decodeFromFieldsWithTypes('address', item.fields.validator_address),
      stakingPoolId: decodeFromFieldsWithTypes(ID.reified(), item.fields.staking_pool_id),
    })
  }

  static fromBcs(data: Uint8Array): ValidatorJoinEvent {
    return ValidatorJoinEvent.fromFields(ValidatorJoinEvent.bcs.parse(data))
  }

  toJSONField() {
    return {
      epoch: this.epoch.toString(),
      validatorAddress: this.validatorAddress,
      stakingPoolId: this.stakingPoolId,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): ValidatorJoinEvent {
    return ValidatorJoinEvent.reified().new({
      epoch: decodeFromJSONField('u64', field.epoch),
      validatorAddress: decodeFromJSONField('address', field.validatorAddress),
      stakingPoolId: decodeFromJSONField(ID.reified(), field.stakingPoolId),
    })
  }

  static fromJSON(json: Record<string, any>): ValidatorJoinEvent {
    if (json.$typeName !== ValidatorJoinEvent.$typeName) {
      throw new Error(
        `not a ValidatorJoinEvent json object: expected '${ValidatorJoinEvent.$typeName}' but got '${json.$typeName}'`
      )
    }

    return ValidatorJoinEvent.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): ValidatorJoinEvent {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isValidatorJoinEvent(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a ValidatorJoinEvent object`)
    }
    return ValidatorJoinEvent.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): ValidatorJoinEvent {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isValidatorJoinEvent(data.bcs.type)) {
        throw new Error(`object at is not a ValidatorJoinEvent object`)
      }

      return ValidatorJoinEvent.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return ValidatorJoinEvent.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<ValidatorJoinEvent> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching ValidatorJoinEvent object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isValidatorJoinEvent(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a ValidatorJoinEvent object`)
    }

    return ValidatorJoinEvent.fromSuiObjectData(res.data)
  }
}

/* ============================== ValidatorLeaveEvent =============================== */

export function isValidatorLeaveEvent(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x3::validator_set::ValidatorLeaveEvent`
}

export interface ValidatorLeaveEventFields {
  epoch: ToField<'u64'>
  validatorAddress: ToField<'address'>
  stakingPoolId: ToField<ID>
  isVoluntary: ToField<'bool'>
}

export type ValidatorLeaveEventReified = Reified<ValidatorLeaveEvent, ValidatorLeaveEventFields>

export class ValidatorLeaveEvent implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x3::validator_set::ValidatorLeaveEvent`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = ValidatorLeaveEvent.$typeName
  readonly $fullTypeName: `0x3::validator_set::ValidatorLeaveEvent`
  readonly $typeArgs: []
  readonly $isPhantom = ValidatorLeaveEvent.$isPhantom

  readonly epoch: ToField<'u64'>
  readonly validatorAddress: ToField<'address'>
  readonly stakingPoolId: ToField<ID>
  readonly isVoluntary: ToField<'bool'>

  private constructor(typeArgs: [], fields: ValidatorLeaveEventFields) {
    this.$fullTypeName = composeSuiType(
      ValidatorLeaveEvent.$typeName,
      ...typeArgs
    ) as `0x3::validator_set::ValidatorLeaveEvent`
    this.$typeArgs = typeArgs

    this.epoch = fields.epoch
    this.validatorAddress = fields.validatorAddress
    this.stakingPoolId = fields.stakingPoolId
    this.isVoluntary = fields.isVoluntary
  }

  static reified(): ValidatorLeaveEventReified {
    const reifiedBcs = ValidatorLeaveEvent.bcs
    return {
      typeName: ValidatorLeaveEvent.$typeName,
      fullTypeName: composeSuiType(
        ValidatorLeaveEvent.$typeName,
        ...[]
      ) as `0x3::validator_set::ValidatorLeaveEvent`,
      typeArgs: [] as [],
      isPhantom: ValidatorLeaveEvent.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => ValidatorLeaveEvent.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => ValidatorLeaveEvent.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => ValidatorLeaveEvent.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => ValidatorLeaveEvent.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => ValidatorLeaveEvent.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => ValidatorLeaveEvent.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => ValidatorLeaveEvent.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => ValidatorLeaveEvent.fetch(client, id),
      new: (fields: ValidatorLeaveEventFields) => {
        return new ValidatorLeaveEvent([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return ValidatorLeaveEvent.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<ValidatorLeaveEvent>> {
    return phantom(ValidatorLeaveEvent.reified())
  }

  static get p() {
    return ValidatorLeaveEvent.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('ValidatorLeaveEvent', {
      epoch: bcs.u64(),
      validator_address: bcs.bytes(32).transform({
        input: (val: string) => fromHEX(val),
        output: (val: Uint8Array) => toHEX(val),
      }),
      staking_pool_id: ID.bcs,
      is_voluntary: bcs.bool(),
    })
  }

  private static cachedBcs: ReturnType<typeof ValidatorLeaveEvent.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof ValidatorLeaveEvent.instantiateBcs> {
    if (!ValidatorLeaveEvent.cachedBcs) {
      ValidatorLeaveEvent.cachedBcs = ValidatorLeaveEvent.instantiateBcs()
    }
    return ValidatorLeaveEvent.cachedBcs
  }

  static fromFields(fields: Record<string, any>): ValidatorLeaveEvent {
    return ValidatorLeaveEvent.reified().new({
      epoch: decodeFromFields('u64', fields.epoch),
      validatorAddress: decodeFromFields('address', fields.validator_address),
      stakingPoolId: decodeFromFields(ID.reified(), fields.staking_pool_id),
      isVoluntary: decodeFromFields('bool', fields.is_voluntary),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): ValidatorLeaveEvent {
    if (!isValidatorLeaveEvent(item.type)) {
      throw new Error('not a ValidatorLeaveEvent type')
    }

    return ValidatorLeaveEvent.reified().new({
      epoch: decodeFromFieldsWithTypes('u64', item.fields.epoch),
      validatorAddress: decodeFromFieldsWithTypes('address', item.fields.validator_address),
      stakingPoolId: decodeFromFieldsWithTypes(ID.reified(), item.fields.staking_pool_id),
      isVoluntary: decodeFromFieldsWithTypes('bool', item.fields.is_voluntary),
    })
  }

  static fromBcs(data: Uint8Array): ValidatorLeaveEvent {
    return ValidatorLeaveEvent.fromFields(ValidatorLeaveEvent.bcs.parse(data))
  }

  toJSONField() {
    return {
      epoch: this.epoch.toString(),
      validatorAddress: this.validatorAddress,
      stakingPoolId: this.stakingPoolId,
      isVoluntary: this.isVoluntary,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): ValidatorLeaveEvent {
    return ValidatorLeaveEvent.reified().new({
      epoch: decodeFromJSONField('u64', field.epoch),
      validatorAddress: decodeFromJSONField('address', field.validatorAddress),
      stakingPoolId: decodeFromJSONField(ID.reified(), field.stakingPoolId),
      isVoluntary: decodeFromJSONField('bool', field.isVoluntary),
    })
  }

  static fromJSON(json: Record<string, any>): ValidatorLeaveEvent {
    if (json.$typeName !== ValidatorLeaveEvent.$typeName) {
      throw new Error(
        `not a ValidatorLeaveEvent json object: expected '${ValidatorLeaveEvent.$typeName}' but got '${json.$typeName}'`
      )
    }

    return ValidatorLeaveEvent.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): ValidatorLeaveEvent {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isValidatorLeaveEvent(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a ValidatorLeaveEvent object`)
    }
    return ValidatorLeaveEvent.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): ValidatorLeaveEvent {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isValidatorLeaveEvent(data.bcs.type)) {
        throw new Error(`object at is not a ValidatorLeaveEvent object`)
      }

      return ValidatorLeaveEvent.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return ValidatorLeaveEvent.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<ValidatorLeaveEvent> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching ValidatorLeaveEvent object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isValidatorLeaveEvent(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a ValidatorLeaveEvent object`)
    }

    return ValidatorLeaveEvent.fromSuiObjectData(res.data)
  }
}

/* ============================== VotingPowerAdmissionStartEpochKey =============================== */

export function isVotingPowerAdmissionStartEpochKey(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x3::validator_set::VotingPowerAdmissionStartEpochKey`
}

export interface VotingPowerAdmissionStartEpochKeyFields {
  dummyField: ToField<'bool'>
}

export type VotingPowerAdmissionStartEpochKeyReified = Reified<
  VotingPowerAdmissionStartEpochKey,
  VotingPowerAdmissionStartEpochKeyFields
>

export class VotingPowerAdmissionStartEpochKey implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x3::validator_set::VotingPowerAdmissionStartEpochKey`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = VotingPowerAdmissionStartEpochKey.$typeName
  readonly $fullTypeName: `0x3::validator_set::VotingPowerAdmissionStartEpochKey`
  readonly $typeArgs: []
  readonly $isPhantom = VotingPowerAdmissionStartEpochKey.$isPhantom

  readonly dummyField: ToField<'bool'>

  private constructor(typeArgs: [], fields: VotingPowerAdmissionStartEpochKeyFields) {
    this.$fullTypeName = composeSuiType(
      VotingPowerAdmissionStartEpochKey.$typeName,
      ...typeArgs
    ) as `0x3::validator_set::VotingPowerAdmissionStartEpochKey`
    this.$typeArgs = typeArgs

    this.dummyField = fields.dummyField
  }

  static reified(): VotingPowerAdmissionStartEpochKeyReified {
    const reifiedBcs = VotingPowerAdmissionStartEpochKey.bcs
    return {
      typeName: VotingPowerAdmissionStartEpochKey.$typeName,
      fullTypeName: composeSuiType(
        VotingPowerAdmissionStartEpochKey.$typeName,
        ...[]
      ) as `0x3::validator_set::VotingPowerAdmissionStartEpochKey`,
      typeArgs: [] as [],
      isPhantom: VotingPowerAdmissionStartEpochKey.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) =>
        VotingPowerAdmissionStartEpochKey.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        VotingPowerAdmissionStartEpochKey.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) =>
        VotingPowerAdmissionStartEpochKey.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => VotingPowerAdmissionStartEpochKey.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => VotingPowerAdmissionStartEpochKey.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) =>
        VotingPowerAdmissionStartEpochKey.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) =>
        VotingPowerAdmissionStartEpochKey.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) =>
        VotingPowerAdmissionStartEpochKey.fetch(client, id),
      new: (fields: VotingPowerAdmissionStartEpochKeyFields) => {
        return new VotingPowerAdmissionStartEpochKey([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return VotingPowerAdmissionStartEpochKey.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<VotingPowerAdmissionStartEpochKey>> {
    return phantom(VotingPowerAdmissionStartEpochKey.reified())
  }

  static get p() {
    return VotingPowerAdmissionStartEpochKey.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('VotingPowerAdmissionStartEpochKey', {
      dummy_field: bcs.bool(),
    })
  }

  private static cachedBcs: ReturnType<
    typeof VotingPowerAdmissionStartEpochKey.instantiateBcs
  > | null = null

  static get bcs(): ReturnType<typeof VotingPowerAdmissionStartEpochKey.instantiateBcs> {
    if (!VotingPowerAdmissionStartEpochKey.cachedBcs) {
      VotingPowerAdmissionStartEpochKey.cachedBcs =
        VotingPowerAdmissionStartEpochKey.instantiateBcs()
    }
    return VotingPowerAdmissionStartEpochKey.cachedBcs
  }

  static fromFields(fields: Record<string, any>): VotingPowerAdmissionStartEpochKey {
    return VotingPowerAdmissionStartEpochKey.reified().new({
      dummyField: decodeFromFields('bool', fields.dummy_field),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): VotingPowerAdmissionStartEpochKey {
    if (!isVotingPowerAdmissionStartEpochKey(item.type)) {
      throw new Error('not a VotingPowerAdmissionStartEpochKey type')
    }

    return VotingPowerAdmissionStartEpochKey.reified().new({
      dummyField: decodeFromFieldsWithTypes('bool', item.fields.dummy_field),
    })
  }

  static fromBcs(data: Uint8Array): VotingPowerAdmissionStartEpochKey {
    return VotingPowerAdmissionStartEpochKey.fromFields(
      VotingPowerAdmissionStartEpochKey.bcs.parse(data)
    )
  }

  toJSONField() {
    return {
      dummyField: this.dummyField,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): VotingPowerAdmissionStartEpochKey {
    return VotingPowerAdmissionStartEpochKey.reified().new({
      dummyField: decodeFromJSONField('bool', field.dummyField),
    })
  }

  static fromJSON(json: Record<string, any>): VotingPowerAdmissionStartEpochKey {
    if (json.$typeName !== VotingPowerAdmissionStartEpochKey.$typeName) {
      throw new Error(
        `not a VotingPowerAdmissionStartEpochKey json object: expected '${VotingPowerAdmissionStartEpochKey.$typeName}' but got '${json.$typeName}'`
      )
    }

    return VotingPowerAdmissionStartEpochKey.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): VotingPowerAdmissionStartEpochKey {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isVotingPowerAdmissionStartEpochKey(content.type)) {
      throw new Error(
        `object at ${(content.fields as any).id} is not a VotingPowerAdmissionStartEpochKey object`
      )
    }
    return VotingPowerAdmissionStartEpochKey.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): VotingPowerAdmissionStartEpochKey {
    if (data.bcs) {
      if (
        data.bcs.dataType !== 'moveObject' ||
        !isVotingPowerAdmissionStartEpochKey(data.bcs.type)
      ) {
        throw new Error(`object at is not a VotingPowerAdmissionStartEpochKey object`)
      }

      return VotingPowerAdmissionStartEpochKey.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return VotingPowerAdmissionStartEpochKey.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<VotingPowerAdmissionStartEpochKey> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(
        `error fetching VotingPowerAdmissionStartEpochKey object at id ${id}: ${res.error.code}`
      )
    }
    if (
      res.data?.bcs?.dataType !== 'moveObject' ||
      !isVotingPowerAdmissionStartEpochKey(res.data.bcs.type)
    ) {
      throw new Error(`object at id ${id} is not a VotingPowerAdmissionStartEpochKey object`)
    }

    return VotingPowerAdmissionStartEpochKey.fromSuiObjectData(res.data)
  }
}
