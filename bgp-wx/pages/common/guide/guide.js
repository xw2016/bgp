const app = getApp();
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    files:[],
    loadingHidden: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '工作指引'
    })
    let queryBean = JSON.parse(options.queryBean);
    this.setData({
      guide: queryBean
    });
    this.initFile(queryBean.typeId);
  },
 //初始化附件
  initFile: function (typeId) {
    let that = this;
    let url = '/work/queryGuideFileById';
    let method = 'POST';
    // let worksId = that.work.workId;
    let data = {
      typeId: typeId
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
              case 'doc': case 'docx': case 'txt': case 'xls': case 'xlsx':
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

  previewImage: function (e) {
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
  }
})