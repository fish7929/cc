/**
 * @component NoRecord.js
 * @description 通用的UI 没有记录组件
 * @time 2017-04-01 10:50
 * @author fishYu
 **/

import React, { PropTypes } from 'react';
import './index.scss';
class NoRecord extends React.Component{

    render(){
        return (
            <div className="no-item">{this.props.hint}</div>
        );
    }
}

NoRecord.PropTypes = {
    hint : PropTypes.string
}

NoRecord.defaultProps = {
    hint : '没有任何记录'
}

export default NoRecord;