import { it, expect, describe, afterAll } from 'vitest'
import {
  cloneEnv,
  getActiveEnv,
  getActiveEnvName,
  getEnv,
  getOriginalId,
  getPublishedAt,
  getRegisteredEnvs,
  getTypeOrigin,
  getTypeOriginAddresses,
  getTypeOriginAddressesFor,
  setActiveEnv,
  setActiveEnvWithConfig,
  type EnvConfig,
} from './gen/_envs'

// Reset to default env after all tests to avoid affecting other test files
afterAll(() => {
  setActiveEnv('testnet')
})

describe('environment switching', () => {
  it('getActiveEnvName returns the current environment name', () => {
    // Default is 'testnet' (set in _envs/index.ts)
    expect(getActiveEnvName()).toBe('testnet')

    setActiveEnv('testnet_alt')
    expect(getActiveEnvName()).toBe('testnet_alt')

    setActiveEnv('testnet')
    expect(getActiveEnvName()).toBe('testnet')
  })

  it('getRegisteredEnvs lists all registered environments', () => {
    const envs = getRegisteredEnvs()
    expect(envs).toContain('testnet')
    expect(envs).toContain('testnet_alt')
    expect(envs.length).toBe(2)
  })

  it('getPublishedAt works for shared packages (std, sui) in both envs', () => {
    setActiveEnv('testnet')
    expect(getPublishedAt('std')).toBe('0x1')
    expect(getPublishedAt('sui')).toBe('0x2')

    setActiveEnv('testnet_alt')
    expect(getPublishedAt('std')).toBe('0x1')
    expect(getPublishedAt('sui')).toBe('0x2')
  })

  it('getPublishedAt for examples package differs by environment', () => {
    setActiveEnv('testnet')
    // testnet has examples package
    expect(getPublishedAt('examples')).toBe(
      '0xa2a8baeeb817a18f6a69716b084a47c8f82bbff0d82b8aeef5929a9a78d7f83'
    )

    setActiveEnv('testnet_alt')
    // testnet_alt does NOT have examples package (it's in dependencies by address)
    expect(() => getPublishedAt('examples')).toThrow(
      "Package 'examples' not found in active environment 'testnet_alt'"
    )
  })

  it('getOriginalId works for shared packages in both envs', () => {
    setActiveEnv('testnet')
    expect(getOriginalId('std')).toBe('0x1')
    expect(getOriginalId('sui')).toBe('0x2')

    setActiveEnv('testnet_alt')
    expect(getOriginalId('std')).toBe('0x1')
    expect(getOriginalId('sui')).toBe('0x2')
  })

  it('getTypeOrigin returns correct type origins', () => {
    setActiveEnv('testnet')
    expect(getTypeOrigin('sui', 'coin::Coin')).toBe('0x2')

    setActiveEnv('testnet_alt')
    expect(getTypeOrigin('sui', 'coin::Coin')).toBe('0x2')
  })

  it('setActiveEnv throws for non-existent environment', () => {
    expect(() => setActiveEnv('nonexistent')).toThrow(
      "Environment 'nonexistent' not found. Available: testnet, testnet_alt"
    )
  })
})

describe('publishedAtOverrides', () => {
  it('setActiveEnv with overrides changes publishedAt', () => {
    setActiveEnv('testnet', { sui: '0xOVERRIDDEN' })
    expect(getPublishedAt('sui')).toBe('0xOVERRIDDEN')

    // Other packages unchanged
    expect(getPublishedAt('std')).toBe('0x1')
  })

  it('setActiveEnv without overrides clears previous overrides', () => {
    setActiveEnv('testnet', { sui: '0xOVERRIDDEN' })
    expect(getPublishedAt('sui')).toBe('0xOVERRIDDEN')

    setActiveEnv('testnet')
    expect(getPublishedAt('sui')).toBe('0x2')
  })

  it('setActiveEnvWithConfig with overrides works', () => {
    const config = {
      packages: {
        sui: { originalId: '0x2', publishedAt: '0x2', typeOrigins: {} },
      },
      dependencies: {},
    }
    setActiveEnvWithConfig(config, { sui: '0xOVERRIDDEN' })
    expect(getPublishedAt('sui')).toBe('0xOVERRIDDEN')
  })

  it('setActiveEnvWithConfig without overrides clears previous overrides', () => {
    setActiveEnv('testnet', { sui: '0xOVERRIDDEN' })
    expect(getPublishedAt('sui')).toBe('0xOVERRIDDEN')

    const config = {
      packages: {
        sui: { originalId: '0x2', publishedAt: '0x2', typeOrigins: {} },
      },
      dependencies: {},
    }
    setActiveEnvWithConfig(config)
    expect(getPublishedAt('sui')).toBe('0x2')
  })
})

