Page({
  data: {
    userId: '',
    showAvatarUrl: '',
    fileID: '',
    nickName: ''
  },

  /* 获取用户信息 */
  async getUserInfo(){
    const { data } = await wx.cloud.database().collection('userInfo').doc(this.data.userId).get()
    this.setData({
      showAvatarUrl: data.avatarUrl,
      fileID: data.avatarUrl,
      nickName: data.nickName
    })
  },

  /* 选择头像 */
  async chooseMedia(){
    const { tempFiles } = await wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera']
    })

    this.setData({
      showAvatarUrl: tempFiles[0].tempFilePath
    })
  },

  /* 修改信息 */
  async submit(){
    const { nickName, userId, fileID, showAvatarUrl } = this.data;
    let bufferAvatarUrl = ''
    wx.showLoading({
      title: '修改中...',
    })

    if(fileID !== showAvatarUrl){
      bufferAvatarUrl = wx.getFileSystemManager().readFileSync(showAvatarUrl)
    }

    const data = await wx.cloud.callFunction({
      name: 'patchUserInfo',
      data: {
        nickName,
        bufferAvatarUrl,
        userId 
      }
    })

    wx.hideLoading()

    wx.navigateBack({
      delta: 1,
    })
  },


  onLoad(){
    const userInfo = wx.getStorageSync('userInfo')
    if(userInfo){
      this.setData({
        userId: userInfo._id
      })

      this.getUserInfo()
    }
  }
})