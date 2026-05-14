import { afterAll, beforeEach, describe, expect, it } from 'vitest'
import {
  cloneEnv,
  getEnv,
  getTypeOrigin,
  setActiveEnv,
  setActiveEnvWithConfig,
  type EnvConfig,
} from './gen/_envs'
import { loader } from './gen/_framework/loader'
import { Dummy } from './gen/examples/fixture/structs'

afterAll(() => {
  setActiveEnv('testnet')
})

beforeEach(() => {
  setActiveEnv('testnet')
})

/**
 * Build a synthetic env in which the `examples` package has been republished
 * to `swappedAddr`. Mirrors the helper in type-name-env-switching.test.ts.
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

describe('loader.reified follows the active env', () => {
  it('resolves a Dynamic-package type against the active env', () => {
    setActiveEnv('testnet')

    // Look up Dummy under testnet — should find the same class registered
    // via the Dummy.$typeName getter (current env's address).
    const testnetTypeStr = `${getTypeOrigin('examples', 'fixture::Dummy')}::fixture::Dummy`
    const reified = loader.reified(testnetTypeStr)
    expect(reified.typeName).toBe(testnetTypeStr)

    // Switch env and look up the same type under its new address.
    setActiveEnvWithConfig(envWithExamplesAt(SWAPPED))
    const swappedReified = loader.reified(`${SWAPPED}::fixture::Dummy`)
    expect(swappedReified.typeName).toBe(`${SWAPPED}::fixture::Dummy`)
  })

  it('rejects a typestring that does not match any registered class under the active env', () => {
    // Under testnet, the SWAPPED address is not associated with any Dummy.
    setActiveEnv('testnet')
    expect(() => loader.reified(`${SWAPPED}::fixture::Dummy`)).toThrow(/Unknown type/)

    // After flipping env, the testnet typestring now becomes the unknown one.
    setActiveEnvWithConfig(envWithExamplesAt(SWAPPED))
    const testnetAddr = getEnv('testnet').packages.examples.typeOrigins['fixture::Dummy']
    expect(() => loader.reified(`${testnetAddr}::fixture::Dummy`)).toThrow(/Unknown type/)
  })

  it('resolves a System-package type (0x2::balance::Balance<0x2::sui::SUI>) consistently across envs', () => {
    // System types are env-independent. The reified() return type narrows to
    // string | reified handle | reified vector; for a struct type we just need
    // to confirm no throw.
    setActiveEnv('testnet')
    expect(() => loader.reified('0x2::balance::Balance<0x2::sui::SUI>')).not.toThrow()

    setActiveEnvWithConfig(envWithExamplesAt(SWAPPED))
    expect(() => loader.reified('0x2::balance::Balance<0x2::sui::SUI>')).not.toThrow()
  })

  it('recurses into generic type-args via the active env', () => {
    setActiveEnvWithConfig(envWithExamplesAt(SWAPPED))

    // WithGenericField<Dummy> — both the outer and inner type must resolve
    // against the swapped env. If the loader had frozen its keys against
    // testnet (the pre-fix bug), neither would be found.
    const outerType = `${SWAPPED}::fixture::WithGenericField<${SWAPPED}::fixture::Dummy>`
    const reified = loader.reified(outerType)
    expect(reified.typeName).toBe(`${SWAPPED}::fixture::WithGenericField`)
    expect(reified.fullTypeName).toBe(outerType)
  })

  it('resolves a vector<Dynamic> typestring against the active env', () => {
    setActiveEnvWithConfig(envWithExamplesAt(SWAPPED))

    const vecType = `vector<${SWAPPED}::fixture::Dummy>`
    // loader.reified returns the union; we just confirm it doesn't throw and
    // the wrapped element reified is for the swapped Dummy.
    expect(() => loader.reified(vecType)).not.toThrow()
  })

  it('handles same handle registered before any env switch (regression for the original bug)', () => {
    // Dummy was registered at module load against testnet's env — pre-fix,
    // the map key was `0x...testnetAddr::fixture::Dummy` and any non-default
    // env lookup would miss. Post-fix, register() stores the class itself;
    // lookup compares against current `Dummy.$typeName`, which is dynamic.
    expect(Dummy).toBeDefined()

    setActiveEnvWithConfig(envWithExamplesAt(SWAPPED))
    const reified = loader.reified(`${SWAPPED}::fixture::Dummy`)
    expect(reified.typeName).toBe(`${SWAPPED}::fixture::Dummy`)
  })
})
