import { TypeName } from '../../_dependencies/source/0x1/type-name/structs'
import {
  ReifiedTypeArgument,
  ToField,
  assertFieldsWithTypesArgsMatch,
  decodeFromFieldsGenericOrSpecial,
  decodeFromFieldsWithTypesGenericOrSpecial,
  extractType,
} from '../../_framework/types'
import { FieldsWithTypes, Type, compressSuiType } from '../../_framework/util'
import { Balance } from '../balance/structs'
import { ID, UID } from '../object/structs'
import { SUI } from '../sui/structs'
import { VecSet } from '../vec-set/structs'
import { bcs } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== RuleKey =============================== */

export function isRuleKey(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::transfer_policy::RuleKey<')
}

export interface RuleKeyFields {
  dummyField: ToField<'bool'>
}

export class RuleKey {
  static readonly $typeName = '0x2::transfer_policy::RuleKey'
  static readonly $numTypeParams = 1

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

  static new(typeArg: ReifiedTypeArgument, dummyField: ToField<'bool'>): RuleKey {
    return new RuleKey(extractType(typeArg), dummyField)
  }

  static reified(T: ReifiedTypeArgument) {
    return {
      typeName: RuleKey.$typeName,
      typeArgs: [T],
      fromFields: (fields: Record<string, any>) => RuleKey.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => RuleKey.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => RuleKey.fromBcs(T, data),
      bcs: RuleKey.bcs,
      __class: null as unknown as ReturnType<typeof RuleKey.new>,
    }
  }

  static fromFields(typeArg: ReifiedTypeArgument, fields: Record<string, any>): RuleKey {
    return RuleKey.new(typeArg, decodeFromFieldsGenericOrSpecial('bool', fields.dummy_field))
  }

  static fromFieldsWithTypes(typeArg: ReifiedTypeArgument, item: FieldsWithTypes): RuleKey {
    if (!isRuleKey(item.type)) {
      throw new Error('not a RuleKey type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return RuleKey.new(
      typeArg,
      decodeFromFieldsWithTypesGenericOrSpecial('bool', item.fields.dummy_field)
    )
  }

  static fromBcs(typeArg: ReifiedTypeArgument, data: Uint8Array): RuleKey {
    return RuleKey.fromFields(typeArg, RuleKey.bcs.parse(data))
  }

  toJSON() {
    return {
      $typeArg: this.$typeArg,
      dummyField: this.dummyField,
    }
  }
}

/* ============================== TransferPolicy =============================== */

export function isTransferPolicy(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::transfer_policy::TransferPolicy<')
}

export interface TransferPolicyFields {
  id: ToField<UID>
  balance: ToField<Balance>
  rules: ToField<VecSet<TypeName>>
}

export class TransferPolicy {
  static readonly $typeName = '0x2::transfer_policy::TransferPolicy'
  static readonly $numTypeParams = 1

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
  readonly balance: ToField<Balance>
  readonly rules: ToField<VecSet<TypeName>>

  private constructor(typeArg: string, fields: TransferPolicyFields) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.balance = fields.balance
    this.rules = fields.rules
  }

  static new(typeArg: ReifiedTypeArgument, fields: TransferPolicyFields): TransferPolicy {
    return new TransferPolicy(extractType(typeArg), fields)
  }

  static reified(T: ReifiedTypeArgument) {
    return {
      typeName: TransferPolicy.$typeName,
      typeArgs: [T],
      fromFields: (fields: Record<string, any>) => TransferPolicy.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => TransferPolicy.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => TransferPolicy.fromBcs(T, data),
      bcs: TransferPolicy.bcs,
      __class: null as unknown as ReturnType<typeof TransferPolicy.new>,
    }
  }

  static fromFields(typeArg: ReifiedTypeArgument, fields: Record<string, any>): TransferPolicy {
    return TransferPolicy.new(typeArg, {
      id: decodeFromFieldsGenericOrSpecial(UID.reified(), fields.id),
      balance: decodeFromFieldsGenericOrSpecial(Balance.reified(SUI.reified()), fields.balance),
      rules: decodeFromFieldsGenericOrSpecial(VecSet.reified(TypeName.reified()), fields.rules),
    })
  }

