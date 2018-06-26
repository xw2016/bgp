//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js');
Page({
  data: {
    motto: '龙津',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  // onLaunch: function () {
  //   util.onLogin();
  // },
  //事件处理函数
  bindViewTap: function () {
    //if login success
    util.onLogin();
    // var loginToken = wx.getStorageSync("loginToken");
    // if (loginToken) {
    //   wx.redirectTo({
    //     // url: '../logs/logs'
    //     url: '../works/works'
    //     // url: '../rrtest/rrtest'
    //   })
    // }

    //if login fail
    //register
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '移动办公'
    })
    if (app.globalData.flag) {//如果flag为true，退出  
      wx.navigateBack({
        delta: 1
      })
    }
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
