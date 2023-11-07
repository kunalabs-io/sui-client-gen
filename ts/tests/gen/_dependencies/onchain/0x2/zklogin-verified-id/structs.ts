import { Encoding, bcsOnchain as bcs } from '../../../../_framework/bcs'
import { FieldsWithTypes, Type, compressSuiType } from '../../../../_framework/util'
import { String } from '../../0x1/string/structs'
import { UID } from '../object/structs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== VerifiedID =============================== */

bcs.registerStructType('0x2::zklogin_verified_id::VerifiedID', {
  id: `0x2::object::UID`,
  owner: `address`,
  key_claim_name: `0x1::string::String`,
  key_claim_value: `0x1::string::String`,
  issuer: `0x1::string::String`,
  audience: `0x1::string::String`,
})

export function isVerifiedID(type: Type): boolean {
  type = compressSuiType(type)
  return type === '0x2::zklogin_verified_id::VerifiedID'
}

export interface VerifiedIDFields {
  id: string
  owner: string
  keyClaimName: string
  keyClaimValue: string
  issuer: string
  audience: string
}

export class VerifiedID {
  static readonly $typeName = '0x2::zklogin_verified_id::VerifiedID'
  static readonly $numTypeParams = 0

  readonly id: string
  readonly owner: string
  readonly keyClaimName: string
  readonly keyClaimValue: string
  readonly issuer: string
  readonly audience: string

  constructor(fields: VerifiedIDFields) {
    this.id = fields.id
    this.owner = fields.owner
    this.keyClaimName = fields.keyClaimName
    this.keyClaimValue = fields.keyClaimValue
    this.issuer = fields.issuer
    this.audience = fields.audience
  }

  static fromFields(fields: Record<string, any>): VerifiedID {
    return new VerifiedID({
      id: UID.fromFields(fields.id).id,
      owner: `0x${fields.owner}`,
      keyClaimName: new TextDecoder()
        .decode(Uint8Array.from(String.fromFields(fields.key_claim_name).bytes))
        .toString(),
      keyClaimValue: new TextDecoder()
        .decode(Uint8Array.from(String.fromFields(fields.key_claim_value).bytes))
        .toString(),
      issuer: new TextDecoder()
        .decode(Uint8Array.from(String.fromFields(fields.issuer).bytes))
        .toString(),
      audience: new TextDecoder()
        .decode(Uint8Array.from(String.fromFields(fields.audience).bytes))
        .toString(),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): VerifiedID {
    if (!isVerifiedID(item.type)) {
      throw new Error('not a VerifiedID type')
    }
    return new VerifiedID({
      id: item.fields.id.id,
      owner: `0x${item.fields.owner}`,
      keyClaimName: item.fields.key_claim_name,
      keyClaimValue: item.fields.key_claim_value,
      issuer: item.fields.issuer,
      audience: item.fields.audience,
    })
  }

  static fromBcs(data: Uint8Array | string, encoding?: Encoding): VerifiedID {
    return VerifiedID.fromFields(bcs.de([VerifiedID.$typeName], data, encoding))
  }

  static fromSuiParsedData(content: SuiParsedData) {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isVerifiedID(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a VerifiedID object`)
    }
    return VerifiedID.fromFieldsWithTypes(content)
  }

  static async fetch(client: SuiClient, id: string): Promise<VerifiedID> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching VerifiedID object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isVerifiedID(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a VerifiedID object`)
    }
    return VerifiedID.fromFieldsWithTypes(res.data.content)
  }
}
