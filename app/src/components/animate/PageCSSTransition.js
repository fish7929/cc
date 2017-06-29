/**
 * @component PageTransition.js
 * @description 页的转场动画
 * @time 2017-03-30 14:50
 * @author fishYu
 **/
import React, { PropTypes } from 'react';

import PageCSSTransitionChild from './PageCSSTransitionChild';
import ReactTransitionGroup from 'react/lib/ReactTransitionGroup';

class PageCSSTransition extends React.Component {
    constructor(props) {
        super(props);
        this._wrapChild = this._wrapChild.bind(this);
    }

    _wrapChild(child) {
        return (
            <PageCSSTransitionChild
                transitionName={this.props.transitionName}
                transitionEnterTimeout={this.props.transitionEnterTimeout}
                transitionLeaveTimeout={this.props.transitionLeaveTimeout}>
                {child}
            </PageCSSTransitionChild>
        );
    }

    render() {
        return (
            <ReactTransitionGroup {...this.props} childFactory={this._wrapChild} />
        );
    }
}
PageCSSTransition.propTypes = {
    transitionName: PropTypes.string.isRequired
};
export default PageCSSTransition;