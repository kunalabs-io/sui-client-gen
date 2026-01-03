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
import { String } from '../../move-stdlib/ascii/structs'
import { bcs } from '@mysten/sui/bcs'
import { SuiClient, SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromBase64 } from '@mysten/sui/utils'

/* ============================== Url =============================== */

export function isUrl(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::url::Url`
}

export interface UrlFields {
  url: ToField<String>
}

export type UrlReified = Reified<Url, UrlFields>

export class Url implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::url::Url`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = Url.$typeName
  readonly $fullTypeName: `0x2::url::Url`
  readonly $typeArgs: []
  readonly $isPhantom = Url.$isPhantom

  readonly url: ToField<String>

  private constructor(typeArgs: [], fields: UrlFields) {
    this.$fullTypeName = composeSuiType(Url.$typeName, ...typeArgs) as `0x2::url::Url`
    this.$typeArgs = typeArgs

    this.url = fields.url
  }

  static reified(): UrlReified {
    const reifiedBcs = Url.bcs
    return {
      typeName: Url.$typeName,
      fullTypeName: composeSuiType(Url.$typeName, ...[]) as `0x2::url::Url`,
      typeArgs: [] as [],
      isPhantom: Url.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => Url.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Url.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => Url.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => Url.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => Url.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => Url.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => Url.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => Url.fetch(client, id),
      new: (fields: UrlFields) => {
        return new Url([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Url.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<Url>> {
    return phantom(Url.reified())
  }

  static get p() {
    return Url.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('Url', {
      url: String.bcs,
    })
  }

  private static cachedBcs: ReturnType<typeof Url.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof Url.instantiateBcs> {
    if (!Url.cachedBcs) {
      Url.cachedBcs = Url.instantiateBcs()
    }
    return Url.cachedBcs
  }

  static fromFields(fields: Record<string, any>): Url {
    return Url.reified().new({
      url: decodeFromFields(String.reified(), fields.url),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Url {
    if (!isUrl(item.type)) {
      throw new Error('not a Url type')
    }

    return Url.reified().new({
      url: decodeFromFieldsWithTypes(String.reified(), item.fields.url),
    })
  }

  static fromBcs(data: Uint8Array): Url {
    return Url.fromFields(Url.bcs.parse(data))
  }

  toJSONField() {
    return {
      url: this.url,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): Url {
    return Url.reified().new({
      url: decodeFromJSONField(String.reified(), field.url),
    })
  }

  static fromJSON(json: Record<string, any>): Url {
    if (json.$typeName !== Url.$typeName) {
      throw new Error(
        `not a Url json object: expected '${Url.$typeName}' but got '${json.$typeName}'`
      )
    }

    return Url.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): Url {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isUrl(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Url object`)
    }
    return Url.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): Url {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isUrl(data.bcs.type)) {
        throw new Error(`object at is not a Url object`)
      }

      return Url.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Url.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<Url> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching Url object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isUrl(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a Url object`)
    }

    return Url.fromSuiObjectData(res.data)
  }
}
