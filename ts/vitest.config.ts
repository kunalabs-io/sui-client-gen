import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Scope discovery to the sources. An `include` rather than an `exclude` also keeps the
    // compiled copies under `dist/` (written by `tsc --build`) from being collected as a
    // second, stale copy of the suite.
    include: ['tests/**/*.test.ts'],
    // Boots a single-validator localnet, publishes the fixture Move packages against it, and
    // creates the shared fixture objects. Generous timeouts: genesis plus two publishes.
    globalSetup: ['tests/globalSetup.ts'],
    testTimeout: 30_000,
    hookTimeout: 180_000,
    // Test files run in parallel, and `it.concurrent` tests within them. All of them sign as
    // the same account, which is only safe because global setup leaves that account without
    // SUI coins: gas comes from its address balance, which has no object version for
    // concurrent transactions to race on. See tests/utils/gas.ts.
    fileParallelism: true,
  },
})
