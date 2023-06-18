import * as package_1 from '../_dependencies/onchain/0x1/init'
import * as package_2 from '../_dependencies/onchain/0x2/init'
import * as package_2991435bfa6230ddf9bf1ac5e2abffb293692f9de47d008cb4cc6ff06f5a2e88 from '../examples-chain/init'
import { structClassLoaderOnchain as structClassLoader } from './loader'

let initialized = false
export function initLoaderIfNeeded() {
  if (initialized) {
    return
  }
  initialized = true
  package_1.registerClasses(structClassLoader)
  package_2.registerClasses(structClassLoader)
  package_2991435bfa6230ddf9bf1ac5e2abffb293692f9de47d008cb4cc6ff06f5a2e88.registerClasses(
    structClassLoader
  )
}
