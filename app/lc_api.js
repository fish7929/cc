var lc_api = {};

var APP_ID = 'NWf9LqTFMyuK0RpycPsNSque-gzGzoHsz';
var APP_KEY = 'wqmHFKHKc8YoGi3PTIQ5zd8k';

AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});

//根据code 用leanengin nodejs 后台接口去获取微信用户
lc_api.getWXLogin = function (code, cb_ok, cb_err) {
  //alert("getWXLogin");
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
        cb_ok(loginedUser, 2);  //有用户
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
          cb_ok(user, 1); //没用户
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

每次关注操作都是互相的写入表数据，所以是2次数据的保存
 * 
 * 
 * **/
lc_api.setFriend = function (user_id, current, cb_ok, cb_err) {
  if (user_id == current.id) {
    cb_ok("自己扫码自己登录");
    return;
  }
  var f = AV.Object.extend('friend');
  // 新建对象
  var obj = new f();
  obj.set('user_id', user_id);
  obj.set('friend', current);
  obj.set('friend_id', current.id);
  obj.save().then(function (todo) {
    //根据user_id查询该用户对象
    var query = new AV.Query('_User');
    query.equalTo('objectId', user_id);
    query.first().then(function (data) {
      if (data) {
        // 新建对象
        var obj2 = new f();
        obj2.set('user_id', current.id);
        obj2.set('friend', data);
        obj2.set('friend_id', data.id);
        obj2.save().then(function (todo) {
          cb_ok();
        }, function (error) {
          cb_err(error);
        });
      } else {
        cb_ok(data);
      }
    }, function (error) {
      cb_err(error);
    });
  }, function (error) {
    cb_err(error);
  });
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

/// add by fish yu 2017-7-9
/**
 * 用户登录
 * @param {string} code 微信code
 * @param {string} user_id 用户id
 * @param {function} cb_ok 成功回调 code 码 1  直接登录到首页， 2 登录到聊天页面
 * @param {function} cb_error 失败回调  code 码， 1 获取微信用户信息失败， 2 用户登录失败 3, 关注失败
 */
lc_api.login = function (code, user_id, cb_ok, cb_error) {
  lc_api.getWXLogin(code, function (wxUser) {
    lc_api.getUserStatus(wxUser, function (user, status) {  //status 1 表示 没用户， 2 表示有用户
      if (user_id) {  //哟用户id的情况。
        lc_api.addFriends(user_id, function () {
          if (status == 1) {  //新注册用户
            cb_ok && cb_ok(1);
          } else if (status == 2) {  //老用户
            cb_ok && cb_ok(2);
          }
        }, function (params) {
          cb_error && cb_error(3);
        });
      } else {
        cb_ok && cb_ok(1);
      }
    }, function (error) {
      //用户登录失败
      console.log(error.message);
      cb_error && cb_error(2);
    });
  }, function (error) {
    //获取微信用户信息失败。
    console.log(error.message);
    cb_error && cb_error(1);
  });
}

/**
 * 添加好友,肯定是登录成功之后才会去添加好友，所以默认都是登录的
 * @param {string} user_id 用户id
 * @param {function} cb_ok 成功回调 code 码 1  直接登录到首页， 2 登录到聊天页面
 * @param {function} cb_error 失败回调  code 码， 1 获取微信用户信息失败， 2 用户登录失败
 */
lc_api.addFriends = function (user_id, cb_ok, cb_error) {
  if (!user_id) {
    cb_error();
    return;
  }
  var userFriendList = [];
  var checkFriend = function (uid) {
    var b = false;
    for (var i = 0; i < userFriendList.length; i++) {
      if (uid == userFriendList[i].get("friend").id) {
        b = true;
        break;
      }
    }
    return b;
  }
  var current = AV.User.current();
  var query = new AV.Query('friend');
  query.equalTo('user_id', user_id);
  query.limit(1000);
  query.find().then(function (results) {//查找出二维码用户的所有好友 
    if (results.length > 0) {
      userFriendList = results;
      if (checkFriend(current.id) == true) {   //是好友的
        cb_ok && cb_ok()
      } else {  //不是好友的
        //进行关注
        lc_api.setFriend(user_id, current, function (obj) {
          cb_ok && cb_ok()
        }, function (error) {
          //关注失败错误信息
          console.log(error.message);
          cb_error && cb_error();
        });
      }
    } else {//如果二维码用户没有好友
      //进行关注
      lc_api.setFriend(user_id, current, function (obj) {
        cb_ok && cb_ok()
      }, function (error) {
        //关注失败错误信息
        console.log(error.message);
        cb_error && cb_error();
      });
    }
  }, function (error) {
    //查询用户好友失败
    console.log(error.message);
    cb_error && cb_error();
  });
}
lc_api.getUserById = function (user_id, cb_ok, cb_error) {
  var query = new AV.Query('_User');
  query.equalTo('objectId', user_id);
  query.first().then(function (data) {
    if (data) {
      cb_ok(data);
    } else {
      cb_ok(null);
    }
  }, function (error) {
    cb_err(error);
  });
}
/*************fishYu add  end*******************/


//根据code获取用户对象
lc_api.userOauthLogin = function (code, user_id, cb_ok) {
  //alert("userOauthLogin");
  lc_api.getWXLogin(code, function (data) {
    //alert(data);
    //document.getElementById("contentDiv").innerHTML = "微信用户信息：" + JSON.stringify(data);
    lc_api.getUserStatus(data, function (user) {//进行登录或注册
      if (user_id) {//存在user_id为扫码注册登录完成 
        //去关注
        lc_api.userQrcodeLogin(user_id, cb_ok);
      } else {
        ///alert("注册完成并登录成功：" + AV.User.current().get("user_nick"));
        cb_ok && cb_ok()
        // window.open("http://www.6itec.com/share/demo/demo.html", "_self");
      }
    }, function (error) {
      alert(error.message);
    });
  }, function (error) {
    alert(error.message);
  });
}

//根据二维码注册登录进入系统，同时加二维码用户为好友
lc_api.userQrcodeLogin = function (user_id, cb_ok) {
  if (!user_id) return;

  var userFriendList = [];

  var checkFriend = function (uid) {
    var b = false;
    for (var i = 0; i < userFriendList.length; i++) {
      if (uid == userFriendList[i].get("friend").id) {
        b = true;
        break;
      }
    }
    return b;
  }
  var current = AV.User.current();
  if (current) {//1.已登录未关注，关注二维码用户，2.已登录已关注，进入系统页面
    var query = new AV.Query('friend');
    query.equalTo('user_id', user_id);
    query.limit(1000);
    query.find().then(function (results) {//查找出二维码用户的所有好友 
      if (results.length > 0) {
        userFriendList = results;
        if (checkFriend(current.id) == true) {
          //去到系统页面
          alert("去系统页面");
          cb_ok && cb_ok()
        } else {
          //进行关注
          lc_api.setFriend(user_id, current, function (obj) {
            alert("去系统页面");
            cb_ok && cb_ok()
          }, function (error) {
            alert(error);
          });
        }
      } else {//如果二维码用户没有好友
        //进行关注
        lc_api.setFriend(user_id, current, function (obj) {
          alert("去系统页面");
          cb_ok && cb_ok()
        }, function (error) {
          alert(error);
        });
      }
    }, function (error) {
      alert(error);
    });
  } else {
    //注意,成功回调地址多了个user_id参数
    window.open("https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf82fb57ce47d0df6&redirect_uri=http%3a%2f%2fwww.6itec.com%2fshare%2fdemo%2flogincallback.html?user_id=" + user_id + "&response_type=code&scope=snsapi_login&state=" + new Date().getTime() + "#wechat_redirect", "_self");
  }
}

//////////////////////////////////////////// 以下为api部分 /////////////////////////////////////
/** 根据用户id查询用户好友
 *  user_id 用户id
 *  pageSize 第几页
 *  pageNumber,每页显示条数
 *  orderby 排序字段，默认createdAt
 *  isdesc 是否降序，true/false
 * **/
lc_api.getFriend = function (options, cb_ok, cb_err) {

  if (!AV.User.current()) {
    cb_err("请先登录!");
    return;
  }
  var orderby = options.orderby || "createdAt",
    isdesc = options.isdesc,
    pageSize = options.pageSize || 0,
    pageNumber = options.pageNumber || 6,
    user_id = options.user_id;

  var skip = 0;
  var limit = pageNumber;
  var skip = 0;
  var limit = pageNumber;
  if (pageSize != 0) {
    skip = pageSize * pageNumber;
  }
  var query = new AV.Query("friend");
  query.equalTo("user_id", user_id);
  query.include("friend");
  query.skip(skip);
  query.limit(limit);
  //排序
  if (orderby.length > 0) {
    if (isdesc) {
      query.descending(orderby);
    } else {
      query.ascending(orderby);
    }
  }
  query.find().then(function (results) {
    cb_ok(results);
  }, function (error) {
    cb_err(error);
  });
}
/** 根据用户id查询用户好友 总数
 *  user_id 用户id 
 * **/
lc_api.getCountFriend = function (options, cb_ok, cb_err) {

  var user_id = options.user_id || "";
  if (user_id.length == 0) {
    cb_err("请先登录!");
    return;
  }
  var query = new AV.Query("friend");
  query.equalTo("user_id", user_id);
  query.count().then(function (results) {
    cb_ok(results);
  }, function (error) {
    cb_err(error);
  });
}
/**修改好友之间单聊对话最后一条记录
 * uid,用户主 
 * friend_id ， 好友id
 * msg，最后一条聊天消息内容
 */
lc_api.updateFriendLastMsg = function (uid, friend_id, msg, cb_ok, cb_err) {
  var query = new AV.Query('friend');
  query.equalTo('user_id', uid);
  query.equalTo('friend_id', friend_id);
  query.first().then(function (data) {
    if (data) {
      data.set("last_msg", msg);
      data.save().then(function (todo) {
        cb_ok(todo);
      }, function (error) {
        cb_err(error.message);
      });
    } else {
      cb_err("查询好友失败!");
    }
  }, function (error) {
    cb_err(error.message);
  });
}

/** 修改用户的问题属性
 * user_id,用户id
 * column_name，问题字段（q0,q1,q2），用户英雄执照地址（card_url）,消息总数（msg_count，接口自动累计加1前台可不传column_val值，写明字段值就行），上屏（on_screen,新加入英雄：根据两个东西来排列，已经上屏状态，和点击上屏按钮的时间。上屏状态越小越快上屏，同一状态，点击上屏按钮时间越早，越快上屏。上屏状态：0 从来没上过屏幕  1    屏幕循环标记 2 上屏循环标记。上屏后状态变化：状态0 -〉 状态 2 -〉状态 1 -〉状态 2）
 * column_val，字段值请自行保证输入类型
 */
lc_api.updateUserInfo = function (options, cb_ok, cb_err) {
   var user_id = options.user_id || "", 
  column_name = options.column_name || "",
  column_val = options.column_val || "";

  if( options.column_name=="msg_count"||options.column_name=="on_screen"){
      column_val = options.column_val || 0;
  }else{
      column_val = options.column_val || "";
  }
  if (!user_id) {
    cb_err("user_id不能为空!");
    return;
  }
  AV.Cloud.run('updateUserInfo', {
    "user_id": user_id,
    "column_name": column_name,
    "column_val": column_val
  }).then(function (data) {
    cb_ok(data);
  }, function (error) {
    cb_err(error);
  });
}

/** 查询用户表
 *  pageSize 第几页
 *  pageNumber,每页显示条数
 *  orderby 排序字段，默认createdAt（新加入英雄排序查询）, msg_count-对话总数（可以用于英雄风云榜排序查询）,on_screen-用于上屏会有2个排序上屏大小，和时间
 *  isdesc 是否降序，true/false
 * **/
lc_api.getUser = function (options, cb_ok, cb_err) {

  var orderby = options.orderby || "createdAt",
    isdesc = options.isdesc,
    pageSize = options.pageSize || 0,
    pageNumber = options.pageNumber || 6;

  var skip = 0;
  var limit = pageNumber;
  if (pageSize != 0) {
    skip = pageSize * pageNumber;
  }

  var query = new AV.Query("_User");
  if(orderby=="on_screen"){
    query.exists("on_screen");
  }
  query.skip(skip);
  query.limit(limit);
  //排序
  if (orderby.length > 0) {
    if(orderby=="on_screen"){
       query.descending('on_screen_date');
       // query.descending('on_screen'); 
    }else{
      if (isdesc) {
        query.descending(orderby);
      } else {
        query.ascending(orderby);
      }
    }
    
  }

  query.find().then(function (results) {
    cb_ok(results);
  }, function (error) {
    cb_err(error);
  });
}

/** 单聊，根据好友id和当前用户id查询私聊会话数据,只有一条数据
    friends_uid,好友用户id
**/
lc_api.getSingleConversation = function (friends_uid, cb_ok, cb_err) {
  if (!AV.User.current()) {
    cb_err("未登录用户!")
    return;
  }
  var UserArray = [friends_uid, AV.User.current().id]
  var query = new AV.Query("_Conversation");
  query.containsAll("m", UserArray);
  query.first().then(function (results) {
    cb_ok(results);
  }, function (error) {
    cb_err(error);
  });
};

lc_api.initWXShare = function (id) {
  var user = AV.User.current();
  var _title = (user.get('user_nick') || '') + '人称：' + (user.get('q0') || '')
    + '。我将用' + (user.get('q1') || '') + '的方式拯救世界。最后，我想说一句' + (user.get('q2') || '');
  var link = 'http://www.6itec.com/share/#/';
  if(id) link =  'http://www.6itec.com/share/#/?user='+id;
  // AV.Cloud.run('wxShare', { url: location.href }).then(function (obj) {
  $.post("http://www.agoodme.com/api/index.php?act=get_weixin_signature", {
    to_url: location.href
  }, function (objs) {
    var obj = JSON.parse(objs);
    try {
      wx.config({
        debug: false,//开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: obj.data.appid,
        timestamp: obj.data.timestamp,
        nonceStr: obj.data.noncestr,
        signature: obj.data.signature,
        jsApiList: ["checkJsApi", "onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "hideMenuItems"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });
      wx.ready(function () {
        //为了查询用户有去q0-q2
        lc_api.getUserById(user.id, function (res) {
          _title = (res.get('user_nick') || '') + '人称：' + (res.get('q0') || '')
            + '。我将用' + (res.get('q1') || '') + '的方式拯救世界。最后，我想说一句' + (res.get('q2') || '');
          console.log(_title, res, 9999);

          //朋友圈
          wx.onMenuShareTimeline({
            title: _title, // 分享标题
            link: link, // 分享链接
            imgUrl: 'http://www.6itec.com/share/share-logo.png', // 分享图标
            success: function () {
              console.log("node api朋友圈分享成功");
            },
            cancel: function () {
              console.log('onMenuShareTimeline失败')
            }
          });

          //朋友
          wx.onMenuShareAppMessage({
            title: _title, // 分享标题
            desc: "快来生成属于你的英雄执照吧", // 分享描述
            link: link, // 分享链接
            imgUrl: 'http://www.6itec.com/share/share-logo.png', // 分享图标
            type: 'link', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
              console.log("node api朋友分享成功");
            },
            cancel: function () {
              console.log('onMenuShareAppMessage失败')
            }
          });
        }, function (error) { console.log(err) });
      });
      wx.error(function (error) {
        // alert(obj.data.signature + "wx error:" + JSON.stringify(error));
        console.log(obj.data.signature + "wx error:" + JSON.stringify(error));
      });
    } catch (e) {
      console.log(e.message);
    }
  });
}


window.lc_api = lc_api;