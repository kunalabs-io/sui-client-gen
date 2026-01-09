import {
  Transaction,
  TransactionArgument,
  TransactionObjectInput,
  TransactionResult,
} from '@mysten/sui/transactions'
import { getPublishedAt } from '../../_envs'
import { obj, pure } from '../../_framework/util'

export interface LoadNitroAttestationArgs {
  attestation: Array<number | TransactionArgument> | TransactionArgument
  clock: TransactionObjectInput
}

/**
 * @param attestation: attesttaion documents bytes data.
 * @param clock: the clock object.
 *
 * Returns the parsed NitroAttestationDocument after verifying the attestation,
 * may abort with errors described above.
 */
export function loadNitroAttestation(
  tx: Transaction,
  args: LoadNitroAttestationArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::nitro_attestation::load_nitro_attestation`,
    arguments: [
      pure(tx, args.attestation, `vector<u8>`),
      obj(tx, args.clock),
    ],
  })
}

export function moduleId(tx: Transaction, attestation: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::nitro_attestation::module_id`,
    arguments: [obj(tx, attestation)],
  })
}

export function timestamp(tx: Transaction, attestation: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::nitro_attestation::timestamp`,
    arguments: [obj(tx, attestation)],
  })
}

export function digest(tx: Transaction, attestation: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::nitro_attestation::digest`,
    arguments: [obj(tx, attestation)],
  })
}

/**
 * Returns a list of mapping PCREntry containg the index and the PCR bytes.
 * AWS supports PCR0-31. All-zero PCR values are excluded.
 */
export function pcrs(tx: Transaction, attestation: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::nitro_attestation::pcrs`,
    arguments: [obj(tx, attestation)],
  })
}

export function publicKey(tx: Transaction, attestation: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::nitro_attestation::public_key`,
    arguments: [obj(tx, attestation)],
  })
}

export function userData(tx: Transaction, attestation: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::nitro_attestation::user_data`,
    arguments: [obj(tx, attestation)],
  })
}

export function nonce(tx: Transaction, attestation: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::nitro_attestation::nonce`,
    arguments: [obj(tx, attestation)],
  })
}

export function index(tx: Transaction, entry: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::nitro_attestation::index`,
    arguments: [obj(tx, entry)],
  })
}

export function value(tx: Transaction, entry: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::nitro_attestation::value`,
    arguments: [obj(tx, entry)],
  })
}

export interface LoadNitroAttestationInternalArgs {
  attestation: Array<number | TransactionArgument> | TransactionArgument
  currentTimestamp: bigint | TransactionArgument
}

/** Internal native function */
export function loadNitroAttestationInternal(
  tx: Transaction,
  args: LoadNitroAttestationInternalArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::nitro_attestation::load_nitro_attestation_internal`,
    arguments: [
      pure(tx, args.attestation, `vector<u8>`),
      pure(tx, args.currentTimestamp, `u64`),
    ],
  })
}
