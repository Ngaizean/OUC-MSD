Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: [
      
    ] // 确保array被初始化
  },
  onLoad: function() {
    const db = wx.cloud.database(); //获取数据库引用
    db.collection('detail').get({
      success: (res) => {
        this.setData({
          array: res.data
        });
        console.log(this.data.array);
      },
      fail: (err) => {
        console.error(err);
      }
    })
  },

  navigateToDetail : function(e)
  {
    console.log(e.currentTarget.dataset.id);
    wx.navigateTo({
      url: '/pages/index-detail/index-detail?id='+e.currentTarget.dataset.id,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.onLoad();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },

  adddata : function () {
    const db = wx.cloud.database(); //获取数据库引用
    db.collection('detail').get({
      success: (res) => {
        this.setData({
          array: res.data
        })
        console.log(this.data.array);
      },
      fail: (err) => {
        console.error(err);
      }
    });
    wx.navigateTo({
      url: '/pages/index-detail/index-detail?_id=' + this.data.array[0]._id,
    });
  }
})