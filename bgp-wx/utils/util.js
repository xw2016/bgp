const app = getApp();
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') 
  // + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function formateTime2(seconds){
  return[
    // parseInt(seconds / 60 / 60), //时
    parseInt(seconds / 60 % 60), //分
    parseInt( seconds % 60)
  ].join(":").replace(/\b(\d)\b/g,"0$1");
}

function CountTime(that){ //计时器
  var second = that.data.second;
  if (second == -1) {
    that.setData({
      second: 0
      // secondShow: formateTime2(0)
    })
    clearTimeout(that.data.timer);
    return;
  }
  that.setData({
  timer : setTimeout(function(){
    that.setData({
      second:second+1,
      secondShow:formateTime2(second+1)
    })
    CountTime(that);
  },1000)})
 
}
//日期比较
function compareDate(s1, s2) {
  return ((new Date(s1.replace(/-/g, "\/"))) > (new Date(s2.replace(/-/g, "\/"))));
}
function goBack() {
  wx.navigateBack({
    delta: 1
  })
}
function removeRepeat(a,key) {   //去重方法
  var b = [], n = a.length, i, j;
  for (i = 0; i < n; i++) {
    for (j = i + 1; j < n; j++) {
      if(key!='undefine'&&key!=null){
        if (a[i][key] === a[j][key]) { j = false; break; }
      }else{
        if (a[i] === a[j]) { j = false; break; }
      }
     
    }
    if (j) b.push(a[i]);
  }
  return b.sort(function (a, b) { return a - b });
}

