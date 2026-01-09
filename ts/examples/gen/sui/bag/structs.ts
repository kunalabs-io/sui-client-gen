/**
 * A bag is a heterogeneous map-like collection. The collection is similar to `sui::table` in that
 * its keys and values are not stored within the `Bag` value, but instead are stored using Sui's
 * object system. The `Bag` struct acts only as a handle into the object system to retrieve those
 * keys and values.
 * Note that this means that `Bag` values with exactly the same key-value mapping will not be
 * equal, with `==`, at runtime. For example
 * ```
 * let bag1 = bag::new();
 * let bag2 = bag::new();
 * bag::add(&mut bag1, 0, false);
 * bag::add(&mut bag1, 1, true);
 * bag::add(&mut bag2, 0, false);
 * bag::add(&mut bag2, 1, true);
 * // bag1 does not equal bag2, despite having the same entries
 * assert!(&bag1 != &bag2);
 * ```
 * At it's core, `sui::bag` is a wrapper around `UID` that allows for access to
 * `sui::dynamic_field` while preventing accidentally stranding field values. A `UID` can be
 * deleted, even if it has dynamic fields associated with it, but a bag, on the other hand, must be
 * empty to be destroyed.
 */

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
import { fromBase64 } from '@mysten/sui/utils'

/* ============================== Bag =============================== */

export function isBag(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::bag::Bag`
}

export interface BagFields {
  /** the ID of this bag */
  id: ToField<UID>
  /** the number of key-value pairs in the bag */
  size: ToField<'u64'>
}

export type BagReified = Reified<Bag, BagFields>

export class Bag implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::bag::Bag` = `0x2::bag::Bag` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName: typeof Bag.$typeName = Bag.$typeName
  readonly $fullTypeName: `0x2::bag::Bag`
  readonly $typeArgs: []
  readonly $isPhantom: typeof Bag.$isPhantom = Bag.$isPhantom

  /** the ID of this bag */
  readonly id: ToField<UID>
  /** the number of key-value pairs in the bag */
  readonly size: ToField<'u64'>

  private constructor(typeArgs: [], fields: BagFields) {
    this.$fullTypeName = composeSuiType(Bag.$typeName, ...typeArgs) as `0x2::bag::Bag`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.size = fields.size
  }

  static reified(): BagReified {
    const reifiedBcs = Bag.bcs
    return {
      typeName: Bag.$typeName,
      fullTypeName: composeSuiType(Bag.$typeName, ...[]) as `0x2::bag::Bag`,
      typeArgs: [] as [],
      isPhantom: Bag.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => Bag.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Bag.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => Bag.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => Bag.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => Bag.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => Bag.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => Bag.fromSuiObjectData(content),
      fetch: async (client: SupportedSuiClient, id: string) => Bag.fetch(client, id),
      new: (fields: BagFields) => {
        return new Bag([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): BagReified {
    return Bag.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<Bag>> {
    return phantom(Bag.reified())
  }

  static get p(): PhantomReified<ToTypeStr<Bag>> {
    return Bag.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('Bag', {
      id: UID.bcs,
      size: bcs.u64(),
    })
  }

  private static cachedBcs: ReturnType<typeof Bag.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof Bag.instantiateBcs> {
    if (!Bag.cachedBcs) {
      Bag.cachedBcs = Bag.instantiateBcs()
    }
    return Bag.cachedBcs
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

  toJSONField(): Record<string, any> {
    return {
      id: this.id,
      size: this.size.toString(),
    }
  }

  toJSON(): Record<string, any> {
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
      throw new Error(
        `not a Bag json object: expected '${Bag.$typeName}' but got '${json.$typeName}'`
      )
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

      return Bag.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Bag.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<Bag> {
    const res = await fetchObjectBcs(client, id)
    if (!isBag(res.type)) {
      throw new Error(`object at id ${id} is not a Bag object`)
    }

    return Bag.fromBcs(res.bcsBytes)
  }
}
