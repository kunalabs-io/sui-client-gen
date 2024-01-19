import {
  ToField,
  decodeFromFieldsGenericOrSpecial,
  decodeFromFieldsWithTypesGenericOrSpecial,
} from '../../_framework/types'
import { FieldsWithTypes, compressSuiType } from '../../_framework/util'
import { String } from '../../move-stdlib/ascii/structs'
import { bcs } from '@mysten/bcs'

/* ============================== Url =============================== */

export function isUrl(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x2::url::Url'
}

export interface UrlFields {
  url: ToField<String>
}

export class Url {
  static readonly $typeName = '0x2::url::Url'
  static readonly $numTypeParams = 0

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
      fromFields: (fields: Record<string, any>) => Url.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Url.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => Url.fromBcs(data),
      bcs: Url.bcs,
      __class: null as unknown as ReturnType<typeof Url.new>,
    }
  }

  static fromFields(fields: Record<string, any>): Url {
    return Url.new(decodeFromFieldsGenericOrSpecial(String.reified(), fields.url))
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Url {
    if (!isUrl(item.type)) {
      throw new Error('not a Url type')
    }

    return Url.new(decodeFromFieldsWithTypesGenericOrSpecial(String.reified(), item.fields.url))
  }

  static fromBcs(data: Uint8Array): Url {
    return Url.fromFields(Url.bcs.parse(data))
  }

  toJSON() {
    return {
      url: this.url,
    }
  }
}
