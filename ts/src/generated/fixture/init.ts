import { StructClassLoader } from 'framework/loader'
import * as fixture from './fixture/structs'
import * as exampleCoin from './example-coin/structs'

export function registerClasses(loader: StructClassLoader) {
  loader.register(fixture.WithGenericField)
  loader.register(exampleCoin.Faucet)
}
