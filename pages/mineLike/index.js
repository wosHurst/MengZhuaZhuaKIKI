Page({
  data: {
    ageSort: 'desc',
    animalLikeList: [],
    userInfo: ""
  },

  /* 切换排序规则 */
  changeSort(){
    const { ageSort } = this.data
    this.setData({
      ageSort: ageSort === 'desc' ? 'asc' : 'desc'
    })
    this.getLikeList()
  },

  /* 获取宠物信息 */
  async getLikeList(){
    const { userInfo, ageSort } = this.data
    const { result: { data }} = await wx.cloud.callFunction({
      name: 'getLikeList',
      data: {
        id: userInfo._id,
        sort: ageSort
      }
    })

    this.setData({
      animalLikeList: data
    })
  },

  onShow(){
    const userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo
    })
    if(userInfo){
      this.getLikeList()
    }
  }
})