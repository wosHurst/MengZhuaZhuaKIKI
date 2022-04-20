const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event) => {
  const { animalId, userId } = event;

  const { data } = await db.collection('userInfo').doc(userId).get();

  const likeAnimalIds = data.likeAnimalIds || []

  await db.collection('userInfo').doc(userId).update({
    data: {
      likeAnimalIds: likeAnimalIds.includes(animalId) ? likeAnimalIds.filter(item => item !== animalId) : [...likeAnimalIds, animalId]
    }
  })

  return {
    data: {
      message: '操作成功',
      code: 200
    }
  }
}