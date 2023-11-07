import { Encoding, bcsSource as bcs } from '../../_framework/bcs'
import { initLoaderIfNeeded } from '../../_framework/init-source'
import { structClassLoaderSource } from '../../_framework/loader'
import { FieldsWithTypes, Type, compressSuiType, parseTypeName } from '../../_framework/util'

/* ============================== Entry =============================== */

bcs.registerStructType('0x2::priority_queue::Entry<T>', {
  priority: `u64`,
  value: `T`,
})

export function isEntry(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::priority_queue::Entry<')
}

export interface EntryFields<T> {
  priority: bigint
  value: T
}

export class Entry<T> {
  static readonly $typeName = '0x2::priority_queue::Entry'
  static readonly $numTypeParams = 1

  readonly $typeArg: Type

  readonly priority: bigint
  readonly value: T

  constructor(typeArg: Type, fields: EntryFields<T>) {
    this.$typeArg = typeArg

    this.priority = fields.priority
    this.value = fields.value
  }

  static fromFields<T>(typeArg: Type, fields: Record<string, any>): Entry<T> {
    initLoaderIfNeeded()

    return new Entry(typeArg, {
      priority: BigInt(fields.priority),
      value: structClassLoaderSource.fromFields(typeArg, fields.value),
    })
  }

  static fromFieldsWithTypes<T>(item: FieldsWithTypes): Entry<T> {
    initLoaderIfNeeded()

    if (!isEntry(item.type)) {
      throw new Error('not a Entry type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new Entry(typeArgs[0], {
      priority: BigInt(item.fields.priority),
      value: structClassLoaderSource.fromFieldsWithTypes(typeArgs[0], item.fields.value),
    })
  }

  static fromBcs<T>(typeArg: Type, data: Uint8Array | string, encoding?: Encoding): Entry<T> {
    return Entry.fromFields(typeArg, bcs.de([Entry.$typeName, typeArg], data, encoding))
  }
}

/* ============================== PriorityQueue =============================== */

bcs.registerStructType('0x2::priority_queue::PriorityQueue<T>', {
  entries: `vector<0x2::priority_queue::Entry<T>>`,
})

export function isPriorityQueue(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::priority_queue::PriorityQueue<')
}

export interface PriorityQueueFields<T> {
  entries: Array<Entry<T>>
}

export class PriorityQueue<T> {
  static readonly $typeName = '0x2::priority_queue::PriorityQueue'
  static readonly $numTypeParams = 1

  readonly $typeArg: Type

  readonly entries: Array<Entry<T>>

  constructor(typeArg: Type, entries: Array<Entry<T>>) {
    this.$typeArg = typeArg

    this.entries = entries
  }

  static fromFields<T>(typeArg: Type, fields: Record<string, any>): PriorityQueue<T> {
    initLoaderIfNeeded()

    return new PriorityQueue(
      typeArg,
      fields.entries.map((item: any) => Entry.fromFields<T>(`${typeArg}`, item))
    )
  }

  static fromFieldsWithTypes<T>(item: FieldsWithTypes): PriorityQueue<T> {
    initLoaderIfNeeded()

    if (!isPriorityQueue(item.type)) {
      throw new Error('not a PriorityQueue type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new PriorityQueue(
      typeArgs[0],
      item.fields.entries.map((item: any) => Entry.fromFieldsWithTypes<T>(item))
    )
  }

  static fromBcs<T>(
    typeArg: Type,
    data: Uint8Array | string,
    encoding?: Encoding
  ): PriorityQueue<T> {
    return PriorityQueue.fromFields(
      typeArg,
      bcs.de([PriorityQueue.$typeName, typeArg], data, encoding)
    )
  }
}
