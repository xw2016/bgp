// pages/ContactList/ContactList.js
// 汉字转拼音模块
var pinyinUtils = require('./pinyinUtil.js');

// 用于锚点字母排序
var compare = function(x, y) { //比较函数
  if (x < y) {
    return -1;
  } else if (x > y) {
    return 1;
  } else {
    return 0;
  }
}

// 克隆函数，只复制key、value，其他不复制
function cloneUser(obj) {
  var copy = {};
  if (obj.hasOwnProperty("name")) {
    copy['name'] = obj['name'];
  }
  if (obj.hasOwnProperty('account')) {
    copy['account'] = obj['account'];
  }
  if (obj.hasOwnProperty('id')) {
    copy['id'] = obj['id'];
  }
  return copy;
}

// 复制标签用户
function cloneGroupUser(id, anchor) {
  var copy = {};
  copy['id'] = id;
  copy['anchor'] = anchor;
  return copy;
}

// 根据key，返回数组内相对应的index
function findArrayIndex(array, key, value) {
  if (array == undefined || array.length == 0) {
    return -1;
  }
  for (var i = 0; i < array.length; i++) {
    var subObject = array[i]
    if (subObject[key] == value) //如果要求数据类型也一致，这里可使用恒等号===
      return i;
  }
  return -1;
}

