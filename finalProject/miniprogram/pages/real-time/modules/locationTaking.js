var QQMapWX = require('../../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;

let code_data = 
{
  lat : 0,
  lng : 0,
  name : '',
  address:''
}

//获取实时位置
async function getNowLocation() {
  const map_key = 'D4VBZ-WFUWZ-NXUXI-ZKNCG-OVD2S-RXBMX';
  qqmapsdk = new QQMapWX({ key: map_key });
  try {
    const res = await new Promise((resolve, reject) => {
      qqmapsdk.reverseGeocoder({
        success: resolve,
        fail: reject,
      });
    });
    console.log(res);
    //设置数据
    code_data.lat = res.result.location.lat;
    code_data.lng = res.result.location.lng;
    code_data.name = res.result.formatted_addresses.recommend;
    code_data.address = res.result.ad_info.address;
    return res.result.location;
  } catch (err) {
    console.log("操作失败，失败信息：", err);
  }
}

//获取终点数据
async function getbeginplace(data_id)
{
  const db = wx.cloud.database();
  try
  {
    const res = await db.collection("detail").doc(data_id).get();
    return res.data.begin_place;
  }
  catch(err)
  {
    console.log(err);
  }
}

//上传当前位置
async function uploadlocation(that)
{
  let result = await getNowLocation();
  const db = wx.cloud.database();
  try
  {
    const res = await db.collection("detail").doc(that.code_data.data_id).update({
      data :
      {
        location :
        {
            [that.code_data.username] : {lat : result.lat,lng : result.lng}
        }
      }
    });
    return result;
  }
  catch(err)
  {
    console.log("操作失败，失败原因：",err);
  }
} 

//路径规划
async function roadPlaning(data_id)
{
  let begin_place = await getbeginplace(data_id);
  const map_key = 'D4VBZ-WFUWZ-NXUXI-ZKNCG-OVD2S-RXBMX';
  let plugin = requirePlugin('routePlan');
  let key = map_key  //使用在腾讯位置服务申请的key
  let referer = '海拼';   //调用插件的app的名称
  let endPoint = JSON.stringify
  ({  //终点
        'name': begin_place.name,
        'latitude': begin_place.lat,
        'longitude': begin_place.lng
  });
  wx.navigateTo
  ({
        url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
   })
}

//查看当前位置
function checkNowlocation()
{
  console.log(code_data.lng);
  wx.openLocation
  ({
    latitude: code_data.lat,
    longitude: code_data.lng,
    name: code_data.name,
    address: code_data.address,
    scale : 17
  });
}

module.exports.roadPlaning = roadPlaning;
module.exports.checkNowlocation = checkNowlocation;
module.exports.getNowLocation = getNowLocation;
module.exports.uploadlocation = uploadlocation;