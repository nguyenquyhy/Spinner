const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');

module.exports = (env) => {
    const isDevBuild = !(env && env.prod);

    const sharedConfig = () => ({
        mode: isDevBuild ? "development" : "production",
        output: {
            filename: '[name].js',
            publicPath: '/dist/'
        },
        module: {
            rules: [
                { test: /\.tsx?$/, use: 'ts-loader' }
            ]
        },
        plugins: [],
        resolve: { extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'] }
    });

    const clientOutputDir = '../../wwwroot/dist';
    const clientConfig = merge(sharedConfig(), {
        entry: { 'app': './boot-client.tsx' },
        output: {
            path: path.join(__dirname, clientOutputDir)
        }
    });

    const serverConfig = merge(sharedConfig(), {
        entry: { 'app': './boot-client.tsx' }
    });

    return [clientConfig, serverConfig];
};