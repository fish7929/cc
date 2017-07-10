/** 
 * @component index.js
 * @time CreateTime
 * @author zhao
 */

import React, { PropTypes } from 'react'
import './index.scss'

class ScrollList extends React.Component{
    constructor(props, context){
        super(props, context)
        this.state = {
            isLoading: false
        }
    }

    componentDidMount(){
        this.setState({isLoading: false})
    }

    componentWillReceiveProps(nextProp){
        if(nextProp.currentPage != this.props.currentPage){
            this.setState({isLoading: false})
        }
    }

    onScrollHandler(e){
        var scrollTop = e.target.scrollTop || 0;
        if(scrollTop + e.target.offsetHeight > e.target.scrollHeight - 50 && this.state.isLoading==false && this.props.currentPage < this.props.pageTotal){
            this.setState({isLoading: true})
            this.props.onScroll && this.props.onScroll(this.props.currentPage+1);
        }
    }

    render(){
        return(
            <div className={"scroll-list " + this.props.className} onScroll={(e)=>this.onScrollHandler(e)}>
                {this.props.children}
            </div>
        )
    }
}

ScrollList.PropTypes = {
    className: PropTypes.string,
    onScroll : PropTypes.func,
    currentPage: PropTypes.number.isRequired,
    pageTotal: PropTypes.number.isRequired,
}

export default ScrollList