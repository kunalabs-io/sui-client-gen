/**
 * Compile-time type tests for JSON serialization.
 *
 * These tests verify that the generated TypeScript types are correct
 * using vitest's expectTypeOf assertions. If any type is wrong,
 * TypeScript will error during `pnpm check`.
 *
 * These tests are purely type-level and don't require network calls.
 */

import { it, expect, describe, expectTypeOf } from 'vitest'
import {
  Bar,
  Dummy,
  Foo,
  WithGenericField,
  WithSpecialTypes,
  WithSpecialTypesInVectors,
  WithTwoGenerics,
} from './gen/examples/fixture/structs'
import { StructFromOtherModule } from './gen/examples/other-module/structs'
import { Balance } from './gen/sui/balance/structs'
import { ToField, ToJSON, ToTypeStr } from './gen/_framework/reified'
import { SUI } from './gen/sui/sui/structs'
import { ID, UID } from './gen/sui/object/structs'
import { Url } from './gen/sui/url/structs'
import { ActionStop, ActionPause, ActionJump } from '../examples/gen/examples/enums/structs'

// ============================================================================
// JSON Type Definitions Tests
// ============================================================================
describe('JSON type definitions (compile-time checks)', () => {
  it('should have correct types for simple struct toJSON()', () => {
    const dummy = Dummy.r.new({ dummyField: true })
    const json = dummy.toJSON()

    // Verify individual field types
    expectTypeOf(json.$typeName).toEqualTypeOf<typeof Dummy.$typeName>()
    expectTypeOf(json.$typeArgs).toEqualTypeOf<[]>()
    expectTypeOf(json.dummyField).toEqualTypeOf<boolean>()

    expect(json.dummyField).toBe(true)
  })

  it('should have correct types for struct with value field (u64 → string)', () => {
    const bar = Bar.r.new({ value: 100n })
    const json = bar.toJSON()

    // Bar has a u64 field which serializes to string
    expectTypeOf(json.$typeName).toEqualTypeOf<typeof Bar.$typeName>()
    expectTypeOf(json.$typeArgs).toEqualTypeOf<[]>()
    expectTypeOf(json.value).toEqualTypeOf<string>() // u64 → string in JSON

    expect(json.value).toBe('100')
  })

  it('should have correct types for generic struct with concrete types', () => {
    const obj = WithTwoGenerics.reified(Bar.reified(), 'u8').new({
      genericField1: Bar.r.new({ value: 100n }),
      genericField2: 42,
    })
    const json = obj.toJSON()

    // Verify nested struct field has correct shape (Bar → { value: string })
    expectTypeOf(json.genericField1.value).toEqualTypeOf<string>()
    // Verify primitive field has correct type (u8 → number)
    expectTypeOf(json.genericField2).toEqualTypeOf<number>()

    expect(json.genericField1.value).toBe('100')
    expect(json.genericField2).toBe(42)
  })

  it('should have correct types for toJSONField() with exact shape', () => {
    const bar = Bar.r.new({ value: 100n })
    const field = bar.toJSONField()

    // toJSONField() returns just the fields, no $typeName/$typeArgs
    expectTypeOf(field.value).toEqualTypeOf<string>()

    expect(field.value).toBe('100')
  })

  it('should have correct types for generic struct toJSONField()', () => {
    const obj = WithGenericField.reified(Bar.reified()).new({
      id: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      genericField: Bar.r.new({ value: 200n }),
    })
    const field = obj.toJSONField()

    // Verify exact field types
    expectTypeOf(field.id).toEqualTypeOf<string>() // UID → string
    expectTypeOf(field.genericField.value).toEqualTypeOf<string>() // Bar.value → string

    expect(field.genericField.value).toBe('200')
  })

  it('should handle nested generics with correct nested types', () => {
    const inner = WithTwoGenerics.reified(Bar.reified(), 'u8').new({
      genericField1: Bar.r.new({ value: 50n }),
      genericField2: 10,
    })
    const outer = WithTwoGenerics.reified(WithTwoGenerics.reified(Bar.reified(), 'u8'), 'u16').new({
      genericField1: inner,
      genericField2: 20,
    })

    const json = outer.toJSON()

    // Nested structure: outer.genericField1 is WithTwoGenerics<Bar, 'u8'>
    expectTypeOf(json.genericField1.genericField1.value).toEqualTypeOf<string>() // Bar.value → string
    expectTypeOf(json.genericField1.genericField2).toEqualTypeOf<number>() // u8 → number
    expectTypeOf(json.genericField2).toEqualTypeOf<number>() // u16 → number

    expect(json.genericField1.genericField1.value).toBe('50')
    expect(json.genericField1.genericField2).toBe(10)
    expect(json.genericField2).toBe(20)
  })

  it('should have correct array types for vectors', () => {
    const bars = [Bar.r.new({ value: 1n }), Bar.r.new({ value: 2n }), Bar.r.new({ value: 3n })]

    const jsonBars = bars.map(b => b.toJSONField())

    // Array elements should have value: string
    expectTypeOf(jsonBars[0].value).toEqualTypeOf<string>()

    expect(jsonBars.map(j => j.value)).toEqual(['1', '2', '3'])
  })

  it('should serialize primitive types correctly', () => {
    // Test all primitive JSON mappings using values
    const boolVal = true as ToJSON<'bool'>
    const u8Val = 1 as ToJSON<'u8'>
    const u64Val = '1' as ToJSON<'u64'>
    const addressVal = '0x1' as ToJSON<'address'>

    expectTypeOf(boolVal).toEqualTypeOf<boolean>()
    expectTypeOf(u8Val).toEqualTypeOf<number>()
    expectTypeOf(u64Val).toEqualTypeOf<string>() // Large ints → string
    expectTypeOf(addressVal).toEqualTypeOf<string>()
  })
})

