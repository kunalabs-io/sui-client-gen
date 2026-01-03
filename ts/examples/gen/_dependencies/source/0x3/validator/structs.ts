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
import { String } from '../../../../move-stdlib/string/structs'
import { Bag } from '../../../../sui/bag/structs'
import { ID } from '../../../../sui/object/structs'
import { Url } from '../../../../sui/url/structs'
import { StakingPool } from '../staking-pool/structs'
import { bcs } from '@mysten/sui/bcs'
import { SuiClient, SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromB64, fromHEX, toHEX } from '@mysten/sui/utils'

/* ============================== ValidatorMetadata =============================== */

export function isValidatorMetadata(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x3::validator::ValidatorMetadata`
}

export interface ValidatorMetadataFields {
  suiAddress: ToField<'address'>
  protocolPubkeyBytes: ToField<Vector<'u8'>>
  networkPubkeyBytes: ToField<Vector<'u8'>>
  workerPubkeyBytes: ToField<Vector<'u8'>>
  proofOfPossession: ToField<Vector<'u8'>>
  name: ToField<String>
  description: ToField<String>
  imageUrl: ToField<Url>
  projectUrl: ToField<Url>
  netAddress: ToField<String>
  p2PAddress: ToField<String>
  primaryAddress: ToField<String>
  workerAddress: ToField<String>
  nextEpochProtocolPubkeyBytes: ToField<Option<Vector<'u8'>>>
  nextEpochProofOfPossession: ToField<Option<Vector<'u8'>>>
  nextEpochNetworkPubkeyBytes: ToField<Option<Vector<'u8'>>>
  nextEpochWorkerPubkeyBytes: ToField<Option<Vector<'u8'>>>
  nextEpochNetAddress: ToField<Option<String>>
  nextEpochP2PAddress: ToField<Option<String>>
  nextEpochPrimaryAddress: ToField<Option<String>>
  nextEpochWorkerAddress: ToField<Option<String>>
  extraFields: ToField<Bag>
}

export type ValidatorMetadataReified = Reified<ValidatorMetadata, ValidatorMetadataFields>

export class ValidatorMetadata implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x3::validator::ValidatorMetadata`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = ValidatorMetadata.$typeName
  readonly $fullTypeName: `0x3::validator::ValidatorMetadata`
  readonly $typeArgs: []
  readonly $isPhantom = ValidatorMetadata.$isPhantom

  readonly suiAddress: ToField<'address'>
  readonly protocolPubkeyBytes: ToField<Vector<'u8'>>
  readonly networkPubkeyBytes: ToField<Vector<'u8'>>
  readonly workerPubkeyBytes: ToField<Vector<'u8'>>
  readonly proofOfPossession: ToField<Vector<'u8'>>
  readonly name: ToField<String>
  readonly description: ToField<String>
  readonly imageUrl: ToField<Url>
  readonly projectUrl: ToField<Url>
  readonly netAddress: ToField<String>
  readonly p2PAddress: ToField<String>
  readonly primaryAddress: ToField<String>
  readonly workerAddress: ToField<String>
  readonly nextEpochProtocolPubkeyBytes: ToField<Option<Vector<'u8'>>>
  readonly nextEpochProofOfPossession: ToField<Option<Vector<'u8'>>>
  readonly nextEpochNetworkPubkeyBytes: ToField<Option<Vector<'u8'>>>
  readonly nextEpochWorkerPubkeyBytes: ToField<Option<Vector<'u8'>>>
  readonly nextEpochNetAddress: ToField<Option<String>>
  readonly nextEpochP2PAddress: ToField<Option<String>>
  readonly nextEpochPrimaryAddress: ToField<Option<String>>
  readonly nextEpochWorkerAddress: ToField<Option<String>>
  readonly extraFields: ToField<Bag>

  private constructor(typeArgs: [], fields: ValidatorMetadataFields) {
    this.$fullTypeName = composeSuiType(
      ValidatorMetadata.$typeName,
      ...typeArgs
    ) as `0x3::validator::ValidatorMetadata`
    this.$typeArgs = typeArgs

    this.suiAddress = fields.suiAddress
    this.protocolPubkeyBytes = fields.protocolPubkeyBytes
    this.networkPubkeyBytes = fields.networkPubkeyBytes
    this.workerPubkeyBytes = fields.workerPubkeyBytes
    this.proofOfPossession = fields.proofOfPossession
    this.name = fields.name
    this.description = fields.description
    this.imageUrl = fields.imageUrl
    this.projectUrl = fields.projectUrl
    this.netAddress = fields.netAddress
    this.p2PAddress = fields.p2PAddress
    this.primaryAddress = fields.primaryAddress
    this.workerAddress = fields.workerAddress
    this.nextEpochProtocolPubkeyBytes = fields.nextEpochProtocolPubkeyBytes
    this.nextEpochProofOfPossession = fields.nextEpochProofOfPossession
    this.nextEpochNetworkPubkeyBytes = fields.nextEpochNetworkPubkeyBytes
    this.nextEpochWorkerPubkeyBytes = fields.nextEpochWorkerPubkeyBytes
    this.nextEpochNetAddress = fields.nextEpochNetAddress
    this.nextEpochP2PAddress = fields.nextEpochP2PAddress
    this.nextEpochPrimaryAddress = fields.nextEpochPrimaryAddress
    this.nextEpochWorkerAddress = fields.nextEpochWorkerAddress
    this.extraFields = fields.extraFields
  }

  static reified(): ValidatorMetadataReified {
    const reifiedBcs = ValidatorMetadata.bcs
    return {
      typeName: ValidatorMetadata.$typeName,
      fullTypeName: composeSuiType(
        ValidatorMetadata.$typeName,
        ...[]
      ) as `0x3::validator::ValidatorMetadata`,
      typeArgs: [] as [],
      isPhantom: ValidatorMetadata.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => ValidatorMetadata.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => ValidatorMetadata.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => ValidatorMetadata.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => ValidatorMetadata.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => ValidatorMetadata.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => ValidatorMetadata.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => ValidatorMetadata.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => ValidatorMetadata.fetch(client, id),
      new: (fields: ValidatorMetadataFields) => {
        return new ValidatorMetadata([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return ValidatorMetadata.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<ValidatorMetadata>> {
    return phantom(ValidatorMetadata.reified())
  }

  static get p() {
    return ValidatorMetadata.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('ValidatorMetadata', {
      sui_address: bcs.bytes(32).transform({
        input: (val: string) => fromHEX(val),
        output: (val: Uint8Array) => toHEX(val),
      }),
      protocol_pubkey_bytes: bcs.vector(bcs.u8()),
      network_pubkey_bytes: bcs.vector(bcs.u8()),
      worker_pubkey_bytes: bcs.vector(bcs.u8()),
      proof_of_possession: bcs.vector(bcs.u8()),
      name: String.bcs,
      description: String.bcs,
      image_url: Url.bcs,
      project_url: Url.bcs,
      net_address: String.bcs,
      p2p_address: String.bcs,
      primary_address: String.bcs,
      worker_address: String.bcs,
      next_epoch_protocol_pubkey_bytes: Option.bcs(bcs.vector(bcs.u8())),
      next_epoch_proof_of_possession: Option.bcs(bcs.vector(bcs.u8())),
      next_epoch_network_pubkey_bytes: Option.bcs(bcs.vector(bcs.u8())),
      next_epoch_worker_pubkey_bytes: Option.bcs(bcs.vector(bcs.u8())),
      next_epoch_net_address: Option.bcs(String.bcs),
      next_epoch_p2p_address: Option.bcs(String.bcs),
      next_epoch_primary_address: Option.bcs(String.bcs),
      next_epoch_worker_address: Option.bcs(String.bcs),
      extra_fields: Bag.bcs,
    })
  }

  private static cachedBcs: ReturnType<typeof ValidatorMetadata.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof ValidatorMetadata.instantiateBcs> {
    if (!ValidatorMetadata.cachedBcs) {
      ValidatorMetadata.cachedBcs = ValidatorMetadata.instantiateBcs()
    }
    return ValidatorMetadata.cachedBcs
  }

  static fromFields(fields: Record<string, any>): ValidatorMetadata {
    return ValidatorMetadata.reified().new({
      suiAddress: decodeFromFields('address', fields.sui_address),
      protocolPubkeyBytes: decodeFromFields(vector('u8'), fields.protocol_pubkey_bytes),
      networkPubkeyBytes: decodeFromFields(vector('u8'), fields.network_pubkey_bytes),
      workerPubkeyBytes: decodeFromFields(vector('u8'), fields.worker_pubkey_bytes),
      proofOfPossession: decodeFromFields(vector('u8'), fields.proof_of_possession),
      name: decodeFromFields(String.reified(), fields.name),
      description: decodeFromFields(String.reified(), fields.description),
      imageUrl: decodeFromFields(Url.reified(), fields.image_url),
      projectUrl: decodeFromFields(Url.reified(), fields.project_url),
      netAddress: decodeFromFields(String.reified(), fields.net_address),
      p2PAddress: decodeFromFields(String.reified(), fields.p2p_address),
      primaryAddress: decodeFromFields(String.reified(), fields.primary_address),
      workerAddress: decodeFromFields(String.reified(), fields.worker_address),
      nextEpochProtocolPubkeyBytes: decodeFromFields(
        Option.reified(vector('u8')),
        fields.next_epoch_protocol_pubkey_bytes
      ),
      nextEpochProofOfPossession: decodeFromFields(
        Option.reified(vector('u8')),
        fields.next_epoch_proof_of_possession
      ),
      nextEpochNetworkPubkeyBytes: decodeFromFields(
        Option.reified(vector('u8')),
        fields.next_epoch_network_pubkey_bytes
      ),
      nextEpochWorkerPubkeyBytes: decodeFromFields(
        Option.reified(vector('u8')),
        fields.next_epoch_worker_pubkey_bytes
      ),
      nextEpochNetAddress: decodeFromFields(
        Option.reified(String.reified()),
        fields.next_epoch_net_address
      ),
      nextEpochP2PAddress: decodeFromFields(
        Option.reified(String.reified()),
        fields.next_epoch_p2p_address
      ),
      nextEpochPrimaryAddress: decodeFromFields(
        Option.reified(String.reified()),
        fields.next_epoch_primary_address
      ),
      nextEpochWorkerAddress: decodeFromFields(
        Option.reified(String.reified()),
        fields.next_epoch_worker_address
      ),
      extraFields: decodeFromFields(Bag.reified(), fields.extra_fields),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): ValidatorMetadata {
    if (!isValidatorMetadata(item.type)) {
      throw new Error('not a ValidatorMetadata type')
    }

    return ValidatorMetadata.reified().new({
      suiAddress: decodeFromFieldsWithTypes('address', item.fields.sui_address),
      protocolPubkeyBytes: decodeFromFieldsWithTypes(
        vector('u8'),
        item.fields.protocol_pubkey_bytes
      ),
      networkPubkeyBytes: decodeFromFieldsWithTypes(vector('u8'), item.fields.network_pubkey_bytes),
      workerPubkeyBytes: decodeFromFieldsWithTypes(vector('u8'), item.fields.worker_pubkey_bytes),
      proofOfPossession: decodeFromFieldsWithTypes(vector('u8'), item.fields.proof_of_possession),
      name: decodeFromFieldsWithTypes(String.reified(), item.fields.name),
      description: decodeFromFieldsWithTypes(String.reified(), item.fields.description),
      imageUrl: decodeFromFieldsWithTypes(Url.reified(), item.fields.image_url),
      projectUrl: decodeFromFieldsWithTypes(Url.reified(), item.fields.project_url),
      netAddress: decodeFromFieldsWithTypes(String.reified(), item.fields.net_address),
      p2PAddress: decodeFromFieldsWithTypes(String.reified(), item.fields.p2p_address),
      primaryAddress: decodeFromFieldsWithTypes(String.reified(), item.fields.primary_address),
      workerAddress: decodeFromFieldsWithTypes(String.reified(), item.fields.worker_address),
      nextEpochProtocolPubkeyBytes: decodeFromFieldsWithTypes(
        Option.reified(vector('u8')),
        item.fields.next_epoch_protocol_pubkey_bytes
      ),
      nextEpochProofOfPossession: decodeFromFieldsWithTypes(
        Option.reified(vector('u8')),
        item.fields.next_epoch_proof_of_possession
      ),
      nextEpochNetworkPubkeyBytes: decodeFromFieldsWithTypes(
        Option.reified(vector('u8')),
        item.fields.next_epoch_network_pubkey_bytes
      ),
      nextEpochWorkerPubkeyBytes: decodeFromFieldsWithTypes(
        Option.reified(vector('u8')),
        item.fields.next_epoch_worker_pubkey_bytes
      ),
      nextEpochNetAddress: decodeFromFieldsWithTypes(
        Option.reified(String.reified()),
        item.fields.next_epoch_net_address
      ),
      nextEpochP2PAddress: decodeFromFieldsWithTypes(
        Option.reified(String.reified()),
        item.fields.next_epoch_p2p_address
      ),
      nextEpochPrimaryAddress: decodeFromFieldsWithTypes(
        Option.reified(String.reified()),
        item.fields.next_epoch_primary_address
      ),
      nextEpochWorkerAddress: decodeFromFieldsWithTypes(
        Option.reified(String.reified()),
        item.fields.next_epoch_worker_address
      ),
      extraFields: decodeFromFieldsWithTypes(Bag.reified(), item.fields.extra_fields),
    })
  }

  static fromBcs(data: Uint8Array): ValidatorMetadata {
    return ValidatorMetadata.fromFields(ValidatorMetadata.bcs.parse(data))
  }

  toJSONField() {
    return {
      suiAddress: this.suiAddress,
      protocolPubkeyBytes: fieldToJSON<Vector<'u8'>>(`vector<u8>`, this.protocolPubkeyBytes),
      networkPubkeyBytes: fieldToJSON<Vector<'u8'>>(`vector<u8>`, this.networkPubkeyBytes),
      workerPubkeyBytes: fieldToJSON<Vector<'u8'>>(`vector<u8>`, this.workerPubkeyBytes),
      proofOfPossession: fieldToJSON<Vector<'u8'>>(`vector<u8>`, this.proofOfPossession),
      name: this.name,
      description: this.description,
      imageUrl: this.imageUrl,
      projectUrl: this.projectUrl,
      netAddress: this.netAddress,
      p2PAddress: this.p2PAddress,
      primaryAddress: this.primaryAddress,
      workerAddress: this.workerAddress,
      nextEpochProtocolPubkeyBytes: fieldToJSON<Option<Vector<'u8'>>>(
        `${Option.$typeName}<vector<u8>>`,
        this.nextEpochProtocolPubkeyBytes
      ),
      nextEpochProofOfPossession: fieldToJSON<Option<Vector<'u8'>>>(
        `${Option.$typeName}<vector<u8>>`,
        this.nextEpochProofOfPossession
      ),
      nextEpochNetworkPubkeyBytes: fieldToJSON<Option<Vector<'u8'>>>(
        `${Option.$typeName}<vector<u8>>`,
        this.nextEpochNetworkPubkeyBytes
      ),
      nextEpochWorkerPubkeyBytes: fieldToJSON<Option<Vector<'u8'>>>(
        `${Option.$typeName}<vector<u8>>`,
        this.nextEpochWorkerPubkeyBytes
      ),
      nextEpochNetAddress: fieldToJSON<Option<String>>(
        `${Option.$typeName}<${String.$typeName}>`,
        this.nextEpochNetAddress
      ),
      nextEpochP2PAddress: fieldToJSON<Option<String>>(
        `${Option.$typeName}<${String.$typeName}>`,
        this.nextEpochP2PAddress
      ),
      nextEpochPrimaryAddress: fieldToJSON<Option<String>>(
        `${Option.$typeName}<${String.$typeName}>`,
        this.nextEpochPrimaryAddress
      ),
      nextEpochWorkerAddress: fieldToJSON<Option<String>>(
        `${Option.$typeName}<${String.$typeName}>`,
        this.nextEpochWorkerAddress
      ),
      extraFields: this.extraFields.toJSONField(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): ValidatorMetadata {
    return ValidatorMetadata.reified().new({
      suiAddress: decodeFromJSONField('address', field.suiAddress),
      protocolPubkeyBytes: decodeFromJSONField(vector('u8'), field.protocolPubkeyBytes),
      networkPubkeyBytes: decodeFromJSONField(vector('u8'), field.networkPubkeyBytes),
      workerPubkeyBytes: decodeFromJSONField(vector('u8'), field.workerPubkeyBytes),
      proofOfPossession: decodeFromJSONField(vector('u8'), field.proofOfPossession),
      name: decodeFromJSONField(String.reified(), field.name),
      description: decodeFromJSONField(String.reified(), field.description),
      imageUrl: decodeFromJSONField(Url.reified(), field.imageUrl),
      projectUrl: decodeFromJSONField(Url.reified(), field.projectUrl),
      netAddress: decodeFromJSONField(String.reified(), field.netAddress),
      p2PAddress: decodeFromJSONField(String.reified(), field.p2PAddress),
      primaryAddress: decodeFromJSONField(String.reified(), field.primaryAddress),
      workerAddress: decodeFromJSONField(String.reified(), field.workerAddress),
      nextEpochProtocolPubkeyBytes: decodeFromJSONField(
        Option.reified(vector('u8')),
        field.nextEpochProtocolPubkeyBytes
      ),
      nextEpochProofOfPossession: decodeFromJSONField(
        Option.reified(vector('u8')),
        field.nextEpochProofOfPossession
      ),
      nextEpochNetworkPubkeyBytes: decodeFromJSONField(
        Option.reified(vector('u8')),
        field.nextEpochNetworkPubkeyBytes
      ),
      nextEpochWorkerPubkeyBytes: decodeFromJSONField(
        Option.reified(vector('u8')),
        field.nextEpochWorkerPubkeyBytes
      ),
      nextEpochNetAddress: decodeFromJSONField(
        Option.reified(String.reified()),
        field.nextEpochNetAddress
      ),
      nextEpochP2PAddress: decodeFromJSONField(
        Option.reified(String.reified()),
        field.nextEpochP2PAddress
      ),
      nextEpochPrimaryAddress: decodeFromJSONField(
        Option.reified(String.reified()),
        field.nextEpochPrimaryAddress
      ),
      nextEpochWorkerAddress: decodeFromJSONField(
        Option.reified(String.reified()),
        field.nextEpochWorkerAddress
      ),
      extraFields: decodeFromJSONField(Bag.reified(), field.extraFields),
    })
  }

  static fromJSON(json: Record<string, any>): ValidatorMetadata {
    if (json.$typeName !== ValidatorMetadata.$typeName) {
      throw new Error(
        `not a ValidatorMetadata json object: expected '${ValidatorMetadata.$typeName}' but got '${json.$typeName}'`
      )
    }

    return ValidatorMetadata.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): ValidatorMetadata {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isValidatorMetadata(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a ValidatorMetadata object`)
    }
    return ValidatorMetadata.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): ValidatorMetadata {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isValidatorMetadata(data.bcs.type)) {
        throw new Error(`object at is not a ValidatorMetadata object`)
      }

      return ValidatorMetadata.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return ValidatorMetadata.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<ValidatorMetadata> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching ValidatorMetadata object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isValidatorMetadata(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a ValidatorMetadata object`)
    }

    return ValidatorMetadata.fromSuiObjectData(res.data)
  }
}

/* ============================== Validator =============================== */

export function isValidator(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x3::validator::Validator`
}

export interface ValidatorFields {
  metadata: ToField<ValidatorMetadata>
  votingPower: ToField<'u64'>
  operationCapId: ToField<ID>
  gasPrice: ToField<'u64'>
  stakingPool: ToField<StakingPool>
  commissionRate: ToField<'u64'>
  nextEpochStake: ToField<'u64'>
  nextEpochGasPrice: ToField<'u64'>
  nextEpochCommissionRate: ToField<'u64'>
  extraFields: ToField<Bag>
}

export type ValidatorReified = Reified<Validator, ValidatorFields>

export class Validator implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x3::validator::Validator`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = Validator.$typeName
  readonly $fullTypeName: `0x3::validator::Validator`
  readonly $typeArgs: []
  readonly $isPhantom = Validator.$isPhantom

  readonly metadata: ToField<ValidatorMetadata>
  readonly votingPower: ToField<'u64'>
  readonly operationCapId: ToField<ID>
  readonly gasPrice: ToField<'u64'>
  readonly stakingPool: ToField<StakingPool>
  readonly commissionRate: ToField<'u64'>
  readonly nextEpochStake: ToField<'u64'>
  readonly nextEpochGasPrice: ToField<'u64'>
  readonly nextEpochCommissionRate: ToField<'u64'>
  readonly extraFields: ToField<Bag>

  private constructor(typeArgs: [], fields: ValidatorFields) {
    this.$fullTypeName = composeSuiType(
      Validator.$typeName,
      ...typeArgs
    ) as `0x3::validator::Validator`
    this.$typeArgs = typeArgs

    this.metadata = fields.metadata
    this.votingPower = fields.votingPower
    this.operationCapId = fields.operationCapId
    this.gasPrice = fields.gasPrice
    this.stakingPool = fields.stakingPool
    this.commissionRate = fields.commissionRate
    this.nextEpochStake = fields.nextEpochStake
    this.nextEpochGasPrice = fields.nextEpochGasPrice
    this.nextEpochCommissionRate = fields.nextEpochCommissionRate
    this.extraFields = fields.extraFields
  }

  static reified(): ValidatorReified {
    const reifiedBcs = Validator.bcs
    return {
      typeName: Validator.$typeName,
      fullTypeName: composeSuiType(Validator.$typeName, ...[]) as `0x3::validator::Validator`,
      typeArgs: [] as [],
      isPhantom: Validator.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => Validator.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Validator.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => Validator.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => Validator.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => Validator.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => Validator.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => Validator.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => Validator.fetch(client, id),
      new: (fields: ValidatorFields) => {
        return new Validator([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Validator.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<Validator>> {
    return phantom(Validator.reified())
  }

  static get p() {
    return Validator.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('Validator', {
      metadata: ValidatorMetadata.bcs,
      voting_power: bcs.u64(),
      operation_cap_id: ID.bcs,
      gas_price: bcs.u64(),
      staking_pool: StakingPool.bcs,
      commission_rate: bcs.u64(),
      next_epoch_stake: bcs.u64(),
      next_epoch_gas_price: bcs.u64(),
      next_epoch_commission_rate: bcs.u64(),
      extra_fields: Bag.bcs,
    })
  }

  private static cachedBcs: ReturnType<typeof Validator.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof Validator.instantiateBcs> {
    if (!Validator.cachedBcs) {
      Validator.cachedBcs = Validator.instantiateBcs()
    }
    return Validator.cachedBcs
  }

  static fromFields(fields: Record<string, any>): Validator {
    return Validator.reified().new({
      metadata: decodeFromFields(ValidatorMetadata.reified(), fields.metadata),
      votingPower: decodeFromFields('u64', fields.voting_power),
      operationCapId: decodeFromFields(ID.reified(), fields.operation_cap_id),
      gasPrice: decodeFromFields('u64', fields.gas_price),
      stakingPool: decodeFromFields(StakingPool.reified(), fields.staking_pool),
      commissionRate: decodeFromFields('u64', fields.commission_rate),
      nextEpochStake: decodeFromFields('u64', fields.next_epoch_stake),
      nextEpochGasPrice: decodeFromFields('u64', fields.next_epoch_gas_price),
      nextEpochCommissionRate: decodeFromFields('u64', fields.next_epoch_commission_rate),
      extraFields: decodeFromFields(Bag.reified(), fields.extra_fields),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Validator {
    if (!isValidator(item.type)) {
      throw new Error('not a Validator type')
    }

    return Validator.reified().new({
      metadata: decodeFromFieldsWithTypes(ValidatorMetadata.reified(), item.fields.metadata),
      votingPower: decodeFromFieldsWithTypes('u64', item.fields.voting_power),
      operationCapId: decodeFromFieldsWithTypes(ID.reified(), item.fields.operation_cap_id),
      gasPrice: decodeFromFieldsWithTypes('u64', item.fields.gas_price),
      stakingPool: decodeFromFieldsWithTypes(StakingPool.reified(), item.fields.staking_pool),
      commissionRate: decodeFromFieldsWithTypes('u64', item.fields.commission_rate),
      nextEpochStake: decodeFromFieldsWithTypes('u64', item.fields.next_epoch_stake),
      nextEpochGasPrice: decodeFromFieldsWithTypes('u64', item.fields.next_epoch_gas_price),
      nextEpochCommissionRate: decodeFromFieldsWithTypes(
        'u64',
        item.fields.next_epoch_commission_rate
      ),
      extraFields: decodeFromFieldsWithTypes(Bag.reified(), item.fields.extra_fields),
    })
  }

  static fromBcs(data: Uint8Array): Validator {
    return Validator.fromFields(Validator.bcs.parse(data))
  }

  toJSONField() {
    return {
      metadata: this.metadata.toJSONField(),
      votingPower: this.votingPower.toString(),
      operationCapId: this.operationCapId,
      gasPrice: this.gasPrice.toString(),
      stakingPool: this.stakingPool.toJSONField(),
      commissionRate: this.commissionRate.toString(),
      nextEpochStake: this.nextEpochStake.toString(),
      nextEpochGasPrice: this.nextEpochGasPrice.toString(),
      nextEpochCommissionRate: this.nextEpochCommissionRate.toString(),
      extraFields: this.extraFields.toJSONField(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): Validator {
    return Validator.reified().new({
      metadata: decodeFromJSONField(ValidatorMetadata.reified(), field.metadata),
      votingPower: decodeFromJSONField('u64', field.votingPower),
      operationCapId: decodeFromJSONField(ID.reified(), field.operationCapId),
      gasPrice: decodeFromJSONField('u64', field.gasPrice),
      stakingPool: decodeFromJSONField(StakingPool.reified(), field.stakingPool),
      commissionRate: decodeFromJSONField('u64', field.commissionRate),
      nextEpochStake: decodeFromJSONField('u64', field.nextEpochStake),
      nextEpochGasPrice: decodeFromJSONField('u64', field.nextEpochGasPrice),
      nextEpochCommissionRate: decodeFromJSONField('u64', field.nextEpochCommissionRate),
      extraFields: decodeFromJSONField(Bag.reified(), field.extraFields),
    })
  }

  static fromJSON(json: Record<string, any>): Validator {
    if (json.$typeName !== Validator.$typeName) {
      throw new Error(
        `not a Validator json object: expected '${Validator.$typeName}' but got '${json.$typeName}'`
      )
    }

    return Validator.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): Validator {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isValidator(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Validator object`)
    }
    return Validator.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): Validator {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isValidator(data.bcs.type)) {
        throw new Error(`object at is not a Validator object`)
      }

      return Validator.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Validator.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<Validator> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching Validator object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isValidator(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a Validator object`)
    }

    return Validator.fromSuiObjectData(res.data)
  }
}

/* ============================== StakingRequestEvent =============================== */

export function isStakingRequestEvent(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x3::validator::StakingRequestEvent`
}

export interface StakingRequestEventFields {
  poolId: ToField<ID>
  validatorAddress: ToField<'address'>
  stakerAddress: ToField<'address'>
  epoch: ToField<'u64'>
  amount: ToField<'u64'>
}

export type StakingRequestEventReified = Reified<StakingRequestEvent, StakingRequestEventFields>

export class StakingRequestEvent implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x3::validator::StakingRequestEvent`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = StakingRequestEvent.$typeName
  readonly $fullTypeName: `0x3::validator::StakingRequestEvent`
  readonly $typeArgs: []
  readonly $isPhantom = StakingRequestEvent.$isPhantom

  readonly poolId: ToField<ID>
  readonly validatorAddress: ToField<'address'>
  readonly stakerAddress: ToField<'address'>
  readonly epoch: ToField<'u64'>
  readonly amount: ToField<'u64'>

  private constructor(typeArgs: [], fields: StakingRequestEventFields) {
    this.$fullTypeName = composeSuiType(
      StakingRequestEvent.$typeName,
      ...typeArgs
    ) as `0x3::validator::StakingRequestEvent`
    this.$typeArgs = typeArgs

    this.poolId = fields.poolId
    this.validatorAddress = fields.validatorAddress
    this.stakerAddress = fields.stakerAddress
    this.epoch = fields.epoch
    this.amount = fields.amount
  }

  static reified(): StakingRequestEventReified {
    const reifiedBcs = StakingRequestEvent.bcs
    return {
      typeName: StakingRequestEvent.$typeName,
      fullTypeName: composeSuiType(
        StakingRequestEvent.$typeName,
        ...[]
      ) as `0x3::validator::StakingRequestEvent`,
      typeArgs: [] as [],
      isPhantom: StakingRequestEvent.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => StakingRequestEvent.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => StakingRequestEvent.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => StakingRequestEvent.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => StakingRequestEvent.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => StakingRequestEvent.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => StakingRequestEvent.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => StakingRequestEvent.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => StakingRequestEvent.fetch(client, id),
      new: (fields: StakingRequestEventFields) => {
        return new StakingRequestEvent([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return StakingRequestEvent.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<StakingRequestEvent>> {
    return phantom(StakingRequestEvent.reified())
  }

  static get p() {
    return StakingRequestEvent.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('StakingRequestEvent', {
      pool_id: ID.bcs,
      validator_address: bcs.bytes(32).transform({
        input: (val: string) => fromHEX(val),
        output: (val: Uint8Array) => toHEX(val),
      }),
      staker_address: bcs.bytes(32).transform({
        input: (val: string) => fromHEX(val),
        output: (val: Uint8Array) => toHEX(val),
      }),
      epoch: bcs.u64(),
      amount: bcs.u64(),
    })
  }

  private static cachedBcs: ReturnType<typeof StakingRequestEvent.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof StakingRequestEvent.instantiateBcs> {
    if (!StakingRequestEvent.cachedBcs) {
      StakingRequestEvent.cachedBcs = StakingRequestEvent.instantiateBcs()
    }
    return StakingRequestEvent.cachedBcs
  }

  static fromFields(fields: Record<string, any>): StakingRequestEvent {
    return StakingRequestEvent.reified().new({
      poolId: decodeFromFields(ID.reified(), fields.pool_id),
      validatorAddress: decodeFromFields('address', fields.validator_address),
      stakerAddress: decodeFromFields('address', fields.staker_address),
      epoch: decodeFromFields('u64', fields.epoch),
      amount: decodeFromFields('u64', fields.amount),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): StakingRequestEvent {
    if (!isStakingRequestEvent(item.type)) {
      throw new Error('not a StakingRequestEvent type')
    }

    return StakingRequestEvent.reified().new({
      poolId: decodeFromFieldsWithTypes(ID.reified(), item.fields.pool_id),
      validatorAddress: decodeFromFieldsWithTypes('address', item.fields.validator_address),
      stakerAddress: decodeFromFieldsWithTypes('address', item.fields.staker_address),
      epoch: decodeFromFieldsWithTypes('u64', item.fields.epoch),
      amount: decodeFromFieldsWithTypes('u64', item.fields.amount),
    })
  }

  static fromBcs(data: Uint8Array): StakingRequestEvent {
    return StakingRequestEvent.fromFields(StakingRequestEvent.bcs.parse(data))
  }

  toJSONField() {
    return {
      poolId: this.poolId,
      validatorAddress: this.validatorAddress,
      stakerAddress: this.stakerAddress,
      epoch: this.epoch.toString(),
      amount: this.amount.toString(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): StakingRequestEvent {
    return StakingRequestEvent.reified().new({
      poolId: decodeFromJSONField(ID.reified(), field.poolId),
      validatorAddress: decodeFromJSONField('address', field.validatorAddress),
      stakerAddress: decodeFromJSONField('address', field.stakerAddress),
      epoch: decodeFromJSONField('u64', field.epoch),
      amount: decodeFromJSONField('u64', field.amount),
    })
  }

  static fromJSON(json: Record<string, any>): StakingRequestEvent {
    if (json.$typeName !== StakingRequestEvent.$typeName) {
      throw new Error(
        `not a StakingRequestEvent json object: expected '${StakingRequestEvent.$typeName}' but got '${json.$typeName}'`
      )
    }

    return StakingRequestEvent.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): StakingRequestEvent {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isStakingRequestEvent(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a StakingRequestEvent object`)
    }
    return StakingRequestEvent.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): StakingRequestEvent {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isStakingRequestEvent(data.bcs.type)) {
        throw new Error(`object at is not a StakingRequestEvent object`)
      }

      return StakingRequestEvent.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return StakingRequestEvent.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<StakingRequestEvent> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching StakingRequestEvent object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isStakingRequestEvent(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a StakingRequestEvent object`)
    }

    return StakingRequestEvent.fromSuiObjectData(res.data)
  }
}

/* ============================== UnstakingRequestEvent =============================== */

export function isUnstakingRequestEvent(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x3::validator::UnstakingRequestEvent`
}

export interface UnstakingRequestEventFields {
  poolId: ToField<ID>
  validatorAddress: ToField<'address'>
  stakerAddress: ToField<'address'>
  stakeActivationEpoch: ToField<'u64'>
  unstakingEpoch: ToField<'u64'>
  principalAmount: ToField<'u64'>
  rewardAmount: ToField<'u64'>
}

export type UnstakingRequestEventReified = Reified<
  UnstakingRequestEvent,
  UnstakingRequestEventFields
>

export class UnstakingRequestEvent implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x3::validator::UnstakingRequestEvent`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = UnstakingRequestEvent.$typeName
  readonly $fullTypeName: `0x3::validator::UnstakingRequestEvent`
  readonly $typeArgs: []
  readonly $isPhantom = UnstakingRequestEvent.$isPhantom

  readonly poolId: ToField<ID>
  readonly validatorAddress: ToField<'address'>
  readonly stakerAddress: ToField<'address'>
  readonly stakeActivationEpoch: ToField<'u64'>
  readonly unstakingEpoch: ToField<'u64'>
  readonly principalAmount: ToField<'u64'>
  readonly rewardAmount: ToField<'u64'>

  private constructor(typeArgs: [], fields: UnstakingRequestEventFields) {
    this.$fullTypeName = composeSuiType(
      UnstakingRequestEvent.$typeName,
      ...typeArgs
    ) as `0x3::validator::UnstakingRequestEvent`
    this.$typeArgs = typeArgs

    this.poolId = fields.poolId
    this.validatorAddress = fields.validatorAddress
    this.stakerAddress = fields.stakerAddress
    this.stakeActivationEpoch = fields.stakeActivationEpoch
    this.unstakingEpoch = fields.unstakingEpoch
    this.principalAmount = fields.principalAmount
    this.rewardAmount = fields.rewardAmount
  }

  static reified(): UnstakingRequestEventReified {
    const reifiedBcs = UnstakingRequestEvent.bcs
    return {
      typeName: UnstakingRequestEvent.$typeName,
      fullTypeName: composeSuiType(
        UnstakingRequestEvent.$typeName,
        ...[]
      ) as `0x3::validator::UnstakingRequestEvent`,
      typeArgs: [] as [],
      isPhantom: UnstakingRequestEvent.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => UnstakingRequestEvent.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        UnstakingRequestEvent.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => UnstakingRequestEvent.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => UnstakingRequestEvent.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => UnstakingRequestEvent.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) =>
        UnstakingRequestEvent.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) =>
        UnstakingRequestEvent.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => UnstakingRequestEvent.fetch(client, id),
      new: (fields: UnstakingRequestEventFields) => {
        return new UnstakingRequestEvent([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return UnstakingRequestEvent.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<UnstakingRequestEvent>> {
    return phantom(UnstakingRequestEvent.reified())
  }

  static get p() {
    return UnstakingRequestEvent.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('UnstakingRequestEvent', {
      pool_id: ID.bcs,
      validator_address: bcs.bytes(32).transform({
        input: (val: string) => fromHEX(val),
        output: (val: Uint8Array) => toHEX(val),
      }),
      staker_address: bcs.bytes(32).transform({
        input: (val: string) => fromHEX(val),
        output: (val: Uint8Array) => toHEX(val),
      }),
      stake_activation_epoch: bcs.u64(),
      unstaking_epoch: bcs.u64(),
      principal_amount: bcs.u64(),
      reward_amount: bcs.u64(),
    })
  }

  private static cachedBcs: ReturnType<typeof UnstakingRequestEvent.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof UnstakingRequestEvent.instantiateBcs> {
    if (!UnstakingRequestEvent.cachedBcs) {
      UnstakingRequestEvent.cachedBcs = UnstakingRequestEvent.instantiateBcs()
    }
    return UnstakingRequestEvent.cachedBcs
  }

  static fromFields(fields: Record<string, any>): UnstakingRequestEvent {
    return UnstakingRequestEvent.reified().new({
      poolId: decodeFromFields(ID.reified(), fields.pool_id),
      validatorAddress: decodeFromFields('address', fields.validator_address),
      stakerAddress: decodeFromFields('address', fields.staker_address),
      stakeActivationEpoch: decodeFromFields('u64', fields.stake_activation_epoch),
      unstakingEpoch: decodeFromFields('u64', fields.unstaking_epoch),
      principalAmount: decodeFromFields('u64', fields.principal_amount),
      rewardAmount: decodeFromFields('u64', fields.reward_amount),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): UnstakingRequestEvent {
    if (!isUnstakingRequestEvent(item.type)) {
      throw new Error('not a UnstakingRequestEvent type')
    }

    return UnstakingRequestEvent.reified().new({
      poolId: decodeFromFieldsWithTypes(ID.reified(), item.fields.pool_id),
      validatorAddress: decodeFromFieldsWithTypes('address', item.fields.validator_address),
      stakerAddress: decodeFromFieldsWithTypes('address', item.fields.staker_address),
      stakeActivationEpoch: decodeFromFieldsWithTypes('u64', item.fields.stake_activation_epoch),
      unstakingEpoch: decodeFromFieldsWithTypes('u64', item.fields.unstaking_epoch),
      principalAmount: decodeFromFieldsWithTypes('u64', item.fields.principal_amount),
      rewardAmount: decodeFromFieldsWithTypes('u64', item.fields.reward_amount),
    })
  }

  static fromBcs(data: Uint8Array): UnstakingRequestEvent {
    return UnstakingRequestEvent.fromFields(UnstakingRequestEvent.bcs.parse(data))
  }

  toJSONField() {
    return {
      poolId: this.poolId,
      validatorAddress: this.validatorAddress,
      stakerAddress: this.stakerAddress,
      stakeActivationEpoch: this.stakeActivationEpoch.toString(),
      unstakingEpoch: this.unstakingEpoch.toString(),
      principalAmount: this.principalAmount.toString(),
      rewardAmount: this.rewardAmount.toString(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): UnstakingRequestEvent {
    return UnstakingRequestEvent.reified().new({
      poolId: decodeFromJSONField(ID.reified(), field.poolId),
      validatorAddress: decodeFromJSONField('address', field.validatorAddress),
      stakerAddress: decodeFromJSONField('address', field.stakerAddress),
      stakeActivationEpoch: decodeFromJSONField('u64', field.stakeActivationEpoch),
      unstakingEpoch: decodeFromJSONField('u64', field.unstakingEpoch),
      principalAmount: decodeFromJSONField('u64', field.principalAmount),
      rewardAmount: decodeFromJSONField('u64', field.rewardAmount),
    })
  }

  static fromJSON(json: Record<string, any>): UnstakingRequestEvent {
    if (json.$typeName !== UnstakingRequestEvent.$typeName) {
      throw new Error(
        `not a UnstakingRequestEvent json object: expected '${UnstakingRequestEvent.$typeName}' but got '${json.$typeName}'`
      )
    }

    return UnstakingRequestEvent.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): UnstakingRequestEvent {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isUnstakingRequestEvent(content.type)) {
      throw new Error(
        `object at ${(content.fields as any).id} is not a UnstakingRequestEvent object`
      )
    }
    return UnstakingRequestEvent.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): UnstakingRequestEvent {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isUnstakingRequestEvent(data.bcs.type)) {
        throw new Error(`object at is not a UnstakingRequestEvent object`)
      }

      return UnstakingRequestEvent.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return UnstakingRequestEvent.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<UnstakingRequestEvent> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching UnstakingRequestEvent object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isUnstakingRequestEvent(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a UnstakingRequestEvent object`)
    }

    return UnstakingRequestEvent.fromSuiObjectData(res.data)
  }
}

/* ============================== ConvertingToFungibleStakedSuiEvent =============================== */

export function isConvertingToFungibleStakedSuiEvent(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x3::validator::ConvertingToFungibleStakedSuiEvent`
}

export interface ConvertingToFungibleStakedSuiEventFields {
  poolId: ToField<ID>
  stakeActivationEpoch: ToField<'u64'>
  stakedSuiPrincipalAmount: ToField<'u64'>
  fungibleStakedSuiAmount: ToField<'u64'>
}

export type ConvertingToFungibleStakedSuiEventReified = Reified<
  ConvertingToFungibleStakedSuiEvent,
  ConvertingToFungibleStakedSuiEventFields
>

export class ConvertingToFungibleStakedSuiEvent implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x3::validator::ConvertingToFungibleStakedSuiEvent`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = ConvertingToFungibleStakedSuiEvent.$typeName
  readonly $fullTypeName: `0x3::validator::ConvertingToFungibleStakedSuiEvent`
  readonly $typeArgs: []
  readonly $isPhantom = ConvertingToFungibleStakedSuiEvent.$isPhantom

  readonly poolId: ToField<ID>
  readonly stakeActivationEpoch: ToField<'u64'>
  readonly stakedSuiPrincipalAmount: ToField<'u64'>
  readonly fungibleStakedSuiAmount: ToField<'u64'>

  private constructor(typeArgs: [], fields: ConvertingToFungibleStakedSuiEventFields) {
    this.$fullTypeName = composeSuiType(
      ConvertingToFungibleStakedSuiEvent.$typeName,
      ...typeArgs
    ) as `0x3::validator::ConvertingToFungibleStakedSuiEvent`
    this.$typeArgs = typeArgs

    this.poolId = fields.poolId
    this.stakeActivationEpoch = fields.stakeActivationEpoch
    this.stakedSuiPrincipalAmount = fields.stakedSuiPrincipalAmount
    this.fungibleStakedSuiAmount = fields.fungibleStakedSuiAmount
  }

  static reified(): ConvertingToFungibleStakedSuiEventReified {
    const reifiedBcs = ConvertingToFungibleStakedSuiEvent.bcs
    return {
      typeName: ConvertingToFungibleStakedSuiEvent.$typeName,
      fullTypeName: composeSuiType(
        ConvertingToFungibleStakedSuiEvent.$typeName,
        ...[]
      ) as `0x3::validator::ConvertingToFungibleStakedSuiEvent`,
      typeArgs: [] as [],
      isPhantom: ConvertingToFungibleStakedSuiEvent.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) =>
        ConvertingToFungibleStakedSuiEvent.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        ConvertingToFungibleStakedSuiEvent.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) =>
        ConvertingToFungibleStakedSuiEvent.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => ConvertingToFungibleStakedSuiEvent.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => ConvertingToFungibleStakedSuiEvent.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) =>
        ConvertingToFungibleStakedSuiEvent.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) =>
        ConvertingToFungibleStakedSuiEvent.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) =>
        ConvertingToFungibleStakedSuiEvent.fetch(client, id),
      new: (fields: ConvertingToFungibleStakedSuiEventFields) => {
        return new ConvertingToFungibleStakedSuiEvent([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return ConvertingToFungibleStakedSuiEvent.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<ConvertingToFungibleStakedSuiEvent>> {
    return phantom(ConvertingToFungibleStakedSuiEvent.reified())
  }

  static get p() {
    return ConvertingToFungibleStakedSuiEvent.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('ConvertingToFungibleStakedSuiEvent', {
      pool_id: ID.bcs,
      stake_activation_epoch: bcs.u64(),
      staked_sui_principal_amount: bcs.u64(),
      fungible_staked_sui_amount: bcs.u64(),
    })
  }

  private static cachedBcs: ReturnType<
    typeof ConvertingToFungibleStakedSuiEvent.instantiateBcs
  > | null = null

  static get bcs(): ReturnType<typeof ConvertingToFungibleStakedSuiEvent.instantiateBcs> {
    if (!ConvertingToFungibleStakedSuiEvent.cachedBcs) {
      ConvertingToFungibleStakedSuiEvent.cachedBcs =
        ConvertingToFungibleStakedSuiEvent.instantiateBcs()
    }
    return ConvertingToFungibleStakedSuiEvent.cachedBcs
  }

  static fromFields(fields: Record<string, any>): ConvertingToFungibleStakedSuiEvent {
    return ConvertingToFungibleStakedSuiEvent.reified().new({
      poolId: decodeFromFields(ID.reified(), fields.pool_id),
      stakeActivationEpoch: decodeFromFields('u64', fields.stake_activation_epoch),
      stakedSuiPrincipalAmount: decodeFromFields('u64', fields.staked_sui_principal_amount),
      fungibleStakedSuiAmount: decodeFromFields('u64', fields.fungible_staked_sui_amount),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): ConvertingToFungibleStakedSuiEvent {
    if (!isConvertingToFungibleStakedSuiEvent(item.type)) {
      throw new Error('not a ConvertingToFungibleStakedSuiEvent type')
    }

    return ConvertingToFungibleStakedSuiEvent.reified().new({
      poolId: decodeFromFieldsWithTypes(ID.reified(), item.fields.pool_id),
      stakeActivationEpoch: decodeFromFieldsWithTypes('u64', item.fields.stake_activation_epoch),
      stakedSuiPrincipalAmount: decodeFromFieldsWithTypes(
        'u64',
        item.fields.staked_sui_principal_amount
      ),
      fungibleStakedSuiAmount: decodeFromFieldsWithTypes(
        'u64',
        item.fields.fungible_staked_sui_amount
      ),
    })
  }

  static fromBcs(data: Uint8Array): ConvertingToFungibleStakedSuiEvent {
    return ConvertingToFungibleStakedSuiEvent.fromFields(
      ConvertingToFungibleStakedSuiEvent.bcs.parse(data)
    )
  }

  toJSONField() {
    return {
      poolId: this.poolId,
      stakeActivationEpoch: this.stakeActivationEpoch.toString(),
      stakedSuiPrincipalAmount: this.stakedSuiPrincipalAmount.toString(),
      fungibleStakedSuiAmount: this.fungibleStakedSuiAmount.toString(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): ConvertingToFungibleStakedSuiEvent {
    return ConvertingToFungibleStakedSuiEvent.reified().new({
      poolId: decodeFromJSONField(ID.reified(), field.poolId),
      stakeActivationEpoch: decodeFromJSONField('u64', field.stakeActivationEpoch),
      stakedSuiPrincipalAmount: decodeFromJSONField('u64', field.stakedSuiPrincipalAmount),
      fungibleStakedSuiAmount: decodeFromJSONField('u64', field.fungibleStakedSuiAmount),
    })
  }

  static fromJSON(json: Record<string, any>): ConvertingToFungibleStakedSuiEvent {
    if (json.$typeName !== ConvertingToFungibleStakedSuiEvent.$typeName) {
      throw new Error(
        `not a ConvertingToFungibleStakedSuiEvent json object: expected '${ConvertingToFungibleStakedSuiEvent.$typeName}' but got '${json.$typeName}'`
      )
    }

    return ConvertingToFungibleStakedSuiEvent.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): ConvertingToFungibleStakedSuiEvent {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isConvertingToFungibleStakedSuiEvent(content.type)) {
      throw new Error(
        `object at ${(content.fields as any).id} is not a ConvertingToFungibleStakedSuiEvent object`
      )
    }
    return ConvertingToFungibleStakedSuiEvent.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): ConvertingToFungibleStakedSuiEvent {
    if (data.bcs) {
      if (
        data.bcs.dataType !== 'moveObject' ||
        !isConvertingToFungibleStakedSuiEvent(data.bcs.type)
      ) {
        throw new Error(`object at is not a ConvertingToFungibleStakedSuiEvent object`)
      }

      return ConvertingToFungibleStakedSuiEvent.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return ConvertingToFungibleStakedSuiEvent.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<ConvertingToFungibleStakedSuiEvent> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(
        `error fetching ConvertingToFungibleStakedSuiEvent object at id ${id}: ${res.error.code}`
      )
    }
    if (
      res.data?.bcs?.dataType !== 'moveObject' ||
      !isConvertingToFungibleStakedSuiEvent(res.data.bcs.type)
    ) {
      throw new Error(`object at id ${id} is not a ConvertingToFungibleStakedSuiEvent object`)
    }

    return ConvertingToFungibleStakedSuiEvent.fromSuiObjectData(res.data)
  }
}

/* ============================== RedeemingFungibleStakedSuiEvent =============================== */

export function isRedeemingFungibleStakedSuiEvent(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x3::validator::RedeemingFungibleStakedSuiEvent`
}

export interface RedeemingFungibleStakedSuiEventFields {
  poolId: ToField<ID>
  fungibleStakedSuiAmount: ToField<'u64'>
  suiAmount: ToField<'u64'>
}

export type RedeemingFungibleStakedSuiEventReified = Reified<
  RedeemingFungibleStakedSuiEvent,
  RedeemingFungibleStakedSuiEventFields
>

export class RedeemingFungibleStakedSuiEvent implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x3::validator::RedeemingFungibleStakedSuiEvent`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = RedeemingFungibleStakedSuiEvent.$typeName
  readonly $fullTypeName: `0x3::validator::RedeemingFungibleStakedSuiEvent`
  readonly $typeArgs: []
  readonly $isPhantom = RedeemingFungibleStakedSuiEvent.$isPhantom

  readonly poolId: ToField<ID>
  readonly fungibleStakedSuiAmount: ToField<'u64'>
  readonly suiAmount: ToField<'u64'>

  private constructor(typeArgs: [], fields: RedeemingFungibleStakedSuiEventFields) {
    this.$fullTypeName = composeSuiType(
      RedeemingFungibleStakedSuiEvent.$typeName,
      ...typeArgs
    ) as `0x3::validator::RedeemingFungibleStakedSuiEvent`
    this.$typeArgs = typeArgs

    this.poolId = fields.poolId
    this.fungibleStakedSuiAmount = fields.fungibleStakedSuiAmount
    this.suiAmount = fields.suiAmount
  }

  static reified(): RedeemingFungibleStakedSuiEventReified {
    const reifiedBcs = RedeemingFungibleStakedSuiEvent.bcs
    return {
      typeName: RedeemingFungibleStakedSuiEvent.$typeName,
      fullTypeName: composeSuiType(
        RedeemingFungibleStakedSuiEvent.$typeName,
        ...[]
      ) as `0x3::validator::RedeemingFungibleStakedSuiEvent`,
      typeArgs: [] as [],
      isPhantom: RedeemingFungibleStakedSuiEvent.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) =>
        RedeemingFungibleStakedSuiEvent.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        RedeemingFungibleStakedSuiEvent.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) =>
        RedeemingFungibleStakedSuiEvent.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => RedeemingFungibleStakedSuiEvent.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => RedeemingFungibleStakedSuiEvent.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) =>
        RedeemingFungibleStakedSuiEvent.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) =>
        RedeemingFungibleStakedSuiEvent.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) =>
        RedeemingFungibleStakedSuiEvent.fetch(client, id),
      new: (fields: RedeemingFungibleStakedSuiEventFields) => {
        return new RedeemingFungibleStakedSuiEvent([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return RedeemingFungibleStakedSuiEvent.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<RedeemingFungibleStakedSuiEvent>> {
    return phantom(RedeemingFungibleStakedSuiEvent.reified())
  }

  static get p() {
    return RedeemingFungibleStakedSuiEvent.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('RedeemingFungibleStakedSuiEvent', {
      pool_id: ID.bcs,
      fungible_staked_sui_amount: bcs.u64(),
      sui_amount: bcs.u64(),
    })
  }

  private static cachedBcs: ReturnType<
    typeof RedeemingFungibleStakedSuiEvent.instantiateBcs
  > | null = null

  static get bcs(): ReturnType<typeof RedeemingFungibleStakedSuiEvent.instantiateBcs> {
    if (!RedeemingFungibleStakedSuiEvent.cachedBcs) {
      RedeemingFungibleStakedSuiEvent.cachedBcs = RedeemingFungibleStakedSuiEvent.instantiateBcs()
    }
    return RedeemingFungibleStakedSuiEvent.cachedBcs
  }

  static fromFields(fields: Record<string, any>): RedeemingFungibleStakedSuiEvent {
    return RedeemingFungibleStakedSuiEvent.reified().new({
      poolId: decodeFromFields(ID.reified(), fields.pool_id),
      fungibleStakedSuiAmount: decodeFromFields('u64', fields.fungible_staked_sui_amount),
      suiAmount: decodeFromFields('u64', fields.sui_amount),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): RedeemingFungibleStakedSuiEvent {
    if (!isRedeemingFungibleStakedSuiEvent(item.type)) {
      throw new Error('not a RedeemingFungibleStakedSuiEvent type')
    }

    return RedeemingFungibleStakedSuiEvent.reified().new({
      poolId: decodeFromFieldsWithTypes(ID.reified(), item.fields.pool_id),
      fungibleStakedSuiAmount: decodeFromFieldsWithTypes(
        'u64',
        item.fields.fungible_staked_sui_amount
      ),
      suiAmount: decodeFromFieldsWithTypes('u64', item.fields.sui_amount),
    })
  }

  static fromBcs(data: Uint8Array): RedeemingFungibleStakedSuiEvent {
    return RedeemingFungibleStakedSuiEvent.fromFields(
      RedeemingFungibleStakedSuiEvent.bcs.parse(data)
    )
  }

  toJSONField() {
    return {
      poolId: this.poolId,
      fungibleStakedSuiAmount: this.fungibleStakedSuiAmount.toString(),
      suiAmount: this.suiAmount.toString(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): RedeemingFungibleStakedSuiEvent {
    return RedeemingFungibleStakedSuiEvent.reified().new({
      poolId: decodeFromJSONField(ID.reified(), field.poolId),
      fungibleStakedSuiAmount: decodeFromJSONField('u64', field.fungibleStakedSuiAmount),
      suiAmount: decodeFromJSONField('u64', field.suiAmount),
    })
  }

  static fromJSON(json: Record<string, any>): RedeemingFungibleStakedSuiEvent {
    if (json.$typeName !== RedeemingFungibleStakedSuiEvent.$typeName) {
      throw new Error(
        `not a RedeemingFungibleStakedSuiEvent json object: expected '${RedeemingFungibleStakedSuiEvent.$typeName}' but got '${json.$typeName}'`
      )
    }

    return RedeemingFungibleStakedSuiEvent.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): RedeemingFungibleStakedSuiEvent {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isRedeemingFungibleStakedSuiEvent(content.type)) {
      throw new Error(
        `object at ${(content.fields as any).id} is not a RedeemingFungibleStakedSuiEvent object`
      )
    }
    return RedeemingFungibleStakedSuiEvent.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): RedeemingFungibleStakedSuiEvent {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isRedeemingFungibleStakedSuiEvent(data.bcs.type)) {
        throw new Error(`object at is not a RedeemingFungibleStakedSuiEvent object`)
      }

      return RedeemingFungibleStakedSuiEvent.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return RedeemingFungibleStakedSuiEvent.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<RedeemingFungibleStakedSuiEvent> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(
        `error fetching RedeemingFungibleStakedSuiEvent object at id ${id}: ${res.error.code}`
      )
    }
    if (
      res.data?.bcs?.dataType !== 'moveObject' ||
      !isRedeemingFungibleStakedSuiEvent(res.data.bcs.type)
    ) {
      throw new Error(`object at id ${id} is not a RedeemingFungibleStakedSuiEvent object`)
    }

    return RedeemingFungibleStakedSuiEvent.fromSuiObjectData(res.data)
  }
}
