import {
  PhantomReified,
  Reified,
  StructClass,
  ToField,
  ToJSON,
  ToTypeStr,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  fieldToJSON,
  phantom,
  vector,
} from '../../_framework/reified'
import {
  FieldsWithTypes,
  SupportedSuiClient,
  composeSuiType,
  compressSuiType,
  fetchObjectBcs,
} from '../../_framework/util'
import { Vector } from '../../_framework/vector'
import { bcs } from '@mysten/sui/bcs'
import { SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromBase64, fromHex, toHex } from '@mysten/sui/utils'

/* ============================== TxContext =============================== */

export function isTxContext(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::tx_context::TxContext`
}

export interface TxContextFields {
  /** The address of the user that signed the current transaction */
  sender: ToField<'address'>
  /** Hash of the current transaction */
  txHash: ToField<Vector<'u8'>>
  /** The current epoch number */
  epoch: ToField<'u64'>
  /** Timestamp that the epoch started at */
  epochTimestampMs: ToField<'u64'>
  /**
   * Counter recording the number of fresh id's created while executing
   * this transaction. Always 0 at the start of a transaction
   */
  idsCreated: ToField<'u64'>
}

export type TxContextReified = Reified<TxContext, TxContextFields>

export type TxContextJSONField = {
  sender: string
  txHash: number[]
  epoch: string
  epochTimestampMs: string
  idsCreated: string
}

export type TxContextJSON = {
  $typeName: typeof TxContext.$typeName
  $typeArgs: []
} & TxContextJSONField

/**
 * Information about the transaction currently being executed.
 * This cannot be constructed by a transaction--it is a privileged object created by
 * the VM and passed in to the entrypoint of the transaction as `&mut TxContext`.
 */
export class TxContext implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::tx_context::TxContext` = `0x2::tx_context::TxContext` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName: typeof TxContext.$typeName = TxContext.$typeName
  readonly $fullTypeName: `0x2::tx_context::TxContext`
  readonly $typeArgs: []
  readonly $isPhantom: typeof TxContext.$isPhantom = TxContext.$isPhantom

  /** The address of the user that signed the current transaction */
  readonly sender: ToField<'address'>
  /** Hash of the current transaction */
  readonly txHash: ToField<Vector<'u8'>>
  /** The current epoch number */
  readonly epoch: ToField<'u64'>
  /** Timestamp that the epoch started at */
  readonly epochTimestampMs: ToField<'u64'>
  /**
   * Counter recording the number of fresh id's created while executing
   * this transaction. Always 0 at the start of a transaction
   */
  readonly idsCreated: ToField<'u64'>

  private constructor(typeArgs: [], fields: TxContextFields) {
    this.$fullTypeName = composeSuiType(
      TxContext.$typeName,
      ...typeArgs
    ) as `0x2::tx_context::TxContext`
    this.$typeArgs = typeArgs

    this.sender = fields.sender
    this.txHash = fields.txHash
    this.epoch = fields.epoch
    this.epochTimestampMs = fields.epochTimestampMs
    this.idsCreated = fields.idsCreated
  }

  static reified(): TxContextReified {
    const reifiedBcs = TxContext.bcs
    return {
      typeName: TxContext.$typeName,
      fullTypeName: composeSuiType(TxContext.$typeName, ...[]) as `0x2::tx_context::TxContext`,
      typeArgs: [] as [],
      isPhantom: TxContext.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => TxContext.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => TxContext.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => TxContext.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => TxContext.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => TxContext.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => TxContext.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => TxContext.fromSuiObjectData(content),
      fetch: async (client: SupportedSuiClient, id: string) => TxContext.fetch(client, id),
      new: (fields: TxContextFields) => {
        return new TxContext([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): TxContextReified {
    return TxContext.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<TxContext>> {
    return phantom(TxContext.reified())
  }

  static get p(): PhantomReified<ToTypeStr<TxContext>> {
    return TxContext.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('TxContext', {
      sender: bcs.bytes(32).transform({
        input: (val: string) => fromHex(val),
        output: (val: Uint8Array) => toHex(val),
      }),
      tx_hash: bcs.vector(bcs.u8()),
      epoch: bcs.u64(),
      epoch_timestamp_ms: bcs.u64(),
      ids_created: bcs.u64(),
    })
  }

  private static cachedBcs: ReturnType<typeof TxContext.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof TxContext.instantiateBcs> {
    if (!TxContext.cachedBcs) {
      TxContext.cachedBcs = TxContext.instantiateBcs()
    }
    return TxContext.cachedBcs
  }

  static fromFields(fields: Record<string, any>): TxContext {
    return TxContext.reified().new({
      sender: decodeFromFields('address', fields.sender),
      txHash: decodeFromFields(vector('u8'), fields.tx_hash),
      epoch: decodeFromFields('u64', fields.epoch),
      epochTimestampMs: decodeFromFields('u64', fields.epoch_timestamp_ms),
      idsCreated: decodeFromFields('u64', fields.ids_created),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): TxContext {
    if (!isTxContext(item.type)) {
      throw new Error('not a TxContext type')
    }

    return TxContext.reified().new({
      sender: decodeFromFieldsWithTypes('address', item.fields.sender),
      txHash: decodeFromFieldsWithTypes(vector('u8'), item.fields.tx_hash),
      epoch: decodeFromFieldsWithTypes('u64', item.fields.epoch),
      epochTimestampMs: decodeFromFieldsWithTypes('u64', item.fields.epoch_timestamp_ms),
      idsCreated: decodeFromFieldsWithTypes('u64', item.fields.ids_created),
    })
  }

  static fromBcs(data: Uint8Array): TxContext {
    return TxContext.fromFields(TxContext.bcs.parse(data))
  }

  toJSONField(): TxContextJSONField {
    return {
      sender: this.sender,
      txHash: fieldToJSON<Vector<'u8'>>(`vector<u8>`, this.txHash),
      epoch: this.epoch.toString(),
      epochTimestampMs: this.epochTimestampMs.toString(),
      idsCreated: this.idsCreated.toString(),
    }
  }

  toJSON(): TxContextJSON {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): TxContext {
    return TxContext.reified().new({
      sender: decodeFromJSONField('address', field.sender),
      txHash: decodeFromJSONField(vector('u8'), field.txHash),
      epoch: decodeFromJSONField('u64', field.epoch),
      epochTimestampMs: decodeFromJSONField('u64', field.epochTimestampMs),
      idsCreated: decodeFromJSONField('u64', field.idsCreated),
    })
  }

  static fromJSON(json: Record<string, any>): TxContext {
    if (json.$typeName !== TxContext.$typeName) {
      throw new Error(
        `not a TxContext json object: expected '${TxContext.$typeName}' but got '${json.$typeName}'`
      )
    }

    return TxContext.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): TxContext {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isTxContext(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a TxContext object`)
    }
    return TxContext.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): TxContext {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isTxContext(data.bcs.type)) {
        throw new Error(`object at is not a TxContext object`)
      }

      return TxContext.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return TxContext.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<TxContext> {
    const res = await fetchObjectBcs(client, id)
    if (!isTxContext(res.type)) {
      throw new Error(`object at id ${id} is not a TxContext object`)
    }

    return TxContext.fromBcs(res.bcsBytes)
  }
}
