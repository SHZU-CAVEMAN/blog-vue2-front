基于Vue2.0，Express.js，Ant-Design-Vue

支持博客的基本功能：
- 评论功能
- 目录导航索引
- 分类归档

1、启动：
```
npm intall
```
安装Ant-Design-Vue依赖时可能会报错。因为项目中使用了eslint检验。命令后面加一句--legacy-peer-deps，告诉eslint忽略掉不同版本的问题并继续安装，保证各个引入的依赖之间对自身所使用的不同版本modules共存。
 --legacy-peer-deps：在安装时忽略所有 peerDependencie。
 
2、运行：
```
npm run serve
```
3、打包：
```
npm run build
```
将打包后dist文件夹的内容复制到后端根目录下public夹中，然后运行后端主文件即可。
