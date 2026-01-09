/**
 * Defines the `TransferPolicy` type and the logic to approve `TransferRequest`s.
 *
 * - TransferPolicy - is a highly customizable primitive, which provides an
 * interface for the type owner to set custom transfer rules for every
 * deal performed in the `Kiosk` or a similar system that integrates with TP.
 *
 * - Once a `TransferPolicy<T>` is created for and shared (or frozen), the
 * type `T` becomes tradable in `Kiosk`s. On every purchase operation, a
 * `TransferRequest` is created and needs to be confirmed by the `TransferPolicy`
 * hot potato or transaction will fail.
 *
 * - Type owner (creator) can set any Rules as long as the ecosystem supports
 * them. All of the Rules need to be resolved within a single transaction (eg
 * pay royalty and pay fixed commission). Once required actions are performed,
 * the `TransferRequest` can be "confirmed" via `confirm_request` call.
 *
 * - `TransferPolicy` aims to be the main interface for creators to control trades
 * of their types and collect profits if a fee is required on sales. Custom
 * policies can be removed at any moment, and the change will affect all instances
 * of the type at once.
 */

import { TypeName } from '../../_dependencies/std/type-name/structs'
import {
  PhantomReified,
  PhantomToTypeStr,
  PhantomTypeArgument,
  Reified,
  StructClass,
  ToField,
  ToJSON,
  ToPhantomTypeArgument,
  ToTypeStr,
  ToTypeStr as ToPhantom,
  assertFieldsWithTypesArgsMatch,
  assertReifiedTypeArgsMatch,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  extractType,
  phantom,
} from '../../_framework/reified'
import {
  FieldsWithTypes,
  SupportedSuiClient,
  composeSuiType,
  compressSuiType,
  fetchObjectBcs,
  parseTypeName,
} from '../../_framework/util'
import { Balance } from '../balance/structs'
import { ID, UID } from '../object/structs'
import { SUI } from '../sui/structs'
import { VecSet } from '../vec-set/structs'
import { bcs } from '@mysten/sui/bcs'
import { SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromBase64 } from '@mysten/sui/utils'

/* ============================== TransferRequest =============================== */

