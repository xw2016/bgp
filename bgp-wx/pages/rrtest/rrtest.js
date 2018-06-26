// pages/rrtest/rrtest.js
var app = getApp()
Page({
  data: {
    show: ""
  },
  bean_json: function () {
    var that = this;
    wx.request({
      url: 'http://localhost:8080/user/bean2json',
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
        var show = "对象转json username: " + res.data.name + "age: " + res.data.age;
        that.setData({
          show: show
        })
      }
    })
  },
  listbean_json: function () {
    var that = this;
    wx.request({
      url: 'http://localhost:8080/user/listbean2json',
      data: {
        'listuser[0].name': "Hello",
        'listuser[0].age': 18,
        'listuser[1].name': "World",
        'listuser[1].age': 28
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        var show = "list<对象>转json ";
        for (var i = 0; i < res.data.length; i++) {
          show += "username: " + res.data[i].name + "age: " + res.data[i].age;
        }
        that.setData({
          show: show
        })
      }
    })
  },
  mapbean_json: function () {
    var that = this;
    wx.request({
      url: 'http://localhost:8080/user/mapbean2json',
      data: {
        'listuser[0].name': "Hello",
        'listuser[0].age': 48,
        'listuser[1].name': "MINA",
        'listuser[1].age': 58
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        var show = "map<String,Obiect>转json ";
        for (var i = 0; i < res.data.detail.length; i++) {
          show += "username: " + res.data.detail[i].name + "age: " + res.data.detail[i].age;
        }
        that.setData({
          show: show
        })
      }
    })
  },
  json_json: function (res) {
    var that = this;
    console.log(res.detail.value)
    wx.request({
      url: 'http://localhost:8080/user/json2json',
      data: res.detail.value,
      method: 'POST',
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        var show = "表单提交返回json username: " + res.data.name + ",age: " + res.data.age;
        that.setData({
          show: show
        })
      }
    })
  },
  onLoad: function () {
  }
})
