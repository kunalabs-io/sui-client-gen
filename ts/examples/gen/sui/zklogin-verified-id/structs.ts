import { String } from '../../_dependencies/std/string/structs'
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
  phantom,
} from '../../_framework/reified'
import {
  FieldsWithTypes,
  SupportedSuiClient,
  composeSuiType,
  compressSuiType,
  fetchObjectBcs,
} from '../../_framework/util'
import { UID } from '../object/structs'
import { bcs } from '@mysten/sui/bcs'
import { SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromBase64, fromHex, toHex } from '@mysten/sui/utils'

/* ============================== VerifiedID =============================== */

export function isVerifiedID(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::zklogin_verified_id::VerifiedID`
}

export interface VerifiedIDFields {
  /** The ID of this VerifiedID */
  id: ToField<UID>
  /** The address this VerifiedID is associated with */
  owner: ToField<'address'>
  /** The name of the key claim */
  keyClaimName: ToField<String>
  /** The value of the key claim */
  keyClaimValue: ToField<String>
  /** The issuer */
  issuer: ToField<String>
  /** The audience (wallet) */
  audience: ToField<String>
}

export type VerifiedIDReified = Reified<VerifiedID, VerifiedIDFields>

export type VerifiedIDJSONField = {
  id: string
  owner: string
  keyClaimName: string
  keyClaimValue: string
  issuer: string
  audience: string
}

export type VerifiedIDJSON = {
  $typeName: typeof VerifiedID.$typeName
  $typeArgs: []
} & VerifiedIDJSONField

/** Possession of a VerifiedID proves that the user's address was created using zklogin and the given parameters. */
export class VerifiedID implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::zklogin_verified_id::VerifiedID` =
    `0x2::zklogin_verified_id::VerifiedID` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName: typeof VerifiedID.$typeName = VerifiedID.$typeName
  readonly $fullTypeName: `0x2::zklogin_verified_id::VerifiedID`
  readonly $typeArgs: []
  readonly $isPhantom: typeof VerifiedID.$isPhantom = VerifiedID.$isPhantom

  /** The ID of this VerifiedID */
  readonly id: ToField<UID>
  /** The address this VerifiedID is associated with */
  readonly owner: ToField<'address'>
  /** The name of the key claim */
  readonly keyClaimName: ToField<String>
  /** The value of the key claim */
  readonly keyClaimValue: ToField<String>
  /** The issuer */
  readonly issuer: ToField<String>
  /** The audience (wallet) */
  readonly audience: ToField<String>

  private constructor(typeArgs: [], fields: VerifiedIDFields) {
    this.$fullTypeName = composeSuiType(
      VerifiedID.$typeName,
      ...typeArgs
    ) as `0x2::zklogin_verified_id::VerifiedID`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.owner = fields.owner
    this.keyClaimName = fields.keyClaimName
    this.keyClaimValue = fields.keyClaimValue
    this.issuer = fields.issuer
    this.audience = fields.audience
  }

  static reified(): VerifiedIDReified {
    const reifiedBcs = VerifiedID.bcs
    return {
      typeName: VerifiedID.$typeName,
      fullTypeName: composeSuiType(
        VerifiedID.$typeName,
        ...[]
      ) as `0x2::zklogin_verified_id::VerifiedID`,
      typeArgs: [] as [],
      isPhantom: VerifiedID.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => VerifiedID.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => VerifiedID.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => VerifiedID.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => VerifiedID.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => VerifiedID.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => VerifiedID.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => VerifiedID.fromSuiObjectData(content),
      fetch: async (client: SupportedSuiClient, id: string) => VerifiedID.fetch(client, id),
      new: (fields: VerifiedIDFields) => {
        return new VerifiedID([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): VerifiedIDReified {
    return VerifiedID.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<VerifiedID>> {
    return phantom(VerifiedID.reified())
  }

  static get p(): PhantomReified<ToTypeStr<VerifiedID>> {
    return VerifiedID.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('VerifiedID', {
      id: UID.bcs,
      owner: bcs.bytes(32).transform({
        input: (val: string) => fromHex(val),
        output: (val: Uint8Array) => toHex(val),
      }),
      key_claim_name: String.bcs,
      key_claim_value: String.bcs,
      issuer: String.bcs,
      audience: String.bcs,
    })
  }

  private static cachedBcs: ReturnType<typeof VerifiedID.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof VerifiedID.instantiateBcs> {
    if (!VerifiedID.cachedBcs) {
      VerifiedID.cachedBcs = VerifiedID.instantiateBcs()
    }
    return VerifiedID.cachedBcs
  }

  static fromFields(fields: Record<string, any>): VerifiedID {
    return VerifiedID.reified().new({
      id: decodeFromFields(UID.reified(), fields.id),
      owner: decodeFromFields('address', fields.owner),
      keyClaimName: decodeFromFields(String.reified(), fields.key_claim_name),
      keyClaimValue: decodeFromFields(String.reified(), fields.key_claim_value),
      issuer: decodeFromFields(String.reified(), fields.issuer),
      audience: decodeFromFields(String.reified(), fields.audience),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): VerifiedID {
    if (!isVerifiedID(item.type)) {
      throw new Error('not a VerifiedID type')
    }

    return VerifiedID.reified().new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      owner: decodeFromFieldsWithTypes('address', item.fields.owner),
      keyClaimName: decodeFromFieldsWithTypes(String.reified(), item.fields.key_claim_name),
      keyClaimValue: decodeFromFieldsWithTypes(String.reified(), item.fields.key_claim_value),
      issuer: decodeFromFieldsWithTypes(String.reified(), item.fields.issuer),
      audience: decodeFromFieldsWithTypes(String.reified(), item.fields.audience),
    })
  }

  static fromBcs(data: Uint8Array): VerifiedID {
    return VerifiedID.fromFields(VerifiedID.bcs.parse(data))
  }

  toJSONField(): VerifiedIDJSONField {
    return {
      id: this.id,
      owner: this.owner,
      keyClaimName: this.keyClaimName,
      keyClaimValue: this.keyClaimValue,
      issuer: this.issuer,
      audience: this.audience,
    }
  }

  toJSON(): VerifiedIDJSON {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): VerifiedID {
    return VerifiedID.reified().new({
      id: decodeFromJSONField(UID.reified(), field.id),
      owner: decodeFromJSONField('address', field.owner),
      keyClaimName: decodeFromJSONField(String.reified(), field.keyClaimName),
      keyClaimValue: decodeFromJSONField(String.reified(), field.keyClaimValue),
      issuer: decodeFromJSONField(String.reified(), field.issuer),
      audience: decodeFromJSONField(String.reified(), field.audience),
    })
  }

  static fromJSON(json: Record<string, any>): VerifiedID {
    if (json.$typeName !== VerifiedID.$typeName) {
      throw new Error(
        `not a VerifiedID json object: expected '${VerifiedID.$typeName}' but got '${json.$typeName}'`
      )
    }

    return VerifiedID.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): VerifiedID {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isVerifiedID(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a VerifiedID object`)
    }
    return VerifiedID.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): VerifiedID {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isVerifiedID(data.bcs.type)) {
        throw new Error(`object at is not a VerifiedID object`)
      }

      return VerifiedID.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return VerifiedID.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<VerifiedID> {
    const res = await fetchObjectBcs(client, id)
    if (!isVerifiedID(res.type)) {
      throw new Error(`object at id ${id} is not a VerifiedID object`)
    }

    return VerifiedID.fromBcs(res.bcsBytes)
  }
}
