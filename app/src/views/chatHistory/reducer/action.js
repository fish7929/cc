import * as ActionType from './actionType'

export const getMyFriendList = opt => (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        opt = {
            ...opt,
            isdesc: true
        }
        let list = getState().chatHistoryData.friendList
        lc_api.getFriend(opt, data=>{
            if(opt.pageSize > 0){
                data = list.concat(data)
            }
            dispatch({
                type: ActionType.INIT_FRIEND_LIST,
                data: data
            })
            resolve && resolve()
        }, reject)
    })
}

export const getFriendTotal = (opt) => dispatch => {
    lc_api.getCountFriend(opt, data=>{
        console.log(data)
        dispatch({
            type: ActionType.INIT_FRIEND_TOTAL,
            data: data
        })
    })
}