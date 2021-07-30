// pages/user/index/index.js

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      nickName: '点击登录',
      avatarUrl: '/images/avatar.png'
    },
    order: {
      unpaid: 0,
      unship: 0,
      unrecv: 0,
      uncomment: 0
    },
    MyMenus: [
      // { url: "/pages/ucenter/collect/collect", pic:"icon_collect.png",name:"商品收藏"},
      // { url: "/pages/ucenter/footprint/footprint", pic: "footprint.png", name: "浏览足迹" },
      // { url: "/pages/groupon/myGroupon/myGroupon", pic: "group.png", name: "我的拼团" },
      // { url: "/pages/ucenter/address/address", pic: "address.png", name: "地址管理" },
      // { url: "/pages/ucenter/feedback/feedback", pic: "feedback.png", name: "意见反馈" },
      { url: "/pages/clock/clock", pic: "clock.png", name: "打卡" },
      { url: "/pages/about/about", pic: "tishi.png", name: "关于我们" }
      ],
      hasLogin: false,
      totalAmount: 0.00
  },

  goLogin() {
    if (!this.data.hasLogin) {
      wx.navigateTo({
        url: "/pages/login/login"
      });
    }
  },

  goOrderIndex(e) {
    if (this.data.hasLogin) {
      let tab = e.currentTarget.dataset.index
      let route = e.currentTarget.dataset.route
      try {
        wx.setStorageSync('tab', tab);
      } catch (e) {

      }
      wx.navigateTo({
        url: route,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      wx.navigateTo({
        url: "/pages/login/login"
      });
    };
  },

   /**
   * 页面跳转
  */
 goPages:function(e){
  if (this.data.hasLogin) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    });
  } else {
    wx.navigateTo({
      url: "/pages/login/login"
    });
  };
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    //获取用户的登录信息
    let userInfo = wx.getStorageSync('userInfo');
    if (app.globalData.hasLogin) {
      this.setData({
        userInfo: userInfo,
        hasLogin: app.globalData.hasLogin
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