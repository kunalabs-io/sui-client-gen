import { ToField, decodeFromFields, decodeFromFieldsWithTypes } from '../../_framework/reified'
import { FieldsWithTypes, compressSuiType } from '../../_framework/util'
import { String } from '../../move-stdlib-chain/string/structs'
import { UID } from '../object/structs'
import { bcs, fromHEX, toHEX } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== VerifiedIssuer =============================== */

export function isVerifiedIssuer(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x2::zklogin_verified_issuer::VerifiedIssuer'
}

export interface VerifiedIssuerFields {
  id: ToField<UID>
  owner: ToField<'address'>
  issuer: ToField<String>
}

export class VerifiedIssuer {
  static readonly $typeName = '0x2::zklogin_verified_issuer::VerifiedIssuer'
  static readonly $numTypeParams = 0

  readonly $typeName = VerifiedIssuer.$typeName

  static get bcs() {
    return bcs.struct('VerifiedIssuer', {
      id: UID.bcs,
      owner: bcs.bytes(32).transform({
        input: (val: string) => fromHEX(val),
        output: (val: Uint8Array) => toHEX(val),
      }),
      issuer: String.bcs,
    })
  }

  readonly id: ToField<UID>
  readonly owner: ToField<'address'>
  readonly issuer: ToField<String>

  private constructor(fields: VerifiedIssuerFields) {
    this.id = fields.id
    this.owner = fields.owner
    this.issuer = fields.issuer
  }

  static new(fields: VerifiedIssuerFields): VerifiedIssuer {
    return new VerifiedIssuer(fields)
  }

  static reified() {
    return {
      typeName: VerifiedIssuer.$typeName,
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => VerifiedIssuer.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => VerifiedIssuer.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => VerifiedIssuer.fromBcs(data),
      bcs: VerifiedIssuer.bcs,
      __class: null as unknown as ReturnType<typeof VerifiedIssuer.new>,
    }
  }

  static fromFields(fields: Record<string, any>): VerifiedIssuer {
    return VerifiedIssuer.new({
      id: decodeFromFields(UID.reified(), fields.id),
      owner: decodeFromFields('address', fields.owner),
      issuer: decodeFromFields(String.reified(), fields.issuer),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): VerifiedIssuer {
    if (!isVerifiedIssuer(item.type)) {
      throw new Error('not a VerifiedIssuer type')
    }

    return VerifiedIssuer.new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      owner: decodeFromFieldsWithTypes('address', item.fields.owner),
      issuer: decodeFromFieldsWithTypes(String.reified(), item.fields.issuer),
    })
  }

  static fromBcs(data: Uint8Array): VerifiedIssuer {
    return VerifiedIssuer.fromFields(VerifiedIssuer.bcs.parse(data))
  }

  toJSON() {
    return {
      id: this.id,
      owner: this.owner,
      issuer: this.issuer,
    }
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