// ============================================================================
// Special Types JSON Tests
// ============================================================================
describe('Special types JSON serialization (compile-time checks)', () => {
  it('should serialize all special type fields to string', () => {
    // Create a WithSpecialTypes instance to test field types
    const obj = WithSpecialTypes.reified(SUI.phantom(), Bar.reified()).new({
      id: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      string: 'hello',
      asciiString: 'world',
      url: 'https://example.com',
      idField: '0xabcd',
      uid: '0x5678',
      balance: Balance.reified(SUI.phantom()).new({ value: 0n }),
      option: 123n,
      optionObj: Bar.r.new({ value: 456n }),
      optionNone: null,
      balanceGeneric: Balance.reified(SUI.phantom()).new({ value: 789n }),
      optionGeneric: Bar.r.new({ value: 101n }),
      optionGenericNone: null,
    })

    const json = obj.toJSONField()

    // All special types serialize to string
    expectTypeOf(json.id).toEqualTypeOf<string>() // UID → string
    expectTypeOf(json.string).toEqualTypeOf<string>() // String (UTF-8) → string
    expectTypeOf(json.asciiString).toEqualTypeOf<string>() // String (ASCII) → string
    expectTypeOf(json.url).toEqualTypeOf<string>() // Url → string
    expectTypeOf(json.idField).toEqualTypeOf<string>() // ID → string
    expectTypeOf(json.uid).toEqualTypeOf<string>() // UID → string
  })

  it('should serialize Balance to { value: string }', () => {
    const balance = Balance.reified(SUI.phantom()).new({ value: 1000n })
    const json = balance.toJSONField()

    expectTypeOf(json.value).toEqualTypeOf<string>() // u64 inside Balance → string

    expect(json.value).toBe('1000')
  })
})

