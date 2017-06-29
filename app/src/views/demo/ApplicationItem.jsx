/**
 * @component ReportItem.jsx
 * @description 单条开卡记录信息的界面。
 * @time 2017-05-31 13:00
 * @author fishYu
 **/

'use strict';

// require core module
import React from 'react';
class ApplicationItem extends React.Component {
    /**
     *构造函数
     */
    constructor(props) {
        super(props);
    }
    /**
     * 渲染界面  <div>借款金额：{item.cash} 借款时间：{item.days}天</div>
     */
    render() {
        let { item } = this.props;
        var _obj = this.getUI();
        return (
            <li className="report-item">
                <div className='report-item-top'>
                    <div className='report-item-user-info application-no-header'>
                        <div>{item.idName} {_obj.category}<span className="application-role">{item.flevel + " " + item.fname}</span></div>
                        <div>{item.phone}</div>
                    </div>
                </div>
                <div className='report-item-content'>
                    <div className={'common-item ' + _obj.content[0]._class} data-hint={_obj.content[0].hint}>{_obj.content[0].text}</div>
                    <div className={'common-item ' + _obj.content[1]._class} data-hint={_obj.content[1].hint}>{_obj.content[1].text}</div>
                    <div className={'common-item ' + _obj.content[2]._class} data-hint={_obj.content[2].hint}>
                        {_obj.content[2].text}
                        {_obj.content[2].status}
                    </div>
                </div>
            </li>
        );
    }
    /**
     * 根据不同的类型，例如， 开卡 或者 首贷 复购获取不同的UI样式
     */
    getUI() {
        let item = this.props.item;
        let obj = {  //默认为开卡的样式
            category: null,
            content: []
        };
        let _status = item.statusDescription;
        let _channel = item.channel;
        let categoryClass = '';
        let category = '';
        if (_channel == 'merchant') {
            categoryClass = 'shopping-color';
            category = '商城';
        } else if (_channel == 'mobile') {
            categoryClass = 'recharge-color';
            category = '话费';
        } else if (_channel == 'cashloan') {
            categoryClass = 'CL-color';
            category = 'CL';
        } else if (_channel == 'pdl') {
            categoryClass = 'PDL-color';
            category = 'PDL';
        }
        obj.category = <span className={categoryClass}>{category}</span>;
        obj.content = [
            {
                _class: 'borrow-money-item',
                hint: '借款金额',
                text: item.amount
            },
            {
                _class: 'borrow-time-item',
                hint: '借款时间',
                text: item.period
            },
            {
                _class: 'report-time-item',
                hint: '申请时间',
                text: item.installmentStartedOn,
                status: (_status == '取消' || _status == '拒绝') ? <span className="application-status">{_status}</span>
                    : <span className='application-status status-no-error'>{_status}</span>
            }
        ];
        return obj;
    }
}

/**
 * 验证props
 */
ApplicationItem.propTypes = {
    item: React.PropTypes.object.isRequired
};
/**
 * 默认props
 */
ApplicationItem.defaultProps = {
    item: {}
};

export default ApplicationItem;
