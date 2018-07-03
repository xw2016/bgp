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
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的积分'
    })
    this.initMyScore();
  },

  initMyScore:function(){
    let that = this;
    let url = '/work/queryTalentsReport';
    let method = 'POST';
    let data = {
      responsible: '王静'
    }
    util.onSubmit(url, data, method, function (res) {
        debugger
      if (res.retCode != 200) {
        util.openAlert(res.data.msg);
      } else {

      }
    })
  }

})