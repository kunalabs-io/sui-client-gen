import * as package_1 from '../_dependencies/source/0x1/init'
import * as package_f917eb03d02b9221b10276064b2c10296276cb43feb24aac35113a272dd691c7 from '../amm/init'
import * as package_8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209 from '../examples/init'
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
  package_8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209.registerClasses(
    structClassLoader
  )
  package_f917eb03d02b9221b10276064b2c10296276cb43feb24aac35113a272dd691c7.registerClasses(
    structClassLoader
  )
}
