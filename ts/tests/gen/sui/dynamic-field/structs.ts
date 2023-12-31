import { initLoaderIfNeeded } from '../../_framework/init-source'
import { structClassLoaderSource } from '../../_framework/loader'
import {
  FieldsWithTypes,
  Type,
  compressSuiType,
  genericToJSON,
  parseTypeName,
} from '../../_framework/util'
import { UID } from '../object/structs'
import { BcsType, bcs } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== Field =============================== */

export function isField(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::dynamic_field::Field<')
}

export interface FieldFields<Name, Value> {
  id: string
  name: Name
  value: Value
}

export class Field<Name, Value> {
  static readonly $typeName = '0x2::dynamic_field::Field'
  static readonly $numTypeParams = 2

  static get bcs() {
    return <Name extends BcsType<any>, Value extends BcsType<any>>(Name: Name, Value: Value) =>
      bcs.struct(`Field<${Name.name}, ${Value.name}>`, {
        id: UID.bcs,
        name: Name,
        value: Value,
      })
  }

  readonly $typeArgs: [Type, Type]

  readonly id: string
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

  static fromBcs<Name, Value>(typeArgs: [Type, Type], data: Uint8Array): Field<Name, Value> {
    initLoaderIfNeeded()

    return Field.fromFields(
      typeArgs,
      Field.bcs(
        structClassLoaderSource.getBcsType(typeArgs[0]),
        structClassLoaderSource.getBcsType(typeArgs[1])
      ).parse(data)
    )
  }

  toJSON() {
    return {
      $typeArgs: this.$typeArgs,
      id: this.id,
      name: genericToJSON(this.$typeArgs[0], this.name),
      value: genericToJSON(this.$typeArgs[1], this.value),
    }
  }

  static fromSuiParsedData(content: SuiParsedData) {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isField(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Field object`)
    }
    return Field.fromFieldsWithTypes(content)
  }

  static async fetch<Name, Value>(client: SuiClient, id: string): Promise<Field<Name, Value>> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching Field object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isField(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a Field object`)
    }
    return Field.fromFieldsWithTypes(res.data.content)
  }
}
