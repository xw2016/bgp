const app = getApp()
var util = require('../../utils/util.js');
var msgUtil = require('../../utils/msgUtil.js');

Page({

  data: {
    loadingHidden: true,
    modalHidden: true,
    userInfo: {},
    loginUser: {},
    hasUserInfo: false
  },
  onShow: function() {
    console.log("works onShow");
    this.searchWorksList("todo");
    this.queryWorksDetailReport();
    // this.openLoading();
  },
  openLoading: function () {
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      duration: 5000
    });
  },
  // loadingTap: function () {
  //   this.setData({
  //     loadingHidden: false
  //   });
  //   var that = this;
  //   setTimeout(function () {
  //     that.setData({
  //       loadingHidden: true
  //     });
  //     that.update();
  //   }, 10000);
  // },
  onLoad: function() {
    wx.setNavigationBarTitle({
      title: '任务中心'
    })
    util.initGroup();
    util.initUser();
    debugger
    let loginUser = wx.getStorageSync("loginUser");
    if (loginUser != null) {
      this.setData({
        loginUser: loginUser
      })
    }
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }

  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  queryWorksDetailReport: function() {
    let that = this;
    let url = '/work/queryWorksDetailReport';
    let data = {
      userNo: wx.getStorageSync("userNo")
    };
    let method = 'post';
    util.loadingTap(this);
    util.onSubmit(url, data, method, function(res) {
      if (res.data.retCode != 200) {
        // callback(res);
      } else {
        that.setData({
          loadingHidden: true,
          myReport: res.data.data
        });
      }
    })
  },
  searchWorksList: function(opt) {
    let that = this;
    let url = (opt == 'todo') ? '/work/queryMyTodoWorks' : '/work/queryMyDoneWorks';
    let data = {
      responsibleNum: wx.getStorageSync("userNo")
    };
    let method = 'post';
    util.onSubmit(url, data, method, function(res) {
      that.setData({
        worksList: res.data.data,
        todoLength: res.data.data.length
      });
    });
  },
  gotoWorkList: function(e) {
    
    wx.navigateTo({
      url: '../works/list/list',
    })
    msgUtil.collect(e);
  },
  addWork: function(e) {
    wx.navigateTo({
      url: '../works/add/addfirst',
      // url: '../works/add2/add',
    })
    msgUtil.collect(e);
  },
  applyWork: function (e) {
    wx.navigateTo({
      url: '../works/apply/applyfirst',
    })
    msgUtil.collect(e);
  },
  //我的个人信息
  logout:function(){
    wx.setStorageSync("loginToken", null);
    wx.setStorageSync("userNo", null);
    wx.setStorageSync("loginUser", null);
    app.globalData.userInfo=null;
    wx.navigateTo({
      url: '../index/index',
    })
  },
  //我的积分
  myScore: function() {
    // wx.navigateTo({
    //   url: '../rrtest/pingfen',
    // })
    this.initMyScore();
  },
  modalCandel: function () {
    // do something
    this.setData({
      modalHidden: true
    })
  },
  initMyScore: function() {
    let that = this;
    let url = '/work/queryTalentsReport';
    let method = 'POST';
    let data = {
      responsible: that.data.loginUser.name
    }
    util.loadingTap(this);
    util.onSubmit(url, data, method, function(res) {
      that.setData({
        loadingHidden: true
      })
      if (res.data.retCode != 200) {
        util.openAlert(res.data.msg);
      } else {
        
        let kpiSocres = res.data.data.kpiSocres;
        let socresArr = []
        let socreOne = {}
        for (let k of Object.keys(kpiSocres)) {
          let socre = {
            kpi: k,
            socre: kpiSocres[k]
          };
          if(socre.kpi=='完成情况'){
            socreOne=socre;
          }else{
            socresArr.push(socre);
          }
        }
        socresArr.unshift(socreOne);
        that.setData({
          kpiSocres: socresArr
        });
        that.setData({
          modalHidden: false
        })
      }
      // debugger
    })
  }


})