/**
 * @component Routers.jsx
 * @description 所有路由的配置入口
 * @time 2017-06-21 13:50
 * @author fishYu
 **/

// require core module
import React from 'react'
import { Router, Route, IndexRoute } from 'react-router';
// require submodule
import App from 'Views/App';


/*****
 * 以下做动态加载，每个页面所需要的JS
 */
let Home = (location, cb) => {
    //开始加载
    // AppModal.loading();
    require.ensure([], require => {
        cb(null, require('Views/home/index').default);
    }, 'home');
};
let ChatHistory = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('Views/chatHistory/index').default);
    }, 'chatHistory');
}

let ChatView = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('Views/chat/index').default);
    }, 'chatView');
}
let BigScreen = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('Views/bigScreen/index').default);
    }, 'bigScreen');
};
let NotFoundPage = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('Views/404').default);
    }, 'notFound');
};

const Routers = React.createClass({
    render() {
        return (
            <Router history={this.props.history}>
                <Route path={RoutPath.ROUTER_ROOT} component={App} >
                    <IndexRoute getComponent={Home} />  
                    {/* <Route path={RoutPath.ROUTER_HOME} getComponent={Home} /> */}
                    <Route path={RoutPath.ROUTER_CHAT_HISTORY} getComponent={ChatHistory} />
                    <Route path={RoutPath.ROUTER_CHAT_VIEW + "/:fid"} getComponent={ChatView} />
                    <Route path={RoutPath.ROUTER_BIG_SCREEN} getComponent={BigScreen} />
                    <Route path={RoutPath.ROUTER_COMMON} getComponent={NotFoundPage} />
                </Route>
            </Router>
        );
    }
});

export default Routers;