import { bcs } from '@mysten/sui/bcs'
import { SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromBase64, fromHex, toHex } from '@mysten/sui/utils'
import {
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  phantom,
  PhantomReified,
  Reified,
  StructClass,
  ToField,
  ToJSON,
  ToTypeStr,
} from '../../_framework/reified'
import {
  composeSuiType,
  compressSuiType,
  fetchObjectBcs,
  FieldsWithTypes,
  SupportedSuiClient,
} from '../../_framework/util'
import { String } from '../../std/string/structs'
import { UID } from '../object/structs'

/* ============================== VerifiedIssuer =============================== */

export function isVerifiedIssuer(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::zklogin_verified_issuer::VerifiedIssuer`
}

export interface VerifiedIssuerFields {
  /** The ID of this VerifiedIssuer */
  id: ToField<UID>
  /** The address this VerifiedID is associated with */
  owner: ToField<'address'>
  /** The issuer */
  issuer: ToField<String>
}

export type VerifiedIssuerReified = Reified<VerifiedIssuer, VerifiedIssuerFields>

export type VerifiedIssuerJSONField = {
  id: string
  owner: string
  issuer: string
}

export type VerifiedIssuerJSON = {
  $typeName: typeof VerifiedIssuer.$typeName
  $typeArgs: []
} & VerifiedIssuerJSONField

/**
 * Possession of a VerifiedIssuer proves that the user's address was created using zklogin and with the given issuer
 * (identity provider).
 */
export class VerifiedIssuer implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::zklogin_verified_issuer::VerifiedIssuer` =
    `0x2::zklogin_verified_issuer::VerifiedIssuer` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName: typeof VerifiedIssuer.$typeName = VerifiedIssuer.$typeName
  readonly $fullTypeName: `0x2::zklogin_verified_issuer::VerifiedIssuer`
  readonly $typeArgs: []
  readonly $isPhantom: typeof VerifiedIssuer.$isPhantom = VerifiedIssuer.$isPhantom

  /** The ID of this VerifiedIssuer */
  readonly id: ToField<UID>
  /** The address this VerifiedID is associated with */
  readonly owner: ToField<'address'>
  /** The issuer */
  readonly issuer: ToField<String>

  private constructor(typeArgs: [], fields: VerifiedIssuerFields) {
    this.$fullTypeName = composeSuiType(
      VerifiedIssuer.$typeName,
      ...typeArgs,
    ) as `0x2::zklogin_verified_issuer::VerifiedIssuer`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.owner = fields.owner
    this.issuer = fields.issuer
  }

  static reified(): VerifiedIssuerReified {
    const reifiedBcs = VerifiedIssuer.bcs
    return {
      typeName: VerifiedIssuer.$typeName,
      fullTypeName: composeSuiType(
        VerifiedIssuer.$typeName,
        ...[],
      ) as `0x2::zklogin_verified_issuer::VerifiedIssuer`,
      typeArgs: [] as [],
      isPhantom: VerifiedIssuer.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => VerifiedIssuer.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => VerifiedIssuer.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => VerifiedIssuer.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => VerifiedIssuer.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => VerifiedIssuer.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => VerifiedIssuer.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => VerifiedIssuer.fromSuiObjectData(content),
      fetch: async (client: SupportedSuiClient, id: string) => VerifiedIssuer.fetch(client, id),
      new: (fields: VerifiedIssuerFields) => {
        return new VerifiedIssuer([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): VerifiedIssuerReified {
    return VerifiedIssuer.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<VerifiedIssuer>> {
    return phantom(VerifiedIssuer.reified())
  }

  static get p(): PhantomReified<ToTypeStr<VerifiedIssuer>> {
    return VerifiedIssuer.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('VerifiedIssuer', {
      id: UID.bcs,
      owner: bcs.bytes(32).transform({
        input: (val: string) => fromHex(val),
        output: (val: Uint8Array) => toHex(val),
      }),
      issuer: String.bcs,
    })
  }

  private static cachedBcs: ReturnType<typeof VerifiedIssuer.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof VerifiedIssuer.instantiateBcs> {
    if (!VerifiedIssuer.cachedBcs) {
      VerifiedIssuer.cachedBcs = VerifiedIssuer.instantiateBcs()
    }
    return VerifiedIssuer.cachedBcs
  }

  static fromFields(fields: Record<string, any>): VerifiedIssuer {
    return VerifiedIssuer.reified().new({
      id: decodeFromFields(UID.reified(), fields.id),
      owner: decodeFromFields('address', fields.owner),
      issuer: decodeFromFields(String.reified(), fields.issuer),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): VerifiedIssuer {
    if (!isVerifiedIssuer(item.type)) {
      throw new Error('not a VerifiedIssuer type')
    }

    return VerifiedIssuer.reified().new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      owner: decodeFromFieldsWithTypes('address', item.fields.owner),
      issuer: decodeFromFieldsWithTypes(String.reified(), item.fields.issuer),
    })
  }

  static fromBcs(data: Uint8Array): VerifiedIssuer {
    return VerifiedIssuer.fromFields(VerifiedIssuer.bcs.parse(data))
  }

  toJSONField(): VerifiedIssuerJSONField {
    return {
      id: this.id,
      owner: this.owner,
      issuer: this.issuer,
    }
  }

  toJSON(): VerifiedIssuerJSON {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): VerifiedIssuer {
    return VerifiedIssuer.reified().new({
      id: decodeFromJSONField(UID.reified(), field.id),
      owner: decodeFromJSONField('address', field.owner),
      issuer: decodeFromJSONField(String.reified(), field.issuer),
    })
  }

  static fromJSON(json: Record<string, any>): VerifiedIssuer {
    if (json.$typeName !== VerifiedIssuer.$typeName) {
      throw new Error(
        `not a VerifiedIssuer json object: expected '${VerifiedIssuer.$typeName}' but got '${json.$typeName}'`,
      )
    }

    return VerifiedIssuer.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): VerifiedIssuer {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isVerifiedIssuer(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a VerifiedIssuer object`)
    }
    return VerifiedIssuer.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): VerifiedIssuer {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isVerifiedIssuer(data.bcs.type)) {
        throw new Error(`object at is not a VerifiedIssuer object`)
      }

      return VerifiedIssuer.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return VerifiedIssuer.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.',
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<VerifiedIssuer> {
    const res = await fetchObjectBcs(client, id)
    if (!isVerifiedIssuer(res.type)) {
      throw new Error(`object at id ${id} is not a VerifiedIssuer object`)
    }

    return VerifiedIssuer.fromBcs(res.bcsBytes)
  }
}