// ============================================================================
// Option Type JSON Tests
// ============================================================================
describe('Option type JSON serialization (compile-time checks)', () => {
  it('should serialize Option<primitive> to primitive | null', () => {
    const obj = WithSpecialTypes.reified(SUI.phantom(), Bar.reified()).new({
      id: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      string: 'hello',
      asciiString: 'world',
      url: 'https://example.com',
      idField: '0xabcd',
      uid: '0x5678',
      balance: Balance.reified(SUI.phantom()).new({ value: 0n }),
      option: 123n, // Option<u64> with Some value
      optionObj: Bar.r.new({ value: 456n }),
      optionNone: null, // Option<u64> with None
      balanceGeneric: Balance.reified(SUI.phantom()).new({ value: 789n }),
      optionGeneric: Bar.r.new({ value: 101n }),
      optionGenericNone: null,
    })

    const json = obj.toJSONField()

    // Option<u64> → string | null (u64 serializes to string)
    expectTypeOf(json.option).toEqualTypeOf<string | null>()
    expectTypeOf(json.optionNone).toEqualTypeOf<string | null>()

    expect(json.option).toBe('123')
    expect(json.optionNone).toBe(null)
  })

  it('should serialize Option<struct> to JSONField | null', () => {
    const obj = WithSpecialTypes.reified(SUI.phantom(), Bar.reified()).new({
      id: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      string: 'hello',
      asciiString: 'world',
      url: 'https://example.com',
      idField: '0xabcd',
      uid: '0x5678',
      balance: Balance.reified(SUI.phantom()).new({ value: 0n }),
      option: 123n,
      optionObj: Bar.r.new({ value: 456n }), // Option<Bar> with Some value
      optionNone: null,
      balanceGeneric: Balance.reified(SUI.phantom()).new({ value: 789n }),
      optionGeneric: Bar.r.new({ value: 101n }),
      optionGenericNone: null,
    })

    const json = obj.toJSONField()

    // Option<Bar> → { value: string } | null
    // When Some, we can access the nested field
    if (json.optionObj !== null) {
      expectTypeOf(json.optionObj.value).toEqualTypeOf<string>()
    }

    expect(json.optionObj).toEqual({ value: '456' })
  })

  it('should serialize Option<generic T> with ToJSON<T> | null', () => {
    // When T = Bar
    const obj = WithSpecialTypes.reified(SUI.phantom(), Bar.reified()).new({
      id: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      string: 'hello',
      asciiString: 'world',
      url: 'https://example.com',
      idField: '0xabcd',
      uid: '0x5678',
      balance: Balance.reified(SUI.phantom()).new({ value: 0n }),
      option: 123n,
      optionObj: Bar.r.new({ value: 456n }),
      optionNone: null,
      balanceGeneric: Balance.reified(SUI.phantom()).new({ value: 789n }),
      optionGeneric: Bar.r.new({ value: 101n }), // Option<U> where U = Bar
      optionGenericNone: null,
    })

    const json = obj.toJSONField()

    // optionGeneric: ToJSON<U> | null, where U = Bar → { value: string } | null
    if (json.optionGeneric !== null) {
      expectTypeOf(json.optionGeneric.value).toEqualTypeOf<string>()
    }

    expect(json.optionGeneric).toEqual({ value: '101' })
    expect(json.optionGenericNone).toBe(null)
  })
})

// ============================================================================
// Vector Type JSON Tests
// ============================================================================
describe('Vector type JSON serialization (compile-time checks)', () => {
  it('should serialize Vector<String> to string[]', () => {
    const obj = WithSpecialTypesInVectors.reified(Bar.reified()).new({
      id: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      string: ['hello', 'world'],
      asciiString: ['foo', 'bar'],
      idField: ['0x1', '0x2'],
      bar: [Bar.r.new({ value: 1n }), Bar.r.new({ value: 2n })],
      option: [100n, null, 200n],
      optionGeneric: [Bar.r.new({ value: 3n }), null],
    })

    const json = obj.toJSONField()

    // Vector<String> → string[]
    expectTypeOf(json.string).toEqualTypeOf<string[]>()
    expectTypeOf(json.asciiString).toEqualTypeOf<string[]>()
    expectTypeOf(json.idField).toEqualTypeOf<string[]>()

    expect(json.string).toEqual(['hello', 'world'])
  })

  it('should serialize Vector<struct> to JSONField[]', () => {
    const obj = WithSpecialTypesInVectors.reified(Bar.reified()).new({
      id: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      string: ['hello'],
      asciiString: ['foo'],
      idField: ['0x1'],
      bar: [Bar.r.new({ value: 1n }), Bar.r.new({ value: 2n })],
      option: [100n],
      optionGeneric: [Bar.r.new({ value: 3n })],
    })

    const json = obj.toJSONField()

    // Vector<Bar> → { value: string }[]
    expectTypeOf(json.bar[0].value).toEqualTypeOf<string>()

    expect(json.bar).toEqual([{ value: '1' }, { value: '2' }])
  })

  it('should serialize Vector<Option<T>> to (T | null)[]', () => {
    const obj = WithSpecialTypesInVectors.reified(Bar.reified()).new({
      id: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      string: ['hello'],
      asciiString: ['foo'],
      idField: ['0x1'],
      bar: [Bar.r.new({ value: 1n })],
      option: [100n, null, 200n], // Vector<Option<u64>>
      optionGeneric: [Bar.r.new({ value: 3n }), null], // Vector<Option<Bar>>
    })

    const json = obj.toJSONField()

    // Vector<Option<u64>> → (string | null)[]
    expectTypeOf(json.option).toEqualTypeOf<(string | null)[]>()

    expect(json.option).toEqual(['100', null, '200'])
  })
})

