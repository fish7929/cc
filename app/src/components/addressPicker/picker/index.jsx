import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

const FIRST = 1;  //表示区域
const SECOND = 2; //表示人员

const getIndex = (list, item) => {
  if (list && list.length < 1) {
    return 0;
  }
  let index1 = _.findIndex(list, item);
  let index2 = list.indexOf(item);
  let index = Math.max(index1, index2);
  if (index < 0) {
    throw new Error('list数组中不存在defaultValue');
  }
  return index;
}

class Picker extends React.Component {
  constructor(props) {
    super();
    this.props = props;
    this.startY = 0;
    this.endY = 0;
    //当前拖动的Y坐标
    this.currentY = 0;
    this.itemHeight = 36;
    this.selectedIndex = this.getInitialIndex();
    this.state = { style: {} };
    this._defaultValue = null;
    this.start = false;
  }

  // 初始化获得selectedIndex
  getInitialIndex() {
    let index = getIndex(
      this.props.data.list,
      this.props.data.defaultValue
    );
    if (!this.props.data.defaultValue && this.props.data.list.length > 3) {
      index = Math.floor(this.props.data.list.length / 2);
    }
    return index;
  }

  componentWillReceiveProps(nextProps) {
    const isEqual = _.isEqual(
      nextProps.data.defaultValue,
      this._defaultValue
    );
    if (!isEqual) {
      this._defaultValue = nextProps.data.defaultValue;
      this.selectedIndex = this.getReceivePropsIndex(nextProps.data);
      if (this.selectedIndex === 0) {
        this.state = {
          style: {
            transform: `translate3d(0px, ${this.itemHeight * 2}px, 0px)`
          }
        }
      }
    }
  }

  getReceivePropsIndex(data) {
    if (this._defaultValue) {
      this.selectedIndex = getIndex(
        data.list,
        data.defaultValue
      );
    }
    return this.selectedIndex;
  }

  getInitialStyle() {
    this.currentY = 0;
    if (this.selectedIndex > 2) {
      this.currentY = - (this.selectedIndex - 2) * this.itemHeight;
    } else {
      this.currentY = (2 - this.selectedIndex) * this.itemHeight;
    }
    return `translate3d(0px, ${this.currentY}px, 0px)`;
  }

  handleTouchStart(e) {
    e.preventDefault();
    if (this.props.data.list.length <= 1) {
      return;
    }
    this.startY = e.nativeEvent.changedTouches ? e.nativeEvent.changedTouches[0].pageY : e.nativeEvent.pageY;
    this.start = true;
  }

  handleTouchEnd(e) {
    e.preventDefault();
    if (this.props.data.list.length <= 1) {
      return;
    }
    this.endY = e.nativeEvent.changedTouches ? e.nativeEvent.changedTouches[0].pageY : e.nativeEvent.pageY;
    // 实际滚动距离
    let v = parseInt(this.endY - this.startY);
    let value = v % this.itemHeight;
    // 计算出每次拖动的36px整倍数
    this.currentY += (v - value);

    // 正数y最大值
    const max1 = 2 * this.itemHeight;
    // 负数y最小值
    const max2 = (this.props.data.list.length - 3) * this.itemHeight;

    if (this.currentY > max1) {
      this.currentY = max1;
    }
    else if (this.currentY > 0 && this.currentY < max1) {
      this.currentY = this.currentY;
    }
    else if (this.currentY === max1) {
      this.currentY = this.currentY;
    }
    else if (Math.abs(this.currentY) > max2) {
      this.currentY = - max2;
    }
    this.countListIndex(this.currentY);

    this.setState({
      style: {
        transform: `translate3d(0px, ${this.currentY}px, 0px)`
      }
    });
    this.start = false;
  }

  handleTouchMove(e) {
    e.preventDefault();
    if (this.props.data.list.length <= 1) {
      return;
    }
    if(!this.start) return;
    const pageY = e.nativeEvent.changedTouches ? e.nativeEvent.changedTouches[0].pageY : e.nativeEvent.pageY;
    let value = parseInt(pageY - this.startY);
    const y = this.currentY + value;
    let style = `translate3d(0px, ${y}px, 0px)`;
    this.setState({
      style: {
        transform: style
      }
    });
    
  }

  // 计算list数组索引
  countListIndex(pageY) {
    let n = pageY / this.itemHeight;
    n = n > 0 ? 2 - n : Math.abs(n) + 2;
    this.setSelectedValue(n);
  }

  // set选中值
  setSelectedValue(index) {
    const length = this.props.data.list.length;
    if (length === 0) {
      this.callback(null);
      return;
    }
    if (index < 0 || index > length - 1) {
      throw new Error('滑动取值索引数值出现错误' + index);
    }
    const value = this.props.data.list[index];
    this.selectedIndex = index;
    this.callback(value)
  }

  // 回调
  callback(value) {
    this.props.onChange(value);
  }

  getSelectedClass(index) {
    if (this.selectedIndex === index) {
      return 'ui-picker-item-selected';
    }
    return '';
  }

  componentDidMount() {
    this.setSelectedValue(this.selectedIndex);
  }

  handleWrapperStart(e) {
    e.preventDefault();
  }
  isPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
      if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
    }
    return flag;
  }
  render() {
    const style = {
      transform: this.getInitialStyle()
    }
    return (
      <div className="ui-picker-wrapper" onTouchStart={this.handleWrapperStart.bind(this)}>
        { this.isPC() ? 
        <div className="ui-picker"
          style={this.state.style.transform ? this.state.style : style}
          onMouseDown={this.handleTouchStart.bind(this)}
          onMouseMove={this.handleTouchMove.bind(this)}
          onMouseUp={this.handleTouchEnd.bind(this)}>
          {
            this.props.data.list.map((data, index) => {
              {/*const displayValue = this.props.data.displayValue(data);*/ }
              {/*TODO 后期需要修改字段名称，根据type来确定显示的内容*/ }
              let displayValue = data[this.props.display];
              displayValue = this.props.data.displayValue(displayValue);
              return <div key={index}
                className={'ui-picker-item ' + this.getSelectedClass(index)}>
                {displayValue}
              </div>
            })
          }
        </div> :
        <div className="ui-picker"
          style={this.state.style.transform ? this.state.style : style}
          onTouchStart={this.handleTouchStart.bind(this)}
          onTouchMove={this.handleTouchMove.bind(this)}
          onTouchEnd={this.handleTouchEnd.bind(this)}>
          {
            this.props.data.list.map((data, index) => {
              {/*const displayValue = this.props.data.displayValue(data);*/ }
              {/*TODO 后期需要修改字段名称，根据type来确定显示的内容*/ }
              let displayValue = data[this.props.display];
              displayValue = this.props.data.displayValue(displayValue);
              return <div key={index}
                className={'ui-picker-item ' + this.getSelectedClass(index)}>
                {displayValue}
              </div>
            })
          }
        </div>
        }
        <div className="ui-picker-center"></div>
      </div>
    )
  }
}

Picker.propTypes = {
  // 数据源
  data: React.PropTypes.object.isRequired,
  // 当停止滑动选中立即回调onchange方法
  onChange: React.PropTypes.func.isRequired,
  display: React.PropTypes.string.isRequired,
};

export default Picker;
