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
