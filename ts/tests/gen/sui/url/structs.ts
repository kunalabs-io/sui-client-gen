import { Encoding, bcsSource as bcs } from '../../_framework/bcs'
import { FieldsWithTypes, Type } from '../../_framework/util'
import { String } from '../../move-stdlib/ascii/structs'

/* ============================== Url =============================== */

bcs.registerStructType('0x2::url::Url', {
  url: `0x1::ascii::String`,
})

export function isUrl(type: Type): boolean {
  return type === '0x2::url::Url'
}

export interface UrlFields {
  url: string
}

export class Url {
  static readonly $typeName = '0x2::url::Url'
  static readonly $numTypeParams = 0

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

  static fromBcs(data: Uint8Array | string, encoding?: Encoding): Url {
    return Url.fromFields(bcs.de([Url.$typeName], data, encoding))
  }
}
