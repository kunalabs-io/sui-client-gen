import { bcs } from '@mysten/sui/bcs'
import { SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromBase64 } from '@mysten/sui/utils'
import { getTypeOrigin } from '../../_envs'
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
  ToTypeStr as ToPhantom,
} from '../../_framework/reified'
import {
  composeSuiType,
  compressSuiType,
  fetchObjectBcs,
  FieldsWithTypes,
  parseTypeName,
  SupportedSuiClient,
} from '../../_framework/util'
import { TypeName } from '../../std/type-name/structs'
import { Balance, Supply } from '../../sui/balance/structs'
import { ID, UID } from '../../sui/object/structs'
import { Table } from '../../sui/table/structs'

/* ============================== PoolCreationEvent =============================== */

export function isPoolCreationEvent(type: string): boolean {
  type = compressSuiType(type)
  return type === `${getTypeOrigin('amm', 'pool::PoolCreationEvent')}::pool::PoolCreationEvent`
}

export interface PoolCreationEventFields {
  poolId: ToField<ID>
}

export type PoolCreationEventReified = Reified<PoolCreationEvent, PoolCreationEventFields>

export type PoolCreationEventJSONField = {
  poolId: string
}

export type PoolCreationEventJSON = {
  $typeName: typeof PoolCreationEvent.$typeName
  $typeArgs: []
} & PoolCreationEventJSONField

