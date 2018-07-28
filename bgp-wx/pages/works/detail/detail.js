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
    loadingHidden: true,
    modalHidden: true,
    work: [],  //任务
    subWorkList:[],
    action: 'todo',
    isShowDetail: false,//是否显示详情
    isShowWorkLog:false,
    userNo:'',
    workType:'',
    imgfiles: [],
    files: [], //文件上传
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

    if(action =='todo'){
      //更新任务接收状态
      this.updateWorkStatus(queryBean);
    }
    this.initSubWork(queryBean.workId);
    fileUtil.initFile(this);
    recordUtil.initRecorderManager(this);
  },

  //更新任务接收状态
  updateWorkStatus:function(work){
    
    let that = this;
    let url = '';
    if(work.status=='002'||work.status=='042'){//改为执行接收
      url = '/work/updateWorkReceive'
    } else if (work.status == '004') {//改为审核接收
      url = '/work/updateWorkWaitReceive'
    }
    let method = 'POST';
    let data = {
      worksId: that.data.work.workId
    }
    if(url!=''){
      util.onSubmit(url, data, method, function (res) {
        if (res.data.retCode != 200) {
          // util.openAlert(res.data.msg);
        }
      })
    }
  },
  //查看工作指引
  bindguide: function () {    
    let that = this;
    let workType = that.data.workType;
    if(workType==''){
      let url = '/work/queryWorkTypeById';
      let method = 'POST';
      let data = {
        typeId: that.data.work.typeId
      }
      this.loadingTap();
      util.onSubmit(url, data, method, function (res) {
        that.setData({
          loadingHidden: true
        });
        if (res.data.retCode != 200) {
          util.openAlert(res.data.msg);
        } else {
          var workType = res.data.data;
          that.setData({
            workType: workType
          })
          var queryBean = JSON.stringify(workType)
          wx.navigateTo({
            url: '../../common/guide/guide?queryBean=' + queryBean
          })
        }
      })
    }else{
      var queryBean = JSON.stringify(workType)
      wx.navigateTo({
        url: '../../common/guide/guide?queryBean=' + queryBean
      })
    }
  },
  //初始化子任务
  initSubWork: function (worksId){
    let that = this;
    let url = '/work/queryChildWorkById';
    let method = 'POST';
    // let worksId = that.work.workId;
    let data = {
      worksId: worksId
    }
    util.onSubmit(url, data, method, function (res) {
      debugger
      if (res.data.retCode != 200) {
        util.openAlert(res.data.msg);
      } else {
        let subWorkList = res.data.data;
        if (subWorkList != null) {
          that.setData({
            subWorkList: subWorkList
          });
        }
      }
    });
  },
  
  //文件操作
  previewImage: function (e) {
    imageUtil.previewImage(this,e);
  },
  bindFileDown: function (e) {
   fileUtil.bindFileDown(this,e);
  },
  //录音文件操作：试听
  openAudio: function (e) {
   recordUtil.openAudio2(this,e)
  },
  openActionDoc: function (e) {
    fileUtil.bindFileDown(this, e)
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
  //查询详情
  showSubWorkDetail: function (e) {
    var that = this
    var idx = e.currentTarget.dataset.idx;
    debugger
    //将对象转为string
    var queryBean = JSON.stringify(that.data.subWorkList[idx])

    wx.navigateTo({
      url: '../detail/detail?queryBean=' + queryBean + '&action=done'
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
