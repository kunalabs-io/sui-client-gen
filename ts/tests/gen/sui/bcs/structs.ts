import * as reified from '../../_framework/reified'
import {
  Reified,
  ToField,
  Vector,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  fieldToJSON,
} from '../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../_framework/util'
import { bcs } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== BCS =============================== */

export function isBCS(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x2::bcs::BCS'
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface BCSFields {
  bytes: ToField<Vector<'u8'>>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class BCS {
  static readonly $typeName = '0x2::bcs::BCS'
  static readonly $numTypeParams = 0

  readonly $fullTypeName = null as unknown as '0x2::bcs::BCS'

  readonly $typeName = BCS.$typeName

  static get bcs() {
    return bcs.struct('BCS', {
      bytes: bcs.vector(bcs.u8()),
    })
  }

  readonly bytes: ToField<Vector<'u8'>>

  private constructor(bytes: ToField<Vector<'u8'>>) {
    this.bytes = bytes
  }

  static new(bytes: ToField<Vector<'u8'>>): BCS {
    return new BCS(bytes)
  }

  static reified(): Reified<BCS> {
    return {
      typeName: BCS.$typeName,
      fullTypeName: composeSuiType(BCS.$typeName, ...[]) as '0x2::bcs::BCS',
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => BCS.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => BCS.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => BCS.fromBcs(data),
      bcs: BCS.bcs,
      fromJSONField: (field: any) => BCS.fromJSONField(field),
      fetch: async (client: SuiClient, id: string) => BCS.fetch(client, id),
      kind: 'StructClassReified',
    }
  }

  static fromFields(fields: Record<string, any>): BCS {
    return BCS.new(decodeFromFields(reified.vector('u8'), fields.bytes))
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): BCS {
    if (!isBCS(item.type)) {
      throw new Error('not a BCS type')
    }

    return BCS.new(decodeFromFieldsWithTypes(reified.vector('u8'), item.fields.bytes))
  }

  static fromBcs(data: Uint8Array): BCS {
    return BCS.fromFields(BCS.bcs.parse(data))
  }

  toJSONField() {
    return {
      bytes: fieldToJSON<Vector<'u8'>>(`vector<u8>`, this.bytes),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, ...this.toJSONField() }
  }

  static fromJSONField(field: any): BCS {
    return BCS.new(decodeFromJSONField(reified.vector('u8'), field.bytes))
  }

  static fromJSON(json: Record<string, any>): BCS {
    if (json.$typeName !== BCS.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return BCS.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): BCS {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isBCS(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a BCS object`)
    }
    return BCS.fromFieldsWithTypes(content)
  }

  static async fetch(client: SuiClient, id: string): Promise<BCS> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching BCS object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isBCS(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a BCS object`)
    }
    return BCS.fromFieldsWithTypes(res.data.content)
  }
}
