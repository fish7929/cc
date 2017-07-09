/** 
 * @component index.js
 * @description 登录界面只是为了过度微信登录的缓存
 * @time 2017-6-21 17:30
 * @author fishYu
 */

'use strict';

import React, { PropTypes } from 'react';
import Page from '../../components/page';

class Login extends React.Component {

    constructor(props, context) {
        super(props, context)
    }

    componentDidMount() {
        var code = LCApi.GetRequest()["code"];
        var user = LCApi.GetRequest()["user"];
        alert(code + "    ----1");
        if (code) {
            if (LCApi.GetRequest()["user_id"]) {
                LCApi.userOauthLogin(code, LCApi.GetRequest()["user_id"], function () {
                    alert("userOauthLogin 1");
                    Base.setLocalStorageObject('CURRENT_USER', {id: '123456', name: 'test'});
                    navigate.push(RoutPath.ROUTER_HOME);
                });
            } else {
                LCApi.userOauthLogin(code, "", function () {
                    alert("userOauthLogin 2");
                    Base.setLocalStorageObject('CURRENT_USER', {id: '123456', name: 'test'});
                    navigate.push(RoutPath.ROUTER_CHAT_HISTORY);
                });
            }
        } else if (user) {
            LCApi.userQrcodeLogin(user, function () {
                alert("userQrcodeLogin 1");
                Base.setLocalStorageObject('CURRENT_USER', {id: '123456', name: 'test'});
                navigate.push(RoutPath.ROUTER_HOME);
            });
        } else {
            return;
        }
    }



    render() {
        return (
            <Page id='login-container-page'>
            </Page>
        )
    }

}

Login.PropTypes = {
    isLogin: PropTypes.bool.isRequired
}

export default Login;