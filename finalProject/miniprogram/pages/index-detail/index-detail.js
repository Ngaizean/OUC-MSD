Page({
  data: {
    now_data : {}, //储存当前订单条目的数据
    users : [], //参与者名单
    user_status:false, //用户是否可以参加的状态
    faour:true, //用户收藏操作状态
    buttonclose:false,
    buttonrealtime:true
  },
  code_data:{
    data_id:'', //当前订单在数据库的条目ID
    openid:'', //用户唯一标识码
    user_dbid:'', //当前用户在用户数据库的条目ID
    status:false
  },

  checkbutton : async function()
  {
    const db = wx.cloud.database();
    try
    {
      const res = await db.collection("detail").doc(this.code_data.data_id).get();
      this.setData({buttonclose: !res.data.status});
    }
    catch(err)
    {
      console.log(err);
    }
  },

  checkrealtime : async function()
  {
    if(this.data.now_data.passenger.includes(this.code_data.openid))
      this.setData({buttonrealtime : false});
    else this.setData({buttonrealtime : true});
  },

  getUserOpenid: async function() {
    try {
      const res = await wx.cloud.callFunction({
        name: 'getid',
        data: {}
      });
      this.code_data.openid = res.result.openid;
    } catch (err) {
      wx.hideLoading();
      wx.showToast({
        title: '加载失败',
        icon:'error'
      })
      console.error('[云函数] [login] 调用失败', err);
    }
  },
  
  findusername:async function()
  {
    const db = wx.cloud.database();
    let temp = [];
    if(!this.data.now_data.passenger.length) //无参与人情况
      this.setData({ users : [] });
    else
    {
      for(let i = 0; i < this.data.now_data.passenger.length;i++)
      {
        try
        {
          const res = await db.collection("user_info").where({
            _openid : this.data.now_data.passenger[i]
          }).get();
          temp.push(res.data[0].username);
        }
        catch(err)
        {
          console.log("请求失败，失败信息：",err);
        }
      }
      this.setData({ users : temp });
    }
  },

  getdata : async function()
  {
    const db = wx.cloud.database();
    wx.showLoading({
      title: '加载中',
    });
    try
    {
      const res = await db.collection('detail').where({
        _id : this.code_data.data_id
      }).get()
      this.setData({
        now_data : res.data[0],
      });
    }
    catch(err)
    {
      console.log("调用失败，失败信息：",err);
    }
  },
  
  init_status:async function()
  {
    //初始化参与人状态
    if (this.data.now_data.rest_seat === 0 || this.data.now_data.passenger.includes(this.code_data.openid)) 
      this.setData({user_status: false});
    else this.setData({user_status : true});
    //初始化收藏状态
    const db = wx.cloud.database();
    try
    {
      const res = await db.collection("user_info").where({_openid : this.code_data.openid}).get();
      this.code_data.user_dbid = res.data[0]._id;
      let array = res.data[0].favorite;
      if(array.includes(this.code_data.data_id))
        this.setData({faour : false})
      else this.setData({faour : true})
    }
    catch(err) 
    {
      console.log("请求失败，错误信息：",err);
    }
  },

  onLoad: async function (options) 
  {
    //部署数据
    wx.showLoading({
      title: '加载中',
    })
    await this.getUserOpenid(); //首先获取用户的openid
    this.code_data.data_id = options.id; //获取上一页传入的当前条目的ID
    await this.getdata(); //凭当前条目ID获取当前条目全部信息
    await this.init_status(); //初始化收藏和参与者状态
    await this.findusername(); //获取参与者列表
    await this.checkbutton();
    await this.checkrealtime();
    wx.hideLoading();
    wx.showToast({
      title: '加载成功',
      icon: 'success'
    });
  },

  //使按钮不可用
  onShow : async function()
  {
    if(this.code_data.status)
    {
      this.setData({buttonclose : true});
      //设置订单为关闭状态
      const db = wx.cloud.database();
      await db.collection("detail").doc(this.data.now_data._id).update({
        data:
        {
          status : false
        }
      });
    }
  },

  updatedata : async function()
  {
    let temp_data = this.data.now_data;
    temp_data.passenger.push(this.code_data.openid);
    temp_data.rest_seat -= 1;
    //更新视图层
    this.setData({now_data : temp_data})
    //更新数据库
    const db = wx.cloud.database();
    const _ = db.command;
    try
    {
      let res = await db.collection("detail").doc(this.code_data.data_id).update({
        data:
        {
          passenger: _.push(this.code_data.openid),
          rest_seat : _.inc(-1)
        }
      });
    }
    catch(err)
    {
      console.log("更新失败！失败信息：",err);
    }
  },

  deletedata: async function()
  {
    let temp_data = this.data.now_data;
    let index = temp_data.passenger.indexOf(this.code_data.openid);
    temp_data.passenger.splice(index,1); //删除操作
    temp_data.rest_seat += 1;
    //更新视图层
    this.setData({now_data : temp_data})
    //更新数据库
    const db = wx.cloud.database();
    const _ = db.command;
    try
    {
      let res = await db.collection("detail").doc(this.code_data.data_id).update({
        data:
        {
          passenger : temp_data.passenger,
          rest_seat : _.inc(1)
        },
      })
    }
    catch(err)
    {
      console.log("更新失败！失败信息：",err);
    }
  },

  checkpassenger:async function()
  {
    //加入订单
    if(this.data.user_status)
    {
      this.setData({user_status : false});
      //将openid添加到该订单id下的乘客列表
      await this.updatedata();
      wx.showToast({
        title: '加入成功',
        icon : 'success',
        duration : 1000
      })
    }
    //退出订单
    else
    {
      this.setData({user_status : true});
      //把该订单下的乘客列表删除
      await this.deletedata();
      wx.showToast({
        title: '退出成功',
        icon : 'success',
        duration : 1000
      })
    }
    await this.checkrealtime();
    await this.findusername();
  },

  openMoreOptions : async function()
  {
    console.log(this.code_data.user_dbid);
    const db = wx.cloud.database();
    const _ = db.command;
    //允许收藏的情况
    wx.showLoading({
      title: '加载中',
    });
    if(this.data.faour)
    {
      this.setData({faour : false})
      try
      {
        let res = await db.collection("user_info").doc(this.code_data.user_dbid).update({
          data:{favorite : _.push(this.data.now_data._id)} });
        wx.hideLoading();
        wx.showToast({ 
          title: '收藏成功',
          icon:'success'
        })
      }
      catch(err)
      {
        console.log("更新失败，失败信息：",err);
        wx.hideLoading();
        wx.showToast({
          title: '收藏失败',
          icon:'error'
        })
      }
    }
    else //不允许收藏的情况，此时按钮为取消收藏的情况，一旦点击后将取消收藏，状态也变成可以收藏的情况
    {
      this.setData({faour : true});
      //更新数据库
      wx.showLoading({title: '加载中'});
      try
      {
        let res = await db.collection("user_info").doc(this.code_data.user_dbid).get();
        let temp = res.data.favorite;
        let index = temp.indexOf(this.data.now_data._id);
        temp.splice(index,1);
        try
        {
          let res2 = await db.collection("user_info").doc(this.code_data.user_dbid).update({
              data:{favorite : temp} })
          wx.hideLoading();
          wx.showToast({
            title: '取消成功',
            icon  : 'success',
            duration: 900
          })
        }
        catch(err)
        {
          wx.hideLoading();
          wx.showToast({
            title: '取消失败',
            icon  : 'error',
            duration: 900
          })
          console.log("更新失败，失败信息：",err);
        }
      }
    catch(err)
    {
      wx.hideLoading();
      wx.showToast({
        title: '操作失败',
        icon  : 'error',
        duration: 900
      })
      console.log("操作失败，失败信息：",err);
      this.setData({faour : false});
    }
  }
},

  real_time: async function()
  {
    const res = await wx.navigateTo({
      url: '/pages/real-time/real-time?data_id='+this.data.now_data._id+"&user_id=" + this.code_data.user_dbid,
      events: {
        someEvent: (e) => {
          this.code_data.status = e.status;
        }
      }
    });
    console.log(res);
  },
  

})