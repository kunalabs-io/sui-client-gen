import {
  Reified,
  ToField,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
} from '../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../_framework/util'
import { bcs } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== AddedInAnUpgrade =============================== */

export function isAddedInAnUpgrade(type: string): boolean {
  type = compressSuiType(type)
  return (
    type ===
    '0x75818a1083fface3dec10fc5f7466d3adafe7bcf2485248160ea4bb17b8afabe::other_module::AddedInAnUpgrade'
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface AddedInAnUpgradeFields {
  dummyField: ToField<'bool'>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class AddedInAnUpgrade {
  static readonly $typeName =
    '0x75818a1083fface3dec10fc5f7466d3adafe7bcf2485248160ea4bb17b8afabe::other_module::AddedInAnUpgrade'
  static readonly $numTypeParams = 0

  readonly $fullTypeName =
    null as unknown as '0x75818a1083fface3dec10fc5f7466d3adafe7bcf2485248160ea4bb17b8afabe::other_module::AddedInAnUpgrade'

  readonly $typeName = AddedInAnUpgrade.$typeName

  static get bcs() {
    return bcs.struct('AddedInAnUpgrade', {
      dummy_field: bcs.bool(),
    })
  }

  readonly dummyField: ToField<'bool'>

  private constructor(dummyField: ToField<'bool'>) {
    this.dummyField = dummyField
  }

  static new(dummyField: ToField<'bool'>): AddedInAnUpgrade {
    return new AddedInAnUpgrade(dummyField)
  }

  static reified(): Reified<AddedInAnUpgrade> {
    return {
      typeName: AddedInAnUpgrade.$typeName,
      fullTypeName: composeSuiType(
        AddedInAnUpgrade.$typeName,
        ...[]
      ) as '0x75818a1083fface3dec10fc5f7466d3adafe7bcf2485248160ea4bb17b8afabe::other_module::AddedInAnUpgrade',
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => AddedInAnUpgrade.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => AddedInAnUpgrade.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => AddedInAnUpgrade.fromBcs(data),
      bcs: AddedInAnUpgrade.bcs,
      fromJSONField: (field: any) => AddedInAnUpgrade.fromJSONField(field),
      fetch: async (client: SuiClient, id: string) => AddedInAnUpgrade.fetch(client, id),
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return AddedInAnUpgrade.reified()
  }

  static fromFields(fields: Record<string, any>): AddedInAnUpgrade {
    return AddedInAnUpgrade.new(decodeFromFields('bool', fields.dummy_field))
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): AddedInAnUpgrade {
    if (!isAddedInAnUpgrade(item.type)) {
      throw new Error('not a AddedInAnUpgrade type')
    }

    return AddedInAnUpgrade.new(decodeFromFieldsWithTypes('bool', item.fields.dummy_field))
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
    return { $typeName: this.$typeName, ...this.toJSONField() }
  }

  static fromJSONField(field: any): AddedInAnUpgrade {
    return AddedInAnUpgrade.new(decodeFromJSONField('bool', field.dummyField))
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
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching AddedInAnUpgrade object at id ${id}: ${res.error.code}`)
    }
    if (
      res.data?.content?.dataType !== 'moveObject' ||
      !isAddedInAnUpgrade(res.data.content.type)
    ) {
      throw new Error(`object at id ${id} is not a AddedInAnUpgrade object`)
    }
    return AddedInAnUpgrade.fromFieldsWithTypes(res.data.content)
  }
}

/* ============================== StructFromOtherModule =============================== */

export function isStructFromOtherModule(type: string): boolean {
  type = compressSuiType(type)
  return (
    type ===
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::other_module::StructFromOtherModule'
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface StructFromOtherModuleFields {
  dummyField: ToField<'bool'>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class StructFromOtherModule {
  static readonly $typeName =
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::other_module::StructFromOtherModule'
  static readonly $numTypeParams = 0

  readonly $fullTypeName =
    null as unknown as '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::other_module::StructFromOtherModule'

  readonly $typeName = StructFromOtherModule.$typeName

  static get bcs() {
    return bcs.struct('StructFromOtherModule', {
      dummy_field: bcs.bool(),
    })
  }

  readonly dummyField: ToField<'bool'>

  private constructor(dummyField: ToField<'bool'>) {
    this.dummyField = dummyField
  }

  static new(dummyField: ToField<'bool'>): StructFromOtherModule {
    return new StructFromOtherModule(dummyField)
  }

  static reified(): Reified<StructFromOtherModule> {
    return {
      typeName: StructFromOtherModule.$typeName,
      fullTypeName: composeSuiType(
        StructFromOtherModule.$typeName,
        ...[]
      ) as '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::other_module::StructFromOtherModule',
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => StructFromOtherModule.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        StructFromOtherModule.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => StructFromOtherModule.fromBcs(data),
      bcs: StructFromOtherModule.bcs,
      fromJSONField: (field: any) => StructFromOtherModule.fromJSONField(field),
      fetch: async (client: SuiClient, id: string) => StructFromOtherModule.fetch(client, id),
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return StructFromOtherModule.reified()
  }

  static fromFields(fields: Record<string, any>): StructFromOtherModule {
    return StructFromOtherModule.new(decodeFromFields('bool', fields.dummy_field))
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): StructFromOtherModule {
    if (!isStructFromOtherModule(item.type)) {
      throw new Error('not a StructFromOtherModule type')
    }

    return StructFromOtherModule.new(decodeFromFieldsWithTypes('bool', item.fields.dummy_field))
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
    return { $typeName: this.$typeName, ...this.toJSONField() }
  }

  static fromJSONField(field: any): StructFromOtherModule {
    return StructFromOtherModule.new(decodeFromJSONField('bool', field.dummyField))
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
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching StructFromOtherModule object at id ${id}: ${res.error.code}`)
    }
    if (
      res.data?.content?.dataType !== 'moveObject' ||
      !isStructFromOtherModule(res.data.content.type)
    ) {
      throw new Error(`object at id ${id} is not a StructFromOtherModule object`)
    }
    return StructFromOtherModule.fromFieldsWithTypes(res.data.content)
  }
}
