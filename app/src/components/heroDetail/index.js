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
const ZERO = 0;
const FIRST = 1;
const SECOND = 2;
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
            type: this.props.type || FIRST,
            questions: this.props.questions,
            classname: this.props.classname || '',
            id: this.props.id || '',
            isDrawImg: this.props.isDrawImg || false,
            top: this.props.top || ZERO,
            headUrl: this.props.headUrl || '',
            name: this.props.name || '',
            image: ""
        });
    }
    renderImageDataSection() {
        let { image, id } = this.state;
        return (
            <div className="hero-detail">
                <img src={image} className='hero-detail-img-data' />
                {image ? null : <div className='hero-qrcode hero-qrcode-img'>
                    <QRcode text={'http://www.6itec.com/share/#/?user=' + id} width={180} height={180} qrid={this.props.qrid} />
                </div>}
            </div>
        )
    }
    /**
     * 渲染界面
     */
    renderCommonHeroSection() {
        let { classname, top, isDrawImg, questions, id, headUrl, name } = this.state;
        let noMarginTop = top ? ' no-margin-top' : ' ';
        let temp = classname ? 130 : 180;
        let _width = ClientWidth < 321 ? temp * 0.43 : temp * 0.5;
        let q2 = questions[1];
        let q3 = questions[2];
        let q1 = questions[0];
        let _class = classname ? 'hero-detail-bg ' + classname : 'hero-detail hero-detail-bg ';
        return (
            isDrawImg ? this.renderImageDataSection() : <div id={"common-hero-detail-" + this.props.qrid} className={_class}>
                <div className='hero-detail-left'>
                    <div className={'hero-head ' + noMarginTop}>
                        <img src={headUrl} />
                    </div>
                    {top ? <div className={"hero-top hero-prize-top" + top}></div> : null}
                    <div className='hero-qrcode'>
                        <QRcode text={'http://www.6itec.com/share/#/?user=' + id} width={_width} height={_width} qrid={this.props.qrid} />
                    </div>
                    <span className='hero-qrcode-hint'>扫描图片识别二维码</span>
                </div>
                <div className='hero-detail-right'>
                    <div className='hero-card'></div>
                    <div className='hero-detail-text no-wrap'>
                        {name}人称<br />
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
                </div>

            </div>
        );
    }
    /**
     * 渲染TOP1界面
     */
    renderTop1HeroSection() {
        let { questions, id, headUrl, name } = this.state;
        let _width = 117.5;
        let q2 = questions[1];
        let q3 = questions[2];
        let q1 = questions[0];
        let _class = this.state.image ? ' top1-hero-detail-no-content' : '';
        return (
            <div id={"top1-hero-detail-" + this.props.qrid} className={'top1-hero-detail-wrapper' + _class}>
                <div className='top1-hero-detail-left'>
                    <div className='top1-hero-head'>
                        <img src={headUrl} />
                    </div>
                    <div className={"hero-top1 hero-prize-top1"}></div>
                </div>
                <div className='top1-hero-detail-right'>
                    <div className='top1-hero-right-title'>
                    </div>
                    <div className='tops-hero-right-bottom'>
                        <div className='top1-hero-detail'>
                            <div className='hero-detail-text no-wrap'>
                                {name}人称<br />
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
                        </div>
                        <div className='top1-hero-qrcode'>
                            <div className='hero1-qrcode'>
                                <QRcode text={'http://www.6itec.com/share/#/?user=' + id} width={_width} height={_width} qrid={this.props.qrid} />
                            </div>
                            <span className='hero1-qrcode-hint'>扫描图片识别二维码</span>
                        </div>
                    </div>
                </div>
            </div>
        );

        // 
    }
    /**
     * 渲染界面
     */
    render() {
        let { type } = this.state;
        return (
            type == FIRST ? this.renderCommonHeroSection() : this.renderTop1HeroSection()
        );
    }
    /**
     * 组件渲染完成调用
     */
    componentDidMount() {
        let { questions, id, headUrl, name } = this.state;
        let q1 = questions[0];
        let q2 = questions[1];
        let q3 = questions[2];
        if (this.state.isDrawImg) {  //如果需要绘制图片的情况
            let canvas = document.getElementsByTagName("canvas")[0]
            //动态设置
            let opt = {
                headImg: headUrl,
                username: name,
                q1: q1,
                q2: q2,
                q3: q3,
                qrCode: canvas.toDataURL("image/png")
            }
            Base.getPersonalCardImage(opt).then(data => {
                this.setState({
                    image: data
                })
            })
        }

    }
    /**
     * 属性改变的时候触发
     * @param {object} nextProps props
     */
    componentWillReceiveProps(nextProps) {
        this.setState({
            type: nextProps.type || FIRST,
            top: nextProps.top || ZERO,
            isDrawImg: nextProps.isDrawImg || false,
            classname: nextProps.classname || '',
            questions: nextProps.questions || [],
            id: nextProps.id || '',
            headUrl: nextProps.headUrl || '',
            name: nextProps.name || ''
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
HeroDetail.propTypes = {
    type: React.PropTypes.number,
    headUrl: React.PropTypes.string,
    isDrawImg: React.PropTypes.bool,
    questions: React.PropTypes.array,
    top: React.PropTypes.number,
    classname: React.PropTypes.string,
    qrid: React.PropTypes.string,
    id: React.PropTypes.string,
    name: React.PropTypes.string
};
/**
 * 验证props
 */
HeroDetail.defaultProps = {
    type: FIRST,
    isDrawImg: false,
    top: ZERO,
    id: '',
    classname: '',
    headUrl: '',
    qrid: 'qrcode',
    name: ''
};

export default HeroDetail;
