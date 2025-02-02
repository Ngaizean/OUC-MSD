Page({
  data: {
    openid: ' ',
    register: false
  },
  getuseropenid: async function()
  {
    try
    {
      const res = await wx.cloud.callFunction({ name: 'getid', data: {}});
      this.setData({ openid : res.result.openid });
    }
    catch(err)
    {
      wx.hideLoading();
      wx.showToast({
        title: '加载失败',
        icon:"error"
      });
      console.log("调用云函数失败！失败信息：",err);
    }
  },
  check_db: async function()
  {
    const db = wx.cloud.database();
    try
    {
      const res = await db.collection("user_info").where({
        _openid : this.data.openid
      }).get();
      if(res.data.length === 1)
          this.setData({ register:true })
    }
    catch(err)
    {
      wx.hideLoading();
      wx.showToast({
        title: '加载失败',
        icon: 'error'
      })
      console.log("数据库操作失败，失败原因：",err);
    }
  },
  onLoad: async function () {
    wx.showLoading({
      title: '加载中',
    });
    await this.getuseropenid();
    await this.check_db();
    wx.hideLoading();
    wx.showToast({
      title: '加载成功',
      icon:"success"
    })
  },

  handleButtonTap: function () {
    //没注册
    if(!this.data.register)
    {
      wx.showModal({
        title: '提示',
        content: '请先填写个人信息',
        success:res=> {
          if (res.confirm) {
            console.log('用户点击确定');
            wx.navigateTo({
              url: '/pages/register/register?openid='+ this.data.openid,
            });
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
    //已经注册
    else
    {
      wx.switchTab({
        url: '/pages/index1/index1'
      });
    }
  }
});
