module.exports = {
  pages: {
    index: {
      //设置入口文件
      entry: 'src/main.js',
    },
  },
  //关闭语法检查
	lintOnSave:false, 

	devServer: {
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:8081',   // 后端地址，和 .env.development 保持一致
        pathRewrite: { '^/api': '' },     // 转发时去掉 /api 前缀
        changeOrigin: true,
      },
    },
  },
}