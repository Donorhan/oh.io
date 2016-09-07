var path = require('path');

module.exports = {
    entry: "./client/game/Game.js",
    output: {
        path: __dirname + "/public/js",
        filename: "client.js"
    },
    module: {
        loaders: [
            { test: /\.json$/, loader: 'json' },
            { test: /\.css$/,  loader: "style!css" },
            { test: /\.js$/,   loader: 'babel-loader?presets[]=es2015'}
        ],
        postLoaders: [
            {
                include: path.resolve(__dirname, 'node_modules/pixi.js'),
                loader: 'ify'
            }
        ]
    }
};