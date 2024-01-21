import {
  ToField,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
} from '../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../_framework/util'
import { String } from '../../move-stdlib/ascii/structs'
import { bcs } from '@mysten/bcs'

/* ============================== Url =============================== */

export function isUrl(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x2::url::Url'
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface UrlFields {
  url: ToField<String>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Url {
  static readonly $typeName = '0x2::url::Url'
  static readonly $numTypeParams = 0

  __reifiedFullTypeString = null as unknown as '0x2::url::Url'

  readonly $typeName = Url.$typeName

  static get bcs() {
    return bcs.struct('Url', {
      url: String.bcs,
    })
  }

  readonly url: ToField<String>

  private constructor(url: ToField<String>) {
    this.url = url
  }

  static new(url: ToField<String>): Url {
    return new Url(url)
  }

  static reified() {
    return {
      typeName: Url.$typeName,
      typeArgs: [],
      fullTypeName: composeSuiType(Url.$typeName, ...[]) as '0x2::url::Url',
      fromFields: (fields: Record<string, any>) => Url.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Url.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => Url.fromBcs(data),
      bcs: Url.bcs,
      fromJSONField: (field: any) => Url.fromJSONField(field),
      __class: null as unknown as ReturnType<typeof Url.new>,
    }
  }

  static fromFields(fields: Record<string, any>): Url {
    return Url.new(decodeFromFields(String.reified(), fields.url))
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Url {
    if (!isUrl(item.type)) {
      throw new Error('not a Url type')
    }

    return Url.new(decodeFromFieldsWithTypes(String.reified(), item.fields.url))
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
    return { $typeName: this.$typeName, ...this.toJSONField() }
  }

  static fromJSONField(field: any): Url {
    return Url.new(decodeFromJSONField(String.reified(), field.url))
  }

  static fromJSON(json: Record<string, any>): Url {
    if (json.$typeName !== Url.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return Url.fromJSONField(json)
  }
}
