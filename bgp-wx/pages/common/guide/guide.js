const app = getApp();
var util = require('../../../utils/util.js');
var fileUtil = require('../../../utils/fileUtil.js')
var imageUtil = require('../../../utils/imageUtil.js');
var recordUtil = require('../../../utils/recordUtil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    files:[],
    loadingHidden: true
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
    });
    
    this.initFile();
  },
 //初始化附件
  initFile: function (typeId) {
    let url = '/work/queryGuideFileById';
    fileUtil.initFileByUrl(this,url);
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

  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.imgfiles // 需要预览的图片http链接列表
    })
  },
  bindFileDown: function (e) {
   fileUtil.bindFileDown(this,e)
  }
})