import { Encoding, bcsOnchain as bcs } from '../../../../_framework/bcs'
import { FieldsWithTypes, Type, compressSuiType } from '../../../../_framework/util'
import { String } from '../../0x1/string/structs'
import { UID } from '../object/structs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== VerifiedIssuer =============================== */

bcs.registerStructType('0x2::zklogin_verified_issuer::VerifiedIssuer', {
  id: `0x2::object::UID`,
  owner: `address`,
  issuer: `0x1::string::String`,
})

export function isVerifiedIssuer(type: Type): boolean {
  type = compressSuiType(type)
  return type === '0x2::zklogin_verified_issuer::VerifiedIssuer'
}

export interface VerifiedIssuerFields {
  id: string
  owner: string
  issuer: string
}

export class VerifiedIssuer {
  static readonly $typeName = '0x2::zklogin_verified_issuer::VerifiedIssuer'
  static readonly $numTypeParams = 0

  readonly id: string
  readonly owner: string
  readonly issuer: string

  constructor(fields: VerifiedIssuerFields) {
    this.id = fields.id
    this.owner = fields.owner
    this.issuer = fields.issuer
  }

  static fromFields(fields: Record<string, any>): VerifiedIssuer {
    return new VerifiedIssuer({
      id: UID.fromFields(fields.id).id,
      owner: `0x${fields.owner}`,
      issuer: new TextDecoder()
        .decode(Uint8Array.from(String.fromFields(fields.issuer).bytes))
        .toString(),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): VerifiedIssuer {
    if (!isVerifiedIssuer(item.type)) {
      throw new Error('not a VerifiedIssuer type')
    }
    return new VerifiedIssuer({
      id: item.fields.id.id,
      owner: `0x${item.fields.owner}`,
      issuer: item.fields.issuer,
    })
  }

  static fromBcs(data: Uint8Array | string, encoding?: Encoding): VerifiedIssuer {
    return VerifiedIssuer.fromFields(bcs.de([VerifiedIssuer.$typeName], data, encoding))
  }

  static fromSuiParsedData(content: SuiParsedData) {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isVerifiedIssuer(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a VerifiedIssuer object`)
    }
    return VerifiedIssuer.fromFieldsWithTypes(content)
  }

  static async fetch(client: SuiClient, id: string): Promise<VerifiedIssuer> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching VerifiedIssuer object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isVerifiedIssuer(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a VerifiedIssuer object`)
    }
    return VerifiedIssuer.fromFieldsWithTypes(res.data.content)
  }
}
