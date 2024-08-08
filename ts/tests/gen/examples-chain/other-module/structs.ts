import {
  PhantomReified,
  Reified,
  StructClass,
  ToField,
  ToTypeStr,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  phantom,
} from '../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../_framework/util'
import { PKG_V1, PKG_V2 } from '../index'
import { bcs } from '@mysten/sui/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui/client'
import { fromB64 } from '@mysten/sui/utils'

/* ============================== StructFromOtherModule =============================== */

export function isStructFromOtherModule(type: string): boolean {
  type = compressSuiType(type)
  return type === `${PKG_V1}::other_module::StructFromOtherModule`
}

export interface StructFromOtherModuleFields {
  dummyField: ToField<'bool'>
}

export type StructFromOtherModuleReified = Reified<
  StructFromOtherModule,
  StructFromOtherModuleFields
>

export class StructFromOtherModule implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `${PKG_V1}::other_module::StructFromOtherModule`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = StructFromOtherModule.$typeName
  readonly $fullTypeName: `${typeof PKG_V1}::other_module::StructFromOtherModule`
  readonly $typeArgs: []
  readonly $isPhantom = StructFromOtherModule.$isPhantom

  readonly dummyField: ToField<'bool'>

  private constructor(typeArgs: [], fields: StructFromOtherModuleFields) {
    this.$fullTypeName = composeSuiType(
      StructFromOtherModule.$typeName,
      ...typeArgs
    ) as `${typeof PKG_V1}::other_module::StructFromOtherModule`
    this.$typeArgs = typeArgs

    this.dummyField = fields.dummyField
  }

  static reified(): StructFromOtherModuleReified {
    return {
      typeName: StructFromOtherModule.$typeName,
      fullTypeName: composeSuiType(
        StructFromOtherModule.$typeName,
        ...[]
      ) as `${typeof PKG_V1}::other_module::StructFromOtherModule`,
      typeArgs: [] as [],
      isPhantom: StructFromOtherModule.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => StructFromOtherModule.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        StructFromOtherModule.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => StructFromOtherModule.fromBcs(data),
      bcs: StructFromOtherModule.bcs,
      fromJSONField: (field: any) => StructFromOtherModule.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => StructFromOtherModule.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) =>
        StructFromOtherModule.fromSuiParsedData(content),
      fetch: async (client: SuiClient, id: string) => StructFromOtherModule.fetch(client, id),
      new: (fields: StructFromOtherModuleFields) => {
        return new StructFromOtherModule([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return StructFromOtherModule.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<StructFromOtherModule>> {
    return phantom(StructFromOtherModule.reified())
  }
  static get p() {
    return StructFromOtherModule.phantom()
  }

  static get bcs() {
    return bcs.struct('StructFromOtherModule', {
      dummy_field: bcs.bool(),
    })
  }

  static fromFields(fields: Record<string, any>): StructFromOtherModule {
    return StructFromOtherModule.reified().new({
      dummyField: decodeFromFields('bool', fields.dummy_field),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): StructFromOtherModule {
    if (!isStructFromOtherModule(item.type)) {
      throw new Error('not a StructFromOtherModule type')
    }

    return StructFromOtherModule.reified().new({
      dummyField: decodeFromFieldsWithTypes('bool', item.fields.dummy_field),
    })
  }

  static fromBcs(data: Uint8Array): StructFromOtherModule {
    return StructFromOtherModule.fromFields(StructFromOtherModule.bcs.parse(data))
  }

  toJSONField() {
    return {
      dummyField: this.dummyField,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): StructFromOtherModule {
    return StructFromOtherModule.reified().new({
      dummyField: decodeFromJSONField('bool', field.dummyField),
    })
  }

  static fromJSON(json: Record<string, any>): StructFromOtherModule {
    if (json.$typeName !== StructFromOtherModule.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return StructFromOtherModule.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): StructFromOtherModule {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isStructFromOtherModule(content.type)) {
      throw new Error(
        `object at ${(content.fields as any).id} is not a StructFromOtherModule object`
      )
    }
    return StructFromOtherModule.fromFieldsWithTypes(content)
  }

  static async fetch(client: SuiClient, id: string): Promise<StructFromOtherModule> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching StructFromOtherModule object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isStructFromOtherModule(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a StructFromOtherModule object`)
    }

    return StructFromOtherModule.fromBcs(fromB64(res.data.bcs.bcsBytes))
  }
}

/* ============================== AddedInAnUpgrade =============================== */

export function isAddedInAnUpgrade(type: string): boolean {
  type = compressSuiType(type)
  return type === `${PKG_V2}::other_module::AddedInAnUpgrade`
}

export interface AddedInAnUpgradeFields {
  dummyField: ToField<'bool'>
}

export type AddedInAnUpgradeReified = Reified<AddedInAnUpgrade, AddedInAnUpgradeFields>

export class AddedInAnUpgrade implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `${PKG_V2}::other_module::AddedInAnUpgrade`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = AddedInAnUpgrade.$typeName
  readonly $fullTypeName: `${typeof PKG_V2}::other_module::AddedInAnUpgrade`
  readonly $typeArgs: []
  readonly $isPhantom = AddedInAnUpgrade.$isPhantom

  readonly dummyField: ToField<'bool'>

  private constructor(typeArgs: [], fields: AddedInAnUpgradeFields) {
    this.$fullTypeName = composeSuiType(
      AddedInAnUpgrade.$typeName,
      ...typeArgs
    ) as `${typeof PKG_V2}::other_module::AddedInAnUpgrade`
    this.$typeArgs = typeArgs

    this.dummyField = fields.dummyField
  }

  static reified(): AddedInAnUpgradeReified {
    return {
      typeName: AddedInAnUpgrade.$typeName,
      fullTypeName: composeSuiType(
        AddedInAnUpgrade.$typeName,
        ...[]
      ) as `${typeof PKG_V2}::other_module::AddedInAnUpgrade`,
      typeArgs: [] as [],
      isPhantom: AddedInAnUpgrade.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => AddedInAnUpgrade.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => AddedInAnUpgrade.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => AddedInAnUpgrade.fromBcs(data),
      bcs: AddedInAnUpgrade.bcs,
      fromJSONField: (field: any) => AddedInAnUpgrade.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => AddedInAnUpgrade.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => AddedInAnUpgrade.fromSuiParsedData(content),
      fetch: async (client: SuiClient, id: string) => AddedInAnUpgrade.fetch(client, id),
      new: (fields: AddedInAnUpgradeFields) => {
        return new AddedInAnUpgrade([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return AddedInAnUpgrade.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<AddedInAnUpgrade>> {
    return phantom(AddedInAnUpgrade.reified())
  }
  static get p() {
    return AddedInAnUpgrade.phantom()
  }

  static get bcs() {
    return bcs.struct('AddedInAnUpgrade', {
      dummy_field: bcs.bool(),
    })
  }

  static fromFields(fields: Record<string, any>): AddedInAnUpgrade {
    return AddedInAnUpgrade.reified().new({
      dummyField: decodeFromFields('bool', fields.dummy_field),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): AddedInAnUpgrade {
    if (!isAddedInAnUpgrade(item.type)) {
      throw new Error('not a AddedInAnUpgrade type')
    }

    return AddedInAnUpgrade.reified().new({
      dummyField: decodeFromFieldsWithTypes('bool', item.fields.dummy_field),
    })
  }

  static fromBcs(data: Uint8Array): AddedInAnUpgrade {
    return AddedInAnUpgrade.fromFields(AddedInAnUpgrade.bcs.parse(data))
  }

  toJSONField() {
    return {
      dummyField: this.dummyField,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): AddedInAnUpgrade {
    return AddedInAnUpgrade.reified().new({
      dummyField: decodeFromJSONField('bool', field.dummyField),
    })
  }

  static fromJSON(json: Record<string, any>): AddedInAnUpgrade {
    if (json.$typeName !== AddedInAnUpgrade.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return AddedInAnUpgrade.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): AddedInAnUpgrade {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isAddedInAnUpgrade(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a AddedInAnUpgrade object`)
    }
    return AddedInAnUpgrade.fromFieldsWithTypes(content)
  }

  static async fetch(client: SuiClient, id: string): Promise<AddedInAnUpgrade> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching AddedInAnUpgrade object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isAddedInAnUpgrade(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a AddedInAnUpgrade object`)
    }

    return AddedInAnUpgrade.fromBcs(fromB64(res.data.bcs.bcsBytes))
  }
}
