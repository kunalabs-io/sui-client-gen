import * as reified from '../../_framework/reified'
import {
  ToField,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  fieldToJSON,
} from '../../_framework/reified'
import { FieldsWithTypes, compressSuiType } from '../../_framework/util'
import { String } from '../../move-stdlib-chain/ascii/structs'
import { Option } from '../../move-stdlib-chain/option/structs'
import { String as String1 } from '../../move-stdlib-chain/string/structs'
import { ID, UID } from '../../sui-chain/object/structs'
import { bcs, fromHEX, toHEX } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== ExampleStruct =============================== */

export function isExampleStruct(type: string): boolean {
  type = compressSuiType(type)
  return (
    type ===
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::examples::ExampleStruct'
  )
}

export interface ExampleStructFields {
  dummyField: ToField<'bool'>
}

export class ExampleStruct {
  static readonly $typeName =
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::examples::ExampleStruct'
  static readonly $numTypeParams = 0

  readonly $typeName = ExampleStruct.$typeName

  static get bcs() {
    return bcs.struct('ExampleStruct', {
      dummy_field: bcs.bool(),
    })
  }

  readonly dummyField: ToField<'bool'>

  private constructor(dummyField: ToField<'bool'>) {
    this.dummyField = dummyField
  }

  static new(dummyField: ToField<'bool'>): ExampleStruct {
    return new ExampleStruct(dummyField)
  }

  static reified() {
    return {
      typeName: ExampleStruct.$typeName,
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => ExampleStruct.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => ExampleStruct.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => ExampleStruct.fromBcs(data),
      bcs: ExampleStruct.bcs,
      __class: null as unknown as ReturnType<typeof ExampleStruct.new>,
    }
  }

  static fromFields(fields: Record<string, any>): ExampleStruct {
    return ExampleStruct.new(decodeFromFields('bool', fields.dummy_field))
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): ExampleStruct {
    if (!isExampleStruct(item.type)) {
      throw new Error('not a ExampleStruct type')
    }

    return ExampleStruct.new(decodeFromFieldsWithTypes('bool', item.fields.dummy_field))
  }

  static fromBcs(data: Uint8Array): ExampleStruct {
    return ExampleStruct.fromFields(ExampleStruct.bcs.parse(data))
  }

  toJSONField() {
    return {
      dummyField: this.dummyField,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, ...this.toJSONField() }
  }
}

/* ============================== SpecialTypesStruct =============================== */

export function isSpecialTypesStruct(type: string): boolean {
  type = compressSuiType(type)
  return (
    type ===
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::examples::SpecialTypesStruct'
  )
}

export interface SpecialTypesStructFields {
  id: ToField<UID>
  asciiString: ToField<String>
  utf8String: ToField<String1>
  vectorOfU64: Array<ToField<'u64'>>
  vectorOfObjects: Array<ToField<ExampleStruct>>
  idField: ToField<ID>
  address: ToField<'address'>
  optionSome: ToField<Option<'u64'>>
  optionNone: ToField<Option<'u64'>>
}

export class SpecialTypesStruct {
  static readonly $typeName =
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::examples::SpecialTypesStruct'
  static readonly $numTypeParams = 0

  readonly $typeName = SpecialTypesStruct.$typeName

  static get bcs() {
    return bcs.struct('SpecialTypesStruct', {
      id: UID.bcs,
      ascii_string: String.bcs,
      utf8_string: String1.bcs,
      vector_of_u64: bcs.vector(bcs.u64()),
      vector_of_objects: bcs.vector(ExampleStruct.bcs),
      id_field: ID.bcs,
      address: bcs.bytes(32).transform({
        input: (val: string) => fromHEX(val),
        output: (val: Uint8Array) => toHEX(val),
      }),
      option_some: Option.bcs(bcs.u64()),
      option_none: Option.bcs(bcs.u64()),
    })
  }

  readonly id: ToField<UID>
  readonly asciiString: ToField<String>
  readonly utf8String: ToField<String1>
  readonly vectorOfU64: Array<ToField<'u64'>>
  readonly vectorOfObjects: Array<ToField<ExampleStruct>>
  readonly idField: ToField<ID>
  readonly address: ToField<'address'>
  readonly optionSome: ToField<Option<'u64'>>
  readonly optionNone: ToField<Option<'u64'>>

