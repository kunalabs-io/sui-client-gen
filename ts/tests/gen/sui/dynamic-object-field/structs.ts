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
import { BcsType, bcs } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== Wrapper =============================== */

export function isWrapper(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::dynamic_object_field::Wrapper<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface WrapperFields<Name extends TypeArgument> {
  name: ToField<Name>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Wrapper<Name extends TypeArgument> {
  static readonly $typeName = '0x2::dynamic_object_field::Wrapper'
  static readonly $numTypeParams = 1

  readonly $fullTypeName =
    null as unknown as `0x2::dynamic_object_field::Wrapper<${ToTypeStr<Name>}>`

  readonly $typeName = Wrapper.$typeName

  static get bcs() {
    return <Name extends BcsType<any>>(Name: Name) =>
      bcs.struct(`Wrapper<${Name.name}>`, {
        name: Name,
      })
  }

  readonly $typeArg: string

  readonly name: ToField<Name>

  private constructor(typeArg: string, name: ToField<Name>) {
    this.$typeArg = typeArg

    this.name = name
  }

  static new<Name extends Reified<TypeArgument>>(
    typeArg: Name,
    name: ToField<ToTypeArgument<Name>>
  ): Wrapper<ToTypeArgument<Name>> {
    return new Wrapper(extractType(typeArg), name)
  }

  static reified<Name extends Reified<TypeArgument>>(
    Name: Name
  ): Reified<Wrapper<ToTypeArgument<Name>>> {
    return {
      typeName: Wrapper.$typeName,
      fullTypeName: composeSuiType(
        Wrapper.$typeName,
        ...[extractType(Name)]
      ) as `0x2::dynamic_object_field::Wrapper<${ToTypeStr<ToTypeArgument<Name>>}>`,
      typeArgs: [Name],
      fromFields: (fields: Record<string, any>) => Wrapper.fromFields(Name, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Wrapper.fromFieldsWithTypes(Name, item),
      fromBcs: (data: Uint8Array) => Wrapper.fromBcs(Name, data),
      bcs: Wrapper.bcs(toBcs(Name)),
      fromJSONField: (field: any) => Wrapper.fromJSONField(Name, field),
      fetch: async (client: SuiClient, id: string) => Wrapper.fetch(client, Name, id),
      kind: 'StructClassReified',
    }
  }

  static fromFields<Name extends Reified<TypeArgument>>(
    typeArg: Name,
    fields: Record<string, any>
  ): Wrapper<ToTypeArgument<Name>> {
    return Wrapper.new(typeArg, decodeFromFields(typeArg, fields.name))
  }

  static fromFieldsWithTypes<Name extends Reified<TypeArgument>>(
    typeArg: Name,
    item: FieldsWithTypes
  ): Wrapper<ToTypeArgument<Name>> {
    if (!isWrapper(item.type)) {
      throw new Error('not a Wrapper type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Wrapper.new(typeArg, decodeFromFieldsWithTypes(typeArg, item.fields.name))
  }

  static fromBcs<Name extends Reified<TypeArgument>>(
    typeArg: Name,
    data: Uint8Array
  ): Wrapper<ToTypeArgument<Name>> {
    const typeArgs = [typeArg]

    return Wrapper.fromFields(typeArg, Wrapper.bcs(toBcs(typeArgs[0])).parse(data))
  }

  toJSONField() {
    return {
      name: fieldToJSON<Name>(this.$typeArg, this.name),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArg: this.$typeArg, ...this.toJSONField() }
  }

  static fromJSONField<Name extends Reified<TypeArgument>>(
    typeArg: Name,
    field: any
  ): Wrapper<ToTypeArgument<Name>> {
    return Wrapper.new(typeArg, decodeFromJSONField(typeArg, field.name))
  }

  static fromJSON<Name extends Reified<TypeArgument>>(
    typeArg: Name,
    json: Record<string, any>
  ): Wrapper<ToTypeArgument<Name>> {
    if (json.$typeName !== Wrapper.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Wrapper.$typeName, extractType(typeArg)),
      [json.$typeArg],
      [typeArg]
    )

    return Wrapper.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<Name extends Reified<TypeArgument>>(
    typeArg: Name,
    content: SuiParsedData
  ): Wrapper<ToTypeArgument<Name>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isWrapper(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Wrapper object`)
    }
    return Wrapper.fromFieldsWithTypes(typeArg, content)
  }

  static async fetch<Name extends Reified<TypeArgument>>(
    client: SuiClient,
    typeArg: Name,
    id: string
  ): Promise<Wrapper<ToTypeArgument<Name>>> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching Wrapper object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isWrapper(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a Wrapper object`)
    }
    return Wrapper.fromFieldsWithTypes(typeArg, res.data.content)
  }
}
