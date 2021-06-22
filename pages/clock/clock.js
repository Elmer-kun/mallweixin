// pages/clock/clock.js
const app = getApp();
var clocklen;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    infos:['请添加事项'],
    infoindex:0,
    hisclock:[],
    userInfo: {
      nickName: '点击登录',
      avatarUrl: '/images/avatar.png'
    },
    hasLogin: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    // this.getUserInfoLists();
    // this.gethisclockinfos();
  },

  bindPickerChange: function(e){
    this.setData({
      infoindex: e.detail.value
    })
  },

  goAddClock: function(e){
    if (this.data.hasLogin) {
      wx.navigateTo({
        url: '/pages/clock/clockindex',
      });
    }else{
      wx.navigateTo({
        url: "/pages/login/login"
      });
    }
  },

  getUserInfoLists: function () {
    var that = this;
    wx.request({
      url: app.globalData.hostip + "/optClock",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: { opt: 'se', uid: wx.getStorageSync('userid') },
      complete: function (res) {
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        } else {
          that.setData({
            infos: res.data.text
          })
        }
      }
    })
  },

  leninput: function (e) {
    this.clocklen = e.detail.value;
    wx.setStorageSync("clocklen", e.detail.value);
  },

  subclock: function () {
    var that = this;
    if (this.data.hasLogin) {
      if (this.clocklen == null || this.clocklen == '') {
        wx.showToast({
          title: '时长为0',
          icon: 'none',
          duration: 1000
        })
      } else if (this.data.infos[this.data.infoindex] == '请添加事项'){
        wx.showToast({
          title: '没有添加事项',
          icon: 'none',
          duration: 1000
        })
      } else {
        wx.request({
          url: app.globalData.hostip + "/clockInfo",
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: "POST",
          data: { opt: 'add', text: that.data.infos[that.data.infoindex],c_len: that.clocklen, name: app.globalData.userInfo.nickName, uid: wx.getStorageSync('userid') },
          complete: function (res) {
            if (res == null || res.data == null) {
              console.error('网络请求失败');
              return;
            } else {
              wx.showToast({
                title: '打卡成功',
                icon: 'images/good.png',
                duration: 1000
              })
            }
          }
        })
      }
  }else{
    wx.navigateTo({
      url: "/pages/login/login"
    });
  }
  },

  gethisclockinfos: function () {
    var that = this;
    wx.request({
      url: app.globalData.hostip + "/clockInfo",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: { opt: 'se', uid: wx.getStorageSync('userid') },
      complete: function (res) {
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        } else {
          that.setData({
            hisclock: res.data.text
          })
        }
      }
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    this.getUserInfoLists();
    this.gethisclockinfos();
    //获取用户的登录信息
    if (app.globalData.hasLogin) {
      let userInfo = wx.getStorageSync('userInfo');
      this.setData({
        userInfo: userInfo,
        hasLogin: true
      });
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})