const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

const goods = db.collection('goods')

const userInfo = db.collection('userInfo')

exports.main = async (event) => {
  const { payData, userId, totalPrice, animalId } = event
  const ids = payData.map(item => item._id)

  /* 1、获取商品余量与用户购买数量进行对比 */
  const { data } = await goods.where({
    _id: db.command.in(ids)
  }).get()

  // 筛选出 购买数量 > 余量的数据
  const noGoods = data.filter(item => {
    const find = payData.find(v => v._id === item._id) // id对等的用户购买的信息数据
    return find && find.num > item.amount
  })

  if(noGoods.length > 0){
    return {
      message: '支付失败，商品不足！',
      code: 0
    }
  }
  /* 1、获取商品余量与用户购买数量进行对比 */

  /* 2、判断余额 */
  const user = await userInfo.doc(userId).get()
  const total = data.reduce((a, b) => {
    const find = payData.find(item => item._id === b._id);
    return a += (b.price * find.num)
  }, 0)

  if(totalPrice != total){
    // 判断数据库价格是否动态变化
    return {
      message: '商品信息发生变化请重新支付',
      code: 0
    }
  }

  if(user.data.money < total){
    return {
      message: '支付失败，余额不足！',
      code: 0
    } 
  }
  /* 2、判断余额 */


  /* 3、更新商品数据库 */
  // 商品购买数量可能不一样，所以需要对每一个商品单独操作，同时还要满足，操作完毕后再返回支付成功
  await userInfo.doc(userId).update({
    data: {
      money: db.command.inc(-total),
      loveValue: db.command.inc(total),
    }
  })

  const updataArray = payData.map(item => goods.doc(item._id).update({
    data: {
      amount: db.command.inc(-item.num)
    }
  }))

  await Promise.allSettled(updataArray)
  /* 3、更新商品数据库 */


  /* 4、生成云养数据 */
  await cloud.callFunction({
    name: 'patchRalse',
    data: {
      userId,
      animalId
    }
  })
  /* 4、生成云养数据 */
  
  return {
    message: '支付成功',
    code: 200
  }
}