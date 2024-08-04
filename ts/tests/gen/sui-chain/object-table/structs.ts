import {
  PhantomReified,
  PhantomToTypeStr,
  PhantomTypeArgument,
  Reified,
  StructClass,
  ToField,
  ToPhantomTypeArgument,
  ToTypeStr,
  assertFieldsWithTypesArgsMatch,
  assertReifiedTypeArgsMatch,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  extractType,
  phantom,
} from '../../_framework/reified'
import {
  FieldsWithTypes,
  composeSuiType,
  compressSuiType,
  parseTypeName,
} from '../../_framework/util'
import { PKG_V21 } from '../index'
import { UID } from '../object/structs'
import { bcs } from '@mysten/sui/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui/client'
import { fromB64 } from '@mysten/sui/utils'

/* ============================== ObjectTable =============================== */

export function isObjectTable(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`${PKG_V21}::object_table::ObjectTable` + '<')
}

export interface ObjectTableFields<T0 extends PhantomTypeArgument, T1 extends PhantomTypeArgument> {
  id: ToField<UID>
  size: ToField<'u64'>
}

export type ObjectTableReified<
  T0 extends PhantomTypeArgument,
  T1 extends PhantomTypeArgument,
> = Reified<ObjectTable<T0, T1>, ObjectTableFields<T0, T1>>

