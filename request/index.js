// 用来计算当前页面异步请求的次数
let ajaxTimes = 0;
export const request = (params) => {
  // 判断请求的url是否带有字符串“/my/”,如果有，则加一个请求头，带参数token
  let header = {...params.header};
  const reg = /^\/my\//;
  const token = wx.getStorageSync('token');
  if (reg.test(params.url) && token) { 
    header['Authorization'] =  token;
  }

  // 每一次异步请求都加一
  ajaxTimes++;
  // 显示加载中的图标，多个请求同事执行，值出现一个loading
  wx.showLoading({
    title: '加载中',
    mask: true
  })

  // 配置公共的url部分，减少代码量
  const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1";
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      // 有重复的，后面的属性值会自动替换前面的属性值
      url: baseUrl + params.url,
      header,
      success(result) {
        resolve(result.data.message)
      },
      fail(error) {
        reject(error)
      },
      complete() { 
        // 每一次异步请求完成后都减一
        ajaxTimes--;
        if (!ajaxTimes) { 
          // 表示是所有异步请求完成
          wx.hideLoading();
        }
      }
    })
  })
}