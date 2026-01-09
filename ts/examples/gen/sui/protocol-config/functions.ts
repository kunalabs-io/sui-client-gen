import {
  Transaction,
  TransactionArgument,
  TransactionObjectInput,
  TransactionResult,
} from '@mysten/sui/transactions'
import { getPublishedAt } from '../../_envs'
import { pure } from '../../_framework/util'

/**
 * Checks if a specific protocol feature flag is enabled.
 *
 * Restricted to internal use within the sui-framework package only.
 * If we need to use it in sui-system, we can add friend declarations.
 * We should never need to expose this to user packages.
 *
 * # Arguments
 * * `feature_flag_name` - The name of the feature flag as bytes (e.g., b"enable_vdf")
 * - It is expected to be a valid UTF-8 string
 * - The flag should exist in the protocol config
 *
 * # Returns
 * * `true` if the feature is enabled in the current protocol version
 * * `false` if the feature is disabled
 *
 * # Example (for framework use only)
 * ```move
 * use sui::protocol_config;
 *
 * if (protocol_config::is_feature_enabled(b"enable_accumulators")) {
 * // Accumulators are available
 * };
 * ```
 */
export function isFeatureEnabled(
  tx: Transaction,
  featureFlagName: Array<number | TransactionArgument> | TransactionArgument,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::protocol_config::is_feature_enabled`,
    arguments: [pure(tx, featureFlagName, `vector<u8>`)],
  })
}
