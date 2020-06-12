/* getSetting 获取用户的当前设置。返回值中只会出现小程序已经向用户请求过的权限 */
export const getSetting = () => {
    return new Promise((resolve, reject) => {
        wx.getSetting({
            success: (res) => {
                resolve(res)
            },
            fail: (err) => {
                reject(err)
            }
        })
    })
}
/* openSetting 调起客户端小程序设置界面，返回用户设置的操作结果。设置界面只会出现小程序已经向用户请求过的权限 */
export const openSetting = () => {
    return new Promise((resolve, reject) => {
        wx.openSetting({
            success: (res) => {
                resolve(res)
            },
            fail: (err) => {
                reject(err)
            }
        })
    })
}
/* chooseAddress 获取用户收货地址。调起用户编辑收货地址原生界面，并在编辑完成后返回用户选择的地址 */
export const chooseAddress = () => {
    return new Promise((resolve, reject) => {
        wx.chooseAddress({
            success: (res) => {
                resolve(res)
            },
            fail: (err) => {
                reject(err)
            }
        })
    })
}
/* showModal 显示模态对话框 */
export const showModal = paramse => {
    return new Promise((resolve, reject) => {
        wx.showModal({
            ...paramse,
            success: (res) => {
                resolve(res)
            },
            fail: (err) => {
                reject(err)
            }
        })
    })
}
/* showModal 显示消息提示框 */
export const showToast = paramse => {
    return new Promise((resolve, reject) => {
        wx.showToast({
            ...paramse,
            success: (res) => {
                resolve(res)
            },
            fail: (err) => {
                reject(err)
            }
        })
    })
}
/* login 登录 */
export const login = () => {
    return new Promise((resolve, reject) => {
        wx.login({
            success: (res)=>{
                resolve(res)
            },
            fail: (err)=> {
                reject(err)
            }
        })
    })
}
/* requestPayment 微信支付 */
export const requestPayment = parames => {
    return new Promise((resolve, reject) => {
        wx.requestPayment({
            ...parames,
            success: (res)=>{
                resolve(res)
            },
            fail: (err)=> {
                reject(err)
            }
        })
    })
}