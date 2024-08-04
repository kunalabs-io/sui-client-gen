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
import { Option } from '../../move-stdlib-chain/option/structs'
import { PKG_V21 } from '../index'
import { UID } from '../object/structs'
import { BcsType, bcs } from '@mysten/sui/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui/client'
import { fromB64 } from '@mysten/sui/utils'

/* ============================== Config =============================== */

export function isConfig(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`${PKG_V21}::config::Config` + '<')
}

export interface ConfigFields<T0 extends PhantomTypeArgument> {
  id: ToField<UID>
}

export type ConfigReified<T0 extends PhantomTypeArgument> = Reified<Config<T0>, ConfigFields<T0>>

export class Config<T0 extends PhantomTypeArgument> implements StructClass {
  static readonly $typeName = `${PKG_V21}::config::Config`
  static readonly $numTypeParams = 1

  readonly $typeName = Config.$typeName

  readonly $fullTypeName: `${typeof PKG_V21}::config::Config<${PhantomToTypeStr<T0>}>`

  readonly $typeArgs: [PhantomToTypeStr<T0>]

  readonly id: ToField<UID>

  private constructor(typeArgs: [PhantomToTypeStr<T0>], fields: ConfigFields<T0>) {
    this.$fullTypeName = composeSuiType(
      Config.$typeName,
      ...typeArgs
    ) as `${typeof PKG_V21}::config::Config<${PhantomToTypeStr<T0>}>`
    this.$typeArgs = typeArgs

    this.id = fields.id
  }

