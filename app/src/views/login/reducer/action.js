/** 
 * @component action.js
 * @description action  具体操作
 * @time 2017-6-21 17:30
 * @author fishYu
 */

'use strict';
import * as ActionType from './actionType';

const receiveData = data => ({
    type: ActionType.UPDATE_USER_LOGIN,
    data: data
})

/**
 * 用户登录 
 @userName 用户名
 @password 密码
*/
export const userLogin = (userName, password) => dispatch => {
    let url = "/pvmtsys/user/api/login"
    let opt = {
        username: userName,
        password: password
    }

    dispatch(WebAPIUtils.sendRequest(url, opt, "GET")).then(data => {
        dispatch({
            type: ActionType.INIT_USER_LOGIN,
            data: data
        })
    })
}