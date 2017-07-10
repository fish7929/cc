import React, { PropTypes } from 'react'

import HeadIcon from '../../../assets/images/head-01.png'
import './index.scss'

class ChatHistoryItem extends React.Component{
    constructor(props, context){
        super(props, context)
    }

    render(){
        let {data} = this.props
        return(
            <div className="chat-history-item" onClick={this.props.onClick}>
                <div className="chat-history-item-div">
                    <div className="header-div"><img src={data.get("friend").get("user_pic")}/></div>
                    <div className="content">
                        <div className="name-txt no-wrap">{data.get("friend").get("user_nick")}</div>
                        <div className="desc-txt no-wrap">最近的一条聊天记录</div>
                    </div>
                </div>
            </div>
        )
    }
}

ChatHistoryItem.PropTypes = {
    data: PropTypes.object.isRequired,
    onClick: PropTypes.func
}

export default ChatHistoryItem