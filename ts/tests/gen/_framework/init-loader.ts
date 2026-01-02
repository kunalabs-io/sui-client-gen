import * as package_source_3 from '../_dependencies/source/0x3/init'
import * as package_source_b from '../_dependencies/source/0xb/init'
import * as package_onchain_8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209 from '../examples-chain/init'
import * as package_source_8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209 from '../examples/init'
import * as package_onchain_1 from '../move-stdlib-chain/init'
import * as package_source_1 from '../move-stdlib/init'
import * as package_onchain_2 from '../sui-chain/init'
import * as package_source_2 from '../sui/init'
import { StructClassLoader } from './loader'

function registerClassesSource(loader: StructClassLoader) {
  package_source_1.registerClasses(loader)
  package_source_2.registerClasses(loader)
  package_source_3.registerClasses(loader)
  package_source_b.registerClasses(loader)
  package_source_8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209.registerClasses(
    loader
  )
}

function registerClassesOnchain(loader: StructClassLoader) {
  package_onchain_1.registerClasses(loader)
  package_onchain_2.registerClasses(loader)
  package_onchain_8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209.registerClasses(
    loader
  )
}

export function registerClasses(loader: StructClassLoader) {
  registerClassesOnchain(loader)
  registerClassesSource(loader)
}
