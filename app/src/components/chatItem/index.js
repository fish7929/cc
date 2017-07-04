import React, { PropTypes } from 'react'

import HeadIcon from '../../../assets/images/head-01.png'
import './index.scss'

class ChatItem extends React.Component{
    constructor(props, context){
        super(props, context)
    }

    render(){
        return(
            <div className="chat-item">
                <div className="chat-item-div">
                    <div className="header-div"><img src={HeadIcon}/></div>
                    <div className="content">
                        最近的一条聊天记录最近的一条聊天记录最近的一条聊天记录最近的一条聊天记录最近的一条聊天记录最近的一条聊天记录最近的一条聊天记录
                    </div>
                    <div className="clear"></div>
                </div>
            </div>
        )
    }
}

ChatItem.PropTypes = {
    
}

export default ChatItem