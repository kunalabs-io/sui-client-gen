import * as reified from '../../_framework/reified'
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
} from '../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../_framework/util'
import { Vector } from '../../_framework/vector'
import { Option } from '../../move-stdlib-chain/option/structs'
import { bcs } from '@mysten/sui/bcs'
import { SuiClient, SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromB64 } from '@mysten/sui/utils'

/* ============================== PCREntry =============================== */

export function isPCREntry(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::nitro_attestation::PCREntry`
}

export interface PCREntryFields {
  index: ToField<'u8'>
  value: ToField<Vector<'u8'>>
}

export type PCREntryReified = Reified<PCREntry, PCREntryFields>

export class PCREntry implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::nitro_attestation::PCREntry`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = PCREntry.$typeName
  readonly $fullTypeName: `0x2::nitro_attestation::PCREntry`
  readonly $typeArgs: []
  readonly $isPhantom = PCREntry.$isPhantom

  readonly index: ToField<'u8'>
  readonly value: ToField<Vector<'u8'>>

  private constructor(typeArgs: [], fields: PCREntryFields) {
    this.$fullTypeName = composeSuiType(
      PCREntry.$typeName,
      ...typeArgs
    ) as `0x2::nitro_attestation::PCREntry`
    this.$typeArgs = typeArgs

    this.index = fields.index
    this.value = fields.value
  }

  static reified(): PCREntryReified {
    const reifiedBcs = PCREntry.bcs
    return {
      typeName: PCREntry.$typeName,
      fullTypeName: composeSuiType(PCREntry.$typeName, ...[]) as `0x2::nitro_attestation::PCREntry`,
      typeArgs: [] as [],
      isPhantom: PCREntry.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => PCREntry.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => PCREntry.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => PCREntry.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => PCREntry.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => PCREntry.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => PCREntry.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => PCREntry.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => PCREntry.fetch(client, id),
      new: (fields: PCREntryFields) => {
        return new PCREntry([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return PCREntry.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<PCREntry>> {
    return phantom(PCREntry.reified())
  }

  static get p() {
    return PCREntry.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('PCREntry', {
      index: bcs.u8(),
      value: bcs.vector(bcs.u8()),
    })
  }

  private static cachedBcs: ReturnType<typeof PCREntry.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof PCREntry.instantiateBcs> {
    if (!PCREntry.cachedBcs) {
      PCREntry.cachedBcs = PCREntry.instantiateBcs()
    }
    return PCREntry.cachedBcs
  }

  static fromFields(fields: Record<string, any>): PCREntry {
    return PCREntry.reified().new({
      index: decodeFromFields('u8', fields.index),
      value: decodeFromFields(reified.vector('u8'), fields.value),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): PCREntry {
    if (!isPCREntry(item.type)) {
      throw new Error('not a PCREntry type')
    }

    return PCREntry.reified().new({
      index: decodeFromFieldsWithTypes('u8', item.fields.index),
      value: decodeFromFieldsWithTypes(reified.vector('u8'), item.fields.value),
    })
  }

  static fromBcs(data: Uint8Array): PCREntry {
    return PCREntry.fromFields(PCREntry.bcs.parse(data))
  }

  toJSONField() {
    return {
      index: this.index,
      value: fieldToJSON<Vector<'u8'>>(`vector<u8>`, this.value),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): PCREntry {
    return PCREntry.reified().new({
      index: decodeFromJSONField('u8', field.index),
      value: decodeFromJSONField(reified.vector('u8'), field.value),
    })
  }

  static fromJSON(json: Record<string, any>): PCREntry {
    if (json.$typeName !== PCREntry.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return PCREntry.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): PCREntry {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isPCREntry(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a PCREntry object`)
    }
    return PCREntry.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): PCREntry {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isPCREntry(data.bcs.type)) {
        throw new Error(`object at is not a PCREntry object`)
      }

      return PCREntry.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return PCREntry.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<PCREntry> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching PCREntry object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isPCREntry(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a PCREntry object`)
    }

    return PCREntry.fromSuiObjectData(res.data)
  }
}

/* ============================== NitroAttestationDocument =============================== */

export function isNitroAttestationDocument(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::nitro_attestation::NitroAttestationDocument`
}

export interface NitroAttestationDocumentFields {
  moduleId: ToField<Vector<'u8'>>
  timestamp: ToField<'u64'>
  digest: ToField<Vector<'u8'>>
  pcrs: ToField<Vector<PCREntry>>
  publicKey: ToField<Option<Vector<'u8'>>>
  userData: ToField<Option<Vector<'u8'>>>
  nonce: ToField<Option<Vector<'u8'>>>
}

export type NitroAttestationDocumentReified = Reified<
  NitroAttestationDocument,
  NitroAttestationDocumentFields
>

export class NitroAttestationDocument implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::nitro_attestation::NitroAttestationDocument`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = NitroAttestationDocument.$typeName
  readonly $fullTypeName: `0x2::nitro_attestation::NitroAttestationDocument`
  readonly $typeArgs: []
  readonly $isPhantom = NitroAttestationDocument.$isPhantom

  readonly moduleId: ToField<Vector<'u8'>>
  readonly timestamp: ToField<'u64'>
  readonly digest: ToField<Vector<'u8'>>
  readonly pcrs: ToField<Vector<PCREntry>>
  readonly publicKey: ToField<Option<Vector<'u8'>>>
  readonly userData: ToField<Option<Vector<'u8'>>>
  readonly nonce: ToField<Option<Vector<'u8'>>>

  private constructor(typeArgs: [], fields: NitroAttestationDocumentFields) {
    this.$fullTypeName = composeSuiType(
      NitroAttestationDocument.$typeName,
      ...typeArgs
    ) as `0x2::nitro_attestation::NitroAttestationDocument`
    this.$typeArgs = typeArgs

    this.moduleId = fields.moduleId
    this.timestamp = fields.timestamp
    this.digest = fields.digest
    this.pcrs = fields.pcrs
    this.publicKey = fields.publicKey
    this.userData = fields.userData
    this.nonce = fields.nonce
  }

  static reified(): NitroAttestationDocumentReified {
    const reifiedBcs = NitroAttestationDocument.bcs
    return {
      typeName: NitroAttestationDocument.$typeName,
      fullTypeName: composeSuiType(
        NitroAttestationDocument.$typeName,
        ...[]
      ) as `0x2::nitro_attestation::NitroAttestationDocument`,
      typeArgs: [] as [],
      isPhantom: NitroAttestationDocument.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => NitroAttestationDocument.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        NitroAttestationDocument.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => NitroAttestationDocument.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => NitroAttestationDocument.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => NitroAttestationDocument.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) =>
        NitroAttestationDocument.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) =>
        NitroAttestationDocument.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => NitroAttestationDocument.fetch(client, id),
      new: (fields: NitroAttestationDocumentFields) => {
        return new NitroAttestationDocument([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return NitroAttestationDocument.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<NitroAttestationDocument>> {
    return phantom(NitroAttestationDocument.reified())
  }

  static get p() {
    return NitroAttestationDocument.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('NitroAttestationDocument', {
      module_id: bcs.vector(bcs.u8()),
      timestamp: bcs.u64(),
      digest: bcs.vector(bcs.u8()),
      pcrs: bcs.vector(PCREntry.bcs),
      public_key: Option.bcs(bcs.vector(bcs.u8())),
      user_data: Option.bcs(bcs.vector(bcs.u8())),
      nonce: Option.bcs(bcs.vector(bcs.u8())),
    })
  }

  private static cachedBcs: ReturnType<typeof NitroAttestationDocument.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof NitroAttestationDocument.instantiateBcs> {
    if (!NitroAttestationDocument.cachedBcs) {
      NitroAttestationDocument.cachedBcs = NitroAttestationDocument.instantiateBcs()
    }
    return NitroAttestationDocument.cachedBcs
  }

  static fromFields(fields: Record<string, any>): NitroAttestationDocument {
    return NitroAttestationDocument.reified().new({
      moduleId: decodeFromFields(reified.vector('u8'), fields.module_id),
      timestamp: decodeFromFields('u64', fields.timestamp),
      digest: decodeFromFields(reified.vector('u8'), fields.digest),
      pcrs: decodeFromFields(reified.vector(PCREntry.reified()), fields.pcrs),
      publicKey: decodeFromFields(Option.reified(reified.vector('u8')), fields.public_key),
      userData: decodeFromFields(Option.reified(reified.vector('u8')), fields.user_data),
      nonce: decodeFromFields(Option.reified(reified.vector('u8')), fields.nonce),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): NitroAttestationDocument {
    if (!isNitroAttestationDocument(item.type)) {
      throw new Error('not a NitroAttestationDocument type')
    }

    return NitroAttestationDocument.reified().new({
      moduleId: decodeFromFieldsWithTypes(reified.vector('u8'), item.fields.module_id),
      timestamp: decodeFromFieldsWithTypes('u64', item.fields.timestamp),
      digest: decodeFromFieldsWithTypes(reified.vector('u8'), item.fields.digest),
      pcrs: decodeFromFieldsWithTypes(reified.vector(PCREntry.reified()), item.fields.pcrs),
      publicKey: decodeFromFieldsWithTypes(
        Option.reified(reified.vector('u8')),
        item.fields.public_key
      ),
      userData: decodeFromFieldsWithTypes(
        Option.reified(reified.vector('u8')),
        item.fields.user_data
      ),
      nonce: decodeFromFieldsWithTypes(Option.reified(reified.vector('u8')), item.fields.nonce),
    })
  }

  static fromBcs(data: Uint8Array): NitroAttestationDocument {
    return NitroAttestationDocument.fromFields(NitroAttestationDocument.bcs.parse(data))
  }

  toJSONField() {
    return {
      moduleId: fieldToJSON<Vector<'u8'>>(`vector<u8>`, this.moduleId),
      timestamp: this.timestamp.toString(),
      digest: fieldToJSON<Vector<'u8'>>(`vector<u8>`, this.digest),
      pcrs: fieldToJSON<Vector<PCREntry>>(`vector<${PCREntry.$typeName}>`, this.pcrs),
      publicKey: fieldToJSON<Option<Vector<'u8'>>>(
        `${Option.$typeName}<vector<u8>>`,
        this.publicKey
      ),
      userData: fieldToJSON<Option<Vector<'u8'>>>(`${Option.$typeName}<vector<u8>>`, this.userData),
      nonce: fieldToJSON<Option<Vector<'u8'>>>(`${Option.$typeName}<vector<u8>>`, this.nonce),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): NitroAttestationDocument {
    return NitroAttestationDocument.reified().new({
      moduleId: decodeFromJSONField(reified.vector('u8'), field.moduleId),
      timestamp: decodeFromJSONField('u64', field.timestamp),
      digest: decodeFromJSONField(reified.vector('u8'), field.digest),
      pcrs: decodeFromJSONField(reified.vector(PCREntry.reified()), field.pcrs),
      publicKey: decodeFromJSONField(Option.reified(reified.vector('u8')), field.publicKey),
      userData: decodeFromJSONField(Option.reified(reified.vector('u8')), field.userData),
      nonce: decodeFromJSONField(Option.reified(reified.vector('u8')), field.nonce),
    })
  }

  static fromJSON(json: Record<string, any>): NitroAttestationDocument {
    if (json.$typeName !== NitroAttestationDocument.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return NitroAttestationDocument.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): NitroAttestationDocument {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isNitroAttestationDocument(content.type)) {
      throw new Error(
        `object at ${(content.fields as any).id} is not a NitroAttestationDocument object`
      )
    }
    return NitroAttestationDocument.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): NitroAttestationDocument {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isNitroAttestationDocument(data.bcs.type)) {
        throw new Error(`object at is not a NitroAttestationDocument object`)
      }

      return NitroAttestationDocument.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return NitroAttestationDocument.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<NitroAttestationDocument> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(
        `error fetching NitroAttestationDocument object at id ${id}: ${res.error.code}`
      )
    }
    if (
      res.data?.bcs?.dataType !== 'moveObject' ||
      !isNitroAttestationDocument(res.data.bcs.type)
    ) {
      throw new Error(`object at id ${id} is not a NitroAttestationDocument object`)
    }

    return NitroAttestationDocument.fromSuiObjectData(res.data)
  }
}
