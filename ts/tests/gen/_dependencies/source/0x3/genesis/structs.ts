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
  vector,
} from '../../../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../../../_framework/util'
import { Vector } from '../../../../_framework/vector'
import { Option } from '../../../../move-stdlib/option/structs'
import { bcs } from '@mysten/sui/bcs'
import { SuiClient, SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromB64, fromHEX, toHEX } from '@mysten/sui/utils'

/* ============================== GenesisValidatorMetadata =============================== */

export function isGenesisValidatorMetadata(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x3::genesis::GenesisValidatorMetadata`
}

export interface GenesisValidatorMetadataFields {
  name: ToField<Vector<'u8'>>
  description: ToField<Vector<'u8'>>
  imageUrl: ToField<Vector<'u8'>>
  projectUrl: ToField<Vector<'u8'>>
  suiAddress: ToField<'address'>
  gasPrice: ToField<'u64'>
  commissionRate: ToField<'u64'>
  protocolPublicKey: ToField<Vector<'u8'>>
  proofOfPossession: ToField<Vector<'u8'>>
  networkPublicKey: ToField<Vector<'u8'>>
  workerPublicKey: ToField<Vector<'u8'>>
  networkAddress: ToField<Vector<'u8'>>
  p2PAddress: ToField<Vector<'u8'>>
  primaryAddress: ToField<Vector<'u8'>>
  workerAddress: ToField<Vector<'u8'>>
}

export type GenesisValidatorMetadataReified = Reified<
  GenesisValidatorMetadata,
  GenesisValidatorMetadataFields
>

export class GenesisValidatorMetadata implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x3::genesis::GenesisValidatorMetadata`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = GenesisValidatorMetadata.$typeName
  readonly $fullTypeName: `0x3::genesis::GenesisValidatorMetadata`
  readonly $typeArgs: []
  readonly $isPhantom = GenesisValidatorMetadata.$isPhantom

  readonly name: ToField<Vector<'u8'>>
  readonly description: ToField<Vector<'u8'>>
  readonly imageUrl: ToField<Vector<'u8'>>
  readonly projectUrl: ToField<Vector<'u8'>>
  readonly suiAddress: ToField<'address'>
  readonly gasPrice: ToField<'u64'>
  readonly commissionRate: ToField<'u64'>
  readonly protocolPublicKey: ToField<Vector<'u8'>>
  readonly proofOfPossession: ToField<Vector<'u8'>>
  readonly networkPublicKey: ToField<Vector<'u8'>>
  readonly workerPublicKey: ToField<Vector<'u8'>>
  readonly networkAddress: ToField<Vector<'u8'>>
  readonly p2PAddress: ToField<Vector<'u8'>>
  readonly primaryAddress: ToField<Vector<'u8'>>
  readonly workerAddress: ToField<Vector<'u8'>>

  private constructor(typeArgs: [], fields: GenesisValidatorMetadataFields) {
    this.$fullTypeName = composeSuiType(
      GenesisValidatorMetadata.$typeName,
      ...typeArgs
    ) as `0x3::genesis::GenesisValidatorMetadata`
    this.$typeArgs = typeArgs

    this.name = fields.name
    this.description = fields.description
    this.imageUrl = fields.imageUrl
    this.projectUrl = fields.projectUrl
    this.suiAddress = fields.suiAddress
    this.gasPrice = fields.gasPrice
    this.commissionRate = fields.commissionRate
    this.protocolPublicKey = fields.protocolPublicKey
    this.proofOfPossession = fields.proofOfPossession
    this.networkPublicKey = fields.networkPublicKey
    this.workerPublicKey = fields.workerPublicKey
    this.networkAddress = fields.networkAddress
    this.p2PAddress = fields.p2PAddress
    this.primaryAddress = fields.primaryAddress
    this.workerAddress = fields.workerAddress
  }

  static reified(): GenesisValidatorMetadataReified {
    const reifiedBcs = GenesisValidatorMetadata.bcs
    return {
      typeName: GenesisValidatorMetadata.$typeName,
      fullTypeName: composeSuiType(
        GenesisValidatorMetadata.$typeName,
        ...[]
      ) as `0x3::genesis::GenesisValidatorMetadata`,
      typeArgs: [] as [],
      isPhantom: GenesisValidatorMetadata.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => GenesisValidatorMetadata.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        GenesisValidatorMetadata.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => GenesisValidatorMetadata.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => GenesisValidatorMetadata.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => GenesisValidatorMetadata.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) =>
        GenesisValidatorMetadata.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) =>
        GenesisValidatorMetadata.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => GenesisValidatorMetadata.fetch(client, id),
      new: (fields: GenesisValidatorMetadataFields) => {
        return new GenesisValidatorMetadata([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return GenesisValidatorMetadata.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<GenesisValidatorMetadata>> {
    return phantom(GenesisValidatorMetadata.reified())
  }

  static get p() {
    return GenesisValidatorMetadata.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('GenesisValidatorMetadata', {
      name: bcs.vector(bcs.u8()),
      description: bcs.vector(bcs.u8()),
      image_url: bcs.vector(bcs.u8()),
      project_url: bcs.vector(bcs.u8()),
      sui_address: bcs.bytes(32).transform({
        input: (val: string) => fromHEX(val),
        output: (val: Uint8Array) => toHEX(val),
      }),
      gas_price: bcs.u64(),
      commission_rate: bcs.u64(),
      protocol_public_key: bcs.vector(bcs.u8()),
      proof_of_possession: bcs.vector(bcs.u8()),
      network_public_key: bcs.vector(bcs.u8()),
      worker_public_key: bcs.vector(bcs.u8()),
      network_address: bcs.vector(bcs.u8()),
      p2p_address: bcs.vector(bcs.u8()),
      primary_address: bcs.vector(bcs.u8()),
      worker_address: bcs.vector(bcs.u8()),
    })
  }

  private static cachedBcs: ReturnType<typeof GenesisValidatorMetadata.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof GenesisValidatorMetadata.instantiateBcs> {
    if (!GenesisValidatorMetadata.cachedBcs) {
      GenesisValidatorMetadata.cachedBcs = GenesisValidatorMetadata.instantiateBcs()
    }
    return GenesisValidatorMetadata.cachedBcs
  }

  static fromFields(fields: Record<string, any>): GenesisValidatorMetadata {
    return GenesisValidatorMetadata.reified().new({
      name: decodeFromFields(vector('u8'), fields.name),
      description: decodeFromFields(vector('u8'), fields.description),
      imageUrl: decodeFromFields(vector('u8'), fields.image_url),
      projectUrl: decodeFromFields(vector('u8'), fields.project_url),
      suiAddress: decodeFromFields('address', fields.sui_address),
      gasPrice: decodeFromFields('u64', fields.gas_price),
      commissionRate: decodeFromFields('u64', fields.commission_rate),
      protocolPublicKey: decodeFromFields(vector('u8'), fields.protocol_public_key),
      proofOfPossession: decodeFromFields(vector('u8'), fields.proof_of_possession),
      networkPublicKey: decodeFromFields(vector('u8'), fields.network_public_key),
      workerPublicKey: decodeFromFields(vector('u8'), fields.worker_public_key),
      networkAddress: decodeFromFields(vector('u8'), fields.network_address),
      p2PAddress: decodeFromFields(vector('u8'), fields.p2p_address),
      primaryAddress: decodeFromFields(vector('u8'), fields.primary_address),
      workerAddress: decodeFromFields(vector('u8'), fields.worker_address),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): GenesisValidatorMetadata {
    if (!isGenesisValidatorMetadata(item.type)) {
      throw new Error('not a GenesisValidatorMetadata type')
    }

    return GenesisValidatorMetadata.reified().new({
      name: decodeFromFieldsWithTypes(vector('u8'), item.fields.name),
      description: decodeFromFieldsWithTypes(vector('u8'), item.fields.description),
      imageUrl: decodeFromFieldsWithTypes(vector('u8'), item.fields.image_url),
      projectUrl: decodeFromFieldsWithTypes(vector('u8'), item.fields.project_url),
      suiAddress: decodeFromFieldsWithTypes('address', item.fields.sui_address),
      gasPrice: decodeFromFieldsWithTypes('u64', item.fields.gas_price),
      commissionRate: decodeFromFieldsWithTypes('u64', item.fields.commission_rate),
      protocolPublicKey: decodeFromFieldsWithTypes(vector('u8'), item.fields.protocol_public_key),
      proofOfPossession: decodeFromFieldsWithTypes(vector('u8'), item.fields.proof_of_possession),
      networkPublicKey: decodeFromFieldsWithTypes(vector('u8'), item.fields.network_public_key),
      workerPublicKey: decodeFromFieldsWithTypes(vector('u8'), item.fields.worker_public_key),
      networkAddress: decodeFromFieldsWithTypes(vector('u8'), item.fields.network_address),
      p2PAddress: decodeFromFieldsWithTypes(vector('u8'), item.fields.p2p_address),
      primaryAddress: decodeFromFieldsWithTypes(vector('u8'), item.fields.primary_address),
      workerAddress: decodeFromFieldsWithTypes(vector('u8'), item.fields.worker_address),
    })
  }

  static fromBcs(data: Uint8Array): GenesisValidatorMetadata {
    return GenesisValidatorMetadata.fromFields(GenesisValidatorMetadata.bcs.parse(data))
  }

  toJSONField() {
    return {
      name: fieldToJSON<Vector<'u8'>>(`vector<u8>`, this.name),
      description: fieldToJSON<Vector<'u8'>>(`vector<u8>`, this.description),
      imageUrl: fieldToJSON<Vector<'u8'>>(`vector<u8>`, this.imageUrl),
      projectUrl: fieldToJSON<Vector<'u8'>>(`vector<u8>`, this.projectUrl),
      suiAddress: this.suiAddress,
      gasPrice: this.gasPrice.toString(),
      commissionRate: this.commissionRate.toString(),
      protocolPublicKey: fieldToJSON<Vector<'u8'>>(`vector<u8>`, this.protocolPublicKey),
      proofOfPossession: fieldToJSON<Vector<'u8'>>(`vector<u8>`, this.proofOfPossession),
      networkPublicKey: fieldToJSON<Vector<'u8'>>(`vector<u8>`, this.networkPublicKey),
      workerPublicKey: fieldToJSON<Vector<'u8'>>(`vector<u8>`, this.workerPublicKey),
      networkAddress: fieldToJSON<Vector<'u8'>>(`vector<u8>`, this.networkAddress),
      p2PAddress: fieldToJSON<Vector<'u8'>>(`vector<u8>`, this.p2PAddress),
      primaryAddress: fieldToJSON<Vector<'u8'>>(`vector<u8>`, this.primaryAddress),
      workerAddress: fieldToJSON<Vector<'u8'>>(`vector<u8>`, this.workerAddress),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): GenesisValidatorMetadata {
    return GenesisValidatorMetadata.reified().new({
      name: decodeFromJSONField(vector('u8'), field.name),
      description: decodeFromJSONField(vector('u8'), field.description),
      imageUrl: decodeFromJSONField(vector('u8'), field.imageUrl),
      projectUrl: decodeFromJSONField(vector('u8'), field.projectUrl),
      suiAddress: decodeFromJSONField('address', field.suiAddress),
      gasPrice: decodeFromJSONField('u64', field.gasPrice),
      commissionRate: decodeFromJSONField('u64', field.commissionRate),
      protocolPublicKey: decodeFromJSONField(vector('u8'), field.protocolPublicKey),
      proofOfPossession: decodeFromJSONField(vector('u8'), field.proofOfPossession),
      networkPublicKey: decodeFromJSONField(vector('u8'), field.networkPublicKey),
      workerPublicKey: decodeFromJSONField(vector('u8'), field.workerPublicKey),
      networkAddress: decodeFromJSONField(vector('u8'), field.networkAddress),
      p2PAddress: decodeFromJSONField(vector('u8'), field.p2PAddress),
      primaryAddress: decodeFromJSONField(vector('u8'), field.primaryAddress),
      workerAddress: decodeFromJSONField(vector('u8'), field.workerAddress),
    })
  }

  static fromJSON(json: Record<string, any>): GenesisValidatorMetadata {
    if (json.$typeName !== GenesisValidatorMetadata.$typeName) {
      throw new Error(
        `not a GenesisValidatorMetadata json object: expected '${GenesisValidatorMetadata.$typeName}' but got '${json.$typeName}'`
      )
    }

    return GenesisValidatorMetadata.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): GenesisValidatorMetadata {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isGenesisValidatorMetadata(content.type)) {
      throw new Error(
        `object at ${(content.fields as any).id} is not a GenesisValidatorMetadata object`
      )
    }
    return GenesisValidatorMetadata.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): GenesisValidatorMetadata {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isGenesisValidatorMetadata(data.bcs.type)) {
        throw new Error(`object at is not a GenesisValidatorMetadata object`)
      }

      return GenesisValidatorMetadata.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return GenesisValidatorMetadata.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<GenesisValidatorMetadata> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(
        `error fetching GenesisValidatorMetadata object at id ${id}: ${res.error.code}`
      )
    }
    if (
      res.data?.bcs?.dataType !== 'moveObject' ||
      !isGenesisValidatorMetadata(res.data.bcs.type)
    ) {
      throw new Error(`object at id ${id} is not a GenesisValidatorMetadata object`)
    }

    return GenesisValidatorMetadata.fromSuiObjectData(res.data)
  }
}

/* ============================== GenesisChainParameters =============================== */

export function isGenesisChainParameters(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x3::genesis::GenesisChainParameters`
}

export interface GenesisChainParametersFields {
  protocolVersion: ToField<'u64'>
  chainStartTimestampMs: ToField<'u64'>
  epochDurationMs: ToField<'u64'>
  stakeSubsidyStartEpoch: ToField<'u64'>
  stakeSubsidyInitialDistributionAmount: ToField<'u64'>
  stakeSubsidyPeriodLength: ToField<'u64'>
  stakeSubsidyDecreaseRate: ToField<'u16'>
  maxValidatorCount: ToField<'u64'>
  minValidatorJoiningStake: ToField<'u64'>
  validatorLowStakeThreshold: ToField<'u64'>
  validatorVeryLowStakeThreshold: ToField<'u64'>
  validatorLowStakeGracePeriod: ToField<'u64'>
}

export type GenesisChainParametersReified = Reified<
  GenesisChainParameters,
  GenesisChainParametersFields
>

export class GenesisChainParameters implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x3::genesis::GenesisChainParameters`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = GenesisChainParameters.$typeName
  readonly $fullTypeName: `0x3::genesis::GenesisChainParameters`
  readonly $typeArgs: []
  readonly $isPhantom = GenesisChainParameters.$isPhantom

  readonly protocolVersion: ToField<'u64'>
  readonly chainStartTimestampMs: ToField<'u64'>
  readonly epochDurationMs: ToField<'u64'>
  readonly stakeSubsidyStartEpoch: ToField<'u64'>
  readonly stakeSubsidyInitialDistributionAmount: ToField<'u64'>
  readonly stakeSubsidyPeriodLength: ToField<'u64'>
  readonly stakeSubsidyDecreaseRate: ToField<'u16'>
  readonly maxValidatorCount: ToField<'u64'>
  readonly minValidatorJoiningStake: ToField<'u64'>
  readonly validatorLowStakeThreshold: ToField<'u64'>
  readonly validatorVeryLowStakeThreshold: ToField<'u64'>
  readonly validatorLowStakeGracePeriod: ToField<'u64'>

  private constructor(typeArgs: [], fields: GenesisChainParametersFields) {
    this.$fullTypeName = composeSuiType(
      GenesisChainParameters.$typeName,
      ...typeArgs
    ) as `0x3::genesis::GenesisChainParameters`
    this.$typeArgs = typeArgs

    this.protocolVersion = fields.protocolVersion
    this.chainStartTimestampMs = fields.chainStartTimestampMs
    this.epochDurationMs = fields.epochDurationMs
    this.stakeSubsidyStartEpoch = fields.stakeSubsidyStartEpoch
    this.stakeSubsidyInitialDistributionAmount = fields.stakeSubsidyInitialDistributionAmount
    this.stakeSubsidyPeriodLength = fields.stakeSubsidyPeriodLength
    this.stakeSubsidyDecreaseRate = fields.stakeSubsidyDecreaseRate
    this.maxValidatorCount = fields.maxValidatorCount
    this.minValidatorJoiningStake = fields.minValidatorJoiningStake
    this.validatorLowStakeThreshold = fields.validatorLowStakeThreshold
    this.validatorVeryLowStakeThreshold = fields.validatorVeryLowStakeThreshold
    this.validatorLowStakeGracePeriod = fields.validatorLowStakeGracePeriod
  }

  static reified(): GenesisChainParametersReified {
    const reifiedBcs = GenesisChainParameters.bcs
    return {
      typeName: GenesisChainParameters.$typeName,
      fullTypeName: composeSuiType(
        GenesisChainParameters.$typeName,
        ...[]
      ) as `0x3::genesis::GenesisChainParameters`,
      typeArgs: [] as [],
      isPhantom: GenesisChainParameters.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => GenesisChainParameters.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        GenesisChainParameters.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => GenesisChainParameters.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => GenesisChainParameters.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => GenesisChainParameters.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) =>
        GenesisChainParameters.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) =>
        GenesisChainParameters.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => GenesisChainParameters.fetch(client, id),
      new: (fields: GenesisChainParametersFields) => {
        return new GenesisChainParameters([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return GenesisChainParameters.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<GenesisChainParameters>> {
    return phantom(GenesisChainParameters.reified())
  }

  static get p() {
    return GenesisChainParameters.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('GenesisChainParameters', {
      protocol_version: bcs.u64(),
      chain_start_timestamp_ms: bcs.u64(),
      epoch_duration_ms: bcs.u64(),
      stake_subsidy_start_epoch: bcs.u64(),
      stake_subsidy_initial_distribution_amount: bcs.u64(),
      stake_subsidy_period_length: bcs.u64(),
      stake_subsidy_decrease_rate: bcs.u16(),
      max_validator_count: bcs.u64(),
      min_validator_joining_stake: bcs.u64(),
      validator_low_stake_threshold: bcs.u64(),
      validator_very_low_stake_threshold: bcs.u64(),
      validator_low_stake_grace_period: bcs.u64(),
    })
  }

  private static cachedBcs: ReturnType<typeof GenesisChainParameters.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof GenesisChainParameters.instantiateBcs> {
    if (!GenesisChainParameters.cachedBcs) {
      GenesisChainParameters.cachedBcs = GenesisChainParameters.instantiateBcs()
    }
    return GenesisChainParameters.cachedBcs
  }

  static fromFields(fields: Record<string, any>): GenesisChainParameters {
    return GenesisChainParameters.reified().new({
      protocolVersion: decodeFromFields('u64', fields.protocol_version),
      chainStartTimestampMs: decodeFromFields('u64', fields.chain_start_timestamp_ms),
      epochDurationMs: decodeFromFields('u64', fields.epoch_duration_ms),
      stakeSubsidyStartEpoch: decodeFromFields('u64', fields.stake_subsidy_start_epoch),
      stakeSubsidyInitialDistributionAmount: decodeFromFields(
        'u64',
        fields.stake_subsidy_initial_distribution_amount
      ),
      stakeSubsidyPeriodLength: decodeFromFields('u64', fields.stake_subsidy_period_length),
      stakeSubsidyDecreaseRate: decodeFromFields('u16', fields.stake_subsidy_decrease_rate),
      maxValidatorCount: decodeFromFields('u64', fields.max_validator_count),
      minValidatorJoiningStake: decodeFromFields('u64', fields.min_validator_joining_stake),
      validatorLowStakeThreshold: decodeFromFields('u64', fields.validator_low_stake_threshold),
      validatorVeryLowStakeThreshold: decodeFromFields(
        'u64',
        fields.validator_very_low_stake_threshold
      ),
      validatorLowStakeGracePeriod: decodeFromFields(
        'u64',
        fields.validator_low_stake_grace_period
      ),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): GenesisChainParameters {
    if (!isGenesisChainParameters(item.type)) {
      throw new Error('not a GenesisChainParameters type')
    }

    return GenesisChainParameters.reified().new({
      protocolVersion: decodeFromFieldsWithTypes('u64', item.fields.protocol_version),
      chainStartTimestampMs: decodeFromFieldsWithTypes('u64', item.fields.chain_start_timestamp_ms),
      epochDurationMs: decodeFromFieldsWithTypes('u64', item.fields.epoch_duration_ms),
      stakeSubsidyStartEpoch: decodeFromFieldsWithTypes(
        'u64',
        item.fields.stake_subsidy_start_epoch
      ),
      stakeSubsidyInitialDistributionAmount: decodeFromFieldsWithTypes(
        'u64',
        item.fields.stake_subsidy_initial_distribution_amount
      ),
      stakeSubsidyPeriodLength: decodeFromFieldsWithTypes(
        'u64',
        item.fields.stake_subsidy_period_length
      ),
      stakeSubsidyDecreaseRate: decodeFromFieldsWithTypes(
        'u16',
        item.fields.stake_subsidy_decrease_rate
      ),
      maxValidatorCount: decodeFromFieldsWithTypes('u64', item.fields.max_validator_count),
      minValidatorJoiningStake: decodeFromFieldsWithTypes(
        'u64',
        item.fields.min_validator_joining_stake
      ),
      validatorLowStakeThreshold: decodeFromFieldsWithTypes(
        'u64',
        item.fields.validator_low_stake_threshold
      ),
      validatorVeryLowStakeThreshold: decodeFromFieldsWithTypes(
        'u64',
        item.fields.validator_very_low_stake_threshold
      ),
      validatorLowStakeGracePeriod: decodeFromFieldsWithTypes(
        'u64',
        item.fields.validator_low_stake_grace_period
      ),
    })
  }

  static fromBcs(data: Uint8Array): GenesisChainParameters {
    return GenesisChainParameters.fromFields(GenesisChainParameters.bcs.parse(data))
  }

  toJSONField() {
    return {
      protocolVersion: this.protocolVersion.toString(),
      chainStartTimestampMs: this.chainStartTimestampMs.toString(),
      epochDurationMs: this.epochDurationMs.toString(),
      stakeSubsidyStartEpoch: this.stakeSubsidyStartEpoch.toString(),
      stakeSubsidyInitialDistributionAmount: this.stakeSubsidyInitialDistributionAmount.toString(),
      stakeSubsidyPeriodLength: this.stakeSubsidyPeriodLength.toString(),
      stakeSubsidyDecreaseRate: this.stakeSubsidyDecreaseRate,
      maxValidatorCount: this.maxValidatorCount.toString(),
      minValidatorJoiningStake: this.minValidatorJoiningStake.toString(),
      validatorLowStakeThreshold: this.validatorLowStakeThreshold.toString(),
      validatorVeryLowStakeThreshold: this.validatorVeryLowStakeThreshold.toString(),
      validatorLowStakeGracePeriod: this.validatorLowStakeGracePeriod.toString(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): GenesisChainParameters {
    return GenesisChainParameters.reified().new({
      protocolVersion: decodeFromJSONField('u64', field.protocolVersion),
      chainStartTimestampMs: decodeFromJSONField('u64', field.chainStartTimestampMs),
      epochDurationMs: decodeFromJSONField('u64', field.epochDurationMs),
      stakeSubsidyStartEpoch: decodeFromJSONField('u64', field.stakeSubsidyStartEpoch),
      stakeSubsidyInitialDistributionAmount: decodeFromJSONField(
        'u64',
        field.stakeSubsidyInitialDistributionAmount
      ),
      stakeSubsidyPeriodLength: decodeFromJSONField('u64', field.stakeSubsidyPeriodLength),
      stakeSubsidyDecreaseRate: decodeFromJSONField('u16', field.stakeSubsidyDecreaseRate),
      maxValidatorCount: decodeFromJSONField('u64', field.maxValidatorCount),
      minValidatorJoiningStake: decodeFromJSONField('u64', field.minValidatorJoiningStake),
      validatorLowStakeThreshold: decodeFromJSONField('u64', field.validatorLowStakeThreshold),
      validatorVeryLowStakeThreshold: decodeFromJSONField(
        'u64',
        field.validatorVeryLowStakeThreshold
      ),
      validatorLowStakeGracePeriod: decodeFromJSONField('u64', field.validatorLowStakeGracePeriod),
    })
  }

  static fromJSON(json: Record<string, any>): GenesisChainParameters {
    if (json.$typeName !== GenesisChainParameters.$typeName) {
      throw new Error(
        `not a GenesisChainParameters json object: expected '${GenesisChainParameters.$typeName}' but got '${json.$typeName}'`
      )
    }

    return GenesisChainParameters.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): GenesisChainParameters {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isGenesisChainParameters(content.type)) {
      throw new Error(
        `object at ${(content.fields as any).id} is not a GenesisChainParameters object`
      )
    }
    return GenesisChainParameters.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): GenesisChainParameters {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isGenesisChainParameters(data.bcs.type)) {
        throw new Error(`object at is not a GenesisChainParameters object`)
      }

      return GenesisChainParameters.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return GenesisChainParameters.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<GenesisChainParameters> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching GenesisChainParameters object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isGenesisChainParameters(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a GenesisChainParameters object`)
    }

    return GenesisChainParameters.fromSuiObjectData(res.data)
  }
}

/* ============================== TokenDistributionSchedule =============================== */

export function isTokenDistributionSchedule(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x3::genesis::TokenDistributionSchedule`
}

export interface TokenDistributionScheduleFields {
  stakeSubsidyFundMist: ToField<'u64'>
  allocations: ToField<Vector<TokenAllocation>>
}

export type TokenDistributionScheduleReified = Reified<
  TokenDistributionSchedule,
  TokenDistributionScheduleFields
>

export class TokenDistributionSchedule implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x3::genesis::TokenDistributionSchedule`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = TokenDistributionSchedule.$typeName
  readonly $fullTypeName: `0x3::genesis::TokenDistributionSchedule`
  readonly $typeArgs: []
  readonly $isPhantom = TokenDistributionSchedule.$isPhantom

  readonly stakeSubsidyFundMist: ToField<'u64'>
  readonly allocations: ToField<Vector<TokenAllocation>>

  private constructor(typeArgs: [], fields: TokenDistributionScheduleFields) {
    this.$fullTypeName = composeSuiType(
      TokenDistributionSchedule.$typeName,
      ...typeArgs
    ) as `0x3::genesis::TokenDistributionSchedule`
    this.$typeArgs = typeArgs

    this.stakeSubsidyFundMist = fields.stakeSubsidyFundMist
    this.allocations = fields.allocations
  }

  static reified(): TokenDistributionScheduleReified {
    const reifiedBcs = TokenDistributionSchedule.bcs
    return {
      typeName: TokenDistributionSchedule.$typeName,
      fullTypeName: composeSuiType(
        TokenDistributionSchedule.$typeName,
        ...[]
      ) as `0x3::genesis::TokenDistributionSchedule`,
      typeArgs: [] as [],
      isPhantom: TokenDistributionSchedule.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => TokenDistributionSchedule.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        TokenDistributionSchedule.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => TokenDistributionSchedule.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => TokenDistributionSchedule.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => TokenDistributionSchedule.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) =>
        TokenDistributionSchedule.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) =>
        TokenDistributionSchedule.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => TokenDistributionSchedule.fetch(client, id),
      new: (fields: TokenDistributionScheduleFields) => {
        return new TokenDistributionSchedule([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return TokenDistributionSchedule.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<TokenDistributionSchedule>> {
    return phantom(TokenDistributionSchedule.reified())
  }

  static get p() {
    return TokenDistributionSchedule.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('TokenDistributionSchedule', {
      stake_subsidy_fund_mist: bcs.u64(),
      allocations: bcs.vector(TokenAllocation.bcs),
    })
  }

  private static cachedBcs: ReturnType<typeof TokenDistributionSchedule.instantiateBcs> | null =
    null

  static get bcs(): ReturnType<typeof TokenDistributionSchedule.instantiateBcs> {
    if (!TokenDistributionSchedule.cachedBcs) {
      TokenDistributionSchedule.cachedBcs = TokenDistributionSchedule.instantiateBcs()
    }
    return TokenDistributionSchedule.cachedBcs
  }

  static fromFields(fields: Record<string, any>): TokenDistributionSchedule {
    return TokenDistributionSchedule.reified().new({
      stakeSubsidyFundMist: decodeFromFields('u64', fields.stake_subsidy_fund_mist),
      allocations: decodeFromFields(vector(TokenAllocation.reified()), fields.allocations),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): TokenDistributionSchedule {
    if (!isTokenDistributionSchedule(item.type)) {
      throw new Error('not a TokenDistributionSchedule type')
    }

    return TokenDistributionSchedule.reified().new({
      stakeSubsidyFundMist: decodeFromFieldsWithTypes('u64', item.fields.stake_subsidy_fund_mist),
      allocations: decodeFromFieldsWithTypes(
        vector(TokenAllocation.reified()),
        item.fields.allocations
      ),
    })
  }

  static fromBcs(data: Uint8Array): TokenDistributionSchedule {
    return TokenDistributionSchedule.fromFields(TokenDistributionSchedule.bcs.parse(data))
  }

  toJSONField() {
    return {
      stakeSubsidyFundMist: this.stakeSubsidyFundMist.toString(),
      allocations: fieldToJSON<Vector<TokenAllocation>>(
        `vector<${TokenAllocation.$typeName}>`,
        this.allocations
      ),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): TokenDistributionSchedule {
    return TokenDistributionSchedule.reified().new({
      stakeSubsidyFundMist: decodeFromJSONField('u64', field.stakeSubsidyFundMist),
      allocations: decodeFromJSONField(vector(TokenAllocation.reified()), field.allocations),
    })
  }

  static fromJSON(json: Record<string, any>): TokenDistributionSchedule {
    if (json.$typeName !== TokenDistributionSchedule.$typeName) {
      throw new Error(
        `not a TokenDistributionSchedule json object: expected '${TokenDistributionSchedule.$typeName}' but got '${json.$typeName}'`
      )
    }

    return TokenDistributionSchedule.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): TokenDistributionSchedule {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isTokenDistributionSchedule(content.type)) {
      throw new Error(
        `object at ${(content.fields as any).id} is not a TokenDistributionSchedule object`
      )
    }
    return TokenDistributionSchedule.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): TokenDistributionSchedule {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isTokenDistributionSchedule(data.bcs.type)) {
        throw new Error(`object at is not a TokenDistributionSchedule object`)
      }

      return TokenDistributionSchedule.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return TokenDistributionSchedule.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<TokenDistributionSchedule> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(
        `error fetching TokenDistributionSchedule object at id ${id}: ${res.error.code}`
      )
    }
    if (
      res.data?.bcs?.dataType !== 'moveObject' ||
      !isTokenDistributionSchedule(res.data.bcs.type)
    ) {
      throw new Error(`object at id ${id} is not a TokenDistributionSchedule object`)
    }

    return TokenDistributionSchedule.fromSuiObjectData(res.data)
  }
}

/* ============================== TokenAllocation =============================== */

export function isTokenAllocation(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x3::genesis::TokenAllocation`
}

export interface TokenAllocationFields {
  recipientAddress: ToField<'address'>
  amountMist: ToField<'u64'>
  stakedWithValidator: ToField<Option<'address'>>
}

export type TokenAllocationReified = Reified<TokenAllocation, TokenAllocationFields>

export class TokenAllocation implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x3::genesis::TokenAllocation`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = TokenAllocation.$typeName
  readonly $fullTypeName: `0x3::genesis::TokenAllocation`
  readonly $typeArgs: []
  readonly $isPhantom = TokenAllocation.$isPhantom

  readonly recipientAddress: ToField<'address'>
  readonly amountMist: ToField<'u64'>
  readonly stakedWithValidator: ToField<Option<'address'>>

  private constructor(typeArgs: [], fields: TokenAllocationFields) {
    this.$fullTypeName = composeSuiType(
      TokenAllocation.$typeName,
      ...typeArgs
    ) as `0x3::genesis::TokenAllocation`
    this.$typeArgs = typeArgs

    this.recipientAddress = fields.recipientAddress
    this.amountMist = fields.amountMist
    this.stakedWithValidator = fields.stakedWithValidator
  }

  static reified(): TokenAllocationReified {
    const reifiedBcs = TokenAllocation.bcs
    return {
      typeName: TokenAllocation.$typeName,
      fullTypeName: composeSuiType(
        TokenAllocation.$typeName,
        ...[]
      ) as `0x3::genesis::TokenAllocation`,
      typeArgs: [] as [],
      isPhantom: TokenAllocation.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => TokenAllocation.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => TokenAllocation.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => TokenAllocation.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => TokenAllocation.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => TokenAllocation.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => TokenAllocation.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => TokenAllocation.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => TokenAllocation.fetch(client, id),
      new: (fields: TokenAllocationFields) => {
        return new TokenAllocation([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return TokenAllocation.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<TokenAllocation>> {
    return phantom(TokenAllocation.reified())
  }

  static get p() {
    return TokenAllocation.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('TokenAllocation', {
      recipient_address: bcs.bytes(32).transform({
        input: (val: string) => fromHEX(val),
        output: (val: Uint8Array) => toHEX(val),
      }),
      amount_mist: bcs.u64(),
      staked_with_validator: Option.bcs(
        bcs.bytes(32).transform({
          input: (val: string) => fromHEX(val),
          output: (val: Uint8Array) => toHEX(val),
        })
      ),
    })
  }

  private static cachedBcs: ReturnType<typeof TokenAllocation.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof TokenAllocation.instantiateBcs> {
    if (!TokenAllocation.cachedBcs) {
      TokenAllocation.cachedBcs = TokenAllocation.instantiateBcs()
    }
    return TokenAllocation.cachedBcs
  }

  static fromFields(fields: Record<string, any>): TokenAllocation {
    return TokenAllocation.reified().new({
      recipientAddress: decodeFromFields('address', fields.recipient_address),
      amountMist: decodeFromFields('u64', fields.amount_mist),
      stakedWithValidator: decodeFromFields(
        Option.reified('address'),
        fields.staked_with_validator
      ),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): TokenAllocation {
    if (!isTokenAllocation(item.type)) {
      throw new Error('not a TokenAllocation type')
    }

    return TokenAllocation.reified().new({
      recipientAddress: decodeFromFieldsWithTypes('address', item.fields.recipient_address),
      amountMist: decodeFromFieldsWithTypes('u64', item.fields.amount_mist),
      stakedWithValidator: decodeFromFieldsWithTypes(
        Option.reified('address'),
        item.fields.staked_with_validator
      ),
    })
  }

  static fromBcs(data: Uint8Array): TokenAllocation {
    return TokenAllocation.fromFields(TokenAllocation.bcs.parse(data))
  }

  toJSONField() {
    return {
      recipientAddress: this.recipientAddress,
      amountMist: this.amountMist.toString(),
      stakedWithValidator: fieldToJSON<Option<'address'>>(
        `${Option.$typeName}<address>`,
        this.stakedWithValidator
      ),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): TokenAllocation {
    return TokenAllocation.reified().new({
      recipientAddress: decodeFromJSONField('address', field.recipientAddress),
      amountMist: decodeFromJSONField('u64', field.amountMist),
      stakedWithValidator: decodeFromJSONField(
        Option.reified('address'),
        field.stakedWithValidator
      ),
    })
  }

  static fromJSON(json: Record<string, any>): TokenAllocation {
    if (json.$typeName !== TokenAllocation.$typeName) {
      throw new Error(
        `not a TokenAllocation json object: expected '${TokenAllocation.$typeName}' but got '${json.$typeName}'`
      )
    }

    return TokenAllocation.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): TokenAllocation {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isTokenAllocation(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a TokenAllocation object`)
    }
    return TokenAllocation.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): TokenAllocation {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isTokenAllocation(data.bcs.type)) {
        throw new Error(`object at is not a TokenAllocation object`)
      }

      return TokenAllocation.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return TokenAllocation.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<TokenAllocation> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching TokenAllocation object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isTokenAllocation(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a TokenAllocation object`)
    }

    return TokenAllocation.fromSuiObjectData(res.data)
  }
}
