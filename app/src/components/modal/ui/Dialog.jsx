/**
 * @component Dialog.jsx
 * @description 通用对话框呈现的界面。
 * @time 2017-03-13 18:20
 * @author fishYu
 **/

'use strict';

// require core module
import React from 'react';

class Dialog extends React.Component {
    /**
     *构造函数
     */
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.title,    //提示框标题
            text: this.props.text,   //显示的内容
            buttons: this.props.buttons  //按钮文字
        };
    }
    /**
     * 确定按钮点击处理事件
     */
    buttonClickHandler(e, callBack) {
        e.preventDefault();
        e.stopPropagation();
        callBack && callBack();
        AppModal.hide();
    }

    /**
     * 渲染全屏按钮
     */
    renderScreenDialog() {
        let { buttons } = this.state;
        console.log(buttons, buttons.length);
        let _buttonDom = buttons.length == 1 ? <div className='screen-dialog-button btn-active' onTouchTap={(e) => this.buttonClickHandler(e, buttons[0].callBack)}>{buttons[0].text}</div> :
            (<div className='screen-dialog-button'>
                {buttons.map((item, index) =>{
                    console.log(item, 888);
                    return <span key={index} className='btn-active' onTouchTap={(e) => this.buttonClickHandler(e, item.callBack)}>{item.text}</span>
                })}
            </div>);
        let _titleDom = this.state.title ? (<div className='screen-dialog-title'>{this.state.title}</div>) : null;
        let _noTitleClass = this.state.title ? '' : 'dialog-message-no-title';
        return (
            <div className='screen-dialog-content xy-center'>
                {_titleDom}
                <div className={'screen-dialog-message ' + _noTitleClass} dangerouslySetInnerHTML={{ __html: this.state.text }}></div>
                {_buttonDom}
            </div>
        );
    }
    /**
     * 渲染界面
     */
    render() {
        return (
            <div className="app-modal dialog-mask-bg">
                {this.renderScreenDialog()}
            </div>
        );
    }
    /**
     * 组件销毁的时候
     */
    componentDidMount() {
    }
    /**
     * 更新属性
     */
    componentWillReceiveProps(nextProps) {
        this.setState({
            title: nextProps.title,    //提示框标题
            text: nextProps.text,   //显示的内容
            buttons: nextProps.buttons  //消息框显示的位置
        });
    }
    /**
     * 组件销毁的时候
     */
    componentWillUnmount() {
    }
}
/**
 * 验证props
 */
Dialog.propTypes = {
    title: React.PropTypes.string.isRequired,
    text: React.PropTypes.string.isRequired,
    buttons: React.PropTypes.array.isRequired,
};
export default Dialog;
