import { String } from '../../_dependencies/std/ascii/structs'
import { Option } from '../../_dependencies/std/option/structs'
import { String as StringString } from '../../_dependencies/std/string/structs'
import { getTypeOrigin } from '../../_envs'
import {
  PhantomReified,
  Reified,
  StructClass,
  ToField,
  ToTypeStr,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  fieldToJSON,
  phantom,
  vector,
} from '../../_framework/reified'
import {
  FieldsWithTypes,
  SupportedSuiClient,
  composeSuiType,
  compressSuiType,
  fetchObjectBcs,
} from '../../_framework/util'
import { Vector } from '../../_framework/vector'
import { ID, UID } from '../../sui/object/structs'
import { bcs } from '@mysten/sui/bcs'
import { SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromBase64, fromHex, toHex } from '@mysten/sui/utils'

/* ============================== ExampleStruct =============================== */

export function isExampleStruct(type: string): boolean {
  type = compressSuiType(type)
  return type === `${getTypeOrigin('examples', 'examples::ExampleStruct')}::examples::ExampleStruct`
}

export interface ExampleStructFields {
  dummyField: ToField<'bool'>
}

export type ExampleStructReified = Reified<ExampleStruct, ExampleStructFields>

export class ExampleStruct implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `${string}::examples::ExampleStruct` =
    `${getTypeOrigin('examples', 'examples::ExampleStruct')}::examples::ExampleStruct` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName: typeof ExampleStruct.$typeName = ExampleStruct.$typeName
  readonly $fullTypeName: `${string}::examples::ExampleStruct`
  readonly $typeArgs: []
  readonly $isPhantom: typeof ExampleStruct.$isPhantom = ExampleStruct.$isPhantom

  readonly dummyField: ToField<'bool'>

  private constructor(typeArgs: [], fields: ExampleStructFields) {
    this.$fullTypeName = composeSuiType(
      ExampleStruct.$typeName,
      ...typeArgs
    ) as `${string}::examples::ExampleStruct`
    this.$typeArgs = typeArgs

    this.dummyField = fields.dummyField
  }

  static reified(): ExampleStructReified {
    const reifiedBcs = ExampleStruct.bcs
    return {
      typeName: ExampleStruct.$typeName,
      fullTypeName: composeSuiType(
        ExampleStruct.$typeName,
        ...[]
      ) as `${string}::examples::ExampleStruct`,
      typeArgs: [] as [],
      isPhantom: ExampleStruct.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => ExampleStruct.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => ExampleStruct.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => ExampleStruct.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => ExampleStruct.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => ExampleStruct.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => ExampleStruct.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => ExampleStruct.fromSuiObjectData(content),
      fetch: async (client: SupportedSuiClient, id: string) => ExampleStruct.fetch(client, id),
      new: (fields: ExampleStructFields) => {
        return new ExampleStruct([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): ExampleStructReified {
    return ExampleStruct.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<ExampleStruct>> {
    return phantom(ExampleStruct.reified())
  }

  static get p(): PhantomReified<ToTypeStr<ExampleStruct>> {
    return ExampleStruct.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('ExampleStruct', {
      dummy_field: bcs.bool(),
    })
  }

  private static cachedBcs: ReturnType<typeof ExampleStruct.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof ExampleStruct.instantiateBcs> {
    if (!ExampleStruct.cachedBcs) {
      ExampleStruct.cachedBcs = ExampleStruct.instantiateBcs()
    }
    return ExampleStruct.cachedBcs
  }

  static fromFields(fields: Record<string, any>): ExampleStruct {
    return ExampleStruct.reified().new({
      dummyField: decodeFromFields('bool', fields.dummy_field),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): ExampleStruct {
    if (!isExampleStruct(item.type)) {
      throw new Error('not a ExampleStruct type')
    }

    return ExampleStruct.reified().new({
      dummyField: decodeFromFieldsWithTypes('bool', item.fields.dummy_field),
    })
  }

  static fromBcs(data: Uint8Array): ExampleStruct {
    return ExampleStruct.fromFields(ExampleStruct.bcs.parse(data))
  }

  toJSONField(): Record<string, any> {
    return {
      dummyField: this.dummyField,
    }
  }

  toJSON(): Record<string, any> {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): ExampleStruct {
    return ExampleStruct.reified().new({
      dummyField: decodeFromJSONField('bool', field.dummyField),
    })
  }

  static fromJSON(json: Record<string, any>): ExampleStruct {
    if (json.$typeName !== ExampleStruct.$typeName) {
      throw new Error(
        `not a ExampleStruct json object: expected '${ExampleStruct.$typeName}' but got '${json.$typeName}'`
      )
    }

    return ExampleStruct.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): ExampleStruct {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isExampleStruct(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a ExampleStruct object`)
    }
    return ExampleStruct.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): ExampleStruct {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isExampleStruct(data.bcs.type)) {
        throw new Error(`object at is not a ExampleStruct object`)
      }

      return ExampleStruct.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return ExampleStruct.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<ExampleStruct> {
    const res = await fetchObjectBcs(client, id)
    if (!isExampleStruct(res.type)) {
      throw new Error(`object at id ${id} is not a ExampleStruct object`)
    }

    return ExampleStruct.fromBcs(res.bcsBytes)
  }
}

/* ============================== SpecialTypesStruct =============================== */

export function isSpecialTypesStruct(type: string): boolean {
  type = compressSuiType(type)
  return (
    type ===
    `${getTypeOrigin('examples', 'examples::SpecialTypesStruct')}::examples::SpecialTypesStruct`
  )
}

export interface SpecialTypesStructFields {
  id: ToField<UID>
  asciiString: ToField<String>
  utf8String: ToField<StringString>
  vectorOfU64: ToField<Vector<'u64'>>
  vectorOfObjects: ToField<Vector<ExampleStruct>>
  idField: ToField<ID>
  address: ToField<'address'>
  optionSome: ToField<Option<'u64'>>
  optionNone: ToField<Option<'u64'>>
}

export type SpecialTypesStructReified = Reified<SpecialTypesStruct, SpecialTypesStructFields>

export class SpecialTypesStruct implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `${string}::examples::SpecialTypesStruct` =
    `${getTypeOrigin('examples', 'examples::SpecialTypesStruct')}::examples::SpecialTypesStruct` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName: typeof SpecialTypesStruct.$typeName = SpecialTypesStruct.$typeName
  readonly $fullTypeName: `${string}::examples::SpecialTypesStruct`
  readonly $typeArgs: []
  readonly $isPhantom: typeof SpecialTypesStruct.$isPhantom = SpecialTypesStruct.$isPhantom

  readonly id: ToField<UID>
  readonly asciiString: ToField<String>
  readonly utf8String: ToField<StringString>
  readonly vectorOfU64: ToField<Vector<'u64'>>
  readonly vectorOfObjects: ToField<Vector<ExampleStruct>>
  readonly idField: ToField<ID>
  readonly address: ToField<'address'>
  readonly optionSome: ToField<Option<'u64'>>
  readonly optionNone: ToField<Option<'u64'>>

  private constructor(typeArgs: [], fields: SpecialTypesStructFields) {
    this.$fullTypeName = composeSuiType(
      SpecialTypesStruct.$typeName,
      ...typeArgs
    ) as `${string}::examples::SpecialTypesStruct`
    this.$typeArgs = typeArgs

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

  static reified(): SpecialTypesStructReified {
    const reifiedBcs = SpecialTypesStruct.bcs
    return {
      typeName: SpecialTypesStruct.$typeName,
      fullTypeName: composeSuiType(
        SpecialTypesStruct.$typeName,
        ...[]
      ) as `${string}::examples::SpecialTypesStruct`,
      typeArgs: [] as [],
      isPhantom: SpecialTypesStruct.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => SpecialTypesStruct.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => SpecialTypesStruct.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => SpecialTypesStruct.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => SpecialTypesStruct.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => SpecialTypesStruct.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => SpecialTypesStruct.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => SpecialTypesStruct.fromSuiObjectData(content),
      fetch: async (client: SupportedSuiClient, id: string) => SpecialTypesStruct.fetch(client, id),
      new: (fields: SpecialTypesStructFields) => {
        return new SpecialTypesStruct([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): SpecialTypesStructReified {
    return SpecialTypesStruct.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<SpecialTypesStruct>> {
    return phantom(SpecialTypesStruct.reified())
  }

  static get p(): PhantomReified<ToTypeStr<SpecialTypesStruct>> {
    return SpecialTypesStruct.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('SpecialTypesStruct', {
      id: UID.bcs,
      ascii_string: String.bcs,
      utf8_string: StringString.bcs,
      vector_of_u64: bcs.vector(bcs.u64()),
      vector_of_objects: bcs.vector(ExampleStruct.bcs),
      id_field: ID.bcs,
      address: bcs.bytes(32).transform({
        input: (val: string) => fromHex(val),
        output: (val: Uint8Array) => toHex(val),
      }),
      option_some: Option.bcs(bcs.u64()),
      option_none: Option.bcs(bcs.u64()),
    })
  }

  private static cachedBcs: ReturnType<typeof SpecialTypesStruct.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof SpecialTypesStruct.instantiateBcs> {
    if (!SpecialTypesStruct.cachedBcs) {
      SpecialTypesStruct.cachedBcs = SpecialTypesStruct.instantiateBcs()
    }
    return SpecialTypesStruct.cachedBcs
  }

  static fromFields(fields: Record<string, any>): SpecialTypesStruct {
    return SpecialTypesStruct.reified().new({
      id: decodeFromFields(UID.reified(), fields.id),
      asciiString: decodeFromFields(String.reified(), fields.ascii_string),
      utf8String: decodeFromFields(StringString.reified(), fields.utf8_string),
      vectorOfU64: decodeFromFields(vector('u64'), fields.vector_of_u64),
      vectorOfObjects: decodeFromFields(vector(ExampleStruct.reified()), fields.vector_of_objects),
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

    return SpecialTypesStruct.reified().new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      asciiString: decodeFromFieldsWithTypes(String.reified(), item.fields.ascii_string),
      utf8String: decodeFromFieldsWithTypes(StringString.reified(), item.fields.utf8_string),
      vectorOfU64: decodeFromFieldsWithTypes(vector('u64'), item.fields.vector_of_u64),
      vectorOfObjects: decodeFromFieldsWithTypes(
        vector(ExampleStruct.reified()),
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

  toJSONField(): Record<string, any> {
    return {
      id: this.id,
      asciiString: this.asciiString,
      utf8String: this.utf8String,
      vectorOfU64: fieldToJSON<Vector<'u64'>>(`vector<u64>`, this.vectorOfU64),
      vectorOfObjects: fieldToJSON<Vector<ExampleStruct>>(
        `vector<${ExampleStruct.$typeName}>`,
        this.vectorOfObjects
      ),
      idField: this.idField,
      address: this.address,
      optionSome: fieldToJSON<Option<'u64'>>(`${Option.$typeName}<u64>`, this.optionSome),
      optionNone: fieldToJSON<Option<'u64'>>(`${Option.$typeName}<u64>`, this.optionNone),
    }
  }

  toJSON(): Record<string, any> {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): SpecialTypesStruct {
    return SpecialTypesStruct.reified().new({
      id: decodeFromJSONField(UID.reified(), field.id),
      asciiString: decodeFromJSONField(String.reified(), field.asciiString),
      utf8String: decodeFromJSONField(StringString.reified(), field.utf8String),
      vectorOfU64: decodeFromJSONField(vector('u64'), field.vectorOfU64),
      vectorOfObjects: decodeFromJSONField(vector(ExampleStruct.reified()), field.vectorOfObjects),
      idField: decodeFromJSONField(ID.reified(), field.idField),
      address: decodeFromJSONField('address', field.address),
      optionSome: decodeFromJSONField(Option.reified('u64'), field.optionSome),
      optionNone: decodeFromJSONField(Option.reified('u64'), field.optionNone),
    })
  }

  static fromJSON(json: Record<string, any>): SpecialTypesStruct {
    if (json.$typeName !== SpecialTypesStruct.$typeName) {
      throw new Error(
        `not a SpecialTypesStruct json object: expected '${SpecialTypesStruct.$typeName}' but got '${json.$typeName}'`
      )
    }

    return SpecialTypesStruct.fromJSONField(json)
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

  static fromSuiObjectData(data: SuiObjectData): SpecialTypesStruct {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isSpecialTypesStruct(data.bcs.type)) {
        throw new Error(`object at is not a SpecialTypesStruct object`)
      }

      return SpecialTypesStruct.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return SpecialTypesStruct.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<SpecialTypesStruct> {
    const res = await fetchObjectBcs(client, id)
    if (!isSpecialTypesStruct(res.type)) {
      throw new Error(`object at id ${id} is not a SpecialTypesStruct object`)
    }

    return SpecialTypesStruct.fromBcs(res.bcsBytes)
  }
}
