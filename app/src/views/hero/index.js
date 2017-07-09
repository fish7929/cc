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
        let type = this.props.params && this.props.params.type;
        this.type = parseInt(type);
        this.currentUser = Base.getCurrentUser(); //获取当前用户
        this.state = {
            user: this.currentUser,
            isShow: false,
            type: ZERO
        };
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
        switch (type) {
            case FIRST:
                this.setState({isShow: true});
                console.log('分享');
                break;
            case SECOND:
                console.log('上屏');
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
        // e.preventDefault();
        e.stopPropagation();
        this.setState({isShow: false});
    }
    /**
     * 获取渲染的内容
     */
    getComponent() {
        let { type, user } = this.state;
        //isDrawImg={true} 
        //获取本地的缓存
        let localQuestion = Base.getLocalStorageObject('USER_SELECT_QUESTION');
        let headUrl = user.user_pic || user.get('user_pic');
        let name = user.user_nick || user.get('user_nick');
        return (
            <div className="hero-page-content">
                <div className='hero-title'></div>
                <HeroDetail ref='my-hero' questions={localQuestion.questions} id={user.id} 
                headUrl={headUrl} name={name} />
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
        }else{
            this.setState({user: this.currentUser});
        }
        //动态设置页面标题
        var title = this.getTitle();
        Base.setTitle(title);
        this.getInitData();
        // if (!this.props.isFetching) {
        //     AppModal.hide();
        // }
    }
    /**
     * 属性改变的时候触发
     * @param {object} nextProps props
     */
    componentWillReceiveProps(nextProps) {
        // if (!nextProps.isFetching) {
        //     AppModal.hide();
        // }
        this.setState({
            type: ZERO
        });
    }
    /**
     * 获取网络初始化数据，
     */
    getInitData() {
        // this.props.fetchData();
    }
    /**
     * 组件渲染完成调用
     */
    componentWillUnmount() {
        this.setState({
            isShow: false,
            type: ZERO
        });
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
