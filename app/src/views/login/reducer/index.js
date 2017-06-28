import * as ActionType from './actionType'

const initialState = {
    isLogin: false,
    username: ""
}

export default function update (state = initialState, action){
    switch(action.type){
        case ActionType.INIT_USER_LOGIN:
            return {
                ...state,
                username: action.data.username,
                isLogin: true
            }
        default:
            return state
    }
}