// pages/returnresult/returnresult.js
const app = getApp()
Page({
  data: {
    motto: '您的新冠阳性概率为',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    answer:'testing',
    winWidth: 0,
    winHeight: 0,
    // tab切换
    currentTab: 0,
    s1:'新冠概率获取失败',
    s2:'您照片身份信息获取失败'
  },
  //事件处理函数
  onReady:function(){
    console.log('onloadcovidrate',getApp().globalData.covidrate);
    this.setData({s1:JSON.parse(  getApp().globalData.covidrate.replace(/'/g,'\"')  ).rate});
    this.setData({s2:JSON.parse(  getApp().globalData.username.replace(/'/g,'\"')  ).name});
  },
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



onLoad: function() {
  var that = this;
  /**
   * 获取系统信息
   */
  wx.getSystemInfo( {

    success: function( res ) {
      that.setData( {
        winWidth: res.windowWidth,
        winHeight: res.windowHeight
      });
    }

  });
},
/**
   * 滑动切换tab
   */
bindChange: function( e ) {
  var that = this;
  that.setData( { currentTab: e.detail.current });
},
/**
 * 点击tab切换
 */
swichNav:function( e ) {
  var that = this;
  if( this.data.currentTab === e.target.dataset.current ) {
    return false;
  } else {
    that.setData( {
      currentTab: e.target.dataset.current
    })
  }
}

})