  private constructor(fields: SpecialTypesStructFields) {
    this.id = fields.id
    this.asciiString = fields.asciiString
    this.utf8String = fields.utf8String
    this.vectorOfU64 = fields.vectorOfU64
    this.vectorOfObjects = fields.vectorOfObjects
    this.idField = fields.idField
    this.address = fields.address
    this.optionSome = fields.optionSome
    this.optionNone = fields.optionNone
  }

  static new(fields: SpecialTypesStructFields): SpecialTypesStruct {
    return new SpecialTypesStruct(fields)
  }

  static reified() {
    return {
      typeName: SpecialTypesStruct.$typeName,
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => SpecialTypesStruct.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => SpecialTypesStruct.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => SpecialTypesStruct.fromBcs(data),
      bcs: SpecialTypesStruct.bcs,
      __class: null as unknown as ReturnType<typeof SpecialTypesStruct.new>,
    }
  }

  static fromFields(fields: Record<string, any>): SpecialTypesStruct {
    return SpecialTypesStruct.new({
      id: decodeFromFields(UID.reified(), fields.id),
      asciiString: decodeFromFields(String.reified(), fields.ascii_string),
      utf8String: decodeFromFields(String1.reified(), fields.utf8_string),
      vectorOfU64: decodeFromFields(reified.vector('u64'), fields.vector_of_u64),
      vectorOfObjects: decodeFromFields(
        reified.vector(ExampleStruct.reified()),
        fields.vector_of_objects
      ),
      idField: decodeFromFields(ID.reified(), fields.id_field),
      address: decodeFromFields('address', fields.address),
      optionSome: decodeFromFields(Option.reified('u64'), fields.option_some),
      optionNone: decodeFromFields(Option.reified('u64'), fields.option_none),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): SpecialTypesStruct {
    if (!isSpecialTypesStruct(item.type)) {
      throw new Error('not a SpecialTypesStruct type')
    }

    return SpecialTypesStruct.new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      asciiString: decodeFromFieldsWithTypes(String.reified(), item.fields.ascii_string),
      utf8String: decodeFromFieldsWithTypes(String1.reified(), item.fields.utf8_string),
      vectorOfU64: decodeFromFieldsWithTypes(reified.vector('u64'), item.fields.vector_of_u64),
      vectorOfObjects: decodeFromFieldsWithTypes(
        reified.vector(ExampleStruct.reified()),
        item.fields.vector_of_objects
      ),
      idField: decodeFromFieldsWithTypes(ID.reified(), item.fields.id_field),
      address: decodeFromFieldsWithTypes('address', item.fields.address),
      optionSome: decodeFromFieldsWithTypes(Option.reified('u64'), item.fields.option_some),
      optionNone: decodeFromFieldsWithTypes(Option.reified('u64'), item.fields.option_none),
    })
  }

  static fromBcs(data: Uint8Array): SpecialTypesStruct {
    return SpecialTypesStruct.fromFields(SpecialTypesStruct.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
      asciiString: this.asciiString,
      utf8String: this.utf8String,
      vectorOfU64: fieldToJSON(`vector<u64>`, this.vectorOfU64),
      vectorOfObjects: fieldToJSON(
        `vector<0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::examples::ExampleStruct>`,
        this.vectorOfObjects
      ),
      idField: this.idField,
      address: this.address,
      optionSome: fieldToJSON(`0x1::option::Option<u64>`, this.optionSome),
      optionNone: fieldToJSON(`0x1::option::Option<u64>`, this.optionNone),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, ...this.toJSONField() }
  }

  static fromSuiParsedData(content: SuiParsedData): SpecialTypesStruct {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isSpecialTypesStruct(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a SpecialTypesStruct object`)
    }
    return SpecialTypesStruct.fromFieldsWithTypes(content)
  }

  static async fetch(client: SuiClient, id: string): Promise<SpecialTypesStruct> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching SpecialTypesStruct object at id ${id}: ${res.error.code}`)
    }
    if (
      res.data?.content?.dataType !== 'moveObject' ||
      !isSpecialTypesStruct(res.data.content.type)
    ) {
      throw new Error(`object at id ${id} is not a SpecialTypesStruct object`)
    }
    return SpecialTypesStruct.fromFieldsWithTypes(res.data.content)
  }
}
