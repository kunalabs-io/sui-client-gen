import {
  ToField,
  decodeFromFieldsGenericOrSpecial,
  decodeFromFieldsWithTypesGenericOrSpecial,
  reified,
} from '../../_framework/types'
import { FieldsWithTypes, compressSuiType, genericToJSON } from '../../_framework/util'
import { String } from '../../move-stdlib/ascii/structs'
import { ID, UID } from '../object/structs'
import { bcs } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== Publisher =============================== */

export function isPublisher(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x2::package::Publisher'
}

export interface PublisherFields {
  id: ToField<UID>
  package: ToField<String>
  moduleName: ToField<String>
}

export class Publisher {
  static readonly $typeName = '0x2::package::Publisher'
  static readonly $numTypeParams = 0

  readonly $typeName = Publisher.$typeName

  static get bcs() {
    return bcs.struct('Publisher', {
      id: UID.bcs,
      package: String.bcs,
      module_name: String.bcs,
    })
  }

  readonly id: ToField<UID>
  readonly package: ToField<String>
  readonly moduleName: ToField<String>

  private constructor(fields: PublisherFields) {
    this.id = fields.id
    this.package = fields.package
    this.moduleName = fields.moduleName
  }

  static new(fields: PublisherFields): Publisher {
    return new Publisher(fields)
  }

  static reified() {
    return {
      typeName: Publisher.$typeName,
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => Publisher.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Publisher.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => Publisher.fromBcs(data),
      bcs: Publisher.bcs,
      __class: null as unknown as ReturnType<typeof Publisher.new>,
    }
  }

