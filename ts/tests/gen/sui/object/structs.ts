/** Sui object identifiers */

import { bcs } from '@mysten/sui/bcs'
import type { ClientWithCoreApi, SuiClientTypes } from '@mysten/sui/client'
import type { SuiObjectData, SuiParsedData } from '@mysten/sui/jsonRpc'
import { fromBase64, fromHex, toHex } from '@mysten/sui/utils'
import {
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  phantom,
  PhantomReified,
  Reified,
  StructClass,
  ToField,
  ToJSON,
  ToTypeStr,
} from '../../_framework/reified'
import { composeSuiType, compressSuiType, FieldsWithTypes } from '../../_framework/util'

/* ============================== ID =============================== */

export function isID(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::object::ID`
}

export interface IDFields {
  bytes: ToField<'address'>
}

export type IDReified = Reified<ID, IDFields>

export type IDJSONField = {
  bytes: string
}

export type IDJSON = {
  $typeName: typeof ID.$typeName
  $typeArgs: []
} & IDJSONField

/**
 * An object ID. This is used to reference Sui Objects.
 * This is *not* guaranteed to be globally unique--anyone can create an `ID` from a `UID` or
 * from an object, and ID's can be freely copied and dropped.
 * Here, the values are not globally unique because there can be multiple values of type `ID`
 * with the same underlying bytes. For example, `object::id(&obj)` can be called as many times
 * as you want for a given `obj`, and each `ID` value will be identical.
 */
export class ID implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::object::ID` = `0x2::object::ID` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName: typeof ID.$typeName = ID.$typeName
  readonly $fullTypeName: `0x2::object::ID`
  readonly $typeArgs: []
  readonly $isPhantom: typeof ID.$isPhantom = ID.$isPhantom

  readonly bytes: ToField<'address'>

  private constructor(typeArgs: [], fields: IDFields) {
    this.$fullTypeName = composeSuiType(
      ID.$typeName,
      ...typeArgs,
    ) as `0x2::object::ID`
    this.$typeArgs = typeArgs

    this.bytes = fields.bytes
  }

  static reified(): IDReified {
    const reifiedBcs = ID.bcs
    return {
      get typeName() {
        return ID.$typeName
      },
      get fullTypeName() {
        return composeSuiType(
          ID.$typeName,
          ...[],
        ) as `0x2::object::ID`
      },
      typeArgs: [] as [],
      isPhantom: ID.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => ID.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => ID.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => ID.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => ID.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => ID.fromJSON(json),
      fromCoreObject: (obj: SuiClientTypes.Object<{ content: true }>) => ID.fromCoreObject(obj),
      fromSuiParsedData: (content: SuiParsedData) => ID.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => ID.fromSuiObjectData(content),
      fetch: async (client: ClientWithCoreApi, id: string) => ID.fetch(client, id),
      new: (fields: IDFields) => {
        return new ID([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): IDReified {
    return ID.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<ID>> {
    return phantom(ID.reified())
  }

  static get p(): PhantomReified<ToTypeStr<ID>> {
    return ID.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('ID', {
      bytes: bcs.bytes(32).transform({
        input: (val: string) => fromHex(val),
        output: (val: Uint8Array) => toHex(val),
      }),
    })
  }

  private static cachedBcs: ReturnType<typeof ID.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof ID.instantiateBcs> {
    if (!ID.cachedBcs) {
      ID.cachedBcs = ID.instantiateBcs()
    }
    return ID.cachedBcs
  }

  static fromFields(fields: Record<string, any>): ID {
    return ID.reified().new({
      bytes: decodeFromFields('address', fields.bytes),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): ID {
    if (!isID(item.type)) {
      throw new Error('not a ID type')
    }

    return ID.reified().new({
      bytes: decodeFromFieldsWithTypes('address', item.fields.bytes),
    })
  }

  static fromBcs(data: Uint8Array): ID {
    return ID.fromFields(ID.bcs.parse(data))
  }

  toJSONField(): IDJSONField {
    return {
      bytes: this.bytes,
    }
  }

  toJSON(): IDJSON {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): ID {
    return ID.reified().new({
      bytes: decodeFromJSONField('address', field.bytes),
    })
  }

  static fromJSON(json: Record<string, any>): ID {
    if (json.$typeName !== ID.$typeName) {
      throw new Error(
        `not a ID json object: expected '${ID.$typeName}' but got '${json.$typeName}'`,
      )
    }

    return ID.fromJSONField(json)
  }

  static fromCoreObject(obj: SuiClientTypes.Object<{ content: true }>): ID {
    if (!isID(obj.type)) {
      throw new Error(`object at ${obj.objectId} is not a ID object`)
    }
    return ID.fromBcs(obj.content)
  }

  /** @deprecated `SuiParsedData` is a JSON-RPC-only type that is being phased out upstream. Use {@link ID.fromCoreObject} together with `client.core.getObject({ include: { content: true } })` for transport-agnostic parsing. */
  static fromSuiParsedData(content: SuiParsedData): ID {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isID(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a ID object`)
    }
    return ID.fromFieldsWithTypes(content)
  }

  /** @deprecated `SuiObjectData` is a JSON-RPC-only type that is being phased out upstream. Use {@link ID.fromCoreObject} together with `client.core.getObject({ include: { content: true } })` for transport-agnostic parsing. */
  static fromSuiObjectData(data: SuiObjectData): ID {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isID(data.bcs.type)) {
        throw new Error(`object at is not a ID object`)
      }

      return ID.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return ID.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.',
    )
  }

  static async fetch(client: ClientWithCoreApi, id: string): Promise<ID> {
    const { object } = await client.core.getObject({
      objectId: id,
      include: { content: true },
    })
    if (!isID(object.type)) {
      throw new Error(`object at id ${id} is not a ID object`)
    }
    return ID.fromBcs(object.content)
  }
}

/* ============================== UID =============================== */

export function isUID(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::object::UID`
}

export interface UIDFields {
  id: ToField<ID>
}

export type UIDReified = Reified<UID, UIDFields>

export type UIDJSONField = {
  id: string
}

export type UIDJSON = {
  $typeName: typeof UID.$typeName
  $typeArgs: []
} & UIDJSONField

/**
 * Globally unique IDs that define an object's ID in storage. Any Sui Object, that is a struct
 * with the `key` ability, must have `id: UID` as its first field.
 * These are globally unique in the sense that no two values of type `UID` are ever equal, in
 * other words for any two values `id1: UID` and `id2: UID`, `id1` != `id2`.
 * This is a privileged type that can only be derived from a `TxContext`.
 * `UID` doesn't have the `drop` ability, so deleting a `UID` requires a call to `delete`.
 */
export class UID implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::object::UID` = `0x2::object::UID` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName: typeof UID.$typeName = UID.$typeName
  readonly $fullTypeName: `0x2::object::UID`
  readonly $typeArgs: []
  readonly $isPhantom: typeof UID.$isPhantom = UID.$isPhantom

  readonly id: ToField<ID>

  private constructor(typeArgs: [], fields: UIDFields) {
    this.$fullTypeName = composeSuiType(
      UID.$typeName,
      ...typeArgs,
    ) as `0x2::object::UID`
    this.$typeArgs = typeArgs

    this.id = fields.id
  }

  static reified(): UIDReified {
    const reifiedBcs = UID.bcs
    return {
      get typeName() {
        return UID.$typeName
      },
      get fullTypeName() {
        return composeSuiType(
          UID.$typeName,
          ...[],
        ) as `0x2::object::UID`
      },
      typeArgs: [] as [],
      isPhantom: UID.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => UID.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => UID.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => UID.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => UID.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => UID.fromJSON(json),
      fromCoreObject: (obj: SuiClientTypes.Object<{ content: true }>) => UID.fromCoreObject(obj),
      fromSuiParsedData: (content: SuiParsedData) => UID.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => UID.fromSuiObjectData(content),
      fetch: async (client: ClientWithCoreApi, id: string) => UID.fetch(client, id),
      new: (fields: UIDFields) => {
        return new UID([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): UIDReified {
    return UID.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<UID>> {
    return phantom(UID.reified())
  }

  static get p(): PhantomReified<ToTypeStr<UID>> {
    return UID.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('UID', {
      id: ID.bcs,
    })
  }

  private static cachedBcs: ReturnType<typeof UID.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof UID.instantiateBcs> {
    if (!UID.cachedBcs) {
      UID.cachedBcs = UID.instantiateBcs()
    }
    return UID.cachedBcs
  }

  static fromFields(fields: Record<string, any>): UID {
    return UID.reified().new({
      id: decodeFromFields(ID.reified(), fields.id),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): UID {
    if (!isUID(item.type)) {
      throw new Error('not a UID type')
    }

    return UID.reified().new({
      id: decodeFromFieldsWithTypes(ID.reified(), item.fields.id),
    })
  }

  static fromBcs(data: Uint8Array): UID {
    return UID.fromFields(UID.bcs.parse(data))
  }

  toJSONField(): UIDJSONField {
    return {
      id: this.id,
    }
  }

  toJSON(): UIDJSON {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): UID {
    return UID.reified().new({
      id: decodeFromJSONField(ID.reified(), field.id),
    })
  }

  static fromJSON(json: Record<string, any>): UID {
    if (json.$typeName !== UID.$typeName) {
      throw new Error(
        `not a UID json object: expected '${UID.$typeName}' but got '${json.$typeName}'`,
      )
    }

    return UID.fromJSONField(json)
  }

  static fromCoreObject(obj: SuiClientTypes.Object<{ content: true }>): UID {
    if (!isUID(obj.type)) {
      throw new Error(`object at ${obj.objectId} is not a UID object`)
    }
    return UID.fromBcs(obj.content)
  }

  /** @deprecated `SuiParsedData` is a JSON-RPC-only type that is being phased out upstream. Use {@link UID.fromCoreObject} together with `client.core.getObject({ include: { content: true } })` for transport-agnostic parsing. */
  static fromSuiParsedData(content: SuiParsedData): UID {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isUID(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a UID object`)
    }
    return UID.fromFieldsWithTypes(content)
  }

  /** @deprecated `SuiObjectData` is a JSON-RPC-only type that is being phased out upstream. Use {@link UID.fromCoreObject} together with `client.core.getObject({ include: { content: true } })` for transport-agnostic parsing. */
  static fromSuiObjectData(data: SuiObjectData): UID {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isUID(data.bcs.type)) {
        throw new Error(`object at is not a UID object`)
      }

      return UID.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return UID.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.',
    )
  }

  static async fetch(client: ClientWithCoreApi, id: string): Promise<UID> {
    const { object } = await client.core.getObject({
      objectId: id,
      include: { content: true },
    })
    if (!isUID(object.type)) {
      throw new Error(`object at id ${id} is not a UID object`)
    }
    return UID.fromBcs(object.content)
  }
}
