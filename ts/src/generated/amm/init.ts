import { StructClassLoader } from 'framework/loader'
import * as pool from './pool/structs'

export function registerClasses(loader: StructClassLoader) {
  loader.register(
    pool.PoolCreationEvent,
    pool.LP,
    pool.Pool,
    pool.PoolRegistry,
    pool.PoolRegistryItem
  )
}
