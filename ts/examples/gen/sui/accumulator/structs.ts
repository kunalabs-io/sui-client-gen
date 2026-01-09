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
  SupportedSuiClient,
  composeSuiType,
  compressSuiType,
  fetchObjectBcs,
  parseTypeName,
} from '../../_framework/util'
import { UID } from '../object/structs'
import { bcs } from '@mysten/sui/bcs'
import { SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromBase64, fromHex, toHex } from '@mysten/sui/utils'

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

  static readonly $typeName = `0x2::accumulator::AccumulatorRoot` as const
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
      fetch: async (client: SupportedSuiClient, id: string) => AccumulatorRoot.fetch(client, id),
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

      return AccumulatorRoot.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return AccumulatorRoot.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<AccumulatorRoot> {
    const res = await fetchObjectBcs(client, id)
    if (!isAccumulatorRoot(res.type)) {
      throw new Error(`object at id ${id} is not a AccumulatorRoot object`)
    }

    return AccumulatorRoot.fromBcs(res.bcsBytes)
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

/**
 * Storage for 128-bit accumulator values.
 *
 * Currently only used to represent the sum of 64 bit values (such as `Balance<T>`).
 * The additional bits are necessary to prevent overflow, as it would take 2^64 deposits of U64_MAX
 * to cause an overflow.
 */
export class U128 implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::accumulator::U128` as const
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
      fetch: async (client: SupportedSuiClient, id: string) => U128.fetch(client, id),
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

      return U128.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return U128.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<U128> {
    const res = await fetchObjectBcs(client, id)
    if (!isU128(res.type)) {
      throw new Error(`object at id ${id} is not a U128 object`)
    }

    return U128.fromBcs(res.bcsBytes)
  }
}

/* ============================== Key =============================== */

export function isKey(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::accumulator::Key` + '<')
}

export interface KeyFields<T extends PhantomTypeArgument> {
  address: ToField<'address'>
}

export type KeyReified<T extends PhantomTypeArgument> = Reified<Key<T>, KeyFields<T>>

/**
 * `Key` is used only for computing the field id of accumulator objects.
 * `T` is the type of the accumulated value, e.g. `Balance<SUI>`
 */
export class Key<T extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::accumulator::Key` as const
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName = Key.$typeName
  readonly $fullTypeName: `0x2::accumulator::Key<${PhantomToTypeStr<T>}>`
  readonly $typeArgs: [PhantomToTypeStr<T>]
  readonly $isPhantom = Key.$isPhantom

  readonly address: ToField<'address'>

  private constructor(typeArgs: [PhantomToTypeStr<T>], fields: KeyFields<T>) {
    this.$fullTypeName = composeSuiType(
      Key.$typeName,
      ...typeArgs
    ) as `0x2::accumulator::Key<${PhantomToTypeStr<T>}>`
    this.$typeArgs = typeArgs

    this.address = fields.address
  }

  static reified<T extends PhantomReified<PhantomTypeArgument>>(
    T: T
  ): KeyReified<ToPhantomTypeArgument<T>> {
    const reifiedBcs = Key.bcs
    return {
      typeName: Key.$typeName,
      fullTypeName: composeSuiType(
        Key.$typeName,
        ...[extractType(T)]
      ) as `0x2::accumulator::Key<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`,
      typeArgs: [extractType(T)] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>],
      isPhantom: Key.$isPhantom,
      reifiedTypeArgs: [T],
      fromFields: (fields: Record<string, any>) => Key.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Key.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => Key.fromFields(T, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => Key.fromJSONField(T, field),
      fromJSON: (json: Record<string, any>) => Key.fromJSON(T, json),
      fromSuiParsedData: (content: SuiParsedData) => Key.fromSuiParsedData(T, content),
      fromSuiObjectData: (content: SuiObjectData) => Key.fromSuiObjectData(T, content),
      fetch: async (client: SupportedSuiClient, id: string) => Key.fetch(client, T, id),
      new: (fields: KeyFields<ToPhantomTypeArgument<T>>) => {
        return new Key([extractType(T)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Key.reified
  }

  static phantom<T extends PhantomReified<PhantomTypeArgument>>(
    T: T
  ): PhantomReified<ToTypeStr<Key<ToPhantomTypeArgument<T>>>> {
    return phantom(Key.reified(T))
  }

  static get p() {
    return Key.phantom
  }

  private static instantiateBcs() {
    return bcs.struct('Key', {
      address: bcs.bytes(32).transform({
        input: (val: string) => fromHex(val),
        output: (val: Uint8Array) => toHex(val),
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

  static fromFields<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    fields: Record<string, any>
  ): Key<ToPhantomTypeArgument<T>> {
    return Key.reified(typeArg).new({
      address: decodeFromFields('address', fields.address),
    })
  }

  static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    item: FieldsWithTypes
  ): Key<ToPhantomTypeArgument<T>> {
    if (!isKey(item.type)) {
      throw new Error('not a Key type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Key.reified(typeArg).new({
      address: decodeFromFieldsWithTypes('address', item.fields.address),
    })
  }

  static fromBcs<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    data: Uint8Array
  ): Key<ToPhantomTypeArgument<T>> {
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

  static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    field: any
  ): Key<ToPhantomTypeArgument<T>> {
    return Key.reified(typeArg).new({
      address: decodeFromJSONField('address', field.address),
    })
  }

  static fromJSON<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    json: Record<string, any>
  ): Key<ToPhantomTypeArgument<T>> {
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

  static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    content: SuiParsedData
  ): Key<ToPhantomTypeArgument<T>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isKey(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Key object`)
    }
    return Key.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    data: SuiObjectData
  ): Key<ToPhantomTypeArgument<T>> {
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

      return Key.fromBcs(typeArg, fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Key.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<T extends PhantomReified<PhantomTypeArgument>>(
    client: SupportedSuiClient,
    typeArg: T,
    id: string
  ): Promise<Key<ToPhantomTypeArgument<T>>> {
    const res = await fetchObjectBcs(client, id)
    if (!isKey(res.type)) {
      throw new Error(`object at id ${id} is not a Key object`)
    }

    return Key.fromBcs(typeArg, res.bcsBytes)
  }
}
