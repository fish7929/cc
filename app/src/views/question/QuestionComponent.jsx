/**
 * @component QuestionComponent.jsx
 * @description 问题页
 * @time 2017-07-04 00:10
 * @author fishYu
 **/

'use strict';

// require core module
import React from 'react';
import ReactDOM from 'react-dom';

class QuestionComponent extends React.Component {
    /**
     *构造函数
     */
    constructor(props) {
        super(props);
        this.state = this.getInitState();
    }
    /**
     * 初始化的状态
     */
    getInitState(state) {
        state = state || {};
        return Object.assign(state, {
            type: this.props.type,
            title: this.props.title,
            data: this.props.data,
            current: ''
        });
    }
    /**
     * 改变state
     * @param {object} e 事件
     * @param {string} val 需要存储的值
     */
    changeStateHandler(e, val) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({current : val});
        this.props.callback && this.props.callback(val);
    }
    /**
     * 渲染界面
     */
    render() {
        let { data, current, title, type } = this.state;
        return (
            <div className="question-page-content">
                <div className={'question-hint question-hint-wrapper' + type}>
                </div>
                <div className="common-border-image question-list-wrapper">
                    {data.map((item, index) => {
                        let selected = item == current ? 'question-selected' : '';
                        return <span key={type + ' ' + index} className={'question-item ' + selected}
                            onTouchTap={(e) => this.changeStateHandler(e, item)}>{item}</span>
                    })}
                </div>
            </div>
        );
    }
    /**
     * 组件渲染完成调用
     */
    componentDidMount() {
        //动态设置页面标题
    }
    /**
     * 属性改变的时候触发
     * @param {object} nextProps props
     */
    componentWillReceiveProps(nextProps) {
        this.setState({
            type: nextProps.type,
            title: nextProps.title,
            data: nextProps.data
        });
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
QuestionComponent.propTypes = {
    type: React.PropTypes.number.isRequired,
    title: React.PropTypes.string.isRequired,
    data: React.PropTypes.array.isRequired,
    callback: React.PropTypes.func.isRequired,
};

export default QuestionComponent;
