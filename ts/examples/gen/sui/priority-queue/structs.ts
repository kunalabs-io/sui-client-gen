import {
  PhantomReified,
  Reified,
  StructClass,
  ToField,
  ToTypeArgument,
  ToTypeStr,
  TypeArgument,
  assertFieldsWithTypesArgsMatch,
  assertReifiedTypeArgsMatch,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  extractType,
  fieldToJSON,
  phantom,
  toBcs,
  vector,
} from '../../_framework/reified'
import {
  FieldsWithTypes,
  composeSuiType,
  compressSuiType,
  parseTypeName,
} from '../../_framework/util'
import { Vector } from '../../_framework/vector'
import { BcsType, bcs } from '@mysten/sui/bcs'
import { SuiClient, SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromBase64 } from '@mysten/sui/utils'

/* ============================== PriorityQueue =============================== */

export function isPriorityQueue(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::priority_queue::PriorityQueue` + '<')
}

export interface PriorityQueueFields<T extends TypeArgument> {
  entries: ToField<Vector<Entry<T>>>
}

export type PriorityQueueReified<T extends TypeArgument> = Reified<
  PriorityQueue<T>,
  PriorityQueueFields<T>
>

export class PriorityQueue<T extends TypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::priority_queue::PriorityQueue`
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [false] as const

  readonly $typeName = PriorityQueue.$typeName
  readonly $fullTypeName: `0x2::priority_queue::PriorityQueue<${ToTypeStr<T>}>`
  readonly $typeArgs: [ToTypeStr<T>]
  readonly $isPhantom = PriorityQueue.$isPhantom

  readonly entries: ToField<Vector<Entry<T>>>

  private constructor(typeArgs: [ToTypeStr<T>], fields: PriorityQueueFields<T>) {
    this.$fullTypeName = composeSuiType(
      PriorityQueue.$typeName,
      ...typeArgs
    ) as `0x2::priority_queue::PriorityQueue<${ToTypeStr<T>}>`
    this.$typeArgs = typeArgs

    this.entries = fields.entries
  }

  static reified<T extends Reified<TypeArgument, any>>(
    T: T
  ): PriorityQueueReified<ToTypeArgument<T>> {
    const reifiedBcs = PriorityQueue.bcs(toBcs(T))
    return {
      typeName: PriorityQueue.$typeName,
      fullTypeName: composeSuiType(
        PriorityQueue.$typeName,
        ...[extractType(T)]
      ) as `0x2::priority_queue::PriorityQueue<${ToTypeStr<ToTypeArgument<T>>}>`,
      typeArgs: [extractType(T)] as [ToTypeStr<ToTypeArgument<T>>],
      isPhantom: PriorityQueue.$isPhantom,
      reifiedTypeArgs: [T],
      fromFields: (fields: Record<string, any>) => PriorityQueue.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => PriorityQueue.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => PriorityQueue.fromFields(T, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => PriorityQueue.fromJSONField(T, field),
      fromJSON: (json: Record<string, any>) => PriorityQueue.fromJSON(T, json),
      fromSuiParsedData: (content: SuiParsedData) => PriorityQueue.fromSuiParsedData(T, content),
      fromSuiObjectData: (content: SuiObjectData) => PriorityQueue.fromSuiObjectData(T, content),
      fetch: async (client: SuiClient, id: string) => PriorityQueue.fetch(client, T, id),
      new: (fields: PriorityQueueFields<ToTypeArgument<T>>) => {
        return new PriorityQueue([extractType(T)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return PriorityQueue.reified
  }

  static phantom<T extends Reified<TypeArgument, any>>(
    T: T
  ): PhantomReified<ToTypeStr<PriorityQueue<ToTypeArgument<T>>>> {
    return phantom(PriorityQueue.reified(T))
  }

  static get p() {
    return PriorityQueue.phantom
  }

  private static instantiateBcs() {
    return <T extends BcsType<any>>(T: T) =>
      bcs.struct(`PriorityQueue<${T.name}>`, {
        entries: bcs.vector(Entry.bcs(T)),
      })
  }

  private static cachedBcs: ReturnType<typeof PriorityQueue.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof PriorityQueue.instantiateBcs> {
    if (!PriorityQueue.cachedBcs) {
      PriorityQueue.cachedBcs = PriorityQueue.instantiateBcs()
    }
    return PriorityQueue.cachedBcs
  }

  static fromFields<T extends Reified<TypeArgument, any>>(
    typeArg: T,
    fields: Record<string, any>
  ): PriorityQueue<ToTypeArgument<T>> {
    return PriorityQueue.reified(typeArg).new({
      entries: decodeFromFields(vector(Entry.reified(typeArg)), fields.entries),
    })
  }

  static fromFieldsWithTypes<T extends Reified<TypeArgument, any>>(
    typeArg: T,
    item: FieldsWithTypes
  ): PriorityQueue<ToTypeArgument<T>> {
    if (!isPriorityQueue(item.type)) {
      throw new Error('not a PriorityQueue type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return PriorityQueue.reified(typeArg).new({
      entries: decodeFromFieldsWithTypes(vector(Entry.reified(typeArg)), item.fields.entries),
    })
  }

  static fromBcs<T extends Reified<TypeArgument, any>>(
    typeArg: T,
    data: Uint8Array
  ): PriorityQueue<ToTypeArgument<T>> {
    const typeArgs = [typeArg]
    return PriorityQueue.fromFields(typeArg, PriorityQueue.bcs(toBcs(typeArg)).parse(data))
  }

  toJSONField() {
    return {
      entries: fieldToJSON<Vector<Entry<T>>>(
        `vector<${Entry.$typeName}<${this.$typeArgs[0]}>>`,
        this.entries
      ),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T extends Reified<TypeArgument, any>>(
    typeArg: T,
    field: any
  ): PriorityQueue<ToTypeArgument<T>> {
    return PriorityQueue.reified(typeArg).new({
      entries: decodeFromJSONField(vector(Entry.reified(typeArg)), field.entries),
    })
  }

  static fromJSON<T extends Reified<TypeArgument, any>>(
    typeArg: T,
    json: Record<string, any>
  ): PriorityQueue<ToTypeArgument<T>> {
    if (json.$typeName !== PriorityQueue.$typeName) {
      throw new Error(
        `not a PriorityQueue json object: expected '${PriorityQueue.$typeName}' but got '${json.$typeName}'`
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(PriorityQueue.$typeName, ...[extractType(typeArg)]),
      json.$typeArgs,
      [typeArg]
    )

    return PriorityQueue.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T extends Reified<TypeArgument, any>>(
    typeArg: T,
    content: SuiParsedData
  ): PriorityQueue<ToTypeArgument<T>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isPriorityQueue(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a PriorityQueue object`)
    }
    return PriorityQueue.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T extends Reified<TypeArgument, any>>(
    typeArg: T,
    data: SuiObjectData
  ): PriorityQueue<ToTypeArgument<T>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isPriorityQueue(data.bcs.type)) {
        throw new Error(`object at is not a PriorityQueue object`)
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs
      if (gotTypeArgs.length !== 1) {
        throw new Error(
          `type argument mismatch: expected 1 type arguments but got '${gotTypeArgs.length}'`
        )
      }
      for (let i = 0; i < 1; i++) {
        const gotTypeArg = compressSuiType(gotTypeArgs[i])
        const expectedTypeArg = compressSuiType(extractType([typeArg][i]))
        if (gotTypeArg !== expectedTypeArg) {
          throw new Error(
            `type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`
          )
        }
      }

      return PriorityQueue.fromBcs(typeArg, fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return PriorityQueue.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<T extends Reified<TypeArgument, any>>(
    client: SuiClient,
    typeArg: T,
    id: string
  ): Promise<PriorityQueue<ToTypeArgument<T>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching PriorityQueue object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isPriorityQueue(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a PriorityQueue object`)
    }

    return PriorityQueue.fromSuiObjectData(typeArg, res.data)
  }
}

/* ============================== Entry =============================== */

export function isEntry(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::priority_queue::Entry` + '<')
}

export interface EntryFields<T extends TypeArgument> {
  priority: ToField<'u64'>
  value: ToField<T>
}

export type EntryReified<T extends TypeArgument> = Reified<Entry<T>, EntryFields<T>>

export class Entry<T extends TypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::priority_queue::Entry`
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [false] as const

  readonly $typeName = Entry.$typeName
  readonly $fullTypeName: `0x2::priority_queue::Entry<${ToTypeStr<T>}>`
  readonly $typeArgs: [ToTypeStr<T>]
  readonly $isPhantom = Entry.$isPhantom

  readonly priority: ToField<'u64'>
  readonly value: ToField<T>

  private constructor(typeArgs: [ToTypeStr<T>], fields: EntryFields<T>) {
    this.$fullTypeName = composeSuiType(
      Entry.$typeName,
      ...typeArgs
    ) as `0x2::priority_queue::Entry<${ToTypeStr<T>}>`
    this.$typeArgs = typeArgs

    this.priority = fields.priority
    this.value = fields.value
  }

  static reified<T extends Reified<TypeArgument, any>>(T: T): EntryReified<ToTypeArgument<T>> {
    const reifiedBcs = Entry.bcs(toBcs(T))
    return {
      typeName: Entry.$typeName,
      fullTypeName: composeSuiType(
        Entry.$typeName,
        ...[extractType(T)]
      ) as `0x2::priority_queue::Entry<${ToTypeStr<ToTypeArgument<T>>}>`,
      typeArgs: [extractType(T)] as [ToTypeStr<ToTypeArgument<T>>],
      isPhantom: Entry.$isPhantom,
      reifiedTypeArgs: [T],
      fromFields: (fields: Record<string, any>) => Entry.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Entry.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => Entry.fromFields(T, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => Entry.fromJSONField(T, field),
      fromJSON: (json: Record<string, any>) => Entry.fromJSON(T, json),
      fromSuiParsedData: (content: SuiParsedData) => Entry.fromSuiParsedData(T, content),
      fromSuiObjectData: (content: SuiObjectData) => Entry.fromSuiObjectData(T, content),
      fetch: async (client: SuiClient, id: string) => Entry.fetch(client, T, id),
      new: (fields: EntryFields<ToTypeArgument<T>>) => {
        return new Entry([extractType(T)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Entry.reified
  }

  static phantom<T extends Reified<TypeArgument, any>>(
    T: T
  ): PhantomReified<ToTypeStr<Entry<ToTypeArgument<T>>>> {
    return phantom(Entry.reified(T))
  }

  static get p() {
    return Entry.phantom
  }

  private static instantiateBcs() {
    return <T extends BcsType<any>>(T: T) =>
      bcs.struct(`Entry<${T.name}>`, {
        priority: bcs.u64(),
        value: T,
      })
  }

  private static cachedBcs: ReturnType<typeof Entry.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof Entry.instantiateBcs> {
    if (!Entry.cachedBcs) {
      Entry.cachedBcs = Entry.instantiateBcs()
    }
    return Entry.cachedBcs
  }

  static fromFields<T extends Reified<TypeArgument, any>>(
    typeArg: T,
    fields: Record<string, any>
  ): Entry<ToTypeArgument<T>> {
    return Entry.reified(typeArg).new({
      priority: decodeFromFields('u64', fields.priority),
      value: decodeFromFields(typeArg, fields.value),
    })
  }

  static fromFieldsWithTypes<T extends Reified<TypeArgument, any>>(
    typeArg: T,
    item: FieldsWithTypes
  ): Entry<ToTypeArgument<T>> {
    if (!isEntry(item.type)) {
      throw new Error('not a Entry type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Entry.reified(typeArg).new({
      priority: decodeFromFieldsWithTypes('u64', item.fields.priority),
      value: decodeFromFieldsWithTypes(typeArg, item.fields.value),
    })
  }

  static fromBcs<T extends Reified<TypeArgument, any>>(
    typeArg: T,
    data: Uint8Array
  ): Entry<ToTypeArgument<T>> {
    const typeArgs = [typeArg]
    return Entry.fromFields(typeArg, Entry.bcs(toBcs(typeArg)).parse(data))
  }

  toJSONField() {
    return {
      priority: this.priority.toString(),
      value: fieldToJSON<T>(`${this.$typeArgs[0]}`, this.value),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T extends Reified<TypeArgument, any>>(
    typeArg: T,
    field: any
  ): Entry<ToTypeArgument<T>> {
    return Entry.reified(typeArg).new({
      priority: decodeFromJSONField('u64', field.priority),
      value: decodeFromJSONField(typeArg, field.value),
    })
  }

  static fromJSON<T extends Reified<TypeArgument, any>>(
    typeArg: T,
    json: Record<string, any>
  ): Entry<ToTypeArgument<T>> {
    if (json.$typeName !== Entry.$typeName) {
      throw new Error(
        `not a Entry json object: expected '${Entry.$typeName}' but got '${json.$typeName}'`
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Entry.$typeName, ...[extractType(typeArg)]),
      json.$typeArgs,
      [typeArg]
    )

    return Entry.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T extends Reified<TypeArgument, any>>(
    typeArg: T,
    content: SuiParsedData
  ): Entry<ToTypeArgument<T>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isEntry(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Entry object`)
    }
    return Entry.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T extends Reified<TypeArgument, any>>(
    typeArg: T,
    data: SuiObjectData
  ): Entry<ToTypeArgument<T>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isEntry(data.bcs.type)) {
        throw new Error(`object at is not a Entry object`)
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs
      if (gotTypeArgs.length !== 1) {
        throw new Error(
          `type argument mismatch: expected 1 type arguments but got '${gotTypeArgs.length}'`
        )
      }
      for (let i = 0; i < 1; i++) {
        const gotTypeArg = compressSuiType(gotTypeArgs[i])
        const expectedTypeArg = compressSuiType(extractType([typeArg][i]))
        if (gotTypeArg !== expectedTypeArg) {
          throw new Error(
            `type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`
          )
        }
      }

      return Entry.fromBcs(typeArg, fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Entry.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<T extends Reified<TypeArgument, any>>(
    client: SuiClient,
    typeArg: T,
    id: string
  ): Promise<Entry<ToTypeArgument<T>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching Entry object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isEntry(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a Entry object`)
    }

    return Entry.fromSuiObjectData(typeArg, res.data)
  }
}
