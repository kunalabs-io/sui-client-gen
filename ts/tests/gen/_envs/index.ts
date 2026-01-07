// Re-export environment configs
export * from './testnet'
export * from './testnet_alt'

// Import internal functions and env configs
import { registerEnv, setActiveEnv } from '../_framework/env'
import { testnetEnv } from './testnet'
import { testnetAltEnv } from './testnet_alt'

// Initialize environments (runs once on first import)
let initialized = false
if (!initialized) {
  registerEnv('testnet', testnetEnv)
  registerEnv('testnet_alt', testnetAltEnv)
  setActiveEnv('testnet')
  initialized = true
}

// Re-export public API from _framework/env
export {
  setActiveEnv,
  setActiveEnvWithConfig,
  getActiveEnv,
  getActiveEnvName,
  getRegisteredEnvs,
  getPackageConfig,
  getDependencyConfig,
  getPublishedAt,
  getTypeOrigin,
  getOriginalId,
} from '../_framework/env'
export type { EnvConfig, PackageConfig } from '../_framework/env'
