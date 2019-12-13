Lending
========
Lending 是由ZOS独立开发整理维护的区块链去中心化借贷平台，它秉持着让“所有人都可以成为银行家，让金融更简单”的理念，惠及大众。

如果项目有误，可通过issue反馈给我们。

#版本
- Version: 1.0.0

#使用技术
- Vue 2.x
- Vuex
- Vue Router
- [Element UI](http://element.eleme.io/#/zh-CN)
- ES6
- webpack
- axios
- Node.js

#环境依赖
- Nodejs 6+

#下载安装
```
##下载项目
git clone https://github.com/zosnet/lending.git

##安装依赖
npm install

##运行
npm run start
```
### 安装时可能会遇到的问题
```
####如果提示 "No ESlint configuration found." 是因为缺少.eslintrc.js文件导致。
*** 解决办法：请完整下载仓库中代码 ***

####在node 8+版本 node-sass可能会与本机的node环境不兼容导致依赖安装失败，一般不会出现这个问题，但不排除部分用户电脑配置复杂，可能会导致该情况。
*** 解决办法：使用cnpm命令进行安装（如何让使用cnpm请自行查询使用方法） ***
```


### 编译部署
```
#编译
npm run build
```
将打包生成的 `dist` 静态文件放置服务器中，并配置路由代理