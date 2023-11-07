import { Encoding, bcsOnchain as bcs } from '../../../../_framework/bcs'
import { initLoaderIfNeeded } from '../../../../_framework/init-onchain'
import { structClassLoaderOnchain } from '../../../../_framework/loader'
import { FieldsWithTypes, Type, compressSuiType, parseTypeName } from '../../../../_framework/util'
import { UID } from '../object/structs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== Field =============================== */

bcs.registerStructType('0x2::dynamic_field::Field<T0, T1>', {
  id: `0x2::object::UID`,
  name: `T0`,
  value: `T1`,
})

export function isField(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::dynamic_field::Field<')
}

export interface FieldFields<T0, T1> {
  id: string
  name: T0
  value: T1
}

export class Field<T0, T1> {
  static readonly $typeName = '0x2::dynamic_field::Field'
  static readonly $numTypeParams = 2

  readonly $typeArgs: [Type, Type]

  readonly id: string
  readonly name: T0
  readonly value: T1

  constructor(typeArgs: [Type, Type], fields: FieldFields<T0, T1>) {
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.name = fields.name
    this.value = fields.value
  }

  static fromFields<T0, T1>(typeArgs: [Type, Type], fields: Record<string, any>): Field<T0, T1> {
    initLoaderIfNeeded()

    return new Field(typeArgs, {
      id: UID.fromFields(fields.id).id,
      name: structClassLoaderOnchain.fromFields(typeArgs[0], fields.name),
      value: structClassLoaderOnchain.fromFields(typeArgs[1], fields.value),
    })
  }

  static fromFieldsWithTypes<T0, T1>(item: FieldsWithTypes): Field<T0, T1> {
    initLoaderIfNeeded()

    if (!isField(item.type)) {
      throw new Error('not a Field type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new Field([typeArgs[0], typeArgs[1]], {
      id: item.fields.id.id,
      name: structClassLoaderOnchain.fromFieldsWithTypes(typeArgs[0], item.fields.name),
      value: structClassLoaderOnchain.fromFieldsWithTypes(typeArgs[1], item.fields.value),
    })
  }

  static fromBcs<T0, T1>(
    typeArgs: [Type, Type],
    data: Uint8Array | string,
    encoding?: Encoding
  ): Field<T0, T1> {
    return Field.fromFields(typeArgs, bcs.de([Field.$typeName, ...typeArgs], data, encoding))
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

  static async fetch<T0, T1>(client: SuiClient, id: string): Promise<Field<T0, T1>> {
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
