import { getPublishedAt } from '../../_envs'
import { obj, pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export interface LoadNitroAttestationArgs {
  attestation: Array<number | TransactionArgument> | TransactionArgument
  clock: TransactionObjectInput
}

export function loadNitroAttestation(tx: Transaction, args: LoadNitroAttestationArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::nitro_attestation::load_nitro_attestation`,
    arguments: [pure(tx, args.attestation, `vector<u8>`), obj(tx, args.clock)],
  })
}

export function moduleId(tx: Transaction, attestation: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::nitro_attestation::module_id`,
    arguments: [obj(tx, attestation)],
  })
}

export function timestamp(tx: Transaction, attestation: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::nitro_attestation::timestamp`,
    arguments: [obj(tx, attestation)],
  })
}

export function digest(tx: Transaction, attestation: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::nitro_attestation::digest`,
    arguments: [obj(tx, attestation)],
  })
}

export function pcrs(tx: Transaction, attestation: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::nitro_attestation::pcrs`,
    arguments: [obj(tx, attestation)],
  })
}

export function publicKey(tx: Transaction, attestation: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::nitro_attestation::public_key`,
    arguments: [obj(tx, attestation)],
  })
}

export function userData(tx: Transaction, attestation: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::nitro_attestation::user_data`,
    arguments: [obj(tx, attestation)],
  })
}

export function nonce(tx: Transaction, attestation: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::nitro_attestation::nonce`,
    arguments: [obj(tx, attestation)],
  })
}

export function index(tx: Transaction, entry: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::nitro_attestation::index`,
    arguments: [obj(tx, entry)],
  })
}

export function value(tx: Transaction, entry: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::nitro_attestation::value`,
    arguments: [obj(tx, entry)],
  })
}

export interface LoadNitroAttestationInternalArgs {
  attestation: Array<number | TransactionArgument> | TransactionArgument
  currentTimestamp: bigint | TransactionArgument
}

export function loadNitroAttestationInternal(
  tx: Transaction,
  args: LoadNitroAttestationInternalArgs
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::nitro_attestation::load_nitro_attestation_internal`,
    arguments: [pure(tx, args.attestation, `vector<u8>`), pure(tx, args.currentTimestamp, `u64`)],
  })
}
