var AV = require('leanengine');
var requestClient = require('request');

/**
 * 一个简单的云代码方法
 */
AV.Cloud.define('hello', function(request) {
  return 'Hello world!';
});

AV.Cloud.define('test', function(request,response) {
  response.success('Hello world! test');
});

/** 微信网站授权登录接口
 参考帖子：http://blog.sina.com.cn/s/blog_69f316910102va1t.html
 微信二维码地址：   window.open("https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf82fb57ce47d0df6&redirect_uri=http%3a%2f%2fwww.6itec.com%2fshare%2fdemo%2fdemo.html&response_type=code&scope=snsapi_login&state="+new Date().getTime()+"#wechat_redirect", "_self");
 code,客户端授权成功后返回的code          
**/
AV.Cloud.define("wxLogin", function (request, response) {
    var code = request.params.code; 

    //根据域名进行分配不同开发者应用id,key
    var appid = "wxf82fb57ce47d0df6";
    var appkey = "5cb09a5d891191e6ad181d5c8e62223d";

    var token_url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + appid + "&secret=" + appkey + "&code=" + code + "&grant_type=authorization_code";
    var userinfo_url = "https://api.weixin.qq.com/sns/userinfo";
  
    var cb_err = function (error) {
        response.error(error);
        return;
    }

    if (!code) {
        cb_err("code is null");
    } 

    requestClient(token_url, function (error, res, body) {
      if (!error && res.statusCode == 200) {
        try { 
                var wxdata = JSON.parse(body);
                var access_token = wxdata.access_token;
                var openid = wxdata.openid;
                if (openid ||access_token) {
                    try { 
                      requestClient(userinfo_url + '?access_token=' + access_token + '&openid=' + openid, function (error2, res2, body2) {
                           if (!error2 && res2.statusCode == 200) {
                                var wxdata2 = JSON.parse(body2);
                                 response.success(wxdata2);
                           }else{ 
                                console.log("request wx user exception：" + error2.message);
                                cb_err("request wx user exception：" + error2.message);
                           }
                      });  
                    } catch (e) {
                        console.log("request wx user exception：" + e.message);
                        cb_err("request wx user exception：" + e.message);
                    }
                } else {
                    cb_err("openid or access_token excesption");
                }
            } catch (e) {
                console.log("request wx access_token exception：" + e.message);
                cb_err("request wx access_token exception：" + e.message);
            } 
      }else{
              console.log("微信登录失败！"+error.message);
              cb_err("微信登录失败！"+error.message);
      }
    });
});

/**修改用户信息pc端个人中心在用
  userid,用户id
  column_name，字段名字
  column_val，字段值
**/
AV.Cloud.define("updateUserInfo", function (request, response) {
    var user_id = request.params.user_id;
    var column_name = request.params.column_name;
    var column_val = request.params.column_val;

    var query = new AV.Query("_User");
    query.equalTo("objectId", user_id);
    query.first({
        success: function (results) {
            if (results) {
                if(column_val==""){
                  results.increment('msg_count', 1);//累计加一
                } else{
                  results.set(column_name, column_val);
                }
                results.save(null, {
                    success: function (msg) {
                        response.success(msg);
                    }
                });
            } else {
                response.error("查无对象!");
            }
        },
        error: function (error) {
            response.error(err.message);
        }
    })
});


