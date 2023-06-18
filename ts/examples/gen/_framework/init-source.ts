import * as package_1 from '../_dependencies/source/0x1/init'
import * as package_a2e606bf4fc2f98902fea611310f9f3d826aeacef767db704126b63ce16670bc from '../amm/init'
import * as package_2991435bfa6230ddf9bf1ac5e2abffb293692f9de47d008cb4cc6ff06f5a2e88 from '../examples/init'
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
  package_2991435bfa6230ddf9bf1ac5e2abffb293692f9de47d008cb4cc6ff06f5a2e88.registerClasses(
    structClassLoader
  )
  package_a2e606bf4fc2f98902fea611310f9f3d826aeacef767db704126b63ce16670bc.registerClasses(
    structClassLoader
  )
}
