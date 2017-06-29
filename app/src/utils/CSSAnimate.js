/**
 * @component CSSAnimate.js
 * @description 通用的图层动画组件。
 * @time 2017-04-10 10:15
 * @author fishYu
 **/
let animate = ($el, param, done) => {
    let className = param.animateClass;
    let duration = param.duration || 350;

    let ended = false;
    let animationEnd = function () {
        if(ended){
            return;
        }
        ended = true;
        $el.css({
            'WebkitAnimationDuration': 0,
            'animationDuration': 0
        });
        $el.removeClass("slideOutToBottom");
        $el.off("webkitAnimationEnd", animationEnd);
        $el.off("animationEnd", animationEnd);

        done && done();
    };

    $el.on("webkitAnimationEnd animationEnd", animationEnd);
    setTimeout(function () {
        animationEnd();
    }, duration);

    $el.css({
        'WebkitAnimationDuration': duration + "ms",
        'animationDuration': duration + "ms"
    });
    $el.addClass("ui-opacity0");
    setTimeout(function () {
        $el.removeClass("ui-opacity0");
    },0);
    $el.addClass(className);
};

let CSSAnimate = {
    sideInFromBottom($el, param, done){
        if(Base.isFunction(param)){
            done = param;
            param = {}
        }

        param = param || {};

        param.animateClass = "slideInFromBottom";
        animate($el, param, done);
    },

    slideOutToBottom($el, param, done){
        if(Base.isFunction(param)){
            done = param;
            param = {}
        }

        param = param || {};

        param.animateClass = "slideOutToBottom";
        animate($el, param, done);
    }
};

export default CSSAnimate