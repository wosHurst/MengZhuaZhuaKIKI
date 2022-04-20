/* 云函数入口文件 */ 
const cloud = require('wx-server-sdk')

/* 指定云函数环境: 使用云函数前必须指定环境进行初始化 */
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event) => {
  const {  nickName, avatarUrl  } = event
  const { OPENID } = cloud.getWXContext()

  /* 1、初始化集合 */
  const db = cloud.database()

  /* 2、指定集合 */
  const userInfo = db.collection('userInfo')

  /* 3、查询当前用户是否注册过 */
  const { data } = await userInfo.where({
    _openid: OPENID
  }).get()

  if(data.length === 0){
    /* a、 数据库内没有当前用户的信息（注册）*/
    const { _id } = await userInfo.add({
      data: {
        nickName,
        avatarUrl,
        money: 0,
        loveValue: 0,
        message: 0,
        _openid: OPENID
      }
    })

    /* doc: 接受_id快速返回该id的数据 */
    const user = await userInfo.doc(_id).get()

    return {
      data: user.data
    }
  } else {
    /* b、数据库存在当前用户的信息，则直接返回当前用户信息（登录） */
    return {
      data: data[0]
    }
  }
}