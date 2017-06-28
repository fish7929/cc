/** 
 * @component index.js
 * @description 登录界面
 * @time 2017-6-21 17:30
 * @author fishYu
 */

'use strict';

import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Page from '../../components/page';
import Header from '../../components/header';

import { userLogin } from './reducer/action';

import './index.scss';

class Login extends React.Component{

    constructor(props, context){
        super(props, context)

        this.state = {
            username: "",
            password: "",
        }
    }

    componentDidMount(){
        this.setState({
            username: "",
            password: ""
        })
    }

    onPhoneChange(e){
        let value = e.currentTarget.value.replace(/\s/g,'')
        if(Base.checkNumber(value)){
            this.setState({username: value})
        }
    }

    /**输入框改变事件 */
    onPasswordChange(e){
        let value = e.currentTarget.value.replace(/\s/g,'')
        this.setState({password: value})
    }

    /**登录按钮事件 */
    onLoginHandler(){
        let { username, password } = this.state, msg=""
        if(username == ""){
            msg = ErrorMessage.Error_Phone_Empty
        }else if(!Base.checkPhone(username)){
            msg = ErrorMessage.Error_Phone_Invalid
        }else if(password == ""){
            msg = ErrorMessage.Error_Password_Empty
        }else if(password.length < 5){
            msg = ErrorMessage.Error_PassWord_Invalid
        }
        if(msg){
            return
        }

        this.props.userLogin(username, password)
    }

    render(){
        let { username, password } = this.state
        return(
            <Page id='login-container-page'>
                <Header title="登陆" isShowBack={true} />

                <div className="input-user-div">
                    <span className="icon"></span>
                    <input type="text" value={username} onChange={(e)=>this.onPhoneChange(e)} placeholder="请输入手机号" />
                </div>
                <div className="input-pw-div">
                    <span className="icon"></span>
                    <input type="password" value={password} onChange={(e)=>this.onPasswordChange(e)} placeholder="请输入密码" />
                </div>
                <div className="btn-div">
                    <button onClick={()=>this.onLoginHandler()}>登陆</button>
                    <button onClick={()=>this.onLoginHandler()}><span className="icon-wx" />微信登陆</button>
                </div>
            </Page>
        )
    }

}

Login.PropTypes = {
    isLogin: PropTypes.bool.isRequired
}

let mapStateToProps = state => ({
    isLogin: state.loginData.isLogin
})

let mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ userLogin }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)