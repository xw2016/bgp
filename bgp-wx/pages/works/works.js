
const app = getApp()
var util = require('../../utils/util.js');
Page({

  data: {
    userInfo: {},
    loginUser:{},
    hasUserInfo: false
  },
  onShow: function () {
    console.log("works onShow");
    // this.searchWorksList("todo");
    this.queryWorksDetailReport();
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '任务中心'
    })
    util.initGroup();
    util.initUser();
    let loginUser = wx.getStorageSync("loginUser");
    if (loginUser!=null){
      this.setData({
        loginUser: loginUser
      })
    }
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    // } else if (this.data.canIUse) {
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    }
    
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  queryWorksDetailReport:function(){
    let that = this;
    let url = '/work/queryWorksDetailReport';
    let data = { userNo: wx.getStorageSync("userNo") };
    let method = 'post';
    util.onSubmit(url, data, method, function (res) {
      if (res.data.retCode != 200) {
        // callback(res);
      }else{
        that.setData({
          myReport: res.data.data
        });
      }
    })
  },
  searchWorksList: function (opt) {
    let that = this;
    let url = (opt == 'todo') ? '/work/queryMyTodoWorks' : '/work/queryMyDoneWorks';
    let data = { responsibleNum: wx.getStorageSync("userNo") };
    let method = 'post';
    util.onSubmit(url, data, method, function (res) {
      that.setData({
        worksList: res.data.data,
        todoLength: res.data.data.length
      });
    });
  },
  gotoWorkList: function () {
    wx.navigateTo({
      url: '../works/list/list',
    })
  },
addWork:function(){
  wx.navigateTo({
    url: '../works/add/addfirst',
  })
},
  myScore:function(){
    wx.navigateTo({
      url: '../works/report/report',
    })
  }


})