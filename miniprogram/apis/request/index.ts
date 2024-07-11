// 获取当前小程序信息
const { miniProgram } = wx.getAccountInfoSync();
const app = getApp()
const HEADER = {
  Authorization: app.globalData.token || wx.getStorageSync('token') || '',
  appId: miniProgram.appId,
  cn: '',
}

export const CONFIG = {
  appId: miniProgram.appId,
  baseUrl: 'https://test2.yipintemian.com',
  adminBaseUrl: 'https://test2-mbuy-admin.yipintemian.com',
}

export function get(url:string, data: object) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: CONFIG.baseUrl + url,
      data,
      header: HEADER,
      success: resolve,
      fail: reject
    })
  })
}

export function post(url: string, data: object, config: any) {
  return new Promise((resolve, reject) => {
    const header = {
      ...HEADER,
      'content-type': config?.contentType || 'application/json',
    }
    wx.request({
      url: CONFIG.baseUrl + url,
      data,
      method: 'POST',
      header: header,
      success: (res: any) => {
        if(url.includes('wxDdtLogin')) {
          app.globalData.token = res.data.data.token
          wx.setStorage({
            'key': 'token',
            'data': res.data.data.token
          })
        }
        resolve(res)
      },
      fail: reject
    })
  })
}

export function postAdmin(url: string, data?: object, config?: any) {
  return new Promise((resolve, reject) => {
    const header = {
      // ...HEADER,
      Token: app.globalData.adminToken || wx.getStorageSync('adminToken') || '',
      'content-type': config?.contentType || 'application/json',
    }
    wx.request({
      url: CONFIG.adminBaseUrl + url,
      data,
      method: 'POST',
      header: header,
      success: (res: any) => {
        if(url.includes('login')) {
          app.globalData.adminToken = res.data.data.token
          wx.setStorage({
            'key': 'adminToken',
            'data': res.data.data.token
          })
        }
        resolve(res)
      },
      fail: reject
    })
  })
}