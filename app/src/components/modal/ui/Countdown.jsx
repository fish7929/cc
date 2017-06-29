/**
 * @component Countdown.jsx
 * @description 通用倒计时界面
 * @time 2017-06-23 11:20
 * @author fishYu
 **/

'use strict';

// require core module
import React from 'react';

//require submodule

class Countdown extends React.Component {
    /**
     *构造函数
     */
    constructor(props) {
        super(props);
        this.state = {
            position: this.props.position,  //消息框显示的位置
            showTime: this.props.showTime,  //显示的时间
            imgPath: this.props.imgPath
        };
        this.timeout = null;
    }

    hide() {
        this.props.callBack && this.props.callBack();
        this.clearTimer();
        AppModal.hide();
    }
    /**
     * 渲染toast提示框
     */
    renderToastDialog() {
        var _imageDom = this.state.imgPath ? (<div className='toast-dialog-image' style={{ backgroundImage: "url(" + this.state.imgPath + ")" }}></div>)
            : (
                <div className="countdown-spinner">
                    <div className="countdown-spinner-container countdown-container1">
                        <div className="circle1"></div>
                        <div className="circle2"></div>
                        <div className="circle3"></div>
                        <div className="circle4"></div>
                    </div>
                    <div className="countdown-spinner-container countdown-container2">
                        <div className="circle1"></div>
                        <div className="circle2"></div>
                        <div className="circle3"></div>
                        <div className="circle4"></div>
                    </div>
                    <div className="countdown-spinner-container countdown-container3">
                        <div className="circle1"></div>
                        <div className="circle2"></div>
                        <div className="circle3"></div>
                        <div className="circle4"></div>
                    </div>
                </div>
            );
        var _toastMsg = this.state.showTime + "秒";
        return (
            <div className='countdown-dialog-content'>
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
     * 倒计时处理
     */
    countDownHandler() {
        //修改界面ui
        this.timeout = setInterval(() => {
            var oldCount = this.state.showTime;
            if (oldCount == 1) {
                this.setState({
                    showTime: 0
                });
                //跳转到超时页面
                this.hide();
                return;
            }
            var newCount = oldCount - 1;
            this.setState({ showTime: newCount });
        }, 1000);
    }
    /**
     * 组件销毁的时候
     */
    componentDidMount() {
        AppModal.isShow = true;
        this.countDownHandler();
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
            clearInterval(this.timeout);
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
Countdown.propTypes = {
    showTime: React.PropTypes.number.isRequired,
    callBack: React.PropTypes.func.isRequired,
    position: React.PropTypes.string,
    imgPath: React.PropTypes.string
};
export default Countdown;
