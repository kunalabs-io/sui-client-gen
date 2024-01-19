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

export interface FieldFields<Name extends TypeArgument, Value extends TypeArgument> {
  id: ToField<UID>
  name: ToField<Name>
  value: ToField<Value>
}

export class Field<Name extends TypeArgument, Value extends TypeArgument> {
  static readonly $typeName = '0x2::dynamic_field::Field'
  static readonly $numTypeParams = 2

  readonly $typeName = Field.$typeName

  static get bcs() {
    return <Name extends BcsType<any>, Value extends BcsType<any>>(Name: Name, Value: Value) =>
      bcs.struct(`Field<${Name.name}, ${Value.name}>`, {
        id: UID.bcs,
        name: Name,
        value: Value,
      })
  }

  readonly $typeArgs: [string, string]

  readonly id: ToField<UID>
  readonly name: ToField<Name>
  readonly value: ToField<Value>

  private constructor(typeArgs: [string, string], fields: FieldFields<Name, Value>) {
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.name = fields.name
    this.value = fields.value
  }

  static new<Name extends ReifiedTypeArgument, Value extends ReifiedTypeArgument>(
    typeArgs: [Name, Value],
    fields: FieldFields<ToTypeArgument<Name>, ToTypeArgument<Value>>
  ): Field<ToTypeArgument<Name>, ToTypeArgument<Value>> {
    return new Field(typeArgs.map(extractType) as [string, string], fields)
  }

  static reified<Name extends ReifiedTypeArgument, Value extends ReifiedTypeArgument>(
    Name: Name,
    Value: Value
  ) {
    return {
      typeName: Field.$typeName,
      typeArgs: [Name, Value],
      fromFields: (fields: Record<string, any>) => Field.fromFields([Name, Value], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        Field.fromFieldsWithTypes([Name, Value], item),
      fromBcs: (data: Uint8Array) => Field.fromBcs([Name, Value], data),
      bcs: Field.bcs(toBcs(Name), toBcs(Value)),
      __class: null as unknown as ReturnType<
        typeof Field.new<ToTypeArgument<Name>, ToTypeArgument<Value>>
      >,
    }
  }

  static fromFields<Name extends ReifiedTypeArgument, Value extends ReifiedTypeArgument>(
    typeArgs: [Name, Value],
    fields: Record<string, any>
  ): Field<ToTypeArgument<Name>, ToTypeArgument<Value>> {
    return Field.new(typeArgs, {
      id: decodeFromFieldsGenericOrSpecial(UID.reified(), fields.id),
      name: decodeFromFieldsGenericOrSpecial(typeArgs[0], fields.name),
      value: decodeFromFieldsGenericOrSpecial(typeArgs[1], fields.value),
    })
  }

  static fromFieldsWithTypes<Name extends ReifiedTypeArgument, Value extends ReifiedTypeArgument>(
    typeArgs: [Name, Value],
    item: FieldsWithTypes
  ): Field<ToTypeArgument<Name>, ToTypeArgument<Value>> {
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

  static fromBcs<Name extends ReifiedTypeArgument, Value extends ReifiedTypeArgument>(
    typeArgs: [Name, Value],
    data: Uint8Array
  ): Field<ToTypeArgument<Name>, ToTypeArgument<Value>> {
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

  static fromSuiParsedData<Name extends ReifiedTypeArgument, Value extends ReifiedTypeArgument>(
    typeArgs: [Name, Value],
    content: SuiParsedData
  ): Field<ToTypeArgument<Name>, ToTypeArgument<Value>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isField(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Field object`)
    }
    return Field.fromFieldsWithTypes(typeArgs, content)
  }

  static async fetch<Name extends ReifiedTypeArgument, Value extends ReifiedTypeArgument>(
    client: SuiClient,
    typeArgs: [Name, Value],
    id: string
  ): Promise<Field<ToTypeArgument<Name>, ToTypeArgument<Value>>> {
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
