/**
 * Defines the `Permit` type, which can be used to constrain the logic of a
 * generic function to be authorized only by the module that defines the type
 * parameter.
 *
 * ```move
 * module example::use_permit;
 *
 * public struct MyType { /* ... *\/ }
 *
 * public fun test_permit() {
 * let permit = internal::permit<MyType>();
 * /* external_module::call_with_permit(permit); *\/
 * }
 * ```
 *
 * To write a function that is guarded by a `Permit`, require it as an argument.
 *
 * ```move
 * // Silly mockup of a type registry where a type can be registered only by
 * // the module that defines the type.
 * module example::type_registry;
 *
 * public fun register_type<T>(_: internal::Permit<T> /* ... *\/) {
 * /* ... *\/
 * }
 * ```
 */

import { bcs } from '@mysten/sui/bcs'
import { SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromBase64 } from '@mysten/sui/utils'
import {
  assertFieldsWithTypesArgsMatch,
  assertReifiedTypeArgsMatch,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  extractType,
  phantom,
  PhantomReified,
  PhantomToTypeStr,
  PhantomTypeArgument,
  Reified,
  StructClass,
  ToField,
  ToJSON,
  ToPhantomTypeArgument,
  ToTypeStr,
} from '../../../_framework/reified'
import {
  composeSuiType,
  compressSuiType,
  fetchObjectBcs,
  FieldsWithTypes,
  parseTypeName,
  SupportedSuiClient,
} from '../../../_framework/util'

/* ============================== Permit =============================== */

export function isPermit(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x1::internal::Permit` + '<')
}

export interface PermitFields<T extends PhantomTypeArgument> {
  dummyField: ToField<'bool'>
}

export type PermitReified<T extends PhantomTypeArgument> = Reified<Permit<T>, PermitFields<T>>

export type PermitJSONField<T extends PhantomTypeArgument> = {
  dummyField: boolean
}

export type PermitJSON<T extends PhantomTypeArgument> = {
  $typeName: typeof Permit.$typeName
  $typeArgs: [PhantomToTypeStr<T>]
} & PermitJSONField<T>

/**
 * A privileged witness of the `T` type.
 * Instances can only be created by the module that defines the type `T`.
 */
export class Permit<T extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x1::internal::Permit` = `0x1::internal::Permit` as const
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName: typeof Permit.$typeName = Permit.$typeName
  readonly $fullTypeName: `0x1::internal::Permit<${PhantomToTypeStr<T>}>`
  readonly $typeArgs: [PhantomToTypeStr<T>]
  readonly $isPhantom: typeof Permit.$isPhantom = Permit.$isPhantom

  readonly dummyField: ToField<'bool'>

  private constructor(typeArgs: [PhantomToTypeStr<T>], fields: PermitFields<T>) {
    this.$fullTypeName = composeSuiType(
      Permit.$typeName,
      ...typeArgs,
    ) as `0x1::internal::Permit<${PhantomToTypeStr<T>}>`
    this.$typeArgs = typeArgs

    this.dummyField = fields.dummyField
  }

  static reified<T extends PhantomReified<PhantomTypeArgument>>(
    T: T,
  ): PermitReified<ToPhantomTypeArgument<T>> {
    const reifiedBcs = Permit.bcs
    return {
      typeName: Permit.$typeName,
      fullTypeName: composeSuiType(
        Permit.$typeName,
        ...[extractType(T)],
      ) as `0x1::internal::Permit<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`,
      typeArgs: [extractType(T)] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>],
      isPhantom: Permit.$isPhantom,
      reifiedTypeArgs: [T],
      fromFields: (fields: Record<string, any>) => Permit.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Permit.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => Permit.fromFields(T, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => Permit.fromJSONField(T, field),
      fromJSON: (json: Record<string, any>) => Permit.fromJSON(T, json),
      fromSuiParsedData: (content: SuiParsedData) => Permit.fromSuiParsedData(T, content),
      fromSuiObjectData: (content: SuiObjectData) => Permit.fromSuiObjectData(T, content),
      fetch: async (client: SupportedSuiClient, id: string) => Permit.fetch(client, T, id),
      new: (fields: PermitFields<ToPhantomTypeArgument<T>>) => {
        return new Permit([extractType(T)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): typeof Permit.reified {
    return Permit.reified
  }

  static phantom<T extends PhantomReified<PhantomTypeArgument>>(
    T: T,
  ): PhantomReified<ToTypeStr<Permit<ToPhantomTypeArgument<T>>>> {
    return phantom(Permit.reified(T))
  }

  static get p(): typeof Permit.phantom {
    return Permit.phantom
  }

  private static instantiateBcs() {
    return bcs.struct('Permit', {
      dummy_field: bcs.bool(),
    })
  }

  private static cachedBcs: ReturnType<typeof Permit.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof Permit.instantiateBcs> {
    if (!Permit.cachedBcs) {
      Permit.cachedBcs = Permit.instantiateBcs()
    }
    return Permit.cachedBcs
  }

  static fromFields<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    fields: Record<string, any>,
  ): Permit<ToPhantomTypeArgument<T>> {
    return Permit.reified(typeArg).new({
      dummyField: decodeFromFields('bool', fields.dummy_field),
    })
  }

  static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    item: FieldsWithTypes,
  ): Permit<ToPhantomTypeArgument<T>> {
    if (!isPermit(item.type)) {
      throw new Error('not a Permit type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Permit.reified(typeArg).new({
      dummyField: decodeFromFieldsWithTypes('bool', item.fields.dummy_field),
    })
  }

  static fromBcs<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    data: Uint8Array,
  ): Permit<ToPhantomTypeArgument<T>> {
    return Permit.fromFields(typeArg, Permit.bcs.parse(data))
  }

  toJSONField(): PermitJSONField<T> {
    return {
      dummyField: this.dummyField,
    }
  }

  toJSON(): PermitJSON<T> {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    field: any,
  ): Permit<ToPhantomTypeArgument<T>> {
    return Permit.reified(typeArg).new({
      dummyField: decodeFromJSONField('bool', field.dummyField),
    })
  }

  static fromJSON<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    json: Record<string, any>,
  ): Permit<ToPhantomTypeArgument<T>> {
    if (json.$typeName !== Permit.$typeName) {
      throw new Error(
        `not a Permit json object: expected '${Permit.$typeName}' but got '${json.$typeName}'`,
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Permit.$typeName, ...[extractType(typeArg)]),
      json.$typeArgs,
      [typeArg],
    )

    return Permit.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    content: SuiParsedData,
  ): Permit<ToPhantomTypeArgument<T>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isPermit(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Permit object`)
    }
    return Permit.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    data: SuiObjectData,
  ): Permit<ToPhantomTypeArgument<T>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isPermit(data.bcs.type)) {
        throw new Error(`object at is not a Permit object`)
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs
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

      return Permit.fromBcs(typeArg, fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Permit.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.',
    )
  }

  static async fetch<T extends PhantomReified<PhantomTypeArgument>>(
    client: SupportedSuiClient,
    typeArg: T,
    id: string,
  ): Promise<Permit<ToPhantomTypeArgument<T>>> {
    const res = await fetchObjectBcs(client, id)
    if (!isPermit(res.type)) {
      throw new Error(`object at id ${id} is not a Permit object`)
    }

    const gotTypeArgs = parseTypeName(res.type).typeArgs
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

    return Permit.fromBcs(typeArg, res.bcsBytes)
  }
}
