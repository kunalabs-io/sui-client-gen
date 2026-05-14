/**
 * Environment management for sui-client-gen generated code.
 *
 * This module provides runtime environment switching, allowing generated code
 * to work with different networks (mainnet, testnet, custom) without regeneration.
 */

// ============================================================================
// Types
// ============================================================================

/**
 * Configuration for a single package (top-level or dependency).
 */
export interface PackageConfig {
  /** Original package ID (the package's permanent identifier) */
  originalId: string
  /** Address to use for function calls (may differ after upgrades) */
  publishedAt: string
  /** Type origins: maps "module::TypeName" to the defining package address */
  typeOrigins: Record<string, string>
}

/**
 * Complete environment configuration containing all packages and dependencies.
 */
export interface EnvConfig {
  /** Top-level package configurations, keyed by kebab-case package name */
  packages: Record<string, PackageConfig>
  /** Dependency package configurations, keyed by kebab-case package name */
  dependencies: Record<string, PackageConfig>
}

// Environment registry - maps env name to config
const envRegistry: Record<string, EnvConfig> = {}

// Active environment state
let activeEnv: EnvConfig | null = null
let activeEnvName: string | null = null
let publishedAtOverrides: Record<string, string> = {}

/**
 * Register an environment configuration.
 * Called during init to register generated env configs.
 */
export function registerEnv(name: string, config: EnvConfig): void {
  envRegistry[name] = config
}

/**
 * Get a registered environment configuration by name.
 * Useful when building an ad-hoc config derived from a known env, e.g. via `cloneEnv`.
 * @throws Error if the environment is not registered.
 */
export function getEnv(name: string): EnvConfig {
  const config = envRegistry[name]
  if (!config) {
    const available = Object.keys(envRegistry).join(', ') || '(none registered)'
    throw new Error(`Environment '${name}' not found. Available: ${available}`)
  }
  return config
}

/**
 * Produce a new `EnvConfig` by shallow-merging `overrides` onto `base`, per package.
 *
 * Only the fields you provide on each package are replaced — other fields (including
 * the untouched packages) are preserved by reference. Useful for creating a scoped
 * env for a single call (e.g. to target a historical `publishedAt`) without mutating
 * any shared state.
 *
 * @example
 *   const historical = cloneEnv(getEnv('mainnet'), {
 *     packages: { 'my-app': { publishedAt: '0x...' } },
 *   })
 *   transfer(tx, typeArgs, args, { env: historical })
 */
export function cloneEnv(
  base: EnvConfig,
  overrides?: {
    packages?: Record<string, Partial<PackageConfig>>
    dependencies?: Record<string, Partial<PackageConfig>>
  },
): EnvConfig {
  const mergeSection = (
    section: Record<string, PackageConfig>,
    patch: Record<string, Partial<PackageConfig>> | undefined,
  ): Record<string, PackageConfig> => {
    if (!patch) return { ...section }
    const merged: Record<string, PackageConfig> = { ...section }
    for (const [pkgName, pkgPatch] of Object.entries(patch)) {
      const prior = section[pkgName]
      if (!prior) {
        throw new Error(
          `cloneEnv: cannot override unknown package '${pkgName}'. `
            + `Available: ${Object.keys(section).join(', ') || '(none)'}`,
        )
      }
      merged[pkgName] = {
        ...prior,
        ...pkgPatch,
        typeOrigins: { ...prior.typeOrigins, ...(pkgPatch.typeOrigins ?? {}) },
      }
    }
    return merged
  }

  return {
    packages: mergeSection(base.packages, overrides?.packages),
    dependencies: mergeSection(base.dependencies, overrides?.dependencies),
  }
}

/**
 * Set the active environment by name.
 * @param name - The name of a registered environment
 * @param overrides - Optional map of package names to publishedAt addresses to override
 * @throws Error if the environment is not registered
 */
export function setActiveEnv(name: string, overrides?: Record<string, string>): void {
  if (!envRegistry[name]) {
    const available = Object.keys(envRegistry).join(', ') || '(none registered)'
    throw new Error(`Environment '${name}' not found. Available: ${available}`)
  }
  activeEnv = envRegistry[name]
  activeEnvName = name
  publishedAtOverrides = overrides ?? {}
}

/**
 * Set the active environment using a custom config object.
 * Use this to provide a custom environment configuration at runtime.
 * @param config - A custom EnvConfig object
 * @param overrides - Optional map of package names to publishedAt addresses to override
 */
export function setActiveEnvWithConfig(
  config: EnvConfig,
  overrides?: Record<string, string>,
): void {
  activeEnv = config
  activeEnvName = 'custom'
  publishedAtOverrides = overrides ?? {}
}

/**
 * Get the active environment configuration.
 * @throws Error if no environment is set
 */
export function getActiveEnv(): EnvConfig {
  if (!activeEnv) {
    throw new Error('No active environment. Call setActiveEnv() or import the envs module first.')
  }
  return activeEnv
}

/**
 * Get the active environment name.
 * Returns null if no environment is set.
 */
export function getActiveEnvName(): string | null {
  return activeEnvName
}

/**
 * Get the list of registered environment names.
 */
export function getRegisteredEnvs(): string[] {
  return Object.keys(envRegistry)
}

/**
 * Describe the env source for error messages: either a caller-supplied scope or
 * the current active env (named).
 */
