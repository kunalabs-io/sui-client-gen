import * as reified from '../../_framework/reified'
import {
  Reified,
  ToField,
  Vector,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  ToTypeStr as ToPhantom,
} from '../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../_framework/util'
import { Bag } from '../bag/structs'
import { UID } from '../object/structs'
import { Table } from '../table/structs'
import { VecSet } from '../vec-set/structs'
import { bcs } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== DenyList =============================== */

export function isDenyList(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x2::deny_list::DenyList'
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface DenyListFields {
  id: ToField<UID>
  lists: ToField<Bag>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class DenyList {
  static readonly $typeName = '0x2::deny_list::DenyList'
  static readonly $numTypeParams = 0

  readonly $fullTypeName = null as unknown as '0x2::deny_list::DenyList'

  readonly $typeName = DenyList.$typeName

  static get bcs() {
    return bcs.struct('DenyList', {
      id: UID.bcs,
      lists: Bag.bcs,
    })
  }

  readonly id: ToField<UID>
  readonly lists: ToField<Bag>

  private constructor(fields: DenyListFields) {
    this.id = fields.id
    this.lists = fields.lists
  }

  static new(fields: DenyListFields): DenyList {
    return new DenyList(fields)
  }

  static reified(): Reified<DenyList> {
    return {
      typeName: DenyList.$typeName,
      fullTypeName: composeSuiType(DenyList.$typeName, ...[]) as '0x2::deny_list::DenyList',
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => DenyList.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => DenyList.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => DenyList.fromBcs(data),
      bcs: DenyList.bcs,
      fromJSONField: (field: any) => DenyList.fromJSONField(field),
      fetch: async (client: SuiClient, id: string) => DenyList.fetch(client, id),
      kind: 'StructClassReified',
    }
  }

  static fromFields(fields: Record<string, any>): DenyList {
    return DenyList.new({
      id: decodeFromFields(UID.reified(), fields.id),
      lists: decodeFromFields(Bag.reified(), fields.lists),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): DenyList {
    if (!isDenyList(item.type)) {
      throw new Error('not a DenyList type')
    }

    return DenyList.new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      lists: decodeFromFieldsWithTypes(Bag.reified(), item.fields.lists),
    })
  }

  static fromBcs(data: Uint8Array): DenyList {
    return DenyList.fromFields(DenyList.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
      lists: this.lists.toJSONField(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, ...this.toJSONField() }
  }

  static fromJSONField(field: any): DenyList {
    return DenyList.new({
      id: decodeFromJSONField(UID.reified(), field.id),
      lists: decodeFromJSONField(Bag.reified(), field.lists),
    })
  }

  static fromJSON(json: Record<string, any>): DenyList {
    if (json.$typeName !== DenyList.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return DenyList.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): DenyList {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isDenyList(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a DenyList object`)
    }
    return DenyList.fromFieldsWithTypes(content)
  }

  static async fetch(client: SuiClient, id: string): Promise<DenyList> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching DenyList object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isDenyList(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a DenyList object`)
    }
    return DenyList.fromFieldsWithTypes(res.data.content)
  }
}

/* ============================== PerTypeList =============================== */

export function isPerTypeList(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x2::deny_list::PerTypeList'
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface PerTypeListFields {
  id: ToField<UID>
  deniedCount: ToField<Table<'address', 'u64'>>
  deniedAddresses: ToField<Table<ToPhantom<Vector<'u8'>>, ToPhantom<VecSet<'address'>>>>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class PerTypeList {
  static readonly $typeName = '0x2::deny_list::PerTypeList'
  static readonly $numTypeParams = 0

  readonly $fullTypeName = null as unknown as '0x2::deny_list::PerTypeList'

  readonly $typeName = PerTypeList.$typeName

  static get bcs() {
    return bcs.struct('PerTypeList', {
      id: UID.bcs,
      denied_count: Table.bcs,
      denied_addresses: Table.bcs,
    })
  }

  readonly id: ToField<UID>
  readonly deniedCount: ToField<Table<'address', 'u64'>>
  readonly deniedAddresses: ToField<Table<ToPhantom<Vector<'u8'>>, ToPhantom<VecSet<'address'>>>>

  private constructor(fields: PerTypeListFields) {
    this.id = fields.id
    this.deniedCount = fields.deniedCount
    this.deniedAddresses = fields.deniedAddresses
  }

  static new(fields: PerTypeListFields): PerTypeList {
    return new PerTypeList(fields)
  }

  static reified(): Reified<PerTypeList> {
    return {
      typeName: PerTypeList.$typeName,
      fullTypeName: composeSuiType(PerTypeList.$typeName, ...[]) as '0x2::deny_list::PerTypeList',
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => PerTypeList.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => PerTypeList.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => PerTypeList.fromBcs(data),
      bcs: PerTypeList.bcs,
      fromJSONField: (field: any) => PerTypeList.fromJSONField(field),
      fetch: async (client: SuiClient, id: string) => PerTypeList.fetch(client, id),
      kind: 'StructClassReified',
    }
  }

  static fromFields(fields: Record<string, any>): PerTypeList {
    return PerTypeList.new({
      id: decodeFromFields(UID.reified(), fields.id),
      deniedCount: decodeFromFields(
        Table.reified(reified.phantom('address'), reified.phantom('u64')),
        fields.denied_count
      ),
      deniedAddresses: decodeFromFields(
        Table.reified(reified.phantom(reified.vector('u8')), VecSet.reified('address')),
        fields.denied_addresses
      ),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): PerTypeList {
    if (!isPerTypeList(item.type)) {
      throw new Error('not a PerTypeList type')
    }

    return PerTypeList.new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      deniedCount: decodeFromFieldsWithTypes(
        Table.reified(reified.phantom('address'), reified.phantom('u64')),
        item.fields.denied_count
      ),
      deniedAddresses: decodeFromFieldsWithTypes(
        Table.reified(reified.phantom(reified.vector('u8')), VecSet.reified('address')),
        item.fields.denied_addresses
      ),
    })
  }

  static fromBcs(data: Uint8Array): PerTypeList {
    return PerTypeList.fromFields(PerTypeList.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
      deniedCount: this.deniedCount.toJSONField(),
      deniedAddresses: this.deniedAddresses.toJSONField(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, ...this.toJSONField() }
  }

  static fromJSONField(field: any): PerTypeList {
    return PerTypeList.new({
      id: decodeFromJSONField(UID.reified(), field.id),
      deniedCount: decodeFromJSONField(
        Table.reified(reified.phantom('address'), reified.phantom('u64')),
        field.deniedCount
      ),
      deniedAddresses: decodeFromJSONField(
        Table.reified(reified.phantom(reified.vector('u8')), VecSet.reified('address')),
        field.deniedAddresses
      ),
    })
  }

  static fromJSON(json: Record<string, any>): PerTypeList {
    if (json.$typeName !== PerTypeList.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return PerTypeList.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): PerTypeList {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isPerTypeList(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a PerTypeList object`)
    }
    return PerTypeList.fromFieldsWithTypes(content)
  }

  static async fetch(client: SuiClient, id: string): Promise<PerTypeList> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching PerTypeList object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isPerTypeList(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a PerTypeList object`)
    }
    return PerTypeList.fromFieldsWithTypes(res.data.content)
  }
}
