module.exports = {
    '/': {
        target: 'http://47.244.150.247:38069',
        // target: 'http://192.168.1.236:10010',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
            '^/api': ''
        }
    }
}
