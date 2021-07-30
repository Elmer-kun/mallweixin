
var user = require('./utils/user.js');
//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var hostip = "https://boredno.com/wx";
    // var hostip = "http://127.0.0.1:8081";
    // 登录
    wx.login({
      success: function (res) {
        // console.log("res.code=====" + res.code);
        if (res.code) {
          //发起网络请求
          wx.request({
            // url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wxc89dfd93373e0cfd&secret=2084d2c4b8b8e28e00b8f64e2d5df881&grant_type=authorization_code&js_code=' + res.code,
            url: hostip + "/getOpenid",
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            data: { code: res.code },
            complete: function (res) {
              if (res == null || res.data == null) {
                console.error('网络请求失败');
                return;
              }
              // console.log(res.data);
              wx.setStorageSync("userid", res.data.userid)
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      },
      fail: function (err) {
        console.log(err)
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  onShow: function(options) {
    user.checkLogin().then(res => {
      this.globalData.userInfo = wx.getStorageSync('userInfo');
      this.globalData.hasLogin = true;
    }).catch(() => {
      this.globalData.hasLogin = false;
    });
  },
  globalData: {
    userInfo: null,
    hasLogin: false,
    hostip: "http://127.0.0.1:8081"
    // hostip: "https://boredno.com/wx"
  }
})