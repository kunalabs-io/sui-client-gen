import {
  PhantomTypeArgument,
  ReifiedPhantomTypeArgument,
  ToField,
  ToPhantomTypeArgument,
  ToTypeArgument,
  assertFieldsWithTypesArgsMatch,
  assertReifiedTypeArgsMatch,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  extractType,
} from '../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../_framework/util'
import { ID } from '../object/structs'
import { bcs } from '@mysten/bcs'

/* ============================== Receiving =============================== */

export function isReceiving(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::transfer::Receiving<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface ReceivingFields<T extends PhantomTypeArgument> {
  id: ToField<ID>
  version: ToField<'u64'>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Receiving<T extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::transfer::Receiving'
  static readonly $numTypeParams = 1

  __reifiedFullTypeString = null as unknown as `0x2::transfer::Receiving<${T}>`

  readonly $typeName = Receiving.$typeName

  static get bcs() {
    return bcs.struct('Receiving', {
      id: ID.bcs,
      version: bcs.u64(),
    })
  }

  readonly $typeArg: string

  readonly id: ToField<ID>
  readonly version: ToField<'u64'>

  private constructor(typeArg: string, fields: ReceivingFields<T>) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.version = fields.version
  }

  static new<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    fields: ReceivingFields<ToPhantomTypeArgument<T>>
  ): Receiving<ToPhantomTypeArgument<T>> {
    return new Receiving(extractType(typeArg), fields)
  }

  static reified<T extends ReifiedPhantomTypeArgument>(T: T) {
    return {
      typeName: Receiving.$typeName,
      typeArgs: [T],
      fullTypeName: composeSuiType(
        Receiving.$typeName,
        ...[extractType(T)]
      ) as `0x2::transfer::Receiving<${ToPhantomTypeArgument<T>}>`,
      fromFields: (fields: Record<string, any>) => Receiving.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Receiving.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => Receiving.fromBcs(T, data),
      bcs: Receiving.bcs,
      fromJSONField: (field: any) => Receiving.fromJSONField(T, field),
      __class: null as unknown as ReturnType<typeof Receiving.new<ToTypeArgument<T>>>,
    }
  }

  static fromFields<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    fields: Record<string, any>
  ): Receiving<ToPhantomTypeArgument<T>> {
    return Receiving.new(typeArg, {
      id: decodeFromFields(ID.reified(), fields.id),
      version: decodeFromFields('u64', fields.version),
    })
  }

  static fromFieldsWithTypes<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    item: FieldsWithTypes
  ): Receiving<ToPhantomTypeArgument<T>> {
    if (!isReceiving(item.type)) {
      throw new Error('not a Receiving type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Receiving.new(typeArg, {
      id: decodeFromFieldsWithTypes(ID.reified(), item.fields.id),
      version: decodeFromFieldsWithTypes('u64', item.fields.version),
    })
  }

  static fromBcs<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    data: Uint8Array
  ): Receiving<ToPhantomTypeArgument<T>> {
    return Receiving.fromFields(typeArg, Receiving.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
      version: this.version.toString(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArg: this.$typeArg, ...this.toJSONField() }
  }

  static fromJSONField<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    field: any
  ): Receiving<ToPhantomTypeArgument<T>> {
    return Receiving.new(typeArg, {
      id: decodeFromJSONField(ID.reified(), field.id),
      version: decodeFromJSONField('u64', field.version),
    })
  }

  static fromJSON<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    json: Record<string, any>
  ): Receiving<ToPhantomTypeArgument<T>> {
    if (json.$typeName !== Receiving.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Receiving.$typeName, extractType(typeArg)),
      [json.$typeArg],
      [typeArg]
    )

    return Receiving.fromJSONField(typeArg, json)
  }
}
