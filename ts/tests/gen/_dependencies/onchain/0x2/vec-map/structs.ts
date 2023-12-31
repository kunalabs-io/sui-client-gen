import { initLoaderIfNeeded } from '../../../../_framework/init-onchain'
import { structClassLoaderOnchain } from '../../../../_framework/loader'
import {
  FieldsWithTypes,
  Type,
  compressSuiType,
  genericToJSON,
  parseTypeName,
} from '../../../../_framework/util'
import { BcsType, bcs } from '@mysten/bcs'

/* ============================== Entry =============================== */

export function isEntry(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::vec_map::Entry<')
}

export interface EntryFields<T0, T1> {
  key: T0
  value: T1
}

export class Entry<T0, T1> {
  static readonly $typeName = '0x2::vec_map::Entry'
  static readonly $numTypeParams = 2

  static get bcs() {
    return <T0 extends BcsType<any>, T1 extends BcsType<any>>(T0: T0, T1: T1) =>
      bcs.struct(`Entry<${T0.name}, ${T1.name}>`, {
        key: T0,
        value: T1,
      })
  }

  readonly $typeArgs: [Type, Type]

  readonly key: T0
  readonly value: T1

  constructor(typeArgs: [Type, Type], fields: EntryFields<T0, T1>) {
    this.$typeArgs = typeArgs

    this.key = fields.key
    this.value = fields.value
  }

  static fromFields<T0, T1>(typeArgs: [Type, Type], fields: Record<string, any>): Entry<T0, T1> {
    initLoaderIfNeeded()

    return new Entry(typeArgs, {
      key: structClassLoaderOnchain.fromFields(typeArgs[0], fields.key),
      value: structClassLoaderOnchain.fromFields(typeArgs[1], fields.value),
    })
  }

  static fromFieldsWithTypes<T0, T1>(item: FieldsWithTypes): Entry<T0, T1> {
    initLoaderIfNeeded()

    if (!isEntry(item.type)) {
      throw new Error('not a Entry type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new Entry([typeArgs[0], typeArgs[1]], {
      key: structClassLoaderOnchain.fromFieldsWithTypes(typeArgs[0], item.fields.key),
      value: structClassLoaderOnchain.fromFieldsWithTypes(typeArgs[1], item.fields.value),
    })
  }

  static fromBcs<T0, T1>(typeArgs: [Type, Type], data: Uint8Array): Entry<T0, T1> {
    initLoaderIfNeeded()

    return Entry.fromFields(
      typeArgs,
      Entry.bcs(
        structClassLoaderOnchain.getBcsType(typeArgs[0]),
        structClassLoaderOnchain.getBcsType(typeArgs[1])
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

export interface VecMapFields<T0, T1> {
  contents: Array<Entry<T0, T1>>
}

export class VecMap<T0, T1> {
  static readonly $typeName = '0x2::vec_map::VecMap'
  static readonly $numTypeParams = 2

  static get bcs() {
    return <T0 extends BcsType<any>, T1 extends BcsType<any>>(T0: T0, T1: T1) =>
      bcs.struct(`VecMap<${T0.name}, ${T1.name}>`, {
        contents: bcs.vector(Entry.bcs(T0, T1)),
      })
  }

  readonly $typeArgs: [Type, Type]

  readonly contents: Array<Entry<T0, T1>>

  constructor(typeArgs: [Type, Type], contents: Array<Entry<T0, T1>>) {
    this.$typeArgs = typeArgs

    this.contents = contents
  }

  static fromFields<T0, T1>(typeArgs: [Type, Type], fields: Record<string, any>): VecMap<T0, T1> {
    initLoaderIfNeeded()

    return new VecMap(
      typeArgs,
      fields.contents.map((item: any) =>
        Entry.fromFields<T0, T1>([`${typeArgs[0]}`, `${typeArgs[1]}`], item)
      )
    )
  }

  static fromFieldsWithTypes<T0, T1>(item: FieldsWithTypes): VecMap<T0, T1> {
    initLoaderIfNeeded()

    if (!isVecMap(item.type)) {
      throw new Error('not a VecMap type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new VecMap(
      [typeArgs[0], typeArgs[1]],
      item.fields.contents.map((item: any) => Entry.fromFieldsWithTypes<T0, T1>(item))
    )
  }

  static fromBcs<T0, T1>(typeArgs: [Type, Type], data: Uint8Array): VecMap<T0, T1> {
    initLoaderIfNeeded()

    return VecMap.fromFields(
      typeArgs,
      VecMap.bcs(
        structClassLoaderOnchain.getBcsType(typeArgs[0]),
        structClassLoaderOnchain.getBcsType(typeArgs[1])
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
