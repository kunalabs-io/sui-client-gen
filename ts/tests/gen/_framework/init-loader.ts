import * as package_8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209 from '../examples/init'
import * as package_1 from '../std/init'
import * as package_2 from '../sui/init'
import { StructClassLoader } from './loader'

export function registerClasses(loader: StructClassLoader): void {
  package_1.registerClasses(loader)
  package_2.registerClasses(loader)
  package_8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209.registerClasses(loader)
}
