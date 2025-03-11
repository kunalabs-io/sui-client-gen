import { Option } from '../../_dependencies/source/0x1/option/structs'
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
import { PKG_V27 } from '../index'
import { ID } from '../object/structs'
import { BcsType, bcs } from '@mysten/sui/bcs'
import { SuiClient, SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromB64, fromHEX, toHEX } from '@mysten/sui/utils'

/* ============================== Borrow =============================== */

export function isBorrow(type: string): boolean {
  type = compressSuiType(type)
  return type === `${PKG_V27}::borrow::Borrow`
}

export interface BorrowFields {
  ref: ToField<'address'>
  obj: ToField<ID>
}

export type BorrowReified = Reified<Borrow, BorrowFields>

export class Borrow implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `${PKG_V27}::borrow::Borrow`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = Borrow.$typeName
  readonly $fullTypeName: `${typeof PKG_V27}::borrow::Borrow`
  readonly $typeArgs: []
  readonly $isPhantom = Borrow.$isPhantom

  readonly ref: ToField<'address'>
  readonly obj: ToField<ID>

  private constructor(typeArgs: [], fields: BorrowFields) {
    this.$fullTypeName = composeSuiType(
      Borrow.$typeName,
      ...typeArgs
    ) as `${typeof PKG_V27}::borrow::Borrow`
    this.$typeArgs = typeArgs

    this.ref = fields.ref
    this.obj = fields.obj
  }

  static reified(): BorrowReified {
    return {
      typeName: Borrow.$typeName,
      fullTypeName: composeSuiType(Borrow.$typeName, ...[]) as `${typeof PKG_V27}::borrow::Borrow`,
      typeArgs: [] as [],
      isPhantom: Borrow.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => Borrow.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Borrow.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => Borrow.fromBcs(data),
      bcs: Borrow.bcs,
      fromJSONField: (field: any) => Borrow.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => Borrow.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => Borrow.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => Borrow.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => Borrow.fetch(client, id),
      new: (fields: BorrowFields) => {
        return new Borrow([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Borrow.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<Borrow>> {
    return phantom(Borrow.reified())
  }
  static get p() {
    return Borrow.phantom()
  }

  static get bcs() {
    return bcs.struct('Borrow', {
      ref: bcs.bytes(32).transform({
        input: (val: string) => fromHEX(val),
        output: (val: Uint8Array) => toHEX(val),
      }),
      obj: ID.bcs,
    })
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

  toJSONField() {
    return {
      ref: this.ref,
      obj: this.obj,
    }
  }

  toJSON() {
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
      throw new Error('not a WithTwoGenerics json object')
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

      return Borrow.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Borrow.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<Borrow> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching Borrow object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isBorrow(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a Borrow object`)
    }

    return Borrow.fromSuiObjectData(res.data)
  }
}

/* ============================== Referent =============================== */

export function isReferent(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`${PKG_V27}::borrow::Referent` + '<')
}

export interface ReferentFields<T extends TypeArgument> {
  id: ToField<'address'>
  value: ToField<Option<T>>
}

export type ReferentReified<T extends TypeArgument> = Reified<Referent<T>, ReferentFields<T>>

export class Referent<T extends TypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `${PKG_V27}::borrow::Referent`
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [false] as const

  readonly $typeName = Referent.$typeName
  readonly $fullTypeName: `${typeof PKG_V27}::borrow::Referent<${ToTypeStr<T>}>`
  readonly $typeArgs: [ToTypeStr<T>]
  readonly $isPhantom = Referent.$isPhantom

  readonly id: ToField<'address'>
  readonly value: ToField<Option<T>>

  private constructor(typeArgs: [ToTypeStr<T>], fields: ReferentFields<T>) {
    this.$fullTypeName = composeSuiType(
      Referent.$typeName,
      ...typeArgs
    ) as `${typeof PKG_V27}::borrow::Referent<${ToTypeStr<T>}>`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.value = fields.value
  }

  static reified<T extends Reified<TypeArgument, any>>(T: T): ReferentReified<ToTypeArgument<T>> {
    return {
      typeName: Referent.$typeName,
      fullTypeName: composeSuiType(
        Referent.$typeName,
        ...[extractType(T)]
      ) as `${typeof PKG_V27}::borrow::Referent<${ToTypeStr<ToTypeArgument<T>>}>`,
      typeArgs: [extractType(T)] as [ToTypeStr<ToTypeArgument<T>>],
      isPhantom: Referent.$isPhantom,
      reifiedTypeArgs: [T],
      fromFields: (fields: Record<string, any>) => Referent.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Referent.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => Referent.fromBcs(T, data),
      bcs: Referent.bcs(toBcs(T)),
      fromJSONField: (field: any) => Referent.fromJSONField(T, field),
      fromJSON: (json: Record<string, any>) => Referent.fromJSON(T, json),
      fromSuiParsedData: (content: SuiParsedData) => Referent.fromSuiParsedData(T, content),
      fromSuiObjectData: (content: SuiObjectData) => Referent.fromSuiObjectData(T, content),
      fetch: async (client: SuiClient, id: string) => Referent.fetch(client, T, id),
      new: (fields: ReferentFields<ToTypeArgument<T>>) => {
        return new Referent([extractType(T)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Referent.reified
  }

  static phantom<T extends Reified<TypeArgument, any>>(
    T: T
  ): PhantomReified<ToTypeStr<Referent<ToTypeArgument<T>>>> {
    return phantom(Referent.reified(T))
  }
  static get p() {
    return Referent.phantom
  }

  static get bcs() {
    return <T extends BcsType<any>>(T: T) =>
      bcs.struct(`Referent<${T.name}>`, {
        id: bcs.bytes(32).transform({
          input: (val: string) => fromHEX(val),
          output: (val: Uint8Array) => toHEX(val),
        }),
        value: Option.bcs(T),
      })
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

    return Referent.fromFields(typeArg, Referent.bcs(toBcs(typeArgs[0])).parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
      value: fieldToJSON<Option<T>>(`${Option.$typeName}<${this.$typeArgs[0]}>`, this.value),
    }
  }

  toJSON() {
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
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Referent.$typeName, extractType(typeArg)),
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

      return Referent.fromBcs(typeArg, fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Referent.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<T extends Reified<TypeArgument, any>>(
    client: SuiClient,
    typeArg: T,
    id: string
  ): Promise<Referent<ToTypeArgument<T>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching Referent object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isReferent(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a Referent object`)
    }

    return Referent.fromSuiObjectData(typeArg, res.data)
  }
}
