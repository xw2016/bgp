const app = getApp();
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stars: [0],
    loadingHidden: true,
    rejectInfo:'',
    modalHidden: true,
    popErrorMsg: '',
    imgList: [],
    kpiList: [],
    files: [] //文件上传
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
    }, 15000);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '任务审核'
    })
    let that = this;
    let queryBean = JSON.parse(options.queryBean);
    this.setData({
      work: queryBean
    });
    let loginUser = wx.getStorageSync("loginUser");
    this.setData({
      loginUser: loginUser
    })
    this.initKpi(queryBean.workId);
    this.initFile(queryBean.workId);
  },
  initKpi: function (worksId) {
    let that = this;
    let url = '/work/queryWorkKpiById';
    let method = 'POST';
    let data = {
      worksId: worksId
    }
    util.onSubmit(url, data, method, function (res) {
      if (res.data.retCode != 200) {
        util.openAlert(res.data.msg);
      } else {
        var kpiList = res.data.data;
        var stars = that.data.stars;
        kpiList.forEach(function (item) {
          // item.index = 0
          // let kpiScores = { id: '', kpiScoreId: '', grade: '', score: '' }
          // item.kpiScores.unshift(kpiScores);
          stars.push(0);
        })
        
        that.setData({
          kpiList: kpiList,
          stars: stars
        })
      }
    })
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
              case 'doc': case 'docx': case 'txt': case 'xls':case 'xlsx':
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
  // modalCandel: function () {
  //   // do something
  //   this.setData({
  //     modalHidden: true
  //   })
  // },
  // 绑定事件，因为不能用this.setData直接设置每个对象的索引值index。
  // 所以用自定义属性current来标记每个数组对象的下标
  bindChange_select: function (ev) {
    console.log('picker发送选择改变，携带值为', ev.detail.value);
    // 定义一个变量curindex 储存触发事件的数组对象的下标
    const curindex = ev.target.dataset.current
    // 根据下标 改变该数组对象中的index值
    this.data.kpiList[curindex].index = ev.detail.value
    // 把改变某个数组对象index值之后的全新objArray重新 赋值给objArray
    this.setData({
      kpiList: this.data.kpiList
    })
  },
  showWorkLog: function (e) {
    let that = this
    let isShowWorkLog = that.data.isShowWorkLog == false ? true : false
    this.setData({
      isShowWorkLog: isShowWorkLog
    })
  },
  //图片点击事件
  imgCheck: function (event) {
    var src = event.currentTarget.dataset.src;//获取data-src
    var imgList = event.currentTarget.dataset.list;//获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  bindRejectInfoChange: function (e) {
    this.setData({
      rejectInfo: e.detail.value
    })
  },
  reject: function () {
    let that = this;
    let url = '/work/rejectAudit';
    let method = 'post';
    if(that.data.rejectInfo==''){
      that.setData({
        popErrorMsg: '审核意见不能为空！'
      })
      return false;
    }
    let workAuditVo = {
      workId: that.data.work.workId,
      workName: that.data.work.workName,
      // worksResultScores: worksResultScores,
      // auditUser: that.data.loginUser,
      rejectInfo: that.data.rejectInfo
    }
    this.loadingTap();
    util.onSubmitJson(url, workAuditVo, method, function (res) {
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
  formSubmit: function () {
    let that = this;
    let url = '/work/submitAudit';
    let method = 'post';
    // let data = that.data;
    let worksResultScores = [];
    let kpiList = that.data.kpiList;
    let kpiFlag = true;
    try {
      kpiList.forEach(function (item) {
        let score = item.kpiScores[item.index];
        if (score == null || score.id == '') {
          that.setData({
            popErrorMsg: '【' + item.kpiName + '】评分不能为空！'
          })
          kpiFlag = false;
          throw new Error("null score");
        }
        worksResultScores.push({
          workId: item.workId,
          workName: item.workName,
          kpiScoreId: score.id,
          kpiName: item.kpiName,
          grade: score.grade,
          score: score.score
        })
      });
    } catch (e) {

    }
    if (kpiFlag == false) {
      return false
    }
    let workAuditVo = {
      workId: that.data.work.workId,
      workName: that.data.work.workName,
      worksResultScores: worksResultScores,
      auditUser: that.data.loginUser
    }
    this.loadingTap();
    this.onSubmit(url, workAuditVo, method, function (res) {
      that.setData({
        loadingHidden: true,
        worksList: res.data.data
      });
      if (res.data.retCode != 200) {
        util.openAlert(res.data.msg);
      } else {
        that.openSuccess();
      }
    });

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
  },
  onSubmit: function (url, data, method, callback) {
    var host = app.globalData.serviceUrl;
    let loginToken = wx.getStorageSync("loginToken");
    let userNo = wx.getStorageSync("userNo");
    console.log('url:' + url);
    console.log('data:' + JSON.stringify(data));
    wx.request({
      url: host + url,
      data: data,
      method: method,
      header: {
        "Content-Type": "application/json;charset=UTF-8"
        , "loginToken": loginToken, "userNo": userNo
      },
      success: function (res) {
        if (res.statusCode == 200) {
          callback(res);
        } else if (res.statusCode == 403) {
          console.log('获取登录信息失败:' + res.data);
          openAlert("未登录，请重新登录！", function () {
            wx.reLaunch({
              url: '../index/index'
            })
          });

        }
      }
    })
  }, 
  //仿淘宝评分
  myStarChoose(e) {
    let that = this;
    var idx = e.currentTarget.dataset.idx;
    
    let star = parseInt(e.target.dataset.star) || 0;
    let stars = that.data.stars;
    stars[idx]=star;
    this.data.kpiList[idx].index = star-1
    // 把改变某个数组对象index值之后的全新objArray重新 赋值给objArray
    this.setData({
      stars: stars,
      kpiList: this.data.kpiList
    });
  }
})