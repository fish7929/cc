/**
 * @component ActionSheet.jsx
 * @description 动作表单界面
 * @time 2017-06-23 14:20
 * @author fishYu
 **/

'use strict';

// require core module
import React from 'react';

//require submodule

class ActionSheet extends React.Component {
    /**
     *构造函数
     */
    constructor(props) {
        super(props);
        this.state = {
            classname: 'slideInFromBottom',
            sheets: this.props.sheets  //表单内容
        };
    }
    /**
     * 隐藏
     */
    hide(e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            classname: 'slideOutToBottom'
        });
        //先让动画结束在，执行回调， 动画时间为500毫秒
        setTimeout(() => AppModal.hide(), 500);
    }
    /**
     * 
     * @param {object} e 事件对象 
     * @param {number} index 对应sheet的下表， 从0开始， 取消不算
     */
    onSheepClickHandler(e, index) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            classname: 'slideOutToBottom'
        });
        //先让动画结束在，执行回调， 动画时间为500毫秒
        setTimeout(() => {
            AppModal.hide();
            this.props.action && this.props.action(index);
        }, 500);
    }
    /**
     * 渲染toast提示框
     */
    renderActionSheetSection() {
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
        let { sheets, classname } = this.state;
        return (
            <div className="app-modal action-sheet-bg">
                <div className='action-sheet-mask' onTouchTap={(e) => this.hide(e)}></div>
                <ul className={'action-sheet-content ' + classname }>
                    {sheets.map((item, index) => <li key={index} className="btn-active" onTouchTap={(e) => this.onSheepClickHandler(e, index)}>{item}</li>)}
                    <li key={sheets.length} className="action-sheet-cancel btn-active" onTouchTap={(e) => this.hide(e)}>取消</li>
                </ul>
            </div>
        )
    }
    /**
     * 组件销毁的时候
     */
    componentDidMount() {
        AppModal.isShow = true;
    }
    /**
     * 更新属性
     */
    componentWillReceiveProps(nextProps) {
        this.setState({
            sheets: nextProps.sheets //显示时间
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
ActionSheet.propTypes = {
    sheets: React.PropTypes.array.isRequired,
    action: React.PropTypes.func.isRequired
};
export default ActionSheet;
