/**
 * @component action.js
 * @description redux 动作常量
 * @time 2017-06-21 20:40
 * @author fishYu
 **/
import * as ActionType from './actionType';
// 获取远程数据
/**
 * 获取远程数据
 */
function requestData() {
    return {
        type: ActionType.REQUEST_QUESTION_DATA
    };
}

// 接收远程数据
/**
 * 接收远程数据
 */
function receiveData(result) {
    return {
        type: ActionType.RECEIVE_QUESTION_DATA,
        data: result
    }
}

/**
 * 请求远程数据
 */
export const fetchData = (param = null) => dispatch => {
    dispatch(requestData());
    let url = APIPath.GetQuestionData;
    dispatch(WebAPIUtils.sendRequest(url, param, "GET")).then(data => {
        dispatch(receiveData(data));
    })
}
