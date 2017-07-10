/**
 * @component index.js
 * @description 首页
 * @time 2017-06-12 19:15
 * @author fishYu
 **/

'use strict';

// require core module
import React from 'react';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

//require submodule
import Page from '../../components/page';

import { ZERO, FIRST, SECOND, THREE } from '../../constants';
import { fetchData } from './reducer/action';
import HeroDetail from '../../components/heroDetail';
import "./index.scss";


class Hero extends React.Component {
    /**
     *构造函数
     */
    constructor(props) {
        super(props);
        this.id = this.props.params && this.props.params.id;

        this.currentUser = Base.getCurrentUser(); //获取当前用户
        if(!this.id && this.currentUser){
            this.id = this.currentUser.id;
        }
        this.state = {
            user: this.currentUser,
            isShow: false,
            type: ZERO
        };
        this.canClick = true;  //可以点击
    }
    /**
     * 返回按钮点击处理事件
     * @param {object} e 返回事件 
     * @param {number} type 表示按钮类型
     */
    heroOperationHandler(e, type) {
        // e.preventDefault();
        e.stopPropagation();
        this.setState({ type });
        let {user} = this.state;
        switch (type) {
            case FIRST:
                this.setState({isShow: true});
                console.log('分享');
                break;
            case SECOND:
                console.log('上屏');
                if(!this.canClick) return;
                this.canClick = false;
                let opt = {};
                opt.user_id = user.id;
                opt.column_name = "on_screen";
                let oldScreen = user.get("on_screen");
                if(oldScreen == undefined){
                    oldScreen = 0;
                }else if(oldScreen == 0){
                    oldScreen = 2;
                }else if(oldScreen == 2){
                    oldScreen = 1;
                }else if(oldScreen == 1){
                    oldScreen = 2;
                }
                opt.column_val = oldScreen;
                lc_api.updateUserInfo(opt, () => {
                    AppModal.toast("上屏成功");
                    this.canClick = true;
                }, () => {
                    AppModal.toast("上屏失败");
                    this.canClick = true;
                });
                break;
            case THREE:
                navigate.push(RoutPath.ROUTER_CHAT_HISTORY);
                break;
        }
    }
    /**
     * 隐藏分享图层
     * @param {object} e 返回事件 
     */
    hideShareLayerHandler(e){
        e.stopPropagation();
        this.setState({isShow: false});
    }
    /**
     * 获取渲染的内容
     */
    getComponent() {
        let { type, user } = this.state;
        let question = [user.get('q0'), user.get('q1'), user.get('q2')];
        let headUrl = user.get('user_pic') || '';
        let name = user.get('user_nick') || '';
        console.log(question, 89999);
        return (
            <div className="hero-page-content">
                <div className='hero-title'></div>
                {user.get('q0') ? <HeroDetail ref='my-hero' questions={question} id={user.id} 
                headUrl={headUrl} name={name} isDrawImg={true}  /> : null}
                <div className='hero-buttons-group'>
                    <div className='hero-button-wrapper'>
                        <span className='button-left-border'></span>
                        <span className={"hero-button-hint "} onTouchTap={(e) => this.heroOperationHandler(e, FIRST)}>炫耀</span>
                        <span className='button-right-border'></span>
                    </div>
                    <div className='hero-button-wrapper up-screen' onTouchTap={(e) => this.heroOperationHandler(e, SECOND)}>上&emsp;屏
                    </div>
                    <div className='hero-button-wrapper'>
                        <span className='button-left-border'></span>
                        <span className={"hero-button-hint "} onTouchTap={(e) => this.heroOperationHandler(e, THREE)}>私信</span>
                        <span className='button-right-border'></span>
                    </div>
                </div>
            </div>
        );
    }
    /**
     * 渲染界面
     */
    render() {
        return (
            this.state.user ? <Page id='hero-page-container'>
                {this.state.isShow ? <div className='hero-share'
                    onTouchTap={(e) => this.hideShareLayerHandler(e)}></div> : null}
                {this.getComponent()}
            </Page> : null
        );
    }
    /**
     * 获取标题内容
     */
    getTitle() {
        var title = '英雄执照';
        return title;
    }
    /**
     * 组件渲染完成调用
     */
    componentDidMount() {
        if (!this.currentUser) {  //直接跳转去登录
            Base.wxLogin();
            return;
        }
        //动态设置页面标题
        var title = this.getTitle();
        Base.setTitle(title);
        this.getInitData();
        //初始化分享
        lc_api.initWXShare(this.currentUser.id);
    }
    /**
     * 属性改变的时候触发
     * @param {object} nextProps props
     */
    componentWillReceiveProps(nextProps) {
        this.setState({
            type: ZERO
        });
    }
    /**
     * 获取网络初始化数据，
     */
    getInitData() {
        lc_api.getUserById(this.id, (data) => {
            console.log(data);
            if(data){
                this.setState({user: data});
            }
        }, (error) => {
            console.log('获取信息失败');
        });
    }
    /**
     * 组件渲染完成调用
     */
    componentWillUnmount() {
        this.setState({
            isShow: false,
            type: ZERO
        });
        window.localStorage.removeItem('USER_SELECT_QUESTION');
    }

}


let mapStateToProps = state => {
    return ({
        isFetching: state.questionData.isFetching,
        remoteData: state.questionData.remoteData
    });
}

let mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ fetchData }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Hero);
