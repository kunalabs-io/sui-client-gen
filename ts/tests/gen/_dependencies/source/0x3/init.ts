import * as genesis from './genesis/structs'
import * as stakeSubsidy from './stake-subsidy/structs'
import * as stakingPool from './staking-pool/structs'
import * as storageFund from './storage-fund/structs'
import * as suiSystemStateInner from './sui-system-state-inner/structs'
import * as suiSystem from './sui-system/structs'
import * as validatorCap from './validator-cap/structs'
import * as validatorSet from './validator-set/structs'
import * as validatorWrapper from './validator-wrapper/structs'
import * as validator from './validator/structs'
import * as votingPower from './voting-power/structs'
import { StructClassLoader } from '../../../_framework/loader'

export function registerClasses(loader: StructClassLoader) {
  loader.register(genesis.GenesisValidatorMetadata)
  loader.register(genesis.GenesisChainParameters)
  loader.register(genesis.TokenDistributionSchedule)
  loader.register(genesis.TokenAllocation)
  loader.register(stakeSubsidy.StakeSubsidy)
  loader.register(stakingPool.StakingPool)
  loader.register(stakingPool.PoolTokenExchangeRate)
  loader.register(stakingPool.StakedSui)
  loader.register(stakingPool.FungibleStakedSui)
  loader.register(stakingPool.FungibleStakedSuiData)
  loader.register(stakingPool.FungibleStakedSuiDataKey)
  loader.register(stakingPool.UnderflowSuiBalance)
  loader.register(storageFund.StorageFund)
  loader.register(suiSystem.SuiSystemState)
  loader.register(suiSystemStateInner.ExecutionTimeObservationChunkKey)
  loader.register(suiSystemStateInner.SystemParameters)
  loader.register(suiSystemStateInner.SystemParametersV2)
  loader.register(suiSystemStateInner.SuiSystemStateInner)
  loader.register(suiSystemStateInner.SuiSystemStateInnerV2)
  loader.register(suiSystemStateInner.SystemEpochInfoEvent)
  loader.register(validator.ValidatorMetadata)
  loader.register(validator.Validator)
  loader.register(validator.StakingRequestEvent)
  loader.register(validator.UnstakingRequestEvent)
  loader.register(validator.ConvertingToFungibleStakedSuiEvent)
  loader.register(validator.RedeemingFungibleStakedSuiEvent)
  loader.register(validatorCap.UnverifiedValidatorOperationCap)
  loader.register(validatorCap.ValidatorOperationCap)
  loader.register(validatorSet.ValidatorSet)
  loader.register(validatorSet.ValidatorEpochInfoEvent)
  loader.register(validatorSet.ValidatorEpochInfoEventV2)
  loader.register(validatorSet.ValidatorJoinEvent)
  loader.register(validatorSet.ValidatorLeaveEvent)
  loader.register(validatorSet.VotingPowerAdmissionStartEpochKey)
  loader.register(validatorWrapper.ValidatorWrapper)
  loader.register(votingPower.VotingPowerInfo)
  loader.register(votingPower.VotingPowerInfoV2)
}
