import * as reified from '../../_framework/reified'
import {
  PhantomReified,
  Reified,
  StructClass,
  ToField,
  ToTypeArgument,
  ToTypeStr,
  TypeArgument,
  Vector,
  assertFieldsWithTypesArgsMatch,
  assertReifiedTypeArgsMatch,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  extractType,
  fieldToJSON,
  phantom,
  toBcs,
} from '../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../_framework/util'
import { BcsType, bcs, fromB64 } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== PriorityQueue =============================== */

export function isPriorityQueue(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::priority_queue::PriorityQueue<')
}

export interface PriorityQueueFields<T0 extends TypeArgument> {
  entries: ToField<Vector<Entry<T0>>>
}

export type PriorityQueueReified<T0 extends TypeArgument> = Reified<
  PriorityQueue<T0>,
  PriorityQueueFields<T0>
>

export class PriorityQueue<T0 extends TypeArgument> implements StructClass {
  static readonly $typeName = '0x2::priority_queue::PriorityQueue'
  static readonly $numTypeParams = 1

  readonly $typeName = PriorityQueue.$typeName

  readonly $fullTypeName: `0x2::priority_queue::PriorityQueue<${ToTypeStr<T0>}>`

  readonly $typeArgs: [ToTypeStr<T0>]

  readonly entries: ToField<Vector<Entry<T0>>>

  private constructor(typeArgs: [ToTypeStr<T0>], fields: PriorityQueueFields<T0>) {
    this.$fullTypeName = composeSuiType(
      PriorityQueue.$typeName,
      ...typeArgs
    ) as `0x2::priority_queue::PriorityQueue<${ToTypeStr<T0>}>`
    this.$typeArgs = typeArgs

    this.entries = fields.entries
  }

