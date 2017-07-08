/** 
 * @component GlobalVar.js
 * @description 定义一些全局的属性，或者对象，不需要全局导入
 * @time 2017-6-21 10:30
 * @author fishYu
 */

'use strict';
import Base from "./Base";
import LCApi from "./LCApi";
import APIPath from "../config/APIPath";
import RoutPath from "../config/RoutPath";
import navigate from '../router/navigate';
import ErrorMessage from "../constants/ErrorMessage";
import DialogConstants from "../constants/DialogConstants";
import WebAPIUtils from "./WebAPIUtils";
import AppModal from "../components/modal";
// import CSSAnimate from "./CSSAnimate";
// import device from "../lib/device";
// import HammerJS from "../lib/hammer.2.0.4";

//定义全局属性
Object.defineProperties((window || global), {
    Base: {
        get() {
            return Base;
        }
    },
    LCApi: {
        get() {
            return LCApi;
        }
    },
    APIPath: {
        get() {
            return APIPath;
        }
    },
    RoutPath: {
        get() {
            return RoutPath;
        }
    },
    ErrorMessage: {
        get() {
            return ErrorMessage;
        }
    },
    DialogConstants: {
        get() {
            return DialogConstants;
        }
    },
    WebAPIUtils: {
        get() {
            return WebAPIUtils;
        }
    },
    navigate: {
        get() {
            return navigate
        }
    },
    AppModal: {
        get() {
            return AppModal;
        }
    }
    // CSSAnimate: {
    //     get(){
    //         return CSSAnimate;
    //     }
    // },
    // ,
    // HammerJS: {
    //     get(){
    //         return HammerJS
    //     }
    // }

});

// window.iDevice = device;