/* 每个 tab 页下的自定义 tabBar 组件实例是不同的，所以都会初始化 */
Component({
  /* 组件的初始数据 */
  data: {
    active: 'home'
  },


  /* 组件的方法列表 */
  methods: {
    changeActive({ detail }){  
      /* 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面 */
      wx.switchTab({
        url: `/pages/${detail}/index`,
      })
    }  
  }
})
