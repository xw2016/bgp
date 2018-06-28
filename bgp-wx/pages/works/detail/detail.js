var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    work: [],  //任务
    action: 'todo',
    isShowDetail: false,//是否显示详情
    isShowWorkLog:false,
    userNo:''
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '任务详情'
    })
    let that = this;
    let queryBean = JSON.parse(options.queryBean);
    let action = options.action;
    let userNo = wx.getStorageSync("userNo");
    let loginUser = wx.getStorageSync("loginUser");
    console.log("login:" + userNo + ",workUser:" + queryBean.responsibleNum);
    that.setData({
      work: queryBean,
      action: action,
      userNo:userNo,
      loginUser: loginUser
    })
  },
  showdetail: function (e) {
    let that = this
    let showDetaliTmp = that.data.isShowDetail == false ? true : false
    this.setData({
      isShowDetail: showDetaliTmp
    })
  },
  showWorkLog: function (e) {
    let that = this
    let isShowWorkLog = that.data.isShowWorkLog == false ? true : false
    this.setData({
      isShowWorkLog: isShowWorkLog
    })
  },
  todoWork: function () {
    let that = this;
    //将对象转为string
    var queryBean = JSON.stringify(that.data.work)
    wx.navigateTo({
      // url: '../works/todo/todo?queryBean=' + queryBean,
      url: '../todo/todo?queryBean=' + queryBean
    })
  },
  resolveWork:function(){
    let that = this;
    var queryBean = JSON.stringify(that.data.work);
    let url = '../resolve/resolve?queryBean='+queryBean;
    //判断是否领导
    // if (that.data.loginUser.type=='领导'){
    //   url = '../resolveleader/resolveleader?queryBean=' + queryBean;
    // }
    wx.navigateTo({
      // url: '../works/todo/todo?queryBean=' + queryBean,
      url: url 
    })
  },
  reviewWork:function(){
    let that = this;
    var queryBean = JSON.stringify(that.data.work)
    wx.navigateTo({
      url: '../review/review?queryBean=' + queryBean
    })
  },
  bindInputRemarkChange:function(e){
    this.setData({
      remark: e.detail.value
    })
  },
  submitWorkLeader:function(){
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
  goBack: function () {
    wx.navigateBack({
      delta: 1
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
