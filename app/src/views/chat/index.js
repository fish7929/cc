/** 
 * @component index.js
 * @time CreateTime
 * @author zhao
 */

'use strict';

// require core module
import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

//require submodule
import Page from '../../components/page';
import ChatItem from '../../components/chatItem'

import ChatRoom from './chatRoom'

import { appendMessage, clearMessage } from './reducer/action'

import "./index.scss";

class ChatView extends React.Component {
    constructor(props, context) {
        super(props, context)
        
        this.state = {
            msg: ""
        }
    }

    render() {
        let {msg} = this.state
        let { messageList } = this.props
        return (
            <Page id='chat-view'>
                <div className="chat-view-list" ref="chatList">
                    {/* { messageList.map((message, index) => <ChatItem key={index} data={message} />) } */}
                </div>
                <div className="input-div">
                    <input type="text" placeholder="请输入聊天内容" value={msg} onChange={(e)=>this.onInputChange(e.target.value, "msg")} />
                    <button onClick={()=>this.sendMsg()}>发送</button>
                </div>
            </Page>
        );
    }
    /**
     * 获取标题内容
     */
    getTitle() {
        var title = '守望先锋';
        return title;
    }
    /**
     * 组件渲染完成调用
     */
    componentDidMount() {
        //动态设置页面标题
        var title = this.getTitle();
        Base.setTitle(title);
        this.sendCount = 0
        let fid = this.props.params.fid
        if(!fid) return
        lc_api.getIM(fid, data => {
            console.log(data)
            this.showMsg(data)
        }, err => {
            console.log(err)
        })
        // lc_api.getSingleConversation(fid, (data)=>{
        //     let roomId = data ? data.id : "11111111";
        //     this.chatRoom = new ChatRoom({
        //         roomId: roomId,
        //         userId: user.id, 
        //         members: [fid], 
        //         showMsg: (message)=>this.showMsg(message)
        //     })
        //     this.chatRoom.connect()
        // })
    }

    onInputChange(value, type){
        let state = {}
        state[type] = value
        this.setState(state)
    }

    showMsg(message){
        this.props.appendMessage(message)
    }

    sendMsg(){
        let fid = this.props.params.fid
        if(!fid) return
        lc_api.saveIM(fid, this.state.msg, data=>{
            this.setState({msg: ""})
            this.showMsg([data])
            console.log(data)
        })
        // let user = AV.User.current()
        // let param = {
        //     user_id: user.id,
        //     user_pic: user.get("user_pic")
        // }
        // this.chatRoom && this.chatRoom.sendMsg(this.state.msg, param).then(message=>{
        //     this.props.appendMessage(message)
        //     lc_api.updateFriendLastMsg(param.user_id, this.props.params.fid, this.state.msg)
        //     this.setState({msg: ""})
        //     this.showAlertGZH(param.user_id)
        // }, message=>message && AppModal.toast(message))
    }

    showAlertGZH(user_id){
        this.sendCount++
        if(this.sendCount % 6 === 0){
            lc_api.getUserById(user_id, function(data){
                let isAttend = data.get("isAttend") || 0
                if(isAttend == 0){
                    AppModal.confirm("为了更好的体验活动流程请您关注我们的微信公众号，关注完微信公众号您可任意畅聊", "关注微信公众号", ()=>{
                        lc_api.updateUserInfo({user_id: user_id, column_name: "isAttend", column_val:1})
                        location.href = "https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzI3NDcwNjgzMg==&scene=123#wechat_redirect"
                    })
                }
            })
        }
    }

    componentDidUpdate(){
        this.refs.chatList.scrollTop = this.refs.chatList.scrollHeight
    }
    /**
     * 组件渲染完成调用
     */
    componentWillUnmount() {
        this.props.clearMessage()
    }
}


let mapStateToProps = state => {
    return ({
        messageList: state.chatData.messageList
    });
}

let mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ appendMessage, clearMessage }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatView);
