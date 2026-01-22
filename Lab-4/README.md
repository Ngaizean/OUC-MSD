# 媒体播放器小程序

> 视频播放与弹幕功能的媒体应用

## 项目简介

本项目是一个功能完善的媒体播放器小程序，重点演示视频播放和弹幕功能的实现。项目涵盖了媒体API的使用、自定义组件开发、页面交互等核心技术。

## 项目目标

1. 掌握视频API的操作方法
2. 实现随机颜色弹幕发送功能
3. 优化用户体验和交互逻辑

## 项目步骤

### 前期资源准备

- 本程序是实现一个利用播放视频来讲述校史的小程序, 因此需要准备以下资源内容: *线上视频内容*和*播放图标*

  ```c
  //线上视频资源地址
  https://arch.ahnu.edu.cn/__local/6/CB/D1/C2DF3FC847F4CE2ABB67034C595_025F0082_ABD7AE2.mp4?e=.mp4
  https://arch.ahnu.edu.cn/__local/E/31/EB/2F368A265E6C842BB6A63EE5F97_425ABEDD_7167F22.mp4?e=.mp4
  https://arch.ahnu.edu.cn/__local/9/DC/3B/35687573BA2145023FDAEBAFE67_AAD8D222_925F3FF.mp4?e=.mp4
  https://arch.ahnu.edu.cn/__local/5/DA/BD/7A27865731CF2B096E90B522005_A29CB142_6525BCF.mp4?e=.mp4
  
  //播放组件图片地址
  https://gaopursuit.oss-cn-beijing.aliyuncs.com/2022/images_play.zip
  ```

### 创建项目

- 本部分比较简单, 详情见`Lab-1`的手动创建(即第一篇博客)

### 视图设计

- 导航栏(`app.json`)

  ```json
  "window": {
      "navigationBarBackgroundColor": "#987938",
      "navigationBarTitleText": "口述校史"
    },
  ```

