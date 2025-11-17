import * as package_source_8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209 from '../examples/init'
import * as package_source_1 from '../move-stdlib/init'
import * as package_source_2 from '../sui/init'
import { StructClassLoader } from './loader'

function registerClassesSource(loader: StructClassLoader) {
  package_source_1.registerClasses(loader)
  package_source_2.registerClasses(loader)
  package_source_8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209.registerClasses(
    loader
  )
}

export function registerClasses(loader: StructClassLoader) {
  registerClassesSource(loader)
}
