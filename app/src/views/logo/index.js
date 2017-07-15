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

import "./index.scss";
class Logo extends React.Component {
    /**
     *构造函数
     */
    constructor(props) {
        super(props);

    }
    /**
     * 制作我的英雄上岗证
     * @param {事件} e 
     */
    makeHeroWorkPermitHandler(e) {
        // e.preventDefault();
        e.stopPropagation();
        //测试跳转到问题列表
        this.props.callback && this.props.callback();
    }
    /**
     * 渲染界面
     */
    render() {
        return (
            <div className='home-page-container' style={this.props.style}>
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
                    <span className='button-left-border shan-shuo'></span>
                    <span className="home-page-button btn-active"
                        onTouchTap={(e) => this.makeHeroWorkPermitHandler(e)}></span>
                    <span className='button-right-border shan-shuo'></span>
                </div>
            </div>
        );
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
    }
    /**
     * 组件渲染完成调用
     */
    componentWillUnmount() {
    }

}
/**
 * 验证props
 */
Logo.propTypes = {
    callback: React.PropTypes.func.isRequired,
    style: React.PropTypes.object.isRequired
};

export default Logo;
