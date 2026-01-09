/**
 * Coin<SUI> is the token used to pay for gas in Sui.
 * It has 9 decimals, and the smallest unit (10^-9) is called "mist".
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
import { bcs } from '@mysten/sui/bcs'
import { SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromBase64 } from '@mysten/sui/utils'

/* ============================== SUI =============================== */

export function isSUI(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::sui::SUI`
}

export interface SUIFields {
  dummyField: ToField<'bool'>
}

export type SUIReified = Reified<SUI, SUIFields>

/** Name of the coin */
export class SUI implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::sui::SUI` = `0x2::sui::SUI` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName: typeof SUI.$typeName = SUI.$typeName
  readonly $fullTypeName: `0x2::sui::SUI`
  readonly $typeArgs: []
  readonly $isPhantom: typeof SUI.$isPhantom = SUI.$isPhantom

  readonly dummyField: ToField<'bool'>

  private constructor(typeArgs: [], fields: SUIFields) {
    this.$fullTypeName = composeSuiType(SUI.$typeName, ...typeArgs) as `0x2::sui::SUI`
    this.$typeArgs = typeArgs

    this.dummyField = fields.dummyField
  }

  static reified(): SUIReified {
    const reifiedBcs = SUI.bcs
    return {
      typeName: SUI.$typeName,
      fullTypeName: composeSuiType(SUI.$typeName, ...[]) as `0x2::sui::SUI`,
      typeArgs: [] as [],
      isPhantom: SUI.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => SUI.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => SUI.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => SUI.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => SUI.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => SUI.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => SUI.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => SUI.fromSuiObjectData(content),
      fetch: async (client: SupportedSuiClient, id: string) => SUI.fetch(client, id),
      new: (fields: SUIFields) => {
        return new SUI([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): SUIReified {
    return SUI.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<SUI>> {
    return phantom(SUI.reified())
  }

  static get p(): PhantomReified<ToTypeStr<SUI>> {
    return SUI.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('SUI', {
      dummy_field: bcs.bool(),
    })
  }

  private static cachedBcs: ReturnType<typeof SUI.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof SUI.instantiateBcs> {
    if (!SUI.cachedBcs) {
      SUI.cachedBcs = SUI.instantiateBcs()
    }
    return SUI.cachedBcs
  }

  static fromFields(fields: Record<string, any>): SUI {
    return SUI.reified().new({
      dummyField: decodeFromFields('bool', fields.dummy_field),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): SUI {
    if (!isSUI(item.type)) {
      throw new Error('not a SUI type')
    }

    return SUI.reified().new({
      dummyField: decodeFromFieldsWithTypes('bool', item.fields.dummy_field),
    })
  }

  static fromBcs(data: Uint8Array): SUI {
    return SUI.fromFields(SUI.bcs.parse(data))
  }

  toJSONField(): Record<string, any> {
    return {
      dummyField: this.dummyField,
    }
  }

  toJSON(): Record<string, any> {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): SUI {
    return SUI.reified().new({
      dummyField: decodeFromJSONField('bool', field.dummyField),
    })
  }

  static fromJSON(json: Record<string, any>): SUI {
    if (json.$typeName !== SUI.$typeName) {
      throw new Error(
        `not a SUI json object: expected '${SUI.$typeName}' but got '${json.$typeName}'`
      )
    }

    return SUI.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): SUI {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isSUI(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a SUI object`)
    }
    return SUI.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): SUI {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isSUI(data.bcs.type)) {
        throw new Error(`object at is not a SUI object`)
      }

      return SUI.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return SUI.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<SUI> {
    const res = await fetchObjectBcs(client, id)
    if (!isSUI(res.type)) {
      throw new Error(`object at id ${id} is not a SUI object`)
    }

    return SUI.fromBcs(res.bcsBytes)
  }
}
