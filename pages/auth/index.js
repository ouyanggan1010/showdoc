import regeneratorRuntime from '../../lib/runtime/runtime.js';
import { login, showToast } from "../../utils/asyncWx.js";
import { request } from "../../request/index.js";
// pages/auth/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  // -----------------事件函数
  // 得到用户信息
  async handleGetUserInfo(e) {
    if (e.detail.encryptedData) {
      try {
        // 获取用户token需要的用户信息
        const { encryptedData, iv, rawData, signature } = e.detail;
        // 获取小程序登录成功后的code值 执行wx.login
        const { code } = await login();
        const dataObj = { encryptedData, iv, rawData, signature, code };
        // 发送请求，将这五个参数传递过去，并获取token
        const res = await request({ url: "/users/wxlogin", data: dataObj, method: "POST" });
        // 将token存入到缓存中
        wx.setStorageSync('token', "oyptoken");
        // 返回上一个页面
        wx.navigateBack({
          delta: 1, // n 表示返回上n层
        });
      } catch (error) {
        console.log(error)
      }
    } else {
      await showToast({
        title: '获取用户信息失败',
        icon: 'none'
      })
    }
  }
})