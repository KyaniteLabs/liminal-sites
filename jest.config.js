export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      useESM: true,
      tsconfig: {
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      },
    }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(.pnpm/)?@types/)',
  ],
  testMatch: [
    '**/test/**/*.test.(js|ts)',
    '**/test/**/*.e2e.test.(js|ts)',
  ],
  // Coverage from source (src/) so we don't require a build first. Exclude test files.
  collectCoverageFrom: [
    'src/**/*.ts',
    'src/**/*.tsx',
    '!src/**/*.test.ts',
    '!src/**/*.test.tsx',
    '!src/**/*.d.ts',
  ],
  // Thresholds: global minimums for statements, branches, functions, lines (percent).
  // Enforced when running test:coverage; adjust here if needed (current target 80%).
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
};