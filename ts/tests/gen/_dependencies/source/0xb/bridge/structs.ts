import * as reified from '../../../../_framework/reified'
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
} from '../../../../_framework/reified'
import {
  FieldsWithTypes,
  composeSuiType,
  compressSuiType,
  parseTypeName,
} from '../../../../_framework/util'
import { Vector } from '../../../../_framework/vector'
import { Option } from '../../../../move-stdlib/option/structs'
import { LinkedTable } from '../../../../sui/linked-table/structs'
import { UID } from '../../../../sui/object/structs'
import { VecMap } from '../../../../sui/vec-map/structs'
import { Versioned } from '../../../../sui/versioned/structs'
import { BridgeCommittee } from '../committee/structs'
import { TransferLimiter } from '../limiter/structs'
import { BridgeMessage, BridgeMessageKey } from '../message/structs'
import { BridgeTreasury } from '../treasury/structs'
import { bcs } from '@mysten/sui/bcs'
import { SuiClient, SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromB64 } from '@mysten/sui/utils'

/* ============================== Bridge =============================== */

export function isBridge(type: string): boolean {
  type = compressSuiType(type)
  return type === `0xb::bridge::Bridge`
}

export interface BridgeFields {
  id: ToField<UID>
  inner: ToField<Versioned>
}

export type BridgeReified = Reified<Bridge, BridgeFields>

