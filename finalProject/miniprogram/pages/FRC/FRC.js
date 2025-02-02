// pages/FRC/FRC.js
Page({
  data:
  {
    array :[]
  },

  code_data :
  {
    user_id : '',
    openid : '',
    page_field : '',
    isFirst: true
  },

  processData : async function(result)
  {
    let temp = [];
    const db = wx.cloud.database();
    try
    {
      for(let i = 0;i < result.length;i++)
      {
        const res = await db.collection("detail").doc(result[i]).get();
        temp.push(res.data);
      }
      this.setData({array : temp});
      wx.hideLoading();
    }
    catch(err)
    {
      console.log(err);
    }
  },

  navigateToDetail : function(e)
  {
    wx.navigateTo({
      url: '/pages/index-detail/index-detail?id='+e.currentTarget.dataset.id,
    });
  },

  FC : async function(mark)
  {
    console.log(mark);
    const db = wx.cloud.database();
    try
    {
      const res = await db.collection("user_info").doc(this.code_data.user_id).get();
      let result = res.data[mark];
      console.log(result);
      if(result.length > 0)
      {
        await this.processData(result);
        wx.hideLoading();
        wx.showToast({
          title: '加载成功',
          icon : 'success',
          duration: 800
        })
      }
      else
      {
        wx.hideLoading();
        wx.showToast({
          title: '暂无记录',
          icon: 'error',
          duration: 2000,
          complete: () => {
            setTimeout(() => {
              wx.switchTab({
                url: '/pages/me/me',
              });
            }, 2000);
            return;
        }
      });
      }
    }
    catch(err)
    {
      console.log(err);
    }
  },

  RECORD : async function()
  {
    const db = wx.cloud.database();
    const _ = db.command;
    try
    {
      const res = await db.collection("detail").where({
        passenger: _.elemMatch(_.eq(this.code_data.openid))
      }).get();
      this.setData({array : res.data});
      wx.hideLoading();
      wx.showToast({
        title: '加载成功',
        icon : 'success',
        duration: 800
      })
    }
    catch(err)
    {
      console.log(err);
    }
  },

  onLoad : async function(options)
  {
    let field = options.field;
    this.code_data.page_field = options.field;
    this.code_data.user_id = options.user_id;
    this.code_data.openid = options.openid;
    wx.showLoading();
    if(field === 'favorite' || field === 'create')
      await this.FC(field);
    else if(field === 'record')
      await this.RECORD();
    this.code_data.isFirst = false;
  },

  onShow : async function()
  {
    if(this.code_data.isFirst) return; 
    if(this.code_data.page_field === 'favorite' || this.code_data.page_field === 'create')
      this.FC(this.code_data.page_field);
    else if(this.code_data.page_field === 'record')
      this.RECORD();
  },
  
})