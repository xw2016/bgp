const app = getApp();
var util = require('../../../utils/util.js')
var fileUtil = require('../../../utils/fileUtil.js')
var imageUtil = require('../../../utils/imageUtil.js');
var recordUtil = require('../../../utils/recordUtil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    second: 0,
    secondShow: 0,
    record: 'start',
    loadingHidden: true,
    modalHidden: true,
    imgfiles: [],
    files: [], //文件上传
    stars: [0],
    rejectInfo:'',
    popErrorMsg: '',
    kpiList: []
  },
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
    }, 15000);
  },
  tip: function (msg) {
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '任务审核'
    })
    let that = this;
    let queryBean = JSON.parse(options.queryBean);
    queryBean.fileType='audit';
    this.setData({
      work: queryBean
    });
    let loginUser = wx.getStorageSync("loginUser");
    this.setData({
      loginUser: loginUser
    })
    this.initKpi(queryBean.workId);
    fileUtil.initFile(this);
    recordUtil.initRecorderManager(this);
  },
  initKpi: function (worksId) {
    let that = this;
    let url = '/work/queryWorkKpiById';
    let method = 'POST';
    let data = {
      worksId: worksId
    }
    util.onSubmit(url, data, method, function (res) {
      if (res.data.retCode != 200) {
        util.openAlert(res.data.msg);
      } else {
        var kpiList = res.data.data;
        var stars = that.data.stars;
        kpiList.forEach(function (item) {
          // item.index = 0
          // let kpiScores = { id: '', kpiScoreId: '', grade: '', score: '' }
          // item.kpiScores.unshift(kpiScores);
          stars.push(0);
        })
        
        that.setData({
          kpiList: kpiList,
          stars: stars
        })
      }
    })
  },
//文件操作
  //图片操作
  chooseImage: function (e) {
    imageUtil.chooseImage(this, e)
  },
  openActionImag: function (e) {
    imageUtil.openActionImag(this, e);
  },
  //录音操作

  modalCandel: function () {
    // do something
    let that = this;
    that.setData({
      modalHidden: true
    })
    let record = that.data.record;
    if (record == 'end') {
      that.stopRecord();
    }
    that.cleanRecord();
  },
  showAudioOpt: function () {
    this.setData({
      modalHidden: false
    })
  },
  //开始录音
  startRecord: function () {

    recordUtil.startRecord(this)
  },
  //暂停录音
  pauseRecord: function () {
    recordUtil.pauseRecord(this)
  },
  //
  resumeRecord: function () {
    recordUtil.resumeRecord(this);
  },
  // 停止录音
  stopRecord: function () {
    recordUtil.stopRecord(this)
  },
  //播放录音
  playRecord: function () {
    recordUtil.playRecord(this);
  },
  //重新录音，清空原来录音
  cleanRecord: function () {
    recordUtil.cleanRecord(this);
  },
  //上传录音
  loadingRecord: function () {
    recordUtil.loadingRecord(this)

  },
  //录音文件操作：试听，删除
  openAudio: function (e) {
    recordUtil.openAudio(this, e)
  },


  // 所以用自定义属性current来标记每个数组对象的下标
  bindChange_select: function (ev) {
    console.log('picker发送选择改变，携带值为', ev.detail.value);
    // 定义一个变量curindex 储存触发事件的数组对象的下标
    const curindex = ev.target.dataset.current
    // 根据下标 改变该数组对象中的index值
    this.data.kpiList[curindex].index = ev.detail.value
    // 把改变某个数组对象index值之后的全新objArray重新 赋值给objArray
    this.setData({
      kpiList: this.data.kpiList
    })
  },
  showWorkLog: function (e) {
    let that = this
    let isShowWorkLog = that.data.isShowWorkLog == false ? true : false
    this.setData({
      isShowWorkLog: isShowWorkLog
    })
  },
  
  bindRejectInfoChange: function (e) {
    this.setData({
      rejectInfo: e.detail.value
    })
  },
  reject: function () {
    let that = this;
    let url = '/work/rejectAudit';
    let method = 'post';
    if(that.data.rejectInfo==''){
      that.setData({
        popErrorMsg: '审核意见不能为空！'
      })
      return false;
    }
    let workAuditVo = {
      workId: that.data.work.workId,
      workName: that.data.work.workName,
      // worksResultScores: worksResultScores,
      // auditUser: that.data.loginUser,
      rejectInfo: that.data.rejectInfo
    }
    this.loadingTap();
    util.onSubmitJson(url, workAuditVo, method, function (res) {
      that.setData({
        loadingHidden: true
      });
      if (res.data.retCode != 200) {
        util.openAlert(res.data.msg);
      } else {
        that.openSuccess();
      }
    });
  },
  formSubmit: function () {
    let that = this;
    let url = '/work/submitAudit';
    let method = 'post';
    // let data = that.data;
    let worksResultScores = [];
    let kpiList = that.data.kpiList;
    let kpiFlag = true;
    try {
      kpiList.forEach(function (item) {
        let score = item.kpiScores[item.index];
        if (score == null || score.id == '') {
          that.setData({
            popErrorMsg: '【' + item.kpiName + '】评分不能为空！'
          })
          kpiFlag = false;
          throw new Error("null score");
        }
        worksResultScores.push({
          workId: item.workId,
          workName: item.workName,
          kpiScoreId: score.id,
          kpiName: item.kpiName,
          grade: score.grade,
          score: score.score
        })
      });
    } catch (e) {

    }
    if (kpiFlag == false) {
      return false
    }
    let workAuditVo = {
      workId: that.data.work.workId,
      workName: that.data.work.workName,
      worksResultScores: worksResultScores,
      auditUser: that.data.loginUser,
      rejectInfo: that.data.rejectInfo
    }
    this.loadingTap();
    this.onSubmit(url, workAuditVo, method, function (res) {
      that.setData({
        loadingHidden: true,
        worksList: res.data.data
      });
      if (res.data.retCode != 200) {
        util.openAlert(res.data.msg);
      } else {
        that.openSuccess();
      }
    });

  },
  
  openSuccess: function () {
    wx.redirectTo({
      url: '../../msg/msg_success'
    })
  },
  openFail: function () {
    wx.navigateTo({
      url: '../../msg/msg_fail'
    })
  },
  onSubmit: function (url, data, method, callback) {
    var host = app.globalData.serviceUrl;
    let loginToken = wx.getStorageSync("loginToken");
    let userNo = wx.getStorageSync("userNo");
    console.log('url:' + url);
    console.log('data:' + JSON.stringify(data));
    wx.request({
      url: host + url,
      data: data,
      method: method,
      header: {
        "Content-Type": "application/json;charset=UTF-8"
        , "loginToken": loginToken, "userNo": userNo
      },
      success: function (res) {
        if (res.statusCode == 200) {
          callback(res);
        } else if (res.statusCode == 403) {
          console.log('获取登录信息失败:' + res.data);
          openAlert("未登录，请重新登录！", function () {
            wx.reLaunch({
              url: '../index/index'
            })
          });

        }
      }
    })
  }, 
  //仿淘宝评分
  myStarChoose(e) {
    let that = this;
    var idx = e.currentTarget.dataset.idx;
    
    let star = parseInt(e.target.dataset.star) || 0;
    let stars = that.data.stars;
    stars[idx]=star;
    this.data.kpiList[idx].index = star-1
    // 把改变某个数组对象index值之后的全新objArray重新 赋值给objArray
    this.setData({
      stars: stars,
      kpiList: this.data.kpiList
    });
  }
})