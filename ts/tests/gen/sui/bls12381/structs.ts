/** Group operations of BLS12-381. */

import { bcs } from '@mysten/sui/bcs'
import { SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromBase64 } from '@mysten/sui/utils'
import {
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  phantom,
  PhantomReified,
  Reified,
  StructClass,
  ToField,
  ToJSON,
  ToTypeStr,
} from '../../_framework/reified'
import {
  composeSuiType,
  compressSuiType,
  fetchObjectBcs,
  FieldsWithTypes,
  SupportedSuiClient,
} from '../../_framework/util'

/* ============================== Scalar =============================== */

export function isScalar(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::bls12381::Scalar`
}

export interface ScalarFields {
  dummyField: ToField<'bool'>
}

export type ScalarReified = Reified<Scalar, ScalarFields>

export type ScalarJSONField = {
  dummyField: boolean
}

export type ScalarJSON = {
  $typeName: typeof Scalar.$typeName
  $typeArgs: []
} & ScalarJSONField

export class Scalar implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::bls12381::Scalar` = `0x2::bls12381::Scalar` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName: typeof Scalar.$typeName = Scalar.$typeName
  readonly $fullTypeName: `0x2::bls12381::Scalar`
  readonly $typeArgs: []
  readonly $isPhantom: typeof Scalar.$isPhantom = Scalar.$isPhantom

  readonly dummyField: ToField<'bool'>

  private constructor(typeArgs: [], fields: ScalarFields) {
    this.$fullTypeName = composeSuiType(
      Scalar.$typeName,
      ...typeArgs,
    ) as `0x2::bls12381::Scalar`
    this.$typeArgs = typeArgs

    this.dummyField = fields.dummyField
  }

  static reified(): ScalarReified {
    const reifiedBcs = Scalar.bcs
    return {
      typeName: Scalar.$typeName,
      fullTypeName: composeSuiType(
        Scalar.$typeName,
        ...[],
      ) as `0x2::bls12381::Scalar`,
      typeArgs: [] as [],
      isPhantom: Scalar.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => Scalar.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Scalar.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => Scalar.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => Scalar.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => Scalar.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => Scalar.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => Scalar.fromSuiObjectData(content),
      fetch: async (client: SupportedSuiClient, id: string) => Scalar.fetch(client, id),
      new: (fields: ScalarFields) => {
        return new Scalar([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): ScalarReified {
    return Scalar.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<Scalar>> {
    return phantom(Scalar.reified())
  }

  static get p(): PhantomReified<ToTypeStr<Scalar>> {
    return Scalar.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('Scalar', {
      dummy_field: bcs.bool(),
    })
  }

  private static cachedBcs: ReturnType<typeof Scalar.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof Scalar.instantiateBcs> {
    if (!Scalar.cachedBcs) {
      Scalar.cachedBcs = Scalar.instantiateBcs()
    }
    return Scalar.cachedBcs
  }

  static fromFields(fields: Record<string, any>): Scalar {
    return Scalar.reified().new({
      dummyField: decodeFromFields('bool', fields.dummy_field),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Scalar {
    if (!isScalar(item.type)) {
      throw new Error('not a Scalar type')
    }

    return Scalar.reified().new({
      dummyField: decodeFromFieldsWithTypes('bool', item.fields.dummy_field),
    })
  }

  static fromBcs(data: Uint8Array): Scalar {
    return Scalar.fromFields(Scalar.bcs.parse(data))
  }

  toJSONField(): ScalarJSONField {
    return {
      dummyField: this.dummyField,
    }
  }

  toJSON(): ScalarJSON {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): Scalar {
    return Scalar.reified().new({
      dummyField: decodeFromJSONField('bool', field.dummyField),
    })
  }

  static fromJSON(json: Record<string, any>): Scalar {
    if (json.$typeName !== Scalar.$typeName) {
      throw new Error(
        `not a Scalar json object: expected '${Scalar.$typeName}' but got '${json.$typeName}'`,
      )
    }

    return Scalar.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): Scalar {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isScalar(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Scalar object`)
    }
    return Scalar.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): Scalar {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isScalar(data.bcs.type)) {
        throw new Error(`object at is not a Scalar object`)
      }

      return Scalar.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Scalar.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.',
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<Scalar> {
    const res = await fetchObjectBcs(client, id)
    if (!isScalar(res.type)) {
      throw new Error(`object at id ${id} is not a Scalar object`)
    }

    return Scalar.fromBcs(res.bcsBytes)
  }
}

/* ============================== G1 =============================== */

export function isG1(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::bls12381::G1`
}

export interface G1Fields {
  dummyField: ToField<'bool'>
}

export type G1Reified = Reified<G1, G1Fields>

export type G1JSONField = {
  dummyField: boolean
}

export type G1JSON = {
  $typeName: typeof G1.$typeName
  $typeArgs: []
} & G1JSONField

export class G1 implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::bls12381::G1` = `0x2::bls12381::G1` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName: typeof G1.$typeName = G1.$typeName
  readonly $fullTypeName: `0x2::bls12381::G1`
  readonly $typeArgs: []
  readonly $isPhantom: typeof G1.$isPhantom = G1.$isPhantom

  readonly dummyField: ToField<'bool'>

  private constructor(typeArgs: [], fields: G1Fields) {
    this.$fullTypeName = composeSuiType(
      G1.$typeName,
      ...typeArgs,
    ) as `0x2::bls12381::G1`
    this.$typeArgs = typeArgs

    this.dummyField = fields.dummyField
  }

  static reified(): G1Reified {
    const reifiedBcs = G1.bcs
    return {
      typeName: G1.$typeName,
      fullTypeName: composeSuiType(
        G1.$typeName,
        ...[],
      ) as `0x2::bls12381::G1`,
      typeArgs: [] as [],
      isPhantom: G1.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => G1.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => G1.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => G1.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => G1.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => G1.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => G1.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => G1.fromSuiObjectData(content),
      fetch: async (client: SupportedSuiClient, id: string) => G1.fetch(client, id),
      new: (fields: G1Fields) => {
        return new G1([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): G1Reified {
    return G1.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<G1>> {
    return phantom(G1.reified())
  }

  static get p(): PhantomReified<ToTypeStr<G1>> {
    return G1.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('G1', {
      dummy_field: bcs.bool(),
    })
  }

  private static cachedBcs: ReturnType<typeof G1.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof G1.instantiateBcs> {
    if (!G1.cachedBcs) {
      G1.cachedBcs = G1.instantiateBcs()
    }
    return G1.cachedBcs
  }

  static fromFields(fields: Record<string, any>): G1 {
    return G1.reified().new({
      dummyField: decodeFromFields('bool', fields.dummy_field),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): G1 {
    if (!isG1(item.type)) {
      throw new Error('not a G1 type')
    }

    return G1.reified().new({
      dummyField: decodeFromFieldsWithTypes('bool', item.fields.dummy_field),
    })
  }

  static fromBcs(data: Uint8Array): G1 {
    return G1.fromFields(G1.bcs.parse(data))
  }

  toJSONField(): G1JSONField {
    return {
      dummyField: this.dummyField,
    }
  }

  toJSON(): G1JSON {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): G1 {
    return G1.reified().new({
      dummyField: decodeFromJSONField('bool', field.dummyField),
    })
  }

  static fromJSON(json: Record<string, any>): G1 {
    if (json.$typeName !== G1.$typeName) {
      throw new Error(
        `not a G1 json object: expected '${G1.$typeName}' but got '${json.$typeName}'`,
      )
    }

    return G1.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): G1 {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isG1(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a G1 object`)
    }
    return G1.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): G1 {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isG1(data.bcs.type)) {
        throw new Error(`object at is not a G1 object`)
      }

      return G1.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return G1.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.',
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<G1> {
    const res = await fetchObjectBcs(client, id)
    if (!isG1(res.type)) {
      throw new Error(`object at id ${id} is not a G1 object`)
    }

    return G1.fromBcs(res.bcsBytes)
  }
}

/* ============================== G2 =============================== */

export function isG2(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::bls12381::G2`
}

export interface G2Fields {
  dummyField: ToField<'bool'>
}

export type G2Reified = Reified<G2, G2Fields>

export type G2JSONField = {
  dummyField: boolean
}

export type G2JSON = {
  $typeName: typeof G2.$typeName
  $typeArgs: []
} & G2JSONField

export class G2 implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::bls12381::G2` = `0x2::bls12381::G2` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName: typeof G2.$typeName = G2.$typeName
  readonly $fullTypeName: `0x2::bls12381::G2`
  readonly $typeArgs: []
  readonly $isPhantom: typeof G2.$isPhantom = G2.$isPhantom

  readonly dummyField: ToField<'bool'>

  private constructor(typeArgs: [], fields: G2Fields) {
    this.$fullTypeName = composeSuiType(
      G2.$typeName,
      ...typeArgs,
    ) as `0x2::bls12381::G2`
    this.$typeArgs = typeArgs

    this.dummyField = fields.dummyField
  }

  static reified(): G2Reified {
    const reifiedBcs = G2.bcs
    return {
      typeName: G2.$typeName,
      fullTypeName: composeSuiType(
        G2.$typeName,
        ...[],
      ) as `0x2::bls12381::G2`,
      typeArgs: [] as [],
      isPhantom: G2.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => G2.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => G2.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => G2.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => G2.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => G2.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => G2.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => G2.fromSuiObjectData(content),
      fetch: async (client: SupportedSuiClient, id: string) => G2.fetch(client, id),
      new: (fields: G2Fields) => {
        return new G2([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): G2Reified {
    return G2.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<G2>> {
    return phantom(G2.reified())
  }

  static get p(): PhantomReified<ToTypeStr<G2>> {
    return G2.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('G2', {
      dummy_field: bcs.bool(),
    })
  }

  private static cachedBcs: ReturnType<typeof G2.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof G2.instantiateBcs> {
    if (!G2.cachedBcs) {
      G2.cachedBcs = G2.instantiateBcs()
    }
    return G2.cachedBcs
  }

  static fromFields(fields: Record<string, any>): G2 {
    return G2.reified().new({
      dummyField: decodeFromFields('bool', fields.dummy_field),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): G2 {
    if (!isG2(item.type)) {
      throw new Error('not a G2 type')
    }

    return G2.reified().new({
      dummyField: decodeFromFieldsWithTypes('bool', item.fields.dummy_field),
    })
  }

  static fromBcs(data: Uint8Array): G2 {
    return G2.fromFields(G2.bcs.parse(data))
  }

  toJSONField(): G2JSONField {
    return {
      dummyField: this.dummyField,
    }
  }

  toJSON(): G2JSON {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): G2 {
    return G2.reified().new({
      dummyField: decodeFromJSONField('bool', field.dummyField),
    })
  }

  static fromJSON(json: Record<string, any>): G2 {
    if (json.$typeName !== G2.$typeName) {
      throw new Error(
        `not a G2 json object: expected '${G2.$typeName}' but got '${json.$typeName}'`,
      )
    }

    return G2.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): G2 {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isG2(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a G2 object`)
    }
    return G2.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): G2 {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isG2(data.bcs.type)) {
        throw new Error(`object at is not a G2 object`)
      }

      return G2.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return G2.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.',
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<G2> {
    const res = await fetchObjectBcs(client, id)
    if (!isG2(res.type)) {
      throw new Error(`object at id ${id} is not a G2 object`)
    }

    return G2.fromBcs(res.bcsBytes)
  }
}

/* ============================== GT =============================== */

export function isGT(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::bls12381::GT`
}

export interface GTFields {
  dummyField: ToField<'bool'>
}

export type GTReified = Reified<GT, GTFields>

export type GTJSONField = {
  dummyField: boolean
}

export type GTJSON = {
  $typeName: typeof GT.$typeName
  $typeArgs: []
} & GTJSONField

export class GT implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::bls12381::GT` = `0x2::bls12381::GT` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName: typeof GT.$typeName = GT.$typeName
  readonly $fullTypeName: `0x2::bls12381::GT`
  readonly $typeArgs: []
  readonly $isPhantom: typeof GT.$isPhantom = GT.$isPhantom

  readonly dummyField: ToField<'bool'>

  private constructor(typeArgs: [], fields: GTFields) {
    this.$fullTypeName = composeSuiType(
      GT.$typeName,
      ...typeArgs,
    ) as `0x2::bls12381::GT`
    this.$typeArgs = typeArgs

    this.dummyField = fields.dummyField
  }

  static reified(): GTReified {
    const reifiedBcs = GT.bcs
    return {
      typeName: GT.$typeName,
      fullTypeName: composeSuiType(
        GT.$typeName,
        ...[],
      ) as `0x2::bls12381::GT`,
      typeArgs: [] as [],
      isPhantom: GT.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => GT.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => GT.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => GT.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => GT.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => GT.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => GT.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => GT.fromSuiObjectData(content),
      fetch: async (client: SupportedSuiClient, id: string) => GT.fetch(client, id),
      new: (fields: GTFields) => {
        return new GT([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): GTReified {
    return GT.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<GT>> {
    return phantom(GT.reified())
  }

  static get p(): PhantomReified<ToTypeStr<GT>> {
    return GT.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('GT', {
      dummy_field: bcs.bool(),
    })
  }

  private static cachedBcs: ReturnType<typeof GT.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof GT.instantiateBcs> {
    if (!GT.cachedBcs) {
      GT.cachedBcs = GT.instantiateBcs()
    }
    return GT.cachedBcs
  }

  static fromFields(fields: Record<string, any>): GT {
    return GT.reified().new({
      dummyField: decodeFromFields('bool', fields.dummy_field),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): GT {
    if (!isGT(item.type)) {
      throw new Error('not a GT type')
    }

    return GT.reified().new({
      dummyField: decodeFromFieldsWithTypes('bool', item.fields.dummy_field),
    })
  }

  static fromBcs(data: Uint8Array): GT {
    return GT.fromFields(GT.bcs.parse(data))
  }

  toJSONField(): GTJSONField {
    return {
      dummyField: this.dummyField,
    }
  }

  toJSON(): GTJSON {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): GT {
    return GT.reified().new({
      dummyField: decodeFromJSONField('bool', field.dummyField),
    })
  }

  static fromJSON(json: Record<string, any>): GT {
    if (json.$typeName !== GT.$typeName) {
      throw new Error(
        `not a GT json object: expected '${GT.$typeName}' but got '${json.$typeName}'`,
      )
    }

    return GT.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): GT {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isGT(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a GT object`)
    }
    return GT.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): GT {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isGT(data.bcs.type)) {
        throw new Error(`object at is not a GT object`)
      }

      return GT.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return GT.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.',
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<GT> {
    const res = await fetchObjectBcs(client, id)
    if (!isGT(res.type)) {
      throw new Error(`object at id ${id} is not a GT object`)
    }

    return GT.fromBcs(res.bcsBytes)
  }
}

/* ============================== UncompressedG1 =============================== */

export function isUncompressedG1(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::bls12381::UncompressedG1`
}

export interface UncompressedG1Fields {
  dummyField: ToField<'bool'>
}

export type UncompressedG1Reified = Reified<UncompressedG1, UncompressedG1Fields>

export type UncompressedG1JSONField = {
  dummyField: boolean
}

export type UncompressedG1JSON = {
  $typeName: typeof UncompressedG1.$typeName
  $typeArgs: []
} & UncompressedG1JSONField

export class UncompressedG1 implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::bls12381::UncompressedG1` =
    `0x2::bls12381::UncompressedG1` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName: typeof UncompressedG1.$typeName = UncompressedG1.$typeName
  readonly $fullTypeName: `0x2::bls12381::UncompressedG1`
  readonly $typeArgs: []
  readonly $isPhantom: typeof UncompressedG1.$isPhantom = UncompressedG1.$isPhantom

  readonly dummyField: ToField<'bool'>

  private constructor(typeArgs: [], fields: UncompressedG1Fields) {
    this.$fullTypeName = composeSuiType(
      UncompressedG1.$typeName,
      ...typeArgs,
    ) as `0x2::bls12381::UncompressedG1`
    this.$typeArgs = typeArgs

    this.dummyField = fields.dummyField
  }

  static reified(): UncompressedG1Reified {
    const reifiedBcs = UncompressedG1.bcs
    return {
      typeName: UncompressedG1.$typeName,
      fullTypeName: composeSuiType(
        UncompressedG1.$typeName,
        ...[],
      ) as `0x2::bls12381::UncompressedG1`,
      typeArgs: [] as [],
      isPhantom: UncompressedG1.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => UncompressedG1.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => UncompressedG1.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => UncompressedG1.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => UncompressedG1.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => UncompressedG1.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => UncompressedG1.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => UncompressedG1.fromSuiObjectData(content),
      fetch: async (client: SupportedSuiClient, id: string) => UncompressedG1.fetch(client, id),
      new: (fields: UncompressedG1Fields) => {
        return new UncompressedG1([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): UncompressedG1Reified {
    return UncompressedG1.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<UncompressedG1>> {
    return phantom(UncompressedG1.reified())
  }

  static get p(): PhantomReified<ToTypeStr<UncompressedG1>> {
    return UncompressedG1.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('UncompressedG1', {
      dummy_field: bcs.bool(),
    })
  }

  private static cachedBcs: ReturnType<typeof UncompressedG1.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof UncompressedG1.instantiateBcs> {
    if (!UncompressedG1.cachedBcs) {
      UncompressedG1.cachedBcs = UncompressedG1.instantiateBcs()
    }
    return UncompressedG1.cachedBcs
  }

  static fromFields(fields: Record<string, any>): UncompressedG1 {
    return UncompressedG1.reified().new({
      dummyField: decodeFromFields('bool', fields.dummy_field),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): UncompressedG1 {
    if (!isUncompressedG1(item.type)) {
      throw new Error('not a UncompressedG1 type')
    }

    return UncompressedG1.reified().new({
      dummyField: decodeFromFieldsWithTypes('bool', item.fields.dummy_field),
    })
  }

  static fromBcs(data: Uint8Array): UncompressedG1 {
    return UncompressedG1.fromFields(UncompressedG1.bcs.parse(data))
  }

  toJSONField(): UncompressedG1JSONField {
    return {
      dummyField: this.dummyField,
    }
  }

  toJSON(): UncompressedG1JSON {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): UncompressedG1 {
    return UncompressedG1.reified().new({
      dummyField: decodeFromJSONField('bool', field.dummyField),
    })
  }

  static fromJSON(json: Record<string, any>): UncompressedG1 {
    if (json.$typeName !== UncompressedG1.$typeName) {
      throw new Error(
        `not a UncompressedG1 json object: expected '${UncompressedG1.$typeName}' but got '${json.$typeName}'`,
      )
    }

    return UncompressedG1.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): UncompressedG1 {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isUncompressedG1(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a UncompressedG1 object`)
    }
    return UncompressedG1.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): UncompressedG1 {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isUncompressedG1(data.bcs.type)) {
        throw new Error(`object at is not a UncompressedG1 object`)
      }

      return UncompressedG1.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return UncompressedG1.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.',
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<UncompressedG1> {
    const res = await fetchObjectBcs(client, id)
    if (!isUncompressedG1(res.type)) {
      throw new Error(`object at id ${id} is not a UncompressedG1 object`)
    }

    return UncompressedG1.fromBcs(res.bcsBytes)
  }
}
