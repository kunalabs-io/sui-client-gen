import { PUBLISHED_AT } from '..'
import { obj, pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export interface LoadNitroAttestationArgs {
  vecU8: Array<number | TransactionArgument> | TransactionArgument
  clock: TransactionObjectInput
}

export function loadNitroAttestation(tx: Transaction, args: LoadNitroAttestationArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::nitro_attestation::load_nitro_attestation`,
    arguments: [pure(tx, args.vecU8, `vector<u8>`), obj(tx, args.clock)],
  })
}

export function moduleId(tx: Transaction, nitroAttestationDocument: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::nitro_attestation::module_id`,
    arguments: [obj(tx, nitroAttestationDocument)],
  })
}

export function timestamp(tx: Transaction, nitroAttestationDocument: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::nitro_attestation::timestamp`,
    arguments: [obj(tx, nitroAttestationDocument)],
  })
}

export function digest(tx: Transaction, nitroAttestationDocument: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::nitro_attestation::digest`,
    arguments: [obj(tx, nitroAttestationDocument)],
  })
}

export function pcrs(tx: Transaction, nitroAttestationDocument: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::nitro_attestation::pcrs`,
    arguments: [obj(tx, nitroAttestationDocument)],
  })
}

export function publicKey(tx: Transaction, nitroAttestationDocument: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::nitro_attestation::public_key`,
    arguments: [obj(tx, nitroAttestationDocument)],
  })
}

export function userData(tx: Transaction, nitroAttestationDocument: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::nitro_attestation::user_data`,
    arguments: [obj(tx, nitroAttestationDocument)],
  })
}

export function nonce(tx: Transaction, nitroAttestationDocument: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::nitro_attestation::nonce`,
    arguments: [obj(tx, nitroAttestationDocument)],
  })
}

export function index(tx: Transaction, pcrEntry: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::nitro_attestation::index`,
    arguments: [obj(tx, pcrEntry)],
  })
}

export function value(tx: Transaction, pcrEntry: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::nitro_attestation::value`,
    arguments: [obj(tx, pcrEntry)],
  })
}

export interface LoadNitroAttestationInternalArgs {
  vecU8: Array<number | TransactionArgument> | TransactionArgument
  u64: bigint | TransactionArgument
}

export function loadNitroAttestationInternal(
  tx: Transaction,
  args: LoadNitroAttestationInternalArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::nitro_attestation::load_nitro_attestation_internal`,
    arguments: [pure(tx, args.vecU8, `vector<u8>`), pure(tx, args.u64, `u64`)],
  })
}
