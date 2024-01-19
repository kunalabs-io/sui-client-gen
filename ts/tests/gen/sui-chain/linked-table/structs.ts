import {
  ReifiedTypeArgument,
  ToField,
  ToTypeArgument,
  TypeArgument,
  assertFieldsWithTypesArgsMatch,
  decodeFromFieldsGenericOrSpecial,
  decodeFromFieldsWithTypesGenericOrSpecial,
  extractType,
  toBcs,
} from '../../_framework/types'
import { FieldsWithTypes, Type, compressSuiType, genericToJSON } from '../../_framework/util'
import { Option } from '../../move-stdlib-chain/option/structs'
import { UID } from '../object/structs'
import { BcsType, bcs } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== LinkedTable =============================== */

export function isLinkedTable(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::linked_table::LinkedTable<')
}

export interface LinkedTableFields<T0 extends TypeArgument> {
  id: ToField<UID>
  size: ToField<'u64'>
  head: ToField<Option<T0>>
  tail: ToField<Option<T0>>
}

export class LinkedTable<T0 extends TypeArgument> {
  static readonly $typeName = '0x2::linked_table::LinkedTable'
  static readonly $numTypeParams = 2

  readonly $typeName = LinkedTable.$typeName

  static get bcs() {
    return <T0 extends BcsType<any>>(T0: T0) =>
      bcs.struct(`LinkedTable<${T0.name}>`, {
        id: UID.bcs,
        size: bcs.u64(),
        head: Option.bcs(T0),
        tail: Option.bcs(T0),
      })
  }

  readonly $typeArgs: [string, string]

  readonly id: ToField<UID>
  readonly size: ToField<'u64'>
  readonly head: ToField<Option<T0>>
  readonly tail: ToField<Option<T0>>

  private constructor(typeArgs: [string, string], fields: LinkedTableFields<T0>) {
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.size = fields.size
    this.head = fields.head
    this.tail = fields.tail
  }

  static new<T0 extends ReifiedTypeArgument>(
    typeArgs: [T0, ReifiedTypeArgument],
    fields: LinkedTableFields<ToTypeArgument<T0>>
  ): LinkedTable<ToTypeArgument<T0>> {
    return new LinkedTable(typeArgs.map(extractType) as [string, string], fields)
  }

