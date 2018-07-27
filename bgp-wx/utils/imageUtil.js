import fileUtil from 'fileUtil';
const app = getApp();

//图片上传
function chooseImage(that,e) {
  wx.chooseImage({
    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success: function (res) {
      //上传文件
      var tempFilePaths = res.tempFilePaths;

      var uploadImgCount = 0;
      let loginToken = wx.getStorageSync("loginToken");
      let userNo = wx.getStorageSync("userNo");
      let formData = {
        "workId": that.data.work.workId,
        "workName": that.data.work.workName,
        "creator": userNo,
        "fileType": that.data.work.fileType
      };
      fileUtil.onUploadFile(null, tempFilePaths, "file", formData, function (e) {
        that.setData({
          files: that.data.files.concat(e),
          imgfiles: that.data.imgfiles.concat(e)
        });
      });

      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
      // let imgFileArr =res.tempFilePaths;
      // imgFileArr.forEach(function(item){
      //   that.setData({
      //     imgfiles: that.data.imgfiles.concat({url:item})
      //   });
      // })
     
    }
  })
}
//图片查看、删除操作
function openActionImag(that,e) {
  // let that = this;
  let imgfileUrl =[];
  let imgfiles = that.data.imgfiles;
  imgfiles.forEach(function (item){
    imgfileUrl.push(item.url)
  })
  wx.showActionSheet({
    itemList: ['查看', '删除'],
    itemColor: '#007aff',
    success(res) {
      if (res.tapIndex === 0) {
        wx.previewImage({
          current: e.currentTarget.id, // 当前显示图片的http链接
          urls: imgfileUrl // 需要预览的图片http链接列表
        })
      } else if (res.tapIndex === 1) {
        console.log('删除' + e.currentTarget.id);
        fileUtil.delFileUpload(that,e.currentTarget.id);
      }
    }
  })
}
//图片预览
function previewImage(that,e){
  debugger
  let imgfileUrl = [];
  let imgfiles = that.data.imgfiles;
  imgfiles.forEach(function (item) {
    imgfileUrl.push(item.url)
  })
  wx.previewImage({
    current: e.currentTarget.id, // 当前显示图片的http链接
    urls: imgfileUrl // 需要预览的图片http链接列表
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
  chooseImage: chooseImage,
  openActionImag: openActionImag,
  previewImage: previewImage
}