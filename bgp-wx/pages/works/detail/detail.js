const app = getApp();
var util = require('../../../utils/util.js');
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
    files: [] //文件上传
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
    if(action =='done'){
      this.initFile(queryBean.workId);
    }
    this.initSubWork(queryBean.workId);
  },
  bindguide: function () {    
    let that = this;
    let workType = that.data.workType;
    if(workType==''){
      let url = '/work/queryWorkTypeById';
      let method = 'POST';
      let data = {
        typeId: that.data.work.typeId
      }
      util.onSubmit(url, data, method, function (res) {
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
  //初始化附件
  initFile: function (worksId) {
    let that = this;
    let url = '/work/queryFileUploadById';
    let method = 'POST';
    // let worksId = that.work.workId;
    let data = {
      worksId: worksId
    }
    util.onSubmit(url, data, method, function (res) {
      
      if (res.data.retCode != 200) {
        util.openAlert(res.data.msg);
      } else {
        let imgfiles = [];
        let docfiles = [];
        let txtfiles = [];
        let videofiles = [];
        let audiofiles = [];
        let otherfiles = [];
        if (res.data.data != null) {

          res.data.data.map(item => {
            item.url = app.globalData.servicePath + item.pathUrl;
            switch (item.type) {
              case 'jpg': case 'jpeg':
                imgfiles.push(item.url);
                break;
              case 'silk':
                audiofiles.push(item);
                break;
              case 'doc': case 'docx': case 'txt': case 'xls': case 'xlsx':
                docfiles.push(item);
                break;
              // case 'txt':
              //   txtfiles.push(item);
              //   break;
              case 'mp4':
                videofiles.push(item)
                break
              default:
                otherfiles.push(item);

            }
          });
          
          that.setData({
            imgfiles: imgfiles,
            docfiles: docfiles,
            videofiles: videofiles,
            audiofiles: audiofiles,
            otherfiles: otherfiles,
            captchaImage: url
          });
        }
      }
    });
  },
  previewImage: function (e) {
    // this.setData({
    //   current: e.currentTarget.id,
    //   modalHidden: false
    // })
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.imgfiles // 需要预览的图片http链接列表
    })
  },
  bindFileDown: function (e) {
    let that = this;
    that.loadingTap();
    wx.downloadFile({
      url: e.currentTarget.id,
      success: function (res) {
        debugger
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
  modalCandel: function () {
    // do something
    this.setData({
      modalHidden: true
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
  //查询详情
  showSubWorkDetail: function (e) {
    var that = this
    var idx = e.currentTarget.dataset.idx;
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
