//index.js
//获取应用实例
const app = getApp()
var hostip = app.globalData.hostip;
var text;
var moodindex;
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
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
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getTextInfo: function () {
    var that = this
    wx.request({
      // url: "39.106.201.94:8000",
      url: hostip+"/gettext",
      data: "data",
      method: "GET",
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        console.log(res.data)
        let textin
        that.setData({
          textin: res.data
        })
      },
      fail: function (err) {
        console.log(err)
      }

    })
  },
  subtext: function(e){
    let textin
    this.inputTextPost(e.detail.value.textinput)
    // console.log(text)
    // this.setData({
    //   textin: text,
    // })
  },
  inputTextPost: function (text) {
    var that = this;
    wx.request({
      url: hostip+"/posttext", 
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: { textinput: text, name: app.globalData.userInfo.nickName, userid:wx.getStorageSync('userid')},
      complete: function (res) {
        let textin
        let mood
        let butflag
        that.setData({
          textin: res.data.text,
          mood: res.data.mood,
          butflag: 1
        })
        that.getSentence();
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
      }
    })
  },
  moodTextPost: function () {
    var that = this;
    wx.request({
      url: hostip + "/collectmood",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        textinput:wx.getStorageSync("textin"), name: app.globalData.userInfo.nickName, userid: wx.getStorageSync('userid'), mood: wx.getStorageSync('moodsure')},
      complete: function (res) {
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
      }
    })
  },
  listenerInput: function (e) {
    // console.log('Phone=' + e.detail.value);
    this.text = e.detail.value;
    wx.setStorageSync("textin", e.detail.value);
  },
  listeneSub: function () {
    if(this.text == null || this.text == ''){
      wx.showToast({
        title: '什么也没有好为难呀 : (',
        icon: 'none',
        duration: 1000
      })
    }else{
      this.inputTextPost(this.text);
    }
  },
  getMoodLists: function(){
    var that = this;
    // console.log(wx.getStorageSync("moodindex"));
    wx.request({
      url: hostip + "/getmoodlist",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: { moodmodel: wx.getStorageSync("moodindex") },
      complete: function (res) {
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
        wx.setStorageSync("moodlists", res.data.moodlist)
      }
    })
  },
  getMoodList: function(){
    var that = this;
    wx.request({
      url: hostip + "/getmoodmodel",
      data: "data",
      method: "GET",
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        // console.log(res.data)
        wx.setStorageSync('moodlist', res.data.moodlist)
        // console.log("dddd-" + wx.getStorageSync('moodlist'))
      },
      fail: function (err) {
        console.log(err)
      }
    })
    setTimeout(function () {
      wx.showActionSheet({
        itemList: wx.getStorageSync('moodlist'),
        success: function (res) {
          // console.log(res.tapIndex)
          wx.setStorageSync('moodindex', wx.getStorageSync('moodlist')[res.tapIndex]);
          that.getMoodLists();
          setTimeout(function () {
            wx.showActionSheet({
              itemList: wx.getStorageSync('moodlists'),
              success: function (res) {
                console.log(wx.getStorageSync('moodlists')[res.tapIndex]);
                wx.setStorageSync('moodsure', wx.getStorageSync('moodlists')[res.tapIndex]);
                let mood
                let butflag
                that.moodTextPost();
                that.setData({
                  mood: wx.getStorageSync('moodlists')[res.tapIndex],
                  butflag: null
                })
              },
              fail: function (res) {
                console.log(res.errMsg)
              }
            })

          }, 500)
        },
        fail: function (res) {
          console.log(res.errMsg)
        }
      })

    }, 300)
  },
  getSentence: function () {
    var that = this;
    // console.log(wx.getStorageSync("moodindex"));
    wx.request({
      url: hostip + "/getSentence",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: { moodmodel: wx.getStorageSync("moodindex") },
      complete: function (res) {
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
        let sen;
        that.setData({
            sen:res.data.sen
        })
        // console.log(res.data);
        wx.setStorageSync("sen", res.data.sen)
      }
    })
  },
  jumptoclock:function(){
    wx.switchTab({
      url: '/pages/clock/clock',
    })
  }
})
