const path = require('path')
const {
  override,
  addWebpackAlias,
  fixBabelImports
} = require('customize-cra')

module.exports = {
  webpack: override(
    // 增加全局 Alias
    addWebpackAlias({
      '@': path.resolve(__dirname, 'src'),
    }),
    // 按需加载 lodash
    fixBabelImports('lodash', {
      libraryDirectory: '',
      camel2DashComponentName: false
    }),
    // 按需加载 antd
    fixBabelImports('import', {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: 'css',
    }),
  ),
}
