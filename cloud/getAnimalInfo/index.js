const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event) => {
  const {
    animalId,
    userId
  } = event

  const animalInfo = await db.collection('animal').doc(animalId).get() // 宠物信息

  const userInfo = await db.collection('userInfo').doc(userId).get() // 用户信息

  return {
    data: {
      ...animalInfo.data,
      like: userInfo.data.likeAnimalIds && userInfo.data.likeAnimalIds.includes(animalInfo.data._id)
    }
  }
}