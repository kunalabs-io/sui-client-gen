import { it, expect, describe, afterAll } from 'vitest'
import {
  setActiveEnv,
  getActiveEnvName,
  getRegisteredEnvs,
  getPublishedAt,
  getOriginalId,
  getTypeOrigin,
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
