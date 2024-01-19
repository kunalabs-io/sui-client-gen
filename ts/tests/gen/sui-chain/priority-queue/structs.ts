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
import { FieldsWithTypes, compressSuiType, genericToJSON } from '../../_framework/util'
import { BcsType, bcs } from '@mysten/bcs'

/* ============================== PriorityQueue =============================== */

export function isPriorityQueue(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::priority_queue::PriorityQueue<')
}

export interface PriorityQueueFields<T0 extends TypeArgument> {
  entries: Array<ToField<Entry<T0>>>
}

export class PriorityQueue<T0 extends TypeArgument> {
  static readonly $typeName = '0x2::priority_queue::PriorityQueue'
  static readonly $numTypeParams = 1

  readonly $typeName = PriorityQueue.$typeName

  static get bcs() {
    return <T0 extends BcsType<any>>(T0: T0) =>
      bcs.struct(`PriorityQueue<${T0.name}>`, {
        entries: bcs.vector(Entry.bcs(T0)),
      })
  }

  readonly $typeArg: string

  readonly entries: Array<ToField<Entry<T0>>>

  private constructor(typeArg: string, entries: Array<ToField<Entry<T0>>>) {
    this.$typeArg = typeArg

    this.entries = entries
  }

  static new<T0 extends ReifiedTypeArgument>(
    typeArg: T0,
    entries: Array<ToField<Entry<ToTypeArgument<T0>>>>
  ): PriorityQueue<ToTypeArgument<T0>> {
    return new PriorityQueue(extractType(typeArg), entries)
  }

  static reified<T0 extends ReifiedTypeArgument>(T0: T0) {
    return {
      typeName: PriorityQueue.$typeName,
      typeArgs: [T0],
      fromFields: (fields: Record<string, any>) => PriorityQueue.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => PriorityQueue.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => PriorityQueue.fromBcs(T0, data),
      bcs: PriorityQueue.bcs(toBcs(T0)),
      __class: null as unknown as ReturnType<typeof PriorityQueue.new<ToTypeArgument<T0>>>,
    }
  }

  static fromFields<T0 extends ReifiedTypeArgument>(
    typeArg: T0,
    fields: Record<string, any>
  ): PriorityQueue<ToTypeArgument<T0>> {
    return PriorityQueue.new(
      typeArg,
      decodeFromFieldsGenericOrSpecial(reified.vector(Entry.reified(typeArg)), fields.entries)
    )
  }

  static fromFieldsWithTypes<T0 extends ReifiedTypeArgument>(
    typeArg: T0,
    item: FieldsWithTypes
  ): PriorityQueue<ToTypeArgument<T0>> {
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

  static fromBcs<T0 extends ReifiedTypeArgument>(
    typeArg: T0,
    data: Uint8Array
  ): PriorityQueue<ToTypeArgument<T0>> {
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

/* ============================== Entry =============================== */

export function isEntry(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::priority_queue::Entry<')
}

export interface EntryFields<T0 extends TypeArgument> {
  priority: ToField<'u64'>
  value: ToField<T0>
}

export class Entry<T0 extends TypeArgument> {
  static readonly $typeName = '0x2::priority_queue::Entry'
  static readonly $numTypeParams = 1

  readonly $typeName = Entry.$typeName

  static get bcs() {
    return <T0 extends BcsType<any>>(T0: T0) =>
      bcs.struct(`Entry<${T0.name}>`, {
        priority: bcs.u64(),
        value: T0,
      })
  }

  readonly $typeArg: string

  readonly priority: ToField<'u64'>
  readonly value: ToField<T0>

  private constructor(typeArg: string, fields: EntryFields<T0>) {
    this.$typeArg = typeArg

    this.priority = fields.priority
    this.value = fields.value
  }

  static new<T0 extends ReifiedTypeArgument>(
    typeArg: T0,
    fields: EntryFields<ToTypeArgument<T0>>
  ): Entry<ToTypeArgument<T0>> {
    return new Entry(extractType(typeArg), fields)
  }

  static reified<T0 extends ReifiedTypeArgument>(T0: T0) {
    return {
      typeName: Entry.$typeName,
      typeArgs: [T0],
      fromFields: (fields: Record<string, any>) => Entry.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Entry.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => Entry.fromBcs(T0, data),
      bcs: Entry.bcs(toBcs(T0)),
      __class: null as unknown as ReturnType<typeof Entry.new<ToTypeArgument<T0>>>,
    }
  }

  static fromFields<T0 extends ReifiedTypeArgument>(
    typeArg: T0,
    fields: Record<string, any>
  ): Entry<ToTypeArgument<T0>> {
    return Entry.new(typeArg, {
      priority: decodeFromFieldsGenericOrSpecial('u64', fields.priority),
      value: decodeFromFieldsGenericOrSpecial(typeArg, fields.value),
    })
  }

  static fromFieldsWithTypes<T0 extends ReifiedTypeArgument>(
    typeArg: T0,
    item: FieldsWithTypes
  ): Entry<ToTypeArgument<T0>> {
    if (!isEntry(item.type)) {
      throw new Error('not a Entry type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Entry.new(typeArg, {
      priority: decodeFromFieldsWithTypesGenericOrSpecial('u64', item.fields.priority),
      value: decodeFromFieldsWithTypesGenericOrSpecial(typeArg, item.fields.value),
    })
  }

  static fromBcs<T0 extends ReifiedTypeArgument>(
    typeArg: T0,
    data: Uint8Array
  ): Entry<ToTypeArgument<T0>> {
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
