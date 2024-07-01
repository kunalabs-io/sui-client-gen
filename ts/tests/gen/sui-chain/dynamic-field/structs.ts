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
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../_framework/util'
import { PKG_V19 } from '../index'
import { UID } from '../object/structs'
import { BcsType, bcs, fromB64 } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui/client'

/* ============================== Field =============================== */

export function isField(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`${PKG_V19}::dynamic_field::Field` + '<')
}

export interface FieldFields<T0 extends TypeArgument, T1 extends TypeArgument> {
  id: ToField<UID>
  name: ToField<T0>
  value: ToField<T1>
}

export type FieldReified<T0 extends TypeArgument, T1 extends TypeArgument> = Reified<
  Field<T0, T1>,
  FieldFields<T0, T1>
>

export class Field<T0 extends TypeArgument, T1 extends TypeArgument> implements StructClass {
  static readonly $typeName = `${PKG_V19}::dynamic_field::Field`
  static readonly $numTypeParams = 2

  readonly $typeName = Field.$typeName

  readonly $fullTypeName: `${typeof PKG_V19}::dynamic_field::Field<${ToTypeStr<T0>}, ${ToTypeStr<T1>}>`

  readonly $typeArgs: [ToTypeStr<T0>, ToTypeStr<T1>]

  readonly id: ToField<UID>
  readonly name: ToField<T0>
  readonly value: ToField<T1>

  private constructor(typeArgs: [ToTypeStr<T0>, ToTypeStr<T1>], fields: FieldFields<T0, T1>) {
    this.$fullTypeName = composeSuiType(
      Field.$typeName,
      ...typeArgs
    ) as `${typeof PKG_V19}::dynamic_field::Field<${ToTypeStr<T0>}, ${ToTypeStr<T1>}>`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.name = fields.name
    this.value = fields.value
  }

  static reified<T0 extends Reified<TypeArgument, any>, T1 extends Reified<TypeArgument, any>>(
    T0: T0,
    T1: T1
  ): FieldReified<ToTypeArgument<T0>, ToTypeArgument<T1>> {
    return {
      typeName: Field.$typeName,
      fullTypeName: composeSuiType(
        Field.$typeName,
        ...[extractType(T0), extractType(T1)]
      ) as `${typeof PKG_V19}::dynamic_field::Field<${ToTypeStr<ToTypeArgument<T0>>}, ${ToTypeStr<
        ToTypeArgument<T1>
      >}>`,
      typeArgs: [extractType(T0), extractType(T1)] as [
        ToTypeStr<ToTypeArgument<T0>>,
        ToTypeStr<ToTypeArgument<T1>>,
      ],
      reifiedTypeArgs: [T0, T1],
      fromFields: (fields: Record<string, any>) => Field.fromFields([T0, T1], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Field.fromFieldsWithTypes([T0, T1], item),
      fromBcs: (data: Uint8Array) => Field.fromBcs([T0, T1], data),
      bcs: Field.bcs(toBcs(T0), toBcs(T1)),
      fromJSONField: (field: any) => Field.fromJSONField([T0, T1], field),
      fromJSON: (json: Record<string, any>) => Field.fromJSON([T0, T1], json),
      fromSuiParsedData: (content: SuiParsedData) => Field.fromSuiParsedData([T0, T1], content),
      fetch: async (client: SuiClient, id: string) => Field.fetch(client, [T0, T1], id),
      new: (fields: FieldFields<ToTypeArgument<T0>, ToTypeArgument<T1>>) => {
        return new Field([extractType(T0), extractType(T1)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Field.reified
  }

  static phantom<T0 extends Reified<TypeArgument, any>, T1 extends Reified<TypeArgument, any>>(
    T0: T0,
    T1: T1
  ): PhantomReified<ToTypeStr<Field<ToTypeArgument<T0>, ToTypeArgument<T1>>>> {
    return phantom(Field.reified(T0, T1))
  }
  static get p() {
    return Field.phantom
  }

  static get bcs() {
    return <T0 extends BcsType<any>, T1 extends BcsType<any>>(T0: T0, T1: T1) =>
      bcs.struct(`Field<${T0.name}, ${T1.name}>`, {
        id: UID.bcs,
        name: T0,
        value: T1,
      })
  }

  static fromFields<T0 extends Reified<TypeArgument, any>, T1 extends Reified<TypeArgument, any>>(
    typeArgs: [T0, T1],
    fields: Record<string, any>
  ): Field<ToTypeArgument<T0>, ToTypeArgument<T1>> {
    return Field.reified(typeArgs[0], typeArgs[1]).new({
      id: decodeFromFields(UID.reified(), fields.id),
      name: decodeFromFields(typeArgs[0], fields.name),
      value: decodeFromFields(typeArgs[1], fields.value),
    })
  }

  static fromFieldsWithTypes<
    T0 extends Reified<TypeArgument, any>,
    T1 extends Reified<TypeArgument, any>,
  >(typeArgs: [T0, T1], item: FieldsWithTypes): Field<ToTypeArgument<T0>, ToTypeArgument<T1>> {
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

  static fromBcs<T0 extends Reified<TypeArgument, any>, T1 extends Reified<TypeArgument, any>>(
    typeArgs: [T0, T1],
    data: Uint8Array
  ): Field<ToTypeArgument<T0>, ToTypeArgument<T1>> {
    return Field.fromFields(typeArgs, Field.bcs(toBcs(typeArgs[0]), toBcs(typeArgs[1])).parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
      name: fieldToJSON<T0>(this.$typeArgs[0], this.name),
      value: fieldToJSON<T1>(this.$typeArgs[1], this.value),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<
    T0 extends Reified<TypeArgument, any>,
    T1 extends Reified<TypeArgument, any>,
  >(typeArgs: [T0, T1], field: any): Field<ToTypeArgument<T0>, ToTypeArgument<T1>> {
    return Field.reified(typeArgs[0], typeArgs[1]).new({
      id: decodeFromJSONField(UID.reified(), field.id),
      name: decodeFromJSONField(typeArgs[0], field.name),
      value: decodeFromJSONField(typeArgs[1], field.value),
    })
  }

  static fromJSON<T0 extends Reified<TypeArgument, any>, T1 extends Reified<TypeArgument, any>>(
    typeArgs: [T0, T1],
    json: Record<string, any>
  ): Field<ToTypeArgument<T0>, ToTypeArgument<T1>> {
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

  static fromSuiParsedData<
    T0 extends Reified<TypeArgument, any>,
    T1 extends Reified<TypeArgument, any>,
  >(typeArgs: [T0, T1], content: SuiParsedData): Field<ToTypeArgument<T0>, ToTypeArgument<T1>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isField(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Field object`)
    }
    return Field.fromFieldsWithTypes(typeArgs, content)
  }

  static async fetch<T0 extends Reified<TypeArgument, any>, T1 extends Reified<TypeArgument, any>>(
    client: SuiClient,
    typeArgs: [T0, T1],
    id: string
  ): Promise<Field<ToTypeArgument<T0>, ToTypeArgument<T1>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching Field object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isField(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a Field object`)
    }
    return Field.fromBcs(typeArgs, fromB64(res.data.bcs.bcsBytes))
  }
}