export class Bridge implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0xb::bridge::Bridge`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = Bridge.$typeName
  readonly $fullTypeName: `0xb::bridge::Bridge`
  readonly $typeArgs: []
  readonly $isPhantom = Bridge.$isPhantom

  readonly id: ToField<UID>
  readonly inner: ToField<Versioned>

  private constructor(typeArgs: [], fields: BridgeFields) {
    this.$fullTypeName = composeSuiType(Bridge.$typeName, ...typeArgs) as `0xb::bridge::Bridge`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.inner = fields.inner
  }

  static reified(): BridgeReified {
    const reifiedBcs = Bridge.bcs
    return {
      typeName: Bridge.$typeName,
      fullTypeName: composeSuiType(Bridge.$typeName, ...[]) as `0xb::bridge::Bridge`,
      typeArgs: [] as [],
      isPhantom: Bridge.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => Bridge.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Bridge.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => Bridge.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => Bridge.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => Bridge.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => Bridge.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => Bridge.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => Bridge.fetch(client, id),
      new: (fields: BridgeFields) => {
        return new Bridge([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Bridge.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<Bridge>> {
    return phantom(Bridge.reified())
  }

  static get p() {
    return Bridge.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('Bridge', {
      id: UID.bcs,
      inner: Versioned.bcs,
    })
  }

  private static cachedBcs: ReturnType<typeof Bridge.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof Bridge.instantiateBcs> {
    if (!Bridge.cachedBcs) {
      Bridge.cachedBcs = Bridge.instantiateBcs()
    }
    return Bridge.cachedBcs
  }

  static fromFields(fields: Record<string, any>): Bridge {
    return Bridge.reified().new({
      id: decodeFromFields(UID.reified(), fields.id),
      inner: decodeFromFields(Versioned.reified(), fields.inner),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Bridge {
    if (!isBridge(item.type)) {
      throw new Error('not a Bridge type')
    }

    return Bridge.reified().new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      inner: decodeFromFieldsWithTypes(Versioned.reified(), item.fields.inner),
    })
  }

  static fromBcs(data: Uint8Array): Bridge {
    return Bridge.fromFields(Bridge.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
      inner: this.inner.toJSONField(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): Bridge {
    return Bridge.reified().new({
      id: decodeFromJSONField(UID.reified(), field.id),
      inner: decodeFromJSONField(Versioned.reified(), field.inner),
    })
  }

  static fromJSON(json: Record<string, any>): Bridge {
    if (json.$typeName !== Bridge.$typeName) {
      throw new Error(
        `not a Bridge json object: expected '${Bridge.$typeName}' but got '${json.$typeName}'`
      )
    }

    return Bridge.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): Bridge {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isBridge(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Bridge object`)
    }
    return Bridge.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): Bridge {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isBridge(data.bcs.type)) {
        throw new Error(`object at is not a Bridge object`)
      }

      return Bridge.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Bridge.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<Bridge> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching Bridge object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isBridge(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a Bridge object`)
    }

    return Bridge.fromSuiObjectData(res.data)
  }
}

/* ============================== BridgeInner =============================== */

export function isBridgeInner(type: string): boolean {
  type = compressSuiType(type)
  return type === `0xb::bridge::BridgeInner`
}

export interface BridgeInnerFields {
  bridgeVersion: ToField<'u64'>
  messageVersion: ToField<'u8'>
  chainId: ToField<'u8'>
  sequenceNums: ToField<VecMap<'u8', 'u64'>>
  committee: ToField<BridgeCommittee>
  treasury: ToField<BridgeTreasury>
  tokenTransferRecords: ToField<LinkedTable<BridgeMessageKey, ToPhantom<BridgeRecord>>>
  limiter: ToField<TransferLimiter>
  paused: ToField<'bool'>
}

export type BridgeInnerReified = Reified<BridgeInner, BridgeInnerFields>

export class BridgeInner implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0xb::bridge::BridgeInner`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = BridgeInner.$typeName
  readonly $fullTypeName: `0xb::bridge::BridgeInner`
  readonly $typeArgs: []
  readonly $isPhantom = BridgeInner.$isPhantom

  readonly bridgeVersion: ToField<'u64'>
  readonly messageVersion: ToField<'u8'>
  readonly chainId: ToField<'u8'>
  readonly sequenceNums: ToField<VecMap<'u8', 'u64'>>
  readonly committee: ToField<BridgeCommittee>
  readonly treasury: ToField<BridgeTreasury>
  readonly tokenTransferRecords: ToField<LinkedTable<BridgeMessageKey, ToPhantom<BridgeRecord>>>
  readonly limiter: ToField<TransferLimiter>
  readonly paused: ToField<'bool'>

  private constructor(typeArgs: [], fields: BridgeInnerFields) {
    this.$fullTypeName = composeSuiType(
      BridgeInner.$typeName,
      ...typeArgs
    ) as `0xb::bridge::BridgeInner`
    this.$typeArgs = typeArgs

    this.bridgeVersion = fields.bridgeVersion
    this.messageVersion = fields.messageVersion
    this.chainId = fields.chainId
    this.sequenceNums = fields.sequenceNums
    this.committee = fields.committee
    this.treasury = fields.treasury
    this.tokenTransferRecords = fields.tokenTransferRecords
    this.limiter = fields.limiter
    this.paused = fields.paused
  }

  static reified(): BridgeInnerReified {
    const reifiedBcs = BridgeInner.bcs
    return {
      typeName: BridgeInner.$typeName,
      fullTypeName: composeSuiType(BridgeInner.$typeName, ...[]) as `0xb::bridge::BridgeInner`,
      typeArgs: [] as [],
      isPhantom: BridgeInner.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => BridgeInner.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => BridgeInner.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => BridgeInner.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => BridgeInner.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => BridgeInner.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => BridgeInner.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => BridgeInner.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => BridgeInner.fetch(client, id),
      new: (fields: BridgeInnerFields) => {
        return new BridgeInner([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return BridgeInner.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<BridgeInner>> {
    return phantom(BridgeInner.reified())
  }

  static get p() {
    return BridgeInner.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('BridgeInner', {
      bridge_version: bcs.u64(),
      message_version: bcs.u8(),
      chain_id: bcs.u8(),
      sequence_nums: VecMap.bcs(bcs.u8(), bcs.u64()),
      committee: BridgeCommittee.bcs,
      treasury: BridgeTreasury.bcs,
      token_transfer_records: LinkedTable.bcs(BridgeMessageKey.bcs),
      limiter: TransferLimiter.bcs,
      paused: bcs.bool(),
    })
  }

  private static cachedBcs: ReturnType<typeof BridgeInner.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof BridgeInner.instantiateBcs> {
    if (!BridgeInner.cachedBcs) {
      BridgeInner.cachedBcs = BridgeInner.instantiateBcs()
    }
    return BridgeInner.cachedBcs
  }

  static fromFields(fields: Record<string, any>): BridgeInner {
    return BridgeInner.reified().new({
      bridgeVersion: decodeFromFields('u64', fields.bridge_version),
      messageVersion: decodeFromFields('u8', fields.message_version),
      chainId: decodeFromFields('u8', fields.chain_id),
      sequenceNums: decodeFromFields(VecMap.reified('u8', 'u64'), fields.sequence_nums),
      committee: decodeFromFields(BridgeCommittee.reified(), fields.committee),
      treasury: decodeFromFields(BridgeTreasury.reified(), fields.treasury),
      tokenTransferRecords: decodeFromFields(
        LinkedTable.reified(BridgeMessageKey.reified(), reified.phantom(BridgeRecord.reified())),
        fields.token_transfer_records
      ),
      limiter: decodeFromFields(TransferLimiter.reified(), fields.limiter),
      paused: decodeFromFields('bool', fields.paused),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): BridgeInner {
    if (!isBridgeInner(item.type)) {
      throw new Error('not a BridgeInner type')
    }

    return BridgeInner.reified().new({
      bridgeVersion: decodeFromFieldsWithTypes('u64', item.fields.bridge_version),
      messageVersion: decodeFromFieldsWithTypes('u8', item.fields.message_version),
      chainId: decodeFromFieldsWithTypes('u8', item.fields.chain_id),
      sequenceNums: decodeFromFieldsWithTypes(
        VecMap.reified('u8', 'u64'),
        item.fields.sequence_nums
      ),
      committee: decodeFromFieldsWithTypes(BridgeCommittee.reified(), item.fields.committee),
      treasury: decodeFromFieldsWithTypes(BridgeTreasury.reified(), item.fields.treasury),
      tokenTransferRecords: decodeFromFieldsWithTypes(
        LinkedTable.reified(BridgeMessageKey.reified(), reified.phantom(BridgeRecord.reified())),
        item.fields.token_transfer_records
      ),
      limiter: decodeFromFieldsWithTypes(TransferLimiter.reified(), item.fields.limiter),
      paused: decodeFromFieldsWithTypes('bool', item.fields.paused),
    })
  }

  static fromBcs(data: Uint8Array): BridgeInner {
    return BridgeInner.fromFields(BridgeInner.bcs.parse(data))
  }

  toJSONField() {
    return {
      bridgeVersion: this.bridgeVersion.toString(),
      messageVersion: this.messageVersion,
      chainId: this.chainId,
      sequenceNums: this.sequenceNums.toJSONField(),
      committee: this.committee.toJSONField(),
      treasury: this.treasury.toJSONField(),
      tokenTransferRecords: this.tokenTransferRecords.toJSONField(),
      limiter: this.limiter.toJSONField(),
      paused: this.paused,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): BridgeInner {
    return BridgeInner.reified().new({
      bridgeVersion: decodeFromJSONField('u64', field.bridgeVersion),
      messageVersion: decodeFromJSONField('u8', field.messageVersion),
      chainId: decodeFromJSONField('u8', field.chainId),
      sequenceNums: decodeFromJSONField(VecMap.reified('u8', 'u64'), field.sequenceNums),
      committee: decodeFromJSONField(BridgeCommittee.reified(), field.committee),
      treasury: decodeFromJSONField(BridgeTreasury.reified(), field.treasury),
      tokenTransferRecords: decodeFromJSONField(
        LinkedTable.reified(BridgeMessageKey.reified(), reified.phantom(BridgeRecord.reified())),
        field.tokenTransferRecords
      ),
      limiter: decodeFromJSONField(TransferLimiter.reified(), field.limiter),
      paused: decodeFromJSONField('bool', field.paused),
    })
  }

  static fromJSON(json: Record<string, any>): BridgeInner {
    if (json.$typeName !== BridgeInner.$typeName) {
      throw new Error(
        `not a BridgeInner json object: expected '${BridgeInner.$typeName}' but got '${json.$typeName}'`
      )
    }

    return BridgeInner.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): BridgeInner {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isBridgeInner(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a BridgeInner object`)
    }
    return BridgeInner.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): BridgeInner {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isBridgeInner(data.bcs.type)) {
        throw new Error(`object at is not a BridgeInner object`)
      }

      return BridgeInner.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return BridgeInner.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<BridgeInner> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching BridgeInner object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isBridgeInner(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a BridgeInner object`)
    }

    return BridgeInner.fromSuiObjectData(res.data)
  }
}

/* ============================== TokenDepositedEvent =============================== */

export function isTokenDepositedEvent(type: string): boolean {
  type = compressSuiType(type)
  return type === `0xb::bridge::TokenDepositedEvent`
}

export interface TokenDepositedEventFields {
  seqNum: ToField<'u64'>
  sourceChain: ToField<'u8'>
  senderAddress: ToField<Vector<'u8'>>
  targetChain: ToField<'u8'>
  targetAddress: ToField<Vector<'u8'>>
  tokenType: ToField<'u8'>
  amount: ToField<'u64'>
}

export type TokenDepositedEventReified = Reified<TokenDepositedEvent, TokenDepositedEventFields>

export class TokenDepositedEvent implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0xb::bridge::TokenDepositedEvent`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = TokenDepositedEvent.$typeName
  readonly $fullTypeName: `0xb::bridge::TokenDepositedEvent`
  readonly $typeArgs: []
  readonly $isPhantom = TokenDepositedEvent.$isPhantom

  readonly seqNum: ToField<'u64'>
  readonly sourceChain: ToField<'u8'>
  readonly senderAddress: ToField<Vector<'u8'>>
  readonly targetChain: ToField<'u8'>
  readonly targetAddress: ToField<Vector<'u8'>>
  readonly tokenType: ToField<'u8'>
  readonly amount: ToField<'u64'>

  private constructor(typeArgs: [], fields: TokenDepositedEventFields) {
    this.$fullTypeName = composeSuiType(
      TokenDepositedEvent.$typeName,
      ...typeArgs
    ) as `0xb::bridge::TokenDepositedEvent`
    this.$typeArgs = typeArgs

    this.seqNum = fields.seqNum
    this.sourceChain = fields.sourceChain
    this.senderAddress = fields.senderAddress
    this.targetChain = fields.targetChain
    this.targetAddress = fields.targetAddress
    this.tokenType = fields.tokenType
    this.amount = fields.amount
  }

  static reified(): TokenDepositedEventReified {
    const reifiedBcs = TokenDepositedEvent.bcs
    return {
      typeName: TokenDepositedEvent.$typeName,
      fullTypeName: composeSuiType(
        TokenDepositedEvent.$typeName,
        ...[]
      ) as `0xb::bridge::TokenDepositedEvent`,
      typeArgs: [] as [],
      isPhantom: TokenDepositedEvent.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => TokenDepositedEvent.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => TokenDepositedEvent.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => TokenDepositedEvent.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => TokenDepositedEvent.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => TokenDepositedEvent.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => TokenDepositedEvent.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => TokenDepositedEvent.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => TokenDepositedEvent.fetch(client, id),
      new: (fields: TokenDepositedEventFields) => {
        return new TokenDepositedEvent([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return TokenDepositedEvent.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<TokenDepositedEvent>> {
    return phantom(TokenDepositedEvent.reified())
  }

  static get p() {
    return TokenDepositedEvent.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('TokenDepositedEvent', {
      seq_num: bcs.u64(),
      source_chain: bcs.u8(),
      sender_address: bcs.vector(bcs.u8()),
      target_chain: bcs.u8(),
      target_address: bcs.vector(bcs.u8()),
      token_type: bcs.u8(),
      amount: bcs.u64(),
    })
  }

  private static cachedBcs: ReturnType<typeof TokenDepositedEvent.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof TokenDepositedEvent.instantiateBcs> {
    if (!TokenDepositedEvent.cachedBcs) {
      TokenDepositedEvent.cachedBcs = TokenDepositedEvent.instantiateBcs()
    }
    return TokenDepositedEvent.cachedBcs
  }

  static fromFields(fields: Record<string, any>): TokenDepositedEvent {
    return TokenDepositedEvent.reified().new({
      seqNum: decodeFromFields('u64', fields.seq_num),
      sourceChain: decodeFromFields('u8', fields.source_chain),
      senderAddress: decodeFromFields(reified.vector('u8'), fields.sender_address),
      targetChain: decodeFromFields('u8', fields.target_chain),
      targetAddress: decodeFromFields(reified.vector('u8'), fields.target_address),
      tokenType: decodeFromFields('u8', fields.token_type),
      amount: decodeFromFields('u64', fields.amount),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): TokenDepositedEvent {
    if (!isTokenDepositedEvent(item.type)) {
      throw new Error('not a TokenDepositedEvent type')
    }

    return TokenDepositedEvent.reified().new({
      seqNum: decodeFromFieldsWithTypes('u64', item.fields.seq_num),
      sourceChain: decodeFromFieldsWithTypes('u8', item.fields.source_chain),
      senderAddress: decodeFromFieldsWithTypes(reified.vector('u8'), item.fields.sender_address),
      targetChain: decodeFromFieldsWithTypes('u8', item.fields.target_chain),
      targetAddress: decodeFromFieldsWithTypes(reified.vector('u8'), item.fields.target_address),
      tokenType: decodeFromFieldsWithTypes('u8', item.fields.token_type),
      amount: decodeFromFieldsWithTypes('u64', item.fields.amount),
    })
  }

  static fromBcs(data: Uint8Array): TokenDepositedEvent {
    return TokenDepositedEvent.fromFields(TokenDepositedEvent.bcs.parse(data))
  }

  toJSONField() {
    return {
      seqNum: this.seqNum.toString(),
      sourceChain: this.sourceChain,
      senderAddress: fieldToJSON<Vector<'u8'>>(`vector<u8>`, this.senderAddress),
      targetChain: this.targetChain,
      targetAddress: fieldToJSON<Vector<'u8'>>(`vector<u8>`, this.targetAddress),
      tokenType: this.tokenType,
      amount: this.amount.toString(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): TokenDepositedEvent {
    return TokenDepositedEvent.reified().new({
      seqNum: decodeFromJSONField('u64', field.seqNum),
      sourceChain: decodeFromJSONField('u8', field.sourceChain),
      senderAddress: decodeFromJSONField(reified.vector('u8'), field.senderAddress),
      targetChain: decodeFromJSONField('u8', field.targetChain),
      targetAddress: decodeFromJSONField(reified.vector('u8'), field.targetAddress),
      tokenType: decodeFromJSONField('u8', field.tokenType),
      amount: decodeFromJSONField('u64', field.amount),
    })
  }

  static fromJSON(json: Record<string, any>): TokenDepositedEvent {
    if (json.$typeName !== TokenDepositedEvent.$typeName) {
      throw new Error(
        `not a TokenDepositedEvent json object: expected '${TokenDepositedEvent.$typeName}' but got '${json.$typeName}'`
      )
    }

    return TokenDepositedEvent.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): TokenDepositedEvent {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isTokenDepositedEvent(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a TokenDepositedEvent object`)
    }
    return TokenDepositedEvent.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): TokenDepositedEvent {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isTokenDepositedEvent(data.bcs.type)) {
        throw new Error(`object at is not a TokenDepositedEvent object`)
      }

      return TokenDepositedEvent.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return TokenDepositedEvent.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<TokenDepositedEvent> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching TokenDepositedEvent object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isTokenDepositedEvent(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a TokenDepositedEvent object`)
    }

    return TokenDepositedEvent.fromSuiObjectData(res.data)
  }
}

/* ============================== EmergencyOpEvent =============================== */

export function isEmergencyOpEvent(type: string): boolean {
  type = compressSuiType(type)
  return type === `0xb::bridge::EmergencyOpEvent`
}

export interface EmergencyOpEventFields {
  frozen: ToField<'bool'>
}

export type EmergencyOpEventReified = Reified<EmergencyOpEvent, EmergencyOpEventFields>

export class EmergencyOpEvent implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0xb::bridge::EmergencyOpEvent`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = EmergencyOpEvent.$typeName
  readonly $fullTypeName: `0xb::bridge::EmergencyOpEvent`
  readonly $typeArgs: []
  readonly $isPhantom = EmergencyOpEvent.$isPhantom

  readonly frozen: ToField<'bool'>

  private constructor(typeArgs: [], fields: EmergencyOpEventFields) {
    this.$fullTypeName = composeSuiType(
      EmergencyOpEvent.$typeName,
      ...typeArgs
    ) as `0xb::bridge::EmergencyOpEvent`
    this.$typeArgs = typeArgs

    this.frozen = fields.frozen
  }

  static reified(): EmergencyOpEventReified {
    const reifiedBcs = EmergencyOpEvent.bcs
    return {
      typeName: EmergencyOpEvent.$typeName,
      fullTypeName: composeSuiType(
        EmergencyOpEvent.$typeName,
        ...[]
      ) as `0xb::bridge::EmergencyOpEvent`,
      typeArgs: [] as [],
      isPhantom: EmergencyOpEvent.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => EmergencyOpEvent.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => EmergencyOpEvent.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => EmergencyOpEvent.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => EmergencyOpEvent.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => EmergencyOpEvent.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => EmergencyOpEvent.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => EmergencyOpEvent.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => EmergencyOpEvent.fetch(client, id),
      new: (fields: EmergencyOpEventFields) => {
        return new EmergencyOpEvent([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return EmergencyOpEvent.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<EmergencyOpEvent>> {
    return phantom(EmergencyOpEvent.reified())
  }

  static get p() {
    return EmergencyOpEvent.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('EmergencyOpEvent', {
      frozen: bcs.bool(),
    })
  }

  private static cachedBcs: ReturnType<typeof EmergencyOpEvent.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof EmergencyOpEvent.instantiateBcs> {
    if (!EmergencyOpEvent.cachedBcs) {
      EmergencyOpEvent.cachedBcs = EmergencyOpEvent.instantiateBcs()
    }
    return EmergencyOpEvent.cachedBcs
  }

  static fromFields(fields: Record<string, any>): EmergencyOpEvent {
    return EmergencyOpEvent.reified().new({
      frozen: decodeFromFields('bool', fields.frozen),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): EmergencyOpEvent {
    if (!isEmergencyOpEvent(item.type)) {
      throw new Error('not a EmergencyOpEvent type')
    }

    return EmergencyOpEvent.reified().new({
      frozen: decodeFromFieldsWithTypes('bool', item.fields.frozen),
    })
  }

  static fromBcs(data: Uint8Array): EmergencyOpEvent {
    return EmergencyOpEvent.fromFields(EmergencyOpEvent.bcs.parse(data))
  }

  toJSONField() {
    return {
      frozen: this.frozen,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): EmergencyOpEvent {
    return EmergencyOpEvent.reified().new({
      frozen: decodeFromJSONField('bool', field.frozen),
    })
  }

  static fromJSON(json: Record<string, any>): EmergencyOpEvent {
    if (json.$typeName !== EmergencyOpEvent.$typeName) {
      throw new Error(
        `not a EmergencyOpEvent json object: expected '${EmergencyOpEvent.$typeName}' but got '${json.$typeName}'`
      )
    }

    return EmergencyOpEvent.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): EmergencyOpEvent {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isEmergencyOpEvent(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a EmergencyOpEvent object`)
    }
    return EmergencyOpEvent.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): EmergencyOpEvent {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isEmergencyOpEvent(data.bcs.type)) {
        throw new Error(`object at is not a EmergencyOpEvent object`)
      }

      return EmergencyOpEvent.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return EmergencyOpEvent.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<EmergencyOpEvent> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching EmergencyOpEvent object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isEmergencyOpEvent(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a EmergencyOpEvent object`)
    }

    return EmergencyOpEvent.fromSuiObjectData(res.data)
  }
}

/* ============================== BridgeRecord =============================== */

export function isBridgeRecord(type: string): boolean {
  type = compressSuiType(type)
  return type === `0xb::bridge::BridgeRecord`
}

export interface BridgeRecordFields {
  message: ToField<BridgeMessage>
  verifiedSignatures: ToField<Option<Vector<Vector<'u8'>>>>
  claimed: ToField<'bool'>
}

export type BridgeRecordReified = Reified<BridgeRecord, BridgeRecordFields>

export class BridgeRecord implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0xb::bridge::BridgeRecord`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = BridgeRecord.$typeName
  readonly $fullTypeName: `0xb::bridge::BridgeRecord`
  readonly $typeArgs: []
  readonly $isPhantom = BridgeRecord.$isPhantom

  readonly message: ToField<BridgeMessage>
  readonly verifiedSignatures: ToField<Option<Vector<Vector<'u8'>>>>
  readonly claimed: ToField<'bool'>

  private constructor(typeArgs: [], fields: BridgeRecordFields) {
    this.$fullTypeName = composeSuiType(
      BridgeRecord.$typeName,
      ...typeArgs
    ) as `0xb::bridge::BridgeRecord`
    this.$typeArgs = typeArgs

    this.message = fields.message
    this.verifiedSignatures = fields.verifiedSignatures
    this.claimed = fields.claimed
  }

  static reified(): BridgeRecordReified {
    const reifiedBcs = BridgeRecord.bcs
    return {
      typeName: BridgeRecord.$typeName,
      fullTypeName: composeSuiType(BridgeRecord.$typeName, ...[]) as `0xb::bridge::BridgeRecord`,
      typeArgs: [] as [],
      isPhantom: BridgeRecord.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => BridgeRecord.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => BridgeRecord.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => BridgeRecord.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => BridgeRecord.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => BridgeRecord.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => BridgeRecord.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => BridgeRecord.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => BridgeRecord.fetch(client, id),
      new: (fields: BridgeRecordFields) => {
        return new BridgeRecord([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return BridgeRecord.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<BridgeRecord>> {
    return phantom(BridgeRecord.reified())
  }

  static get p() {
    return BridgeRecord.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('BridgeRecord', {
      message: BridgeMessage.bcs,
      verified_signatures: Option.bcs(bcs.vector(bcs.vector(bcs.u8()))),
      claimed: bcs.bool(),
    })
  }

  private static cachedBcs: ReturnType<typeof BridgeRecord.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof BridgeRecord.instantiateBcs> {
    if (!BridgeRecord.cachedBcs) {
      BridgeRecord.cachedBcs = BridgeRecord.instantiateBcs()
    }
    return BridgeRecord.cachedBcs
  }

  static fromFields(fields: Record<string, any>): BridgeRecord {
    return BridgeRecord.reified().new({
      message: decodeFromFields(BridgeMessage.reified(), fields.message),
      verifiedSignatures: decodeFromFields(
        Option.reified(reified.vector(reified.vector('u8'))),
        fields.verified_signatures
      ),
      claimed: decodeFromFields('bool', fields.claimed),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): BridgeRecord {
    if (!isBridgeRecord(item.type)) {
      throw new Error('not a BridgeRecord type')
    }

    return BridgeRecord.reified().new({
      message: decodeFromFieldsWithTypes(BridgeMessage.reified(), item.fields.message),
      verifiedSignatures: decodeFromFieldsWithTypes(
        Option.reified(reified.vector(reified.vector('u8'))),
        item.fields.verified_signatures
      ),
      claimed: decodeFromFieldsWithTypes('bool', item.fields.claimed),
    })
  }

  static fromBcs(data: Uint8Array): BridgeRecord {
    return BridgeRecord.fromFields(BridgeRecord.bcs.parse(data))
  }

  toJSONField() {
    return {
      message: this.message.toJSONField(),
      verifiedSignatures: fieldToJSON<Option<Vector<Vector<'u8'>>>>(
        `${Option.$typeName}<vector<vector<u8>>>`,
        this.verifiedSignatures
      ),
      claimed: this.claimed,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): BridgeRecord {
    return BridgeRecord.reified().new({
      message: decodeFromJSONField(BridgeMessage.reified(), field.message),
      verifiedSignatures: decodeFromJSONField(
        Option.reified(reified.vector(reified.vector('u8'))),
        field.verifiedSignatures
      ),
      claimed: decodeFromJSONField('bool', field.claimed),
    })
  }

  static fromJSON(json: Record<string, any>): BridgeRecord {
    if (json.$typeName !== BridgeRecord.$typeName) {
      throw new Error(
        `not a BridgeRecord json object: expected '${BridgeRecord.$typeName}' but got '${json.$typeName}'`
      )
    }

    return BridgeRecord.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): BridgeRecord {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isBridgeRecord(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a BridgeRecord object`)
    }
    return BridgeRecord.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): BridgeRecord {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isBridgeRecord(data.bcs.type)) {
        throw new Error(`object at is not a BridgeRecord object`)
      }

      return BridgeRecord.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return BridgeRecord.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<BridgeRecord> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching BridgeRecord object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isBridgeRecord(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a BridgeRecord object`)
    }

    return BridgeRecord.fromSuiObjectData(res.data)
  }
}

/* ============================== TokenTransferApproved =============================== */

export function isTokenTransferApproved(type: string): boolean {
  type = compressSuiType(type)
  return type === `0xb::bridge::TokenTransferApproved`
}

export interface TokenTransferApprovedFields {
  messageKey: ToField<BridgeMessageKey>
}

export type TokenTransferApprovedReified = Reified<
  TokenTransferApproved,
  TokenTransferApprovedFields
>

export class TokenTransferApproved implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0xb::bridge::TokenTransferApproved`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = TokenTransferApproved.$typeName
  readonly $fullTypeName: `0xb::bridge::TokenTransferApproved`
  readonly $typeArgs: []
  readonly $isPhantom = TokenTransferApproved.$isPhantom

  readonly messageKey: ToField<BridgeMessageKey>

  private constructor(typeArgs: [], fields: TokenTransferApprovedFields) {
    this.$fullTypeName = composeSuiType(
      TokenTransferApproved.$typeName,
      ...typeArgs
    ) as `0xb::bridge::TokenTransferApproved`
    this.$typeArgs = typeArgs

    this.messageKey = fields.messageKey
  }

  static reified(): TokenTransferApprovedReified {
    const reifiedBcs = TokenTransferApproved.bcs
    return {
      typeName: TokenTransferApproved.$typeName,
      fullTypeName: composeSuiType(
        TokenTransferApproved.$typeName,
        ...[]
      ) as `0xb::bridge::TokenTransferApproved`,
      typeArgs: [] as [],
      isPhantom: TokenTransferApproved.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => TokenTransferApproved.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        TokenTransferApproved.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => TokenTransferApproved.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => TokenTransferApproved.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => TokenTransferApproved.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) =>
        TokenTransferApproved.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) =>
        TokenTransferApproved.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => TokenTransferApproved.fetch(client, id),
      new: (fields: TokenTransferApprovedFields) => {
        return new TokenTransferApproved([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return TokenTransferApproved.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<TokenTransferApproved>> {
    return phantom(TokenTransferApproved.reified())
  }

  static get p() {
    return TokenTransferApproved.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('TokenTransferApproved', {
      message_key: BridgeMessageKey.bcs,
    })
  }

  private static cachedBcs: ReturnType<typeof TokenTransferApproved.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof TokenTransferApproved.instantiateBcs> {
    if (!TokenTransferApproved.cachedBcs) {
      TokenTransferApproved.cachedBcs = TokenTransferApproved.instantiateBcs()
    }
    return TokenTransferApproved.cachedBcs
  }

  static fromFields(fields: Record<string, any>): TokenTransferApproved {
    return TokenTransferApproved.reified().new({
      messageKey: decodeFromFields(BridgeMessageKey.reified(), fields.message_key),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): TokenTransferApproved {
    if (!isTokenTransferApproved(item.type)) {
      throw new Error('not a TokenTransferApproved type')
    }

    return TokenTransferApproved.reified().new({
      messageKey: decodeFromFieldsWithTypes(BridgeMessageKey.reified(), item.fields.message_key),
    })
  }

  static fromBcs(data: Uint8Array): TokenTransferApproved {
    return TokenTransferApproved.fromFields(TokenTransferApproved.bcs.parse(data))
  }

  toJSONField() {
    return {
      messageKey: this.messageKey.toJSONField(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): TokenTransferApproved {
    return TokenTransferApproved.reified().new({
      messageKey: decodeFromJSONField(BridgeMessageKey.reified(), field.messageKey),
    })
  }

  static fromJSON(json: Record<string, any>): TokenTransferApproved {
    if (json.$typeName !== TokenTransferApproved.$typeName) {
      throw new Error(
        `not a TokenTransferApproved json object: expected '${TokenTransferApproved.$typeName}' but got '${json.$typeName}'`
      )
    }

    return TokenTransferApproved.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): TokenTransferApproved {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isTokenTransferApproved(content.type)) {
      throw new Error(
        `object at ${(content.fields as any).id} is not a TokenTransferApproved object`
      )
    }
    return TokenTransferApproved.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): TokenTransferApproved {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isTokenTransferApproved(data.bcs.type)) {
        throw new Error(`object at is not a TokenTransferApproved object`)
      }

      return TokenTransferApproved.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return TokenTransferApproved.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<TokenTransferApproved> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching TokenTransferApproved object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isTokenTransferApproved(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a TokenTransferApproved object`)
    }

    return TokenTransferApproved.fromSuiObjectData(res.data)
  }
}

/* ============================== TokenTransferClaimed =============================== */

export function isTokenTransferClaimed(type: string): boolean {
  type = compressSuiType(type)
  return type === `0xb::bridge::TokenTransferClaimed`
}

export interface TokenTransferClaimedFields {
  messageKey: ToField<BridgeMessageKey>
}

export type TokenTransferClaimedReified = Reified<TokenTransferClaimed, TokenTransferClaimedFields>

export class TokenTransferClaimed implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0xb::bridge::TokenTransferClaimed`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = TokenTransferClaimed.$typeName
  readonly $fullTypeName: `0xb::bridge::TokenTransferClaimed`
  readonly $typeArgs: []
  readonly $isPhantom = TokenTransferClaimed.$isPhantom

  readonly messageKey: ToField<BridgeMessageKey>

  private constructor(typeArgs: [], fields: TokenTransferClaimedFields) {
    this.$fullTypeName = composeSuiType(
      TokenTransferClaimed.$typeName,
      ...typeArgs
    ) as `0xb::bridge::TokenTransferClaimed`
    this.$typeArgs = typeArgs

    this.messageKey = fields.messageKey
  }

  static reified(): TokenTransferClaimedReified {
    const reifiedBcs = TokenTransferClaimed.bcs
    return {
      typeName: TokenTransferClaimed.$typeName,
      fullTypeName: composeSuiType(
        TokenTransferClaimed.$typeName,
        ...[]
      ) as `0xb::bridge::TokenTransferClaimed`,
      typeArgs: [] as [],
      isPhantom: TokenTransferClaimed.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => TokenTransferClaimed.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        TokenTransferClaimed.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => TokenTransferClaimed.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => TokenTransferClaimed.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => TokenTransferClaimed.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) =>
        TokenTransferClaimed.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) =>
        TokenTransferClaimed.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => TokenTransferClaimed.fetch(client, id),
      new: (fields: TokenTransferClaimedFields) => {
        return new TokenTransferClaimed([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return TokenTransferClaimed.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<TokenTransferClaimed>> {
    return phantom(TokenTransferClaimed.reified())
  }

  static get p() {
    return TokenTransferClaimed.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('TokenTransferClaimed', {
      message_key: BridgeMessageKey.bcs,
    })
  }

  private static cachedBcs: ReturnType<typeof TokenTransferClaimed.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof TokenTransferClaimed.instantiateBcs> {
    if (!TokenTransferClaimed.cachedBcs) {
      TokenTransferClaimed.cachedBcs = TokenTransferClaimed.instantiateBcs()
    }
    return TokenTransferClaimed.cachedBcs
  }

  static fromFields(fields: Record<string, any>): TokenTransferClaimed {
    return TokenTransferClaimed.reified().new({
      messageKey: decodeFromFields(BridgeMessageKey.reified(), fields.message_key),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): TokenTransferClaimed {
    if (!isTokenTransferClaimed(item.type)) {
      throw new Error('not a TokenTransferClaimed type')
    }

    return TokenTransferClaimed.reified().new({
      messageKey: decodeFromFieldsWithTypes(BridgeMessageKey.reified(), item.fields.message_key),
    })
  }

  static fromBcs(data: Uint8Array): TokenTransferClaimed {
    return TokenTransferClaimed.fromFields(TokenTransferClaimed.bcs.parse(data))
  }

  toJSONField() {
    return {
      messageKey: this.messageKey.toJSONField(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): TokenTransferClaimed {
    return TokenTransferClaimed.reified().new({
      messageKey: decodeFromJSONField(BridgeMessageKey.reified(), field.messageKey),
    })
  }

  static fromJSON(json: Record<string, any>): TokenTransferClaimed {
    if (json.$typeName !== TokenTransferClaimed.$typeName) {
      throw new Error(
        `not a TokenTransferClaimed json object: expected '${TokenTransferClaimed.$typeName}' but got '${json.$typeName}'`
      )
    }

    return TokenTransferClaimed.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): TokenTransferClaimed {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isTokenTransferClaimed(content.type)) {
      throw new Error(
        `object at ${(content.fields as any).id} is not a TokenTransferClaimed object`
      )
    }
    return TokenTransferClaimed.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): TokenTransferClaimed {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isTokenTransferClaimed(data.bcs.type)) {
        throw new Error(`object at is not a TokenTransferClaimed object`)
      }

      return TokenTransferClaimed.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return TokenTransferClaimed.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<TokenTransferClaimed> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching TokenTransferClaimed object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isTokenTransferClaimed(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a TokenTransferClaimed object`)
    }

    return TokenTransferClaimed.fromSuiObjectData(res.data)
  }
}

/* ============================== TokenTransferAlreadyApproved =============================== */

export function isTokenTransferAlreadyApproved(type: string): boolean {
  type = compressSuiType(type)
  return type === `0xb::bridge::TokenTransferAlreadyApproved`
}

export interface TokenTransferAlreadyApprovedFields {
  messageKey: ToField<BridgeMessageKey>
}

export type TokenTransferAlreadyApprovedReified = Reified<
  TokenTransferAlreadyApproved,
  TokenTransferAlreadyApprovedFields
>

export class TokenTransferAlreadyApproved implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0xb::bridge::TokenTransferAlreadyApproved`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = TokenTransferAlreadyApproved.$typeName
  readonly $fullTypeName: `0xb::bridge::TokenTransferAlreadyApproved`
  readonly $typeArgs: []
  readonly $isPhantom = TokenTransferAlreadyApproved.$isPhantom

  readonly messageKey: ToField<BridgeMessageKey>

  private constructor(typeArgs: [], fields: TokenTransferAlreadyApprovedFields) {
    this.$fullTypeName = composeSuiType(
      TokenTransferAlreadyApproved.$typeName,
      ...typeArgs
    ) as `0xb::bridge::TokenTransferAlreadyApproved`
    this.$typeArgs = typeArgs

    this.messageKey = fields.messageKey
  }

  static reified(): TokenTransferAlreadyApprovedReified {
    const reifiedBcs = TokenTransferAlreadyApproved.bcs
    return {
      typeName: TokenTransferAlreadyApproved.$typeName,
      fullTypeName: composeSuiType(
        TokenTransferAlreadyApproved.$typeName,
        ...[]
      ) as `0xb::bridge::TokenTransferAlreadyApproved`,
      typeArgs: [] as [],
      isPhantom: TokenTransferAlreadyApproved.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => TokenTransferAlreadyApproved.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        TokenTransferAlreadyApproved.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) =>
        TokenTransferAlreadyApproved.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => TokenTransferAlreadyApproved.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => TokenTransferAlreadyApproved.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) =>
        TokenTransferAlreadyApproved.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) =>
        TokenTransferAlreadyApproved.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) =>
        TokenTransferAlreadyApproved.fetch(client, id),
      new: (fields: TokenTransferAlreadyApprovedFields) => {
        return new TokenTransferAlreadyApproved([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return TokenTransferAlreadyApproved.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<TokenTransferAlreadyApproved>> {
    return phantom(TokenTransferAlreadyApproved.reified())
  }

  static get p() {
    return TokenTransferAlreadyApproved.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('TokenTransferAlreadyApproved', {
      message_key: BridgeMessageKey.bcs,
    })
  }

  private static cachedBcs: ReturnType<typeof TokenTransferAlreadyApproved.instantiateBcs> | null =
    null

  static get bcs(): ReturnType<typeof TokenTransferAlreadyApproved.instantiateBcs> {
    if (!TokenTransferAlreadyApproved.cachedBcs) {
      TokenTransferAlreadyApproved.cachedBcs = TokenTransferAlreadyApproved.instantiateBcs()
    }
    return TokenTransferAlreadyApproved.cachedBcs
  }

  static fromFields(fields: Record<string, any>): TokenTransferAlreadyApproved {
    return TokenTransferAlreadyApproved.reified().new({
      messageKey: decodeFromFields(BridgeMessageKey.reified(), fields.message_key),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): TokenTransferAlreadyApproved {
    if (!isTokenTransferAlreadyApproved(item.type)) {
      throw new Error('not a TokenTransferAlreadyApproved type')
    }

    return TokenTransferAlreadyApproved.reified().new({
      messageKey: decodeFromFieldsWithTypes(BridgeMessageKey.reified(), item.fields.message_key),
    })
  }

  static fromBcs(data: Uint8Array): TokenTransferAlreadyApproved {
    return TokenTransferAlreadyApproved.fromFields(TokenTransferAlreadyApproved.bcs.parse(data))
  }

  toJSONField() {
    return {
      messageKey: this.messageKey.toJSONField(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): TokenTransferAlreadyApproved {
    return TokenTransferAlreadyApproved.reified().new({
      messageKey: decodeFromJSONField(BridgeMessageKey.reified(), field.messageKey),
    })
  }

  static fromJSON(json: Record<string, any>): TokenTransferAlreadyApproved {
    if (json.$typeName !== TokenTransferAlreadyApproved.$typeName) {
      throw new Error(
        `not a TokenTransferAlreadyApproved json object: expected '${TokenTransferAlreadyApproved.$typeName}' but got '${json.$typeName}'`
      )
    }

    return TokenTransferAlreadyApproved.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): TokenTransferAlreadyApproved {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isTokenTransferAlreadyApproved(content.type)) {
      throw new Error(
        `object at ${(content.fields as any).id} is not a TokenTransferAlreadyApproved object`
      )
    }
    return TokenTransferAlreadyApproved.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): TokenTransferAlreadyApproved {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isTokenTransferAlreadyApproved(data.bcs.type)) {
        throw new Error(`object at is not a TokenTransferAlreadyApproved object`)
      }

      return TokenTransferAlreadyApproved.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return TokenTransferAlreadyApproved.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<TokenTransferAlreadyApproved> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(
        `error fetching TokenTransferAlreadyApproved object at id ${id}: ${res.error.code}`
      )
    }
    if (
      res.data?.bcs?.dataType !== 'moveObject' ||
      !isTokenTransferAlreadyApproved(res.data.bcs.type)
    ) {
      throw new Error(`object at id ${id} is not a TokenTransferAlreadyApproved object`)
    }

    return TokenTransferAlreadyApproved.fromSuiObjectData(res.data)
  }
}

/* ============================== TokenTransferAlreadyClaimed =============================== */

export function isTokenTransferAlreadyClaimed(type: string): boolean {
  type = compressSuiType(type)
  return type === `0xb::bridge::TokenTransferAlreadyClaimed`
}

export interface TokenTransferAlreadyClaimedFields {
  messageKey: ToField<BridgeMessageKey>
}

export type TokenTransferAlreadyClaimedReified = Reified<
  TokenTransferAlreadyClaimed,
  TokenTransferAlreadyClaimedFields
>

export class TokenTransferAlreadyClaimed implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0xb::bridge::TokenTransferAlreadyClaimed`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = TokenTransferAlreadyClaimed.$typeName
  readonly $fullTypeName: `0xb::bridge::TokenTransferAlreadyClaimed`
  readonly $typeArgs: []
  readonly $isPhantom = TokenTransferAlreadyClaimed.$isPhantom

  readonly messageKey: ToField<BridgeMessageKey>

  private constructor(typeArgs: [], fields: TokenTransferAlreadyClaimedFields) {
    this.$fullTypeName = composeSuiType(
      TokenTransferAlreadyClaimed.$typeName,
      ...typeArgs
    ) as `0xb::bridge::TokenTransferAlreadyClaimed`
    this.$typeArgs = typeArgs

    this.messageKey = fields.messageKey
  }

  static reified(): TokenTransferAlreadyClaimedReified {
    const reifiedBcs = TokenTransferAlreadyClaimed.bcs
    return {
      typeName: TokenTransferAlreadyClaimed.$typeName,
      fullTypeName: composeSuiType(
        TokenTransferAlreadyClaimed.$typeName,
        ...[]
      ) as `0xb::bridge::TokenTransferAlreadyClaimed`,
      typeArgs: [] as [],
      isPhantom: TokenTransferAlreadyClaimed.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => TokenTransferAlreadyClaimed.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        TokenTransferAlreadyClaimed.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => TokenTransferAlreadyClaimed.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => TokenTransferAlreadyClaimed.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => TokenTransferAlreadyClaimed.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) =>
        TokenTransferAlreadyClaimed.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) =>
        TokenTransferAlreadyClaimed.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => TokenTransferAlreadyClaimed.fetch(client, id),
      new: (fields: TokenTransferAlreadyClaimedFields) => {
        return new TokenTransferAlreadyClaimed([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return TokenTransferAlreadyClaimed.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<TokenTransferAlreadyClaimed>> {
    return phantom(TokenTransferAlreadyClaimed.reified())
  }

  static get p() {
    return TokenTransferAlreadyClaimed.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('TokenTransferAlreadyClaimed', {
      message_key: BridgeMessageKey.bcs,
    })
  }

  private static cachedBcs: ReturnType<typeof TokenTransferAlreadyClaimed.instantiateBcs> | null =
    null

  static get bcs(): ReturnType<typeof TokenTransferAlreadyClaimed.instantiateBcs> {
    if (!TokenTransferAlreadyClaimed.cachedBcs) {
      TokenTransferAlreadyClaimed.cachedBcs = TokenTransferAlreadyClaimed.instantiateBcs()
    }
    return TokenTransferAlreadyClaimed.cachedBcs
  }

  static fromFields(fields: Record<string, any>): TokenTransferAlreadyClaimed {
    return TokenTransferAlreadyClaimed.reified().new({
      messageKey: decodeFromFields(BridgeMessageKey.reified(), fields.message_key),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): TokenTransferAlreadyClaimed {
    if (!isTokenTransferAlreadyClaimed(item.type)) {
      throw new Error('not a TokenTransferAlreadyClaimed type')
    }

    return TokenTransferAlreadyClaimed.reified().new({
      messageKey: decodeFromFieldsWithTypes(BridgeMessageKey.reified(), item.fields.message_key),
    })
  }

  static fromBcs(data: Uint8Array): TokenTransferAlreadyClaimed {
    return TokenTransferAlreadyClaimed.fromFields(TokenTransferAlreadyClaimed.bcs.parse(data))
  }

  toJSONField() {
    return {
      messageKey: this.messageKey.toJSONField(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): TokenTransferAlreadyClaimed {
    return TokenTransferAlreadyClaimed.reified().new({
      messageKey: decodeFromJSONField(BridgeMessageKey.reified(), field.messageKey),
    })
  }

  static fromJSON(json: Record<string, any>): TokenTransferAlreadyClaimed {
    if (json.$typeName !== TokenTransferAlreadyClaimed.$typeName) {
      throw new Error(
        `not a TokenTransferAlreadyClaimed json object: expected '${TokenTransferAlreadyClaimed.$typeName}' but got '${json.$typeName}'`
      )
    }

    return TokenTransferAlreadyClaimed.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): TokenTransferAlreadyClaimed {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isTokenTransferAlreadyClaimed(content.type)) {
      throw new Error(
        `object at ${(content.fields as any).id} is not a TokenTransferAlreadyClaimed object`
      )
    }
    return TokenTransferAlreadyClaimed.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): TokenTransferAlreadyClaimed {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isTokenTransferAlreadyClaimed(data.bcs.type)) {
        throw new Error(`object at is not a TokenTransferAlreadyClaimed object`)
      }

      return TokenTransferAlreadyClaimed.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return TokenTransferAlreadyClaimed.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<TokenTransferAlreadyClaimed> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(
        `error fetching TokenTransferAlreadyClaimed object at id ${id}: ${res.error.code}`
      )
    }
    if (
      res.data?.bcs?.dataType !== 'moveObject' ||
      !isTokenTransferAlreadyClaimed(res.data.bcs.type)
    ) {
      throw new Error(`object at id ${id} is not a TokenTransferAlreadyClaimed object`)
    }

    return TokenTransferAlreadyClaimed.fromSuiObjectData(res.data)
  }
}

/* ============================== TokenTransferLimitExceed =============================== */

export function isTokenTransferLimitExceed(type: string): boolean {
  type = compressSuiType(type)
  return type === `0xb::bridge::TokenTransferLimitExceed`
}

export interface TokenTransferLimitExceedFields {
  messageKey: ToField<BridgeMessageKey>
}

export type TokenTransferLimitExceedReified = Reified<
  TokenTransferLimitExceed,
  TokenTransferLimitExceedFields
>

export class TokenTransferLimitExceed implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0xb::bridge::TokenTransferLimitExceed`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = TokenTransferLimitExceed.$typeName
  readonly $fullTypeName: `0xb::bridge::TokenTransferLimitExceed`
  readonly $typeArgs: []
  readonly $isPhantom = TokenTransferLimitExceed.$isPhantom

  readonly messageKey: ToField<BridgeMessageKey>

  private constructor(typeArgs: [], fields: TokenTransferLimitExceedFields) {
    this.$fullTypeName = composeSuiType(
      TokenTransferLimitExceed.$typeName,
      ...typeArgs
    ) as `0xb::bridge::TokenTransferLimitExceed`
    this.$typeArgs = typeArgs

    this.messageKey = fields.messageKey
  }

  static reified(): TokenTransferLimitExceedReified {
    const reifiedBcs = TokenTransferLimitExceed.bcs
    return {
      typeName: TokenTransferLimitExceed.$typeName,
      fullTypeName: composeSuiType(
        TokenTransferLimitExceed.$typeName,
        ...[]
      ) as `0xb::bridge::TokenTransferLimitExceed`,
      typeArgs: [] as [],
      isPhantom: TokenTransferLimitExceed.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => TokenTransferLimitExceed.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        TokenTransferLimitExceed.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => TokenTransferLimitExceed.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => TokenTransferLimitExceed.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => TokenTransferLimitExceed.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) =>
        TokenTransferLimitExceed.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) =>
        TokenTransferLimitExceed.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => TokenTransferLimitExceed.fetch(client, id),
      new: (fields: TokenTransferLimitExceedFields) => {
        return new TokenTransferLimitExceed([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return TokenTransferLimitExceed.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<TokenTransferLimitExceed>> {
    return phantom(TokenTransferLimitExceed.reified())
  }

  static get p() {
    return TokenTransferLimitExceed.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('TokenTransferLimitExceed', {
      message_key: BridgeMessageKey.bcs,
    })
  }

  private static cachedBcs: ReturnType<typeof TokenTransferLimitExceed.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof TokenTransferLimitExceed.instantiateBcs> {
    if (!TokenTransferLimitExceed.cachedBcs) {
      TokenTransferLimitExceed.cachedBcs = TokenTransferLimitExceed.instantiateBcs()
    }
    return TokenTransferLimitExceed.cachedBcs
  }

  static fromFields(fields: Record<string, any>): TokenTransferLimitExceed {
    return TokenTransferLimitExceed.reified().new({
      messageKey: decodeFromFields(BridgeMessageKey.reified(), fields.message_key),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): TokenTransferLimitExceed {
    if (!isTokenTransferLimitExceed(item.type)) {
      throw new Error('not a TokenTransferLimitExceed type')
    }

    return TokenTransferLimitExceed.reified().new({
      messageKey: decodeFromFieldsWithTypes(BridgeMessageKey.reified(), item.fields.message_key),
    })
  }

  static fromBcs(data: Uint8Array): TokenTransferLimitExceed {
    return TokenTransferLimitExceed.fromFields(TokenTransferLimitExceed.bcs.parse(data))
  }

  toJSONField() {
    return {
      messageKey: this.messageKey.toJSONField(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): TokenTransferLimitExceed {
    return TokenTransferLimitExceed.reified().new({
      messageKey: decodeFromJSONField(BridgeMessageKey.reified(), field.messageKey),
    })
  }

  static fromJSON(json: Record<string, any>): TokenTransferLimitExceed {
    if (json.$typeName !== TokenTransferLimitExceed.$typeName) {
      throw new Error(
        `not a TokenTransferLimitExceed json object: expected '${TokenTransferLimitExceed.$typeName}' but got '${json.$typeName}'`
      )
    }

    return TokenTransferLimitExceed.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): TokenTransferLimitExceed {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isTokenTransferLimitExceed(content.type)) {
      throw new Error(
        `object at ${(content.fields as any).id} is not a TokenTransferLimitExceed object`
      )
    }
    return TokenTransferLimitExceed.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): TokenTransferLimitExceed {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isTokenTransferLimitExceed(data.bcs.type)) {
        throw new Error(`object at is not a TokenTransferLimitExceed object`)
      }

      return TokenTransferLimitExceed.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return TokenTransferLimitExceed.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<TokenTransferLimitExceed> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(
        `error fetching TokenTransferLimitExceed object at id ${id}: ${res.error.code}`
      )
    }
    if (
      res.data?.bcs?.dataType !== 'moveObject' ||
      !isTokenTransferLimitExceed(res.data.bcs.type)
    ) {
      throw new Error(`object at id ${id} is not a TokenTransferLimitExceed object`)
    }

    return TokenTransferLimitExceed.fromSuiObjectData(res.data)
  }
}
