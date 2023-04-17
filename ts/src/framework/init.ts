import { StructClassLoader } from 'framework/loader'
import * as balance from './balance'
import * as coin from './coin'
import * as dynamicField from './dynamic-field'
import * as object from './object'
import * as table from './table'
import * as typeName from './type-name'

export function registerClasses(loader: StructClassLoader) {
  loader.register(balance.Balance)
  loader.register(coin.Coin, coin.TreasuryCap)
  loader.register(dynamicField.Field)
  loader.register(object.ID, object.UID)
  loader.register(table.Table)
  loader.register(typeName.TypeName)
}
