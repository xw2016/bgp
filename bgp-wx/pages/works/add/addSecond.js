var app = getApp();
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showDepetment: false,
    showReviewType: false,
    showReview: false,
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
    this.initDepartment();
    util.initUser();
    //默认审核人
    let loginUser = wx.getStorageSync("loginUser");
    this.setData({
      work: queryBean,
      loginUser: loginUser,
      checkedReviewName: loginUser.name,
      checkedReview: loginUser.account,
    })
  },
  hideErrMsg: function () {
    this.setData({
      popErrorMsg: ''
    })
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
  checkResponsibleTypeChange:function(e){  // 责任人类别选择
    var checkboxItems = this.checkUserTypeChange(e);
    this.setData({
      responsibleTypeList: checkboxItems
    });
    var checkList = this.getCheckedUserType(checkboxItems);
    this.setData({
      checkedResponsibleType: checkList   //已选择的人员类别
    });
    var checkGroup = this.initCheckUserTypeUsers();
    this.setData({
      responsibleList: checkGroup   //可选的人员组
    })
  },
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
  checkReviewTypeChange:function(e){ //审核人类别选择
    var checkboxItems =  this.checkUserTypeChange(e);
    this.setData({
      reviewTypeList: checkboxItems
    });
    var checkList = this.getCheckedUserType(checkboxItems);
    this.setData({
      checkedReviewType: checkList
    });
    var checkGroup = this.initCheckUserTypeUsers();
    this.setData({
      reviewList: checkGroup
    })
  },
  checkReviewChange: function (e) {//审核人选择
    var checkboxItems = this.checkUserChange(e,this.data.reviewList);
    this.setData({
      reviewList: checkboxItems
    })
    var checkUsers = this.getCheckedUser(checkboxItems);

    var checkUserNames = '';
    var checkUserNum ='';
    var checkUserArr = checkUsers.split(",");
    checkUserArr.forEach(function (item) {
      checkUserNames = checkUserNames + "," + item.split(":")[1];
      checkUserNum = checkUserNum + "" + item.split(":")[0]
    });
    if (checkUserNames != '') {
      checkUserNames = checkUserNames.substr(1, checkUserNames.length);
      checkUserNum = checkUserNum.substr(1, checkUserNum.length);
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
  validateForm: function () {
    let wxValidate = app.wxValidate({
      // workName: { required: true },
      // planBeginDate: { required: true },
      // planEndDate: { required: true }
      department: { required: true },
      reviewer: { required: true },
      responsible: { required: true }
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
    let validate = this.validateForm();
    
    if (!validate.checkForm(e)) {
      const error = validate.errorList[0];
      that.setData({
        popErrorMsg: error.msg
      })
      return false;
    };

    let url = '/work/release';
    let method = 'post';

    let work = that.data.work;
    let loginUser = wx.getStorageSync("loginUser");
    work.departments = that.data.checkedDep;
    work.responsibleList=that.data.checkedResponsible;

    work.reviewer= that.data.checkedReviewName;
    work.reviewerNum= that.data.checkedReview;
    work.creator=loginUser.name;
    work.creatorNum=loginUser.account;
   
    util.onSubmitJson(url, work, method, function(res) {
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