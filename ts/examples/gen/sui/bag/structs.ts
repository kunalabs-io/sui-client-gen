import {
  PhantomReified,
  Reified,
  StructClass,
  ToField,
  ToTypeStr,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  phantom,
} from '../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../_framework/util'
import { PKG_V27 } from '../index'
import { UID } from '../object/structs'
import { bcs } from '@mysten/sui/bcs'
import { SuiClient, SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromB64 } from '@mysten/sui/utils'

/* ============================== Bag =============================== */

export function isBag(type: string): boolean {
  type = compressSuiType(type)
  return type === `${PKG_V27}::bag::Bag`
}

export interface BagFields {
  id: ToField<UID>
  size: ToField<'u64'>
}

export type BagReified = Reified<Bag, BagFields>

export class Bag implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `${PKG_V27}::bag::Bag`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = Bag.$typeName
  readonly $fullTypeName: `${typeof PKG_V27}::bag::Bag`
  readonly $typeArgs: []
  readonly $isPhantom = Bag.$isPhantom

  readonly id: ToField<UID>
  readonly size: ToField<'u64'>

  private constructor(typeArgs: [], fields: BagFields) {
    this.$fullTypeName = composeSuiType(Bag.$typeName, ...typeArgs) as `${typeof PKG_V27}::bag::Bag`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.size = fields.size
  }

  static reified(): BagReified {
    return {
      typeName: Bag.$typeName,
      fullTypeName: composeSuiType(Bag.$typeName, ...[]) as `${typeof PKG_V27}::bag::Bag`,
      typeArgs: [] as [],
      isPhantom: Bag.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => Bag.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Bag.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => Bag.fromBcs(data),
      bcs: Bag.bcs,
      fromJSONField: (field: any) => Bag.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => Bag.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => Bag.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => Bag.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => Bag.fetch(client, id),
      new: (fields: BagFields) => {
        return new Bag([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Bag.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<Bag>> {
    return phantom(Bag.reified())
  }
  static get p() {
    return Bag.phantom()
  }

  static get bcs() {
    return bcs.struct('Bag', {
      id: UID.bcs,
      size: bcs.u64(),
    })
  }

  static fromFields(fields: Record<string, any>): Bag {
    return Bag.reified().new({
      id: decodeFromFields(UID.reified(), fields.id),
      size: decodeFromFields('u64', fields.size),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Bag {
    if (!isBag(item.type)) {
      throw new Error('not a Bag type')
    }

    return Bag.reified().new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      size: decodeFromFieldsWithTypes('u64', item.fields.size),
    })
  }

  static fromBcs(data: Uint8Array): Bag {
    return Bag.fromFields(Bag.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
      size: this.size.toString(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): Bag {
    return Bag.reified().new({
      id: decodeFromJSONField(UID.reified(), field.id),
      size: decodeFromJSONField('u64', field.size),
    })
  }

  static fromJSON(json: Record<string, any>): Bag {
    if (json.$typeName !== Bag.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return Bag.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): Bag {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isBag(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Bag object`)
    }
    return Bag.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): Bag {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isBag(data.bcs.type)) {
        throw new Error(`object at is not a Bag object`)
      }

      return Bag.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Bag.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<Bag> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching Bag object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isBag(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a Bag object`)
    }

    return Bag.fromSuiObjectData(res.data)
  }
}
