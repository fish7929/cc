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

import "./index.scss";
class Home extends React.Component {
    /**
     *构造函数
     */
    constructor(props) {
        super(props);
        this.currentUser = Base.getCurrentUser(); //获取当前用户
        // let objectId = '595f31f0ac502e7589fbb3a1';
        this.state = this.getInitState();

    }
    /**
     * 初始化的状态
     */
    getInitState(state) {
        state = state || {};
        return Object.assign(state, {
            user: this.currentUser
        });
    }
    /**
     * 制作我的英雄上岗证
     * @param {事件} e 
     */
    makeHeroWorkPermitHandler(e) {
        // e.preventDefault();
        e.stopPropagation();
        //测试跳转到问题列表
        navigate.push(RoutPath.ROUTER_QUESTION + '/1');
    }
    /**
     * 渲染界面
     */
    render() {
        let { user } = this.state;
        return (
            Base.isEmptyObject(user) ? <div></div> : <Page id='home-page-container'>
                <div className="home-title">
                    <div className="home-title-shan1 animated  infinite"></div>
                    <div className="home-title-shan2 animated  infinite"></div>
                </div>
                <div className="home-logo">
                    <div className="home-logo-yuan animated directWhirlIn infinite"></div>
                    <div className="home-logo-yuan animated directWhirlIn infinite"></div>
                    <div className="home-logo-yuan animated directWhirlIn infinite"></div>
                    <div className="home-logo-yuan animated directWhirlIn infinite"></div>
                </div>
                <div className='common-button-wrapper'>
                    <span className='button-left-border'></span>
                    <span className="home-page-button btn-active"
                        onTouchTap={(e) => this.makeHeroWorkPermitHandler(e)}></span>
                    <span className='button-right-border'></span>
                </div>
            </Page>
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
        let param = Base.getParameter('user');
        if (!this.currentUser) {  //直接跳转去登录
            Base.wxLogin(param);
        }else{
            this.setState({user: this.currentUser});
        }
        //动态设置页面标题
        var title = this.getTitle();
        Base.setTitle(title);
        this.getInitData();
        if (!this.props.isFetching) {
            AppModal.hide();
        }
        //初始化分享
        lc_api.initWXShare();
    }
    /**
     * 属性改变的时候触发
     * @param {object} nextProps props
     */
    componentWillReceiveProps(nextProps) {
        if (!nextProps.isFetching) {
            AppModal.hide();
        }
    }
    /**
     * 获取网络初始化数据，
     */
    getInitData() {

    }
    /**
     * 组件渲染完成调用
     */
    componentWillUnmount() {
    }

}


let mapStateToProps = state => {
    return ({
        isFetching: state.homeData.isFetching
    });
}

let mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ fetchData }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
