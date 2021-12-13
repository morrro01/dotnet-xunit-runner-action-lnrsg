module.exports = {
    clearMocks: true,
    moduleFileExtensions: [ 'js', 'ts' ],
    reporters: [ 'default', 'jest-junit' ],
    setupFiles: [],
    testEnvironment: 'node',
    testMatch: [ '**/*.test.ts' ],
    testRunner: 'jest-circus/runner',
    transform: {
        '^.+\\.ts$': 'ts-jest'
    },
    verbose: false
}