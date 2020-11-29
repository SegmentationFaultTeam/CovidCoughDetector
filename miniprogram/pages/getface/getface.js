//index.js
//获取应用实例
const app = getApp()

Page({
  data:{
    taken:0,
    debuginfo:'debugmode',
  },
  onLoad:function(){
    this.setData({debuginfo:getApp().globalData.coughtoken});
  },
  takePhoto:function() {
    var app = getApp();
    var imgrt=app.globalData.imgrt;
    this.setData({taken:1});
    var that=this;
    const ctx = wx.createCameraContext();
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        console.log('temp photo path:',res.tempImagePath);
        getApp().globalData.imgrt=res.tempImagePath;
        wx.saveFile({
          tempFilePath: res.tempImagePath,
          success (res) {
            console.log('------img save success:',res);
            console.log('----imgpath:',res.savedFilePath);
            getApp().globalData.imgrt = res.savedFilePath;
          },
          fail (res){
            console.log('-----img save file failed:',res);
          }
        })
        /*
        //插入上传代码段
        wx.saveFile({
          tempFilePath:res.tempImagePath,
          success (res) {
            getApp().globalData.imgrt = res.savedFilePath
          }
        })*/
      }
    })
  },
  skipit:function(){
    var app = getApp();
    var imgrt=app.globalData.imgrt;
    wx.navigateTo({url: '/pages/returnresult/returnresult'});
  },
  jumptorecord: function(){
    var app = getApp();
    var that=this;
    var imgrt=getApp().globalData.imgrt;
    var coughtoken=getApp().globalData.coughtoken;
    wx.showLoading({title: '上传中...',});
    wx.uploadFile({
      url: getApp().globalData.imgurl,     
      filePath: 'recordings/timg.jpg',
      //filePath: getApp().globalData.imgrt,     
      name: "figure", //name should be the file key in formData,
      header: {
        coughtoken:coughtoken
      },
      method: 'POST',     
      timeout:"1000",
      formData: {       
      },     
      success: res => {
        console.log('img upload success:',res);
        wx.hideLoading();
        var data = res.data
        getApp().globalData.username=res.data;
        console.log(data)
        //do something
        that.setData({debuginfo:JSON.stringify(res.data)});
        wx.navigateTo({url: '/pages/returnresult/returnresult'});
      },     
      fail: err => {     
        console.log('img upload error:',err);
        console.log('imgrt',getApp().globalData.imgrt);
        that.setData({debuginfo:err});
        wx.hideLoading();
        wx.showToast({
          title: '请求超时',
          icon: 'loading',     
          durantion:"5000"
        })
      }
    });
  },
})
