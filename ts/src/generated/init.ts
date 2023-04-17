import { structClassLoader } from 'framework/loader'
import * as framework from 'framework/init'
import * as amm from 'generated/amm/init'
import * as fixture from 'generated/fixture/init'

let initialized = false

export function initLoaderIfNeeded() {
  if (initialized) {
    return
  }
  initialized = true

  framework.registerClasses(structClassLoader)
  amm.registerClasses(structClassLoader)
  fixture.registerClasses(structClassLoader)
}
