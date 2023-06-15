import { bcsOnchain as bcs } from '../../../../_framework/bcs'
import { initLoaderIfNeeded } from '../../../../_framework/init-onchain'
import { structClassLoaderOnchain } from '../../../../_framework/loader'
import { FieldsWithTypes, Type, parseTypeName } from '../../../../_framework/util'
import { Encoding } from '@mysten/bcs'

/* ============================== PriorityQueue =============================== */

bcs.registerStructType('0x2::priority_queue::PriorityQueue<T0>', {
  entries: `vector<0x2::priority_queue::Entry<T0>>`,
})

export function isPriorityQueue(type: Type): boolean {
  return type.startsWith('0x2::priority_queue::PriorityQueue<')
}

export interface PriorityQueueFields<T0> {
  entries: Array<Entry<T0>>
}

export class PriorityQueue<T0> {
  static readonly $typeName = '0x2::priority_queue::PriorityQueue'
  static readonly $numTypeParams = 1

  readonly $typeArg: Type

  readonly entries: Array<Entry<T0>>

  constructor(typeArg: Type, entries: Array<Entry<T0>>) {
    this.$typeArg = typeArg

    this.entries = entries
  }

  static fromFields<T0>(typeArg: Type, fields: Record<string, any>): PriorityQueue<T0> {
    initLoaderIfNeeded()

    return new PriorityQueue(
      typeArg,
      fields.entries.map((item: any) => Entry.fromFields<T0>(`${typeArg}`, item))
    )
  }

  static fromFieldsWithTypes<T0>(item: FieldsWithTypes): PriorityQueue<T0> {
    initLoaderIfNeeded()

    if (!isPriorityQueue(item.type)) {
      throw new Error('not a PriorityQueue type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new PriorityQueue(
      typeArgs[0],
      item.fields.entries.map((item: any) => Entry.fromFieldsWithTypes<T0>(item))
    )
  }

  static fromBcs<T0>(
    typeArg: Type,
    data: Uint8Array | string,
    encoding?: Encoding
  ): PriorityQueue<T0> {
    return PriorityQueue.fromFields(
      typeArg,
      bcs.de([PriorityQueue.$typeName, typeArg], data, encoding)
    )
  }
}

/* ============================== Entry =============================== */

bcs.registerStructType('0x2::priority_queue::Entry<T0>', {
  priority: `u64`,
  value: `T0`,
})

export function isEntry(type: Type): boolean {
  return type.startsWith('0x2::priority_queue::Entry<')
}

export interface EntryFields<T0> {
  priority: bigint
  value: T0
}

export class Entry<T0> {
  static readonly $typeName = '0x2::priority_queue::Entry'
  static readonly $numTypeParams = 1

  readonly $typeArg: Type

  readonly priority: bigint
  readonly value: T0

  constructor(typeArg: Type, fields: EntryFields<T0>) {
    this.$typeArg = typeArg

    this.priority = fields.priority
    this.value = fields.value
  }

  static fromFields<T0>(typeArg: Type, fields: Record<string, any>): Entry<T0> {
    initLoaderIfNeeded()

    return new Entry(typeArg, {
      priority: BigInt(fields.priority),
      value: structClassLoaderOnchain.fromFields(typeArg, fields.value),
    })
  }

  static fromFieldsWithTypes<T0>(item: FieldsWithTypes): Entry<T0> {
    initLoaderIfNeeded()

    if (!isEntry(item.type)) {
      throw new Error('not a Entry type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new Entry(typeArgs[0], {
      priority: BigInt(item.fields.priority),
      value: structClassLoaderOnchain.fromFieldsWithTypes(typeArgs[0], item.fields.value),
    })
  }

  static fromBcs<T0>(typeArg: Type, data: Uint8Array | string, encoding?: Encoding): Entry<T0> {
    return Entry.fromFields(typeArg, bcs.de([Entry.$typeName, typeArg], data, encoding))
  }
}
