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
import { PKG_V32 } from '../index'
import { BcsType, bcs } from '@mysten/sui/bcs'
import { SuiClient, SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromB64 } from '@mysten/sui/utils'

/* ============================== Wrapper =============================== */

export function isWrapper(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`${PKG_V32}::dynamic_object_field::Wrapper` + '<')
}

export interface WrapperFields<Name extends TypeArgument> {
  name: ToField<Name>
}

export type WrapperReified<Name extends TypeArgument> = Reified<Wrapper<Name>, WrapperFields<Name>>

export class Wrapper<Name extends TypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `${PKG_V32}::dynamic_object_field::Wrapper`
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [false] as const

  readonly $typeName = Wrapper.$typeName
  readonly $fullTypeName: `${typeof PKG_V32}::dynamic_object_field::Wrapper<${ToTypeStr<Name>}>`
  readonly $typeArgs: [ToTypeStr<Name>]
  readonly $isPhantom = Wrapper.$isPhantom

  readonly name: ToField<Name>

  private constructor(typeArgs: [ToTypeStr<Name>], fields: WrapperFields<Name>) {
    this.$fullTypeName = composeSuiType(
      Wrapper.$typeName,
      ...typeArgs
    ) as `${typeof PKG_V32}::dynamic_object_field::Wrapper<${ToTypeStr<Name>}>`
    this.$typeArgs = typeArgs

    this.name = fields.name
  }

  static reified<Name extends Reified<TypeArgument, any>>(
    Name: Name
  ): WrapperReified<ToTypeArgument<Name>> {
    return {
      typeName: Wrapper.$typeName,
      fullTypeName: composeSuiType(
        Wrapper.$typeName,
        ...[extractType(Name)]
      ) as `${typeof PKG_V32}::dynamic_object_field::Wrapper<${ToTypeStr<ToTypeArgument<Name>>}>`,
      typeArgs: [extractType(Name)] as [ToTypeStr<ToTypeArgument<Name>>],
      isPhantom: Wrapper.$isPhantom,
      reifiedTypeArgs: [Name],
      fromFields: (fields: Record<string, any>) => Wrapper.fromFields(Name, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Wrapper.fromFieldsWithTypes(Name, item),
      fromBcs: (data: Uint8Array) => Wrapper.fromBcs(Name, data),
      bcs: Wrapper.bcs(toBcs(Name)),
      fromJSONField: (field: any) => Wrapper.fromJSONField(Name, field),
      fromJSON: (json: Record<string, any>) => Wrapper.fromJSON(Name, json),
      fromSuiParsedData: (content: SuiParsedData) => Wrapper.fromSuiParsedData(Name, content),
      fromSuiObjectData: (content: SuiObjectData) => Wrapper.fromSuiObjectData(Name, content),
      fetch: async (client: SuiClient, id: string) => Wrapper.fetch(client, Name, id),
      new: (fields: WrapperFields<ToTypeArgument<Name>>) => {
        return new Wrapper([extractType(Name)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Wrapper.reified
  }

  static phantom<Name extends Reified<TypeArgument, any>>(
    Name: Name
  ): PhantomReified<ToTypeStr<Wrapper<ToTypeArgument<Name>>>> {
    return phantom(Wrapper.reified(Name))
  }
  static get p() {
    return Wrapper.phantom
  }

  static get bcs() {
    return <Name extends BcsType<any>>(Name: Name) =>
      bcs.struct(`Wrapper<${Name.name}>`, {
        name: Name,
      })
  }

  static fromFields<Name extends Reified<TypeArgument, any>>(
    typeArg: Name,
    fields: Record<string, any>
  ): Wrapper<ToTypeArgument<Name>> {
    return Wrapper.reified(typeArg).new({ name: decodeFromFields(typeArg, fields.name) })
  }

  static fromFieldsWithTypes<Name extends Reified<TypeArgument, any>>(
    typeArg: Name,
    item: FieldsWithTypes
  ): Wrapper<ToTypeArgument<Name>> {
    if (!isWrapper(item.type)) {
      throw new Error('not a Wrapper type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Wrapper.reified(typeArg).new({
      name: decodeFromFieldsWithTypes(typeArg, item.fields.name),
    })
  }

  static fromBcs<Name extends Reified<TypeArgument, any>>(
    typeArg: Name,
    data: Uint8Array
  ): Wrapper<ToTypeArgument<Name>> {
    const typeArgs = [typeArg]

    return Wrapper.fromFields(typeArg, Wrapper.bcs(toBcs(typeArgs[0])).parse(data))
  }

  toJSONField() {
    return {
      name: fieldToJSON<Name>(this.$typeArgs[0], this.name),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<Name extends Reified<TypeArgument, any>>(
    typeArg: Name,
    field: any
  ): Wrapper<ToTypeArgument<Name>> {
    return Wrapper.reified(typeArg).new({ name: decodeFromJSONField(typeArg, field.name) })
  }

  static fromJSON<Name extends Reified<TypeArgument, any>>(
    typeArg: Name,
    json: Record<string, any>
  ): Wrapper<ToTypeArgument<Name>> {
    if (json.$typeName !== Wrapper.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Wrapper.$typeName, extractType(typeArg)),
      json.$typeArgs,
      [typeArg]
    )

    return Wrapper.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<Name extends Reified<TypeArgument, any>>(
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

  static fromSuiObjectData<Name extends Reified<TypeArgument, any>>(
    typeArg: Name,
    data: SuiObjectData
  ): Wrapper<ToTypeArgument<Name>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isWrapper(data.bcs.type)) {
        throw new Error(`object at is not a Wrapper object`)
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs
      if (gotTypeArgs.length !== 1) {
        throw new Error(
          `type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`
        )
      }
      const gotTypeArg = compressSuiType(gotTypeArgs[0])
      const expectedTypeArg = compressSuiType(extractType(typeArg))
      if (gotTypeArg !== compressSuiType(extractType(typeArg))) {
        throw new Error(
          `type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`
        )
      }

      return Wrapper.fromBcs(typeArg, fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Wrapper.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<Name extends Reified<TypeArgument, any>>(
    client: SuiClient,
    typeArg: Name,
    id: string
  ): Promise<Wrapper<ToTypeArgument<Name>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching Wrapper object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isWrapper(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a Wrapper object`)
    }

    return Wrapper.fromSuiObjectData(typeArg, res.data)
  }
}
