/**
 * @component index.js
 * @description redux 动作常量
 * @time 2017-06-17 18:40
 * @author fishYu
 **/
import * as ActionType from './actionType'

const initialState = {
    isFetching: false, //是否正在加载
    isFinish: false,       //是否加载结束， 没有更多
    noItem: false,     //一条记录都没有
    itemCount: 20,    //加载条数
    list: [],
    tags: []
}

export default function homeData(state = initialState, action) {
    switch (action.type) {
        case ActionType.REQUEST_HOME_DATA:
            return Object.assign(
                {},
                state,
                { isFetching: true }
            );
        case ActionType.REFRESH_HOME_LIST:
            return Object.assign(
                {},
                state,
                {
                    isFetching: true,
                    noItem: false,
                    isFinish: false
                }
            );
        case ActionType.RECEIVE_HOME_LIST_DATA:  //首页
            let len = action.data.length;
            let isFinish = state.itemCount > len ? true : false;
            let noItem = len < 1 ? true : false;
            let newList = state.list.concat(action.data);
            return Object.assign(
                {},
                state,
                {
                    isFetching: false, //是否正在加载
                    isFinish: isFinish,
                    noItem: noItem,
                    list: newList
                }
            );
        case ActionType.RECEIVE_HOME_TAGS_DATA:  //首页
            return Object.assign(
                {},
                state,
                {
                    isFetching: false, //是否正在加载
                    tags: action.data
                }
            );
        default:
            return state
    }
}