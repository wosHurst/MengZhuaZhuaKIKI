Component({
  options: {
    multipleSlots: true
  },

  /* 组件的属性列表 */
  properties: {
    animalData: Object
  },

  /* 组件的初始数据 */
  data: {

  },

  /* 组件的方法列表 */
  methods: {
    toInfo(){
      wx.navigateTo({
        url: `/pages/animalInfo/index?id=${this.data.animalData._id}`,
      })
    }
  }
})