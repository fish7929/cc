/**
 * @component index.js
 * @description 首页
 * @time 2017-06-12 19:15
 * @author fishYu
 **/

'use strict';

// require core module
import React from 'react';

//require submodule

import { ZERO, FIRST, SECOND, THREE } from '../../constants';
import HeroDetail from '../../components/heroDetail';
import "./index.scss";


class Hero extends React.Component {
    /**
     *构造函数
     */
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,
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
                opt.user_id = this.state.user.objectId;
                opt.column_name = "on_screen";
                let oldScreen = this.state.user.on_screen;
                if(oldScreen == undefined){
                    oldScreen = 0;
                }else if(oldScreen == 0){
                    oldScreen = 2;
                }else if(oldScreen == 2){
                    oldScreen = 1;
                }else if(oldScreen == 1){
                    oldScreen = 2;
                }
                console.log(oldScreen, 77777);
                opt.column_val = oldScreen;
                lc_api.updateUserInfo(opt, (data) => {
                    console.log(data, 88888);
                    AppModal.toast("上屏成功");
                    this.canClick = true;
                }, (err) => {
                    console.log(err);
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
        let q0 = user.q0 || '';
        let q1 = user.q1 || '';
        let q2 = user.q2 || '';
        let headUrl = user.user_pic || '';
        let id = user.objectId;
        let name = user.user_nick || '';
        let question = [q0, q1, q2];
        return (
            <div className="hero-page-content">
                <div className='hero-title'></div>
                <HeroDetail ref='my-hero' questions={question} id={id} 
                headUrl={headUrl} name={name} isDrawImg={true}  />
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
            <div className='hero-page-container' style={this.props.style}>
                {this.state.isShow ? <div className='hero-share'
                    onTouchTap={(e) => this.hideShareLayerHandler(e)}></div> : null}
                {this.getComponent()}
            </div> 
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
    }
    /**
     * 属性改变的时候触发
     * @param {object} nextProps props
     */
    componentWillReceiveProps(nextProps) {
        this.setState({
            user: nextProps.user,
            type: ZERO
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
    }

}

/**
 * 验证props
 */
Hero.propTypes = {
    style: React.PropTypes.object.isRequired,
    user: React.PropTypes.object.isRequired,
};


export default Hero;