// ============================================================================
// Complex Foo Structure JSON Tests
// ============================================================================
describe('Complex Foo structure JSON types (compile-time checks)', () => {
  it('should have correct types for Foo<Bar> fields', () => {
    const foo = Foo.reified(Bar.reified()).new({
      id: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      generic: Bar.r.new({ value: 1n }),
      reifiedPrimitiveVec: [1n, 2n, 3n],
      reifiedObjectVec: [Bar.r.new({ value: 10n })],
      genericVec: [Bar.r.new({ value: 20n })],
      genericVecNested: [
        WithTwoGenerics.reified(Bar.reified(), 'u8').new({
          genericField1: Bar.r.new({ value: 30n }),
          genericField2: 5,
        }),
      ],
      twoGenerics: WithTwoGenerics.reified(Bar.reified(), Bar.reified()).new({
        genericField1: Bar.r.new({ value: 40n }),
        genericField2: Bar.r.new({ value: 50n }),
      }),
      twoGenericsReifiedPrimitive: WithTwoGenerics.reified('u16', 'u64').new({
        genericField1: 100,
        genericField2: 200n,
      }),
      twoGenericsReifiedObject: WithTwoGenerics.reified(Bar.reified(), Bar.reified()).new({
        genericField1: Bar.r.new({ value: 60n }),
        genericField2: Bar.r.new({ value: 70n }),
      }),
      twoGenericsNested: WithTwoGenerics.reified(
        Bar.reified(),
        WithTwoGenerics.reified('u8', 'u8')
      ).new({
        genericField1: Bar.r.new({ value: 80n }),
        genericField2: WithTwoGenerics.reified('u8', 'u8').new({
          genericField1: 1,
          genericField2: 2,
        }),
      }),
      twoGenericsReifiedNested: WithTwoGenerics.reified(
        Bar.reified(),
        WithTwoGenerics.reified('u8', 'u8')
      ).new({
        genericField1: Bar.r.new({ value: 90n }),
        genericField2: WithTwoGenerics.reified('u8', 'u8').new({
          genericField1: 3,
          genericField2: 4,
        }),
      }),
      twoGenericsNestedVec: [],
      dummy: Dummy.r.new({ dummyField: true }),
      other: StructFromOtherModule.r.new({ dummyField: false }),
    })

    const json = foo.toJSONField()

    // id: UID → string
    expectTypeOf(json.id).toEqualTypeOf<string>()

    // generic: T where T = Bar → { value: string }
    expectTypeOf(json.generic.value).toEqualTypeOf<string>()

    // reifiedPrimitiveVec: Vector<u64> → string[]
    expectTypeOf(json.reifiedPrimitiveVec).toEqualTypeOf<string[]>()

    // reifiedObjectVec: Vector<Bar> → { value: string }[]
    expectTypeOf(json.reifiedObjectVec[0].value).toEqualTypeOf<string>()

    // genericVec: Vector<T> where T = Bar → { value: string }[]
    expectTypeOf(json.genericVec[0].value).toEqualTypeOf<string>()

    // dummy: Dummy → { dummyField: boolean }
    expectTypeOf(json.dummy.dummyField).toEqualTypeOf<boolean>()

    // other: StructFromOtherModule → { dummyField: boolean }
    expectTypeOf(json.other.dummyField).toEqualTypeOf<boolean>()
  })

  it('should have correct types for nested generics in Foo', () => {
    const foo = Foo.reified(Bar.reified()).new({
      id: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      generic: Bar.r.new({ value: 1n }),
      reifiedPrimitiveVec: [],
      reifiedObjectVec: [],
      genericVec: [],
      genericVecNested: [],
      twoGenerics: WithTwoGenerics.reified(Bar.reified(), Bar.reified()).new({
        genericField1: Bar.r.new({ value: 40n }),
        genericField2: Bar.r.new({ value: 50n }),
      }),
      twoGenericsReifiedPrimitive: WithTwoGenerics.reified('u16', 'u64').new({
        genericField1: 100,
        genericField2: 200n,
      }),
      twoGenericsReifiedObject: WithTwoGenerics.reified(Bar.reified(), Bar.reified()).new({
        genericField1: Bar.r.new({ value: 60n }),
        genericField2: Bar.r.new({ value: 70n }),
      }),
      twoGenericsNested: WithTwoGenerics.reified(
        Bar.reified(),
        WithTwoGenerics.reified('u8', 'u8')
      ).new({
        genericField1: Bar.r.new({ value: 80n }),
        genericField2: WithTwoGenerics.reified('u8', 'u8').new({
          genericField1: 1,
          genericField2: 2,
        }),
      }),
      twoGenericsReifiedNested: WithTwoGenerics.reified(
        Bar.reified(),
        WithTwoGenerics.reified('u8', 'u8')
      ).new({
        genericField1: Bar.r.new({ value: 90n }),
        genericField2: WithTwoGenerics.reified('u8', 'u8').new({
          genericField1: 3,
          genericField2: 4,
        }),
      }),
      twoGenericsNestedVec: [],
      dummy: Dummy.r.new({ dummyField: true }),
      other: StructFromOtherModule.r.new({ dummyField: false }),
    })

    const json = foo.toJSONField()

    // twoGenerics: WithTwoGenerics<T, Bar> → { genericField1: { value: string }, genericField2: { value: string } }
    expectTypeOf(json.twoGenerics.genericField1.value).toEqualTypeOf<string>()
    expectTypeOf(json.twoGenerics.genericField2.value).toEqualTypeOf<string>()

    // twoGenericsReifiedPrimitive: WithTwoGenerics<u16, u64> → { genericField1: number, genericField2: string }
    expectTypeOf(json.twoGenericsReifiedPrimitive.genericField1).toEqualTypeOf<number>() // u16 → number
    expectTypeOf(json.twoGenericsReifiedPrimitive.genericField2).toEqualTypeOf<string>() // u64 → string

    // twoGenericsNested: WithTwoGenerics<T, WithTwoGenerics<u8, u8>> → deeply nested
    expectTypeOf(json.twoGenericsNested.genericField1.value).toEqualTypeOf<string>() // T = Bar
    expectTypeOf(json.twoGenericsNested.genericField2.genericField1).toEqualTypeOf<number>() // u8
    expectTypeOf(json.twoGenericsNested.genericField2.genericField2).toEqualTypeOf<number>() // u8
  })
})

