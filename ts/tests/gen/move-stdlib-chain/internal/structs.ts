import {
  PhantomReified,
  PhantomToTypeStr,
  PhantomTypeArgument,
  Reified,
  StructClass,
  ToField,
  ToPhantomTypeArgument,
  ToTypeStr,
  assertFieldsWithTypesArgsMatch,
  assertReifiedTypeArgsMatch,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  extractType,
  phantom,
} from '../../_framework/reified'
import {
  FieldsWithTypes,
  composeSuiType,
  compressSuiType,
  parseTypeName,
} from '../../_framework/util'
import { bcs } from '@mysten/sui/bcs'
import { SuiClient, SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromBase64 } from '@mysten/sui/utils'

/* ============================== Permit =============================== */

export function isPermit(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x1::internal::Permit` + '<')
}

export interface PermitFields<T0 extends PhantomTypeArgument> {
  dummyField: ToField<'bool'>
}

export type PermitReified<T0 extends PhantomTypeArgument> = Reified<Permit<T0>, PermitFields<T0>>

export class Permit<T0 extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x1::internal::Permit`
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName = Permit.$typeName
  readonly $fullTypeName: `0x1::internal::Permit<${PhantomToTypeStr<T0>}>`
  readonly $typeArgs: [PhantomToTypeStr<T0>]
  readonly $isPhantom = Permit.$isPhantom

  readonly dummyField: ToField<'bool'>

  private constructor(typeArgs: [PhantomToTypeStr<T0>], fields: PermitFields<T0>) {
    this.$fullTypeName = composeSuiType(
      Permit.$typeName,
      ...typeArgs
    ) as `0x1::internal::Permit<${PhantomToTypeStr<T0>}>`
    this.$typeArgs = typeArgs

    this.dummyField = fields.dummyField
  }

  static reified<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): PermitReified<ToPhantomTypeArgument<T0>> {
    const reifiedBcs = Permit.bcs
    return {
      typeName: Permit.$typeName,
      fullTypeName: composeSuiType(
        Permit.$typeName,
        ...[extractType(T0)]
      ) as `0x1::internal::Permit<${PhantomToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [extractType(T0)] as [PhantomToTypeStr<ToPhantomTypeArgument<T0>>],
      isPhantom: Permit.$isPhantom,
      reifiedTypeArgs: [T0],
      fromFields: (fields: Record<string, any>) => Permit.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Permit.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => Permit.fromFields(T0, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => Permit.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => Permit.fromJSON(T0, json),
      fromSuiParsedData: (content: SuiParsedData) => Permit.fromSuiParsedData(T0, content),
      fromSuiObjectData: (content: SuiObjectData) => Permit.fromSuiObjectData(T0, content),
      fetch: async (client: SuiClient, id: string) => Permit.fetch(client, T0, id),
      new: (fields: PermitFields<ToPhantomTypeArgument<T0>>) => {
        return new Permit([extractType(T0)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Permit.reified
  }

  static phantom<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): PhantomReified<ToTypeStr<Permit<ToPhantomTypeArgument<T0>>>> {
    return phantom(Permit.reified(T0))
  }

  static get p() {
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

  static fromFields<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    fields: Record<string, any>
  ): Permit<ToPhantomTypeArgument<T0>> {
    return Permit.reified(typeArg).new({
      dummyField: decodeFromFields('bool', fields.dummy_field),
    })
  }

  static fromFieldsWithTypes<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    item: FieldsWithTypes
  ): Permit<ToPhantomTypeArgument<T0>> {
    if (!isPermit(item.type)) {
      throw new Error('not a Permit type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Permit.reified(typeArg).new({
      dummyField: decodeFromFieldsWithTypes('bool', item.fields.dummy_field),
    })
  }

  static fromBcs<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: Uint8Array
  ): Permit<ToPhantomTypeArgument<T0>> {
    return Permit.fromFields(typeArg, Permit.bcs.parse(data))
  }

  toJSONField() {
    return {
      dummyField: this.dummyField,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    field: any
  ): Permit<ToPhantomTypeArgument<T0>> {
    return Permit.reified(typeArg).new({
      dummyField: decodeFromJSONField('bool', field.dummyField),
    })
  }

  static fromJSON<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    json: Record<string, any>
  ): Permit<ToPhantomTypeArgument<T0>> {
    if (json.$typeName !== Permit.$typeName) {
      throw new Error(
        `not a Permit json object: expected '${Permit.$typeName}' but got '${json.$typeName}'`
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Permit.$typeName, ...[extractType(typeArg)]),
      json.$typeArgs,
      [typeArg]
    )

    return Permit.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    content: SuiParsedData
  ): Permit<ToPhantomTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isPermit(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Permit object`)
    }
    return Permit.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: SuiObjectData
  ): Permit<ToPhantomTypeArgument<T0>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isPermit(data.bcs.type)) {
        throw new Error(`object at is not a Permit object`)
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs
      if (gotTypeArgs.length !== 1) {
        throw new Error(
          `type argument mismatch: expected 1 type arguments but got '${gotTypeArgs.length}'`
        )
      }
      for (let i = 0; i < 1; i++) {
        const gotTypeArg = compressSuiType(gotTypeArgs[i])
        const expectedTypeArg = compressSuiType(extractType([typeArg][i]))
        if (gotTypeArg !== expectedTypeArg) {
          throw new Error(
            `type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`
          )
        }
      }

      return Permit.fromBcs(typeArg, fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Permit.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<T0 extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<Permit<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching Permit object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isPermit(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a Permit object`)
    }

    return Permit.fromSuiObjectData(typeArg, res.data)
  }
}
