import * as ActionType from './actionType'

export const appendMessage = messages => (dispatch, getState) => {
    dispatch({
        type: ActionType.CHAT_APPEND_MESSAGE,
        data: messages
    })
}


export const clearMessage= () => dispatch => {
    dispatch({
        type: ActionType.CHAT_CLEAR_MESSAGE
    })
}