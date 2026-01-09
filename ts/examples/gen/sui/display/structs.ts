/**
 * Defines a Display struct which defines the way an Object
 * should be displayed. The intention is to keep data as independent
 * from its display as possible, protecting the development process
 * and keeping it separate from the ecosystem agreements.
 *
 * Each of the fields of the Display object should allow for pattern
 * substitution and filling-in the pieces using the data from the object T.
 *
 * More entry functions might be added in the future depending on the use cases.
 */

import { bcs } from '@mysten/sui/bcs'
import { SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromBase64 } from '@mysten/sui/utils'
import { String } from '../../_dependencies/std/string/structs'
import {
  assertFieldsWithTypesArgsMatch,
  assertReifiedTypeArgsMatch,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  extractType,
  phantom,
  PhantomReified,
  PhantomToTypeStr,
  PhantomTypeArgument,
  Reified,
  StructClass,
  ToField,
  ToJSON,
  ToPhantomTypeArgument,
  ToTypeStr,
} from '../../_framework/reified'
import {
  composeSuiType,
  compressSuiType,
  fetchObjectBcs,
  FieldsWithTypes,
  parseTypeName,
  SupportedSuiClient,
} from '../../_framework/util'
import { ID, UID } from '../object/structs'
import { VecMap } from '../vec-map/structs'

/* ============================== Display =============================== */

