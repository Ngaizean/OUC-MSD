//需要收集的数据
let code_data =
{
  username : '',//当前用户的用户名
  passenger : [], //乘客名单openid
  passenger_name : [], //所有用户的用户名
  headpath : ''
}

//获取当前订单下的乘客信息openid
async function getpassenger(that)
{
  const db = wx.cloud.database();
  try
  {
    const res = await db.collection("detail").doc(that.code_data.data_id).get();
    code_data.passenger = res.data.passenger;
  }
  catch(err)
  {
    console.log("数据库操作失败！失败信息：",err);
    page.show_error();
  }
}

//获取当前所有乘客的用户名
async function getusername(that)
{
  //先获取当前订单乘客的openid
  await getpassenger(that);
  const db = wx.cloud.database();
  try
  {
    let temp = code_data.passenger;
    let result = [];
    if(temp.length)
    {
      for(let i = 0;i < temp.length;i++)
      {
        const res = await db.collection("user_info").where({
          _openid : temp[i]
        }).get();
        if(res.data[0]._id === that.code_data.user_id)
        {
          that.code_data.username = code_data.username = res.data[0].username;
          code_data.headpath = res.data[0].headpath;
          that.code_data.phone = res.data[0].phone;
        }
        result.push(res.data[0].username);
      }
      code_data.passenger_name = result;
    }
    that.code_data.passenger_name = result;
  }
  catch(err)
  {
    page.show_error();
    console.log("数据库操作失败，失败信息：",err);
  }
}

//初始化位置
async function initlocation(that)
{
  try
  {
    const db = wx.cloud.database();
    const res = await db.collection("detail").doc(that.code_data.data_id).update({
      data:
      {
        location : 
        {
          [that.code_data.username] : 
          {
            lat : 0,
            lng : 0,
            headpath:code_data.headpath
          }
        }
      }
    })
  }
  catch(err)
  {
    console.log("操作失败，失败原因：",err);
  }
}

//获取数据库中的车辆信息
async function getCarinfo(that)
{
  const db = wx.cloud.database();
  try
  {
    const res = await db.collection("detail").doc(that.code_data.data_id).get();
    return res.data.carinfo;
  }
  catch(err)
  {
    console.log("数据库操作失败，失败原因：",err);
  }
}

//车辆信息处理
async function uploadcarinfo(path,cloudpath,ID)
{
  //上传前先删除
  try
  {
    {
      let temp = [];
      temp.push(ID);
      try
      {
        if(ID != 'cloud://test-7gils3dba8329fb3.7465-test-7gils3dba8329fb3-1328827207/图片添加_add-picture.svg')
        {
          const res1 = await wx.cloud.deleteFile({
            fileList : temp,
          });
        }
        //console.log("删除成功",res1);
      }
      catch(err)
      {
        console.log(err);
      }
    }
    const res = await wx.cloud.uploadFile({
        cloudPath: cloudpath,
        filePath : path,
      });
    return res.fileID;
  }
  catch(err)
  {
      console.log("云函数执行失败，失败原因：",err);
  }
}

//上传该订单的车辆信息
async function carinfo(that) {
  try {
    const res = await new Promise((resolve, reject) => {
      wx.chooseMedia({
        count: 1,
        mediaType: 'image',
        sourceType: 'album',
        sizeType: 'original',
        success: resolve,
        fail: reject,
      });
    });

    //获取时间戳
    const timestamp = new Date().getTime();
    let cloudpath = timestamp + '.png';
    let ID = await getCarinfo(that);
    const picID = await uploadcarinfo(res.tempFiles[0].tempFilePath, cloudpath, ID);

    // 提交数据库
    const db = wx.cloud.database();
    try {
      await db.collection("detail").doc(that.code_data.data_id).update({
        data: {
          carinfo: picID
        }
      });
    } catch (err) {
      console.log("数据库操作失败，失败原因：", err);
    }

  } catch (err) {
    console.log("获取图片操作失败，失败原因：", err);
  }
}

//获取用户的头像地址
async function getuserhead(that)
{
  const db = wx.cloud.database();
  try
  {
    const res = await db.collection("user_info").doc(that.code_data.user_id).get();
    return res.data.headpath;
  }
  catch(err)
  {
    console.log(err);
  }
}


module.exports.carinfo = carinfo;
module.exports.initlocation = initlocation;
module.exports.getpassenger = getpassenger;
module.exports.getusername = getusername;
module.exports.getCarinfo = getCarinfo;