const app = getApp()
Page({
  data: {
    selectedUsers: [{
      id: 111
    }, {
      id: 114
    }, {
      id: 115
    }, {
      id: 113
    }, ],
    userlist: [{
      id: 111,
      account: "zhoujielun",
      name: "周杰伦"
    }, {
      id: 114,
      account: "chenglong",
      name: "成龙"
    }, {
      id: 115,
      account: "wumengda",
      name: "吴孟达"
    }, {
      id: 113,
      account: "adu",
      name: "阿杜"
    }, {
      id: 112,
      account: "luohaoxiang",
      name: "罗昊翔"
    }, {
      id: 101,
      account: "xietingfeng",
      name: "谢霆锋"
    }, {
      id: 102,
      account: "liudehua",
      name: "刘德华"
    }, {
      id: 103,
      account: "huangrihua",
      name: "黄日华"
    }, {
      id: 93,
      account: "liminghua",
      name: "李明华"
    }, {
      id: 92,
      account: "liming",
      name: "李明"
    }, {
      id: 87,
      account: "zhangsan",
      name: "张三",
      userGroupList: [{
        groupId: 2,
        groupName: "管理员"
      }, {
        groupId: 1,
        groupName: "村干部"
      }]
    }, {
      id: 88,
      account: "lisi",
      name: "李四",
      userGroupList: [{
        groupId: 3,
        groupName: "居委会"
      }, {
        groupId: 2,
        groupName: "管理员"
      }]
    }, {
      id: 89,
      account: "zzy",
      name: "周议议",
      userGroupList: [{
        groupId: 4,
        groupName: "妇委"
      }]
    }, {
      id: 90,
      account: "xiewei",
      name: "xiewei01",
      userGroupList: [{
        groupId: 5,
        groupName: "XXX村代表"
      }, {
        groupId: 1,
        groupName: "村干部"
      }, {
        groupId: 6,
        groupName: "宣传部"
      }]
    }],
    scrollTopId: '', // 置顶id
    theShowLetter: "", // 显示锚点字母
    showLetter: false, // 显示锚点
    anchorList: [], // 锚点列表
    searchValue: '',
    showSearchResult: false, // 显示搜索结果、筛选结果
    showLabelView: false, // 显示标签
    theLabels: [],
    selectedGroupIndex: -1,
    theUserMap: {}, // 以锚点为key的用户map
    theUserGroupMap: {}, // 以groupid的key用户Map
    theUserGroupSelectAll: true,
    theSearchUsers: [], // 筛选的、搜索的用户列表
    theSelectedUsers: [], // 选中的用户
    windowWidth: 0,
    windowHeight: 0,
    letterHeight: 0,
    animationindex: -1,
    animationopacity: 0
  },
  onLoad: function() {
    var thePage = this;
  },
  onShow: function() {
    // 生命周期函数--监听页面加载
    var thePage = this;

    // 你要在这里读取用户列表！！！
    // 你要在这里读取用户列表！！！
    // 你要在这里读取用户列表！！！列表格式参照thePage.data.userlist;
    var userlist = thePage.data.userlist;

    // 你要在这里读取已选择的用户列表！！！
    // 你要在这里读取已选择的用户列表！！！
    // 你要在这里读取已选择的用户列表！！！列表格式参照thePage.data.selectedUsers;
    var selectedUsers = thePage.data.selectedUsers;


    var anchorList = thePage.data.anchorList;
    var theLabels = thePage.data.theLabels;
    var theUserMap = thePage.data.theUserMap;

    // 构造用户数据
    var subUser = null;
    var clonedSubUser = null;

    var anchor = null;
    var subUserList = null;
    var subUserGroupList = null;

    var theUserGroupMap = {};
    var groupid = null;
    var groupname = null;
    var subLabel = null;
    var subGroup = null;
    var theSubGroup = null;

    // 循环用户列表
    var pinyin = null;
    for (var i = 0, size = userlist.length; i < size; i++) {
      subUser = userlist[i];
      // 获取锚点
      if (subUser.pinyin == undefined) {
        // 中文名字转拼音，做锚点
        // 中文名字转拼音，做锚点
        // 中文名字转拼音，做锚点
        pinyin = pinyinUtils.convertPinyin(subUser.name);
        anchor = pinyin.substring(0, 1).toUpperCase();
        console.log("PinYin : " + pinyin);
      } else {
        anchor = subUser.pinyin.substring(0, 1).toUpperCase();
      }
      // 构造锚点列表
      if (anchorList.indexOf(anchor) == -1) {
        anchorList.push(anchor);
      }

      // 构造用户数据
      clonedSubUser = cloneUser(subUser);
      clonedSubUser.anchor = anchor;
      clonedSubUser.selected = false;
      if (findArrayIndex(selectedUsers, 'id', clonedSubUser.id) != -1) {
        clonedSubUser.selected = true;
        this.addSelectedUser(clonedSubUser.id, clonedSubUser.account, clonedSubUser.name, anchor);
      }

      // 依据锚点构造二维数据
      if (theUserMap[anchor] == undefined) {
        subUserList = [];
        subUserList.push(clonedSubUser);
        theUserMap[anchor] = subUserList;
      } else {
        subUserList = theUserMap[anchor];
        subUserList.push(clonedSubUser);
        theUserMap[anchor] = subUserList;
      }

      // 构造标签
      if (subUser.userGroupList != undefined) {
        subUserGroupList = subUser.userGroupList;
        for (var j = 0, jsize = subUserGroupList.length; j < jsize; j++) {
          subGroup = subUserGroupList[j];
          groupid = subGroup.groupId;
          groupname = subGroup.groupName;

          subLabel = {};
          subLabel.groupId = groupid;
          subLabel.groupName = groupname;
          // 构造标签
          if (findArrayIndex(theLabels, 'groupId', groupid) == -1) {
            theLabels.push(subLabel);
          }

          // 构造标签数据体
          if (theUserGroupMap[groupid] == undefined) {
            theSubGroup = [];
            var clonedGroupUser = cloneGroupUser(clonedSubUser.id, clonedSubUser.anchor);
            theSubGroup.push(clonedGroupUser);
            theUserGroupMap[groupid] = theSubGroup;
          } else {
            theSubGroup = theUserGroupMap[groupid];
            var clonedGroupUser = cloneGroupUser(clonedSubUser.id, clonedSubUser.anchor);
            theSubGroup.push(clonedGroupUser);
            theUserGroupMap[groupid] = theSubGroup;
          }
        }
      }
    }

    // 锚点排序
    anchorList = anchorList.sort(compare);

    // 设置数据
    thePage.setData({
      anchorList: anchorList,
      theUserMap: theUserMap,
      theLabels: theLabels,
      theUserGroupMap: theUserGroupMap
    });

    // 获取屏幕宽度、高度
    wx.getSystemInfo({
      success: function(res) {
        var winHeight = res.windowHeight - 45;
        var letterHeight = (winHeight) / anchorList.length;
        letterHeight = (letterHeight > 40) ? 40 : letterHeight;
        thePage.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight,
          letterHeight: letterHeight
        });
      }
    })
    return;
  },
  // 点击通讯录选择用户
  selectUser: function(e) {
    var index = e.currentTarget.dataset['index'];
    var anchor = e.currentTarget.dataset['anchor'];

    var theUserMap = this.data.theUserMap;
    var subUser = theUserMap[anchor][index];
    subUser.selected = !subUser.selected;

    if (subUser.selected) {
      this.addSelectedUser(subUser.id, subUser.account, subUser.name, subUser.anchor, true);
    } else {
      this.removeSelectedUser(subUser.id, subUser.account, subUser.name, subUser.anchor);
    }
    theUserMap[anchor][index] = subUser;
    this.setData({
      theUserMap: theUserMap
    });
  },
  // 点击搜索、筛选结果选择用户
  selectSearch: function(e) {
    var anchor = e.currentTarget.dataset['anchor'];
    var searchIndex = e.currentTarget.dataset['index'];
    var id = e.currentTarget.dataset['id'];

    var theSearchUsers = this.data.theSearchUsers;

    var theUserMap = this.data.theUserMap;
    var subUserList = theUserMap[anchor];
    var index = findArrayIndex(subUserList, 'id', id);
    if (index >= 0) {
      var subUser = theUserMap[anchor][index];
      subUser.selected = !subUser.selected;
      if (subUser.selected) {
        this.addSelectedUser(subUser.id, subUser.account, subUser.name, subUser.anchor, true);
      } else {
        this.removeSelectedUser(subUser.id, subUser.account, subUser.name, subUser.anchor);
      }
      theUserMap[anchor][index] = subUser;
      theSearchUsers.splice(searchIndex, 1, subUser);
      this.setData({
        theUserMap: theUserMap,
        theSearchUsers: theSearchUsers
      });
    }
  },
  clickLetter: function(showLetter) {
    this.setData({
      theShowLetter: showLetter,
      showLetter: true,
      scrollTopId: showLetter,
    })
  },
  // 锚点栏触摸开始
  touchstart: function(e) {
    this.setData({
      theShowLetter: e.currentTarget.dataset.letter,
      searchLetterActive: 1,
      showLetter: true
    })
    this.clickLetter(e.currentTarget.dataset.letter);
  },
  // 锚点栏触摸回调
  touchmove: function(e) {
    var thePage = this;
    // console.log('Y轴移动：' + JSON.stringify(e.touches[0].clientY));
    // 通过位移计算锚点
    var clientY = e.touches[0].clientY;
    var letterHeight = this.data.letterHeight;
    var index = ((clientY - 45) / letterHeight).toFixed(0);

    index = (parseInt(index) < 0) ? 0 : parseInt(index);
    index = (parseInt(index) >= this.data.anchorList.length) ? this.data.anchorList.length - 1 : parseInt(index);

    var theLetter = this.data.anchorList[index];
    // 得到锚点，调用点击时间进行锚点定位
    // console.log('index：' + index + ";Letter:" + theLetter);
    var showLetter = this.data.theShowLetter;
    if (showLetter == undefined || theLetter == showLetter) {
      return;
    }
    thePage.clickLetter(theLetter);
    thePage.setData({
      theShowLetter: theLetter
    })
  },
  // 锚点栏触摸结束
  touchend: function(e) {
    this.setData({
      searchLetterActive: 0,
      showLetter: false
    })
  },
  // 点击搜索栏
  OnSearchInputTapped: function(e) {
    this.setData({
      searchInputActive: 1,
      showLabelView: true
    });
  },
  // 搜索栏输入
  OnSearchInput: function(e) {
    this.setData({
      searchValue: e.detail.value
    })
    this.triggerSearchEvent();
  },
  // 取消搜索
  OnInputCancel: function() {
    this.setData({
      selectedGroupIndex: -1,
      searchInputActive: 0,
      showLabelView: false,
      showSearchResult: false,
      searchValue: ''
    });
  },
  // 点击标签
  OnLabelPressed: function(e) {
    var theUserGroupMap = this.data.theUserGroupMap;
    var key = e.currentTarget.dataset['groupid'];
    var index = e.currentTarget.dataset['index'];

    var theUserGroup = theUserGroupMap[key];
    var theUserMap = this.data.theUserMap;
    var theSearchUsers = [];
    var subUser = null;
    var userid = null;
    var anchor = null;
    var selectAll = true;
    for (var i = 0, size = theUserGroup.length; i < size; i++) {
      userid = theUserGroup[i].id;
      anchor = theUserGroup[i].anchor;
      if (theUserMap[anchor] != undefined) {
        var theUserIndex = findArrayIndex(theUserMap[anchor], 'id', userid);
        if (theUserIndex > -1) {
          theSearchUsers.push(theUserMap[anchor][theUserIndex]);
          if (!theUserMap[anchor][theUserIndex].selected) {
            selectAll = false;
          }
        }
      }
    }

    this.setData({
      showSearchResult: true,
      selectedGroupIndex: index,
      theUserGroupSelectAll: selectAll,
      theSearchUsers: theSearchUsers
    });

    // 构造动画
    var animation = wx.createAnimation({
      duration: 10
    });
    var windowWidth = this.data.windowWidth;
    animation.translateX(windowWidth).step();
    this.setData({
      animationData: animation.export(),
      showSearchResult: true

    });
    setTimeout(function() {
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      })
      animation.translateX(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 100)
  },
  // 点击已选用户，用于取消选择
  OnSelectedUserPressed: function(e) {
    var theSelectedUsers = this.data.theSelectedUsers;
    var anchor = e.currentTarget.dataset['anchor'];
    var id = e.currentTarget.dataset['id'];

    var theSearchUsers = this.data.theSearchUsers;
    var searchIndex = -1;
    if (theSearchUsers.length > 0) {
      searchIndex = findArrayIndex(theSearchUsers, 'id', id);
    }

    var theUserMap = this.data.theUserMap;
    var subUserList = theUserMap[anchor];
    var index = findArrayIndex(subUserList, 'id', id);
    if (index >= 0) {
      var subUser = theUserMap[anchor][index];
      subUser.selected = !subUser.selected;
      if (subUser.selected) {
        this.addSelectedUser(subUser.id, subUser.account, subUser.name, subUser.anchor, true);
      } else {
        this.removeSelectedUser(subUser.id, subUser.account, subUser.name, subUser.anchor, true);
      }
      theUserMap[anchor][index] = subUser;
      if (searchIndex > -1) {
        theSearchUsers.splice(searchIndex, 1, subUser);
      }
      this.setData({
        theUserMap: theUserMap,
        theSearchUsers: theSearchUsers
      });
    }
  },
  // 搜索事件触发
  triggerSearchEvent: function() {
    var searchValue = this.data.searchValue;
    if (searchValue == '') {
      this.setData({
        showSearchResult: false,
        showLabelView: true,
        theSearchUsers: []
      });
      return;
    }

    var theUserMap = this.data.theUserMap;
    var theSearchUsers = this.data.theSearchUsers;
    var subUser = null;
    // 遍历二维数据，构造搜索结果
    for (var key in theUserMap) {
      for (var i = 0, size = theUserMap[key].length; i < size; i++) {
        subUser = theUserMap[key][i];
        if (subUser.name.match(searchValue) != null || subUser.account.match(searchValue) != null) {
          if (findArrayIndex(theSearchUsers, 'id', subUser.id) == -1) {
            theSearchUsers.push(subUser);
          }
        } else {
          var index = findArrayIndex(theSearchUsers, 'id', subUser.id);
          if (index >= 0) {
            theSearchUsers.splice(index, 1);
          }
          console.log(JSON.stringify(theSearchUsers));
        }
      }
    }


    this.setData({
      showSearchResult: true,
      theSearchUsers: theSearchUsers
    });
  },
  // 取消标签筛选
  OnLabelCancel: function() {
    var windowWidth = this.data.windowWidth;
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    animation.translateX(windowWidth).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function() {
      animation.translateX(0).step()
      this.setData({
        animationData: animation.export(),
        showSearchResult: false,
        selectedGroupIndex: -1,
        showLabelView: true,
        theSearchUsers: []
      })
    }.bind(this), 200)
  },
  // 添加用户
  addSelectedUser: function(id, account, name, anchor, animated) {
    var thePage = this;
    var user = {};
    user.id = id;
    user.account = account;
    user.name = name;
    user.anchor = anchor;
    var theSelectedUsers = this.data.theSelectedUsers;
    if (findArrayIndex(theSelectedUsers, 'id', id) == -1) {
      theSelectedUsers.push(user);
    }
    if (animated == null || !animated) {
      this.setData({
        theSelectedUsers: theSelectedUsers,
        selectedUserTopId: 's' + user.id,
        animationopacity: 1,
        animationindex: -1
      })
      return;
    }
    this.setData({
      theSelectedUsers: theSelectedUsers,
      animationopacity: 0.3,
      animationindex: theSelectedUsers.length - 1
    })
    // 构造动画
    var animation = wx.createAnimation({
      duration: 100
    });
    animation.opacity(1).step();
    this.setData({
      userAnimation: animation.export(),
      selectedUserTopId: 's' + user.id
    });

    setTimeout(function() {
      thePage.setData({
        animationopacity: 1,
        animationindex: -1
      })
    }.bind(this), 120);

  },
  // 删除用户
  removeSelectedUser: function(id, account, name, anchor, animated) {
    var thePage = this;
    var user = {};
    user.id = id;
    user.account = account;
    user.name = name;
    user.anchor = anchor;
    var theSelectedUsers = this.data.theSelectedUsers;
    var index = findArrayIndex(theSelectedUsers, 'id', id);
    if (index == -1) {
      return;
    }
    if (animated == null || !animated) {
      if (index >= 0) {
        theSelectedUsers.splice(index, 1);
      }
      this.setData({
        theSelectedUsers: theSelectedUsers,
        animationopacity: 1,
        animationindex: -1
      })
      return;
    }
    this.setData({
      animationopacity: 1,
      animationindex: index,
    })
    // 构造动画
    var animation = wx.createAnimation({
      duration: 100
    });
    animation.opacity(0.5).step();
    this.setData({
      userAnimation: animation.export(),
    });
    setTimeout(function() {
      console.log("这里写结束处理程序!!") //官方写法就这样.暂时没有找到相关api.
      if (index >= 0) {
        theSelectedUsers.splice(index, 1);
      }
      thePage.setData({
        theSelectedUsers: theSelectedUsers,
        animationopacity: 1,
        animationindex: -1
      })
    }.bind(this), 120);
  },
  selectAll: function(e) {
    var theUserGroupSelectAll = this.data.theUserGroupSelectAll;
    var groupid = e.currentTarget.dataset['groupid'];
    var theSearchUsers = this.data.theSearchUsers;
    theUserGroupSelectAll = !theUserGroupSelectAll;

    var subUser = null;
    var theUserMap = this.data.theUserMap;
    if (theUserGroupSelectAll) {
      for (var i = 0, size = theSearchUsers.length; i < size; i++) {
        subUser = theSearchUsers[i];
        if (!subUser.selected) {
          var anchor = subUser.anchor;
          var id = subUser.id;
          var searchIndex = i;
          var subUserList = theUserMap[anchor];
          var index = findArrayIndex(subUserList, 'id', id);
          if (index >= 0) {
            var subUser = theUserMap[anchor][index];
            this.addSelectedUser(subUser.id, subUser.account, subUser.name, subUser.anchor);
            subUser.selected = true;
            theUserMap[anchor][index] = subUser;
            theSearchUsers.splice(searchIndex, 1, subUser);
          }
        }
      }
    } else {
      for (var i = 0, size = theSearchUsers.length; i < size; i++) {
        subUser = theSearchUsers[i];
        if (subUser.selected) {
          var anchor = subUser.anchor;
          var id = subUser.id;
          var searchIndex = i;
          var subUserList = theUserMap[anchor];
          var index = findArrayIndex(subUserList, 'id', id);
          if (index >= 0) {
            var subUser = theUserMap[anchor][index];
            this.removeSelectedUser(subUser.id, subUser.account, subUser.name, subUser.anchor);
          }
          subUser.selected = false;
          theUserMap[anchor][index] = subUser;
          theSearchUsers.splice(searchIndex, 1, subUser);
        }
      }
    }

    this.setData({
      theUserMap: theUserMap,
      theSearchUsers: theSearchUsers,
      theUserGroupSelectAll: theUserGroupSelectAll
    });

  },
  // 点击确认按钮!!!
  // 点击确认按钮!!!
  // 点击确认按钮!!!
  OnConfirmBtnPressed: function() {
    console.log("theSelectedUsers" + JSON.stringify(this.data.theSelectedUsers));
  }
})