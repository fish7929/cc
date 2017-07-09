/**
 * @component index.js
 * @description redux 动作常量
 * @time 2017-06-17 18:40
 * @author fishYu
 **/
import * as ActionType from './actionType'

const initialState = {
    messageList: []
}

export default function chatData(state = initialState, action) {
    switch (action.type) {
        case ActionType.CHAT_APPEND_MESSAGE:
            return {
                ...state,
                messageList: action.data
            }
        case ActionType.CHAT_CLEAR_MESSAGE:
            return {
                ...state,
                messageList: []
            }
        default:
            return state
    }
}