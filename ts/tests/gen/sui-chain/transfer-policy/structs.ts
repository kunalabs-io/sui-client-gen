import {
  PhantomTypeArgument,
  Reified,
  ReifiedPhantomTypeArgument,
  ToField,
  ToPhantomTypeArgument,
  ToTypeStr,
  assertFieldsWithTypesArgsMatch,
  assertReifiedTypeArgsMatch,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  extractType,
  ToTypeStr as ToPhantom,
} from '../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../_framework/util'
import { TypeName } from '../../move-stdlib-chain/type-name/structs'
import { Balance } from '../balance/structs'
import { ID, UID } from '../object/structs'
import { SUI } from '../sui/structs'
import { VecSet } from '../vec-set/structs'
import { bcs } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== RuleKey =============================== */

export function isRuleKey(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::transfer_policy::RuleKey<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface RuleKeyFields<T0 extends PhantomTypeArgument> {
  dummyField: ToField<'bool'>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class RuleKey<T0 extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::transfer_policy::RuleKey'
  static readonly $numTypeParams = 1

  readonly $fullTypeName = null as unknown as `0x2::transfer_policy::RuleKey<${ToTypeStr<T0>}>`

  readonly $typeName = RuleKey.$typeName

  static get bcs() {
    return bcs.struct('RuleKey', {
      dummy_field: bcs.bool(),
    })
  }

  readonly $typeArg: string

  readonly dummyField: ToField<'bool'>

  private constructor(typeArg: string, dummyField: ToField<'bool'>) {
    this.$typeArg = typeArg

    this.dummyField = dummyField
  }

  static new<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    dummyField: ToField<'bool'>
  ): RuleKey<ToPhantomTypeArgument<T0>> {
    return new RuleKey(extractType(typeArg), dummyField)
  }

  static reified<T0 extends ReifiedPhantomTypeArgument>(
    T0: T0
  ): Reified<RuleKey<ToPhantomTypeArgument<T0>>> {
    return {
      typeName: RuleKey.$typeName,
      fullTypeName: composeSuiType(
        RuleKey.$typeName,
        ...[extractType(T0)]
      ) as `0x2::transfer_policy::RuleKey<${ToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [T0],
      fromFields: (fields: Record<string, any>) => RuleKey.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => RuleKey.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => RuleKey.fromBcs(T0, data),
      bcs: RuleKey.bcs,
      fromJSONField: (field: any) => RuleKey.fromJSONField(T0, field),
      fetch: async (client: SuiClient, id: string) => RuleKey.fetch(client, T0, id),
      kind: 'StructClassReified',
    }
  }

  static fromFields<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    fields: Record<string, any>
  ): RuleKey<ToPhantomTypeArgument<T0>> {
    return RuleKey.new(typeArg, decodeFromFields('bool', fields.dummy_field))
  }

  static fromFieldsWithTypes<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    item: FieldsWithTypes
  ): RuleKey<ToPhantomTypeArgument<T0>> {
    if (!isRuleKey(item.type)) {
      throw new Error('not a RuleKey type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return RuleKey.new(typeArg, decodeFromFieldsWithTypes('bool', item.fields.dummy_field))
  }

  static fromBcs<T0 extends ReifiedPhantomTypeArgument>(
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
    return { $typeName: this.$typeName, $typeArg: this.$typeArg, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    field: any
  ): RuleKey<ToPhantomTypeArgument<T0>> {
    return RuleKey.new(typeArg, decodeFromJSONField('bool', field.dummyField))
  }

  static fromJSON<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    json: Record<string, any>
  ): RuleKey<ToPhantomTypeArgument<T0>> {
    if (json.$typeName !== RuleKey.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(RuleKey.$typeName, extractType(typeArg)),
      [json.$typeArg],
      [typeArg]
    )

    return RuleKey.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends ReifiedPhantomTypeArgument>(
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

  static async fetch<T0 extends ReifiedPhantomTypeArgument>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<RuleKey<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching RuleKey object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isRuleKey(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a RuleKey object`)
    }
    return RuleKey.fromFieldsWithTypes(typeArg, res.data.content)
  }
}

/* ============================== TransferRequest =============================== */

