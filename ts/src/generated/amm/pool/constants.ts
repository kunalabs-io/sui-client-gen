/** The pool balance differs from the acceptable. */
export const EExcessiveSlippage = 0n

/** The input amount is zero. */
export const EZeroInput = 1n

/** The pool ID doesn't match the required. */
export const EInvalidPoolID = 2n

/** There's no liquidity in the pool. */
export const ENoLiquidity = 3n

/** Fee parameter is not valid. */
export const EInvalidFeeParam = 4n

/** The provided admin capability doesn't belong to this pool */
export const EInvalidAdminCap = 5n

/** Pool pair coin types must be ordered alphabetically (`A` < `B`) and mustn't be equal */
export const EInvalidPair = 6n

/** Pool for this pair already exists */
export const EPoolAlreadyExists = 7n
