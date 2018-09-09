const app = getApp();

function collect(e) {
  let formId = e.detail.formId;
  console.log('推送码：' + formId);
  dealFormIds(formId); //处理保存推送码
  // let type = e.detail.target.dataset.type;
  //根据type的值来执行相应的点击事件
}
function dealFormIds(formId) {
  let loginUser = wx.getStorageSync("loginUser");
  let formIds = app.globalData.gloabalFomIds;//获取全局数据中的推送码gloabalFomIds数组
  if (!formIds) formIds = [];
  let data = {
    account: loginUser.account,
    formId: formId,
    expire: parseInt(new Date().getTime() / 1000) + 604800 //计算7天后的过期时间时间戳
  }
  formIds.push(data);//将data添加到数组的末尾
  app.globalData.gloabalFomIds = formIds; //保存推送码并赋值给全局变量
  let url = '/msg/collect';
  let method = 'post';

  onSubmitJson(url, data, method, function (res) {
   
  })
}
function sentMsg(workId) {
  let url = '/msg/pushMsg';
  let method = 'post';
  let data = {workId:workId}
  onSubmit(url, data, method, function (res) {
    if (res.data.retCode != 200) {
      openAlert(res.data.msg);
    }
  })
}
function sentMsgSingle(workId,account) {
  let url = '/msg/pushMsgSingle';
  let method = 'post';
  let data = { workId: workId ,account:account}
  onSubmit(url, data, method, function (res) {
    if (res.data.retCode != 200) {
      openAlert(res.data.msg);
    }
  })
}
function onSubmit(url, data, method, callback) {
  var host = app.globalData.serviceUrl;
  let loginToken = wx.getStorageSync("loginToken");
  let userNo = wx.getStorageSync("userNo");
  console.log('url:' + url);
  console.log('data:' + JSON.stringify(data));
  wx.request({
    url: host + url,
    data: data,
    method: method,
    header: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
      , "loginToken": loginToken, "userNo": userNo
    },
    success: function (res) {
    }
  })
}
function onSubmitJson(url, data, method, callback) {
  var host = app.globalData.serviceUrl;
  let loginToken = wx.getStorageSync("loginToken");
  let userNo = wx.getStorageSync("userNo");
  console.log('url:' + url);
  console.log('data:' + JSON.stringify(data));
  wx.request({
    url: host + url,
    data: data,
    method: method,
    header: {
      "Content-Type": "application/json;charset=UTF-8"
      , "loginToken": loginToken, "userNo": userNo
    },
    success: function (res) {

    }
  })
}
function openAlert(content) {
  wx.showModal({
    content: content,
    showCancel: false,
    success: function (res) {
      if (res.confirm) {
        console.log('用户点击确定');
      }
    }
  });
}
module.exports = {
  collect: collect,
  dealFormIds: dealFormIds,
  sentMsg: sentMsg,
  sentMsgSingle: sentMsgSingle
}