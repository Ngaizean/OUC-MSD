//var amapFile = require('../../libs/amap-wx.js');
const chooseLocation = requirePlugin('chooseLocation');

Page({
  data: {
    date: '',
    time: '',
    remarks: '',
    checkbox: false,
    year: '',
    seatvalue:0,
    seatrange:[1,2,3,4],
    month: '',
    seats : 0,
    day: '',
    today: '',
    begin_place: {name:'',lat:0,lng:0,address:''},
    end_place: {name:'',lat:0,lng:0,address:''}
  },

  code_data:
  {
    openid:"",
    locationType : '',
    start_detail : {},
    end_detail : {},
  },

  startmaptaking : async function()
  {
    const key = 'D4VBZ-WFUWZ-NXUXI-ZKNCG-OVD2S-RXBMX'; //使用在腾讯位置服务申请的key
    const referer = '海拼'; //调用插件的app的名称
    const category = '生活服务,娱乐休闲,美食';
    this.code_data.locationType = 'start';
    wx.navigateTo({
      url: 'plugin://chooseLocation/index?key=' + key + '&referer=' + referer +  '&category=' + category
    });
  },

  endmaptaking : async function()
  {
    const key = 'D4VBZ-WFUWZ-NXUXI-ZKNCG-OVD2S-RXBMX'; //使用在腾讯位置服务申请的key
    const referer = '海拼'; //调用插件的app的名称
    const category = '生活服务,娱乐休闲,美食';
    this.code_data.locationType = 'end';
    wx.navigateTo({
      url: 'plugin://chooseLocation/index?key=' + key + '&referer=' + referer +  '&category=' + category
    });
  },

  refresh:function()
  {
    this.setData({
      departure: '',
      destination: '',
      date: '',
      time: '',
      seats : 0,
      remarks: '',
      checkbox: false,
      begin_place: {name:'',lat:0,lng:0,address:''},
      end_place: {name:'',lat:0,lng:0,address:''}
    })
  },

  handleInput(e) {
    let field = e.currentTarget.dataset.field;
    this.setData({
      [field]: e.detail.value
    });
  },

  handleDateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },

  handleTimeChange(e) {
    this.setData({
      time: e.detail.value
    })
  },

  handleCheckbox :function(e) {
   this.setData({
     checkbox : (e.detail.value.length === 0) ? false : true
   })
  },


  touserDB : async function(data_id)
  {
    console.log(data_id);
    const db = wx.cloud.database();
    const _ = db.command;
    try
    {
      const res = await db.collection("user_info").where({
        _openid : this.code_data.openid
      }).update({
        data:
        {
          create : _.push(data_id)
        }
      });
    }
    catch(err)
    {
      console.log(err);
    }
  },

  adddata : function() {
    if(this.data.checkbox)
    {
      //此处进行表单提交至数据库
      const db = wx.cloud.database();
      wx.showLoading({
        title: '加载中',
      })
      db.collection("detail").add({
        data:
        {
          date:this.data.date,
          begin_place:this.data.departure,
          end_place:this.data.destination,
          time:this.data.time,
          rest_seat:this.data.seats,
          text:this.data.remarks,
          status: true,
          signIN:[],
          passenger: [this.code_data.openid],
          begin_place: this.data.begin_place,
          end_place : this.data.end_place,
          carinfo : 'cloud://test-7gils3dba8329fb3.7465-test-7gils3dba8329fb3-1328827207/图片添加_add-picture.svg'
        },
        success: async res => {
          let data_id = res._id;
          await this.touserDB(data_id);
          wx.hideLoading();
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 600
          }),
          this.refresh();
          console.log("成功！");
        },
        fail: err=> {
          console.error("提交失败",err);
        }
      })
    }
    else
    {
      wx.showModal({
        title: '提示',
        content: '请勾选免责声明',
        showCancel:false
      })
    }
  },

  getToday: function()
  {
    let now = new Date();
    let now_month = now.getMonth() + 1;
    let now_day = now.getDate();
    let now_year = now.getFullYear();
    now_month = (now_month < 10 ? '0' : '') + now_month;
    now_day = (now_day < 10 ? '0' : '') + now_day;
    let now_today = now_year + '-' + now_month + '-' + now_day;
    this.setData(
      {year:now_year,
      month:now_month,
      day:now_day,
      today:now_today
      });
  },
  
  getuseropenid: function()
  {
    // 在页面加载时调用获取 OpenID 的方法
    wx.cloud.callFunction({ // 调用云函数
      name: 'getid', // 函数名称
      data: {}, // 函数参数
      success: res => { // 调用成功时的回调函数
        console.log('[云函数] [login] user openid: ', res.result.openid);
        this.code_data.openid = res.result.openid;
      },
      fail: err => { // 调用失败时的回调函数
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },

  handleSeatsChange : function(e)
  {
    let index = e.detail.value;
    this.setData({seats : this.data.seatrange[index]});

  },

  onLoad: function (options) 
  {
    this.getToday();
    this.getuseropenid();
  },

  onShow () 
  {
    const location = chooseLocation.getLocation(); 
    if(this.code_data.locationType === 'start')
    {
      let temp = {
        name : location.name,
        lat : location.latitude,
        lng : location.longitude,
        address : location.address
      }
      this.setData({begin_place : temp});
    } 
    else if(this.code_data.locationType === 'end')
    {
      let temp = {
        name : location.name,
        lat : location.latitude,
        lng : location.longitude,
        address : location.address
      }
      this.setData({end_place : temp});
    }
  },
  onUnload () 
  {
    // 页面卸载时设置插件选点数据为null，防止再次进入页面，geLocation返回的是上次选点结果
    chooseLocation.setLocation(null);
  }
})
