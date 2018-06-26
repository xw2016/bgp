const app = getApp();
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: [],
    kpiList:[]
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
    this.setData({
      work: queryBean
    });
    let loginUser = wx.getStorageSync("loginUser");
    this.setData({
      loginUser: loginUser
    })
    this.initKpi(queryBean.workId);
  },
  initKpi: function (worksId){
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
        kpiList.forEach(function(item){
          item.index=0
        })
        that.setData({
          kpiList: kpiList
        })
      }
    })
  },
  // 绑定事件，因为不能用this.setData直接设置每个对象的索引值index。
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
  //图片点击事件
  imgCheck: function (event) {
    var src = event.currentTarget.dataset.src;//获取data-src
    var imgList = event.currentTarget.dataset.list;//获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  bindRejectInfoChange:function(e){
    this.setData({
      rejectInfo: e.detail.value
    })
  },
  reject:function(){
    let that = this;
    let url = '/work/rejectAudit';
    let method = 'post';
    let workAuditVo = {
      workId: that.data.work.workId,
      workName: that.data.work.workName,
      // worksResultScores: worksResultScores,
      // auditUser: that.data.loginUser,
      rejectInfo: that.data.rejectInfo
    }
    util.onSubmitJson(url, workAuditVo, method, function (res) {
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
    let worksResultScores=[];
    let kpiList = that.data.kpiList;
    kpiList.forEach(function(item){
      let score = item.kpiScores[item.index];
      worksResultScores.push({
        workId: item.workId,
        workName: item.workName,
        kpiScoreId: score.id,
        kpiName: item.kpiName,
        grade:score.grade,
        score: score.score
      })
    });
    let workAuditVo = {
      workId:that.data.work.workId,
      workName:that.data.work.workName,
      worksResultScores: worksResultScores,
      auditUser: that.data.loginUser
    }
  
    this.onSubmit(url, workAuditVo, method, function (res) {
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
  onSubmit:function(url, data, method, callback) {
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
  }
})