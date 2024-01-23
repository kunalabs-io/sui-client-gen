import * as authenticatorState from './authenticator-state/structs'
import * as bag from './bag/structs'
import * as balance from './balance/structs'
import * as bcs from './bcs/structs'
import * as borrow from './borrow/structs'
import * as clock from './clock/structs'
import * as coin from './coin/structs'
import * as display from './display/structs'
import * as dynamicField from './dynamic-field/structs'
import * as dynamicObjectField from './dynamic-object-field/structs'
import * as groth16 from './groth16/structs'
import * as kioskExtension from './kiosk-extension/structs'
import * as kiosk from './kiosk/structs'
import * as linkedTable from './linked-table/structs'
import * as objectBag from './object-bag/structs'
import * as objectTable from './object-table/structs'
import * as object from './object/structs'
import * as package_ from './package/structs'
import * as priorityQueue from './priority-queue/structs'
import * as random from './random/structs'
import * as sui from './sui/structs'
import * as tableVec from './table-vec/structs'
import * as table from './table/structs'
import * as token from './token/structs'
import * as transferPolicy from './transfer-policy/structs'
import * as transfer from './transfer/structs'
import * as txContext from './tx-context/structs'
import * as url from './url/structs'
import * as vecMap from './vec-map/structs'
import * as vecSet from './vec-set/structs'
import * as versioned from './versioned/structs'
import * as zkloginVerifiedId from './zklogin-verified-id/structs'
import * as zkloginVerifiedIssuer from './zklogin-verified-issuer/structs'
import { StructClassLoader } from '../../../_framework/loader'

export function registerClasses(loader: StructClassLoader) {
  loader.register(groth16.Curve)
  loader.register(groth16.PreparedVerifyingKey)
  loader.register(groth16.PublicProofInputs)
  loader.register(groth16.ProofPoints)
  loader.register(txContext.TxContext)
  loader.register(balance.Supply)
  loader.register(balance.Balance)
  loader.register(priorityQueue.PriorityQueue)
  loader.register(priorityQueue.Entry)
  loader.register(url.Url)
  loader.register(object.ID)
  loader.register(object.UID)
  loader.register(transfer.Receiving)
  loader.register(clock.Clock)
  loader.register(zkloginVerifiedId.VerifiedID)
  loader.register(zkloginVerifiedIssuer.VerifiedIssuer)
  loader.register(bcs.BCS)
  loader.register(borrow.Referent)
  loader.register(borrow.Borrow)
  loader.register(coin.Coin)
  loader.register(coin.CoinMetadata)
  loader.register(coin.TreasuryCap)
  loader.register(coin.CurrencyCreated)
  loader.register(dynamicField.Field)
  loader.register(authenticatorState.AuthenticatorState)
  loader.register(authenticatorState.AuthenticatorStateInner)
  loader.register(authenticatorState.JWK)
  loader.register(authenticatorState.JwkId)
  loader.register(authenticatorState.ActiveJwk)
  loader.register(bag.Bag)
  loader.register(table.Table)
  loader.register(tableVec.TableVec)
  loader.register(versioned.Versioned)
  loader.register(versioned.VersionChangeCap)
  loader.register(random.Random)
  loader.register(random.RandomInner)
  loader.register(dynamicObjectField.Wrapper)
  loader.register(linkedTable.LinkedTable)
  loader.register(linkedTable.Node)
  loader.register(objectBag.ObjectBag)
  loader.register(objectTable.ObjectTable)
  loader.register(sui.SUI)
  loader.register(vecMap.Entry)
  loader.register(vecMap.VecMap)
  loader.register(vecSet.VecSet)
  loader.register(package_.Publisher)
  loader.register(package_.UpgradeCap)
  loader.register(package_.UpgradeTicket)
  loader.register(package_.UpgradeReceipt)
  loader.register(display.Display)
  loader.register(display.DisplayCreated)
  loader.register(display.VersionUpdated)
  loader.register(token.Token)
  loader.register(token.TokenPolicyCap)
  loader.register(token.TokenPolicy)
  loader.register(token.ActionRequest)
  loader.register(token.RuleKey)
  loader.register(token.TokenPolicyCreated)
  loader.register(transferPolicy.RuleKey)
  loader.register(transferPolicy.TransferRequest)
  loader.register(transferPolicy.TransferPolicy)
  loader.register(transferPolicy.TransferPolicyCap)
  loader.register(transferPolicy.TransferPolicyCreated)
  loader.register(transferPolicy.TransferPolicyDestroyed)
  loader.register(kiosk.Borrow)
  loader.register(kiosk.Kiosk)
  loader.register(kiosk.KioskOwnerCap)
  loader.register(kiosk.PurchaseCap)
  loader.register(kiosk.Item)
  loader.register(kiosk.Listing)
  loader.register(kiosk.Lock)
  loader.register(kiosk.ItemListed)
  loader.register(kiosk.ItemPurchased)
  loader.register(kiosk.ItemDelisted)
  loader.register(kioskExtension.Extension)
  loader.register(kioskExtension.ExtensionKey)
}
