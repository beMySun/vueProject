// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

var prdHost = '';
var stgHost = '';
var ciHost = '';
var myHost = 'http://test-iicp-dmzstg.pingan.com.cn';
var ciHost = 'http://10.20.23.211:8080';
var publicPath = ''
module.exports = {
    build: {
        index: path.resolve(__dirname, 'dist/index.html'),
        assetsRoot: path.resolve(__dirname, 'dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: publicPath,
        productionSourceMap: false
    },
    hosts: {
        prd: prdHost,
        stg: stgHost,
        dev: 'http://localhost:7003'
    },
    dev: {
        port: 7003,
        proxyTable: {
            '/icp_yl': {
                target: 'http://iqsh-l8829:9112',
                changeOrigin: true
            }
        }
    }
}