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


class BigScreen extends React.Component {
    /**
     *构造函数
     */
    constructor(props) {
        super(props);
        this.state = {
            newHero: [1,2,3,4,5,6],
            topHero: [11,12,13,14,15,16]
        };
    }
    /**
     * 获取渲染的内容
     */
    renderNewHeroSection() {
        let { newHero } = this.state;
        return (
            <div className="new-hero-content">
                {newHero.map((item, index) => <HeroDetail type={FIRST} key={item + ' ' + index} class='new-hero-item'/>)}
            </div>
        );
    }
    /**
     * 获取渲染的内容
     */
    renderTopHeroSection() {
        let { topHero } = this.state;
        return (
            <div className="top-hero-content">
                <HeroDetail />
            </div>
        );
    }
    /**
     * 渲染界面
     */
    render() {
        return (
            <Page id='big-screen-container'>
                <div className='big-screen-title'></div>
                {this.renderNewHeroSection()}
                {this.renderTopHeroSection()}
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
            newHero: [1,2,3,4,5,6],
            topHero: [11,12,13,14,15,16]
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

export default connect(mapStateToProps, mapDispatchToProps)(BigScreen);