// ============================================================================
// Enum Variant JSON Tests
// ============================================================================
describe('Enum variant JSON types (compile-time checks)', () => {
  // Use the phantom type string for U
  type SUIPhantom = typeof SUI.$typeName

  it('should have correct $kind discriminator for ActionStop', () => {
    // Create a Stop variant directly with proper phantom type
    const stop = new ActionStop<'u64', SUIPhantom>(['u64', SUI.$typeName], {})

    const json = stop.toJSONField()

    // Unit variant only has $kind
    expectTypeOf(json.$kind).toEqualTypeOf<'Stop'>()
  })

  it('should have correct $kind and fields for ActionPause', () => {
    // Create a Pause variant directly with the correct constructor
    const pause = new ActionPause<'u64', SUIPhantom>(['u64', SUI.$typeName], {
      duration: 100,
      genericField: 200n,
      phantomField: Balance.reified(SUI.phantom()).new({ value: 300n }),
      reifiedField: 400n,
    })

    const json = pause.toJSONField()

    expectTypeOf(json.$kind).toEqualTypeOf<'Pause'>()
    expectTypeOf(json.duration).toEqualTypeOf<number>() // u32 → number
    expectTypeOf(json.genericField).toEqualTypeOf<string>() // T = u64 → string
    expectTypeOf(json.phantomField.value).toEqualTypeOf<string>() // Balance<U> → { value: string }
    expectTypeOf(json.reifiedField).toEqualTypeOf<string | null>() // Option<u64> → string | null
  })

  it('should have correct $kind and vec tuple for ActionJump', () => {
    // Create a Jump variant directly - fields are a tuple [u64, T, Balance<U>, Option<u64>]
    const jump = new ActionJump<'u64', SUIPhantom>(
      ['u64', SUI.$typeName],
      [100n, 200n, Balance.reified(SUI.phantom()).new({ value: 300n }), 400n]
    )

    const json = jump.toJSONField()

    expectTypeOf(json.$kind).toEqualTypeOf<'Jump'>()
    // vec: [u64, T, Balance<U>, Option<u64>] → [string, string, { value: string }, string | null]
    expectTypeOf(json.vec[0]).toEqualTypeOf<string>() // u64 → string
    expectTypeOf(json.vec[1]).toEqualTypeOf<string>() // T = u64 → string
    expectTypeOf(json.vec[2].value).toEqualTypeOf<string>() // Balance<U> → { value: string }
    expectTypeOf(json.vec[3]).toEqualTypeOf<string | null>() // Option<u64> → string | null
  })
})

