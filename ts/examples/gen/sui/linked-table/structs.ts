import { Option } from '../../_dependencies/source/0x1/option/structs'
import { Encoding, bcsSource as bcs } from '../../_framework/bcs'
import { initLoaderIfNeeded } from '../../_framework/init-source'
import { structClassLoaderSource } from '../../_framework/loader'
import { FieldsWithTypes, Type, compressSuiType, parseTypeName } from '../../_framework/util'
import { UID } from '../object/structs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== LinkedTable =============================== */

bcs.registerStructType('0x2::linked_table::LinkedTable<K, V>', {
  id: `0x2::object::UID`,
  size: `u64`,
  head: `0x1::option::Option<K>`,
  tail: `0x1::option::Option<K>`,
})

export function isLinkedTable(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::linked_table::LinkedTable<')
}

export interface LinkedTableFields<K> {
  id: string
  size: bigint
  head: K | null
  tail: K | null
}

export class LinkedTable<K> {
  static readonly $typeName = '0x2::linked_table::LinkedTable'
  static readonly $numTypeParams = 2

  readonly $typeArgs: [Type, Type]

  readonly id: string
  readonly size: bigint
  readonly head: K | null
  readonly tail: K | null

  constructor(typeArgs: [Type, Type], fields: LinkedTableFields<K>) {
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.size = fields.size
    this.head = fields.head
    this.tail = fields.tail
  }

  static fromFields<K>(typeArgs: [Type, Type], fields: Record<string, any>): LinkedTable<K> {
    initLoaderIfNeeded()

    return new LinkedTable(typeArgs, {
      id: UID.fromFields(fields.id).id,
      size: BigInt(fields.size),
      head: Option.fromFields<K>(`${typeArgs[0]}`, fields.head).vec[0] || null,
      tail: Option.fromFields<K>(`${typeArgs[0]}`, fields.tail).vec[0] || null,
    })
  }

  static fromFieldsWithTypes<K>(item: FieldsWithTypes): LinkedTable<K> {
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
          ? Option.fromFieldsWithTypes<K>({
              type: '0x1::option::Option<' + `${typeArgs[0]}` + '>',
              fields: { vec: [item.fields.head] },
            }).vec[0]
          : null,
      tail:
        item.fields.tail !== null
          ? Option.fromFieldsWithTypes<K>({
              type: '0x1::option::Option<' + `${typeArgs[0]}` + '>',
              fields: { vec: [item.fields.tail] },
            }).vec[0]
          : null,
    })
  }

  static fromBcs<K>(
    typeArgs: [Type, Type],
    data: Uint8Array | string,
    encoding?: Encoding
  ): LinkedTable<K> {
    return LinkedTable.fromFields(
      typeArgs,
      bcs.de([LinkedTable.$typeName, ...typeArgs], data, encoding)
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

  static async fetch<K>(client: SuiClient, id: string): Promise<LinkedTable<K>> {
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

bcs.registerStructType('0x2::linked_table::Node<K, V>', {
  prev: `0x1::option::Option<K>`,
  next: `0x1::option::Option<K>`,
  value: `V`,
})

export function isNode(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::linked_table::Node<')
}

export interface NodeFields<K, V> {
  prev: K | null
  next: K | null
  value: V
}

export class Node<K, V> {
  static readonly $typeName = '0x2::linked_table::Node'
  static readonly $numTypeParams = 2

  readonly $typeArgs: [Type, Type]

  readonly prev: K | null
  readonly next: K | null
  readonly value: V

  constructor(typeArgs: [Type, Type], fields: NodeFields<K, V>) {
    this.$typeArgs = typeArgs

    this.prev = fields.prev
    this.next = fields.next
    this.value = fields.value
  }

  static fromFields<K, V>(typeArgs: [Type, Type], fields: Record<string, any>): Node<K, V> {
    initLoaderIfNeeded()

    return new Node(typeArgs, {
      prev: Option.fromFields<K>(`${typeArgs[0]}`, fields.prev).vec[0] || null,
      next: Option.fromFields<K>(`${typeArgs[0]}`, fields.next).vec[0] || null,
      value: structClassLoaderSource.fromFields(typeArgs[1], fields.value),
    })
  }

  static fromFieldsWithTypes<K, V>(item: FieldsWithTypes): Node<K, V> {
    initLoaderIfNeeded()

    if (!isNode(item.type)) {
      throw new Error('not a Node type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new Node([typeArgs[0], typeArgs[1]], {
      prev:
        item.fields.prev !== null
          ? Option.fromFieldsWithTypes<K>({
              type: '0x1::option::Option<' + `${typeArgs[0]}` + '>',
              fields: { vec: [item.fields.prev] },
            }).vec[0]
          : null,
      next:
        item.fields.next !== null
          ? Option.fromFieldsWithTypes<K>({
              type: '0x1::option::Option<' + `${typeArgs[0]}` + '>',
              fields: { vec: [item.fields.next] },
            }).vec[0]
          : null,
      value: structClassLoaderSource.fromFieldsWithTypes(typeArgs[1], item.fields.value),
    })
  }

  static fromBcs<K, V>(
    typeArgs: [Type, Type],
    data: Uint8Array | string,
    encoding?: Encoding
  ): Node<K, V> {
    return Node.fromFields(typeArgs, bcs.de([Node.$typeName, ...typeArgs], data, encoding))
  }
}
