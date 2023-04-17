import { JsonRpcProvider, ObjectId, SuiParsedData } from '@mysten/sui.js'
import { bcs } from 'framework/bcs'
import { PACKAGE_ID } from '..'
import { Type, parseTypeName } from 'framework/type'
import { UID } from 'framework/object'
import { structClassLoader } from 'framework/loader'
import { FieldsWithTypes } from 'framework/util'
import { Encoding } from '@mysten/bcs'
import { initLoaderIfNeeded } from 'generated/init'

/* ============================== WithGenericField =============================== */

bcs.registerStructType([`${PACKAGE_ID}::fixture::WithGenericField`, 'T'], {
  id: '0x2::object::UID',
  generic_field: 'T',
})

export function isWithGenericField(type: Type) {
  return type.startsWith(`${PACKAGE_ID}::fixture::WithGenericField<`)
}

export interface WithGenericFieldFields<T> {
  id: ObjectId
  genericField: T
}

export class WithGenericField<T> {
  static readonly $typeName = `${PACKAGE_ID}::fixture::WithGenericField`
  static readonly $numTypeParams = 1

  readonly $typeArg: Type

  readonly id: ObjectId
  readonly genericField: T

  constructor(typeArg: Type, fields: WithGenericFieldFields<T>) {
    this.$typeArg = typeArg
    this.id = fields.id
    this.genericField = fields.genericField
  }

  static fromFields<T>(typeArg: Type, fields: Record<string, any>): WithGenericField<T> {
    initLoaderIfNeeded()

    return new WithGenericField(typeArg, {
      id: UID.fromFields(fields.id).id.bytes,
      genericField: structClassLoader.fromFields(typeArg, fields.generic_field),
    })
  }

  static fromFieldsWithTypes<T>(item: FieldsWithTypes): WithGenericField<T> {
    initLoaderIfNeeded()

    if (!isWithGenericField(item.type)) {
      throw new Error(`not a WithGenericField type`)
    }
    const { typeArgs } = parseTypeName(item.type)

    return new WithGenericField(typeArgs[0], {
      id: item.fields.id,
      genericField: structClassLoader.fromFieldsWithTypes(typeArgs[0], item.fields.generic_field),
    })
  }

  static fromBcs<T>(
    typeArg: Type,
    data: Uint8Array | string,
    encoding?: Encoding
  ): WithGenericField<T> {
    return WithGenericField.fromFields(
      typeArg,
      bcs.de([`${PACKAGE_ID}::fixture::WithGenericField`, typeArg], data, encoding)
    )
  }

  static fromSuiParsedData<T>(content: SuiParsedData) {
    if (content.dataType !== 'moveObject') {
      throw new Error(`not an object`)
    }
    if (!isWithGenericField(content.type)) {
      throw new Error(`object at "${content.fields.id}" is not a Field`)
    }
    return WithGenericField.fromFieldsWithTypes(content)
  }

  static async fetch<T>(provider: JsonRpcProvider, id: ObjectId): Promise<WithGenericField<T>> {
    const res = await provider.getObject({
      id,
      options: {
        showBcs: true,
      },
    })
    if (res.error) {
      throw new Error(`error fetching WithGenericField object at id "${id}": ${res.error.tag}`)
    }
    if (res.data!.bcs!.dataType !== 'moveObject' || !isWithGenericField(res.data!.bcs!.type)) {
      throw new Error(`object at id "${id}" is not a WithGenericField`)
    }

    const { typeArgs } = parseTypeName(res.data!.bcs!.type)
    return WithGenericField.fromBcs(typeArgs[0], res.data!.bcs!.bcsBytes, 'base64')
  }
}
