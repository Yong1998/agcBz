import {getImgList} from '../../apis/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    crossAxisCount: 2,
    crossAxisGap: 4,
    mainAxisGap: 4,
    gridList: [] as any,
    pages: {
        total: 0,
        page: 1,
        size: 10
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad() {
    this.getImgs()
  },

  /**
   * 页面上拉触底事件的处理函数
   */ 
  onReachBottom() { },

  onScrollEnd() {
    this.data.pages.page++
    if(this.data.pages.page * this.data.pages.size >= this.data.pages.total) {
        return
    }
    this.getImgs()
  },

  async getImgs() {
    const res = await getImgList({page: this.data.pages.page, size: this.data.pages.size})
    this.setData({
        gridList: [...this.data.gridList, ...res.data.list],
        pages: {
            ...this.data.pages,
            total: res.data.total
        }
    })
  },

  clickToPre(e: any) {
    const {index} = e.currentTarget.dataset
    const {gridList} = this.data
    wx.navigateTo({
        url: `/pages/preview/index?bg=${gridList[index].img}`,
    })
  }
 
})