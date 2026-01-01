import * as bridge from './bridge/structs'
import * as chainIds from './chain-ids/structs'
import * as committee from './committee/structs'
import * as limiter from './limiter/structs'
import * as message from './message/structs'
import * as treasury from './treasury/structs'
import { StructClassLoader } from '../../../_framework/loader'

export function registerClasses(loader: StructClassLoader) {
  loader.register(bridge.Bridge)
  loader.register(bridge.BridgeInner)
  loader.register(bridge.TokenDepositedEvent)
  loader.register(bridge.EmergencyOpEvent)
  loader.register(bridge.BridgeRecord)
  loader.register(bridge.TokenTransferApproved)
  loader.register(bridge.TokenTransferClaimed)
  loader.register(bridge.TokenTransferAlreadyApproved)
  loader.register(bridge.TokenTransferAlreadyClaimed)
  loader.register(bridge.TokenTransferLimitExceed)
  loader.register(chainIds.BridgeRoute)
  loader.register(committee.BlocklistValidatorEvent)
  loader.register(committee.BridgeCommittee)
  loader.register(committee.CommitteeUpdateEvent)
  loader.register(committee.CommitteeMemberUrlUpdateEvent)
  loader.register(committee.CommitteeMember)
  loader.register(committee.CommitteeMemberRegistration)
  loader.register(limiter.TransferLimiter)
  loader.register(limiter.TransferRecord)
  loader.register(limiter.UpdateRouteLimitEvent)
  loader.register(message.BridgeMessage)
  loader.register(message.BridgeMessageKey)
  loader.register(message.TokenTransferPayload)
  loader.register(message.EmergencyOp)
  loader.register(message.Blocklist)
  loader.register(message.UpdateBridgeLimit)
  loader.register(message.UpdateAssetPrice)
  loader.register(message.AddTokenOnSui)
  loader.register(message.ParsedTokenTransferMessage)
  loader.register(treasury.BridgeTreasury)
  loader.register(treasury.BridgeTokenMetadata)
  loader.register(treasury.ForeignTokenRegistration)
  loader.register(treasury.UpdateTokenPriceEvent)
  loader.register(treasury.NewTokenEvent)
  loader.register(treasury.TokenRegistrationEvent)
}
