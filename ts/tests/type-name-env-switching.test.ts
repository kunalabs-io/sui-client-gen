import { afterAll, beforeEach, describe, expect, it } from 'vitest'
import {
  cloneEnv,
  getEnv,
  getTypeOrigin,
  setActiveEnv,
  setActiveEnvWithConfig,
  type EnvConfig,
} from './gen/_envs'
import { extractType, phantom } from './gen/_framework/reified'
import { Dummy, WithGenericField } from './gen/examples/fixture/structs'
import { SUI } from './gen/sui/sui/structs'
import { Balance } from './gen/sui/balance/structs'

// Reset to default env after these tests so other suites aren't affected.
afterAll(() => {
  setActiveEnv('testnet')
})

beforeEach(() => {
  setActiveEnv('testnet')
})

/**
 * Build a synthetic env in which the `examples` package has been "republished"
 * to `swappedAddr`. Every `examples` typeOrigin is rewritten to that address,
 * which is enough to exercise dynamic-typeName behavior end-to-end.
 */
function envWithExamplesAt(swappedAddr: string): EnvConfig {
  const base = getEnv('testnet')
  const newOrigins: Record<string, string> = {}
  for (const key of Object.keys(base.packages.examples.typeOrigins)) {
    newOrigins[key] = swappedAddr
  }
  return cloneEnv(base, {
    packages: {
      examples: {
        originalId: swappedAddr,
        publishedAt: swappedAddr,
        typeOrigins: newOrigins,
      },
    },
  })
}

const SWAPPED = '0xc0ffee00000000000000000000000000000000000000000000000000c0ffeeee'

describe('Dynamic-package $typeName follows the active env', () => {
  it('Dummy.$typeName resolves against the active env on every read', () => {
    setActiveEnv('testnet')
    const initial = Dummy.$typeName
    expect(initial).toBe(`${getTypeOrigin('examples', 'fixture::Dummy')}::fixture::Dummy`)

    setActiveEnvWithConfig(envWithExamplesAt(SWAPPED))
    expect(Dummy.$typeName).toBe(`${SWAPPED}::fixture::Dummy`)
    expect(Dummy.$typeName).not.toBe(initial)
  })

  it('the read site does not cache — switching back resets the value', () => {
    setActiveEnv('testnet')
    const initial = Dummy.$typeName

    setActiveEnvWithConfig(envWithExamplesAt(SWAPPED))
    expect(Dummy.$typeName).toBe(`${SWAPPED}::fixture::Dummy`)

    setActiveEnv('testnet')
    expect(Dummy.$typeName).toBe(initial)
  })
})

describe('System-package $typeName is constant across env switches', () => {
  it('Balance.$typeName stays 0x2::balance::Balance regardless of env', () => {
    setActiveEnv('testnet')
    expect(Balance.$typeName).toBe('0x2::balance::Balance')

    setActiveEnvWithConfig(envWithExamplesAt(SWAPPED))
    expect(Balance.$typeName).toBe('0x2::balance::Balance')
  })
})

describe('Stored reified handles follow env switches', () => {
  it('typeName / fullTypeName / typeArgs on a stored handle update after the active env changes', () => {
    setActiveEnv('testnet')
    // Capture a reified handle under testnet — the exact pattern kai-ts-sdk uses
    // when storing `this.r = SupplyPool_.r(args.T.r, args.ST.r)` in a constructor.
    // (T in WithGenericField is non-phantom, so we pass `SUI.r` here.)
    const stored = WithGenericField.reified(SUI.r)

    const testnetAddr = getTypeOrigin('examples', 'fixture::WithGenericField')
    expect(stored.typeName).toBe(`${testnetAddr}::fixture::WithGenericField`)
    expect(stored.fullTypeName).toBe(`${testnetAddr}::fixture::WithGenericField<0x2::sui::SUI>`)
    expect(stored.typeArgs).toEqual(['0x2::sui::SUI'])

    setActiveEnvWithConfig(envWithExamplesAt(SWAPPED))

    // Same handle, now reading through the new env. This is what was previously
    // broken: stored handles leaked the auto-init env's address into PTBs.
    expect(stored.typeName).toBe(`${SWAPPED}::fixture::WithGenericField`)
    expect(stored.fullTypeName).toBe(`${SWAPPED}::fixture::WithGenericField<0x2::sui::SUI>`)
    // typeArgs unchanged here because SUI is a System type (constant 0x2).
    expect(stored.typeArgs).toEqual(['0x2::sui::SUI'])
  })

  it('typeArgs reflects env when the type arg is itself a Dynamic struct', () => {
    setActiveEnv('testnet')
    // Nest a Dynamic reified inside another Dynamic struct's reified handle.
    const stored = WithGenericField.reified(Dummy.r)

    expect(stored.typeArgs[0]).toBe(
      `${getTypeOrigin('examples', 'fixture::Dummy')}::fixture::Dummy`
    )

    setActiveEnvWithConfig(envWithExamplesAt(SWAPPED))
    // The inner reified's fullTypeName is recomputed too — getter-all-the-way-down
    // through extractType -> reified.fullTypeName -> Name.$typeName getter.
    expect(stored.typeArgs[0]).toBe(`${SWAPPED}::fixture::Dummy`)
  })
})

describe('phantom() handles follow env switches', () => {
  it('phantomType on a phantom(reified) is re-read each access', () => {
    setActiveEnv('testnet')
    const ph = phantom(Dummy.reified())

    const testnetAddr = getTypeOrigin('examples', 'fixture::Dummy')
    expect(ph.phantomType).toBe(`${testnetAddr}::fixture::Dummy`)
    // extractType reads `.fullTypeName` / `.phantomType` — exercise both.
    expect(extractType(ph)).toBe(`${testnetAddr}::fixture::Dummy`)

    setActiveEnvWithConfig(envWithExamplesAt(SWAPPED))
    expect(ph.phantomType).toBe(`${SWAPPED}::fixture::Dummy`)
    expect(extractType(ph)).toBe(`${SWAPPED}::fixture::Dummy`)
  })

  it('phantom(stringLiteral) is a snapshot (the string was already finalized)', () => {
    // The string branch of phantom() doesn't have a reified to read through, so
    // it stays a plain field. This pins that behavior.
    const ph = phantom('0xdead::module::Type')
    expect(ph.phantomType).toBe('0xdead::module::Type')

    setActiveEnvWithConfig(envWithExamplesAt(SWAPPED))
    expect(ph.phantomType).toBe('0xdead::module::Type')
  })
})
