// Re-export environment configs
export * from './testnet'

// Import internal functions and env configs
import { registerEnv, setActiveEnv } from '../_framework/env'
import { testnetEnv } from './testnet'

// Initialize environments (runs once on first import)
let initialized = false
if (!initialized) {
  registerEnv('testnet', testnetEnv)
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
  getTypeOriginAddresses,
  getTypeOriginAddressesFor,
  setActiveEnv,
  setActiveEnvWithConfig,
} from '../_framework/env'
export type { EnvConfig, PackageConfig } from '../_framework/env'
