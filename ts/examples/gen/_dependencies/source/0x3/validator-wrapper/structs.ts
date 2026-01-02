import {
  PhantomReified,
  Reified,
  StructClass,
  ToField,
  ToTypeStr,
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
import { Versioned } from '../../../../sui/versioned/structs'
import { bcs } from '@mysten/sui/bcs'
import { SuiClient, SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromB64 } from '@mysten/sui/utils'

/* ============================== ValidatorWrapper =============================== */

export function isValidatorWrapper(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x3::validator_wrapper::ValidatorWrapper`
}

export interface ValidatorWrapperFields {
  inner: ToField<Versioned>
}

export type ValidatorWrapperReified = Reified<ValidatorWrapper, ValidatorWrapperFields>

export class ValidatorWrapper implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x3::validator_wrapper::ValidatorWrapper`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = ValidatorWrapper.$typeName
  readonly $fullTypeName: `0x3::validator_wrapper::ValidatorWrapper`
  readonly $typeArgs: []
  readonly $isPhantom = ValidatorWrapper.$isPhantom

  readonly inner: ToField<Versioned>

  private constructor(typeArgs: [], fields: ValidatorWrapperFields) {
    this.$fullTypeName = composeSuiType(
      ValidatorWrapper.$typeName,
      ...typeArgs
    ) as `0x3::validator_wrapper::ValidatorWrapper`
    this.$typeArgs = typeArgs

    this.inner = fields.inner
  }

  static reified(): ValidatorWrapperReified {
    const reifiedBcs = ValidatorWrapper.bcs
    return {
      typeName: ValidatorWrapper.$typeName,
      fullTypeName: composeSuiType(
        ValidatorWrapper.$typeName,
        ...[]
      ) as `0x3::validator_wrapper::ValidatorWrapper`,
      typeArgs: [] as [],
      isPhantom: ValidatorWrapper.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => ValidatorWrapper.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => ValidatorWrapper.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => ValidatorWrapper.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => ValidatorWrapper.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => ValidatorWrapper.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => ValidatorWrapper.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => ValidatorWrapper.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => ValidatorWrapper.fetch(client, id),
      new: (fields: ValidatorWrapperFields) => {
        return new ValidatorWrapper([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return ValidatorWrapper.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<ValidatorWrapper>> {
    return phantom(ValidatorWrapper.reified())
  }

  static get p() {
    return ValidatorWrapper.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('ValidatorWrapper', {
      inner: Versioned.bcs,
    })
  }

  private static cachedBcs: ReturnType<typeof ValidatorWrapper.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof ValidatorWrapper.instantiateBcs> {
    if (!ValidatorWrapper.cachedBcs) {
      ValidatorWrapper.cachedBcs = ValidatorWrapper.instantiateBcs()
    }
    return ValidatorWrapper.cachedBcs
  }

  static fromFields(fields: Record<string, any>): ValidatorWrapper {
    return ValidatorWrapper.reified().new({
      inner: decodeFromFields(Versioned.reified(), fields.inner),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): ValidatorWrapper {
    if (!isValidatorWrapper(item.type)) {
      throw new Error('not a ValidatorWrapper type')
    }

    return ValidatorWrapper.reified().new({
      inner: decodeFromFieldsWithTypes(Versioned.reified(), item.fields.inner),
    })
  }

  static fromBcs(data: Uint8Array): ValidatorWrapper {
    return ValidatorWrapper.fromFields(ValidatorWrapper.bcs.parse(data))
  }

  toJSONField() {
    return {
      inner: this.inner.toJSONField(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): ValidatorWrapper {
    return ValidatorWrapper.reified().new({
      inner: decodeFromJSONField(Versioned.reified(), field.inner),
    })
  }

  static fromJSON(json: Record<string, any>): ValidatorWrapper {
    if (json.$typeName !== ValidatorWrapper.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return ValidatorWrapper.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): ValidatorWrapper {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isValidatorWrapper(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a ValidatorWrapper object`)
    }
    return ValidatorWrapper.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): ValidatorWrapper {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isValidatorWrapper(data.bcs.type)) {
        throw new Error(`object at is not a ValidatorWrapper object`)
      }

      return ValidatorWrapper.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return ValidatorWrapper.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<ValidatorWrapper> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching ValidatorWrapper object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isValidatorWrapper(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a ValidatorWrapper object`)
    }

    return ValidatorWrapper.fromSuiObjectData(res.data)
  }
}