export function isTransferRequest(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::transfer_policy::TransferRequest<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface TransferRequestFields<T0 extends PhantomTypeArgument> {
  item: ToField<ID>
  paid: ToField<'u64'>
  from: ToField<ID>
  receipts: ToField<VecSet<TypeName>>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class TransferRequest<T0 extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::transfer_policy::TransferRequest'
  static readonly $numTypeParams = 1

  readonly $fullTypeName =
    null as unknown as `0x2::transfer_policy::TransferRequest<${ToTypeStr<T0>}>`

  readonly $typeName = TransferRequest.$typeName

  static get bcs() {
    return bcs.struct('TransferRequest', {
      item: ID.bcs,
      paid: bcs.u64(),
      from: ID.bcs,
      receipts: VecSet.bcs(TypeName.bcs),
    })
  }

  readonly $typeArg: string

  readonly item: ToField<ID>
  readonly paid: ToField<'u64'>
  readonly from: ToField<ID>
  readonly receipts: ToField<VecSet<TypeName>>

  private constructor(typeArg: string, fields: TransferRequestFields<T0>) {
    this.$typeArg = typeArg

    this.item = fields.item
    this.paid = fields.paid
    this.from = fields.from
    this.receipts = fields.receipts
  }

  static new<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    fields: TransferRequestFields<ToPhantomTypeArgument<T0>>
  ): TransferRequest<ToPhantomTypeArgument<T0>> {
    return new TransferRequest(extractType(typeArg), fields)
  }

  static reified<T0 extends ReifiedPhantomTypeArgument>(
    T0: T0
  ): Reified<TransferRequest<ToPhantomTypeArgument<T0>>> {
    return {
      typeName: TransferRequest.$typeName,
      fullTypeName: composeSuiType(
        TransferRequest.$typeName,
        ...[extractType(T0)]
      ) as `0x2::transfer_policy::TransferRequest<${ToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [T0],
      fromFields: (fields: Record<string, any>) => TransferRequest.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => TransferRequest.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => TransferRequest.fromBcs(T0, data),
      bcs: TransferRequest.bcs,
      fromJSONField: (field: any) => TransferRequest.fromJSONField(T0, field),
      fetch: async (client: SuiClient, id: string) => TransferRequest.fetch(client, T0, id),
      kind: 'StructClassReified',
    }
  }

  static fromFields<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    fields: Record<string, any>
  ): TransferRequest<ToPhantomTypeArgument<T0>> {
    return TransferRequest.new(typeArg, {
      item: decodeFromFields(ID.reified(), fields.item),
      paid: decodeFromFields('u64', fields.paid),
      from: decodeFromFields(ID.reified(), fields.from),
      receipts: decodeFromFields(VecSet.reified(TypeName.reified()), fields.receipts),
    })
  }

  static fromFieldsWithTypes<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    item: FieldsWithTypes
  ): TransferRequest<ToPhantomTypeArgument<T0>> {
    if (!isTransferRequest(item.type)) {
      throw new Error('not a TransferRequest type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return TransferRequest.new(typeArg, {
      item: decodeFromFieldsWithTypes(ID.reified(), item.fields.item),
      paid: decodeFromFieldsWithTypes('u64', item.fields.paid),
      from: decodeFromFieldsWithTypes(ID.reified(), item.fields.from),
      receipts: decodeFromFieldsWithTypes(VecSet.reified(TypeName.reified()), item.fields.receipts),
    })
  }

  static fromBcs<T0 extends ReifiedPhantomTypeArgument>(
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
    return { $typeName: this.$typeName, $typeArg: this.$typeArg, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    field: any
  ): TransferRequest<ToPhantomTypeArgument<T0>> {
    return TransferRequest.new(typeArg, {
      item: decodeFromJSONField(ID.reified(), field.item),
      paid: decodeFromJSONField('u64', field.paid),
      from: decodeFromJSONField(ID.reified(), field.from),
      receipts: decodeFromJSONField(VecSet.reified(TypeName.reified()), field.receipts),
    })
  }

  static fromJSON<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    json: Record<string, any>
  ): TransferRequest<ToPhantomTypeArgument<T0>> {
    if (json.$typeName !== TransferRequest.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(TransferRequest.$typeName, extractType(typeArg)),
      [json.$typeArg],
      [typeArg]
    )

    return TransferRequest.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends ReifiedPhantomTypeArgument>(
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

  static async fetch<T0 extends ReifiedPhantomTypeArgument>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<TransferRequest<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching TransferRequest object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isTransferRequest(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a TransferRequest object`)
    }
    return TransferRequest.fromFieldsWithTypes(typeArg, res.data.content)
  }
}

