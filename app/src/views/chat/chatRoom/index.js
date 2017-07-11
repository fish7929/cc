const LRealtime = require('leancloud-realtime')


const showLog = (msg)=> {
    console.log(msg)
}

let ChatRoom = function(opt){
    console.log(opt)
    // 请将 AppId 改为你自己的 AppId，否则无法本地测试
    let appId = 'NWf9LqTFMyuK0RpycPsNSque-gzGzoHsz';
    let appKey = 'wqmHFKHKc8YoGi3PTIQ5zd8k';


    // 请换成你自己的一个房间的 conversation id（这是服务器端生成的）
    let roomId = opt.roomId;
    // 每个客户端自定义的 id
    var clientId = opt.userId;
    var showMsg = opt.showMsg;
    var members = opt.members;
    var realtime;
    var client;
    var messageIterator;

    // 用来存储创建好的 roomObject
    var room;

    // 监听是否服务器连接成功
    var firstFlag = true;

    // 用来标记历史消息获取状态
    var logFlag = false;

    this.connect = () => {
        showLog('正在连接，请等待');
        if (!firstFlag) {
            client.close();
        }

        // 创建实时通信实例
        realtime = new LRealtime.Realtime({
            appId: appId,
            appKey: appKey,
            plugins: AV.TypedMessagesPlugin,
        });
        // 创建聊天客户端
        realtime.createIMClient(clientId)
        .then(c => {
            showLog('连接成功');
            firstFlag = false;
            client = c;
            client.on('disconnect', function() {
                showLog('[disconnect] 服务器连接已断开');
            });
            client.on('offline', function() {
                showLog('[offline] 离线（网络连接已断开）');
            });
            client.on('online', function() {
                showLog('[online] 已恢复在线');
            });
            client.on('schedule', function(attempt, time) {
                showLog('[schedule] ' + time / 1000 + 's 后进行第 ' + (attempt + 1) + ' 次重连');
            });
            client.on('retry', function(attempt) {
                showLog('[retry] 正在进行第 ' + (attempt + 1) + ' 次重连');
            });
            client.on('reconnect', function() {
                showLog('[reconnect] 重连成功');
            });
            client.on('reconnecterror', function() {
                showLog('[reconnecterror] 重连失败');
            });
            // 获取对话
            return c.getConversation(roomId);
        })
        .then(conversation => {
            if (conversation) {
                return conversation;
            } else {
                // 如果服务器端不存在这个 conversation
                showLog('不存在这个 conversation，创建一个。');
                return client.createConversation({
                    name: 'LeanCloud-Conversation',
                    members: members,// 默认包含当前用户
                    // 创建暂态的聊天室（暂态聊天室支持无限人员聊天，但是不支持存储历史）
                    // transient: true,
                    // 默认的数据，可以放 conversation 属性等
                    attributes: {
                    test: 'demo2'
                    }
                }).then(function(conversation) {
                    showLog('创建新 Room 成功，id 是：' + conversation.id);
                    roomId = conversation.id;
                    return conversation;
                });
            }
        })
        .then(function(conversation) {
            showLog('当前 Conversation 的成员列表：', conversation.members);
            if (conversation.members.length > 490) {
            return conversation.remove(conversation.members[30]).then(function(conversation) {
                showLog('人数过多，踢掉： ' + conversation.members[30]);
                return conversation;
            });
            }
            return conversation;
        })
        .then(function(conversation) {
            return conversation.join();
        })
        .then(function(conversation) {
            // 获取聊天历史
            room = conversation;
            messageIterator = conversation.createMessagesIterator();
            getLog(function() {
                showLog('已经加入，可以开始聊天。');
            });
            // 房间接受消息
            conversation.on('message', function(message) {
                if (!msgTime) {
                    // 存储下最早的一个消息时间戳
                    msgTime = message.timestamp;
                }
                showMsg&&showMsg(message);
            });
        })
        .catch(function(err) {
            console.error(err);
        })
    }

    this.sendMsg = (msg, params) => {
        return new Promise((resolve, reject) => {
            // 不让发送空字符
            if (!String(msg).replace(/^\s+/, '').replace(/\s+$/, '')) {
                reject && reject('请输入点文字！')
                return
            }
            // 向这个房间发送消息，这段代码是兼容多终端格式的，包括 iOS、Android、Window Phone
            let textMessage = new LRealtime.TextMessage(msg)
            textMessage.setAttributes(params)
            room.send(textMessage).then(function(message) {
                // 发送成功之后的回调
                resolve && resolve(message)
            });
        })
    }

    // 拉取历史相关
// 最早一条消息的时间戳
var msgTime;

// 获取消息历史
function getLog(callback) {
  if (logFlag) {
    return;
  } else {
    // 标记正在拉取
    logFlag = true;
  }
  messageIterator.next().then(function(result) {
    var data = result.value;
    logFlag = false;
    // 存储下最早一条的消息时间戳
    var l = data.length;
    if (l) {
      msgTime = data[0].timestamp;
    }
    for (var i = 0 ; i < l; i++) {
      showMsg&&showMsg(data[i], true);
    }
    if (callback) {
      callback();
    }
  }).catch(function(err) {
    console.error(err);
  });
}
}

export default ChatRoom