  static reified<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): ConfigReified<ToPhantomTypeArgument<T0>> {
    return {
      typeName: Config.$typeName,
      fullTypeName: composeSuiType(
        Config.$typeName,
        ...[extractType(T0)]
      ) as `${typeof PKG_V21}::config::Config<${PhantomToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [extractType(T0)] as [PhantomToTypeStr<ToPhantomTypeArgument<T0>>],
      reifiedTypeArgs: [T0],
      fromFields: (fields: Record<string, any>) => Config.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Config.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => Config.fromBcs(T0, data),
      bcs: Config.bcs,
      fromJSONField: (field: any) => Config.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => Config.fromJSON(T0, json),
      fromSuiParsedData: (content: SuiParsedData) => Config.fromSuiParsedData(T0, content),
      fetch: async (client: SuiClient, id: string) => Config.fetch(client, T0, id),
      new: (fields: ConfigFields<ToPhantomTypeArgument<T0>>) => {
        return new Config([extractType(T0)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Config.reified
  }

  static phantom<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): PhantomReified<ToTypeStr<Config<ToPhantomTypeArgument<T0>>>> {
    return phantom(Config.reified(T0))
  }
  static get p() {
    return Config.phantom
  }

  static get bcs() {
    return bcs.struct('Config', {
      id: UID.bcs,
    })
  }

  static fromFields<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    fields: Record<string, any>
  ): Config<ToPhantomTypeArgument<T0>> {
    return Config.reified(typeArg).new({ id: decodeFromFields(UID.reified(), fields.id) })
  }

  static fromFieldsWithTypes<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    item: FieldsWithTypes
  ): Config<ToPhantomTypeArgument<T0>> {
    if (!isConfig(item.type)) {
      throw new Error('not a Config type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Config.reified(typeArg).new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
    })
  }

  static fromBcs<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: Uint8Array
  ): Config<ToPhantomTypeArgument<T0>> {
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

  static fromJSONField<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    field: any
  ): Config<ToPhantomTypeArgument<T0>> {
    return Config.reified(typeArg).new({ id: decodeFromJSONField(UID.reified(), field.id) })
  }

  static fromJSON<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    json: Record<string, any>
  ): Config<ToPhantomTypeArgument<T0>> {
    if (json.$typeName !== Config.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Config.$typeName, extractType(typeArg)),
      json.$typeArgs,
      [typeArg]
    )

    return Config.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    content: SuiParsedData
  ): Config<ToPhantomTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isConfig(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Config object`)
    }
    return Config.fromFieldsWithTypes(typeArg, content)
  }

  static async fetch<T0 extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<Config<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching Config object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isConfig(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a Config object`)
    }

    const gotTypeArgs = parseTypeName(res.data.bcs.type).typeArgs
    if (gotTypeArgs.length !== 1) {
      throw new Error(
        `type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`
      )
    }
    const gotTypeArg = compressSuiType(gotTypeArgs[0])
    const expectedTypeArg = compressSuiType(extractType(typeArg))
    if (gotTypeArg !== compressSuiType(extractType(typeArg))) {
      throw new Error(
        `type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`
      )
    }

    return Config.fromBcs(typeArg, fromB64(res.data.bcs.bcsBytes))
  }
}

/* ============================== Setting =============================== */

export function isSetting(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`${PKG_V21}::config::Setting` + '<')
}

export interface SettingFields<T0 extends TypeArgument> {
  data: ToField<Option<SettingData<T0>>>
}

export type SettingReified<T0 extends TypeArgument> = Reified<Setting<T0>, SettingFields<T0>>

export class Setting<T0 extends TypeArgument> implements StructClass {
  static readonly $typeName = `${PKG_V21}::config::Setting`
  static readonly $numTypeParams = 1

  readonly $typeName = Setting.$typeName

  readonly $fullTypeName: `${typeof PKG_V21}::config::Setting<${ToTypeStr<T0>}>`

  readonly $typeArgs: [ToTypeStr<T0>]

  readonly data: ToField<Option<SettingData<T0>>>

  private constructor(typeArgs: [ToTypeStr<T0>], fields: SettingFields<T0>) {
    this.$fullTypeName = composeSuiType(
      Setting.$typeName,
      ...typeArgs
    ) as `${typeof PKG_V21}::config::Setting<${ToTypeStr<T0>}>`
    this.$typeArgs = typeArgs

    this.data = fields.data
  }

  static reified<T0 extends Reified<TypeArgument, any>>(
    T0: T0
  ): SettingReified<ToTypeArgument<T0>> {
    return {
      typeName: Setting.$typeName,
      fullTypeName: composeSuiType(
        Setting.$typeName,
        ...[extractType(T0)]
      ) as `${typeof PKG_V21}::config::Setting<${ToTypeStr<ToTypeArgument<T0>>}>`,
      typeArgs: [extractType(T0)] as [ToTypeStr<ToTypeArgument<T0>>],
      reifiedTypeArgs: [T0],
      fromFields: (fields: Record<string, any>) => Setting.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Setting.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => Setting.fromBcs(T0, data),
      bcs: Setting.bcs(toBcs(T0)),
      fromJSONField: (field: any) => Setting.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => Setting.fromJSON(T0, json),
      fromSuiParsedData: (content: SuiParsedData) => Setting.fromSuiParsedData(T0, content),
      fetch: async (client: SuiClient, id: string) => Setting.fetch(client, T0, id),
      new: (fields: SettingFields<ToTypeArgument<T0>>) => {
        return new Setting([extractType(T0)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Setting.reified
  }

  static phantom<T0 extends Reified<TypeArgument, any>>(
    T0: T0
  ): PhantomReified<ToTypeStr<Setting<ToTypeArgument<T0>>>> {
    return phantom(Setting.reified(T0))
  }
  static get p() {
    return Setting.phantom
  }

  static get bcs() {
    return <T0 extends BcsType<any>>(T0: T0) =>
      bcs.struct(`Setting<${T0.name}>`, {
        data: Option.bcs(SettingData.bcs(T0)),
      })
  }

  static fromFields<T0 extends Reified<TypeArgument, any>>(
    typeArg: T0,
    fields: Record<string, any>
  ): Setting<ToTypeArgument<T0>> {
    return Setting.reified(typeArg).new({
      data: decodeFromFields(Option.reified(SettingData.reified(typeArg)), fields.data),
    })
  }

  static fromFieldsWithTypes<T0 extends Reified<TypeArgument, any>>(
    typeArg: T0,
    item: FieldsWithTypes
  ): Setting<ToTypeArgument<T0>> {
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

  static fromBcs<T0 extends Reified<TypeArgument, any>>(
    typeArg: T0,
    data: Uint8Array
  ): Setting<ToTypeArgument<T0>> {
    const typeArgs = [typeArg]

    return Setting.fromFields(typeArg, Setting.bcs(toBcs(typeArgs[0])).parse(data))
  }

  toJSONField() {
    return {
      data: fieldToJSON<Option<SettingData<T0>>>(
        `${Option.$typeName}<${SettingData.$typeName}<${this.$typeArgs[0]}>>`,
        this.data
      ),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends Reified<TypeArgument, any>>(
    typeArg: T0,
    field: any
  ): Setting<ToTypeArgument<T0>> {
    return Setting.reified(typeArg).new({
      data: decodeFromJSONField(Option.reified(SettingData.reified(typeArg)), field.data),
    })
  }

  static fromJSON<T0 extends Reified<TypeArgument, any>>(
    typeArg: T0,
    json: Record<string, any>
  ): Setting<ToTypeArgument<T0>> {
    if (json.$typeName !== Setting.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Setting.$typeName, extractType(typeArg)),
      json.$typeArgs,
      [typeArg]
    )

    return Setting.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends Reified<TypeArgument, any>>(
    typeArg: T0,
    content: SuiParsedData
  ): Setting<ToTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isSetting(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Setting object`)
    }
    return Setting.fromFieldsWithTypes(typeArg, content)
  }

  static async fetch<T0 extends Reified<TypeArgument, any>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<Setting<ToTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching Setting object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isSetting(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a Setting object`)
    }

    const gotTypeArgs = parseTypeName(res.data.bcs.type).typeArgs
    if (gotTypeArgs.length !== 1) {
      throw new Error(
        `type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`
      )
    }
    const gotTypeArg = compressSuiType(gotTypeArgs[0])
    const expectedTypeArg = compressSuiType(extractType(typeArg))
    if (gotTypeArg !== compressSuiType(extractType(typeArg))) {
      throw new Error(
        `type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`
      )
    }

    return Setting.fromBcs(typeArg, fromB64(res.data.bcs.bcsBytes))
  }
}

/* ============================== SettingData =============================== */

export function isSettingData(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`${PKG_V21}::config::SettingData` + '<')
}

export interface SettingDataFields<T0 extends TypeArgument> {
  newerValueEpoch: ToField<'u64'>
  newerValue: ToField<Option<T0>>
  olderValueOpt: ToField<Option<T0>>
}

export type SettingDataReified<T0 extends TypeArgument> = Reified<
  SettingData<T0>,
  SettingDataFields<T0>
>

export class SettingData<T0 extends TypeArgument> implements StructClass {
  static readonly $typeName = `${PKG_V21}::config::SettingData`
  static readonly $numTypeParams = 1

  readonly $typeName = SettingData.$typeName

  readonly $fullTypeName: `${typeof PKG_V21}::config::SettingData<${ToTypeStr<T0>}>`

  readonly $typeArgs: [ToTypeStr<T0>]

  readonly newerValueEpoch: ToField<'u64'>
  readonly newerValue: ToField<Option<T0>>
  readonly olderValueOpt: ToField<Option<T0>>

  private constructor(typeArgs: [ToTypeStr<T0>], fields: SettingDataFields<T0>) {
    this.$fullTypeName = composeSuiType(
      SettingData.$typeName,
      ...typeArgs
    ) as `${typeof PKG_V21}::config::SettingData<${ToTypeStr<T0>}>`
    this.$typeArgs = typeArgs

    this.newerValueEpoch = fields.newerValueEpoch
    this.newerValue = fields.newerValue
    this.olderValueOpt = fields.olderValueOpt
  }

  static reified<T0 extends Reified<TypeArgument, any>>(
    T0: T0
  ): SettingDataReified<ToTypeArgument<T0>> {
    return {
      typeName: SettingData.$typeName,
      fullTypeName: composeSuiType(
        SettingData.$typeName,
        ...[extractType(T0)]
      ) as `${typeof PKG_V21}::config::SettingData<${ToTypeStr<ToTypeArgument<T0>>}>`,
      typeArgs: [extractType(T0)] as [ToTypeStr<ToTypeArgument<T0>>],
      reifiedTypeArgs: [T0],
      fromFields: (fields: Record<string, any>) => SettingData.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => SettingData.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => SettingData.fromBcs(T0, data),
      bcs: SettingData.bcs(toBcs(T0)),
      fromJSONField: (field: any) => SettingData.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => SettingData.fromJSON(T0, json),
      fromSuiParsedData: (content: SuiParsedData) => SettingData.fromSuiParsedData(T0, content),
      fetch: async (client: SuiClient, id: string) => SettingData.fetch(client, T0, id),
      new: (fields: SettingDataFields<ToTypeArgument<T0>>) => {
        return new SettingData([extractType(T0)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return SettingData.reified
  }

  static phantom<T0 extends Reified<TypeArgument, any>>(
    T0: T0
  ): PhantomReified<ToTypeStr<SettingData<ToTypeArgument<T0>>>> {
    return phantom(SettingData.reified(T0))
  }
  static get p() {
    return SettingData.phantom
  }

  static get bcs() {
    return <T0 extends BcsType<any>>(T0: T0) =>
      bcs.struct(`SettingData<${T0.name}>`, {
        newer_value_epoch: bcs.u64(),
        newer_value: Option.bcs(T0),
        older_value_opt: Option.bcs(T0),
      })
  }

  static fromFields<T0 extends Reified<TypeArgument, any>>(
    typeArg: T0,
    fields: Record<string, any>
  ): SettingData<ToTypeArgument<T0>> {
    return SettingData.reified(typeArg).new({
      newerValueEpoch: decodeFromFields('u64', fields.newer_value_epoch),
      newerValue: decodeFromFields(Option.reified(typeArg), fields.newer_value),
      olderValueOpt: decodeFromFields(Option.reified(typeArg), fields.older_value_opt),
    })
  }

  static fromFieldsWithTypes<T0 extends Reified<TypeArgument, any>>(
    typeArg: T0,
    item: FieldsWithTypes
  ): SettingData<ToTypeArgument<T0>> {
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

  static fromBcs<T0 extends Reified<TypeArgument, any>>(
    typeArg: T0,
    data: Uint8Array
  ): SettingData<ToTypeArgument<T0>> {
    const typeArgs = [typeArg]

    return SettingData.fromFields(typeArg, SettingData.bcs(toBcs(typeArgs[0])).parse(data))
  }

  toJSONField() {
    return {
      newerValueEpoch: this.newerValueEpoch.toString(),
      newerValue: fieldToJSON<Option<T0>>(
        `${Option.$typeName}<${this.$typeArgs[0]}>`,
        this.newerValue
      ),
      olderValueOpt: fieldToJSON<Option<T0>>(
        `${Option.$typeName}<${this.$typeArgs[0]}>`,
        this.olderValueOpt
      ),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends Reified<TypeArgument, any>>(
    typeArg: T0,
    field: any
  ): SettingData<ToTypeArgument<T0>> {
    return SettingData.reified(typeArg).new({
      newerValueEpoch: decodeFromJSONField('u64', field.newerValueEpoch),
      newerValue: decodeFromJSONField(Option.reified(typeArg), field.newerValue),
      olderValueOpt: decodeFromJSONField(Option.reified(typeArg), field.olderValueOpt),
    })
  }

  static fromJSON<T0 extends Reified<TypeArgument, any>>(
    typeArg: T0,
    json: Record<string, any>
  ): SettingData<ToTypeArgument<T0>> {
    if (json.$typeName !== SettingData.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(SettingData.$typeName, extractType(typeArg)),
      json.$typeArgs,
      [typeArg]
    )

    return SettingData.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends Reified<TypeArgument, any>>(
    typeArg: T0,
    content: SuiParsedData
  ): SettingData<ToTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isSettingData(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a SettingData object`)
    }
    return SettingData.fromFieldsWithTypes(typeArg, content)
  }

  static async fetch<T0 extends Reified<TypeArgument, any>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<SettingData<ToTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching SettingData object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isSettingData(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a SettingData object`)
    }

    const gotTypeArgs = parseTypeName(res.data.bcs.type).typeArgs
    if (gotTypeArgs.length !== 1) {
      throw new Error(
        `type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`
      )
    }
    const gotTypeArg = compressSuiType(gotTypeArgs[0])
    const expectedTypeArg = compressSuiType(extractType(typeArg))
    if (gotTypeArg !== compressSuiType(extractType(typeArg))) {
      throw new Error(
        `type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`
      )
    }

    return SettingData.fromBcs(typeArg, fromB64(res.data.bcs.bcsBytes))
  }
}
