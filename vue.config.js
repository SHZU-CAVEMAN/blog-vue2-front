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
        target: 'http://cavetop.fun',      // 本地前端调试使用正式服务器 API
        changeOrigin: true,
      },
    },
  },
}