import * as package_8ca3a4eb60a07bf0dd80dccfcec25a427275fc5af85ca9af63e34661c36a4f20 from '../fixture/init'
import * as package_1 from '../move-stdlib/init'
import * as package_2 from '../sui/init'
import { structClassLoaderSource as structClassLoader } from './loader'

let initialized = false
export function initLoaderIfNeeded() {
  if (initialized) {
    return
  }
  initialized = true
  package_1.registerClasses(structClassLoader)
  package_2.registerClasses(structClassLoader)
  package_8ca3a4eb60a07bf0dd80dccfcec25a427275fc5af85ca9af63e34661c36a4f20.registerClasses(
    structClassLoader
  )
}
