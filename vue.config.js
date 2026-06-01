// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true
// })

export const pages = {
  index: {
    //设置入口文件
    entry: 'src/main.js',
  },
};
export const lintOnSave = false;
export const devServer = {
  port: 8080, //前端设置为80端口
  proxy: 'http://localhost:81' //这里更换成你实际服务器的地址和端口即可
};