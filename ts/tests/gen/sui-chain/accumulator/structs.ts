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
import { PKG_V32 } from '../index'
import { UID } from '../object/structs'
import { bcs } from '@mysten/sui/bcs'
import { SuiClient, SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromB64 } from '@mysten/sui/utils'

/* ============================== AccumulatorRoot =============================== */

export function isAccumulatorRoot(type: string): boolean {
  type = compressSuiType(type)
  return type === `${PKG_V32}::accumulator::AccumulatorRoot`
}

export interface AccumulatorRootFields {
  id: ToField<UID>
}

export type AccumulatorRootReified = Reified<AccumulatorRoot, AccumulatorRootFields>

export class AccumulatorRoot implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `${PKG_V32}::accumulator::AccumulatorRoot`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = AccumulatorRoot.$typeName
  readonly $fullTypeName: `${typeof PKG_V32}::accumulator::AccumulatorRoot`
  readonly $typeArgs: []
  readonly $isPhantom = AccumulatorRoot.$isPhantom

  readonly id: ToField<UID>

  private constructor(typeArgs: [], fields: AccumulatorRootFields) {
    this.$fullTypeName = composeSuiType(
      AccumulatorRoot.$typeName,
      ...typeArgs
    ) as `${typeof PKG_V32}::accumulator::AccumulatorRoot`
    this.$typeArgs = typeArgs

    this.id = fields.id
  }

  static reified(): AccumulatorRootReified {
    return {
      typeName: AccumulatorRoot.$typeName,
      fullTypeName: composeSuiType(
        AccumulatorRoot.$typeName,
        ...[]
      ) as `${typeof PKG_V32}::accumulator::AccumulatorRoot`,
      typeArgs: [] as [],
      isPhantom: AccumulatorRoot.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => AccumulatorRoot.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => AccumulatorRoot.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => AccumulatorRoot.fromBcs(data),
      bcs: AccumulatorRoot.bcs,
      fromJSONField: (field: any) => AccumulatorRoot.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => AccumulatorRoot.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => AccumulatorRoot.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => AccumulatorRoot.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => AccumulatorRoot.fetch(client, id),
      new: (fields: AccumulatorRootFields) => {
        return new AccumulatorRoot([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return AccumulatorRoot.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<AccumulatorRoot>> {
    return phantom(AccumulatorRoot.reified())
  }
  static get p() {
    return AccumulatorRoot.phantom()
  }

  static get bcs() {
    return bcs.struct('AccumulatorRoot', {
      id: UID.bcs,
    })
  }

  static fromFields(fields: Record<string, any>): AccumulatorRoot {
    return AccumulatorRoot.reified().new({ id: decodeFromFields(UID.reified(), fields.id) })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): AccumulatorRoot {
    if (!isAccumulatorRoot(item.type)) {
      throw new Error('not a AccumulatorRoot type')
    }

    return AccumulatorRoot.reified().new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
    })
  }

  static fromBcs(data: Uint8Array): AccumulatorRoot {
    return AccumulatorRoot.fromFields(AccumulatorRoot.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): AccumulatorRoot {
    return AccumulatorRoot.reified().new({ id: decodeFromJSONField(UID.reified(), field.id) })
  }

  static fromJSON(json: Record<string, any>): AccumulatorRoot {
    if (json.$typeName !== AccumulatorRoot.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return AccumulatorRoot.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): AccumulatorRoot {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isAccumulatorRoot(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a AccumulatorRoot object`)
    }
    return AccumulatorRoot.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): AccumulatorRoot {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isAccumulatorRoot(data.bcs.type)) {
        throw new Error(`object at is not a AccumulatorRoot object`)
      }

      return AccumulatorRoot.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return AccumulatorRoot.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<AccumulatorRoot> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching AccumulatorRoot object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isAccumulatorRoot(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a AccumulatorRoot object`)
    }

    return AccumulatorRoot.fromSuiObjectData(res.data)
  }
}
