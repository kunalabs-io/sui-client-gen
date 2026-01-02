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
import { UID } from '../object/structs'
import { bcs } from '@mysten/sui/bcs'
import { SuiClient, SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromB64, fromHEX, toHEX } from '@mysten/sui/utils'

/* ============================== AccumulatorRoot =============================== */

export function isAccumulatorRoot(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::accumulator::AccumulatorRoot`
}

export interface AccumulatorRootFields {
  id: ToField<UID>
}

export type AccumulatorRootReified = Reified<AccumulatorRoot, AccumulatorRootFields>

export class AccumulatorRoot implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::accumulator::AccumulatorRoot`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = AccumulatorRoot.$typeName
  readonly $fullTypeName: `0x2::accumulator::AccumulatorRoot`
  readonly $typeArgs: []
  readonly $isPhantom = AccumulatorRoot.$isPhantom

  readonly id: ToField<UID>

  private constructor(typeArgs: [], fields: AccumulatorRootFields) {
    this.$fullTypeName = composeSuiType(
      AccumulatorRoot.$typeName,
      ...typeArgs
    ) as `0x2::accumulator::AccumulatorRoot`
    this.$typeArgs = typeArgs

    this.id = fields.id
  }

  static reified(): AccumulatorRootReified {
    const reifiedBcs = AccumulatorRoot.bcs
    return {
      typeName: AccumulatorRoot.$typeName,
      fullTypeName: composeSuiType(
        AccumulatorRoot.$typeName,
        ...[]
      ) as `0x2::accumulator::AccumulatorRoot`,
      typeArgs: [] as [],
      isPhantom: AccumulatorRoot.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => AccumulatorRoot.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => AccumulatorRoot.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => AccumulatorRoot.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => AccumulatorRoot.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => AccumulatorRoot.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => AccumulatorRoot.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => AccumulatorRoot.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => AccumulatorRoot.fetch(client, id),
      new: (fields: AccumulatorRootFields) => {
        return new AccumulatorRoot([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return AccumulatorRoot.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<AccumulatorRoot>> {
    return phantom(AccumulatorRoot.reified())
  }

  static get p() {
    return AccumulatorRoot.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('AccumulatorRoot', {
      id: UID.bcs,
    })
  }

  private static cachedBcs: ReturnType<typeof AccumulatorRoot.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof AccumulatorRoot.instantiateBcs> {
    if (!AccumulatorRoot.cachedBcs) {
      AccumulatorRoot.cachedBcs = AccumulatorRoot.instantiateBcs()
    }
    return AccumulatorRoot.cachedBcs
  }

  static fromFields(fields: Record<string, any>): AccumulatorRoot {
    return AccumulatorRoot.reified().new({
      id: decodeFromFields(UID.reified(), fields.id),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): AccumulatorRoot {
    if (!isAccumulatorRoot(item.type)) {
      throw new Error('not a AccumulatorRoot type')
    }

    return AccumulatorRoot.reified().new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
    })
  }

  static fromBcs(data: Uint8Array): AccumulatorRoot {
    return AccumulatorRoot.fromFields(AccumulatorRoot.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): AccumulatorRoot {
    return AccumulatorRoot.reified().new({
      id: decodeFromJSONField(UID.reified(), field.id),
    })
  }

  static fromJSON(json: Record<string, any>): AccumulatorRoot {
    if (json.$typeName !== AccumulatorRoot.$typeName) {
      throw new Error(
        `not a AccumulatorRoot json object: expected '${AccumulatorRoot.$typeName}' but got '${json.$typeName}'`
      )
    }

    return AccumulatorRoot.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): AccumulatorRoot {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isAccumulatorRoot(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a AccumulatorRoot object`)
    }
    return AccumulatorRoot.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): AccumulatorRoot {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isAccumulatorRoot(data.bcs.type)) {
        throw new Error(`object at is not a AccumulatorRoot object`)
      }

      return AccumulatorRoot.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return AccumulatorRoot.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<AccumulatorRoot> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching AccumulatorRoot object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isAccumulatorRoot(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a AccumulatorRoot object`)
    }

    return AccumulatorRoot.fromSuiObjectData(res.data)
  }
}

/* ============================== U128 =============================== */

export function isU128(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::accumulator::U128`
}

export interface U128Fields {
  value: ToField<'u128'>
}

export type U128Reified = Reified<U128, U128Fields>

export class U128 implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::accumulator::U128`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = U128.$typeName
  readonly $fullTypeName: `0x2::accumulator::U128`
  readonly $typeArgs: []
  readonly $isPhantom = U128.$isPhantom

  readonly value: ToField<'u128'>

  private constructor(typeArgs: [], fields: U128Fields) {
    this.$fullTypeName = composeSuiType(U128.$typeName, ...typeArgs) as `0x2::accumulator::U128`
    this.$typeArgs = typeArgs

    this.value = fields.value
  }

  static reified(): U128Reified {
    const reifiedBcs = U128.bcs
    return {
      typeName: U128.$typeName,
      fullTypeName: composeSuiType(U128.$typeName, ...[]) as `0x2::accumulator::U128`,
      typeArgs: [] as [],
      isPhantom: U128.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => U128.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => U128.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => U128.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => U128.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => U128.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => U128.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => U128.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => U128.fetch(client, id),
      new: (fields: U128Fields) => {
        return new U128([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return U128.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<U128>> {
    return phantom(U128.reified())
  }

  static get p() {
    return U128.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('U128', {
      value: bcs.u128(),
    })
  }

  private static cachedBcs: ReturnType<typeof U128.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof U128.instantiateBcs> {
    if (!U128.cachedBcs) {
      U128.cachedBcs = U128.instantiateBcs()
    }
    return U128.cachedBcs
  }

  static fromFields(fields: Record<string, any>): U128 {
    return U128.reified().new({
      value: decodeFromFields('u128', fields.value),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): U128 {
    if (!isU128(item.type)) {
      throw new Error('not a U128 type')
    }

    return U128.reified().new({
      value: decodeFromFieldsWithTypes('u128', item.fields.value),
    })
  }

  static fromBcs(data: Uint8Array): U128 {
    return U128.fromFields(U128.bcs.parse(data))
  }

  toJSONField() {
    return {
      value: this.value.toString(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): U128 {
    return U128.reified().new({
      value: decodeFromJSONField('u128', field.value),
    })
  }

  static fromJSON(json: Record<string, any>): U128 {
    if (json.$typeName !== U128.$typeName) {
      throw new Error(
        `not a U128 json object: expected '${U128.$typeName}' but got '${json.$typeName}'`
      )
    }

    return U128.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): U128 {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isU128(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a U128 object`)
    }
    return U128.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): U128 {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isU128(data.bcs.type)) {
        throw new Error(`object at is not a U128 object`)
      }

      return U128.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return U128.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<U128> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching U128 object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isU128(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a U128 object`)
    }

    return U128.fromSuiObjectData(res.data)
  }
}

/* ============================== Key =============================== */

export function isKey(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::accumulator::Key` + '<')
}

export interface KeyFields<T0 extends PhantomTypeArgument> {
  address: ToField<'address'>
}

export type KeyReified<T0 extends PhantomTypeArgument> = Reified<Key<T0>, KeyFields<T0>>

export class Key<T0 extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::accumulator::Key`
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName = Key.$typeName
  readonly $fullTypeName: `0x2::accumulator::Key<${PhantomToTypeStr<T0>}>`
  readonly $typeArgs: [PhantomToTypeStr<T0>]
  readonly $isPhantom = Key.$isPhantom

  readonly address: ToField<'address'>

  private constructor(typeArgs: [PhantomToTypeStr<T0>], fields: KeyFields<T0>) {
    this.$fullTypeName = composeSuiType(
      Key.$typeName,
      ...typeArgs
    ) as `0x2::accumulator::Key<${PhantomToTypeStr<T0>}>`
    this.$typeArgs = typeArgs

    this.address = fields.address
  }

  static reified<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): KeyReified<ToPhantomTypeArgument<T0>> {
    const reifiedBcs = Key.bcs
    return {
      typeName: Key.$typeName,
      fullTypeName: composeSuiType(
        Key.$typeName,
        ...[extractType(T0)]
      ) as `0x2::accumulator::Key<${PhantomToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [extractType(T0)] as [PhantomToTypeStr<ToPhantomTypeArgument<T0>>],
      isPhantom: Key.$isPhantom,
      reifiedTypeArgs: [T0],
      fromFields: (fields: Record<string, any>) => Key.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Key.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => Key.fromFields(T0, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => Key.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => Key.fromJSON(T0, json),
      fromSuiParsedData: (content: SuiParsedData) => Key.fromSuiParsedData(T0, content),
      fromSuiObjectData: (content: SuiObjectData) => Key.fromSuiObjectData(T0, content),
      fetch: async (client: SuiClient, id: string) => Key.fetch(client, T0, id),
      new: (fields: KeyFields<ToPhantomTypeArgument<T0>>) => {
        return new Key([extractType(T0)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Key.reified
  }

  static phantom<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): PhantomReified<ToTypeStr<Key<ToPhantomTypeArgument<T0>>>> {
    return phantom(Key.reified(T0))
  }

  static get p() {
    return Key.phantom
  }

  private static instantiateBcs() {
    return bcs.struct('Key', {
      address: bcs.bytes(32).transform({
        input: (val: string) => fromHEX(val),
        output: (val: Uint8Array) => toHEX(val),
      }),
    })
  }

  private static cachedBcs: ReturnType<typeof Key.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof Key.instantiateBcs> {
    if (!Key.cachedBcs) {
      Key.cachedBcs = Key.instantiateBcs()
    }
    return Key.cachedBcs
  }

  static fromFields<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    fields: Record<string, any>
  ): Key<ToPhantomTypeArgument<T0>> {
    return Key.reified(typeArg).new({
      address: decodeFromFields('address', fields.address),
    })
  }

  static fromFieldsWithTypes<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    item: FieldsWithTypes
  ): Key<ToPhantomTypeArgument<T0>> {
    if (!isKey(item.type)) {
      throw new Error('not a Key type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Key.reified(typeArg).new({
      address: decodeFromFieldsWithTypes('address', item.fields.address),
    })
  }

  static fromBcs<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: Uint8Array
  ): Key<ToPhantomTypeArgument<T0>> {
    return Key.fromFields(typeArg, Key.bcs.parse(data))
  }

  toJSONField() {
    return {
      address: this.address,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    field: any
  ): Key<ToPhantomTypeArgument<T0>> {
    return Key.reified(typeArg).new({
      address: decodeFromJSONField('address', field.address),
    })
  }

  static fromJSON<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    json: Record<string, any>
  ): Key<ToPhantomTypeArgument<T0>> {
    if (json.$typeName !== Key.$typeName) {
      throw new Error(
        `not a Key json object: expected '${Key.$typeName}' but got '${json.$typeName}'`
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Key.$typeName, ...[extractType(typeArg)]),
      json.$typeArgs,
      [typeArg]
    )

    return Key.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    content: SuiParsedData
  ): Key<ToPhantomTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isKey(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Key object`)
    }
    return Key.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: SuiObjectData
  ): Key<ToPhantomTypeArgument<T0>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isKey(data.bcs.type)) {
        throw new Error(`object at is not a Key object`)
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

      return Key.fromBcs(typeArg, fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Key.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<T0 extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<Key<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching Key object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isKey(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a Key object`)
    }

    return Key.fromSuiObjectData(typeArg, res.data)
  }
}
