/**
 * @component PullToRefresh.jsx
 * @description 下拉刷新的通用组件。
 * @time 2017-04-05 14:00
 * @author fishYu
 **/
'use strict';
//require core module
import React from "react";
//require submodule
import Ptr from './ptr';
//require style
import "./index.scss";

class PullToRefresh extends React.Component {
    componentWillMount(){
        this.pullToRefresh = new Ptr();
    }
    componentDidMount(){
        let props = this.props,
            {container, ptrEl, ptrContent} = this.refs;
        this.pullToRefresh.init({
            el: container,
            ptrEl: ptrEl,
            contentEl: ptrContent,
            loadUp: props.loadUp,
            loadDown: props.loadDown
        });
    }

    render(){
        let {className, children, style,
             disabled}= this.props;
        // console.log(this.pullToRefresh);
        // let events = disabled ? emptyEvents : this.pullToRefresh.events;
        //<Hammer  vertical={true} {...events}>
        return (
                <div ref="container" className={className} style={style}>
                    <div className="ptr-anim" ref='ptrEl'>
                        <span className="genericon genericon-next"/>
                        <div className='p-loading'>
                            <div className='spinner__item1'></div>
                            <div className='spinner__item2'></div>
                            <div className='spinner__item3'></div>
                            <div className='spinner__item4'></div>
                        </div>
                    </div>
                    <div className='ptr-content' ref='ptrContent'>
                        {children}
                    </div>
                </div>
        );
    }

    componentWillUnmount(){
        this.pullToRefresh.destroy();
    }
}

export default PullToRefresh