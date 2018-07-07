const path = require('path');
const webpack = require('webpack');
const child_process = require('child_process');

module.exports = {
    entry: './js/main.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    mode: 'development',
    optimization: {
        minimize: false,
    },
    devtool: 'cheap-module-source-map',
    plugins: [
        new webpack.DefinePlugin({
            GIT_COMMIT:  JSON.stringify(child_process.execSync('git rev-parse HEAD').toString().trim()),
            GIT_SUBJECT: JSON.stringify(child_process.execSync('git show -s --format=%s HEAD').toString().trim()),
            GIT_DATE:    JSON.stringify(child_process.execSync('git show -s --format=%ad --date=short HEAD').toString().trim())
        })
    ]
};
