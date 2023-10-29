'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // 配置多个代理
  dev: {
    proxyTable: {
      '/api1': {
        target: 'http://localhost:8001', // 第一个后端服务地址
        changeOrigin: true,
        pathRewrite: {
          '^/api1': '', // 如果请求的 URL 中有 /api1，会被替换为空字符串
        },
      },
      '/api2': {
        target: 'http://localhost:8002', // 第二个后端服务地址
        changeOrigin: true,
        pathRewrite: {
          '^/api2': '', // 如果请求的 URL 中有 /api2，会被替换为空字符串
        },
      },
      // 可以继续添加更多代理配置
    },
  },
})
