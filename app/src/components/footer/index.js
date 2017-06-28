/**
 * @component Header.js
 * @description 通用的UI header组件
 * @time 2017-03-30 12:50
 * @author fishYu
 **/
import React, { PropTypes } from 'react';
import "./index.scss";

class Footer extends React.Component {

    render() {
        let { tabIndex, onTabClick, icons } = this.props
        return (
            <footer className="app-footer">
                {icons.map((item, index) => {
                    let icon = item.icon;
                    let textClass = icon ? '' : 'footer-no-icon-class';
                    let itemSelected = tabIndex == index ? 'footer-item-selected' : ''
                    return (
                        <div className={"app-footer-item btn-active " + itemSelected} key={index}
                            onTouchTap={(e) => onTabClick(e, index)}>
                            <span className={textClass}>{item.text}</span>
                            {icon ? <img src={icon} /> : null}
                        </div>
                    );
                })}
            </footer>
        )
    }
}

Footer.PropTypes = {
    tabIndex: PropTypes.number.isRequired,
    onTabClick: PropTypes.func.isRequired,
    icons: PropTypes.array.isRequired
}

export default Footer;