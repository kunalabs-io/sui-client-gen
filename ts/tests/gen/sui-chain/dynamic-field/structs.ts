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
import { UID } from '../object/structs'
import { BcsType, bcs } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== Field =============================== */

export function isField(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::dynamic_field::Field<')
}

export interface FieldFields<T0 extends TypeArgument, T1 extends TypeArgument> {
  id: ToField<UID>
  name: ToField<T0>
  value: ToField<T1>
}

export class Field<T0 extends TypeArgument, T1 extends TypeArgument> {
  static readonly $typeName = '0x2::dynamic_field::Field'
  static readonly $numTypeParams = 2

  readonly $typeName = Field.$typeName

  static get bcs() {
    return <T0 extends BcsType<any>, T1 extends BcsType<any>>(T0: T0, T1: T1) =>
      bcs.struct(`Field<${T0.name}, ${T1.name}>`, {
        id: UID.bcs,
        name: T0,
        value: T1,
      })
  }

  readonly $typeArgs: [string, string]

  readonly id: ToField<UID>
  readonly name: ToField<T0>
  readonly value: ToField<T1>

  private constructor(typeArgs: [string, string], fields: FieldFields<T0, T1>) {
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.name = fields.name
    this.value = fields.value
  }

  static new<T0 extends ReifiedTypeArgument, T1 extends ReifiedTypeArgument>(
    typeArgs: [T0, T1],
    fields: FieldFields<ToTypeArgument<T0>, ToTypeArgument<T1>>
  ): Field<ToTypeArgument<T0>, ToTypeArgument<T1>> {
    return new Field(typeArgs.map(extractType) as [string, string], fields)
  }

  static reified<T0 extends ReifiedTypeArgument, T1 extends ReifiedTypeArgument>(T0: T0, T1: T1) {
    return {
      typeName: Field.$typeName,
      typeArgs: [T0, T1],
      fromFields: (fields: Record<string, any>) => Field.fromFields([T0, T1], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Field.fromFieldsWithTypes([T0, T1], item),
      fromBcs: (data: Uint8Array) => Field.fromBcs([T0, T1], data),
      bcs: Field.bcs(toBcs(T0), toBcs(T1)),
      __class: null as unknown as ReturnType<
        typeof Field.new<ToTypeArgument<T0>, ToTypeArgument<T1>>
      >,
    }
  }

  static fromFields<T0 extends ReifiedTypeArgument, T1 extends ReifiedTypeArgument>(
    typeArgs: [T0, T1],
    fields: Record<string, any>
  ): Field<ToTypeArgument<T0>, ToTypeArgument<T1>> {
    return Field.new(typeArgs, {
      id: decodeFromFieldsGenericOrSpecial(UID.reified(), fields.id),
      name: decodeFromFieldsGenericOrSpecial(typeArgs[0], fields.name),
      value: decodeFromFieldsGenericOrSpecial(typeArgs[1], fields.value),
    })
  }

  static fromFieldsWithTypes<T0 extends ReifiedTypeArgument, T1 extends ReifiedTypeArgument>(
    typeArgs: [T0, T1],
    item: FieldsWithTypes
  ): Field<ToTypeArgument<T0>, ToTypeArgument<T1>> {
    if (!isField(item.type)) {
      throw new Error('not a Field type')
    }
    assertFieldsWithTypesArgsMatch(item, typeArgs)

    return Field.new(typeArgs, {
      id: decodeFromFieldsWithTypesGenericOrSpecial(UID.reified(), item.fields.id),
      name: decodeFromFieldsWithTypesGenericOrSpecial(typeArgs[0], item.fields.name),
      value: decodeFromFieldsWithTypesGenericOrSpecial(typeArgs[1], item.fields.value),
    })
  }

  static fromBcs<T0 extends ReifiedTypeArgument, T1 extends ReifiedTypeArgument>(
    typeArgs: [T0, T1],
    data: Uint8Array
  ): Field<ToTypeArgument<T0>, ToTypeArgument<T1>> {
    return Field.fromFields(typeArgs, Field.bcs(toBcs(typeArgs[0]), toBcs(typeArgs[1])).parse(data))
  }

  toJSON() {
    return {
      $typeArgs: this.$typeArgs,
      id: this.id,
      name: genericToJSON(this.$typeArgs[0], this.name),
      value: genericToJSON(this.$typeArgs[1], this.value),
    }
  }

  static fromSuiParsedData<T0 extends ReifiedTypeArgument, T1 extends ReifiedTypeArgument>(
    typeArgs: [T0, T1],
    content: SuiParsedData
  ): Field<ToTypeArgument<T0>, ToTypeArgument<T1>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isField(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Field object`)
    }
    return Field.fromFieldsWithTypes(typeArgs, content)
  }

  static async fetch<T0 extends ReifiedTypeArgument, T1 extends ReifiedTypeArgument>(
    client: SuiClient,
    typeArgs: [T0, T1],
    id: string
  ): Promise<Field<ToTypeArgument<T0>, ToTypeArgument<T1>>> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching Field object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isField(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a Field object`)
    }
    return Field.fromFieldsWithTypes(typeArgs, res.data.content)
  }
}
