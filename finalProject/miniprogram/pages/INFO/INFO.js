// pages/INFO/INFO.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status : ''
  },

  reward : function()
  {
    wx.previewImage({
      urls: ["cloud://test-7gils3dba8329fb3.7465-test-7gils3dba8329fb3-1328827207/222.jpg"] // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) 
  {
    this.setData({status:options.field});
  },
})