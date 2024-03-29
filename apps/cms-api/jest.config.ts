/* eslint-disable */
export default {
    displayName: 'cms-api',
    preset: '../../jest.preset.js',
    testEnvironment: 'node',
    transform: {
        '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
    },
    moduleFileExtensions: ['ts', 'js', 'html'],
    coverageDirectory: '../../coverage/apps/cms-api',
    detectOpenHandles: true,
    forceExit: true,
    rootDir: './',
}
