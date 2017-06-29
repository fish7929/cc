/**
 * @component PickerAddress.jsx
 * @description 地址选择通用组件。
 * @time 2017-03-27 15:40
 * @author fishYu
 **/

'use strict';

// require core module
import React from 'react';
import Popup from './popup';
import Picker from './picker';
//require submodule
//require style
import "./index.scss";
const propTypes = {
    defaultValue: React.PropTypes.array.isRequired,
    onConfirm: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func.isRequired,
    onChange: React.PropTypes.func.isRequired,
    visible: React.PropTypes.bool.isRequired,
    display: React.PropTypes.string.isRequired,
    contentData: React.PropTypes.array.isRequired,
}
class AddressPicker extends React.Component {
    /**
     *构造函数
     */
    constructor(props) {
        super(props);
        this.address = [];
        this.len = this.props.defaultValue.length;
        //六级  地区对应： 省 市  区  县 乡 街， 人员信息 对于  F6  F5 F4 F3 F2 F1 
        if(this.len >= 1){  //省 F6
            this._provins = this.props.contentData[0]; 
        }
        if(this.len >= 2){  //市 F5
            this._citys = this.props.contentData[1] ;
        }
        if(this.len >= 3){ //区 F4
            this._areas = this.props.contentData[2];
        }
        if(this.len >= 4){ //县 F3
             this._counties = this.props.contentData[3];
        }
        if(this.len >= 5){ //乡 F2
             this._township = this.props.contentData[4];
        }
        if(this.len >= 6){ //街 F1
             this._street = this.props.contentData[5];
        }
        {/*TODO 后期需要修改字段名称，根据type来确定数据关联的字段*/}
        this.associatedKey = this.props.display;//联动对应的key
    }
    /**
     * 初始化值
     */
    initDefaultData () {
        //最高四级， 省-市-区-县
        this.data = {
            provins: {
                list: this._provins,
                defaultValue: this.props.defaultValue[0],
                displayValue (name) {
                    return name;
                }
            }
        }
        if (this.len >= 2) {
            this.data.citys = {
                list: this._citys[this.props.defaultValue[0][this.associatedKey]],
                defaultValue: this.props.defaultValue[1],
                displayValue (name) {
                    return name;
                }
            }
        }
        if(this.len >= 3) {
            this.data.areas = {
                list: this._areas[this.props.defaultValue[1][this.associatedKey]],  //areas[this.props.defaultValue[1]]
                defaultValue: this.props.defaultValue[2],
                displayValue (name) {
                    return name;
                }
            }
        }
        if(this.len >= 4) {
            this.data.counties = {
                list: this._counties[this.props.defaultValue[2][this.associatedKey]],  //areas[this.props.defaultValue[1]]
                defaultValue: this.props.defaultValue[3],
                displayValue (name) {
                    return name;
                }
            }
        } 

        if(this.len >= 5) {
            this.data.township = {
                list: this._township[this.props.defaultValue[3][this.associatedKey]],  //areas[this.props.defaultValue[1]]
                defaultValue: this.props.defaultValue[4],
                displayValue (name) {
                    return name;
                }
            }
        } 

        if(this.len >= 6) {
            this.data.street = {
                list: this._street[this.props.defaultValue[4][this.associatedKey]],  //areas[this.props.defaultValue[1]]
                defaultValue: this.props.defaultValue[5],
                displayValue (name) {
                    return name;
                }
            }
        } 
    }
    /**
     * 选择省份的时候，执行函数
     * @param {省份的信息对象 object} provin 
     */
    handleChangeProvin (provin) {
        this.data.provins = {
            list: this._provins,
            defaultValue: provin,
        };
        this.address = [];
        this.address.push(provin);
        if (this.len >= 2) {
            this.data.citys = {
                list: this._citys[provin[this.associatedKey]],
                defaultValue: this._citys[provin[this.associatedKey]][0],
            };
            this.address.push(this._citys[provin[this.associatedKey]][0]);
        }
        if(this.len >= 3) {
            this.data.areas = {
                list: this._areas[this._citys[provin[this.associatedKey]][0][this.associatedKey]],
                defaultValue: this._areas[this._citys[provin[this.associatedKey]][0][this.associatedKey]][0],
            };
            this.address.push(this._areas[this._citys[provin[this.associatedKey]][0][this.associatedKey]][0]);
        }
        if(this.len >= 4) {
            this.data.counties = {
                list: this._counties[this._areas[this._citys[provin[this.associatedKey]][0][this.associatedKey]][0][this.associatedKey]],
                defaultValue: this._counties[this._areas[this._citys[provin[this.associatedKey]][0][this.associatedKey]][0][this.associatedKey]][0],
            };
            this.address.push(this._counties[this._areas[this._citys[provin[this.associatedKey]][0][this.associatedKey]][0][this.associatedKey]][0]);
        }

        if(this.len >= 5) {
            this.data.township = {
                list: this._township[this._counties[this._areas[this._citys[provin[this.associatedKey]][0][this.associatedKey]][0][this.associatedKey]][0][this.associatedKey]],
                defaultValue: this._township[this._counties[this._areas[this._citys[provin[this.associatedKey]][0][this.associatedKey]][0][this.associatedKey]][0][this.associatedKey]][0],
            };
            this.address.push(this._township[this._counties[this._areas[this._citys[provin[this.associatedKey]][0][this.associatedKey]][0][this.associatedKey]][0][this.associatedKey]][0]);
        }

        if(this.len >= 6) {
            this.data.street = {
                list: this._street[this._township[this._counties[this._areas[this._citys[provin[this.associatedKey]][0][this.associatedKey]][0][this.associatedKey]][0][this.associatedKey]][0][this.associatedKey]],
                defaultValue: this._street[this._township[this._counties[this._areas[this._citys[provin[this.associatedKey]][0][this.associatedKey]][0][this.associatedKey]][0][this.associatedKey]][0][this.associatedKey]][0],
            };
            this.address.push(this._street[this._township[this._counties[this._areas[this._citys[provin[this.associatedKey]][0][this.associatedKey]][0][this.associatedKey]][0][this.associatedKey]][0][this.associatedKey]][0]);
        }
        this.props.onChange(this.address);
    }
    /**
     * 选择城市的时候，执行函数
     * @param {城市的信息对象 object} city 
     */
    handleChangeCity(city) {
        this.address[1] = city;
        if(this.len >= 3) {
            this.address[2] = this._areas[city[this.associatedKey]][0];
            this.data.areas = {
                list: this._areas[city[this.associatedKey]],
                defaultValue: this._areas[city[this.associatedKey]][0],
            };
        }
        if(this.len >= 4) {
            this.address[3] = this._counties[this._areas[city[this.associatedKey]][0][this.associatedKey]][0];
            this.data.counties = {
                list: this._counties[this._areas[city[this.associatedKey]][0][this.associatedKey]],
                defaultValue: this._counties[this._areas[city[this.associatedKey]][0][this.associatedKey]][0],
            };
        }

        if(this.len >= 5) {
            this.address[4] = this._township[this._counties[this._areas[city[this.associatedKey]][0][this.associatedKey]][0][this.associatedKey]][0];
            this.data.township = {
                list: this._township[this._counties[this._areas[city[this.associatedKey]][0][this.associatedKey]][0][this.associatedKey]],
                defaultValue: this._township[this._counties[this._areas[city[this.associatedKey]][0][this.associatedKey]][0][this.associatedKey]][0],
            };
        }

        if(this.len >= 6) {
            this.address[5] = this._street[this._township[this._counties[this._areas[city[this.associatedKey]][0][this.associatedKey]][0][this.associatedKey]][0][this.associatedKey]][0];
            this.data.street = {
                list: this._street[this._township[this._counties[this._areas[city[this.associatedKey]][0][this.associatedKey]][0][this.associatedKey]][0][this.associatedKey]],
                defaultValue: this._street[this._township[this._counties[this._areas[city[this.associatedKey]][0][this.associatedKey]][0][this.associatedKey]][0][this.associatedKey]][0],
            };
        }
        this.props.onChange(this.address);
    }
    /**
     * 选择区域的时候，执行函数
     * @param {区域的信息对象 object} area 
     */
    handleChangeArea(area) {
        this.address[2] = area;
        if(this.len >= 4) {
            this.address[3] = this._counties[area[this.associatedKey]][0];
            this.data.counties = {
                list: this._counties[area[this.associatedKey]],
                defaultValue: this._counties[area[this.associatedKey]][0],
            };
        }

        if(this.len >= 5) {
            this.address[4] = this._township[this._counties[area[this.associatedKey]][0][this.associatedKey]][0];
            this.data.township = {
                list: this._township[this._counties[area[this.associatedKey]][0][this.associatedKey]],
                defaultValue: this._township[this._counties[area[this.associatedKey]][0][this.associatedKey]][0],
            };
        }

        if(this.len >= 6) {
            this.address[5] = this._street[this._township[this._counties[area[this.associatedKey]][0][this.associatedKey]][0][this.associatedKey]][0];
            this.data.street = {
                list: this._street[this._township[this._counties[area[this.associatedKey]][0][this.associatedKey]][0][this.associatedKey]],
                defaultValue: this._street[this._township[this._counties[area[this.associatedKey]][0][this.associatedKey]][0][this.associatedKey]][0],
            };
        }
        this.props.onChange(this.address);
    }
    /**
     * 选择县的时候，执行函数
     * @param {县的信息对象 object} county 
     */
    handleChangeCounty(county) {
        this.address[3] = county;
        if(this.len >= 5) {
            this.address[4] = this._township[county[this.associatedKey]][0];
            this.data.township = {
                list: this._township[county[this.associatedKey]],
                defaultValue: this._township[county[this.associatedKey]][0],
            };
        }

        if(this.len >= 6) {
            this.address[5] = this._street[this._township[county[this.associatedKey]][0][this.associatedKey]][0];
            this.data.street = {
                list: this._street[this._township[county[this.associatedKey]][0][this.associatedKey]],
                defaultValue: this._street[this._township[county[this.associatedKey]][0][this.associatedKey]][0],
            };
        }
        this.props.onChange(this.address);
    }

