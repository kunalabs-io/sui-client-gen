/**
 * Enables the creation of objects with deterministic addresses derived from a parent object's UID.
 * This module provides a way to generate objects with predictable addresses based on a parent UID
 * and a key, creating a namespace that ensures uniqueness for each parent-key combination,
 * which is usually how registries are built.
 *
 * Key features:
 * - Deterministic address generation based on parent object UID and key
 * - Derived objects can exist and operate independently of their parent
 *
 * The derived UIDs, once created, are independent and do not require sequencing on the parent
 * object. They can be used without affecting the parent. The parent only maintains a record of
 * which derived addresses have been claimed to prevent duplicates.
 */

import {
  EnumVariantClass,
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
  SupportedSuiClient,
  composeSuiType,
  compressSuiType,
  fetchObjectBcs,
  parseTypeName,
} from '../../_framework/util'
import { ID } from '../object/structs'
import { BcsType, bcs } from '@mysten/sui/bcs'
import { SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromBase64 } from '@mysten/sui/utils'

/* ============================== Claimed =============================== */

export function isClaimed(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::derived_object::Claimed`
}

export interface ClaimedFields {
  pos0: ToField<ID>
}

export type ClaimedReified = Reified<Claimed, ClaimedFields>

/** Added as a DF to the parent's UID, to mark an ID as claimed. */
export class Claimed implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::derived_object::Claimed` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = Claimed.$typeName
  readonly $fullTypeName: `0x2::derived_object::Claimed`
  readonly $typeArgs: []
  readonly $isPhantom = Claimed.$isPhantom

  readonly pos0: ToField<ID>

  private constructor(typeArgs: [], fields: ClaimedFields) {
    this.$fullTypeName = composeSuiType(
      Claimed.$typeName,
      ...typeArgs
    ) as `0x2::derived_object::Claimed`
    this.$typeArgs = typeArgs

    this.pos0 = fields.pos0
  }

  static reified(): ClaimedReified {
    const reifiedBcs = Claimed.bcs
    return {
      typeName: Claimed.$typeName,
      fullTypeName: composeSuiType(Claimed.$typeName, ...[]) as `0x2::derived_object::Claimed`,
      typeArgs: [] as [],
      isPhantom: Claimed.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => Claimed.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Claimed.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => Claimed.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => Claimed.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => Claimed.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => Claimed.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => Claimed.fromSuiObjectData(content),
      fetch: async (client: SupportedSuiClient, id: string) => Claimed.fetch(client, id),
      new: (fields: ClaimedFields) => {
        return new Claimed([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Claimed.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<Claimed>> {
    return phantom(Claimed.reified())
  }

  static get p() {
    return Claimed.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('Claimed', {
      pos0: ID.bcs,
    })
  }

  private static cachedBcs: ReturnType<typeof Claimed.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof Claimed.instantiateBcs> {
    if (!Claimed.cachedBcs) {
      Claimed.cachedBcs = Claimed.instantiateBcs()
    }
    return Claimed.cachedBcs
  }

  static fromFields(fields: Record<string, any>): Claimed {
    return Claimed.reified().new({
      pos0: decodeFromFields(ID.reified(), fields.pos0),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Claimed {
    if (!isClaimed(item.type)) {
      throw new Error('not a Claimed type')
    }

    return Claimed.reified().new({
      pos0: decodeFromFieldsWithTypes(ID.reified(), item.fields.pos0),
    })
  }

  static fromBcs(data: Uint8Array): Claimed {
    return Claimed.fromFields(Claimed.bcs.parse(data))
  }

  toJSONField() {
    return {
      pos0: this.pos0,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): Claimed {
    return Claimed.reified().new({
      pos0: decodeFromJSONField(ID.reified(), field.pos0),
    })
  }

  static fromJSON(json: Record<string, any>): Claimed {
    if (json.$typeName !== Claimed.$typeName) {
      throw new Error(
        `not a Claimed json object: expected '${Claimed.$typeName}' but got '${json.$typeName}'`
      )
    }

    return Claimed.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): Claimed {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isClaimed(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Claimed object`)
    }
    return Claimed.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): Claimed {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isClaimed(data.bcs.type)) {
        throw new Error(`object at is not a Claimed object`)
      }

      return Claimed.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Claimed.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<Claimed> {
    const res = await fetchObjectBcs(client, id)
    if (!isClaimed(res.type)) {
      throw new Error(`object at id ${id} is not a Claimed object`)
    }

    return Claimed.fromBcs(res.bcsBytes)
  }
}

/* ============================== DerivedObjectKey =============================== */

export function isDerivedObjectKey(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::derived_object::DerivedObjectKey` + '<')
}

export interface DerivedObjectKeyFields<K extends TypeArgument> {
  pos0: ToField<K>
}

export type DerivedObjectKeyReified<K extends TypeArgument> = Reified<
  DerivedObjectKey<K>,
  DerivedObjectKeyFields<K>
>

/** An internal key to protect from generating the same UID twice (e.g. collide with DFs) */
export class DerivedObjectKey<K extends TypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::derived_object::DerivedObjectKey` as const
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [false] as const

  readonly $typeName = DerivedObjectKey.$typeName
  readonly $fullTypeName: `0x2::derived_object::DerivedObjectKey<${ToTypeStr<K>}>`
  readonly $typeArgs: [ToTypeStr<K>]
  readonly $isPhantom = DerivedObjectKey.$isPhantom

  readonly pos0: ToField<K>

  private constructor(typeArgs: [ToTypeStr<K>], fields: DerivedObjectKeyFields<K>) {
    this.$fullTypeName = composeSuiType(
      DerivedObjectKey.$typeName,
      ...typeArgs
    ) as `0x2::derived_object::DerivedObjectKey<${ToTypeStr<K>}>`
    this.$typeArgs = typeArgs

    this.pos0 = fields.pos0
  }

  static reified<K extends Reified<TypeArgument, any>>(
    K: K
  ): DerivedObjectKeyReified<ToTypeArgument<K>> {
    const reifiedBcs = DerivedObjectKey.bcs(toBcs(K))
    return {
      typeName: DerivedObjectKey.$typeName,
      fullTypeName: composeSuiType(
        DerivedObjectKey.$typeName,
        ...[extractType(K)]
      ) as `0x2::derived_object::DerivedObjectKey<${ToTypeStr<ToTypeArgument<K>>}>`,
      typeArgs: [extractType(K)] as [ToTypeStr<ToTypeArgument<K>>],
      isPhantom: DerivedObjectKey.$isPhantom,
      reifiedTypeArgs: [K],
      fromFields: (fields: Record<string, any>) => DerivedObjectKey.fromFields(K, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => DerivedObjectKey.fromFieldsWithTypes(K, item),
      fromBcs: (data: Uint8Array) => DerivedObjectKey.fromFields(K, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => DerivedObjectKey.fromJSONField(K, field),
      fromJSON: (json: Record<string, any>) => DerivedObjectKey.fromJSON(K, json),
      fromSuiParsedData: (content: SuiParsedData) => DerivedObjectKey.fromSuiParsedData(K, content),
      fromSuiObjectData: (content: SuiObjectData) => DerivedObjectKey.fromSuiObjectData(K, content),
      fetch: async (client: SupportedSuiClient, id: string) =>
        DerivedObjectKey.fetch(client, K, id),
      new: (fields: DerivedObjectKeyFields<ToTypeArgument<K>>) => {
        return new DerivedObjectKey([extractType(K)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return DerivedObjectKey.reified
  }

  static phantom<K extends Reified<TypeArgument, any>>(
    K: K
  ): PhantomReified<ToTypeStr<DerivedObjectKey<ToTypeArgument<K>>>> {
    return phantom(DerivedObjectKey.reified(K))
  }

  static get p() {
    return DerivedObjectKey.phantom
  }

  private static instantiateBcs() {
    return <K extends BcsType<any>>(K: K) =>
      bcs.struct(`DerivedObjectKey<${K.name}>`, {
        pos0: K,
      })
  }

  private static cachedBcs: ReturnType<typeof DerivedObjectKey.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof DerivedObjectKey.instantiateBcs> {
    if (!DerivedObjectKey.cachedBcs) {
      DerivedObjectKey.cachedBcs = DerivedObjectKey.instantiateBcs()
    }
    return DerivedObjectKey.cachedBcs
  }

  static fromFields<K extends Reified<TypeArgument, any>>(
    typeArg: K,
    fields: Record<string, any>
  ): DerivedObjectKey<ToTypeArgument<K>> {
    return DerivedObjectKey.reified(typeArg).new({
      pos0: decodeFromFields(typeArg, fields.pos0),
    })
  }

  static fromFieldsWithTypes<K extends Reified<TypeArgument, any>>(
    typeArg: K,
    item: FieldsWithTypes
  ): DerivedObjectKey<ToTypeArgument<K>> {
    if (!isDerivedObjectKey(item.type)) {
      throw new Error('not a DerivedObjectKey type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return DerivedObjectKey.reified(typeArg).new({
      pos0: decodeFromFieldsWithTypes(typeArg, item.fields.pos0),
    })
  }

  static fromBcs<K extends Reified<TypeArgument, any>>(
    typeArg: K,
    data: Uint8Array
  ): DerivedObjectKey<ToTypeArgument<K>> {
    const typeArgs = [typeArg]
    return DerivedObjectKey.fromFields(typeArg, DerivedObjectKey.bcs(toBcs(typeArg)).parse(data))
  }

  toJSONField() {
    return {
      pos0: fieldToJSON<K>(`${this.$typeArgs[0]}`, this.pos0),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<K extends Reified<TypeArgument, any>>(
    typeArg: K,
    field: any
  ): DerivedObjectKey<ToTypeArgument<K>> {
    return DerivedObjectKey.reified(typeArg).new({
      pos0: decodeFromJSONField(typeArg, field.pos0),
    })
  }

  static fromJSON<K extends Reified<TypeArgument, any>>(
    typeArg: K,
    json: Record<string, any>
  ): DerivedObjectKey<ToTypeArgument<K>> {
    if (json.$typeName !== DerivedObjectKey.$typeName) {
      throw new Error(
        `not a DerivedObjectKey json object: expected '${DerivedObjectKey.$typeName}' but got '${json.$typeName}'`
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(DerivedObjectKey.$typeName, ...[extractType(typeArg)]),
      json.$typeArgs,
      [typeArg]
    )

    return DerivedObjectKey.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<K extends Reified<TypeArgument, any>>(
    typeArg: K,
    content: SuiParsedData
  ): DerivedObjectKey<ToTypeArgument<K>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isDerivedObjectKey(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a DerivedObjectKey object`)
    }
    return DerivedObjectKey.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<K extends Reified<TypeArgument, any>>(
    typeArg: K,
    data: SuiObjectData
  ): DerivedObjectKey<ToTypeArgument<K>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isDerivedObjectKey(data.bcs.type)) {
        throw new Error(`object at is not a DerivedObjectKey object`)
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

      return DerivedObjectKey.fromBcs(typeArg, fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return DerivedObjectKey.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<K extends Reified<TypeArgument, any>>(
    client: SupportedSuiClient,
    typeArg: K,
    id: string
  ): Promise<DerivedObjectKey<ToTypeArgument<K>>> {
    const res = await fetchObjectBcs(client, id)
    if (!isDerivedObjectKey(res.type)) {
      throw new Error(`object at id ${id} is not a DerivedObjectKey object`)
    }

    return DerivedObjectKey.fromBcs(typeArg, res.bcsBytes)
  }
}

/* ============================== ClaimedStatus =============================== */

/**
 * The possible values of a claimed UID.
 * We make it an enum to make upgradeability easier in the future.
 */

export function isClaimedStatus(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::derived_object::ClaimedStatus`
}

export type ClaimedStatusVariant = ClaimedStatusReserved

export type ClaimedStatusVariantName = 'Reserved'

export function isClaimedStatusVariantName(variant: string): variant is ClaimedStatusVariantName {
  return variant === 'Reserved'
}

export type ClaimedStatusFields = ClaimedStatusReservedFields

export type ClaimedStatusReified = Reified<ClaimedStatusVariant, ClaimedStatusFields>

export class ClaimedStatus {
  static readonly $typeName = `0x2::derived_object::ClaimedStatus` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  static reified(): ClaimedStatusReified {
    const reifiedBcs = ClaimedStatus.bcs
    return {
      typeName: ClaimedStatus.$typeName,
      fullTypeName: composeSuiType(ClaimedStatus.$typeName) as `0x2::derived_object::ClaimedStatus`,
      typeArgs: [] as [],
      isPhantom: ClaimedStatus.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => ClaimedStatus.fromFields([], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => ClaimedStatus.fromFieldsWithTypes([], item),
      fromBcs: (data: Uint8Array) => ClaimedStatus.fromBcs([], data),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => ClaimedStatus.fromJSONField([], field),
      fromJSON: (json: Record<string, any>) => ClaimedStatus.fromJSON([], json),
      new: (variant: ClaimedStatusVariantName, fields: ClaimedStatusFields) => {
        switch (variant) {
          case 'Reserved':
            return new ClaimedStatusReserved([], fields as ClaimedStatusReservedFields)
        }
      },
      kind: 'EnumClassReified',
    } as ClaimedStatusReified
  }

  static get r() {
    return ClaimedStatus.reified
  }

  static phantom(): PhantomReified<ToTypeStr<ClaimedStatusVariant>> {
    return phantom(ClaimedStatus.reified())
  }

  static get p() {
    return ClaimedStatus.phantom
  }

  private static instantiateBcs() {
    return bcs.enum('ClaimedStatus', {
      Reserved: null,
    })
  }

  private static cachedBcs: ReturnType<typeof ClaimedStatus.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof ClaimedStatus.instantiateBcs> {
    if (!ClaimedStatus.cachedBcs) {
      ClaimedStatus.cachedBcs = ClaimedStatus.instantiateBcs()
    }
    return ClaimedStatus.cachedBcs
  }

  static fromFields(typeArgs: [], fields: Record<string, any>): ClaimedStatusVariant {
    const r = ClaimedStatus.reified()

    if (!fields.$kind || !isClaimedStatusVariantName(fields.$kind)) {
      throw new Error(`Invalid claimedstatus variant: ${fields.$kind}`)
    }
    switch (fields.$kind) {
      case 'Reserved':
        return r.new('Reserved', fields.Reserved)
    }
  }

  static fromFieldsWithTypes(typeArgs: [], item: FieldsWithTypes): ClaimedStatusVariant {
    if (!isClaimedStatus(item.type)) {
      throw new Error('not a ClaimedStatus type')
    }

    const variant = (item as FieldsWithTypes & { variant: ClaimedStatusVariantName }).variant
    if (!variant || !isClaimedStatusVariantName(variant)) {
      throw new Error(`Invalid claimedstatus variant: ${variant}`)
    }

    const r = ClaimedStatus.reified()
    switch (variant) {
      case 'Reserved':
        return r.new('Reserved', {})
    }
  }

  static fromBcs(typeArgs: [], data: Uint8Array): ClaimedStatusVariant {
    const parsed = ClaimedStatus.bcs.parse(data)
    return ClaimedStatus.fromFields([], parsed)
  }

  static fromJSONField(typeArgs: [], field: any): ClaimedStatusVariant {
    const r = ClaimedStatus.reified()

    const kind = field.$kind
    if (!kind || !isClaimedStatusVariantName(kind)) {
      throw new Error(`Invalid claimedstatus variant: ${kind}`)
    }
    switch (kind) {
      case 'Reserved':
        return r.new('Reserved', {})
    }
  }

  static fromJSON(typeArgs: [], json: Record<string, any>): ClaimedStatusVariant {
    if (json.$typeName !== ClaimedStatus.$typeName) {
      throw new Error(
        `not a ClaimedStatus json object: expected '${ClaimedStatus.$typeName}' but got '${json.$typeName}'`
      )
    }

    return ClaimedStatus.fromJSONField(typeArgs, json)
  }
}

/** The UID has been claimed and cannot be re-claimed or used. */
export type ClaimedStatusReservedFields = Record<string, never>

export class ClaimedStatusReserved implements EnumVariantClass {
  __EnumVariantClass = true as const

  static readonly $typeName = ClaimedStatus.$typeName
  static readonly $numTypeParams = ClaimedStatus.$numTypeParams
  static readonly $isPhantom = ClaimedStatus.$isPhantom
  static readonly $variantName = 'Reserved'

  readonly $typeName = ClaimedStatusReserved.$typeName
  readonly $fullTypeName: `${typeof ClaimedStatus.$typeName}`
  readonly $typeArgs: []
  readonly $isPhantom = ClaimedStatus.$isPhantom
  readonly $variantName = ClaimedStatusReserved.$variantName

  constructor(typeArgs: [], fields: ClaimedStatusReservedFields) {
    this.$fullTypeName = composeSuiType(
      ClaimedStatus.$typeName,
      ...typeArgs
    ) as `${typeof ClaimedStatus.$typeName}`
    this.$typeArgs = typeArgs
  }

  toJSONField() {
    return { $kind: this.$variantName }
  }

  toJSON() {
    return {
      $typeName: this.$typeName,
      $typeArgs: this.$typeArgs,
      $variantName: this.$variantName,
      ...this.toJSONField(),
    }
  }
}
