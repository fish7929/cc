import React, { PropTypes } from 'react'

import HeadIcon from '../../../assets/images/head-01.png'
import './index.scss'

class ChatHistoryItem extends React.Component{
    constructor(props, context){
        super(props, context)
    }

    render(){
        return(
            <div className="chat-history-item">
                <div className="chat-history-item-div">
                    <div className="header-div"><img src={HeadIcon}/></div>
                    <div className="content">
                        <div className="name-txt no-wrap">超级英雄</div>
                        <div className="desc-txt no-wrap">最近的一条聊天记录</div>
                    </div>
                </div>
            </div>
        )
    }
}

ChatHistoryItem.PropTypes = {
    
}

export default ChatHistoryItem