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
import Question from '../question';
import Logo from '../logo';
import Hero from '../hero';
import "./index.scss";
import QuestionData from '../../config/QuestionData';
const ClientWidth = document.body.clientWidth;   //移动端界面的宽度
class Home extends React.Component {
    /**
     *构造函数
     */
    constructor(props) {
        super(props);
        this.currentUser = Base.getLocalStorageObject('CURRENT_USER');  //获取当前用户
        let otherId = Base.getParameter('user');
        let _current = 4;
        if (this.currentUser.objectId === otherId && this.currentUser.q0 && this.currentUser.q2) {
            _current = 4;  //执照页面
            console.log(777);
        } else if (this.currentUser.objectId != otherId && !this.currentUser.q0 && !this.currentUser.q2) {
            _current = 0;  //首页
            console.log(999);
        } else if (otherId && this.currentUser.objectId != otherId && this.currentUser.q0 && this.currentUser.q2) {
            //todo 去跳页
            _current = 6;  //有用户id 并且 不是当前用户，有执照
        }
        console.log(_current);
        this.state = {
            current: _current,
            isShowMask: false
        };

    }
    /**
     * 滑动tab
     * @param {number} index 当前下标
     * @param {number} time  过场动画时间
     */
    swiperHandler(index, time) {
        this.setState({
            current: index
        });
        setTimeout(() => {
            let mySwipeWrapper = ReactDOM.findDOMNode(this.refs.mySwipeWrapper);
            if (mySwipeWrapper) {
                if (time) {
                    mySwipeWrapper.style.WebkitTransitionDuration = time;
                    mySwipeWrapper.style.transitionDuration = time;
                } else {
                    mySwipeWrapper.style.WebkitTransitionDuration = '800ms';
                    mySwipeWrapper.style.transitionDuration = '800ms';
                }
                mySwipeWrapper.style.transform = "translate(-" + (index * ClientWidth) + "px, 0) translateZ(0)";
                mySwipeWrapper.style.WebkitTransform = "translate(-" + (index * ClientWidth) + "px, 0) translateZ(0)";
                this.setState({ isShowMask: false });
            }
        }, 0);
    }
    /**
     * 返回按钮点击处理事件
     * @param {string} val 返回事件 
     * @param {number} type 返回事件 
     */
    gotoNextHandler(val, type) {
        this.setState({ isShowMask: true });
        let opt = {};
        let key = "q" + (type - 2);
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
        // let {user} = this.state;
        return (
            <Page id='home-page-container'>
                <div ref='mySwipeWrapper' className='h5-swipe-wrapper' style={_style}>
                    {this.state.isShowMask ? <div className='question-mask'></div> : null}
                    <Logo style={_itemStyle} callback={() => this.swiperHandler(1)} />
                    <Question type={1} title='你登记想成为什么英雄 ？' style={_itemStyle}
                        data={QuestionData.Q0} callback={(val) => this.gotoNextHandler(val, 2)} />
                    <Question type={2} title='选择你想要的英雄技能 ？' style={_itemStyle}
                        data={QuestionData.Q1} callback={(val) => this.gotoNextHandler(val, 3)} />
                    <Question type={3} title='选择一句响亮的口号吧  !' style={_itemStyle}
                        data={QuestionData.Q2} callback={(val) => this.gotoNextHandler(val, 4)} />
                    <Hero style={_itemStyle} user={this.currentUser} />
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
    componentWillMount() {
        //初始化的时候显示
        this.swiperHandler(this.state.current, '0ms');
    }
    /**
     * 组件渲染完成调用
     */
    componentDidMount() {
        //动态设置页面标题
        var title = this.getTitle();
        Base.setTitle(title);
        if (this.state.current === 6) {
            let otherId = Base.getParameter('user');
            if (otherId) {
                navigate.push(RoutPath.ROUTER_CHAT_VIEW + '/' + otherId);
                return;
            } else {
                this.setState({ current: 0 });
            }
        }
        //初始化分享
        // setTimeout(() => {
        //     if (Base.isWeiXinPlatform()) {
        //         lc_api.initWXShare(this.currentUser);
        //     }
        // }, 1000);
    }
    componentDidUpdate() {
        //初始化分享
        // lc_api.initWXShare(this.currentUser);
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

export default Home;
