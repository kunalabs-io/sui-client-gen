import {
  PhantomReified,
  PhantomToTypeStr,
  PhantomTypeArgument,
  Reified,
  StructClass,
  ToField,
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
  composeSuiType,
  compressSuiType,
  parseTypeName,
} from '../../_framework/util'
import { TypeName } from '../../move-stdlib-chain/type-name/structs'
import { Balance } from '../balance/structs'
import { ID, UID } from '../object/structs'
import { SUI } from '../sui/structs'
import { VecSet } from '../vec-set/structs'
import { bcs } from '@mysten/sui/bcs'
import { SuiClient, SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromB64 } from '@mysten/sui/utils'

/* ============================== TransferRequest =============================== */

export function isTransferRequest(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::transfer_policy::TransferRequest` + '<')
}

export interface TransferRequestFields<T0 extends PhantomTypeArgument> {
  item: ToField<ID>
  paid: ToField<'u64'>
  from: ToField<ID>
  receipts: ToField<VecSet<TypeName>>
}

export type TransferRequestReified<T0 extends PhantomTypeArgument> = Reified<
  TransferRequest<T0>,
  TransferRequestFields<T0>
>

export class TransferRequest<T0 extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::transfer_policy::TransferRequest`
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName = TransferRequest.$typeName
  readonly $fullTypeName: `0x2::transfer_policy::TransferRequest<${PhantomToTypeStr<T0>}>`
  readonly $typeArgs: [PhantomToTypeStr<T0>]
  readonly $isPhantom = TransferRequest.$isPhantom

  readonly item: ToField<ID>
  readonly paid: ToField<'u64'>
  readonly from: ToField<ID>
  readonly receipts: ToField<VecSet<TypeName>>

  private constructor(typeArgs: [PhantomToTypeStr<T0>], fields: TransferRequestFields<T0>) {
    this.$fullTypeName = composeSuiType(
      TransferRequest.$typeName,
      ...typeArgs
    ) as `0x2::transfer_policy::TransferRequest<${PhantomToTypeStr<T0>}>`
    this.$typeArgs = typeArgs

    this.item = fields.item
    this.paid = fields.paid
    this.from = fields.from
    this.receipts = fields.receipts
  }

  static reified<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): TransferRequestReified<ToPhantomTypeArgument<T0>> {
    const reifiedBcs = TransferRequest.bcs
    return {
      typeName: TransferRequest.$typeName,
      fullTypeName: composeSuiType(
        TransferRequest.$typeName,
        ...[extractType(T0)]
      ) as `0x2::transfer_policy::TransferRequest<${PhantomToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [extractType(T0)] as [PhantomToTypeStr<ToPhantomTypeArgument<T0>>],
      isPhantom: TransferRequest.$isPhantom,
      reifiedTypeArgs: [T0],
      fromFields: (fields: Record<string, any>) => TransferRequest.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => TransferRequest.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => TransferRequest.fromFields(T0, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => TransferRequest.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => TransferRequest.fromJSON(T0, json),
      fromSuiParsedData: (content: SuiParsedData) => TransferRequest.fromSuiParsedData(T0, content),
      fromSuiObjectData: (content: SuiObjectData) => TransferRequest.fromSuiObjectData(T0, content),
      fetch: async (client: SuiClient, id: string) => TransferRequest.fetch(client, T0, id),
      new: (fields: TransferRequestFields<ToPhantomTypeArgument<T0>>) => {
        return new TransferRequest([extractType(T0)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return TransferRequest.reified
  }

  static phantom<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): PhantomReified<ToTypeStr<TransferRequest<ToPhantomTypeArgument<T0>>>> {
    return phantom(TransferRequest.reified(T0))
  }

  static get p() {
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

  static fromFields<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    fields: Record<string, any>
  ): TransferRequest<ToPhantomTypeArgument<T0>> {
    return TransferRequest.reified(typeArg).new({
      item: decodeFromFields(ID.reified(), fields.item),
      paid: decodeFromFields('u64', fields.paid),
      from: decodeFromFields(ID.reified(), fields.from),
      receipts: decodeFromFields(VecSet.reified(TypeName.reified()), fields.receipts),
    })
  }

  static fromFieldsWithTypes<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    item: FieldsWithTypes
  ): TransferRequest<ToPhantomTypeArgument<T0>> {
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

  static fromBcs<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: Uint8Array
  ): TransferRequest<ToPhantomTypeArgument<T0>> {
    return TransferRequest.fromFields(typeArg, TransferRequest.bcs.parse(data))
  }

  toJSONField() {
    return {
      item: this.item,
      paid: this.paid.toString(),
      from: this.from,
      receipts: this.receipts.toJSONField(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    field: any
  ): TransferRequest<ToPhantomTypeArgument<T0>> {
    return TransferRequest.reified(typeArg).new({
      item: decodeFromJSONField(ID.reified(), field.item),
      paid: decodeFromJSONField('u64', field.paid),
      from: decodeFromJSONField(ID.reified(), field.from),
      receipts: decodeFromJSONField(VecSet.reified(TypeName.reified()), field.receipts),
    })
  }

  static fromJSON<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    json: Record<string, any>
  ): TransferRequest<ToPhantomTypeArgument<T0>> {
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

  static fromSuiParsedData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    content: SuiParsedData
  ): TransferRequest<ToPhantomTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isTransferRequest(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a TransferRequest object`)
    }
    return TransferRequest.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: SuiObjectData
  ): TransferRequest<ToPhantomTypeArgument<T0>> {
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

      return TransferRequest.fromBcs(typeArg, fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return TransferRequest.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<T0 extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<TransferRequest<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching TransferRequest object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isTransferRequest(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a TransferRequest object`)
    }

    return TransferRequest.fromSuiObjectData(typeArg, res.data)
  }
}

/* ============================== TransferPolicy =============================== */

export function isTransferPolicy(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::transfer_policy::TransferPolicy` + '<')
}

export interface TransferPolicyFields<T0 extends PhantomTypeArgument> {
  id: ToField<UID>
  balance: ToField<Balance<ToPhantom<SUI>>>
  rules: ToField<VecSet<TypeName>>
}

export type TransferPolicyReified<T0 extends PhantomTypeArgument> = Reified<
  TransferPolicy<T0>,
  TransferPolicyFields<T0>
>

export class TransferPolicy<T0 extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::transfer_policy::TransferPolicy`
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName = TransferPolicy.$typeName
  readonly $fullTypeName: `0x2::transfer_policy::TransferPolicy<${PhantomToTypeStr<T0>}>`
  readonly $typeArgs: [PhantomToTypeStr<T0>]
  readonly $isPhantom = TransferPolicy.$isPhantom

  readonly id: ToField<UID>
  readonly balance: ToField<Balance<ToPhantom<SUI>>>
  readonly rules: ToField<VecSet<TypeName>>

  private constructor(typeArgs: [PhantomToTypeStr<T0>], fields: TransferPolicyFields<T0>) {
    this.$fullTypeName = composeSuiType(
      TransferPolicy.$typeName,
      ...typeArgs
    ) as `0x2::transfer_policy::TransferPolicy<${PhantomToTypeStr<T0>}>`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.balance = fields.balance
    this.rules = fields.rules
  }

  static reified<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): TransferPolicyReified<ToPhantomTypeArgument<T0>> {
    const reifiedBcs = TransferPolicy.bcs
    return {
      typeName: TransferPolicy.$typeName,
      fullTypeName: composeSuiType(
        TransferPolicy.$typeName,
        ...[extractType(T0)]
      ) as `0x2::transfer_policy::TransferPolicy<${PhantomToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [extractType(T0)] as [PhantomToTypeStr<ToPhantomTypeArgument<T0>>],
      isPhantom: TransferPolicy.$isPhantom,
      reifiedTypeArgs: [T0],
      fromFields: (fields: Record<string, any>) => TransferPolicy.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => TransferPolicy.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => TransferPolicy.fromFields(T0, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => TransferPolicy.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => TransferPolicy.fromJSON(T0, json),
      fromSuiParsedData: (content: SuiParsedData) => TransferPolicy.fromSuiParsedData(T0, content),
      fromSuiObjectData: (content: SuiObjectData) => TransferPolicy.fromSuiObjectData(T0, content),
      fetch: async (client: SuiClient, id: string) => TransferPolicy.fetch(client, T0, id),
      new: (fields: TransferPolicyFields<ToPhantomTypeArgument<T0>>) => {
        return new TransferPolicy([extractType(T0)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return TransferPolicy.reified
  }

  static phantom<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): PhantomReified<ToTypeStr<TransferPolicy<ToPhantomTypeArgument<T0>>>> {
    return phantom(TransferPolicy.reified(T0))
  }

  static get p() {
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

  static fromFields<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    fields: Record<string, any>
  ): TransferPolicy<ToPhantomTypeArgument<T0>> {
    return TransferPolicy.reified(typeArg).new({
      id: decodeFromFields(UID.reified(), fields.id),
      balance: decodeFromFields(Balance.reified(phantom(SUI.reified())), fields.balance),
      rules: decodeFromFields(VecSet.reified(TypeName.reified()), fields.rules),
    })
  }

  static fromFieldsWithTypes<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    item: FieldsWithTypes
  ): TransferPolicy<ToPhantomTypeArgument<T0>> {
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

  static fromBcs<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: Uint8Array
  ): TransferPolicy<ToPhantomTypeArgument<T0>> {
    return TransferPolicy.fromFields(typeArg, TransferPolicy.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
      balance: this.balance.toJSONField(),
      rules: this.rules.toJSONField(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    field: any
  ): TransferPolicy<ToPhantomTypeArgument<T0>> {
    return TransferPolicy.reified(typeArg).new({
      id: decodeFromJSONField(UID.reified(), field.id),
      balance: decodeFromJSONField(Balance.reified(phantom(SUI.reified())), field.balance),
      rules: decodeFromJSONField(VecSet.reified(TypeName.reified()), field.rules),
    })
  }

  static fromJSON<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    json: Record<string, any>
  ): TransferPolicy<ToPhantomTypeArgument<T0>> {
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

  static fromSuiParsedData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    content: SuiParsedData
  ): TransferPolicy<ToPhantomTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isTransferPolicy(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a TransferPolicy object`)
    }
    return TransferPolicy.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: SuiObjectData
  ): TransferPolicy<ToPhantomTypeArgument<T0>> {
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

      return TransferPolicy.fromBcs(typeArg, fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return TransferPolicy.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<T0 extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<TransferPolicy<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching TransferPolicy object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isTransferPolicy(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a TransferPolicy object`)
    }

    return TransferPolicy.fromSuiObjectData(typeArg, res.data)
  }
}

/* ============================== TransferPolicyCap =============================== */

export function isTransferPolicyCap(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::transfer_policy::TransferPolicyCap` + '<')
}

export interface TransferPolicyCapFields<T0 extends PhantomTypeArgument> {
  id: ToField<UID>
  policyId: ToField<ID>
}

export type TransferPolicyCapReified<T0 extends PhantomTypeArgument> = Reified<
  TransferPolicyCap<T0>,
  TransferPolicyCapFields<T0>
>

export class TransferPolicyCap<T0 extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::transfer_policy::TransferPolicyCap`
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName = TransferPolicyCap.$typeName
  readonly $fullTypeName: `0x2::transfer_policy::TransferPolicyCap<${PhantomToTypeStr<T0>}>`
  readonly $typeArgs: [PhantomToTypeStr<T0>]
  readonly $isPhantom = TransferPolicyCap.$isPhantom

  readonly id: ToField<UID>
  readonly policyId: ToField<ID>

  private constructor(typeArgs: [PhantomToTypeStr<T0>], fields: TransferPolicyCapFields<T0>) {
    this.$fullTypeName = composeSuiType(
      TransferPolicyCap.$typeName,
      ...typeArgs
    ) as `0x2::transfer_policy::TransferPolicyCap<${PhantomToTypeStr<T0>}>`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.policyId = fields.policyId
  }

  static reified<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): TransferPolicyCapReified<ToPhantomTypeArgument<T0>> {
    const reifiedBcs = TransferPolicyCap.bcs
    return {
      typeName: TransferPolicyCap.$typeName,
      fullTypeName: composeSuiType(
        TransferPolicyCap.$typeName,
        ...[extractType(T0)]
      ) as `0x2::transfer_policy::TransferPolicyCap<${PhantomToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [extractType(T0)] as [PhantomToTypeStr<ToPhantomTypeArgument<T0>>],
      isPhantom: TransferPolicyCap.$isPhantom,
      reifiedTypeArgs: [T0],
      fromFields: (fields: Record<string, any>) => TransferPolicyCap.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        TransferPolicyCap.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => TransferPolicyCap.fromFields(T0, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => TransferPolicyCap.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => TransferPolicyCap.fromJSON(T0, json),
      fromSuiParsedData: (content: SuiParsedData) =>
        TransferPolicyCap.fromSuiParsedData(T0, content),
      fromSuiObjectData: (content: SuiObjectData) =>
        TransferPolicyCap.fromSuiObjectData(T0, content),
      fetch: async (client: SuiClient, id: string) => TransferPolicyCap.fetch(client, T0, id),
      new: (fields: TransferPolicyCapFields<ToPhantomTypeArgument<T0>>) => {
        return new TransferPolicyCap([extractType(T0)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return TransferPolicyCap.reified
  }

  static phantom<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): PhantomReified<ToTypeStr<TransferPolicyCap<ToPhantomTypeArgument<T0>>>> {
    return phantom(TransferPolicyCap.reified(T0))
  }

  static get p() {
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

  static fromFields<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    fields: Record<string, any>
  ): TransferPolicyCap<ToPhantomTypeArgument<T0>> {
    return TransferPolicyCap.reified(typeArg).new({
      id: decodeFromFields(UID.reified(), fields.id),
      policyId: decodeFromFields(ID.reified(), fields.policy_id),
    })
  }

  static fromFieldsWithTypes<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    item: FieldsWithTypes
  ): TransferPolicyCap<ToPhantomTypeArgument<T0>> {
    if (!isTransferPolicyCap(item.type)) {
      throw new Error('not a TransferPolicyCap type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return TransferPolicyCap.reified(typeArg).new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      policyId: decodeFromFieldsWithTypes(ID.reified(), item.fields.policy_id),
    })
  }

  static fromBcs<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: Uint8Array
  ): TransferPolicyCap<ToPhantomTypeArgument<T0>> {
    return TransferPolicyCap.fromFields(typeArg, TransferPolicyCap.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
      policyId: this.policyId,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    field: any
  ): TransferPolicyCap<ToPhantomTypeArgument<T0>> {
    return TransferPolicyCap.reified(typeArg).new({
      id: decodeFromJSONField(UID.reified(), field.id),
      policyId: decodeFromJSONField(ID.reified(), field.policyId),
    })
  }

  static fromJSON<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    json: Record<string, any>
  ): TransferPolicyCap<ToPhantomTypeArgument<T0>> {
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

  static fromSuiParsedData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    content: SuiParsedData
  ): TransferPolicyCap<ToPhantomTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isTransferPolicyCap(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a TransferPolicyCap object`)
    }
    return TransferPolicyCap.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: SuiObjectData
  ): TransferPolicyCap<ToPhantomTypeArgument<T0>> {
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

      return TransferPolicyCap.fromBcs(typeArg, fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return TransferPolicyCap.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<T0 extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<TransferPolicyCap<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching TransferPolicyCap object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isTransferPolicyCap(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a TransferPolicyCap object`)
    }

    return TransferPolicyCap.fromSuiObjectData(typeArg, res.data)
  }
}

/* ============================== TransferPolicyCreated =============================== */

export function isTransferPolicyCreated(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::transfer_policy::TransferPolicyCreated` + '<')
}

export interface TransferPolicyCreatedFields<T0 extends PhantomTypeArgument> {
  id: ToField<ID>
}

export type TransferPolicyCreatedReified<T0 extends PhantomTypeArgument> = Reified<
  TransferPolicyCreated<T0>,
  TransferPolicyCreatedFields<T0>
>

export class TransferPolicyCreated<T0 extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::transfer_policy::TransferPolicyCreated`
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName = TransferPolicyCreated.$typeName
  readonly $fullTypeName: `0x2::transfer_policy::TransferPolicyCreated<${PhantomToTypeStr<T0>}>`
  readonly $typeArgs: [PhantomToTypeStr<T0>]
  readonly $isPhantom = TransferPolicyCreated.$isPhantom

  readonly id: ToField<ID>

  private constructor(typeArgs: [PhantomToTypeStr<T0>], fields: TransferPolicyCreatedFields<T0>) {
    this.$fullTypeName = composeSuiType(
      TransferPolicyCreated.$typeName,
      ...typeArgs
    ) as `0x2::transfer_policy::TransferPolicyCreated<${PhantomToTypeStr<T0>}>`
    this.$typeArgs = typeArgs

    this.id = fields.id
  }

  static reified<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): TransferPolicyCreatedReified<ToPhantomTypeArgument<T0>> {
    const reifiedBcs = TransferPolicyCreated.bcs
    return {
      typeName: TransferPolicyCreated.$typeName,
      fullTypeName: composeSuiType(
        TransferPolicyCreated.$typeName,
        ...[extractType(T0)]
      ) as `0x2::transfer_policy::TransferPolicyCreated<${PhantomToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [extractType(T0)] as [PhantomToTypeStr<ToPhantomTypeArgument<T0>>],
      isPhantom: TransferPolicyCreated.$isPhantom,
      reifiedTypeArgs: [T0],
      fromFields: (fields: Record<string, any>) => TransferPolicyCreated.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        TransferPolicyCreated.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => TransferPolicyCreated.fromFields(T0, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => TransferPolicyCreated.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => TransferPolicyCreated.fromJSON(T0, json),
      fromSuiParsedData: (content: SuiParsedData) =>
        TransferPolicyCreated.fromSuiParsedData(T0, content),
      fromSuiObjectData: (content: SuiObjectData) =>
        TransferPolicyCreated.fromSuiObjectData(T0, content),
      fetch: async (client: SuiClient, id: string) => TransferPolicyCreated.fetch(client, T0, id),
      new: (fields: TransferPolicyCreatedFields<ToPhantomTypeArgument<T0>>) => {
        return new TransferPolicyCreated([extractType(T0)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return TransferPolicyCreated.reified
  }

  static phantom<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): PhantomReified<ToTypeStr<TransferPolicyCreated<ToPhantomTypeArgument<T0>>>> {
    return phantom(TransferPolicyCreated.reified(T0))
  }

  static get p() {
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

  static fromFields<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    fields: Record<string, any>
  ): TransferPolicyCreated<ToPhantomTypeArgument<T0>> {
    return TransferPolicyCreated.reified(typeArg).new({
      id: decodeFromFields(ID.reified(), fields.id),
    })
  }

  static fromFieldsWithTypes<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    item: FieldsWithTypes
  ): TransferPolicyCreated<ToPhantomTypeArgument<T0>> {
    if (!isTransferPolicyCreated(item.type)) {
      throw new Error('not a TransferPolicyCreated type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return TransferPolicyCreated.reified(typeArg).new({
      id: decodeFromFieldsWithTypes(ID.reified(), item.fields.id),
    })
  }

  static fromBcs<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: Uint8Array
  ): TransferPolicyCreated<ToPhantomTypeArgument<T0>> {
    return TransferPolicyCreated.fromFields(typeArg, TransferPolicyCreated.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    field: any
  ): TransferPolicyCreated<ToPhantomTypeArgument<T0>> {
    return TransferPolicyCreated.reified(typeArg).new({
      id: decodeFromJSONField(ID.reified(), field.id),
    })
  }

  static fromJSON<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    json: Record<string, any>
  ): TransferPolicyCreated<ToPhantomTypeArgument<T0>> {
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

  static fromSuiParsedData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    content: SuiParsedData
  ): TransferPolicyCreated<ToPhantomTypeArgument<T0>> {
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

  static fromSuiObjectData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: SuiObjectData
  ): TransferPolicyCreated<ToPhantomTypeArgument<T0>> {
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

      return TransferPolicyCreated.fromBcs(typeArg, fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return TransferPolicyCreated.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<T0 extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<TransferPolicyCreated<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching TransferPolicyCreated object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isTransferPolicyCreated(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a TransferPolicyCreated object`)
    }

    return TransferPolicyCreated.fromSuiObjectData(typeArg, res.data)
  }
}

/* ============================== TransferPolicyDestroyed =============================== */

export function isTransferPolicyDestroyed(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::transfer_policy::TransferPolicyDestroyed` + '<')
}

export interface TransferPolicyDestroyedFields<T0 extends PhantomTypeArgument> {
  id: ToField<ID>
}

export type TransferPolicyDestroyedReified<T0 extends PhantomTypeArgument> = Reified<
  TransferPolicyDestroyed<T0>,
  TransferPolicyDestroyedFields<T0>
>

export class TransferPolicyDestroyed<T0 extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::transfer_policy::TransferPolicyDestroyed`
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName = TransferPolicyDestroyed.$typeName
  readonly $fullTypeName: `0x2::transfer_policy::TransferPolicyDestroyed<${PhantomToTypeStr<T0>}>`
  readonly $typeArgs: [PhantomToTypeStr<T0>]
  readonly $isPhantom = TransferPolicyDestroyed.$isPhantom

  readonly id: ToField<ID>

  private constructor(typeArgs: [PhantomToTypeStr<T0>], fields: TransferPolicyDestroyedFields<T0>) {
    this.$fullTypeName = composeSuiType(
      TransferPolicyDestroyed.$typeName,
      ...typeArgs
    ) as `0x2::transfer_policy::TransferPolicyDestroyed<${PhantomToTypeStr<T0>}>`
    this.$typeArgs = typeArgs

    this.id = fields.id
  }

  static reified<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): TransferPolicyDestroyedReified<ToPhantomTypeArgument<T0>> {
    const reifiedBcs = TransferPolicyDestroyed.bcs
    return {
      typeName: TransferPolicyDestroyed.$typeName,
      fullTypeName: composeSuiType(
        TransferPolicyDestroyed.$typeName,
        ...[extractType(T0)]
      ) as `0x2::transfer_policy::TransferPolicyDestroyed<${PhantomToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [extractType(T0)] as [PhantomToTypeStr<ToPhantomTypeArgument<T0>>],
      isPhantom: TransferPolicyDestroyed.$isPhantom,
      reifiedTypeArgs: [T0],
      fromFields: (fields: Record<string, any>) => TransferPolicyDestroyed.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        TransferPolicyDestroyed.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => TransferPolicyDestroyed.fromFields(T0, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => TransferPolicyDestroyed.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => TransferPolicyDestroyed.fromJSON(T0, json),
      fromSuiParsedData: (content: SuiParsedData) =>
        TransferPolicyDestroyed.fromSuiParsedData(T0, content),
      fromSuiObjectData: (content: SuiObjectData) =>
        TransferPolicyDestroyed.fromSuiObjectData(T0, content),
      fetch: async (client: SuiClient, id: string) => TransferPolicyDestroyed.fetch(client, T0, id),
      new: (fields: TransferPolicyDestroyedFields<ToPhantomTypeArgument<T0>>) => {
        return new TransferPolicyDestroyed([extractType(T0)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return TransferPolicyDestroyed.reified
  }

  static phantom<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): PhantomReified<ToTypeStr<TransferPolicyDestroyed<ToPhantomTypeArgument<T0>>>> {
    return phantom(TransferPolicyDestroyed.reified(T0))
  }

  static get p() {
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

  static fromFields<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    fields: Record<string, any>
  ): TransferPolicyDestroyed<ToPhantomTypeArgument<T0>> {
    return TransferPolicyDestroyed.reified(typeArg).new({
      id: decodeFromFields(ID.reified(), fields.id),
    })
  }

  static fromFieldsWithTypes<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    item: FieldsWithTypes
  ): TransferPolicyDestroyed<ToPhantomTypeArgument<T0>> {
    if (!isTransferPolicyDestroyed(item.type)) {
      throw new Error('not a TransferPolicyDestroyed type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return TransferPolicyDestroyed.reified(typeArg).new({
      id: decodeFromFieldsWithTypes(ID.reified(), item.fields.id),
    })
  }

  static fromBcs<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: Uint8Array
  ): TransferPolicyDestroyed<ToPhantomTypeArgument<T0>> {
    return TransferPolicyDestroyed.fromFields(typeArg, TransferPolicyDestroyed.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    field: any
  ): TransferPolicyDestroyed<ToPhantomTypeArgument<T0>> {
    return TransferPolicyDestroyed.reified(typeArg).new({
      id: decodeFromJSONField(ID.reified(), field.id),
    })
  }

  static fromJSON<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    json: Record<string, any>
  ): TransferPolicyDestroyed<ToPhantomTypeArgument<T0>> {
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

  static fromSuiParsedData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    content: SuiParsedData
  ): TransferPolicyDestroyed<ToPhantomTypeArgument<T0>> {
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

  static fromSuiObjectData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: SuiObjectData
  ): TransferPolicyDestroyed<ToPhantomTypeArgument<T0>> {
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

      return TransferPolicyDestroyed.fromBcs(typeArg, fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return TransferPolicyDestroyed.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<T0 extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<TransferPolicyDestroyed<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(
        `error fetching TransferPolicyDestroyed object at id ${id}: ${res.error.code}`
      )
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isTransferPolicyDestroyed(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a TransferPolicyDestroyed object`)
    }

    return TransferPolicyDestroyed.fromSuiObjectData(typeArg, res.data)
  }
}

/* ============================== RuleKey =============================== */

export function isRuleKey(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::transfer_policy::RuleKey` + '<')
}

export interface RuleKeyFields<T0 extends PhantomTypeArgument> {
  dummyField: ToField<'bool'>
}

export type RuleKeyReified<T0 extends PhantomTypeArgument> = Reified<RuleKey<T0>, RuleKeyFields<T0>>

export class RuleKey<T0 extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::transfer_policy::RuleKey`
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName = RuleKey.$typeName
  readonly $fullTypeName: `0x2::transfer_policy::RuleKey<${PhantomToTypeStr<T0>}>`
  readonly $typeArgs: [PhantomToTypeStr<T0>]
  readonly $isPhantom = RuleKey.$isPhantom

  readonly dummyField: ToField<'bool'>

  private constructor(typeArgs: [PhantomToTypeStr<T0>], fields: RuleKeyFields<T0>) {
    this.$fullTypeName = composeSuiType(
      RuleKey.$typeName,
      ...typeArgs
    ) as `0x2::transfer_policy::RuleKey<${PhantomToTypeStr<T0>}>`
    this.$typeArgs = typeArgs

    this.dummyField = fields.dummyField
  }

  static reified<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): RuleKeyReified<ToPhantomTypeArgument<T0>> {
    const reifiedBcs = RuleKey.bcs
    return {
      typeName: RuleKey.$typeName,
      fullTypeName: composeSuiType(
        RuleKey.$typeName,
        ...[extractType(T0)]
      ) as `0x2::transfer_policy::RuleKey<${PhantomToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [extractType(T0)] as [PhantomToTypeStr<ToPhantomTypeArgument<T0>>],
      isPhantom: RuleKey.$isPhantom,
      reifiedTypeArgs: [T0],
      fromFields: (fields: Record<string, any>) => RuleKey.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => RuleKey.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => RuleKey.fromFields(T0, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => RuleKey.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => RuleKey.fromJSON(T0, json),
      fromSuiParsedData: (content: SuiParsedData) => RuleKey.fromSuiParsedData(T0, content),
      fromSuiObjectData: (content: SuiObjectData) => RuleKey.fromSuiObjectData(T0, content),
      fetch: async (client: SuiClient, id: string) => RuleKey.fetch(client, T0, id),
      new: (fields: RuleKeyFields<ToPhantomTypeArgument<T0>>) => {
        return new RuleKey([extractType(T0)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return RuleKey.reified
  }

  static phantom<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): PhantomReified<ToTypeStr<RuleKey<ToPhantomTypeArgument<T0>>>> {
    return phantom(RuleKey.reified(T0))
  }

  static get p() {
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

  static fromFields<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    fields: Record<string, any>
  ): RuleKey<ToPhantomTypeArgument<T0>> {
    return RuleKey.reified(typeArg).new({
      dummyField: decodeFromFields('bool', fields.dummy_field),
    })
  }

  static fromFieldsWithTypes<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    item: FieldsWithTypes
  ): RuleKey<ToPhantomTypeArgument<T0>> {
    if (!isRuleKey(item.type)) {
      throw new Error('not a RuleKey type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return RuleKey.reified(typeArg).new({
      dummyField: decodeFromFieldsWithTypes('bool', item.fields.dummy_field),
    })
  }

  static fromBcs<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: Uint8Array
  ): RuleKey<ToPhantomTypeArgument<T0>> {
    return RuleKey.fromFields(typeArg, RuleKey.bcs.parse(data))
  }

  toJSONField() {
    return {
      dummyField: this.dummyField,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    field: any
  ): RuleKey<ToPhantomTypeArgument<T0>> {
    return RuleKey.reified(typeArg).new({
      dummyField: decodeFromJSONField('bool', field.dummyField),
    })
  }

  static fromJSON<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    json: Record<string, any>
  ): RuleKey<ToPhantomTypeArgument<T0>> {
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

  static fromSuiParsedData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    content: SuiParsedData
  ): RuleKey<ToPhantomTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isRuleKey(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a RuleKey object`)
    }
    return RuleKey.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: SuiObjectData
  ): RuleKey<ToPhantomTypeArgument<T0>> {
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

      return RuleKey.fromBcs(typeArg, fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return RuleKey.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<T0 extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<RuleKey<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching RuleKey object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isRuleKey(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a RuleKey object`)
    }

    return RuleKey.fromSuiObjectData(typeArg, res.data)
  }
}
