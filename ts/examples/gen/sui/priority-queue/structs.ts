import { initLoaderIfNeeded } from '../../_framework/init-source'
import { structClassLoaderSource } from '../../_framework/loader'
import { FieldsWithTypes, Type, compressSuiType, parseTypeName } from '../../_framework/util'
import { BcsType, bcs } from '@mysten/bcs'

/* ============================== Entry =============================== */

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

  static get bcs(): (t: BcsType<any>) => BcsType<any> {
    return bcs.generic(['T'], T =>
      bcs.struct('Entry<T>', {
        priority: bcs.u64(),
        value: T,
      })
    )
  }

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

  static fromBcs<T>(typeArg: Type, data: Uint8Array): Entry<T> {
    initLoaderIfNeeded()

    const typeArgs = [typeArg]

    return Entry.fromFields(
      typeArg,
      Entry.bcs(structClassLoaderSource.getBcsType(typeArgs[0])).parse(data)
    )
  }
}

/* ============================== PriorityQueue =============================== */

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

  static get bcs(): (t: BcsType<any>) => BcsType<any> {
    return bcs.generic(['T'], T =>
      bcs.struct('PriorityQueue<T>', {
        entries: bcs.vector(Entry.bcs(T)),
      })
    )
  }

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

  static fromBcs<T>(typeArg: Type, data: Uint8Array): PriorityQueue<T> {
    initLoaderIfNeeded()

    const typeArgs = [typeArg]

    return PriorityQueue.fromFields(
      typeArg,
      PriorityQueue.bcs(structClassLoaderSource.getBcsType(typeArgs[0])).parse(data)
    )
  }
}
