import regeneratorRuntime from'../../lib/runtime/runtime.js';
import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {}
  },
  goodsInfo: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { goods_id } = options;
    this.getGoodsDetail(goods_id);
  },
  //----------------------请求数据的函数
  // 获取商品的详情数据
  async getGoodsDetail(goods_id) { 
    const res = await request({ url: "/goods/detail", data: { goods_id } });
    this.goodsInfo = res;
    const obj = {
      pics: res.pics,
      goods_price: res.goods_price,
      goods_name: res.goods_name,
      /* 如果有在某些机型上面不能识别的图片格式，例如：webp
      1.让后台更改，正常操作是这种方式
      2.前端将所有webp文件的后缀名全部替换成jpg或png格式的，前提是后台也有jpg或png格式的图片 */
      goods_introduce: res.goods_introduce.replace(/\.webp/g,'.jpg')
    }
    this.setData({
      goodsObj: obj
    })
  },
  //----------------------事件函数
  // 预览轮播大图
  previewImage(e) { 
    const { url } = e.currentTarget.dataset;
    const urls = this.goodsInfo.pics.map(item => item.pics_big);
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls // 需要预览的图片http链接列表
    })
  },
  // 加入购物车
  /* 1.绑定点击事件
     2.获取缓存中的购物车数据 数组格式 
     3.先判断当前商品是否已经存在于购物车
     4.已经存在，修改商品数据，执行购物车数量++，重新填充到缓存当中
     5.不存在与购物车数组中，直接给购物车数组添加一个新元素，带上购买数量属性num，重新填充到缓存当中
     6.弹出提示
  */
  handleCartAdd(e) { 
    let cart = wx.getStorageSync('cart') || [];
    const index = cart.findIndex(v => v.goods_id === this.goodsInfo.goods_id);
    if (index === -1) {
      // 不存在购物车中
      this.goodsInfo.num = 1;
      // 购物车选中状态
      this.goodsInfo.checked = false;
      cart.push(this.goodsInfo)
    } else { 
      // 存在购物车中
      cart[index].num++;
    }
    wx.setStorageSync('cart', cart);
    // 弹框提示
    wx.showToast({
      title: '添加成功',
      icon: 'success',
      mask: true
    })
  }
})