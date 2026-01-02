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
import {
  FieldsWithTypes,
  composeSuiType,
  compressSuiType,
  parseTypeName,
} from '../../../../_framework/util'
import { Vector } from '../../../../_framework/vector'
import { String } from '../../../../move-stdlib/ascii/structs'
import { bcs } from '@mysten/sui/bcs'
import { SuiClient, SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromB64 } from '@mysten/sui/utils'

/* ============================== BridgeMessage =============================== */

export function isBridgeMessage(type: string): boolean {
  type = compressSuiType(type)
  return type === `0xb::message::BridgeMessage`
}

export interface BridgeMessageFields {
  messageType: ToField<'u8'>
  messageVersion: ToField<'u8'>
  seqNum: ToField<'u64'>
  sourceChain: ToField<'u8'>
  payload: ToField<Vector<'u8'>>
}

export type BridgeMessageReified = Reified<BridgeMessage, BridgeMessageFields>

export class BridgeMessage implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0xb::message::BridgeMessage`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = BridgeMessage.$typeName
  readonly $fullTypeName: `0xb::message::BridgeMessage`
  readonly $typeArgs: []
  readonly $isPhantom = BridgeMessage.$isPhantom

  readonly messageType: ToField<'u8'>
  readonly messageVersion: ToField<'u8'>
  readonly seqNum: ToField<'u64'>
  readonly sourceChain: ToField<'u8'>
  readonly payload: ToField<Vector<'u8'>>

  private constructor(typeArgs: [], fields: BridgeMessageFields) {
    this.$fullTypeName = composeSuiType(
      BridgeMessage.$typeName,
      ...typeArgs
    ) as `0xb::message::BridgeMessage`
    this.$typeArgs = typeArgs

    this.messageType = fields.messageType
    this.messageVersion = fields.messageVersion
    this.seqNum = fields.seqNum
    this.sourceChain = fields.sourceChain
    this.payload = fields.payload
  }

  static reified(): BridgeMessageReified {
    const reifiedBcs = BridgeMessage.bcs
    return {
      typeName: BridgeMessage.$typeName,
      fullTypeName: composeSuiType(BridgeMessage.$typeName, ...[]) as `0xb::message::BridgeMessage`,
      typeArgs: [] as [],
      isPhantom: BridgeMessage.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => BridgeMessage.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => BridgeMessage.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => BridgeMessage.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => BridgeMessage.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => BridgeMessage.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => BridgeMessage.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => BridgeMessage.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => BridgeMessage.fetch(client, id),
      new: (fields: BridgeMessageFields) => {
        return new BridgeMessage([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return BridgeMessage.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<BridgeMessage>> {
    return phantom(BridgeMessage.reified())
  }

  static get p() {
    return BridgeMessage.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('BridgeMessage', {
      message_type: bcs.u8(),
      message_version: bcs.u8(),
      seq_num: bcs.u64(),
      source_chain: bcs.u8(),
      payload: bcs.vector(bcs.u8()),
    })
  }

  private static cachedBcs: ReturnType<typeof BridgeMessage.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof BridgeMessage.instantiateBcs> {
    if (!BridgeMessage.cachedBcs) {
      BridgeMessage.cachedBcs = BridgeMessage.instantiateBcs()
    }
    return BridgeMessage.cachedBcs
  }

  static fromFields(fields: Record<string, any>): BridgeMessage {
    return BridgeMessage.reified().new({
      messageType: decodeFromFields('u8', fields.message_type),
      messageVersion: decodeFromFields('u8', fields.message_version),
      seqNum: decodeFromFields('u64', fields.seq_num),
      sourceChain: decodeFromFields('u8', fields.source_chain),
      payload: decodeFromFields(reified.vector('u8'), fields.payload),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): BridgeMessage {
    if (!isBridgeMessage(item.type)) {
      throw new Error('not a BridgeMessage type')
    }

    return BridgeMessage.reified().new({
      messageType: decodeFromFieldsWithTypes('u8', item.fields.message_type),
      messageVersion: decodeFromFieldsWithTypes('u8', item.fields.message_version),
      seqNum: decodeFromFieldsWithTypes('u64', item.fields.seq_num),
      sourceChain: decodeFromFieldsWithTypes('u8', item.fields.source_chain),
      payload: decodeFromFieldsWithTypes(reified.vector('u8'), item.fields.payload),
    })
  }

  static fromBcs(data: Uint8Array): BridgeMessage {
    return BridgeMessage.fromFields(BridgeMessage.bcs.parse(data))
  }

  toJSONField() {
    return {
      messageType: this.messageType,
      messageVersion: this.messageVersion,
      seqNum: this.seqNum.toString(),
      sourceChain: this.sourceChain,
      payload: fieldToJSON<Vector<'u8'>>(`vector<u8>`, this.payload),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): BridgeMessage {
    return BridgeMessage.reified().new({
      messageType: decodeFromJSONField('u8', field.messageType),
      messageVersion: decodeFromJSONField('u8', field.messageVersion),
      seqNum: decodeFromJSONField('u64', field.seqNum),
      sourceChain: decodeFromJSONField('u8', field.sourceChain),
      payload: decodeFromJSONField(reified.vector('u8'), field.payload),
    })
  }

  static fromJSON(json: Record<string, any>): BridgeMessage {
    if (json.$typeName !== BridgeMessage.$typeName) {
      throw new Error(
        `not a BridgeMessage json object: expected '${BridgeMessage.$typeName}' but got '${json.$typeName}'`
      )
    }

    return BridgeMessage.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): BridgeMessage {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isBridgeMessage(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a BridgeMessage object`)
    }
    return BridgeMessage.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): BridgeMessage {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isBridgeMessage(data.bcs.type)) {
        throw new Error(`object at is not a BridgeMessage object`)
      }

      return BridgeMessage.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return BridgeMessage.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<BridgeMessage> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching BridgeMessage object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isBridgeMessage(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a BridgeMessage object`)
    }

    return BridgeMessage.fromSuiObjectData(res.data)
  }
}

/* ============================== BridgeMessageKey =============================== */

export function isBridgeMessageKey(type: string): boolean {
  type = compressSuiType(type)
  return type === `0xb::message::BridgeMessageKey`
}

export interface BridgeMessageKeyFields {
  sourceChain: ToField<'u8'>
  messageType: ToField<'u8'>
  bridgeSeqNum: ToField<'u64'>
}

export type BridgeMessageKeyReified = Reified<BridgeMessageKey, BridgeMessageKeyFields>

export class BridgeMessageKey implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0xb::message::BridgeMessageKey`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = BridgeMessageKey.$typeName
  readonly $fullTypeName: `0xb::message::BridgeMessageKey`
  readonly $typeArgs: []
  readonly $isPhantom = BridgeMessageKey.$isPhantom

  readonly sourceChain: ToField<'u8'>
  readonly messageType: ToField<'u8'>
  readonly bridgeSeqNum: ToField<'u64'>

  private constructor(typeArgs: [], fields: BridgeMessageKeyFields) {
    this.$fullTypeName = composeSuiType(
      BridgeMessageKey.$typeName,
      ...typeArgs
    ) as `0xb::message::BridgeMessageKey`
    this.$typeArgs = typeArgs

    this.sourceChain = fields.sourceChain
    this.messageType = fields.messageType
    this.bridgeSeqNum = fields.bridgeSeqNum
  }

  static reified(): BridgeMessageKeyReified {
    const reifiedBcs = BridgeMessageKey.bcs
    return {
      typeName: BridgeMessageKey.$typeName,
      fullTypeName: composeSuiType(
        BridgeMessageKey.$typeName,
        ...[]
      ) as `0xb::message::BridgeMessageKey`,
      typeArgs: [] as [],
      isPhantom: BridgeMessageKey.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => BridgeMessageKey.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => BridgeMessageKey.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => BridgeMessageKey.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => BridgeMessageKey.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => BridgeMessageKey.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => BridgeMessageKey.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => BridgeMessageKey.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => BridgeMessageKey.fetch(client, id),
      new: (fields: BridgeMessageKeyFields) => {
        return new BridgeMessageKey([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return BridgeMessageKey.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<BridgeMessageKey>> {
    return phantom(BridgeMessageKey.reified())
  }

  static get p() {
    return BridgeMessageKey.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('BridgeMessageKey', {
      source_chain: bcs.u8(),
      message_type: bcs.u8(),
      bridge_seq_num: bcs.u64(),
    })
  }

  private static cachedBcs: ReturnType<typeof BridgeMessageKey.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof BridgeMessageKey.instantiateBcs> {
    if (!BridgeMessageKey.cachedBcs) {
      BridgeMessageKey.cachedBcs = BridgeMessageKey.instantiateBcs()
    }
    return BridgeMessageKey.cachedBcs
  }

  static fromFields(fields: Record<string, any>): BridgeMessageKey {
    return BridgeMessageKey.reified().new({
      sourceChain: decodeFromFields('u8', fields.source_chain),
      messageType: decodeFromFields('u8', fields.message_type),
      bridgeSeqNum: decodeFromFields('u64', fields.bridge_seq_num),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): BridgeMessageKey {
    if (!isBridgeMessageKey(item.type)) {
      throw new Error('not a BridgeMessageKey type')
    }

    return BridgeMessageKey.reified().new({
      sourceChain: decodeFromFieldsWithTypes('u8', item.fields.source_chain),
      messageType: decodeFromFieldsWithTypes('u8', item.fields.message_type),
      bridgeSeqNum: decodeFromFieldsWithTypes('u64', item.fields.bridge_seq_num),
    })
  }

  static fromBcs(data: Uint8Array): BridgeMessageKey {
    return BridgeMessageKey.fromFields(BridgeMessageKey.bcs.parse(data))
  }

  toJSONField() {
    return {
      sourceChain: this.sourceChain,
      messageType: this.messageType,
      bridgeSeqNum: this.bridgeSeqNum.toString(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): BridgeMessageKey {
    return BridgeMessageKey.reified().new({
      sourceChain: decodeFromJSONField('u8', field.sourceChain),
      messageType: decodeFromJSONField('u8', field.messageType),
      bridgeSeqNum: decodeFromJSONField('u64', field.bridgeSeqNum),
    })
  }

  static fromJSON(json: Record<string, any>): BridgeMessageKey {
    if (json.$typeName !== BridgeMessageKey.$typeName) {
      throw new Error(
        `not a BridgeMessageKey json object: expected '${BridgeMessageKey.$typeName}' but got '${json.$typeName}'`
      )
    }

    return BridgeMessageKey.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): BridgeMessageKey {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isBridgeMessageKey(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a BridgeMessageKey object`)
    }
    return BridgeMessageKey.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): BridgeMessageKey {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isBridgeMessageKey(data.bcs.type)) {
        throw new Error(`object at is not a BridgeMessageKey object`)
      }

      return BridgeMessageKey.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return BridgeMessageKey.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<BridgeMessageKey> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching BridgeMessageKey object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isBridgeMessageKey(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a BridgeMessageKey object`)
    }

    return BridgeMessageKey.fromSuiObjectData(res.data)
  }
}

/* ============================== TokenTransferPayload =============================== */

export function isTokenTransferPayload(type: string): boolean {
  type = compressSuiType(type)
  return type === `0xb::message::TokenTransferPayload`
}

export interface TokenTransferPayloadFields {
  senderAddress: ToField<Vector<'u8'>>
  targetChain: ToField<'u8'>
  targetAddress: ToField<Vector<'u8'>>
  tokenType: ToField<'u8'>
  amount: ToField<'u64'>
}

export type TokenTransferPayloadReified = Reified<TokenTransferPayload, TokenTransferPayloadFields>

export class TokenTransferPayload implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0xb::message::TokenTransferPayload`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = TokenTransferPayload.$typeName
  readonly $fullTypeName: `0xb::message::TokenTransferPayload`
  readonly $typeArgs: []
  readonly $isPhantom = TokenTransferPayload.$isPhantom

  readonly senderAddress: ToField<Vector<'u8'>>
  readonly targetChain: ToField<'u8'>
  readonly targetAddress: ToField<Vector<'u8'>>
  readonly tokenType: ToField<'u8'>
  readonly amount: ToField<'u64'>

  private constructor(typeArgs: [], fields: TokenTransferPayloadFields) {
    this.$fullTypeName = composeSuiType(
      TokenTransferPayload.$typeName,
      ...typeArgs
    ) as `0xb::message::TokenTransferPayload`
    this.$typeArgs = typeArgs

    this.senderAddress = fields.senderAddress
    this.targetChain = fields.targetChain
    this.targetAddress = fields.targetAddress
    this.tokenType = fields.tokenType
    this.amount = fields.amount
  }

  static reified(): TokenTransferPayloadReified {
    const reifiedBcs = TokenTransferPayload.bcs
    return {
      typeName: TokenTransferPayload.$typeName,
      fullTypeName: composeSuiType(
        TokenTransferPayload.$typeName,
        ...[]
      ) as `0xb::message::TokenTransferPayload`,
      typeArgs: [] as [],
      isPhantom: TokenTransferPayload.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => TokenTransferPayload.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        TokenTransferPayload.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => TokenTransferPayload.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => TokenTransferPayload.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => TokenTransferPayload.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) =>
        TokenTransferPayload.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) =>
        TokenTransferPayload.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => TokenTransferPayload.fetch(client, id),
      new: (fields: TokenTransferPayloadFields) => {
        return new TokenTransferPayload([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return TokenTransferPayload.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<TokenTransferPayload>> {
    return phantom(TokenTransferPayload.reified())
  }

  static get p() {
    return TokenTransferPayload.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('TokenTransferPayload', {
      sender_address: bcs.vector(bcs.u8()),
      target_chain: bcs.u8(),
      target_address: bcs.vector(bcs.u8()),
      token_type: bcs.u8(),
      amount: bcs.u64(),
    })
  }

  private static cachedBcs: ReturnType<typeof TokenTransferPayload.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof TokenTransferPayload.instantiateBcs> {
    if (!TokenTransferPayload.cachedBcs) {
      TokenTransferPayload.cachedBcs = TokenTransferPayload.instantiateBcs()
    }
    return TokenTransferPayload.cachedBcs
  }

  static fromFields(fields: Record<string, any>): TokenTransferPayload {
    return TokenTransferPayload.reified().new({
      senderAddress: decodeFromFields(reified.vector('u8'), fields.sender_address),
      targetChain: decodeFromFields('u8', fields.target_chain),
      targetAddress: decodeFromFields(reified.vector('u8'), fields.target_address),
      tokenType: decodeFromFields('u8', fields.token_type),
      amount: decodeFromFields('u64', fields.amount),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): TokenTransferPayload {
    if (!isTokenTransferPayload(item.type)) {
      throw new Error('not a TokenTransferPayload type')
    }

    return TokenTransferPayload.reified().new({
      senderAddress: decodeFromFieldsWithTypes(reified.vector('u8'), item.fields.sender_address),
      targetChain: decodeFromFieldsWithTypes('u8', item.fields.target_chain),
      targetAddress: decodeFromFieldsWithTypes(reified.vector('u8'), item.fields.target_address),
      tokenType: decodeFromFieldsWithTypes('u8', item.fields.token_type),
      amount: decodeFromFieldsWithTypes('u64', item.fields.amount),
    })
  }

  static fromBcs(data: Uint8Array): TokenTransferPayload {
    return TokenTransferPayload.fromFields(TokenTransferPayload.bcs.parse(data))
  }

  toJSONField() {
    return {
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

  static fromJSONField(field: any): TokenTransferPayload {
    return TokenTransferPayload.reified().new({
      senderAddress: decodeFromJSONField(reified.vector('u8'), field.senderAddress),
      targetChain: decodeFromJSONField('u8', field.targetChain),
      targetAddress: decodeFromJSONField(reified.vector('u8'), field.targetAddress),
      tokenType: decodeFromJSONField('u8', field.tokenType),
      amount: decodeFromJSONField('u64', field.amount),
    })
  }

  static fromJSON(json: Record<string, any>): TokenTransferPayload {
    if (json.$typeName !== TokenTransferPayload.$typeName) {
      throw new Error(
        `not a TokenTransferPayload json object: expected '${TokenTransferPayload.$typeName}' but got '${json.$typeName}'`
      )
    }

    return TokenTransferPayload.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): TokenTransferPayload {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isTokenTransferPayload(content.type)) {
      throw new Error(
        `object at ${(content.fields as any).id} is not a TokenTransferPayload object`
      )
    }
    return TokenTransferPayload.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): TokenTransferPayload {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isTokenTransferPayload(data.bcs.type)) {
        throw new Error(`object at is not a TokenTransferPayload object`)
      }

      return TokenTransferPayload.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return TokenTransferPayload.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<TokenTransferPayload> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching TokenTransferPayload object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isTokenTransferPayload(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a TokenTransferPayload object`)
    }

    return TokenTransferPayload.fromSuiObjectData(res.data)
  }
}

/* ============================== EmergencyOp =============================== */

export function isEmergencyOp(type: string): boolean {
  type = compressSuiType(type)
  return type === `0xb::message::EmergencyOp`
}

export interface EmergencyOpFields {
  opType: ToField<'u8'>
}

export type EmergencyOpReified = Reified<EmergencyOp, EmergencyOpFields>

export class EmergencyOp implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0xb::message::EmergencyOp`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = EmergencyOp.$typeName
  readonly $fullTypeName: `0xb::message::EmergencyOp`
  readonly $typeArgs: []
  readonly $isPhantom = EmergencyOp.$isPhantom

  readonly opType: ToField<'u8'>

  private constructor(typeArgs: [], fields: EmergencyOpFields) {
    this.$fullTypeName = composeSuiType(
      EmergencyOp.$typeName,
      ...typeArgs
    ) as `0xb::message::EmergencyOp`
    this.$typeArgs = typeArgs

    this.opType = fields.opType
  }

  static reified(): EmergencyOpReified {
    const reifiedBcs = EmergencyOp.bcs
    return {
      typeName: EmergencyOp.$typeName,
      fullTypeName: composeSuiType(EmergencyOp.$typeName, ...[]) as `0xb::message::EmergencyOp`,
      typeArgs: [] as [],
      isPhantom: EmergencyOp.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => EmergencyOp.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => EmergencyOp.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => EmergencyOp.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => EmergencyOp.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => EmergencyOp.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => EmergencyOp.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => EmergencyOp.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => EmergencyOp.fetch(client, id),
      new: (fields: EmergencyOpFields) => {
        return new EmergencyOp([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return EmergencyOp.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<EmergencyOp>> {
    return phantom(EmergencyOp.reified())
  }

  static get p() {
    return EmergencyOp.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('EmergencyOp', {
      op_type: bcs.u8(),
    })
  }

  private static cachedBcs: ReturnType<typeof EmergencyOp.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof EmergencyOp.instantiateBcs> {
    if (!EmergencyOp.cachedBcs) {
      EmergencyOp.cachedBcs = EmergencyOp.instantiateBcs()
    }
    return EmergencyOp.cachedBcs
  }

  static fromFields(fields: Record<string, any>): EmergencyOp {
    return EmergencyOp.reified().new({
      opType: decodeFromFields('u8', fields.op_type),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): EmergencyOp {
    if (!isEmergencyOp(item.type)) {
      throw new Error('not a EmergencyOp type')
    }

    return EmergencyOp.reified().new({
      opType: decodeFromFieldsWithTypes('u8', item.fields.op_type),
    })
  }

  static fromBcs(data: Uint8Array): EmergencyOp {
    return EmergencyOp.fromFields(EmergencyOp.bcs.parse(data))
  }

  toJSONField() {
    return {
      opType: this.opType,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): EmergencyOp {
    return EmergencyOp.reified().new({
      opType: decodeFromJSONField('u8', field.opType),
    })
  }

  static fromJSON(json: Record<string, any>): EmergencyOp {
    if (json.$typeName !== EmergencyOp.$typeName) {
      throw new Error(
        `not a EmergencyOp json object: expected '${EmergencyOp.$typeName}' but got '${json.$typeName}'`
      )
    }

    return EmergencyOp.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): EmergencyOp {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isEmergencyOp(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a EmergencyOp object`)
    }
    return EmergencyOp.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): EmergencyOp {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isEmergencyOp(data.bcs.type)) {
        throw new Error(`object at is not a EmergencyOp object`)
      }

      return EmergencyOp.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return EmergencyOp.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<EmergencyOp> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching EmergencyOp object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isEmergencyOp(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a EmergencyOp object`)
    }

    return EmergencyOp.fromSuiObjectData(res.data)
  }
}

/* ============================== Blocklist =============================== */

export function isBlocklist(type: string): boolean {
  type = compressSuiType(type)
  return type === `0xb::message::Blocklist`
}

export interface BlocklistFields {
  blocklistType: ToField<'u8'>
  validatorEthAddresses: ToField<Vector<Vector<'u8'>>>
}

export type BlocklistReified = Reified<Blocklist, BlocklistFields>

export class Blocklist implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0xb::message::Blocklist`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = Blocklist.$typeName
  readonly $fullTypeName: `0xb::message::Blocklist`
  readonly $typeArgs: []
  readonly $isPhantom = Blocklist.$isPhantom

  readonly blocklistType: ToField<'u8'>
  readonly validatorEthAddresses: ToField<Vector<Vector<'u8'>>>

  private constructor(typeArgs: [], fields: BlocklistFields) {
    this.$fullTypeName = composeSuiType(
      Blocklist.$typeName,
      ...typeArgs
    ) as `0xb::message::Blocklist`
    this.$typeArgs = typeArgs

    this.blocklistType = fields.blocklistType
    this.validatorEthAddresses = fields.validatorEthAddresses
  }

  static reified(): BlocklistReified {
    const reifiedBcs = Blocklist.bcs
    return {
      typeName: Blocklist.$typeName,
      fullTypeName: composeSuiType(Blocklist.$typeName, ...[]) as `0xb::message::Blocklist`,
      typeArgs: [] as [],
      isPhantom: Blocklist.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => Blocklist.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Blocklist.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => Blocklist.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => Blocklist.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => Blocklist.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => Blocklist.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => Blocklist.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => Blocklist.fetch(client, id),
      new: (fields: BlocklistFields) => {
        return new Blocklist([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Blocklist.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<Blocklist>> {
    return phantom(Blocklist.reified())
  }

  static get p() {
    return Blocklist.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('Blocklist', {
      blocklist_type: bcs.u8(),
      validator_eth_addresses: bcs.vector(bcs.vector(bcs.u8())),
    })
  }

  private static cachedBcs: ReturnType<typeof Blocklist.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof Blocklist.instantiateBcs> {
    if (!Blocklist.cachedBcs) {
      Blocklist.cachedBcs = Blocklist.instantiateBcs()
    }
    return Blocklist.cachedBcs
  }

  static fromFields(fields: Record<string, any>): Blocklist {
    return Blocklist.reified().new({
      blocklistType: decodeFromFields('u8', fields.blocklist_type),
      validatorEthAddresses: decodeFromFields(
        reified.vector(reified.vector('u8')),
        fields.validator_eth_addresses
      ),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Blocklist {
    if (!isBlocklist(item.type)) {
      throw new Error('not a Blocklist type')
    }

    return Blocklist.reified().new({
      blocklistType: decodeFromFieldsWithTypes('u8', item.fields.blocklist_type),
      validatorEthAddresses: decodeFromFieldsWithTypes(
        reified.vector(reified.vector('u8')),
        item.fields.validator_eth_addresses
      ),
    })
  }

  static fromBcs(data: Uint8Array): Blocklist {
    return Blocklist.fromFields(Blocklist.bcs.parse(data))
  }

  toJSONField() {
    return {
      blocklistType: this.blocklistType,
      validatorEthAddresses: fieldToJSON<Vector<Vector<'u8'>>>(
        `vector<vector<u8>>`,
        this.validatorEthAddresses
      ),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): Blocklist {
    return Blocklist.reified().new({
      blocklistType: decodeFromJSONField('u8', field.blocklistType),
      validatorEthAddresses: decodeFromJSONField(
        reified.vector(reified.vector('u8')),
        field.validatorEthAddresses
      ),
    })
  }

  static fromJSON(json: Record<string, any>): Blocklist {
    if (json.$typeName !== Blocklist.$typeName) {
      throw new Error(
        `not a Blocklist json object: expected '${Blocklist.$typeName}' but got '${json.$typeName}'`
      )
    }

    return Blocklist.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): Blocklist {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isBlocklist(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Blocklist object`)
    }
    return Blocklist.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): Blocklist {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isBlocklist(data.bcs.type)) {
        throw new Error(`object at is not a Blocklist object`)
      }

      return Blocklist.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Blocklist.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<Blocklist> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching Blocklist object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isBlocklist(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a Blocklist object`)
    }

    return Blocklist.fromSuiObjectData(res.data)
  }
}

/* ============================== UpdateBridgeLimit =============================== */

export function isUpdateBridgeLimit(type: string): boolean {
  type = compressSuiType(type)
  return type === `0xb::message::UpdateBridgeLimit`
}

export interface UpdateBridgeLimitFields {
  receivingChain: ToField<'u8'>
  sendingChain: ToField<'u8'>
  limit: ToField<'u64'>
}

export type UpdateBridgeLimitReified = Reified<UpdateBridgeLimit, UpdateBridgeLimitFields>

export class UpdateBridgeLimit implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0xb::message::UpdateBridgeLimit`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = UpdateBridgeLimit.$typeName
  readonly $fullTypeName: `0xb::message::UpdateBridgeLimit`
  readonly $typeArgs: []
  readonly $isPhantom = UpdateBridgeLimit.$isPhantom

  readonly receivingChain: ToField<'u8'>
  readonly sendingChain: ToField<'u8'>
  readonly limit: ToField<'u64'>

  private constructor(typeArgs: [], fields: UpdateBridgeLimitFields) {
    this.$fullTypeName = composeSuiType(
      UpdateBridgeLimit.$typeName,
      ...typeArgs
    ) as `0xb::message::UpdateBridgeLimit`
    this.$typeArgs = typeArgs

    this.receivingChain = fields.receivingChain
    this.sendingChain = fields.sendingChain
    this.limit = fields.limit
  }

  static reified(): UpdateBridgeLimitReified {
    const reifiedBcs = UpdateBridgeLimit.bcs
    return {
      typeName: UpdateBridgeLimit.$typeName,
      fullTypeName: composeSuiType(
        UpdateBridgeLimit.$typeName,
        ...[]
      ) as `0xb::message::UpdateBridgeLimit`,
      typeArgs: [] as [],
      isPhantom: UpdateBridgeLimit.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => UpdateBridgeLimit.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => UpdateBridgeLimit.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => UpdateBridgeLimit.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => UpdateBridgeLimit.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => UpdateBridgeLimit.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => UpdateBridgeLimit.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => UpdateBridgeLimit.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => UpdateBridgeLimit.fetch(client, id),
      new: (fields: UpdateBridgeLimitFields) => {
        return new UpdateBridgeLimit([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return UpdateBridgeLimit.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<UpdateBridgeLimit>> {
    return phantom(UpdateBridgeLimit.reified())
  }

  static get p() {
    return UpdateBridgeLimit.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('UpdateBridgeLimit', {
      receiving_chain: bcs.u8(),
      sending_chain: bcs.u8(),
      limit: bcs.u64(),
    })
  }

  private static cachedBcs: ReturnType<typeof UpdateBridgeLimit.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof UpdateBridgeLimit.instantiateBcs> {
    if (!UpdateBridgeLimit.cachedBcs) {
      UpdateBridgeLimit.cachedBcs = UpdateBridgeLimit.instantiateBcs()
    }
    return UpdateBridgeLimit.cachedBcs
  }

  static fromFields(fields: Record<string, any>): UpdateBridgeLimit {
    return UpdateBridgeLimit.reified().new({
      receivingChain: decodeFromFields('u8', fields.receiving_chain),
      sendingChain: decodeFromFields('u8', fields.sending_chain),
      limit: decodeFromFields('u64', fields.limit),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): UpdateBridgeLimit {
    if (!isUpdateBridgeLimit(item.type)) {
      throw new Error('not a UpdateBridgeLimit type')
    }

    return UpdateBridgeLimit.reified().new({
      receivingChain: decodeFromFieldsWithTypes('u8', item.fields.receiving_chain),
      sendingChain: decodeFromFieldsWithTypes('u8', item.fields.sending_chain),
      limit: decodeFromFieldsWithTypes('u64', item.fields.limit),
    })
  }

  static fromBcs(data: Uint8Array): UpdateBridgeLimit {
    return UpdateBridgeLimit.fromFields(UpdateBridgeLimit.bcs.parse(data))
  }

  toJSONField() {
    return {
      receivingChain: this.receivingChain,
      sendingChain: this.sendingChain,
      limit: this.limit.toString(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): UpdateBridgeLimit {
    return UpdateBridgeLimit.reified().new({
      receivingChain: decodeFromJSONField('u8', field.receivingChain),
      sendingChain: decodeFromJSONField('u8', field.sendingChain),
      limit: decodeFromJSONField('u64', field.limit),
    })
  }

  static fromJSON(json: Record<string, any>): UpdateBridgeLimit {
    if (json.$typeName !== UpdateBridgeLimit.$typeName) {
      throw new Error(
        `not a UpdateBridgeLimit json object: expected '${UpdateBridgeLimit.$typeName}' but got '${json.$typeName}'`
      )
    }

    return UpdateBridgeLimit.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): UpdateBridgeLimit {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isUpdateBridgeLimit(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a UpdateBridgeLimit object`)
    }
    return UpdateBridgeLimit.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): UpdateBridgeLimit {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isUpdateBridgeLimit(data.bcs.type)) {
        throw new Error(`object at is not a UpdateBridgeLimit object`)
      }

      return UpdateBridgeLimit.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return UpdateBridgeLimit.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<UpdateBridgeLimit> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching UpdateBridgeLimit object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isUpdateBridgeLimit(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a UpdateBridgeLimit object`)
    }

    return UpdateBridgeLimit.fromSuiObjectData(res.data)
  }
}

/* ============================== UpdateAssetPrice =============================== */

export function isUpdateAssetPrice(type: string): boolean {
  type = compressSuiType(type)
  return type === `0xb::message::UpdateAssetPrice`
}

export interface UpdateAssetPriceFields {
  tokenId: ToField<'u8'>
  newPrice: ToField<'u64'>
}

export type UpdateAssetPriceReified = Reified<UpdateAssetPrice, UpdateAssetPriceFields>

export class UpdateAssetPrice implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0xb::message::UpdateAssetPrice`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = UpdateAssetPrice.$typeName
  readonly $fullTypeName: `0xb::message::UpdateAssetPrice`
  readonly $typeArgs: []
  readonly $isPhantom = UpdateAssetPrice.$isPhantom

  readonly tokenId: ToField<'u8'>
  readonly newPrice: ToField<'u64'>

  private constructor(typeArgs: [], fields: UpdateAssetPriceFields) {
    this.$fullTypeName = composeSuiType(
      UpdateAssetPrice.$typeName,
      ...typeArgs
    ) as `0xb::message::UpdateAssetPrice`
    this.$typeArgs = typeArgs

    this.tokenId = fields.tokenId
    this.newPrice = fields.newPrice
  }

  static reified(): UpdateAssetPriceReified {
    const reifiedBcs = UpdateAssetPrice.bcs
    return {
      typeName: UpdateAssetPrice.$typeName,
      fullTypeName: composeSuiType(
        UpdateAssetPrice.$typeName,
        ...[]
      ) as `0xb::message::UpdateAssetPrice`,
      typeArgs: [] as [],
      isPhantom: UpdateAssetPrice.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => UpdateAssetPrice.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => UpdateAssetPrice.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => UpdateAssetPrice.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => UpdateAssetPrice.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => UpdateAssetPrice.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => UpdateAssetPrice.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => UpdateAssetPrice.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => UpdateAssetPrice.fetch(client, id),
      new: (fields: UpdateAssetPriceFields) => {
        return new UpdateAssetPrice([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return UpdateAssetPrice.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<UpdateAssetPrice>> {
    return phantom(UpdateAssetPrice.reified())
  }

  static get p() {
    return UpdateAssetPrice.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('UpdateAssetPrice', {
      token_id: bcs.u8(),
      new_price: bcs.u64(),
    })
  }

  private static cachedBcs: ReturnType<typeof UpdateAssetPrice.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof UpdateAssetPrice.instantiateBcs> {
    if (!UpdateAssetPrice.cachedBcs) {
      UpdateAssetPrice.cachedBcs = UpdateAssetPrice.instantiateBcs()
    }
    return UpdateAssetPrice.cachedBcs
  }

  static fromFields(fields: Record<string, any>): UpdateAssetPrice {
    return UpdateAssetPrice.reified().new({
      tokenId: decodeFromFields('u8', fields.token_id),
      newPrice: decodeFromFields('u64', fields.new_price),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): UpdateAssetPrice {
    if (!isUpdateAssetPrice(item.type)) {
      throw new Error('not a UpdateAssetPrice type')
    }

    return UpdateAssetPrice.reified().new({
      tokenId: decodeFromFieldsWithTypes('u8', item.fields.token_id),
      newPrice: decodeFromFieldsWithTypes('u64', item.fields.new_price),
    })
  }

  static fromBcs(data: Uint8Array): UpdateAssetPrice {
    return UpdateAssetPrice.fromFields(UpdateAssetPrice.bcs.parse(data))
  }

  toJSONField() {
    return {
      tokenId: this.tokenId,
      newPrice: this.newPrice.toString(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): UpdateAssetPrice {
    return UpdateAssetPrice.reified().new({
      tokenId: decodeFromJSONField('u8', field.tokenId),
      newPrice: decodeFromJSONField('u64', field.newPrice),
    })
  }

  static fromJSON(json: Record<string, any>): UpdateAssetPrice {
    if (json.$typeName !== UpdateAssetPrice.$typeName) {
      throw new Error(
        `not a UpdateAssetPrice json object: expected '${UpdateAssetPrice.$typeName}' but got '${json.$typeName}'`
      )
    }

    return UpdateAssetPrice.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): UpdateAssetPrice {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isUpdateAssetPrice(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a UpdateAssetPrice object`)
    }
    return UpdateAssetPrice.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): UpdateAssetPrice {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isUpdateAssetPrice(data.bcs.type)) {
        throw new Error(`object at is not a UpdateAssetPrice object`)
      }

      return UpdateAssetPrice.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return UpdateAssetPrice.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<UpdateAssetPrice> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching UpdateAssetPrice object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isUpdateAssetPrice(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a UpdateAssetPrice object`)
    }

    return UpdateAssetPrice.fromSuiObjectData(res.data)
  }
}

/* ============================== AddTokenOnSui =============================== */

export function isAddTokenOnSui(type: string): boolean {
  type = compressSuiType(type)
  return type === `0xb::message::AddTokenOnSui`
}

export interface AddTokenOnSuiFields {
  nativeToken: ToField<'bool'>
  tokenIds: ToField<Vector<'u8'>>
  tokenTypeNames: ToField<Vector<String>>
  tokenPrices: ToField<Vector<'u64'>>
}

export type AddTokenOnSuiReified = Reified<AddTokenOnSui, AddTokenOnSuiFields>

export class AddTokenOnSui implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0xb::message::AddTokenOnSui`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = AddTokenOnSui.$typeName
  readonly $fullTypeName: `0xb::message::AddTokenOnSui`
  readonly $typeArgs: []
  readonly $isPhantom = AddTokenOnSui.$isPhantom

  readonly nativeToken: ToField<'bool'>
  readonly tokenIds: ToField<Vector<'u8'>>
  readonly tokenTypeNames: ToField<Vector<String>>
  readonly tokenPrices: ToField<Vector<'u64'>>

  private constructor(typeArgs: [], fields: AddTokenOnSuiFields) {
    this.$fullTypeName = composeSuiType(
      AddTokenOnSui.$typeName,
      ...typeArgs
    ) as `0xb::message::AddTokenOnSui`
    this.$typeArgs = typeArgs

    this.nativeToken = fields.nativeToken
    this.tokenIds = fields.tokenIds
    this.tokenTypeNames = fields.tokenTypeNames
    this.tokenPrices = fields.tokenPrices
  }

  static reified(): AddTokenOnSuiReified {
    const reifiedBcs = AddTokenOnSui.bcs
    return {
      typeName: AddTokenOnSui.$typeName,
      fullTypeName: composeSuiType(AddTokenOnSui.$typeName, ...[]) as `0xb::message::AddTokenOnSui`,
      typeArgs: [] as [],
      isPhantom: AddTokenOnSui.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => AddTokenOnSui.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => AddTokenOnSui.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => AddTokenOnSui.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => AddTokenOnSui.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => AddTokenOnSui.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => AddTokenOnSui.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => AddTokenOnSui.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => AddTokenOnSui.fetch(client, id),
      new: (fields: AddTokenOnSuiFields) => {
        return new AddTokenOnSui([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return AddTokenOnSui.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<AddTokenOnSui>> {
    return phantom(AddTokenOnSui.reified())
  }

  static get p() {
    return AddTokenOnSui.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('AddTokenOnSui', {
      native_token: bcs.bool(),
      token_ids: bcs.vector(bcs.u8()),
      token_type_names: bcs.vector(String.bcs),
      token_prices: bcs.vector(bcs.u64()),
    })
  }

  private static cachedBcs: ReturnType<typeof AddTokenOnSui.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof AddTokenOnSui.instantiateBcs> {
    if (!AddTokenOnSui.cachedBcs) {
      AddTokenOnSui.cachedBcs = AddTokenOnSui.instantiateBcs()
    }
    return AddTokenOnSui.cachedBcs
  }

  static fromFields(fields: Record<string, any>): AddTokenOnSui {
    return AddTokenOnSui.reified().new({
      nativeToken: decodeFromFields('bool', fields.native_token),
      tokenIds: decodeFromFields(reified.vector('u8'), fields.token_ids),
      tokenTypeNames: decodeFromFields(reified.vector(String.reified()), fields.token_type_names),
      tokenPrices: decodeFromFields(reified.vector('u64'), fields.token_prices),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): AddTokenOnSui {
    if (!isAddTokenOnSui(item.type)) {
      throw new Error('not a AddTokenOnSui type')
    }

    return AddTokenOnSui.reified().new({
      nativeToken: decodeFromFieldsWithTypes('bool', item.fields.native_token),
      tokenIds: decodeFromFieldsWithTypes(reified.vector('u8'), item.fields.token_ids),
      tokenTypeNames: decodeFromFieldsWithTypes(
        reified.vector(String.reified()),
        item.fields.token_type_names
      ),
      tokenPrices: decodeFromFieldsWithTypes(reified.vector('u64'), item.fields.token_prices),
    })
  }

  static fromBcs(data: Uint8Array): AddTokenOnSui {
    return AddTokenOnSui.fromFields(AddTokenOnSui.bcs.parse(data))
  }

  toJSONField() {
    return {
      nativeToken: this.nativeToken,
      tokenIds: fieldToJSON<Vector<'u8'>>(`vector<u8>`, this.tokenIds),
      tokenTypeNames: fieldToJSON<Vector<String>>(
        `vector<${String.$typeName}>`,
        this.tokenTypeNames
      ),
      tokenPrices: fieldToJSON<Vector<'u64'>>(`vector<u64>`, this.tokenPrices),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): AddTokenOnSui {
    return AddTokenOnSui.reified().new({
      nativeToken: decodeFromJSONField('bool', field.nativeToken),
      tokenIds: decodeFromJSONField(reified.vector('u8'), field.tokenIds),
      tokenTypeNames: decodeFromJSONField(reified.vector(String.reified()), field.tokenTypeNames),
      tokenPrices: decodeFromJSONField(reified.vector('u64'), field.tokenPrices),
    })
  }

  static fromJSON(json: Record<string, any>): AddTokenOnSui {
    if (json.$typeName !== AddTokenOnSui.$typeName) {
      throw new Error(
        `not a AddTokenOnSui json object: expected '${AddTokenOnSui.$typeName}' but got '${json.$typeName}'`
      )
    }

    return AddTokenOnSui.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): AddTokenOnSui {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isAddTokenOnSui(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a AddTokenOnSui object`)
    }
    return AddTokenOnSui.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): AddTokenOnSui {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isAddTokenOnSui(data.bcs.type)) {
        throw new Error(`object at is not a AddTokenOnSui object`)
      }

      return AddTokenOnSui.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return AddTokenOnSui.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<AddTokenOnSui> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching AddTokenOnSui object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isAddTokenOnSui(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a AddTokenOnSui object`)
    }

    return AddTokenOnSui.fromSuiObjectData(res.data)
  }
}

/* ============================== ParsedTokenTransferMessage =============================== */

export function isParsedTokenTransferMessage(type: string): boolean {
  type = compressSuiType(type)
  return type === `0xb::message::ParsedTokenTransferMessage`
}

export interface ParsedTokenTransferMessageFields {
  messageVersion: ToField<'u8'>
  seqNum: ToField<'u64'>
  sourceChain: ToField<'u8'>
  payload: ToField<Vector<'u8'>>
  parsedPayload: ToField<TokenTransferPayload>
}

export type ParsedTokenTransferMessageReified = Reified<
  ParsedTokenTransferMessage,
  ParsedTokenTransferMessageFields
>

export class ParsedTokenTransferMessage implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0xb::message::ParsedTokenTransferMessage`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = ParsedTokenTransferMessage.$typeName
  readonly $fullTypeName: `0xb::message::ParsedTokenTransferMessage`
  readonly $typeArgs: []
  readonly $isPhantom = ParsedTokenTransferMessage.$isPhantom

  readonly messageVersion: ToField<'u8'>
  readonly seqNum: ToField<'u64'>
  readonly sourceChain: ToField<'u8'>
  readonly payload: ToField<Vector<'u8'>>
  readonly parsedPayload: ToField<TokenTransferPayload>

  private constructor(typeArgs: [], fields: ParsedTokenTransferMessageFields) {
    this.$fullTypeName = composeSuiType(
      ParsedTokenTransferMessage.$typeName,
      ...typeArgs
    ) as `0xb::message::ParsedTokenTransferMessage`
    this.$typeArgs = typeArgs

    this.messageVersion = fields.messageVersion
    this.seqNum = fields.seqNum
    this.sourceChain = fields.sourceChain
    this.payload = fields.payload
    this.parsedPayload = fields.parsedPayload
  }

  static reified(): ParsedTokenTransferMessageReified {
    const reifiedBcs = ParsedTokenTransferMessage.bcs
    return {
      typeName: ParsedTokenTransferMessage.$typeName,
      fullTypeName: composeSuiType(
        ParsedTokenTransferMessage.$typeName,
        ...[]
      ) as `0xb::message::ParsedTokenTransferMessage`,
      typeArgs: [] as [],
      isPhantom: ParsedTokenTransferMessage.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => ParsedTokenTransferMessage.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        ParsedTokenTransferMessage.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => ParsedTokenTransferMessage.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => ParsedTokenTransferMessage.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => ParsedTokenTransferMessage.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) =>
        ParsedTokenTransferMessage.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) =>
        ParsedTokenTransferMessage.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => ParsedTokenTransferMessage.fetch(client, id),
      new: (fields: ParsedTokenTransferMessageFields) => {
        return new ParsedTokenTransferMessage([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return ParsedTokenTransferMessage.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<ParsedTokenTransferMessage>> {
    return phantom(ParsedTokenTransferMessage.reified())
  }

  static get p() {
    return ParsedTokenTransferMessage.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('ParsedTokenTransferMessage', {
      message_version: bcs.u8(),
      seq_num: bcs.u64(),
      source_chain: bcs.u8(),
      payload: bcs.vector(bcs.u8()),
      parsed_payload: TokenTransferPayload.bcs,
    })
  }

  private static cachedBcs: ReturnType<typeof ParsedTokenTransferMessage.instantiateBcs> | null =
    null

  static get bcs(): ReturnType<typeof ParsedTokenTransferMessage.instantiateBcs> {
    if (!ParsedTokenTransferMessage.cachedBcs) {
      ParsedTokenTransferMessage.cachedBcs = ParsedTokenTransferMessage.instantiateBcs()
    }
    return ParsedTokenTransferMessage.cachedBcs
  }

  static fromFields(fields: Record<string, any>): ParsedTokenTransferMessage {
    return ParsedTokenTransferMessage.reified().new({
      messageVersion: decodeFromFields('u8', fields.message_version),
      seqNum: decodeFromFields('u64', fields.seq_num),
      sourceChain: decodeFromFields('u8', fields.source_chain),
      payload: decodeFromFields(reified.vector('u8'), fields.payload),
      parsedPayload: decodeFromFields(TokenTransferPayload.reified(), fields.parsed_payload),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): ParsedTokenTransferMessage {
    if (!isParsedTokenTransferMessage(item.type)) {
      throw new Error('not a ParsedTokenTransferMessage type')
    }

    return ParsedTokenTransferMessage.reified().new({
      messageVersion: decodeFromFieldsWithTypes('u8', item.fields.message_version),
      seqNum: decodeFromFieldsWithTypes('u64', item.fields.seq_num),
      sourceChain: decodeFromFieldsWithTypes('u8', item.fields.source_chain),
      payload: decodeFromFieldsWithTypes(reified.vector('u8'), item.fields.payload),
      parsedPayload: decodeFromFieldsWithTypes(
        TokenTransferPayload.reified(),
        item.fields.parsed_payload
      ),
    })
  }

  static fromBcs(data: Uint8Array): ParsedTokenTransferMessage {
    return ParsedTokenTransferMessage.fromFields(ParsedTokenTransferMessage.bcs.parse(data))
  }

  toJSONField() {
    return {
      messageVersion: this.messageVersion,
      seqNum: this.seqNum.toString(),
      sourceChain: this.sourceChain,
      payload: fieldToJSON<Vector<'u8'>>(`vector<u8>`, this.payload),
      parsedPayload: this.parsedPayload.toJSONField(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): ParsedTokenTransferMessage {
    return ParsedTokenTransferMessage.reified().new({
      messageVersion: decodeFromJSONField('u8', field.messageVersion),
      seqNum: decodeFromJSONField('u64', field.seqNum),
      sourceChain: decodeFromJSONField('u8', field.sourceChain),
      payload: decodeFromJSONField(reified.vector('u8'), field.payload),
      parsedPayload: decodeFromJSONField(TokenTransferPayload.reified(), field.parsedPayload),
    })
  }

  static fromJSON(json: Record<string, any>): ParsedTokenTransferMessage {
    if (json.$typeName !== ParsedTokenTransferMessage.$typeName) {
      throw new Error(
        `not a ParsedTokenTransferMessage json object: expected '${ParsedTokenTransferMessage.$typeName}' but got '${json.$typeName}'`
      )
    }

    return ParsedTokenTransferMessage.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): ParsedTokenTransferMessage {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isParsedTokenTransferMessage(content.type)) {
      throw new Error(
        `object at ${(content.fields as any).id} is not a ParsedTokenTransferMessage object`
      )
    }
    return ParsedTokenTransferMessage.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): ParsedTokenTransferMessage {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isParsedTokenTransferMessage(data.bcs.type)) {
        throw new Error(`object at is not a ParsedTokenTransferMessage object`)
      }

      return ParsedTokenTransferMessage.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return ParsedTokenTransferMessage.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<ParsedTokenTransferMessage> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(
        `error fetching ParsedTokenTransferMessage object at id ${id}: ${res.error.code}`
      )
    }
    if (
      res.data?.bcs?.dataType !== 'moveObject' ||
      !isParsedTokenTransferMessage(res.data.bcs.type)
    ) {
      throw new Error(`object at id ${id} is not a ParsedTokenTransferMessage object`)
    }

    return ParsedTokenTransferMessage.fromSuiObjectData(res.data)
  }
}
