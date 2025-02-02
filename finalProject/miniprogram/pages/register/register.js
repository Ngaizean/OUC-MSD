const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
  data: {
    avatarUrl: defaultAvatarUrl,
    username : '',
    pic_ID : '',
    openid:"",
    phone:''
  },
  onLoad : function(e)
  {
    this.setData({
      openid : e.openid
    })
  },
  uploadDatabase : function()
  {
    const db = wx.cloud.database();
    db.collection("user_info").add({
      data:
      {
        "create" : [],
        "favorite": [],
        "phone":this.data.phone,
        "headpath":this.data.pic_ID,
        "username":this.data.username
      },
      success : res =>
      {
        console.log("上传用户数据库成功！该条目的数据库ID为：",res._id);
        wx.hideLoading();
        wx.switchTab({
          url: '/pages/index1/index1?openid=' + this.data.openid,
        })
      },
      fail : err =>
      {
        console.log("上传用户数据库失败！错误信息：",err);
      }
    })
  },

  uploadfile : function()
  {
    wx.cloud.uploadFile({
      filePath : this.data.avatarUrl,
      cloudPath : this.data.openid + ".jpg",
      success : res =>
      {
        console.log("文件ID：",res.fileID);
        this.setData({
          pic_ID : res.fileID
        })
        this.uploadDatabase();
      },
      fail : err =>
      {
        console.log("储存失败",err);
      }
    })
  },
  onChooseAvatar(e) {
    this.setData({
      avatarUrl :e.detail.avatarUrl
    })
    console.log(e.detail.avatarUrl);
  },
  nameinput : function(e)
  {
    let field = e.currentTarget.dataset.field;
    this.setData({
      [field] : e.detail.value,
    })
    //console.log(this.data.username);
  },
  handleSubmit(e)
  {
    if(this.data.avatarUrl === defaultAvatarUrl)
    {
      wx.showModal({
        title: '提示',
        content: '请添加头像信息',
      })
    }
    else if(this.data.phone === '')
    {
      wx.showModal({
        title: '提示',
        content: '请添加手机号码信息',
      })
    }
    else if(this.data.username === '')
    {
      wx.showModal({
        title: '提示',
        content: '请添加昵称信息',
      })
    }
    else 
    {
      wx.showLoading({
        title: '加载中',
      });
      this.uploadfile();
    }
  }
})