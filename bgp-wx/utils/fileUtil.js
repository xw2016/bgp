
const app= getApp();
//查询任务附件
function initFile (that) {
  let url = '/work/queryFileUploadById';
  let method = 'POST';
  let worksId = that.data.work.workId;
  let data = {
    worksId: worksId
  }
  onSubmit(url, data, method, function (res) {
    if (res.data.retCode != 200) {
      openAlert(res.data.msg);
    } else {
      initFileData(that,res.data.data);
    }
  });
}
//初始化页面附件显示数据
function initFileData(that,files) {
  let imgfiles = [];
  let docfiles = [];
  let txtfiles = [];
  let videofiles = [];
  let audiofiles = [];
  let otherfiles = [];
  if (files != null) {
    files.map(item => {
      if (typeof (item.url) == 'undefined') {
        item.url = app.globalData.servicePath + item.pathUrl;
      }
      switch (item.type) {
        case 'jpg':
        case 'jpeg':
          imgfiles.push(item);
          break;
        case 'mp3':
        case 'm4a':
        case 'aac':
          audiofiles.push(item);
          break;
        case 'doc':
        case 'docx':
        case 'txt':
        case 'xls':
        case 'xlsx':
          docfiles.push(item);
          break;
        case 'mp4':
          videofiles.push(item)
          break
        default:
          otherfiles.push(item);
      }
    });
    that.setData({
      files: files,
      imgfiles: imgfiles,
      docfiles: docfiles,
      videofiles: videofiles,
      audiofiles: audiofiles,
      otherfiles: otherfiles
    });
  }
}
//文件查看
function bindFileDown(that,e) {
  // var that = this;
  that.loadingTap();
  wx.downloadFile({
    url: e.currentTarget.id,
    success: function (res) {
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
}
function openActionDoc(that,e) {
  // let that = this;
  wx.showActionSheet({
    itemList: ['查看', '删除'],
    itemColor: '#007aff',
    success(res) {
      if (res.tapIndex === 0) {
        that.bindFileDown(e);
      } else if (res.tapIndex === 1) {
        console.log('删除' + e.currentTarget.id);
        delFileUpload(e.currentTarget.id);
      }
    }
  })
}
//删除文件
function delFileUpload(that,e) {
  // let that = this;
  let url = '/work/delFileUpload';
  let method = 'post';
  let fileId = '';
  let idx = -1;
  let files = that.data.files;

  files.forEach(function (item, index) {
    if (item.url == e) {
      fileId = item.id;
      idx = index;
      return false;
    }
  })

  if (fileId == '' && idx > -1) {
    files.splice(idx, 1);
  } else {
    let data = {
      fileId: fileId
    }
    onSubmit(url, data, method, function (res) {
      if (res.data.retCode != 200) {
        openAlert(res.data.msg);
      } else {
        files.splice(idx, 1);
        initFileData(that,files);
      }
    });
  }

}
//文件上传
function onUploadFile(url, tempFilePaths, name, formData, callback) {
  var host = app.globalData.serviceUrl;
  var uploadImgCount = 0;
  let loginToken = wx.getStorageSync("loginToken");
  for (var i = 0, h = tempFilePaths.length; i < h; i++) {
    if (tempFilePaths[i] == '') {
      return false;
    }
    const uploadTask = wx.uploadFile({
      url: host + '/work/addFileUpload',
      filePath: tempFilePaths[i],
      name: "file",
      header: {
        'content-type': 'application/json;charset=UTF-8', "loginToken": loginToken
      },
      formData: formData,
      success: function (res) {

        let result = JSON.parse(res.data);
        if (result.retCode != 200) {
          console.log('上传文件失败:');
        }
        var fileData = result.data
        console.log(fileData);
        //do something
        //如果是最后一张,则隐藏等待中  
        if (uploadImgCount == tempFilePaths.length) {
          wx.hideToast();
        }
        if (callback != null) {
          fileData.url = tempFilePaths[i - 1];

          callback(fileData);
        }
      }
      ,
      fail: function (res) {
        wx.hideToast();
        wx.showModal({
          title: '错误提示',
          content: '上传图片失败',
          showCancel: false,
          success: function (res) { }
        })
      }
    });
  }
}
//提交
function onSubmit(url, data, method, callback) {
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
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
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
}
//json提交
function onSubmitJson(url, data, method, callback) {
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
}
function openAlert(content, callback) {
  wx.showModal({
    content: content,
    showCancel: false,
    success: function (res) {
      if (res.confirm) {
        // console.log('用户点击确定');
        callback();
      }
    }
  });
}
module.exports = {
  initFile: initFile,
  initFileData: initFileData,
  delFileUpload:delFileUpload,
  onUploadFile: onUploadFile,
  bindFileDown: bindFileDown,
  openActionDoc: openActionDoc
}