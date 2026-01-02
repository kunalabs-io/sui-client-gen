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
  composeSuiType,
  compressSuiType,
  parseTypeName,
} from '../../_framework/util'
import { Option } from '../../move-stdlib-chain/option/structs'
import { UID } from '../object/structs'
import { BcsType, bcs } from '@mysten/sui/bcs'
import { SuiClient, SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromB64 } from '@mysten/sui/utils'

/* ============================== LinkedTable =============================== */

export function isLinkedTable(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::linked_table::LinkedTable` + '<')
}

export interface LinkedTableFields<T0 extends TypeArgument, T1 extends PhantomTypeArgument> {
  id: ToField<UID>
  size: ToField<'u64'>
  head: ToField<Option<T0>>
  tail: ToField<Option<T0>>
}

export type LinkedTableReified<T0 extends TypeArgument, T1 extends PhantomTypeArgument> = Reified<
  LinkedTable<T0, T1>,
  LinkedTableFields<T0, T1>
>

export class LinkedTable<T0 extends TypeArgument, T1 extends PhantomTypeArgument>
  implements StructClass
{
  __StructClass = true as const

  static readonly $typeName = `0x2::linked_table::LinkedTable`
  static readonly $numTypeParams = 2
  static readonly $isPhantom = [false, true] as const

  readonly $typeName = LinkedTable.$typeName
  readonly $fullTypeName: `0x2::linked_table::LinkedTable<${ToTypeStr<T0>}, ${PhantomToTypeStr<T1>}>`
  readonly $typeArgs: [ToTypeStr<T0>, PhantomToTypeStr<T1>]
  readonly $isPhantom = LinkedTable.$isPhantom

  readonly id: ToField<UID>
  readonly size: ToField<'u64'>
  readonly head: ToField<Option<T0>>
  readonly tail: ToField<Option<T0>>

  private constructor(
    typeArgs: [ToTypeStr<T0>, PhantomToTypeStr<T1>],
    fields: LinkedTableFields<T0, T1>
  ) {
    this.$fullTypeName = composeSuiType(
      LinkedTable.$typeName,
      ...typeArgs
    ) as `0x2::linked_table::LinkedTable<${ToTypeStr<T0>}, ${PhantomToTypeStr<T1>}>`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.size = fields.size
    this.head = fields.head
    this.tail = fields.tail
  }

  static reified<
    T0 extends Reified<TypeArgument, any>,
    T1 extends PhantomReified<PhantomTypeArgument>,
  >(T0: T0, T1: T1): LinkedTableReified<ToTypeArgument<T0>, ToPhantomTypeArgument<T1>> {
    const reifiedBcs = LinkedTable.bcs(toBcs(T0))
    return {
      typeName: LinkedTable.$typeName,
      fullTypeName: composeSuiType(
        LinkedTable.$typeName,
        ...[extractType(T0), extractType(T1)]
      ) as `0x2::linked_table::LinkedTable<${ToTypeStr<ToTypeArgument<T0>>}, ${PhantomToTypeStr<ToPhantomTypeArgument<T1>>}>`,
      typeArgs: [extractType(T0), extractType(T1)] as [
        ToTypeStr<ToTypeArgument<T0>>,
        PhantomToTypeStr<ToPhantomTypeArgument<T1>>,
      ],
      isPhantom: LinkedTable.$isPhantom,
      reifiedTypeArgs: [T0, T1],
      fromFields: (fields: Record<string, any>) => LinkedTable.fromFields([T0, T1], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        LinkedTable.fromFieldsWithTypes([T0, T1], item),
      fromBcs: (data: Uint8Array) => LinkedTable.fromFields([T0, T1], reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => LinkedTable.fromJSONField([T0, T1], field),
      fromJSON: (json: Record<string, any>) => LinkedTable.fromJSON([T0, T1], json),
      fromSuiParsedData: (content: SuiParsedData) =>
        LinkedTable.fromSuiParsedData([T0, T1], content),
      fromSuiObjectData: (content: SuiObjectData) =>
        LinkedTable.fromSuiObjectData([T0, T1], content),
      fetch: async (client: SuiClient, id: string) => LinkedTable.fetch(client, [T0, T1], id),
      new: (fields: LinkedTableFields<ToTypeArgument<T0>, ToPhantomTypeArgument<T1>>) => {
        return new LinkedTable([extractType(T0), extractType(T1)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return LinkedTable.reified
  }

  static phantom<
    T0 extends Reified<TypeArgument, any>,
    T1 extends PhantomReified<PhantomTypeArgument>,
  >(
    T0: T0,
    T1: T1
  ): PhantomReified<ToTypeStr<LinkedTable<ToTypeArgument<T0>, ToPhantomTypeArgument<T1>>>> {
    return phantom(LinkedTable.reified(T0, T1))
  }

  static get p() {
    return LinkedTable.phantom
  }

  private static instantiateBcs() {
    return <T0 extends BcsType<any>>(T0: T0) =>
      bcs.struct(`LinkedTable<${T0.name}>`, {
        id: UID.bcs,
        size: bcs.u64(),
        head: Option.bcs(T0),
        tail: Option.bcs(T0),
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
    T0 extends Reified<TypeArgument, any>,
    T1 extends PhantomReified<PhantomTypeArgument>,
  >(
    typeArgs: [T0, T1],
    fields: Record<string, any>
  ): LinkedTable<ToTypeArgument<T0>, ToPhantomTypeArgument<T1>> {
    return LinkedTable.reified(typeArgs[0], typeArgs[1]).new({
      id: decodeFromFields(UID.reified(), fields.id),
      size: decodeFromFields('u64', fields.size),
      head: decodeFromFields(Option.reified(typeArgs[0]), fields.head),
      tail: decodeFromFields(Option.reified(typeArgs[0]), fields.tail),
    })
  }

  static fromFieldsWithTypes<
    T0 extends Reified<TypeArgument, any>,
    T1 extends PhantomReified<PhantomTypeArgument>,
  >(
    typeArgs: [T0, T1],
    item: FieldsWithTypes
  ): LinkedTable<ToTypeArgument<T0>, ToPhantomTypeArgument<T1>> {
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
    T0 extends Reified<TypeArgument, any>,
    T1 extends PhantomReified<PhantomTypeArgument>,
  >(
    typeArgs: [T0, T1],
    data: Uint8Array
  ): LinkedTable<ToTypeArgument<T0>, ToPhantomTypeArgument<T1>> {
    return LinkedTable.fromFields(typeArgs, LinkedTable.bcs(toBcs(typeArgs[0])).parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
      size: this.size.toString(),
      head: fieldToJSON<Option<T0>>(`${Option.$typeName}<${this.$typeArgs[0]}>`, this.head),
      tail: fieldToJSON<Option<T0>>(`${Option.$typeName}<${this.$typeArgs[0]}>`, this.tail),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<
    T0 extends Reified<TypeArgument, any>,
    T1 extends PhantomReified<PhantomTypeArgument>,
  >(typeArgs: [T0, T1], field: any): LinkedTable<ToTypeArgument<T0>, ToPhantomTypeArgument<T1>> {
    return LinkedTable.reified(typeArgs[0], typeArgs[1]).new({
      id: decodeFromJSONField(UID.reified(), field.id),
      size: decodeFromJSONField('u64', field.size),
      head: decodeFromJSONField(Option.reified(typeArgs[0]), field.head),
      tail: decodeFromJSONField(Option.reified(typeArgs[0]), field.tail),
    })
  }

  static fromJSON<
    T0 extends Reified<TypeArgument, any>,
    T1 extends PhantomReified<PhantomTypeArgument>,
  >(
    typeArgs: [T0, T1],
    json: Record<string, any>
  ): LinkedTable<ToTypeArgument<T0>, ToPhantomTypeArgument<T1>> {
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

  static fromSuiParsedData<
    T0 extends Reified<TypeArgument, any>,
    T1 extends PhantomReified<PhantomTypeArgument>,
  >(
    typeArgs: [T0, T1],
    content: SuiParsedData
  ): LinkedTable<ToTypeArgument<T0>, ToPhantomTypeArgument<T1>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isLinkedTable(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a LinkedTable object`)
    }
    return LinkedTable.fromFieldsWithTypes(typeArgs, content)
  }

  static fromSuiObjectData<
    T0 extends Reified<TypeArgument, any>,
    T1 extends PhantomReified<PhantomTypeArgument>,
  >(
    typeArgs: [T0, T1],
    data: SuiObjectData
  ): LinkedTable<ToTypeArgument<T0>, ToPhantomTypeArgument<T1>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isLinkedTable(data.bcs.type)) {
        throw new Error(`object at is not a LinkedTable object`)
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs
      if (gotTypeArgs.length !== 2) {
        throw new Error(
          `type argument mismatch: expected 2 type arguments but got ${gotTypeArgs.length}`
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

      return LinkedTable.fromBcs(typeArgs, fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return LinkedTable.fromSuiParsedData(typeArgs, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<
    T0 extends Reified<TypeArgument, any>,
    T1 extends PhantomReified<PhantomTypeArgument>,
  >(
    client: SuiClient,
    typeArgs: [T0, T1],
    id: string
  ): Promise<LinkedTable<ToTypeArgument<T0>, ToPhantomTypeArgument<T1>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching LinkedTable object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isLinkedTable(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a LinkedTable object`)
    }

    return LinkedTable.fromSuiObjectData(typeArgs, res.data)
  }
}

/* ============================== Node =============================== */

export function isNode(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::linked_table::Node` + '<')
}

export interface NodeFields<T0 extends TypeArgument, T1 extends TypeArgument> {
  prev: ToField<Option<T0>>
  next: ToField<Option<T0>>
  value: ToField<T1>
}

export type NodeReified<T0 extends TypeArgument, T1 extends TypeArgument> = Reified<
  Node<T0, T1>,
  NodeFields<T0, T1>
>

export class Node<T0 extends TypeArgument, T1 extends TypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::linked_table::Node`
  static readonly $numTypeParams = 2
  static readonly $isPhantom = [false, false] as const

  readonly $typeName = Node.$typeName
  readonly $fullTypeName: `0x2::linked_table::Node<${ToTypeStr<T0>}, ${ToTypeStr<T1>}>`
  readonly $typeArgs: [ToTypeStr<T0>, ToTypeStr<T1>]
  readonly $isPhantom = Node.$isPhantom

  readonly prev: ToField<Option<T0>>
  readonly next: ToField<Option<T0>>
  readonly value: ToField<T1>

  private constructor(typeArgs: [ToTypeStr<T0>, ToTypeStr<T1>], fields: NodeFields<T0, T1>) {
    this.$fullTypeName = composeSuiType(
      Node.$typeName,
      ...typeArgs
    ) as `0x2::linked_table::Node<${ToTypeStr<T0>}, ${ToTypeStr<T1>}>`
    this.$typeArgs = typeArgs

    this.prev = fields.prev
    this.next = fields.next
    this.value = fields.value
  }

  static reified<T0 extends Reified<TypeArgument, any>, T1 extends Reified<TypeArgument, any>>(
    T0: T0,
    T1: T1
  ): NodeReified<ToTypeArgument<T0>, ToTypeArgument<T1>> {
    const reifiedBcs = Node.bcs(toBcs(T0), toBcs(T1))
    return {
      typeName: Node.$typeName,
      fullTypeName: composeSuiType(
        Node.$typeName,
        ...[extractType(T0), extractType(T1)]
      ) as `0x2::linked_table::Node<${ToTypeStr<ToTypeArgument<T0>>}, ${ToTypeStr<ToTypeArgument<T1>>}>`,
      typeArgs: [extractType(T0), extractType(T1)] as [
        ToTypeStr<ToTypeArgument<T0>>,
        ToTypeStr<ToTypeArgument<T1>>,
      ],
      isPhantom: Node.$isPhantom,
      reifiedTypeArgs: [T0, T1],
      fromFields: (fields: Record<string, any>) => Node.fromFields([T0, T1], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Node.fromFieldsWithTypes([T0, T1], item),
      fromBcs: (data: Uint8Array) => Node.fromFields([T0, T1], reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => Node.fromJSONField([T0, T1], field),
      fromJSON: (json: Record<string, any>) => Node.fromJSON([T0, T1], json),
      fromSuiParsedData: (content: SuiParsedData) => Node.fromSuiParsedData([T0, T1], content),
      fromSuiObjectData: (content: SuiObjectData) => Node.fromSuiObjectData([T0, T1], content),
      fetch: async (client: SuiClient, id: string) => Node.fetch(client, [T0, T1], id),
      new: (fields: NodeFields<ToTypeArgument<T0>, ToTypeArgument<T1>>) => {
        return new Node([extractType(T0), extractType(T1)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Node.reified
  }

  static phantom<T0 extends Reified<TypeArgument, any>, T1 extends Reified<TypeArgument, any>>(
    T0: T0,
    T1: T1
  ): PhantomReified<ToTypeStr<Node<ToTypeArgument<T0>, ToTypeArgument<T1>>>> {
    return phantom(Node.reified(T0, T1))
  }

  static get p() {
    return Node.phantom
  }

  private static instantiateBcs() {
    return <T0 extends BcsType<any>, T1 extends BcsType<any>>(T0: T0, T1: T1) =>
      bcs.struct(`Node<${T0.name}, ${T1.name}>`, {
        prev: Option.bcs(T0),
        next: Option.bcs(T0),
        value: T1,
      })
  }

  private static cachedBcs: ReturnType<typeof Node.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof Node.instantiateBcs> {
    if (!Node.cachedBcs) {
      Node.cachedBcs = Node.instantiateBcs()
    }
    return Node.cachedBcs
  }

  static fromFields<T0 extends Reified<TypeArgument, any>, T1 extends Reified<TypeArgument, any>>(
    typeArgs: [T0, T1],
    fields: Record<string, any>
  ): Node<ToTypeArgument<T0>, ToTypeArgument<T1>> {
    return Node.reified(typeArgs[0], typeArgs[1]).new({
      prev: decodeFromFields(Option.reified(typeArgs[0]), fields.prev),
      next: decodeFromFields(Option.reified(typeArgs[0]), fields.next),
      value: decodeFromFields(typeArgs[1], fields.value),
    })
  }

  static fromFieldsWithTypes<
    T0 extends Reified<TypeArgument, any>,
    T1 extends Reified<TypeArgument, any>,
  >(typeArgs: [T0, T1], item: FieldsWithTypes): Node<ToTypeArgument<T0>, ToTypeArgument<T1>> {
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

  static fromBcs<T0 extends Reified<TypeArgument, any>, T1 extends Reified<TypeArgument, any>>(
    typeArgs: [T0, T1],
    data: Uint8Array
  ): Node<ToTypeArgument<T0>, ToTypeArgument<T1>> {
    return Node.fromFields(typeArgs, Node.bcs(toBcs(typeArgs[0]), toBcs(typeArgs[1])).parse(data))
  }

  toJSONField() {
    return {
      prev: fieldToJSON<Option<T0>>(`${Option.$typeName}<${this.$typeArgs[0]}>`, this.prev),
      next: fieldToJSON<Option<T0>>(`${Option.$typeName}<${this.$typeArgs[0]}>`, this.next),
      value: fieldToJSON<T1>(this.$typeArgs[1], this.value),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<
    T0 extends Reified<TypeArgument, any>,
    T1 extends Reified<TypeArgument, any>,
  >(typeArgs: [T0, T1], field: any): Node<ToTypeArgument<T0>, ToTypeArgument<T1>> {
    return Node.reified(typeArgs[0], typeArgs[1]).new({
      prev: decodeFromJSONField(Option.reified(typeArgs[0]), field.prev),
      next: decodeFromJSONField(Option.reified(typeArgs[0]), field.next),
      value: decodeFromJSONField(typeArgs[1], field.value),
    })
  }

  static fromJSON<T0 extends Reified<TypeArgument, any>, T1 extends Reified<TypeArgument, any>>(
    typeArgs: [T0, T1],
    json: Record<string, any>
  ): Node<ToTypeArgument<T0>, ToTypeArgument<T1>> {
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

  static fromSuiParsedData<
    T0 extends Reified<TypeArgument, any>,
    T1 extends Reified<TypeArgument, any>,
  >(typeArgs: [T0, T1], content: SuiParsedData): Node<ToTypeArgument<T0>, ToTypeArgument<T1>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isNode(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Node object`)
    }
    return Node.fromFieldsWithTypes(typeArgs, content)
  }

  static fromSuiObjectData<
    T0 extends Reified<TypeArgument, any>,
    T1 extends Reified<TypeArgument, any>,
  >(typeArgs: [T0, T1], data: SuiObjectData): Node<ToTypeArgument<T0>, ToTypeArgument<T1>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isNode(data.bcs.type)) {
        throw new Error(`object at is not a Node object`)
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs
      if (gotTypeArgs.length !== 2) {
        throw new Error(
          `type argument mismatch: expected 2 type arguments but got ${gotTypeArgs.length}`
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

      return Node.fromBcs(typeArgs, fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Node.fromSuiParsedData(typeArgs, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<T0 extends Reified<TypeArgument, any>, T1 extends Reified<TypeArgument, any>>(
    client: SuiClient,
    typeArgs: [T0, T1],
    id: string
  ): Promise<Node<ToTypeArgument<T0>, ToTypeArgument<T1>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching Node object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isNode(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a Node object`)
    }

    return Node.fromSuiObjectData(typeArgs, res.data)
  }
}
