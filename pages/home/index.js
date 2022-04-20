Page({
  data: {
    windowHeight: 0,
    swiper: ['../../assets/image/swiper1.jpg', '../../assets/image/swiper2.jpg', '../../assets/image/swiper3.jpg'],
    active: 3,
    tabList: [{
      title: '猫猫',
      id: 3
    }, {
      title: '狗狗',
      id: 4
    }, {
      title: '其他',
      id: 0
    }],
    animalList: [],
    pageSize: 5,
    pageIndex: 1,
    triggered: false
  },

  /* 选择宠物类型 */
  setActive(e){
    this.setData({
      active: e.currentTarget.dataset.id,
      pageIndex: 1,
      animalList: []
    })
    this.getAnimalList()
  },

  /* 上拉加载 */
  scrolltolower(){
    this.setData({
      pageIndex: this.data.pageIndex += 1
    })
    this.getAnimalList()
  },

  /* 下拉刷新 */
  refresherrefresh(){
    this.setData({
      pageIndex: 1,
      animalList: []
    })
    this.getAnimalList()
  },

  /* 获取宠物列表 */
  async getAnimalList(){
    const { active, pageIndex, pageSize, animalList } = this.data
    const { result: { data } } = await wx.cloud.callFunction({
      name: 'getAnimalList',
      data: {
        type: active,
        pageIndex,
        pageSize
      }
    })

    this.setData({
      animalList: Array.from(new Set([...animalList, ...data].map(item => JSON.stringify(item)))).map(item => JSON.parse(item)),
      triggered: false
    })
  },

  onLoad() {
    // 当前页面  this.getTabBar() 等同于 在tabbar页直接写this
    this.getTabBar().setData({
      active: 'home'
    })

    const { windowHeight } = wx.getWindowInfo()

    this.setData({
      windowHeight: windowHeight - 50
    })

    this.getAnimalList()
  }
})