export function isTransferRequest(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::transfer_policy::TransferRequest` + '<')
}

export interface TransferRequestFields<T extends PhantomTypeArgument> {
  /**
   * The ID of the transferred item. Although the `T` has no
   * constraints, the main use case for this module is to work
   * with Objects.
   */
  item: ToField<ID>
  /**
   * Amount of SUI paid for the item. Can be used to
   * calculate the fee / transfer policy enforcement.
   */
  paid: ToField<'u64'>
  /**
   * The ID of the Kiosk / Safe the object is being sold from.
   * Can be used by the TransferPolicy implementors.
   */
  from: ToField<ID>
  /**
   * Collected Receipts. Used to verify that all of the rules
   * were followed and `TransferRequest` can be confirmed.
   */
  receipts: ToField<VecSet<TypeName>>
}

export type TransferRequestReified<T extends PhantomTypeArgument> = Reified<
  TransferRequest<T>,
  TransferRequestFields<T>
>

export type TransferRequestJSONField<T extends PhantomTypeArgument> = {
  item: string
  paid: string
  from: string
  receipts: ToJSON<VecSet<TypeName>>
}

export type TransferRequestJSON<T extends PhantomTypeArgument> = {
  $typeName: typeof TransferRequest.$typeName
  $typeArgs: [PhantomToTypeStr<T>]
} & TransferRequestJSONField<T>

/**
 * A "Hot Potato" forcing the buyer to get a transfer permission
 * from the item type (`T`) owner on purchase attempt.
 */
export class TransferRequest<T extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::transfer_policy::TransferRequest` =
    `0x2::transfer_policy::TransferRequest` as const
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName: typeof TransferRequest.$typeName = TransferRequest.$typeName
  readonly $fullTypeName: `0x2::transfer_policy::TransferRequest<${PhantomToTypeStr<T>}>`
  readonly $typeArgs: [PhantomToTypeStr<T>]
  readonly $isPhantom: typeof TransferRequest.$isPhantom = TransferRequest.$isPhantom

  /**
   * The ID of the transferred item. Although the `T` has no
   * constraints, the main use case for this module is to work
   * with Objects.
   */
  readonly item: ToField<ID>
  /**
   * Amount of SUI paid for the item. Can be used to
   * calculate the fee / transfer policy enforcement.
   */
  readonly paid: ToField<'u64'>
  /**
   * The ID of the Kiosk / Safe the object is being sold from.
   * Can be used by the TransferPolicy implementors.
   */
  readonly from: ToField<ID>
  /**
   * Collected Receipts. Used to verify that all of the rules
   * were followed and `TransferRequest` can be confirmed.
   */
  readonly receipts: ToField<VecSet<TypeName>>

  private constructor(typeArgs: [PhantomToTypeStr<T>], fields: TransferRequestFields<T>) {
    this.$fullTypeName = composeSuiType(
      TransferRequest.$typeName,
      ...typeArgs
    ) as `0x2::transfer_policy::TransferRequest<${PhantomToTypeStr<T>}>`
    this.$typeArgs = typeArgs

    this.item = fields.item
    this.paid = fields.paid
    this.from = fields.from
    this.receipts = fields.receipts
  }

  static reified<T extends PhantomReified<PhantomTypeArgument>>(
    T: T
  ): TransferRequestReified<ToPhantomTypeArgument<T>> {
    const reifiedBcs = TransferRequest.bcs
    return {
      typeName: TransferRequest.$typeName,
      fullTypeName: composeSuiType(
        TransferRequest.$typeName,
        ...[extractType(T)]
      ) as `0x2::transfer_policy::TransferRequest<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`,
      typeArgs: [extractType(T)] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>],
      isPhantom: TransferRequest.$isPhantom,
      reifiedTypeArgs: [T],
      fromFields: (fields: Record<string, any>) => TransferRequest.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => TransferRequest.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => TransferRequest.fromFields(T, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => TransferRequest.fromJSONField(T, field),
      fromJSON: (json: Record<string, any>) => TransferRequest.fromJSON(T, json),
      fromSuiParsedData: (content: SuiParsedData) => TransferRequest.fromSuiParsedData(T, content),
      fromSuiObjectData: (content: SuiObjectData) => TransferRequest.fromSuiObjectData(T, content),
      fetch: async (client: SupportedSuiClient, id: string) => TransferRequest.fetch(client, T, id),
      new: (fields: TransferRequestFields<ToPhantomTypeArgument<T>>) => {
        return new TransferRequest([extractType(T)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): typeof TransferRequest.reified {
    return TransferRequest.reified
  }

  static phantom<T extends PhantomReified<PhantomTypeArgument>>(
    T: T
  ): PhantomReified<ToTypeStr<TransferRequest<ToPhantomTypeArgument<T>>>> {
    return phantom(TransferRequest.reified(T))
  }

  static get p(): typeof TransferRequest.phantom {
    return TransferRequest.phantom
  }

  private static instantiateBcs() {
    return bcs.struct('TransferRequest', {
      item: ID.bcs,
      paid: bcs.u64(),
      from: ID.bcs,
      receipts: VecSet.bcs(TypeName.bcs),
    })
  }

  private static cachedBcs: ReturnType<typeof TransferRequest.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof TransferRequest.instantiateBcs> {
    if (!TransferRequest.cachedBcs) {
      TransferRequest.cachedBcs = TransferRequest.instantiateBcs()
    }
    return TransferRequest.cachedBcs
  }

  static fromFields<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    fields: Record<string, any>
  ): TransferRequest<ToPhantomTypeArgument<T>> {
    return TransferRequest.reified(typeArg).new({
      item: decodeFromFields(ID.reified(), fields.item),
      paid: decodeFromFields('u64', fields.paid),
      from: decodeFromFields(ID.reified(), fields.from),
      receipts: decodeFromFields(VecSet.reified(TypeName.reified()), fields.receipts),
    })
  }

  static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    item: FieldsWithTypes
  ): TransferRequest<ToPhantomTypeArgument<T>> {
    if (!isTransferRequest(item.type)) {
      throw new Error('not a TransferRequest type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return TransferRequest.reified(typeArg).new({
      item: decodeFromFieldsWithTypes(ID.reified(), item.fields.item),
      paid: decodeFromFieldsWithTypes('u64', item.fields.paid),
      from: decodeFromFieldsWithTypes(ID.reified(), item.fields.from),
      receipts: decodeFromFieldsWithTypes(VecSet.reified(TypeName.reified()), item.fields.receipts),
    })
  }

  static fromBcs<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    data: Uint8Array
  ): TransferRequest<ToPhantomTypeArgument<T>> {
    return TransferRequest.fromFields(typeArg, TransferRequest.bcs.parse(data))
  }

  toJSONField(): TransferRequestJSONField<T> {
    return {
      item: this.item,
      paid: this.paid.toString(),
      from: this.from,
      receipts: this.receipts.toJSONField(),
    }
  }

  toJSON(): TransferRequestJSON<T> {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    field: any
  ): TransferRequest<ToPhantomTypeArgument<T>> {
    return TransferRequest.reified(typeArg).new({
      item: decodeFromJSONField(ID.reified(), field.item),
      paid: decodeFromJSONField('u64', field.paid),
      from: decodeFromJSONField(ID.reified(), field.from),
      receipts: decodeFromJSONField(VecSet.reified(TypeName.reified()), field.receipts),
    })
  }

  static fromJSON<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    json: Record<string, any>
  ): TransferRequest<ToPhantomTypeArgument<T>> {
    if (json.$typeName !== TransferRequest.$typeName) {
      throw new Error(
        `not a TransferRequest json object: expected '${TransferRequest.$typeName}' but got '${json.$typeName}'`
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(TransferRequest.$typeName, ...[extractType(typeArg)]),
      json.$typeArgs,
      [typeArg]
    )

    return TransferRequest.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    content: SuiParsedData
  ): TransferRequest<ToPhantomTypeArgument<T>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isTransferRequest(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a TransferRequest object`)
    }
    return TransferRequest.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    data: SuiObjectData
  ): TransferRequest<ToPhantomTypeArgument<T>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isTransferRequest(data.bcs.type)) {
        throw new Error(`object at is not a TransferRequest object`)
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs
      if (gotTypeArgs.length !== 1) {
        throw new Error(
          `type argument mismatch: expected 1 type arguments but got '${gotTypeArgs.length}'`
        )
      }
      for (let i = 0; i < 1; i++) {
        const gotTypeArg = compressSuiType(gotTypeArgs[i])
        const expectedTypeArg = compressSuiType(extractType([typeArg][i]))
        if (gotTypeArg !== expectedTypeArg) {
          throw new Error(
            `type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`
          )
        }
      }

      return TransferRequest.fromBcs(typeArg, fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return TransferRequest.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<T extends PhantomReified<PhantomTypeArgument>>(
    client: SupportedSuiClient,
    typeArg: T,
    id: string
  ): Promise<TransferRequest<ToPhantomTypeArgument<T>>> {
    const res = await fetchObjectBcs(client, id)
    if (!isTransferRequest(res.type)) {
      throw new Error(`object at id ${id} is not a TransferRequest object`)
    }

    return TransferRequest.fromBcs(typeArg, res.bcsBytes)
  }
}

/* ============================== TransferPolicy =============================== */

export function isTransferPolicy(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::transfer_policy::TransferPolicy` + '<')
}

export interface TransferPolicyFields<T extends PhantomTypeArgument> {
  id: ToField<UID>
  /**
   * The Balance of the `TransferPolicy` which collects `SUI`.
   * By default, transfer policy does not collect anything , and it's
   * a matter of an implementation of a specific rule - whether to add
   * to balance and how much.
   */
  balance: ToField<Balance<ToPhantom<SUI>>>
  /**
   * Set of types of attached rules - used to verify `receipts` when
   * a `TransferRequest` is received in `confirm_request` function.
   *
   * Additionally provides a way to look up currently attached Rules.
   */
  rules: ToField<VecSet<TypeName>>
}

export type TransferPolicyReified<T extends PhantomTypeArgument> = Reified<
  TransferPolicy<T>,
  TransferPolicyFields<T>
>

export type TransferPolicyJSONField<T extends PhantomTypeArgument> = {
  id: string
  balance: ToJSON<Balance<ToPhantom<SUI>>>
  rules: ToJSON<VecSet<TypeName>>
}

export type TransferPolicyJSON<T extends PhantomTypeArgument> = {
  $typeName: typeof TransferPolicy.$typeName
  $typeArgs: [PhantomToTypeStr<T>]
} & TransferPolicyJSONField<T>

/**
 * A unique capability that allows the owner of the `T` to authorize
 * transfers. Can only be created with the `Publisher` object. Although
 * there's no limitation to how many policies can be created, for most
 * of the cases there's no need to create more than one since any of the
 * policies can be used to confirm the `TransferRequest`.
 */
export class TransferPolicy<T extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::transfer_policy::TransferPolicy` =
    `0x2::transfer_policy::TransferPolicy` as const
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName: typeof TransferPolicy.$typeName = TransferPolicy.$typeName
  readonly $fullTypeName: `0x2::transfer_policy::TransferPolicy<${PhantomToTypeStr<T>}>`
  readonly $typeArgs: [PhantomToTypeStr<T>]
  readonly $isPhantom: typeof TransferPolicy.$isPhantom = TransferPolicy.$isPhantom

  readonly id: ToField<UID>
  /**
   * The Balance of the `TransferPolicy` which collects `SUI`.
   * By default, transfer policy does not collect anything , and it's
   * a matter of an implementation of a specific rule - whether to add
   * to balance and how much.
   */
  readonly balance: ToField<Balance<ToPhantom<SUI>>>
  /**
   * Set of types of attached rules - used to verify `receipts` when
   * a `TransferRequest` is received in `confirm_request` function.
   *
   * Additionally provides a way to look up currently attached Rules.
   */
  readonly rules: ToField<VecSet<TypeName>>

  private constructor(typeArgs: [PhantomToTypeStr<T>], fields: TransferPolicyFields<T>) {
    this.$fullTypeName = composeSuiType(
      TransferPolicy.$typeName,
      ...typeArgs
    ) as `0x2::transfer_policy::TransferPolicy<${PhantomToTypeStr<T>}>`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.balance = fields.balance
    this.rules = fields.rules
  }

  static reified<T extends PhantomReified<PhantomTypeArgument>>(
    T: T
  ): TransferPolicyReified<ToPhantomTypeArgument<T>> {
    const reifiedBcs = TransferPolicy.bcs
    return {
      typeName: TransferPolicy.$typeName,
      fullTypeName: composeSuiType(
        TransferPolicy.$typeName,
        ...[extractType(T)]
      ) as `0x2::transfer_policy::TransferPolicy<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`,
      typeArgs: [extractType(T)] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>],
      isPhantom: TransferPolicy.$isPhantom,
      reifiedTypeArgs: [T],
      fromFields: (fields: Record<string, any>) => TransferPolicy.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => TransferPolicy.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => TransferPolicy.fromFields(T, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => TransferPolicy.fromJSONField(T, field),
      fromJSON: (json: Record<string, any>) => TransferPolicy.fromJSON(T, json),
      fromSuiParsedData: (content: SuiParsedData) => TransferPolicy.fromSuiParsedData(T, content),
      fromSuiObjectData: (content: SuiObjectData) => TransferPolicy.fromSuiObjectData(T, content),
      fetch: async (client: SupportedSuiClient, id: string) => TransferPolicy.fetch(client, T, id),
      new: (fields: TransferPolicyFields<ToPhantomTypeArgument<T>>) => {
        return new TransferPolicy([extractType(T)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): typeof TransferPolicy.reified {
    return TransferPolicy.reified
  }

  static phantom<T extends PhantomReified<PhantomTypeArgument>>(
    T: T
  ): PhantomReified<ToTypeStr<TransferPolicy<ToPhantomTypeArgument<T>>>> {
    return phantom(TransferPolicy.reified(T))
  }

  static get p(): typeof TransferPolicy.phantom {
    return TransferPolicy.phantom
  }

  private static instantiateBcs() {
    return bcs.struct('TransferPolicy', {
      id: UID.bcs,
      balance: Balance.bcs,
      rules: VecSet.bcs(TypeName.bcs),
    })
  }

  private static cachedBcs: ReturnType<typeof TransferPolicy.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof TransferPolicy.instantiateBcs> {
    if (!TransferPolicy.cachedBcs) {
      TransferPolicy.cachedBcs = TransferPolicy.instantiateBcs()
    }
    return TransferPolicy.cachedBcs
  }

  static fromFields<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    fields: Record<string, any>
  ): TransferPolicy<ToPhantomTypeArgument<T>> {
    return TransferPolicy.reified(typeArg).new({
      id: decodeFromFields(UID.reified(), fields.id),
      balance: decodeFromFields(Balance.reified(phantom(SUI.reified())), fields.balance),
      rules: decodeFromFields(VecSet.reified(TypeName.reified()), fields.rules),
    })
  }

  static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    item: FieldsWithTypes
  ): TransferPolicy<ToPhantomTypeArgument<T>> {
    if (!isTransferPolicy(item.type)) {
      throw new Error('not a TransferPolicy type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return TransferPolicy.reified(typeArg).new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      balance: decodeFromFieldsWithTypes(
        Balance.reified(phantom(SUI.reified())),
        item.fields.balance
      ),
      rules: decodeFromFieldsWithTypes(VecSet.reified(TypeName.reified()), item.fields.rules),
    })
  }

  static fromBcs<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    data: Uint8Array
  ): TransferPolicy<ToPhantomTypeArgument<T>> {
    return TransferPolicy.fromFields(typeArg, TransferPolicy.bcs.parse(data))
  }

  toJSONField(): TransferPolicyJSONField<T> {
    return {
      id: this.id,
      balance: this.balance.toJSONField(),
      rules: this.rules.toJSONField(),
    }
  }

  toJSON(): TransferPolicyJSON<T> {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    field: any
  ): TransferPolicy<ToPhantomTypeArgument<T>> {
    return TransferPolicy.reified(typeArg).new({
      id: decodeFromJSONField(UID.reified(), field.id),
      balance: decodeFromJSONField(Balance.reified(phantom(SUI.reified())), field.balance),
      rules: decodeFromJSONField(VecSet.reified(TypeName.reified()), field.rules),
    })
  }

  static fromJSON<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    json: Record<string, any>
  ): TransferPolicy<ToPhantomTypeArgument<T>> {
    if (json.$typeName !== TransferPolicy.$typeName) {
      throw new Error(
        `not a TransferPolicy json object: expected '${TransferPolicy.$typeName}' but got '${json.$typeName}'`
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(TransferPolicy.$typeName, ...[extractType(typeArg)]),
      json.$typeArgs,
      [typeArg]
    )

    return TransferPolicy.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    content: SuiParsedData
  ): TransferPolicy<ToPhantomTypeArgument<T>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isTransferPolicy(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a TransferPolicy object`)
    }
    return TransferPolicy.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    data: SuiObjectData
  ): TransferPolicy<ToPhantomTypeArgument<T>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isTransferPolicy(data.bcs.type)) {
        throw new Error(`object at is not a TransferPolicy object`)
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs
      if (gotTypeArgs.length !== 1) {
        throw new Error(
          `type argument mismatch: expected 1 type arguments but got '${gotTypeArgs.length}'`
        )
      }
      for (let i = 0; i < 1; i++) {
        const gotTypeArg = compressSuiType(gotTypeArgs[i])
        const expectedTypeArg = compressSuiType(extractType([typeArg][i]))
        if (gotTypeArg !== expectedTypeArg) {
          throw new Error(
            `type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`
          )
        }
      }

      return TransferPolicy.fromBcs(typeArg, fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return TransferPolicy.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<T extends PhantomReified<PhantomTypeArgument>>(
    client: SupportedSuiClient,
    typeArg: T,
    id: string
  ): Promise<TransferPolicy<ToPhantomTypeArgument<T>>> {
    const res = await fetchObjectBcs(client, id)
    if (!isTransferPolicy(res.type)) {
      throw new Error(`object at id ${id} is not a TransferPolicy object`)
    }

    return TransferPolicy.fromBcs(typeArg, res.bcsBytes)
  }
}

/* ============================== TransferPolicyCap =============================== */

export function isTransferPolicyCap(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::transfer_policy::TransferPolicyCap` + '<')
}

export interface TransferPolicyCapFields<T extends PhantomTypeArgument> {
  id: ToField<UID>
  policyId: ToField<ID>
}

export type TransferPolicyCapReified<T extends PhantomTypeArgument> = Reified<
  TransferPolicyCap<T>,
  TransferPolicyCapFields<T>
>

export type TransferPolicyCapJSONField<T extends PhantomTypeArgument> = {
  id: string
  policyId: string
}

export type TransferPolicyCapJSON<T extends PhantomTypeArgument> = {
  $typeName: typeof TransferPolicyCap.$typeName
  $typeArgs: [PhantomToTypeStr<T>]
} & TransferPolicyCapJSONField<T>

/**
 * A Capability granting the owner permission to add/remove rules as well
 * as to `withdraw` and `destroy_and_withdraw` the `TransferPolicy`.
 */
export class TransferPolicyCap<T extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::transfer_policy::TransferPolicyCap` =
    `0x2::transfer_policy::TransferPolicyCap` as const
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName: typeof TransferPolicyCap.$typeName = TransferPolicyCap.$typeName
  readonly $fullTypeName: `0x2::transfer_policy::TransferPolicyCap<${PhantomToTypeStr<T>}>`
  readonly $typeArgs: [PhantomToTypeStr<T>]
  readonly $isPhantom: typeof TransferPolicyCap.$isPhantom = TransferPolicyCap.$isPhantom

  readonly id: ToField<UID>
  readonly policyId: ToField<ID>

  private constructor(typeArgs: [PhantomToTypeStr<T>], fields: TransferPolicyCapFields<T>) {
    this.$fullTypeName = composeSuiType(
      TransferPolicyCap.$typeName,
      ...typeArgs
    ) as `0x2::transfer_policy::TransferPolicyCap<${PhantomToTypeStr<T>}>`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.policyId = fields.policyId
  }

  static reified<T extends PhantomReified<PhantomTypeArgument>>(
    T: T
  ): TransferPolicyCapReified<ToPhantomTypeArgument<T>> {
    const reifiedBcs = TransferPolicyCap.bcs
    return {
      typeName: TransferPolicyCap.$typeName,
      fullTypeName: composeSuiType(
        TransferPolicyCap.$typeName,
        ...[extractType(T)]
      ) as `0x2::transfer_policy::TransferPolicyCap<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`,
      typeArgs: [extractType(T)] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>],
      isPhantom: TransferPolicyCap.$isPhantom,
      reifiedTypeArgs: [T],
      fromFields: (fields: Record<string, any>) => TransferPolicyCap.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        TransferPolicyCap.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => TransferPolicyCap.fromFields(T, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => TransferPolicyCap.fromJSONField(T, field),
      fromJSON: (json: Record<string, any>) => TransferPolicyCap.fromJSON(T, json),
      fromSuiParsedData: (content: SuiParsedData) =>
        TransferPolicyCap.fromSuiParsedData(T, content),
      fromSuiObjectData: (content: SuiObjectData) =>
        TransferPolicyCap.fromSuiObjectData(T, content),
      fetch: async (client: SupportedSuiClient, id: string) =>
        TransferPolicyCap.fetch(client, T, id),
      new: (fields: TransferPolicyCapFields<ToPhantomTypeArgument<T>>) => {
        return new TransferPolicyCap([extractType(T)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): typeof TransferPolicyCap.reified {
    return TransferPolicyCap.reified
  }

  static phantom<T extends PhantomReified<PhantomTypeArgument>>(
    T: T
  ): PhantomReified<ToTypeStr<TransferPolicyCap<ToPhantomTypeArgument<T>>>> {
    return phantom(TransferPolicyCap.reified(T))
  }

  static get p(): typeof TransferPolicyCap.phantom {
    return TransferPolicyCap.phantom
  }

  private static instantiateBcs() {
    return bcs.struct('TransferPolicyCap', {
      id: UID.bcs,
      policy_id: ID.bcs,
    })
  }

  private static cachedBcs: ReturnType<typeof TransferPolicyCap.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof TransferPolicyCap.instantiateBcs> {
    if (!TransferPolicyCap.cachedBcs) {
      TransferPolicyCap.cachedBcs = TransferPolicyCap.instantiateBcs()
    }
    return TransferPolicyCap.cachedBcs
  }

  static fromFields<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    fields: Record<string, any>
  ): TransferPolicyCap<ToPhantomTypeArgument<T>> {
    return TransferPolicyCap.reified(typeArg).new({
      id: decodeFromFields(UID.reified(), fields.id),
      policyId: decodeFromFields(ID.reified(), fields.policy_id),
    })
  }

  static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    item: FieldsWithTypes
  ): TransferPolicyCap<ToPhantomTypeArgument<T>> {
    if (!isTransferPolicyCap(item.type)) {
      throw new Error('not a TransferPolicyCap type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return TransferPolicyCap.reified(typeArg).new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      policyId: decodeFromFieldsWithTypes(ID.reified(), item.fields.policy_id),
    })
  }

  static fromBcs<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    data: Uint8Array
  ): TransferPolicyCap<ToPhantomTypeArgument<T>> {
    return TransferPolicyCap.fromFields(typeArg, TransferPolicyCap.bcs.parse(data))
  }

  toJSONField(): TransferPolicyCapJSONField<T> {
    return {
      id: this.id,
      policyId: this.policyId,
    }
  }

  toJSON(): TransferPolicyCapJSON<T> {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    field: any
  ): TransferPolicyCap<ToPhantomTypeArgument<T>> {
    return TransferPolicyCap.reified(typeArg).new({
      id: decodeFromJSONField(UID.reified(), field.id),
      policyId: decodeFromJSONField(ID.reified(), field.policyId),
    })
  }

  static fromJSON<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    json: Record<string, any>
  ): TransferPolicyCap<ToPhantomTypeArgument<T>> {
    if (json.$typeName !== TransferPolicyCap.$typeName) {
      throw new Error(
        `not a TransferPolicyCap json object: expected '${TransferPolicyCap.$typeName}' but got '${json.$typeName}'`
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(TransferPolicyCap.$typeName, ...[extractType(typeArg)]),
      json.$typeArgs,
      [typeArg]
    )

    return TransferPolicyCap.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    content: SuiParsedData
  ): TransferPolicyCap<ToPhantomTypeArgument<T>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isTransferPolicyCap(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a TransferPolicyCap object`)
    }
    return TransferPolicyCap.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    data: SuiObjectData
  ): TransferPolicyCap<ToPhantomTypeArgument<T>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isTransferPolicyCap(data.bcs.type)) {
        throw new Error(`object at is not a TransferPolicyCap object`)
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs
      if (gotTypeArgs.length !== 1) {
        throw new Error(
          `type argument mismatch: expected 1 type arguments but got '${gotTypeArgs.length}'`
        )
      }
      for (let i = 0; i < 1; i++) {
        const gotTypeArg = compressSuiType(gotTypeArgs[i])
        const expectedTypeArg = compressSuiType(extractType([typeArg][i]))
        if (gotTypeArg !== expectedTypeArg) {
          throw new Error(
            `type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`
          )
        }
      }

      return TransferPolicyCap.fromBcs(typeArg, fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return TransferPolicyCap.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<T extends PhantomReified<PhantomTypeArgument>>(
    client: SupportedSuiClient,
    typeArg: T,
    id: string
  ): Promise<TransferPolicyCap<ToPhantomTypeArgument<T>>> {
    const res = await fetchObjectBcs(client, id)
    if (!isTransferPolicyCap(res.type)) {
      throw new Error(`object at id ${id} is not a TransferPolicyCap object`)
    }

    return TransferPolicyCap.fromBcs(typeArg, res.bcsBytes)
  }
}

/* ============================== TransferPolicyCreated =============================== */

export function isTransferPolicyCreated(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::transfer_policy::TransferPolicyCreated` + '<')
}

export interface TransferPolicyCreatedFields<T extends PhantomTypeArgument> {
  id: ToField<ID>
}

export type TransferPolicyCreatedReified<T extends PhantomTypeArgument> = Reified<
  TransferPolicyCreated<T>,
  TransferPolicyCreatedFields<T>
>

export type TransferPolicyCreatedJSONField<T extends PhantomTypeArgument> = {
  id: string
}

export type TransferPolicyCreatedJSON<T extends PhantomTypeArgument> = {
  $typeName: typeof TransferPolicyCreated.$typeName
  $typeArgs: [PhantomToTypeStr<T>]
} & TransferPolicyCreatedJSONField<T>

/**
 * Event that is emitted when a publisher creates a new `TransferPolicyCap`
 * making the discoverability and tracking the supported types easier.
 */
export class TransferPolicyCreated<T extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::transfer_policy::TransferPolicyCreated` =
    `0x2::transfer_policy::TransferPolicyCreated` as const
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName: typeof TransferPolicyCreated.$typeName = TransferPolicyCreated.$typeName
  readonly $fullTypeName: `0x2::transfer_policy::TransferPolicyCreated<${PhantomToTypeStr<T>}>`
  readonly $typeArgs: [PhantomToTypeStr<T>]
  readonly $isPhantom: typeof TransferPolicyCreated.$isPhantom = TransferPolicyCreated.$isPhantom

  readonly id: ToField<ID>

  private constructor(typeArgs: [PhantomToTypeStr<T>], fields: TransferPolicyCreatedFields<T>) {
    this.$fullTypeName = composeSuiType(
      TransferPolicyCreated.$typeName,
      ...typeArgs
    ) as `0x2::transfer_policy::TransferPolicyCreated<${PhantomToTypeStr<T>}>`
    this.$typeArgs = typeArgs

    this.id = fields.id
  }

  static reified<T extends PhantomReified<PhantomTypeArgument>>(
    T: T
  ): TransferPolicyCreatedReified<ToPhantomTypeArgument<T>> {
    const reifiedBcs = TransferPolicyCreated.bcs
    return {
      typeName: TransferPolicyCreated.$typeName,
      fullTypeName: composeSuiType(
        TransferPolicyCreated.$typeName,
        ...[extractType(T)]
      ) as `0x2::transfer_policy::TransferPolicyCreated<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`,
      typeArgs: [extractType(T)] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>],
      isPhantom: TransferPolicyCreated.$isPhantom,
      reifiedTypeArgs: [T],
      fromFields: (fields: Record<string, any>) => TransferPolicyCreated.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        TransferPolicyCreated.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => TransferPolicyCreated.fromFields(T, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => TransferPolicyCreated.fromJSONField(T, field),
      fromJSON: (json: Record<string, any>) => TransferPolicyCreated.fromJSON(T, json),
      fromSuiParsedData: (content: SuiParsedData) =>
        TransferPolicyCreated.fromSuiParsedData(T, content),
      fromSuiObjectData: (content: SuiObjectData) =>
        TransferPolicyCreated.fromSuiObjectData(T, content),
      fetch: async (client: SupportedSuiClient, id: string) =>
        TransferPolicyCreated.fetch(client, T, id),
      new: (fields: TransferPolicyCreatedFields<ToPhantomTypeArgument<T>>) => {
        return new TransferPolicyCreated([extractType(T)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): typeof TransferPolicyCreated.reified {
    return TransferPolicyCreated.reified
  }

  static phantom<T extends PhantomReified<PhantomTypeArgument>>(
    T: T
  ): PhantomReified<ToTypeStr<TransferPolicyCreated<ToPhantomTypeArgument<T>>>> {
    return phantom(TransferPolicyCreated.reified(T))
  }

  static get p(): typeof TransferPolicyCreated.phantom {
    return TransferPolicyCreated.phantom
  }

  private static instantiateBcs() {
    return bcs.struct('TransferPolicyCreated', {
      id: ID.bcs,
    })
  }

  private static cachedBcs: ReturnType<typeof TransferPolicyCreated.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof TransferPolicyCreated.instantiateBcs> {
    if (!TransferPolicyCreated.cachedBcs) {
      TransferPolicyCreated.cachedBcs = TransferPolicyCreated.instantiateBcs()
    }
    return TransferPolicyCreated.cachedBcs
  }

  static fromFields<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    fields: Record<string, any>
  ): TransferPolicyCreated<ToPhantomTypeArgument<T>> {
    return TransferPolicyCreated.reified(typeArg).new({
      id: decodeFromFields(ID.reified(), fields.id),
    })
  }

  static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    item: FieldsWithTypes
  ): TransferPolicyCreated<ToPhantomTypeArgument<T>> {
    if (!isTransferPolicyCreated(item.type)) {
      throw new Error('not a TransferPolicyCreated type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return TransferPolicyCreated.reified(typeArg).new({
      id: decodeFromFieldsWithTypes(ID.reified(), item.fields.id),
    })
  }

  static fromBcs<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    data: Uint8Array
  ): TransferPolicyCreated<ToPhantomTypeArgument<T>> {
    return TransferPolicyCreated.fromFields(typeArg, TransferPolicyCreated.bcs.parse(data))
  }

  toJSONField(): TransferPolicyCreatedJSONField<T> {
    return {
      id: this.id,
    }
  }

  toJSON(): TransferPolicyCreatedJSON<T> {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    field: any
  ): TransferPolicyCreated<ToPhantomTypeArgument<T>> {
    return TransferPolicyCreated.reified(typeArg).new({
      id: decodeFromJSONField(ID.reified(), field.id),
    })
  }

  static fromJSON<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    json: Record<string, any>
  ): TransferPolicyCreated<ToPhantomTypeArgument<T>> {
    if (json.$typeName !== TransferPolicyCreated.$typeName) {
      throw new Error(
        `not a TransferPolicyCreated json object: expected '${TransferPolicyCreated.$typeName}' but got '${json.$typeName}'`
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(TransferPolicyCreated.$typeName, ...[extractType(typeArg)]),
      json.$typeArgs,
      [typeArg]
    )

    return TransferPolicyCreated.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    content: SuiParsedData
  ): TransferPolicyCreated<ToPhantomTypeArgument<T>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isTransferPolicyCreated(content.type)) {
      throw new Error(
        `object at ${(content.fields as any).id} is not a TransferPolicyCreated object`
      )
    }
    return TransferPolicyCreated.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    data: SuiObjectData
  ): TransferPolicyCreated<ToPhantomTypeArgument<T>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isTransferPolicyCreated(data.bcs.type)) {
        throw new Error(`object at is not a TransferPolicyCreated object`)
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs
      if (gotTypeArgs.length !== 1) {
        throw new Error(
          `type argument mismatch: expected 1 type arguments but got '${gotTypeArgs.length}'`
        )
      }
      for (let i = 0; i < 1; i++) {
        const gotTypeArg = compressSuiType(gotTypeArgs[i])
        const expectedTypeArg = compressSuiType(extractType([typeArg][i]))
        if (gotTypeArg !== expectedTypeArg) {
          throw new Error(
            `type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`
          )
        }
      }

      return TransferPolicyCreated.fromBcs(typeArg, fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return TransferPolicyCreated.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<T extends PhantomReified<PhantomTypeArgument>>(
    client: SupportedSuiClient,
    typeArg: T,
    id: string
  ): Promise<TransferPolicyCreated<ToPhantomTypeArgument<T>>> {
    const res = await fetchObjectBcs(client, id)
    if (!isTransferPolicyCreated(res.type)) {
      throw new Error(`object at id ${id} is not a TransferPolicyCreated object`)
    }

    return TransferPolicyCreated.fromBcs(typeArg, res.bcsBytes)
  }
}

/* ============================== TransferPolicyDestroyed =============================== */

export function isTransferPolicyDestroyed(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::transfer_policy::TransferPolicyDestroyed` + '<')
}

