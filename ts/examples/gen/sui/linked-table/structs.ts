import { Option } from '../../_dependencies/source/0x1/option/structs'
import {
  PhantomTypeArgument,
  Reified,
  ReifiedPhantomTypeArgument,
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
  toBcs,
} from '../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../_framework/util'
import { UID } from '../object/structs'
import { BcsType, bcs } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== LinkedTable =============================== */

export function isLinkedTable(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::linked_table::LinkedTable<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface LinkedTableFields<K extends TypeArgument, V extends PhantomTypeArgument> {
  id: ToField<UID>
  size: ToField<'u64'>
  head: ToField<Option<K>>
  tail: ToField<Option<K>>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class LinkedTable<K extends TypeArgument, V extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::linked_table::LinkedTable'
  static readonly $numTypeParams = 2

  readonly $fullTypeName =
    null as unknown as `0x2::linked_table::LinkedTable<${ToTypeStr<K>}, ${ToTypeStr<V>}>`

  readonly $typeName = LinkedTable.$typeName

  static get bcs() {
    return <K extends BcsType<any>>(K: K) =>
      bcs.struct(`LinkedTable<${K.name}>`, {
        id: UID.bcs,
        size: bcs.u64(),
        head: Option.bcs(K),
        tail: Option.bcs(K),
      })
  }

  readonly $typeArgs: [string, string]

  readonly id: ToField<UID>
  readonly size: ToField<'u64'>
  readonly head: ToField<Option<K>>
  readonly tail: ToField<Option<K>>

  private constructor(typeArgs: [string, string], fields: LinkedTableFields<K, V>) {
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.size = fields.size
    this.head = fields.head
    this.tail = fields.tail
  }

  static new<K extends Reified<TypeArgument>, V extends ReifiedPhantomTypeArgument>(
    typeArgs: [K, V],
    fields: LinkedTableFields<ToTypeArgument<K>, ToPhantomTypeArgument<V>>
  ): LinkedTable<ToTypeArgument<K>, ToPhantomTypeArgument<V>> {
    return new LinkedTable(typeArgs.map(extractType) as [string, string], fields)
  }

  static reified<K extends Reified<TypeArgument>, V extends ReifiedPhantomTypeArgument>(
    K: K,
    V: V
  ): Reified<LinkedTable<ToTypeArgument<K>, ToPhantomTypeArgument<V>>> {
    return {
      typeName: LinkedTable.$typeName,
      fullTypeName: composeSuiType(
        LinkedTable.$typeName,
        ...[extractType(K), extractType(V)]
      ) as `0x2::linked_table::LinkedTable<${ToTypeStr<ToTypeArgument<K>>}, ${ToTypeStr<
        ToPhantomTypeArgument<V>
      >}>`,
      typeArgs: [K, V],
      fromFields: (fields: Record<string, any>) => LinkedTable.fromFields([K, V], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => LinkedTable.fromFieldsWithTypes([K, V], item),
      fromBcs: (data: Uint8Array) => LinkedTable.fromBcs([K, V], data),
      bcs: LinkedTable.bcs(toBcs(K)),
      fromJSONField: (field: any) => LinkedTable.fromJSONField([K, V], field),
      fetch: async (client: SuiClient, id: string) => LinkedTable.fetch(client, [K, V], id),
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return LinkedTable.reified
  }

  static fromFields<K extends Reified<TypeArgument>, V extends ReifiedPhantomTypeArgument>(
    typeArgs: [K, V],
    fields: Record<string, any>
  ): LinkedTable<ToTypeArgument<K>, ToPhantomTypeArgument<V>> {
    return LinkedTable.new(typeArgs, {
      id: decodeFromFields(UID.reified(), fields.id),
      size: decodeFromFields('u64', fields.size),
      head: decodeFromFields(Option.reified(typeArgs[0]), fields.head),
      tail: decodeFromFields(Option.reified(typeArgs[0]), fields.tail),
    })
  }

  static fromFieldsWithTypes<K extends Reified<TypeArgument>, V extends ReifiedPhantomTypeArgument>(
    typeArgs: [K, V],
    item: FieldsWithTypes
  ): LinkedTable<ToTypeArgument<K>, ToPhantomTypeArgument<V>> {
    if (!isLinkedTable(item.type)) {
      throw new Error('not a LinkedTable type')
    }
    assertFieldsWithTypesArgsMatch(item, typeArgs)

    return LinkedTable.new(typeArgs, {
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      size: decodeFromFieldsWithTypes('u64', item.fields.size),
      head: decodeFromFieldsWithTypes(Option.reified(typeArgs[0]), item.fields.head),
      tail: decodeFromFieldsWithTypes(Option.reified(typeArgs[0]), item.fields.tail),
    })
  }

  static fromBcs<K extends Reified<TypeArgument>, V extends ReifiedPhantomTypeArgument>(
    typeArgs: [K, V],
    data: Uint8Array
  ): LinkedTable<ToTypeArgument<K>, ToPhantomTypeArgument<V>> {
    return LinkedTable.fromFields(typeArgs, LinkedTable.bcs(toBcs(typeArgs[0])).parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
      size: this.size.toString(),
      head: fieldToJSON<Option<K>>(`0x1::option::Option<${this.$typeArgs[0]}>`, this.head),
      tail: fieldToJSON<Option<K>>(`0x1::option::Option<${this.$typeArgs[0]}>`, this.tail),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<K extends Reified<TypeArgument>, V extends ReifiedPhantomTypeArgument>(
    typeArgs: [K, V],
    field: any
  ): LinkedTable<ToTypeArgument<K>, ToPhantomTypeArgument<V>> {
    return LinkedTable.new(typeArgs, {
      id: decodeFromJSONField(UID.reified(), field.id),
      size: decodeFromJSONField('u64', field.size),
      head: decodeFromJSONField(Option.reified(typeArgs[0]), field.head),
      tail: decodeFromJSONField(Option.reified(typeArgs[0]), field.tail),
    })
  }

  static fromJSON<K extends Reified<TypeArgument>, V extends ReifiedPhantomTypeArgument>(
    typeArgs: [K, V],
    json: Record<string, any>
  ): LinkedTable<ToTypeArgument<K>, ToPhantomTypeArgument<V>> {
    if (json.$typeName !== LinkedTable.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(LinkedTable.$typeName, ...typeArgs.map(extractType)),
      json.$typeArgs,
      typeArgs
    )

    return LinkedTable.fromJSONField(typeArgs, json)
  }

  static fromSuiParsedData<K extends Reified<TypeArgument>, V extends ReifiedPhantomTypeArgument>(
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

  static async fetch<K extends Reified<TypeArgument>, V extends ReifiedPhantomTypeArgument>(
    client: SuiClient,
    typeArgs: [K, V],
    id: string
  ): Promise<LinkedTable<ToTypeArgument<K>, ToPhantomTypeArgument<V>>> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching LinkedTable object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isLinkedTable(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a LinkedTable object`)
    }
    return LinkedTable.fromFieldsWithTypes(typeArgs, res.data.content)
  }
}

/* ============================== Node =============================== */

export function isNode(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::linked_table::Node<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface NodeFields<K extends TypeArgument, V extends TypeArgument> {
  prev: ToField<Option<K>>
  next: ToField<Option<K>>
  value: ToField<V>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Node<K extends TypeArgument, V extends TypeArgument> {
  static readonly $typeName = '0x2::linked_table::Node'
  static readonly $numTypeParams = 2

  readonly $fullTypeName =
    null as unknown as `0x2::linked_table::Node<${ToTypeStr<K>}, ${ToTypeStr<V>}>`

  readonly $typeName = Node.$typeName

  static get bcs() {
    return <K extends BcsType<any>, V extends BcsType<any>>(K: K, V: V) =>
      bcs.struct(`Node<${K.name}, ${V.name}>`, {
        prev: Option.bcs(K),
        next: Option.bcs(K),
        value: V,
      })
  }

  readonly $typeArgs: [string, string]

  readonly prev: ToField<Option<K>>
  readonly next: ToField<Option<K>>
  readonly value: ToField<V>

  private constructor(typeArgs: [string, string], fields: NodeFields<K, V>) {
    this.$typeArgs = typeArgs

    this.prev = fields.prev
    this.next = fields.next
    this.value = fields.value
  }

  static new<K extends Reified<TypeArgument>, V extends Reified<TypeArgument>>(
    typeArgs: [K, V],
    fields: NodeFields<ToTypeArgument<K>, ToTypeArgument<V>>
  ): Node<ToTypeArgument<K>, ToTypeArgument<V>> {
    return new Node(typeArgs.map(extractType) as [string, string], fields)
  }

  static reified<K extends Reified<TypeArgument>, V extends Reified<TypeArgument>>(
    K: K,
    V: V
  ): Reified<Node<ToTypeArgument<K>, ToTypeArgument<V>>> {
    return {
      typeName: Node.$typeName,
      fullTypeName: composeSuiType(
        Node.$typeName,
        ...[extractType(K), extractType(V)]
      ) as `0x2::linked_table::Node<${ToTypeStr<ToTypeArgument<K>>}, ${ToTypeStr<
        ToTypeArgument<V>
      >}>`,
      typeArgs: [K, V],
      fromFields: (fields: Record<string, any>) => Node.fromFields([K, V], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Node.fromFieldsWithTypes([K, V], item),
      fromBcs: (data: Uint8Array) => Node.fromBcs([K, V], data),
      bcs: Node.bcs(toBcs(K), toBcs(V)),
      fromJSONField: (field: any) => Node.fromJSONField([K, V], field),
      fetch: async (client: SuiClient, id: string) => Node.fetch(client, [K, V], id),
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Node.reified
  }

  static fromFields<K extends Reified<TypeArgument>, V extends Reified<TypeArgument>>(
    typeArgs: [K, V],
    fields: Record<string, any>
  ): Node<ToTypeArgument<K>, ToTypeArgument<V>> {
    return Node.new(typeArgs, {
      prev: decodeFromFields(Option.reified(typeArgs[0]), fields.prev),
      next: decodeFromFields(Option.reified(typeArgs[0]), fields.next),
      value: decodeFromFields(typeArgs[1], fields.value),
    })
  }

  static fromFieldsWithTypes<K extends Reified<TypeArgument>, V extends Reified<TypeArgument>>(
    typeArgs: [K, V],
    item: FieldsWithTypes
  ): Node<ToTypeArgument<K>, ToTypeArgument<V>> {
    if (!isNode(item.type)) {
      throw new Error('not a Node type')
    }
    assertFieldsWithTypesArgsMatch(item, typeArgs)

    return Node.new(typeArgs, {
      prev: decodeFromFieldsWithTypes(Option.reified(typeArgs[0]), item.fields.prev),
      next: decodeFromFieldsWithTypes(Option.reified(typeArgs[0]), item.fields.next),
      value: decodeFromFieldsWithTypes(typeArgs[1], item.fields.value),
    })
  }

  static fromBcs<K extends Reified<TypeArgument>, V extends Reified<TypeArgument>>(
    typeArgs: [K, V],
    data: Uint8Array
  ): Node<ToTypeArgument<K>, ToTypeArgument<V>> {
    return Node.fromFields(typeArgs, Node.bcs(toBcs(typeArgs[0]), toBcs(typeArgs[1])).parse(data))
  }

  toJSONField() {
    return {
      prev: fieldToJSON<Option<K>>(`0x1::option::Option<${this.$typeArgs[0]}>`, this.prev),
      next: fieldToJSON<Option<K>>(`0x1::option::Option<${this.$typeArgs[0]}>`, this.next),
      value: fieldToJSON<V>(this.$typeArgs[1], this.value),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<K extends Reified<TypeArgument>, V extends Reified<TypeArgument>>(
    typeArgs: [K, V],
    field: any
  ): Node<ToTypeArgument<K>, ToTypeArgument<V>> {
    return Node.new(typeArgs, {
      prev: decodeFromJSONField(Option.reified(typeArgs[0]), field.prev),
      next: decodeFromJSONField(Option.reified(typeArgs[0]), field.next),
      value: decodeFromJSONField(typeArgs[1], field.value),
    })
  }

  static fromJSON<K extends Reified<TypeArgument>, V extends Reified<TypeArgument>>(
    typeArgs: [K, V],
    json: Record<string, any>
  ): Node<ToTypeArgument<K>, ToTypeArgument<V>> {
    if (json.$typeName !== Node.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Node.$typeName, ...typeArgs.map(extractType)),
      json.$typeArgs,
      typeArgs
    )

    return Node.fromJSONField(typeArgs, json)
  }

  static fromSuiParsedData<K extends Reified<TypeArgument>, V extends Reified<TypeArgument>>(
    typeArgs: [K, V],
    content: SuiParsedData
  ): Node<ToTypeArgument<K>, ToTypeArgument<V>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isNode(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Node object`)
    }
    return Node.fromFieldsWithTypes(typeArgs, content)
  }

  static async fetch<K extends Reified<TypeArgument>, V extends Reified<TypeArgument>>(
    client: SuiClient,
    typeArgs: [K, V],
    id: string
  ): Promise<Node<ToTypeArgument<K>, ToTypeArgument<V>>> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching Node object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isNode(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a Node object`)
    }
    return Node.fromFieldsWithTypes(typeArgs, res.data.content)
  }
}
