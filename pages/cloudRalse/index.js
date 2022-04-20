Page({
  data: {
    animalList: [],
    userInfo: "",
    text: ''
  },

  /* 获取宠物信息 */
  async getRalseList(){
    const { userInfo, text } = this.data

    const { result: { data }} = await wx.cloud.callFunction({
      name: 'getRalseList',
      data: {
        id: userInfo._id,
        text
      }
    })

    console.log(data)

    this.setData({
      animalList: data
    })
  },

  onShow(){
    const userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo
    })
    if(userInfo){
      this.getRalseList()
    }
  }
})