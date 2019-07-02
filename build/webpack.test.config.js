/**
 * 用于单元测试
 */

const webpack = require('webpack')
const merge = require('webpack-merge')
const webpackBaseConfig = require('./webpack.base.config.js')

const webpackConfig = merge(webpackBaseConfig, {
  // use inline sourcemap for karma-sourcemap-loader
  devtool: '#inline-source-map',
  resolveLoader: {
    alias: {
    // necessary to to make lang="scss" work in test when using vue-loader's ?inject option
    // see discussion at https://github.com/vuejs/vue-loader/issues/724
    'scss-loader': 'sass-loader'
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"testing"'
      }
    })
  ]
})

// no need for app entry during tests
delete webpackConfig.entry

module.exports = webpackConfig
