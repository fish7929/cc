/**
 * @component PasswordInput.js
 * @description 通用的UI 密码输入框
 * @time 2017-06-12 11:50
 * @author fishYu
 **/
import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import "./index.scss";
class PasswordInput extends React.Component {
    /**
     *构造函数
     */
    constructor(props) {
        super(props);
        //初始化数组长度,并赋初值
        this.metadata = [];
        for(let i = 0; i < this.props.lengths; i++){
            this.metadata.push('');
        }
        this.state = {
            isShow: this.props.isShow,
            content: this.metadata
        };
        this.index = 0;
    }
    /**
     * 组件显示
     */
    show() {
        this.setState({ isShow: true });
    }
    /**
     * 组件隐藏
     */
    hide() {
        this.setState({ 
            isShow: false,
            content: this.metadata
        });
        this.index = 0;
    }
    /**
     * 设置密码
     * @param {string} value 需要设置的值，可能是有值，可能没值，''表示删除
     */
    setCurrentValue(value) {
        let oldContent = this.state.content;
        let pos = this.pos();
        let currentPas = oldContent[pos];
        if(value){  //设置值的情况
            if(!(currentPas && (this.pos() == (this.props.lengths - 1)))){
                oldContent[pos] = value;
                this.next();
                if(this.pos() == (this.props.lengths - 1)){
                    let pass = this.getValue();
                    //输入结束的时候
                    if(pass){
                        this.props.onCompleted && this.props.onCompleted(pass);
                    }
                }
            }
        }else{  //删除的情况
            if(currentPas){
                oldContent[pos] = '';
            }else{
                let pre = this.prev();
                if (pre != -1){
                    oldContent[pre] = '';
                }
            }
        }
        this.setState({content: oldContent});
    }
    /**
     * 获取输入的密码值
     * @return {string} 返回输入的密码值
     */
    getValue() {
        let res = '';
        let val = this.state.content.join('');
        if(val.length == this.props.lengths){
            res = val;
        }
        return res;
    }
    /**
     * 当前标识
     */
    pos() {
        if (this.index === undefined) this.index = 0;
        return this.index;
    }
    /**
     * 下一个
     */
    next() {
        if (this.pos() >= (this.props.lengths - 1)) return -1;
        this.index = this.pos() + 1;
        return this.index;
    }
    /**
     * 上一个
     */
    prev() {
        if (this.pos() < 1) return -1;
        this.index = this.pos() - 1;
        return this.index;
    }
    /**
     * 渲染
     */
    render() {
        return (
            this.state.isShow ? <div className="password-input-wrapper">
                {this.metadata.map((item, index) => {
                    let focusClass = index == this.index ? 'password-input-focus' : '';
                    let _display = this.state.content[index];
                    _display = _display == undefined ? "" : _display;
                    let obj =  <input ref="passwordInput" key={index}  type="text" disabled value={_display} className={"password-input-common-item " + focusClass}/>;
                    return obj;
                })}
            </div> : null
        )
    }
    /**
     * 渲染完成
     */
    componentDidMount() {
    }

    /**
     * 更新属性
     */
    componentWillReceiveProps(nextProps) {
        if(nextProps){
            this.setState({
                isShow: nextProps.isShow, //是否显示
                content: this.metadata
            });
        }
        
    }
}

PasswordInput.PropTypes = {
    isShow: PropTypes.bool.isRequired,
    lengths: PropTypes.number.isRequired,
    onCompleted: PropTypes.func.isRequired,
}

export default PasswordInput