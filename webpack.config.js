/**
 * Created by albertoclarit on 8/17/16.
 */
var webpack = require('webpack');

module.exports = {
    entry: './index.js',
    output: {
        filename: './lib/bundle.js'
    },
    module: {
        loaders: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            loader: 'babel',
            query: {
                presets: ['es2015', 'react']
            }
        }]
    },
    resolve: {
        extensions: ['', '.js', '.jsx'],
    },
    "externals": {
        "react": "react",
        "react-dom" :"reactDOM",
        "immutable":"immutable",
        "lodash":"lodash",
        "object-assign":"object-assign",
        "reactify":"reactify",
        "invariant":"invariant",
        "react-addons-css-transition-group":"react-addons-css-transition-group"
    },
    devtool: 'sourcemap',
    plugins: [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ]
};