/* ============================== TransferPolicy =============================== */

export function isTransferPolicy(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::transfer_policy::TransferPolicy<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface TransferPolicyFields<T0 extends PhantomTypeArgument> {
  id: ToField<UID>
  balance: ToField<Balance<ToPhantom<SUI>>>
  rules: ToField<VecSet<TypeName>>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class TransferPolicy<T0 extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::transfer_policy::TransferPolicy'
  static readonly $numTypeParams = 1

  readonly $fullTypeName =
    null as unknown as `0x2::transfer_policy::TransferPolicy<${ToTypeStr<T0>}>`

  readonly $typeName = TransferPolicy.$typeName

  static get bcs() {
    return bcs.struct('TransferPolicy', {
      id: UID.bcs,
      balance: Balance.bcs,
      rules: VecSet.bcs(TypeName.bcs),
    })
  }

  readonly $typeArg: string

  readonly id: ToField<UID>
  readonly balance: ToField<Balance<ToPhantom<SUI>>>
  readonly rules: ToField<VecSet<TypeName>>

  private constructor(typeArg: string, fields: TransferPolicyFields<T0>) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.balance = fields.balance
    this.rules = fields.rules
  }

  static new<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    fields: TransferPolicyFields<ToPhantomTypeArgument<T0>>
  ): TransferPolicy<ToPhantomTypeArgument<T0>> {
    return new TransferPolicy(extractType(typeArg), fields)
  }

  static reified<T0 extends ReifiedPhantomTypeArgument>(
    T0: T0
  ): Reified<TransferPolicy<ToPhantomTypeArgument<T0>>> {
    return {
      typeName: TransferPolicy.$typeName,
      fullTypeName: composeSuiType(
        TransferPolicy.$typeName,
        ...[extractType(T0)]
      ) as `0x2::transfer_policy::TransferPolicy<${ToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [T0],
      fromFields: (fields: Record<string, any>) => TransferPolicy.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => TransferPolicy.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => TransferPolicy.fromBcs(T0, data),
      bcs: TransferPolicy.bcs,
      fromJSONField: (field: any) => TransferPolicy.fromJSONField(T0, field),
      fetch: async (client: SuiClient, id: string) => TransferPolicy.fetch(client, T0, id),
      kind: 'StructClassReified',
    }
  }

  static fromFields<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    fields: Record<string, any>
  ): TransferPolicy<ToPhantomTypeArgument<T0>> {
    return TransferPolicy.new(typeArg, {
      id: decodeFromFields(UID.reified(), fields.id),
      balance: decodeFromFields(Balance.reified(SUI.reified()), fields.balance),
      rules: decodeFromFields(VecSet.reified(TypeName.reified()), fields.rules),
    })
  }

  static fromFieldsWithTypes<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    item: FieldsWithTypes
  ): TransferPolicy<ToPhantomTypeArgument<T0>> {
    if (!isTransferPolicy(item.type)) {
      throw new Error('not a TransferPolicy type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return TransferPolicy.new(typeArg, {
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      balance: decodeFromFieldsWithTypes(Balance.reified(SUI.reified()), item.fields.balance),
      rules: decodeFromFieldsWithTypes(VecSet.reified(TypeName.reified()), item.fields.rules),
    })
  }

  static fromBcs<T0 extends ReifiedPhantomTypeArgument>(
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
    return { $typeName: this.$typeName, $typeArg: this.$typeArg, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    field: any
  ): TransferPolicy<ToPhantomTypeArgument<T0>> {
    return TransferPolicy.new(typeArg, {
      id: decodeFromJSONField(UID.reified(), field.id),
      balance: decodeFromJSONField(Balance.reified(SUI.reified()), field.balance),
      rules: decodeFromJSONField(VecSet.reified(TypeName.reified()), field.rules),
    })
  }

  static fromJSON<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    json: Record<string, any>
  ): TransferPolicy<ToPhantomTypeArgument<T0>> {
    if (json.$typeName !== TransferPolicy.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(TransferPolicy.$typeName, extractType(typeArg)),
      [json.$typeArg],
      [typeArg]
    )

    return TransferPolicy.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends ReifiedPhantomTypeArgument>(
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

  static async fetch<T0 extends ReifiedPhantomTypeArgument>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<TransferPolicy<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching TransferPolicy object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isTransferPolicy(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a TransferPolicy object`)
    }
    return TransferPolicy.fromFieldsWithTypes(typeArg, res.data.content)
  }
}

