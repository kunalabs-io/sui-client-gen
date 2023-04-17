import { JsonRpcProvider, ObjectId, SuiParsedData } from '@mysten/sui.js'
import { Type, parseTypeName } from './type'
import { bcs } from './bcs'
import { UID } from './object'
import { structClassLoader } from './loader'
import { Encoding } from '@mysten/bcs'
import { FieldsWithTypes } from './util'
import { initLoaderIfNeeded } from 'generated/init'

bcs.registerStructType(['0x2::dynamic_field::Field', 'Name', 'Value'], {
  id: '0x2::object::UID',
  name: 'Name',
  value: 'Value',
})

export function isField(type: Type) {
  return type.startsWith('0x2::dynamic_field::Field<')
}

export interface FieldFields<Name, Value> {
  id: ObjectId
  name: Name
  value: Value
}

export class Field<Name, Value> {
  static readonly $typeName = '0x2::dynamic_field::Field'
  static readonly $numTypeParams = 2

  readonly $typeArgs: [Type, Type]

  readonly id: ObjectId
  readonly name: Name
  readonly value: Value

  constructor(typeArgs: [Type, Type], fields: FieldFields<Name, Value>) {
    this.$typeArgs = typeArgs
    this.id = fields.id
    this.name = fields.name
    this.value = fields.value
  }

  static fromFields<Name, Value>(
    typeArgs: [Type, Type],
    fields: Record<string, any>
  ): Field<Name, Value> {
    initLoaderIfNeeded()

    return new Field(typeArgs, {
      id: UID.fromFields(fields.id).id.bytes,
      name: structClassLoader.fromFields(typeArgs[0], fields.name),
      value: structClassLoader.fromFields(typeArgs[1], fields.value),
    })
  }

  static fromFieldsWithTypes<Name, Value>(item: FieldsWithTypes): Field<Name, Value> {
    initLoaderIfNeeded()

    if (!isField(item.type)) {
      throw new Error(`not a Field type`)
    }
    const { typeArgs } = parseTypeName(item.type)

    return new Field(typeArgs as [Type, Type], {
      id: item.fields.id,
      name: structClassLoader.fromFieldsWithTypes(typeArgs[0], item.fields.name),
      value: structClassLoader.fromFieldsWithTypes(typeArgs[1], item.fields.value),
    })
  }

  static fromBcs<Name, Value>(
    typeArgs: [Type, Type],
    data: Uint8Array | string,
    encoding?: Encoding
  ): Field<Name, Value> {
    return Field.fromFields(
      typeArgs,
      bcs.de(['0x2::dynamic_field::Field', ...typeArgs], data, encoding)
    )
  }

  static fromSuiParsedData<Name, Value>(content: SuiParsedData) {
    if (content.dataType !== 'moveObject') {
      throw new Error(`not an object`)
    }
    if (!isField(content.type)) {
      throw new Error(`object at "${content.fields.id}" is not a Field`)
    }
    return Field.fromFieldsWithTypes(content)
  }

  static async fetch<Name, Value>(
    provider: JsonRpcProvider,
    id: ObjectId
  ): Promise<Field<Name, Value>> {
    const res = await provider.getObject({
      id,
      options: {
        showBcs: true,
        showContent: true,
      },
    })
    if (res.error) {
      throw new Error(`error fetching Field object at id "${id}": ${res.error.tag}`)
    }
    if (res.data!.bcs!.dataType !== 'moveObject' || !isField(res.data!.bcs!.type)) {
      throw new Error(`object at id "${id}" is not a Field`)
    }

    const { typeArgs } = parseTypeName(res.data!.bcs!.type)
    return Field.fromBcs(typeArgs as [Type, Type], res.data!.bcs!.bcsBytes, 'base64')
  }
}
