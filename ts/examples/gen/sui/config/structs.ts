import { Option } from '../../_dependencies/0x1/option/structs'
import {
  PhantomReified,
  PhantomToTypeStr,
  PhantomTypeArgument,
  Reified,
  StructClass,
  ToField,
  ToPhantomTypeArgument,
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
import { UID } from '../object/structs'
import { BcsType, bcs } from '@mysten/sui/bcs'
import { SuiClient, SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromBase64 } from '@mysten/sui/utils'

/* ============================== Config =============================== */

export function isConfig(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::config::Config` + '<')
}

export interface ConfigFields<WriteCap extends PhantomTypeArgument> {
  id: ToField<UID>
}

export type ConfigReified<WriteCap extends PhantomTypeArgument> = Reified<
  Config<WriteCap>,
  ConfigFields<WriteCap>
>

export class Config<WriteCap extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::config::Config`
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName = Config.$typeName
  readonly $fullTypeName: `0x2::config::Config<${PhantomToTypeStr<WriteCap>}>`
  readonly $typeArgs: [PhantomToTypeStr<WriteCap>]
  readonly $isPhantom = Config.$isPhantom

  readonly id: ToField<UID>

  private constructor(typeArgs: [PhantomToTypeStr<WriteCap>], fields: ConfigFields<WriteCap>) {
    this.$fullTypeName = composeSuiType(
      Config.$typeName,
      ...typeArgs
    ) as `0x2::config::Config<${PhantomToTypeStr<WriteCap>}>`
    this.$typeArgs = typeArgs

    this.id = fields.id
  }

  static reified<WriteCap extends PhantomReified<PhantomTypeArgument>>(
    WriteCap: WriteCap
  ): ConfigReified<ToPhantomTypeArgument<WriteCap>> {
    const reifiedBcs = Config.bcs
    return {
      typeName: Config.$typeName,
      fullTypeName: composeSuiType(
        Config.$typeName,
        ...[extractType(WriteCap)]
      ) as `0x2::config::Config<${PhantomToTypeStr<ToPhantomTypeArgument<WriteCap>>}>`,
      typeArgs: [extractType(WriteCap)] as [PhantomToTypeStr<ToPhantomTypeArgument<WriteCap>>],
      isPhantom: Config.$isPhantom,
      reifiedTypeArgs: [WriteCap],
      fromFields: (fields: Record<string, any>) => Config.fromFields(WriteCap, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Config.fromFieldsWithTypes(WriteCap, item),
      fromBcs: (data: Uint8Array) => Config.fromFields(WriteCap, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => Config.fromJSONField(WriteCap, field),
      fromJSON: (json: Record<string, any>) => Config.fromJSON(WriteCap, json),
      fromSuiParsedData: (content: SuiParsedData) => Config.fromSuiParsedData(WriteCap, content),
      fromSuiObjectData: (content: SuiObjectData) => Config.fromSuiObjectData(WriteCap, content),
      fetch: async (client: SuiClient, id: string) => Config.fetch(client, WriteCap, id),
      new: (fields: ConfigFields<ToPhantomTypeArgument<WriteCap>>) => {
        return new Config([extractType(WriteCap)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Config.reified
  }

  static phantom<WriteCap extends PhantomReified<PhantomTypeArgument>>(
    WriteCap: WriteCap
  ): PhantomReified<ToTypeStr<Config<ToPhantomTypeArgument<WriteCap>>>> {
    return phantom(Config.reified(WriteCap))
  }

  static get p() {
    return Config.phantom
  }

  private static instantiateBcs() {
    return bcs.struct('Config', {
      id: UID.bcs,
    })
  }

  private static cachedBcs: ReturnType<typeof Config.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof Config.instantiateBcs> {
    if (!Config.cachedBcs) {
      Config.cachedBcs = Config.instantiateBcs()
    }
    return Config.cachedBcs
  }

  static fromFields<WriteCap extends PhantomReified<PhantomTypeArgument>>(
    typeArg: WriteCap,
    fields: Record<string, any>
  ): Config<ToPhantomTypeArgument<WriteCap>> {
    return Config.reified(typeArg).new({
      id: decodeFromFields(UID.reified(), fields.id),
    })
  }

  static fromFieldsWithTypes<WriteCap extends PhantomReified<PhantomTypeArgument>>(
    typeArg: WriteCap,
    item: FieldsWithTypes
  ): Config<ToPhantomTypeArgument<WriteCap>> {
    if (!isConfig(item.type)) {
      throw new Error('not a Config type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Config.reified(typeArg).new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
    })
  }

  static fromBcs<WriteCap extends PhantomReified<PhantomTypeArgument>>(
    typeArg: WriteCap,
    data: Uint8Array
  ): Config<ToPhantomTypeArgument<WriteCap>> {
    return Config.fromFields(typeArg, Config.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<WriteCap extends PhantomReified<PhantomTypeArgument>>(
    typeArg: WriteCap,
    field: any
  ): Config<ToPhantomTypeArgument<WriteCap>> {
    return Config.reified(typeArg).new({
      id: decodeFromJSONField(UID.reified(), field.id),
    })
  }

  static fromJSON<WriteCap extends PhantomReified<PhantomTypeArgument>>(
    typeArg: WriteCap,
    json: Record<string, any>
  ): Config<ToPhantomTypeArgument<WriteCap>> {
    if (json.$typeName !== Config.$typeName) {
      throw new Error(
        `not a Config json object: expected '${Config.$typeName}' but got '${json.$typeName}'`
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Config.$typeName, ...[extractType(typeArg)]),
      json.$typeArgs,
      [typeArg]
    )

    return Config.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<WriteCap extends PhantomReified<PhantomTypeArgument>>(
    typeArg: WriteCap,
    content: SuiParsedData
  ): Config<ToPhantomTypeArgument<WriteCap>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isConfig(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Config object`)
    }
    return Config.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<WriteCap extends PhantomReified<PhantomTypeArgument>>(
    typeArg: WriteCap,
    data: SuiObjectData
  ): Config<ToPhantomTypeArgument<WriteCap>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isConfig(data.bcs.type)) {
        throw new Error(`object at is not a Config object`)
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

      return Config.fromBcs(typeArg, fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Config.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<WriteCap extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: WriteCap,
    id: string
  ): Promise<Config<ToPhantomTypeArgument<WriteCap>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching Config object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isConfig(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a Config object`)
    }

    return Config.fromSuiObjectData(typeArg, res.data)
  }
}

/* ============================== Setting =============================== */

export function isSetting(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::config::Setting` + '<')
}

export interface SettingFields<Value extends TypeArgument> {
  data: ToField<Option<SettingData<Value>>>
}

export type SettingReified<Value extends TypeArgument> = Reified<
  Setting<Value>,
  SettingFields<Value>
>

export class Setting<Value extends TypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::config::Setting`
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [false] as const

  readonly $typeName = Setting.$typeName
  readonly $fullTypeName: `0x2::config::Setting<${ToTypeStr<Value>}>`
  readonly $typeArgs: [ToTypeStr<Value>]
  readonly $isPhantom = Setting.$isPhantom

  readonly data: ToField<Option<SettingData<Value>>>

  private constructor(typeArgs: [ToTypeStr<Value>], fields: SettingFields<Value>) {
    this.$fullTypeName = composeSuiType(
      Setting.$typeName,
      ...typeArgs
    ) as `0x2::config::Setting<${ToTypeStr<Value>}>`
    this.$typeArgs = typeArgs

    this.data = fields.data
  }

  static reified<Value extends Reified<TypeArgument, any>>(
    Value: Value
  ): SettingReified<ToTypeArgument<Value>> {
    const reifiedBcs = Setting.bcs(toBcs(Value))
    return {
      typeName: Setting.$typeName,
      fullTypeName: composeSuiType(
        Setting.$typeName,
        ...[extractType(Value)]
      ) as `0x2::config::Setting<${ToTypeStr<ToTypeArgument<Value>>}>`,
      typeArgs: [extractType(Value)] as [ToTypeStr<ToTypeArgument<Value>>],
      isPhantom: Setting.$isPhantom,
      reifiedTypeArgs: [Value],
      fromFields: (fields: Record<string, any>) => Setting.fromFields(Value, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Setting.fromFieldsWithTypes(Value, item),
      fromBcs: (data: Uint8Array) => Setting.fromFields(Value, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => Setting.fromJSONField(Value, field),
      fromJSON: (json: Record<string, any>) => Setting.fromJSON(Value, json),
      fromSuiParsedData: (content: SuiParsedData) => Setting.fromSuiParsedData(Value, content),
      fromSuiObjectData: (content: SuiObjectData) => Setting.fromSuiObjectData(Value, content),
      fetch: async (client: SuiClient, id: string) => Setting.fetch(client, Value, id),
      new: (fields: SettingFields<ToTypeArgument<Value>>) => {
        return new Setting([extractType(Value)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Setting.reified
  }

  static phantom<Value extends Reified<TypeArgument, any>>(
    Value: Value
  ): PhantomReified<ToTypeStr<Setting<ToTypeArgument<Value>>>> {
    return phantom(Setting.reified(Value))
  }

  static get p() {
    return Setting.phantom
  }

  private static instantiateBcs() {
    return <Value extends BcsType<any>>(Value: Value) =>
      bcs.struct(`Setting<${Value.name}>`, {
        data: Option.bcs(SettingData.bcs(Value)),
      })
  }

  private static cachedBcs: ReturnType<typeof Setting.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof Setting.instantiateBcs> {
    if (!Setting.cachedBcs) {
      Setting.cachedBcs = Setting.instantiateBcs()
    }
    return Setting.cachedBcs
  }

  static fromFields<Value extends Reified<TypeArgument, any>>(
    typeArg: Value,
    fields: Record<string, any>
  ): Setting<ToTypeArgument<Value>> {
    return Setting.reified(typeArg).new({
      data: decodeFromFields(Option.reified(SettingData.reified(typeArg)), fields.data),
    })
  }

  static fromFieldsWithTypes<Value extends Reified<TypeArgument, any>>(
    typeArg: Value,
    item: FieldsWithTypes
  ): Setting<ToTypeArgument<Value>> {
    if (!isSetting(item.type)) {
      throw new Error('not a Setting type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Setting.reified(typeArg).new({
      data: decodeFromFieldsWithTypes(
        Option.reified(SettingData.reified(typeArg)),
        item.fields.data
      ),
    })
  }

  static fromBcs<Value extends Reified<TypeArgument, any>>(
    typeArg: Value,
    data: Uint8Array
  ): Setting<ToTypeArgument<Value>> {
    const typeArgs = [typeArg]
    return Setting.fromFields(typeArg, Setting.bcs(toBcs(typeArg)).parse(data))
  }

  toJSONField() {
    return {
      data: fieldToJSON<Option<SettingData<Value>>>(
        `${Option.$typeName}<${SettingData.$typeName}<${this.$typeArgs[0]}>>`,
        this.data
      ),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<Value extends Reified<TypeArgument, any>>(
    typeArg: Value,
    field: any
  ): Setting<ToTypeArgument<Value>> {
    return Setting.reified(typeArg).new({
      data: decodeFromJSONField(Option.reified(SettingData.reified(typeArg)), field.data),
    })
  }

  static fromJSON<Value extends Reified<TypeArgument, any>>(
    typeArg: Value,
    json: Record<string, any>
  ): Setting<ToTypeArgument<Value>> {
    if (json.$typeName !== Setting.$typeName) {
      throw new Error(
        `not a Setting json object: expected '${Setting.$typeName}' but got '${json.$typeName}'`
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Setting.$typeName, ...[extractType(typeArg)]),
      json.$typeArgs,
      [typeArg]
    )

    return Setting.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<Value extends Reified<TypeArgument, any>>(
    typeArg: Value,
    content: SuiParsedData
  ): Setting<ToTypeArgument<Value>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isSetting(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Setting object`)
    }
    return Setting.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<Value extends Reified<TypeArgument, any>>(
    typeArg: Value,
    data: SuiObjectData
  ): Setting<ToTypeArgument<Value>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isSetting(data.bcs.type)) {
        throw new Error(`object at is not a Setting object`)
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

      return Setting.fromBcs(typeArg, fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Setting.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<Value extends Reified<TypeArgument, any>>(
    client: SuiClient,
    typeArg: Value,
    id: string
  ): Promise<Setting<ToTypeArgument<Value>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching Setting object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isSetting(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a Setting object`)
    }

    return Setting.fromSuiObjectData(typeArg, res.data)
  }
}

/* ============================== SettingData =============================== */

export function isSettingData(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::config::SettingData` + '<')
}

export interface SettingDataFields<Value extends TypeArgument> {
  newerValueEpoch: ToField<'u64'>
  newerValue: ToField<Option<Value>>
  olderValueOpt: ToField<Option<Value>>
}

export type SettingDataReified<Value extends TypeArgument> = Reified<
  SettingData<Value>,
  SettingDataFields<Value>
>

export class SettingData<Value extends TypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::config::SettingData`
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [false] as const

  readonly $typeName = SettingData.$typeName
  readonly $fullTypeName: `0x2::config::SettingData<${ToTypeStr<Value>}>`
  readonly $typeArgs: [ToTypeStr<Value>]
  readonly $isPhantom = SettingData.$isPhantom

  readonly newerValueEpoch: ToField<'u64'>
  readonly newerValue: ToField<Option<Value>>
  readonly olderValueOpt: ToField<Option<Value>>

  private constructor(typeArgs: [ToTypeStr<Value>], fields: SettingDataFields<Value>) {
    this.$fullTypeName = composeSuiType(
      SettingData.$typeName,
      ...typeArgs
    ) as `0x2::config::SettingData<${ToTypeStr<Value>}>`
    this.$typeArgs = typeArgs

    this.newerValueEpoch = fields.newerValueEpoch
    this.newerValue = fields.newerValue
    this.olderValueOpt = fields.olderValueOpt
  }

  static reified<Value extends Reified<TypeArgument, any>>(
    Value: Value
  ): SettingDataReified<ToTypeArgument<Value>> {
    const reifiedBcs = SettingData.bcs(toBcs(Value))
    return {
      typeName: SettingData.$typeName,
      fullTypeName: composeSuiType(
        SettingData.$typeName,
        ...[extractType(Value)]
      ) as `0x2::config::SettingData<${ToTypeStr<ToTypeArgument<Value>>}>`,
      typeArgs: [extractType(Value)] as [ToTypeStr<ToTypeArgument<Value>>],
      isPhantom: SettingData.$isPhantom,
      reifiedTypeArgs: [Value],
      fromFields: (fields: Record<string, any>) => SettingData.fromFields(Value, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => SettingData.fromFieldsWithTypes(Value, item),
      fromBcs: (data: Uint8Array) => SettingData.fromFields(Value, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => SettingData.fromJSONField(Value, field),
      fromJSON: (json: Record<string, any>) => SettingData.fromJSON(Value, json),
      fromSuiParsedData: (content: SuiParsedData) => SettingData.fromSuiParsedData(Value, content),
      fromSuiObjectData: (content: SuiObjectData) => SettingData.fromSuiObjectData(Value, content),
      fetch: async (client: SuiClient, id: string) => SettingData.fetch(client, Value, id),
      new: (fields: SettingDataFields<ToTypeArgument<Value>>) => {
        return new SettingData([extractType(Value)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return SettingData.reified
  }

  static phantom<Value extends Reified<TypeArgument, any>>(
    Value: Value
  ): PhantomReified<ToTypeStr<SettingData<ToTypeArgument<Value>>>> {
    return phantom(SettingData.reified(Value))
  }

  static get p() {
    return SettingData.phantom
  }

  private static instantiateBcs() {
    return <Value extends BcsType<any>>(Value: Value) =>
      bcs.struct(`SettingData<${Value.name}>`, {
        newer_value_epoch: bcs.u64(),
        newer_value: Option.bcs(Value),
        older_value_opt: Option.bcs(Value),
      })
  }

  private static cachedBcs: ReturnType<typeof SettingData.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof SettingData.instantiateBcs> {
    if (!SettingData.cachedBcs) {
      SettingData.cachedBcs = SettingData.instantiateBcs()
    }
    return SettingData.cachedBcs
  }

  static fromFields<Value extends Reified<TypeArgument, any>>(
    typeArg: Value,
    fields: Record<string, any>
  ): SettingData<ToTypeArgument<Value>> {
    return SettingData.reified(typeArg).new({
      newerValueEpoch: decodeFromFields('u64', fields.newer_value_epoch),
      newerValue: decodeFromFields(Option.reified(typeArg), fields.newer_value),
      olderValueOpt: decodeFromFields(Option.reified(typeArg), fields.older_value_opt),
    })
  }

  static fromFieldsWithTypes<Value extends Reified<TypeArgument, any>>(
    typeArg: Value,
    item: FieldsWithTypes
  ): SettingData<ToTypeArgument<Value>> {
    if (!isSettingData(item.type)) {
      throw new Error('not a SettingData type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return SettingData.reified(typeArg).new({
      newerValueEpoch: decodeFromFieldsWithTypes('u64', item.fields.newer_value_epoch),
      newerValue: decodeFromFieldsWithTypes(Option.reified(typeArg), item.fields.newer_value),
      olderValueOpt: decodeFromFieldsWithTypes(
        Option.reified(typeArg),
        item.fields.older_value_opt
      ),
    })
  }

  static fromBcs<Value extends Reified<TypeArgument, any>>(
    typeArg: Value,
    data: Uint8Array
  ): SettingData<ToTypeArgument<Value>> {
    const typeArgs = [typeArg]
    return SettingData.fromFields(typeArg, SettingData.bcs(toBcs(typeArg)).parse(data))
  }

  toJSONField() {
    return {
      newerValueEpoch: this.newerValueEpoch.toString(),
      newerValue: fieldToJSON<Option<Value>>(
        `${Option.$typeName}<${this.$typeArgs[0]}>`,
        this.newerValue
      ),
      olderValueOpt: fieldToJSON<Option<Value>>(
        `${Option.$typeName}<${this.$typeArgs[0]}>`,
        this.olderValueOpt
      ),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<Value extends Reified<TypeArgument, any>>(
    typeArg: Value,
    field: any
  ): SettingData<ToTypeArgument<Value>> {
    return SettingData.reified(typeArg).new({
      newerValueEpoch: decodeFromJSONField('u64', field.newerValueEpoch),
      newerValue: decodeFromJSONField(Option.reified(typeArg), field.newerValue),
      olderValueOpt: decodeFromJSONField(Option.reified(typeArg), field.olderValueOpt),
    })
  }

  static fromJSON<Value extends Reified<TypeArgument, any>>(
    typeArg: Value,
    json: Record<string, any>
  ): SettingData<ToTypeArgument<Value>> {
    if (json.$typeName !== SettingData.$typeName) {
      throw new Error(
        `not a SettingData json object: expected '${SettingData.$typeName}' but got '${json.$typeName}'`
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(SettingData.$typeName, ...[extractType(typeArg)]),
      json.$typeArgs,
      [typeArg]
    )

    return SettingData.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<Value extends Reified<TypeArgument, any>>(
    typeArg: Value,
    content: SuiParsedData
  ): SettingData<ToTypeArgument<Value>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isSettingData(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a SettingData object`)
    }
    return SettingData.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<Value extends Reified<TypeArgument, any>>(
    typeArg: Value,
    data: SuiObjectData
  ): SettingData<ToTypeArgument<Value>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isSettingData(data.bcs.type)) {
        throw new Error(`object at is not a SettingData object`)
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

      return SettingData.fromBcs(typeArg, fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return SettingData.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<Value extends Reified<TypeArgument, any>>(
    client: SuiClient,
    typeArg: Value,
    id: string
  ): Promise<SettingData<ToTypeArgument<Value>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching SettingData object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isSettingData(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a SettingData object`)
    }

    return SettingData.fromSuiObjectData(typeArg, res.data)
  }
}
