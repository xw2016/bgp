// pages/works/todo/todo.js
const app = getApp();
var util = require('../../../utils/util.js');
var com = require('../../../lib/js/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    record: 'start',
    loadingHidden: true,
    modalHidden: true,
    popErrorMsg: '',
    beginDate: '',
    remark: '',
    isShowDetail: false, //是否显示详情
    imgfiles: [],
    files: [], //文件上传
    work: [] //任务

  },
  loadingTap: function() {
    this.setData({
      loadingHidden: false
    });
    var that = this;
    setTimeout(function() {
      that.setData({
        loadingHidden: true
      });
      that.update();
    }, 15000);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '任务执行'
    })
    let that = this;
    let queryBean = JSON.parse(options.queryBean);
    let beginDate = queryBean.beginDate;
    console.log("queryBean:" + options.queryBean);
    that.setData({
      work: queryBean,
      beginDate: (beginDate == null || beginDate == '') ? util.formatTime(new Date()) : beginDate,
      endDate: beginDate == new Date() ? null : util.formatTime(new Date())
    })
    this.initFile(queryBean.workId);
    this.initRecorderManager();

  },
  hideErrMsg: function() {
    this.setData({
      popErrorMsg: ''
    })
  },
  initRecorderManager: function() {
    let that = this;
    this.recorderManager = wx.getRecorderManager();
    this.recorderManager.onError(function() {
      that.tip("录音失败！")
    });
    this.recorderManager.onStop(function(res) {
      that.setData({
        src: res.tempFilePath
      })
      console.log(res.tempFilePath)
      // that.tip("录音完成！")
      // that.loadingRecord(res);
    });

    this.innerAudioContext = wx.createInnerAudioContext();
    this.innerAudioContext.onError((res) => {
      
      that.tip("播放录音失败！")
    })
  },

  initFile: function(worksId) {
    let that = this;
    let url = '/work/queryFileUploadById';
    let method = 'POST';
    // let worksId = that.work.workId;
    let data = {
      worksId: worksId
    }
    util.onSubmit(url, data, method, function(res) {

      if (res.data.retCode != 200) {
        util.openAlert(res.data.msg);
      } else {
        that.initFileData(res.data.data);
      }
    });
  },
  //初始化页面附件显示数据
  initFileData: function(files) {
    let imgfiles = [];
    let docfiles = [];
    let txtfiles = [];
    let videofiles = [];
    let audiofiles = [];
    let otherfiles = [];
    if (files != null) {
      files.map(item => {

        if (typeof(item.url) == 'undefined') {
          item.url = app.globalData.servicePath + item.pathUrl;
        }
        switch (item.type) {
          case 'jpg':
          case 'jpeg':
            imgfiles.push(item.url);
            break;
          case 'mp3':
          case 'm4a':
          case 'aac':
            audiofiles.push(item);
            break;
          case 'doc':
          case 'docx':
          case 'txt':
          case 'xls':
          case 'xlsx':
            docfiles.push(item);
            break;
          case 'mp4':
            videofiles.push(item)
            break
          default:
            otherfiles.push(item);
        }
      });

      this.setData({
        files: files,
        imgfiles: imgfiles,
        docfiles: docfiles,
        videofiles: videofiles,
        audiofiles: audiofiles,
        otherfiles: otherfiles
      });
    }
  },
  //日期选择
  bindDateChange: function(e) {
    this.setData({
      beginDate: e.detail.value
    })
  },
  bindEndDateChange: function(e) {
    this.setData({
      endDate: e.detail.value
    })
  },
  bindInputRemarkChange: function(e) {
    this.setData({
      remark: e.detail.value
    })
  },
  showdetail: function(e) {
    let that = this
    let showDetaliTmp = that.data.isShowDetail == false ? true : false
    this.setData({
      isShowDetail: showDetaliTmp
    })
  },

  formSubmit: function(e) {
    debugger
    let that = this;
    let url = '/work/feedback';
    let work = that.data.work;
    work.remark = that.data.remark == '' ? work.remark : that.data.remark;
    work.beginDate = that.data.beginDate;
    work.endDate = that.data.endDate;

    if (work.remark == '' || work.remark == null) {
      that.setData({
        popErrorMsg: "请填写任务执行情况"
      });
      return false;
    }
    if (util.compareDate(that.data.work.planBeginDate, that.data.beginDate)) {
      that.setData({
        popErrorMsg: '开始日期不能早于计划开始日期'
      })
      return false;
    }
    if (util.compareDate(that.data.beginDate, that.data.endDate)) {
      that.setData({
        popErrorMsg: '结束日期不能早于开始日期'
      })
      return false;
    }
    this.submit(url, work)
  },
  formSave: function(e) {
    let that = this;
    let url = '/work/start';
    let work = that.data.work;
    work.remark = that.data.remark;
    work.beginDate = that.data.beginDate;
    work.endDate = null;
    this.submit(url, work)
  },
  submit: function(urls, data) {
    let that = this;
    let url = urls;
    let method = 'post';
    this.loadingTap();
    util.onSubmitJson(url, data, method, function(res) {
      that.setData({
        loadingHidden: true
      })

      if (res.data.retCode != 200) {
        util.openAlert(res.data.msg);
      } else {
        that.openSuccess();
      }
    });
  },
  chooseImage: function(e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        //上传文件
        var tempFilePaths = res.tempFilePaths;

        var uploadImgCount = 0;
        let loginToken = wx.getStorageSync("loginToken");
        let userNo = wx.getStorageSync("userNo");
        let formData = {
          "workId": that.data.work.workId,
          "workName": that.data.work.workName,
          "creator": userNo
        };
        util.onUploadFile(null, tempFilePaths, "file", formData, function(e) {

          that.setData({
            files: that.data.files.concat(e)
          });
        });

        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          imgfiles: that.data.imgfiles.concat(res.tempFilePaths)
        });
      }
    })
  },
  previewImage: function(e) {
    // this.setData({
    //   current: e.currentTarget.id,
    //   modalHidden: false
    // })

    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.imgfiles // 需要预览的图片http链接列表
    })
  },
  bindFileDown: function(e) {
    var that = this;
    this.loadingTap();
    wx.downloadFile({
      url: e.currentTarget.id,
      success: function(res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          wx.openDocument({
            filePath: res.tempFilePath
          })
          that.setData({
            loadingHidden: true
          })
        }
      }
    })
  },
  delFileUpload: function(e) {
    let that = this;
    let url = '/work/delFileUpload';
    let method = 'post';
    let fileId = '';
    let idx = -1;
    let files = that.data.files;

    files.forEach(function(item, index) {

      if (item.url == e) {
        fileId = item.id;
        idx = index;
        return false;
      }
    })

    if (fileId == '' && idx > -1) {
      files.splice(idx, 1);
    } else {
      let data = {
        fileId: fileId
      }

      util.onSubmit(url, data, method, function(res) {
        if (res.data.retCode != 200) {
          util.openAlert(res.data.msg);
        } else {

          files.splice(idx, 1);
          that.initFileData(files);
        }
      });
    }

  },
  modalCandel: function() {
    // do something
    this.setData({
      modalHidden: true
    })
  },
  showAudioOpt: function() {
    this.setData({
      modalHidden: false
    })
  },
  openAudio: function(e) {
    let that = this;
    wx.showActionSheet({
      itemList: ['收听', '删除'],
      itemColor: '#007aff',
      success(res) {
        if (res.tapIndex === 0) {
          that.innerAudioContext.src = e.currentTarget.id;
          that.innerAudioContext.play()
        } else if (res.tapIndex === 1) {
          console.log('删除' + e.currentTarget.id);
          that.delFileUpload(e.currentTarget.id);
        }
      }
    })
  },
  openActionImag: function(e) {
    let that = this;
    wx.showActionSheet({
      itemList: ['查看', '删除'],
      itemColor: '#007aff',
      success(res) {
        if (res.tapIndex === 0) {
          wx.previewImage({
            current: e.currentTarget.id, // 当前显示图片的http链接
            urls: that.data.imgfiles // 需要预览的图片http链接列表
          })
        } else if (res.tapIndex === 1) {
          console.log('删除' + e.currentTarget.id);
          that.delFileUpload(e.currentTarget.id);
        }
      }
    })
  },
  openActionDoc: function(e) {
    let that = this;
    wx.showActionSheet({
      itemList: ['查看', '删除'],
      itemColor: '#007aff',
      success(res) {
        if (res.tapIndex === 0) {
          that.bindFileDown(e);
        } else if (res.tapIndex === 1) {
          console.log('删除' + e.currentTarget.id);
          that.delFileUpload(e.currentTarget.id);
        }
      }
    })
  },
  //开始录音
  startRecord: function() {
    this.setData({
      record: 'end'
    })
    this.recorderManager.start({
      format: 'aac'
    });
  },
  //暂停录音
  pauseRecord: function() {
    this.recorderManager.pause()
  },
  resumeRecord: function() {
    this.recorderManager.resume()
  },
  // 停止录音
  stopRecord: function() {
    this.setData({
      record: 'play'
    })
    this.recorderManager.stop()
  },
  //播放录音
  playRecord: function() {
    var that = this;
    var src = that.data.src;
    if (src == '') {
      that.tip("请先录音！")
      return;
    }
    that.innerAudioContext.src = that.data.src;
    that.innerAudioContext.play()
  },
  //重新录音，清空原来录音
  cleanRecord:function(){
    let that = this;
    that.setData({
      src:'',
      record: 'start'
    })
  },
  //上传录音
  loadingRecord: function() {
    let that = this;
    var src = that.data.src;
    if(src==''){
      return false;
    }
    var tempFilePaths = [src];

    let loginToken = wx.getStorageSync("loginToken");
    let userNo = wx.getStorageSync("userNo");
    let formData = {
      "workId": that.data.work.workId,
      "workName": that.data.work.workName,
      "creator": userNo
    };
    util.onUploadFile(null, tempFilePaths, "file", formData, function(e) {

      that.setData({
        files: that.data.files.concat(e)
      });
      that.initFileData(that.data.files);
      that.modalCandel();
    });
    // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
    // that.setData({
    //   videofiles: that.data.videofiles.concat(res.tempFilePaths)
    // });
},
tip: function(msg) {
  wx.showModal({
    title: '提示',
    content: msg,
    showCancel: false
  })
},
openSuccess: function() {
  wx.redirectTo({
    url: '../../msg/msg_success'
  })
},
openFail: function() {
  wx.navigateTo({
    url: '../../msg/msg_fail'
  })
}
})