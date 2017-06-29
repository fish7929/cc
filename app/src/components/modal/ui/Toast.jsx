/**
 * @component Dialog.jsx
 * @description 通用对话框呈现的界面。
 * @time 2017-03-13 18:20
 * @author fishYu
 **/

'use strict';

// require core module
import React from 'react';

//require submodule

class Toast extends React.Component {
    /**
     *构造函数
     */
    constructor(props) {
        super(props);
        this.state = {
            text: this.props.text,   //显示的内容
            position: this.props.position,  //消息框显示的位置
            showTime: this.props.showTime,  //显示的时间
            imgPath: this.props.imgPath
        };
        this.timeout = null;
    }

    hide() {
        this.props.callBack && this.props.callBack();
        this.timeout && clearTimeout(this.timeout);
        AppModal.hide();
    }
    /**
     * 渲染toast提示框
     */
    renderToastDialog() {
        var _imageDom = this.state.imgPath ? (<div className='toast-dialog-image' style={{ backgroundImage: "url(" + this.state.imgPath + ")" }}></div>) : null;
        var _toastMsg = this.state.text;
        return (
            <div className='toast-dialog-content'>
                {_imageDom}
                <div className='toast-dialog-message' dangerouslySetInnerHTML={{ __html: _toastMsg }}></div>
            </div>
        );
    }
    /**
     * 渲染界面
     */
    render() {
        let _className = '';
        switch (this.state.position) {
            case DialogConstants.TOAST_POSITION_TOP:
                _className = 'toast-dialog-container-top x-center';
                break;
            case DialogConstants.TOAST_POSITION_CENTER:
                _className = 'toast-dialog-container-center xy-center';
                break;
            case DialogConstants.TOAST_POSITION_BOTTOM:
                _className = 'toast-dialog-container-bottom x-center';
                break;
        }
        return (
            <div className="app-modal toast-mask-bg">
                <div className={_className}>
                    {this.renderToastDialog()}
                </div>
            </div>
        )
    }
    /**
     * toast显示框自动关闭处理函数
     */
    toastAutoClose() {
        this.timeout = setTimeout(() => {
            this.hide();
        }, this.state.showTime * 1000);
    }
    /**
     * 组件销毁的时候
     */
    componentDidMount() {
        AppModal.isShow = true;
        this.toastAutoClose();
    }
    /**
     * 更新属性
     */
    componentWillReceiveProps(nextProps) {
        this.setState({
            showTime: nextProps.showTime, //显示时间
            text: nextProps.message,   //显示的内容
            imgPath: nextProps.imgPath,    //图片路径
            position: nextProps.position  //消息框显示的位置
        });
    }
    /**
     * 清除定时器
     */
    clearTimer() {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    }
    /**
     * 组件销毁的时候
     */
    componentWillUnmount() {
        this.clearTimer();
    }
}
/**
 * 验证props
 */
Toast.propTypes = {
    text: React.PropTypes.string.isRequired,
    position: React.PropTypes.string,
    showTime: React.PropTypes.number,
    callBack: React.PropTypes.func,
    imgPath: React.PropTypes.string
};
export default Toast;
