import { TypeName } from '@mysten/bcs'
import { TypeTag, TypeTagSerializer } from '@mysten/sui.js'

/** A Move type, e.g., `address`, `bool`, `u64`, `vector<u64>`, `0x2::sui::SUI`... */
export type Type = string

export function tagToType(tag: TypeTag): Type {
  return TypeTagSerializer.tagToString(tag)
}

export function typeToTag(type: Type): TypeTag {
  return TypeTagSerializer.parseFromStr(type)
}

export function tagToBcsTypeName(tag: TypeTag): TypeName {
  if ('bool' in tag) {
    return 'bool'
  }
  if ('u8' in tag) {
    return 'u8'
  }
  if ('u16' in tag) {
    return 'u16'
  }
  if ('u32' in tag) {
    return 'u32'
  }
  if ('u64' in tag) {
    return 'u64'
  }
  if ('u128' in tag) {
    return 'u128'
  }
  if ('u256' in tag) {
    return 'u256'
  }
  if ('address' in tag) {
    return 'address'
  }
  if ('signer' in tag) {
    return 'signer'
  }
  if ('vector' in tag) {
    return ['vector', tagToBcsTypeName(tag.vector)]
  }
  if ('struct' in tag) {
    const type = `${tag.struct.address}::${tag.struct.module}::${tag.struct.name}`
    if (tag.struct.typeParams.length === 0) {
      return type
    } else {
      return [type, ...tag.struct.typeParams.map(tagToBcsTypeName)]
    }
  }

  throw new Error(`Invalid type tag: ${JSON.stringify(tag)}`)
}

export function typeToBcsTypeName(type: Type): TypeName {
  return tagToBcsTypeName(typeToTag(type))
}

/**
 * Parse a type name and get the type's generics.
 * @example
 * let [name, params] = parseTypeName('Option<Coin<SUI>>');
 * // typeName: Option
 * // typeParams: [ 'Coin<SUI>' ]
 *
 * @param name Name of the type to process
 * @returns Object with typeName and typeParams listed as Array
 */
export function parseTypeName(name: Type): { typeName: string; typeArgs: Type[] } {
  const [left, right] = ['<', '>']

  const l_bound = name.indexOf(left)
  const r_bound = Array.from(name).reverse().indexOf(right)

  // if there are no generics - exit gracefully.
  if (l_bound === -1 && r_bound === -1) {
    return { typeName: name, typeArgs: [] }
  }

  // if one of the bounds is not defined - throw an Error.
  if (l_bound === -1 || r_bound === -1) {
    throw new Error(`Unclosed generic in name '${name}'`)
  }

  const typeName = name.slice(0, l_bound)
  const params = name
    .slice(l_bound + 1, name.length - r_bound - 1)
    .split(',')
    .map(e => e.trim())

  return { typeName, typeArgs: params }
}

export function isTypeTagEqual(tag1: TypeTag, tag2: TypeTag): boolean {
  if ('vector' in tag1 && 'vector' in tag2) {
    isTypeTagEqual(tag1.vector, tag2.vector)
  }
  if ('struct' in tag1 && 'struct' in tag2) {
    const [s1, s2] = [tag1.struct, tag2.struct]
    if (s1.address !== s2.address) {
      return false
    }
    if (s1.module !== s2.module) {
      return false
    }
    if (s1.name !== s2.name) {
      return false
    }
    if (s1.typeParams.length !== s2.typeParams.length) {
      return false
    }
    for (let i = 0; i < s1.typeParams.length; i++) {
      if (isTypeTagEqual(s1.typeParams[i], s2.typeParams[i]) === false) {
        return false
      }
    }
    return true
  }
  if (Object.keys(tag1)[0] === Object.keys(tag1)[0]) {
    return true
  }
  return false
}
