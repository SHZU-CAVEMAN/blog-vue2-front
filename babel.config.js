module.exports = {
  // 自动配置 Babel 常用能力
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  // 按需引入 Ant Design Vue 组件
  plugins: [
    [
      'import',
      {
        libraryName: 'ant-design-vue',
        libraryDirectory: 'es',
        style: 'css'
      },
      'ant-design-vue'
    ]
  ]
}
