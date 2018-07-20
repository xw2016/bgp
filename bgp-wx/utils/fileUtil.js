// var util = require('../../../utils/util.js');

// //初始化页面附件显示数据
// function initFileData(this,files) {
//   let imgfiles = [];
//   let docfiles = [];
//   let txtfiles = [];
//   let videofiles = [];
//   let audiofiles = [];
//   let otherfiles = [];
//   if (files != null) {
//     files.map(item => {

//       if (typeof (item.url) == 'undefined') {
//         item.url = app.globalData.servicePath + item.pathUrl;
//       }
//       switch (item.type) {
//         case 'jpg':
//         case 'jpeg':
//           imgfiles.push(item.url);
//           break;
//         case 'mp3':
//         case 'm4a':
//         case 'aac':
//           audiofiles.push(item);
//           break;
//         case 'doc':
//         case 'docx':
//         case 'txt':
//         case 'xls':
//         case 'xlsx':
//           docfiles.push(item);
//           break;
//         case 'mp4':
//           videofiles.push(item)
//           break
//         default:
//           otherfiles.push(item);
//       }
//     });
//     this.setData({
//       files: files,
//       imgfiles: imgfiles,
//       docfiles: docfiles,
//       videofiles: videofiles,
//       audiofiles: audiofiles,
//       otherfiles: otherfiles
//     });
//   }
// }


// module.exports = {
//   initFileData: initFileData
// }