describe('getTypeOriginAddresses', () => {
  it('returns unique addresses sorted', () => {
    setActiveEnv('testnet')

    // examples package has types from 3 different upgrade versions
    const addresses = getTypeOriginAddresses('examples')

    // Should have exactly 3 unique addresses
    expect(addresses.length).toBe(3)

    // Should be sorted (deterministic)
    expect(addresses).toEqual([...addresses].sort())

    // Should include the original, an upgrade, and another upgrade
    expect(addresses).toContain(
      '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209'
    )
    expect(addresses).toContain('0xa2a8baeeb817a18f6a69716b084a47c8f82bbff0d82b8aeef5929a9a78d7f83')
    expect(addresses).toContain(
      '0x75818a1083fface3dec10fc5f7466d3adafe7bcf2485248160ea4bb17b8afabe'
    )
  })

  it('returns single address for non-upgraded packages', () => {
    setActiveEnv('testnet')

    // std package only has types from 0x1
    const addresses = getTypeOriginAddresses('std')
    expect(addresses).toEqual(['0x1'])
  })

  it('throws for unknown package', () => {
    setActiveEnv('testnet')
    expect(() => getTypeOriginAddresses('nonexistent')).toThrow("Package 'nonexistent' not found")
  })
})

describe('getTypeOriginAddressesFor', () => {
  it('returns addresses for specific types', () => {
    setActiveEnv('testnet')

    // Query types from different upgrade versions
    const addresses = getTypeOriginAddressesFor('examples', [
      'fixture::Dummy', // from original
      'other_module::AddedInAnUpgrade', // from upgrade
    ])

    expect(addresses.length).toBe(2)
    expect(addresses).toContain(
      '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209'
    )
    expect(addresses).toContain(
      '0x75818a1083fface3dec10fc5f7466d3adafe7bcf2485248160ea4bb17b8afabe'
    )
  })

  it('deduplicates same-version types', () => {
    setActiveEnv('testnet')

    // Both types from same version
    const addresses = getTypeOriginAddressesFor('examples', ['fixture::Dummy', 'fixture::Foo'])

    expect(addresses.length).toBe(1)
    expect(addresses).toEqual([
      '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209',
    ])
  })

  it('throws for unknown type', () => {
    setActiveEnv('testnet')
    expect(() => getTypeOriginAddressesFor('examples', ['nonexistent::Type'])).toThrow(
      "Type origin for 'nonexistent::Type' not found"
    )
  })

  it('throws for unknown package', () => {
    setActiveEnv('testnet')
    expect(() => getTypeOriginAddressesFor('nonexistent', ['foo::Bar'])).toThrow(
      "Package 'nonexistent' not found"
    )
  })
})

describe('getEnv', () => {
  it('returns a registered env by name', () => {
    const env = getEnv('testnet')
    expect(env.packages['sui'].publishedAt).toBe('0x2')
  })

  it('throws for unknown env', () => {
    expect(() => getEnv('nonexistent')).toThrow(
      "Environment 'nonexistent' not found. Available: testnet, testnet_alt"
    )
  })
})

