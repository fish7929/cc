import * as ActionType from './actionType'

export const appendMessage = message => (dispatch, getState) => {
    let list = getState().chatData.messageList
    dispatch({
        type: ActionType.CHAT_APPEND_MESSAGE,
        data: [
            ...list,
            message
        ]
    })
}


export const clearMessage= () => dispatch => {
    dispatch({
        type: ActionType.CHAT_CLEAR_MESSAGE
    })
}