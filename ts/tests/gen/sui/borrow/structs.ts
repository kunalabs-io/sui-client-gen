/**
 * A simple library that enables hot-potato-locked borrow mechanics.
 *
 * With Programmable transactions, it is possible to borrow a value within
 * a transaction, use it and put back in the end. Hot-potato `Borrow` makes
 * sure the object is returned and was not swapped for another one.
 */

import {
  PhantomReified,
  Reified,
  StructClass,
  ToField,
  ToJSON,
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
  SupportedSuiClient,
  composeSuiType,
  compressSuiType,
  fetchObjectBcs,
  parseTypeName,
} from '../../_framework/util'
import { Option } from '../../std/option/structs'
import { ID } from '../object/structs'
import { BcsType, bcs } from '@mysten/sui/bcs'
import { SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromBase64, fromHex, toHex } from '@mysten/sui/utils'

/* ============================== Referent =============================== */

export function isReferent(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::borrow::Referent` + '<')
}

export interface ReferentFields<T extends TypeArgument> {
  id: ToField<'address'>
  value: ToField<Option<T>>
}

export type ReferentReified<T extends TypeArgument> = Reified<Referent<T>, ReferentFields<T>>

export type ReferentJSONField<T extends TypeArgument> = {
  id: string
  value: ToJSON<T> | null
}

export type ReferentJSON<T extends TypeArgument> = {
  $typeName: typeof Referent.$typeName
  $typeArgs: [ToTypeStr<T>]
} & ReferentJSONField<T>

/** An object wrapping a `T` and providing the borrow API. */
export class Referent<T extends TypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::borrow::Referent` = `0x2::borrow::Referent` as const
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [false] as const

  readonly $typeName: typeof Referent.$typeName = Referent.$typeName
  readonly $fullTypeName: `0x2::borrow::Referent<${ToTypeStr<T>}>`
  readonly $typeArgs: [ToTypeStr<T>]
  readonly $isPhantom: typeof Referent.$isPhantom = Referent.$isPhantom

  readonly id: ToField<'address'>
  readonly value: ToField<Option<T>>

  private constructor(typeArgs: [ToTypeStr<T>], fields: ReferentFields<T>) {
    this.$fullTypeName = composeSuiType(
      Referent.$typeName,
      ...typeArgs
    ) as `0x2::borrow::Referent<${ToTypeStr<T>}>`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.value = fields.value
  }

  static reified<T extends Reified<TypeArgument, any>>(T: T): ReferentReified<ToTypeArgument<T>> {
    const reifiedBcs = Referent.bcs(toBcs(T))
    return {
      typeName: Referent.$typeName,
      fullTypeName: composeSuiType(
        Referent.$typeName,
        ...[extractType(T)]
      ) as `0x2::borrow::Referent<${ToTypeStr<ToTypeArgument<T>>}>`,
      typeArgs: [extractType(T)] as [ToTypeStr<ToTypeArgument<T>>],
      isPhantom: Referent.$isPhantom,
      reifiedTypeArgs: [T],
      fromFields: (fields: Record<string, any>) => Referent.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Referent.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => Referent.fromFields(T, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => Referent.fromJSONField(T, field),
      fromJSON: (json: Record<string, any>) => Referent.fromJSON(T, json),
      fromSuiParsedData: (content: SuiParsedData) => Referent.fromSuiParsedData(T, content),
      fromSuiObjectData: (content: SuiObjectData) => Referent.fromSuiObjectData(T, content),
      fetch: async (client: SupportedSuiClient, id: string) => Referent.fetch(client, T, id),
      new: (fields: ReferentFields<ToTypeArgument<T>>) => {
        return new Referent([extractType(T)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): typeof Referent.reified {
    return Referent.reified
  }

  static phantom<T extends Reified<TypeArgument, any>>(
    T: T
  ): PhantomReified<ToTypeStr<Referent<ToTypeArgument<T>>>> {
    return phantom(Referent.reified(T))
  }

  static get p(): typeof Referent.phantom {
    return Referent.phantom
  }

  private static instantiateBcs() {
    return <T extends BcsType<any>>(T: T) =>
      bcs.struct(`Referent<${T.name}>`, {
        id: bcs.bytes(32).transform({
          input: (val: string) => fromHex(val),
          output: (val: Uint8Array) => toHex(val),
        }),
        value: Option.bcs(T),
      })
  }

  private static cachedBcs: ReturnType<typeof Referent.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof Referent.instantiateBcs> {
    if (!Referent.cachedBcs) {
      Referent.cachedBcs = Referent.instantiateBcs()
    }
    return Referent.cachedBcs
  }

  static fromFields<T extends Reified<TypeArgument, any>>(
    typeArg: T,
    fields: Record<string, any>
  ): Referent<ToTypeArgument<T>> {
    return Referent.reified(typeArg).new({
      id: decodeFromFields('address', fields.id),
      value: decodeFromFields(Option.reified(typeArg), fields.value),
    })
  }

  static fromFieldsWithTypes<T extends Reified<TypeArgument, any>>(
    typeArg: T,
    item: FieldsWithTypes
  ): Referent<ToTypeArgument<T>> {
    if (!isReferent(item.type)) {
      throw new Error('not a Referent type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Referent.reified(typeArg).new({
      id: decodeFromFieldsWithTypes('address', item.fields.id),
      value: decodeFromFieldsWithTypes(Option.reified(typeArg), item.fields.value),
    })
  }

  static fromBcs<T extends Reified<TypeArgument, any>>(
    typeArg: T,
    data: Uint8Array
  ): Referent<ToTypeArgument<T>> {
    const typeArgs = [typeArg]
    return Referent.fromFields(typeArg, Referent.bcs(toBcs(typeArg)).parse(data))
  }

  toJSONField(): ReferentJSONField<T> {
    return {
      id: this.id,
      value: fieldToJSON<Option<T>>(`${Option.$typeName}<${this.$typeArgs[0]}>`, this.value),
    }
  }

  toJSON(): ReferentJSON<T> {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T extends Reified<TypeArgument, any>>(
    typeArg: T,
    field: any
  ): Referent<ToTypeArgument<T>> {
    return Referent.reified(typeArg).new({
      id: decodeFromJSONField('address', field.id),
      value: decodeFromJSONField(Option.reified(typeArg), field.value),
    })
  }

  static fromJSON<T extends Reified<TypeArgument, any>>(
    typeArg: T,
    json: Record<string, any>
  ): Referent<ToTypeArgument<T>> {
    if (json.$typeName !== Referent.$typeName) {
      throw new Error(
        `not a Referent json object: expected '${Referent.$typeName}' but got '${json.$typeName}'`
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Referent.$typeName, ...[extractType(typeArg)]),
      json.$typeArgs,
      [typeArg]
    )

    return Referent.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T extends Reified<TypeArgument, any>>(
    typeArg: T,
    content: SuiParsedData
  ): Referent<ToTypeArgument<T>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isReferent(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Referent object`)
    }
    return Referent.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T extends Reified<TypeArgument, any>>(
    typeArg: T,
    data: SuiObjectData
  ): Referent<ToTypeArgument<T>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isReferent(data.bcs.type)) {
        throw new Error(`object at is not a Referent object`)
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

      return Referent.fromBcs(typeArg, fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Referent.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<T extends Reified<TypeArgument, any>>(
    client: SupportedSuiClient,
    typeArg: T,
    id: string
  ): Promise<Referent<ToTypeArgument<T>>> {
    const res = await fetchObjectBcs(client, id)
    if (!isReferent(res.type)) {
      throw new Error(`object at id ${id} is not a Referent object`)
    }

    return Referent.fromBcs(typeArg, res.bcsBytes)
  }
}

/* ============================== Borrow =============================== */

export function isBorrow(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::borrow::Borrow`
}

export interface BorrowFields {
  ref: ToField<'address'>
  obj: ToField<ID>
}

export type BorrowReified = Reified<Borrow, BorrowFields>

export type BorrowJSONField = {
  ref: string
  obj: string
}

export type BorrowJSON = {
  $typeName: typeof Borrow.$typeName
  $typeArgs: []
} & BorrowJSONField

/** A hot potato making sure the object is put back once borrowed. */
export class Borrow implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::borrow::Borrow` = `0x2::borrow::Borrow` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName: typeof Borrow.$typeName = Borrow.$typeName
  readonly $fullTypeName: `0x2::borrow::Borrow`
  readonly $typeArgs: []
  readonly $isPhantom: typeof Borrow.$isPhantom = Borrow.$isPhantom

  readonly ref: ToField<'address'>
  readonly obj: ToField<ID>

  private constructor(typeArgs: [], fields: BorrowFields) {
    this.$fullTypeName = composeSuiType(Borrow.$typeName, ...typeArgs) as `0x2::borrow::Borrow`
    this.$typeArgs = typeArgs

    this.ref = fields.ref
    this.obj = fields.obj
  }

  static reified(): BorrowReified {
    const reifiedBcs = Borrow.bcs
    return {
      typeName: Borrow.$typeName,
      fullTypeName: composeSuiType(Borrow.$typeName, ...[]) as `0x2::borrow::Borrow`,
      typeArgs: [] as [],
      isPhantom: Borrow.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => Borrow.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Borrow.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => Borrow.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => Borrow.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => Borrow.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => Borrow.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => Borrow.fromSuiObjectData(content),
      fetch: async (client: SupportedSuiClient, id: string) => Borrow.fetch(client, id),
      new: (fields: BorrowFields) => {
        return new Borrow([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): BorrowReified {
    return Borrow.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<Borrow>> {
    return phantom(Borrow.reified())
  }

  static get p(): PhantomReified<ToTypeStr<Borrow>> {
    return Borrow.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('Borrow', {
      ref: bcs.bytes(32).transform({
        input: (val: string) => fromHex(val),
        output: (val: Uint8Array) => toHex(val),
      }),
      obj: ID.bcs,
    })
  }

  private static cachedBcs: ReturnType<typeof Borrow.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof Borrow.instantiateBcs> {
    if (!Borrow.cachedBcs) {
      Borrow.cachedBcs = Borrow.instantiateBcs()
    }
    return Borrow.cachedBcs
  }

  static fromFields(fields: Record<string, any>): Borrow {
    return Borrow.reified().new({
      ref: decodeFromFields('address', fields.ref),
      obj: decodeFromFields(ID.reified(), fields.obj),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Borrow {
    if (!isBorrow(item.type)) {
      throw new Error('not a Borrow type')
    }

    return Borrow.reified().new({
      ref: decodeFromFieldsWithTypes('address', item.fields.ref),
      obj: decodeFromFieldsWithTypes(ID.reified(), item.fields.obj),
    })
  }

  static fromBcs(data: Uint8Array): Borrow {
    return Borrow.fromFields(Borrow.bcs.parse(data))
  }

  toJSONField(): BorrowJSONField {
    return {
      ref: this.ref,
      obj: this.obj,
    }
  }

  toJSON(): BorrowJSON {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): Borrow {
    return Borrow.reified().new({
      ref: decodeFromJSONField('address', field.ref),
      obj: decodeFromJSONField(ID.reified(), field.obj),
    })
  }

  static fromJSON(json: Record<string, any>): Borrow {
    if (json.$typeName !== Borrow.$typeName) {
      throw new Error(
        `not a Borrow json object: expected '${Borrow.$typeName}' but got '${json.$typeName}'`
      )
    }

    return Borrow.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): Borrow {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isBorrow(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Borrow object`)
    }
    return Borrow.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): Borrow {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isBorrow(data.bcs.type)) {
        throw new Error(`object at is not a Borrow object`)
      }

      return Borrow.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Borrow.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<Borrow> {
    const res = await fetchObjectBcs(client, id)
    if (!isBorrow(res.type)) {
      throw new Error(`object at id ${id} is not a Borrow object`)
    }

    return Borrow.fromBcs(res.bcsBytes)
  }
}