export interface TransferPolicyDestroyedFields<T extends PhantomTypeArgument> {
  id: ToField<ID>
}

export type TransferPolicyDestroyedReified<T extends PhantomTypeArgument> = Reified<
  TransferPolicyDestroyed<T>,
  TransferPolicyDestroyedFields<T>
>

export type TransferPolicyDestroyedJSONField<T extends PhantomTypeArgument> = {
  id: string
}

export type TransferPolicyDestroyedJSON<T extends PhantomTypeArgument> = {
  $typeName: typeof TransferPolicyDestroyed.$typeName
  $typeArgs: [PhantomToTypeStr<T>]
} & TransferPolicyDestroyedJSONField<T>

/**
 * Event that is emitted when a publisher destroys a `TransferPolicyCap`.
 * Allows for tracking supported policies.
 */
export class TransferPolicyDestroyed<T extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::transfer_policy::TransferPolicyDestroyed` =
    `0x2::transfer_policy::TransferPolicyDestroyed` as const
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName: typeof TransferPolicyDestroyed.$typeName = TransferPolicyDestroyed.$typeName
  readonly $fullTypeName: `0x2::transfer_policy::TransferPolicyDestroyed<${PhantomToTypeStr<T>}>`
  readonly $typeArgs: [PhantomToTypeStr<T>]
  readonly $isPhantom: typeof TransferPolicyDestroyed.$isPhantom =
    TransferPolicyDestroyed.$isPhantom

  readonly id: ToField<ID>

  private constructor(typeArgs: [PhantomToTypeStr<T>], fields: TransferPolicyDestroyedFields<T>) {
    this.$fullTypeName = composeSuiType(
      TransferPolicyDestroyed.$typeName,
      ...typeArgs
    ) as `0x2::transfer_policy::TransferPolicyDestroyed<${PhantomToTypeStr<T>}>`
    this.$typeArgs = typeArgs

    this.id = fields.id
  }

  static reified<T extends PhantomReified<PhantomTypeArgument>>(
    T: T
  ): TransferPolicyDestroyedReified<ToPhantomTypeArgument<T>> {
    const reifiedBcs = TransferPolicyDestroyed.bcs
    return {
      typeName: TransferPolicyDestroyed.$typeName,
      fullTypeName: composeSuiType(
        TransferPolicyDestroyed.$typeName,
        ...[extractType(T)]
      ) as `0x2::transfer_policy::TransferPolicyDestroyed<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`,
      typeArgs: [extractType(T)] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>],
      isPhantom: TransferPolicyDestroyed.$isPhantom,
      reifiedTypeArgs: [T],
      fromFields: (fields: Record<string, any>) => TransferPolicyDestroyed.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        TransferPolicyDestroyed.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => TransferPolicyDestroyed.fromFields(T, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => TransferPolicyDestroyed.fromJSONField(T, field),
      fromJSON: (json: Record<string, any>) => TransferPolicyDestroyed.fromJSON(T, json),
      fromSuiParsedData: (content: SuiParsedData) =>
        TransferPolicyDestroyed.fromSuiParsedData(T, content),
      fromSuiObjectData: (content: SuiObjectData) =>
        TransferPolicyDestroyed.fromSuiObjectData(T, content),
      fetch: async (client: SupportedSuiClient, id: string) =>
        TransferPolicyDestroyed.fetch(client, T, id),
      new: (fields: TransferPolicyDestroyedFields<ToPhantomTypeArgument<T>>) => {
        return new TransferPolicyDestroyed([extractType(T)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): typeof TransferPolicyDestroyed.reified {
    return TransferPolicyDestroyed.reified
  }

  static phantom<T extends PhantomReified<PhantomTypeArgument>>(
    T: T
  ): PhantomReified<ToTypeStr<TransferPolicyDestroyed<ToPhantomTypeArgument<T>>>> {
    return phantom(TransferPolicyDestroyed.reified(T))
  }

  static get p(): typeof TransferPolicyDestroyed.phantom {
    return TransferPolicyDestroyed.phantom
  }

  private static instantiateBcs() {
    return bcs.struct('TransferPolicyDestroyed', {
      id: ID.bcs,
    })
  }

  private static cachedBcs: ReturnType<typeof TransferPolicyDestroyed.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof TransferPolicyDestroyed.instantiateBcs> {
    if (!TransferPolicyDestroyed.cachedBcs) {
      TransferPolicyDestroyed.cachedBcs = TransferPolicyDestroyed.instantiateBcs()
    }
    return TransferPolicyDestroyed.cachedBcs
  }

  static fromFields<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    fields: Record<string, any>
  ): TransferPolicyDestroyed<ToPhantomTypeArgument<T>> {
    return TransferPolicyDestroyed.reified(typeArg).new({
      id: decodeFromFields(ID.reified(), fields.id),
    })
  }

  static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    item: FieldsWithTypes
  ): TransferPolicyDestroyed<ToPhantomTypeArgument<T>> {
    if (!isTransferPolicyDestroyed(item.type)) {
      throw new Error('not a TransferPolicyDestroyed type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return TransferPolicyDestroyed.reified(typeArg).new({
      id: decodeFromFieldsWithTypes(ID.reified(), item.fields.id),
    })
  }

  static fromBcs<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    data: Uint8Array
  ): TransferPolicyDestroyed<ToPhantomTypeArgument<T>> {
    return TransferPolicyDestroyed.fromFields(typeArg, TransferPolicyDestroyed.bcs.parse(data))
  }

  toJSONField(): TransferPolicyDestroyedJSONField<T> {
    return {
      id: this.id,
    }
  }

  toJSON(): TransferPolicyDestroyedJSON<T> {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    field: any
  ): TransferPolicyDestroyed<ToPhantomTypeArgument<T>> {
    return TransferPolicyDestroyed.reified(typeArg).new({
      id: decodeFromJSONField(ID.reified(), field.id),
    })
  }

  static fromJSON<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    json: Record<string, any>
  ): TransferPolicyDestroyed<ToPhantomTypeArgument<T>> {
    if (json.$typeName !== TransferPolicyDestroyed.$typeName) {
      throw new Error(
        `not a TransferPolicyDestroyed json object: expected '${TransferPolicyDestroyed.$typeName}' but got '${json.$typeName}'`
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(TransferPolicyDestroyed.$typeName, ...[extractType(typeArg)]),
      json.$typeArgs,
      [typeArg]
    )

    return TransferPolicyDestroyed.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    content: SuiParsedData
  ): TransferPolicyDestroyed<ToPhantomTypeArgument<T>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isTransferPolicyDestroyed(content.type)) {
      throw new Error(
        `object at ${(content.fields as any).id} is not a TransferPolicyDestroyed object`
      )
    }
    return TransferPolicyDestroyed.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    data: SuiObjectData
  ): TransferPolicyDestroyed<ToPhantomTypeArgument<T>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isTransferPolicyDestroyed(data.bcs.type)) {
        throw new Error(`object at is not a TransferPolicyDestroyed object`)
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs
      if (gotTypeArgs.length !== 1) {
        throw new Error(
          `type argument mismatch: expected 1 type arguments but got '${gotTypeArgs.length}'`
        )
      }
      for (let i = 0; i < 1; i++) {
        const gotTypeArg = compressSuiType(gotTypeArgs[i])
        const expectedTypeArg = compressSuiType(extractType([typeArg][i]))
        if (gotTypeArg !== expectedTypeArg) {
          throw new Error(
            `type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`
          )
        }
      }

      return TransferPolicyDestroyed.fromBcs(typeArg, fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return TransferPolicyDestroyed.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<T extends PhantomReified<PhantomTypeArgument>>(
    client: SupportedSuiClient,
    typeArg: T,
    id: string
  ): Promise<TransferPolicyDestroyed<ToPhantomTypeArgument<T>>> {
    const res = await fetchObjectBcs(client, id)
    if (!isTransferPolicyDestroyed(res.type)) {
      throw new Error(`object at id ${id} is not a TransferPolicyDestroyed object`)
    }

    return TransferPolicyDestroyed.fromBcs(typeArg, res.bcsBytes)
  }
}

/* ============================== RuleKey =============================== */

export function isRuleKey(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::transfer_policy::RuleKey` + '<')
}

