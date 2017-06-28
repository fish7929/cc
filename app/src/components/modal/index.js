/** 
 * @component index.js
 * @description 全局的对话框
 * @time 2017-6-21 11:50
 * @author fishYu
 */

'use strict';

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
//导入的UI
import Loading from './ui/Loading';
import Toast from './ui/Toast';
import Dialog from './ui/Dialog';
import Countdown from './ui/Countdown';
import ActionSheet from './ui/ActionSheet';
import './index.scss';
class AppModal {
    static isShow = false;
    /**
     * 显示加载层
     */
    static loading() {
        let component = <Loading />;
        AppModal.modalRender(component);
    }
    /**
     * toast 弹框
     * @param {string} text 显示消息内容
     * @param {number} showTime 显示的时间 常量 TOAST_LONG_DURATION  TOAST_SHORT_DURATION
     * @param {string} position 显示的位置 常量 TOAST_POSITION_TOP TOAST_POSITION_CENTER  TOAST_POSITION_BOTTOM
     * @param {function} callBack 回调函数
     * @param {string} imgPath 图片路径
     */
    static toast(text, showTime = DialogConstants.TOAST_SHORT_DURATION,
        position = DialogConstants.TOAST_POSITION_CENTER,
        callBack = null, imgPath = '') {
        let component = <Toast text={text} showTime={showTime}
            position={position} callBack={callBack} imgPath={imgPath} />;
        AppModal.modalRender(component);
    }
    /**
     * alert 弹框
     * @param {string} text 显示消息内容
     * @param {string} title 显示的标题
     * @param {function} callBack 回调函数
     * @param {string} btnText 按钮文字
     */
    static alert(text, title = '', callBack = null, btnText = '知道了') {
        let buttons = [{
            callBack: callBack,
            text: btnText
        }];
        let component = <Dialog text={text} title={title} buttons={buttons} />;
        AppModal.modalRender(component);
    }
    /**
     * alert 确认对话框
     * @param {string} text 显示消息内容
     * @param {string} title 显示的标题
     * @param {function} sureFn 回调函数
     * @param {function} cancelFn 回调函数
     * @param {string} okBtn 确认按钮文字
     * @param {string} cancelBtn 取消按钮文字
     */
    static confirm(text, title = '温馨提示', sureFn = null, cancelFn = null, okBtn = '确认', cancelBtn = "取消") {
        let buttons = [{
            callBack: cancelFn,
            text: cancelBtn
        },
        {
            callBack: sureFn,
            text: okBtn
        }];
        let component = <Dialog text={text} title={title} buttons={buttons} />;
        AppModal.modalRender(component);
    }
    /**
     * toast 倒计时
     * @param {number} showTime 倒计时的时间 
     * @param {function} callBack 回调函数
     * @param {string} imgPath 图片路径
     * @param {string} position 显示的位置 常量 TOAST_POSITION_TOP TOAST_POSITION_CENTER  TOAST_POSITION_BOTTOM
     */
    static countdown(showTime, callBack, imgPath = '', position = DialogConstants.TOAST_POSITION_CENTER) {
        let component = <Countdown showTime={showTime} callBack={callBack}
            imgPath={imgPath} position={position} />;
        AppModal.modalRender(component);
    }

    /**
     * action sheet 动作表单
     * @param {array} sheets 表单提示数组
     * @param {function} action 表单点击回调函数
     */
    static actionSheet(sheets, action) {
        let component = <ActionSheet sheets={sheets} action={action}/>;
        AppModal.modalRender(component);
    }
    /**
     * 隐藏
     */
    static hide() {
        AppModal.isShow = false;
        unmountComponentAtNode(document.getElementById("app-modal"));
    }
    /**
     * 重置
     */
    static reset() {
        if (AppModal.isShow) {
            AppModal.hide();
        }
    }
    /**
     * 渲染组件
     * @param {object} component 需要渲染的组件 
     */
    static modalRender(component) {
        AppModal.reset();
        render(component, document.getElementById("app-modal"));
    }
}

export default AppModal;