export class PoolCreationEvent implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `${string}::pool::PoolCreationEvent` = `${
    getTypeOrigin('amm', 'pool::PoolCreationEvent')
  }::pool::PoolCreationEvent` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName: typeof PoolCreationEvent.$typeName = PoolCreationEvent.$typeName
  readonly $fullTypeName: `${string}::pool::PoolCreationEvent`
  readonly $typeArgs: []
  readonly $isPhantom: typeof PoolCreationEvent.$isPhantom = PoolCreationEvent.$isPhantom

  readonly poolId: ToField<ID>

  private constructor(typeArgs: [], fields: PoolCreationEventFields) {
    this.$fullTypeName = composeSuiType(
      PoolCreationEvent.$typeName,
      ...typeArgs,
    ) as `${string}::pool::PoolCreationEvent`
    this.$typeArgs = typeArgs

    this.poolId = fields.poolId
  }

  static reified(): PoolCreationEventReified {
    const reifiedBcs = PoolCreationEvent.bcs
    return {
      typeName: PoolCreationEvent.$typeName,
      fullTypeName: composeSuiType(
        PoolCreationEvent.$typeName,
        ...[],
      ) as `${string}::pool::PoolCreationEvent`,
      typeArgs: [] as [],
      isPhantom: PoolCreationEvent.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => PoolCreationEvent.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => PoolCreationEvent.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => PoolCreationEvent.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => PoolCreationEvent.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => PoolCreationEvent.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => PoolCreationEvent.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => PoolCreationEvent.fromSuiObjectData(content),
      fetch: async (client: SupportedSuiClient, id: string) => PoolCreationEvent.fetch(client, id),
      new: (fields: PoolCreationEventFields) => {
        return new PoolCreationEvent([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): PoolCreationEventReified {
    return PoolCreationEvent.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<PoolCreationEvent>> {
    return phantom(PoolCreationEvent.reified())
  }

  static get p(): PhantomReified<ToTypeStr<PoolCreationEvent>> {
    return PoolCreationEvent.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('PoolCreationEvent', {
      pool_id: ID.bcs,
    })
  }

  private static cachedBcs: ReturnType<typeof PoolCreationEvent.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof PoolCreationEvent.instantiateBcs> {
    if (!PoolCreationEvent.cachedBcs) {
      PoolCreationEvent.cachedBcs = PoolCreationEvent.instantiateBcs()
    }
    return PoolCreationEvent.cachedBcs
  }

  static fromFields(fields: Record<string, any>): PoolCreationEvent {
    return PoolCreationEvent.reified().new({
      poolId: decodeFromFields(ID.reified(), fields.pool_id),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): PoolCreationEvent {
    if (!isPoolCreationEvent(item.type)) {
      throw new Error('not a PoolCreationEvent type')
    }

    return PoolCreationEvent.reified().new({
      poolId: decodeFromFieldsWithTypes(ID.reified(), item.fields.pool_id),
    })
  }

  static fromBcs(data: Uint8Array): PoolCreationEvent {
    return PoolCreationEvent.fromFields(PoolCreationEvent.bcs.parse(data))
  }

  toJSONField(): PoolCreationEventJSONField {
    return {
      poolId: this.poolId,
    }
  }

  toJSON(): PoolCreationEventJSON {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): PoolCreationEvent {
    return PoolCreationEvent.reified().new({
      poolId: decodeFromJSONField(ID.reified(), field.poolId),
    })
  }

  static fromJSON(json: Record<string, any>): PoolCreationEvent {
    if (json.$typeName !== PoolCreationEvent.$typeName) {
      throw new Error(
        `not a PoolCreationEvent json object: expected '${PoolCreationEvent.$typeName}' but got '${json.$typeName}'`,
      )
    }

    return PoolCreationEvent.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): PoolCreationEvent {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isPoolCreationEvent(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a PoolCreationEvent object`)
    }
    return PoolCreationEvent.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): PoolCreationEvent {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isPoolCreationEvent(data.bcs.type)) {
        throw new Error(`object at is not a PoolCreationEvent object`)
      }

      return PoolCreationEvent.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return PoolCreationEvent.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.',
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<PoolCreationEvent> {
    const res = await fetchObjectBcs(client, id)
    if (!isPoolCreationEvent(res.type)) {
      throw new Error(`object at id ${id} is not a PoolCreationEvent object`)
    }

    return PoolCreationEvent.fromBcs(res.bcsBytes)
  }
}

/* ============================== LP =============================== */

export function isLP(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`${getTypeOrigin('amm', 'pool::LP')}::pool::LP` + '<')
}

export interface LPFields<A extends PhantomTypeArgument, B extends PhantomTypeArgument> {
  dummyField: ToField<'bool'>
}

export type LPReified<A extends PhantomTypeArgument, B extends PhantomTypeArgument> = Reified<
  LP<A, B>,
  LPFields<A, B>
>

export type LPJSONField<A extends PhantomTypeArgument, B extends PhantomTypeArgument> = {
  dummyField: boolean
}

export type LPJSON<A extends PhantomTypeArgument, B extends PhantomTypeArgument> = {
  $typeName: typeof LP.$typeName
  $typeArgs: [PhantomToTypeStr<A>, PhantomToTypeStr<B>]
} & LPJSONField<A, B>

/** Pool LP token witness. */
export class LP<A extends PhantomTypeArgument, B extends PhantomTypeArgument>
  implements StructClass
{
  __StructClass = true as const

  static readonly $typeName: `${string}::pool::LP` = `${
    getTypeOrigin('amm', 'pool::LP')
  }::pool::LP` as const
  static readonly $numTypeParams = 2
  static readonly $isPhantom = [true, true] as const

  readonly $typeName: typeof LP.$typeName = LP.$typeName
  readonly $fullTypeName: `${string}::pool::LP<${PhantomToTypeStr<A>}, ${PhantomToTypeStr<B>}>`
  readonly $typeArgs: [PhantomToTypeStr<A>, PhantomToTypeStr<B>]
  readonly $isPhantom: typeof LP.$isPhantom = LP.$isPhantom

  readonly dummyField: ToField<'bool'>

  private constructor(
    typeArgs: [PhantomToTypeStr<A>, PhantomToTypeStr<B>],
    fields: LPFields<A, B>,
  ) {
    this.$fullTypeName = composeSuiType(
      LP.$typeName,
      ...typeArgs,
    ) as `${string}::pool::LP<${PhantomToTypeStr<A>}, ${PhantomToTypeStr<B>}>`
    this.$typeArgs = typeArgs

    this.dummyField = fields.dummyField
  }

  static reified<
    A extends PhantomReified<PhantomTypeArgument>,
    B extends PhantomReified<PhantomTypeArgument>,
  >(
    A: A,
    B: B,
  ): LPReified<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>> {
    const reifiedBcs = LP.bcs
    return {
      typeName: LP.$typeName,
      fullTypeName: composeSuiType(
        LP.$typeName,
        ...[extractType(A), extractType(B)],
      ) as `${string}::pool::LP<${PhantomToTypeStr<ToPhantomTypeArgument<A>>}, ${PhantomToTypeStr<
        ToPhantomTypeArgument<B>
      >}>`,
      typeArgs: [extractType(A), extractType(B)] as [
        PhantomToTypeStr<ToPhantomTypeArgument<A>>,
        PhantomToTypeStr<ToPhantomTypeArgument<B>>,
      ],
      isPhantom: LP.$isPhantom,
      reifiedTypeArgs: [A, B],
      fromFields: (fields: Record<string, any>) => LP.fromFields([A, B], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => LP.fromFieldsWithTypes([A, B], item),
      fromBcs: (data: Uint8Array) => LP.fromFields([A, B], reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => LP.fromJSONField([A, B], field),
      fromJSON: (json: Record<string, any>) => LP.fromJSON([A, B], json),
      fromSuiParsedData: (content: SuiParsedData) => LP.fromSuiParsedData([A, B], content),
      fromSuiObjectData: (content: SuiObjectData) => LP.fromSuiObjectData([A, B], content),
      fetch: async (client: SupportedSuiClient, id: string) => LP.fetch(client, [A, B], id),
      new: (fields: LPFields<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>>) => {
        return new LP([extractType(A), extractType(B)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): typeof LP.reified {
    return LP.reified
  }

  static phantom<
    A extends PhantomReified<PhantomTypeArgument>,
    B extends PhantomReified<PhantomTypeArgument>,
  >(
    A: A,
    B: B,
  ): PhantomReified<ToTypeStr<LP<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>>>> {
    return phantom(LP.reified(A, B))
  }

  static get p(): typeof LP.phantom {
    return LP.phantom
  }

  private static instantiateBcs() {
    return bcs.struct('LP', {
      dummy_field: bcs.bool(),
    })
  }

  private static cachedBcs: ReturnType<typeof LP.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof LP.instantiateBcs> {
    if (!LP.cachedBcs) {
      LP.cachedBcs = LP.instantiateBcs()
    }
    return LP.cachedBcs
  }

  static fromFields<
    A extends PhantomReified<PhantomTypeArgument>,
    B extends PhantomReified<PhantomTypeArgument>,
  >(
    typeArgs: [A, B],
    fields: Record<string, any>,
  ): LP<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>> {
    return LP.reified(typeArgs[0], typeArgs[1]).new({
      dummyField: decodeFromFields('bool', fields.dummy_field),
    })
  }

  static fromFieldsWithTypes<
    A extends PhantomReified<PhantomTypeArgument>,
    B extends PhantomReified<PhantomTypeArgument>,
  >(
    typeArgs: [A, B],
    item: FieldsWithTypes,
  ): LP<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>> {
    if (!isLP(item.type)) {
      throw new Error('not a LP type')
    }
    assertFieldsWithTypesArgsMatch(item, typeArgs)

    return LP.reified(typeArgs[0], typeArgs[1]).new({
      dummyField: decodeFromFieldsWithTypes('bool', item.fields.dummy_field),
    })
  }

  static fromBcs<
    A extends PhantomReified<PhantomTypeArgument>,
    B extends PhantomReified<PhantomTypeArgument>,
  >(
    typeArgs: [A, B],
    data: Uint8Array,
  ): LP<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>> {
    return LP.fromFields(typeArgs, LP.bcs.parse(data))
  }

  toJSONField(): LPJSONField<A, B> {
    return {
      dummyField: this.dummyField,
    }
  }

  toJSON(): LPJSON<A, B> {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<
    A extends PhantomReified<PhantomTypeArgument>,
    B extends PhantomReified<PhantomTypeArgument>,
  >(
    typeArgs: [A, B],
    field: any,
  ): LP<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>> {
    return LP.reified(typeArgs[0], typeArgs[1]).new({
      dummyField: decodeFromJSONField('bool', field.dummyField),
    })
  }

  static fromJSON<
    A extends PhantomReified<PhantomTypeArgument>,
    B extends PhantomReified<PhantomTypeArgument>,
  >(
    typeArgs: [A, B],
    json: Record<string, any>,
  ): LP<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>> {
    if (json.$typeName !== LP.$typeName) {
      throw new Error(
        `not a LP json object: expected '${LP.$typeName}' but got '${json.$typeName}'`,
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(LP.$typeName, ...typeArgs.map(extractType)),
      json.$typeArgs,
      typeArgs,
    )

    return LP.fromJSONField(typeArgs, json)
  }

  static fromSuiParsedData<
    A extends PhantomReified<PhantomTypeArgument>,
    B extends PhantomReified<PhantomTypeArgument>,
  >(
    typeArgs: [A, B],
    content: SuiParsedData,
  ): LP<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isLP(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a LP object`)
    }
    return LP.fromFieldsWithTypes(typeArgs, content)
  }

  static fromSuiObjectData<
    A extends PhantomReified<PhantomTypeArgument>,
    B extends PhantomReified<PhantomTypeArgument>,
  >(
    typeArgs: [A, B],
    data: SuiObjectData,
  ): LP<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isLP(data.bcs.type)) {
        throw new Error(`object at is not a LP object`)
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs
      if (gotTypeArgs.length !== 2) {
        throw new Error(
          `type argument mismatch: expected 2 type arguments but got '${gotTypeArgs.length}'`,
        )
      }
      for (let i = 0; i < 2; i++) {
        const gotTypeArg = compressSuiType(gotTypeArgs[i])
        const expectedTypeArg = compressSuiType(extractType(typeArgs[i]))
        if (gotTypeArg !== expectedTypeArg) {
          throw new Error(
            `type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`,
          )
        }
      }

      return LP.fromBcs(typeArgs, fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return LP.fromSuiParsedData(typeArgs, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.',
    )
  }

  static async fetch<
    A extends PhantomReified<PhantomTypeArgument>,
    B extends PhantomReified<PhantomTypeArgument>,
  >(
    client: SupportedSuiClient,
    typeArgs: [A, B],
    id: string,
  ): Promise<LP<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>>> {
    const res = await fetchObjectBcs(client, id)
    if (!isLP(res.type)) {
      throw new Error(`object at id ${id} is not a LP object`)
    }

    const gotTypeArgs = parseTypeName(res.type).typeArgs
    if (gotTypeArgs.length !== 2) {
      throw new Error(
        `type argument mismatch: expected 2 type arguments but got '${gotTypeArgs.length}'`,
      )
    }
    for (let i = 0; i < 2; i++) {
      const gotTypeArg = compressSuiType(gotTypeArgs[i])
      const expectedTypeArg = compressSuiType(extractType(typeArgs[i]))
      if (gotTypeArg !== expectedTypeArg) {
        throw new Error(
          `type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`,
        )
      }
    }

    return LP.fromBcs(typeArgs, res.bcsBytes)
  }
}

/* ============================== Pool =============================== */

export function isPool(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`${getTypeOrigin('amm', 'pool::Pool')}::pool::Pool` + '<')
}

export interface PoolFields<A extends PhantomTypeArgument, B extends PhantomTypeArgument> {
  id: ToField<UID>
  balanceA: ToField<Balance<A>>
  balanceB: ToField<Balance<B>>
  lpSupply: ToField<Supply<ToPhantom<LP<A, B>>>>
  /** The liquidity provider fees expressed in basis points (1 bps is 0.01%) */
  lpFeeBps: ToField<'u64'>
  /** Admin fees are calculated as a percentage of liquidity provider fees. */
  adminFeePct: ToField<'u64'>
  /**
   * Admin fees are deposited into this balance. They can be colleced by
   * this pool's PoolAdminCap bearer.
   */
  adminFeeBalance: ToField<Balance<ToPhantom<LP<A, B>>>>
}

export type PoolReified<A extends PhantomTypeArgument, B extends PhantomTypeArgument> = Reified<
  Pool<A, B>,
  PoolFields<A, B>
>

export type PoolJSONField<A extends PhantomTypeArgument, B extends PhantomTypeArgument> = {
  id: string
  balanceA: ToJSON<Balance<A>>
  balanceB: ToJSON<Balance<B>>
  lpSupply: ToJSON<Supply<ToPhantom<LP<A, B>>>>
  lpFeeBps: string
  adminFeePct: string
  adminFeeBalance: ToJSON<Balance<ToPhantom<LP<A, B>>>>
}

export type PoolJSON<A extends PhantomTypeArgument, B extends PhantomTypeArgument> = {
  $typeName: typeof Pool.$typeName
  $typeArgs: [PhantomToTypeStr<A>, PhantomToTypeStr<B>]
} & PoolJSONField<A, B>

/** Pool represents an AMM Pool. */
export class Pool<A extends PhantomTypeArgument, B extends PhantomTypeArgument>
  implements StructClass
{
  __StructClass = true as const

  static readonly $typeName: `${string}::pool::Pool` = `${
    getTypeOrigin('amm', 'pool::Pool')
  }::pool::Pool` as const
  static readonly $numTypeParams = 2
  static readonly $isPhantom = [true, true] as const

  readonly $typeName: typeof Pool.$typeName = Pool.$typeName
  readonly $fullTypeName: `${string}::pool::Pool<${PhantomToTypeStr<A>}, ${PhantomToTypeStr<B>}>`
  readonly $typeArgs: [PhantomToTypeStr<A>, PhantomToTypeStr<B>]
  readonly $isPhantom: typeof Pool.$isPhantom = Pool.$isPhantom

  readonly id: ToField<UID>
  readonly balanceA: ToField<Balance<A>>
  readonly balanceB: ToField<Balance<B>>
  readonly lpSupply: ToField<Supply<ToPhantom<LP<A, B>>>>
  /** The liquidity provider fees expressed in basis points (1 bps is 0.01%) */
  readonly lpFeeBps: ToField<'u64'>
  /** Admin fees are calculated as a percentage of liquidity provider fees. */
  readonly adminFeePct: ToField<'u64'>
  /**
   * Admin fees are deposited into this balance. They can be colleced by
   * this pool's PoolAdminCap bearer.
   */
  readonly adminFeeBalance: ToField<Balance<ToPhantom<LP<A, B>>>>

  private constructor(
    typeArgs: [PhantomToTypeStr<A>, PhantomToTypeStr<B>],
    fields: PoolFields<A, B>,
  ) {
    this.$fullTypeName = composeSuiType(
      Pool.$typeName,
      ...typeArgs,
    ) as `${string}::pool::Pool<${PhantomToTypeStr<A>}, ${PhantomToTypeStr<B>}>`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.balanceA = fields.balanceA
    this.balanceB = fields.balanceB
    this.lpSupply = fields.lpSupply
    this.lpFeeBps = fields.lpFeeBps
    this.adminFeePct = fields.adminFeePct
    this.adminFeeBalance = fields.adminFeeBalance
  }

  static reified<
    A extends PhantomReified<PhantomTypeArgument>,
    B extends PhantomReified<PhantomTypeArgument>,
  >(
    A: A,
    B: B,
  ): PoolReified<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>> {
    const reifiedBcs = Pool.bcs
    return {
      typeName: Pool.$typeName,
      fullTypeName: composeSuiType(
        Pool.$typeName,
        ...[extractType(A), extractType(B)],
      ) as `${string}::pool::Pool<${PhantomToTypeStr<ToPhantomTypeArgument<A>>}, ${PhantomToTypeStr<
        ToPhantomTypeArgument<B>
      >}>`,
      typeArgs: [extractType(A), extractType(B)] as [
        PhantomToTypeStr<ToPhantomTypeArgument<A>>,
        PhantomToTypeStr<ToPhantomTypeArgument<B>>,
      ],
      isPhantom: Pool.$isPhantom,
      reifiedTypeArgs: [A, B],
      fromFields: (fields: Record<string, any>) => Pool.fromFields([A, B], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Pool.fromFieldsWithTypes([A, B], item),
      fromBcs: (data: Uint8Array) => Pool.fromFields([A, B], reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => Pool.fromJSONField([A, B], field),
      fromJSON: (json: Record<string, any>) => Pool.fromJSON([A, B], json),
      fromSuiParsedData: (content: SuiParsedData) => Pool.fromSuiParsedData([A, B], content),
      fromSuiObjectData: (content: SuiObjectData) => Pool.fromSuiObjectData([A, B], content),
      fetch: async (client: SupportedSuiClient, id: string) => Pool.fetch(client, [A, B], id),
      new: (fields: PoolFields<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>>) => {
        return new Pool([extractType(A), extractType(B)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): typeof Pool.reified {
    return Pool.reified
  }

  static phantom<
    A extends PhantomReified<PhantomTypeArgument>,
    B extends PhantomReified<PhantomTypeArgument>,
  >(
    A: A,
    B: B,
  ): PhantomReified<ToTypeStr<Pool<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>>>> {
    return phantom(Pool.reified(A, B))
  }

  static get p(): typeof Pool.phantom {
    return Pool.phantom
  }

  private static instantiateBcs() {
    return bcs.struct('Pool', {
      id: UID.bcs,
      balance_a: Balance.bcs,
      balance_b: Balance.bcs,
      lp_supply: Supply.bcs,
      lp_fee_bps: bcs.u64(),
      admin_fee_pct: bcs.u64(),
      admin_fee_balance: Balance.bcs,
    })
  }

  private static cachedBcs: ReturnType<typeof Pool.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof Pool.instantiateBcs> {
    if (!Pool.cachedBcs) {
      Pool.cachedBcs = Pool.instantiateBcs()
    }
    return Pool.cachedBcs
  }

  static fromFields<
    A extends PhantomReified<PhantomTypeArgument>,
    B extends PhantomReified<PhantomTypeArgument>,
  >(
    typeArgs: [A, B],
    fields: Record<string, any>,
  ): Pool<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>> {
    return Pool.reified(typeArgs[0], typeArgs[1]).new({
      id: decodeFromFields(UID.reified(), fields.id),
      balanceA: decodeFromFields(Balance.reified(typeArgs[0]), fields.balance_a),
      balanceB: decodeFromFields(Balance.reified(typeArgs[1]), fields.balance_b),
      lpSupply: decodeFromFields(
        Supply.reified(phantom(LP.reified(typeArgs[0], typeArgs[1]))),
        fields.lp_supply,
      ),
      lpFeeBps: decodeFromFields('u64', fields.lp_fee_bps),
      adminFeePct: decodeFromFields('u64', fields.admin_fee_pct),
      adminFeeBalance: decodeFromFields(
        Balance.reified(phantom(LP.reified(typeArgs[0], typeArgs[1]))),
        fields.admin_fee_balance,
      ),
    })
  }

  static fromFieldsWithTypes<
    A extends PhantomReified<PhantomTypeArgument>,
    B extends PhantomReified<PhantomTypeArgument>,
  >(
    typeArgs: [A, B],
    item: FieldsWithTypes,
  ): Pool<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>> {
    if (!isPool(item.type)) {
      throw new Error('not a Pool type')
    }
    assertFieldsWithTypesArgsMatch(item, typeArgs)

    return Pool.reified(typeArgs[0], typeArgs[1]).new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      balanceA: decodeFromFieldsWithTypes(Balance.reified(typeArgs[0]), item.fields.balance_a),
      balanceB: decodeFromFieldsWithTypes(Balance.reified(typeArgs[1]), item.fields.balance_b),
      lpSupply: decodeFromFieldsWithTypes(
        Supply.reified(phantom(LP.reified(typeArgs[0], typeArgs[1]))),
        item.fields.lp_supply,
      ),
      lpFeeBps: decodeFromFieldsWithTypes('u64', item.fields.lp_fee_bps),
      adminFeePct: decodeFromFieldsWithTypes('u64', item.fields.admin_fee_pct),
      adminFeeBalance: decodeFromFieldsWithTypes(
        Balance.reified(phantom(LP.reified(typeArgs[0], typeArgs[1]))),
        item.fields.admin_fee_balance,
      ),
    })
  }

  static fromBcs<
    A extends PhantomReified<PhantomTypeArgument>,
    B extends PhantomReified<PhantomTypeArgument>,
  >(
    typeArgs: [A, B],
    data: Uint8Array,
  ): Pool<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>> {
    return Pool.fromFields(typeArgs, Pool.bcs.parse(data))
  }

  toJSONField(): PoolJSONField<A, B> {
    return {
      id: this.id,
      balanceA: this.balanceA.toJSONField(),
      balanceB: this.balanceB.toJSONField(),
      lpSupply: this.lpSupply.toJSONField(),
      lpFeeBps: this.lpFeeBps.toString(),
      adminFeePct: this.adminFeePct.toString(),
      adminFeeBalance: this.adminFeeBalance.toJSONField(),
    }
  }

  toJSON(): PoolJSON<A, B> {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<
    A extends PhantomReified<PhantomTypeArgument>,
    B extends PhantomReified<PhantomTypeArgument>,
  >(
    typeArgs: [A, B],
    field: any,
  ): Pool<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>> {
    return Pool.reified(typeArgs[0], typeArgs[1]).new({
      id: decodeFromJSONField(UID.reified(), field.id),
      balanceA: decodeFromJSONField(Balance.reified(typeArgs[0]), field.balanceA),
      balanceB: decodeFromJSONField(Balance.reified(typeArgs[1]), field.balanceB),
      lpSupply: decodeFromJSONField(
        Supply.reified(phantom(LP.reified(typeArgs[0], typeArgs[1]))),
        field.lpSupply,
      ),
      lpFeeBps: decodeFromJSONField('u64', field.lpFeeBps),
      adminFeePct: decodeFromJSONField('u64', field.adminFeePct),
      adminFeeBalance: decodeFromJSONField(
        Balance.reified(phantom(LP.reified(typeArgs[0], typeArgs[1]))),
        field.adminFeeBalance,
      ),
    })
  }

  static fromJSON<
    A extends PhantomReified<PhantomTypeArgument>,
    B extends PhantomReified<PhantomTypeArgument>,
  >(
    typeArgs: [A, B],
    json: Record<string, any>,
  ): Pool<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>> {
    if (json.$typeName !== Pool.$typeName) {
      throw new Error(
        `not a Pool json object: expected '${Pool.$typeName}' but got '${json.$typeName}'`,
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Pool.$typeName, ...typeArgs.map(extractType)),
      json.$typeArgs,
      typeArgs,
    )

    return Pool.fromJSONField(typeArgs, json)
  }

  static fromSuiParsedData<
    A extends PhantomReified<PhantomTypeArgument>,
    B extends PhantomReified<PhantomTypeArgument>,
  >(
    typeArgs: [A, B],
    content: SuiParsedData,
  ): Pool<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isPool(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Pool object`)
    }
    return Pool.fromFieldsWithTypes(typeArgs, content)
  }

  static fromSuiObjectData<
    A extends PhantomReified<PhantomTypeArgument>,
    B extends PhantomReified<PhantomTypeArgument>,
  >(
    typeArgs: [A, B],
    data: SuiObjectData,
  ): Pool<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isPool(data.bcs.type)) {
        throw new Error(`object at is not a Pool object`)
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs
      if (gotTypeArgs.length !== 2) {
        throw new Error(
          `type argument mismatch: expected 2 type arguments but got '${gotTypeArgs.length}'`,
        )
      }
      for (let i = 0; i < 2; i++) {
        const gotTypeArg = compressSuiType(gotTypeArgs[i])
        const expectedTypeArg = compressSuiType(extractType(typeArgs[i]))
        if (gotTypeArg !== expectedTypeArg) {
          throw new Error(
            `type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`,
          )
        }
      }

      return Pool.fromBcs(typeArgs, fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Pool.fromSuiParsedData(typeArgs, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.',
    )
  }

  static async fetch<
    A extends PhantomReified<PhantomTypeArgument>,
    B extends PhantomReified<PhantomTypeArgument>,
  >(
    client: SupportedSuiClient,
    typeArgs: [A, B],
    id: string,
  ): Promise<Pool<ToPhantomTypeArgument<A>, ToPhantomTypeArgument<B>>> {
    const res = await fetchObjectBcs(client, id)
    if (!isPool(res.type)) {
      throw new Error(`object at id ${id} is not a Pool object`)
    }

    const gotTypeArgs = parseTypeName(res.type).typeArgs
    if (gotTypeArgs.length !== 2) {
      throw new Error(
        `type argument mismatch: expected 2 type arguments but got '${gotTypeArgs.length}'`,
      )
    }
    for (let i = 0; i < 2; i++) {
      const gotTypeArg = compressSuiType(gotTypeArgs[i])
      const expectedTypeArg = compressSuiType(extractType(typeArgs[i]))
      if (gotTypeArg !== expectedTypeArg) {
        throw new Error(
          `type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`,
        )
      }
    }

    return Pool.fromBcs(typeArgs, res.bcsBytes)
  }
}

/* ============================== PoolRegistry =============================== */

export function isPoolRegistry(type: string): boolean {
  type = compressSuiType(type)
  return type === `${getTypeOrigin('amm', 'pool::PoolRegistry')}::pool::PoolRegistry`
}

export interface PoolRegistryFields {
  id: ToField<UID>
  table: ToField<Table<ToPhantom<PoolRegistryItem>, 'bool'>>
}

export type PoolRegistryReified = Reified<PoolRegistry, PoolRegistryFields>

export type PoolRegistryJSONField = {
  id: string
  table: ToJSON<Table<ToPhantom<PoolRegistryItem>, 'bool'>>
}

export type PoolRegistryJSON = {
  $typeName: typeof PoolRegistry.$typeName
  $typeArgs: []
} & PoolRegistryJSONField

/**
 * `PoolRegistry` stores a table of all pools created which is used to guarantee
 * that only one pool per currency pair can exist.
 */
export class PoolRegistry implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `${string}::pool::PoolRegistry` = `${
    getTypeOrigin('amm', 'pool::PoolRegistry')
  }::pool::PoolRegistry` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName: typeof PoolRegistry.$typeName = PoolRegistry.$typeName
  readonly $fullTypeName: `${string}::pool::PoolRegistry`
  readonly $typeArgs: []
  readonly $isPhantom: typeof PoolRegistry.$isPhantom = PoolRegistry.$isPhantom

  readonly id: ToField<UID>
  readonly table: ToField<Table<ToPhantom<PoolRegistryItem>, 'bool'>>

  private constructor(typeArgs: [], fields: PoolRegistryFields) {
    this.$fullTypeName = composeSuiType(
      PoolRegistry.$typeName,
      ...typeArgs,
    ) as `${string}::pool::PoolRegistry`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.table = fields.table
  }

  static reified(): PoolRegistryReified {
    const reifiedBcs = PoolRegistry.bcs
    return {
      typeName: PoolRegistry.$typeName,
      fullTypeName: composeSuiType(
        PoolRegistry.$typeName,
        ...[],
      ) as `${string}::pool::PoolRegistry`,
      typeArgs: [] as [],
      isPhantom: PoolRegistry.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => PoolRegistry.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => PoolRegistry.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => PoolRegistry.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => PoolRegistry.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => PoolRegistry.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => PoolRegistry.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => PoolRegistry.fromSuiObjectData(content),
      fetch: async (client: SupportedSuiClient, id: string) => PoolRegistry.fetch(client, id),
      new: (fields: PoolRegistryFields) => {
        return new PoolRegistry([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): PoolRegistryReified {
    return PoolRegistry.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<PoolRegistry>> {
    return phantom(PoolRegistry.reified())
  }

  static get p(): PhantomReified<ToTypeStr<PoolRegistry>> {
    return PoolRegistry.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('PoolRegistry', {
      id: UID.bcs,
      table: Table.bcs,
    })
  }

  private static cachedBcs: ReturnType<typeof PoolRegistry.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof PoolRegistry.instantiateBcs> {
    if (!PoolRegistry.cachedBcs) {
      PoolRegistry.cachedBcs = PoolRegistry.instantiateBcs()
    }
    return PoolRegistry.cachedBcs
  }

  static fromFields(fields: Record<string, any>): PoolRegistry {
    return PoolRegistry.reified().new({
      id: decodeFromFields(UID.reified(), fields.id),
      table: decodeFromFields(
        Table.reified(phantom(PoolRegistryItem.reified()), phantom('bool')),
        fields.table,
      ),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): PoolRegistry {
    if (!isPoolRegistry(item.type)) {
      throw new Error('not a PoolRegistry type')
    }

    return PoolRegistry.reified().new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      table: decodeFromFieldsWithTypes(
        Table.reified(phantom(PoolRegistryItem.reified()), phantom('bool')),
        item.fields.table,
      ),
    })
  }

  static fromBcs(data: Uint8Array): PoolRegistry {
    return PoolRegistry.fromFields(PoolRegistry.bcs.parse(data))
  }

  toJSONField(): PoolRegistryJSONField {
    return {
      id: this.id,
      table: this.table.toJSONField(),
    }
  }

  toJSON(): PoolRegistryJSON {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): PoolRegistry {
    return PoolRegistry.reified().new({
      id: decodeFromJSONField(UID.reified(), field.id),
      table: decodeFromJSONField(
        Table.reified(phantom(PoolRegistryItem.reified()), phantom('bool')),
        field.table,
      ),
    })
  }

  static fromJSON(json: Record<string, any>): PoolRegistry {
    if (json.$typeName !== PoolRegistry.$typeName) {
      throw new Error(
        `not a PoolRegistry json object: expected '${PoolRegistry.$typeName}' but got '${json.$typeName}'`,
      )
    }

    return PoolRegistry.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): PoolRegistry {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isPoolRegistry(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a PoolRegistry object`)
    }
    return PoolRegistry.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): PoolRegistry {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isPoolRegistry(data.bcs.type)) {
        throw new Error(`object at is not a PoolRegistry object`)
      }

      return PoolRegistry.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return PoolRegistry.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.',
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<PoolRegistry> {
    const res = await fetchObjectBcs(client, id)
    if (!isPoolRegistry(res.type)) {
      throw new Error(`object at id ${id} is not a PoolRegistry object`)
    }

    return PoolRegistry.fromBcs(res.bcsBytes)
  }
}

/* ============================== PoolRegistryItem =============================== */

export function isPoolRegistryItem(type: string): boolean {
  type = compressSuiType(type)
  return type === `${getTypeOrigin('amm', 'pool::PoolRegistryItem')}::pool::PoolRegistryItem`
}

export interface PoolRegistryItemFields {
  a: ToField<TypeName>
  b: ToField<TypeName>
}

export type PoolRegistryItemReified = Reified<PoolRegistryItem, PoolRegistryItemFields>

export type PoolRegistryItemJSONField = {
  a: string
  b: string
}

export type PoolRegistryItemJSON = {
  $typeName: typeof PoolRegistryItem.$typeName
  $typeArgs: []
} & PoolRegistryItemJSONField

/** An item in the `PoolRegistry` table. Represents a pool's currency pair. */
export class PoolRegistryItem implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `${string}::pool::PoolRegistryItem` = `${
    getTypeOrigin('amm', 'pool::PoolRegistryItem')
  }::pool::PoolRegistryItem` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName: typeof PoolRegistryItem.$typeName = PoolRegistryItem.$typeName
  readonly $fullTypeName: `${string}::pool::PoolRegistryItem`
  readonly $typeArgs: []
  readonly $isPhantom: typeof PoolRegistryItem.$isPhantom = PoolRegistryItem.$isPhantom

  readonly a: ToField<TypeName>
  readonly b: ToField<TypeName>

  private constructor(typeArgs: [], fields: PoolRegistryItemFields) {
    this.$fullTypeName = composeSuiType(
      PoolRegistryItem.$typeName,
      ...typeArgs,
    ) as `${string}::pool::PoolRegistryItem`
    this.$typeArgs = typeArgs

    this.a = fields.a
    this.b = fields.b
  }

  static reified(): PoolRegistryItemReified {
    const reifiedBcs = PoolRegistryItem.bcs
    return {
      typeName: PoolRegistryItem.$typeName,
      fullTypeName: composeSuiType(
        PoolRegistryItem.$typeName,
        ...[],
      ) as `${string}::pool::PoolRegistryItem`,
      typeArgs: [] as [],
      isPhantom: PoolRegistryItem.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => PoolRegistryItem.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => PoolRegistryItem.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => PoolRegistryItem.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => PoolRegistryItem.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => PoolRegistryItem.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => PoolRegistryItem.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => PoolRegistryItem.fromSuiObjectData(content),
      fetch: async (client: SupportedSuiClient, id: string) => PoolRegistryItem.fetch(client, id),
      new: (fields: PoolRegistryItemFields) => {
        return new PoolRegistryItem([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): PoolRegistryItemReified {
    return PoolRegistryItem.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<PoolRegistryItem>> {
    return phantom(PoolRegistryItem.reified())
  }

  static get p(): PhantomReified<ToTypeStr<PoolRegistryItem>> {
    return PoolRegistryItem.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('PoolRegistryItem', {
      a: TypeName.bcs,
      b: TypeName.bcs,
    })
  }

  private static cachedBcs: ReturnType<typeof PoolRegistryItem.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof PoolRegistryItem.instantiateBcs> {
    if (!PoolRegistryItem.cachedBcs) {
      PoolRegistryItem.cachedBcs = PoolRegistryItem.instantiateBcs()
    }
    return PoolRegistryItem.cachedBcs
  }

  static fromFields(fields: Record<string, any>): PoolRegistryItem {
    return PoolRegistryItem.reified().new({
      a: decodeFromFields(TypeName.reified(), fields.a),
      b: decodeFromFields(TypeName.reified(), fields.b),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): PoolRegistryItem {
    if (!isPoolRegistryItem(item.type)) {
      throw new Error('not a PoolRegistryItem type')
    }

    return PoolRegistryItem.reified().new({
      a: decodeFromFieldsWithTypes(TypeName.reified(), item.fields.a),
      b: decodeFromFieldsWithTypes(TypeName.reified(), item.fields.b),
    })
  }

  static fromBcs(data: Uint8Array): PoolRegistryItem {
    return PoolRegistryItem.fromFields(PoolRegistryItem.bcs.parse(data))
  }

  toJSONField(): PoolRegistryItemJSONField {
    return {
      a: this.a,
      b: this.b,
    }
  }

  toJSON(): PoolRegistryItemJSON {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): PoolRegistryItem {
    return PoolRegistryItem.reified().new({
      a: decodeFromJSONField(TypeName.reified(), field.a),
      b: decodeFromJSONField(TypeName.reified(), field.b),
    })
  }

  static fromJSON(json: Record<string, any>): PoolRegistryItem {
    if (json.$typeName !== PoolRegistryItem.$typeName) {
      throw new Error(
        `not a PoolRegistryItem json object: expected '${PoolRegistryItem.$typeName}' but got '${json.$typeName}'`,
      )
    }

    return PoolRegistryItem.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): PoolRegistryItem {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isPoolRegistryItem(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a PoolRegistryItem object`)
    }
    return PoolRegistryItem.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): PoolRegistryItem {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isPoolRegistryItem(data.bcs.type)) {
        throw new Error(`object at is not a PoolRegistryItem object`)
      }

      return PoolRegistryItem.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return PoolRegistryItem.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.',
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<PoolRegistryItem> {
    const res = await fetchObjectBcs(client, id)
    if (!isPoolRegistryItem(res.type)) {
      throw new Error(`object at id ${id} is not a PoolRegistryItem object`)
    }

    return PoolRegistryItem.fromBcs(res.bcsBytes)
  }
}

/* ============================== AdminCap =============================== */

export function isAdminCap(type: string): boolean {
  type = compressSuiType(type)
  return type === `${getTypeOrigin('amm', 'pool::AdminCap')}::pool::AdminCap`
}

export interface AdminCapFields {
  id: ToField<UID>
}

export type AdminCapReified = Reified<AdminCap, AdminCapFields>

export type AdminCapJSONField = {
  id: string
}

export type AdminCapJSON = {
  $typeName: typeof AdminCap.$typeName
  $typeArgs: []
} & AdminCapJSONField

/**
 * Capability allowing the bearer to execute admin operations on the pools
 * (e.g. withdraw admin fees). There's only one `AdminCap` created during module
 * initialization that's valid for all pools.
 */
export class AdminCap implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `${string}::pool::AdminCap` = `${
    getTypeOrigin('amm', 'pool::AdminCap')
  }::pool::AdminCap` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName: typeof AdminCap.$typeName = AdminCap.$typeName
  readonly $fullTypeName: `${string}::pool::AdminCap`
  readonly $typeArgs: []
  readonly $isPhantom: typeof AdminCap.$isPhantom = AdminCap.$isPhantom

  readonly id: ToField<UID>

  private constructor(typeArgs: [], fields: AdminCapFields) {
    this.$fullTypeName = composeSuiType(
      AdminCap.$typeName,
      ...typeArgs,
    ) as `${string}::pool::AdminCap`
    this.$typeArgs = typeArgs

    this.id = fields.id
  }

  static reified(): AdminCapReified {
    const reifiedBcs = AdminCap.bcs
    return {
      typeName: AdminCap.$typeName,
      fullTypeName: composeSuiType(
        AdminCap.$typeName,
        ...[],
      ) as `${string}::pool::AdminCap`,
      typeArgs: [] as [],
      isPhantom: AdminCap.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => AdminCap.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => AdminCap.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => AdminCap.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => AdminCap.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => AdminCap.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => AdminCap.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => AdminCap.fromSuiObjectData(content),
      fetch: async (client: SupportedSuiClient, id: string) => AdminCap.fetch(client, id),
      new: (fields: AdminCapFields) => {
        return new AdminCap([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): AdminCapReified {
    return AdminCap.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<AdminCap>> {
    return phantom(AdminCap.reified())
  }

  static get p(): PhantomReified<ToTypeStr<AdminCap>> {
    return AdminCap.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('AdminCap', {
      id: UID.bcs,
    })
  }

  private static cachedBcs: ReturnType<typeof AdminCap.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof AdminCap.instantiateBcs> {
    if (!AdminCap.cachedBcs) {
      AdminCap.cachedBcs = AdminCap.instantiateBcs()
    }
    return AdminCap.cachedBcs
  }

  static fromFields(fields: Record<string, any>): AdminCap {
    return AdminCap.reified().new({
      id: decodeFromFields(UID.reified(), fields.id),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): AdminCap {
    if (!isAdminCap(item.type)) {
      throw new Error('not a AdminCap type')
    }

    return AdminCap.reified().new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
    })
  }

  static fromBcs(data: Uint8Array): AdminCap {
    return AdminCap.fromFields(AdminCap.bcs.parse(data))
  }

  toJSONField(): AdminCapJSONField {
    return {
      id: this.id,
    }
  }

  toJSON(): AdminCapJSON {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): AdminCap {
    return AdminCap.reified().new({
      id: decodeFromJSONField(UID.reified(), field.id),
    })
  }

  static fromJSON(json: Record<string, any>): AdminCap {
    if (json.$typeName !== AdminCap.$typeName) {
      throw new Error(
        `not a AdminCap json object: expected '${AdminCap.$typeName}' but got '${json.$typeName}'`,
      )
    }

    return AdminCap.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): AdminCap {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isAdminCap(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a AdminCap object`)
    }
    return AdminCap.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): AdminCap {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isAdminCap(data.bcs.type)) {
        throw new Error(`object at is not a AdminCap object`)
      }

      return AdminCap.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return AdminCap.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.',
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<AdminCap> {
    const res = await fetchObjectBcs(client, id)
    if (!isAdminCap(res.type)) {
      throw new Error(`object at id ${id} is not a AdminCap object`)
    }

    return AdminCap.fromBcs(res.bcsBytes)
  }
}