// ============================================================================
// ToField Type Mapping Tests
// ============================================================================
describe('ToField type mappings (compile-time checks)', () => {
  it('should map primitives correctly', () => {
    // Type-level checks for ToField
    type BoolField = ToField<'bool'>
    type U8Field = ToField<'u8'>
    type U64Field = ToField<'u64'>
    type AddressField = ToField<'address'>

    expectTypeOf<BoolField>().toEqualTypeOf<boolean>()
    expectTypeOf<U8Field>().toEqualTypeOf<number>()
    expectTypeOf<U64Field>().toEqualTypeOf<bigint>() // ToField keeps as bigint
    expectTypeOf<AddressField>().toEqualTypeOf<string>()
  })

  it('should map special types to string', () => {
    // Special types in ToField become string
    type UIDField = ToField<UID>
    type IDField = ToField<ID>
    type UrlField = ToField<Url>

    expectTypeOf<UIDField>().toEqualTypeOf<string>()
    expectTypeOf<IDField>().toEqualTypeOf<string>()
    expectTypeOf<UrlField>().toEqualTypeOf<string>()
  })

  it('should map structs to themselves', () => {
    // Struct types in ToField stay as the struct
    type BarField = ToField<Bar>

    expectTypeOf<BarField>().toEqualTypeOf<Bar>()
  })
})

// ============================================================================
// $typeArgs Type Tests
// ============================================================================
describe('$typeArgs type accuracy (compile-time checks)', () => {
  it('should have empty $typeArgs for non-generic structs', () => {
    const dummy = Dummy.r.new({ dummyField: true })
    const json = dummy.toJSON()

    expectTypeOf(json.$typeArgs).toEqualTypeOf<[]>()
  })

  it('should have correct $typeArgs for single generic', () => {
    const obj = WithGenericField.reified(Bar.reified()).new({
      id: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      genericField: Bar.r.new({ value: 100n }),
    })
    const json = obj.toJSON()

    // $typeArgs should be [ToTypeStr<Bar>]
    expectTypeOf(json.$typeArgs).toEqualTypeOf<[ToTypeStr<Bar>]>()
  })

  it('should have correct $typeArgs for multiple generics', () => {
    const obj = WithTwoGenerics.reified(Bar.reified(), 'u8').new({
      genericField1: Bar.r.new({ value: 100n }),
      genericField2: 42,
    })
    const json = obj.toJSON()

    // $typeArgs should be [ToTypeStr<Bar>, ToTypeStr<'u8'>]
    expectTypeOf(json.$typeArgs).toEqualTypeOf<[ToTypeStr<Bar>, ToTypeStr<'u8'>]>()
  })

  it('should include phantom type args in $typeArgs tuple', () => {
    // WithSpecialTypes has phantom T and non-phantom U
    const obj = WithSpecialTypes.reified(SUI.phantom(), Bar.reified()).new({
      id: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      string: 'hello',
      asciiString: 'world',
      url: 'https://example.com',
      idField: '0xabcd',
      uid: '0x5678',
      balance: Balance.reified(SUI.phantom()).new({ value: 0n }),
      option: 123n,
      optionObj: Bar.r.new({ value: 456n }),
      optionNone: null,
      balanceGeneric: Balance.reified(SUI.phantom()).new({ value: 789n }),
      optionGeneric: Bar.r.new({ value: 101n }),
      optionGenericNone: null,
    })
    const json = obj.toJSON()

    // $typeArgs is a 2-tuple for WithSpecialTypes<phantom T, U>
    // Verify it's a tuple of length 2 containing strings
    expectTypeOf(json.$typeArgs).toMatchTypeOf<[string, string]>()

    // At runtime, verify the actual values
    expect(json.$typeArgs.length).toBe(2)
    expect(typeof json.$typeArgs[0]).toBe('string')
    expect(typeof json.$typeArgs[1]).toBe('string')
  })
})
