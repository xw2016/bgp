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
 //初始化附件
  initFile: function () {
    let url = '/work/queryGuideFileById';
    let worksId = this.data.guide.typeId;
    let data = {
      typeId: worksId
    }
    fileUtil.initFileByUrl(this,url,data);
  },
  
  //文件操作
  previewImage: function (e) {
    imageUtil.previewImage(this, e);
  },
  openActionDoc: function (e) {
    fileUtil.bindFileDown(this, e)
  },
  //录音文件操作：试听
  openAudio: function (e) {
    this.innerAudioContext.src = e.currentTarget.id;
    this.innerAudioContext.play()
  },
})