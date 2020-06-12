import regeneratorRuntime from '../../lib/runtime/runtime.js';
import { getSetting, openSetting, chooseAddress, showModal, showToast } from "../../utils/asyncWx.js";
// pages/cart/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressObj: {},//收货地址
    cartArry: [],//购物车
    allchecked: false,//全选按钮的状态
    totalPrice: 0,//总价格
    totalNum: 0,//总数量
    changeBox: true,//修改数量的弹框
  },
  /**
   * 生命周期函数--监听页面加载，加载过一次之后，会缓存页面，不会再执行了
   */
  onLoad() {

  },
  /**
   * 生命周期函数--监听页面显示，每次打开页面都会执行
   */
  onShow() {
    // 获取本地存储中的地址数据；把数据设置给data中的变量；
    //使用onShow是因为选择收货地址后回到当前页面，onLoad不会再执行了，但是onShow会执行
    const address = wx.getStorageSync('address') || {};
    //购物车数据
    let cartArry = wx.getStorageSync('cart') || [];
    this.setData({
      addressObj: address
    });
    // 计算总价格与总数量
    this.totalPriceNum(cartArry);
  },
  /**
   * 生命周期函数--监听页面关闭，每次打开页面都会执行
   */
  onHide() {
    this.setData({
      changeBox: false
    });
  },
  //----------------------事件函数
  //计算总价格与总数量的函数，全选按钮的设置，以及将购物车数据存储到data与缓存中
  totalPriceNum(cartArry) {
    //获取全选按钮的值，空数组调用every方法，返回值为true；every方法是数组的条件全部满足就会返回true，否则是false
    const isCheck = cartArry.length ? cartArry.every(v => v.checked) : false;
    let totalPrice = 0, totalNum = 0;
    cartArry.forEach(v => {
      if (v.checked) {
        totalNum += v.num;
        totalPrice += Number(v.num) * Number(v.goods_price);
      }
    });
    this.setData({
      totalNum,
      totalPrice,
      allchecked: isCheck,
      cartArry
    })
    // 将购物车数据设置回缓存中
    wx.setStorageSync('cart', cartArry);
  },
  // 全选与反选
  /* 1.全选复选框绑定事件
     2.获取data中的全选变量，allchecked
     3.直接取反 allchecked = !allchecked
     4.遍历购物车数组，让商品的选中状态跟随allchecked变化而变化
     5.把购物车数组和allchecked重新设置回data，把购物车数据重新设置回缓存
     6.不用设置allchecked回data中，因为单个checkbox触发，会重新计算全选按钮的状态 */
  handleAllCheck() {
    let { allchecked, cartArry } = this.data;
    allchecked = !allchecked;
    cartArry.forEach(v => v.checked = allchecked);
    // 重置价格与全选按钮，并更新data购物车数据，将购物车设置回缓存中
    this.totalPriceNum(cartArry);
  },
  // 单个checkbox选择函数
  handleCheck(e) {
    let checkArr = e.detail.value;
    const { cartArry } = this.data;
    cartArry.forEach(v1 => {
      const bool = checkArr.some(v2 => v1.goods_id == v2);
      v1.checked = bool;
    })
    // 重置价格与全选按钮，并更新data购物车数据，将购物车设置回缓存中
    this.totalPriceNum(cartArry);
  },
  // 商品数量的编辑功能
  /* 1.给 “+” “-” 绑定同一个点击事件，通过自定义属性来区分
     2.“+”  自定义属性值“+1”； “-” 自定义属性值“-1”
     3.传递被点击的商品id
     4.获取data中购物车的数据，来获取需要被修改的商品对象
     5.直接修改商品对象的数量，num
     6.更新data购物车数据与缓存中购物车数据，并充值总数量与总价格，全选this.totalPriceNum(cart) */
  // 用户购物车变成1了，则弹框提示删除
  async handleItemNumEdit(e) {
    const { id, operation } = e.currentTarget.dataset;
    // 获取购物车数组
    let { cartArry } = this.data;
    // 选择要修改的商品的索引，findIndex对空数组返回的是-1
    const index = cartArry.findIndex(v => v.goods_id === id);
    let num = cartArry[index].num;
    const totalNum = cartArry[index].goods_number;
    const bool = operation > 0 ? 0 <= num && num < totalNum : 1 < num && num <= totalNum;
    if (bool) {
      cartArry[index].num += operation;
      // 重置价格与全选按钮，并更新data购物车数据，将购物车设置回缓存中
      this.totalPriceNum(cartArry);
    } else {
      if (operation < 0) {
        const res = await showModal({ title: "删除提示", content: "确定要将这个商品删除？" });
        if (res.confirm) {
          cartArry.splice(index, 1);
          // 重置价格与全选按钮，并更新data购物车数据，将购物车设置回缓存中
          this.totalPriceNum(cartArry);
        }
      } else {
        await showToast({
          title: '不能增加了呦~',
          icon: "none"
        })
      }
    }
  },
  // 结算按钮
  /* 1.判断有没有收获地址
     2.判断用户有没有选购商品
     3.经过以上的验证，跳转到支付页面，并将数据带过去 */
  async handlePay() {
    const { addressObj, cartArry, totalPrice, totalNum } = this.data;
    // 判断是否有收货地址
    if (!addressObj.userName) {
      await showToast({
        title: '收获地址不能为空哦~',
        icon: "none"
      })
      return;
    }
    // 判断是否有选中商品，filter对空数组返回值为空数组
    const slectGoods = cartArry.filter(v => v.checked)
    if (slectGoods.length <= 0) {
      await showToast({
        title: '还没选中商品哦~',
        icon: "none"
      })
      return;
    }
    wx.navigateTo({
      url: '/pages/pay/index',
      success: (res) => {
        res.eventChannel.emit('acceptDataFromOpenerPage', { addressObj, slectGoods, totalPrice, totalNum })
      }
    })
  },
  //----------------------请求函数
  // 获取收货地址
  /* 1.绑定点击事件
     2.获取用户对小程序所授予获取地址的权限状态，scope
       2.1假设用户点击获取收货地址的提示框，点击了确定，authSetting scope.address
          scope=true 直接调用获取收货地址
       2.2假设用户点击获取收货地址的提示框，点击了取消
          scope=false 
       2.3假设用户从来没有点击过收货地址，第一次点击时
          scope=undefined 直接调用获取收货地址
          2.3.1诱导用户打开授权界面 
          2.3.2当用户重新给予获取地址权限的时候，获取收货地址
     3.将获取到的地址存入到本地存储中
   */
  async handleAddress() {
    try {
      // 获取权限状态
      const resGet = await getSetting();
      const scopeAddress = resGet.authSetting["scope.address"];
      if (scopeAddress === false) {
        // 重新打开权限选择
        await openSetting();
      }
      // 打开收货地址
      const resAddress = await chooseAddress();
      wx.setStorageSync('address', resAddress);
    } catch (error) {
      console.log(error)
    }
    /* wx.getSetting({
      success: (res) => {
        // 获取权限状态 属性名很怪异的时候，都要使用[字符串]的形式来获取属性值
        const scopeAddress = res.authSetting["scope.address"];
        console.log(scopeAddress)
        if (scopeAddress || scopeAddress == undefined) {
          wx.chooseAddress({
            success (res) {
              this.setData({
                addressObj: resAddress
              })
            }
          })
        }else{ 
          //调起客户端小程序设置界面，返回用户设置的操作结果。设置界面只会出现小程序已经向用户请求过的权限
          wx.openSetting({
            success (res) {
              wx.chooseAddress({
                success (res) {
                  _this.setData({
                    addressObj: res
                  })
                }
              })
            }
          })
        }
      }
    }) */
  }
})