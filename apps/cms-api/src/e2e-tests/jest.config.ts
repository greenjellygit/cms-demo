export default {
    displayName: 'cms-api-end2end',
    preset: '../../../../jest.preset.js',
    testEnvironment: 'node',
    transform: {
        '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/../../tsconfig.spec.json' }],
    },
    moduleFileExtensions: ['ts', 'js', 'html'],
    coverageDirectory: '../../coverage/apps/cms-api',
    detectOpenHandles: true,
    forceExit: true,
    globalSetup: '<rootDir>/config/global-start.config.ts',
    globalTeardown: '<rootDir>/config/global-stop.config.ts',
    setupFilesAfterEnv: ['<rootDir>/config/global-hooks.config.ts'],
    testTimeout: 200000,
    rootDir: './',
}
