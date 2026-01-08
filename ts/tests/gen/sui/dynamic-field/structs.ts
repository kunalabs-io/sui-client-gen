/**
 * In addition to the fields declared in its type definition, a Sui object can have dynamic fields
 * that can be added after the object has been constructed. Unlike ordinary field names
 * (which are always statically declared identifiers) a dynamic field name can be any value with
 * the `copy`, `drop`, and `store` abilities, e.g. an integer, a boolean, or a string.
 * This gives Sui programmers the flexibility to extend objects on-the-fly, and it also serves as a
 * building block for core collection types
 */

import {
  PhantomReified,
  Reified,
  StructClass,
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
  phantom,
  toBcs,
} from '../../_framework/reified'
import {
  FieldsWithTypes,
  composeSuiType,
  compressSuiType,
  parseTypeName,
} from '../../_framework/util'
import { UID } from '../object/structs'
import { BcsType, bcs } from '@mysten/sui/bcs'
import { SuiClient, SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromBase64 } from '@mysten/sui/utils'

/* ============================== Field =============================== */

export function isField(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::dynamic_field::Field` + '<')
}

export interface FieldFields<Name extends TypeArgument, Value extends TypeArgument> {
  /**
   * Determined by the hash of the object ID, the field name value and it's type,
   * i.e. hash(parent.id || name || Name)
   */
  id: ToField<UID>
  /** The value for the name of this field */
  name: ToField<Name>
  /** The value bound to this field */
  value: ToField<Value>
}

export type FieldReified<Name extends TypeArgument, Value extends TypeArgument> = Reified<
  Field<Name, Value>,
  FieldFields<Name, Value>
>

/** Internal object used for storing the field and value */
export class Field<Name extends TypeArgument, Value extends TypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::dynamic_field::Field` as const
  static readonly $numTypeParams = 2
  static readonly $isPhantom = [false, false] as const

  readonly $typeName = Field.$typeName
  readonly $fullTypeName: `0x2::dynamic_field::Field<${ToTypeStr<Name>}, ${ToTypeStr<Value>}>`
  readonly $typeArgs: [ToTypeStr<Name>, ToTypeStr<Value>]
  readonly $isPhantom = Field.$isPhantom

  /**
   * Determined by the hash of the object ID, the field name value and it's type,
   * i.e. hash(parent.id || name || Name)
   */
  readonly id: ToField<UID>
  /** The value for the name of this field */
  readonly name: ToField<Name>
  /** The value bound to this field */
  readonly value: ToField<Value>

  private constructor(
    typeArgs: [ToTypeStr<Name>, ToTypeStr<Value>],
    fields: FieldFields<Name, Value>
  ) {
    this.$fullTypeName = composeSuiType(
      Field.$typeName,
      ...typeArgs
    ) as `0x2::dynamic_field::Field<${ToTypeStr<Name>}, ${ToTypeStr<Value>}>`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.name = fields.name
    this.value = fields.value
  }

  static reified<Name extends Reified<TypeArgument, any>, Value extends Reified<TypeArgument, any>>(
    Name: Name,
    Value: Value
  ): FieldReified<ToTypeArgument<Name>, ToTypeArgument<Value>> {
    const reifiedBcs = Field.bcs(toBcs(Name), toBcs(Value))
    return {
      typeName: Field.$typeName,
      fullTypeName: composeSuiType(
        Field.$typeName,
        ...[extractType(Name), extractType(Value)]
      ) as `0x2::dynamic_field::Field<${ToTypeStr<ToTypeArgument<Name>>}, ${ToTypeStr<ToTypeArgument<Value>>}>`,
      typeArgs: [extractType(Name), extractType(Value)] as [
        ToTypeStr<ToTypeArgument<Name>>,
        ToTypeStr<ToTypeArgument<Value>>,
      ],
      isPhantom: Field.$isPhantom,
      reifiedTypeArgs: [Name, Value],
      fromFields: (fields: Record<string, any>) => Field.fromFields([Name, Value], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        Field.fromFieldsWithTypes([Name, Value], item),
      fromBcs: (data: Uint8Array) => Field.fromFields([Name, Value], reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => Field.fromJSONField([Name, Value], field),
      fromJSON: (json: Record<string, any>) => Field.fromJSON([Name, Value], json),
      fromSuiParsedData: (content: SuiParsedData) =>
        Field.fromSuiParsedData([Name, Value], content),
      fromSuiObjectData: (content: SuiObjectData) =>
        Field.fromSuiObjectData([Name, Value], content),
      fetch: async (client: SuiClient, id: string) => Field.fetch(client, [Name, Value], id),
      new: (fields: FieldFields<ToTypeArgument<Name>, ToTypeArgument<Value>>) => {
        return new Field([extractType(Name), extractType(Value)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Field.reified
  }

  static phantom<Name extends Reified<TypeArgument, any>, Value extends Reified<TypeArgument, any>>(
    Name: Name,
    Value: Value
  ): PhantomReified<ToTypeStr<Field<ToTypeArgument<Name>, ToTypeArgument<Value>>>> {
    return phantom(Field.reified(Name, Value))
  }

  static get p() {
    return Field.phantom
  }

  private static instantiateBcs() {
    return <Name extends BcsType<any>, Value extends BcsType<any>>(Name: Name, Value: Value) =>
      bcs.struct(`Field<${Name.name}, ${Value.name}>`, {
        id: UID.bcs,
        name: Name,
        value: Value,
      })
  }

  private static cachedBcs: ReturnType<typeof Field.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof Field.instantiateBcs> {
    if (!Field.cachedBcs) {
      Field.cachedBcs = Field.instantiateBcs()
    }
    return Field.cachedBcs
  }

  static fromFields<
    Name extends Reified<TypeArgument, any>,
    Value extends Reified<TypeArgument, any>,
  >(
    typeArgs: [Name, Value],
    fields: Record<string, any>
  ): Field<ToTypeArgument<Name>, ToTypeArgument<Value>> {
    return Field.reified(typeArgs[0], typeArgs[1]).new({
      id: decodeFromFields(UID.reified(), fields.id),
      name: decodeFromFields(typeArgs[0], fields.name),
      value: decodeFromFields(typeArgs[1], fields.value),
    })
  }

  static fromFieldsWithTypes<
    Name extends Reified<TypeArgument, any>,
    Value extends Reified<TypeArgument, any>,
  >(
    typeArgs: [Name, Value],
    item: FieldsWithTypes
  ): Field<ToTypeArgument<Name>, ToTypeArgument<Value>> {
    if (!isField(item.type)) {
      throw new Error('not a Field type')
    }
    assertFieldsWithTypesArgsMatch(item, typeArgs)

    return Field.reified(typeArgs[0], typeArgs[1]).new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      name: decodeFromFieldsWithTypes(typeArgs[0], item.fields.name),
      value: decodeFromFieldsWithTypes(typeArgs[1], item.fields.value),
    })
  }

  static fromBcs<Name extends Reified<TypeArgument, any>, Value extends Reified<TypeArgument, any>>(
    typeArgs: [Name, Value],
    data: Uint8Array
  ): Field<ToTypeArgument<Name>, ToTypeArgument<Value>> {
    return Field.fromFields(typeArgs, Field.bcs(toBcs(typeArgs[0]), toBcs(typeArgs[1])).parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
      name: fieldToJSON<Name>(`${this.$typeArgs[0]}`, this.name),
      value: fieldToJSON<Value>(`${this.$typeArgs[1]}`, this.value),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<
    Name extends Reified<TypeArgument, any>,
    Value extends Reified<TypeArgument, any>,
  >(typeArgs: [Name, Value], field: any): Field<ToTypeArgument<Name>, ToTypeArgument<Value>> {
    return Field.reified(typeArgs[0], typeArgs[1]).new({
      id: decodeFromJSONField(UID.reified(), field.id),
      name: decodeFromJSONField(typeArgs[0], field.name),
      value: decodeFromJSONField(typeArgs[1], field.value),
    })
  }

  static fromJSON<
    Name extends Reified<TypeArgument, any>,
    Value extends Reified<TypeArgument, any>,
  >(
    typeArgs: [Name, Value],
    json: Record<string, any>
  ): Field<ToTypeArgument<Name>, ToTypeArgument<Value>> {
    if (json.$typeName !== Field.$typeName) {
      throw new Error(
        `not a Field json object: expected '${Field.$typeName}' but got '${json.$typeName}'`
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Field.$typeName, ...typeArgs.map(extractType)),
      json.$typeArgs,
      typeArgs
    )

    return Field.fromJSONField(typeArgs, json)
  }

  static fromSuiParsedData<
    Name extends Reified<TypeArgument, any>,
    Value extends Reified<TypeArgument, any>,
  >(
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

  static fromSuiObjectData<
    Name extends Reified<TypeArgument, any>,
    Value extends Reified<TypeArgument, any>,
  >(
    typeArgs: [Name, Value],
    data: SuiObjectData
  ): Field<ToTypeArgument<Name>, ToTypeArgument<Value>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isField(data.bcs.type)) {
        throw new Error(`object at is not a Field object`)
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

      return Field.fromBcs(typeArgs, fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Field.fromSuiParsedData(typeArgs, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<
    Name extends Reified<TypeArgument, any>,
    Value extends Reified<TypeArgument, any>,
  >(
    client: SuiClient,
    typeArgs: [Name, Value],
    id: string
  ): Promise<Field<ToTypeArgument<Name>, ToTypeArgument<Value>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching Field object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isField(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a Field object`)
    }

    return Field.fromSuiObjectData(typeArgs, res.data)
  }
}
