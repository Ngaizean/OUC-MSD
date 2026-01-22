# 新闻客户端小程序

> 表单处理与数据绑定的前端应用

## 项目简介

本项目是一个功能完善的新闻客户端小程序，展示了表单处理、数据绑定、列表渲染等前端开发技术。项目包含新闻列表、详情展示、搜索过滤等功能。

## 项目目标

1. 综合所学知识创建完整的新闻客户端
2. 掌握表单处理和数据绑定技术
3. 实现轮播图动态加载和列表渲染
   - 进一步优化轮播图, 用户发现轮播图的图片吸引时并打算点击时, 可同样实现跳转新闻详情页, 不再拘束于非得点击新闻列表才能进行跳转, 有更丰富的交互逻辑和体验
   - 具体创新点实现见文末

## 项目步骤

### 数据准备和环境搭建

- 本程序需要多条高校新闻条目, 以及一些图标, 资源已在仓库中同步上传

- 环境搭建前文已经详细阐述, 此处不再赘述. **选择手动创建, 不适用模板即可**

- 在`pages`统同级目录下, 新建`images`和`utils`分别用于储存图片资源和公共代码资源.

- 文件结构见下图

  <img src="../pic/Lab-5/1.jpg" alt="1" style="zoom:33%;" />

  - `detail`和`my`页面分别用于新闻的详情页和个人用户页面
  - 创建这两个页面后, 需要在`app.json`的`Windows`属性中进行引用.

### 页面设计

- 导航栏设计, 在`app.json`中进行编写

  ```json
  "window": {
      "navigationBarTextStyle": "white",
      "navigationBarBackgroundColor": "#328EEB",
      "navigationBarTitleText": "海大新闻网"
   },
  ```

