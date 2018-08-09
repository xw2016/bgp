// pages/works/todo/todo.js
const app = getApp();
var util = require('../../../utils/util.js')
var fileUtil = require('../../../utils/fileUtil.js')
var imageUtil = require('../../../utils/imageUtil.js');
var recordUtil = require('../../../utils/recordUtil.js');
var mgsUtil = require('../../../utils/msgUtil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    descriptionLen:0,
    second: 0,
    secondShow: 0,
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
  // loadingTap: function() {
  //   this.setData({
  //     loadingHidden: false
  //   });
  //   var that = this;
  //   setTimeout(function() {
  //     that.setData({
  //       loadingHidden: true
  //     });
  //     that.update();
  //   }, 15000);
  // },
  hideErrMsg: function () {
    this.setData({
      popErrorMsg: ''
    })
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
    queryBean.fileType ='execute';
    let beginDate = queryBean.beginDate;
    console.log("queryBean:" + options.queryBean);
    that.setData({
      work: queryBean,
      beginDate: (beginDate == null || beginDate == '') ? util.formatTime(new Date()) : beginDate,
      endDate: beginDate == new Date() ? null : util.formatTime(new Date())
    })
    fileUtil.initFile(this);
    recordUtil.initRecorderManager(this);
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
      remark: e.detail.value,
      descriptionLen: e.detail.value.length
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

    let that = this;
    let url = '/work/feedback';
    let method = 'post';
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
    util.loadingTap(this);
    util.onSubmitJson(url, work, method, function (res) {
      that.setData({
        loadingHidden: true
      })
      
      if (res.data.retCode != 200) {
        util.openAlert(res.data.msg);
      } else {
        that.openSuccess();
        mgsUtil.sentMsg(that.data.work.workId);
      }
    });
  },
  formSave: function(e) {
    let that = this;
    let url = '/work/start';
    let work = that.data.work;
    work.remark = that.data.remark;
    work.beginDate = that.data.beginDate;
    work.endDate = null;
    let method = 'post';
    util.loadingTap(this);
    this.submit(url, work)
  },
  submit: function(urls, data) {
    let that = this;
    let url = urls;
    let method = 'post';
    util.loadingTap(this);
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
  //图片
  chooseImage: function(e) {
   imageUtil.chooseImage(this,e)
  },
  previewImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.id,
      urls: this.data.imgfiles
    })
  },
  openActionImag: function (e) {
    imageUtil.openActionImag(this,e)
  },
  //文件查看
  bindFileDown: function(e) {
    fileUtil.bindFileDown(this,e)
  },
  
  
  openActionDoc: function(e) { 
    fileUtil.openActionDoc(this,e)
  },

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
//
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