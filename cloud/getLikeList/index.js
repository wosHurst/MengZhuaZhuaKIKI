const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event) => {
  const { id, sort } = event;

  /* 获取当前用户信息 */
  const userInfo = await db.collection('userInfo').doc(id).get()

  const animal = db.collection('animal');

  const animalList = await animal.where({
    _id: db.command.in(userInfo.data.likeAnimalIds)
  })
  .orderBy('age', sort)
  .get()

  return {
    data: animalList.data
  }
}