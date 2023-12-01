import { FieldsWithTypes, Type, compressSuiType, parseTypeName } from '../../_framework/util'
import { TypeName } from '../../move-stdlib/type-name/structs'
import { Balance } from '../balance/structs'
import { ID, UID } from '../object/structs'
import { VecSet } from '../vec-set/structs'
import { bcs } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== RuleKey =============================== */

export function isRuleKey(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::transfer_policy::RuleKey<')
}

export interface RuleKeyFields {
  dummyField: boolean
}

export class RuleKey {
  static readonly $typeName = '0x2::transfer_policy::RuleKey'
  static readonly $numTypeParams = 1

  static get bcs() {
    return bcs.struct('RuleKey', {
      dummy_field: bcs.bool(),
    })
  }

  readonly $typeArg: Type

  readonly dummyField: boolean

  constructor(typeArg: Type, dummyField: boolean) {
    this.$typeArg = typeArg

    this.dummyField = dummyField
  }

  static fromFields(typeArg: Type, fields: Record<string, any>): RuleKey {
    return new RuleKey(typeArg, fields.dummy_field)
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): RuleKey {
    if (!isRuleKey(item.type)) {
      throw new Error('not a RuleKey type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new RuleKey(typeArgs[0], item.fields.dummy_field)
  }

  static fromBcs(typeArg: Type, data: Uint8Array): RuleKey {
    return RuleKey.fromFields(typeArg, RuleKey.bcs.parse(data))
  }
}

/* ============================== TransferPolicy =============================== */

export function isTransferPolicy(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::transfer_policy::TransferPolicy<')
}

export interface TransferPolicyFields {
  id: string
  balance: Balance
  rules: VecSet<TypeName>
}

export class TransferPolicy {
  static readonly $typeName = '0x2::transfer_policy::TransferPolicy'
  static readonly $numTypeParams = 1

  static get bcs() {
    return bcs.struct('TransferPolicy', {
      id: UID.bcs,
      balance: Balance.bcs,
      rules: VecSet.bcs(TypeName.bcs),
    })
  }

  readonly $typeArg: Type

  readonly id: string
  readonly balance: Balance
  readonly rules: VecSet<TypeName>

  constructor(typeArg: Type, fields: TransferPolicyFields) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.balance = fields.balance
    this.rules = fields.rules
  }

  static fromFields(typeArg: Type, fields: Record<string, any>): TransferPolicy {
    return new TransferPolicy(typeArg, {
      id: UID.fromFields(fields.id).id,
      balance: Balance.fromFields(`0x2::sui::SUI`, fields.balance),
      rules: VecSet.fromFields<TypeName>(`0x1::type_name::TypeName`, fields.rules),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): TransferPolicy {
    if (!isTransferPolicy(item.type)) {
      throw new Error('not a TransferPolicy type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new TransferPolicy(typeArgs[0], {
      id: item.fields.id.id,
      balance: new Balance(`0x2::sui::SUI`, BigInt(item.fields.balance)),
      rules: VecSet.fromFieldsWithTypes<TypeName>(item.fields.rules),
    })
  }

  static fromBcs(typeArg: Type, data: Uint8Array): TransferPolicy {
    return TransferPolicy.fromFields(typeArg, TransferPolicy.bcs.parse(data))
  }

  static fromSuiParsedData(content: SuiParsedData) {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isTransferPolicy(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a TransferPolicy object`)
    }
    return TransferPolicy.fromFieldsWithTypes(content)
  }

  static async fetch(client: SuiClient, id: string): Promise<TransferPolicy> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching TransferPolicy object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isTransferPolicy(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a TransferPolicy object`)
    }
    return TransferPolicy.fromFieldsWithTypes(res.data.content)
  }
}

/* ============================== TransferPolicyCap =============================== */

export function isTransferPolicyCap(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::transfer_policy::TransferPolicyCap<')
}

export interface TransferPolicyCapFields {
  id: string
  policyId: string
}

export class TransferPolicyCap {
  static readonly $typeName = '0x2::transfer_policy::TransferPolicyCap'
  static readonly $numTypeParams = 1

  static get bcs() {
    return bcs.struct('TransferPolicyCap', {
      id: UID.bcs,
      policy_id: ID.bcs,
    })
  }

  readonly $typeArg: Type

  readonly id: string
  readonly policyId: string

  constructor(typeArg: Type, fields: TransferPolicyCapFields) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.policyId = fields.policyId
  }

  static fromFields(typeArg: Type, fields: Record<string, any>): TransferPolicyCap {
    return new TransferPolicyCap(typeArg, {
      id: UID.fromFields(fields.id).id,
      policyId: ID.fromFields(fields.policy_id).bytes,
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): TransferPolicyCap {
    if (!isTransferPolicyCap(item.type)) {
      throw new Error('not a TransferPolicyCap type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new TransferPolicyCap(typeArgs[0], {
      id: item.fields.id.id,
      policyId: item.fields.policy_id,
    })
  }

  static fromBcs(typeArg: Type, data: Uint8Array): TransferPolicyCap {
    return TransferPolicyCap.fromFields(typeArg, TransferPolicyCap.bcs.parse(data))
  }

  static fromSuiParsedData(content: SuiParsedData) {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isTransferPolicyCap(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a TransferPolicyCap object`)
    }
    return TransferPolicyCap.fromFieldsWithTypes(content)
  }

  static async fetch(client: SuiClient, id: string): Promise<TransferPolicyCap> {
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
    return TransferPolicyCap.fromFieldsWithTypes(res.data.content)
  }
}

/* ============================== TransferPolicyCreated =============================== */

export function isTransferPolicyCreated(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::transfer_policy::TransferPolicyCreated<')
}

export interface TransferPolicyCreatedFields {
  id: string
}

export class TransferPolicyCreated {
  static readonly $typeName = '0x2::transfer_policy::TransferPolicyCreated'
  static readonly $numTypeParams = 1

  static get bcs() {
    return bcs.struct('TransferPolicyCreated', {
      id: ID.bcs,
    })
  }

  readonly $typeArg: Type

  readonly id: string

  constructor(typeArg: Type, id: string) {
    this.$typeArg = typeArg

    this.id = id
  }

  static fromFields(typeArg: Type, fields: Record<string, any>): TransferPolicyCreated {
    return new TransferPolicyCreated(typeArg, ID.fromFields(fields.id).bytes)
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): TransferPolicyCreated {
    if (!isTransferPolicyCreated(item.type)) {
      throw new Error('not a TransferPolicyCreated type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new TransferPolicyCreated(typeArgs[0], item.fields.id)
  }

  static fromBcs(typeArg: Type, data: Uint8Array): TransferPolicyCreated {
    return TransferPolicyCreated.fromFields(typeArg, TransferPolicyCreated.bcs.parse(data))
  }
}

/* ============================== TransferRequest =============================== */

export function isTransferRequest(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::transfer_policy::TransferRequest<')
}

export interface TransferRequestFields {
  item: string
  paid: bigint
  from: string
  receipts: VecSet<TypeName>
}

export class TransferRequest {
  static readonly $typeName = '0x2::transfer_policy::TransferRequest'
  static readonly $numTypeParams = 1

  static get bcs() {
    return bcs.struct('TransferRequest', {
      item: ID.bcs,
      paid: bcs.u64(),
      from: ID.bcs,
      receipts: VecSet.bcs(TypeName.bcs),
    })
  }

  readonly $typeArg: Type

  readonly item: string
  readonly paid: bigint
  readonly from: string
  readonly receipts: VecSet<TypeName>

  constructor(typeArg: Type, fields: TransferRequestFields) {
    this.$typeArg = typeArg

    this.item = fields.item
    this.paid = fields.paid
    this.from = fields.from
    this.receipts = fields.receipts
  }

  static fromFields(typeArg: Type, fields: Record<string, any>): TransferRequest {
    return new TransferRequest(typeArg, {
      item: ID.fromFields(fields.item).bytes,
      paid: BigInt(fields.paid),
      from: ID.fromFields(fields.from).bytes,
      receipts: VecSet.fromFields<TypeName>(`0x1::type_name::TypeName`, fields.receipts),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): TransferRequest {
    if (!isTransferRequest(item.type)) {
      throw new Error('not a TransferRequest type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new TransferRequest(typeArgs[0], {
      item: item.fields.item,
      paid: BigInt(item.fields.paid),
      from: item.fields.from,
      receipts: VecSet.fromFieldsWithTypes<TypeName>(item.fields.receipts),
    })
  }

  static fromBcs(typeArg: Type, data: Uint8Array): TransferRequest {
    return TransferRequest.fromFields(typeArg, TransferRequest.bcs.parse(data))
  }
}
