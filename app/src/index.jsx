/**
 * @component index.jsx
 * @description 所有业务的主入口。
 * @time 2017-06-21 14:00
 * @author fishYu
 **/

'use strict';

// require core module
import React from 'react';
import { render } from 'react-dom';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';  //hashHistory  browserHistory
import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import * as reducers from './reducers';
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
// if(process.env.DOMAIN_PATH == 'formalDomain') console.log = function(){};
//以下创建store 和初始化路由
const routingMiddleware = routerMiddleware(browserHistory); //hashHistory  browserHistory
const middleware = applyMiddleware(routingMiddleware, thunk);
const reducer = combineReducers({
    ...reducers,
    routing: routerReducer
});
const enhancer = compose(middleware);
let store = createStore(reducer, enhancer);
const history = syncHistoryWithStore(browserHistory, store);  //hashHistory  browserHistory
navigate.install(history);
//在所有状态之前请求数据.,把用户信息存储起来
let _url = location.href;
if (_url.indexOf('bigScreen') > -1) {
    render(<Provider store={store}>
        <div>
            <Routers history={history}></Routers>
        </div>
    </Provider>, document.getElementById("app"));
} else {
    let user = Base.getParameter('user');
    let isLogin = Base.getParameter('isLogin');
    let current = AV.User.current();
    if (!current) {
        Base.wxLogin(user);
    } else {
        AppModal.loading();
        let id = current ? current.id : '';
        lc_api.getUserById(id, (data) => {
            AppModal.hide();
            if (data) {
                Base.setLocalStorageObject('CURRENT_USER', data);
                render(<Provider store={store}>
                    <div>
                        <Routers history={history}></Routers>
                    </div>
                </Provider>, document.getElementById("app"));
                // setTimeout(() => {
                //     if(Base.isWeiXinPlatform()){
                //         lc_api.initWXShare(Base.getLocalStorageObject('CURRENT_USER'));
                //     }
                // }, 1000);
            } else {  //用户给删除了
                AppModal.toast('没有用户信息,重新登录获取');
                AV.User.logOut();
                window.localStorage.removeItem('CURRENT_USER');
                setTimeout(() => {
                    Base.wxLogin(user);
                    return;
                }, 500);
            }
        }, (error) => {
            AppModal.toast('网络状况不好，请稍后重试');
            console.log('获取信息失败');
        });
    }
}



