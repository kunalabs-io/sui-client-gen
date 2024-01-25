import * as reified from '../../_framework/reified'
import {
  Reified,
  ToField,
  ToTypeArgument,
  ToTypeStr,
  TypeArgument,
  Vector,
  assertFieldsWithTypesArgsMatch,
  assertReifiedTypeArgsMatch,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  extractType,
  fieldToJSON,
  toBcs,
} from '../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../_framework/util'
import { BcsType, bcs } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== VecSet =============================== */

export function isVecSet(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::vec_set::VecSet<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface VecSetFields<T0 extends TypeArgument> {
  contents: ToField<Vector<T0>>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class VecSet<T0 extends TypeArgument> {
  static readonly $typeName = '0x2::vec_set::VecSet'
  static readonly $numTypeParams = 1

  readonly $typeName = VecSet.$typeName

  readonly $fullTypeName: `0x2::vec_set::VecSet<${string}>`

  readonly $typeArg: string

  readonly contents: ToField<Vector<T0>>

  private constructor(typeArg: string, fields: VecSetFields<T0>) {
    this.$fullTypeName = composeSuiType(
      VecSet.$typeName,
      typeArg
    ) as `0x2::vec_set::VecSet<${ToTypeStr<T0>}>`

    this.$typeArg = typeArg

    this.contents = fields.contents
  }

  static reified<T0 extends Reified<TypeArgument, any>>(
    T0: T0
  ): Reified<VecSet<ToTypeArgument<T0>>, VecSetFields<ToTypeArgument<T0>>> {
    return {
      typeName: VecSet.$typeName,
      fullTypeName: composeSuiType(
        VecSet.$typeName,
        ...[extractType(T0)]
      ) as `0x2::vec_set::VecSet<${ToTypeStr<ToTypeArgument<T0>>}>`,
      typeArgs: [T0],
      fromFields: (fields: Record<string, any>) => VecSet.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => VecSet.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => VecSet.fromBcs(T0, data),
      bcs: VecSet.bcs(toBcs(T0)),
      fromJSONField: (field: any) => VecSet.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => VecSet.fromJSON(T0, json),
      fetch: async (client: SuiClient, id: string) => VecSet.fetch(client, T0, id),
      new: (fields: VecSetFields<ToTypeArgument<T0>>) => {
        return new VecSet(extractType(T0), fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return VecSet.reified
  }

  static get bcs() {
    return <T0 extends BcsType<any>>(T0: T0) =>
      bcs.struct(`VecSet<${T0.name}>`, {
        contents: bcs.vector(T0),
      })
  }

  static fromFields<T0 extends Reified<TypeArgument, any>>(
    typeArg: T0,
    fields: Record<string, any>
  ): VecSet<ToTypeArgument<T0>> {
    return VecSet.reified(typeArg).new({
      contents: decodeFromFields(reified.vector(typeArg), fields.contents),
    })
  }

  static fromFieldsWithTypes<T0 extends Reified<TypeArgument, any>>(
    typeArg: T0,
    item: FieldsWithTypes
  ): VecSet<ToTypeArgument<T0>> {
    if (!isVecSet(item.type)) {
      throw new Error('not a VecSet type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return VecSet.reified(typeArg).new({
      contents: decodeFromFieldsWithTypes(reified.vector(typeArg), item.fields.contents),
    })
  }

  static fromBcs<T0 extends Reified<TypeArgument, any>>(
    typeArg: T0,
    data: Uint8Array
  ): VecSet<ToTypeArgument<T0>> {
    const typeArgs = [typeArg]

    return VecSet.fromFields(typeArg, VecSet.bcs(toBcs(typeArgs[0])).parse(data))
  }

  toJSONField() {
    return {
      contents: fieldToJSON<Vector<T0>>(`vector<${this.$typeArg}>`, this.contents),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArg: this.$typeArg, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends Reified<TypeArgument, any>>(
    typeArg: T0,
    field: any
  ): VecSet<ToTypeArgument<T0>> {
    return VecSet.reified(typeArg).new({
      contents: decodeFromJSONField(reified.vector(typeArg), field.contents),
    })
  }

  static fromJSON<T0 extends Reified<TypeArgument, any>>(
    typeArg: T0,
    json: Record<string, any>
  ): VecSet<ToTypeArgument<T0>> {
    if (json.$typeName !== VecSet.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(VecSet.$typeName, extractType(typeArg)),
      [json.$typeArg],
      [typeArg]
    )

    return VecSet.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends Reified<TypeArgument, any>>(
    typeArg: T0,
    content: SuiParsedData
  ): VecSet<ToTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isVecSet(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a VecSet object`)
    }
    return VecSet.fromFieldsWithTypes(typeArg, content)
  }

  static async fetch<T0 extends Reified<TypeArgument, any>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<VecSet<ToTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching VecSet object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isVecSet(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a VecSet object`)
    }
    return VecSet.fromFieldsWithTypes(typeArg, res.data.content)
  }
}
