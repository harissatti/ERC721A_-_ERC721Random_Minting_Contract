const webpack = require('webpack');

module.exports = function override(config) {
    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, {
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "assert": require.resolve("assert"),
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "os": require.resolve("os-browserify"),
        "url": require.resolve("url"),
        "zlib": require.resolve("browserify-zlib"),
        "net": require.resolve("net-browserify"),
        "tls": require.resolve("tls-browserify"),
        "path": require.resolve("path-browserify"),
        "fs": require.resolve("browserify-fs"),
        "isValidUTF8": require.resolve('utf-8-validate'),
        "bufferUtil": require.resolve('bufferutil'),
        "async_hooks": false,



    })
    config.resolve.fallback = fallback;
    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer']
        })
    ])

    return config;
}