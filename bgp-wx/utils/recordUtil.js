import fileUtil from 'fileUtil'
const app = getApp();

//初始化录音管理器
function initRecorderManager(that) {
  // let that = this;
  that.recorderManager = wx.getRecorderManager();
  that.recorderManager.onError(function () {
    that.tip("录音失败！")
    cleanRecord(that);
    countTime(that);
  });
  that.recorderManager.onStop(function (res) {
    that.setData({
      src: res.tempFilePath
    })
    console.log(res.tempFilePath)
  });
  that.innerAudioContext = wx.createInnerAudioContext();
  that.innerAudioContext.onError((res) => {
    that.tip("播放录音失败！")
  })
}
//录音文件操作：收听，删除
function openAudio(that,e) {
  // let that = this;
  wx.showActionSheet({
    itemList: ['收听', '删除'],
    itemColor: '#007aff',
    success(res) {
      if (res.tapIndex === 0) {
        that.innerAudioContext.src = e.currentTarget.id;
        that.innerAudioContext.play()
      } else if (res.tapIndex === 1) {
        console.log('删除' + e.currentTarget.id);
        fileUtil.delFileUpload(that,e.currentTarget.id);
      }
    }
  })
}
//开始录音
function startRecord(that) {
  // let that = this
  that.setData({
    record: 'end',
    second: 0,
    secondShow: 0
  })
  that.recorderManager.start({
    format: 'aac'
  });
  countTime(that);
}
//暂停录音
function pauseRecord(that) {
  that.recorderManager.pause()
}
function resumeRecord(that) {
  recorderManager.resume()
}
// 停止录音
function stopRecord(that) {
  // let that = this
  that.setData({
    record: 'play',
    second: -1
  })
  that.recorderManager.stop()
  countTime(that)
}
//播放录音
function playRecord (that) {
  // var that = this;
  var src = that.data.src;
  if (src == '') {
    that.tip("请先录音！")
    return;
  }
  that.innerAudioContext.src = that.data.src;
  that.innerAudioContext.play()
}
//重新录音，清空原来录音
function cleanRecord(that) {
  // let that = this;
  // that.stopRecord();
  that.setData({
    src: '',
    record: 'start',
    secondShow: 0
  })

  // util.countTime(that);
}
//上传录音
function loadingRecord(that) {
  // let that = this;
  var src = that.data.src;
  if (src == '') {
    return false;
  }
  var tempFilePaths = [src];

  let loginToken = wx.getStorageSync("loginToken");
  let userNo = wx.getStorageSync("userNo");
  let formData = {
    "workId": that.data.work.workId,
    "workName": that.data.work.workName,
    "creator": userNo,
    "fileType": that.data.work.fileType
  };
  that.loadingTap();
  fileUtil.onUploadFile(null, tempFilePaths, "file", formData, function (e) {
    that.setData({
      files: that.data.files.concat(e),
      loadingHidden: true
    });
    fileUtil.initFileData(that,that.data.files);
    that.modalCandel();
  });

}

function formateTime2(seconds) {
  return [
    // parseInt(seconds / 60 / 60), //时
    parseInt(seconds / 60 % 60), //分
    parseInt(seconds % 60)
  ].join(":").replace(/\b(\d)\b/g, "0$1");
}

function countTime(that) { //计时器
  var second = that.data.second;
  if (second == -1) {
    that.setData({
      second: 0
      // secondShow: formateTime2(0)
    })
    clearTimeout(that.data.timer);
    return;
  }
  that.setData({
    timer: setTimeout(function () {
      that.setData({
        second: second + 1,
        secondShow: formateTime2(second + 1)
      })
      countTime(that);
    }, 1000)
  })

}
module.exports = {
  initRecorderManager: initRecorderManager,
  startRecord: startRecord,
  stopRecord: stopRecord,
  playRecord: playRecord,
  cleanRecord: cleanRecord,
  loadingRecord: loadingRecord,
  openAudio: openAudio
}