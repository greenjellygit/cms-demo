const { NxWebpackPlugin } = require('@nx/webpack')
const { join } = require('path')

module.exports = {
    output: {
        path: join(__dirname, '../../dist/apps/cms-api'),
    },
    plugins: [
        new NxWebpackPlugin({
            target: 'node',
            compiler: 'tsc',
            main: './src/main.ts',
            tsConfig: './tsconfig.app.json',
            assets: ['./src/assets', './src/resources'],
            optimization: false,
            outputHashing: 'none',
            sourceMap: true,
        }),
    ],
}