export function isDisplay(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::display::Display` + '<')
}

export interface DisplayFields<T extends PhantomTypeArgument> {
  id: ToField<UID>
  /**
   * Contains fields for display. Currently supported
   * fields are: name, link, image and description.
   */
  fields: ToField<VecMap<String, String>>
  /** Version that can only be updated manually by the Publisher. */
  version: ToField<'u16'>
}

export type DisplayReified<T extends PhantomTypeArgument> = Reified<Display<T>, DisplayFields<T>>

export type DisplayJSONField<T extends PhantomTypeArgument> = {
  id: string
  fields: ToJSON<VecMap<String, String>>
  version: number
}

export type DisplayJSON<T extends PhantomTypeArgument> = {
  $typeName: typeof Display.$typeName
  $typeArgs: [PhantomToTypeStr<T>]
} & DisplayJSONField<T>

/**
 * The Display<T> object. Defines the way a T instance should be
 * displayed. Display object can only be created and modified with
 * a PublisherCap, making sure that the rules are set by the owner
 * of the type.
 *
 * Each of the display properties should support patterns outside
 * of the system, making it simpler to customize Display based
 * on the property values of an Object.
 * ```
 * // Example of a display object
 * Display<0x...::capy::Capy> {
 * fields:
 * <name, "Capy { genes }">
 * <link, "https://capy.art/capy/{ id }">
 * <image, "https://api.capy.art/capy/{ id }/svg">
 * <description, "Lovely Capy, one of many">
 * }
 * ```
 *
 * Uses only String type due to external-facing nature of the object,
 * the property names have a priority over their types.
 */
export class Display<T extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::display::Display` = `0x2::display::Display` as const
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName: typeof Display.$typeName = Display.$typeName
  readonly $fullTypeName: `0x2::display::Display<${PhantomToTypeStr<T>}>`
  readonly $typeArgs: [PhantomToTypeStr<T>]
  readonly $isPhantom: typeof Display.$isPhantom = Display.$isPhantom

  readonly id: ToField<UID>
  /**
   * Contains fields for display. Currently supported
   * fields are: name, link, image and description.
   */
  readonly fields: ToField<VecMap<String, String>>
  /** Version that can only be updated manually by the Publisher. */
  readonly version: ToField<'u16'>

  private constructor(typeArgs: [PhantomToTypeStr<T>], fields: DisplayFields<T>) {
    this.$fullTypeName = composeSuiType(
      Display.$typeName,
      ...typeArgs,
    ) as `0x2::display::Display<${PhantomToTypeStr<T>}>`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.fields = fields.fields
    this.version = fields.version
  }

  static reified<T extends PhantomReified<PhantomTypeArgument>>(
    T: T,
  ): DisplayReified<ToPhantomTypeArgument<T>> {
    const reifiedBcs = Display.bcs
    return {
      typeName: Display.$typeName,
      fullTypeName: composeSuiType(
        Display.$typeName,
        ...[extractType(T)],
      ) as `0x2::display::Display<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`,
      typeArgs: [extractType(T)] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>],
      isPhantom: Display.$isPhantom,
      reifiedTypeArgs: [T],
      fromFields: (fields: Record<string, any>) => Display.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Display.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => Display.fromFields(T, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => Display.fromJSONField(T, field),
      fromJSON: (json: Record<string, any>) => Display.fromJSON(T, json),
      fromSuiParsedData: (content: SuiParsedData) => Display.fromSuiParsedData(T, content),
      fromSuiObjectData: (content: SuiObjectData) => Display.fromSuiObjectData(T, content),
      fetch: async (client: SupportedSuiClient, id: string) => Display.fetch(client, T, id),
      new: (fields: DisplayFields<ToPhantomTypeArgument<T>>) => {
        return new Display([extractType(T)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): typeof Display.reified {
    return Display.reified
  }

  static phantom<T extends PhantomReified<PhantomTypeArgument>>(
    T: T,
  ): PhantomReified<ToTypeStr<Display<ToPhantomTypeArgument<T>>>> {
    return phantom(Display.reified(T))
  }

  static get p(): typeof Display.phantom {
    return Display.phantom
  }

  private static instantiateBcs() {
    return bcs.struct('Display', {
      id: UID.bcs,
      fields: VecMap.bcs(String.bcs, String.bcs),
      version: bcs.u16(),
    })
  }

  private static cachedBcs: ReturnType<typeof Display.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof Display.instantiateBcs> {
    if (!Display.cachedBcs) {
      Display.cachedBcs = Display.instantiateBcs()
    }
    return Display.cachedBcs
  }

  static fromFields<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    fields: Record<string, any>,
  ): Display<ToPhantomTypeArgument<T>> {
    return Display.reified(typeArg).new({
      id: decodeFromFields(UID.reified(), fields.id),
      fields: decodeFromFields(VecMap.reified(String.reified(), String.reified()), fields.fields),
      version: decodeFromFields('u16', fields.version),
    })
  }

  static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    item: FieldsWithTypes,
  ): Display<ToPhantomTypeArgument<T>> {
    if (!isDisplay(item.type)) {
      throw new Error('not a Display type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Display.reified(typeArg).new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      fields: decodeFromFieldsWithTypes(
        VecMap.reified(String.reified(), String.reified()),
        item.fields.fields,
      ),
      version: decodeFromFieldsWithTypes('u16', item.fields.version),
    })
  }

  static fromBcs<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    data: Uint8Array,
  ): Display<ToPhantomTypeArgument<T>> {
    return Display.fromFields(typeArg, Display.bcs.parse(data))
  }

  toJSONField(): DisplayJSONField<T> {
    return {
      id: this.id,
      fields: this.fields.toJSONField(),
      version: this.version,
    }
  }

  toJSON(): DisplayJSON<T> {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    field: any,
  ): Display<ToPhantomTypeArgument<T>> {
    return Display.reified(typeArg).new({
      id: decodeFromJSONField(UID.reified(), field.id),
      fields: decodeFromJSONField(VecMap.reified(String.reified(), String.reified()), field.fields),
      version: decodeFromJSONField('u16', field.version),
    })
  }

  static fromJSON<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    json: Record<string, any>,
  ): Display<ToPhantomTypeArgument<T>> {
    if (json.$typeName !== Display.$typeName) {
      throw new Error(
        `not a Display json object: expected '${Display.$typeName}' but got '${json.$typeName}'`,
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Display.$typeName, ...[extractType(typeArg)]),
      json.$typeArgs,
      [typeArg],
    )

    return Display.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    content: SuiParsedData,
  ): Display<ToPhantomTypeArgument<T>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isDisplay(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Display object`)
    }
    return Display.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    data: SuiObjectData,
  ): Display<ToPhantomTypeArgument<T>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isDisplay(data.bcs.type)) {
        throw new Error(`object at is not a Display object`)
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs
      if (gotTypeArgs.length !== 1) {
        throw new Error(
          `type argument mismatch: expected 1 type arguments but got '${gotTypeArgs.length}'`,
        )
      }
      for (let i = 0; i < 1; i++) {
        const gotTypeArg = compressSuiType(gotTypeArgs[i])
        const expectedTypeArg = compressSuiType(extractType([typeArg][i]))
        if (gotTypeArg !== expectedTypeArg) {
          throw new Error(
            `type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`,
          )
        }
      }

      return Display.fromBcs(typeArg, fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Display.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.',
    )
  }

  static async fetch<T extends PhantomReified<PhantomTypeArgument>>(
    client: SupportedSuiClient,
    typeArg: T,
    id: string,
  ): Promise<Display<ToPhantomTypeArgument<T>>> {
    const res = await fetchObjectBcs(client, id)
    if (!isDisplay(res.type)) {
      throw new Error(`object at id ${id} is not a Display object`)
    }

    const gotTypeArgs = parseTypeName(res.type).typeArgs
    if (gotTypeArgs.length !== 1) {
      throw new Error(
        `type argument mismatch: expected 1 type arguments but got '${gotTypeArgs.length}'`,
      )
    }
    for (let i = 0; i < 1; i++) {
      const gotTypeArg = compressSuiType(gotTypeArgs[i])
      const expectedTypeArg = compressSuiType(extractType([typeArg][i]))
      if (gotTypeArg !== expectedTypeArg) {
        throw new Error(
          `type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`,
        )
      }
    }

    return Display.fromBcs(typeArg, res.bcsBytes)
  }
}

/* ============================== DisplayCreated =============================== */

export function isDisplayCreated(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::display::DisplayCreated` + '<')
}

