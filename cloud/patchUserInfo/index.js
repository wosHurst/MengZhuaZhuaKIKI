const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event) => {
  const { nickName, userId, bufferAvatarUrl  } = event

  let userData = {
    nickName
  }

  if(bufferAvatarUrl){
    const userInfo = await cloud.database().collection('userInfo').doc(userId).get()

    const { fileID } = await cloud.uploadFile({
      cloudPath: `avatarUrl/头像_${userId}_${Number(new Date())}.jpg`, 
      fileContent: Buffer.from(bufferAvatarUrl),
    })

    // 删除头像
    await cloud.deleteFile({
      fileList: [userInfo.data.avatarUrl]
    })

    userData.avatarUrl = fileID
  }
  
  const data = await cloud.database().collection('userInfo').doc(userId).update({
    data: {
      ...userData
    }
  })

  return {
    data
  }
}