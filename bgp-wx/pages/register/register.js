var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account: '',
    password: '',
    code: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '信息采集系统'
    })
    let that = this;
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var code = res.code;
        if (code) {
          that.setData({
            code: code
          })
        }
      }
    });
  },
  bindAccount: function (e) {
    let that = this;
    that.setData({
      account: e.detail.value
    })
  },
  bindPassword: function (e) {
    let that = this;
    that.setData({
      password: e.detail.value
    })
  },

  formLogin: function (e) {
    let that = this;
    let url = '/register';
    let data = {
      account: that.data.account,
      password: that.data.password,
      code: that.data.code
    };
    let method = 'post';
    util.onSubmit(url, data, method, function (res) {
      if (res.data.retCode !=200) {
        util.openAlert(res.data.msg,null);
      } else {
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
          key: "user",
          data: res.data.data.loginUser
        });
        wx.reLaunch({
          url: '../works/works'
        })
      }
    });
  }
})