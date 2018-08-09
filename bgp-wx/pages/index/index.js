//index.js
//获取应用实例
const app = getApp()
var util    = require('../../utils/util.js');
var msgUtil = require('../../utils/msgUtil.js');
 
Page({
  data: {
    loadingHidden: true,
    motto: '龙津',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '移动办公'
    })
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
  // loadingTap: function () {
  //   this.setData({
  //     loadingHidden: false
  //   });
  //   var that = this;
  //   setTimeout(function () {
  //     that.setData({
  //       loadingHidden: true
  //     });
  //     that.update();
  //   }, 10000);
  // },
  //事件处理函数
  bindViewTap: function (e) {
    let that = this;
    util.loadingTap(this);
    util.onLogin(function(){
      that.setData({
        loadingHidden: true
      })
    });
    msgUtil.collect(e);
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
