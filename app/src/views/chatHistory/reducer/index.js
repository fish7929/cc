/**
 * @component index.js
 * @description redux 动作常量
 * @time 2017-06-17 18:40
 * @author fishYu
 **/
import * as ActionType from './actionType'

const initialState = {
    friendList: [],
    total: 0
}

export default function chatHistoryData(state = initialState, action) {
    switch (action.type) {
        case ActionType.INIT_FRIEND_LIST:
            return {
                ...state,
                friendList: action.data
            }
        case ActionType.INIT_FRIEND_TOTAL:
            return {
                ...state,
                total: action.data
            }
        default:
            return state
    }
}