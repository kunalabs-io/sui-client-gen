import {
  Reified,
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
  toBcs,
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

  readonly $fullTypeName =
    null as unknown as `0x2::dynamic_field::Field<${ToTypeStr<Name>}, ${ToTypeStr<Value>}>`

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

  static new<Name extends Reified<TypeArgument>, Value extends Reified<TypeArgument>>(
    typeArgs: [Name, Value],
    fields: FieldFields<ToTypeArgument<Name>, ToTypeArgument<Value>>
  ): Field<ToTypeArgument<Name>, ToTypeArgument<Value>> {
    return new Field(typeArgs.map(extractType) as [string, string], fields)
  }

  static reified<Name extends Reified<TypeArgument>, Value extends Reified<TypeArgument>>(
    Name: Name,
    Value: Value
  ): Reified<Field<ToTypeArgument<Name>, ToTypeArgument<Value>>> {
    return {
      typeName: Field.$typeName,
      fullTypeName: composeSuiType(
        Field.$typeName,
        ...[extractType(Name), extractType(Value)]
      ) as `0x2::dynamic_field::Field<${ToTypeStr<ToTypeArgument<Name>>}, ${ToTypeStr<
        ToTypeArgument<Value>
      >}>`,
      typeArgs: [Name, Value],
      fromFields: (fields: Record<string, any>) => Field.fromFields([Name, Value], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        Field.fromFieldsWithTypes([Name, Value], item),
      fromBcs: (data: Uint8Array) => Field.fromBcs([Name, Value], data),
      bcs: Field.bcs(toBcs(Name), toBcs(Value)),
      fromJSONField: (field: any) => Field.fromJSONField([Name, Value], field),
      fetch: async (client: SuiClient, id: string) => Field.fetch(client, [Name, Value], id),
      kind: 'StructClassReified',
    }
  }

  static fromFields<Name extends Reified<TypeArgument>, Value extends Reified<TypeArgument>>(
    typeArgs: [Name, Value],
    fields: Record<string, any>
  ): Field<ToTypeArgument<Name>, ToTypeArgument<Value>> {
    return Field.new(typeArgs, {
      id: decodeFromFields(UID.reified(), fields.id),
      name: decodeFromFields(typeArgs[0], fields.name),
      value: decodeFromFields(typeArgs[1], fields.value),
    })
  }

  static fromFieldsWithTypes<
    Name extends Reified<TypeArgument>,
    Value extends Reified<TypeArgument>,
  >(
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

  static fromBcs<Name extends Reified<TypeArgument>, Value extends Reified<TypeArgument>>(
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

  static fromJSONField<Name extends Reified<TypeArgument>, Value extends Reified<TypeArgument>>(
    typeArgs: [Name, Value],
    field: any
  ): Field<ToTypeArgument<Name>, ToTypeArgument<Value>> {
    return Field.new(typeArgs, {
      id: decodeFromJSONField(UID.reified(), field.id),
      name: decodeFromJSONField(typeArgs[0], field.name),
      value: decodeFromJSONField(typeArgs[1], field.value),
    })
  }

  static fromJSON<Name extends Reified<TypeArgument>, Value extends Reified<TypeArgument>>(
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

  static fromSuiParsedData<Name extends Reified<TypeArgument>, Value extends Reified<TypeArgument>>(
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

  static async fetch<Name extends Reified<TypeArgument>, Value extends Reified<TypeArgument>>(
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
