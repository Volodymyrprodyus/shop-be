/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

export default {
    clearMocks: true,
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/*.spec.ts'],
    moduleNameMapper: {
        '@functions/(.*)': '<rootDir>/src/functions/$1',
        '@libs/(.*)': '<rootDir>/src/libs/$1',
    },
};
