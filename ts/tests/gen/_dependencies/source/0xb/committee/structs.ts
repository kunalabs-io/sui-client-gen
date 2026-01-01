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
} from '../../../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../../../_framework/util'
import { Vector } from '../../../../_framework/vector'
import { VecMap } from '../../../../sui/vec-map/structs'
import { bcs } from '@mysten/sui/bcs'
import { SuiClient, SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromB64, fromHEX, toHEX } from '@mysten/sui/utils'

/* ============================== BlocklistValidatorEvent =============================== */

export function isBlocklistValidatorEvent(type: string): boolean {
  type = compressSuiType(type)
  return type === `0xb::committee::BlocklistValidatorEvent`
}

export interface BlocklistValidatorEventFields {
  blocklisted: ToField<'bool'>
  publicKeys: ToField<Vector<Vector<'u8'>>>
}

export type BlocklistValidatorEventReified = Reified<
  BlocklistValidatorEvent,
  BlocklistValidatorEventFields
>

export class BlocklistValidatorEvent implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0xb::committee::BlocklistValidatorEvent`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = BlocklistValidatorEvent.$typeName
  readonly $fullTypeName: `0xb::committee::BlocklistValidatorEvent`
  readonly $typeArgs: []
  readonly $isPhantom = BlocklistValidatorEvent.$isPhantom

  readonly blocklisted: ToField<'bool'>
  readonly publicKeys: ToField<Vector<Vector<'u8'>>>

  private constructor(typeArgs: [], fields: BlocklistValidatorEventFields) {
    this.$fullTypeName = composeSuiType(
      BlocklistValidatorEvent.$typeName,
      ...typeArgs
    ) as `0xb::committee::BlocklistValidatorEvent`
    this.$typeArgs = typeArgs

    this.blocklisted = fields.blocklisted
    this.publicKeys = fields.publicKeys
  }

  static reified(): BlocklistValidatorEventReified {
    const reifiedBcs = BlocklistValidatorEvent.bcs
    return {
      typeName: BlocklistValidatorEvent.$typeName,
      fullTypeName: composeSuiType(
        BlocklistValidatorEvent.$typeName,
        ...[]
      ) as `0xb::committee::BlocklistValidatorEvent`,
      typeArgs: [] as [],
      isPhantom: BlocklistValidatorEvent.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => BlocklistValidatorEvent.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        BlocklistValidatorEvent.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => BlocklistValidatorEvent.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => BlocklistValidatorEvent.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => BlocklistValidatorEvent.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) =>
        BlocklistValidatorEvent.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) =>
        BlocklistValidatorEvent.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => BlocklistValidatorEvent.fetch(client, id),
      new: (fields: BlocklistValidatorEventFields) => {
        return new BlocklistValidatorEvent([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return BlocklistValidatorEvent.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<BlocklistValidatorEvent>> {
    return phantom(BlocklistValidatorEvent.reified())
  }

  static get p() {
    return BlocklistValidatorEvent.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('BlocklistValidatorEvent', {
      blocklisted: bcs.bool(),
      public_keys: bcs.vector(bcs.vector(bcs.u8())),
    })
  }

  private static cachedBcs: ReturnType<typeof BlocklistValidatorEvent.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof BlocklistValidatorEvent.instantiateBcs> {
    if (!BlocklistValidatorEvent.cachedBcs) {
      BlocklistValidatorEvent.cachedBcs = BlocklistValidatorEvent.instantiateBcs()
    }
    return BlocklistValidatorEvent.cachedBcs
  }

  static fromFields(fields: Record<string, any>): BlocklistValidatorEvent {
    return BlocklistValidatorEvent.reified().new({
      blocklisted: decodeFromFields('bool', fields.blocklisted),
      publicKeys: decodeFromFields(reified.vector(reified.vector('u8')), fields.public_keys),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): BlocklistValidatorEvent {
    if (!isBlocklistValidatorEvent(item.type)) {
      throw new Error('not a BlocklistValidatorEvent type')
    }

    return BlocklistValidatorEvent.reified().new({
      blocklisted: decodeFromFieldsWithTypes('bool', item.fields.blocklisted),
      publicKeys: decodeFromFieldsWithTypes(
        reified.vector(reified.vector('u8')),
        item.fields.public_keys
      ),
    })
  }

  static fromBcs(data: Uint8Array): BlocklistValidatorEvent {
    return BlocklistValidatorEvent.fromFields(BlocklistValidatorEvent.bcs.parse(data))
  }

  toJSONField() {
    return {
      blocklisted: this.blocklisted,
      publicKeys: fieldToJSON<Vector<Vector<'u8'>>>(`vector<vector<u8>>`, this.publicKeys),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): BlocklistValidatorEvent {
    return BlocklistValidatorEvent.reified().new({
      blocklisted: decodeFromJSONField('bool', field.blocklisted),
      publicKeys: decodeFromJSONField(reified.vector(reified.vector('u8')), field.publicKeys),
    })
  }

  static fromJSON(json: Record<string, any>): BlocklistValidatorEvent {
    if (json.$typeName !== BlocklistValidatorEvent.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return BlocklistValidatorEvent.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): BlocklistValidatorEvent {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isBlocklistValidatorEvent(content.type)) {
      throw new Error(
        `object at ${(content.fields as any).id} is not a BlocklistValidatorEvent object`
      )
    }
    return BlocklistValidatorEvent.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): BlocklistValidatorEvent {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isBlocklistValidatorEvent(data.bcs.type)) {
        throw new Error(`object at is not a BlocklistValidatorEvent object`)
      }

      return BlocklistValidatorEvent.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return BlocklistValidatorEvent.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<BlocklistValidatorEvent> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(
        `error fetching BlocklistValidatorEvent object at id ${id}: ${res.error.code}`
      )
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isBlocklistValidatorEvent(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a BlocklistValidatorEvent object`)
    }

    return BlocklistValidatorEvent.fromSuiObjectData(res.data)
  }
}

