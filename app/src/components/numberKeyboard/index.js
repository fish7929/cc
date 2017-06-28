/**
 * @component NumberKeyboard.js
 * @description 通用的UI 数字键盘
 * @time 2017-06-12 09:50
 * @author fishYu
 **/
import React, { PropTypes } from 'react';
//键盘参数
const KeyboardParam = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];
import "./index.scss";
class NumberKeyboard extends React.Component {
    /**
     *构造函数
     */
    constructor(props) {
        super(props);
        this.state = {
            isShow: this.props.isShow
        };
    }
    /**
     * 组件显示
     */
    show() {
        this.setState({ isShow: true });
    }
    /**
     * 组件隐藏
     */
    hide() {
        this.setState({ isShow: false });
        this.props.onCloseEvent && this.props.onCloseEvent();
    }
    /**
     * 
     * @param {object} e  事件对象
     * @param {string} value 按钮点击返回的值 
     */
    onKeyPressHandler(e, value) {
        e.preventDefault();
        e.stopPropagation();
        this.props.onKeyPress && this.props.onKeyPress(value);
    }
    render() {
        return (
            this.state.isShow ? <ul className="number-keyboard-wrapper">
                {KeyboardParam.map((item, index) => {
                    let specialClass = (item == '' || item == 'del') ? 'number-keyboard-special-item ' : ' ';
                    let delClass = item == 'del' ? 'number-keyboard-del-item' : '';
                    let _display = item == 'del' ? '' : item;
                    let obj = item ? <li key={index} className={"number-keyboard-common-item " + specialClass + delClass} onTouchTap={(e) => this.onKeyPressHandler(e, item)}>{_display}</li> : <li key={index} className={"number-keyboard-common-item " + specialClass + delClass}>{_display}</li>
                    return obj;
                })}
            </ul> : null
        )
    }
    /**
     * 更新属性
     */
    componentWillReceiveProps(nextProps) {
        if(nextProps){
            this.setState({
                isShow: nextProps.isShow //是否显示
            });
        }
        
    }
}

NumberKeyboard.PropTypes = {
    isShow: PropTypes.bool.isRequired,
    onKeyPress: PropTypes.func.isRequired,
    onCloseEvent: PropTypes.func.isRequired
}

export default NumberKeyboard