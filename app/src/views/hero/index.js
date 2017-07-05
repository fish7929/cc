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
        this.state = {
            type: ZERO
        };
    }
    /**
     * 返回按钮点击处理事件
     * @param {object} e 返回事件 
     * @param {number} type 表示按钮类型
     */
    heroOperationHandler(e, type) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({ type });
        switch (type) {
            case FIRST:
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
     * 获取渲染的内容
     */
    getComponent() {
        let { type } = this.state;
        return (
            <div className="hero-page-content">
                <div className='hero-title'></div>
                <HeroDetail  ref='my-hero'/>
                <div className='hero-buttons-group'>
                    <div className='hero-button-wrapper'>
                        <span className='button-left-border'></span>
                        <span className={"hero-button-hint "} onTouchTap={(e) => this.heroOperationHandler(e, FIRST)}>分享</span>
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
            <Page id='hero-page-container'>
                {this.getComponent()}
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
