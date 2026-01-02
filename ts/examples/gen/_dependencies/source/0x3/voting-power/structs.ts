import {
  PhantomReified,
  Reified,
  StructClass,
  ToField,
  ToTypeStr,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  phantom,
} from '../../../../_framework/reified'
import {
  FieldsWithTypes,
  composeSuiType,
  compressSuiType,
  parseTypeName,
} from '../../../../_framework/util'
import { bcs } from '@mysten/sui/bcs'
import { SuiClient, SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromB64 } from '@mysten/sui/utils'

/* ============================== VotingPowerInfo =============================== */

export function isVotingPowerInfo(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x3::voting_power::VotingPowerInfo`
}

export interface VotingPowerInfoFields {
  validatorIndex: ToField<'u64'>
  votingPower: ToField<'u64'>
}

export type VotingPowerInfoReified = Reified<VotingPowerInfo, VotingPowerInfoFields>

export class VotingPowerInfo implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x3::voting_power::VotingPowerInfo`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = VotingPowerInfo.$typeName
  readonly $fullTypeName: `0x3::voting_power::VotingPowerInfo`
  readonly $typeArgs: []
  readonly $isPhantom = VotingPowerInfo.$isPhantom

  readonly validatorIndex: ToField<'u64'>
  readonly votingPower: ToField<'u64'>

  private constructor(typeArgs: [], fields: VotingPowerInfoFields) {
    this.$fullTypeName = composeSuiType(
      VotingPowerInfo.$typeName,
      ...typeArgs
    ) as `0x3::voting_power::VotingPowerInfo`
    this.$typeArgs = typeArgs

    this.validatorIndex = fields.validatorIndex
    this.votingPower = fields.votingPower
  }

  static reified(): VotingPowerInfoReified {
    const reifiedBcs = VotingPowerInfo.bcs
    return {
      typeName: VotingPowerInfo.$typeName,
      fullTypeName: composeSuiType(
        VotingPowerInfo.$typeName,
        ...[]
      ) as `0x3::voting_power::VotingPowerInfo`,
      typeArgs: [] as [],
      isPhantom: VotingPowerInfo.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => VotingPowerInfo.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => VotingPowerInfo.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => VotingPowerInfo.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => VotingPowerInfo.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => VotingPowerInfo.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => VotingPowerInfo.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => VotingPowerInfo.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => VotingPowerInfo.fetch(client, id),
      new: (fields: VotingPowerInfoFields) => {
        return new VotingPowerInfo([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return VotingPowerInfo.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<VotingPowerInfo>> {
    return phantom(VotingPowerInfo.reified())
  }

  static get p() {
    return VotingPowerInfo.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('VotingPowerInfo', {
      validator_index: bcs.u64(),
      voting_power: bcs.u64(),
    })
  }

  private static cachedBcs: ReturnType<typeof VotingPowerInfo.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof VotingPowerInfo.instantiateBcs> {
    if (!VotingPowerInfo.cachedBcs) {
      VotingPowerInfo.cachedBcs = VotingPowerInfo.instantiateBcs()
    }
    return VotingPowerInfo.cachedBcs
  }

  static fromFields(fields: Record<string, any>): VotingPowerInfo {
    return VotingPowerInfo.reified().new({
      validatorIndex: decodeFromFields('u64', fields.validator_index),
      votingPower: decodeFromFields('u64', fields.voting_power),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): VotingPowerInfo {
    if (!isVotingPowerInfo(item.type)) {
      throw new Error('not a VotingPowerInfo type')
    }

    return VotingPowerInfo.reified().new({
      validatorIndex: decodeFromFieldsWithTypes('u64', item.fields.validator_index),
      votingPower: decodeFromFieldsWithTypes('u64', item.fields.voting_power),
    })
  }

  static fromBcs(data: Uint8Array): VotingPowerInfo {
    return VotingPowerInfo.fromFields(VotingPowerInfo.bcs.parse(data))
  }

  toJSONField() {
    return {
      validatorIndex: this.validatorIndex.toString(),
      votingPower: this.votingPower.toString(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): VotingPowerInfo {
    return VotingPowerInfo.reified().new({
      validatorIndex: decodeFromJSONField('u64', field.validatorIndex),
      votingPower: decodeFromJSONField('u64', field.votingPower),
    })
  }

  static fromJSON(json: Record<string, any>): VotingPowerInfo {
    if (json.$typeName !== VotingPowerInfo.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return VotingPowerInfo.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): VotingPowerInfo {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isVotingPowerInfo(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a VotingPowerInfo object`)
    }
    return VotingPowerInfo.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): VotingPowerInfo {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isVotingPowerInfo(data.bcs.type)) {
        throw new Error(`object at is not a VotingPowerInfo object`)
      }

      return VotingPowerInfo.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return VotingPowerInfo.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<VotingPowerInfo> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching VotingPowerInfo object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isVotingPowerInfo(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a VotingPowerInfo object`)
    }

    return VotingPowerInfo.fromSuiObjectData(res.data)
  }
}

/* ============================== VotingPowerInfoV2 =============================== */

export function isVotingPowerInfoV2(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x3::voting_power::VotingPowerInfoV2`
}

export interface VotingPowerInfoV2Fields {
  validatorIndex: ToField<'u64'>
  votingPower: ToField<'u64'>
  stake: ToField<'u64'>
}

export type VotingPowerInfoV2Reified = Reified<VotingPowerInfoV2, VotingPowerInfoV2Fields>

export class VotingPowerInfoV2 implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x3::voting_power::VotingPowerInfoV2`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = VotingPowerInfoV2.$typeName
  readonly $fullTypeName: `0x3::voting_power::VotingPowerInfoV2`
  readonly $typeArgs: []
  readonly $isPhantom = VotingPowerInfoV2.$isPhantom

  readonly validatorIndex: ToField<'u64'>
  readonly votingPower: ToField<'u64'>
  readonly stake: ToField<'u64'>

  private constructor(typeArgs: [], fields: VotingPowerInfoV2Fields) {
    this.$fullTypeName = composeSuiType(
      VotingPowerInfoV2.$typeName,
      ...typeArgs
    ) as `0x3::voting_power::VotingPowerInfoV2`
    this.$typeArgs = typeArgs

    this.validatorIndex = fields.validatorIndex
    this.votingPower = fields.votingPower
    this.stake = fields.stake
  }

  static reified(): VotingPowerInfoV2Reified {
    const reifiedBcs = VotingPowerInfoV2.bcs
    return {
      typeName: VotingPowerInfoV2.$typeName,
      fullTypeName: composeSuiType(
        VotingPowerInfoV2.$typeName,
        ...[]
      ) as `0x3::voting_power::VotingPowerInfoV2`,
      typeArgs: [] as [],
      isPhantom: VotingPowerInfoV2.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => VotingPowerInfoV2.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => VotingPowerInfoV2.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => VotingPowerInfoV2.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => VotingPowerInfoV2.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => VotingPowerInfoV2.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => VotingPowerInfoV2.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => VotingPowerInfoV2.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => VotingPowerInfoV2.fetch(client, id),
      new: (fields: VotingPowerInfoV2Fields) => {
        return new VotingPowerInfoV2([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return VotingPowerInfoV2.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<VotingPowerInfoV2>> {
    return phantom(VotingPowerInfoV2.reified())
  }

  static get p() {
    return VotingPowerInfoV2.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('VotingPowerInfoV2', {
      validator_index: bcs.u64(),
      voting_power: bcs.u64(),
      stake: bcs.u64(),
    })
  }

  private static cachedBcs: ReturnType<typeof VotingPowerInfoV2.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof VotingPowerInfoV2.instantiateBcs> {
    if (!VotingPowerInfoV2.cachedBcs) {
      VotingPowerInfoV2.cachedBcs = VotingPowerInfoV2.instantiateBcs()
    }
    return VotingPowerInfoV2.cachedBcs
  }

  static fromFields(fields: Record<string, any>): VotingPowerInfoV2 {
    return VotingPowerInfoV2.reified().new({
      validatorIndex: decodeFromFields('u64', fields.validator_index),
      votingPower: decodeFromFields('u64', fields.voting_power),
      stake: decodeFromFields('u64', fields.stake),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): VotingPowerInfoV2 {
    if (!isVotingPowerInfoV2(item.type)) {
      throw new Error('not a VotingPowerInfoV2 type')
    }

    return VotingPowerInfoV2.reified().new({
      validatorIndex: decodeFromFieldsWithTypes('u64', item.fields.validator_index),
      votingPower: decodeFromFieldsWithTypes('u64', item.fields.voting_power),
      stake: decodeFromFieldsWithTypes('u64', item.fields.stake),
    })
  }

  static fromBcs(data: Uint8Array): VotingPowerInfoV2 {
    return VotingPowerInfoV2.fromFields(VotingPowerInfoV2.bcs.parse(data))
  }

  toJSONField() {
    return {
      validatorIndex: this.validatorIndex.toString(),
      votingPower: this.votingPower.toString(),
      stake: this.stake.toString(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): VotingPowerInfoV2 {
    return VotingPowerInfoV2.reified().new({
      validatorIndex: decodeFromJSONField('u64', field.validatorIndex),
      votingPower: decodeFromJSONField('u64', field.votingPower),
      stake: decodeFromJSONField('u64', field.stake),
    })
  }

  static fromJSON(json: Record<string, any>): VotingPowerInfoV2 {
    if (json.$typeName !== VotingPowerInfoV2.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return VotingPowerInfoV2.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): VotingPowerInfoV2 {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isVotingPowerInfoV2(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a VotingPowerInfoV2 object`)
    }
    return VotingPowerInfoV2.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): VotingPowerInfoV2 {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isVotingPowerInfoV2(data.bcs.type)) {
        throw new Error(`object at is not a VotingPowerInfoV2 object`)
      }

      return VotingPowerInfoV2.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return VotingPowerInfoV2.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<VotingPowerInfoV2> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching VotingPowerInfoV2 object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isVotingPowerInfoV2(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a VotingPowerInfoV2 object`)
    }

    return VotingPowerInfoV2.fromSuiObjectData(res.data)
  }
}
