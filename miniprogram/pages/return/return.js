// pages/return/return.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rem:'defaulty',
    s1:'',
    s2:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({s1:getApp().globalData.covidrate});
    this.setData({s2:getApp().globalData.username});
    
    var that=this;
    wx.request({
      url: 'http://47.102.200.200:80/v1/test', 
      method:'GET',
      data: {
      },
      header: {
        'content-type':'x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data);
        //this.rem=console.log(res.data);
        that.setData({ rem: res.data });
      },
      fail: function (res){
        console.log(res.data);
        //this.rem = "数据获取失败";
        that.setData({ rem: "fault" });
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
  getreturn: function (){
    this.setData({
      returnmessage:wx.request({url: '47.102.200.200:80/v1/test'})
    })
    
  }
})