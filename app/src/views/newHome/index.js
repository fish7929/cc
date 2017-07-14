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

//require submodule
import Page from '../../components/page';
import QuestionComponent from '../question/QuestionComponent';
import Home from '../home';
import "./index.scss";
import QuestionData from '../../config/QuestionData';
const ClientWidth = document.body.clientWidth;   //移动端界面的宽度
class NewHome extends React.Component {
    /**
     *构造函数
     */
    constructor(props) {
        super(props);
        this.currentUser = Base.getLocalStorageObject('CURRENT_USER');  //获取当前用户
        let otherId = Base.getParameter('user');
        let _current = 0;
        if (this.currentUser.objectId === otherId && this.currentUser.q0 && this.currentUser.q3) {
            _current = 4;
        } else if (this.currentUser.objectId != otherId && !this.currentUser.q0 && !this.currentUser.q3) {
            _current = 0;
        } else if (this.currentUser.objectId != otherId && this.currentUser.q0 && this.currentUser.q3) {
            //todo 去跳页
            navigate.push(RoutPath.ROUTER_CHAT_HISTORY);
            return;
        }
        this.state = {
            current: _current
        };

    }
    /**
     * 滑动tab
     * @param {number} index 当前下标
     */
    swiperHandler(index) {
        this.setState({
            current: index
        });
        setTimeout(() => {
            let mySwipeWrapper = ReactDOM.findDOMNode(this.refs.mySwipeWrapper);
            if (mySwipeWrapper) {
                mySwipeWrapper.style.transform = "translate(-" + (index * ClientWidth) + "px, 0) translateZ(0)";
                mySwipeWrapper.style.WebkitTransform = "translate(-" + (index * ClientWidth) + "px, 0) translateZ(0)";
            }
        }, 0);
    }
    /**
     * 返回按钮点击处理事件
     * @param {string} val 返回事件 
     * @param {number} type 返回事件 
     */
    gotoNextHandler(val, type) {
        let opt = {};
        let key = "q" + (type - 1);
        opt.user_id = this.currentUser.objectId;
        opt.column_name = key;
        opt.column_val = val;
        this.currentUser[key] = val;
        Base.setLocalStorageObject('CURRENT_USER', this.currentUser);
        lc_api.updateUserInfo(opt, () => {
            this.swiperHandler(type);
        }, () => {
            AppModal.toast('保存问题失败');
        });
    }
    /**
     * 渲染界面
     */
    render() {
        let _style = { width: (5 * ClientWidth) + "px" };
        let _itemStyle = { width: ClientWidth + "px" };
        return (
            <Page id='home-page-container'>
                <div ref='mySwipeWrapper' className='h5-swipe-wrapper' style={_style}>
                    <Home style={_itemStyle} callback={() => this.swiperHandler(1)} />
                    <QuestionComponent type={1} title='你登记想成为什么英雄 ？' style={_itemStyle}
                        data={QuestionData.Q0} callback={(val) => this.gotoNextHandler(val, 2)} />
                    <QuestionComponent type={2} title='选择你想要的英雄技能 ？' style={_itemStyle}
                        data={QuestionData.Q1} callback={(val) => this.gotoNextHandler(val, 3)} />
                    <QuestionComponent type={3} title='选择一句响亮的口号吧  !' style={_itemStyle}
                        data={QuestionData.Q2} callback={(val) => this.gotoNextHandler(val, 4)} />
                </div>
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
        //初始化分享
        lc_api.initWXShare();
    }
    /**
     * 属性改变的时候触发
     * @param {object} nextProps props
     */
    componentWillReceiveProps(nextProps) {
    }
    /**
     * 获取网络初始化数据，
     */
    getInitData() {

    }
    /**
     * 组件渲染完成调用
     */
    componentWillUnmount() {
    }

}

export default NewHome;
