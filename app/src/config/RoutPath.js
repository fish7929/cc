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
    ROUTER_LOGIN: ROOT_ROUTER + '/login',
    ROUTER_COMMON: ROOT_ROUTER + '*',
};

export default RoutPath;