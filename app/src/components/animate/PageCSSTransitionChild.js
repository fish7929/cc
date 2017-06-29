/**
 * @component PageCSSTransitionChild.js
 * @description 页的转场动画处理
 * @time 2017-03-30 12:50
 * @author fishYu
 **/
import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import CSSCore from '../../utils/CSSCore';
import supportTransition from './supportTransition'

let transitionInfo = {
    name: 'cover',
    reverseClass: false,
    enterTimeout: 350,
    leaveTimeout: 350
}

let divMask = document.createElement("div");
divMask.className = "ui-page-mask";

class PageCSSTransitionChild extends React.Component {

    constructor(props) {
        super(props);
    }

    transition(isEnter, done) {
        if (transitionInfo.name == null) {
            done();
            return;
        }

        let el = ReactDOM.findDOMNode(this);
        let reverseClass = transitionInfo.reverseClass,
            name = transitionInfo.name,
            time = isEnter ? transitionInfo.enterTimeout : transitionInfo.leaveTimeout;
        //-webkit-animation-duration: 350ms;animation-duration:350ms;
        if (isEnter) {
            CSSCore.addClass(el, 'initLeft_100');
            CSSCore.css(el, 'z-index', reverseClass ? '9' : '10');
            CSSCore.css(el, 'z-index', reverseClass ? '9' : '10');
            CSSCore.addClass(el, name + " in" + reverseClass).removeClass(el, 'hide').addClass(el, 'show');
        } else {
            CSSCore.css(el, "z-index", reverseClass ? "10" : "9").addClass(el, name + " out" + reverseClass);
        }

        CSSCore.css3(el, 'animationDuration', time + "ms");

        var timer = null;
        let ended = false;
        function animationEnd() {
            if (ended) {
                return;
            }
            // console.log("ended",isEnter);
            ended = true;
            if (timer) {
                window.clearTimeout(timer);
                timer = null;
            }
            el.removeEventListener('webkitAnimationEnd', animationEnd);
            el.className = "";
            if (isEnter) {
                CSSCore.addClass(el, "ui-view-transitioning lt-ui-page");
            } else {
                CSSCore.addClass(el, "ui-view-transitioning lt-ui-page hide");
            }
            done();
            // setTimeout(function(){
            if (divMask.parentNode) {
                divMask.parentNode.removeChild(divMask);
            }
            // },1);
        }

        timer = setTimeout(animationEnd, time);
        el.addEventListener('webkitAnimationEnd', animationEnd, false);
    }
    _fetchTransitionInfo() {
        let { transitionName } = this.props;
        let aniObj, locState = this.props.children.props.location.state,
            reverse = false;
        if (locState) {
            reverse = (locState.type === 'back');
            transitionName = (locState.transitionName ? locState.transitionName : transitionName);
        }
        if (!(aniObj = supportTransition[transitionName])) {
            transitionInfo.name = null;
            return;
        }
        let enterTimeout = aniObj.enterTimeout,
            leaveTimeout = aniObj.leaveTimeout;

        let reverseClass = reverse ? " reverse" : "";
        transitionInfo.name = transitionName;
        transitionInfo.reverseClass = reverseClass;
        transitionInfo.enterTimeout = enterTimeout;
        transitionInfo.leaveTimeout = leaveTimeout;
    }
    componentWillEnter(done) {
        this._fetchTransitionInfo();
        document.body.appendChild(divMask);
        this.transition(true, done);
    }
    componentWillLeave(done) {
        this.transition(false, done);
    }

    render() {
        // console.log("render");
        return React.Children.only(this.props.children);
    }
}
PageCSSTransitionChild.propTypes = {
    transitionName: PropTypes.string.isRequired,
};
export default PageCSSTransitionChild;