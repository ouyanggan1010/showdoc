import regeneratorRuntime from '../../lib/runtime/runtime.js';
import { request } from "../../request/index.js";
import { requestPayment, showToast } from "../../utils/asyncWx.js";
// pages/pay/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressObj: {},//收货地址
    slectGoods: [],//需要支付的商品
    totalPrice: 0,//总价格
    totalNum: 0,//总数量
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取跳转过来的数据
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('acceptDataFromOpenerPage', data => {
      this.setData({
        ...data
      })
    });
  },
  // --------------------事件函数
  // 支付按钮
  /* 1.先判断缓存中有没有token
     2.没有token，跳转到授权页面
     3.有token，。。。。。 */
  async handleOrderPay() {
    try {
      // 判断缓存中有没有token
      const token = wx.getStorageSync('token');
      if (!token) { // token不存在
        // 跳转到授权页面 url: '/pages/auth/index'
        wx.navigateTo({
          url: '/pages/auth/index'
        });
        return;
      }
      // token存在
      // 创建订单
      /* 准备请求头参数，与请求体参数 */
      const header = { Authorization: token };
      const { totalPrice, addressObj, slectGoods } = this.data;
      const goods = slectGoods.map(v => {
        return {
          goods_id: v.goods_id,
          goods_number: v.num,
          goods_price: v.goods_price
        }
      });
      const parames = {
        order_price: totalPrice,
        consignee_addr: addressObj,
        goods
      }
      // 创建订单，获取订单编号
      await request({ url: "/my/orders/create", data: parames, method: "POST" });
      // 因为没有企业支付权限，所以请求是没有返回值的，自己写死一个订单编号，走完流程即可
      const order_number = "oypdingdanbianhao";

      // 预支付
      await request({ url: "/my/orders/req_unifiedorder", data: { order_number }, method: "POST" });
      // 请求不成功，所以自己定义一个res2
      const pay = {
        "timeStamp": "1564730510",
        "nonceStr": "SReWbt3nEmpJo3tr",
        "package": "prepay_id=wx02152148991420a3b39a90811023326800",
        "signType": "MD5",
        "paySign": "3A6943C3B865FA2B2C825CDCB33C5304"
      }

      // 发起微信支付
      // await requestPayment(pay);

      // 查询后台看订单状态是否成功
      await request({ url: "/my/orders/chkOrder", data: { order_number }, method: "POST" });
      const resMsg = {
        "message": "支付成功",
        "meta": {
          "msg": "验证成功",
          "status": 200
        }
      }
      await showToast({ title: "支付成功", icon: "success" });
      // 删除缓存中已选中（已支付）的购物车数据，将新数组从新填充到缓存中
      let cart = wx.getStorageSync('cart');
      const newCart = cart.filter(v => !v.checked);
      wx.setStorageSync('cart', newCart);
      // 跳转到订单页面
      wx.redirectTo({
        url: '/pages/order/index'
      })
    } catch (error) {
      await showToast({ title: "支付失败", icon: "none" })
    }
  },
})