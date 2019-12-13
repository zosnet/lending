Lending
========
ZOSLending is a blockchain-decentralized lending platform developed and maintained independently by ZOS, which benefits the public with the philosophy of making "everyone a banker and making finance easier".

If there are any problems, please contact us through issues.

# Version
- Version: 1.0.0

#Programs required
- Vue 2.x
- Vuex
- Vue Router
- [Element UI](http://element.eleme.io/#/zh-CN)
- ES6
- webpack
- axios
- Node.js

#System required
- Nodejs 6+

#Download and install
```
##Download project
git clone https://github.com/zosnet/lending.git

##Install
npm install

##Run
npm run start
```
### Problems you may encounter during installation
```
####The message "No ESlint configuration found." is caused by missing .eslintrc.js file.***  Solution: Please download the code completely***

####In node 8+ version node-sass may be incompatible with the original node system and cause the new installation to fail. This problem generally does not occur, but some user computer configurations are complicated and may cause this situation.*** 
Solution: Install using the cnpm command (how to make use of cnpm please check your own usage method)```


### Compilation
```
#Compile
npm run build
```
Place the packaged 'dist' static files on the server and configure the routing agent