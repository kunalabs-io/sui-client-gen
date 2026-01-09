import {
  Transaction,
  TransactionArgument,
  TransactionObjectInput,
  TransactionResult,
} from '@mysten/sui/transactions'
import { getPublishedAt } from '../../_envs'
import { generic, GenericArg, obj as obj_, pure } from '../../_framework/util'
import { ID } from '../object/structs'

export interface TransferArgs {
  obj: GenericArg
  recipient: string | TransactionArgument
}

/**
 * Transfer ownership of `obj` to `recipient`. `obj` must have the `key` attribute,
 * which (in turn) ensures that `obj` has a globally unique ID. Note that if the recipient
 * address represents an object ID, the `obj` sent will be inaccessible after the transfer
 * (though they will be retrievable at a future date once new features are added).
 * This function has custom rules performed by the Sui Move bytecode verifier that ensures
 * that `T` is an object defined in the module where `transfer` is invoked. Use
 * `public_transfer` to transfer an object with `store` outside of its module.
 */
export function transfer(tx: Transaction, typeArg: string, args: TransferArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::transfer::transfer`,
    typeArguments: [typeArg],
    arguments: [
      generic(tx, `${typeArg}`, args.obj),
      pure(tx, args.recipient, `address`),
    ],
  })
}

export interface PublicTransferArgs {
  obj: GenericArg
  recipient: string | TransactionArgument
}

/**
 * Transfer ownership of `obj` to `recipient`. `obj` must have the `key` attribute,
 * which (in turn) ensures that `obj` has a globally unique ID. Note that if the recipient
 * address represents an object ID, the `obj` sent will be inaccessible after the transfer
 * (though they will be retrievable at a future date once new features are added).
 * The object must have `store` to be transferred outside of its module.
 */
export function publicTransfer(
  tx: Transaction,
  typeArg: string,
  args: PublicTransferArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::transfer::public_transfer`,
    typeArguments: [typeArg],
    arguments: [
      generic(tx, `${typeArg}`, args.obj),
      pure(tx, args.recipient, `address`),
    ],
  })
}

export interface PartyTransferArgs {
  obj: GenericArg
  party: TransactionObjectInput
}

/**
 * NOT YET SUPPORTED ON MAINNET. The function will abort with `ENotSupported` if used on a network
 * where party objects are not yet supported.
 * Transfer ownership of `obj` to the `party`. This transfer behaves similar to both
 * `transfer` and `share_object`. It is similar to `transfer` in that the object is authorized for
 * use only by the recipient(s), in this case the `party`. This means that only the members
 * can use the object as an input to a transaction. It is similar to `share_object` two ways. One
 * in that the object can potentially be used by anyone, as defined by the `default` permissions of
 * the `Party` value. The other in that the object must be used in consensus and cannot be
 * used in the fast path.
 * This function has custom rules performed by the Sui Move bytecode verifier that ensures that `T`
 * is an object defined in the module where `transfer` is invoked. Use `public_party_transfer`
 * to transfer an object with `store` outside of its module.
 */
export function partyTransfer(
  tx: Transaction,
  typeArg: string,
  args: PartyTransferArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::transfer::party_transfer`,
    typeArguments: [typeArg],
    arguments: [
      generic(tx, `${typeArg}`, args.obj),
      obj_(tx, args.party),
    ],
  })
}

export interface PublicPartyTransferArgs {
  obj: GenericArg
  party: TransactionObjectInput
}

/**
 * NOT YET SUPPORTED ON MAINNET. The function will abort with `ENotSupported` if used on a network
 * where party objects are not yet supported.
 * Transfer ownership of `obj` to the `party`. This transfer behaves similar to both
 * `transfer` and `share_object`. It is similar to `transfer` in that the object is authorized for
 * use only by the recipient(s), in this case the `party`. This means that only the members
 * can use the object as an input to a transaction. It is similar to `share_object` two ways. One
 * in that the object can potentially be used by anyone, as defined by the `default` permissions of
 * the `Party` value. The other in that the object must be used in consensus and cannot be
 * used in the fast path.
 * The object must have `store` to be transferred outside of its module.
 */
export function publicPartyTransfer(
  tx: Transaction,
  typeArg: string,
  args: PublicPartyTransferArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::transfer::public_party_transfer`,
    typeArguments: [typeArg],
    arguments: [
      generic(tx, `${typeArg}`, args.obj),
      obj_(tx, args.party),
    ],
  })
}

/**
 * Freeze `obj`. After freezing `obj` becomes immutable and can no longer be transferred or
 * mutated.
 * This function has custom rules performed by the Sui Move bytecode verifier that ensures
 * that `T` is an object defined in the module where `freeze_object` is invoked. Use
 * `public_freeze_object` to freeze an object with `store` outside of its module.
 */
export function freezeObject(tx: Transaction, typeArg: string, obj: GenericArg): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::transfer::freeze_object`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, obj)],
  })
}

/**
 * Freeze `obj`. After freezing `obj` becomes immutable and can no longer be transferred or
 * mutated.
 * The object must have `store` to be frozen outside of its module.
 */
export function publicFreezeObject(
  tx: Transaction,
  typeArg: string,
  obj: GenericArg,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::transfer::public_freeze_object`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, obj)],
  })
}

