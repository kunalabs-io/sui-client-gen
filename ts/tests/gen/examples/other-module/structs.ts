import {
  ToField,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
} from '../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../_framework/util'
import { bcs } from '@mysten/bcs'

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

  __reifiedFullTypeString =
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

  static reified() {
    return {
      typeName: AddedInAnUpgrade.$typeName,
      typeArgs: [],
      fullTypeName: composeSuiType(
        AddedInAnUpgrade.$typeName,
        ...[]
      ) as '0x75818a1083fface3dec10fc5f7466d3adafe7bcf2485248160ea4bb17b8afabe::other_module::AddedInAnUpgrade',
      fromFields: (fields: Record<string, any>) => AddedInAnUpgrade.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => AddedInAnUpgrade.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => AddedInAnUpgrade.fromBcs(data),
      bcs: AddedInAnUpgrade.bcs,
      fromJSONField: (field: any) => AddedInAnUpgrade.fromJSONField(field),
      __class: null as unknown as ReturnType<typeof AddedInAnUpgrade.new>,
    }
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

  __reifiedFullTypeString =
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

  static reified() {
    return {
      typeName: StructFromOtherModule.$typeName,
      typeArgs: [],
      fullTypeName: composeSuiType(
        StructFromOtherModule.$typeName,
        ...[]
      ) as '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::other_module::StructFromOtherModule',
      fromFields: (fields: Record<string, any>) => StructFromOtherModule.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        StructFromOtherModule.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => StructFromOtherModule.fromBcs(data),
      bcs: StructFromOtherModule.bcs,
      fromJSONField: (field: any) => StructFromOtherModule.fromJSONField(field),
      __class: null as unknown as ReturnType<typeof StructFromOtherModule.new>,
    }
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
}
