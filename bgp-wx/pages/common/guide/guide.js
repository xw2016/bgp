// pages/common/guide/guide.js
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
      title: '工作指引'
    })
    let queryBean = JSON.parse(options.queryBean);
    this.setData({
      guide: queryBean
    })
  }

})