/* ============================== TransferPolicyCap =============================== */

export function isTransferPolicyCap(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::transfer_policy::TransferPolicyCap<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface TransferPolicyCapFields<T0 extends PhantomTypeArgument> {
  id: ToField<UID>
  policyId: ToField<ID>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class TransferPolicyCap<T0 extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::transfer_policy::TransferPolicyCap'
  static readonly $numTypeParams = 1

  readonly $fullTypeName =
    null as unknown as `0x2::transfer_policy::TransferPolicyCap<${ToTypeStr<T0>}>`

  readonly $typeName = TransferPolicyCap.$typeName

  static get bcs() {
    return bcs.struct('TransferPolicyCap', {
      id: UID.bcs,
      policy_id: ID.bcs,
    })
  }

  readonly $typeArg: string

  readonly id: ToField<UID>
  readonly policyId: ToField<ID>

  private constructor(typeArg: string, fields: TransferPolicyCapFields<T0>) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.policyId = fields.policyId
  }

  static new<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    fields: TransferPolicyCapFields<ToPhantomTypeArgument<T0>>
  ): TransferPolicyCap<ToPhantomTypeArgument<T0>> {
    return new TransferPolicyCap(extractType(typeArg), fields)
  }

  static reified<T0 extends ReifiedPhantomTypeArgument>(
    T0: T0
  ): Reified<TransferPolicyCap<ToPhantomTypeArgument<T0>>> {
    return {
      typeName: TransferPolicyCap.$typeName,
      fullTypeName: composeSuiType(
        TransferPolicyCap.$typeName,
        ...[extractType(T0)]
      ) as `0x2::transfer_policy::TransferPolicyCap<${ToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [T0],
      fromFields: (fields: Record<string, any>) => TransferPolicyCap.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        TransferPolicyCap.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => TransferPolicyCap.fromBcs(T0, data),
      bcs: TransferPolicyCap.bcs,
      fromJSONField: (field: any) => TransferPolicyCap.fromJSONField(T0, field),
      fetch: async (client: SuiClient, id: string) => TransferPolicyCap.fetch(client, T0, id),
      kind: 'StructClassReified',
    }
  }

  static fromFields<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    fields: Record<string, any>
  ): TransferPolicyCap<ToPhantomTypeArgument<T0>> {
    return TransferPolicyCap.new(typeArg, {
      id: decodeFromFields(UID.reified(), fields.id),
      policyId: decodeFromFields(ID.reified(), fields.policy_id),
    })
  }

  static fromFieldsWithTypes<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    item: FieldsWithTypes
  ): TransferPolicyCap<ToPhantomTypeArgument<T0>> {
    if (!isTransferPolicyCap(item.type)) {
      throw new Error('not a TransferPolicyCap type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return TransferPolicyCap.new(typeArg, {
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      policyId: decodeFromFieldsWithTypes(ID.reified(), item.fields.policy_id),
    })
  }

  static fromBcs<T0 extends ReifiedPhantomTypeArgument>(
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
    return { $typeName: this.$typeName, $typeArg: this.$typeArg, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    field: any
  ): TransferPolicyCap<ToPhantomTypeArgument<T0>> {
    return TransferPolicyCap.new(typeArg, {
      id: decodeFromJSONField(UID.reified(), field.id),
      policyId: decodeFromJSONField(ID.reified(), field.policyId),
    })
  }

  static fromJSON<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    json: Record<string, any>
  ): TransferPolicyCap<ToPhantomTypeArgument<T0>> {
    if (json.$typeName !== TransferPolicyCap.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(TransferPolicyCap.$typeName, extractType(typeArg)),
      [json.$typeArg],
      [typeArg]
    )

    return TransferPolicyCap.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends ReifiedPhantomTypeArgument>(
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

  static async fetch<T0 extends ReifiedPhantomTypeArgument>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<TransferPolicyCap<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching TransferPolicyCap object at id ${id}: ${res.error.code}`)
    }
    if (
      res.data?.content?.dataType !== 'moveObject' ||
      !isTransferPolicyCap(res.data.content.type)
    ) {
      throw new Error(`object at id ${id} is not a TransferPolicyCap object`)
    }
    return TransferPolicyCap.fromFieldsWithTypes(typeArg, res.data.content)
  }
}

