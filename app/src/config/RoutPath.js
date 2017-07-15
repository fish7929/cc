/** 
 * @component RoutPath.js
 * @description 接口api路径
 * @time 2017-6-21 10:30
 * @author fishYu
 */

'use strict';
//根路由
const ROOT_ROUTER = "";
const RoutPath = {
    //home api 
    ROUTER_ROOT: ROOT_ROUTER + '/',
    ROUTER_HOME: ROOT_ROUTER + '/home',
    ROUTER_CHAT_HISTORY: ROOT_ROUTER + '/chatHistory',
    ROUTER_BIG_SCREEN: ROOT_ROUTER + '/bigScreen',
    ROUTER_CHAT_VIEW: ROOT_ROUTER + '/chat',
    ROUTER_COMMON: ROOT_ROUTER + '*'
};

export default RoutPath;