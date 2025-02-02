Page({
  data:
  {
    headpath : '',
    nickname:''
  },

  code_data:
  {
    user_id : '',
    openid:''
  },

  getuseropenid: async function()
  {
    try
    {
      const res = await wx.cloud.callFunction({ name: 'getid', data: {}});
      this.code_data.openid = res.result.openid;
      return res.result.openid;
    }
    catch(err)
    {
      wx.hideLoading();
      wx.showToast({
        title: '加载失败',
        icon:"error",
        duration: 900
      });
      console.log("调用云函数失败！失败信息：",err);
    }
  },

  getDatabase : async function(openid)
  {
    const db = wx.cloud.database();
    try
    {
      const res = await db.collection("user_info").where({
        _openid : openid
      }).get();
      return res.data[0];
    }
    catch(err)
    {
      console.log(err);
    }
  },

  obtainUserdata : async function()
  {
    //先获取openid
    let openid =  await this.getuseropenid();
    //再通过这个openid找记录
    let result =  await this.getDatabase(openid);
    this.setData({
      headpath : result.headpath,
      nickname : result.username
    });
    this.code_data.user_id = result._id;
  },


  gotoNew : function(e)
  {
    let page = e.currentTarget.dataset.field;
    wx.navigateTo({
      url: '/pages/FRC/FRC?field=' + page + '&user_id=' + this.code_data.user_id + '&openid=' + this.code_data.openid,
    })
  },

  gotoInfo : function(e)
  {
    let page = e.currentTarget.dataset.field;
    wx.navigateTo({
      url: '/pages/INFO/INFO?field=' + page,
    })
  },


  onLoad : async function()
  {
    wx.showLoading({
      title: '加载中',
    });
    await this.obtainUserdata();
    wx.hideLoading();
    wx.showToast({
      title: '加载成功',
      icon:'success',
      duration:500
    })
  }
})