Page({
  data: {
    userInfo: null
  },

  /* 用户授权 */
  async login(){
    // 1、用户授权获取信息
    const { userInfo: { nickName, avatarUrl } } = await wx.getUserProfile({
      desc: '用于完善会员资料'
    })


    // 2、把当前的用户信息交付给后端，存储生成账号
    const { result: { data } } = await wx.cloud.callFunction({
      name: 'login',
      data: {
        nickName,
        avatarUrl
      }
    })

    // 3、将用户信息进行存储
    wx.setStorageSync('userInfo', data)

    this.setData({
      userInfo: data
    })
  },


  /* 获取用户信息 */
  async getUserInfo(){
    // 用户是否登录
    const data = wx.getStorageSync('userInfo')
    if(data){
      // 登录了，更新数据
      const userInfo = await wx.cloud.database().collection('userInfo').doc(data._id).get()
      this.setData({
        userInfo: userInfo.data
      })
    }
  },

  /* 退出登录 */
  close(){
    wx.clearStorage()
    this.setData({
      userInfo: null
    })
  },

  /* 跳转页面 */
  navigateTo(e){
    wx.navigateTo({
      url: `/pages/${e.currentTarget.dataset.url}/index`,
    })
  },

  /* 进入页面触发 */
  onShow(){
    this.getUserInfo()
  },

  /* 页面初始化后执行，tabbar页面切换时不会销毁 */
  onLoad() {
    this.getTabBar().setData({
      active: 'mine'
    })
  }
})