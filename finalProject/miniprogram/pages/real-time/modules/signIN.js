//实现签到模块页面

async function setSignin(that)
{
  //将状态设置为已经签到
  //提请数据库 将当前用户的状态设置为已签到
  const db = wx.cloud.database();
  const _ = db.command;
  try
  {
    const res = await db.collection("detail").doc(that.code_data.data_id).update({
      data:
      {
        signIN : _.push(that.code_data.username)
      }
    });
    that.setData({signinStatus : true});
    console.log("签到成功");
  }
  catch(err)
  {
    console.log("数据库操作失败，失败原因：",err);
  }
}

//初始化签到信息
async function initsignIN(that)
{
  let passenger = that.code_data.passenger_name;
  let temp = [];
  for(let i = 0;i < passenger.length;i++)
  {
    let obj = 
    {
      name : passenger[i],
      status:false
    }
    temp.push(obj);
  }
  that.setData({passengerList : temp});
}

//更新签到信息
async function updatesignIN(that)
{
  const db = wx.cloud.database();
  try
  {
    const res = await db.collection("detail").doc(that.code_data.data_id).get();
    console.log(res);
    let result = res.data.signIN;
    if(result.length === 0) return;
    let temp = that.data.passengerList;
    for(let i = 0;i < temp.length;i++)
    {
      if(result.includes(temp[i].name))
        temp[i].status = true;
    }
    that.setData({passengerList : temp});
    console.log(that.data.passengerList);
  }
  catch(err)
  {
    console.log(err);
  }
}

module.exports.setSignin = setSignin;
module.exports.initsignIN = initsignIN;
module.exports.updatesignIN = updatesignIN;