export interface RuleKeyFields<T extends PhantomTypeArgument> {
  dummyField: ToField<'bool'>
}

export type RuleKeyReified<T extends PhantomTypeArgument> = Reified<RuleKey<T>, RuleKeyFields<T>>

export type RuleKeyJSONField<T extends PhantomTypeArgument> = {
  dummyField: boolean
}

export type RuleKeyJSON<T extends PhantomTypeArgument> = {
  $typeName: typeof RuleKey.$typeName
  $typeArgs: [PhantomToTypeStr<T>]
} & RuleKeyJSONField<T>

/** Key to store "Rule" configuration for a specific `TransferPolicy`. */
export class RuleKey<T extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::transfer_policy::RuleKey` =
    `0x2::transfer_policy::RuleKey` as const
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName: typeof RuleKey.$typeName = RuleKey.$typeName
  readonly $fullTypeName: `0x2::transfer_policy::RuleKey<${PhantomToTypeStr<T>}>`
  readonly $typeArgs: [PhantomToTypeStr<T>]
  readonly $isPhantom: typeof RuleKey.$isPhantom = RuleKey.$isPhantom

  readonly dummyField: ToField<'bool'>

  private constructor(typeArgs: [PhantomToTypeStr<T>], fields: RuleKeyFields<T>) {
    this.$fullTypeName = composeSuiType(
      RuleKey.$typeName,
      ...typeArgs
    ) as `0x2::transfer_policy::RuleKey<${PhantomToTypeStr<T>}>`
    this.$typeArgs = typeArgs

    this.dummyField = fields.dummyField
  }

  static reified<T extends PhantomReified<PhantomTypeArgument>>(
    T: T
  ): RuleKeyReified<ToPhantomTypeArgument<T>> {
    const reifiedBcs = RuleKey.bcs
    return {
      typeName: RuleKey.$typeName,
      fullTypeName: composeSuiType(
        RuleKey.$typeName,
        ...[extractType(T)]
      ) as `0x2::transfer_policy::RuleKey<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`,
      typeArgs: [extractType(T)] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>],
      isPhantom: RuleKey.$isPhantom,
      reifiedTypeArgs: [T],
      fromFields: (fields: Record<string, any>) => RuleKey.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => RuleKey.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => RuleKey.fromFields(T, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => RuleKey.fromJSONField(T, field),
      fromJSON: (json: Record<string, any>) => RuleKey.fromJSON(T, json),
      fromSuiParsedData: (content: SuiParsedData) => RuleKey.fromSuiParsedData(T, content),
      fromSuiObjectData: (content: SuiObjectData) => RuleKey.fromSuiObjectData(T, content),
      fetch: async (client: SupportedSuiClient, id: string) => RuleKey.fetch(client, T, id),
      new: (fields: RuleKeyFields<ToPhantomTypeArgument<T>>) => {
        return new RuleKey([extractType(T)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): typeof RuleKey.reified {
    return RuleKey.reified
  }

  static phantom<T extends PhantomReified<PhantomTypeArgument>>(
    T: T
  ): PhantomReified<ToTypeStr<RuleKey<ToPhantomTypeArgument<T>>>> {
    return phantom(RuleKey.reified(T))
  }

  static get p(): typeof RuleKey.phantom {
    return RuleKey.phantom
  }

  private static instantiateBcs() {
    return bcs.struct('RuleKey', {
      dummy_field: bcs.bool(),
    })
  }

  private static cachedBcs: ReturnType<typeof RuleKey.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof RuleKey.instantiateBcs> {
    if (!RuleKey.cachedBcs) {
      RuleKey.cachedBcs = RuleKey.instantiateBcs()
    }
    return RuleKey.cachedBcs
  }

  static fromFields<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    fields: Record<string, any>
  ): RuleKey<ToPhantomTypeArgument<T>> {
    return RuleKey.reified(typeArg).new({
      dummyField: decodeFromFields('bool', fields.dummy_field),
    })
  }

  static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    item: FieldsWithTypes
  ): RuleKey<ToPhantomTypeArgument<T>> {
    if (!isRuleKey(item.type)) {
      throw new Error('not a RuleKey type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return RuleKey.reified(typeArg).new({
      dummyField: decodeFromFieldsWithTypes('bool', item.fields.dummy_field),
    })
  }

  static fromBcs<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    data: Uint8Array
  ): RuleKey<ToPhantomTypeArgument<T>> {
    return RuleKey.fromFields(typeArg, RuleKey.bcs.parse(data))
  }

  toJSONField(): RuleKeyJSONField<T> {
    return {
      dummyField: this.dummyField,
    }
  }

  toJSON(): RuleKeyJSON<T> {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    field: any
  ): RuleKey<ToPhantomTypeArgument<T>> {
    return RuleKey.reified(typeArg).new({
      dummyField: decodeFromJSONField('bool', field.dummyField),
    })
  }

  static fromJSON<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    json: Record<string, any>
  ): RuleKey<ToPhantomTypeArgument<T>> {
    if (json.$typeName !== RuleKey.$typeName) {
      throw new Error(
        `not a RuleKey json object: expected '${RuleKey.$typeName}' but got '${json.$typeName}'`
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(RuleKey.$typeName, ...[extractType(typeArg)]),
      json.$typeArgs,
      [typeArg]
    )

    return RuleKey.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    content: SuiParsedData
  ): RuleKey<ToPhantomTypeArgument<T>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isRuleKey(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a RuleKey object`)
    }
    return RuleKey.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    data: SuiObjectData
  ): RuleKey<ToPhantomTypeArgument<T>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isRuleKey(data.bcs.type)) {
        throw new Error(`object at is not a RuleKey object`)
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs
      if (gotTypeArgs.length !== 1) {
        throw new Error(
          `type argument mismatch: expected 1 type arguments but got '${gotTypeArgs.length}'`
        )
      }
      for (let i = 0; i < 1; i++) {
        const gotTypeArg = compressSuiType(gotTypeArgs[i])
        const expectedTypeArg = compressSuiType(extractType([typeArg][i]))
        if (gotTypeArg !== expectedTypeArg) {
          throw new Error(
            `type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`
          )
        }
      }

      return RuleKey.fromBcs(typeArg, fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return RuleKey.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<T extends PhantomReified<PhantomTypeArgument>>(
    client: SupportedSuiClient,
    typeArg: T,
    id: string
  ): Promise<RuleKey<ToPhantomTypeArgument<T>>> {
    const res = await fetchObjectBcs(client, id)
    if (!isRuleKey(res.type)) {
      throw new Error(`object at id ${id} is not a RuleKey object`)
    }

    return RuleKey.fromBcs(typeArg, res.bcsBytes)
  }
}
