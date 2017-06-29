/**
 * @component action.js
 * @description redux 动作常量
 * @time 2017-06-21 20:40
 * @author fishYu
 **/
import * as ActionType from './actionType';
const ZERO = 0;
const  FIRST = 1;
// 获取远程数据
/**
 * 获取远程数据
 */
function requestData() {
    return {
        type: ActionType.REQUEST_HOME_DATA
    };
}

// 接收远程数据
/**
 * 接收远程数据
 * @param {number} category  消息数据类型， 0 首页信息，1 工单信息，2 消息信息，3 我的信息
 */
function receiveData(result, category) {
    switch(category) {
        case ZERO:
            return {
                type: ActionType.RECEIVE_HOME_TAGS_DATA,
                data: result
            }
        case FIRST:
            return {
                type: ActionType.RECEIVE_HOME_LIST_DATA,
                data: result
            }
    }
}

/**
 * 请求远程数据
 */
export const fetchData = (category, param = null) => dispatch => {
    dispatch(requestData());
    let _url = category == ZERO ? APIPath.GetHomeTagsData : APIPath.GetHomeListData;
    dispatch(WebAPIUtils.sendRequest(_url, param, "GET")).then(data => {
        dispatch(receiveData(data, category));
    })
}


/**
 * 刷新数据
 */
export const refreshData = () => dispatch => {
    dispatch({
        type: ActionType.REFRESH_HOME_LIST
    });
}