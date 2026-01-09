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
  getActiveEnv,
  getActiveEnvName,
  getDependencyConfig,
  getOriginalId,
  getPackageConfig,
  getPublishedAt,
  getRegisteredEnvs,
  getTypeOrigin,
  setActiveEnv,
  setActiveEnvWithConfig,
} from '../_framework/env'
export type { EnvConfig, PackageConfig } from '../_framework/env'
