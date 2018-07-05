// pages/works/todo/todo.js
const app = getApp();
var util = require('../../../utils/util.js');
var com = require('../../../lib/js/common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalHidden:true,
    popErrorMsg: '',
    beginDate: '',
    remark: '',
    isShowDetail: false, //是否显示详情
    files: [], //文件上传
    work: [] //任务

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
    // let files=  util.initFile(queryBean.workId);
    // that.setData({
    //   files: files
    // });
  },
  hideErrMsg: function() {
    this.setData({
      popErrorMsg: ''
    })
  },
  initFile: function (worksId) {
    let that = this;
    let url = '/work/queryFileUploadById';
    let method = 'POST';
    // let worksId = that.work.workId;
    let data={
      worksId:worksId
    }
    util.onSubmit(url, data, method, function (res) {
      if (res.data.retCode != 200) {
        util.openAlert(res.data.msg);
      } else {
        let files = [];
        if (res.data.data!=null){
          files = res.data.data.map(item => { //获取工作类型总类数组
           
            return app.globalData.serviceUrl + '/work/download?fileId=' + item.id;
          });
          that.setData({
            files: files,
            captchaImage:url
          });
        }
      }
    });
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
  // validateForm: function () {
  //   let wxValidate = app.wxValidate({
  //     beginDate: { required: true },
  //     reamrk: { required: false }
  //   },
  //     {
  //       beginDate: { required: '请选择开始日期' },
  //       reamrk: { required: '请填写任务执行情况' }
  //     }
  //   )
  //   return wxValidate;
  // },
  formSubmit: function(e) {
    let that = this;
    let url = '/work/feedback';
    let work = that.data.work;
    work.remark = that.data.remark == '' ? work.remark : that.data.remark;
    work.beginDate = that.data.beginDate;
    work.endDate = that.data.endDate;
    
    if (work.remark == '' || work.remark == null) {
      this.setData({
        popErrorMsg: "请填写任务执行情况"
      });
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
    if (util.compareDate(util.formatTime(new Date()), that.data.beginDate)) {
      that.setData({
        popErrorMsg: '开始日期不能早于今天'
      })
      return false;
    }
    if (util.compareDate(that.data.planBeginDate, that.data.endDate)) {
      that.setData({
        popErrorMsg: '结束日期不能早于开始日期'
      })
      return false;
    }
    let that = this;
    let url = urls;
    let method = 'post';
    util.onSubmitJson(url, data, method, function(res) {
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
        util.onUploadFile(null, tempFilePaths, "file", formData);

        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },
  previewImage: function(e) {
    this.setData({
      current: e.currentTarget.id, 
      modalHidden:false
    })
    // wx.previewImage({
    //   current: e.currentTarget.id, // 当前显示图片的http链接
    //   urls: this.data.files // 需要预览的图片http链接列表
    // })
  },
  modalCandel: function () {
    // do something
    this.setData({
      modalHidden: true
    })
  },
isPicture :function (str) {
    //判断是否是图片 - strFilter必须是小写列举
    let strFilter = ".jpeg|.gif|.jpg|.png|.bmp|.pic|"
    if (str.indexOf(".") > -1) {
      let p = str.lastIndexOf(".");
      //alert(p);
      //alert(this.length);
      let strPostfix = str.substring(p, this.length) + '|';
      strPostfix = strPostfix.toLowerCase();
      //alert(strPostfix);
      if (strFilter.indexOf(strPostfix) > -1) {
        //alert("True");
        return true;
      }
    }
    //alert('False');
    return false;
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