function getSearch(keyword, pageindex, callbackcount, callback) {
  wx.request({
    url: 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp',
    data: {
      g_tk: 5381,
      uin: 0,
      format: 'json',
      inCharset: 'utf-8',
      outCharset: 'utf-8',
      notice: 0,
      platform: 'h5',
      needNewCode: 1,
      w: keyword,
      zhidaqu: 1,
      catZhida: 1,
      t: 0,
      flag: 1,
      ie: 'utf-8',
      sem: 1,
      aggr: 0,
      perpage: 20,
      n: callbackcount,  //返回数据的个数
      p: pageindex,
      remoteplace: 'txt.mqq.all',
      _: Date.now()
    },
    method: 'GET',
    header: { 'content-Type': 'application/json' },
    success: function (res) {
      if (res.statusCode == 200) {
        callback(res.data);
      }
    }
  })
}
function onSubmit(url,data,method,callback){
  var host ="http://localhost:8080/web/wx";
  let loginToken = wx.getStorageSync("loginToken");
  let userNo = wx.getStorageSync("userNo");
  console.log('loginToken:' + loginToken);
  console.log('userNo:'+userNo);
  wx.request({
    url: host+url,
    data: data,
    method: method,
    header: { "Content-Type": "application/x-www-form-urlencoded"
      , "loginToken": loginToken,"userNo":userNo },
    success: function (res) {
      if (res.statusCode == 200) {
        callback(res);
      }else{
        console.log('获取登录信息失败:' + res.data);
      }
    }
  })
}
function onUploadFile(url, tempFilePaths,name,formData){
  //启动上传等待中...  
  wx.showToast({
    title: '正在上传...',
    icon: 'loading',
    mask: true,
    duration: 10000
  })
  var uploadImgCount = 0;
  let loginToken = wx.getStorageSync("loginToken");
  for (var i = 0, h = tempFilePaths.length; i < h; i++) {
    wx.uploadFile({
      url: 'http://localhost:8080/web/wx/work/addFileUpload',
      filePath: tempFilePaths[i],
      name: "file",
      header: {
        'content-type': 'multipart/form-data', "loginToken": loginToken
      },
      formData: {
        "workId": that.data.work.workId
      },
      success: function (res) {
        var data = res.data
        console.log(data);
        //do something
        //如果是最后一张,则隐藏等待中  
        if (uploadImgCount == tempFilePaths.length) {
          wx.hideToast();
        }
      }
      ,
      fail: function (res) {
        wx.hideToast();
        wx.showModal({
          title: '错误提示',
          content: '上传图片失败',
          showCancel: false,
          success: function (res) { }
        })
      }
    })
  }
}
function openAlert(content) {
  wx.showModal({
    content: content,
    showCancel: false,
    success: function (res) {
      if (res.confirm) {
        console.log('用户点击确定')
      }
    }
  });
}
//将方法export，以便其他组件可以引用
module.exports = {
  getSearch: getSearch,
  onSubmit: onSubmit,
  onUploadFile: onUploadFile,
  openAlert: openAlert
}