//提交请求（非json）
function onSubmit(url, data, method, callback) {
  var host = app.globalData.serviceUrl;
  let loginToken = wx.getStorageSync("loginToken");
  let userNo = wx.getStorageSync("userNo");
  console.log('url:' + url);
  console.log('data:' + JSON.stringify(data) );
  wx.request({
    url: host + url,
    data: data,
    method: method,
    header: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
      , "loginToken": loginToken, "userNo": userNo
    },
    success: function (res) {
      
      if (res.statusCode == 200) {
        callback(res);
      } else if(res.statusCode == 403){
        console.log('获取登录信息失败:' + res.data);
        openAlert("未登录，请重新登录！",function(){
          wx.reLaunch({
            url: '../index/index'
          })
        });
       
      }
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
      
      if (res.statusCode == 200) {
        callback(res);
      } else if (res.statusCode == 403) {
        console.log('获取登录信息失败:' + res.data);
        openAlert("未登录，请重新登录！", function () {
          wx.reLaunch({
            url: '../index/index'
          })
        });

      }
    }
  })
}
//按工作id查询
function initFile (worksId) {
  let that = this;
  let url = '/work/queryFileUploadById';
  let method = 'POST';
  let data = {
    worksId: worksId
  }
  let files = [];
  this.onSubmit(url, data, method, function (res) {
    if (res.data.retCode != 200) {
      this.openAlert(res.data.msg);
    } else {
      if (res.data.data != null) {
        files = res.data.data.map(item => { 
          return app.globalData.serviceUrl + '/work/download?fileId=' + item.id;
        });
      }
      debugger
    }
  });
  return files;
}
//图片上传
function onUploadFile(url, tempFilePaths, name, formData,callback) {
  var host = app.globalData.serviceUrl;
  //启动上传等待中...  
  // wx.showToast({
  //   title: '正在上传...',
  //   icon: 'loading',
  //   mask: true,
  //   duration: 10000
  // })
  
  var uploadImgCount = 0;
  let loginToken = wx.getStorageSync("loginToken");
  for (var i = 0, h = tempFilePaths.length; i < h; i++) {
    if(tempFilePaths[i]==''){
      return false;
    }
    const uploadTask = wx.uploadFile({
      url: host+'/work/addFileUpload',
      filePath: tempFilePaths[i],
      name: "file",
      header: {
        'content-type': 'application/json;charset=UTF-8', "loginToken": loginToken
      },
      formData: formData,
      success: function (res) {
        
        let result = JSON.parse(res.data);
        if (result.retCode!=200){
          console.log('上传文件失败:' );
        }
        var fileData = result.data
        console.log(fileData);
        //do something
        //如果是最后一张,则隐藏等待中  
        if (uploadImgCount == tempFilePaths.length) {
          wx.hideToast();
        }
        if(callback!=null){
          fileData.url = tempFilePaths[i-1];
  
          callback(fileData);
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
    });
//监听文件上传进度
    // uploadTask.onProgressUpdate((res) => {
    //   console.log('上传进度', res.progress)
    //   console.log('已经上传的数据长度', res.totalBytesSent)
    //   console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
    // });
  }
}
function openAlert(content,callback) {
  wx.showModal({
    content: content,
    showCancel: false,
    success: function (res) {
      if (res.confirm) {
        // console.log('用户点击确定');
        callback();
      }
    }
  });
}
//后台登录
function onLogin(callback){
  var host = app.globalData.serviceUrl;
  // 登录
  wx.login({
    success: res => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      var code = res.code;
      if (code) {
        console.log('获取用户登录凭证' + code);
        // --------- 发送凭证 ------------------
        wx.request({
          url: host+'/login',
          data: { code: code },
          success: function (res) {
            if (res.data.retCode == 200) {
              console.log('登录' + ":" + res.data.data.loginToken);
              console.log('登录user' + ":" + res.data.data.userNo);
              wx.setStorage({
                key: "loginToken",
                data: res.data.data.loginToken
              });
              wx.setStorage({
                key: "userNo",
                data: res.data.data.userNo
              });
              wx.setStorage({
                key: "loginUser",
                data: res.data.data.loginUser
              });
              
              wx.navigateTo({
                url: '../works/works'
                // url:'../rrtest/rrtest"'
              })
            }
            else {
              console.log("未注册用户");
              //跳到注册页面
              wx.redirectTo({
                // url:'pages/register/register'
                url: '../register/register'
              })
            }
            callback();
          },
          fail: function (res) {
            console.log('登录失败！'+ res.errMsg);
            openAlert("登录失败！"+ res.errMsg,function(){
              wx.reLaunch({
                url: '../index/index'
              })
            });
          }
        })
        // ------------------------------------
      } else {
        console.log('获取用户登录失败：' + res.errMsg);
      }
    }
  })
}
// function validateForm(e,callback) {
//   let wxValidate = app.wxValidate({
//     workName: { required: true },
//     planBeginDate: { required: true },
//     planEndDate: { required: true },
//     reviewer:{required:true},
//     responsible:{required:true},
//     department:{required:true}
//   },
//     {
//       workName: { required: '请填写任务名称' },
//       planBeginDate: { required: '请选择计划开始日期' },
//       planEndDate: { required: '请选择计划结束日期' },
//       reviewer:{required:'请选择审核人'},
//       responsible:{required:'请选择负责人'},
//       department:{required:'请选择所属部门'}
//     }
//   )

//   if (!wxValidate.checkForm(e)) {
//     const error = wxValidate.errorList[0];
//     callback(error.msg);
//     return false;
//   };
//  return true;
// }
//初始化用户组
function initGroup() {
  let that = this;
  let url = '/user/queryGroup';
  let method = 'POST';
  let groupList = ''
  wx.getStorageSync("groupList");
  if (groupList == '') {
    this.onSubmit(url, null, method, function (res) {
      if (res.data.retCode != 200) {
        this.openAlert(res.data.msg);
      } else {
        var usergroupListlist = res.data.data;
        wx.setStorage({
          key: "groupList",
          data: res.data.data
        });
      }
    })
  }
}
//初始化用户列表
function initUser() {
  let that = this;
  let url = '/user/queryUserList';
  let method = 'POST';
  let userList = '' 
  wx.getStorageSync("userlist");
  if (userList == '') {
    this.onSubmit(url, null, method, function (res) {
      if (res.data.retCode != 200) {
        this.openAlert(res.data.msg);
      } else {
        var userlist = res.data.data;
        wx.setStorage({
          key: "userlist",
          data: res.data.data
        });
      }
    })
  }
}
//用户搜索
function searchUser(key){
  let targets = [];
  let userList = wx.getStorageSync("userlist");
  if (userList != '' && key!=null){
    key = key.replace(/，/g, ",");
    let keyArr =key.split(",");
    keyArr.forEach(function(k){
      userList.forEach(function (user) {
        if (user.name.search(k) != -1) {
          targets.push(user);
        } else if (user.account.search(k) != -1) {
          targets.push(user);
        }
      })
    })
    
  }
  let userGroup = [];
  if(targets!=''){
    userGroup=this.removeRepeat(targets,"account");
  }
 
  return userGroup;
}
module.exports = {
  formatTime: formatTime,
  onSubmit: onSubmit,
  onSubmitJson:onSubmitJson,
  onUploadFile: onUploadFile,
  openAlert: openAlert,
  onLogin: onLogin,
  goBack: goBack,
  removeRepeat: removeRepeat,
  initUser: initUser,
  initGroup:initGroup,
  searchUser: searchUser,
  compareDate: compareDate,
  initFile: initFile,
  countTime:CountTime
  // validateForm
}
