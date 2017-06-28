/**
 * @component IsLoading.js
 * @description 通用的UI 正则加载组件组件
 * @time 2017-04-01 10:50
 * @author fishYu
 **/

import React from 'react';
import './index.scss';

class IsLoading extends React.Component{

    render(){
        return (
            <div className="loading">
                <div className="loading-box">
                    <div className="loading-boll"></div>
                    <span>正在加载中...</span>
                </div>
            </div>
        )
    }
}
export default IsLoading;