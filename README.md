## ZOS-web
### 基于Vue开发的前台页面

### 新增与优化


### 所用技术

- Vue 2.x
- Vuex
- Vue Router
- [Element UI](http://element.eleme.io/#/zh-CN)
- ES6
- webpack
- axios
- Node.js

### 本地开发运行 ###
### zos-web依赖于 Node.js v6 以上版本。
### 在 Linux 和 macOS 上，安装 Node 最简单的方式是用 NVM。
### 将以下命令复制到终端中执行即可安装 NVM。
- curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.30.2/install.sh | bash
- nvm install v6
- nvm use v6

### Node 安装完成后，获取项目的源代码：
- git clone http://www.fcloudchain.com:8083/debt/zos-web.git
- cd zos-web

### 全局安装 vue-cli
- npm install --global vue-cli

### 在启动之前，需要先安装 npm 软件包
- npm install

### 修改配置文件
- 进入static文件夹,复制config-example.json,并在当前文件夹拷贝出一份,改名为:config.json

### 运行开发服务器 ###
### 所有软件包安装好后，可以使用以下命令启动开发服务器：
- npm run dev

### 商城前台端口默认9999 http://localhost:9999

### 部署 ###
- npm run build

## 将打包生成的 `dist` 静态文件放置服务器中，并配置路由代理
