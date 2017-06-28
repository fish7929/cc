/**
 * @component Application.jsx
 * @description 提现与购物
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
import Header from '../../components/header';
import Footer from '../../components/footer';
// import PullToRefresh from '../../components/ui/PullToRefresh';
import NoRecord from '../../components/noRecord';
import IsLoading from '../../components/isLoading';
import NoMore from '../../components/noMore';

import ApplicationItem from './ApplicationItem';
import { ZERO, FIRST, SECOND, THREE } from '../../constants';
import { fetchData, refreshData } from './reducer/action';

import "./index.scss";
const DefaultTag = 'ALL';
class Home extends React.Component {
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
            tab: DefaultTag,   //默认选中的标签
            footerTab: ZERO,
            currentPage: 1  //当前第一页
        });
    }
    /**
     * 返回按钮点击处理事件
     * @param {事件} e 
     */
    changeTagHandler(e) {
        // e.preventDefault();
        e.stopPropagation();
        //测试跳转到申请列表
        var target = e.target;
        var tag = target.getAttribute('data-tag');
        this.setState({
            tab: tag
        });
        this.loadListByTag(true);
    }
    /**
     * 渲染头部
     */
    renderTitleSection() {
        let len = this.props.tags.length;
        return (
            <ul className="report-list-title report-scroll-hidden">
                {this.props.tags.map((tag, index) => {
                    var _code = tag.code;
                    var _class = this.state.tab == _code ? 'tag-selected' : '';
                    {/*var _count = '';  //tag.quantity  不显示的，强制设置成''*/ }
                    var _count = tag.amount;  //tag.quantity  tag.amount 不显示的，强制设置成''
                    return (<li className={_class} onTouchTap={(e) => this.changeTagHandler(e)}
                        data-tag={_code} key={index} data-count={_count}>{tag.titleName}</li>)
                })
                }
            </ul>
        )
    }

    /**
     * 渲染列表
     */
    renderListSection() {
        return (
            <ul className="report-list-content" ref="ulList" >
                {this.props.list.map((item, index) => <ApplicationItem item={item} key={index} />)}
                {this.renderIsLoadingSection()}
                {this.renderNoMoreSection()}
                {this.renderNoRecordSection()}
            </ul>
        )
    }
    /**
     * 渲染正在加载
     */
    renderIsLoadingSection() {
        return (
            this.props.isFetching ? <IsLoading /> : null
        )
    }
    /**
     * 渲染没有更多
     */
    renderNoMoreSection() {
        return (
            this.props.isFinish ? <NoMore /> : null
        )
    }
    /**
     * 渲染没有记录
     */
    renderNoRecordSection() {
        return (
            this.props.noItem ? <NoRecord /> : null
        )
    }
    onFooterTabClickHandler(e, index){
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            footerTab: index
        });
        if(index == ZERO){
            navigate.push(RoutPath.ROUTER_HOME);
        }else if (index == FIRST) {
            navigate.push(RoutPath.ROUTER_LOGIN);
        }
    }
    /**
     * 渲染界面
     */
    render() {
        return (
            <Page id='application-list-page' ref="home">
                <Header title="首页" isShowBack={false}/>
                {this.renderTitleSection()}
                {/*<PullToRefresh loadUp={(resolve) => this.dropdownToRefresh(resolve)}
                    className="report-list-c mdx-scroller" ref='pullToRefresh'>*/}
                {this.renderListSection()}
                {/*</PullToRefresh>*/}
                <Footer tabIndex={this.state.footerTab} onTabClick={(e, index) => this.onFooterTabClickHandler(e, index)} 
                    icons={[{text: '首页'}, {text: '登录'}]}/>
            </Page>
        );
    }
    /**
     * 获取标题内容
     */
    getTitle() {
        var title = '首页';
        return title;
    }
    /**
     * 组件渲染完成调用
     */
    componentDidMount() {
        //动态设置页面标题
        var title = this.getTitle();
        Base.setTitle(title);
        /*****
         * 以下是如何调用全局的对话
         */
        // AppModal.toast("这只是第二个测试");
        //AppModal.toast("这只是一个测试", DialogConstants.TOAST_LONG_DURATION, DialogConstants.TOAST_POSITION_BOTTOM, () => console.log('hahahha'));
        // AppModal.loading();
        //AppModal.hide();
        // AppModal.alert("你好啊啊啊啊啊啊啊啊");
        // AppModal.alert("你好啊啊啊啊啊啊啊啊", "温馨提示", () => console.log('回调'), '确定');
        // AppModal.confirm("你好啊啊啊啊啊啊啊啊");
        // AppModal.confirm("你好啊啊啊啊啊啊啊啊", "你需要退出吗？", () => console.log('成功'), () => console.log('取消'));
        //获取网络初始化数据，
        this.getInitData();
        //上拉加载更多的操作
        this.pullToLoading();
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
    }
    /**
     * 获取网络初始化数据，
     */
    getInitData() {
        this.loadTitleData();
        this.loadListByTag();

    }
    /**
     * 下拉刷新的具体操作
     * @param {操作成功的回调} resolve 
     */
    dropdownToRefresh(resolve) {
        //还原初始状态
        this.setState(this.getInitState());
        //获取网络初始化数据，
        this.getInitData();
        //刷新成功取消样式
        setTimeout(function () {
            resolve();
        }, 500);
    }
    /**
     * 上拉加载实现方法
     */
    pullToLoading() {
        // 这里做延迟是由于，一部加载的时候
        setTimeout(() => {
            var ulList = ReactDOM.findDOMNode(this.refs.ulList);
            // var ulList = ReactDOM.findDOMNode(this.refs.pullToRefresh);
            var self = this;
            if (ulList) {
                ulList.onscroll = function (e) {
                    e.stopPropagation();
                    // e.preventDefault();
                    if (this.scrollTop >= (this.scrollHeight - this.clientHeight - 1)) {  //滑动到底部的时候加载
                        if (!self.props.isFinish) {   //没结束就继续加载
                            if (self.props.isFetching) return;  //在加载中的情况就不执行
                            self.setState({ currentPage: self.state.currentPage + 1 });
                            self.loadListByTag();
                        } else {

                        }
                    }
                }
            }
        }, 120);
    }
    /**
     * 组件渲染完成调用
     */
    componentWillUnmount() {
        //删除滑动加载
        var ulList = ReactDOM.findDOMNode(this.refs.ulList);
        // var ulList = ReactDOM.findDOMNode(this.refs.pullToRefresh);
        if (ulList) ulList.onscroll = null;
    }
    /**
     * 重置默认值
     */
    resetDefaultState() {
        this.props.refreshData();
        this.setState({
            currentPage: 1,
        });
    }
    /**
     * 点击TAP重新加载数据
     */
    loadListByTag(isReFash = false) {
        let { itemCount, fetchData } = this.props;
        if (isReFash) {
            this.resetDefaultState();
        }
        setTimeout(() => {   //预防上次设置的 state没执行，做个延迟
            let skip = (this.state.currentPage - 1) * itemCount;
            let param = {
                fUserId: this.fuserId,
                type: this.state.tab,
                startIndex: skip,
                pageSize: itemCount,
                queryDay: this.type
            };
            fetchData(1, param);
            // AppModal.hide();
        }, 0);

    }
    /**
     * 加载头部TAG数据
     */
    loadTitleData() {
        //需要加载头部的API
        this.props.fetchData(0);
    }

}


let mapStateToProps = state => {
    return ({
        isFetching: state.homeData.isFetching,
        list: state.homeData.list,
        tags: state.homeData.tags
    });
}

let mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ fetchData, refreshData }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
