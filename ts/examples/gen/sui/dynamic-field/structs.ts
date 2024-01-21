import {
  ReifiedTypeArgument,
  ToField,
  ToPhantomTypeArgument,
  ToTypeArgument,
  TypeArgument,
  assertFieldsWithTypesArgsMatch,
  assertReifiedTypeArgsMatch,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  extractType,
  fieldToJSON,
  toBcs,
  ToTypeStr as ToPhantom,
} from '../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../_framework/util'
import { UID } from '../object/structs'
import { BcsType, bcs } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== Field =============================== */

export function isField(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::dynamic_field::Field<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface FieldFields<Name extends TypeArgument, Value extends TypeArgument> {
  id: ToField<UID>
  name: ToField<Name>
  value: ToField<Value>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Field<Name extends TypeArgument, Value extends TypeArgument> {
  static readonly $typeName = '0x2::dynamic_field::Field'
  static readonly $numTypeParams = 2

  __reifiedFullTypeString =
    null as unknown as `0x2::dynamic_field::Field<${ToPhantom<Name>}, ${ToPhantom<Value>}>`

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
      fullTypeName: composeSuiType(
        Field.$typeName,
        ...[extractType(Name), extractType(Value)]
      ) as `0x2::dynamic_field::Field<${ToPhantomTypeArgument<Name>}, ${ToPhantomTypeArgument<Value>}>`,
      fromFields: (fields: Record<string, any>) => Field.fromFields([Name, Value], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        Field.fromFieldsWithTypes([Name, Value], item),
      fromBcs: (data: Uint8Array) => Field.fromBcs([Name, Value], data),
      bcs: Field.bcs(toBcs(Name), toBcs(Value)),
      fromJSONField: (field: any) => Field.fromJSONField([Name, Value], field),
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
      id: decodeFromFields(UID.reified(), fields.id),
      name: decodeFromFields(typeArgs[0], fields.name),
      value: decodeFromFields(typeArgs[1], fields.value),
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
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      name: decodeFromFieldsWithTypes(typeArgs[0], item.fields.name),
      value: decodeFromFieldsWithTypes(typeArgs[1], item.fields.value),
    })
  }

  static fromBcs<Name extends ReifiedTypeArgument, Value extends ReifiedTypeArgument>(
    typeArgs: [Name, Value],
    data: Uint8Array
  ): Field<ToTypeArgument<Name>, ToTypeArgument<Value>> {
    return Field.fromFields(typeArgs, Field.bcs(toBcs(typeArgs[0]), toBcs(typeArgs[1])).parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
      name: fieldToJSON<Name>(this.$typeArgs[0], this.name),
      value: fieldToJSON<Value>(this.$typeArgs[1], this.value),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<Name extends ReifiedTypeArgument, Value extends ReifiedTypeArgument>(
    typeArgs: [Name, Value],
    field: any
  ): Field<ToTypeArgument<Name>, ToTypeArgument<Value>> {
    return Field.new(typeArgs, {
      id: decodeFromJSONField(UID.reified(), field.id),
      name: decodeFromJSONField(typeArgs[0], field.name),
      value: decodeFromJSONField(typeArgs[1], field.value),
    })
  }

  static fromJSON<Name extends ReifiedTypeArgument, Value extends ReifiedTypeArgument>(
    typeArgs: [Name, Value],
    json: Record<string, any>
  ): Field<ToTypeArgument<Name>, ToTypeArgument<Value>> {
    if (json.$typeName !== Field.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Field.$typeName, ...typeArgs.map(extractType)),
      json.$typeArgs,
      typeArgs
    )

    return Field.fromJSONField(typeArgs, json)
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
