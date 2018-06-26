// pages/works/works.js
var com = require('../../../lib/js/common.js')
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar: ['我的待办', '我的已办'],
    action: 'todo',
    currentTab: 0,
    searchKeyword: '',  //需要搜索的字符  
    searchSongList: [], //放置返回数据的数组  
    worksList: [],
    isFromSearch: true,   // 用于判断searchSongList数组是不是空数组，默认true，空的数组  
    searchPageNum: 1,   // 设置加载的第几次，默认是第一次  
    callbackcount: 15,      //返回数据的个数  
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false  //“没有数据”的变量，默认false，隐藏 
  },
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '首页'
    })
    let that = this;
    this.searchWorksList(that.data.action);
  },
  searchWorksList: function (opt) {
    let that = this;
    let url = (opt == 'todo') ? '/work/queryMyTodoWorks' : '/work/queryMyDoneWorks';
    let data = { responsibleNum: wx.getStorageSync("userNo") };
    let method = 'post';
    util.onSubmit(url, data, method, function (res) {
      that.setData({
        worksList: res.data.data
      });
    });
  },
  navbarTap: function (e) {
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

    this.searchWorksList(this.data.action);
  },

  //查询详情
  queryDetail: function (e) {
    var that = this
    //拿到点击的index下标
    var idx = e.currentTarget.dataset.idx;
    //将对象转为string
    var queryBean = JSON.stringify(that.data.worksList[idx])

    wx.navigateTo({
      // url: '../works/todo/todo?queryBean=' + queryBean,
      // url: '../works/detail/detail?queryBean=' + queryBean + '&action=' + that.data.action
      url: '../detail/detail?queryBean=' + queryBean + '&action=' + that.data.action
    })
  },
  //输入框事件，每输入一个字符，就会触发一次
  bindKeywordInput: function (e) {
    console.log("输入框事件")
    this.setData({
      searchKeyword: e.detail.value
    })
  },
  //搜索，访问网络
  fetchSearchList: function () {
    let that = this;
    let searchKeyword = that.data.searchKeyword,//输入框字符串作为参数
      searchPageNum = that.data.searchPageNum,//把第几次加载次数作为参数
      callbackcount = that.data.callbackcount; //返回数据的个数
    //访问网络
    com.getSearch(searchKeyword, searchPageNum, callbackcount, function (data) {
      console.log(data)
      //判断是否有数据，有则取数据
      if (data.data.song.curnum != 0) {
        let searchList = [];
        //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加
        that.data.isFromSearch ? searchList = data.data.song.list : searchList = that.data.searchSongList.concat(data.data.song.list)
        that.setData({
          searchSongList: searchList, //获取数据数组
          zhida: data.data.zhida, //存放歌手属性的对象
          searchLoading: true   //把"上拉加载"的变量设为false，显示
        });
        //没有数据了，把“没有数据”显示，把“上拉加载”隐藏
      } else {
        that.setData({
          searchLoadingComplete: true, //把“没有数据”设为true，显示
          searchLoading: false  //把"上拉加载"的变量设为false，隐藏
        });
      }
    })
  },
  //点击搜索按钮，触发事件
  keywordSearch: function (e) {
    this.setData({
      searchPageNum: 1,   //第一次加载，设置1
      searchSongList: [],  //放置返回数据的数组,设为空
      isFromSearch: true,  //第一次加载，设置true
      searchLoading: true,  //把"上拉加载"的变量设为true，显示
      searchLoadingComplete: false //把“没有数据”设为false，隐藏
    })
    this.fetchSearchList();
  },
  //滚动到底部触发事件
  searchScrollLower: function () {
    let that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        searchPageNum: that.data.searchPageNum + 1,  //每次触发上拉事件，把searchPageNum+1
        isFromSearch: false  //触发到上拉事件，把isFromSearch设为为false
      });
      that.fetchSearchList();
    }
  }
})