export interface DisplayCreatedFields<T extends PhantomTypeArgument> {
  id: ToField<ID>
}

export type DisplayCreatedReified<T extends PhantomTypeArgument> = Reified<
  DisplayCreated<T>,
  DisplayCreatedFields<T>
>

export type DisplayCreatedJSONField<T extends PhantomTypeArgument> = {
  id: string
}

export type DisplayCreatedJSON<T extends PhantomTypeArgument> = {
  $typeName: typeof DisplayCreated.$typeName
  $typeArgs: [PhantomToTypeStr<T>]
} & DisplayCreatedJSONField<T>

/**
 * Event: emitted when a new Display object has been created for type T.
 * Type signature of the event corresponds to the type while id serves for
 * the discovery.
 *
 * Since Sui RPC supports querying events by type, finding a Display for the T
 * would be as simple as looking for the first event with `Display<T>`.
 */
export class DisplayCreated<T extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::display::DisplayCreated` =
    `0x2::display::DisplayCreated` as const
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName: typeof DisplayCreated.$typeName = DisplayCreated.$typeName
  readonly $fullTypeName: `0x2::display::DisplayCreated<${PhantomToTypeStr<T>}>`
  readonly $typeArgs: [PhantomToTypeStr<T>]
  readonly $isPhantom: typeof DisplayCreated.$isPhantom = DisplayCreated.$isPhantom

  readonly id: ToField<ID>

  private constructor(typeArgs: [PhantomToTypeStr<T>], fields: DisplayCreatedFields<T>) {
    this.$fullTypeName = composeSuiType(
      DisplayCreated.$typeName,
      ...typeArgs,
    ) as `0x2::display::DisplayCreated<${PhantomToTypeStr<T>}>`
    this.$typeArgs = typeArgs

    this.id = fields.id
  }

  static reified<T extends PhantomReified<PhantomTypeArgument>>(
    T: T,
  ): DisplayCreatedReified<ToPhantomTypeArgument<T>> {
    const reifiedBcs = DisplayCreated.bcs
    return {
      typeName: DisplayCreated.$typeName,
      fullTypeName: composeSuiType(
        DisplayCreated.$typeName,
        ...[extractType(T)],
      ) as `0x2::display::DisplayCreated<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`,
      typeArgs: [extractType(T)] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>],
      isPhantom: DisplayCreated.$isPhantom,
      reifiedTypeArgs: [T],
      fromFields: (fields: Record<string, any>) => DisplayCreated.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => DisplayCreated.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => DisplayCreated.fromFields(T, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => DisplayCreated.fromJSONField(T, field),
      fromJSON: (json: Record<string, any>) => DisplayCreated.fromJSON(T, json),
      fromSuiParsedData: (content: SuiParsedData) => DisplayCreated.fromSuiParsedData(T, content),
      fromSuiObjectData: (content: SuiObjectData) => DisplayCreated.fromSuiObjectData(T, content),
      fetch: async (client: SupportedSuiClient, id: string) => DisplayCreated.fetch(client, T, id),
      new: (fields: DisplayCreatedFields<ToPhantomTypeArgument<T>>) => {
        return new DisplayCreated([extractType(T)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): typeof DisplayCreated.reified {
    return DisplayCreated.reified
  }

  static phantom<T extends PhantomReified<PhantomTypeArgument>>(
    T: T,
  ): PhantomReified<ToTypeStr<DisplayCreated<ToPhantomTypeArgument<T>>>> {
    return phantom(DisplayCreated.reified(T))
  }

  static get p(): typeof DisplayCreated.phantom {
    return DisplayCreated.phantom
  }

  private static instantiateBcs() {
    return bcs.struct('DisplayCreated', {
      id: ID.bcs,
    })
  }

  private static cachedBcs: ReturnType<typeof DisplayCreated.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof DisplayCreated.instantiateBcs> {
    if (!DisplayCreated.cachedBcs) {
      DisplayCreated.cachedBcs = DisplayCreated.instantiateBcs()
    }
    return DisplayCreated.cachedBcs
  }

  static fromFields<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    fields: Record<string, any>,
  ): DisplayCreated<ToPhantomTypeArgument<T>> {
    return DisplayCreated.reified(typeArg).new({
      id: decodeFromFields(ID.reified(), fields.id),
    })
  }

  static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    item: FieldsWithTypes,
  ): DisplayCreated<ToPhantomTypeArgument<T>> {
    if (!isDisplayCreated(item.type)) {
      throw new Error('not a DisplayCreated type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return DisplayCreated.reified(typeArg).new({
      id: decodeFromFieldsWithTypes(ID.reified(), item.fields.id),
    })
  }

  static fromBcs<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    data: Uint8Array,
  ): DisplayCreated<ToPhantomTypeArgument<T>> {
    return DisplayCreated.fromFields(typeArg, DisplayCreated.bcs.parse(data))
  }

  toJSONField(): DisplayCreatedJSONField<T> {
    return {
      id: this.id,
    }
  }

  toJSON(): DisplayCreatedJSON<T> {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    field: any,
  ): DisplayCreated<ToPhantomTypeArgument<T>> {
    return DisplayCreated.reified(typeArg).new({
      id: decodeFromJSONField(ID.reified(), field.id),
    })
  }

  static fromJSON<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    json: Record<string, any>,
  ): DisplayCreated<ToPhantomTypeArgument<T>> {
    if (json.$typeName !== DisplayCreated.$typeName) {
      throw new Error(
        `not a DisplayCreated json object: expected '${DisplayCreated.$typeName}' but got '${json.$typeName}'`,
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(DisplayCreated.$typeName, ...[extractType(typeArg)]),
      json.$typeArgs,
      [typeArg],
    )

    return DisplayCreated.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    content: SuiParsedData,
  ): DisplayCreated<ToPhantomTypeArgument<T>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isDisplayCreated(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a DisplayCreated object`)
    }
    return DisplayCreated.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    data: SuiObjectData,
  ): DisplayCreated<ToPhantomTypeArgument<T>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isDisplayCreated(data.bcs.type)) {
        throw new Error(`object at is not a DisplayCreated object`)
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs
      if (gotTypeArgs.length !== 1) {
        throw new Error(
          `type argument mismatch: expected 1 type arguments but got '${gotTypeArgs.length}'`,
        )
      }
      for (let i = 0; i < 1; i++) {
        const gotTypeArg = compressSuiType(gotTypeArgs[i])
        const expectedTypeArg = compressSuiType(extractType([typeArg][i]))
        if (gotTypeArg !== expectedTypeArg) {
          throw new Error(
            `type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`,
          )
        }
      }

      return DisplayCreated.fromBcs(typeArg, fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return DisplayCreated.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.',
    )
  }

  static async fetch<T extends PhantomReified<PhantomTypeArgument>>(
    client: SupportedSuiClient,
    typeArg: T,
    id: string,
  ): Promise<DisplayCreated<ToPhantomTypeArgument<T>>> {
    const res = await fetchObjectBcs(client, id)
    if (!isDisplayCreated(res.type)) {
      throw new Error(`object at id ${id} is not a DisplayCreated object`)
    }

    const gotTypeArgs = parseTypeName(res.type).typeArgs
    if (gotTypeArgs.length !== 1) {
      throw new Error(
        `type argument mismatch: expected 1 type arguments but got '${gotTypeArgs.length}'`,
      )
    }
    for (let i = 0; i < 1; i++) {
      const gotTypeArg = compressSuiType(gotTypeArgs[i])
      const expectedTypeArg = compressSuiType(extractType([typeArg][i]))
      if (gotTypeArg !== expectedTypeArg) {
        throw new Error(
          `type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`,
        )
      }
    }

    return DisplayCreated.fromBcs(typeArg, res.bcsBytes)
  }
}