    /**
     * 选择乡的时候，执行函数
     * @param {乡的信息对象 object} township 
     */
    handleChangeTownship(township) {
        this.address[4] = township;
        if(this.len >= 6) {
            this.address[5] = this._street[township[this.associatedKey]][0];
            this.data.street = {
                list: this._street[township[this.associatedKey]],
                defaultValue: this._street[township[this.associatedKey]][0],
            };
        }
        this.props.onChange(this.address);
    }

    /**
     * 选择街道的时候，执行函数
     * @param {街道的信息对象 object} street 
     */
    handleChangeStreet(street) {
        this.address[5] = street;
        this.props.onChange(this.address);
    }

    handleClose () {
        this.props.onConfirm(this.address)
    }

    handleCancel () {
        this.props.onCancel()
    }

    render () {
        this.initDefaultData();
        return (<div className="ui-picker-address">
            <Popup
                onConfirm={this.handleClose.bind(this)}
                onCancel={this.handleCancel.bind(this)}
                visible={this.props.visible}>
                <Picker
                    onChange={this.handleChangeProvin.bind(this)}
                    data={this.data.provins} 
                    display={this.props.display} 
                />
                {this.len >= 2 ? <Picker
                    onChange={this.handleChangeCity.bind(this)}
                    data={this.data.citys} 
                    display={this.props.display} 
                /> : null }
                {this.len >= 3 ?<Picker
                    onChange={this.handleChangeArea.bind(this)}
                    data={this.data.areas} 
                    display={this.props.display} 
                /> : null }
                {this.len >= 4 ?<Picker
                    onChange={this.handleChangeCounty.bind(this)}
                    data={this.data.counties}
                    display={this.props.display} 
                /> : null }
                {this.len >= 5 ?<Picker
                    onChange={this.handleChangeTownship.bind(this)}
                    data={this.data.township}
                    display={this.props.display} 
                /> : null }
                {this.len >= 6 ?<Picker
                    onChange={this.handleChangeStreet.bind(this)}
                    data={this.data.street}
                    display={this.props.display} 
                /> : null }
            </Popup>
        </div>);
    }
}
/**
 * 验证props
 */
AddressPicker.propTypes = propTypes;

export default AddressPicker;
