/** URL: standard Uniform Resource Locator string */

import { bcs } from '@mysten/sui/bcs'
import { SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromBase64 } from '@mysten/sui/utils'
import {
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  phantom,
  PhantomReified,
  Reified,
  StructClass,
  ToField,
  ToJSON,
  ToTypeStr,
} from '../../_framework/reified'
import {
  composeSuiType,
  compressSuiType,
  fetchObjectBcs,
  FieldsWithTypes,
  SupportedSuiClient,
} from '../../_framework/util'
import { String } from '../../std/ascii/structs'

/* ============================== Url =============================== */

export function isUrl(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::url::Url`
}

export interface UrlFields {
  url: ToField<String>
}

export type UrlReified = Reified<Url, UrlFields>

export type UrlJSONField = {
  url: string
}

export type UrlJSON = {
  $typeName: typeof Url.$typeName
  $typeArgs: []
} & UrlJSONField

/** Standard Uniform Resource Locator (URL) string. */
export class Url implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::url::Url` = `0x2::url::Url` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName: typeof Url.$typeName = Url.$typeName
  readonly $fullTypeName: `0x2::url::Url`
  readonly $typeArgs: []
  readonly $isPhantom: typeof Url.$isPhantom = Url.$isPhantom

  readonly url: ToField<String>

  private constructor(typeArgs: [], fields: UrlFields) {
    this.$fullTypeName = composeSuiType(
      Url.$typeName,
      ...typeArgs,
    ) as `0x2::url::Url`
    this.$typeArgs = typeArgs

    this.url = fields.url
  }

  static reified(): UrlReified {
    const reifiedBcs = Url.bcs
    return {
      typeName: Url.$typeName,
      fullTypeName: composeSuiType(
        Url.$typeName,
        ...[],
      ) as `0x2::url::Url`,
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
      fetch: async (client: SupportedSuiClient, id: string) => Url.fetch(client, id),
      new: (fields: UrlFields) => {
        return new Url([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): UrlReified {
    return Url.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<Url>> {
    return phantom(Url.reified())
  }

  static get p(): PhantomReified<ToTypeStr<Url>> {
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

  toJSONField(): UrlJSONField {
    return {
      url: this.url,
    }
  }

  toJSON(): UrlJSON {
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
        `not a Url json object: expected '${Url.$typeName}' but got '${json.$typeName}'`,
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
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.',
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<Url> {
    const res = await fetchObjectBcs(client, id)
    if (!isUrl(res.type)) {
      throw new Error(`object at id ${id} is not a Url object`)
    }

    return Url.fromBcs(res.bcsBytes)
  }
}
