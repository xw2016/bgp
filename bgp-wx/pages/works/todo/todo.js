// pages/works/todo/todo.js
var util = require('../../../utils/util.js');
var com = require('../../../lib/js/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    popErrorMsg: '',
    beginDate: '',
    remark: '',
    isShowDetail: false,//是否显示详情
    files: [],//文件上传
    work: []  //任务

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '任务执行'
    })
    let that = this;
    let queryBean = JSON.parse(options.queryBean);
    let beginDate = queryBean.beginDate;
    console.log("bindDate:" + queryBean.beginDate);

    that.setData({
      work: queryBean,
      beginDate: (beginDate == null || beginDate=='') ? util.formatTime(new Date()) : beginDate
    })
  },
  hideErrMsg: function () {
    this.setData({
      popErrorMsg: ''
    })
  },
  //日期选择
  bindDateChange: function (e) {
    this.setData({
      bindDate: e.detail.value
    })
  },
  bindInputRemarkChange: function (e) {
    this.setData({
      remark: e.detail.value
    })
  },
  showdetail: function (e) {
    let that = this
    let showDetaliTmp = that.data.isShowDetail == false ? true : false
    this.setData({
      isShowDetail: showDetaliTmp
    })
  },
  validateForm: function () {
    let wxValidate = app.wxValidate({
      beginDate: { required: true },
      reamrk: { required: false }
    },
      {
        beginDate: { required: '请选择开始日期' },
        reamrk: { required: '请填写任务执行情况' }
      }
    )
    return wxValidate;
  },
  formSubmit: function (e) {
    let that = this;
    let url = '/work/feedback';
    let work = that.data.work;
    let remark = that.data.remark;
    // let beginDate = that.data.beginDate;
    let data = {
      workId: work.workId,
      // beginDate: (beginDate == null || beginDate == '') ? work.beginDate : beginDate,
      remark: (remark == null || remark == '') ? work.remark : remark
    };
    let method = 'post';
    util.onSubmit(url, data, method, function (res) {

      if (res.data.data == false) {
        util.openAlert(res.data.msg);
      } else {
        that.openSuccess();
      }
    });
  },
  formSave: function (e) {
    let that = this;
    let url = '/work/start';
    let work = that.data.work;
    let remark = that.data.remark;
    let beginDate = that.data.beginDate;
    let data = {
      workId: work.workId,
      // beginDate: (beginDate == null || beginDate == '') ? work.beginDate : beginDate,
      remark: (remark == null || remark == '') ? work.remark : remark
    };
    let method = 'post';
    util.onSubmit(url, data, method, function (res) {

      that.openSuccess();
    });
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
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
        util.onUploadFile(null, tempFilePaths, "file", formData);

        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
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
  }
})