/**
 * Turn the given object into a mutable shared object that everyone can access and mutate.
 * This is irreversible, i.e. once an object is shared, it will stay shared forever.
 * Aborts with `ESharedNonNewObject` of the object being shared was not created in this
 * transaction. This restriction may be relaxed in the future.
 * This function has custom rules performed by the Sui Move bytecode verifier that ensures
 * that `T` is an object defined in the module where `share_object` is invoked. Use
 * `public_share_object` to share an object with `store` outside of its module.
 */
export function shareObject(tx: Transaction, typeArg: string, obj: GenericArg): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::transfer::share_object`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, obj)],
  })
}

/**
 * Turn the given object into a mutable shared object that everyone can access and mutate.
 * This is irreversible, i.e. once an object is shared, it will stay shared forever.
 * Aborts with `ESharedNonNewObject` of the object being shared was not created in this
 * transaction. This restriction may be relaxed in the future.
 * The object must have `store` to be shared outside of its module.
 */
export function publicShareObject(
  tx: Transaction,
  typeArg: string,
  obj: GenericArg,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::transfer::public_share_object`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, obj)],
  })
}

export interface ReceiveArgs {
  parent: TransactionObjectInput
  toReceive: TransactionObjectInput
}

/**
 * Given mutable (i.e., locked) access to the `parent` and a `Receiving` argument
 * referencing an object of type `T` owned by `parent` use the `to_receive`
 * argument to receive and return the referenced owned object of type `T`.
 * This function has custom rules performed by the Sui Move bytecode verifier that ensures
 * that `T` is an object defined in the module where `receive` is invoked. Use
 * `public_receive` to receivne an object with `store` outside of its module.
 */
export function receive(tx: Transaction, typeArg: string, args: ReceiveArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::transfer::receive`,
    typeArguments: [typeArg],
    arguments: [
      obj_(tx, args.parent),
      obj_(tx, args.toReceive),
    ],
  })
}

export interface PublicReceiveArgs {
  parent: TransactionObjectInput
  toReceive: TransactionObjectInput
}

/**
 * Given mutable (i.e., locked) access to the `parent` and a `Receiving` argument
 * referencing an object of type `T` owned by `parent` use the `to_receive`
 * argument to receive and return the referenced owned object of type `T`.
 * The object must have `store` to be received outside of its defining module.
 */
export function publicReceive(
  tx: Transaction,
  typeArg: string,
  args: PublicReceiveArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::transfer::public_receive`,
    typeArguments: [typeArg],
    arguments: [
      obj_(tx, args.parent),
      obj_(tx, args.toReceive),
    ],
  })
}

/** Return the object ID that the given `Receiving` argument references. */
export function receivingObjectId(
  tx: Transaction,
  typeArg: string,
  receiving: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::transfer::receiving_object_id`,
    typeArguments: [typeArg],
    arguments: [obj_(tx, receiving)],
  })
}

export function freezeObjectImpl(
  tx: Transaction,
  typeArg: string,
  obj: GenericArg,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::transfer::freeze_object_impl`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, obj)],
  })
}

export function shareObjectImpl(
  tx: Transaction,
  typeArg: string,
  obj: GenericArg,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::transfer::share_object_impl`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, obj)],
  })
}

export interface PartyTransferImplArgs {
  obj: GenericArg
  defaultPermissions: bigint | TransactionArgument
  addresses: Array<string | TransactionArgument> | TransactionArgument
  permissions: Array<bigint | TransactionArgument> | TransactionArgument
}

export function partyTransferImpl(
  tx: Transaction,
  typeArg: string,
  args: PartyTransferImplArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::transfer::party_transfer_impl`,
    typeArguments: [typeArg],
    arguments: [
      generic(tx, `${typeArg}`, args.obj),
      pure(tx, args.defaultPermissions, `u64`),
      pure(tx, args.addresses, `vector<address>`),
      pure(tx, args.permissions, `vector<u64>`),
    ],
  })
}

export interface TransferImplArgs {
  obj: GenericArg
  recipient: string | TransactionArgument
}

export function transferImpl(
  tx: Transaction,
  typeArg: string,
  args: TransferImplArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::transfer::transfer_impl`,
    typeArguments: [typeArg],
    arguments: [
      generic(tx, `${typeArg}`, args.obj),
      pure(tx, args.recipient, `address`),
    ],
  })
}

export interface ReceiveImplArgs {
  parent: string | TransactionArgument
  toReceive: string | TransactionArgument
  version: bigint | TransactionArgument
}

export function receiveImpl(
  tx: Transaction,
  typeArg: string,
  args: ReceiveImplArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::transfer::receive_impl`,
    typeArguments: [typeArg],
    arguments: [
      pure(tx, args.parent, `address`),
      pure(tx, args.toReceive, `${ID.$typeName}`),
      pure(tx, args.version, `u64`),
    ],
  })
}
