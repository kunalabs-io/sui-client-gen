/**
 * Functions for operating on Move packages from within Move:
 * - Creating proof-of-publish objects from one-time witnesses
 * - Administering package upgrades through upgrade policies.
 */

import { String } from '../../_dependencies/std/ascii/structs'
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
import { ID, UID } from '../object/structs'
import { bcs } from '@mysten/sui/bcs'
import { SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromBase64 } from '@mysten/sui/utils'

/* ============================== Publisher =============================== */

export function isPublisher(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::package::Publisher`
}

export interface PublisherFields {
  id: ToField<UID>
  package: ToField<String>
  moduleName: ToField<String>
}

export type PublisherReified = Reified<Publisher, PublisherFields>

/**
 * This type can only be created in the transaction that
 * generates a module, by consuming its one-time witness, so it
 * can be used to identify the address that published the package
 * a type originated from.
 */
export class Publisher implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::package::Publisher` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = Publisher.$typeName
  readonly $fullTypeName: `0x2::package::Publisher`
  readonly $typeArgs: []
  readonly $isPhantom = Publisher.$isPhantom

  readonly id: ToField<UID>
  readonly package: ToField<String>
  readonly moduleName: ToField<String>

  private constructor(typeArgs: [], fields: PublisherFields) {
    this.$fullTypeName = composeSuiType(
      Publisher.$typeName,
      ...typeArgs
    ) as `0x2::package::Publisher`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.package = fields.package
    this.moduleName = fields.moduleName
  }

  static reified(): PublisherReified {
    const reifiedBcs = Publisher.bcs
    return {
      typeName: Publisher.$typeName,
      fullTypeName: composeSuiType(Publisher.$typeName, ...[]) as `0x2::package::Publisher`,
      typeArgs: [] as [],
      isPhantom: Publisher.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => Publisher.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Publisher.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => Publisher.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => Publisher.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => Publisher.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => Publisher.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => Publisher.fromSuiObjectData(content),
      fetch: async (client: SupportedSuiClient, id: string) => Publisher.fetch(client, id),
      new: (fields: PublisherFields) => {
        return new Publisher([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Publisher.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<Publisher>> {
    return phantom(Publisher.reified())
  }

  static get p() {
    return Publisher.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('Publisher', {
      id: UID.bcs,
      package: String.bcs,
      module_name: String.bcs,
    })
  }

  private static cachedBcs: ReturnType<typeof Publisher.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof Publisher.instantiateBcs> {
    if (!Publisher.cachedBcs) {
      Publisher.cachedBcs = Publisher.instantiateBcs()
    }
    return Publisher.cachedBcs
  }

  static fromFields(fields: Record<string, any>): Publisher {
    return Publisher.reified().new({
      id: decodeFromFields(UID.reified(), fields.id),
      package: decodeFromFields(String.reified(), fields.package),
      moduleName: decodeFromFields(String.reified(), fields.module_name),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Publisher {
    if (!isPublisher(item.type)) {
      throw new Error('not a Publisher type')
    }

    return Publisher.reified().new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      package: decodeFromFieldsWithTypes(String.reified(), item.fields.package),
      moduleName: decodeFromFieldsWithTypes(String.reified(), item.fields.module_name),
    })
  }

  static fromBcs(data: Uint8Array): Publisher {
    return Publisher.fromFields(Publisher.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
      package: this.package,
      moduleName: this.moduleName,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): Publisher {
    return Publisher.reified().new({
      id: decodeFromJSONField(UID.reified(), field.id),
      package: decodeFromJSONField(String.reified(), field.package),
      moduleName: decodeFromJSONField(String.reified(), field.moduleName),
    })
  }

  static fromJSON(json: Record<string, any>): Publisher {
    if (json.$typeName !== Publisher.$typeName) {
      throw new Error(
        `not a Publisher json object: expected '${Publisher.$typeName}' but got '${json.$typeName}'`
      )
    }

    return Publisher.fromJSONField(json)
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

  static fromSuiObjectData(data: SuiObjectData): Publisher {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isPublisher(data.bcs.type)) {
        throw new Error(`object at is not a Publisher object`)
      }

      return Publisher.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Publisher.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<Publisher> {
    const res = await fetchObjectBcs(client, id)
    if (!isPublisher(res.type)) {
      throw new Error(`object at id ${id} is not a Publisher object`)
    }

    return Publisher.fromBcs(res.bcsBytes)
  }
}

/* ============================== UpgradeCap =============================== */

export function isUpgradeCap(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::package::UpgradeCap`
}

export interface UpgradeCapFields {
  id: ToField<UID>
  /** (Mutable) ID of the package that can be upgraded. */
  package: ToField<ID>
  /**
   * (Mutable) The number of upgrades that have been applied
   * successively to the original package.  Initially 0.
   */
  version: ToField<'u64'>
  /** What kind of upgrades are allowed. */
  policy: ToField<'u8'>
}

export type UpgradeCapReified = Reified<UpgradeCap, UpgradeCapFields>

/** Capability controlling the ability to upgrade a package. */
export class UpgradeCap implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::package::UpgradeCap` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = UpgradeCap.$typeName
  readonly $fullTypeName: `0x2::package::UpgradeCap`
  readonly $typeArgs: []
  readonly $isPhantom = UpgradeCap.$isPhantom

  readonly id: ToField<UID>
  /** (Mutable) ID of the package that can be upgraded. */
  readonly package: ToField<ID>
  /**
   * (Mutable) The number of upgrades that have been applied
   * successively to the original package.  Initially 0.
   */
  readonly version: ToField<'u64'>
  /** What kind of upgrades are allowed. */
  readonly policy: ToField<'u8'>

  private constructor(typeArgs: [], fields: UpgradeCapFields) {
    this.$fullTypeName = composeSuiType(
      UpgradeCap.$typeName,
      ...typeArgs
    ) as `0x2::package::UpgradeCap`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.package = fields.package
    this.version = fields.version
    this.policy = fields.policy
  }

  static reified(): UpgradeCapReified {
    const reifiedBcs = UpgradeCap.bcs
    return {
      typeName: UpgradeCap.$typeName,
      fullTypeName: composeSuiType(UpgradeCap.$typeName, ...[]) as `0x2::package::UpgradeCap`,
      typeArgs: [] as [],
      isPhantom: UpgradeCap.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => UpgradeCap.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => UpgradeCap.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => UpgradeCap.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => UpgradeCap.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => UpgradeCap.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => UpgradeCap.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => UpgradeCap.fromSuiObjectData(content),
      fetch: async (client: SupportedSuiClient, id: string) => UpgradeCap.fetch(client, id),
      new: (fields: UpgradeCapFields) => {
        return new UpgradeCap([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return UpgradeCap.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<UpgradeCap>> {
    return phantom(UpgradeCap.reified())
  }

  static get p() {
    return UpgradeCap.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('UpgradeCap', {
      id: UID.bcs,
      package: ID.bcs,
      version: bcs.u64(),
      policy: bcs.u8(),
    })
  }

  private static cachedBcs: ReturnType<typeof UpgradeCap.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof UpgradeCap.instantiateBcs> {
    if (!UpgradeCap.cachedBcs) {
      UpgradeCap.cachedBcs = UpgradeCap.instantiateBcs()
    }
    return UpgradeCap.cachedBcs
  }

  static fromFields(fields: Record<string, any>): UpgradeCap {
    return UpgradeCap.reified().new({
      id: decodeFromFields(UID.reified(), fields.id),
      package: decodeFromFields(ID.reified(), fields.package),
      version: decodeFromFields('u64', fields.version),
      policy: decodeFromFields('u8', fields.policy),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): UpgradeCap {
    if (!isUpgradeCap(item.type)) {
      throw new Error('not a UpgradeCap type')
    }

    return UpgradeCap.reified().new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      package: decodeFromFieldsWithTypes(ID.reified(), item.fields.package),
      version: decodeFromFieldsWithTypes('u64', item.fields.version),
      policy: decodeFromFieldsWithTypes('u8', item.fields.policy),
    })
  }

  static fromBcs(data: Uint8Array): UpgradeCap {
    return UpgradeCap.fromFields(UpgradeCap.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
      package: this.package,
      version: this.version.toString(),
      policy: this.policy,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): UpgradeCap {
    return UpgradeCap.reified().new({
      id: decodeFromJSONField(UID.reified(), field.id),
      package: decodeFromJSONField(ID.reified(), field.package),
      version: decodeFromJSONField('u64', field.version),
      policy: decodeFromJSONField('u8', field.policy),
    })
  }

  static fromJSON(json: Record<string, any>): UpgradeCap {
    if (json.$typeName !== UpgradeCap.$typeName) {
      throw new Error(
        `not a UpgradeCap json object: expected '${UpgradeCap.$typeName}' but got '${json.$typeName}'`
      )
    }

    return UpgradeCap.fromJSONField(json)
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

  static fromSuiObjectData(data: SuiObjectData): UpgradeCap {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isUpgradeCap(data.bcs.type)) {
        throw new Error(`object at is not a UpgradeCap object`)
      }

      return UpgradeCap.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return UpgradeCap.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<UpgradeCap> {
    const res = await fetchObjectBcs(client, id)
    if (!isUpgradeCap(res.type)) {
      throw new Error(`object at id ${id} is not a UpgradeCap object`)
    }

    return UpgradeCap.fromBcs(res.bcsBytes)
  }
}

/* ============================== UpgradeTicket =============================== */

export function isUpgradeTicket(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::package::UpgradeTicket`
}

export interface UpgradeTicketFields {
  /** (Immutable) ID of the `UpgradeCap` this originated from. */
  cap: ToField<ID>
  /** (Immutable) ID of the package that can be upgraded. */
  package: ToField<ID>
  /**
   * (Immutable) The policy regarding what kind of upgrade this ticket
   * permits.
   */
  policy: ToField<'u8'>
  /**
   * (Immutable) SHA256 digest of the bytecode and transitive
   * dependencies that will be used in the upgrade.
   */
  digest: ToField<Vector<'u8'>>
}

export type UpgradeTicketReified = Reified<UpgradeTicket, UpgradeTicketFields>

/**
 * Permission to perform a particular upgrade (for a fixed version of
 * the package, bytecode to upgrade with and transitive dependencies to
 * depend against).
 *
 * An `UpgradeCap` can only issue one ticket at a time, to prevent races
 * between concurrent updates or a change in its upgrade policy after
 * issuing a ticket, so the ticket is a "Hot Potato" to preserve forward
 * progress.
 */
export class UpgradeTicket implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::package::UpgradeTicket` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = UpgradeTicket.$typeName
  readonly $fullTypeName: `0x2::package::UpgradeTicket`
  readonly $typeArgs: []
  readonly $isPhantom = UpgradeTicket.$isPhantom

  /** (Immutable) ID of the `UpgradeCap` this originated from. */
  readonly cap: ToField<ID>
  /** (Immutable) ID of the package that can be upgraded. */
  readonly package: ToField<ID>
  /**
   * (Immutable) The policy regarding what kind of upgrade this ticket
   * permits.
   */
  readonly policy: ToField<'u8'>
  /**
   * (Immutable) SHA256 digest of the bytecode and transitive
   * dependencies that will be used in the upgrade.
   */
  readonly digest: ToField<Vector<'u8'>>

  private constructor(typeArgs: [], fields: UpgradeTicketFields) {
    this.$fullTypeName = composeSuiType(
      UpgradeTicket.$typeName,
      ...typeArgs
    ) as `0x2::package::UpgradeTicket`
    this.$typeArgs = typeArgs

    this.cap = fields.cap
    this.package = fields.package
    this.policy = fields.policy
    this.digest = fields.digest
  }

  static reified(): UpgradeTicketReified {
    const reifiedBcs = UpgradeTicket.bcs
    return {
      typeName: UpgradeTicket.$typeName,
      fullTypeName: composeSuiType(UpgradeTicket.$typeName, ...[]) as `0x2::package::UpgradeTicket`,
      typeArgs: [] as [],
      isPhantom: UpgradeTicket.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => UpgradeTicket.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => UpgradeTicket.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => UpgradeTicket.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => UpgradeTicket.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => UpgradeTicket.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => UpgradeTicket.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => UpgradeTicket.fromSuiObjectData(content),
      fetch: async (client: SupportedSuiClient, id: string) => UpgradeTicket.fetch(client, id),
      new: (fields: UpgradeTicketFields) => {
        return new UpgradeTicket([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return UpgradeTicket.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<UpgradeTicket>> {
    return phantom(UpgradeTicket.reified())
  }

  static get p() {
    return UpgradeTicket.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('UpgradeTicket', {
      cap: ID.bcs,
      package: ID.bcs,
      policy: bcs.u8(),
      digest: bcs.vector(bcs.u8()),
    })
  }

  private static cachedBcs: ReturnType<typeof UpgradeTicket.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof UpgradeTicket.instantiateBcs> {
    if (!UpgradeTicket.cachedBcs) {
      UpgradeTicket.cachedBcs = UpgradeTicket.instantiateBcs()
    }
    return UpgradeTicket.cachedBcs
  }

  static fromFields(fields: Record<string, any>): UpgradeTicket {
    return UpgradeTicket.reified().new({
      cap: decodeFromFields(ID.reified(), fields.cap),
      package: decodeFromFields(ID.reified(), fields.package),
      policy: decodeFromFields('u8', fields.policy),
      digest: decodeFromFields(vector('u8'), fields.digest),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): UpgradeTicket {
    if (!isUpgradeTicket(item.type)) {
      throw new Error('not a UpgradeTicket type')
    }

    return UpgradeTicket.reified().new({
      cap: decodeFromFieldsWithTypes(ID.reified(), item.fields.cap),
      package: decodeFromFieldsWithTypes(ID.reified(), item.fields.package),
      policy: decodeFromFieldsWithTypes('u8', item.fields.policy),
      digest: decodeFromFieldsWithTypes(vector('u8'), item.fields.digest),
    })
  }

  static fromBcs(data: Uint8Array): UpgradeTicket {
    return UpgradeTicket.fromFields(UpgradeTicket.bcs.parse(data))
  }

  toJSONField() {
    return {
      cap: this.cap,
      package: this.package,
      policy: this.policy,
      digest: fieldToJSON<Vector<'u8'>>(`vector<u8>`, this.digest),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): UpgradeTicket {
    return UpgradeTicket.reified().new({
      cap: decodeFromJSONField(ID.reified(), field.cap),
      package: decodeFromJSONField(ID.reified(), field.package),
      policy: decodeFromJSONField('u8', field.policy),
      digest: decodeFromJSONField(vector('u8'), field.digest),
    })
  }

  static fromJSON(json: Record<string, any>): UpgradeTicket {
    if (json.$typeName !== UpgradeTicket.$typeName) {
      throw new Error(
        `not a UpgradeTicket json object: expected '${UpgradeTicket.$typeName}' but got '${json.$typeName}'`
      )
    }

    return UpgradeTicket.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): UpgradeTicket {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isUpgradeTicket(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a UpgradeTicket object`)
    }
    return UpgradeTicket.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): UpgradeTicket {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isUpgradeTicket(data.bcs.type)) {
        throw new Error(`object at is not a UpgradeTicket object`)
      }

      return UpgradeTicket.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return UpgradeTicket.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<UpgradeTicket> {
    const res = await fetchObjectBcs(client, id)
    if (!isUpgradeTicket(res.type)) {
      throw new Error(`object at id ${id} is not a UpgradeTicket object`)
    }

    return UpgradeTicket.fromBcs(res.bcsBytes)
  }
}

/* ============================== UpgradeReceipt =============================== */

export function isUpgradeReceipt(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::package::UpgradeReceipt`
}

export interface UpgradeReceiptFields {
  /** (Immutable) ID of the `UpgradeCap` this originated from. */
  cap: ToField<ID>
  /** (Immutable) ID of the package after it was upgraded. */
  package: ToField<ID>
}

export type UpgradeReceiptReified = Reified<UpgradeReceipt, UpgradeReceiptFields>

/**
 * Issued as a result of a successful upgrade, containing the
 * information to be used to update the `UpgradeCap`.  This is a "Hot
 * Potato" to ensure that it is used to update its `UpgradeCap` before
 * the end of the transaction that performed the upgrade.
 */
export class UpgradeReceipt implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::package::UpgradeReceipt` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = UpgradeReceipt.$typeName
  readonly $fullTypeName: `0x2::package::UpgradeReceipt`
  readonly $typeArgs: []
  readonly $isPhantom = UpgradeReceipt.$isPhantom

  /** (Immutable) ID of the `UpgradeCap` this originated from. */
  readonly cap: ToField<ID>
  /** (Immutable) ID of the package after it was upgraded. */
  readonly package: ToField<ID>

  private constructor(typeArgs: [], fields: UpgradeReceiptFields) {
    this.$fullTypeName = composeSuiType(
      UpgradeReceipt.$typeName,
      ...typeArgs
    ) as `0x2::package::UpgradeReceipt`
    this.$typeArgs = typeArgs

    this.cap = fields.cap
    this.package = fields.package
  }

  static reified(): UpgradeReceiptReified {
    const reifiedBcs = UpgradeReceipt.bcs
    return {
      typeName: UpgradeReceipt.$typeName,
      fullTypeName: composeSuiType(
        UpgradeReceipt.$typeName,
        ...[]
      ) as `0x2::package::UpgradeReceipt`,
      typeArgs: [] as [],
      isPhantom: UpgradeReceipt.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => UpgradeReceipt.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => UpgradeReceipt.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => UpgradeReceipt.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => UpgradeReceipt.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => UpgradeReceipt.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => UpgradeReceipt.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => UpgradeReceipt.fromSuiObjectData(content),
      fetch: async (client: SupportedSuiClient, id: string) => UpgradeReceipt.fetch(client, id),
      new: (fields: UpgradeReceiptFields) => {
        return new UpgradeReceipt([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return UpgradeReceipt.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<UpgradeReceipt>> {
    return phantom(UpgradeReceipt.reified())
  }

  static get p() {
    return UpgradeReceipt.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('UpgradeReceipt', {
      cap: ID.bcs,
      package: ID.bcs,
    })
  }

  private static cachedBcs: ReturnType<typeof UpgradeReceipt.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof UpgradeReceipt.instantiateBcs> {
    if (!UpgradeReceipt.cachedBcs) {
      UpgradeReceipt.cachedBcs = UpgradeReceipt.instantiateBcs()
    }
    return UpgradeReceipt.cachedBcs
  }

  static fromFields(fields: Record<string, any>): UpgradeReceipt {
    return UpgradeReceipt.reified().new({
      cap: decodeFromFields(ID.reified(), fields.cap),
      package: decodeFromFields(ID.reified(), fields.package),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): UpgradeReceipt {
    if (!isUpgradeReceipt(item.type)) {
      throw new Error('not a UpgradeReceipt type')
    }

    return UpgradeReceipt.reified().new({
      cap: decodeFromFieldsWithTypes(ID.reified(), item.fields.cap),
      package: decodeFromFieldsWithTypes(ID.reified(), item.fields.package),
    })
  }

  static fromBcs(data: Uint8Array): UpgradeReceipt {
    return UpgradeReceipt.fromFields(UpgradeReceipt.bcs.parse(data))
  }

  toJSONField() {
    return {
      cap: this.cap,
      package: this.package,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): UpgradeReceipt {
    return UpgradeReceipt.reified().new({
      cap: decodeFromJSONField(ID.reified(), field.cap),
      package: decodeFromJSONField(ID.reified(), field.package),
    })
  }

  static fromJSON(json: Record<string, any>): UpgradeReceipt {
    if (json.$typeName !== UpgradeReceipt.$typeName) {
      throw new Error(
        `not a UpgradeReceipt json object: expected '${UpgradeReceipt.$typeName}' but got '${json.$typeName}'`
      )
    }

    return UpgradeReceipt.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): UpgradeReceipt {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isUpgradeReceipt(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a UpgradeReceipt object`)
    }
    return UpgradeReceipt.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): UpgradeReceipt {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isUpgradeReceipt(data.bcs.type)) {
        throw new Error(`object at is not a UpgradeReceipt object`)
      }

      return UpgradeReceipt.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return UpgradeReceipt.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<UpgradeReceipt> {
    const res = await fetchObjectBcs(client, id)
    if (!isUpgradeReceipt(res.type)) {
      throw new Error(`object at id ${id} is not a UpgradeReceipt object`)
    }

    return UpgradeReceipt.fromBcs(res.bcsBytes)
  }
}
