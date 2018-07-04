var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '我的积分'
    });
    let loginUser = wx.getStorageSync("loginUser");
    this.setData({
      loginUser: loginUser
    })
    this.initMyScore();
  },

  initMyScore: function() {
    let that = this;
    let url = '/work/queryTalentsReport';
    let method = 'POST';
    let data = {
      responsible: that.data.loginUser.name
    }
    util.onSubmit(url, data, method, function(res) {
      if (res.data.retCode != 200) {
        util.openAlert(res.data.msg);
      } else {
        let kpiSocres = res.data.data.kpiSocres;
        let socresArr = []
        for (let k of Object.keys(kpiSocres)) {
          let socre = {
            kpi: k,
            socre: kpiSocres[k]
          };
          socresArr.push(socre);
        }
        that.setData({
          kpiSocres: socresArr.sort(function(socre) {
            return function(a, b) {
              debugger
              var value1 = a.socre;
              var value2 = b.socre;
              return value1 - value2;
            }
          })
        });
      }
      debugger
    })
  },
  compare: function(property) {
    return function(a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value1 - value2;
    }
  }

})