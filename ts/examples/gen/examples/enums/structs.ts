import { Option } from '../../_dependencies/0x1/option/structs'
import {
  EnumVariantClass,
  PhantomReified,
  PhantomToTypeStr,
  PhantomTypeArgument,
  Reified,
  StructClass,
  ToField,
  ToPhantomTypeArgument,
  ToTypeArgument,
  ToTypeStr,
  ToTypeStr as ToPhantom,
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
import { Balance } from '../../sui/balance/structs'
import { UID } from '../../sui/object/structs'
import { SUI } from '../../sui/sui/structs'
import { PKG_V3 } from '../index'
import { BcsType, bcs } from '@mysten/sui/bcs'
import { SuiClient, SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromBase64 } from '@mysten/sui/utils'

/* ============================== Wrapped =============================== */

export function isWrapped(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`${PKG_V3}::enums::Wrapped` + '<')
}

export interface WrappedFields<
  T extends TypeArgument,
  U extends TypeArgument,
  V extends TypeArgument,
> {
  id: ToField<UID>
  t: ToField<T>
  u: ToField<U>
  v: ToField<V>
  stop: ToField<ActionVariant<'u64', ToPhantom<SUI>>>
  pause: ToField<ActionVariant<'u64', ToPhantom<SUI>>>
  jump: ToField<ActionVariant<'u64', ToPhantom<SUI>>>
}

export type WrappedReified<
  T extends TypeArgument,
  U extends TypeArgument,
  V extends TypeArgument,
> = Reified<Wrapped<T, U, V>, WrappedFields<T, U, V>>

