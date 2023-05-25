module.exports = {
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts'],
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  verbose: true,
  collectCoverageFrom: [
    'src/*.ts',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],
  coverageDirectory: './coverage',
  coverageReporters: ["cobertura", "json"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: -10
    },
  }
};
