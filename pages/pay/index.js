Page({
  data: {
    userId: '',
    animalId: '',
    animalInfo: {},
    goodsList: [],
    checked: false,
    totalPrice: 0
  },

  /* 获取宠物信息 */
  async getAnimalInfo(){
    const { animalId } = this.data
    const { data } = await wx.cloud.database().collection('animal').doc(animalId).get();

    this.setData({
      animalInfo: data
    })
  },

  /* 获取商品列表 */
  async getGoodsList(){
    const { result: { data } } = await wx.cloud.callFunction({
      name: 'getGoodsList'
    })

    data.map(item => {
      item.checked = false;
      item.value = 1;
    })

    this.setData({
      goodsList: data
    })
  },

  /* 全选 */
  changeChecked(){
    const { checked, goodsList } = this.data;
    
    goodsList.map((item) => {
      if(item.amount > 0){
        item.checked = !checked;
      }
    })

    this.setData({
      checked: !checked,
      goodsList
    })

    this.countTotal()
  },

  /* 选中数据 */
  setCheckedNum({ detail }){
    const { checked, value, _id } = detail
    const { goodsList } = this.data;
    goodsList.map(item => {
      if(item._id === _id){
        item.checked = checked;
        item.value = value;
      }
    })

    this.countTotal()
  },

  /* 计算价格 */
  countTotal(){
    let { totalPrice, goodsList } = this.data;
    totalPrice = 0
    goodsList.forEach(item => {
      if(item.checked){
        totalPrice += (item.value * item.price)
      }
    })
    this.setData({
      totalPrice: totalPrice * 100
    })
  },

  /* 微信支付 */
  async pay(){
    const { goodsList, userId, totalPrice, animalId } = this.data;

    const payData = goodsList.filter(item => item.checked).map(item => ({
      _id: item._id,
      num: item.value
    }))

    if(payData.length > 0){
      const { result } = await wx.cloud.callFunction({
        name: 'postPay',
        data: {
          payData,
          totalPrice: totalPrice / 100,
          userId,
          animalId
        }
      })

      result.code && wx.redirectTo({
        url: '/pages/cloudRalse/index',
      })

      wx.showToast({
        icon: 'none',
        title: result.message,
      })
    }
  },

  onLoad({ id }){
    const userInfo = wx.getStorageSync("userInfo")
    this.setData({
      animalId: id,
      userId: userInfo._id
    })

    this.getAnimalInfo()
    this.getGoodsList()
  }
})