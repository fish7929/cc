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
import App from '../views/App';


/*****
 * 以下做动态加载，每个页面所需要的JS
 */
let Home = (location, cb) => {
    //开始加载
    // AppModal.loading();
    require.ensure([], require => {
        cb(null, require('../views/home').default);
    }, 'home');
};
let Question = (location, cb) => {
    //开始加载
    // AppModal.loading();
    require.ensure([], require => {
        cb(null, require('../views/question').default);
    }, 'question');
};
let Hero = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../views/hero').default);
    }, 'hero');
};
let ChatHistory = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../views/chatHistory').default);
    }, 'chatHistory');
}

let ChatView = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../views/chat').default);
    }, 'chatView');
}
let BigScreen = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../views/bigScreen').default);
    }, 'bigScreen');
};
let NotFoundPage = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../views/404').default);
    }, 'notFound');
};

const Routers = React.createClass({
    render(){
        return (
            <Router history={this.props.history}>
                <Route path={RoutPath.ROUTER_HOME} component={App} >
                    <IndexRoute getComponent={Home}/>
                    <Route path={RoutPath.ROUTER_QUESTION + '/:type'}  getComponent={Question} />
                    <Route path={RoutPath.ROUTER_HERO}  getComponent={Hero} />
                    <Route path={RoutPath.ROUTER_CHAT_HISTORY} getComponent={ChatHistory} />
                    <Route path={RoutPath.ROUTER_CHAT_VIEW} getComponent={ChatView} />
                    <Route path={RoutPath.ROUTER_BIG_SCREEN} getComponent={BigScreen} />
                    <Route path={RoutPath.ROUTER_COMMON} getComponent={NotFoundPage} />
                </Route>
            </Router>
        );
    }
});

export default Routers;