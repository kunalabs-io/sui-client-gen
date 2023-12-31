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

/* ============================== Entry =============================== */

export function isEntry(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::vec_map::Entry<')
}

export interface EntryFields<K, V> {
  key: K
  value: V
}

export class Entry<K, V> {
  static readonly $typeName = '0x2::vec_map::Entry'
  static readonly $numTypeParams = 2

  static get bcs() {
    return <K extends BcsType<any>, V extends BcsType<any>>(K: K, V: V) =>
      bcs.struct(`Entry<${K.name}, ${V.name}>`, {
        key: K,
        value: V,
      })
  }

  readonly $typeArgs: [Type, Type]

  readonly key: K
  readonly value: V

  constructor(typeArgs: [Type, Type], fields: EntryFields<K, V>) {
    this.$typeArgs = typeArgs

    this.key = fields.key
    this.value = fields.value
  }

  static fromFields<K, V>(typeArgs: [Type, Type], fields: Record<string, any>): Entry<K, V> {
    initLoaderIfNeeded()

    return new Entry(typeArgs, {
      key: structClassLoaderSource.fromFields(typeArgs[0], fields.key),
      value: structClassLoaderSource.fromFields(typeArgs[1], fields.value),
    })
  }

  static fromFieldsWithTypes<K, V>(item: FieldsWithTypes): Entry<K, V> {
    initLoaderIfNeeded()

    if (!isEntry(item.type)) {
      throw new Error('not a Entry type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new Entry([typeArgs[0], typeArgs[1]], {
      key: structClassLoaderSource.fromFieldsWithTypes(typeArgs[0], item.fields.key),
      value: structClassLoaderSource.fromFieldsWithTypes(typeArgs[1], item.fields.value),
    })
  }

  static fromBcs<K, V>(typeArgs: [Type, Type], data: Uint8Array): Entry<K, V> {
    initLoaderIfNeeded()

    return Entry.fromFields(
      typeArgs,
      Entry.bcs(
        structClassLoaderSource.getBcsType(typeArgs[0]),
        structClassLoaderSource.getBcsType(typeArgs[1])
      ).parse(data)
    )
  }

  toJSON() {
    return {
      $typeArgs: this.$typeArgs,
      key: genericToJSON(this.$typeArgs[0], this.key),
      value: genericToJSON(this.$typeArgs[1], this.value),
    }
  }
}

/* ============================== VecMap =============================== */

export function isVecMap(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::vec_map::VecMap<')
}

export interface VecMapFields<K, V> {
  contents: Array<Entry<K, V>>
}

export class VecMap<K, V> {
  static readonly $typeName = '0x2::vec_map::VecMap'
  static readonly $numTypeParams = 2

  static get bcs() {
    return <K extends BcsType<any>, V extends BcsType<any>>(K: K, V: V) =>
      bcs.struct(`VecMap<${K.name}, ${V.name}>`, {
        contents: bcs.vector(Entry.bcs(K, V)),
      })
  }

  readonly $typeArgs: [Type, Type]

  readonly contents: Array<Entry<K, V>>

  constructor(typeArgs: [Type, Type], contents: Array<Entry<K, V>>) {
    this.$typeArgs = typeArgs

    this.contents = contents
  }

  static fromFields<K, V>(typeArgs: [Type, Type], fields: Record<string, any>): VecMap<K, V> {
    initLoaderIfNeeded()

    return new VecMap(
      typeArgs,
      fields.contents.map((item: any) =>
        Entry.fromFields<K, V>([`${typeArgs[0]}`, `${typeArgs[1]}`], item)
      )
    )
  }

  static fromFieldsWithTypes<K, V>(item: FieldsWithTypes): VecMap<K, V> {
    initLoaderIfNeeded()

    if (!isVecMap(item.type)) {
      throw new Error('not a VecMap type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new VecMap(
      [typeArgs[0], typeArgs[1]],
      item.fields.contents.map((item: any) => Entry.fromFieldsWithTypes<K, V>(item))
    )
  }

  static fromBcs<K, V>(typeArgs: [Type, Type], data: Uint8Array): VecMap<K, V> {
    initLoaderIfNeeded()

    return VecMap.fromFields(
      typeArgs,
      VecMap.bcs(
        structClassLoaderSource.getBcsType(typeArgs[0]),
        structClassLoaderSource.getBcsType(typeArgs[1])
      ).parse(data)
    )
  }

  toJSON() {
    return {
      $typeArgs: this.$typeArgs,
      contents: genericToJSON(
        `vector<0x2::vec_map::Entry<${this.$typeArgs[0]}, ${this.$typeArgs[1]}>>`,
        this.contents
      ),
    }
  }
}
