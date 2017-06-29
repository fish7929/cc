/**
 * @component NoRecord.js
 * @description 通用的UI 没有记录组件
 * @time 2017-04-01 10:50
 * @author fishYu
 **/

import React, { PropTypes } from 'react';
import "./index.scss";
class NoMore extends React.Component{

    render(){
        return (
            <div className="no-more">{this.props.hint}</div>
        );
    }
}

NoMore.PropTypes = {
    hint : PropTypes.string
}

NoMore.defaultProps = {
    hint : '没有更多'
}

export default NoMore;