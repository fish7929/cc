# REACT种子项目
REACT种子项目


## 项目结构
>
* index.html ：显示页面
* template.html ：模版页面，和index.html一致只是去掉加载js文件，用于编译时候的生成编译html
>
### assets : 项目的资源文件
* images ：图片文件
* fonts ：字体文件
>
### mock : 测试json文件 
>

>

### src : 是前端源代码根目录
* components ：react 组件源码
* config ： 数据请求api配置
* * APIPath.js: rest API 路径
* * RoutPath.js: 路由配置常量
* constants ： 常量配置
* * DialogConstants.js: toast对话框的一些常量信息
* * ErrorMessage.js: 通用的一些错误信息配置
* lib ： 类库
* reducers: redux总入库
* router ： 路由配置入口
* * navigate.js: 路由跳转辅助类
* * Router.js: 路由配置
* styles ： 样式
* * common: 通用的样式文件夹
* * _mixins.scss: 通用的sass的mixin
* * _variables.scss: 定义一些全局的变量，如：img路径， color 等
* * reset.scss: 重置的一些全局样式
* * common.scss: 项目中通用样式
* utils ： 辅助类工具
* * Base.js: 通用的工具函数
* * GlobalVar.js: 定义全局变量
* * WebAPIUtils.js: web请求的具体发送请求入口
* views ： 页面容器
* * module: 模块文件名， 如homeindex
* * reducer: reducer 文件夹
> * * action.js: redux事件派发
> * * actionType.js: redux事件名称
> * * index.js: redux事件处理
* * index.js: 模块入口
* * index.scss: 模块样式
* index.jsx ：主入口
>
### dist : 压缩，合并后的代码，发布到生产环境中的代码；运行 npm run build 命令会自动生成，无需手动更改此文件夹。

>
### node_modules : 存放node.js依赖包(工具相关)，通过在 package.json 中配置依赖，运行 npm install 自动下载相应包，无需手动更改此文件夹。



## 文件说明
>
* package.json ：node 模块的配置文件， 通常用来 配置 node.js依赖包，所有有node.js插件依赖在此文件配置。[详细说明](https://docs.npmjs.com/files/package.json)
* .babelrc ：如何使用babel的转换配置和热加载配置，
* webpack.config.js  ：webpack 开发和发布环境配置。通过env参数的develop 和 release来区分[详细说明](http://webpack.github.io/docs/configuration.html)



## 使用说明
>
### 第一次使用操作
1. 安装 node.js。（由于前端的一些工具是构建在node.js 之上，请确保 已经安装了node.js 和 npm。没有可以去 <http://nodejs.org/download/> 下载）
2. 安装 webpack、webpack-dev-server工具。运行命令：npm i webpack webpack-dev-server -g 
3. 安装 npm相关的包。运行命令：npm install
4. 至此，我们所有的工具、及 包都安装成功，以后不需要进行第1、2步了。可以运行下面相应的命令。

>
### 常用操作及其命令
* 安装npm相应包 : npm install , npm install --save name , npm i(install) -S(--save) name ,  npm i -D (--save-dev) name 
* 编译发布项目 : npm run build
* 开发项目 : npm start
* 编译测试项目 : npm run test




