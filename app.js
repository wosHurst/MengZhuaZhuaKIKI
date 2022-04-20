// 小程序逻辑
App({
  onLaunch(){
    wx.cloud.init({
      env: 'pet-3ga75pyzd30c4a28',
      traceUser: true,
    })
  }
})