- `tabbar`页面配置, 在`app.json`中进行编写. 主要实现底部任务栏的跳转. [官方文档](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#tabBar)给出`tanbar`的详细用法, 此处主要设置底部任务栏的样式和图标. 小程序一共分为3个`tab`页, 每一个`tabbar`参数需要包含必填的对应页面, 图标, 标题等.

  ```json
  "tabBar": {
      "color": "#000",
      "selectedColor": "#328EEB",
      "list":[
        {
          "pagePath": "pages/index/index",
          "iconPath": "images/index.png",
          "selectedIconPath": "images/index_blue.png",
          "text": "首页"
        },
        {
          "pagePath": "pages/my/my",
          "iconPath": "images/my.png",
          "selectedIconPath": "images/my_blue.png",
          "text" : "我的"
        }
      ]
    }
  ```

- **主页面**页面设计, 即编写`index.wxml`和`index.wxss`

  ```html
  <!--pages/index/index.wxml-->
  <!--幻灯片滚动-->
  <swiper indicator-dots="true" autoplay="true" interval="5000" duration="500">
    <block wx:for="{{swiperImg}}" wx:key='index'>
      <swiper-item>
        <image src="{{item.src}}"></image>
      </swiper-item>
    </block>
  </swiper>
  <!--新闻列表-->
  <view id='news-list'>
    <view class='list-item' wx:for="{{newsList}}" wx:for-item="news" wx:key="id">
      <image src='{{news.poster}}'></image>
      <text bindtap='goToDetail' data-id='{{news.id}}'>◇{{news.title}}——{{news.add_date}}</text>
    </view>
  </view>
  ```

  - 主要使用了`swiper`组件实现图片的轮播效果
  - 新闻列表采用微信提供的列表渲染, 并实现点击条目的任意处进行跳转详情页

  ```css
  /*新闻列表区域样式*/
  /*2-1新闻列表容器*/
  #news-list {
    min-height: 600rpx;
    padding: 15rpx;
  }
  /*2-2列表项目*/
  .list-item{
    display: flex;
    flex-direction: row;
    border-bottom: 1rpx solid gray;
  }
  /*2-3新闻图片*/
  .list-item image{
    width:230rpx;
    height: 150rpx;
    margin: 10rpx;
  }
  /*2-4新闻标题*/
  .list-item text{
    width: 100%;
    line-height: 60rpx;
    font-size: 10pt;
  }
  
  swiper
  {
    height: 400rpx;
  }
  swiper image
  {
    width: 100%;
    height: 100%;
  }
  ```

- **个人页面**页面设计, 即编写`my.wxml`和`my.wxss`

  ```html
  <!--pages/my/my.wxml-->
  <view id = 'myLogin'>
    <block wx:if="{{isLogin}}">
      <image id="myIcon"src='{{src}}'></image>
      <text id="nickName">{{nickName}}</text>
    </block>
    <button wx:else open-type="getUserInfo" bindgetuserinfo="getMyinfo">未登录，点击登录</button>
  </view>
  
  <view id="myFavorites">
    <text>我的收藏{{num}}</text>
    <view id="news-list">
      <view class="list-item" wx:for="{{newsList}}" wx:for-item="news" wx:key="id">
        <image src="{{news.poster}}"></image>
        <text bindtap='goToDetail' data-id = '{{news.id}}'>〇{{news.title}}--{{news.add_date}}</text>
      </view>
    </view>
  </view>
  ```

  - 个人页面的设计主要实现两个业务, 一个是登录逻辑, 另外一个是实现查看已经收藏的内容.
  - 条件渲染: 根据 `isLogin` 状态决定显示已登录信息还是登录按钮。
  - 用户交互: 使用按钮和图片、文本等元素实现用户与页面的交互。

  - 数据绑定和列表渲染: 使用 `wx:for` 实现列表渲染，通过数据绑定将收藏数据展示给用户。

  - 事件绑定: 通过 `bindtap` 和 `bindgetuserinfo` 等事件实现用户操作的处理逻辑。

  ```css
  /* pages/my/my.wxss */
  #myLogin
  {
    background-color: #328EEB;
    height: 400rpx;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content: space-around;
  }
  
  #myIcon
  {
    width: 200rpx;
    height: 200rpx;
    border-radius: 50%;
  }
  
  #nickName
  {
    color: white;
  }
  
  #myFavourites
  {
    padding: 20rpx;
  }
  ```

- **新闻详情页**页面设计, 即编写`detail.wxml`, `detail.wxss`

  ```html
  <!--pages/detail/detail.wxml-->
  <view class="container">
    <view class="title">{{article.title}}</view>
    <view class="poster">
      <image src="{{article.poster}}"mode='widthFix'></image>
    </view>
    <view class = 'content'>{{article.content}}</view>
    <view class="add_date">时间：{{article.add_date}}</view>
    <button wx:if='{{isAdd}}'plain bind:tap="cancalFavorites">❤已收藏</button>
    <button wx:else plain bindtap='addFavorites'>❤点击收藏</button>
  </view>
  ```

  - 动态数据绑定: 使用小程序的数据绑定语法（双大括号）实现页面内容的动态展示。

  - 条件渲染: 通过 `wx:if` 和 `wx:else` 实现收藏状态的切换。

  - 响应式图片显示: `mode='widthFix'` 确保了图片在不同设备上的显示效果一致，不会拉伸或压缩。

  - 用户交互: 两个按钮分别处理收藏和取消收藏的逻辑，通过点击事件绑定相应的函数来处理用户的操作。

  ```css
  /* pages/detail/detail.wxss */
  .container{
    padding: 15rpx;
    text-align: center;
  }
  
  .title{
    font-size: 14pt;
    line-height: 80rpx;
  }
  
  .poster image
  {
    width: 700rpx;
  }
  
  .content
  {
    text-align: left;
    font-size: 12pt;
    line-height: 60rpx;
  }
  
  .add_date
  {
    font-size: 12pt;
    text-align: right;
    line-height: 30rpx;
    margin-right: 25rpx;
    margin-top: 20rpx;
  }
  
  button
  {
    width: 250rpx;
    height: 100rpx;
    margin: 20rpx auto;
  }
  ```

- 实现效果

  <img src="../pic/Lab-5/2.jpg" alt="2" style="zoom:33%;" /><img src="../pic/Lab-5/3.jpg" alt="3" style="zoom:33%;" />

### 逻辑实现

### 额外文件`common.js`

```js
//获取新闻列表
function getNewsList() {
  let list = [];
  for (var i = 0; i < news.length; i++) {
    let obj = {};
    obj.id = news[i].id;
    obj.poster = news[i].poster;
    obj.add_date = news[i].add_date;
    obj.title = news[i].title;
    list.push(obj);
  }
  return list; //返回新闻列表
}

//获取新闻内容
function getNewsDetail(newsID) {
  let msg = {
    code: '404', //没有对应的新闻
    news: {}
  };
  for (var i = 0; i < news.length; i++) {
    if (newsID == news[i].id) { //匹配新闻id编号
      msg.code = '200'; //成功
      msg.news = news[i]; //更新当前新闻内容
      break;
    }
  }
  return msg; //返回查找结果
}

// 对外暴露接口
module.exports = {
  getNewsList: getNewsList,
  getNewsDetail: getNewsDetail
}
```

- 通过 `module.exports` 暴露接口，实现代码的复用性和模块化，有助于项目的扩展和管理。
- 在获取新闻详情时，通过返回 `404` 状态码明确告知新闻不存在

### 首页逻辑

```js
// pages/index/index.js
var common = require('../../utils/common.js') //引用公共JS文件
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //幻灯片素材
    swiperImg: [
      {src: 'https://gaopursuit.oss-cn-beijing.aliyuncs.com/2022/newsimage1.jpg'},
      {src: 'https://gaopursuit.oss-cn-beijing.aliyuncs.com/2022/newsimage2.jpg'},
      {src: 'https://gaopursuit.oss-cn-beijing.aliyuncs.com/2022/newsimage3.jpg'}
    ],
  },

  /**
   * 自定义函数--跳转新页面浏览新闻内容
   */
  goToDetail: function(e) {
    //获取携带的data-id数据
    let id = e.currentTarget.dataset.id;
    //携带新闻id进行页面跳转
    wx.navigateTo({
      url: '../detail/detail?id=' + id
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //获取新闻列表
    let list = common.getNewsList()
    //更新列表数据
    this.setData({
      newsList: list
    })
  },
})
```

- 实现了新闻列表的加载和展示，并通过点击新闻标题跳转到对应的新闻详情页面
- 使用微信小程序的标准生命周期函数和事件绑定机制，使得页面能够动态展示内容并响应用户操作

### 新闻页逻辑

```js
onLoad(options) {
    let id = options.id;
    var article = wx.getStorageSync(id)
    if(article != '')
    {
      this.setData({article:article,isAdd:true});
    }
    else
    {
      let result = common.getNewsDetail(id);
      if(result.code == '200')
        this.setData({article:result.news,isAdd:false});
    }

  },

  addFavorites: function(options)
  {
    let article = this.data.article;
    wx.setStorageSync(article.id, article);
    this.setData({isAdd : true});
  },

  cancalFavorites: function(options)
  {
    let article = this.data.article;
    wx.removeStorageSync(article.id);
    this.setData({isAdd : false});
  }
```

- 在页面加载时，根据传递过来的新闻 `id` 获取新闻详情，并判断该新闻是否已被收藏
- 调用 `wx.setStorageSync(article.id, article);` 将新闻内容存储到本地，使用新闻 `id` 作为键
- 调用 `wx.removeStorageSync(article.id);` 通过新闻 `id` 从本地存储中移除该新闻
- 根据是否已收藏，从本地存储或远程数据源获取新闻内容，确保页面显示的新闻信息始终是最新且完整的

### 我的页逻辑

```js
onShow: function()
  {
    if(this.data.isLogin)
      this.getMyFavorites();
  },

  goToDetail : function(e)
  {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../detail/detail?id='+id,
    })
  },

  getMyinfo: function(e)
  {
    console.log(e.detail.userInfo);
    let info = e.detail.userInfo;
    this.setData({
      isLogin:true,
      src:info.avatarUrl,
      nickName: info.nickName
    })
    this.getMyFavorites();
  },

  getMyFavorites : function()
  {
    let info = wx.getStorageInfoSync();
    let keys = info.keys;
    let num = keys.length;
    let myList = [];
    for(var i = 0;i < num;i++)
    {
      let obj = wx.getStorageSync(keys[i]);
      myList.push(obj);
    }
    this.setData({
      newsList: myList,
      num: num
    });
  },
```

- `onshow`当页面显示时调用，用于在用户已登录的情况下获取用户的收藏新闻
- 登录后，通过微信提供的`getUserInfo`接口获取用户信息，并更新到页面数据
- 通过`goToDetail`函数实现了从新闻列表跳转到详情页面的功能，使用`navigateTo`保持了页面间的数据传递



## 运行结果

<img src="../pic/Lab-5/6.jpg" alt="6" style="zoom:33%;" /><img src="../pic/Lab-5/4.jpg" alt="4" style="zoom:33%;" /><img src="../pic/Lab-5/5.jpg" alt="5" style="zoom:33%;" />



## 四、创新点

### 更改轮播图

- 将轮播图的图片变为实时从新闻中获取, 而不是静态数据

  ```js
  data: {
      //幻灯片素材
      swiperImg: [],
    },
  onLoad: function(options) {
      //获取新闻列表
      let list = common.getNewsList()
      //更新列表数据
      this.setData({
        newsList: list
      })
      console.log(list);
      let temp_result = [];
      //此处进行拉取 封装操作
      for(let i = 0; i < list.length;i++)
      {
        let temp = {src:[list[i].poster]};
        temp_result.push(temp);
      }
      this.setData({swiperImg : temp_result});
    },
  })
  ```

  - 实现思想是, 是页面加载时,将几个新闻中的图片的地址进行拉取, 并且封装在对象中. 封装完毕后, 替换data中的数据, 最后触发渲染层即可

    <img src="../pic/Lab-5/7.jpg" alt="7" style="zoom:33%;" />

### 进一步优化轮播图

- 实现点击轮播图中的图片跳转新闻详情页!

  ```html
  <swiper indicator-dots="true" autoplay="true" interval="5000" duration="500">
    <block wx:for="{{swiperImg}}" wx:key='index'>
      <swiper-item>
        <image src="{{item.src}}" bindtap="goToDetail" data-id="{{item.id}}"></image> //关键在这里
      </swiper-item>
    </block>
  </swiper>
  ```

  - 首先修改图片组件, 增加触发函数, 这个触发函数是和原本就有的跳转函数相同, 但是原本的跳转函数是必须有文章的id的参数才能使用, 因此此处也添加的数据项进行返回`item.id`, 这样子就要进一步优化上面一个创新点的逻辑实现

  ```js
  let temp_result = [];
      for(let i = 0; i < list.length;i++)
      {
        let temp = {src:[list[i].poster],id:[list[i].id]}; //此处增加多id的添加
        temp_result.push(temp);
      }
      this.setData({swiperImg : temp_result});
  ```

  - 这样每次页面初次加载的时候除了把图片的地址进行拉取封装, 也顺便把id也进行拉取和封装, 这样就可以当用户点击轮播图图片时,进行传入id 然后系统根据具体的id跳转至具体的新闻详情页

    

