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
    //http://stackoverflow.com/questions/37652934/what-is-the-proper-way-to-publish-a-react-component-module-in-npm-without-extern
    "externals": {
        "react": "commonjs react",
        "react-dom" :"commonjs reactDOM",
        "immutable":"commonjs immutable",
        "lodash":"commonjs lodash",
        "object-assign":"commonjs object-assign",
        "reactify":"commonjs reactify",
        "invariant":"commonjs invariant",
        "react-addons-css-transition-group":"commonjs react-addons-css-transition-group"
    },
    devtool: 'sourcemap',
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ]
};