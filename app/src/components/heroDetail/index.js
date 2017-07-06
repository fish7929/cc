/**
 * @component HeroDetail.js
 * @description 问题页
 * @time 2017-07-05 00:10
 * @author fishYu
 **/

'use strict';

// require core module
import React from 'react';
import ReactDOM from 'react-dom';
import QRcode from '../qrcode';
import DefaultHeader from '../../../assets/images/header.png';
import "./index.scss";
const ClientWidth = document.body.clientWidth;
class HeroDetail extends React.Component {
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
            image: ""
        });
    }

    /**
     * 渲染界面
     */
    render() {
        let _width = ClientWidth > 375 ? ClientWidth * 0.244 : ClientWidth * 0.264;
        let q2 = '一言不合就飙车';
        let q3 = '带你装逼，带你飞';
        let q1 = '没心没肺的的孙悟空';
        return (
            <div className='hero-detail'>
                <img src={this.state.image} style={{width: "100%", height: "100%"}} />

                <div className='hero-qrcode'>
                    <QRcode text={'http://www.baidu.com'} width={180} height={180} />
                </div>
                {/*<div className='hero-detail-left'>
                    <div className='hero-head'>
                        <img src={DefaultHeader} />
                    </div>
                    <div className='hero-qrcode'>
                        <QRcode text={'http://www.baidu.com'} width={_width} height={_width} />
                    </div>
                    <span className='hero-qrcode-hint'>长按图片识别二维码</span>
                </div>
                <div className='hero-detail-right'>
                    <div className='hero-card'></div>
                    <div className='hero-detail-text no-wrap'>
                        微信ID人称<br />
                        <span className='no-wrap' alt={q1} title={q1}>{q1}</span>
                    </div>
                    
                    <div className='hero-detail-text no-wrap'>
                        我将用<span className='no-wrap' alt={q2} title={q2}>{q2}</span><br />
                        的方式拯救世界
                    </div>
                    <div className='hero-detail-text no-wrap'>
                        最后，我想说一句<br />
                        <span className='no-wrap' alt={q3} title={q3}>{q3}</span>
                    </div>
                    
                </div>*/}
            </div>
        );
    }
    /**
     * 组件渲染完成调用
     */
    componentDidMount() {
        let canvas = document.getElementsByTagName("canvas")[0]
        //动态设置
        let opt = {
            headImg: "/assets/images/head-01.png",
            username: "没心没肺的的孙悟空",
            q1: "一言不合就飙车",
            q2: "带你装逼，带你飞",
            qrCode: canvas.toDataURL("image/png")
        }
        Base.getPersonalCardImage(opt).then(data => {
            this.setState({
                image: data
            })
        })
    }
    /**
     * 属性改变的时候触发
     * @param {object} nextProps props
     */
    componentWillReceiveProps(nextProps) {
        // this.setState({
        // });
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
HeroDetail.propTypes = {
    // type: React.PropTypes.number.isRequired,
};

export default HeroDetail;
