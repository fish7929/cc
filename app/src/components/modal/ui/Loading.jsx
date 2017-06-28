/**
 * @component IsLoading.js
 * @description 通用的UI 正则加载组件组件
 * @time 2017-04-01 10:50
 * @author fishYu
 **/

import React from 'react';

class Loading extends React.Component {
    /**
     *构造函数
     */
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="app-modal">
                <button className="btn-loading xy-center">
                    <span className="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> Loading...
                </button>
            </div>
        )
    }
}

export default Loading;