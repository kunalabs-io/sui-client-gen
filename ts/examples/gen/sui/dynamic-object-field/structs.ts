/**
 * Similar to `sui::dynamic_field`, this module allows for the access of dynamic fields. But
 * unlike, `sui::dynamic_field` the values bound to these dynamic fields _must_ be objects
 * themselves. This allows for the objects to still exist within in storage, which may be important
 * for external tools. The difference is otherwise not observable from within Move.
 */

import { bcs, BcsType } from '@mysten/sui/bcs'
import type { ClientWithCoreApi, SuiClientTypes } from '@mysten/sui/client'
import {
  assertFieldsWithTypesArgsMatch,
  assertReifiedTypeArgsMatch,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  extractType,
  fieldToJSON,
  phantom,
  PhantomReified,
  Reified,
  StructClass,
  toBcs,
  ToField,
  ToJSON,
  ToTypeArgument,
  ToTypeStr,
  TypeArgument,
} from '../../_framework/reified'
import {
  composeSuiType,
  compressSuiType,
  FieldsWithTypes,
  parseTypeName,
} from '../../_framework/util'

/* ============================== Wrapper =============================== */

export function isWrapper(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::dynamic_object_field::Wrapper` + '<')
}

export interface WrapperFields<Name extends TypeArgument> {
  name: ToField<Name>
}

export type WrapperReified<Name extends TypeArgument> = Reified<Wrapper<Name>, WrapperFields<Name>>

export type WrapperJSONField<Name extends TypeArgument> = {
  name: ToJSON<Name>
}

export type WrapperJSON<Name extends TypeArgument> = {
  $typeName: typeof Wrapper.$typeName
  $typeArgs: [ToTypeStr<Name>]
} & WrapperJSONField<Name>

export class Wrapper<Name extends TypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::dynamic_object_field::Wrapper` =
    `0x2::dynamic_object_field::Wrapper` as const
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [false] as const

  readonly $typeName: typeof Wrapper.$typeName = Wrapper.$typeName
  readonly $fullTypeName: `0x2::dynamic_object_field::Wrapper<${ToTypeStr<Name>}>`
  readonly $typeArgs: [ToTypeStr<Name>]
  readonly $isPhantom: typeof Wrapper.$isPhantom = Wrapper.$isPhantom

  readonly name: ToField<Name>

  private constructor(typeArgs: [ToTypeStr<Name>], fields: WrapperFields<Name>) {
    this.$fullTypeName = composeSuiType(
      Wrapper.$typeName,
      ...typeArgs,
    ) as `0x2::dynamic_object_field::Wrapper<${ToTypeStr<Name>}>`
    this.$typeArgs = typeArgs

    this.name = fields.name
  }

  static reified<Name extends Reified<TypeArgument, any>>(
    Name: Name,
  ): WrapperReified<ToTypeArgument<Name>> {
    const reifiedBcs = Wrapper.bcs(toBcs(Name))
    return {
      get typeName() {
        return Wrapper.$typeName
      },
      get fullTypeName() {
        return composeSuiType(
          Wrapper.$typeName,
          ...[extractType(Name)],
        ) as `0x2::dynamic_object_field::Wrapper<${ToTypeStr<ToTypeArgument<Name>>}>`
      },
      get typeArgs() {
        return [extractType(Name)] as [ToTypeStr<ToTypeArgument<Name>>]
      },
      isPhantom: Wrapper.$isPhantom,
      reifiedTypeArgs: [Name],
      fromFields: (fields: Record<string, any>) => Wrapper.fromFields(Name, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Wrapper.fromFieldsWithTypes(Name, item),
      fromBcs: (data: Uint8Array) => Wrapper.fromFields(Name, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => Wrapper.fromJSONField(Name, field),
      fromJSON: (json: Record<string, any>) => Wrapper.fromJSON(Name, json),
      fromCoreObject: (obj: SuiClientTypes.Object<{ content: true }>) =>
        Wrapper.fromCoreObject(Name, obj),
      fetch: async (client: ClientWithCoreApi, id: string) => Wrapper.fetch(client, Name, id),
      new: (fields: WrapperFields<ToTypeArgument<Name>>) => {
        return new Wrapper([extractType(Name)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): typeof Wrapper.reified {
    return Wrapper.reified
  }

  static phantom<Name extends Reified<TypeArgument, any>>(
    Name: Name,
  ): PhantomReified<ToTypeStr<Wrapper<ToTypeArgument<Name>>>> {
    return phantom(Wrapper.reified(Name))
  }

  static get p(): typeof Wrapper.phantom {
    return Wrapper.phantom
  }

  private static instantiateBcs() {
    return <Name extends BcsType<any>>(Name: Name) =>
      bcs.struct(`Wrapper<${Name.name}>`, {
        name: Name,
      })
  }

  private static cachedBcs: ReturnType<typeof Wrapper.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof Wrapper.instantiateBcs> {
    if (!Wrapper.cachedBcs) {
      Wrapper.cachedBcs = Wrapper.instantiateBcs()
    }
    return Wrapper.cachedBcs
  }

  static fromFields<Name extends Reified<TypeArgument, any>>(
    typeArg: Name,
    fields: Record<string, any>,
  ): Wrapper<ToTypeArgument<Name>> {
    return Wrapper.reified(typeArg).new({
      name: decodeFromFields(typeArg, fields.name),
    })
  }

  static fromFieldsWithTypes<Name extends Reified<TypeArgument, any>>(
    typeArg: Name,
    item: FieldsWithTypes,
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
    data: Uint8Array,
  ): Wrapper<ToTypeArgument<Name>> {
    const typeArgs = [typeArg]
    return Wrapper.fromFields(typeArg, Wrapper.bcs(toBcs(typeArg)).parse(data))
  }

  toJSONField(): WrapperJSONField<Name> {
    return {
      name: fieldToJSON<Name>(`${this.$typeArgs[0]}`, this.name),
    }
  }

  toJSON(): WrapperJSON<Name> {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<Name extends Reified<TypeArgument, any>>(
    typeArg: Name,
    field: any,
  ): Wrapper<ToTypeArgument<Name>> {
    return Wrapper.reified(typeArg).new({
      name: decodeFromJSONField(typeArg, field.name),
    })
  }

  static fromJSON<Name extends Reified<TypeArgument, any>>(
    typeArg: Name,
    json: Record<string, any>,
  ): Wrapper<ToTypeArgument<Name>> {
    if (json.$typeName !== Wrapper.$typeName) {
      throw new Error(
        `not a Wrapper json object: expected '${Wrapper.$typeName}' but got '${json.$typeName}'`,
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Wrapper.$typeName, ...[extractType(typeArg)]),
      json.$typeArgs,
      [typeArg],
    )

    return Wrapper.fromJSONField(typeArg, json)
  }

  static fromCoreObject<Name extends Reified<TypeArgument, any>>(
    typeArg: Name,
    obj: SuiClientTypes.Object<{ content: true }>,
  ): Wrapper<ToTypeArgument<Name>> {
    if (!isWrapper(obj.type)) {
      throw new Error(`object at ${obj.objectId} is not a Wrapper object`)
    }

    const gotTypeArgs = parseTypeName(obj.type).typeArgs
    if (gotTypeArgs.length !== 1) {
      throw new Error(
        `type argument mismatch: expected 1 type arguments but got '${gotTypeArgs.length}'`,
      )
    }
    for (let i = 0; i < 1; i++) {
      const gotTypeArg = compressSuiType(gotTypeArgs[i])
      const expectedTypeArg = compressSuiType(extractType([typeArg][i]))
      if (gotTypeArg !== expectedTypeArg) {
        throw new Error(
          `type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`,
        )
      }
    }

    return Wrapper.fromBcs(typeArg, obj.content)
  }

  static async fetch<Name extends Reified<TypeArgument, any>>(
    client: ClientWithCoreApi,
    typeArg: Name,
    id: string,
  ): Promise<Wrapper<ToTypeArgument<Name>>> {
    const { object } = await client.core.getObject({
      objectId: id,
      include: { content: true },
    })
    if (!isWrapper(object.type)) {
      throw new Error(`object at id ${id} is not a Wrapper object`)
    }

    const gotTypeArgs = parseTypeName(object.type).typeArgs
    if (gotTypeArgs.length !== 1) {
      throw new Error(
        `type argument mismatch: expected 1 type arguments but got '${gotTypeArgs.length}'`,
      )
    }
    for (let i = 0; i < 1; i++) {
      const gotTypeArg = compressSuiType(gotTypeArgs[i])
      const expectedTypeArg = compressSuiType(extractType([typeArg][i]))
      if (gotTypeArg !== expectedTypeArg) {
        throw new Error(
          `type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`,
        )
      }
    }

    return Wrapper.fromBcs(typeArg, object.content)
  }
}
