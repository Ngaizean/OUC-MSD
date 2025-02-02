// pages/real-time/real-time.js
//主要实现数据处理 照片 位置 签到 退出
var collectData = require("./modules/collectData.js");
var locationTaking = require("./modules/locationTaking.js");
var signIN = require("./modules/signIN.js");

Page({
  data: {
    userImage : 'cloud://test-7gils3dba8329fb3.7465-test-7gils3dba8329fb3-1328827207/图片添加_add-picture.svg',
    signinStatus : false,  //签到状态
    buttonclose : false, //按钮可用状态
    map_latitude:0, //中心经纬
    map_longitude:0,
    markers: [
      {
        id: 1,
        latitude: 39.90923,
        longitude: 116.397428,
        title: '地点一',
        width : 30,
        height : 30
      },
      {
        id: 2,
        latitude: 39.90816,
        longitude: 116.40245,
        title: '地点二',
        width : 30,
        height : 30
      }
    ],
    passengerList:[] //乘客列表
  },

  code_data :
  {
    user_id : '', //用户数据库条目ID
    data_id : '', //订单数据库条目ID
    username : '',
    picID : '',
    passenger_name : [],
    phone:''
  },

  preview : function()
  {
    if(this.data.userImage === 'cloud://test-7gils3dba8329fb3.7465-test-7gils3dba8329fb3-1328827207/图片添加_add-picture.svg')
      wx.showModal({
        title: '提示',
        content: '暂无图片可预览',
        showCancel:false
      })
      else
      {
        wx.previewImage({
          urls: [this.data.userImage],
        });
      }
  },

  //上传图片
  uploadcarinfo : async function()
  {
    let that = this;
    await collectData.carinfo(that);
    await this.updateAllinfo();
  },

  //统一更新全部信息：车辆 地图 签到
  updateAllinfo : async function()
  {
    //更新车辆信息
    let picID = await collectData.getCarinfo(this);
    this.setData({userImage : picID});
    //更新地图信息
    await this.totalLocation();
    //更新签到信息
    await signIN.updatesignIN(this);
  },

  //共享位置 拉取数据库信息 形成markers
  downloadLocation : async function()
  {
    const db = wx.cloud.database();
    try
    {
      const res = await db.collection("detail").doc(this.code_data.data_id).get();
      let result = res.data.location;
      let tempMarks = [];
      //形成markers
      let keys = Object.keys(result);
      for(let i = 0;i < keys.length;i++)
      {
        let tempObject = 
        {
          id : i,
          title: keys[i],
          latitude: result[keys[i]].lat,
          longitude: result[keys[i]].lng,
          iconPath : result[keys[i]].headpath,
          width : 30,
          height : 30
        }
        tempMarks.push(tempObject);
        console.log(tempObject);
      }
      //触发渲染层
      this.setData({markers : tempMarks});
    }
    catch(err)
    {
      console.log("操作失败，失败原因：",err);
    }
  },
  //路径规划
  roadPlaning : async function()
  {
    await locationTaking.roadPlaning(this.code_data.data_id);
  },
  //当前位置
  checkNowlocation : function()
  {
    locationTaking.checkNowlocation();
  },
  //位置封装函数 包含上传自己的当前位置 设置地图中心点 更新markers
  totalLocation : async function()
  {
    let result = await locationTaking.uploadlocation(this);
    this.setData({map_latitude : result.lat,map_longitude : result.lng}); //设置地图中心点
    await this.downloadLocation(); //更新位置
  },


  show_error : function()
  {
    wx.hideLoading();
    wx.showToast({
      title: '加载失败',
      icon : 'error',
      duration : 900
    });
  },
//1 成功 0加载中
  show_success : function(number)
  {
    wx.hideLoading();
    if(number === 0)
      wx.showLoading({
        title: '加载中',
      })
    else wx.showToast({
      title: '加载成功',
      icon : 'success',
      duration : 900
    })
      
  },

//签到点击事件
  signIN : async function()
  {
    wx.showModal({
      title: '提示',
      content: '一旦签到将不可取消',
      complete: async (res) => {
        if (res.confirm) {
          await signIN.setSignin(this);
          this.setData({buttonclose : true});
          wx.showToast({
            title: '签到成功',
            icon:'success',
            duration:900
          });
          await this.updateAllinfo();
        }
      }
    })
  },

  //周期性更新数据
  startUpdating : async function() {
    await this.updateAllinfo();
    console.log("更新成功！");
    setTimeout(() => this.startUpdating(), 60000);
  },
  

  //手机呼叫事件
  showCallModal : async function()
  {
    wx.showModal({
      title: '提示',
      content: '呼叫乘客 '+this.code_data.username,
      complete: async (res) => {
        if (res.confirm) {
          await wx.makePhoneCall({
            phoneNumber : this.code_data.phone
          })
        }
      }
    })
  },

  onLoad:async function(options) 
  {
    //接收用户id和订单id
    this.show_success(0);
    wx.enableAlertBeforeUnload({
      message : '一旦退出则视为拼车结束，该页面不再允许进入'
    })
    this.code_data.data_id = options.data_id;
    this.code_data.user_id = options.user_id;
    await collectData.getusername(this); //获取用户名
    await collectData.initlocation(this); //初始化位置
    await signIN.initsignIN(this); //初始化签到信息
    await this.totalLocation(); //更新地图
    await this.updateAllinfo();
    this.show_success(1);
    this.startUpdating();
  },

  //卸载页面执行函数
  onUnload : function()
  {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.emit('someEvent', {status:true});
  },
})