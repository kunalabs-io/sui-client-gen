import * as reified from '../../_framework/reified'
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
  fieldToJSON,
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
import { fromB64, fromHEX, toHEX } from '@mysten/sui/utils'

/* ============================== Withdrawal =============================== */

export function isWithdrawal(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::funds_accumulator::Withdrawal` + '<')
}

export interface WithdrawalFields<T0 extends PhantomTypeArgument> {
  owner: ToField<'address'>
  limit: ToField<'u256'>
}

export type WithdrawalReified<T0 extends PhantomTypeArgument> = Reified<
  Withdrawal<T0>,
  WithdrawalFields<T0>
>

export class Withdrawal<T0 extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::funds_accumulator::Withdrawal`
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName = Withdrawal.$typeName
  readonly $fullTypeName: `0x2::funds_accumulator::Withdrawal<${PhantomToTypeStr<T0>}>`
  readonly $typeArgs: [PhantomToTypeStr<T0>]
  readonly $isPhantom = Withdrawal.$isPhantom

  readonly owner: ToField<'address'>
  readonly limit: ToField<'u256'>

  private constructor(typeArgs: [PhantomToTypeStr<T0>], fields: WithdrawalFields<T0>) {
    this.$fullTypeName = composeSuiType(
      Withdrawal.$typeName,
      ...typeArgs
    ) as `0x2::funds_accumulator::Withdrawal<${PhantomToTypeStr<T0>}>`
    this.$typeArgs = typeArgs

    this.owner = fields.owner
    this.limit = fields.limit
  }

  static reified<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): WithdrawalReified<ToPhantomTypeArgument<T0>> {
    const reifiedBcs = Withdrawal.bcs
    return {
      typeName: Withdrawal.$typeName,
      fullTypeName: composeSuiType(
        Withdrawal.$typeName,
        ...[extractType(T0)]
      ) as `0x2::funds_accumulator::Withdrawal<${PhantomToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [extractType(T0)] as [PhantomToTypeStr<ToPhantomTypeArgument<T0>>],
      isPhantom: Withdrawal.$isPhantom,
      reifiedTypeArgs: [T0],
      fromFields: (fields: Record<string, any>) => Withdrawal.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Withdrawal.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => Withdrawal.fromFields(T0, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => Withdrawal.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => Withdrawal.fromJSON(T0, json),
      fromSuiParsedData: (content: SuiParsedData) => Withdrawal.fromSuiParsedData(T0, content),
      fromSuiObjectData: (content: SuiObjectData) => Withdrawal.fromSuiObjectData(T0, content),
      fetch: async (client: SuiClient, id: string) => Withdrawal.fetch(client, T0, id),
      new: (fields: WithdrawalFields<ToPhantomTypeArgument<T0>>) => {
        return new Withdrawal([extractType(T0)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Withdrawal.reified
  }

  static phantom<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): PhantomReified<ToTypeStr<Withdrawal<ToPhantomTypeArgument<T0>>>> {
    return phantom(Withdrawal.reified(T0))
  }

  static get p() {
    return Withdrawal.phantom
  }

  private static instantiateBcs() {
    return bcs.struct('Withdrawal', {
      owner: bcs.bytes(32).transform({
        input: (val: string) => fromHEX(val),
        output: (val: Uint8Array) => toHEX(val),
      }),
      limit: bcs.u256(),
    })
  }

  private static cachedBcs: ReturnType<typeof Withdrawal.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof Withdrawal.instantiateBcs> {
    if (!Withdrawal.cachedBcs) {
      Withdrawal.cachedBcs = Withdrawal.instantiateBcs()
    }
    return Withdrawal.cachedBcs
  }

  static fromFields<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    fields: Record<string, any>
  ): Withdrawal<ToPhantomTypeArgument<T0>> {
    return Withdrawal.reified(typeArg).new({
      owner: decodeFromFields('address', fields.owner),
      limit: decodeFromFields('u256', fields.limit),
    })
  }

  static fromFieldsWithTypes<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    item: FieldsWithTypes
  ): Withdrawal<ToPhantomTypeArgument<T0>> {
    if (!isWithdrawal(item.type)) {
      throw new Error('not a Withdrawal type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Withdrawal.reified(typeArg).new({
      owner: decodeFromFieldsWithTypes('address', item.fields.owner),
      limit: decodeFromFieldsWithTypes('u256', item.fields.limit),
    })
  }

  static fromBcs<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: Uint8Array
  ): Withdrawal<ToPhantomTypeArgument<T0>> {
    return Withdrawal.fromFields(typeArg, Withdrawal.bcs.parse(data))
  }

  toJSONField() {
    return {
      owner: this.owner,
      limit: this.limit.toString(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    field: any
  ): Withdrawal<ToPhantomTypeArgument<T0>> {
    return Withdrawal.reified(typeArg).new({
      owner: decodeFromJSONField('address', field.owner),
      limit: decodeFromJSONField('u256', field.limit),
    })
  }

  static fromJSON<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    json: Record<string, any>
  ): Withdrawal<ToPhantomTypeArgument<T0>> {
    if (json.$typeName !== Withdrawal.$typeName) {
      throw new Error(
        `not a Withdrawal json object: expected '${Withdrawal.$typeName}' but got '${json.$typeName}'`
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Withdrawal.$typeName, ...[extractType(typeArg)]),
      json.$typeArgs,
      [typeArg]
    )

    return Withdrawal.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    content: SuiParsedData
  ): Withdrawal<ToPhantomTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isWithdrawal(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Withdrawal object`)
    }
    return Withdrawal.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: SuiObjectData
  ): Withdrawal<ToPhantomTypeArgument<T0>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isWithdrawal(data.bcs.type)) {
        throw new Error(`object at is not a Withdrawal object`)
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

      return Withdrawal.fromBcs(typeArg, fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Withdrawal.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<T0 extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<Withdrawal<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching Withdrawal object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isWithdrawal(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a Withdrawal object`)
    }

    return Withdrawal.fromSuiObjectData(typeArg, res.data)
  }
}
