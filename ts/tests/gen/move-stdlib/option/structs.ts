import { initLoaderIfNeeded } from '../../_framework/init-source'
import { structClassLoaderSource } from '../../_framework/loader'
import {
  FieldsWithTypes,
  Type,
  compressSuiType,
  genericToJSON,
  parseTypeName,
} from '../../_framework/util'
import { BcsType, bcs } from '@mysten/bcs'

/* ============================== Option =============================== */

export function isOption(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x1::option::Option<')
}

export interface OptionFields<Element> {
  vec: Array<Element>
}

export class Option<Element> {
  static readonly $typeName = '0x1::option::Option'
  static readonly $numTypeParams = 1

  static get bcs() {
    return <Element extends BcsType<any>>(Element: Element) =>
      bcs.struct(`Option<${Element.name}>`, {
        vec: bcs.vector(Element),
      })
  }

  readonly $typeArg: Type

  readonly vec: Array<Element>

  constructor(typeArg: Type, vec: Array<Element>) {
    this.$typeArg = typeArg

    this.vec = vec
  }

  static fromFields<Element>(typeArg: Type, fields: Record<string, any>): Option<Element> {
    initLoaderIfNeeded()

    return new Option(
      typeArg,
      fields.vec.map((item: any) => structClassLoaderSource.fromFields(typeArg, item))
    )
  }

  static fromFieldsWithTypes<Element>(item: FieldsWithTypes): Option<Element> {
    initLoaderIfNeeded()

    if (!isOption(item.type)) {
      throw new Error('not a Option type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new Option(
      typeArgs[0],
      item.fields.vec.map((item: any) =>
        structClassLoaderSource.fromFieldsWithTypes(typeArgs[0], item)
      )
    )
  }

  static fromBcs<Element>(typeArg: Type, data: Uint8Array): Option<Element> {
    initLoaderIfNeeded()

    const typeArgs = [typeArg]

    return Option.fromFields(
      typeArg,
      Option.bcs(structClassLoaderSource.getBcsType(typeArgs[0])).parse(data)
    )
  }

  toJSON() {
    return {
      $typeArg: this.$typeArg,
      vec: genericToJSON(`vector<${this.$typeArg}>`, this.vec),
    }
  }
}
