import regeneratorRuntime from '../../lib/runtime/runtime.js';
import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 商品列表切换栏数据
    tabs: [{
      id: 0,
      value: "综合",
      isActive: true
    }, {
      id: 1,
      value: "销量",
      isActive: false
    }, {
      id: 2,
      value: "价格",
      isActive: false
    }],
    // 商品列表数据
    goodsList: [],
    // 是否显示加载栏 0表示显示加载中；1表示暂无数据；2表示都不显示
    isLoading: 2,
    // 页面没有数据
    noMsg: false,
    // 切换栏底部是否加阴影
    shawBool: false
  },
  // 接口需要的数据
  QueryParams: {
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10
  },
  // 商品数据的总页数
  totalPages: 1,
  // 判断是否有下一页数据
  isNestPage: true,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.QueryParams.cid = options.cid;
    this.getGoodsList();
  },
  /* 
   * 生命周期函数--监听用户滑动页面事件
   */
  onPageScroll(options) {
    this.setData({
      shawBool: options.scrollTop ? true : false
    })
  },
  /* 
   * 生命周期函数--监听用户上拉触底事件
   */
  /* 
  1.用户上滑页面，滚动条触底，开始加载下一页数据
    1.1 找到滚动条触底事件
    1.2 判断有没有下一页数据
        1.2.1 获取到总页数 = Math.ceil(总条数 / 页容量)
        1.2.2 获取到当前的页码
        1.2.3 当前页码大于等于总页数，表示没有下一页数据
    1.3 假如没有下一页数据，弹出一个提示框
    1.4 假如还有下一页数据，加载下一页数据
        1.4.1 当前的页码++
        1.4.2 重新发送请求
        1.4.3 对data中的goodsList与请求回来的新数组进行拼接
          1.this.setData({
              goodsList:[...this.data.goodsList,...res.goods]
            });
          2.let { goodsList } = this.data;
            goodsList.push(...res.goods);
            this.setData({
              goodsList
            });
  */
  onReachBottom() {
    // 判断是否有下一页数据
    if (this.isNestPage) {
      // 开始请求下一页数据
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },
  /* 
   * 生命周期函数--监听用户的下拉动作
   */
  /* 
  1.下拉刷新页面
    1.1 触发下拉刷新事件，在页面的.json文件中来气配置，
        "enablePullDownRefresh": true
        "backgroundTextStyle":"dark" //可选
    1.2 重置数据数组
    1.3 重置页码 设置为1
    1.4 重新发送请求
    1.5 数据请求成功后需要手动关闭下拉刷新的等待效果
        wx.stopPullDownRefresh();
  */
  onPullDownRefresh() {
    this.dataRest();
  },

  // --------------------请求函数
  async getGoodsList() {
    // 加载下一页数据的loading是否需要
    let isLoading = 2;
    const res = await request({ url: `/goods/search`, data: this.QueryParams });
    // 得到总页数
    this.totalPages = Math.ceil(res.total / this.QueryParams.pagesize);
    // 得到拼接数组
    const goodsList = [...this.data.goodsList, ...res.goods];

    if (this.QueryParams.pagenum >= this.totalPages) {
      // 没有下一页数据
      isLoading = 1;
      this.isNestPage = false;
    } else {
      isLoading = 0;
      this.isNestPage = true;
    }
    this.setData({
      goodsList,
      isLoading,
      noMsg: goodsList.length ? false : true,
    });
    // 关闭下拉刷新，即使没有调用下拉刷新的效果，直接关闭不会报错
    wx.stopPullDownRefresh();
  },

  // --------------------事件函数
  // 切换栏子元素点击改变样式与内容
  handleTabChange(e) {
    const { index } = e.detail;
    let { tabs } = this.data;
    tabs.forEach((v, i) => {
      return i === index ? v.isActive = true : v.isActive = false
    });
    this.setData({
      tabs
    });
    this.dataRest();
  },
  // ---------------------数据相关
  // 重置data数据，根据参数的不同，重新请求函数
  dataRest() {
    // 重置页码
    this.QueryParams.pagenum = 1;
    // 重置数据
    this.setData({
      goodsList: [],
      isLoading: 2
    });
    // 发送请求
    this.getGoodsList();
  }
})