//app.js
import wxValidate from 'utils/wxValidate'
App({
  wxValidate: (rules, messages) => new wxValidate(rules, messages),
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

   
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    logout:false,
    serviceUrl: 'https://www.longjinoa.com/web/wx',
    servicePath: 'https://www.longjinoa.com/'
    // serviceUrl:'https://test.litebike.cn/web/wx',
    // servicePath: 'https://test.litebike.cn/'
        // serviceUrl: 'http://localhost:8080/web/wx',
        // servicePath: 'http://localhost:8080/'
  }
})