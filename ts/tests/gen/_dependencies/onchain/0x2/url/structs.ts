import { FieldsWithTypes, Type, compressSuiType } from '../../../../_framework/util'
import { String } from '../../0x1/ascii/structs'
import { bcs } from '@mysten/bcs'

/* ============================== Url =============================== */

export function isUrl(type: Type): boolean {
  type = compressSuiType(type)
  return type === '0x2::url::Url'
}

export interface UrlFields {
  url: string
}

export class Url {
  static readonly $typeName = '0x2::url::Url'
  static readonly $numTypeParams = 0

  static get bcs() {
    return bcs.struct('Url', {
      url: String.bcs,
    })
  }

  readonly url: string

  constructor(url: string) {
    this.url = url
  }

  static fromFields(fields: Record<string, any>): Url {
    return new Url(
      new TextDecoder().decode(Uint8Array.from(String.fromFields(fields.url).bytes)).toString()
    )
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Url {
    if (!isUrl(item.type)) {
      throw new Error('not a Url type')
    }
    return new Url(item.fields.url)
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
