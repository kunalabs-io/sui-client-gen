import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    testTimeout: 15000,
    maxThreads: 1,
    minThreads: 1
  },
})