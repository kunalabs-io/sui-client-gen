import {
  PhantomReified,
  Reified,
  StructClass,
  ToField,
  ToJSON,
  ToTypeArgument,
  ToTypeStr,
  TypeArgument,
  assertFieldsWithTypesArgsMatch,
  assertReifiedTypeArgsMatch,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  extractType,
  fieldToJSON,
  phantom,
  toBcs,
  vector,
} from '../../_framework/reified'
import {
  FieldsWithTypes,
  SupportedSuiClient,
  composeSuiType,
  compressSuiType,
  fetchObjectBcs,
  parseTypeName,
} from '../../_framework/util'
import { Vector } from '../../_framework/vector'
import { BcsType, bcs } from '@mysten/sui/bcs'
import { SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromBase64 } from '@mysten/sui/utils'

/* ============================== VecSet =============================== */

export function isVecSet(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::vec_set::VecSet` + '<')
}

export interface VecSetFields<K extends TypeArgument> {
  contents: ToField<Vector<K>>
}

export type VecSetReified<K extends TypeArgument> = Reified<VecSet<K>, VecSetFields<K>>

export type VecSetJSONField<K extends TypeArgument> = {
  contents: ToJSON<K>[]
}

export type VecSetJSON<K extends TypeArgument> = {
  $typeName: typeof VecSet.$typeName
  $typeArgs: [ToTypeStr<K>]
} & VecSetJSONField<K>

/**
 * A set data structure backed by a vector. The set is guaranteed not to
 * contain duplicate keys. All operations are O(N) in the size of the set
 * - the intention of this data structure is only to provide the convenience
 * of programming against a set API. Sets that need sorted iteration rather
 * than insertion order iteration should be handwritten.
 */
export class VecSet<K extends TypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::vec_set::VecSet` = `0x2::vec_set::VecSet` as const
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [false] as const

  readonly $typeName: typeof VecSet.$typeName = VecSet.$typeName
  readonly $fullTypeName: `0x2::vec_set::VecSet<${ToTypeStr<K>}>`
  readonly $typeArgs: [ToTypeStr<K>]
  readonly $isPhantom: typeof VecSet.$isPhantom = VecSet.$isPhantom

  readonly contents: ToField<Vector<K>>

  private constructor(typeArgs: [ToTypeStr<K>], fields: VecSetFields<K>) {
    this.$fullTypeName = composeSuiType(
      VecSet.$typeName,
      ...typeArgs
    ) as `0x2::vec_set::VecSet<${ToTypeStr<K>}>`
    this.$typeArgs = typeArgs

    this.contents = fields.contents
  }

  static reified<K extends Reified<TypeArgument, any>>(K: K): VecSetReified<ToTypeArgument<K>> {
    const reifiedBcs = VecSet.bcs(toBcs(K))
    return {
      typeName: VecSet.$typeName,
      fullTypeName: composeSuiType(
        VecSet.$typeName,
        ...[extractType(K)]
      ) as `0x2::vec_set::VecSet<${ToTypeStr<ToTypeArgument<K>>}>`,
      typeArgs: [extractType(K)] as [ToTypeStr<ToTypeArgument<K>>],
      isPhantom: VecSet.$isPhantom,
      reifiedTypeArgs: [K],
      fromFields: (fields: Record<string, any>) => VecSet.fromFields(K, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => VecSet.fromFieldsWithTypes(K, item),
      fromBcs: (data: Uint8Array) => VecSet.fromFields(K, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => VecSet.fromJSONField(K, field),
      fromJSON: (json: Record<string, any>) => VecSet.fromJSON(K, json),
      fromSuiParsedData: (content: SuiParsedData) => VecSet.fromSuiParsedData(K, content),
      fromSuiObjectData: (content: SuiObjectData) => VecSet.fromSuiObjectData(K, content),
      fetch: async (client: SupportedSuiClient, id: string) => VecSet.fetch(client, K, id),
      new: (fields: VecSetFields<ToTypeArgument<K>>) => {
        return new VecSet([extractType(K)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): typeof VecSet.reified {
    return VecSet.reified
  }

  static phantom<K extends Reified<TypeArgument, any>>(
    K: K
  ): PhantomReified<ToTypeStr<VecSet<ToTypeArgument<K>>>> {
    return phantom(VecSet.reified(K))
  }

  static get p(): typeof VecSet.phantom {
    return VecSet.phantom
  }

  private static instantiateBcs() {
    return <K extends BcsType<any>>(K: K) =>
      bcs.struct(`VecSet<${K.name}>`, {
        contents: bcs.vector(K),
      })
  }

  private static cachedBcs: ReturnType<typeof VecSet.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof VecSet.instantiateBcs> {
    if (!VecSet.cachedBcs) {
      VecSet.cachedBcs = VecSet.instantiateBcs()
    }
    return VecSet.cachedBcs
  }

  static fromFields<K extends Reified<TypeArgument, any>>(
    typeArg: K,
    fields: Record<string, any>
  ): VecSet<ToTypeArgument<K>> {
    return VecSet.reified(typeArg).new({
      contents: decodeFromFields(vector(typeArg), fields.contents),
    })
  }

  static fromFieldsWithTypes<K extends Reified<TypeArgument, any>>(
    typeArg: K,
    item: FieldsWithTypes
  ): VecSet<ToTypeArgument<K>> {
    if (!isVecSet(item.type)) {
      throw new Error('not a VecSet type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return VecSet.reified(typeArg).new({
      contents: decodeFromFieldsWithTypes(vector(typeArg), item.fields.contents),
    })
  }

  static fromBcs<K extends Reified<TypeArgument, any>>(
    typeArg: K,
    data: Uint8Array
  ): VecSet<ToTypeArgument<K>> {
    const typeArgs = [typeArg]
    return VecSet.fromFields(typeArg, VecSet.bcs(toBcs(typeArg)).parse(data))
  }

  toJSONField(): VecSetJSONField<K> {
    return {
      contents: fieldToJSON<Vector<K>>(`vector<${this.$typeArgs[0]}>`, this.contents),
    }
  }

  toJSON(): VecSetJSON<K> {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<K extends Reified<TypeArgument, any>>(
    typeArg: K,
    field: any
  ): VecSet<ToTypeArgument<K>> {
    return VecSet.reified(typeArg).new({
      contents: decodeFromJSONField(vector(typeArg), field.contents),
    })
  }

  static fromJSON<K extends Reified<TypeArgument, any>>(
    typeArg: K,
    json: Record<string, any>
  ): VecSet<ToTypeArgument<K>> {
    if (json.$typeName !== VecSet.$typeName) {
      throw new Error(
        `not a VecSet json object: expected '${VecSet.$typeName}' but got '${json.$typeName}'`
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(VecSet.$typeName, ...[extractType(typeArg)]),
      json.$typeArgs,
      [typeArg]
    )

    return VecSet.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<K extends Reified<TypeArgument, any>>(
    typeArg: K,
    content: SuiParsedData
  ): VecSet<ToTypeArgument<K>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isVecSet(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a VecSet object`)
    }
    return VecSet.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<K extends Reified<TypeArgument, any>>(
    typeArg: K,
    data: SuiObjectData
  ): VecSet<ToTypeArgument<K>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isVecSet(data.bcs.type)) {
        throw new Error(`object at is not a VecSet object`)
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs
      if (gotTypeArgs.length !== 1) {
        throw new Error(
          `type argument mismatch: expected 1 type arguments but got '${gotTypeArgs.length}'`
        )
      }
      for (let i = 0; i < 1; i++) {
        const gotTypeArg = compressSuiType(gotTypeArgs[i])
        const expectedTypeArg = compressSuiType(extractType([typeArg][i]))
        if (gotTypeArg !== expectedTypeArg) {
          throw new Error(
            `type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`
          )
        }
      }

      return VecSet.fromBcs(typeArg, fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return VecSet.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<K extends Reified<TypeArgument, any>>(
    client: SupportedSuiClient,
    typeArg: K,
    id: string
  ): Promise<VecSet<ToTypeArgument<K>>> {
    const res = await fetchObjectBcs(client, id)
    if (!isVecSet(res.type)) {
      throw new Error(`object at id ${id} is not a VecSet object`)
    }

    return VecSet.fromBcs(typeArg, res.bcsBytes)
  }
}
