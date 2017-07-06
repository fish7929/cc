var lc_api = {};

var APP_ID = 'NWf9LqTFMyuK0RpycPsNSque-gzGzoHsz';
var APP_KEY = 'wqmHFKHKc8YoGi3PTIQ5zd8k';

AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});

//根据code 用leanengin nodejs 后台接口去获取微信用户
lc_api.getWXLogin = function (code, cb_ok, cb_err) {
  AV.Cloud.run('wxLogin', {
    code: code
  }).then(function (data) {
    cb_ok(data);
  }, function (error) {
    cb_err(error);
  });
}


/** 注册登录，成功-返回用户对象
             *  这个交互应该是 用户扫码进入页面 如果之前没登录注册先注册再登录，登录了再加二维码所有者为好友(二维码的产生是 用户在 生成上岗证的时候给二维码绑定用户的id作为链接识别标记)
             *  没登录得先登录，才能私信
             *  登录会有微信授权操作
             * **/
lc_api.getUserStatus = function (wxUser, cb_ok, cb_err) {

  var query = new AV.Query('User');
  query.equalTo('username', wxUser.unionid);
  query.find().then(function (results) {
    if (results.length > 0) {
      //用户存在则登陆绑定 第三方登录：用户登录默认密码为：www.6itec.com第三方登录（的MD5加密文:6fda947a37f30dd0）
      AV.User.logIn(wxUser.unionid, '6fda947a37f30dd0').then(function (loginedUser) {
        cb_ok(loginedUser);
      }, function (error) {
        cb_err(error.message);
      });
    } else {
      //用户不存在则注册
      var user = new AV.User();
      user.set("username", wxUser.unionid);
      user.set("password", '6fda947a37f30dd0');
      user.set('user_nick', wxUser.nickname);
      user.set("user_pic", wxUser.headimgurl);
      user.set("sex", wxUser.sex);//1-男
      user.signUp().then(function (loginedUser) {
        AV.User.logIn(wxUser.unionid, '6fda947a37f30dd0').then(function (user) {
          cb_ok(user);
        }, function (error) {
          cb_err(error);
        });
      }, function (error) {
        cb_err(error);
      });
    }
  }, function (error) {
    cb_err(error);
  });
}

/** 好友操作接口
表-friend：
user_id string 用户id
friend pointer 好友对象

当用户扫码进来关注用户
 * 
 * 
 * **/
lc_api.followeeUser = function () {

}

//获取url的参数
lc_api.GetRequest = function () {
  var url = location.search; //获取url中"?"符后的字串
  var theRequest = {};
  if (url.indexOf("?") != -1) {  //从"?"开始获取字符串不等于-1
    var str = url.substr(1);    //获取"?"号从1的位置开始后面的字符串赋值给str
    strs = str.split("&");  //把获取到的字符串进行数组分割每一个"&"之后都成为一个数组赋值给strs
    for (var i = 0; i < strs.length; i++) {     //循环数组长度
      theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);    //解码字符串strs[i]从中分割“=”的第一个数组赋值给theRequest变量
    }
  }
  return theRequest;
}


//根据code获取用户对象
lc_api.userOauthLogin = function (code) {
  lc_api.getWXLogin(code, function (obj) {
    document.getElementById("contentDiv").innerHTML = "微信用户信息：" + JSON.stringify(data);
    lc_api.getUserStatus(data, function (user) {
      alert("注册完成并登录成功：" + AV.User.current().get("user_nick"));
    }, function (error) {
      alert(error.message);
    });
  }, function (error) {
    alert(error.message);
  });
}

//根据二维码注册登录进入系统，同时关注二维码用户
lc_api.userQrcodeLogin = function (user) {
  if(!user) return;

  //判断当前登录状态
  var current = AV.User.current();
  var userFriendLiset=[];

  var checkFriend=function(uid){
      
      for(var i=0;i<userFriendLiset;i++){
         if(uid==userFriendLiset[i].id){
             return true;
         }
      }
  }

  var query = new AV.Query('friend');
  query.equalTo('user_id', user);
  query.limit(1000);
  query.find().then(function (results) {//查找出二维码的所有好友
    userFriendLiset=results;

  }, function (error) {
     alert(error);
  });

  //判断当前登录状态
  var current = AV.User.current();
  if (current) {//1.已登录未关注，关注二维码用户，2.已登录已关注，进入系统页面

  } else {//1.未登录已关注，先登录再去系统页面，2.未登录未关注，先注册登录

  }

  lc_api.getUserStatus(data, function (user) {
    alert("注册完成并登录成功：" + AV.User.current().get("user_nick"));
  }, function (error) {
    alert(error.message);
  });

}

window.lc_api = lc_api;