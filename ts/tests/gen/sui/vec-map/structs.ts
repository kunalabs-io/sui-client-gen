import { bcsSource as bcs } from '../../_framework/bcs'
import { initLoaderIfNeeded } from '../../_framework/init-source'
import { structClassLoaderSource } from '../../_framework/loader'
import { FieldsWithTypes, Type, parseTypeName } from '../../_framework/util'
import { Encoding } from '@mysten/bcs'

/* ============================== Entry =============================== */

bcs.registerStructType('0x2::vec_map::Entry<K, V>', {
  key: `K`,
  value: `V`,
})

export function isEntry(type: Type): boolean {
  return type.startsWith('0x2::vec_map::Entry<')
}

export interface EntryFields<K, V> {
  key: K
  value: V
}

export class Entry<K, V> {
  static readonly $typeName = '0x2::vec_map::Entry'
  static readonly $numTypeParams = 2

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

  static fromBcs<K, V>(
    typeArgs: [Type, Type],
    data: Uint8Array | string,
    encoding?: Encoding
  ): Entry<K, V> {
    return Entry.fromFields(typeArgs, bcs.de([Entry.$typeName, ...typeArgs], data, encoding))
  }
}

/* ============================== VecMap =============================== */

bcs.registerStructType('0x2::vec_map::VecMap<K, V>', {
  contents: `vector<0x2::vec_map::Entry<K, V>>`,
})

export function isVecMap(type: Type): boolean {
  return type.startsWith('0x2::vec_map::VecMap<')
}

export interface VecMapFields<K, V> {
  contents: Array<Entry<K, V>>
}

export class VecMap<K, V> {
  static readonly $typeName = '0x2::vec_map::VecMap'
  static readonly $numTypeParams = 2

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

  static fromBcs<K, V>(
    typeArgs: [Type, Type],
    data: Uint8Array | string,
    encoding?: Encoding
  ): VecMap<K, V> {
    return VecMap.fromFields(typeArgs, bcs.de([VecMap.$typeName, ...typeArgs], data, encoding))
  }
}
