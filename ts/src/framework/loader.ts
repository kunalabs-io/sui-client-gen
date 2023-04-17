import { Type, parseTypeName } from './type'
import { FieldsWithTypes } from './util'

export type PrimitiveValue = string | number | boolean | bigint

export class StructClassLoader {
  private map: Map<
    string,
    {
      numTypeParams: number
      fromFields: (fields: Record<string, any>, typeArgs?: Type[]) => any
      fromFieldsWithTypes: (item: FieldsWithTypes) => any
    }
  > = new Map()

  register(...classes: any) {
    for (const cls of classes) {
      if (
        '$typeName' in cls === false ||
        '$numTypeParams' in cls === false ||
        'fromFields' in cls === false ||
        'fromFieldsWithTypes' in cls === false
      ) {
        throw new Error(`class ${cls.name} is not a valid struct class`)
      }

      const typeName = cls.$typeName
      const numTypeParams = cls.$numTypeParams

      this.map.set(typeName, {
        numTypeParams,
        fromFields: (fields: Record<string, any>, typeArgs: Type[] = []) => {
          if (typeArgs.length !== numTypeParams) {
            throw new Error(`expected ${numTypeParams} type args, got ${typeArgs.length}`)
          }
          if (numTypeParams === 0) {
            return cls.fromFields(fields)
          } else if (numTypeParams === 1) {
            return cls.fromFields(typeArgs[0], fields)
          } else {
            return cls.fromFields(typeArgs, fields)
          }
        },
        fromFieldsWithTypes: (item: FieldsWithTypes) => {
          return cls.fromFieldsWithTypes(item)
        },
      })
    }
  }

  fromFields(type: Type, value: Record<string, any> | PrimitiveValue) {
    const ret = this.#handlePrimitiveValue(type, value, this.fromFields.bind(this))
    if (ret !== undefined) {
      return ret
    }
    value = value as FieldsWithTypes // type hint

    const { typeName, typeArgs } = parseTypeName(type)

    const loader = this.map.get(typeName)
    if (!loader) {
      throw new Error(`no loader registered for type ${typeName}`)
    }

    if (loader.numTypeParams !== typeArgs.length) {
      throw new Error(`expected ${loader.numTypeParams} type args, got ${typeArgs.length}`)
    }

    return loader.fromFields(value, typeArgs)
  }

  fromFieldsWithTypes(type: Type, value: FieldsWithTypes | PrimitiveValue) {
    const ret = this.#handlePrimitiveValue(type, value, this.fromFieldsWithTypes.bind(this))
    if (ret !== undefined) {
      return ret
    }
    value = value as FieldsWithTypes // type hint

    type = type.split('<')[0]

    const loader = this.map.get(type)
    if (!loader) {
      throw new Error(`no loader registered for type ${type}`)
    }

    return loader.fromFieldsWithTypes(value)
  }

  #handlePrimitiveValue(type: Type, value: any, vecCb: (type: Type, value: any) => any) {
    const { typeName, typeArgs } = parseTypeName(type)

    switch (typeName) {
      case 'bool':
        return value as boolean
      case 'u8':
      case 'u16':
      case 'u32':
        return value as number
      case 'u64':
      case 'u128':
      case 'u256':
        return BigInt(value)
      case 'address':
        return value as string
      case 'signer':
        return value as string
      case 'vector':
        value = value as any[]
        return value.map((item: any) => vecCb(typeArgs[0], item))
      default:
        return undefined
    }
  }
}

export const structClassLoader = new StructClassLoader()