function envScopeLabel(env: EnvConfig | undefined): string {
  return env ? 'supplied environment' : `active environment '${activeEnvName}'`
}

/**
 * Resolve an `EnvConfig` for a read: use the caller-supplied one if present, else
 * fall back to the active global env. A missing active env throws.
 */
function resolveEnv(env?: EnvConfig): EnvConfig {
  return env ?? getActiveEnv()
}

/**
 * Get configuration for a top-level package.
 * @throws Error if package not found
 */
export function getPackageConfig(pkgName: string, env?: EnvConfig): PackageConfig {
  const source = resolveEnv(env)
  const config = source.packages[pkgName]
  if (!config) {
    throw new Error(`Package '${pkgName}' not found in ${envScopeLabel(env)}`)
  }
  return config
}

/**
 * Get configuration for a dependency package.
 * @throws Error if dependency not found
 */
export function getDependencyConfig(pkgName: string, env?: EnvConfig): PackageConfig {
  const source = resolveEnv(env)
  const config = source.dependencies[pkgName]
  if (!config) {
    throw new Error(`Dependency '${pkgName}' not found in ${envScopeLabel(env)}`)
  }
  return config
}

/**
 * Get the publishedAt address for function calls.
 *
 * When an explicit `env` is supplied, it is authoritative and the module-level
 * `publishedAtOverrides` (set via `setActiveEnv`) are ignored — callers that pass
 * their own env own their own scope. Otherwise the active env is used with overrides
 * applied on top.
 *
 * @throws Error if package not found
 */
export function getPublishedAt(pkgName: string, env?: EnvConfig): string {
  if (env) {
    const config = env.packages[pkgName] || env.dependencies[pkgName]
    if (!config) {
      throw new Error(`Package '${pkgName}' not found in supplied environment`)
    }
    return config.publishedAt
  }

  if (publishedAtOverrides[pkgName]) {
    return publishedAtOverrides[pkgName]
  }

  const active = getActiveEnv()
  const config = active.packages[pkgName] || active.dependencies[pkgName]
  if (!config) {
    throw new Error(`Package '${pkgName}' not found in active environment '${activeEnvName}'`)
  }
  return config.publishedAt
}

/**
 * Get the type origin address for a specific type.
 * Used in $typeName construction for structs and enums.
 * @param pkgName - Kebab-case package name
 * @param moduleTypePath - "module::TypeName" format (e.g., "balance::Balance")
 * @throws Error if package or type origin not found
 */
export function getTypeOrigin(pkgName: string, moduleTypePath: string, env?: EnvConfig): string {
  const source = resolveEnv(env)
  const config = source.packages[pkgName] || source.dependencies[pkgName]
  if (!config) {
    throw new Error(`Package '${pkgName}' not found in ${envScopeLabel(env)}`)
  }
  const origin = config.typeOrigins[moduleTypePath]
  if (!origin) {
    throw new Error(
      `Type origin for '${moduleTypePath}' not found in package '${pkgName}'. `
        + `Available: ${Object.keys(config.typeOrigins).join(', ') || '(none)'}`,
    )
  }
  return origin
}

/**
 * Get the original package ID.
 * Works for both packages and dependencies.
 * @throws Error if package not found
 */
export function getOriginalId(pkgName: string, env?: EnvConfig): string {
  const source = resolveEnv(env)
  const config = source.packages[pkgName] || source.dependencies[pkgName]
  if (!config) {
    throw new Error(`Package '${pkgName}' not found in ${envScopeLabel(env)}`)
  }
  return config.originalId
}

/**
 * Get all distinct addresses where types in this package were defined.
 * Useful for understanding package upgrade history and querying objects.
 * Works for both packages and dependencies.
 * @param pkgName - Kebab-case package name
 * @returns Array of unique addresses, sorted for determinism
 * @throws Error if package not found
 */
export function getTypeOriginAddresses(pkgName: string, env?: EnvConfig): string[] {
  const source = resolveEnv(env)
  const config = source.packages[pkgName] || source.dependencies[pkgName]
  if (!config) {
    throw new Error(`Package '${pkgName}' not found in ${envScopeLabel(env)}`)
  }
  const uniqueAddresses = new Set(Object.values(config.typeOrigins))
  return Array.from(uniqueAddresses).sort()
}

/**
 * Get distinct addresses where specific types are defined.
 * Useful for querying objects of specific types.
 * Works for both packages and dependencies.
 * @param pkgName - Kebab-case package name
 * @param moduleTypePaths - Array of "module::TypeName" strings (e.g., ["balance::Balance", "coin::Coin"])
 * @returns Array of unique addresses, sorted for determinism
 * @throws Error if package not found or any type origin not found
 */
export function getTypeOriginAddressesFor(
  pkgName: string,
  moduleTypePaths: string[],
  env?: EnvConfig,
): string[] {
  const source = resolveEnv(env)
  const config = source.packages[pkgName] || source.dependencies[pkgName]
  if (!config) {
    throw new Error(`Package '${pkgName}' not found in ${envScopeLabel(env)}`)
  }
  const addresses = new Set<string>()
  for (const path of moduleTypePaths) {
    const origin = config.typeOrigins[path]
    if (!origin) {
      throw new Error(
        `Type origin for '${path}' not found in package '${pkgName}'. `
          + `Available: ${Object.keys(config.typeOrigins).join(', ') || '(none)'}`,
      )
    }
    addresses.add(origin)
  }
  return Array.from(addresses).sort()
}
