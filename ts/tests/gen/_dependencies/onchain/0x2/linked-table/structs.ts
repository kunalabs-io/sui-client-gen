import { initLoaderIfNeeded } from '../../../../_framework/init-onchain'
import { structClassLoaderOnchain } from '../../../../_framework/loader'
import { FieldsWithTypes, Type, compressSuiType, parseTypeName } from '../../../../_framework/util'
import { Option } from '../../0x1/option/structs'
import { UID } from '../object/structs'
import { BcsType, bcs } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== LinkedTable =============================== */

export function isLinkedTable(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::linked_table::LinkedTable<')
}

export interface LinkedTableFields<T0> {
  id: string
  size: bigint
  head: T0 | null
  tail: T0 | null
}

export class LinkedTable<T0> {
  static readonly $typeName = '0x2::linked_table::LinkedTable'
  static readonly $numTypeParams = 2

  static get bcs() {
    return <T0 extends BcsType<any>>(T0: T0) =>
      bcs.struct(`LinkedTable<${T0.name}>`, {
        id: UID.bcs,
        size: bcs.u64(),
        head: Option.bcs(T0),
        tail: Option.bcs(T0),
      })
  }

  readonly $typeArgs: [Type, Type]

  readonly id: string
  readonly size: bigint
  readonly head: T0 | null
  readonly tail: T0 | null

  constructor(typeArgs: [Type, Type], fields: LinkedTableFields<T0>) {
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.size = fields.size
    this.head = fields.head
    this.tail = fields.tail
  }

  static fromFields<T0>(typeArgs: [Type, Type], fields: Record<string, any>): LinkedTable<T0> {
    initLoaderIfNeeded()

    return new LinkedTable(typeArgs, {
      id: UID.fromFields(fields.id).id,
      size: BigInt(fields.size),
      head: Option.fromFields<T0>(`${typeArgs[0]}`, fields.head).vec[0] || null,
      tail: Option.fromFields<T0>(`${typeArgs[0]}`, fields.tail).vec[0] || null,
    })
  }

  static fromFieldsWithTypes<T0>(item: FieldsWithTypes): LinkedTable<T0> {
    initLoaderIfNeeded()

    if (!isLinkedTable(item.type)) {
      throw new Error('not a LinkedTable type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new LinkedTable([typeArgs[0], typeArgs[1]], {
      id: item.fields.id.id,
      size: BigInt(item.fields.size),
      head:
        item.fields.head !== null
          ? Option.fromFieldsWithTypes<T0>({
              type: '0x1::option::Option<' + `${typeArgs[0]}` + '>',
              fields: { vec: [item.fields.head] },
            }).vec[0]
          : null,
      tail:
        item.fields.tail !== null
          ? Option.fromFieldsWithTypes<T0>({
              type: '0x1::option::Option<' + `${typeArgs[0]}` + '>',
              fields: { vec: [item.fields.tail] },
            }).vec[0]
          : null,
    })
  }

  static fromBcs<T0>(typeArgs: [Type, Type], data: Uint8Array): LinkedTable<T0> {
    initLoaderIfNeeded()

    return LinkedTable.fromFields(
      typeArgs,
      LinkedTable.bcs(structClassLoaderOnchain.getBcsType(typeArgs[0])).parse(data)
    )
  }

  static fromSuiParsedData(content: SuiParsedData) {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isLinkedTable(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a LinkedTable object`)
    }
    return LinkedTable.fromFieldsWithTypes(content)
  }

  static async fetch<T0>(client: SuiClient, id: string): Promise<LinkedTable<T0>> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching LinkedTable object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isLinkedTable(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a LinkedTable object`)
    }
    return LinkedTable.fromFieldsWithTypes(res.data.content)
  }
}

/* ============================== Node =============================== */

export function isNode(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::linked_table::Node<')
}

export interface NodeFields<T0, T1> {
  prev: T0 | null
  next: T0 | null
  value: T1
}

export class Node<T0, T1> {
  static readonly $typeName = '0x2::linked_table::Node'
  static readonly $numTypeParams = 2

  static get bcs() {
    return <T0 extends BcsType<any>, T1 extends BcsType<any>>(T0: T0, T1: T1) =>
      bcs.struct(`Node<${T0.name}, ${T1.name}>`, {
        prev: Option.bcs(T0),
        next: Option.bcs(T0),
        value: T1,
      })
  }

  readonly $typeArgs: [Type, Type]

  readonly prev: T0 | null
  readonly next: T0 | null
  readonly value: T1

  constructor(typeArgs: [Type, Type], fields: NodeFields<T0, T1>) {
    this.$typeArgs = typeArgs

    this.prev = fields.prev
    this.next = fields.next
    this.value = fields.value
  }

  static fromFields<T0, T1>(typeArgs: [Type, Type], fields: Record<string, any>): Node<T0, T1> {
    initLoaderIfNeeded()

    return new Node(typeArgs, {
      prev: Option.fromFields<T0>(`${typeArgs[0]}`, fields.prev).vec[0] || null,
      next: Option.fromFields<T0>(`${typeArgs[0]}`, fields.next).vec[0] || null,
      value: structClassLoaderOnchain.fromFields(typeArgs[1], fields.value),
    })
  }

  static fromFieldsWithTypes<T0, T1>(item: FieldsWithTypes): Node<T0, T1> {
    initLoaderIfNeeded()

    if (!isNode(item.type)) {
      throw new Error('not a Node type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new Node([typeArgs[0], typeArgs[1]], {
      prev:
        item.fields.prev !== null
          ? Option.fromFieldsWithTypes<T0>({
              type: '0x1::option::Option<' + `${typeArgs[0]}` + '>',
              fields: { vec: [item.fields.prev] },
            }).vec[0]
          : null,
      next:
        item.fields.next !== null
          ? Option.fromFieldsWithTypes<T0>({
              type: '0x1::option::Option<' + `${typeArgs[0]}` + '>',
              fields: { vec: [item.fields.next] },
            }).vec[0]
          : null,
      value: structClassLoaderOnchain.fromFieldsWithTypes(typeArgs[1], item.fields.value),
    })
  }

  static fromBcs<T0, T1>(typeArgs: [Type, Type], data: Uint8Array): Node<T0, T1> {
    initLoaderIfNeeded()

    return Node.fromFields(
      typeArgs,
      Node.bcs(
        structClassLoaderOnchain.getBcsType(typeArgs[0]),
        structClassLoaderOnchain.getBcsType(typeArgs[1])
      ).parse(data)
    )
  }
}
