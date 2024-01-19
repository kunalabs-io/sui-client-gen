import {
  ReifiedTypeArgument,
  ToField,
  ToTypeArgument,
  TypeArgument,
  assertFieldsWithTypesArgsMatch,
  decodeFromFieldsGenericOrSpecial,
  decodeFromFieldsWithTypesGenericOrSpecial,
  extractType,
  reified,
  toBcs,
} from '../../_framework/types'
import { FieldsWithTypes, Type, compressSuiType, genericToJSON } from '../../_framework/util'
import { BcsType, bcs } from '@mysten/bcs'

/* ============================== Entry =============================== */

export function isEntry(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::priority_queue::Entry<')
}

export interface EntryFields<T extends TypeArgument> {
  priority: ToField<'u64'>
  value: ToField<T>
}

export class Entry<T extends TypeArgument> {
  static readonly $typeName = '0x2::priority_queue::Entry'
  static readonly $numTypeParams = 1

  readonly $typeName = Entry.$typeName

  static get bcs() {
    return <T extends BcsType<any>>(T: T) =>
      bcs.struct(`Entry<${T.name}>`, {
        priority: bcs.u64(),
        value: T,
      })
  }

  readonly $typeArg: string

  readonly priority: ToField<'u64'>
  readonly value: ToField<T>

  private constructor(typeArg: string, fields: EntryFields<T>) {
    this.$typeArg = typeArg

    this.priority = fields.priority
    this.value = fields.value
  }

  static new<T extends ReifiedTypeArgument>(
    typeArg: T,
    fields: EntryFields<ToTypeArgument<T>>
  ): Entry<ToTypeArgument<T>> {
    return new Entry(extractType(typeArg), fields)
  }

  static reified<T extends ReifiedTypeArgument>(T: T) {
    return {
      typeName: Entry.$typeName,
      typeArgs: [T],
      fromFields: (fields: Record<string, any>) => Entry.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Entry.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => Entry.fromBcs(T, data),
      bcs: Entry.bcs(toBcs(T)),
      __class: null as unknown as ReturnType<typeof Entry.new<ToTypeArgument<T>>>,
    }
  }

  static fromFields<T extends ReifiedTypeArgument>(
    typeArg: T,
    fields: Record<string, any>
  ): Entry<ToTypeArgument<T>> {
    return Entry.new(typeArg, {
      priority: decodeFromFieldsGenericOrSpecial('u64', fields.priority),
      value: decodeFromFieldsGenericOrSpecial(typeArg, fields.value),
    })
  }

  static fromFieldsWithTypes<T extends ReifiedTypeArgument>(
    typeArg: T,
    item: FieldsWithTypes
  ): Entry<ToTypeArgument<T>> {
    if (!isEntry(item.type)) {
      throw new Error('not a Entry type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Entry.new(typeArg, {
      priority: decodeFromFieldsWithTypesGenericOrSpecial('u64', item.fields.priority),
      value: decodeFromFieldsWithTypesGenericOrSpecial(typeArg, item.fields.value),
    })
  }

  static fromBcs<T extends ReifiedTypeArgument>(
    typeArg: T,
    data: Uint8Array
  ): Entry<ToTypeArgument<T>> {
    const typeArgs = [typeArg]

    return Entry.fromFields(typeArg, Entry.bcs(toBcs(typeArgs[0])).parse(data))
  }

  toJSON() {
    return {
      $typeArg: this.$typeArg,
      priority: this.priority.toString(),
      value: genericToJSON(this.$typeArg, this.value),
    }
  }
}

/* ============================== PriorityQueue =============================== */

export function isPriorityQueue(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::priority_queue::PriorityQueue<')
}

export interface PriorityQueueFields<T extends TypeArgument> {
  entries: Array<ToField<Entry<T>>>
}

export class PriorityQueue<T extends TypeArgument> {
  static readonly $typeName = '0x2::priority_queue::PriorityQueue'
  static readonly $numTypeParams = 1

  readonly $typeName = PriorityQueue.$typeName

  static get bcs() {
    return <T extends BcsType<any>>(T: T) =>
      bcs.struct(`PriorityQueue<${T.name}>`, {
        entries: bcs.vector(Entry.bcs(T)),
      })
  }

  readonly $typeArg: string

  readonly entries: Array<ToField<Entry<T>>>

  private constructor(typeArg: string, entries: Array<ToField<Entry<T>>>) {
    this.$typeArg = typeArg

    this.entries = entries
  }

  static new<T extends ReifiedTypeArgument>(
    typeArg: T,
    entries: Array<ToField<Entry<ToTypeArgument<T>>>>
  ): PriorityQueue<ToTypeArgument<T>> {
    return new PriorityQueue(extractType(typeArg), entries)
  }

  static reified<T extends ReifiedTypeArgument>(T: T) {
    return {
      typeName: PriorityQueue.$typeName,
      typeArgs: [T],
      fromFields: (fields: Record<string, any>) => PriorityQueue.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => PriorityQueue.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => PriorityQueue.fromBcs(T, data),
      bcs: PriorityQueue.bcs(toBcs(T)),
      __class: null as unknown as ReturnType<typeof PriorityQueue.new<ToTypeArgument<T>>>,
    }
  }

  static fromFields<T extends ReifiedTypeArgument>(
    typeArg: T,
    fields: Record<string, any>
  ): PriorityQueue<ToTypeArgument<T>> {
    return PriorityQueue.new(
      typeArg,
      decodeFromFieldsGenericOrSpecial(reified.vector(Entry.reified(typeArg)), fields.entries)
    )
  }

  static fromFieldsWithTypes<T extends ReifiedTypeArgument>(
    typeArg: T,
    item: FieldsWithTypes
  ): PriorityQueue<ToTypeArgument<T>> {
    if (!isPriorityQueue(item.type)) {
      throw new Error('not a PriorityQueue type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return PriorityQueue.new(
      typeArg,
      decodeFromFieldsWithTypesGenericOrSpecial(
        reified.vector(Entry.reified(typeArg)),
        item.fields.entries
      )
    )
  }

  static fromBcs<T extends ReifiedTypeArgument>(
    typeArg: T,
    data: Uint8Array
  ): PriorityQueue<ToTypeArgument<T>> {
    const typeArgs = [typeArg]

    return PriorityQueue.fromFields(typeArg, PriorityQueue.bcs(toBcs(typeArgs[0])).parse(data))
  }

  toJSON() {
    return {
      $typeArg: this.$typeArg,
      entries: genericToJSON(`vector<0x2::priority_queue::Entry<${this.$typeArg}>>`, this.entries),
    }
  }
}
