/**
 * @component index.js
 * @description 首页
 * @time 2017-06-12 19:15
 * @author fishYu
 **/

'use strict';

// require core module
import React from 'react';

//require submodule
import Page from '../../components/page';

import { ZERO, FIRST, SECOND, THREE } from '../../constants';
import HeroDetail from '../../components/heroDetail';
import "./index.scss";


class BigScreen extends React.Component {
    /**
     *构造函数
     */
    constructor(props) {
        super(props);
        this.state = {
            newHero: [],
            topHero: []
        };

        this.timer = null;
    }
    /**
     * 获取渲染的内容
     */
    renderNewHeroSection() {
        let { newHero } = this.state;
        return (
            <div className="new-hero-content">
                {newHero.map((item, index) => <HeroDetail type={FIRST} key={item.id + '-new-' + index} 
                qrid={'qrcod-new-hero-' + item.id + '-' + index} classname='another-hero-detail new-hero-item'  id={item.id}
                name={item.name} questions={item.questions} headUrl={item.headUrl}/>)}
            </div>
        );
    }
    /**
     * 获取渲染的内容
     */
    renderTopHeroSection() {
        let { topHero } = this.state;
        return (
            <div className="top-hero-content">
                {topHero.map((item, index) => {
                    let _type = index == 0 ? SECOND : FIRST;
                    let _class = index <= 2 ? (index == 0 ? '' : 'another-hero-detail top-hero-item top-hero-' + (index + 1))
                        : 'top-hero-item another-hero-detail';
                    return (<HeroDetail type={_type} key={item.id + '-top-' + index} id={item.id}
                        qrid={'qrcod-top-hero-' + item.id + '-' + index} classname={_class} top={index + 1} 
                        name={item.name} questions={item.questions} headUrl={item.headUrl}/>)
                })}
            </div>
        );
    }
    /**
     * 渲染界面
     */
    render() {
        return (
            <Page id='big-screen-container'>
                <div className='big-screen-title'></div>
                {this.renderNewHeroSection()}
                {this.renderTopHeroSection()}
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
        //查询数据
        this.getInitData();
        // if (!this.props.isFetching) {
        //     AppModal.hide();
        // }
        //几秒钟轮训查询
        this.clearTimer();
        this.timer = setInterval(() => this.getInitData(), 20 * 1000);
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
            type: ZERO
        });
    }
    /**
     * 获取网络初始化数据，
     */
    getInitData() {
        // this.props.fetchData();
        let opt1 = {
            pageSize: 0,
            pageNumber: 6,
            orderby: 'createdAt',
            isdesc: true
        };
        lc_api.getUser(opt1, (list) => {
            let _newHero = list.map((item, index) => {
                let obj = { 
                    id: item.id,
                    questions: [item.get('q0') || '', item.get('q1') || '', item.get('q2') || ''],
                    name: item.get('user_nick') || '',
                    headUrl: item.get('user_pic') || ''
                };
                return obj;
            });
            this.setState({ newHero: _newHero });
        }, (error) => {
            console.log(error, '查询新上屏英雄失败');
        });
        let opt2 = {
            pageSize: 0,
            pageNumber: 5,
            orderby: 'msg_count',
            isdesc: true
        };
        lc_api.getUser(opt2, (list) => {
            let _topHero = list.map((item, index) => {
                let obj = { 
                    id: item.id,
                    questions: [item.get('q0') || '', item.get('q1') || '', item.get('q2') || ''],
                    name: item.get('user_nick') || '',
                    headUrl: item.get('user_pic') || ''
                };
                return obj;
            });
            this.setState({ topHero: _topHero });
        }, (error) => {
            console.log(error, '查询排行榜失败');
        });
    }
    /**
     * 组件渲染完成调用
     */
    componentWillUnmount() {
        this.clearTimer();
    }

    clearTimer() {
        if(this.timer){
            clearInterval(this.timer);
            this.timer = null;
        }
    }
}

export default BigScreen;
