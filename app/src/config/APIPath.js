/** 
 * @component APIPath.js
 * @description 接口api路径
 * @time 2017-6-21 10:30
 * @author fishYu
 */

'use strict';

const APIPath = {
    //home api 
    GetHomeListData: '/home/list',
    GetHomeTagsData: '/home/tags',
    GetHomeDataById: (id) => '/home/list/' + id,
};

export default APIPath;