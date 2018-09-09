var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingHidden: true,
    account: '',
    password: '',
    code: '',
    popErrorMsg: ''
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
  //提示语
  hideErrMsg: function () {
    this.setData({
      popErrorMsg: ''
    })
  },
  loadingTap: function () {
    this.setData({
      loadingHidden: false
    });
    var that = this;
    setTimeout(function () {
      that.setData({
        loadingHidden: true
      });
      that.update();
    }, 10000);
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
    let account = that.data.account;
    if (account == '') {
      that.setData({
        popErrorMsg: '请输入账号'
      })
      return false;
    }
    let password = that.data.password;
    if (password == '') {
      that.setData({
        popErrorMsg: '请输入密码'
      })
      return false;
    }
    let data = {
      account: that.data.account,
      password: that.data.password,
      code: that.data.code
    };
    let method = 'post';
    this.loadingTap();
    util.onSubmit(url, data, method, function (res) {
      that.setData({
        loadingHidden: true
      });
      if (res.data.retCode !=200) {
        util.openAlert(res.data.msg,null);
      } else {
        console.log('登录' + ":" + res.data.data.loginToken);
        console.log('登录user' + ":" + res.data.data.userNo);
        wx.setStorageSync("loginToken", res.data.data.loginToken);
        wx.setStorageSync("userNo", res.data.data.userNo)
        wx.setStorageSync("loginUser", res.data.data.loginUser)
        // wx.setStorageSync({
        //   key: "loginToken",
        //   data: res.data.data.loginToken
        // });
        // wx.setStorageSync({
        //   key: "userNo",
        //   data: res.data.data.userNo
        // });
        // wx.setStorageSync({
        //   key: "user",
        //   data: res.data.data.loginUser
        // });
        wx.reLaunch({
          url: '../works/works'
        })
      }
    });
  }
})