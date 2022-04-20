const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event) => {
  const { userId, animalId } = event;

  const user = await cloud.database().collection('userInfo').doc(userId).get()

  const cloudRalse = user.data.cloudRalse || []

  const data = await cloud.database().collection('userInfo').doc(userId).update({
    data: {
      cloudRalse: Array.from(new Set([...cloudRalse, animalId]))
    }
  })

  return {
    data
  }
}