  static reified<T0 extends ReifiedTypeArgument>(T0: T0, T1: ReifiedTypeArgument) {
    return {
      typeName: LinkedTable.$typeName,
      typeArgs: [T0, T1],
      fromFields: (fields: Record<string, any>) => LinkedTable.fromFields([T0, T1], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        LinkedTable.fromFieldsWithTypes([T0, T1], item),
      fromBcs: (data: Uint8Array) => LinkedTable.fromBcs([T0, T1], data),
      bcs: LinkedTable.bcs(toBcs(T0)),
      __class: null as unknown as ReturnType<typeof LinkedTable.new<ToTypeArgument<T0>>>,
    }
  }

  static fromFields<T0 extends ReifiedTypeArgument>(
    typeArgs: [T0, ReifiedTypeArgument],
    fields: Record<string, any>
  ): LinkedTable<ToTypeArgument<T0>> {
    return LinkedTable.new(typeArgs, {
      id: decodeFromFieldsGenericOrSpecial(UID.reified(), fields.id),
      size: decodeFromFieldsGenericOrSpecial('u64', fields.size),
      head: decodeFromFieldsGenericOrSpecial(Option.reified(typeArgs[0]), fields.head),
      tail: decodeFromFieldsGenericOrSpecial(Option.reified(typeArgs[0]), fields.tail),
    })
  }

  static fromFieldsWithTypes<T0 extends ReifiedTypeArgument>(
    typeArgs: [T0, ReifiedTypeArgument],
    item: FieldsWithTypes
  ): LinkedTable<ToTypeArgument<T0>> {
    if (!isLinkedTable(item.type)) {
      throw new Error('not a LinkedTable type')
    }
    assertFieldsWithTypesArgsMatch(item, typeArgs)

    return LinkedTable.new(typeArgs, {
      id: decodeFromFieldsWithTypesGenericOrSpecial(UID.reified(), item.fields.id),
      size: decodeFromFieldsWithTypesGenericOrSpecial('u64', item.fields.size),
      head: decodeFromFieldsWithTypesGenericOrSpecial(
        Option.reified(typeArgs[0]),
        item.fields.head
      ),
      tail: decodeFromFieldsWithTypesGenericOrSpecial(
        Option.reified(typeArgs[0]),
        item.fields.tail
      ),
    })
  }

  static fromBcs<T0 extends ReifiedTypeArgument>(
    typeArgs: [T0, ReifiedTypeArgument],
    data: Uint8Array
  ): LinkedTable<ToTypeArgument<T0>> {
    return LinkedTable.fromFields(typeArgs, LinkedTable.bcs(toBcs(typeArgs[0])).parse(data))
  }

  toJSON() {
    return {
      $typeArgs: this.$typeArgs,
      id: this.id,
      size: this.size.toString(),
      head: genericToJSON(`0x1::option::Option<${this.$typeArgs[0]}>`, this.head),
      tail: genericToJSON(`0x1::option::Option<${this.$typeArgs[0]}>`, this.tail),
    }
  }

  static fromSuiParsedData<T0 extends ReifiedTypeArgument>(
    typeArgs: [T0, ReifiedTypeArgument],
    content: SuiParsedData
  ): LinkedTable<ToTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isLinkedTable(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a LinkedTable object`)
    }
    return LinkedTable.fromFieldsWithTypes(typeArgs, content)
  }

  static async fetch<T0 extends ReifiedTypeArgument>(
    client: SuiClient,
    typeArgs: [T0, ReifiedTypeArgument],
    id: string
  ): Promise<LinkedTable<ToTypeArgument<T0>>> {
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

export function isNode(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::linked_table::Node<')
}

export interface NodeFields<T0 extends TypeArgument, T1 extends TypeArgument> {
  prev: ToField<Option<T0>>
  next: ToField<Option<T0>>
  value: ToField<T1>
}

export class Node<T0 extends TypeArgument, T1 extends TypeArgument> {
  static readonly $typeName = '0x2::linked_table::Node'
  static readonly $numTypeParams = 2

  readonly $typeName = Node.$typeName

  static get bcs() {
    return <T0 extends BcsType<any>, T1 extends BcsType<any>>(T0: T0, T1: T1) =>
      bcs.struct(`Node<${T0.name}, ${T1.name}>`, {
        prev: Option.bcs(T0),
        next: Option.bcs(T0),
        value: T1,
      })
  }

  readonly $typeArgs: [string, string]

  readonly prev: ToField<Option<T0>>
  readonly next: ToField<Option<T0>>
  readonly value: ToField<T1>

  private constructor(typeArgs: [string, string], fields: NodeFields<T0, T1>) {
    this.$typeArgs = typeArgs

    this.prev = fields.prev
    this.next = fields.next
    this.value = fields.value
  }

  static new<T0 extends ReifiedTypeArgument, T1 extends ReifiedTypeArgument>(
    typeArgs: [T0, T1],
    fields: NodeFields<ToTypeArgument<T0>, ToTypeArgument<T1>>
  ): Node<ToTypeArgument<T0>, ToTypeArgument<T1>> {
    return new Node(typeArgs.map(extractType) as [string, string], fields)
  }

  static reified<T0 extends ReifiedTypeArgument, T1 extends ReifiedTypeArgument>(T0: T0, T1: T1) {
    return {
      typeName: Node.$typeName,
      typeArgs: [T0, T1],
      fromFields: (fields: Record<string, any>) => Node.fromFields([T0, T1], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Node.fromFieldsWithTypes([T0, T1], item),
      fromBcs: (data: Uint8Array) => Node.fromBcs([T0, T1], data),
      bcs: Node.bcs(toBcs(T0), toBcs(T1)),
      __class: null as unknown as ReturnType<
        typeof Node.new<ToTypeArgument<T0>, ToTypeArgument<T1>>
      >,
    }
  }

  static fromFields<T0 extends ReifiedTypeArgument, T1 extends ReifiedTypeArgument>(
    typeArgs: [T0, T1],
    fields: Record<string, any>
  ): Node<ToTypeArgument<T0>, ToTypeArgument<T1>> {
    return Node.new(typeArgs, {
      prev: decodeFromFieldsGenericOrSpecial(Option.reified(typeArgs[0]), fields.prev),
      next: decodeFromFieldsGenericOrSpecial(Option.reified(typeArgs[0]), fields.next),
      value: decodeFromFieldsGenericOrSpecial(typeArgs[1], fields.value),
    })
  }

  static fromFieldsWithTypes<T0 extends ReifiedTypeArgument, T1 extends ReifiedTypeArgument>(
    typeArgs: [T0, T1],
    item: FieldsWithTypes
  ): Node<ToTypeArgument<T0>, ToTypeArgument<T1>> {
    if (!isNode(item.type)) {
      throw new Error('not a Node type')
    }
    assertFieldsWithTypesArgsMatch(item, typeArgs)

    return Node.new(typeArgs, {
      prev: decodeFromFieldsWithTypesGenericOrSpecial(
        Option.reified(typeArgs[0]),
        item.fields.prev
      ),
      next: decodeFromFieldsWithTypesGenericOrSpecial(
        Option.reified(typeArgs[0]),
        item.fields.next
      ),
      value: decodeFromFieldsWithTypesGenericOrSpecial(typeArgs[1], item.fields.value),
    })
  }

  static fromBcs<T0 extends ReifiedTypeArgument, T1 extends ReifiedTypeArgument>(
    typeArgs: [T0, T1],
    data: Uint8Array
  ): Node<ToTypeArgument<T0>, ToTypeArgument<T1>> {
    return Node.fromFields(typeArgs, Node.bcs(toBcs(typeArgs[0]), toBcs(typeArgs[1])).parse(data))
  }

  toJSON() {
    return {
      $typeArgs: this.$typeArgs,
      prev: genericToJSON(`0x1::option::Option<${this.$typeArgs[0]}>`, this.prev),
      next: genericToJSON(`0x1::option::Option<${this.$typeArgs[0]}>`, this.next),
      value: genericToJSON(this.$typeArgs[1], this.value),
    }
  }
}