export class Wrapped<T extends TypeArgument, U extends TypeArgument, V extends TypeArgument>
  implements StructClass
{
  __StructClass = true as const

  static readonly $typeName = `${PKG_V3}::enums::Wrapped`
  static readonly $numTypeParams = 3
  static readonly $isPhantom = [false, false, false] as const

  readonly $typeName = Wrapped.$typeName
  readonly $fullTypeName: `${typeof PKG_V3}::enums::Wrapped<${ToTypeStr<T>}, ${ToTypeStr<U>}, ${ToTypeStr<V>}>`
  readonly $typeArgs: [ToTypeStr<T>, ToTypeStr<U>, ToTypeStr<V>]
  readonly $isPhantom = Wrapped.$isPhantom

  readonly id: ToField<UID>
  readonly t: ToField<T>
  readonly u: ToField<U>
  readonly v: ToField<V>
  readonly stop: ToField<ActionVariant<'u64', ToPhantom<SUI>>>
  readonly pause: ToField<ActionVariant<'u64', ToPhantom<SUI>>>
  readonly jump: ToField<ActionVariant<'u64', ToPhantom<SUI>>>

  private constructor(
    typeArgs: [ToTypeStr<T>, ToTypeStr<U>, ToTypeStr<V>],
    fields: WrappedFields<T, U, V>
  ) {
    this.$fullTypeName = composeSuiType(
      Wrapped.$typeName,
      ...typeArgs
    ) as `${typeof PKG_V3}::enums::Wrapped<${ToTypeStr<T>}, ${ToTypeStr<U>}, ${ToTypeStr<V>}>`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.t = fields.t
    this.u = fields.u
    this.v = fields.v
    this.stop = fields.stop
    this.pause = fields.pause
    this.jump = fields.jump
  }

  static reified<
    T extends Reified<TypeArgument, any>,
    U extends Reified<TypeArgument, any>,
    V extends Reified<TypeArgument, any>,
  >(T: T, U: U, V: V): WrappedReified<ToTypeArgument<T>, ToTypeArgument<U>, ToTypeArgument<V>> {
    const reifiedBcs = Wrapped.bcs(toBcs(T), toBcs(U), toBcs(V))
    return {
      typeName: Wrapped.$typeName,
      fullTypeName: composeSuiType(
        Wrapped.$typeName,
        ...[extractType(T), extractType(U), extractType(V)]
      ) as `${typeof PKG_V3}::enums::Wrapped<${ToTypeStr<ToTypeArgument<T>>}, ${ToTypeStr<ToTypeArgument<U>>}, ${ToTypeStr<ToTypeArgument<V>>}>`,
      typeArgs: [extractType(T), extractType(U), extractType(V)] as [
        ToTypeStr<ToTypeArgument<T>>,
        ToTypeStr<ToTypeArgument<U>>,
        ToTypeStr<ToTypeArgument<V>>,
      ],
      isPhantom: Wrapped.$isPhantom,
      reifiedTypeArgs: [T, U, V],
      fromFields: (fields: Record<string, any>) => Wrapped.fromFields([T, U, V], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Wrapped.fromFieldsWithTypes([T, U, V], item),
      fromBcs: (data: Uint8Array) => Wrapped.fromFields([T, U, V], reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => Wrapped.fromJSONField([T, U, V], field),
      fromJSON: (json: Record<string, any>) => Wrapped.fromJSON([T, U, V], json),
      fromSuiParsedData: (content: SuiParsedData) => Wrapped.fromSuiParsedData([T, U, V], content),
      fromSuiObjectData: (content: SuiObjectData) => Wrapped.fromSuiObjectData([T, U, V], content),
      fetch: async (client: SuiClient, id: string) => Wrapped.fetch(client, [T, U, V], id),
      new: (fields: WrappedFields<ToTypeArgument<T>, ToTypeArgument<U>, ToTypeArgument<V>>) => {
        return new Wrapped([extractType(T), extractType(U), extractType(V)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Wrapped.reified
  }

  static phantom<
    T extends Reified<TypeArgument, any>,
    U extends Reified<TypeArgument, any>,
    V extends Reified<TypeArgument, any>,
  >(
    T: T,
    U: U,
    V: V
  ): PhantomReified<ToTypeStr<Wrapped<ToTypeArgument<T>, ToTypeArgument<U>, ToTypeArgument<V>>>> {
    return phantom(Wrapped.reified(T, U, V))
  }

  static get p() {
    return Wrapped.phantom
  }

  private static instantiateBcs() {
    return <T extends BcsType<any>, U extends BcsType<any>, V extends BcsType<any>>(
      T: T,
      U: U,
      V: V
    ) =>
      bcs.struct(`Wrapped<${T.name}, ${U.name}, ${V.name}>`, {
        id: UID.bcs,
        t: T,
        u: U,
        v: V,
        stop: Action.bcs(bcs.u64()),
        pause: Action.bcs(bcs.u64()),
        jump: Action.bcs(bcs.u64()),
      })
  }

  private static cachedBcs: ReturnType<typeof Wrapped.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof Wrapped.instantiateBcs> {
    if (!Wrapped.cachedBcs) {
      Wrapped.cachedBcs = Wrapped.instantiateBcs()
    }
    return Wrapped.cachedBcs
  }

  static fromFields<
    T extends Reified<TypeArgument, any>,
    U extends Reified<TypeArgument, any>,
    V extends Reified<TypeArgument, any>,
  >(
    typeArgs: [T, U, V],
    fields: Record<string, any>
  ): Wrapped<ToTypeArgument<T>, ToTypeArgument<U>, ToTypeArgument<V>> {
    return Wrapped.reified(typeArgs[0], typeArgs[1], typeArgs[2]).new({
      id: decodeFromFields(UID.reified(), fields.id),
      t: decodeFromFields(typeArgs[0], fields.t),
      u: decodeFromFields(typeArgs[1], fields.u),
      v: decodeFromFields(typeArgs[2], fields.v),
      stop: decodeFromFields(Action.reified('u64', phantom(SUI.reified())), fields.stop),
      pause: decodeFromFields(Action.reified('u64', phantom(SUI.reified())), fields.pause),
      jump: decodeFromFields(Action.reified('u64', phantom(SUI.reified())), fields.jump),
    })
  }

  static fromFieldsWithTypes<
    T extends Reified<TypeArgument, any>,
    U extends Reified<TypeArgument, any>,
    V extends Reified<TypeArgument, any>,
  >(
    typeArgs: [T, U, V],
    item: FieldsWithTypes
  ): Wrapped<ToTypeArgument<T>, ToTypeArgument<U>, ToTypeArgument<V>> {
    if (!isWrapped(item.type)) {
      throw new Error('not a Wrapped type')
    }
    assertFieldsWithTypesArgsMatch(item, typeArgs)

    return Wrapped.reified(typeArgs[0], typeArgs[1], typeArgs[2]).new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      t: decodeFromFieldsWithTypes(typeArgs[0], item.fields.t),
      u: decodeFromFieldsWithTypes(typeArgs[1], item.fields.u),
      v: decodeFromFieldsWithTypes(typeArgs[2], item.fields.v),
      stop: decodeFromFieldsWithTypes(
        Action.reified('u64', phantom(SUI.reified())),
        item.fields.stop
      ),
      pause: decodeFromFieldsWithTypes(
        Action.reified('u64', phantom(SUI.reified())),
        item.fields.pause
      ),
      jump: decodeFromFieldsWithTypes(
        Action.reified('u64', phantom(SUI.reified())),
        item.fields.jump
      ),
    })
  }

  static fromBcs<
    T extends Reified<TypeArgument, any>,
    U extends Reified<TypeArgument, any>,
    V extends Reified<TypeArgument, any>,
  >(
    typeArgs: [T, U, V],
    data: Uint8Array
  ): Wrapped<ToTypeArgument<T>, ToTypeArgument<U>, ToTypeArgument<V>> {
    return Wrapped.fromFields(
      typeArgs,
      Wrapped.bcs(toBcs(typeArgs[0]), toBcs(typeArgs[1]), toBcs(typeArgs[2])).parse(data)
    )
  }

  toJSONField() {
    return {
      id: this.id,
      t: fieldToJSON<T>(`${this.$typeArgs[0]}`, this.t),
      u: fieldToJSON<U>(`${this.$typeArgs[1]}`, this.u),
      v: fieldToJSON<V>(`${this.$typeArgs[2]}`, this.v),
      stop: this.stop.toJSONField(),
      pause: this.pause.toJSONField(),
      jump: this.jump.toJSONField(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<
    T extends Reified<TypeArgument, any>,
    U extends Reified<TypeArgument, any>,
    V extends Reified<TypeArgument, any>,
  >(
    typeArgs: [T, U, V],
    field: any
  ): Wrapped<ToTypeArgument<T>, ToTypeArgument<U>, ToTypeArgument<V>> {
    return Wrapped.reified(typeArgs[0], typeArgs[1], typeArgs[2]).new({
      id: decodeFromJSONField(UID.reified(), field.id),
      t: decodeFromJSONField(typeArgs[0], field.t),
      u: decodeFromJSONField(typeArgs[1], field.u),
      v: decodeFromJSONField(typeArgs[2], field.v),
      stop: decodeFromJSONField(Action.reified('u64', phantom(SUI.reified())), field.stop),
      pause: decodeFromJSONField(Action.reified('u64', phantom(SUI.reified())), field.pause),
      jump: decodeFromJSONField(Action.reified('u64', phantom(SUI.reified())), field.jump),
    })
  }

  static fromJSON<
    T extends Reified<TypeArgument, any>,
    U extends Reified<TypeArgument, any>,
    V extends Reified<TypeArgument, any>,
  >(
    typeArgs: [T, U, V],
    json: Record<string, any>
  ): Wrapped<ToTypeArgument<T>, ToTypeArgument<U>, ToTypeArgument<V>> {
    if (json.$typeName !== Wrapped.$typeName) {
      throw new Error(
        `not a Wrapped json object: expected '${Wrapped.$typeName}' but got '${json.$typeName}'`
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Wrapped.$typeName, ...typeArgs.map(extractType)),
      json.$typeArgs,
      typeArgs
    )

    return Wrapped.fromJSONField(typeArgs, json)
  }

  static fromSuiParsedData<
    T extends Reified<TypeArgument, any>,
    U extends Reified<TypeArgument, any>,
    V extends Reified<TypeArgument, any>,
  >(
    typeArgs: [T, U, V],
    content: SuiParsedData
  ): Wrapped<ToTypeArgument<T>, ToTypeArgument<U>, ToTypeArgument<V>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isWrapped(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Wrapped object`)
    }
    return Wrapped.fromFieldsWithTypes(typeArgs, content)
  }

  static fromSuiObjectData<
    T extends Reified<TypeArgument, any>,
    U extends Reified<TypeArgument, any>,
    V extends Reified<TypeArgument, any>,
  >(
    typeArgs: [T, U, V],
    data: SuiObjectData
  ): Wrapped<ToTypeArgument<T>, ToTypeArgument<U>, ToTypeArgument<V>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isWrapped(data.bcs.type)) {
        throw new Error(`object at is not a Wrapped object`)
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs
      if (gotTypeArgs.length !== 3) {
        throw new Error(
          `type argument mismatch: expected 3 type arguments but got '${gotTypeArgs.length}'`
        )
      }
      for (let i = 0; i < 3; i++) {
        const gotTypeArg = compressSuiType(gotTypeArgs[i])
        const expectedTypeArg = compressSuiType(extractType(typeArgs[i]))
        if (gotTypeArg !== expectedTypeArg) {
          throw new Error(
            `type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`
          )
        }
      }

      return Wrapped.fromBcs(typeArgs, fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Wrapped.fromSuiParsedData(typeArgs, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<
    T extends Reified<TypeArgument, any>,
    U extends Reified<TypeArgument, any>,
    V extends Reified<TypeArgument, any>,
  >(
    client: SuiClient,
    typeArgs: [T, U, V],
    id: string
  ): Promise<Wrapped<ToTypeArgument<T>, ToTypeArgument<U>, ToTypeArgument<V>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching Wrapped object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isWrapped(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a Wrapped object`)
    }

    return Wrapped.fromSuiObjectData(typeArgs, res.data)
  }
}

/* ============================== Action =============================== */

export function isAction(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`${PKG_V3}::enums::Action` + '<')
}

export type ActionVariant<T extends TypeArgument, U extends PhantomTypeArgument> =
  | ActionStop<T, U>
  | ActionPause<T, U>
  | ActionJump<T, U>

export type ActionVariantName = 'Stop' | 'Pause' | 'Jump'

export function isActionVariantName(variant: string): variant is ActionVariantName {
  return variant === 'Stop' || variant === 'Pause' || variant === 'Jump'
}

export type ActionFields<T extends TypeArgument, U extends PhantomTypeArgument> =
  | ActionStopFields
  | ActionPauseFields<T, U>
  | ActionJumpFields<T, U>

export type ActionReified<T extends TypeArgument, U extends PhantomTypeArgument> = Reified<
  ActionVariant<T, U>,
  ActionFields<T, U>
>

export class Action {
  static readonly $typeName = `${PKG_V3}::enums::Action`
  static readonly $numTypeParams = 2
  static readonly $isPhantom = [false, true] as const

  static reified<
    T extends Reified<TypeArgument, any>,
    U extends PhantomReified<PhantomTypeArgument>,
  >(T: T, U: U): ActionReified<ToTypeArgument<T>, ToPhantomTypeArgument<U>> {
    const reifiedBcs = Action.bcs(toBcs(T))
    return {
      typeName: Action.$typeName,
      fullTypeName: composeSuiType(
        Action.$typeName,
        ...[extractType(T), extractType(U)]
      ) as `${typeof PKG_V3}::enums::Action<${ToTypeStr<ToTypeArgument<T>>}, ${PhantomToTypeStr<ToPhantomTypeArgument<U>>}>`,
      typeArgs: [extractType(T), extractType(U)] as [
        ToTypeStr<ToTypeArgument<T>>,
        PhantomToTypeStr<ToPhantomTypeArgument<U>>,
      ],
      isPhantom: Action.$isPhantom,
      reifiedTypeArgs: [T, U],
      fromFields: (fields: Record<string, any>) => Action.fromFields([T, U], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Action.fromFieldsWithTypes([T, U], item),
      fromBcs: (data: Uint8Array) => Action.fromBcs([T, U], data),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => Action.fromJSONField([T, U], field),
      fromJSON: (json: Record<string, any>) => Action.fromJSON([T, U], json),
      new: (
        variant: ActionVariantName,
        fields: ActionFields<ToTypeArgument<T>, ToPhantomTypeArgument<U>>
      ) => {
        switch (variant) {
          case 'Stop':
            return new ActionStop([extractType(T), extractType(U)], fields as ActionStopFields)
          case 'Pause':
            return new ActionPause(
              [extractType(T), extractType(U)],
              fields as ActionPauseFields<ToTypeArgument<T>, ToPhantomTypeArgument<U>>
            )
          case 'Jump':
            return new ActionJump(
              [extractType(T), extractType(U)],
              fields as ActionJumpFields<ToTypeArgument<T>, ToPhantomTypeArgument<U>>
            )
        }
      },
      kind: 'EnumClassReified',
    } as ActionReified<ToTypeArgument<T>, ToPhantomTypeArgument<U>>
  }

  static get r() {
    return Action.reified
  }

  static phantom<
    T extends Reified<TypeArgument, any>,
    U extends PhantomReified<PhantomTypeArgument>,
  >(
    T: T,
    U: U
  ): PhantomReified<ToTypeStr<ActionVariant<ToTypeArgument<T>, ToPhantomTypeArgument<U>>>> {
    return phantom(Action.reified(T, U))
  }

  static get p() {
    return Action.phantom
  }

  private static instantiateBcs() {
    return <T extends BcsType<any>>(T: T) =>
      bcs.enum(`Action<${T.name}>`, {
        Stop: null,
        Pause: bcs.struct('ActionPause', {
          duration: bcs.u32(),
          generic_field: T,
          phantom_field: Balance.bcs,
          reified_field: Option.bcs(bcs.u64()),
        }),
        Jump: bcs.tuple([bcs.u64(), T, Balance.bcs, Option.bcs(bcs.u64())]),
      })
  }

  private static cachedBcs: ReturnType<typeof Action.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof Action.instantiateBcs> {
    if (!Action.cachedBcs) {
      Action.cachedBcs = Action.instantiateBcs()
    }
    return Action.cachedBcs
  }

  static fromFields<
    T extends Reified<TypeArgument, any>,
    U extends PhantomReified<PhantomTypeArgument>,
  >(
    typeArgs: [T, U],
    fields: Record<string, any>
  ): ActionVariant<ToTypeArgument<T>, ToPhantomTypeArgument<U>> {
    const r = Action.reified(typeArgs[0], typeArgs[1])

    if (!fields.$kind || !isActionVariantName(fields.$kind)) {
      throw new Error(`Invalid action variant: ${fields.$kind}`)
    }
    switch (fields.$kind) {
      case 'Stop':
        return r.new('Stop', fields.Stop)
      case 'Pause':
        return r.new('Pause', {
          duration: decodeFromFields('u32', fields.Pause.duration),
          genericField: decodeFromFields(typeArgs[0], fields.Pause.generic_field),
          phantomField: decodeFromFields(Balance.reified(typeArgs[1]), fields.Pause.phantom_field),
          reifiedField: decodeFromFields(Option.reified('u64'), fields.Pause.reified_field),
        })
      case 'Jump':
        return r.new('Jump', [
          decodeFromFields('u64', fields.Jump[0]),
          decodeFromFields(typeArgs[0], fields.Jump[1]),
          decodeFromFields(Balance.reified(typeArgs[1]), fields.Jump[2]),
          decodeFromFields(Option.reified('u64'), fields.Jump[3]),
        ])
    }
  }

  static fromFieldsWithTypes<
    T extends Reified<TypeArgument, any>,
    U extends PhantomReified<PhantomTypeArgument>,
  >(
    typeArgs: [T, U],
    item: FieldsWithTypes
  ): ActionVariant<ToTypeArgument<T>, ToPhantomTypeArgument<U>> {
    if (!isAction(item.type)) {
      throw new Error('not a Action type')
    }
    assertFieldsWithTypesArgsMatch(item, typeArgs)

    const variant = (item as FieldsWithTypes & { variant: ActionVariantName }).variant
    if (!variant || !isActionVariantName(variant)) {
      throw new Error(`Invalid action variant: ${variant}`)
    }

    const r = Action.reified(typeArgs[0], typeArgs[1])
    switch (variant) {
      case 'Stop':
        return r.new('Stop', {})
      case 'Pause':
        return r.new('Pause', {
          duration: decodeFromFieldsWithTypes('u32', item.fields.duration),
          genericField: decodeFromFieldsWithTypes(typeArgs[0], item.fields.generic_field),
          phantomField: decodeFromFieldsWithTypes(
            Balance.reified(typeArgs[1]),
            item.fields.phantom_field
          ),
          reifiedField: decodeFromFieldsWithTypes(Option.reified('u64'), item.fields.reified_field),
        })
      case 'Jump':
        return r.new('Jump', [
          decodeFromFieldsWithTypes('u64', item.fields.pos0),
          decodeFromFieldsWithTypes(typeArgs[0], item.fields.pos1),
          decodeFromFieldsWithTypes(Balance.reified(typeArgs[1]), item.fields.pos2),
          decodeFromFieldsWithTypes(Option.reified('u64'), item.fields.pos3),
        ])
    }
  }

  static fromBcs<
    T extends Reified<TypeArgument, any>,
    U extends PhantomReified<PhantomTypeArgument>,
  >(
    typeArgs: [T, U],
    data: Uint8Array
  ): ActionVariant<ToTypeArgument<T>, ToPhantomTypeArgument<U>> {
    const parsed = Action.bcs(toBcs(typeArgs[0])).parse(data)
    return Action.fromFields(typeArgs, parsed)
  }

  static fromJSONField<
    T extends Reified<TypeArgument, any>,
    U extends PhantomReified<PhantomTypeArgument>,
  >(typeArgs: [T, U], field: any): ActionVariant<ToTypeArgument<T>, ToPhantomTypeArgument<U>> {
    const r = Action.reified(typeArgs[0], typeArgs[1])

    const kind = field.$kind
    if (!kind || !isActionVariantName(kind)) {
      throw new Error(`Invalid action variant: ${kind}`)
    }
    switch (kind) {
      case 'Stop':
        return r.new('Stop', {})
      case 'Pause':
        return r.new('Pause', {
          duration: decodeFromJSONField('u32', field.duration),
          genericField: decodeFromJSONField(typeArgs[0], field.genericField),
          phantomField: decodeFromJSONField(Balance.reified(typeArgs[1]), field.phantomField),
          reifiedField: decodeFromJSONField(Option.reified('u64'), field.reifiedField),
        })
      case 'Jump':
        return r.new('Jump', [
          decodeFromJSONField('u64', field.vec[0]),
          decodeFromJSONField(typeArgs[0], field.vec[1]),
          decodeFromJSONField(Balance.reified(typeArgs[1]), field.vec[2]),
          decodeFromJSONField(Option.reified('u64'), field.vec[3]),
        ])
    }
  }

  static fromJSON<
    T extends Reified<TypeArgument, any>,
    U extends PhantomReified<PhantomTypeArgument>,
  >(
    typeArgs: [T, U],
    json: Record<string, any>
  ): ActionVariant<ToTypeArgument<T>, ToPhantomTypeArgument<U>> {
    if (json.$typeName !== Action.$typeName) {
      throw new Error(
        `not a Action json object: expected '${Action.$typeName}' but got '${json.$typeName}'`
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Action.$typeName, ...typeArgs.map(extractType)),
      json.$typeArgs,
      typeArgs
    )

    return Action.fromJSONField(typeArgs, json)
  }
}

export type ActionStopFields = Record<string, never>

export class ActionStop<T extends TypeArgument, U extends PhantomTypeArgument>
  implements EnumVariantClass
{
  __EnumVariantClass = true as const

  static readonly $typeName = Action.$typeName
  static readonly $numTypeParams = Action.$numTypeParams
  static readonly $isPhantom = Action.$isPhantom
  static readonly $variantName = 'Stop'

  readonly $typeName = ActionStop.$typeName
  readonly $fullTypeName: `${typeof Action.$typeName}<${ToTypeStr<T>}, ${PhantomToTypeStr<U>}>`
  readonly $typeArgs: [ToTypeStr<T>, PhantomToTypeStr<U>]
  readonly $isPhantom = Action.$isPhantom
  readonly $variantName = ActionStop.$variantName

  constructor(typeArgs: [ToTypeStr<T>, PhantomToTypeStr<U>], fields: ActionStopFields) {
    this.$fullTypeName = composeSuiType(
      Action.$typeName,
      ...typeArgs
    ) as `${typeof Action.$typeName}<${ToTypeStr<T>}, ${PhantomToTypeStr<U>}>`
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

export interface ActionPauseFields<T extends TypeArgument, U extends PhantomTypeArgument> {
  duration: ToField<'u32'>
  genericField: ToField<T>
  phantomField: ToField<Balance<U>>
  reifiedField: ToField<Option<'u64'>>
}

export class ActionPause<T extends TypeArgument, U extends PhantomTypeArgument>
  implements EnumVariantClass
{
  __EnumVariantClass = true as const

  static readonly $typeName = Action.$typeName
  static readonly $numTypeParams = Action.$numTypeParams
  static readonly $isPhantom = Action.$isPhantom
  static readonly $variantName = 'Pause'

  readonly $typeName = ActionPause.$typeName
  readonly $fullTypeName: `${typeof Action.$typeName}<${ToTypeStr<T>}, ${PhantomToTypeStr<U>}>`
  readonly $typeArgs: [ToTypeStr<T>, PhantomToTypeStr<U>]
  readonly $isPhantom = Action.$isPhantom
  readonly $variantName = ActionPause.$variantName

  readonly duration: ToField<'u32'>
  readonly genericField: ToField<T>
  readonly phantomField: ToField<Balance<U>>
  readonly reifiedField: ToField<Option<'u64'>>

  constructor(typeArgs: [ToTypeStr<T>, PhantomToTypeStr<U>], fields: ActionPauseFields<T, U>) {
    this.$fullTypeName = composeSuiType(
      Action.$typeName,
      ...typeArgs
    ) as `${typeof Action.$typeName}<${ToTypeStr<T>}, ${PhantomToTypeStr<U>}>`
    this.$typeArgs = typeArgs

    this.duration = fields.duration
    this.genericField = fields.genericField
    this.phantomField = fields.phantomField
    this.reifiedField = fields.reifiedField
  }

  toJSONField() {
    return {
      $kind: this.$variantName,
      duration: fieldToJSON<'u32'>(`u32`, this.duration),
      genericField: fieldToJSON<T>(`${this.$typeArgs[0]}`, this.genericField),
      phantomField: fieldToJSON<Balance<U>>(
        `${Balance.$typeName}<${this.$typeArgs[1]}>`,
        this.phantomField
      ),
      reifiedField: fieldToJSON<Option<'u64'>>(`${Option.$typeName}<u64>`, this.reifiedField),
    }
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

export type ActionJumpFields<T extends TypeArgument, U extends PhantomTypeArgument> = [
  ToField<'u64'>,
  ToField<T>,
  ToField<Balance<U>>,
  ToField<Option<'u64'>>,
]

export class ActionJump<T extends TypeArgument, U extends PhantomTypeArgument>
  implements EnumVariantClass
{
  __EnumVariantClass = true as const

  static readonly $typeName = Action.$typeName
  static readonly $numTypeParams = Action.$numTypeParams
  static readonly $isPhantom = Action.$isPhantom
  static readonly $variantName = 'Jump'

  readonly $typeName = ActionJump.$typeName
  readonly $fullTypeName: `${typeof Action.$typeName}<${ToTypeStr<T>}, ${PhantomToTypeStr<U>}>`
  readonly $typeArgs: [ToTypeStr<T>, PhantomToTypeStr<U>]
  readonly $isPhantom = Action.$isPhantom
  readonly $variantName = ActionJump.$variantName

  readonly 0: ToField<'u64'>
  readonly 1: ToField<T>
  readonly 2: ToField<Balance<U>>
  readonly 3: ToField<Option<'u64'>>

  constructor(typeArgs: [ToTypeStr<T>, PhantomToTypeStr<U>], fields: ActionJumpFields<T, U>) {
    this.$fullTypeName = composeSuiType(
      Action.$typeName,
      ...typeArgs
    ) as `${typeof Action.$typeName}<${ToTypeStr<T>}, ${PhantomToTypeStr<U>}>`
    this.$typeArgs = typeArgs

    this[0] = fields[0]
    this[1] = fields[1]
    this[2] = fields[2]
    this[3] = fields[3]
  }

  toJSONField() {
    return {
      $kind: this.$variantName,
      vec: [
        fieldToJSON<'u64'>(`u64`, this[0]),
        fieldToJSON<T>(`${this.$typeArgs[0]}`, this[1]),
        fieldToJSON<Balance<U>>(`${Balance.$typeName}<${this.$typeArgs[1]}>`, this[2]),
        fieldToJSON<Option<'u64'>>(`${Option.$typeName}<u64>`, this[3]),
      ],
    }
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