- **主页面设计**

  - `index.wxml`编写

    ```html
    <video id = 'myVideo' src="{{src}}" controls enable-danmu danmu-btn></video>  <--! 支持弹幕的视频组件-->
    <view class = 'danmuArea'>
      <input type = 'text' placeholder="请输入弹幕内容"bindinput = 'getDanmu'></input>
      <button bindtap="sendDanmu">发送弹幕</button>
    </view>
    <view class = 'videoList'>
      <view class='videoBar' wx:for="{{list}}"wx:key="id"data-url='{{item.videoUrl}}'bindtap='playVideo'>
        <image src = '/images/play.png'></image>
        <text>{{item.title}}</text>
      </view>
    </view>
    ```

    - 视频组件中`controls`代表是否显示默认播放控件; `enable-danmu` : 是否展示弹幕，只在初始化时有效，不能动态变更; `danmu-btn`: 是否显示弹幕按钮，只在初始化时有效，不能动态变更. 更多属性请参照官方文档[Video组件](https://developers.weixin.qq.com/miniprogram/dev/component/video.html)
    - 弹幕区域, `input`组件实现获取输入, `button`组件实现发送逻辑
    - 视频播放列表区域, 使用**列表渲染**, 其中`wx:key`为字符串类型时, 代表在`for`循环的`list`中`item`的某个`property`(即属性)，该`property`的值需要是列表中唯一的字符串或数字，且不能动态改变. 另外, 为了实现**点击列表后让机器知道点击的是哪一个**, 使用`data-`字段, 该字段数据将被回调给触发函数(即`playVideo`). 更多关于列表渲染, 请参照官方文档[列表渲染](https://developers.weixin.qq.com/miniprogram/dev/reference/wxml/list.html).
    - 动态变量和触发函数将在后文逻辑实现进行阐述

  - `index.wxss`视图样式编写

    ```css
    video{
      width: 100%;
    }
    
    .danmuArea{
      display : flex;
      flex-direction: row;
    }
    
    input{
      border: 1rpx solid #987938;
      flex-grow : 1;
      height : 100rpx;
    }
    
    button{
      color: white;
      background-color: #987938; 
      line-height: 35px;   
    }
    
    .videoList
    {
      width : 100%;
      min-height: 400rpx;
    }
    
    .videoBar
    {
      width: 95%;
      display: flex;
      flex-direction: row;
      border-bottom: 1rpx solid #987938;
      margin: 10rpx;
    }
    
    image{
      width: 70rpx;
      height: 70rpx;
      margin: 20rpx;
    }
    
    text {
      font-size: 45rpx;
      color: #987938;
      margin: 20rpx;
      flex-grow: 1;
    }
    ```

  - **暂时实现效果**

    <img src="../pic/Lab-4/1.jpg" alt="1" style="zoom:25%;" />

### 逻辑实现(`index.js`)

- 页面数据 视频元数据 + 弹幕文本

  ```js
  data: {
      danmuTxt:'',  //弹幕文本
      list : 
      [
        {
          id : '299371',
          title : '杨国宜先生口述校史实录',
          videoUrl: 'https://arch.ahnu.edu.cn/__local/6/CB/D1/C2DF3FC847F4CE2ABB67034C595_025F0082_ABD7AE2.mp4?e=.mp4'
        },
        {
          id : '299396',
          title : '唐成伦先生口述校史实录',
          videoUrl: 'https://arch.ahnu.edu.cn/__local/E/31/EB/2F368A265E6C842BB6A63EE5F97_425ABEDD_7167F22.mp4?e=.mp4'
        },
        {
          id : '299378',
          title : '倪光明先生口述校史实录',
          videoUrl: 'https://arch.ahnu.edu.cn/__local/9/DC/3B/35687573BA2145023FDAEBAFE67_AAD8D222_925F3FF.mp4?e=.mp4'
        },
        {
          id : '299392',
          title : '吴兴仪先生口述校史实录',
          videoUrl: 'https://arch.ahnu.edu.cn/__local/5/DA/BD/7A27865731CF2B096E90B522005_A29CB142_6525BCF.mp4?e=.mp4'
        }
      ]
    },
  ```

  - 视频使用列表方式储存, 是对应前端的列表渲染, 使用同名动态变量`list`, `item`就是列表的元素, `index`就是列表的下标值. 每一个元素都用对象表示, 且都包含`id`字段, 该字段也是对应前端`wx:key`的字符串.`id`值可以自己自定义, 只要保证各个元素的`id`各不相同即可.

- **视频播放**实现

  ```js
  onLoad: function (options) {
      this.videoCtx = wx.createVideoContext('myVideo'); //创建视频上下文
    },
  
  playVideo: function(e) //e参数来源组件的data-字段的回传
    {
      this.videoCtx.stop() //操作视频 切换前先暂停
      this.setData({
        src : e.currentTarget.dataset.url  //更新视频组件对应的URL 
      });
      this.videoCtx.play();
    },
  ```

  - 对于视频的操作, 需要预先创建视频上下文. `createVideoContext`接收参数为视频组件的`id`, 返回值为`VideoContext`实例. 只有操作该实例才能操作视频, [VideoContext](https://developers.weixin.qq.com/miniprogram/dev/api/media/video/VideoContext.html) 通过`id`跟一个[video](https://developers.weixin.qq.com/miniprogram/dev/component/video.html)组件绑定，操作对应的[video](https://developers.weixin.qq.com/miniprogram/dev/component/video.html)组件. 该实例有很多方法, 详情参照官方文档.

- 弹幕接收发送实现

  ```js
  getDanmu : function(e)
    {
      this.setData({
        danmuTxt:e.detail.value
      })
    },
        
   sendDanmu : function()
    {
      let text = this.data.danmuTxt;
      this.videoCtx.sendDanmu({
        text: text,
        color:this.getRandomColor() 
      })
    },
    //实现随机颜色
    getRandomColor :function() {
      let rgb = []
      for(let i = 0; i < 3; ++i)
      {
        let color = Math.floor(Math.random() * 256).toString(16)
        color = color.length == 1 ? 'O' + color : color;
        rgb.push(color)
      } 
      return '#' + rgb.join('')
  },
  ```

  - 主要使用`videoContext`实例中的`sendDanmu`方法

- 综合以上所有文件, 得到最后效果

  <img src="../pic/Lab-4/2.jpg" alt="2" style="zoom:25%;" />

## 三、效果展示

<img src="../pic/Lab-4/3.jpg" alt="3" style="zoom:25%;" /><img src="../pic/Lab-4/4.jpg" alt="4" style="zoom:25%;" />



## 四、进一步优化

### 使用云储存

- 网络资源容易因为网络波动的原因或者是服务者取消资源的情况导致失效. 因此将视频资源下载下来并上传至云储存中, 云储存使用前必须开通云开发, 云开发的使用详情看上一章节. 进入云开发后点击云储存, 上传已经下载的视频

  <img src="../pic/Lab-4/5.jpg" alt="5" style="zoom:25%;" />

  - 把原来的`url`更换至`File ID`

    ```js
    //index.js
    {
            id : '299371',
            title : '杨国宜先生口述校史实录',
            videoUrl: 'cloud://.../1.mp4'
    },
    ......
    ```

### 优化视频组件和播放逻辑

- 使用`show-snapshot-button`, 增加截屏功能. 使用`bindwaiting`属性监听视频缓冲中的情况, 及时弹窗, 告知用户此时视频的状态, 进一步用户体验. 

- 此外, 使用`binderror`属性监听视频因为各种原因可能出现播放失败的情况, 及时弹窗并重新刷新页面

  ```html
  <video id = 'myVideo' src="{{src}}" controls enable-danmu danmu-btn show-snapshot-button bindwaiting='videowait' binderror='videoerror' bindprogress="videoprogress"></video>
  ```

  ```js
  videowait: function() {
    wx.showLoading({
      title: '缓冲中',
    });
  },
  videoprogress: function(e) //绑定组件缓冲监听函数
  {
    if (e.detail.buffered >= 15) {  //设置15为阈值, 100不现实
      wx.hideLoading(); 
    }
  },
  videoerror : function()
  {
    wx.showToast({
      title: '视频播放出错，将自动刷新',
      icon : 'error',
      duration : 2000
    });
    wx.startPullDownRefresh();
  }
  ```

### 解决`The play() request was interrupted by a call to pause()`

- 视频设置播放前应设置一定的延迟时间 如果不设置, 资源尚未加载成功后就设置播放状态容易打断资源的加载过程, 从而抛出异常.

  ```js
  playVideo: function(e)
    {
      // 如果当前有播放中的视频，先停止
      this.videoCtx.stop();
      this.setData({
        src: e.currentTarget.dataset.url
      }, () => {
        setTimeout(() => {
          this.videoCtx.play();
        }, 1000); // 延迟500毫秒播放视频
      });
   },
  ```

  