/* ============================== TransferPolicyCreated =============================== */

export function isTransferPolicyCreated(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::transfer_policy::TransferPolicyCreated<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface TransferPolicyCreatedFields<T0 extends PhantomTypeArgument> {
  id: ToField<ID>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class TransferPolicyCreated<T0 extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::transfer_policy::TransferPolicyCreated'
  static readonly $numTypeParams = 1

  readonly $fullTypeName =
    null as unknown as `0x2::transfer_policy::TransferPolicyCreated<${ToTypeStr<T0>}>`

  readonly $typeName = TransferPolicyCreated.$typeName

  static get bcs() {
    return bcs.struct('TransferPolicyCreated', {
      id: ID.bcs,
    })
  }

  readonly $typeArg: string

  readonly id: ToField<ID>

  private constructor(typeArg: string, id: ToField<ID>) {
    this.$typeArg = typeArg

    this.id = id
  }

  static new<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    id: ToField<ID>
  ): TransferPolicyCreated<ToPhantomTypeArgument<T0>> {
    return new TransferPolicyCreated(extractType(typeArg), id)
  }

  static reified<T0 extends ReifiedPhantomTypeArgument>(
    T0: T0
  ): Reified<TransferPolicyCreated<ToPhantomTypeArgument<T0>>> {
    return {
      typeName: TransferPolicyCreated.$typeName,
      fullTypeName: composeSuiType(
        TransferPolicyCreated.$typeName,
        ...[extractType(T0)]
      ) as `0x2::transfer_policy::TransferPolicyCreated<${ToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [T0],
      fromFields: (fields: Record<string, any>) => TransferPolicyCreated.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        TransferPolicyCreated.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => TransferPolicyCreated.fromBcs(T0, data),
      bcs: TransferPolicyCreated.bcs,
      fromJSONField: (field: any) => TransferPolicyCreated.fromJSONField(T0, field),
      fetch: async (client: SuiClient, id: string) => TransferPolicyCreated.fetch(client, T0, id),
      kind: 'StructClassReified',
    }
  }

  static fromFields<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    fields: Record<string, any>
  ): TransferPolicyCreated<ToPhantomTypeArgument<T0>> {
    return TransferPolicyCreated.new(typeArg, decodeFromFields(ID.reified(), fields.id))
  }

  static fromFieldsWithTypes<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    item: FieldsWithTypes
  ): TransferPolicyCreated<ToPhantomTypeArgument<T0>> {
    if (!isTransferPolicyCreated(item.type)) {
      throw new Error('not a TransferPolicyCreated type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return TransferPolicyCreated.new(
      typeArg,
      decodeFromFieldsWithTypes(ID.reified(), item.fields.id)
    )
  }

  static fromBcs<T0 extends ReifiedPhantomTypeArgument>(
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
    return { $typeName: this.$typeName, $typeArg: this.$typeArg, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    field: any
  ): TransferPolicyCreated<ToPhantomTypeArgument<T0>> {
    return TransferPolicyCreated.new(typeArg, decodeFromJSONField(ID.reified(), field.id))
  }

  static fromJSON<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    json: Record<string, any>
  ): TransferPolicyCreated<ToPhantomTypeArgument<T0>> {
    if (json.$typeName !== TransferPolicyCreated.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(TransferPolicyCreated.$typeName, extractType(typeArg)),
      [json.$typeArg],
      [typeArg]
    )

    return TransferPolicyCreated.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends ReifiedPhantomTypeArgument>(
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

  static async fetch<T0 extends ReifiedPhantomTypeArgument>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<TransferPolicyCreated<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching TransferPolicyCreated object at id ${id}: ${res.error.code}`)
    }
    if (
      res.data?.content?.dataType !== 'moveObject' ||
      !isTransferPolicyCreated(res.data.content.type)
    ) {
      throw new Error(`object at id ${id} is not a TransferPolicyCreated object`)
    }
    return TransferPolicyCreated.fromFieldsWithTypes(typeArg, res.data.content)
  }
}

