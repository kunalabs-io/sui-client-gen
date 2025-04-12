import * as pool from './pool/structs'
import { StructClassLoader } from '../_framework/loader'

export function registerClasses(loader: StructClassLoader) {
  loader.register(pool.PoolCreationEvent)
  loader.register(pool.LP)
  loader.register(pool.Pool)
  loader.register(pool.PoolRegistry)
  loader.register(pool.PoolRegistryItem)
  loader.register(pool.AdminCap)
}