  static fromFields(fields: Record<string, any>): Publisher {
    return Publisher.new({
      id: decodeFromFieldsGenericOrSpecial(UID.reified(), fields.id),
      package: decodeFromFieldsGenericOrSpecial(String.reified(), fields.package),
      moduleName: decodeFromFieldsGenericOrSpecial(String.reified(), fields.module_name),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Publisher {
    if (!isPublisher(item.type)) {
      throw new Error('not a Publisher type')
    }

    return Publisher.new({
      id: decodeFromFieldsWithTypesGenericOrSpecial(UID.reified(), item.fields.id),
      package: decodeFromFieldsWithTypesGenericOrSpecial(String.reified(), item.fields.package),
      moduleName: decodeFromFieldsWithTypesGenericOrSpecial(
        String.reified(),
        item.fields.module_name
      ),
    })
  }

  static fromBcs(data: Uint8Array): Publisher {
    return Publisher.fromFields(Publisher.bcs.parse(data))
  }

  toJSON() {
    return {
      id: this.id,
      package: this.package,
      moduleName: this.moduleName,
    }
  }

  static fromSuiParsedData(content: SuiParsedData): Publisher {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isPublisher(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Publisher object`)
    }
    return Publisher.fromFieldsWithTypes(content)
  }

  static async fetch(client: SuiClient, id: string): Promise<Publisher> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching Publisher object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isPublisher(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a Publisher object`)
    }
    return Publisher.fromFieldsWithTypes(res.data.content)
  }
}

/* ============================== UpgradeCap =============================== */

export function isUpgradeCap(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x2::package::UpgradeCap'
}

export interface UpgradeCapFields {
  id: ToField<UID>
  package: ToField<ID>
  version: ToField<'u64'>
  policy: ToField<'u8'>
}

export class UpgradeCap {
  static readonly $typeName = '0x2::package::UpgradeCap'
  static readonly $numTypeParams = 0

  readonly $typeName = UpgradeCap.$typeName

  static get bcs() {
    return bcs.struct('UpgradeCap', {
      id: UID.bcs,
      package: ID.bcs,
      version: bcs.u64(),
      policy: bcs.u8(),
    })
  }

  readonly id: ToField<UID>
  readonly package: ToField<ID>
  readonly version: ToField<'u64'>
  readonly policy: ToField<'u8'>

  private constructor(fields: UpgradeCapFields) {
    this.id = fields.id
    this.package = fields.package
    this.version = fields.version
    this.policy = fields.policy
  }

  static new(fields: UpgradeCapFields): UpgradeCap {
    return new UpgradeCap(fields)
  }

  static reified() {
    return {
      typeName: UpgradeCap.$typeName,
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => UpgradeCap.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => UpgradeCap.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => UpgradeCap.fromBcs(data),
      bcs: UpgradeCap.bcs,
      __class: null as unknown as ReturnType<typeof UpgradeCap.new>,
    }
  }

  static fromFields(fields: Record<string, any>): UpgradeCap {
    return UpgradeCap.new({
      id: decodeFromFieldsGenericOrSpecial(UID.reified(), fields.id),
      package: decodeFromFieldsGenericOrSpecial(ID.reified(), fields.package),
      version: decodeFromFieldsGenericOrSpecial('u64', fields.version),
      policy: decodeFromFieldsGenericOrSpecial('u8', fields.policy),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): UpgradeCap {
    if (!isUpgradeCap(item.type)) {
      throw new Error('not a UpgradeCap type')
    }

    return UpgradeCap.new({
      id: decodeFromFieldsWithTypesGenericOrSpecial(UID.reified(), item.fields.id),
      package: decodeFromFieldsWithTypesGenericOrSpecial(ID.reified(), item.fields.package),
      version: decodeFromFieldsWithTypesGenericOrSpecial('u64', item.fields.version),
      policy: decodeFromFieldsWithTypesGenericOrSpecial('u8', item.fields.policy),
    })
  }

  static fromBcs(data: Uint8Array): UpgradeCap {
    return UpgradeCap.fromFields(UpgradeCap.bcs.parse(data))
  }

  toJSON() {
    return {
      id: this.id,
      package: this.package,
      version: this.version.toString(),
      policy: this.policy,
    }
  }

  static fromSuiParsedData(content: SuiParsedData): UpgradeCap {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isUpgradeCap(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a UpgradeCap object`)
    }
    return UpgradeCap.fromFieldsWithTypes(content)
  }

  static async fetch(client: SuiClient, id: string): Promise<UpgradeCap> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching UpgradeCap object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isUpgradeCap(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a UpgradeCap object`)
    }
    return UpgradeCap.fromFieldsWithTypes(res.data.content)
  }
}

/* ============================== UpgradeReceipt =============================== */

export function isUpgradeReceipt(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x2::package::UpgradeReceipt'
}

export interface UpgradeReceiptFields {
  cap: ToField<ID>
  package: ToField<ID>
}

export class UpgradeReceipt {
  static readonly $typeName = '0x2::package::UpgradeReceipt'
  static readonly $numTypeParams = 0

  readonly $typeName = UpgradeReceipt.$typeName

  static get bcs() {
    return bcs.struct('UpgradeReceipt', {
      cap: ID.bcs,
      package: ID.bcs,
    })
  }

  readonly cap: ToField<ID>
  readonly package: ToField<ID>

  private constructor(fields: UpgradeReceiptFields) {
    this.cap = fields.cap
    this.package = fields.package
  }

  static new(fields: UpgradeReceiptFields): UpgradeReceipt {
    return new UpgradeReceipt(fields)
  }

  static reified() {
    return {
      typeName: UpgradeReceipt.$typeName,
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => UpgradeReceipt.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => UpgradeReceipt.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => UpgradeReceipt.fromBcs(data),
      bcs: UpgradeReceipt.bcs,
      __class: null as unknown as ReturnType<typeof UpgradeReceipt.new>,
    }
  }

  static fromFields(fields: Record<string, any>): UpgradeReceipt {
    return UpgradeReceipt.new({
      cap: decodeFromFieldsGenericOrSpecial(ID.reified(), fields.cap),
      package: decodeFromFieldsGenericOrSpecial(ID.reified(), fields.package),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): UpgradeReceipt {
    if (!isUpgradeReceipt(item.type)) {
      throw new Error('not a UpgradeReceipt type')
    }

    return UpgradeReceipt.new({
      cap: decodeFromFieldsWithTypesGenericOrSpecial(ID.reified(), item.fields.cap),
      package: decodeFromFieldsWithTypesGenericOrSpecial(ID.reified(), item.fields.package),
    })
  }

  static fromBcs(data: Uint8Array): UpgradeReceipt {
    return UpgradeReceipt.fromFields(UpgradeReceipt.bcs.parse(data))
  }

  toJSON() {
    return {
      cap: this.cap,
      package: this.package,
    }
  }
}

/* ============================== UpgradeTicket =============================== */

export function isUpgradeTicket(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x2::package::UpgradeTicket'
}

export interface UpgradeTicketFields {
  cap: ToField<ID>
  package: ToField<ID>
  policy: ToField<'u8'>
  digest: Array<ToField<'u8'>>
}

export class UpgradeTicket {
  static readonly $typeName = '0x2::package::UpgradeTicket'
  static readonly $numTypeParams = 0

  readonly $typeName = UpgradeTicket.$typeName

  static get bcs() {
    return bcs.struct('UpgradeTicket', {
      cap: ID.bcs,
      package: ID.bcs,
      policy: bcs.u8(),
      digest: bcs.vector(bcs.u8()),
    })
  }

  readonly cap: ToField<ID>
  readonly package: ToField<ID>
  readonly policy: ToField<'u8'>
  readonly digest: Array<ToField<'u8'>>

  private constructor(fields: UpgradeTicketFields) {
    this.cap = fields.cap
    this.package = fields.package
    this.policy = fields.policy
    this.digest = fields.digest
  }

  static new(fields: UpgradeTicketFields): UpgradeTicket {
    return new UpgradeTicket(fields)
  }

  static reified() {
    return {
      typeName: UpgradeTicket.$typeName,
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => UpgradeTicket.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => UpgradeTicket.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => UpgradeTicket.fromBcs(data),
      bcs: UpgradeTicket.bcs,
      __class: null as unknown as ReturnType<typeof UpgradeTicket.new>,
    }
  }

  static fromFields(fields: Record<string, any>): UpgradeTicket {
    return UpgradeTicket.new({
      cap: decodeFromFieldsGenericOrSpecial(ID.reified(), fields.cap),
      package: decodeFromFieldsGenericOrSpecial(ID.reified(), fields.package),
      policy: decodeFromFieldsGenericOrSpecial('u8', fields.policy),
      digest: decodeFromFieldsGenericOrSpecial(reified.vector('u8'), fields.digest),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): UpgradeTicket {
    if (!isUpgradeTicket(item.type)) {
      throw new Error('not a UpgradeTicket type')
    }

    return UpgradeTicket.new({
      cap: decodeFromFieldsWithTypesGenericOrSpecial(ID.reified(), item.fields.cap),
      package: decodeFromFieldsWithTypesGenericOrSpecial(ID.reified(), item.fields.package),
      policy: decodeFromFieldsWithTypesGenericOrSpecial('u8', item.fields.policy),
      digest: decodeFromFieldsWithTypesGenericOrSpecial(reified.vector('u8'), item.fields.digest),
    })
  }

  static fromBcs(data: Uint8Array): UpgradeTicket {
    return UpgradeTicket.fromFields(UpgradeTicket.bcs.parse(data))
  }

  toJSON() {
    return {
      cap: this.cap,
      package: this.package,
      policy: this.policy,
      digest: genericToJSON(`vector<u8>`, this.digest),
    }
  }
}
