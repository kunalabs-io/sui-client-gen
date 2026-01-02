import * as reified from '../../../../_framework/reified'
import {
  PhantomReified,
  Reified,
  StructClass,
  ToField,
  ToTypeStr,
  ToTypeStr as ToPhantom,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  phantom,
} from '../../../../_framework/reified'
import {
  FieldsWithTypes,
  composeSuiType,
  compressSuiType,
  parseTypeName,
} from '../../../../_framework/util'
import { Balance } from '../../../../sui/balance/structs'
import { SUI } from '../../../../sui/sui/structs'
import { bcs } from '@mysten/sui/bcs'
import { SuiClient, SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromB64 } from '@mysten/sui/utils'

/* ============================== StorageFund =============================== */

export function isStorageFund(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x3::storage_fund::StorageFund`
}

export interface StorageFundFields {
  totalObjectStorageRebates: ToField<Balance<ToPhantom<SUI>>>
  nonRefundableBalance: ToField<Balance<ToPhantom<SUI>>>
}

export type StorageFundReified = Reified<StorageFund, StorageFundFields>

export class StorageFund implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x3::storage_fund::StorageFund`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = StorageFund.$typeName
  readonly $fullTypeName: `0x3::storage_fund::StorageFund`
  readonly $typeArgs: []
  readonly $isPhantom = StorageFund.$isPhantom

  readonly totalObjectStorageRebates: ToField<Balance<ToPhantom<SUI>>>
  readonly nonRefundableBalance: ToField<Balance<ToPhantom<SUI>>>

  private constructor(typeArgs: [], fields: StorageFundFields) {
    this.$fullTypeName = composeSuiType(
      StorageFund.$typeName,
      ...typeArgs
    ) as `0x3::storage_fund::StorageFund`
    this.$typeArgs = typeArgs

    this.totalObjectStorageRebates = fields.totalObjectStorageRebates
    this.nonRefundableBalance = fields.nonRefundableBalance
  }

  static reified(): StorageFundReified {
    const reifiedBcs = StorageFund.bcs
    return {
      typeName: StorageFund.$typeName,
      fullTypeName: composeSuiType(
        StorageFund.$typeName,
        ...[]
      ) as `0x3::storage_fund::StorageFund`,
      typeArgs: [] as [],
      isPhantom: StorageFund.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => StorageFund.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => StorageFund.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => StorageFund.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => StorageFund.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => StorageFund.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => StorageFund.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => StorageFund.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => StorageFund.fetch(client, id),
      new: (fields: StorageFundFields) => {
        return new StorageFund([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return StorageFund.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<StorageFund>> {
    return phantom(StorageFund.reified())
  }

  static get p() {
    return StorageFund.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('StorageFund', {
      total_object_storage_rebates: Balance.bcs,
      non_refundable_balance: Balance.bcs,
    })
  }

  private static cachedBcs: ReturnType<typeof StorageFund.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof StorageFund.instantiateBcs> {
    if (!StorageFund.cachedBcs) {
      StorageFund.cachedBcs = StorageFund.instantiateBcs()
    }
    return StorageFund.cachedBcs
  }

  static fromFields(fields: Record<string, any>): StorageFund {
    return StorageFund.reified().new({
      totalObjectStorageRebates: decodeFromFields(
        Balance.reified(reified.phantom(SUI.reified())),
        fields.total_object_storage_rebates
      ),
      nonRefundableBalance: decodeFromFields(
        Balance.reified(reified.phantom(SUI.reified())),
        fields.non_refundable_balance
      ),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): StorageFund {
    if (!isStorageFund(item.type)) {
      throw new Error('not a StorageFund type')
    }

    return StorageFund.reified().new({
      totalObjectStorageRebates: decodeFromFieldsWithTypes(
        Balance.reified(reified.phantom(SUI.reified())),
        item.fields.total_object_storage_rebates
      ),
      nonRefundableBalance: decodeFromFieldsWithTypes(
        Balance.reified(reified.phantom(SUI.reified())),
        item.fields.non_refundable_balance
      ),
    })
  }

  static fromBcs(data: Uint8Array): StorageFund {
    return StorageFund.fromFields(StorageFund.bcs.parse(data))
  }

  toJSONField() {
    return {
      totalObjectStorageRebates: this.totalObjectStorageRebates.toJSONField(),
      nonRefundableBalance: this.nonRefundableBalance.toJSONField(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): StorageFund {
    return StorageFund.reified().new({
      totalObjectStorageRebates: decodeFromJSONField(
        Balance.reified(reified.phantom(SUI.reified())),
        field.totalObjectStorageRebates
      ),
      nonRefundableBalance: decodeFromJSONField(
        Balance.reified(reified.phantom(SUI.reified())),
        field.nonRefundableBalance
      ),
    })
  }

  static fromJSON(json: Record<string, any>): StorageFund {
    if (json.$typeName !== StorageFund.$typeName) {
      throw new Error(
        `not a StorageFund json object: expected '${StorageFund.$typeName}' but got '${json.$typeName}'`
      )
    }

    return StorageFund.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): StorageFund {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isStorageFund(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a StorageFund object`)
    }
    return StorageFund.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): StorageFund {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isStorageFund(data.bcs.type)) {
        throw new Error(`object at is not a StorageFund object`)
      }

      return StorageFund.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return StorageFund.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<StorageFund> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching StorageFund object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isStorageFund(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a StorageFund object`)
    }

    return StorageFund.fromSuiObjectData(res.data)
  }
}
