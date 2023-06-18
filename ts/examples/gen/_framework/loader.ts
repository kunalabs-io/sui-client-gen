import { FieldsWithTypes, Type, parseTypeName } from './util'

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
    const { typeName, typeArgs } = parseTypeName(type)

    // some types are special-cased in the RPC so we need to handle this manually
    // https://github.com/MystenLabs/sui/blob/416a980749ba8208917bae37a1ec1d43e50037b7/crates/sui-json-rpc-types/src/sui_move.rs#L482-L533
    switch (typeName) {
      case '0x1::string::String':
      case '0x1::ascii::String':
      case '0x2::url::Url':
        return value
      case '0x2::object::ID':
        return value
      case '0x2::object::UID':
        return (value as unknown as { id: string }).id
      case '0x2::balance::Balance': {
        const loader = this.map.get('0x2::balance::Balance')
        if (!loader) {
          throw new Error('no loader registered for type 0x2::balance::Balance')
        }
        return loader.fromFields({ value }, typeArgs)
      }
      case '0x1::option::Option': {
        if (value === null) {
          return null
        }

        const loader = this.map.get('0x1::option::Option')
        if (!loader) {
          throw new Error('no loader registered for type 0x1::option::Option')
        }
        return loader.fromFieldsWithTypes({
          type: type,
          fields: { vec: [value] },
        }).vec[0]
      }
    }

    const ret = this.#handlePrimitiveValue(type, value, this.fromFieldsWithTypes.bind(this))
    if (ret !== undefined) {
      return ret
    }
    value = value as FieldsWithTypes // type hint

    const loader = this.map.get(typeName)
    if (!loader) {
      throw new Error(`no loader registered for type ${typeName}`)
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

export const structClassLoaderSource = new StructClassLoader()
export const structClassLoaderOnchain = new StructClassLoader()