  static fromFieldsWithTypes(typeArg: ReifiedTypeArgument, item: FieldsWithTypes): TransferPolicy {
    if (!isTransferPolicy(item.type)) {
      throw new Error('not a TransferPolicy type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return TransferPolicy.new(typeArg, {
      id: decodeFromFieldsWithTypesGenericOrSpecial(UID.reified(), item.fields.id),
      balance: decodeFromFieldsWithTypesGenericOrSpecial(
        Balance.reified(SUI.reified()),
        item.fields.balance
      ),
      rules: decodeFromFieldsWithTypesGenericOrSpecial(
        VecSet.reified(TypeName.reified()),
        item.fields.rules
      ),
    })
  }

  static fromBcs(typeArg: ReifiedTypeArgument, data: Uint8Array): TransferPolicy {
    return TransferPolicy.fromFields(typeArg, TransferPolicy.bcs.parse(data))
  }

  toJSON() {
    return {
      $typeArg: this.$typeArg,
      id: this.id,
      balance: this.balance.toJSON(),
      rules: this.rules.toJSON(),
    }
  }

  static fromSuiParsedData(typeArg: ReifiedTypeArgument, content: SuiParsedData): TransferPolicy {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isTransferPolicy(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a TransferPolicy object`)
    }
    return TransferPolicy.fromFieldsWithTypes(typeArg, content)
  }

  static async fetch(
    client: SuiClient,
    typeArg: ReifiedTypeArgument,
    id: string
  ): Promise<TransferPolicy> {
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

export function isTransferPolicyCap(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::transfer_policy::TransferPolicyCap<')
}

export interface TransferPolicyCapFields {
  id: ToField<UID>
  policyId: ToField<ID>
}

export class TransferPolicyCap {
  static readonly $typeName = '0x2::transfer_policy::TransferPolicyCap'
  static readonly $numTypeParams = 1

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

  private constructor(typeArg: string, fields: TransferPolicyCapFields) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.policyId = fields.policyId
  }

  static new(typeArg: ReifiedTypeArgument, fields: TransferPolicyCapFields): TransferPolicyCap {
    return new TransferPolicyCap(extractType(typeArg), fields)
  }

  static reified(T: ReifiedTypeArgument) {
    return {
      typeName: TransferPolicyCap.$typeName,
      typeArgs: [T],
      fromFields: (fields: Record<string, any>) => TransferPolicyCap.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        TransferPolicyCap.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => TransferPolicyCap.fromBcs(T, data),
      bcs: TransferPolicyCap.bcs,
      __class: null as unknown as ReturnType<typeof TransferPolicyCap.new>,
    }
  }

  static fromFields(typeArg: ReifiedTypeArgument, fields: Record<string, any>): TransferPolicyCap {
    return TransferPolicyCap.new(typeArg, {
      id: decodeFromFieldsGenericOrSpecial(UID.reified(), fields.id),
      policyId: decodeFromFieldsGenericOrSpecial(ID.reified(), fields.policy_id),
    })
  }

  static fromFieldsWithTypes(
    typeArg: ReifiedTypeArgument,
    item: FieldsWithTypes
  ): TransferPolicyCap {
    if (!isTransferPolicyCap(item.type)) {
      throw new Error('not a TransferPolicyCap type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return TransferPolicyCap.new(typeArg, {
      id: decodeFromFieldsWithTypesGenericOrSpecial(UID.reified(), item.fields.id),
      policyId: decodeFromFieldsWithTypesGenericOrSpecial(ID.reified(), item.fields.policy_id),
    })
  }

  static fromBcs(typeArg: ReifiedTypeArgument, data: Uint8Array): TransferPolicyCap {
    return TransferPolicyCap.fromFields(typeArg, TransferPolicyCap.bcs.parse(data))
  }

  toJSON() {
    return {
      $typeArg: this.$typeArg,
      id: this.id,
      policyId: this.policyId,
    }
  }

  static fromSuiParsedData(
    typeArg: ReifiedTypeArgument,
    content: SuiParsedData
  ): TransferPolicyCap {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isTransferPolicyCap(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a TransferPolicyCap object`)
    }
    return TransferPolicyCap.fromFieldsWithTypes(typeArg, content)
  }

  static async fetch(
    client: SuiClient,
    typeArg: ReifiedTypeArgument,
    id: string
  ): Promise<TransferPolicyCap> {
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

export function isTransferPolicyCreated(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::transfer_policy::TransferPolicyCreated<')
}

export interface TransferPolicyCreatedFields {
  id: ToField<ID>
}

export class TransferPolicyCreated {
  static readonly $typeName = '0x2::transfer_policy::TransferPolicyCreated'
  static readonly $numTypeParams = 1

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

  static new(typeArg: ReifiedTypeArgument, id: ToField<ID>): TransferPolicyCreated {
    return new TransferPolicyCreated(extractType(typeArg), id)
  }

  static reified(T: ReifiedTypeArgument) {
    return {
      typeName: TransferPolicyCreated.$typeName,
      typeArgs: [T],
      fromFields: (fields: Record<string, any>) => TransferPolicyCreated.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        TransferPolicyCreated.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => TransferPolicyCreated.fromBcs(T, data),
      bcs: TransferPolicyCreated.bcs,
      __class: null as unknown as ReturnType<typeof TransferPolicyCreated.new>,
    }
  }

  static fromFields(
    typeArg: ReifiedTypeArgument,
    fields: Record<string, any>
  ): TransferPolicyCreated {
    return TransferPolicyCreated.new(
      typeArg,
      decodeFromFieldsGenericOrSpecial(ID.reified(), fields.id)
    )
  }

  static fromFieldsWithTypes(
    typeArg: ReifiedTypeArgument,
    item: FieldsWithTypes
  ): TransferPolicyCreated {
    if (!isTransferPolicyCreated(item.type)) {
      throw new Error('not a TransferPolicyCreated type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return TransferPolicyCreated.new(
      typeArg,
      decodeFromFieldsWithTypesGenericOrSpecial(ID.reified(), item.fields.id)
    )
  }

  static fromBcs(typeArg: ReifiedTypeArgument, data: Uint8Array): TransferPolicyCreated {
    return TransferPolicyCreated.fromFields(typeArg, TransferPolicyCreated.bcs.parse(data))
  }

  toJSON() {
    return {
      $typeArg: this.$typeArg,
      id: this.id,
    }
  }
}

/* ============================== TransferPolicyDestroyed =============================== */

export function isTransferPolicyDestroyed(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::transfer_policy::TransferPolicyDestroyed<')
}

export interface TransferPolicyDestroyedFields {
  id: ToField<ID>
}

export class TransferPolicyDestroyed {
  static readonly $typeName = '0x2::transfer_policy::TransferPolicyDestroyed'
  static readonly $numTypeParams = 1

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

  static new(typeArg: ReifiedTypeArgument, id: ToField<ID>): TransferPolicyDestroyed {
    return new TransferPolicyDestroyed(extractType(typeArg), id)
  }

  static reified(T: ReifiedTypeArgument) {
    return {
      typeName: TransferPolicyDestroyed.$typeName,
      typeArgs: [T],
      fromFields: (fields: Record<string, any>) => TransferPolicyDestroyed.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        TransferPolicyDestroyed.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => TransferPolicyDestroyed.fromBcs(T, data),
      bcs: TransferPolicyDestroyed.bcs,
      __class: null as unknown as ReturnType<typeof TransferPolicyDestroyed.new>,
    }
  }

  static fromFields(
    typeArg: ReifiedTypeArgument,
    fields: Record<string, any>
  ): TransferPolicyDestroyed {
    return TransferPolicyDestroyed.new(
      typeArg,
      decodeFromFieldsGenericOrSpecial(ID.reified(), fields.id)
    )
  }

  static fromFieldsWithTypes(
    typeArg: ReifiedTypeArgument,
    item: FieldsWithTypes
  ): TransferPolicyDestroyed {
    if (!isTransferPolicyDestroyed(item.type)) {
      throw new Error('not a TransferPolicyDestroyed type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return TransferPolicyDestroyed.new(
      typeArg,
      decodeFromFieldsWithTypesGenericOrSpecial(ID.reified(), item.fields.id)
    )
  }

  static fromBcs(typeArg: ReifiedTypeArgument, data: Uint8Array): TransferPolicyDestroyed {
    return TransferPolicyDestroyed.fromFields(typeArg, TransferPolicyDestroyed.bcs.parse(data))
  }

  toJSON() {
    return {
      $typeArg: this.$typeArg,
      id: this.id,
    }
  }
}

/* ============================== TransferRequest =============================== */

export function isTransferRequest(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::transfer_policy::TransferRequest<')
}

export interface TransferRequestFields {
  item: ToField<ID>
  paid: ToField<'u64'>
  from: ToField<ID>
  receipts: ToField<VecSet<TypeName>>
}

export class TransferRequest {
  static readonly $typeName = '0x2::transfer_policy::TransferRequest'
  static readonly $numTypeParams = 1

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

  private constructor(typeArg: string, fields: TransferRequestFields) {
    this.$typeArg = typeArg

    this.item = fields.item
    this.paid = fields.paid
    this.from = fields.from
    this.receipts = fields.receipts
  }

  static new(typeArg: ReifiedTypeArgument, fields: TransferRequestFields): TransferRequest {
    return new TransferRequest(extractType(typeArg), fields)
  }

  static reified(T: ReifiedTypeArgument) {
    return {
      typeName: TransferRequest.$typeName,
      typeArgs: [T],
      fromFields: (fields: Record<string, any>) => TransferRequest.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => TransferRequest.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => TransferRequest.fromBcs(T, data),
      bcs: TransferRequest.bcs,
      __class: null as unknown as ReturnType<typeof TransferRequest.new>,
    }
  }

  static fromFields(typeArg: ReifiedTypeArgument, fields: Record<string, any>): TransferRequest {
    return TransferRequest.new(typeArg, {
      item: decodeFromFieldsGenericOrSpecial(ID.reified(), fields.item),
      paid: decodeFromFieldsGenericOrSpecial('u64', fields.paid),
      from: decodeFromFieldsGenericOrSpecial(ID.reified(), fields.from),
      receipts: decodeFromFieldsGenericOrSpecial(
        VecSet.reified(TypeName.reified()),
        fields.receipts
      ),
    })
  }

  static fromFieldsWithTypes(typeArg: ReifiedTypeArgument, item: FieldsWithTypes): TransferRequest {
    if (!isTransferRequest(item.type)) {
      throw new Error('not a TransferRequest type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return TransferRequest.new(typeArg, {
      item: decodeFromFieldsWithTypesGenericOrSpecial(ID.reified(), item.fields.item),
      paid: decodeFromFieldsWithTypesGenericOrSpecial('u64', item.fields.paid),
      from: decodeFromFieldsWithTypesGenericOrSpecial(ID.reified(), item.fields.from),
      receipts: decodeFromFieldsWithTypesGenericOrSpecial(
        VecSet.reified(TypeName.reified()),
        item.fields.receipts
      ),
    })
  }

  static fromBcs(typeArg: ReifiedTypeArgument, data: Uint8Array): TransferRequest {
    return TransferRequest.fromFields(typeArg, TransferRequest.bcs.parse(data))
  }

  toJSON() {
    return {
      $typeArg: this.$typeArg,
      item: this.item,
      paid: this.paid.toString(),
      from: this.from,
      receipts: this.receipts.toJSON(),
    }
  }
}