describe('cloneEnv', () => {
  it('preserves untouched packages by reference', () => {
    const base = getEnv('testnet')
    const cloned = cloneEnv(base)
    // Same shape
    expect(cloned.packages['sui'].publishedAt).toBe(base.packages['sui'].publishedAt)
    // Independent objects (so mutations don't leak)
    expect(cloned).not.toBe(base)
    expect(cloned.packages).not.toBe(base.packages)
  })

  it('shallow-merges a package override', () => {
    const base = getEnv('testnet')
    const cloned = cloneEnv(base, {
      packages: { sui: { publishedAt: '0xUPGRADED' } },
    })
    expect(cloned.packages['sui'].publishedAt).toBe('0xUPGRADED')
    // Other fields preserved
    expect(cloned.packages['sui'].originalId).toBe(base.packages['sui'].originalId)
    expect(cloned.packages['sui'].typeOrigins).toEqual(base.packages['sui'].typeOrigins)
    // Untouched packages preserved
    expect(cloned.packages['std'].publishedAt).toBe('0x1')
    // Base is unchanged
    expect(base.packages['sui'].publishedAt).toBe('0x2')
  })

  it('merges typeOrigins rather than replacing them', () => {
    const base = getEnv('testnet')
    const cloned = cloneEnv(base, {
      packages: { sui: { typeOrigins: { 'custom::Added': '0xABC' } } },
    })
    // Original origins still present
    expect(cloned.packages['sui'].typeOrigins['coin::Coin']).toBe('0x2')
    // Added origin present
    expect(cloned.packages['sui'].typeOrigins['custom::Added']).toBe('0xABC')
  })

  it('throws when overriding an unknown package', () => {
    const base = getEnv('testnet')
    expect(() => cloneEnv(base, { packages: { unknown: { publishedAt: '0x1' } } })).toThrow(
      "cloneEnv: cannot override unknown package 'unknown'"
    )
  })
})

describe('per-call env override', () => {
  it('getPublishedAt uses the supplied env, ignoring active overrides', () => {
    // Set a global override that would normally win
    setActiveEnv('testnet', { sui: '0xGLOBAL' })
    expect(getPublishedAt('sui')).toBe('0xGLOBAL')

    // A caller-supplied env takes precedence, overrides are ignored
    const scoped = cloneEnv(getEnv('testnet'), {
      packages: { sui: { publishedAt: '0xSCOPED' } },
    })
    expect(getPublishedAt('sui', scoped)).toBe('0xSCOPED')

    // Global state unaffected
    expect(getPublishedAt('sui')).toBe('0xGLOBAL')
    setActiveEnv('testnet')
  })

  it('getTypeOrigin / getOriginalId / getTypeOriginAddresses honour supplied env', () => {
    const base = getEnv('testnet')
    const scoped: EnvConfig = cloneEnv(base, {
      packages: {
        sui: {
          originalId: '0xORIG',
          publishedAt: '0xPUB',
          typeOrigins: { 'coin::Coin': '0xCOIN_V2' },
        },
      },
    })

    expect(getOriginalId('sui', scoped)).toBe('0xORIG')
    expect(getTypeOrigin('sui', 'coin::Coin', scoped)).toBe('0xCOIN_V2')
    expect(getTypeOriginAddresses('sui', scoped)).toContain('0xCOIN_V2')
    expect(getTypeOriginAddressesFor('sui', ['coin::Coin'], scoped)).toEqual(['0xCOIN_V2'])
  })

  it('missing package in supplied env mentions supplied scope, not active env', () => {
    const minimal: EnvConfig = { packages: {}, dependencies: {} }
    expect(() => getPublishedAt('sui', minimal)).toThrow(
      "Package 'sui' not found in supplied environment"
    )
  })

  it('concurrent callers with different envs do not interfere', () => {
    const base = getEnv('testnet')
    const envA = cloneEnv(base, { packages: { sui: { publishedAt: '0xAAA' } } })
    const envB = cloneEnv(base, { packages: { sui: { publishedAt: '0xBBB' } } })

    // Interleave reads as if two callers were racing
    expect(getPublishedAt('sui', envA)).toBe('0xAAA')
    expect(getPublishedAt('sui', envB)).toBe('0xBBB')
    expect(getPublishedAt('sui', envA)).toBe('0xAAA')
    // And the global env is still the registered one
    expect(getActiveEnv().packages['sui'].publishedAt).toBe('0x2')
  })
})
