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
import { ZERO, FIRST, SECOND, THREE } from '../../constants';
import { fetchData } from './reducer/action';

import "./index.scss";
class Question extends React.Component {
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
            tab: ZERO,
            Q0: this.props.remoteData.Q0 || [],
            Q1: this.props.remoteData.Q1 || [],
            Q2: this.props.remoteData.Q2 || [],
            currentQ0: [],
            currentQ1: [],
            currentQ2: ''
        });
    }
    /**
     * 返回按钮点击处理事件
     * @param {事件} e 
     */
    gotoNextHandler(e) {
        e.preventDefault();
        e.stopPropagation();
        let _tab = this.state.tab;
        if (_tab <= FIRST) {
            this.setState({ tab: _tab + 1 });
        } else { //提交

        }
    }
    /**
     * 改变state
     * @param {object} e 事件
     * @param {string} e 键值
     * @param {string} val 需要存储的值
     */
    changeStateHandler(e, key, val) {
        e.preventDefault();
        e.stopPropagation();
        let obj = {};
        if (key == 'currentQ2') {
            obj[key] = val;
        } else {
            let old = this.state[key];
            if(old.indexOf(val) > -1){
                old = old.filter((item, index) => item != val);
            }else{
                if (old.length == 2) {
                    AppModal.toast('亲，最多只能选择两项哦！');
                    return;
                } else {
                    old.push(val);
                }
            }
            obj[key] = old;
        }
        this.setState(obj);
    }
    renderRadioItem(item, index) {
        let { curentQ2 } = this.state;
        return (
            <label className="question-conten-item" key={index} htmlFor={index}>
                <input type="radio" id={index} value={curentQ2 == item} name='quertion2'
                    onChange={(e) => this.changeStateHandler(e, 'currentQ2', item)} /> {item}
            </label>
        );
    }
    renderCheckboxItem(item, index) {
        let { tab } = this.state;
        let key = 'currentQ' + tab;
        let currentArr = this.state[key];
        console.log(currentArr, key, 6666);
        return (
            <label className="question-conten-item" key={index} htmlFor={index}>
                <input type="checkbox" id={index} value={currentArr.indexOf(item) > -1}
                    onChange={(e) => this.changeStateHandler(e, key, item)} /> {item}
            </label>
        );
    }
    /**
     * 渲染问题内容部分
     */
    renderContentSection() {
        let { tab } = this.state;
        let key = "Q" + tab;
        let Q = this.state[key];
        let questionHint = 'Q0：你心目中的英雄应该（可以选择两项）？';
        if (tab == FIRST) {
            questionHint = 'Q1：你的超能力是（可以选择两项）？';
        } else if (tab == SECOND) {
            questionHint = 'Q2：最想对你的对手说（单选）？';
        }
        return (
            <div className="question-page-content">
                <div className="question-hint">{questionHint}</div>
                {Q.map((item, index) => {
                    return (tab == SECOND ? this.renderRadioItem(item, index) :
                        this.renderCheckboxItem(item, index))
                })}
            </div>
        );
    }
    /**
     * 渲染界面
     */
    render() {
        let btnHint = this.state.tab != SECOND ? '下一题' : '提交';
        return (
            <Page id='question-page-container'>
                {this.renderContentSection()}
                <div className="question-page-button btn-active"
                    onTouchTap={(e) => this.gotoNextHandler(e)}
                >{btnHint}</div>
            </Page>
        );
    }
    /**
     * 获取标题内容
     */
    getTitle() {
        var title = '问题';
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
        if (!this.props.isFetching) {
            AppModal.hide();
        }
    }
    /**
     * 属性改变的时候触发
     * @param {object} nextProps props
     */
    componentWillReceiveProps(nextProps) {
        if (!nextProps.isFetching) {
            AppModal.hide();
        }
        this.setState({
            Q0: nextProps.remoteData.Q0 || [],
            Q1: nextProps.remoteData.Q1 || [],
            Q2: nextProps.remoteData.Q2 || [],
        });
    }
    /**
     * 获取网络初始化数据，
     */
    getInitData() {
        this.props.fetchData();
    }
    /**
     * 组件渲染完成调用
     */
    componentWillUnmount() {
    }

}


let mapStateToProps = state => {
    console.log(state);
    return ({
        isFetching: state.questionData.isFetching,
        remoteData: state.questionData.remoteData
    });
}

let mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ fetchData }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Question);
