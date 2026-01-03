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
import { Bag } from '../bag/structs'
import { bcs } from '@mysten/sui/bcs'
import { SuiClient, SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromB64, fromHEX, toHEX } from '@mysten/sui/utils'

/* ============================== OwnerKey =============================== */

export function isOwnerKey(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::accumulator_metadata::OwnerKey`
}

export interface OwnerKeyFields {
  owner: ToField<'address'>
}

export type OwnerKeyReified = Reified<OwnerKey, OwnerKeyFields>

export class OwnerKey implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::accumulator_metadata::OwnerKey`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = OwnerKey.$typeName
  readonly $fullTypeName: `0x2::accumulator_metadata::OwnerKey`
  readonly $typeArgs: []
  readonly $isPhantom = OwnerKey.$isPhantom

  readonly owner: ToField<'address'>

  private constructor(typeArgs: [], fields: OwnerKeyFields) {
    this.$fullTypeName = composeSuiType(
      OwnerKey.$typeName,
      ...typeArgs
    ) as `0x2::accumulator_metadata::OwnerKey`
    this.$typeArgs = typeArgs

    this.owner = fields.owner
  }

  static reified(): OwnerKeyReified {
    const reifiedBcs = OwnerKey.bcs
    return {
      typeName: OwnerKey.$typeName,
      fullTypeName: composeSuiType(
        OwnerKey.$typeName,
        ...[]
      ) as `0x2::accumulator_metadata::OwnerKey`,
      typeArgs: [] as [],
      isPhantom: OwnerKey.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => OwnerKey.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => OwnerKey.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => OwnerKey.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => OwnerKey.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => OwnerKey.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => OwnerKey.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => OwnerKey.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => OwnerKey.fetch(client, id),
      new: (fields: OwnerKeyFields) => {
        return new OwnerKey([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return OwnerKey.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<OwnerKey>> {
    return phantom(OwnerKey.reified())
  }

  static get p() {
    return OwnerKey.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('OwnerKey', {
      owner: bcs.bytes(32).transform({
        input: (val: string) => fromHEX(val),
        output: (val: Uint8Array) => toHEX(val),
      }),
    })
  }

  private static cachedBcs: ReturnType<typeof OwnerKey.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof OwnerKey.instantiateBcs> {
    if (!OwnerKey.cachedBcs) {
      OwnerKey.cachedBcs = OwnerKey.instantiateBcs()
    }
    return OwnerKey.cachedBcs
  }

  static fromFields(fields: Record<string, any>): OwnerKey {
    return OwnerKey.reified().new({
      owner: decodeFromFields('address', fields.owner),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): OwnerKey {
    if (!isOwnerKey(item.type)) {
      throw new Error('not a OwnerKey type')
    }

    return OwnerKey.reified().new({
      owner: decodeFromFieldsWithTypes('address', item.fields.owner),
    })
  }

  static fromBcs(data: Uint8Array): OwnerKey {
    return OwnerKey.fromFields(OwnerKey.bcs.parse(data))
  }

  toJSONField() {
    return {
      owner: this.owner,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): OwnerKey {
    return OwnerKey.reified().new({
      owner: decodeFromJSONField('address', field.owner),
    })
  }

  static fromJSON(json: Record<string, any>): OwnerKey {
    if (json.$typeName !== OwnerKey.$typeName) {
      throw new Error(
        `not a OwnerKey json object: expected '${OwnerKey.$typeName}' but got '${json.$typeName}'`
      )
    }

    return OwnerKey.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): OwnerKey {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isOwnerKey(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a OwnerKey object`)
    }
    return OwnerKey.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): OwnerKey {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isOwnerKey(data.bcs.type)) {
        throw new Error(`object at is not a OwnerKey object`)
      }

      return OwnerKey.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return OwnerKey.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<OwnerKey> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching OwnerKey object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isOwnerKey(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a OwnerKey object`)
    }

    return OwnerKey.fromSuiObjectData(res.data)
  }
}

/* ============================== Owner =============================== */

export function isOwner(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::accumulator_metadata::Owner`
}

export interface OwnerFields {
  balances: ToField<Bag>
  owner: ToField<'address'>
}

export type OwnerReified = Reified<Owner, OwnerFields>

export class Owner implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::accumulator_metadata::Owner`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = Owner.$typeName
  readonly $fullTypeName: `0x2::accumulator_metadata::Owner`
  readonly $typeArgs: []
  readonly $isPhantom = Owner.$isPhantom

  readonly balances: ToField<Bag>
  readonly owner: ToField<'address'>

  private constructor(typeArgs: [], fields: OwnerFields) {
    this.$fullTypeName = composeSuiType(
      Owner.$typeName,
      ...typeArgs
    ) as `0x2::accumulator_metadata::Owner`
    this.$typeArgs = typeArgs

    this.balances = fields.balances
    this.owner = fields.owner
  }

  static reified(): OwnerReified {
    const reifiedBcs = Owner.bcs
    return {
      typeName: Owner.$typeName,
      fullTypeName: composeSuiType(Owner.$typeName, ...[]) as `0x2::accumulator_metadata::Owner`,
      typeArgs: [] as [],
      isPhantom: Owner.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => Owner.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Owner.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => Owner.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => Owner.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => Owner.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => Owner.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => Owner.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => Owner.fetch(client, id),
      new: (fields: OwnerFields) => {
        return new Owner([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Owner.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<Owner>> {
    return phantom(Owner.reified())
  }

  static get p() {
    return Owner.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('Owner', {
      balances: Bag.bcs,
      owner: bcs.bytes(32).transform({
        input: (val: string) => fromHEX(val),
        output: (val: Uint8Array) => toHEX(val),
      }),
    })
  }

  private static cachedBcs: ReturnType<typeof Owner.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof Owner.instantiateBcs> {
    if (!Owner.cachedBcs) {
      Owner.cachedBcs = Owner.instantiateBcs()
    }
    return Owner.cachedBcs
  }

  static fromFields(fields: Record<string, any>): Owner {
    return Owner.reified().new({
      balances: decodeFromFields(Bag.reified(), fields.balances),
      owner: decodeFromFields('address', fields.owner),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Owner {
    if (!isOwner(item.type)) {
      throw new Error('not a Owner type')
    }

    return Owner.reified().new({
      balances: decodeFromFieldsWithTypes(Bag.reified(), item.fields.balances),
      owner: decodeFromFieldsWithTypes('address', item.fields.owner),
    })
  }

  static fromBcs(data: Uint8Array): Owner {
    return Owner.fromFields(Owner.bcs.parse(data))
  }

  toJSONField() {
    return {
      balances: this.balances.toJSONField(),
      owner: this.owner,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): Owner {
    return Owner.reified().new({
      balances: decodeFromJSONField(Bag.reified(), field.balances),
      owner: decodeFromJSONField('address', field.owner),
    })
  }

  static fromJSON(json: Record<string, any>): Owner {
    if (json.$typeName !== Owner.$typeName) {
      throw new Error(
        `not a Owner json object: expected '${Owner.$typeName}' but got '${json.$typeName}'`
      )
    }

    return Owner.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): Owner {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isOwner(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Owner object`)
    }
    return Owner.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): Owner {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isOwner(data.bcs.type)) {
        throw new Error(`object at is not a Owner object`)
      }

      return Owner.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Owner.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<Owner> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching Owner object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isOwner(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a Owner object`)
    }

    return Owner.fromSuiObjectData(res.data)
  }
}

/* ============================== MetadataKey =============================== */

export function isMetadataKey(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::accumulator_metadata::MetadataKey` + '<')
}

export interface MetadataKeyFields<T0 extends PhantomTypeArgument> {
  dummyField: ToField<'bool'>
}

export type MetadataKeyReified<T0 extends PhantomTypeArgument> = Reified<
  MetadataKey<T0>,
  MetadataKeyFields<T0>
>

export class MetadataKey<T0 extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::accumulator_metadata::MetadataKey`
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName = MetadataKey.$typeName
  readonly $fullTypeName: `0x2::accumulator_metadata::MetadataKey<${PhantomToTypeStr<T0>}>`
  readonly $typeArgs: [PhantomToTypeStr<T0>]
  readonly $isPhantom = MetadataKey.$isPhantom

  readonly dummyField: ToField<'bool'>

  private constructor(typeArgs: [PhantomToTypeStr<T0>], fields: MetadataKeyFields<T0>) {
    this.$fullTypeName = composeSuiType(
      MetadataKey.$typeName,
      ...typeArgs
    ) as `0x2::accumulator_metadata::MetadataKey<${PhantomToTypeStr<T0>}>`
    this.$typeArgs = typeArgs

    this.dummyField = fields.dummyField
  }

  static reified<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): MetadataKeyReified<ToPhantomTypeArgument<T0>> {
    const reifiedBcs = MetadataKey.bcs
    return {
      typeName: MetadataKey.$typeName,
      fullTypeName: composeSuiType(
        MetadataKey.$typeName,
        ...[extractType(T0)]
      ) as `0x2::accumulator_metadata::MetadataKey<${PhantomToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [extractType(T0)] as [PhantomToTypeStr<ToPhantomTypeArgument<T0>>],
      isPhantom: MetadataKey.$isPhantom,
      reifiedTypeArgs: [T0],
      fromFields: (fields: Record<string, any>) => MetadataKey.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => MetadataKey.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => MetadataKey.fromFields(T0, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => MetadataKey.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => MetadataKey.fromJSON(T0, json),
      fromSuiParsedData: (content: SuiParsedData) => MetadataKey.fromSuiParsedData(T0, content),
      fromSuiObjectData: (content: SuiObjectData) => MetadataKey.fromSuiObjectData(T0, content),
      fetch: async (client: SuiClient, id: string) => MetadataKey.fetch(client, T0, id),
      new: (fields: MetadataKeyFields<ToPhantomTypeArgument<T0>>) => {
        return new MetadataKey([extractType(T0)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return MetadataKey.reified
  }

  static phantom<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): PhantomReified<ToTypeStr<MetadataKey<ToPhantomTypeArgument<T0>>>> {
    return phantom(MetadataKey.reified(T0))
  }

  static get p() {
    return MetadataKey.phantom
  }

  private static instantiateBcs() {
    return bcs.struct('MetadataKey', {
      dummy_field: bcs.bool(),
    })
  }

  private static cachedBcs: ReturnType<typeof MetadataKey.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof MetadataKey.instantiateBcs> {
    if (!MetadataKey.cachedBcs) {
      MetadataKey.cachedBcs = MetadataKey.instantiateBcs()
    }
    return MetadataKey.cachedBcs
  }

  static fromFields<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    fields: Record<string, any>
  ): MetadataKey<ToPhantomTypeArgument<T0>> {
    return MetadataKey.reified(typeArg).new({
      dummyField: decodeFromFields('bool', fields.dummy_field),
    })
  }

  static fromFieldsWithTypes<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    item: FieldsWithTypes
  ): MetadataKey<ToPhantomTypeArgument<T0>> {
    if (!isMetadataKey(item.type)) {
      throw new Error('not a MetadataKey type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return MetadataKey.reified(typeArg).new({
      dummyField: decodeFromFieldsWithTypes('bool', item.fields.dummy_field),
    })
  }

  static fromBcs<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: Uint8Array
  ): MetadataKey<ToPhantomTypeArgument<T0>> {
    return MetadataKey.fromFields(typeArg, MetadataKey.bcs.parse(data))
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
  ): MetadataKey<ToPhantomTypeArgument<T0>> {
    return MetadataKey.reified(typeArg).new({
      dummyField: decodeFromJSONField('bool', field.dummyField),
    })
  }

  static fromJSON<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    json: Record<string, any>
  ): MetadataKey<ToPhantomTypeArgument<T0>> {
    if (json.$typeName !== MetadataKey.$typeName) {
      throw new Error(
        `not a MetadataKey json object: expected '${MetadataKey.$typeName}' but got '${json.$typeName}'`
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(MetadataKey.$typeName, ...[extractType(typeArg)]),
      json.$typeArgs,
      [typeArg]
    )

    return MetadataKey.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    content: SuiParsedData
  ): MetadataKey<ToPhantomTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isMetadataKey(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a MetadataKey object`)
    }
    return MetadataKey.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: SuiObjectData
  ): MetadataKey<ToPhantomTypeArgument<T0>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isMetadataKey(data.bcs.type)) {
        throw new Error(`object at is not a MetadataKey object`)
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

      return MetadataKey.fromBcs(typeArg, fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return MetadataKey.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<T0 extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<MetadataKey<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching MetadataKey object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isMetadataKey(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a MetadataKey object`)
    }

    return MetadataKey.fromSuiObjectData(typeArg, res.data)
  }
}

/* ============================== Metadata =============================== */

export function isMetadata(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::accumulator_metadata::Metadata` + '<')
}

export interface MetadataFields<T0 extends PhantomTypeArgument> {
  fields: ToField<Bag>
}

export type MetadataReified<T0 extends PhantomTypeArgument> = Reified<
  Metadata<T0>,
  MetadataFields<T0>
>

export class Metadata<T0 extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::accumulator_metadata::Metadata`
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName = Metadata.$typeName
  readonly $fullTypeName: `0x2::accumulator_metadata::Metadata<${PhantomToTypeStr<T0>}>`
  readonly $typeArgs: [PhantomToTypeStr<T0>]
  readonly $isPhantom = Metadata.$isPhantom

  readonly fields: ToField<Bag>

  private constructor(typeArgs: [PhantomToTypeStr<T0>], fields: MetadataFields<T0>) {
    this.$fullTypeName = composeSuiType(
      Metadata.$typeName,
      ...typeArgs
    ) as `0x2::accumulator_metadata::Metadata<${PhantomToTypeStr<T0>}>`
    this.$typeArgs = typeArgs

    this.fields = fields.fields
  }

  static reified<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): MetadataReified<ToPhantomTypeArgument<T0>> {
    const reifiedBcs = Metadata.bcs
    return {
      typeName: Metadata.$typeName,
      fullTypeName: composeSuiType(
        Metadata.$typeName,
        ...[extractType(T0)]
      ) as `0x2::accumulator_metadata::Metadata<${PhantomToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [extractType(T0)] as [PhantomToTypeStr<ToPhantomTypeArgument<T0>>],
      isPhantom: Metadata.$isPhantom,
      reifiedTypeArgs: [T0],
      fromFields: (fields: Record<string, any>) => Metadata.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Metadata.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => Metadata.fromFields(T0, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => Metadata.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => Metadata.fromJSON(T0, json),
      fromSuiParsedData: (content: SuiParsedData) => Metadata.fromSuiParsedData(T0, content),
      fromSuiObjectData: (content: SuiObjectData) => Metadata.fromSuiObjectData(T0, content),
      fetch: async (client: SuiClient, id: string) => Metadata.fetch(client, T0, id),
      new: (fields: MetadataFields<ToPhantomTypeArgument<T0>>) => {
        return new Metadata([extractType(T0)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Metadata.reified
  }

  static phantom<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): PhantomReified<ToTypeStr<Metadata<ToPhantomTypeArgument<T0>>>> {
    return phantom(Metadata.reified(T0))
  }

  static get p() {
    return Metadata.phantom
  }

  private static instantiateBcs() {
    return bcs.struct('Metadata', {
      fields: Bag.bcs,
    })
  }

  private static cachedBcs: ReturnType<typeof Metadata.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof Metadata.instantiateBcs> {
    if (!Metadata.cachedBcs) {
      Metadata.cachedBcs = Metadata.instantiateBcs()
    }
    return Metadata.cachedBcs
  }

  static fromFields<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    fields: Record<string, any>
  ): Metadata<ToPhantomTypeArgument<T0>> {
    return Metadata.reified(typeArg).new({
      fields: decodeFromFields(Bag.reified(), fields.fields),
    })
  }

  static fromFieldsWithTypes<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    item: FieldsWithTypes
  ): Metadata<ToPhantomTypeArgument<T0>> {
    if (!isMetadata(item.type)) {
      throw new Error('not a Metadata type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Metadata.reified(typeArg).new({
      fields: decodeFromFieldsWithTypes(Bag.reified(), item.fields.fields),
    })
  }

  static fromBcs<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: Uint8Array
  ): Metadata<ToPhantomTypeArgument<T0>> {
    return Metadata.fromFields(typeArg, Metadata.bcs.parse(data))
  }

  toJSONField() {
    return {
      fields: this.fields.toJSONField(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    field: any
  ): Metadata<ToPhantomTypeArgument<T0>> {
    return Metadata.reified(typeArg).new({
      fields: decodeFromJSONField(Bag.reified(), field.fields),
    })
  }

  static fromJSON<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    json: Record<string, any>
  ): Metadata<ToPhantomTypeArgument<T0>> {
    if (json.$typeName !== Metadata.$typeName) {
      throw new Error(
        `not a Metadata json object: expected '${Metadata.$typeName}' but got '${json.$typeName}'`
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Metadata.$typeName, ...[extractType(typeArg)]),
      json.$typeArgs,
      [typeArg]
    )

    return Metadata.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    content: SuiParsedData
  ): Metadata<ToPhantomTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isMetadata(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Metadata object`)
    }
    return Metadata.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: SuiObjectData
  ): Metadata<ToPhantomTypeArgument<T0>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isMetadata(data.bcs.type)) {
        throw new Error(`object at is not a Metadata object`)
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

      return Metadata.fromBcs(typeArg, fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Metadata.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<T0 extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<Metadata<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching Metadata object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isMetadata(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a Metadata object`)
    }

    return Metadata.fromSuiObjectData(typeArg, res.data)
  }
}
