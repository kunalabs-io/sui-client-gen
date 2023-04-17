import {
  SuiMoveObject,
  is,
  ObjectCallArg,
  ObjectId,
  TransactionArgument,
  TransactionBlock,
} from '@mysten/sui.js'

export type ObjectArg = ObjectId | ObjectCallArg | TransactionArgument

export function obj(tx: TransactionBlock, arg: ObjectArg) {
  return is(arg, TransactionArgument) ? arg : tx.object(arg)
}

export interface FieldsWithTypes {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  fields: Record<string, any>
  type: string
}

export type PrimitiveType = string | number | boolean | bigint

export type GenericFieldParser<T> = (item: FieldsWithTypes | PrimitiveType) => T

function unreachable(): never {
  throw new Error('This code is unreachable')
}

export function parserFor<T>(strct: {
  fromFieldsWithTypes: (item: FieldsWithTypes) => T
}): GenericFieldParser<T> {
  return (field: FieldsWithTypes | PrimitiveType): T => {
    if (typeof field === 'object') {
      return strct.fromFieldsWithTypes(field)
    }
    unreachable()
  }
}

export function boolFieldParser(item: FieldsWithTypes | PrimitiveType): boolean {
  if (typeof item !== 'boolean') {
    throw new Error(`not a bool type`)
  }

  return item
}

export function idInstanceDecoder(field: SuiMoveObject): string {
  if (typeof field !== 'string') {
    throw new Error(`not an ID type`)
  }
  return field
}

export function uidInstanceDecoder(field: SuiMoveObject): string {
  if ('id' in field === false) {
    throw new Error(`not an UID type`)
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (field as any).id
}

export function typeNameInstanceDecoder(field: any): string {
  if ('name' in field.fields === false) {
    throw new Error(`not a TypeName type`)
  }
  return field.fields.name
}
