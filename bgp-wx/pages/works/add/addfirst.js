// pages/works/add/add.js
var app = getApp();
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    work: {},
    workId:null,
    planBeginDate: util.formatTime(new Date()),
    planEndDate: '',
    workTypeArray: [],
    typeIndex: [0, 0],
    workLevelArr: [],
    levelIndex: 0,
    popErrorMsg: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '填写任务信息'
    });
    //获取工作类型数据
    this.initWorkTypeArr();
    // this.initWorkLevel();
    // this.wxValidate = util.validateRule();
  },
  hideErrMsg: function() {
    this.setData({
      popErrorMsg: ''
    })
  },
  initWorkLevel: function() {
    let that = this;
    let url = '/work/queryDictionaryByType';
    let method = 'POST';
    let data = {
      dictionaryType: '任务级别'
    }
    util.onSubmit(url, data, method, function(res) {
      if (res.retCode != 200) {
        util.openAlert(res.data.msg);
      } else {
        var workLevelList = res.data.data;
        var workLevelArr = workLevelList.map(item => {
          return item.dictionaryValue;
        })
        
        workLevelArr.unshift('请选择');
        that.setData({
          workLevelArr: workLevelArr
        })
      }
    })
  },
  initWorkTypeArr: function() {
    let that = this;
    let url = '/work/queryWorkTypeList';
    let method = 'POST';
    util.onSubmit(url, null, method, function(res) {
      if (res.data.data == false) {
        util.openAlert(res.data.msg);
      } else {
        var workTypeList = res.data.data;
        var typeArrS = workTypeList.map(item => { //获取工作类型总类数组
          return item.type;
        });
        var typeArr = util.removeRepeat(typeArrS, null);

        typeArr.unshift('');
        var default_type = workTypeList[0]['type'];
        if (default_type) {
          // var titleArr = workTypeList.map(item => {
          //   return item.title;
          // });
          let titleArr=['请选择'];
          that.setData({
            workTypeArray: [typeArr, titleArr],
            workTypeList,
            typeArr,
            titleArr
          })
        }
      }
    });
  },
  bindWorkName: function(e) {
    this.setData({
      workName: e.detail.value
    })
  },
  bindDescription: function(e) {
    this.setData({
      description: e.detail.value
    })
  },
  bindCreateReson: function(e) {
    this.setData({
      createReson: e.detail.value
    })
  },
  bindPlanBeginDateChange: function(e) {
    this.setData({
      planBeginDate: e.detail.value
    })
  },
  bindPlanEndDateChange: function(e) {
    this.setData({
      // planEndDate: e.detail.value.replace(/-/g, "/")
      planEndDate: e.detail.value
    })
  },
  bindMultiPickerChange: function(e) { //任务类型选择
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let workTypeList = this.data.workTypeList;
    let workTypeArray = this.data.workTypeArray;
    let type = workTypeArray[0][e.detail.value[0]];
    let title = workTypeArray[1][e.detail.value[1]];
    let workType = {};
    workTypeList.forEach(function(item) {
      if (type == item.type && title == item.title) {
        workType = item;
        return;
      }
    });
    this.setData({
      typeIndex: e.detail.value,
      workType: workType
    });
  },
  bindMultiPickerColumnChange(e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      typeIndex: this.data.typeIndex,
      workTypeArray: this.data.workTypeArray
    }
    switch (e.detail.column) {
      case 0:
        data.workTypeArray[1] = this.selectType(data.workTypeArray[0][e.detail.value]);
        data.typeIndex[0] = e.detail.value;
        break
      case 1:
        data.typeIndex[1] = e.detail.value;;
        console.log("title:" + data.typeIndex[1]);
        break;
    }
    this.setData(data);
  },
  selectType: function(type) {
    let that = this;
    let workTypeList = that.data.workTypeList;
    let titleArr = [];
    if (type != null) {
      workTypeList.forEach(function(item) {
        if (item.type == type) {
          titleArr.push(item.title);
        }
      });
    }
    return titleArr;
  },
  bindPickerChange: function(e) { //任务级别
    console.log('picker发送选择改变，携带值为', e.detail.value);
    let workLevelArr = this.data.workLevelArr;
    let workLevel = workLevelArr[e.detail.value];

    this.setData({
      levelIndex: e.detail.value,
      workLevel: workLevel
    })
  },
  bindguide: function() {

    var queryBean = JSON.stringify(this.data.workType)
    wx.navigateTo({
      url: '../../common/guide/guide?queryBean=' + queryBean
    })
  },
  goBack: function() {
    util.goBack();
  },
  validateForm: function() {
    let wxValidate = app.wxValidate({
      workName: {
        required: true
      },
      // workType: {
      //   required: true
      // },
      planBeginDate: {
        required: true
      },
      planEndDate: {
        required: true,
        compareDate: "#planBeginDate"
      },
      reviewer: {
        required: false
      },
      responsible: {
        required: false
      },
      department: {
        required: false
      }
    }, {
      workName: {
        required: '请填写任务名称'
      },
      // workType: {
      //   requitred: '请选择工作类型'
      // },
      planBeginDate: {
        required: '请选择计划开始日期'
      },
      planEndDate: {
        required: '请选择计划结束日期',
        compareDate:'结束日期不能早于开始日期'
      },
      reviewer: {
        required: '请选择审核人'
      },
      responsible: {
        required: '请选择负责人'
      },
      department: {
        required: '请选择所属部门'
      }
    })
    return wxValidate;
  },
  next: function(e) {

    let that = this;
    let validate = this.validateForm();
    if (!validate.checkForm(e)) {
      const error = validate.errorList[0];
      that.setData({
        popErrorMsg: error.msg
      })
      return false;
    };
    
    if (typeof  that.data.workType==='undefined'){
      that.setData({
        popErrorMsg: '请选择工作类型'
      })
      return false;
    }

    if (util.compareDate(util.formatTime(new Date()), that.data.planBeginDate)){
      that.setData({
        popErrorMsg: '开始日期不能早于今天'
      })
      return false;
    }
    if (util.compareDate(that.data.planBeginDate, that.data.planEndDate)){
      that.setData({
        popErrorMsg: '结束日期不能早于开始日期'
      })
      return false;
    }
    this.formSubmit(function(data) {
      var queryBean = JSON.stringify(data)
      wx.navigateTo({
        url: '../add/addSecond?queryBean=' + queryBean
      })
    });
  },
  formSubmit: function(callback) {
    let that = this;
    let url = '/work/add';
    let method = 'post';
    // let data = that.data;
    let data = {
      parentWorkName: '本任务',
      parentId: '0',
      workId:that.data.workId, //判断是否存在/
      workName: that.data.workName,
      description: that.data.description,
      createReason: that.data.createReson,
      planBeginDate: that.data.planBeginDate,
      planEndDate: that.data.planEndDate,
      // departments: that.data.departments,
      level: that.data.workLevel == "请选择" ? "" : that.data.workLevel,
      typeId: that.data.workType.typeId,
      typeName: that.data.workType.title,
      pass: that.data.workType.unifyKpi == 'Y' ? 'Y' : 'N'

    };
    util.onSubmitJson(url, data, method, function(res) {
      if (res.data.retCode != 200) {
        util.openAlert(res.data.msg);
      } else {
        that.setData(res.data.data);
        callback(res.data.data)
      }
    });

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