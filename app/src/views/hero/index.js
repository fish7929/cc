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
import QRcode from '../../components/qrcode';
import { ZERO, FIRST, SECOND, THREE } from '../../constants';
import { fetchData } from './reducer/action';

import "./index.scss";
import DefaultHeader from '../../../assets/images/header.png';
const ClientWidth = document.body.clientWidth;
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
        let _width = ClientWidth > 375 ? ClientWidth * 0.175 : ClientWidth * 0.192;
        let _selected1 = type == FIRST ? 'hero-button-active' : '';
        let _selected2 = type == SECOND ? 'hero-button-active' : '';
        let _selected3 = type == THREE ? 'hero-button-active' : '';
        return (
            <div className="hero-page-content">
                <div className='hero-title'>
                    你好英雄！<br /> 请务必守卫地球和平！
                </div>
                <div className='hero-wrapper'>
                    <div className="hero-mask"></div>
                    <div className="hero-border"></div>
                    <div className='hero-detail'>
                        <div className='hero-detail-left'>
                            <img src={DefaultHeader} />
                        </div>
                        <div className='hero-detail-right'>
                            <div className='hero-detail-text no-wrap'>微信ID人称</div>
                            <div className='hero-detail-text no-wrap'><span>胸大无脑的不知火舞</span></div>
                            <div className='hero-detail-text no-wrap'>我将用</div>
                            <div className='hero-detail-text no-wrap'><span>飘逸女司机</span>的方式</div>
                            <div className='hero-detail-text no-wrap'>拯救世界！</div>
                            <div className='hero-detail-text no-wrap'>现在我宣誓</div>
                            <div className='hero-detail-text no-wrap'><span>人丑就要多读书</span></div>
                            <div className='hero-qrcode'>
                                <QRcode text={'http://www.baidu.com'} width={_width} height={_width} />
                            </div>
                            <span className='hero-qrcode-hint'>长按图片识别二维码</span>
                        </div>
                    </div>
                </div>
                <div className='hero-buttons-group'>
                    <div className='hero-button-wrapper'>
                        <span className='button-left-border'></span>
                        <span className={"hero-button-hint " + _selected1} onTouchTap={(e) => this.heroOperationHandler(e, FIRST)}>分享</span>
                        <span className='button-right-border'></span>
                    </div>
                    <div className='hero-button-wrapper'>
                        <span className='button-left-border'></span>
                        <span className={"hero-button-hint " + _selected2}onTouchTap={(e) => this.heroOperationHandler(e, SECOND)}>上屏</span>
                        <span className='button-right-border'></span>
                    </div>
                    <div className='hero-button-wrapper'>
                        <span className='button-left-border'></span>
                        <span className={"hero-button-hint " + _selected3} onTouchTap={(e) => this.heroOperationHandler(e, THREE)}>私信</span>
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
