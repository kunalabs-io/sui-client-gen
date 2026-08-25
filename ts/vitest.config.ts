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
    // Tests submit real transactions from one account holding a single gas coin, so
    // concurrent transactions race on that coin's version. Serialized until gas moves to the
    // address balance, which removes the shared owned object from the gas path.
    fileParallelism: false,
    maxConcurrency: 1,
  },
})
