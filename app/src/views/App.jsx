/**
 * created by zhao
 * 2017/3/14
 */

import React from 'react';
import PageCSSTransition from '../components/animate/PageCSSTransition';

class App extends React.Component {
    componentWillEnter(callback){
        console.log("onEnter");
    }

    componentWillMount(){
    }

    componentWillUpdate(){
    }
    componentDidMount() {
    }
    componentWillReceiveProps(nextProps) {
    }
    render(){
        return (
            <PageCSSTransition transitionName="cover">
                { React.cloneElement(this.props.children, { key: this.props.location.pathname }) }
            </PageCSSTransition>
        );
    }
}

export default App