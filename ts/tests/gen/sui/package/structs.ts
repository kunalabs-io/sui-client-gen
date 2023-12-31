import { FieldsWithTypes, Type, compressSuiType, genericToJSON } from '../../_framework/util'
import { String } from '../../move-stdlib/ascii/structs'
import { ID, UID } from '../object/structs'
import { bcs } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== Publisher =============================== */

export function isPublisher(type: Type): boolean {
  type = compressSuiType(type)
  return type === '0x2::package::Publisher'
}

export interface PublisherFields {
  id: string
  package: string
  moduleName: string
}

export class Publisher {
  static readonly $typeName = '0x2::package::Publisher'
  static readonly $numTypeParams = 0

  static get bcs() {
    return bcs.struct('Publisher', {
      id: UID.bcs,
      package: String.bcs,
      module_name: String.bcs,
    })
  }

  readonly id: string
  readonly package: string
  readonly moduleName: string

  constructor(fields: PublisherFields) {
    this.id = fields.id
    this.package = fields.package
    this.moduleName = fields.moduleName
  }

  static fromFields(fields: Record<string, any>): Publisher {
    return new Publisher({
      id: UID.fromFields(fields.id).id,
      package: new TextDecoder()
        .decode(Uint8Array.from(String.fromFields(fields.package).bytes))
        .toString(),
      moduleName: new TextDecoder()
        .decode(Uint8Array.from(String.fromFields(fields.module_name).bytes))
        .toString(),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Publisher {
    if (!isPublisher(item.type)) {
      throw new Error('not a Publisher type')
    }
    return new Publisher({
      id: item.fields.id.id,
      package: item.fields.package,
      moduleName: item.fields.module_name,
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

  static fromSuiParsedData(content: SuiParsedData) {
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

export function isUpgradeCap(type: Type): boolean {
  type = compressSuiType(type)
  return type === '0x2::package::UpgradeCap'
}

export interface UpgradeCapFields {
  id: string
  package: string
  version: bigint
  policy: number
}

export class UpgradeCap {
  static readonly $typeName = '0x2::package::UpgradeCap'
  static readonly $numTypeParams = 0

  static get bcs() {
    return bcs.struct('UpgradeCap', {
      id: UID.bcs,
      package: ID.bcs,
      version: bcs.u64(),
      policy: bcs.u8(),
    })
  }

  readonly id: string
  readonly package: string
  readonly version: bigint
  readonly policy: number

  constructor(fields: UpgradeCapFields) {
    this.id = fields.id
    this.package = fields.package
    this.version = fields.version
    this.policy = fields.policy
  }

  static fromFields(fields: Record<string, any>): UpgradeCap {
    return new UpgradeCap({
      id: UID.fromFields(fields.id).id,
      package: ID.fromFields(fields.package).bytes,
      version: BigInt(fields.version),
      policy: fields.policy,
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): UpgradeCap {
    if (!isUpgradeCap(item.type)) {
      throw new Error('not a UpgradeCap type')
    }
    return new UpgradeCap({
      id: item.fields.id.id,
      package: item.fields.package,
      version: BigInt(item.fields.version),
      policy: item.fields.policy,
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

  static fromSuiParsedData(content: SuiParsedData) {
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

export function isUpgradeReceipt(type: Type): boolean {
  type = compressSuiType(type)
  return type === '0x2::package::UpgradeReceipt'
}

export interface UpgradeReceiptFields {
  cap: string
  package: string
}

export class UpgradeReceipt {
  static readonly $typeName = '0x2::package::UpgradeReceipt'
  static readonly $numTypeParams = 0

  static get bcs() {
    return bcs.struct('UpgradeReceipt', {
      cap: ID.bcs,
      package: ID.bcs,
    })
  }

  readonly cap: string
  readonly package: string

  constructor(fields: UpgradeReceiptFields) {
    this.cap = fields.cap
    this.package = fields.package
  }

  static fromFields(fields: Record<string, any>): UpgradeReceipt {
    return new UpgradeReceipt({
      cap: ID.fromFields(fields.cap).bytes,
      package: ID.fromFields(fields.package).bytes,
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): UpgradeReceipt {
    if (!isUpgradeReceipt(item.type)) {
      throw new Error('not a UpgradeReceipt type')
    }
    return new UpgradeReceipt({ cap: item.fields.cap, package: item.fields.package })
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

export function isUpgradeTicket(type: Type): boolean {
  type = compressSuiType(type)
  return type === '0x2::package::UpgradeTicket'
}

export interface UpgradeTicketFields {
  cap: string
  package: string
  policy: number
  digest: Array<number>
}

export class UpgradeTicket {
  static readonly $typeName = '0x2::package::UpgradeTicket'
  static readonly $numTypeParams = 0

  static get bcs() {
    return bcs.struct('UpgradeTicket', {
      cap: ID.bcs,
      package: ID.bcs,
      policy: bcs.u8(),
      digest: bcs.vector(bcs.u8()),
    })
  }

  readonly cap: string
  readonly package: string
  readonly policy: number
  readonly digest: Array<number>

  constructor(fields: UpgradeTicketFields) {
    this.cap = fields.cap
    this.package = fields.package
    this.policy = fields.policy
    this.digest = fields.digest
  }

  static fromFields(fields: Record<string, any>): UpgradeTicket {
    return new UpgradeTicket({
      cap: ID.fromFields(fields.cap).bytes,
      package: ID.fromFields(fields.package).bytes,
      policy: fields.policy,
      digest: fields.digest.map((item: any) => item),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): UpgradeTicket {
    if (!isUpgradeTicket(item.type)) {
      throw new Error('not a UpgradeTicket type')
    }
    return new UpgradeTicket({
      cap: item.fields.cap,
      package: item.fields.package,
      policy: item.fields.policy,
      digest: item.fields.digest.map((item: any) => item),
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
