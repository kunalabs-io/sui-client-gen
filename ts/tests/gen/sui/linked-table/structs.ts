/**
 * Similar to `sui::table` but the values are linked together, allowing for ordered insertion and
 * removal
 */

import {
  PhantomReified,
  PhantomToTypeStr,
  PhantomTypeArgument,
  Reified,
  StructClass,
  ToField,
  ToPhantomTypeArgument,
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
} from '../../_framework/reified'
import {
  FieldsWithTypes,
  SupportedSuiClient,
  composeSuiType,
  compressSuiType,
  fetchObjectBcs,
  parseTypeName,
} from '../../_framework/util'
import { Option } from '../../std/option/structs'
import { UID } from '../object/structs'
import { BcsType, bcs } from '@mysten/sui/bcs'
import { SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromBase64 } from '@mysten/sui/utils'

/* ============================== LinkedTable =============================== */

export function isLinkedTable(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::linked_table::LinkedTable` + '<')
}

export interface LinkedTableFields<K extends TypeArgument, V extends PhantomTypeArgument> {
  /** the ID of this table */
  id: ToField<UID>
  /** the number of key-value pairs in the table */
  size: ToField<'u64'>
  /** the front of the table, i.e. the key of the first entry */
  head: ToField<Option<K>>
  /** the back of the table, i.e. the key of the last entry */
  tail: ToField<Option<K>>
}

export type LinkedTableReified<K extends TypeArgument, V extends PhantomTypeArgument> = Reified<
  LinkedTable<K, V>,
  LinkedTableFields<K, V>
>

export class LinkedTable<K extends TypeArgument, V extends PhantomTypeArgument>
  implements StructClass
{
  __StructClass = true as const

  static readonly $typeName = `0x2::linked_table::LinkedTable` as const
  static readonly $numTypeParams = 2
  static readonly $isPhantom = [false, true] as const

  readonly $typeName = LinkedTable.$typeName
  readonly $fullTypeName: `0x2::linked_table::LinkedTable<${ToTypeStr<K>}, ${PhantomToTypeStr<V>}>`
  readonly $typeArgs: [ToTypeStr<K>, PhantomToTypeStr<V>]
  readonly $isPhantom = LinkedTable.$isPhantom

  /** the ID of this table */
  readonly id: ToField<UID>
  /** the number of key-value pairs in the table */
  readonly size: ToField<'u64'>
  /** the front of the table, i.e. the key of the first entry */
  readonly head: ToField<Option<K>>
  /** the back of the table, i.e. the key of the last entry */
  readonly tail: ToField<Option<K>>

  private constructor(
    typeArgs: [ToTypeStr<K>, PhantomToTypeStr<V>],
    fields: LinkedTableFields<K, V>
  ) {
    this.$fullTypeName = composeSuiType(
      LinkedTable.$typeName,
      ...typeArgs
    ) as `0x2::linked_table::LinkedTable<${ToTypeStr<K>}, ${PhantomToTypeStr<V>}>`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.size = fields.size
    this.head = fields.head
    this.tail = fields.tail
  }

  static reified<
    K extends Reified<TypeArgument, any>,
    V extends PhantomReified<PhantomTypeArgument>,
  >(K: K, V: V): LinkedTableReified<ToTypeArgument<K>, ToPhantomTypeArgument<V>> {
    const reifiedBcs = LinkedTable.bcs(toBcs(K))
    return {
      typeName: LinkedTable.$typeName,
      fullTypeName: composeSuiType(
        LinkedTable.$typeName,
        ...[extractType(K), extractType(V)]
      ) as `0x2::linked_table::LinkedTable<${ToTypeStr<ToTypeArgument<K>>}, ${PhantomToTypeStr<ToPhantomTypeArgument<V>>}>`,
      typeArgs: [extractType(K), extractType(V)] as [
        ToTypeStr<ToTypeArgument<K>>,
        PhantomToTypeStr<ToPhantomTypeArgument<V>>,
      ],
      isPhantom: LinkedTable.$isPhantom,
      reifiedTypeArgs: [K, V],
      fromFields: (fields: Record<string, any>) => LinkedTable.fromFields([K, V], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => LinkedTable.fromFieldsWithTypes([K, V], item),
      fromBcs: (data: Uint8Array) => LinkedTable.fromFields([K, V], reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => LinkedTable.fromJSONField([K, V], field),
      fromJSON: (json: Record<string, any>) => LinkedTable.fromJSON([K, V], json),
      fromSuiParsedData: (content: SuiParsedData) => LinkedTable.fromSuiParsedData([K, V], content),
      fromSuiObjectData: (content: SuiObjectData) => LinkedTable.fromSuiObjectData([K, V], content),
      fetch: async (client: SupportedSuiClient, id: string) =>
        LinkedTable.fetch(client, [K, V], id),
      new: (fields: LinkedTableFields<ToTypeArgument<K>, ToPhantomTypeArgument<V>>) => {
        return new LinkedTable([extractType(K), extractType(V)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return LinkedTable.reified
  }

  static phantom<
    K extends Reified<TypeArgument, any>,
    V extends PhantomReified<PhantomTypeArgument>,
  >(
    K: K,
    V: V
  ): PhantomReified<ToTypeStr<LinkedTable<ToTypeArgument<K>, ToPhantomTypeArgument<V>>>> {
    return phantom(LinkedTable.reified(K, V))
  }

  static get p() {
    return LinkedTable.phantom
  }

  private static instantiateBcs() {
    return <K extends BcsType<any>>(K: K) =>
      bcs.struct(`LinkedTable<${K.name}>`, {
        id: UID.bcs,
        size: bcs.u64(),
        head: Option.bcs(K),
        tail: Option.bcs(K),
      })
  }

  private static cachedBcs: ReturnType<typeof LinkedTable.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof LinkedTable.instantiateBcs> {
    if (!LinkedTable.cachedBcs) {
      LinkedTable.cachedBcs = LinkedTable.instantiateBcs()
    }
    return LinkedTable.cachedBcs
  }

  static fromFields<
    K extends Reified<TypeArgument, any>,
    V extends PhantomReified<PhantomTypeArgument>,
  >(
    typeArgs: [K, V],
    fields: Record<string, any>
  ): LinkedTable<ToTypeArgument<K>, ToPhantomTypeArgument<V>> {
    return LinkedTable.reified(typeArgs[0], typeArgs[1]).new({
      id: decodeFromFields(UID.reified(), fields.id),
      size: decodeFromFields('u64', fields.size),
      head: decodeFromFields(Option.reified(typeArgs[0]), fields.head),
      tail: decodeFromFields(Option.reified(typeArgs[0]), fields.tail),
    })
  }

  static fromFieldsWithTypes<
    K extends Reified<TypeArgument, any>,
    V extends PhantomReified<PhantomTypeArgument>,
  >(
    typeArgs: [K, V],
    item: FieldsWithTypes
  ): LinkedTable<ToTypeArgument<K>, ToPhantomTypeArgument<V>> {
    if (!isLinkedTable(item.type)) {
      throw new Error('not a LinkedTable type')
    }
    assertFieldsWithTypesArgsMatch(item, typeArgs)

    return LinkedTable.reified(typeArgs[0], typeArgs[1]).new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      size: decodeFromFieldsWithTypes('u64', item.fields.size),
      head: decodeFromFieldsWithTypes(Option.reified(typeArgs[0]), item.fields.head),
      tail: decodeFromFieldsWithTypes(Option.reified(typeArgs[0]), item.fields.tail),
    })
  }

  static fromBcs<
    K extends Reified<TypeArgument, any>,
    V extends PhantomReified<PhantomTypeArgument>,
  >(typeArgs: [K, V], data: Uint8Array): LinkedTable<ToTypeArgument<K>, ToPhantomTypeArgument<V>> {
    return LinkedTable.fromFields(typeArgs, LinkedTable.bcs(toBcs(typeArgs[0])).parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
      size: this.size.toString(),
      head: fieldToJSON<Option<K>>(`${Option.$typeName}<${this.$typeArgs[0]}>`, this.head),
      tail: fieldToJSON<Option<K>>(`${Option.$typeName}<${this.$typeArgs[0]}>`, this.tail),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<
    K extends Reified<TypeArgument, any>,
    V extends PhantomReified<PhantomTypeArgument>,
  >(typeArgs: [K, V], field: any): LinkedTable<ToTypeArgument<K>, ToPhantomTypeArgument<V>> {
    return LinkedTable.reified(typeArgs[0], typeArgs[1]).new({
      id: decodeFromJSONField(UID.reified(), field.id),
      size: decodeFromJSONField('u64', field.size),
      head: decodeFromJSONField(Option.reified(typeArgs[0]), field.head),
      tail: decodeFromJSONField(Option.reified(typeArgs[0]), field.tail),
    })
  }

  static fromJSON<
    K extends Reified<TypeArgument, any>,
    V extends PhantomReified<PhantomTypeArgument>,
  >(
    typeArgs: [K, V],
    json: Record<string, any>
  ): LinkedTable<ToTypeArgument<K>, ToPhantomTypeArgument<V>> {
    if (json.$typeName !== LinkedTable.$typeName) {
      throw new Error(
        `not a LinkedTable json object: expected '${LinkedTable.$typeName}' but got '${json.$typeName}'`
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(LinkedTable.$typeName, ...typeArgs.map(extractType)),
      json.$typeArgs,
      typeArgs
    )

    return LinkedTable.fromJSONField(typeArgs, json)
  }

  static fromSuiParsedData<
    K extends Reified<TypeArgument, any>,
    V extends PhantomReified<PhantomTypeArgument>,
  >(
    typeArgs: [K, V],
    content: SuiParsedData
  ): LinkedTable<ToTypeArgument<K>, ToPhantomTypeArgument<V>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isLinkedTable(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a LinkedTable object`)
    }
    return LinkedTable.fromFieldsWithTypes(typeArgs, content)
  }

  static fromSuiObjectData<
    K extends Reified<TypeArgument, any>,
    V extends PhantomReified<PhantomTypeArgument>,
  >(
    typeArgs: [K, V],
    data: SuiObjectData
  ): LinkedTable<ToTypeArgument<K>, ToPhantomTypeArgument<V>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isLinkedTable(data.bcs.type)) {
        throw new Error(`object at is not a LinkedTable object`)
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs
      if (gotTypeArgs.length !== 2) {
        throw new Error(
          `type argument mismatch: expected 2 type arguments but got '${gotTypeArgs.length}'`
        )
      }
      for (let i = 0; i < 2; i++) {
        const gotTypeArg = compressSuiType(gotTypeArgs[i])
        const expectedTypeArg = compressSuiType(extractType(typeArgs[i]))
        if (gotTypeArg !== expectedTypeArg) {
          throw new Error(
            `type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`
          )
        }
      }

      return LinkedTable.fromBcs(typeArgs, fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return LinkedTable.fromSuiParsedData(typeArgs, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<
    K extends Reified<TypeArgument, any>,
    V extends PhantomReified<PhantomTypeArgument>,
  >(
    client: SupportedSuiClient,
    typeArgs: [K, V],
    id: string
  ): Promise<LinkedTable<ToTypeArgument<K>, ToPhantomTypeArgument<V>>> {
    const res = await fetchObjectBcs(client, id)
    if (!isLinkedTable(res.type)) {
      throw new Error(`object at id ${id} is not a LinkedTable object`)
    }

    return LinkedTable.fromBcs(typeArgs, res.bcsBytes)
  }
}

/* ============================== Node =============================== */

export function isNode(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::linked_table::Node` + '<')
}

export interface NodeFields<K extends TypeArgument, V extends TypeArgument> {
  /** the previous key */
  prev: ToField<Option<K>>
  /** the next key */
  next: ToField<Option<K>>
  /** the value being stored */
  value: ToField<V>
}

export type NodeReified<K extends TypeArgument, V extends TypeArgument> = Reified<
  Node<K, V>,
  NodeFields<K, V>
>

export class Node<K extends TypeArgument, V extends TypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::linked_table::Node` as const
  static readonly $numTypeParams = 2
  static readonly $isPhantom = [false, false] as const

  readonly $typeName = Node.$typeName
  readonly $fullTypeName: `0x2::linked_table::Node<${ToTypeStr<K>}, ${ToTypeStr<V>}>`
  readonly $typeArgs: [ToTypeStr<K>, ToTypeStr<V>]
  readonly $isPhantom = Node.$isPhantom

  /** the previous key */
  readonly prev: ToField<Option<K>>
  /** the next key */
  readonly next: ToField<Option<K>>
  /** the value being stored */
  readonly value: ToField<V>

  private constructor(typeArgs: [ToTypeStr<K>, ToTypeStr<V>], fields: NodeFields<K, V>) {
    this.$fullTypeName = composeSuiType(
      Node.$typeName,
      ...typeArgs
    ) as `0x2::linked_table::Node<${ToTypeStr<K>}, ${ToTypeStr<V>}>`
    this.$typeArgs = typeArgs

    this.prev = fields.prev
    this.next = fields.next
    this.value = fields.value
  }

  static reified<K extends Reified<TypeArgument, any>, V extends Reified<TypeArgument, any>>(
    K: K,
    V: V
  ): NodeReified<ToTypeArgument<K>, ToTypeArgument<V>> {
    const reifiedBcs = Node.bcs(toBcs(K), toBcs(V))
    return {
      typeName: Node.$typeName,
      fullTypeName: composeSuiType(
        Node.$typeName,
        ...[extractType(K), extractType(V)]
      ) as `0x2::linked_table::Node<${ToTypeStr<ToTypeArgument<K>>}, ${ToTypeStr<ToTypeArgument<V>>}>`,
      typeArgs: [extractType(K), extractType(V)] as [
        ToTypeStr<ToTypeArgument<K>>,
        ToTypeStr<ToTypeArgument<V>>,
      ],
      isPhantom: Node.$isPhantom,
      reifiedTypeArgs: [K, V],
      fromFields: (fields: Record<string, any>) => Node.fromFields([K, V], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Node.fromFieldsWithTypes([K, V], item),
      fromBcs: (data: Uint8Array) => Node.fromFields([K, V], reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => Node.fromJSONField([K, V], field),
      fromJSON: (json: Record<string, any>) => Node.fromJSON([K, V], json),
      fromSuiParsedData: (content: SuiParsedData) => Node.fromSuiParsedData([K, V], content),
      fromSuiObjectData: (content: SuiObjectData) => Node.fromSuiObjectData([K, V], content),
      fetch: async (client: SupportedSuiClient, id: string) => Node.fetch(client, [K, V], id),
      new: (fields: NodeFields<ToTypeArgument<K>, ToTypeArgument<V>>) => {
        return new Node([extractType(K), extractType(V)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Node.reified
  }

  static phantom<K extends Reified<TypeArgument, any>, V extends Reified<TypeArgument, any>>(
    K: K,
    V: V
  ): PhantomReified<ToTypeStr<Node<ToTypeArgument<K>, ToTypeArgument<V>>>> {
    return phantom(Node.reified(K, V))
  }

  static get p() {
    return Node.phantom
  }

  private static instantiateBcs() {
    return <K extends BcsType<any>, V extends BcsType<any>>(K: K, V: V) =>
      bcs.struct(`Node<${K.name}, ${V.name}>`, {
        prev: Option.bcs(K),
        next: Option.bcs(K),
        value: V,
      })
  }

  private static cachedBcs: ReturnType<typeof Node.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof Node.instantiateBcs> {
    if (!Node.cachedBcs) {
      Node.cachedBcs = Node.instantiateBcs()
    }
    return Node.cachedBcs
  }

  static fromFields<K extends Reified<TypeArgument, any>, V extends Reified<TypeArgument, any>>(
    typeArgs: [K, V],
    fields: Record<string, any>
  ): Node<ToTypeArgument<K>, ToTypeArgument<V>> {
    return Node.reified(typeArgs[0], typeArgs[1]).new({
      prev: decodeFromFields(Option.reified(typeArgs[0]), fields.prev),
      next: decodeFromFields(Option.reified(typeArgs[0]), fields.next),
      value: decodeFromFields(typeArgs[1], fields.value),
    })
  }

  static fromFieldsWithTypes<
    K extends Reified<TypeArgument, any>,
    V extends Reified<TypeArgument, any>,
  >(typeArgs: [K, V], item: FieldsWithTypes): Node<ToTypeArgument<K>, ToTypeArgument<V>> {
    if (!isNode(item.type)) {
      throw new Error('not a Node type')
    }
    assertFieldsWithTypesArgsMatch(item, typeArgs)

    return Node.reified(typeArgs[0], typeArgs[1]).new({
      prev: decodeFromFieldsWithTypes(Option.reified(typeArgs[0]), item.fields.prev),
      next: decodeFromFieldsWithTypes(Option.reified(typeArgs[0]), item.fields.next),
      value: decodeFromFieldsWithTypes(typeArgs[1], item.fields.value),
    })
  }

  static fromBcs<K extends Reified<TypeArgument, any>, V extends Reified<TypeArgument, any>>(
    typeArgs: [K, V],
    data: Uint8Array
  ): Node<ToTypeArgument<K>, ToTypeArgument<V>> {
    return Node.fromFields(typeArgs, Node.bcs(toBcs(typeArgs[0]), toBcs(typeArgs[1])).parse(data))
  }

  toJSONField() {
    return {
      prev: fieldToJSON<Option<K>>(`${Option.$typeName}<${this.$typeArgs[0]}>`, this.prev),
      next: fieldToJSON<Option<K>>(`${Option.$typeName}<${this.$typeArgs[0]}>`, this.next),
      value: fieldToJSON<V>(`${this.$typeArgs[1]}`, this.value),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<K extends Reified<TypeArgument, any>, V extends Reified<TypeArgument, any>>(
    typeArgs: [K, V],
    field: any
  ): Node<ToTypeArgument<K>, ToTypeArgument<V>> {
    return Node.reified(typeArgs[0], typeArgs[1]).new({
      prev: decodeFromJSONField(Option.reified(typeArgs[0]), field.prev),
      next: decodeFromJSONField(Option.reified(typeArgs[0]), field.next),
      value: decodeFromJSONField(typeArgs[1], field.value),
    })
  }

  static fromJSON<K extends Reified<TypeArgument, any>, V extends Reified<TypeArgument, any>>(
    typeArgs: [K, V],
    json: Record<string, any>
  ): Node<ToTypeArgument<K>, ToTypeArgument<V>> {
    if (json.$typeName !== Node.$typeName) {
      throw new Error(
        `not a Node json object: expected '${Node.$typeName}' but got '${json.$typeName}'`
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Node.$typeName, ...typeArgs.map(extractType)),
      json.$typeArgs,
      typeArgs
    )

    return Node.fromJSONField(typeArgs, json)
  }

  static fromSuiParsedData<
    K extends Reified<TypeArgument, any>,
    V extends Reified<TypeArgument, any>,
  >(typeArgs: [K, V], content: SuiParsedData): Node<ToTypeArgument<K>, ToTypeArgument<V>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isNode(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Node object`)
    }
    return Node.fromFieldsWithTypes(typeArgs, content)
  }

  static fromSuiObjectData<
    K extends Reified<TypeArgument, any>,
    V extends Reified<TypeArgument, any>,
  >(typeArgs: [K, V], data: SuiObjectData): Node<ToTypeArgument<K>, ToTypeArgument<V>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isNode(data.bcs.type)) {
        throw new Error(`object at is not a Node object`)
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs
      if (gotTypeArgs.length !== 2) {
        throw new Error(
          `type argument mismatch: expected 2 type arguments but got '${gotTypeArgs.length}'`
        )
      }
      for (let i = 0; i < 2; i++) {
        const gotTypeArg = compressSuiType(gotTypeArgs[i])
        const expectedTypeArg = compressSuiType(extractType(typeArgs[i]))
        if (gotTypeArg !== expectedTypeArg) {
          throw new Error(
            `type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`
          )
        }
      }

      return Node.fromBcs(typeArgs, fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Node.fromSuiParsedData(typeArgs, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<K extends Reified<TypeArgument, any>, V extends Reified<TypeArgument, any>>(
    client: SupportedSuiClient,
    typeArgs: [K, V],
    id: string
  ): Promise<Node<ToTypeArgument<K>, ToTypeArgument<V>>> {
    const res = await fetchObjectBcs(client, id)
    if (!isNode(res.type)) {
      throw new Error(`object at id ${id} is not a Node object`)
    }

    return Node.fromBcs(typeArgs, res.bcsBytes)
  }
}
