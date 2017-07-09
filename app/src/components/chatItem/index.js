import React, { PropTypes } from 'react'

import HeadIcon from '../../../assets/images/head-01.png'
import './index.scss'

class ChatItem extends React.Component{
    constructor(props, context){
        super(props, context)
    }

    render(){
        let {data} = this.props
        let user = AV.User.current()
        return(
            <div className="chat-item">
                <div className={(data.from == user.id ? "active": "") + " chat-item-div"}>
                    <div className="header-div"><img src={HeadIcon}/></div>
                    <div className="content">
                        {data.text}
                    </div>
                    <div className="clear"></div>
                </div>
            </div>
        )
    }
}

ChatItem.PropTypes = {
    data: PropTypes.object.isRequired
}

export default ChatItem