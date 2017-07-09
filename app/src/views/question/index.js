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
import QuestionComponent from './QuestionComponent';
import { FIRST, SECOND, THREE } from '../../constants';
import { fetchData } from './reducer/action';

import "./index.scss";
class Question extends React.Component {
    /**
     *构造函数
     */
    constructor(props) {
        super(props);
        let type = this.props.params && this.props.params.type;
        this.type = parseInt(type);
        this.state = {
            Q0: this.props.remoteData.Q0 || [],
            Q1: this.props.remoteData.Q1 || [],
            Q2: this.props.remoteData.Q2 || [],
            isShowMask: false  //是否显示遮罩
        }
    }
    /**
     * 返回按钮点击处理事件
     * @param {string} val 返回事件 
     */
    gotoNextHandler(val) {
        this.setState({isShowMask: true});
        let localQuestion = Base.getLocalStorageObject('USER_SELECT_QUESTION');
        if(localQuestion && localQuestion.hasOwnProperty('questions')){
            localQuestion.questions.push(val);
            Base.setLocalStorageObject('USER_SELECT_QUESTION', localQuestion);
        }else{
            let arr = [];
            let obj = {};
            arr.push(val);
            obj.questions = arr;
            Base.setLocalStorageObject('USER_SELECT_QUESTION', obj);
        }
        setTimeout(() => {
            if(this.type != THREE){
                navigate.push(RoutPath.ROUTER_QUESTION + '/' + (this.type + 1) );
            }else{
                console.log('生存英雄执照');
                navigate.push(RoutPath.ROUTER_HERO);
            }
        }, 1000);
    }
    /**
     * 获取渲染的内容
     */
    getComponent() {
        let { Q0, Q1, Q2 } = this.state;
        let comp = null;
        switch (this.type) {
            case FIRST:
                comp = <QuestionComponent type={this.type} title='你登记想成为什么英雄 ？'
                    data={Q0} callback={(val) => this.gotoNextHandler(val)} />
                break;
            case SECOND:
                comp = <QuestionComponent type={this.type} title='选择你想要的英雄技能 ？'
                    data={Q1} callback={(val) => this.gotoNextHandler(val)} />
                break;
            case THREE:
                comp = <QuestionComponent type={this.type} title='选择一句响亮的口号吧  !'
                    data={Q2} callback={(val) => this.gotoNextHandler(val)} />
                break;
            default:
                break;
        }
        return comp;
    }
    /**
     * 渲染界面
     */
    render() {
        return (
            <Page id='question-page-container'>
                {this.state.isShowMask ? <div className='question-mask'></div> : null}
                {this.getComponent()}
            </Page>
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
        //动态设置页面标题
        var title = this.getTitle();
        Base.setTitle(title);
        this.getInitData();
        // if (!this.props.isFetching) {
        //     AppModal.hide();
        // }
    }
    /**
     * 属性改变的时候触发
     * @param {object} nextProps props
     */
    componentWillReceiveProps(nextProps) {
        // if (!nextProps.isFetching) {
        //     AppModal.hide();
        // }
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
    return ({
        isFetching: state.questionData.isFetching,
        remoteData: state.questionData.remoteData
    });
}

let mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ fetchData }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Question);