/** 微信分享接口 
    1.获取token
    2.获取ticket签名
    url参数为前端访问的url
**/
AV.Cloud.define("wxShare", function (request, response) {
 
    var _url = request.params.url;// "http://www.agoodme.com/wx/wx.html";//request.params.url;

    console.log("_url>>>>", _url);
    var cb_err = function (error) {
        console.log("wxshare error>>>:", JSON.stringify(error));
        response.error(error);
        return;
    }

    var appid = "wxbc5448ffcd7d3933";
    var appkey = "986ff934a2f21dce3c0b265534d30749";

    if (!_url) {
        cb_err("url parame is null");
    }

    var url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + appid + "&secret=" + appkey;
    var ticket_url = "https://api.weixin.qq.com/cgi-bin/ticket/getticket";

    var createNonceStr = function () {
        return Math.random().toString(36).substr(2, 15);
    };

    var createTimeStamp = function () {
        return parseInt(new Date().getTime() / 1000) + '';
    };

    var oriArray = new Array();

    // 计算签名方法
    var calcSignature = function (ticket, noncestr, ts, url) {
        oriArray = ["jsapi_ticket=" + ticket, "noncestr=" + noncestr, "timestamp=" + ts, "url=" + url]
        oriArray.sort(); //sort默认是按ascii排序
        var str = oriArray[0] + "&" + oriArray[1] + "&" + oriArray[2] + "&" + oriArray[3];
        //var str = 'jsapi_ticket=' + ticket + '&noncestr=' + noncestr + '&timestamp=' + ts + '&url=' + url;
        console.log(">>>string1:" + str);
        try {
            var sha = sha1(str);//sha1加密
            console.log("sha1:", sha1(str));
            return sha1(str);
        } catch (e) {
            cb_err("jsSHA error:" + e.message);
        }
    }
    var index = 0;
    var httpGetSignature = function () {
      requestClient(url, function (error, res, body) { 
        if (!error && res.statusCode == 200) {
                var wxdata = JSON.parse(body.text);
                var access_token = wxdata.access_token;
                try {
                    if (wxdata.access_token) {
                        try {
                            requestClient(ticket_url + '?access_token=' + access_token + '&type=jsapi',function (error2, res2, callData) { 
                                    if (!error && res.statusCode == 200) { 
                                    index++; 
                                    console.log(">>>>ticket:", JSON.stringify(callData));
                                    //生成签名方法 
                                    var signature = calcSignature(JSON.parse(callData.text).ticket, createNonceStr(), createTimeStamp(), _url);
                                    console.log("signature>>>" + signature);

                                    console.log(">>>" + index + ">>>token:" + access_token + "|ticket:" + JSON.parse(callData.text).ticket + "|signature:" + signature);

                                    var call_data = {
                                        "data": {
                                            "appid": appid,
                                            "timestamp": createTimeStamp(),
                                            "noncestr": createNonceStr(),
                                            "signature": signature,
                                            "url": _url
                                        }
                                    }
                                    //signature有效期为7200秒,所以为减轻服务器压力和超过1万次请求限制进行缓存,
                                    cachedSignatures[_url] = {
                                        "appid": appid,
                                        "timestamp": createTimeStamp(),
                                        "noncestr": createNonceStr(),
                                        "signature": signature,
                                        "url": _url
                                    }
                                    //做缓存
                                    response.success(call_data);
                                  }else{
                                  cb_err("request wxshare user exception：" + error2.message);
                                }
                            });
                        } catch (e) {
                            console.log("request wxshare user exception：" + e.message);
                            cb_err("request wxshare user exception：" + e.message);
                        }
                    } else {
                        cb_err("access_token or access_token excesption");
                    }

                } catch (e) {
                    console.log("request wxshare access_token exception：" + e.message);
                    cb_err("request wxshare access_token exception：" + e.message);
                }
        }else{
           cb_err("request wxshare access_token exception：" + error.message);
        }
      });
    }
    
    httpGetSignature();
    
    //做缓存
    //var signatureObj = cachedSignatures[_url];
    //if (signatureObj && signatureObj.timestamp) {//缓存升级为以缓存access_token和ticket为主
    //    console.log("signatrue from catch>>>", JSON.stringify(cachedSignatures[_url]));

    //    var t = createTimeStamp() - signatureObj.timestamp;
    //    // 未过期，并且访问的是同一个地址,判断地址是因为微信分享出去后会额外添加一些参数，地址就变了不符合签名规则，需重新生成签名
    //    if (t < expireTime && signatureObj.url == _url) {//
    //        var call_data = { "data": signatureObj }
    //        response.success(call_data);
    //    } else {
    //        httpGetSignature();
    //    }
    //} else {
    //    httpGetSignature();
    //}

});

