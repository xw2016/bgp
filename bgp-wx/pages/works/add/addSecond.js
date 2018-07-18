var app = getApp();
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingHidden: true,
    showDepetment: false,
    showReviewType: false,
    showReview: false,
    resIndex:[0,0],
    revIndex:[0,0],
    checkedResponsible:'',
    checkedResName:'',
    reviewer:{},
    popErrorMsg: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '填写任务信息'
    })
    let queryBean = JSON.parse(options.queryBean);
    // this.initDepartment();
    this.initUserGroupArray();

    //默认审核人
    let loginUser = wx.getStorageSync("loginUser");
    let userlist = wx.getStorageSync("userlist");
    this.setData({
      work: queryBean,
      loginUser: loginUser,
      reviewer: {
        name: loginUser.name, account: loginUser.account},
      userlist: userlist
    })
  },
  hideErrMsg: function () {
    this.setData({
      popErrorMsg: ''
    })
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
  initDepartment: function() {
    let that = this;
    let url = '/work/queryDepartmentList';
    let method = 'POST';
    util.onSubmit(url, null, method, function(res) {
      if (res.data.data == false) {
        util.openAlert(res.data.msg);
      } else {
        var departmentlList = res.data.data;
        // var departMentArr = departMentlList.map(item => {
        //   return item.departmentName;
        // })
        that.setData({
          departmentlList: departmentlList
        })
      }
    })
  },
  showResponsibleType:function(){
    let that = this
    let showResponsibleType = that.data.showResponsibleType == false ? true : false
    this.setData({
      showReviewType: false,
      showDepetment: false,
      showReview: false,
      showResponsibleType: showResponsibleType,
      showResponsible:false
    })
  },
  showResponsible:function(){
    let that = this
    let showResponsible = that.data.showResponsible == false ? true : false
    this.setData({
      showReviewType: false,
      showDepetment: false,
      showReview: false,
      showResponsibleType: false,
      showResponsible: showResponsible
    })
  },
  showReviewType: function() {
    let that = this
    let showReviewType = that.data.showReviewType == false ? true : false
    this.setData({
      showReviewType: showReviewType,
      showDepetment: false,
      showReview: false,
      showResponsibleType:false,
      showResponsible:false
    })
  },
  showReview: function() {
    let that = this
    let showReview = that.data.showReview == false ? true : false
    this.setData({
      showReviewType: false,
      showDepetment: false,
      showReview: showReview,
      showResponsibleType:false,
      showResponsible:false
    })
  },
  showDepartment: function() {
    let that = this
    let showDepetment = that.data.showDepetment == false ? true : false
    this.setData({
      showDepetment: showDepetment,
      showReviewType: false,
      showReview: false,
      showResponsibleType:false,
      showResponsible:false
    })
  },
  // checkResponsibleTypeChange:function(e){  // 责任人类别选择
  //   var checkboxItems = this.checkUserTypeChange(e);
  //   this.setData({
  //     responsibleTypeList: checkboxItems
  //   });
  //   var checkList = this.getCheckedUserType(checkboxItems);
  //   this.setData({
  //     checkedResponsibleType: checkList   //已选择的人员类别
  //   });
  //   var checkGroup = this.initCheckUserTypeUsers();
  //   this.setData({
  //     responsibleList: checkGroup   //可选的人员组
  //   })
  // },
  bindSearchReviewUser:function(e){
    let key = e.detail.value;
    let userList = util.searchUser(key);
    this.setData({
      reviewList: userList   //可选的人员组
    })
  },
  bindSearchResponsibleUser: function (e) {
    let key = e.detail.value;
    let userList = util.searchUser(key);
    this.setData({
      responsibleList: userList   //可选的人员组
    })
  },
  // checkReviewTypeChange:function(e){ //审核人类别选择
  //   var checkboxItems =  this.checkUserTypeChange(e);
  //   this.setData({
  //     reviewTypeList: checkboxItems
  //   });
  //   var checkList = this.getCheckedUserType(checkboxItems);
  //   this.setData({
  //     checkedReviewType: checkList
  //   });
  //   var checkGroup = this.initCheckUserTypeUsers();
  //   this.setData({
  //     reviewList: checkGroup
  //   })
  // },
  checkReviewChange: function (e) {//审核人选择
    var checkboxItems = this.checkUserChange(e,this.data.reviewList);
    this.setData({
      reviewList: checkboxItems
    })
    var checkUsers = this.getCheckedUser(checkboxItems);

    var checkUserNames = '';
    var checkUserNum ='';
    var checkUserArr = checkUsers.split(",");
    if (checkUserArr != '') {
      checkUserArr.forEach(function (item) {
        var name = item.split(":")[1];
        checkUserNames = checkUserNames + "," + name;
      });
    }

    if (checkUserNames != '' && checkUserNames.substr(0, 1) == ",") {
      checkUserNames = checkUserNames.substr(1, checkUserNames.length);
    }
    this.setData({
      checkedReviewName: checkUserNames,
      checkedReview: checkUserNum
    })
  },
  checkResponsibleChange:function(e){//责任人选择
    var checkboxItems = this.checkUserChange(e, this.data.responsibleList);
    this.setData({
      responsibleList: checkboxItems
    })
    var checkUsers = this.getCheckedUser(checkboxItems);
    var checkUserNames ='';
    var checkUserArr = checkUsers.split(",");
    if(checkUserArr!=''){
      checkUserArr.forEach(function (item) {
        var name = item.split(":")[1];
        checkUserNames = checkUserNames + "," + name;
      });
    }

    if (checkUserNames != '' && checkUserNames.substr(0,1)==",") {
      checkUserNames = checkUserNames.substr(1, checkUserNames.length);
    }
    this.setData({
      checkedResponsibleName: checkUserNames,
      checkedResponsible: checkUsers
    })
  },
  checkUserChange: function (e,reviewList){
    console.log('checkReviewChange发生change事件，携带value值为：', e.detail.value);
    var checkboxItems = reviewList,
      values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;
      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].id == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    }
    return checkboxItems;
  },
  checkUserTypeChange: function(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    var checkboxItems = this.data.userTypeList,
      values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;
      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].type == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    }
   return checkboxItems;
  },
  
  checkboxChange: function(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    var checkboxItems = this.data.departmentlList,
      values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;
      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].departmentId == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    }
    this.setData({
      departmentlList: checkboxItems
    });
    var checkedDep = this.getCheckedDep();
    this.setData({
      checkedDep: checkedDep
    })
  },
  getCheckedDep: function() {
    var departmentlList = this.data.departmentlList;
    var checked = '';
    departmentlList.forEach(function(item) {
      if (item.checked == true) {
        checked = checked + "," + item.departmentName;
      }
    });
    if (checked != '') {
      checked = checked.substr(1, checked.length);
    }
    return checked;
  },
  getCheckedUserType: function (list) {
    // var list = this.data.userTypeList;
    var checked = '';
    list.forEach(function(item) {
      if (item.checked == true) {
        checked = checked + "," + item.type;
      }
    });
    if (checked != '') {
      checked = checked.substr(1, checked.length);
    }
    return checked;
  },
  getCheckedUser:function(list){
    var checked = '';
    list.forEach(function (item) {
      if (item.checked == true) {
        checked = checked + "," + item.account+":"+item.name;
      }
    });
    if (checked != '') {
      checked = checked.substr(1, checked.length);
    }
    return checked;
  },
  initCheckUserTypeUsers: function() {
    var userlist = this.data.userlist;
    var list = this.data.userTypeList;
    var userGroup = [];
    list.forEach(function(item) {
      if (item.checked == true) {
        userlist.forEach(function(user) {
            if(user.type==item.type){
              userGroup.push(user);
            }
        })
      }
    });
    return userGroup;
  },
  //人员选择
  initUserGroupArray:function(){
    let that = this;
    let groupList = wx.getStorageSync("groupList");
    let groupArrs = groupList.map(item => { //获取人员组
      return item.groupName;
    });
    var groupArr = util.removeRepeat(groupArrs, null);

    groupArr.unshift('');
    var default_type = groupList[0]['groupName'];
    if (default_type) {
      let userArr = ['请选择'];
      that.setData({
        userGroupArray: [groupArr, userArr],
        reviewerGroupArr: [groupArr, userArr],
        responsibleGroupArr: [groupArr, userArr],
        groupList,
        groupArr,
        userArr
      })
    }
  },
  bindReviewerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let that = this;
    let groupList = that.data.groupList;
    let userGroupArray = that.data.userGroupArray;
    let group = userGroupArray[0][e.detail.value[0]];
    let user = userGroupArray[1][e.detail.value[1]];
    let reviewer = {};

    let userlist = that.data.userlist;
    if (user == '清空') {
      that.setData({
        reviewerGroupArr: userGroupArray,
        revIndex: e.detail.value,
        reviewer: ''

      });
      return false;
    }
    userlist.forEach(function (item) {
      if (user == item.name) {
        reviewer = item;
        return;
      }
    });
    that.setData({
      reviewerGroupArr: userGroupArray,
      revIndex: e.detail.value,
      reviewer: reviewer
    });
  },
  bindResponsibleChange:function(e){
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let that = this;
    let groupList = that.data.groupList;
    let userGroupArray = that.data.userGroupArray;
    let group = userGroupArray[0][e.detail.value[0]];
    let user = userGroupArray[1][e.detail.value[1]];
    let responsible = {};
   
    let userlist = that.data.userlist;

    if (typeof (user) == 'undefined') {
      return false;
    }
    if (user == '清空') {
      that.setData({
        responsibleGroupArr: userGroupArray,
        resIndex: e.detail.value,
        responsible: '',
        checkedResName: '',
        checkedResponsible: ''
      });
      return false;
    }
    if(user =='全选'){
      let users = userGroupArray[1];
      let checkedResName = '';
      let checkedResponsible = '';
      users.forEach(function (resName){

        userlist.forEach(function (item) {
          if (resName == item.name) {
            
            checkedResName = checkedResName != '' ? checkedResName + "," + item.name : '' + item.name;
            let newRes = item.account + ":" + item.name;
            checkedResponsible = checkedResponsible != '' ? (checkedResponsible + "," + newRes) : ('' + newRes);
          }
        });
      })
      that.setData({
        responsibleGroupArr: userGroupArray,
        resIndex: e.detail.value,
        responsible: responsible,
        checkedResName: checkedResName,
        checkedResponsible: checkedResponsible
      });
      
      return false;
    }
    userlist.forEach(function (item) {
      if (user == item.name) {
        responsible = item;
        return;
      }
    });
    let name = that.data.checkedResName;
    if (name.indexOf(responsible.name)==-1){
      let checkedResName = name != '' ? name + "," + responsible.name : '' + responsible.name;
      let eldRes = that.data.checkedResponsible;
      let newRes = responsible.account + ":" + responsible.name;
      let checkedResponsible = eldRes != '' ? (eldRes + "," + newRes) : ('' + newRes);
      that.setData({
        responsibleGroupArr: userGroupArray,
        resIndex: e.detail.value,
        responsible: responsible,
        checkedResName: checkedResName,
        checkedResponsible: checkedResponsible
      });
    }

    
    
  },
  bindResColumnChange:function(e){
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      resIndex: this.data.resIndex,
      userGroupArray: this.data.userGroupArray
    }
    switch (e.detail.column) {
      case 0:
        data.userGroupArray[1] = this.selectUser(data.userGroupArray[0][e.detail.value]);
        data.resIndex[0] = e.detail.value;
        break
      case 1:
        data.resIndex[1] = e.detail.value;;
        console.log("title:" + data.resIndex[1]);
        break;
    }
    this.setData(data);
  },
  bindRevColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      revIndex: this.data.revIndex,
      userGroupArray: this.data.userGroupArray
    }
    switch (e.detail.column) {
      case 0:
        data.userGroupArray[1] = this.selectUser(data.userGroupArray[0][e.detail.value]);
        data.revIndex[0] = e.detail.value;
        break
      case 1:
        data.revIndex[1] = e.detail.value;;
        console.log("title:" + data.revIndex[1]);
        break;
    }
    this.setData(data);
  },
  selectUser: function (group) {
    let that = this;
    let userlist = that.data.userlist;
    let userArr = [];
    if (group != '') {
      userlist.forEach(function (item) {
        let groupList = item.userGroupList
        if (groupList !=null) {
          groupList.forEach(function(g){
            if (g.groupName==group){
              userArr.push(item.name);
            }
          })
        }
      });
      if(userArr.length>0){
        userArr.unshift("全选");
      }
    }else{
      userArr.push('清空');
    }
    return userArr;
  },
  validateForm: function () {
    let wxValidate = app.wxValidate({
      // workName: { required: true },
      // planBeginDate: { required: true },
      // planEndDate: { required: true }
      department: { required: false },
      reviewer: { required: false },
      responsible: { required: false }
    },
      {
        // workName: { required: '请填写任务名称' },
        // planBeginDate: { required: '请选择计划开始日期' },
        // planEndDate: { required: '请选择计划结束日期' }
        department: { required: '请选择所属部门' },
        reviewer: { required: '请选择审核人' },
        responsible: { required: '请选择负责人' }
        
      }
    )
    return wxValidate;
  },
  formSubmit: function(e) {
    let that = this;
    // let validate = this.validateForm();
    // if (!validate.checkForm(e)) {
    //   const error = validate.errorList[0];
    //   that.setData({
    //     popErrorMsg: error.msg
    //   })
    //   return false;
    // };
    let reviewer = that.data.reviewer;
    let responsible = that.data.checkedResponsible;
    if (responsible == '') {
      that.setData({
        popErrorMsg: '请选择负责人'
      })
      return false;
    }
    if (reviewer == '') {
      that.setData({
        popErrorMsg: '请选择审核人'
      })
      return false;
    }
    let url = '/work/release';
    let method = 'post';

    let work = that.data.work;
    let loginUser = wx.getStorageSync("loginUser");
    // work.departments = that.data.checkedDep; //暂时屏蔽
    work.responsibleList=that.data.checkedResponsible;
    // work.reviewer= that.data.checkedReviewName;
    // work.reviewerNum= that.data.checkedReview;
    work.reviewer = that.data.reviewer.name
    work.reviewerNum = that.data.reviewer.account;
    work.creator=loginUser.name;
    work.creatorNum=loginUser.account;
    this.loadingTap();
    util.onSubmitJson(url, work, method, function(res) {
      that.setData({
        loadingHidden: true
      });
      if (res.data.retCode != 200) {
        util.openAlert(res.data.msg);
      } else {
        that.openSuccess();
      }
    });
  },

  goBack: function() {
    util.goBack();
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