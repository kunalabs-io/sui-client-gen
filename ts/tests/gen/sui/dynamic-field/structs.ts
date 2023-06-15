import { bcsSource as bcs } from '../../_framework/bcs'
import { initLoaderIfNeeded } from '../../_framework/init-source'
import { structClassLoaderSource } from '../../_framework/loader'
import { FieldsWithTypes, Type, parseTypeName } from '../../_framework/util'
import { UID } from '../object/structs'
import { Encoding } from '@mysten/bcs'
import { JsonRpcProvider, ObjectId, SuiParsedData } from '@mysten/sui.js'

/* ============================== Field =============================== */

bcs.registerStructType('0x2::dynamic_field::Field<Name, Value>', {
  id: `0x2::object::UID`,
  name: `Name`,
  value: `Value`,
})

export function isField(type: Type): boolean {
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
      id: UID.fromFields(fields.id).id,
      name: structClassLoaderSource.fromFields(typeArgs[0], fields.name),
      value: structClassLoaderSource.fromFields(typeArgs[1], fields.value),
    })
  }

  static fromFieldsWithTypes<Name, Value>(item: FieldsWithTypes): Field<Name, Value> {
    initLoaderIfNeeded()

    if (!isField(item.type)) {
      throw new Error('not a Field type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new Field([typeArgs[0], typeArgs[1]], {
      id: item.fields.id.id,
      name: structClassLoaderSource.fromFieldsWithTypes(typeArgs[0], item.fields.name),
      value: structClassLoaderSource.fromFieldsWithTypes(typeArgs[1], item.fields.value),
    })
  }

  static fromBcs<Name, Value>(
    typeArgs: [Type, Type],
    data: Uint8Array | string,
    encoding?: Encoding
  ): Field<Name, Value> {
    return Field.fromFields(typeArgs, bcs.de([Field.$typeName, ...typeArgs], data, encoding))
  }

  static fromSuiParsedData(content: SuiParsedData) {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isField(content.type)) {
      throw new Error(`object at ${content.fields.id} is not a Field object`)
    }
    return Field.fromFieldsWithTypes(content)
  }

  static async fetch<Name, Value>(
    provider: JsonRpcProvider,
    id: ObjectId
  ): Promise<Field<Name, Value>> {
    const res = await provider.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching Field object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isField(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a Field object`)
    }
    return Field.fromFieldsWithTypes(res.data.content)
  }
}