/* ============================== VersionUpdated =============================== */

export function isVersionUpdated(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::display::VersionUpdated` + '<')
}

export interface VersionUpdatedFields<T extends PhantomTypeArgument> {
  id: ToField<ID>
  version: ToField<'u16'>
  fields: ToField<VecMap<String, String>>
}

export type VersionUpdatedReified<T extends PhantomTypeArgument> = Reified<
  VersionUpdated<T>,
  VersionUpdatedFields<T>
>

export type VersionUpdatedJSONField<T extends PhantomTypeArgument> = {
  id: string
  version: number
  fields: ToJSON<VecMap<String, String>>
}

export type VersionUpdatedJSON<T extends PhantomTypeArgument> = {
  $typeName: typeof VersionUpdated.$typeName
  $typeArgs: [PhantomToTypeStr<T>]
} & VersionUpdatedJSONField<T>

/** Version of Display got updated - */
export class VersionUpdated<T extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::display::VersionUpdated` =
    `0x2::display::VersionUpdated` as const
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName: typeof VersionUpdated.$typeName = VersionUpdated.$typeName
  readonly $fullTypeName: `0x2::display::VersionUpdated<${PhantomToTypeStr<T>}>`
  readonly $typeArgs: [PhantomToTypeStr<T>]
  readonly $isPhantom: typeof VersionUpdated.$isPhantom = VersionUpdated.$isPhantom

  readonly id: ToField<ID>
  readonly version: ToField<'u16'>
  readonly fields: ToField<VecMap<String, String>>

  private constructor(typeArgs: [PhantomToTypeStr<T>], fields: VersionUpdatedFields<T>) {
    this.$fullTypeName = composeSuiType(
      VersionUpdated.$typeName,
      ...typeArgs,
    ) as `0x2::display::VersionUpdated<${PhantomToTypeStr<T>}>`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.version = fields.version
    this.fields = fields.fields
  }

  static reified<T extends PhantomReified<PhantomTypeArgument>>(
    T: T,
  ): VersionUpdatedReified<ToPhantomTypeArgument<T>> {
    const reifiedBcs = VersionUpdated.bcs
    return {
      typeName: VersionUpdated.$typeName,
      fullTypeName: composeSuiType(
        VersionUpdated.$typeName,
        ...[extractType(T)],
      ) as `0x2::display::VersionUpdated<${PhantomToTypeStr<ToPhantomTypeArgument<T>>}>`,
      typeArgs: [extractType(T)] as [PhantomToTypeStr<ToPhantomTypeArgument<T>>],
      isPhantom: VersionUpdated.$isPhantom,
      reifiedTypeArgs: [T],
      fromFields: (fields: Record<string, any>) => VersionUpdated.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => VersionUpdated.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => VersionUpdated.fromFields(T, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => VersionUpdated.fromJSONField(T, field),
      fromJSON: (json: Record<string, any>) => VersionUpdated.fromJSON(T, json),
      fromSuiParsedData: (content: SuiParsedData) => VersionUpdated.fromSuiParsedData(T, content),
      fromSuiObjectData: (content: SuiObjectData) => VersionUpdated.fromSuiObjectData(T, content),
      fetch: async (client: SupportedSuiClient, id: string) => VersionUpdated.fetch(client, T, id),
      new: (fields: VersionUpdatedFields<ToPhantomTypeArgument<T>>) => {
        return new VersionUpdated([extractType(T)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): typeof VersionUpdated.reified {
    return VersionUpdated.reified
  }

  static phantom<T extends PhantomReified<PhantomTypeArgument>>(
    T: T,
  ): PhantomReified<ToTypeStr<VersionUpdated<ToPhantomTypeArgument<T>>>> {
    return phantom(VersionUpdated.reified(T))
  }

  static get p(): typeof VersionUpdated.phantom {
    return VersionUpdated.phantom
  }

  private static instantiateBcs() {
    return bcs.struct('VersionUpdated', {
      id: ID.bcs,
      version: bcs.u16(),
      fields: VecMap.bcs(String.bcs, String.bcs),
    })
  }

  private static cachedBcs: ReturnType<typeof VersionUpdated.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof VersionUpdated.instantiateBcs> {
    if (!VersionUpdated.cachedBcs) {
      VersionUpdated.cachedBcs = VersionUpdated.instantiateBcs()
    }
    return VersionUpdated.cachedBcs
  }

  static fromFields<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    fields: Record<string, any>,
  ): VersionUpdated<ToPhantomTypeArgument<T>> {
    return VersionUpdated.reified(typeArg).new({
      id: decodeFromFields(ID.reified(), fields.id),
      version: decodeFromFields('u16', fields.version),
      fields: decodeFromFields(VecMap.reified(String.reified(), String.reified()), fields.fields),
    })
  }

  static fromFieldsWithTypes<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    item: FieldsWithTypes,
  ): VersionUpdated<ToPhantomTypeArgument<T>> {
    if (!isVersionUpdated(item.type)) {
      throw new Error('not a VersionUpdated type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return VersionUpdated.reified(typeArg).new({
      id: decodeFromFieldsWithTypes(ID.reified(), item.fields.id),
      version: decodeFromFieldsWithTypes('u16', item.fields.version),
      fields: decodeFromFieldsWithTypes(
        VecMap.reified(String.reified(), String.reified()),
        item.fields.fields,
      ),
    })
  }

  static fromBcs<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    data: Uint8Array,
  ): VersionUpdated<ToPhantomTypeArgument<T>> {
    return VersionUpdated.fromFields(typeArg, VersionUpdated.bcs.parse(data))
  }

  toJSONField(): VersionUpdatedJSONField<T> {
    return {
      id: this.id,
      version: this.version,
      fields: this.fields.toJSONField(),
    }
  }

  toJSON(): VersionUpdatedJSON<T> {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    field: any,
  ): VersionUpdated<ToPhantomTypeArgument<T>> {
    return VersionUpdated.reified(typeArg).new({
      id: decodeFromJSONField(ID.reified(), field.id),
      version: decodeFromJSONField('u16', field.version),
      fields: decodeFromJSONField(VecMap.reified(String.reified(), String.reified()), field.fields),
    })
  }

  static fromJSON<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    json: Record<string, any>,
  ): VersionUpdated<ToPhantomTypeArgument<T>> {
    if (json.$typeName !== VersionUpdated.$typeName) {
      throw new Error(
        `not a VersionUpdated json object: expected '${VersionUpdated.$typeName}' but got '${json.$typeName}'`,
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(VersionUpdated.$typeName, ...[extractType(typeArg)]),
      json.$typeArgs,
      [typeArg],
    )

    return VersionUpdated.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    content: SuiParsedData,
  ): VersionUpdated<ToPhantomTypeArgument<T>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isVersionUpdated(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a VersionUpdated object`)
    }
    return VersionUpdated.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T,
    data: SuiObjectData,
  ): VersionUpdated<ToPhantomTypeArgument<T>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isVersionUpdated(data.bcs.type)) {
        throw new Error(`object at is not a VersionUpdated object`)
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs
      if (gotTypeArgs.length !== 1) {
        throw new Error(
          `type argument mismatch: expected 1 type arguments but got '${gotTypeArgs.length}'`,
        )
      }
      for (let i = 0; i < 1; i++) {
        const gotTypeArg = compressSuiType(gotTypeArgs[i])
        const expectedTypeArg = compressSuiType(extractType([typeArg][i]))
        if (gotTypeArg !== expectedTypeArg) {
          throw new Error(
            `type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`,
          )
        }
      }

      return VersionUpdated.fromBcs(typeArg, fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return VersionUpdated.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.',
    )
  }

  static async fetch<T extends PhantomReified<PhantomTypeArgument>>(
    client: SupportedSuiClient,
    typeArg: T,
    id: string,
  ): Promise<VersionUpdated<ToPhantomTypeArgument<T>>> {
    const res = await fetchObjectBcs(client, id)
    if (!isVersionUpdated(res.type)) {
      throw new Error(`object at id ${id} is not a VersionUpdated object`)
    }

    const gotTypeArgs = parseTypeName(res.type).typeArgs
    if (gotTypeArgs.length !== 1) {
      throw new Error(
        `type argument mismatch: expected 1 type arguments but got '${gotTypeArgs.length}'`,
      )
    }
    for (let i = 0; i < 1; i++) {
      const gotTypeArg = compressSuiType(gotTypeArgs[i])
      const expectedTypeArg = compressSuiType(extractType([typeArg][i]))
      if (gotTypeArg !== expectedTypeArg) {
        throw new Error(
          `type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`,
        )
      }
    }

    return VersionUpdated.fromBcs(typeArg, res.bcsBytes)
  }
}
