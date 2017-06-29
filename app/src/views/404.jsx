/**
 * @component NoFoundPage.jsx
 * @description 打烊页面
 * @time 2017-03-16 17:00
 * @author fishYu
 **/

'use strict';

// require core module
import React from 'react';

//require submodule
import Page from '../components/page';
// import Header from '../components/ui/Header';

class NoFoundPage extends React.Component {
    /**
     *构造函数
     */
    constructor(props) {
        super(props);
    }
    /**
     * 返回按钮点击处理事件
     * @param {事件} e 
     */
    backHandler(e){
        e.preventDefault();
        e.stopPropagation();
        //返回处理逻辑
        console.log('back');
    }
    /**
     * 渲染界面
     */
    render() {
        return (
            <Page id="not-found-page" >
                {/*<Header title="系统维护" onBackClick={ (e) => this.backHandler(e)}/>*/}
                <div className='page-content-container not-found-container' >侠哥被劫持了，明日回来</div>
            </Page>
        );
    }
}

export default NoFoundPage;
