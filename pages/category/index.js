import regeneratorRuntime from '../../lib/runtime/runtime.js';
import { request } from "../../request/index.js";
// pages/category/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 左边菜单列表的数据
    leftMenuList: [],
    //左边选中的序号
    leftMenuIndex: 0,
    // 右边商品数据
    rightContent: [],
    // 右侧商品的滚动高度设置
    // 由于页面数据还未渲染完成，所以该属性值没有其作用
    scrollTop: 0
  },
  //不在页面展示的数据，可以不用放在data中
  categoryList: [],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /* 
    0.web中的本地存储于小程序中的本地存储的区别
      1.代码方式不同
      web：localStorage.setItem("key","value") localStorage.getItem("key")
      小程序：wx.setStorageSync('key', "value") wx.getStorageSync('key')
      2.存储的时候有没有类型转换
      web：不管存入什么类型的数据，都会调用toString方法，将数据变成字符串再存入
      小程序：不存在类型转换的操作，存入什么类型的数据，获取的就是什么类型的数据
    1.先判断本地存储中有没有旧的数据
    2.没有旧数据，直接发送新的请求
    3.有旧数据并且旧数据没有过期，则使用本地存储中的旧数据即可
    存储格式：{time:Date.now(),data:[...]}
     */
    // 1.获取本地存储中的数据（小程序存在本地存储数据）
    const Cates = wx.getStorageSync('cates');
    // 2.判断
    if (!Cates) {
      // 获取分类列表数据
      this.getCategoryList();
    } else {
      // 判断数据是否过期，过期时间为10s
      if (Date.now() - Cates.time > 1000 * 10) {
        //表示数据已过期，需要重新发送请求
        this.getCategoryList();
      } else {
        // 给data数据赋值，渲染页面
        this.setcates(Cates.data);
      }
    }
  },
  //----------------------请求数据的函数
  // 获取分类数据
  async getCategoryList() {
    /* request({ url: "/categories" }).then(res => {
      // 把接口的数据存储到本地中
      wx.setStorageSync('cates', { time: Date.now(), data: res })
      // 将获取的数据赋值
      this.setcates(res);
    }) */
    const res = await request({ url: "/categories" });
    // 把接口的数据存储到本地中
    wx.setStorageSync('cates', { time: Date.now(), data: res })
    // 将获取的数据赋值
    this.setcates(res);
  },
  //----------------------数据赋值的函数
  setcates(data) {
    this.categoryList = data;
    // 拆分出左边的数据
    const leftMenuList = this.categoryList.map(v => v.cat_name);
    // 拆分出右边的数据
    const rightContent = this.categoryList[0].children;
    this.setData({
      leftMenuList,
      rightContent
    });
  },
  //----------------------事件函数
  changeActive(e) {
    const { index } = e.currentTarget.dataset;
    const rightContent = this.categoryList[index].children;
    this.setData({
      leftMenuIndex: index,
      rightContent,
      scrollTop: 0
    });
  }
})