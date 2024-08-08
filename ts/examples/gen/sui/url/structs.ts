import { String } from '../../_dependencies/source/0x1/ascii/structs'
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
import { PKG_V21 } from '../index'
import { bcs } from '@mysten/sui/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui/client'
import { fromB64 } from '@mysten/sui/utils'

/* ============================== Url =============================== */

export function isUrl(type: string): boolean {
  type = compressSuiType(type)
  return type === `${PKG_V21}::url::Url`
}

export interface UrlFields {
  url: ToField<String>
}

export type UrlReified = Reified<Url, UrlFields>

export class Url implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `${PKG_V21}::url::Url`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = Url.$typeName
  readonly $fullTypeName: `${typeof PKG_V21}::url::Url`
  readonly $typeArgs: []
  readonly $isPhantom = Url.$isPhantom

  readonly url: ToField<String>

  private constructor(typeArgs: [], fields: UrlFields) {
    this.$fullTypeName = composeSuiType(Url.$typeName, ...typeArgs) as `${typeof PKG_V21}::url::Url`
    this.$typeArgs = typeArgs

    this.url = fields.url
  }

  static reified(): UrlReified {
    return {
      typeName: Url.$typeName,
      fullTypeName: composeSuiType(Url.$typeName, ...[]) as `${typeof PKG_V21}::url::Url`,
      typeArgs: [] as [],
      isPhantom: Url.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => Url.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Url.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => Url.fromBcs(data),
      bcs: Url.bcs,
      fromJSONField: (field: any) => Url.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => Url.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => Url.fromSuiParsedData(content),
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

  static get bcs() {
    return bcs.struct('Url', {
      url: String.bcs,
    })
  }

  static fromFields(fields: Record<string, any>): Url {
    return Url.reified().new({ url: decodeFromFields(String.reified(), fields.url) })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Url {
    if (!isUrl(item.type)) {
      throw new Error('not a Url type')
    }

    return Url.reified().new({ url: decodeFromFieldsWithTypes(String.reified(), item.fields.url) })
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
    return Url.reified().new({ url: decodeFromJSONField(String.reified(), field.url) })
  }

  static fromJSON(json: Record<string, any>): Url {
    if (json.$typeName !== Url.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
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

  static async fetch(client: SuiClient, id: string): Promise<Url> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching Url object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isUrl(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a Url object`)
    }

    return Url.fromBcs(fromB64(res.data.bcs.bcsBytes))
  }
}
