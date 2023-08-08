import { String } from '../../_dependencies/source/0x1/ascii/structs'
import { Option } from '../../_dependencies/source/0x1/option/structs'
import { String as String1 } from '../../_dependencies/source/0x1/string/structs'
import { bcsSource as bcs } from '../../_framework/bcs'
import { FieldsWithTypes, Type } from '../../_framework/util'
import { ID, UID } from '../../sui/object/structs'
import { Encoding } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== ExampleStruct =============================== */

bcs.registerStructType(
  '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::examples::ExampleStruct',
  {
    dummy_field: `bool`,
  }
)

export function isExampleStruct(type: Type): boolean {
  return (
    type ===
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::examples::ExampleStruct'
  )
}

export interface ExampleStructFields {
  dummyField: boolean
}

export class ExampleStruct {
  static readonly $typeName =
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::examples::ExampleStruct'
  static readonly $numTypeParams = 0

  readonly dummyField: boolean

  constructor(dummyField: boolean) {
    this.dummyField = dummyField
  }

  static fromFields(fields: Record<string, any>): ExampleStruct {
    return new ExampleStruct(fields.dummy_field)
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): ExampleStruct {
    if (!isExampleStruct(item.type)) {
      throw new Error('not a ExampleStruct type')
    }
    return new ExampleStruct(item.fields.dummy_field)
  }

  static fromBcs(data: Uint8Array | string, encoding?: Encoding): ExampleStruct {
    return ExampleStruct.fromFields(bcs.de([ExampleStruct.$typeName], data, encoding))
  }
}

/* ============================== SpecialTypesStruct =============================== */

bcs.registerStructType(
  '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::examples::SpecialTypesStruct',
  {
    id: `0x2::object::UID`,
    ascii_string: `0x1::ascii::String`,
    utf8_string: `0x1::string::String`,
    vector_of_u64: `vector<u64>`,
    vector_of_objects: `vector<0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::examples::ExampleStruct>`,
    id_field: `0x2::object::ID`,
    address: `address`,
    option_some: `0x1::option::Option<u64>`,
    option_none: `0x1::option::Option<u64>`,
  }
)

export function isSpecialTypesStruct(type: Type): boolean {
  return (
    type ===
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::examples::SpecialTypesStruct'
  )
}

export interface SpecialTypesStructFields {
  id: string
  asciiString: string
  utf8String: string
  vectorOfU64: Array<bigint>
  vectorOfObjects: Array<ExampleStruct>
  idField: string
  address: string
  optionSome: bigint | null
  optionNone: bigint | null
}

export class SpecialTypesStruct {
  static readonly $typeName =
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::examples::SpecialTypesStruct'
  static readonly $numTypeParams = 0

  readonly id: string
  readonly asciiString: string
  readonly utf8String: string
  readonly vectorOfU64: Array<bigint>
  readonly vectorOfObjects: Array<ExampleStruct>
  readonly idField: string
  readonly address: string
  readonly optionSome: bigint | null
  readonly optionNone: bigint | null

  constructor(fields: SpecialTypesStructFields) {
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

  static fromFields(fields: Record<string, any>): SpecialTypesStruct {
    return new SpecialTypesStruct({
      id: UID.fromFields(fields.id).id,
      asciiString: new TextDecoder()
        .decode(Uint8Array.from(String.fromFields(fields.ascii_string).bytes))
        .toString(),
      utf8String: new TextDecoder()
        .decode(Uint8Array.from(String1.fromFields(fields.utf8_string).bytes))
        .toString(),
      vectorOfU64: fields.vector_of_u64.map((item: any) => BigInt(item)),
      vectorOfObjects: fields.vector_of_objects.map((item: any) => ExampleStruct.fromFields(item)),
      idField: ID.fromFields(fields.id_field).bytes,
      address: `0x${fields.address}`,
      optionSome: Option.fromFields<bigint>(`u64`, fields.option_some).vec[0] || null,
      optionNone: Option.fromFields<bigint>(`u64`, fields.option_none).vec[0] || null,
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): SpecialTypesStruct {
    if (!isSpecialTypesStruct(item.type)) {
      throw new Error('not a SpecialTypesStruct type')
    }
    return new SpecialTypesStruct({
      id: item.fields.id.id,
      asciiString: item.fields.ascii_string,
      utf8String: item.fields.utf8_string,
      vectorOfU64: item.fields.vector_of_u64.map((item: any) => BigInt(item)),
      vectorOfObjects: item.fields.vector_of_objects.map((item: any) =>
        ExampleStruct.fromFieldsWithTypes(item)
      ),
      idField: item.fields.id_field,
      address: `0x${item.fields.address}`,
      optionSome:
        item.fields.option_some !== null
          ? Option.fromFieldsWithTypes<bigint>({
              type: '0x1::option::Option<' + `u64` + '>',
              fields: { vec: [item.fields.option_some] },
            }).vec[0]
          : null,
      optionNone:
        item.fields.option_none !== null
          ? Option.fromFieldsWithTypes<bigint>({
              type: '0x1::option::Option<' + `u64` + '>',
              fields: { vec: [item.fields.option_none] },
            }).vec[0]
          : null,
    })
  }

  static fromBcs(data: Uint8Array | string, encoding?: Encoding): SpecialTypesStruct {
    return SpecialTypesStruct.fromFields(bcs.de([SpecialTypesStruct.$typeName], data, encoding))
  }

  static fromSuiParsedData(content: SuiParsedData) {
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
