import {
  PhantomReified,
  PhantomToTypeStr,
  PhantomTypeArgument,
  Reified,
  StructClass,
  ToField,
  ToJSON,
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
  SupportedSuiClient,
  composeSuiType,
  compressSuiType,
  fetchObjectBcs,
  parseTypeName,
} from '../../_framework/util'
import { ID } from '../object/structs'
import { bcs } from '@mysten/sui/bcs'
import { SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromBase64 } from '@mysten/sui/utils'

/* ============================== Receiving =============================== */

export function isReceiving(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::transfer::Receiving` + '<')
}

export interface ReceivingFields<T extends PhantomTypeArgument> {
  id: ToField<ID>
  version: ToField<'u64'>
}

export type ReceivingReified<T extends PhantomTypeArgument> = Reified<
  Receiving<T>,
  ReceivingFields<T>
>

export type ReceivingJSONField<T extends PhantomTypeArgument> = {
  id: string
  version: string
}

export type ReceivingJSON<T extends PhantomTypeArgument> = {
  $typeName: typeof Receiving.$typeName
  $typeArgs: [PhantomToTypeStr<T>]
} & ReceivingJSONField<T>

/**
 * This represents the ability to `receive` an object of type `T`.
 * This type is ephemeral per-transaction and cannot be stored on-chain.
 * This does not represent the obligation to receive the object that it
 * references, but simply the ability to receive the object with object ID
 * `id` at version `version` if you can prove mutable access to the parent
 * object during the transaction.
 * Internals of this struct are opaque outside this module.
 */
export class Receiving<T extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::transfer::Receiving` = `0x2::transfer::Receiving` as const
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName: typeof Receiving.$typeName = Receiving.$typeName
  readonly $fullTypeName: `0x2::transfer::Receiving<${PhantomToTypeStr<T>}>`
  readonly $typeArgs: [PhantomToTypeStr<T>]
  readonly $isPhantom: typeof Receiving.$isPhantom = Receiving.$isPhantom

  readonly id: ToField<ID>
  readonly version: ToField<'u64'>

  private constructor(typeArgs: [PhantomToTypeStr<T>], fields: ReceivingFields<T>) {
    this.$fullTypeName = composeSuiType(
      Receiving.$typeName,
      ...typeArgs
    ) as `0x2::transfer::Receiving<${PhantomToTypeStr<T>}>`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.version = fields.version
  }

  static reified<T extends PhantomReified<PhantomTypeArgument>>(
    T: T
  ): ReceivingReified<ToPhantomTypeArgument<T>> {
    const reifiedBcs = Receiving.bcs
    return {
      typeName: Receiving.$typeName,
      fullTypeName: composeSuiType(
        Receiving.$typeName,
        ...[extractType(T)]
      ) as `0x2::transfer::Receiving<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`,
      typeArgs: [extractType(T)] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>],
      isPhantom: Receiving.$isPhantom,
      reifiedTypeArgs: [T],
      fromFields: (fields: Record<string, any>) => Receiving.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Receiving.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => Receiving.fromFields(T, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => Receiving.fromJSONField(T, field),
      fromJSON: (json: Record<string, any>) => Receiving.fromJSON(T, json),
      fromSuiParsedData: (content: SuiParsedData) => Receiving.fromSuiParsedData(T, content),
      fromSuiObjectData: (content: SuiObjectData) => Receiving.fromSuiObjectData(T, content),
      fetch: async (client: SupportedSuiClient, id: string) => Receiving.fetch(client, T, id),
      new: (fields: ReceivingFields<ToPhantomTypeArgument<T>>) => {
        return new Receiving([extractType(T)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): typeof Receiving.reified {
    return Receiving.reified
  }

  static phantom<T extends PhantomReified<PhantomTypeArgument>>(
    T: T
  ): PhantomReified<ToTypeStr<Receiving<ToPhantomTypeArgument<T>>>> {
    return phantom(Receiving.reified(T))
  }

  static get p(): typeof Receiving.phantom {
    return Receiving.phantom
  }

  private static instantiateBcs() {
    return bcs.struct('Receiving', {
      id: ID.bcs,
      version: bcs.u64(),
    })
  }

  private static cachedBcs: ReturnType<typeof Receiving.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof Receiving.instantiateBcs> {
    if (!Receiving.cachedBcs) {
      Receiving.cachedBcs = Receiving.instantiateBcs()
    }
    return Receiving.cachedBcs
  }

  static fromFields<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    fields: Record<string, any>
  ): Receiving<ToPhantomTypeArgument<T>> {
    return Receiving.reified(typeArg).new({
      id: decodeFromFields(ID.reified(), fields.id),
      version: decodeFromFields('u64', fields.version),
    })
  }

  static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    item: FieldsWithTypes
  ): Receiving<ToPhantomTypeArgument<T>> {
    if (!isReceiving(item.type)) {
      throw new Error('not a Receiving type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Receiving.reified(typeArg).new({
      id: decodeFromFieldsWithTypes(ID.reified(), item.fields.id),
      version: decodeFromFieldsWithTypes('u64', item.fields.version),
    })
  }

  static fromBcs<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    data: Uint8Array
  ): Receiving<ToPhantomTypeArgument<T>> {
    return Receiving.fromFields(typeArg, Receiving.bcs.parse(data))
  }

  toJSONField(): ReceivingJSONField<T> {
    return {
      id: this.id,
      version: this.version.toString(),
    }
  }

  toJSON(): ReceivingJSON<T> {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    field: any
  ): Receiving<ToPhantomTypeArgument<T>> {
    return Receiving.reified(typeArg).new({
      id: decodeFromJSONField(ID.reified(), field.id),
      version: decodeFromJSONField('u64', field.version),
    })
  }

  static fromJSON<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    json: Record<string, any>
  ): Receiving<ToPhantomTypeArgument<T>> {
    if (json.$typeName !== Receiving.$typeName) {
      throw new Error(
        `not a Receiving json object: expected '${Receiving.$typeName}' but got '${json.$typeName}'`
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Receiving.$typeName, ...[extractType(typeArg)]),
      json.$typeArgs,
      [typeArg]
    )

    return Receiving.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    content: SuiParsedData
  ): Receiving<ToPhantomTypeArgument<T>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isReceiving(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Receiving object`)
    }
    return Receiving.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    data: SuiObjectData
  ): Receiving<ToPhantomTypeArgument<T>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isReceiving(data.bcs.type)) {
        throw new Error(`object at is not a Receiving object`)
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

      return Receiving.fromBcs(typeArg, fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Receiving.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<T extends PhantomReified<PhantomTypeArgument>>(
    client: SupportedSuiClient,
    typeArg: T,
    id: string
  ): Promise<Receiving<ToPhantomTypeArgument<T>>> {
    const res = await fetchObjectBcs(client, id)
    if (!isReceiving(res.type)) {
      throw new Error(`object at id ${id} is not a Receiving object`)
    }

    return Receiving.fromBcs(typeArg, res.bcsBytes)
  }
}
