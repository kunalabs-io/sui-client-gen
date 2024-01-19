import {
  ToField,
  decodeFromFieldsGenericOrSpecial,
  decodeFromFieldsWithTypesGenericOrSpecial,
} from '../../_framework/types'
import { FieldsWithTypes, Type, compressSuiType } from '../../_framework/util'
import { String } from '../../move-stdlib-chain/string/structs'
import { UID } from '../object/structs'
import { bcs, fromHEX, toHEX } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== VerifiedID =============================== */

export function isVerifiedID(type: Type): boolean {
  type = compressSuiType(type)
  return type === '0x2::zklogin_verified_id::VerifiedID'
}

export interface VerifiedIDFields {
  id: ToField<UID>
  owner: ToField<'address'>
  keyClaimName: ToField<String>
  keyClaimValue: ToField<String>
  issuer: ToField<String>
  audience: ToField<String>
}

export class VerifiedID {
  static readonly $typeName = '0x2::zklogin_verified_id::VerifiedID'
  static readonly $numTypeParams = 0

  readonly $typeName = VerifiedID.$typeName

  static get bcs() {
    return bcs.struct('VerifiedID', {
      id: UID.bcs,
      owner: bcs.bytes(32).transform({
        input: (val: string) => fromHEX(val),
        output: (val: Uint8Array) => toHEX(val),
      }),
      key_claim_name: String.bcs,
      key_claim_value: String.bcs,
      issuer: String.bcs,
      audience: String.bcs,
    })
  }

  readonly id: ToField<UID>
  readonly owner: ToField<'address'>
  readonly keyClaimName: ToField<String>
  readonly keyClaimValue: ToField<String>
  readonly issuer: ToField<String>
  readonly audience: ToField<String>

  private constructor(fields: VerifiedIDFields) {
    this.id = fields.id
    this.owner = fields.owner
    this.keyClaimName = fields.keyClaimName
    this.keyClaimValue = fields.keyClaimValue
    this.issuer = fields.issuer
    this.audience = fields.audience
  }

  static new(fields: VerifiedIDFields): VerifiedID {
    return new VerifiedID(fields)
  }

  static reified() {
    return {
      typeName: VerifiedID.$typeName,
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => VerifiedID.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => VerifiedID.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => VerifiedID.fromBcs(data),
      bcs: VerifiedID.bcs,
      __class: null as unknown as ReturnType<typeof VerifiedID.new>,
    }
  }

  static fromFields(fields: Record<string, any>): VerifiedID {
    return VerifiedID.new({
      id: decodeFromFieldsGenericOrSpecial(UID.reified(), fields.id),
      owner: decodeFromFieldsGenericOrSpecial('address', fields.owner),
      keyClaimName: decodeFromFieldsGenericOrSpecial(String.reified(), fields.key_claim_name),
      keyClaimValue: decodeFromFieldsGenericOrSpecial(String.reified(), fields.key_claim_value),
      issuer: decodeFromFieldsGenericOrSpecial(String.reified(), fields.issuer),
      audience: decodeFromFieldsGenericOrSpecial(String.reified(), fields.audience),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): VerifiedID {
    if (!isVerifiedID(item.type)) {
      throw new Error('not a VerifiedID type')
    }

    return VerifiedID.new({
      id: decodeFromFieldsWithTypesGenericOrSpecial(UID.reified(), item.fields.id),
      owner: decodeFromFieldsWithTypesGenericOrSpecial('address', item.fields.owner),
      keyClaimName: decodeFromFieldsWithTypesGenericOrSpecial(
        String.reified(),
        item.fields.key_claim_name
      ),
      keyClaimValue: decodeFromFieldsWithTypesGenericOrSpecial(
        String.reified(),
        item.fields.key_claim_value
      ),
      issuer: decodeFromFieldsWithTypesGenericOrSpecial(String.reified(), item.fields.issuer),
      audience: decodeFromFieldsWithTypesGenericOrSpecial(String.reified(), item.fields.audience),
    })
  }

  static fromBcs(data: Uint8Array): VerifiedID {
    return VerifiedID.fromFields(VerifiedID.bcs.parse(data))
  }

  toJSON() {
    return {
      id: this.id,
      owner: this.owner,
      keyClaimName: this.keyClaimName,
      keyClaimValue: this.keyClaimValue,
      issuer: this.issuer,
      audience: this.audience,
    }
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
