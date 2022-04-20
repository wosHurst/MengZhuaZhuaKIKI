Component({
  properties: {
    goodsData: Object
  },

  data: {

  },

  methods: {
    /* 选择商品 */
    changeChecked(){
      const { goodsData } = this.data
      goodsData.checked = !goodsData.checked
      this.setData({
        goodsData
      })

      this.triggerEvent('setCheckedNum', {
        _id: goodsData._id,
        checked: goodsData.checked,
        value: goodsData.value
      })
    },

    /* 计算数量 */
    changeValue(e){
      const { goodsData } = this.data
      goodsData.value = e.detail
      this.setData({
        goodsData
      })

      this.triggerEvent('setCheckedNum', {
        _id: goodsData._id,
        checked: goodsData.checked,
        value: goodsData.value
      })
    }
  }
})
