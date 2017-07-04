/**
 * @component index.js
 * @description redux 动作常量
 * @time 2017-06-17 18:40
 * @author fishYu
 **/
import * as ActionType from './actionType'

const initialState = {
    isFetching: false, //是否正在加载
    remoteData: {}
}

export default function questionData(state = initialState, action) {
    switch (action.type) {
        case ActionType.REQUEST_QUESTION_DATA:
            return Object.assign(
                {},
                state,
                { isFetching: true }
            );
        case ActionType.RECEIVE_QUESTION_DATA:
            return Object.assign(
                {},
                state,
                {
                    isFetching: true,
                    remoteData: action.data
                }
            );
        default:
            return state
    }
}