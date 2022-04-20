Page({
  data: {
    id: null,
    animalInfo: {}
  },

  /* 获取宠物详情 */
  async getAnimalInfo(){
    const { userId, id} = this.data
    let animalInfo = {}
    if(userId){
      // 登录时的操作
      const { result: { data } } = await wx.cloud.callFunction({
        name: 'getAnimalInfo',
        data: {
          animalId: id,
          userId
        }
      })
      animalInfo = data
    } else {
      // 非登录情况的操作
      const { data } = await wx.cloud.database().collection('animal').doc(id).get()
      animalInfo = data
    }

    console.log(animalInfo)

    this.setData({
      animalInfo
    })
  },

  /* 当用户在当且页面分享时触发，可以定义分享内容 */
  onShareAppMessage(){
    const { varieties, age } = this.data.animalInfo
    return {
      title: `${varieties} -- ${age}个月`,
      path: `/pages/animalInfo/index?id=${id}`
    }
  },

  /* 返回首页 */
  backHome(){
    // 想要保留搜索状态 使用switchTab
    wx.switchTab({
      url: '/pages/home/index',
    })
  },

  /* 关注 || 取消关注 */
  async onLike(){
    const { userId, id } = this.data;
    if(!userId){
      wx.showToast({
        icon: 'none',
        title: '登录后，一键关注',
      })
      return;
    }

    wx.showLoading({
      title: '操作中...',
    })

    await wx.cloud.callFunction({
      name: 'patchLike',
      data:{
        userId,
        animalId: id
      }
    })

    this.getAnimalInfo()

    wx.hideLoading()
  },

  /* 进入云养页面 */
  toPay(){
    const { userId, id } = this.data;
    if(userId){
      wx.navigateTo({
        url: `/pages/pay/index?id=${id}`,
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '登录后，开始云养',
      })
    }
  },

  onLoad({ id }){
    const userInfo = wx.getStorageSync("userInfo")
    this.setData({
      id: id,
      userId: userInfo._id
    })

    this.getAnimalInfo()

    /* 显示页面转发按钮 */
    wx.showShareMenu({
      menus: ['shareAppMessage', 'shareTimeline'],
    })
  }
})