// pages/works/works.js
var com = require('../../../lib/js/common.js')
var util = require('../../../utils/util.js');
var msgUtil = require('../../../utils/msgUtil.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingHidden: true,
    navbar: ['我的待办', '任务查看'],
    action: 'todo',
    currentTab: 0,
    searchKeyword: '', //需要搜索的字符  
    searchSongList: [], //放置返回数据的数组  
    todoworksList: [],
    doneworksList: [],
    isFromSearch: true, // 用于判断searchSongList数组是不是空数组，默认true，空的数组  
    todoPageNum: 1, // 设置加载的第几次，默认是第一次  
    donePageNum: 1,
    callbackcount: 6, //返回数据的个数  
    todoLoading: false, //"上拉加载"的变量，默认false，隐藏 
    doneLoading: false,
    doneLoadingComplete: false,
    todoLoadingComplete: false //“没有数据”的变量，默认false，隐藏 
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
  //   }, 10000);
  // },
  onLoad: function() {
    wx.setNavigationBarTitle({
      title: '任务列表'
    })
    let that = this;
    // this.searchWorksList(that.data.action);
    this.searchWorksPage(that.data.action);


  },
  // searchWorksList: function(opt) {
  //   let that = this;
  //   let url = (opt == 'todo') ? '/work/queryMyTodoWorks' : '/work/queryMyDoneWorks';
  //   let data = {
  //     responsibleNum: wx.getStorageSync("userNo")
  //   };
  //   let method = 'post';
  //   util.loadingTap(this);
  //   util.onSubmit(url, data, method, function(res) {
  //     that.setData({
  //       loadingHidden: true,
  //       worksList: res.data.data
  //     });
  //   });
  // },
  //分页查询
  searchWorksPage: function() {
    let that = this;
    let opt = that.data.action;
    let url = (opt == 'todo') ? '/work/queryMyTodoWorksPage' : '/work/queryMyDoneWorksPage';
    let page = {
      size: that.data.callbackcount,
      current: opt == 'todo' ? that.data.todoPageNum : that.data.donePageNum,
      userNo: wx.getStorageSync("userNo")

    }
    let method = 'post';
    util.loadingTap(this);
    util.onSubmitJson(url, page, method, function(res) {
      
      if (res.data.retCode != 200) {
        util.openAlert(res.data.msg);
      } else {
        let opt = that.data.action;
        if (opt == 'todo') {
          that.setData({
            loadingHidden: true,
            todoworksList: that.data.todoworksList.concat(res.data.data.records),
            todoLoadingComplete: res.data.data.total <= that.data.todoworksList.length ? true : false,
            todoLoading: res.data.data.total > that.data.todoworksList.length ? true : false  //show
          })
        } else {
          that.setData({
            todoLoading: false,
            loadingHidden: true,
            doneworksList: that.data.doneworksList.concat(res.data.data.records),
            doneLoadingComplete: res.data.data.total <= that.data.doneworksList.length ? true : false,
            doneLoading: res.data.data.total > that.data.doneworksList.length ? true : false
          })
        }
      }

    });
  },
  navbarTap: function(e) {
    var action = "";
    var that = this;
    var currentTab = e.currentTarget.dataset.idx;
    if (currentTab == 0) {
      action = "todo";
    } else if (currentTab == 1) {
      action = "done";
    }
    this.setData({
      currentTab: currentTab,
      action: action
    })
    
    // this.searchWorksList(this.data.action);
    if ((action == 'todo' && that.data.todoworksList.length == 0) || (action == 'done' && that.data.doneworksList.length == 0)) {
      this.searchWorksPage();
    }

  },

  //查询详情
  queryDetail: function(e) {
    var that = this
    //拿到点击的index下标
    var idx = e.currentTarget.dataset.idx;
    //将对象转为string
    let opt = that.data.action;
    let worksList = opt == 'todo' ? that.data.todoworksList : that.data.doneworksList;

    var queryBean = JSON.stringify(worksList[idx])
    var work = worksList[idx];
    //草稿，跳到提单第一页界面
    // if (work.status=='000'){
    //   wx.navigateTo({
    //     url: '../works/add/addfirst?queryBean=' + queryBean + '&action=' + that.data.action,
    //   })
    // }
  
    //调到任务详情界面
    wx.navigateTo({
      url: '../detail/detail?queryBean=' + queryBean + '&action=' + that.data.action
    })
    msgUtil.collect(e);
  },
  //输入框事件，每输入一个字符，就会触发一次
  bindKeywordInput: function(e) {
    console.log("输入框事件")
    this.setData({
      searchKeyword: e.detail.value
    })
  },
  //关键字搜索
  fetchSearchList: function() {
    let that = this;
    let opt = 'done';
    let url = (opt == 'todo') ? '/work/queryMyTodoWorksPage' : '/work/queryMyDoneWorksPage';
    that.setData({
      donePageNum:1
    })
    let data = {
      size: 6,
      current: 1,
      userNo: wx.getStorageSync("userNo"),
      searchKeyword: that.data.searchKeyword
    }
    util.onSubmitJson(url, data, "post", function (res) {
      if (res.data.retCode != 200) {
        util.openAlert(res.data.msg);
      } else {
          that.setData({
            todoLoading: false,
            loadingHidden: true,
            doneworksList: res.data.data.records,
            doneLoadingComplete: res.data.data.total <= that.data.doneworksList.length ? true : false,
            doneLoading: res.data.data.total > that.data.doneworksList.length ? true : false
          })
        }
    })
  },
  //点击搜索按钮，触发事件
  keywordSearch: function(e) {
    this.setData({
      searchPageNum: 1, //第一次加载，设置1
      searchSongList: [], //放置返回数据的数组,设为空
      isFromSearch: true, //第一次加载，设置true
      searchLoading: true, //把"上拉加载"的变量设为true，显示
      searchLoadingComplete: false //把“没有数据”设为false，隐藏
    })
    this.fetchSearchList();
  },
  //滚动到底部触发事件
  searchToDoWorksScrollLower: function() {
    
    let that = this;
    let opt = that.data.action;
    if (opt == 'todo' && !that.data.todoLoadingComplete) {
      that.setData({
        todoPageNum: that.data.todoPageNum + 1, //每次触发上拉事件，把searchPageNum+1
        isFromSearch: false //触发到上拉事件，把isFromSearch设为为false
      });
    } else if (opt == 'done' && !that.data.doneLoadingComplete) {
      that.setData({
        donePageNum: that.data.donePageNum + 1, //每次触发上拉事件，把searchPageNum+1
        isFromSearch: false //触发到上拉事件，把isFromSearch设为为false
      });
    }
    that.searchWorksPage();
  }
})