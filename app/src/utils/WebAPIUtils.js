/**
 * @component WebAPIUtils
 * @description 所有与后台交互的接口
 * @time 2017-06-21 11:50
 * @author fishYu
 **/

'use strict';
var Config = require("../config");
import fetch from 'isomorphic-fetch';
const DomainPath = process.env.DOMAIN_PATH;
var WebAPIUtils = {
    /**
     * 获取pathquery形式
     * @param obj json对象
     * @param type  筛选的类型
     */
    toExcString: function (obj, type = { ":": "=", ",": "&" }) {
        let result = "";
        for (let temp in obj) {
            result += temp + '=' + obj[temp] + "&"
        }
        return result.substring(-1, result.length - 1);
    },
    /**
     * 获取和提交RESTful数据接口
     * @param url 接口地址
     * @param param  传输数据 如果contentType = "application/json"，data可以用Object或json string,其他类型data只能为string
     * @param type  取数据type = "GET"，提交数据type = "POST"
     * @param headers 头部额外配置
     * @param dataType 成功返回数据的格式dataType= "json"或dataType= "text"等ajax支持的格式
     */
    fetchUtils: function (url, param, type = "GET", headers = {}, dataType = "json") {
        //TODO  只是JSON 对象的时候
        let _url = DomainPath == 'devDomain' ? "./mock" + url + ".json" : url;
        if (type.toLocaleUpperCase() === "GET" && Base.isJsonObject(param) && Base.size(param) > 0) {
            url += "?" + WebAPIUtils.toExcString(param)
        }

        headers = Object.assign({}, {
            'Accept': '*/*',
            'Content-Type': 'application/json',
            "Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS"
        })
        //TODO 可能需要在前面增加域名  Config.api
        return fetch(_url, {
            method: type.toLocaleUpperCase(),
            headers: headers,
            credentials: 'same-origin',
            body: type.toLocaleUpperCase() === "GET" ? undefined : (dataType == "json" ? JSON.stringify(param) : param)
        })
            .then((res) => dataType == "json" ? res.json() : res.text())
            .then((data) => data)
            .catch((error) => error)
    },
    /**
     * 获取和提交RESTful数据接口
     * @param url 接口地址
     * @param param  传输数据 如果contentType = "application/json"，data可以用Object或json string,其他类型data只能为string
     * @param type  取数据type = "GET"，提交数据type = "POST"
     * @param headers 头部额外配置
     * @param dataType 成功返回数据的格式dataType= "json"或dataType= "text"等ajax支持的格式
     */
    fetchRemoteData: function (url, param, type, headers, dataType) {
        return (dispatch, getState) => {
            //TODO  只是JSON 对象的时候
            let _url = DomainPath == 'devDomain' ? "./mock" + url + ".json" : url;
            if (type.toLocaleUpperCase() === "GET" && Base.isJsonObject(param) && Base.size(param) > 0) {
                url += "?" + WebAPIUtils.toExcString(param)
            }

            headers = Object.assign({}, {
                'Accept': '*/*',
                'Content-Type': 'application/json',
                "Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS"
            })
            //TODO 可能需要在前面增加域名  Config.api
            return fetch(_url, {
                method: type.toLocaleUpperCase(),
                headers: headers,
                credentials: 'same-origin',
                body: type.toLocaleUpperCase() === "GET" ? undefined : (dataType == "json" ? JSON.stringify(param) : param)
            })
                .then((res) => dataType == "json" ? res.json() : res.text())
                .then((data) => data)
                .catch((error) => error)
        }
    },
    /**
     * 获取和提交RESTful数据接口
     * @param url 接口地址
     * @param param  传输数据 如果contentType = "application/json"，data可以用Object或json string,其他类型data只能为string
     * @param type  取数据type = "GET"，提交数据type = "POST"
     * @param headers 头部额外配置
     * @param dataType 成功返回数据的格式dataType= "json"或dataType= "text"等ajax支持的格式
     */
    sendRequest: function (url, param, type = "GET", headers = {}, dataType = "json") {

        return (dispatch, getState) => {
            return new Promise(function (resolve, reject) {
                dispatch(WebAPIUtils.fetchRemoteData(url, param, type, headers, dataType))
                    .then(result => {
                        if (result.status === 0) {
                            resolve && resolve(result.data);
                        } else {
                            //查询失败的时候返回错误
                            reject && reject(result.data);
                        }
                    })
                    .catch((error) => {
                        reject && reject(error);
                    })
            })
        };
    }

}

module.exports = WebAPIUtils;