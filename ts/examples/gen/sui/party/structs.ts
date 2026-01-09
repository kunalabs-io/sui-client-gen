import {
  PhantomReified,
  Reified,
  StructClass,
  ToField,
  ToJSON,
  ToTypeStr,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  phantom,
} from '../../_framework/reified'
import {
  FieldsWithTypes,
  SupportedSuiClient,
  composeSuiType,
  compressSuiType,
  fetchObjectBcs,
} from '../../_framework/util'
import { VecMap } from '../vec-map/structs'
import { bcs } from '@mysten/sui/bcs'
import { SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromBase64, fromHex, toHex } from '@mysten/sui/utils'

/* ============================== Party =============================== */

export function isParty(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::party::Party`
}

export interface PartyFields {
  /** The permissions that apply if no specific permissions are set in the `members` map. */
  default: ToField<Permissions>
  /** The permissions per transaction sender. */
  members: ToField<VecMap<'address', Permissions>>
}

export type PartyReified = Reified<Party, PartyFields>

export type PartyJSONField = {
  default: ToJSON<Permissions>
  members: ToJSON<VecMap<'address', Permissions>>
}

export type PartyJSON = {
  $typeName: typeof Party.$typeName
  $typeArgs: []
} & PartyJSONField

/**
 * The permissions that apply to a party object. If the transaction sender has an entry in
 * the `members` map, the permissions in that entry apply. Otherwise, the `default` permissions
 * are used.
 * If the party has the `READ` permission, the object can be taken as an immutable input.
 * If the party has the `WRITE`, `DELETE`, or `TRANSFER` permissions, the object can be taken as
 * a mutable input. Additional restrictions pertaining to each permission are checked at the end
 * of transaction execution.
 */
export class Party implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::party::Party` = `0x2::party::Party` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName: typeof Party.$typeName = Party.$typeName
  readonly $fullTypeName: `0x2::party::Party`
  readonly $typeArgs: []
  readonly $isPhantom: typeof Party.$isPhantom = Party.$isPhantom

  /** The permissions that apply if no specific permissions are set in the `members` map. */
  readonly default: ToField<Permissions>
  /** The permissions per transaction sender. */
  readonly members: ToField<VecMap<'address', Permissions>>

  private constructor(typeArgs: [], fields: PartyFields) {
    this.$fullTypeName = composeSuiType(Party.$typeName, ...typeArgs) as `0x2::party::Party`
    this.$typeArgs = typeArgs

    this.default = fields.default
    this.members = fields.members
  }

  static reified(): PartyReified {
    const reifiedBcs = Party.bcs
    return {
      typeName: Party.$typeName,
      fullTypeName: composeSuiType(Party.$typeName, ...[]) as `0x2::party::Party`,
      typeArgs: [] as [],
      isPhantom: Party.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => Party.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Party.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => Party.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => Party.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => Party.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => Party.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => Party.fromSuiObjectData(content),
      fetch: async (client: SupportedSuiClient, id: string) => Party.fetch(client, id),
      new: (fields: PartyFields) => {
        return new Party([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): PartyReified {
    return Party.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<Party>> {
    return phantom(Party.reified())
  }

  static get p(): PhantomReified<ToTypeStr<Party>> {
    return Party.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('Party', {
      default: Permissions.bcs,
      members: VecMap.bcs(
        bcs.bytes(32).transform({
          input: (val: string) => fromHex(val),
          output: (val: Uint8Array) => toHex(val),
        }),
        Permissions.bcs
      ),
    })
  }

  private static cachedBcs: ReturnType<typeof Party.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof Party.instantiateBcs> {
    if (!Party.cachedBcs) {
      Party.cachedBcs = Party.instantiateBcs()
    }
    return Party.cachedBcs
  }

  static fromFields(fields: Record<string, any>): Party {
    return Party.reified().new({
      default: decodeFromFields(Permissions.reified(), fields.default),
      members: decodeFromFields(VecMap.reified('address', Permissions.reified()), fields.members),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Party {
    if (!isParty(item.type)) {
      throw new Error('not a Party type')
    }

    return Party.reified().new({
      default: decodeFromFieldsWithTypes(Permissions.reified(), item.fields.default),
      members: decodeFromFieldsWithTypes(
        VecMap.reified('address', Permissions.reified()),
        item.fields.members
      ),
    })
  }

  static fromBcs(data: Uint8Array): Party {
    return Party.fromFields(Party.bcs.parse(data))
  }

  toJSONField(): PartyJSONField {
    return {
      default: this.default.toJSONField(),
      members: this.members.toJSONField(),
    }
  }

  toJSON(): PartyJSON {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): Party {
    return Party.reified().new({
      default: decodeFromJSONField(Permissions.reified(), field.default),
      members: decodeFromJSONField(VecMap.reified('address', Permissions.reified()), field.members),
    })
  }

  static fromJSON(json: Record<string, any>): Party {
    if (json.$typeName !== Party.$typeName) {
      throw new Error(
        `not a Party json object: expected '${Party.$typeName}' but got '${json.$typeName}'`
      )
    }

    return Party.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): Party {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isParty(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Party object`)
    }
    return Party.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): Party {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isParty(data.bcs.type)) {
        throw new Error(`object at is not a Party object`)
      }

      return Party.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Party.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<Party> {
    const res = await fetchObjectBcs(client, id)
    if (!isParty(res.type)) {
      throw new Error(`object at id ${id} is not a Party object`)
    }

    return Party.fromBcs(res.bcsBytes)
  }
}

/* ============================== Permissions =============================== */

export function isPermissions(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::party::Permissions`
}

export interface PermissionsFields {
  pos0: ToField<'u64'>
}

export type PermissionsReified = Reified<Permissions, PermissionsFields>

export type PermissionsJSONField = {
  pos0: string
}

export type PermissionsJSON = {
  $typeName: typeof Permissions.$typeName
  $typeArgs: []
} & PermissionsJSONField

/**
 * The permissions that a party has. The permissions are a bitset of the `READ`, `WRITE`,
 * `DELETE`, and `TRANSFER` constants.
 */
export class Permissions implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::party::Permissions` = `0x2::party::Permissions` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName: typeof Permissions.$typeName = Permissions.$typeName
  readonly $fullTypeName: `0x2::party::Permissions`
  readonly $typeArgs: []
  readonly $isPhantom: typeof Permissions.$isPhantom = Permissions.$isPhantom

  readonly pos0: ToField<'u64'>

  private constructor(typeArgs: [], fields: PermissionsFields) {
    this.$fullTypeName = composeSuiType(
      Permissions.$typeName,
      ...typeArgs
    ) as `0x2::party::Permissions`
    this.$typeArgs = typeArgs

    this.pos0 = fields.pos0
  }

  static reified(): PermissionsReified {
    const reifiedBcs = Permissions.bcs
    return {
      typeName: Permissions.$typeName,
      fullTypeName: composeSuiType(Permissions.$typeName, ...[]) as `0x2::party::Permissions`,
      typeArgs: [] as [],
      isPhantom: Permissions.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => Permissions.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Permissions.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => Permissions.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => Permissions.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => Permissions.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => Permissions.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => Permissions.fromSuiObjectData(content),
      fetch: async (client: SupportedSuiClient, id: string) => Permissions.fetch(client, id),
      new: (fields: PermissionsFields) => {
        return new Permissions([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): PermissionsReified {
    return Permissions.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<Permissions>> {
    return phantom(Permissions.reified())
  }

  static get p(): PhantomReified<ToTypeStr<Permissions>> {
    return Permissions.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('Permissions', {
      pos0: bcs.u64(),
    })
  }

  private static cachedBcs: ReturnType<typeof Permissions.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof Permissions.instantiateBcs> {
    if (!Permissions.cachedBcs) {
      Permissions.cachedBcs = Permissions.instantiateBcs()
    }
    return Permissions.cachedBcs
  }

  static fromFields(fields: Record<string, any>): Permissions {
    return Permissions.reified().new({
      pos0: decodeFromFields('u64', fields.pos0),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Permissions {
    if (!isPermissions(item.type)) {
      throw new Error('not a Permissions type')
    }

    return Permissions.reified().new({
      pos0: decodeFromFieldsWithTypes('u64', item.fields.pos0),
    })
  }

  static fromBcs(data: Uint8Array): Permissions {
    return Permissions.fromFields(Permissions.bcs.parse(data))
  }

  toJSONField(): PermissionsJSONField {
    return {
      pos0: this.pos0.toString(),
    }
  }

  toJSON(): PermissionsJSON {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): Permissions {
    return Permissions.reified().new({
      pos0: decodeFromJSONField('u64', field.pos0),
    })
  }

  static fromJSON(json: Record<string, any>): Permissions {
    if (json.$typeName !== Permissions.$typeName) {
      throw new Error(
        `not a Permissions json object: expected '${Permissions.$typeName}' but got '${json.$typeName}'`
      )
    }

    return Permissions.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): Permissions {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isPermissions(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Permissions object`)
    }
    return Permissions.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): Permissions {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isPermissions(data.bcs.type)) {
        throw new Error(`object at is not a Permissions object`)
      }

      return Permissions.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Permissions.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<Permissions> {
    const res = await fetchObjectBcs(client, id)
    if (!isPermissions(res.type)) {
      throw new Error(`object at id ${id} is not a Permissions object`)
    }

    return Permissions.fromBcs(res.bcsBytes)
  }
}
