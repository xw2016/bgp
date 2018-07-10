const app = getApp()
var util = require('../../utils/util.js');
Page({

  data: {
    modalHidden: true,
    userInfo: {},
    loginUser: {},
    hasUserInfo: false
  },
  onShow: function() {
    console.log("works onShow");
    // this.searchWorksList("todo");
    this.queryWorksDetailReport();
    this.openLoading();
  },
  openLoading: function () {
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      duration: 3000
    });
  },
  onLoad: function() {
    wx.setNavigationBarTitle({
      title: '任务中心'
    })
    util.initGroup();
    util.initUser();
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
      // } else if (this.data.canIUse) {
      //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      //   // 所以此处加入 callback 以防止这种情况
      //   app.userInfoReadyCallback = res => {
      //     this.setData({
      //       userInfo: res.userInfo,
      //       hasUserInfo: true
      //     })
      //   }
      // } else {
      //   // 在没有 open-type=getUserInfo 版本的兼容处理
      //   wx.getUserInfo({
      //     success: res => {
      //       app.globalData.userInfo = res.userInfo
      //       this.setData({
      //         userInfo: res.userInfo,
      //         hasUserInfo: true
      //       })
      //     }
      //   })
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
    util.onSubmit(url, data, method, function(res) {
      if (res.data.retCode != 200) {
        // callback(res);
      } else {
        that.setData({
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
  gotoWorkList: function() {
    wx.navigateTo({
      url: '../works/list/list',
    })
  },
  addWork: function() {
    wx.navigateTo({
      url: '../works/add/addfirst',
    })
  },
  myScore: function() {
    // wx.navigateTo({
    //   url: '../works/report/report',
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
    util.onSubmit(url, data, method, function(res) {
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
          if(socre.kpi=='工作情况'){
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