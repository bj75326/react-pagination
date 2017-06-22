//webpack.config.js

var webpack = require('webpack');
var path = require('path');

module.exports = {

    devtool: "eval-source-map",

    entry: [
        './src/entry.js'
    ],

    output: {
        path: path.resolve(__dirname, './out'),
        filename: 'bundle.js'
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader?modules'
            }
        ]
    },

    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
};