/* ============================== TransferPolicyDestroyed =============================== */

export function isTransferPolicyDestroyed(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::transfer_policy::TransferPolicyDestroyed<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface TransferPolicyDestroyedFields<T0 extends PhantomTypeArgument> {
  id: ToField<ID>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class TransferPolicyDestroyed<T0 extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::transfer_policy::TransferPolicyDestroyed'
  static readonly $numTypeParams = 1

  readonly $fullTypeName =
    null as unknown as `0x2::transfer_policy::TransferPolicyDestroyed<${ToTypeStr<T0>}>`

  readonly $typeName = TransferPolicyDestroyed.$typeName

  static get bcs() {
    return bcs.struct('TransferPolicyDestroyed', {
      id: ID.bcs,
    })
  }

  readonly $typeArg: string

  readonly id: ToField<ID>

  private constructor(typeArg: string, id: ToField<ID>) {
    this.$typeArg = typeArg

    this.id = id
  }

  static new<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    id: ToField<ID>
  ): TransferPolicyDestroyed<ToPhantomTypeArgument<T0>> {
    return new TransferPolicyDestroyed(extractType(typeArg), id)
  }

  static reified<T0 extends ReifiedPhantomTypeArgument>(
    T0: T0
  ): Reified<TransferPolicyDestroyed<ToPhantomTypeArgument<T0>>> {
    return {
      typeName: TransferPolicyDestroyed.$typeName,
      fullTypeName: composeSuiType(
        TransferPolicyDestroyed.$typeName,
        ...[extractType(T0)]
      ) as `0x2::transfer_policy::TransferPolicyDestroyed<${ToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [T0],
      fromFields: (fields: Record<string, any>) => TransferPolicyDestroyed.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        TransferPolicyDestroyed.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => TransferPolicyDestroyed.fromBcs(T0, data),
      bcs: TransferPolicyDestroyed.bcs,
      fromJSONField: (field: any) => TransferPolicyDestroyed.fromJSONField(T0, field),
      fetch: async (client: SuiClient, id: string) => TransferPolicyDestroyed.fetch(client, T0, id),
      kind: 'StructClassReified',
    }
  }

  static fromFields<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    fields: Record<string, any>
  ): TransferPolicyDestroyed<ToPhantomTypeArgument<T0>> {
    return TransferPolicyDestroyed.new(typeArg, decodeFromFields(ID.reified(), fields.id))
  }

  static fromFieldsWithTypes<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    item: FieldsWithTypes
  ): TransferPolicyDestroyed<ToPhantomTypeArgument<T0>> {
    if (!isTransferPolicyDestroyed(item.type)) {
      throw new Error('not a TransferPolicyDestroyed type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return TransferPolicyDestroyed.new(
      typeArg,
      decodeFromFieldsWithTypes(ID.reified(), item.fields.id)
    )
  }

  static fromBcs<T0 extends ReifiedPhantomTypeArgument>(
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
    return { $typeName: this.$typeName, $typeArg: this.$typeArg, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    field: any
  ): TransferPolicyDestroyed<ToPhantomTypeArgument<T0>> {
    return TransferPolicyDestroyed.new(typeArg, decodeFromJSONField(ID.reified(), field.id))
  }

  static fromJSON<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    json: Record<string, any>
  ): TransferPolicyDestroyed<ToPhantomTypeArgument<T0>> {
    if (json.$typeName !== TransferPolicyDestroyed.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(TransferPolicyDestroyed.$typeName, extractType(typeArg)),
      [json.$typeArg],
      [typeArg]
    )

    return TransferPolicyDestroyed.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends ReifiedPhantomTypeArgument>(
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

  static async fetch<T0 extends ReifiedPhantomTypeArgument>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<TransferPolicyDestroyed<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(
        `error fetching TransferPolicyDestroyed object at id ${id}: ${res.error.code}`
      )
    }
    if (
      res.data?.content?.dataType !== 'moveObject' ||
      !isTransferPolicyDestroyed(res.data.content.type)
    ) {
      throw new Error(`object at id ${id} is not a TransferPolicyDestroyed object`)
    }
    return TransferPolicyDestroyed.fromFieldsWithTypes(typeArg, res.data.content)
  }
}
