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
        this.state = this.getInitState();
    }
    /**
     * 初始化的状态
     */
    getInitState(state) {
        state = state || {};
        return Object.assign(state, {
        });
    }
    /**
     * 制作我的英雄上岗证
     * @param {事件} e 
     */
    makeHeroWorkPermitHandler(e) {
        e.preventDefault();
        e.stopPropagation();
        //测试跳转到问题列表
        navigate.push(RoutPath.ROUTER_QUESTION);
    }
    /**
     * 渲染界面
     */
    render() {
        return (
            <Page id='home-page-container'>
                <div className="home-page-logo"></div>
                <div className="home-page-button btn-active"
                    onTouchTap={(e) => this.makeHeroWorkPermitHandler(e)}
                >制作我的英雄上岗证</div>
            </Page>
        );
    }
    /**
     * 获取标题内容
     */
    getTitle() {
        var title = '首页';
        return title;
    }
    /**
     * 组件渲染完成调用
     */
    componentDidMount() {
        //动态设置页面标题
        var title = this.getTitle();
        Base.setTitle(title);
        this.getInitData();
        if (!this.props.isFetching) {
            AppModal.hide();
        }
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
