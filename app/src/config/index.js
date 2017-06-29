/** 
 * @component index.js
 * @description 全局配置文件，api域名配置等
 * @time 2017-6-21 10:30
 * @author fishYu
 */

'use strict';

const DomainPath = process.env.DOMAIN_PATH;
const Config = {
    api: DomainPath == 'devDomain' ? "http://test.api.com" : "/", //业务请求接口
    version: 'V1.0'
};

export default Config;