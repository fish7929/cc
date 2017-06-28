/**
 * @component navigate.js
 * @description 路由的辅助跳转类
 * @time 2017-03-30 12:50
 * @author fishYu
 **/

let histories = [];

let navigate = {
    history: null,
    install(history) {
        this.history = history;
        history.listen(listenerFn);
    },

    /**
     * path 跳转url
     * obj  type:back(后退)|forward(前进，默认，不用带参数)
     *      transitionName:可以自己指定的页动画名  slide scaleBox cover fadeBox
     */
    push(path, obj = { type: 'forward', transitionName: 'cover' }) {
        this.history.push({ pathname: path, state: obj });
        return {
            type: 'NAVIGATE_PUSH',
            obj
        }
    },

    replace(path, obj = { type: 'forward', transitionName: 'cover' }) {
        if (path.indexOf(".html") > -1) { //客户端的路由
            location.href = path;
            return;
        } else {
            this.history.replace({ pathname: path, state: obj });
        }
        return {
            type: 'NAVIGATE_REPLACE',
            obj
        }
    },

    goBack() {
        if (histories.length > 1) {
            histories.pop();
            let location = histories.pop();
            if (location) {
                let type = 'back',
                    path = location.pathname;
                this.push(path, { type: type });
            }
        }else{  //最后一层的时候
            this.push(RoutPath.ROUTER_HOME, { type: 'back' });
        }

        return {
            type: 'NAVIGATE_GOBACK'
        }
    }
};

let listenerFn = (location) => {
    if (histories.length == 0 || location.pathname != histories[histories.length - 1].pathname) {
        histories.push(location);
    }
}

export default navigate;