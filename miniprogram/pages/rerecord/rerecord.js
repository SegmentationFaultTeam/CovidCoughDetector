Page({
  /**
   * 页面的初始数据
   */
  data: {
    wrec:0,
    auth:0,
    itfirst:1,
    debuginfo:'debugmode'
  },
  startit: function (){
    var app = getApp();
    var recrt=app.globalData.recrt;
    wx.createAudioContext('mplayer');
    this.setData({itfirst:0});
    this.setData({wrec:1});
    var that=this;
    const options = {
      duration: 100000,//指定录音的时长，单位 ms
      sampleRate: 16000,//采样率
      numberOfChannels: 1,//录音通道数
      encodeBitRate: 96000,//编码码率
      format: 'mp3',//音频格式，有效值 aac/mp3
      frameSize: 50,//指定帧大小，单位 KB
    }
    wx.authorize({
      scope: 'scope.record',
      success(){
        that.setData({auth:1});
      }
    });
    wx.getRecorderManager().start(options);
    wx.getRecorderManager().onStart(() => {
      console.log('recorder start')
    });
    /*
    wx.getRecorderManager().onError((res) => {
      console.log(res);
    })
    */
  },
  pauseit: function (){
    var app = getApp();
    var recrt=app.globalData.recrt;

    this.setData({wrec:0});
    wx.getRecorderManager().stop();
    wx.getRecorderManager().onStop((res) => {
      this.tempFilePath = res.tempFilePath;
      console.log('停止录音', res.tempFilePath);
      console.log('temprecordpath',res.tempFilePath);
      getApp().globalData.recrt=res.tempFilePath;
      wx.saveFile({
        tempFilePath: res.tempFilePath,
        success (res) {
          getApp().globalData.recrt = res.savedFilePath
        }
      })
      console.log('savedrecordpath',getApp().globalData.recrt);
    })
  },
  playit : function(){
    var app = getApp();
    var recrt=app.globalData.recrt;

    this.audioCtx = wx.createAudioContext('myAudio',recrt);
    this.audioCtx.play();
  },
  submitit:function(){
    var that=this;
    var app = getApp();
    var recrt=app.globalData.recrt;
    wx.showLoading({title: '上传中...',});
    wx.uploadFile({
      url: getApp().globalData.recurl,
      filePath: getApp().globalData.recrt,
      //filePath: '/recordings/long_cough.mp3',
      name: "cough", //name should be the file key in formData,
      method: 'POST',
      timeout:"1000",
      formData: {
      },     
      success: ret => {
        wx.hideLoading();
        var data = ret.data;
        console.log('recording upload success')
        console.log('return header',ret.header);
        console.log('return data',ret.data);
        var coughheader = ret.header;
        getApp().globalData.coughtoken=ret.header.coughtoken;
        if(getApp().globalData.coughtoken==null){
          that.setData({debuginfo:"not coughing correctly"});
          console.log('no coughtoken');
          wx.navigateTo({url: '/pages/rerecord/rerecord'});
          return;
        }
        getApp().globalData.covidrate=ret.data;
        console.log('$$$$$$$$your rate is :',getApp().globalData.covidrate);
        that.setData({debuginfo:JSON.stringify(getApp().globalData.coughtoken)});
        //do something
        wx.navigateTo({url: '/pages/getface/getface'});
      },
      fail: err => {     
        console.log('erroring recording, err=',err,'recrt=',getApp().globalData.recrt);
        this.setData({debuginfo:JSON.stringify(getApp().globalData.recrt)});
        wx.hideLoading();
        wx.showLoading({     
          title: '请求超时',
          duration: 5000
        })
      }
    });
    //wx.navigateTo({url: '/pages/getface/getface'});
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