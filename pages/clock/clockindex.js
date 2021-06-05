// pages/clock/clockindex.js

const app = getApp();
var addinfo;
Page({

  /**
   * 页面的初始数据
   */
  data: {
      infos:['1111'],
      ids :['0'],
      addinput:''
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
    this.getUserInfoLists();
  },

  getUserInfoLists: function(){
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
            infos: res.data.text,
            ids: res.data.ids
          })
        }
      }
    })
  },

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  getaddinfo:function(e){
    this.addinfo = e.detail.value;
    wx.setStorageSync("addinfo", e.detail.value);
  },

  addclock: function (e) {
    var that = this;
    if (this.addinfo == null || this.addinfo == '') {
      wx.showToast({
        title: '没有事项添加',
        icon: 'none',
        duration: 1000
      })
    } else {
      wx.request({
        url: app.globalData.hostip + "/optClock",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        data: { opt:'add',text: this.addinfo, name: app.globalData.userInfo.nickName, uid:wx.getStorageSync('userid') },
        complete: function (res) {
          if (res == null || res.data == null) {
            console.error('网络请求失败');
            return;
          }else{
            wx.showToast({
              title: '添加成功',
              icon: 'images/good.png',
              duration: 1000
            })
            that.getUserInfoLists();
            that.setData({
              addinput:''
            })
          }
        }
      })
    }
  },

  delinfo: function(e) {
    var id_index = e.currentTarget.dataset.index;
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认要删除此事项吗？',
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: app.globalData.hostip + "/optClock",
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            data: { opt: 'del', id: that.data.ids[id_index], uid:wx.getStorageSync('userid') },
            complete: function (res) {
              if (res == null || res.data == null) {
                console.error('网络请求失败');
                return;
              } else {
                wx.showToast({
                  title: '删除成功',
                  icon: 'images/good.png',
                  duration: 1000
                })
                that.getUserInfoLists();
              }
            }
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