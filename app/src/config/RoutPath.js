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
    ROUTER_HOME: ROOT_ROUTER + '/',
    ROUTER_QUESTION: ROOT_ROUTER + '/question',
    ROUTER_HERO: ROOT_ROUTER + '/hero',
    ROUTER_COMMON: ROOT_ROUTER + '*',
    ROUTER_CHAT_HISTORY: ROOT_ROUTER + '/chatHistory',
    ROUTER_BIG_SCREEN: ROOT_ROUTER + '/bigScreen',
    ROUTER_CHAT_VIEW: ROOT_ROUTER + '/chat'
};

export default RoutPath;