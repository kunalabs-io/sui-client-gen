import { bcs } from '@mysten/sui/bcs'
import {
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  extractType,
  Reified,
  toBcs,
  ToField,
  ToTypeArgument,
  ToTypeStr,
  TypeArgument,
  VectorClass,
  VectorClassReified,
  fieldToJSON,
} from './reified'
import { composeSuiType, FieldsWithTypes } from './util'

export type VectorElements<T extends TypeArgument> = Array<ToField<T>>

export type VectorReified<T extends TypeArgument> = VectorClassReified<Vector<T>, VectorElements<T>>

export class Vector<T extends TypeArgument> implements VectorClass {
  __VectorClass = true as const

  static readonly $typeName = 'vector'
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [false] as const

  readonly $typeName = 'vector'
  readonly $fullTypeName: `vector<${ToTypeStr<T>}>`
  readonly $typeArgs: [ToTypeStr<T>]
  readonly $isPhantom = [false] as const

  readonly elements: Array<ToField<T>>

  constructor(typeArgs: [ToTypeStr<T>], elements: VectorElements<T>) {
    this.$fullTypeName = composeSuiType(this.$typeName, ...typeArgs) as `vector<${ToTypeStr<T>}>`
    this.$typeArgs = typeArgs

    this.elements = elements
  }

  static reified<T extends Reified<TypeArgument, any>>(T: T): VectorReified<ToTypeArgument<T>> {
    return {
      typeName: Vector.$typeName,
      fullTypeName: composeSuiType(
        Vector.$typeName,
        ...[extractType(T)]
      ) as `vector<${ToTypeStr<ToTypeArgument<T>>}>`,
      typeArgs: [extractType(T)] as [ToTypeStr<ToTypeArgument<T>>],
      isPhantom: Vector.$isPhantom,
      reifiedTypeArgs: [T],
      fromFields: (elements: any[]) => Vector.fromFields(T, elements),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Vector.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => Vector.fromBcs(T, data),
      bcs: Vector.bcs(toBcs(T)),
      fromJSONField: (field: any) => Vector.fromJSONField(T, field),
      fromJSON: (json: any) => Vector.fromJSON(T, json),
      new: (elements: VectorElements<ToTypeArgument<T>>) => {
        return new Vector([extractType(T)], elements)
      },
      kind: 'VectorClassReified',
    }
  }

  static get r() {
    return Vector.reified
  }

  static get bcs() {
    return bcs.vector
  }

  static fromFields<T extends Reified<TypeArgument, any>>(
    typeArg: T,
    elements: any[]
  ): Vector<ToTypeArgument<T>> {
    return Vector.reified(typeArg).new(elements.map(element => decodeFromFields(typeArg, element)))
  }

  static fromFieldsWithTypes<T extends Reified<TypeArgument, any>>(
    typeArg: T,
    item: FieldsWithTypes
  ): Vector<ToTypeArgument<T>> {
    return Vector.reified(typeArg).new(
      (item as unknown as any[]).map((field: any) => decodeFromFieldsWithTypes(typeArg, field))
    )
  }

  static fromBcs<T extends Reified<TypeArgument, any>>(
    typeArg: T,
    data: Uint8Array
  ): Vector<ToTypeArgument<T>> {
    return Vector.fromFields(typeArg, Vector.bcs(toBcs(typeArg)).parse(data))
  }

  toJSONField() {
    return this.elements.map(element => fieldToJSON(this.$typeArgs[0], element))
  }

  toJSON() {
    return {
      $typeName: this.$typeName,
      $typeArgs: this.$typeArgs,
      elements: this.toJSONField(),
    }
  }

  static fromJSONField<T extends Reified<TypeArgument, any>>(
    typeArg: T,
    field: any[]
  ): Vector<ToTypeArgument<T>> {
    return Vector.reified(typeArg).new(field.map(field => decodeFromJSONField(typeArg, field)))
  }

  static fromJSON<T extends Reified<TypeArgument, any>>(
    typeArg: T,
    json: any
  ): Vector<ToTypeArgument<T>> {
    if (json.$typeName !== Vector.$typeName) {
      throw new Error('not a vector json object')
    }

    return Vector.fromJSONField(typeArg, json.elements)
  }
}

export function vector<T extends Reified<TypeArgument, any>>(
  T: T
): VectorClassReified<Vector<ToTypeArgument<T>>, VectorElements<ToTypeArgument<T>>> {
  return Vector.r(T)
}
