import * as package_1 from '../_dependencies/onchain/0x1/init'
import * as package_2 from '../_dependencies/onchain/0x2/init'
import * as package_7ba5cba498c68bf18ef584d7ed56c45598f8eda8a933785164072299cb4b5e15 from '../fixture-chain/init'
import { structClassLoaderOnchain as structClassLoader } from './loader'

let initialized = false
export function initLoaderIfNeeded() {
  if (initialized) {
    return
  }
  initialized = true
  package_1.registerClasses(structClassLoader)
  package_2.registerClasses(structClassLoader)
  package_7ba5cba498c68bf18ef584d7ed56c45598f8eda8a933785164072299cb4b5e15.registerClasses(
    structClassLoader
  )
}