/* ============================== BridgeCommittee =============================== */

export function isBridgeCommittee(type: string): boolean {
  type = compressSuiType(type)
  return type === `0xb::committee::BridgeCommittee`
}

export interface BridgeCommitteeFields {
  members: ToField<VecMap<Vector<'u8'>, CommitteeMember>>
  memberRegistrations: ToField<VecMap<'address', CommitteeMemberRegistration>>
  lastCommitteeUpdateEpoch: ToField<'u64'>
}

export type BridgeCommitteeReified = Reified<BridgeCommittee, BridgeCommitteeFields>

export class BridgeCommittee implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0xb::committee::BridgeCommittee`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = BridgeCommittee.$typeName
  readonly $fullTypeName: `0xb::committee::BridgeCommittee`
  readonly $typeArgs: []
  readonly $isPhantom = BridgeCommittee.$isPhantom

  readonly members: ToField<VecMap<Vector<'u8'>, CommitteeMember>>
  readonly memberRegistrations: ToField<VecMap<'address', CommitteeMemberRegistration>>
  readonly lastCommitteeUpdateEpoch: ToField<'u64'>

  private constructor(typeArgs: [], fields: BridgeCommitteeFields) {
    this.$fullTypeName = composeSuiType(
      BridgeCommittee.$typeName,
      ...typeArgs
    ) as `0xb::committee::BridgeCommittee`
    this.$typeArgs = typeArgs

    this.members = fields.members
    this.memberRegistrations = fields.memberRegistrations
    this.lastCommitteeUpdateEpoch = fields.lastCommitteeUpdateEpoch
  }

  static reified(): BridgeCommitteeReified {
    const reifiedBcs = BridgeCommittee.bcs
    return {
      typeName: BridgeCommittee.$typeName,
      fullTypeName: composeSuiType(
        BridgeCommittee.$typeName,
        ...[]
      ) as `0xb::committee::BridgeCommittee`,
      typeArgs: [] as [],
      isPhantom: BridgeCommittee.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => BridgeCommittee.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => BridgeCommittee.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => BridgeCommittee.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => BridgeCommittee.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => BridgeCommittee.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => BridgeCommittee.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => BridgeCommittee.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => BridgeCommittee.fetch(client, id),
      new: (fields: BridgeCommitteeFields) => {
        return new BridgeCommittee([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return BridgeCommittee.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<BridgeCommittee>> {
    return phantom(BridgeCommittee.reified())
  }

  static get p() {
    return BridgeCommittee.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('BridgeCommittee', {
      members: VecMap.bcs(bcs.vector(bcs.u8()), CommitteeMember.bcs),
      member_registrations: VecMap.bcs(
        bcs.bytes(32).transform({
          input: (val: string) => fromHEX(val),
          output: (val: Uint8Array) => toHEX(val),
        }),
        CommitteeMemberRegistration.bcs
      ),
      last_committee_update_epoch: bcs.u64(),
    })
  }

  private static cachedBcs: ReturnType<typeof BridgeCommittee.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof BridgeCommittee.instantiateBcs> {
    if (!BridgeCommittee.cachedBcs) {
      BridgeCommittee.cachedBcs = BridgeCommittee.instantiateBcs()
    }
    return BridgeCommittee.cachedBcs
  }

  static fromFields(fields: Record<string, any>): BridgeCommittee {
    return BridgeCommittee.reified().new({
      members: decodeFromFields(
        VecMap.reified(reified.vector('u8'), CommitteeMember.reified()),
        fields.members
      ),
      memberRegistrations: decodeFromFields(
        VecMap.reified('address', CommitteeMemberRegistration.reified()),
        fields.member_registrations
      ),
      lastCommitteeUpdateEpoch: decodeFromFields('u64', fields.last_committee_update_epoch),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): BridgeCommittee {
    if (!isBridgeCommittee(item.type)) {
      throw new Error('not a BridgeCommittee type')
    }

    return BridgeCommittee.reified().new({
      members: decodeFromFieldsWithTypes(
        VecMap.reified(reified.vector('u8'), CommitteeMember.reified()),
        item.fields.members
      ),
      memberRegistrations: decodeFromFieldsWithTypes(
        VecMap.reified('address', CommitteeMemberRegistration.reified()),
        item.fields.member_registrations
      ),
      lastCommitteeUpdateEpoch: decodeFromFieldsWithTypes(
        'u64',
        item.fields.last_committee_update_epoch
      ),
    })
  }

  static fromBcs(data: Uint8Array): BridgeCommittee {
    return BridgeCommittee.fromFields(BridgeCommittee.bcs.parse(data))
  }

  toJSONField() {
    return {
      members: this.members.toJSONField(),
      memberRegistrations: this.memberRegistrations.toJSONField(),
      lastCommitteeUpdateEpoch: this.lastCommitteeUpdateEpoch.toString(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): BridgeCommittee {
    return BridgeCommittee.reified().new({
      members: decodeFromJSONField(
        VecMap.reified(reified.vector('u8'), CommitteeMember.reified()),
        field.members
      ),
      memberRegistrations: decodeFromJSONField(
        VecMap.reified('address', CommitteeMemberRegistration.reified()),
        field.memberRegistrations
      ),
      lastCommitteeUpdateEpoch: decodeFromJSONField('u64', field.lastCommitteeUpdateEpoch),
    })
  }

  static fromJSON(json: Record<string, any>): BridgeCommittee {
    if (json.$typeName !== BridgeCommittee.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return BridgeCommittee.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): BridgeCommittee {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isBridgeCommittee(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a BridgeCommittee object`)
    }
    return BridgeCommittee.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): BridgeCommittee {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isBridgeCommittee(data.bcs.type)) {
        throw new Error(`object at is not a BridgeCommittee object`)
      }

      return BridgeCommittee.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return BridgeCommittee.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<BridgeCommittee> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching BridgeCommittee object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isBridgeCommittee(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a BridgeCommittee object`)
    }

    return BridgeCommittee.fromSuiObjectData(res.data)
  }
}

/* ============================== CommitteeUpdateEvent =============================== */

export function isCommitteeUpdateEvent(type: string): boolean {
  type = compressSuiType(type)
  return type === `0xb::committee::CommitteeUpdateEvent`
}

export interface CommitteeUpdateEventFields {
  members: ToField<VecMap<Vector<'u8'>, CommitteeMember>>
  stakeParticipationPercentage: ToField<'u64'>
}

export type CommitteeUpdateEventReified = Reified<CommitteeUpdateEvent, CommitteeUpdateEventFields>

export class CommitteeUpdateEvent implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0xb::committee::CommitteeUpdateEvent`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = CommitteeUpdateEvent.$typeName
  readonly $fullTypeName: `0xb::committee::CommitteeUpdateEvent`
  readonly $typeArgs: []
  readonly $isPhantom = CommitteeUpdateEvent.$isPhantom

  readonly members: ToField<VecMap<Vector<'u8'>, CommitteeMember>>
  readonly stakeParticipationPercentage: ToField<'u64'>

  private constructor(typeArgs: [], fields: CommitteeUpdateEventFields) {
    this.$fullTypeName = composeSuiType(
      CommitteeUpdateEvent.$typeName,
      ...typeArgs
    ) as `0xb::committee::CommitteeUpdateEvent`
    this.$typeArgs = typeArgs

    this.members = fields.members
    this.stakeParticipationPercentage = fields.stakeParticipationPercentage
  }

  static reified(): CommitteeUpdateEventReified {
    const reifiedBcs = CommitteeUpdateEvent.bcs
    return {
      typeName: CommitteeUpdateEvent.$typeName,
      fullTypeName: composeSuiType(
        CommitteeUpdateEvent.$typeName,
        ...[]
      ) as `0xb::committee::CommitteeUpdateEvent`,
      typeArgs: [] as [],
      isPhantom: CommitteeUpdateEvent.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => CommitteeUpdateEvent.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        CommitteeUpdateEvent.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => CommitteeUpdateEvent.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => CommitteeUpdateEvent.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => CommitteeUpdateEvent.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) =>
        CommitteeUpdateEvent.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) =>
        CommitteeUpdateEvent.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => CommitteeUpdateEvent.fetch(client, id),
      new: (fields: CommitteeUpdateEventFields) => {
        return new CommitteeUpdateEvent([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return CommitteeUpdateEvent.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<CommitteeUpdateEvent>> {
    return phantom(CommitteeUpdateEvent.reified())
  }

  static get p() {
    return CommitteeUpdateEvent.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('CommitteeUpdateEvent', {
      members: VecMap.bcs(bcs.vector(bcs.u8()), CommitteeMember.bcs),
      stake_participation_percentage: bcs.u64(),
    })
  }

  private static cachedBcs: ReturnType<typeof CommitteeUpdateEvent.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof CommitteeUpdateEvent.instantiateBcs> {
    if (!CommitteeUpdateEvent.cachedBcs) {
      CommitteeUpdateEvent.cachedBcs = CommitteeUpdateEvent.instantiateBcs()
    }
    return CommitteeUpdateEvent.cachedBcs
  }

  static fromFields(fields: Record<string, any>): CommitteeUpdateEvent {
    return CommitteeUpdateEvent.reified().new({
      members: decodeFromFields(
        VecMap.reified(reified.vector('u8'), CommitteeMember.reified()),
        fields.members
      ),
      stakeParticipationPercentage: decodeFromFields('u64', fields.stake_participation_percentage),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): CommitteeUpdateEvent {
    if (!isCommitteeUpdateEvent(item.type)) {
      throw new Error('not a CommitteeUpdateEvent type')
    }

    return CommitteeUpdateEvent.reified().new({
      members: decodeFromFieldsWithTypes(
        VecMap.reified(reified.vector('u8'), CommitteeMember.reified()),
        item.fields.members
      ),
      stakeParticipationPercentage: decodeFromFieldsWithTypes(
        'u64',
        item.fields.stake_participation_percentage
      ),
    })
  }

  static fromBcs(data: Uint8Array): CommitteeUpdateEvent {
    return CommitteeUpdateEvent.fromFields(CommitteeUpdateEvent.bcs.parse(data))
  }

  toJSONField() {
    return {
      members: this.members.toJSONField(),
      stakeParticipationPercentage: this.stakeParticipationPercentage.toString(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): CommitteeUpdateEvent {
    return CommitteeUpdateEvent.reified().new({
      members: decodeFromJSONField(
        VecMap.reified(reified.vector('u8'), CommitteeMember.reified()),
        field.members
      ),
      stakeParticipationPercentage: decodeFromJSONField('u64', field.stakeParticipationPercentage),
    })
  }

  static fromJSON(json: Record<string, any>): CommitteeUpdateEvent {
    if (json.$typeName !== CommitteeUpdateEvent.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return CommitteeUpdateEvent.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): CommitteeUpdateEvent {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isCommitteeUpdateEvent(content.type)) {
      throw new Error(
        `object at ${(content.fields as any).id} is not a CommitteeUpdateEvent object`
      )
    }
    return CommitteeUpdateEvent.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): CommitteeUpdateEvent {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isCommitteeUpdateEvent(data.bcs.type)) {
        throw new Error(`object at is not a CommitteeUpdateEvent object`)
      }

      return CommitteeUpdateEvent.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return CommitteeUpdateEvent.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<CommitteeUpdateEvent> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching CommitteeUpdateEvent object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isCommitteeUpdateEvent(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a CommitteeUpdateEvent object`)
    }

    return CommitteeUpdateEvent.fromSuiObjectData(res.data)
  }
}

/* ============================== CommitteeMemberUrlUpdateEvent =============================== */

export function isCommitteeMemberUrlUpdateEvent(type: string): boolean {
  type = compressSuiType(type)
  return type === `0xb::committee::CommitteeMemberUrlUpdateEvent`
}

export interface CommitteeMemberUrlUpdateEventFields {
  member: ToField<Vector<'u8'>>
  newUrl: ToField<Vector<'u8'>>
}

export type CommitteeMemberUrlUpdateEventReified = Reified<
  CommitteeMemberUrlUpdateEvent,
  CommitteeMemberUrlUpdateEventFields
>

export class CommitteeMemberUrlUpdateEvent implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0xb::committee::CommitteeMemberUrlUpdateEvent`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = CommitteeMemberUrlUpdateEvent.$typeName
  readonly $fullTypeName: `0xb::committee::CommitteeMemberUrlUpdateEvent`
  readonly $typeArgs: []
  readonly $isPhantom = CommitteeMemberUrlUpdateEvent.$isPhantom

  readonly member: ToField<Vector<'u8'>>
  readonly newUrl: ToField<Vector<'u8'>>

  private constructor(typeArgs: [], fields: CommitteeMemberUrlUpdateEventFields) {
    this.$fullTypeName = composeSuiType(
      CommitteeMemberUrlUpdateEvent.$typeName,
      ...typeArgs
    ) as `0xb::committee::CommitteeMemberUrlUpdateEvent`
    this.$typeArgs = typeArgs

    this.member = fields.member
    this.newUrl = fields.newUrl
  }

  static reified(): CommitteeMemberUrlUpdateEventReified {
    const reifiedBcs = CommitteeMemberUrlUpdateEvent.bcs
    return {
      typeName: CommitteeMemberUrlUpdateEvent.$typeName,
      fullTypeName: composeSuiType(
        CommitteeMemberUrlUpdateEvent.$typeName,
        ...[]
      ) as `0xb::committee::CommitteeMemberUrlUpdateEvent`,
      typeArgs: [] as [],
      isPhantom: CommitteeMemberUrlUpdateEvent.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => CommitteeMemberUrlUpdateEvent.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        CommitteeMemberUrlUpdateEvent.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) =>
        CommitteeMemberUrlUpdateEvent.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => CommitteeMemberUrlUpdateEvent.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => CommitteeMemberUrlUpdateEvent.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) =>
        CommitteeMemberUrlUpdateEvent.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) =>
        CommitteeMemberUrlUpdateEvent.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) =>
        CommitteeMemberUrlUpdateEvent.fetch(client, id),
      new: (fields: CommitteeMemberUrlUpdateEventFields) => {
        return new CommitteeMemberUrlUpdateEvent([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return CommitteeMemberUrlUpdateEvent.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<CommitteeMemberUrlUpdateEvent>> {
    return phantom(CommitteeMemberUrlUpdateEvent.reified())
  }

  static get p() {
    return CommitteeMemberUrlUpdateEvent.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('CommitteeMemberUrlUpdateEvent', {
      member: bcs.vector(bcs.u8()),
      new_url: bcs.vector(bcs.u8()),
    })
  }

  private static cachedBcs: ReturnType<typeof CommitteeMemberUrlUpdateEvent.instantiateBcs> | null =
    null

  static get bcs(): ReturnType<typeof CommitteeMemberUrlUpdateEvent.instantiateBcs> {
    if (!CommitteeMemberUrlUpdateEvent.cachedBcs) {
      CommitteeMemberUrlUpdateEvent.cachedBcs = CommitteeMemberUrlUpdateEvent.instantiateBcs()
    }
    return CommitteeMemberUrlUpdateEvent.cachedBcs
  }

  static fromFields(fields: Record<string, any>): CommitteeMemberUrlUpdateEvent {
    return CommitteeMemberUrlUpdateEvent.reified().new({
      member: decodeFromFields(reified.vector('u8'), fields.member),
      newUrl: decodeFromFields(reified.vector('u8'), fields.new_url),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): CommitteeMemberUrlUpdateEvent {
    if (!isCommitteeMemberUrlUpdateEvent(item.type)) {
      throw new Error('not a CommitteeMemberUrlUpdateEvent type')
    }

    return CommitteeMemberUrlUpdateEvent.reified().new({
      member: decodeFromFieldsWithTypes(reified.vector('u8'), item.fields.member),
      newUrl: decodeFromFieldsWithTypes(reified.vector('u8'), item.fields.new_url),
    })
  }

  static fromBcs(data: Uint8Array): CommitteeMemberUrlUpdateEvent {
    return CommitteeMemberUrlUpdateEvent.fromFields(CommitteeMemberUrlUpdateEvent.bcs.parse(data))
  }

  toJSONField() {
    return {
      member: fieldToJSON<Vector<'u8'>>(`vector<u8>`, this.member),
      newUrl: fieldToJSON<Vector<'u8'>>(`vector<u8>`, this.newUrl),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): CommitteeMemberUrlUpdateEvent {
    return CommitteeMemberUrlUpdateEvent.reified().new({
      member: decodeFromJSONField(reified.vector('u8'), field.member),
      newUrl: decodeFromJSONField(reified.vector('u8'), field.newUrl),
    })
  }

  static fromJSON(json: Record<string, any>): CommitteeMemberUrlUpdateEvent {
    if (json.$typeName !== CommitteeMemberUrlUpdateEvent.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return CommitteeMemberUrlUpdateEvent.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): CommitteeMemberUrlUpdateEvent {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isCommitteeMemberUrlUpdateEvent(content.type)) {
      throw new Error(
        `object at ${(content.fields as any).id} is not a CommitteeMemberUrlUpdateEvent object`
      )
    }
    return CommitteeMemberUrlUpdateEvent.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): CommitteeMemberUrlUpdateEvent {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isCommitteeMemberUrlUpdateEvent(data.bcs.type)) {
        throw new Error(`object at is not a CommitteeMemberUrlUpdateEvent object`)
      }

      return CommitteeMemberUrlUpdateEvent.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return CommitteeMemberUrlUpdateEvent.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<CommitteeMemberUrlUpdateEvent> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(
        `error fetching CommitteeMemberUrlUpdateEvent object at id ${id}: ${res.error.code}`
      )
    }
    if (
      res.data?.bcs?.dataType !== 'moveObject' ||
      !isCommitteeMemberUrlUpdateEvent(res.data.bcs.type)
    ) {
      throw new Error(`object at id ${id} is not a CommitteeMemberUrlUpdateEvent object`)
    }

    return CommitteeMemberUrlUpdateEvent.fromSuiObjectData(res.data)
  }
}

/* ============================== CommitteeMember =============================== */

export function isCommitteeMember(type: string): boolean {
  type = compressSuiType(type)
  return type === `0xb::committee::CommitteeMember`
}

export interface CommitteeMemberFields {
  suiAddress: ToField<'address'>
  bridgePubkeyBytes: ToField<Vector<'u8'>>
  votingPower: ToField<'u64'>
  httpRestUrl: ToField<Vector<'u8'>>
  blocklisted: ToField<'bool'>
}

export type CommitteeMemberReified = Reified<CommitteeMember, CommitteeMemberFields>

export class CommitteeMember implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0xb::committee::CommitteeMember`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = CommitteeMember.$typeName
  readonly $fullTypeName: `0xb::committee::CommitteeMember`
  readonly $typeArgs: []
  readonly $isPhantom = CommitteeMember.$isPhantom

  readonly suiAddress: ToField<'address'>
  readonly bridgePubkeyBytes: ToField<Vector<'u8'>>
  readonly votingPower: ToField<'u64'>
  readonly httpRestUrl: ToField<Vector<'u8'>>
  readonly blocklisted: ToField<'bool'>

  private constructor(typeArgs: [], fields: CommitteeMemberFields) {
    this.$fullTypeName = composeSuiType(
      CommitteeMember.$typeName,
      ...typeArgs
    ) as `0xb::committee::CommitteeMember`
    this.$typeArgs = typeArgs

    this.suiAddress = fields.suiAddress
    this.bridgePubkeyBytes = fields.bridgePubkeyBytes
    this.votingPower = fields.votingPower
    this.httpRestUrl = fields.httpRestUrl
    this.blocklisted = fields.blocklisted
  }

  static reified(): CommitteeMemberReified {
    const reifiedBcs = CommitteeMember.bcs
    return {
      typeName: CommitteeMember.$typeName,
      fullTypeName: composeSuiType(
        CommitteeMember.$typeName,
        ...[]
      ) as `0xb::committee::CommitteeMember`,
      typeArgs: [] as [],
      isPhantom: CommitteeMember.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => CommitteeMember.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => CommitteeMember.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => CommitteeMember.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => CommitteeMember.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => CommitteeMember.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => CommitteeMember.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => CommitteeMember.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => CommitteeMember.fetch(client, id),
      new: (fields: CommitteeMemberFields) => {
        return new CommitteeMember([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return CommitteeMember.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<CommitteeMember>> {
    return phantom(CommitteeMember.reified())
  }

  static get p() {
    return CommitteeMember.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('CommitteeMember', {
      sui_address: bcs.bytes(32).transform({
        input: (val: string) => fromHEX(val),
        output: (val: Uint8Array) => toHEX(val),
      }),
      bridge_pubkey_bytes: bcs.vector(bcs.u8()),
      voting_power: bcs.u64(),
      http_rest_url: bcs.vector(bcs.u8()),
      blocklisted: bcs.bool(),
    })
  }

  private static cachedBcs: ReturnType<typeof CommitteeMember.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof CommitteeMember.instantiateBcs> {
    if (!CommitteeMember.cachedBcs) {
      CommitteeMember.cachedBcs = CommitteeMember.instantiateBcs()
    }
    return CommitteeMember.cachedBcs
  }

  static fromFields(fields: Record<string, any>): CommitteeMember {
    return CommitteeMember.reified().new({
      suiAddress: decodeFromFields('address', fields.sui_address),
      bridgePubkeyBytes: decodeFromFields(reified.vector('u8'), fields.bridge_pubkey_bytes),
      votingPower: decodeFromFields('u64', fields.voting_power),
      httpRestUrl: decodeFromFields(reified.vector('u8'), fields.http_rest_url),
      blocklisted: decodeFromFields('bool', fields.blocklisted),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): CommitteeMember {
    if (!isCommitteeMember(item.type)) {
      throw new Error('not a CommitteeMember type')
    }

    return CommitteeMember.reified().new({
      suiAddress: decodeFromFieldsWithTypes('address', item.fields.sui_address),
      bridgePubkeyBytes: decodeFromFieldsWithTypes(
        reified.vector('u8'),
        item.fields.bridge_pubkey_bytes
      ),
      votingPower: decodeFromFieldsWithTypes('u64', item.fields.voting_power),
      httpRestUrl: decodeFromFieldsWithTypes(reified.vector('u8'), item.fields.http_rest_url),
      blocklisted: decodeFromFieldsWithTypes('bool', item.fields.blocklisted),
    })
  }

  static fromBcs(data: Uint8Array): CommitteeMember {
    return CommitteeMember.fromFields(CommitteeMember.bcs.parse(data))
  }

  toJSONField() {
    return {
      suiAddress: this.suiAddress,
      bridgePubkeyBytes: fieldToJSON<Vector<'u8'>>(`vector<u8>`, this.bridgePubkeyBytes),
      votingPower: this.votingPower.toString(),
      httpRestUrl: fieldToJSON<Vector<'u8'>>(`vector<u8>`, this.httpRestUrl),
      blocklisted: this.blocklisted,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): CommitteeMember {
    return CommitteeMember.reified().new({
      suiAddress: decodeFromJSONField('address', field.suiAddress),
      bridgePubkeyBytes: decodeFromJSONField(reified.vector('u8'), field.bridgePubkeyBytes),
      votingPower: decodeFromJSONField('u64', field.votingPower),
      httpRestUrl: decodeFromJSONField(reified.vector('u8'), field.httpRestUrl),
      blocklisted: decodeFromJSONField('bool', field.blocklisted),
    })
  }

  static fromJSON(json: Record<string, any>): CommitteeMember {
    if (json.$typeName !== CommitteeMember.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return CommitteeMember.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): CommitteeMember {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isCommitteeMember(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a CommitteeMember object`)
    }
    return CommitteeMember.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): CommitteeMember {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isCommitteeMember(data.bcs.type)) {
        throw new Error(`object at is not a CommitteeMember object`)
      }

      return CommitteeMember.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return CommitteeMember.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<CommitteeMember> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching CommitteeMember object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isCommitteeMember(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a CommitteeMember object`)
    }

    return CommitteeMember.fromSuiObjectData(res.data)
  }
}

/* ============================== CommitteeMemberRegistration =============================== */

export function isCommitteeMemberRegistration(type: string): boolean {
  type = compressSuiType(type)
  return type === `0xb::committee::CommitteeMemberRegistration`
}

export interface CommitteeMemberRegistrationFields {
  suiAddress: ToField<'address'>
  bridgePubkeyBytes: ToField<Vector<'u8'>>
  httpRestUrl: ToField<Vector<'u8'>>
}

export type CommitteeMemberRegistrationReified = Reified<
  CommitteeMemberRegistration,
  CommitteeMemberRegistrationFields
>

export class CommitteeMemberRegistration implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0xb::committee::CommitteeMemberRegistration`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = CommitteeMemberRegistration.$typeName
  readonly $fullTypeName: `0xb::committee::CommitteeMemberRegistration`
  readonly $typeArgs: []
  readonly $isPhantom = CommitteeMemberRegistration.$isPhantom

  readonly suiAddress: ToField<'address'>
  readonly bridgePubkeyBytes: ToField<Vector<'u8'>>
  readonly httpRestUrl: ToField<Vector<'u8'>>

  private constructor(typeArgs: [], fields: CommitteeMemberRegistrationFields) {
    this.$fullTypeName = composeSuiType(
      CommitteeMemberRegistration.$typeName,
      ...typeArgs
    ) as `0xb::committee::CommitteeMemberRegistration`
    this.$typeArgs = typeArgs

    this.suiAddress = fields.suiAddress
    this.bridgePubkeyBytes = fields.bridgePubkeyBytes
    this.httpRestUrl = fields.httpRestUrl
  }

  static reified(): CommitteeMemberRegistrationReified {
    const reifiedBcs = CommitteeMemberRegistration.bcs
    return {
      typeName: CommitteeMemberRegistration.$typeName,
      fullTypeName: composeSuiType(
        CommitteeMemberRegistration.$typeName,
        ...[]
      ) as `0xb::committee::CommitteeMemberRegistration`,
      typeArgs: [] as [],
      isPhantom: CommitteeMemberRegistration.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => CommitteeMemberRegistration.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        CommitteeMemberRegistration.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => CommitteeMemberRegistration.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => CommitteeMemberRegistration.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => CommitteeMemberRegistration.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) =>
        CommitteeMemberRegistration.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) =>
        CommitteeMemberRegistration.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => CommitteeMemberRegistration.fetch(client, id),
      new: (fields: CommitteeMemberRegistrationFields) => {
        return new CommitteeMemberRegistration([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return CommitteeMemberRegistration.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<CommitteeMemberRegistration>> {
    return phantom(CommitteeMemberRegistration.reified())
  }

  static get p() {
    return CommitteeMemberRegistration.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('CommitteeMemberRegistration', {
      sui_address: bcs.bytes(32).transform({
        input: (val: string) => fromHEX(val),
        output: (val: Uint8Array) => toHEX(val),
      }),
      bridge_pubkey_bytes: bcs.vector(bcs.u8()),
      http_rest_url: bcs.vector(bcs.u8()),
    })
  }

  private static cachedBcs: ReturnType<typeof CommitteeMemberRegistration.instantiateBcs> | null =
    null

  static get bcs(): ReturnType<typeof CommitteeMemberRegistration.instantiateBcs> {
    if (!CommitteeMemberRegistration.cachedBcs) {
      CommitteeMemberRegistration.cachedBcs = CommitteeMemberRegistration.instantiateBcs()
    }
    return CommitteeMemberRegistration.cachedBcs
  }

  static fromFields(fields: Record<string, any>): CommitteeMemberRegistration {
    return CommitteeMemberRegistration.reified().new({
      suiAddress: decodeFromFields('address', fields.sui_address),
      bridgePubkeyBytes: decodeFromFields(reified.vector('u8'), fields.bridge_pubkey_bytes),
      httpRestUrl: decodeFromFields(reified.vector('u8'), fields.http_rest_url),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): CommitteeMemberRegistration {
    if (!isCommitteeMemberRegistration(item.type)) {
      throw new Error('not a CommitteeMemberRegistration type')
    }

    return CommitteeMemberRegistration.reified().new({
      suiAddress: decodeFromFieldsWithTypes('address', item.fields.sui_address),
      bridgePubkeyBytes: decodeFromFieldsWithTypes(
        reified.vector('u8'),
        item.fields.bridge_pubkey_bytes
      ),
      httpRestUrl: decodeFromFieldsWithTypes(reified.vector('u8'), item.fields.http_rest_url),
    })
  }

  static fromBcs(data: Uint8Array): CommitteeMemberRegistration {
    return CommitteeMemberRegistration.fromFields(CommitteeMemberRegistration.bcs.parse(data))
  }

  toJSONField() {
    return {
      suiAddress: this.suiAddress,
      bridgePubkeyBytes: fieldToJSON<Vector<'u8'>>(`vector<u8>`, this.bridgePubkeyBytes),
      httpRestUrl: fieldToJSON<Vector<'u8'>>(`vector<u8>`, this.httpRestUrl),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): CommitteeMemberRegistration {
    return CommitteeMemberRegistration.reified().new({
      suiAddress: decodeFromJSONField('address', field.suiAddress),
      bridgePubkeyBytes: decodeFromJSONField(reified.vector('u8'), field.bridgePubkeyBytes),
      httpRestUrl: decodeFromJSONField(reified.vector('u8'), field.httpRestUrl),
    })
  }

  static fromJSON(json: Record<string, any>): CommitteeMemberRegistration {
    if (json.$typeName !== CommitteeMemberRegistration.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return CommitteeMemberRegistration.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): CommitteeMemberRegistration {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isCommitteeMemberRegistration(content.type)) {
      throw new Error(
        `object at ${(content.fields as any).id} is not a CommitteeMemberRegistration object`
      )
    }
    return CommitteeMemberRegistration.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): CommitteeMemberRegistration {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isCommitteeMemberRegistration(data.bcs.type)) {
        throw new Error(`object at is not a CommitteeMemberRegistration object`)
      }

      return CommitteeMemberRegistration.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return CommitteeMemberRegistration.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<CommitteeMemberRegistration> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(
        `error fetching CommitteeMemberRegistration object at id ${id}: ${res.error.code}`
      )
    }
    if (
      res.data?.bcs?.dataType !== 'moveObject' ||
      !isCommitteeMemberRegistration(res.data.bcs.type)
    ) {
      throw new Error(`object at id ${id} is not a CommitteeMemberRegistration object`)
    }

    return CommitteeMemberRegistration.fromSuiObjectData(res.data)
  }
}
