//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: []
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
  },
  clickMe: function () {
    wx.request({
      url: "http://localhost:8080/home/hi",
      data: {
        id: 1,
        name: "toBeMN",
        age: 28
      },
      method: 'POST', 
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        var show = "对象转json username: "+res.data.name+"，age: "+res.data.age;
        console.log(show)
      },
      fail: function (err) {
        console.log(err)
      }

    })
  }

})