  static reified<T0 extends Reified<TypeArgument, any>>(
    T0: T0
  ): PriorityQueueReified<ToTypeArgument<T0>> {
    return {
      typeName: PriorityQueue.$typeName,
      fullTypeName: composeSuiType(
        PriorityQueue.$typeName,
        ...[extractType(T0)]
      ) as `0x2::priority_queue::PriorityQueue<${ToTypeStr<ToTypeArgument<T0>>}>`,
      typeArgs: [extractType(T0)] as [ToTypeStr<ToTypeArgument<T0>>],
      reifiedTypeArgs: [T0],
      fromFields: (fields: Record<string, any>) => PriorityQueue.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => PriorityQueue.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => PriorityQueue.fromBcs(T0, data),
      bcs: PriorityQueue.bcs(toBcs(T0)),
      fromJSONField: (field: any) => PriorityQueue.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => PriorityQueue.fromJSON(T0, json),
      fromSuiParsedData: (content: SuiParsedData) => PriorityQueue.fromSuiParsedData(T0, content),
      fetch: async (client: SuiClient, id: string) => PriorityQueue.fetch(client, T0, id),
      new: (fields: PriorityQueueFields<ToTypeArgument<T0>>) => {
        return new PriorityQueue([extractType(T0)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return PriorityQueue.reified
  }

  static phantom<T0 extends Reified<TypeArgument, any>>(
    T0: T0
  ): PhantomReified<ToTypeStr<PriorityQueue<ToTypeArgument<T0>>>> {
    return phantom(PriorityQueue.reified(T0))
  }
  static get p() {
    return PriorityQueue.phantom
  }

  static get bcs() {
    return <T0 extends BcsType<any>>(T0: T0) =>
      bcs.struct(`PriorityQueue<${T0.name}>`, {
        entries: bcs.vector(Entry.bcs(T0)),
      })
  }

  static fromFields<T0 extends Reified<TypeArgument, any>>(
    typeArg: T0,
    fields: Record<string, any>
  ): PriorityQueue<ToTypeArgument<T0>> {
    return PriorityQueue.reified(typeArg).new({
      entries: decodeFromFields(reified.vector(Entry.reified(typeArg)), fields.entries),
    })
  }

  static fromFieldsWithTypes<T0 extends Reified<TypeArgument, any>>(
    typeArg: T0,
    item: FieldsWithTypes
  ): PriorityQueue<ToTypeArgument<T0>> {
    if (!isPriorityQueue(item.type)) {
      throw new Error('not a PriorityQueue type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return PriorityQueue.reified(typeArg).new({
      entries: decodeFromFieldsWithTypes(
        reified.vector(Entry.reified(typeArg)),
        item.fields.entries
      ),
    })
  }

  static fromBcs<T0 extends Reified<TypeArgument, any>>(
    typeArg: T0,
    data: Uint8Array
  ): PriorityQueue<ToTypeArgument<T0>> {
    const typeArgs = [typeArg]

    return PriorityQueue.fromFields(typeArg, PriorityQueue.bcs(toBcs(typeArgs[0])).parse(data))
  }

  toJSONField() {
    return {
      entries: fieldToJSON<Vector<Entry<T0>>>(
        `vector<0x2::priority_queue::Entry<${this.$typeArgs[0]}>>`,
        this.entries
      ),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends Reified<TypeArgument, any>>(
    typeArg: T0,
    field: any
  ): PriorityQueue<ToTypeArgument<T0>> {
    return PriorityQueue.reified(typeArg).new({
      entries: decodeFromJSONField(reified.vector(Entry.reified(typeArg)), field.entries),
    })
  }

  static fromJSON<T0 extends Reified<TypeArgument, any>>(
    typeArg: T0,
    json: Record<string, any>
  ): PriorityQueue<ToTypeArgument<T0>> {
    if (json.$typeName !== PriorityQueue.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(PriorityQueue.$typeName, extractType(typeArg)),
      json.$typeArgs,
      [typeArg]
    )

    return PriorityQueue.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends Reified<TypeArgument, any>>(
    typeArg: T0,
    content: SuiParsedData
  ): PriorityQueue<ToTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isPriorityQueue(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a PriorityQueue object`)
    }
    return PriorityQueue.fromFieldsWithTypes(typeArg, content)
  }

  static async fetch<T0 extends Reified<TypeArgument, any>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<PriorityQueue<ToTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching PriorityQueue object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isPriorityQueue(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a PriorityQueue object`)
    }
    return PriorityQueue.fromBcs(typeArg, fromB64(res.data.bcs.bcsBytes))
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

export type EntryReified<T0 extends TypeArgument> = Reified<Entry<T0>, EntryFields<T0>>

export class Entry<T0 extends TypeArgument> implements StructClass {
  static readonly $typeName = '0x2::priority_queue::Entry'
  static readonly $numTypeParams = 1

  readonly $typeName = Entry.$typeName

  readonly $fullTypeName: `0x2::priority_queue::Entry<${ToTypeStr<T0>}>`

  readonly $typeArgs: [ToTypeStr<T0>]

  readonly priority: ToField<'u64'>
  readonly value: ToField<T0>

  private constructor(typeArgs: [ToTypeStr<T0>], fields: EntryFields<T0>) {
    this.$fullTypeName = composeSuiType(
      Entry.$typeName,
      ...typeArgs
    ) as `0x2::priority_queue::Entry<${ToTypeStr<T0>}>`
    this.$typeArgs = typeArgs

    this.priority = fields.priority
    this.value = fields.value
  }

  static reified<T0 extends Reified<TypeArgument, any>>(T0: T0): EntryReified<ToTypeArgument<T0>> {
    return {
      typeName: Entry.$typeName,
      fullTypeName: composeSuiType(
        Entry.$typeName,
        ...[extractType(T0)]
      ) as `0x2::priority_queue::Entry<${ToTypeStr<ToTypeArgument<T0>>}>`,
      typeArgs: [extractType(T0)] as [ToTypeStr<ToTypeArgument<T0>>],
      reifiedTypeArgs: [T0],
      fromFields: (fields: Record<string, any>) => Entry.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Entry.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => Entry.fromBcs(T0, data),
      bcs: Entry.bcs(toBcs(T0)),
      fromJSONField: (field: any) => Entry.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => Entry.fromJSON(T0, json),
      fromSuiParsedData: (content: SuiParsedData) => Entry.fromSuiParsedData(T0, content),
      fetch: async (client: SuiClient, id: string) => Entry.fetch(client, T0, id),
      new: (fields: EntryFields<ToTypeArgument<T0>>) => {
        return new Entry([extractType(T0)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Entry.reified
  }

  static phantom<T0 extends Reified<TypeArgument, any>>(
    T0: T0
  ): PhantomReified<ToTypeStr<Entry<ToTypeArgument<T0>>>> {
    return phantom(Entry.reified(T0))
  }
  static get p() {
    return Entry.phantom
  }

  static get bcs() {
    return <T0 extends BcsType<any>>(T0: T0) =>
      bcs.struct(`Entry<${T0.name}>`, {
        priority: bcs.u64(),
        value: T0,
      })
  }

  static fromFields<T0 extends Reified<TypeArgument, any>>(
    typeArg: T0,
    fields: Record<string, any>
  ): Entry<ToTypeArgument<T0>> {
    return Entry.reified(typeArg).new({
      priority: decodeFromFields('u64', fields.priority),
      value: decodeFromFields(typeArg, fields.value),
    })
  }

  static fromFieldsWithTypes<T0 extends Reified<TypeArgument, any>>(
    typeArg: T0,
    item: FieldsWithTypes
  ): Entry<ToTypeArgument<T0>> {
    if (!isEntry(item.type)) {
      throw new Error('not a Entry type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Entry.reified(typeArg).new({
      priority: decodeFromFieldsWithTypes('u64', item.fields.priority),
      value: decodeFromFieldsWithTypes(typeArg, item.fields.value),
    })
  }

  static fromBcs<T0 extends Reified<TypeArgument, any>>(
    typeArg: T0,
    data: Uint8Array
  ): Entry<ToTypeArgument<T0>> {
    const typeArgs = [typeArg]

    return Entry.fromFields(typeArg, Entry.bcs(toBcs(typeArgs[0])).parse(data))
  }

  toJSONField() {
    return {
      priority: this.priority.toString(),
      value: fieldToJSON<T0>(this.$typeArgs[0], this.value),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends Reified<TypeArgument, any>>(
    typeArg: T0,
    field: any
  ): Entry<ToTypeArgument<T0>> {
    return Entry.reified(typeArg).new({
      priority: decodeFromJSONField('u64', field.priority),
      value: decodeFromJSONField(typeArg, field.value),
    })
  }

  static fromJSON<T0 extends Reified<TypeArgument, any>>(
    typeArg: T0,
    json: Record<string, any>
  ): Entry<ToTypeArgument<T0>> {
    if (json.$typeName !== Entry.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Entry.$typeName, extractType(typeArg)),
      json.$typeArgs,
      [typeArg]
    )

    return Entry.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends Reified<TypeArgument, any>>(
    typeArg: T0,
    content: SuiParsedData
  ): Entry<ToTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isEntry(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Entry object`)
    }
    return Entry.fromFieldsWithTypes(typeArg, content)
  }

  static async fetch<T0 extends Reified<TypeArgument, any>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<Entry<ToTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching Entry object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isEntry(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a Entry object`)
    }
    return Entry.fromBcs(typeArg, fromB64(res.data.bcs.bcsBytes))
  }
}
