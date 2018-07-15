var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    files: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.recorderManager = wx.getRecorderManager();
    this.recorderManager.onError(function () {
      that.tip("录音失败！")
    });
    this.recorderManager.onStop(function (res) {
      that.setData({
        src: res.tempFilePath
      })
      console.log(res.tempFilePath)
      that.tip("录音完成！" + res.tempFilePath)
      that.loadingRecord(res);
    });

    this.innerAudioContext = wx.createInnerAudioContext();
    this.innerAudioContext.onError((res) => {
      that.tip("播放录音失败！")
    })

  },
  loadingRecord: function (res){
    let that= this;
    var tempFilePaths = [res.tempFilePath];

  let loginToken = wx.getStorageSync("loginToken");
  let userNo = wx.getStorageSync("userNo");
  let formData = {
    "workId": '9999',
    "workName": '音频测试',
    "creator": userNo
  };
  util.onUploadFile(null, tempFilePaths, "file", formData, function (e) {

    that.setData({
      files: that.data.files.concat(e)
    });
  });

  // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
  that.setData({
    videofiles: that.data.videofiles.concat(res.tempFilePaths)
  });
}


  /**
  * 提示
  */
  , tip: function (msg) {
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false
    })
  }

  /**
   * 录制aac音频
   */
  , startRecordAac: function () {
    this.recorderManager.start({
      format: 'aac'
    });
  }

  /**
   * 录制mp3音频
  */
  , startRecordMp3: function () {
    this.recorderManager.start({
      format: 'mp3'
    });
  }

  /**
   * 停止录音
   */
  , stopRecord: function () {
    this.recorderManager.stop()
  }

  /**
   * 播放录音
   */
  , playRecord: function () {
    var that = this;
    var src = this.data.src;
    if (src == '') {
      this.tip("请先录音！")
      return;
    }
    this.innerAudioContext.src = this.data.src;
    this.innerAudioContext.play()
  }

})