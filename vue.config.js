const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    lintOnSave: false,
    publicPath: './',
    transpileDependencies: true,
    outputDir: 'zhitale',
    devServer: {
        port: 80,
        proxy: 'http://123.249.26.56:63000',
    },
})
