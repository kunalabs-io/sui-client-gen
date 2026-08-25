/**
 * Secret key every transaction-submitting test signs with.
 *
 * Kept as a fixed key rather than a generated one so the address is stable across runs and
 * easy to recognise in validator logs. On a `--force-regenesis` localnet it starts with no
 * funds, so `globalSetup` tops it up from the faucet before any test runs.
 */
export const TEST_SECRET_KEY = 'AMVT58FaLF2tJtg/g8X2z1/vG0FvNn0jvRu9X2Wl8F+u'

export const LOCALNET_RPC_PORT = 9000
export const LOCALNET_FAUCET_PORT = 9123
