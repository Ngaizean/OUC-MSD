const cloud = require('wx-server-sdk');


cloud.init();

// 获取openId云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  console.log(context)
  const wxContext = await cloud.getWXContext()
  return { // 返回数据
    event,
    openid: wxContext.OPENID,
  }

 
}
