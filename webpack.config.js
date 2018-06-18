const path = require('path');

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
    devtool: 'cheap-module-source-map'
};
