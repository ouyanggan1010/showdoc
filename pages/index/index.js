//Page Object
Page({
  data: {
    //轮播图数组
    swiperList:[]
  },
  //页面开始加载的时候触发
  onLoad: function(options){
    //1.发送异步请求获取轮播图数据
    wx.request({
      url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
      method: 'GET',
      success: (result)=>{
        console.log(result)
      }
    });
  },
  onReady: function(){
    
  },
  onShow: function(){
    
  },
  onHide: function(){

  },
  onUnload: function(){

  },
  onPullDownRefresh: function(){

  },
  onReachBottom: function(){

  },
  onShareAppMessage: function(){

  },
  onPageScroll: function(){

  },
  //item(index,pagePath,text)
  onTabItemTap:function(item){

  }
});