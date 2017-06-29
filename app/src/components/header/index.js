/**
 * @component Header.js
 * @description 通用的UI header组件
 * @time 2017-03-30 12:50
 * @author fishYu
 **/
import React, { PropTypes } from 'react';
import "./index.scss";

class Header extends React.Component {
    /**
     * 默认的返回事件
     * @param {object} e 事件对象 
     */
    onBackHandler(e) {
        e.preventDefault();
        e.stopPropagation();
        if(this.props.onBackClick){
            this.props.onBackClick();
        }else{
            navigate.goBack();
        }
    }
    render() {
        let { title, isShowBack } = this.props;
        return (
            <header className="app-header">
                <div>
                    <span>{title}</span>
                    {isShowBack ? <button onTouchTap={(e) => this.onBackHandler(e)}></button> : null}
                </div>
            </header>
        )
    }
}

Header.PropTypes = {
    title: PropTypes.string.isRequired,
    isShowBack: PropTypes.bool.isRequired,
    onBackClick: PropTypes.func
}

export default Header