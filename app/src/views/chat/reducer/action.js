import * as ActionType from './actionType'

export const appendMessage = messages => (dispatch, getState) => {
    let list = getState().chatData.messageList.concat(messages)
    dispatch({
        type: ActionType.CHAT_APPEND_MESSAGE,
        data: list
    })
}


export const clearMessage= () => dispatch => {
    dispatch({
        type: ActionType.CHAT_CLEAR_MESSAGE
    })
}