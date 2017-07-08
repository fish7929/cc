/**
 * @component index.jsx
 * @description 所有业务的主入口。
 * @time 2017-06-21 14:00
 * @author fishYu
 **/

'use strict';

// require core module
import React from 'react';
import {render} from 'react-dom';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { hashHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import * as reducers from './reducers';
import av from './lib/av-min.js';
//require submodule
import GlobalVar from "./utils/GlobalVar";
import injectTapEventPlugin from "react-tap-event-plugin";
import Routers from './router/Routers';
// import iNoBounce from "./lib/inobounce";


// require style
require('./styles/index.scss');

//导入 onTouchTap事件
injectTapEventPlugin();
//修正ios回弹
// if(iDevice.ios()){
//     iNoBounce.enable();
// }
//通过正式和测试服来屏蔽测试console.log
if(process.env.DOMAIN_PATH == 'formalDomain') console.log = function(){};
//以下创建store 和初始化路由
const routingMiddleware = routerMiddleware(hashHistory);
const middleware = applyMiddleware(routingMiddleware, thunk);
const reducer = combineReducers({
    ...reducers,
    routing: routerReducer
});
const enhancer = compose(middleware);
let store = createStore(reducer,enhancer);
const history = syncHistoryWithStore(hashHistory, store);
navigate.install(history);
let currentUser = Base.getLocalStorageObject('CURRENT_USER'); //获取当前用户
if(Base.isEmptyObject(currentUser)){  //直接跳转去登录
    location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf82fb57ce47d0df6&redirect_uri=http://www.6itec.com&response_type=code&scope=snsapi_login&state=" + Date.now() + "#wechat_redirect";
}

render(<Provider store={store}>
        <div>
            <Routers history={history}></Routers>
        </div>
    </Provider>, document.getElementById("app"));

