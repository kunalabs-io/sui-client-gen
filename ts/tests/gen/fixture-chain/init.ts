import * as exampleCoin from './example-coin/structs'
import * as fixture from './fixture/structs'
import * as otherModule from './other-module/structs'
import { StructClassLoader } from '../_framework/loader'

export function registerClasses(loader: StructClassLoader) {
  loader.register(otherModule.StructFromOtherModule)
  loader.register(exampleCoin.EXAMPLE_COIN)
  loader.register(exampleCoin.Faucet)
  loader.register(fixture.Dummy)
  loader.register(fixture.Bar)
  loader.register(fixture.WithTwoGenerics)
  loader.register(fixture.Foo)
  loader.register(fixture.WithSpecialTypes)
  loader.register(fixture.WithSpecialTypesAsGenerics)
  loader.register(fixture.WithSpecialTypesInVectors)
}
