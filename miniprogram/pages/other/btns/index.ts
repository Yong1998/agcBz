Page({
  data: {},

  onLoad() {
    wx.navigateTo({
      url: '/pages/other/courseManagement1/index'
    })
  },

  onClick(e:any) {
    const {type} = e.mark
    if (type === '课表管理') {
      wx.navigateTo({
        url: '/pages/other/courseManagement/index'
      })
    } else if (type === '课表编辑') {
      wx.navigateTo({
        url: '/pages/other/courseManagement2/index'
      })
    }
  },
})