
function dealFormIds (formId) {
  let formIds = app.globalData.gloabalFomIds;//获取全局数据中的推送码gloabalFomIds数组
  if (!formIds) formIds = [];
  let data = {
    formId: formId,
    expire: parseInt(new Date().getTime() / 1000) + 604800 //计算7天后的过期时间时间戳
  }
  formIds.push(data);//将data添加到数组的末尾
  app.globalData.gloabalFomIds = formIds; //保存推送码并赋值给全局变量
}
module.exports = {
  dealFormIds: dealFormIds
}