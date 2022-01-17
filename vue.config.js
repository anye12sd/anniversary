module.exports = {
    productionSourceMap: false,
    publicPath: process.env.NODE_ENV === 'production'
        ? ''
        : '/',
    // publicPath: process.env.NODE_ENV === 'production'
    //     ? ''
    //     : '/',
    // axios域代理，解决axios跨域问题
    devServer: {
        proxy: {
            '/v4': {
                target: 'http://42.192.68.235:3000',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/v4': ''
                }
            },
        },
    }
}
