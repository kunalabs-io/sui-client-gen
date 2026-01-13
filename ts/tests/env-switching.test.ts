import { it, expect, describe, afterAll } from 'vitest'
import {
  setActiveEnv,
  setActiveEnvWithConfig,
  getActiveEnvName,
  getRegisteredEnvs,
  getPublishedAt,
  getOriginalId,
  getTypeOrigin,
  getTypeOriginAddresses,
  getTypeOriginAddressesFor,
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
