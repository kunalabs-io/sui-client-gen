import { bcsOnchain as bcs } from '../../../../_framework/bcs'
import { initLoaderIfNeeded } from '../../../../_framework/init-onchain'
import { structClassLoaderOnchain } from '../../../../_framework/loader'
import { FieldsWithTypes, Type, parseTypeName } from '../../../../_framework/util'
import { Encoding } from '@mysten/bcs'

/* ============================== Entry =============================== */

bcs.registerStructType('0x2::vec_map::Entry<T0, T1>', {
  key: `T0`,
  value: `T1`,
})

export function isEntry(type: Type): boolean {
  return type.startsWith('0x2::vec_map::Entry<')
}

export interface EntryFields<T0, T1> {
  key: T0
  value: T1
}

export class Entry<T0, T1> {
  static readonly $typeName = '0x2::vec_map::Entry'
  static readonly $numTypeParams = 2

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

  static fromBcs<T0, T1>(
    typeArgs: [Type, Type],
    data: Uint8Array | string,
    encoding?: Encoding
  ): Entry<T0, T1> {
    return Entry.fromFields(typeArgs, bcs.de([Entry.$typeName, ...typeArgs], data, encoding))
  }
}

/* ============================== VecMap =============================== */

bcs.registerStructType('0x2::vec_map::VecMap<T0, T1>', {
  contents: `vector<0x2::vec_map::Entry<T0, T1>>`,
})

export function isVecMap(type: Type): boolean {
  return type.startsWith('0x2::vec_map::VecMap<')
}

export interface VecMapFields<T0, T1> {
  contents: Array<Entry<T0, T1>>
}

export class VecMap<T0, T1> {
  static readonly $typeName = '0x2::vec_map::VecMap'
  static readonly $numTypeParams = 2

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

  static fromBcs<T0, T1>(
    typeArgs: [Type, Type],
    data: Uint8Array | string,
    encoding?: Encoding
  ): VecMap<T0, T1> {
    return VecMap.fromFields(typeArgs, bcs.de([VecMap.$typeName, ...typeArgs], data, encoding))
  }
}