export class ObjectTable<T0 extends PhantomTypeArgument, T1 extends PhantomTypeArgument>
  implements StructClass
{
  static readonly $typeName = `${PKG_V21}::object_table::ObjectTable`
  static readonly $numTypeParams = 2

  readonly $typeName = ObjectTable.$typeName

  readonly $fullTypeName: `${typeof PKG_V21}::object_table::ObjectTable<${PhantomToTypeStr<T0>}, ${PhantomToTypeStr<T1>}>`

  readonly $typeArgs: [PhantomToTypeStr<T0>, PhantomToTypeStr<T1>]

  readonly id: ToField<UID>
  readonly size: ToField<'u64'>

  private constructor(
    typeArgs: [PhantomToTypeStr<T0>, PhantomToTypeStr<T1>],
    fields: ObjectTableFields<T0, T1>
  ) {
    this.$fullTypeName = composeSuiType(
      ObjectTable.$typeName,
      ...typeArgs
    ) as `${typeof PKG_V21}::object_table::ObjectTable<${PhantomToTypeStr<T0>}, ${PhantomToTypeStr<T1>}>`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.size = fields.size
  }

  static reified<
    T0 extends PhantomReified<PhantomTypeArgument>,
    T1 extends PhantomReified<PhantomTypeArgument>,
  >(T0: T0, T1: T1): ObjectTableReified<ToPhantomTypeArgument<T0>, ToPhantomTypeArgument<T1>> {
    return {
      typeName: ObjectTable.$typeName,
      fullTypeName: composeSuiType(
        ObjectTable.$typeName,
        ...[extractType(T0), extractType(T1)]
      ) as `${typeof PKG_V21}::object_table::ObjectTable<${PhantomToTypeStr<ToPhantomTypeArgument<T0>>}, ${PhantomToTypeStr<ToPhantomTypeArgument<T1>>}>`,
      typeArgs: [extractType(T0), extractType(T1)] as [
        PhantomToTypeStr<ToPhantomTypeArgument<T0>>,
        PhantomToTypeStr<ToPhantomTypeArgument<T1>>,
      ],
      reifiedTypeArgs: [T0, T1],
      fromFields: (fields: Record<string, any>) => ObjectTable.fromFields([T0, T1], fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        ObjectTable.fromFieldsWithTypes([T0, T1], item),
      fromBcs: (data: Uint8Array) => ObjectTable.fromBcs([T0, T1], data),
      bcs: ObjectTable.bcs,
      fromJSONField: (field: any) => ObjectTable.fromJSONField([T0, T1], field),
      fromJSON: (json: Record<string, any>) => ObjectTable.fromJSON([T0, T1], json),
      fromSuiParsedData: (content: SuiParsedData) =>
        ObjectTable.fromSuiParsedData([T0, T1], content),
      fetch: async (client: SuiClient, id: string) => ObjectTable.fetch(client, [T0, T1], id),
      new: (fields: ObjectTableFields<ToPhantomTypeArgument<T0>, ToPhantomTypeArgument<T1>>) => {
        return new ObjectTable([extractType(T0), extractType(T1)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return ObjectTable.reified
  }

  static phantom<
    T0 extends PhantomReified<PhantomTypeArgument>,
    T1 extends PhantomReified<PhantomTypeArgument>,
  >(
    T0: T0,
    T1: T1
  ): PhantomReified<ToTypeStr<ObjectTable<ToPhantomTypeArgument<T0>, ToPhantomTypeArgument<T1>>>> {
    return phantom(ObjectTable.reified(T0, T1))
  }
  static get p() {
    return ObjectTable.phantom
  }

  static get bcs() {
    return bcs.struct('ObjectTable', {
      id: UID.bcs,
      size: bcs.u64(),
    })
  }

  static fromFields<
    T0 extends PhantomReified<PhantomTypeArgument>,
    T1 extends PhantomReified<PhantomTypeArgument>,
  >(
    typeArgs: [T0, T1],
    fields: Record<string, any>
  ): ObjectTable<ToPhantomTypeArgument<T0>, ToPhantomTypeArgument<T1>> {
    return ObjectTable.reified(typeArgs[0], typeArgs[1]).new({
      id: decodeFromFields(UID.reified(), fields.id),
      size: decodeFromFields('u64', fields.size),
    })
  }

  static fromFieldsWithTypes<
    T0 extends PhantomReified<PhantomTypeArgument>,
    T1 extends PhantomReified<PhantomTypeArgument>,
  >(
    typeArgs: [T0, T1],
    item: FieldsWithTypes
  ): ObjectTable<ToPhantomTypeArgument<T0>, ToPhantomTypeArgument<T1>> {
    if (!isObjectTable(item.type)) {
      throw new Error('not a ObjectTable type')
    }
    assertFieldsWithTypesArgsMatch(item, typeArgs)

    return ObjectTable.reified(typeArgs[0], typeArgs[1]).new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      size: decodeFromFieldsWithTypes('u64', item.fields.size),
    })
  }

  static fromBcs<
    T0 extends PhantomReified<PhantomTypeArgument>,
    T1 extends PhantomReified<PhantomTypeArgument>,
  >(
    typeArgs: [T0, T1],
    data: Uint8Array
  ): ObjectTable<ToPhantomTypeArgument<T0>, ToPhantomTypeArgument<T1>> {
    return ObjectTable.fromFields(typeArgs, ObjectTable.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
      size: this.size.toString(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<
    T0 extends PhantomReified<PhantomTypeArgument>,
    T1 extends PhantomReified<PhantomTypeArgument>,
  >(
    typeArgs: [T0, T1],
    field: any
  ): ObjectTable<ToPhantomTypeArgument<T0>, ToPhantomTypeArgument<T1>> {
    return ObjectTable.reified(typeArgs[0], typeArgs[1]).new({
      id: decodeFromJSONField(UID.reified(), field.id),
      size: decodeFromJSONField('u64', field.size),
    })
  }

  static fromJSON<
    T0 extends PhantomReified<PhantomTypeArgument>,
    T1 extends PhantomReified<PhantomTypeArgument>,
  >(
    typeArgs: [T0, T1],
    json: Record<string, any>
  ): ObjectTable<ToPhantomTypeArgument<T0>, ToPhantomTypeArgument<T1>> {
    if (json.$typeName !== ObjectTable.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(ObjectTable.$typeName, ...typeArgs.map(extractType)),
      json.$typeArgs,
      typeArgs
    )

    return ObjectTable.fromJSONField(typeArgs, json)
  }

  static fromSuiParsedData<
    T0 extends PhantomReified<PhantomTypeArgument>,
    T1 extends PhantomReified<PhantomTypeArgument>,
  >(
    typeArgs: [T0, T1],
    content: SuiParsedData
  ): ObjectTable<ToPhantomTypeArgument<T0>, ToPhantomTypeArgument<T1>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isObjectTable(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a ObjectTable object`)
    }
    return ObjectTable.fromFieldsWithTypes(typeArgs, content)
  }

  static async fetch<
    T0 extends PhantomReified<PhantomTypeArgument>,
    T1 extends PhantomReified<PhantomTypeArgument>,
  >(
    client: SuiClient,
    typeArgs: [T0, T1],
    id: string
  ): Promise<ObjectTable<ToPhantomTypeArgument<T0>, ToPhantomTypeArgument<T1>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching ObjectTable object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isObjectTable(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a ObjectTable object`)
    }

    const gotTypeArgs = parseTypeName(res.data.bcs.type).typeArgs
    if (gotTypeArgs.length !== 2) {
      throw new Error(
        `type argument mismatch: expected 2 type arguments but got ${gotTypeArgs.length}`
      )
    }
    for (let i = 0; i < 2; i++) {
      const gotTypeArg = compressSuiType(gotTypeArgs[i])
      const expectedTypeArg = compressSuiType(extractType(typeArgs[i]))
      if (gotTypeArg !== expectedTypeArg) {
        throw new Error(
          `type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`
        )
      }
    }

    return ObjectTable.fromBcs(typeArgs, fromB64(res.data.bcs.bcsBytes))
  }
}
