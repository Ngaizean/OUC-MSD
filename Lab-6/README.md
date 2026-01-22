| 实验名称       | 实验3：微信小程序实战进阶————推箱子游戏                   |
| -------------- | --------------------------------------------------------- |
| 博客地址       | https://blog.csdn.net/y_y_z_y_y_z?spm=1000.2115.3001.5343 |
| Github仓库地址 | https://github.com/Jamesonlong191207                      |

## 一、实验目标

1. 综合所学知识创建完整的推箱子游戏
2. 能够在开发过程中熟练掌握真机预览、调试等操作
3. ==**创新点**==(详情见下文自定义组件及逻辑内容)
   - 优化游戏**操作界面**, 使用箭头的矢量图代替文本箭头, 具备更好的用户体验.
   - 优化游戏逻辑, 游戏结束后, 自动重新开始.
   - ==新增智能计时器功能==, 自定义了一个倒计时组件, 设置初始值.
     - 倒计时完毕后, 视为游戏失败, 提示重新开始.
     - 倒计时完毕前玩家完成游戏, 则提示是否选择缩短时间后重新挑战, 增加**游戏难度**.

## 二、实验步骤

### 需求分析

- **首页需求**功能
  - 包含标题和关卡列表
  - 设计至少4个关卡.每个关卡显示预览图片和第几关
  - 点击关卡列表可以打开对应的游戏画面
- **游戏页**功能需求
  - 游戏页面需要显示第几关, 游戏画面, 方向键和"重新开始"按钮
  - 点击方向键可以使游戏主角自行移动或推动箱子前进
  - 点击重新开始按钮可以将箱子和游戏主角回归初始的位置并重新开始游戏

### 项目创建

- 使用手动创建模式, 不选择模板, 过往的文章已详细阐述, 此处不再赘述.

- **新建**`images`文件夹, 将用于图片资源的加载.

  - 图片资源如下

    ```
    https://gaopursuit.oss-cn-beijing.aliyuncs.com/2022/demo4_file.zip
    ```

- **新建**`utils`文件夹, 将用于公共数据的储存.

  <img src="../pic/Lab-6/1.jpg" alt="1" style="zoom:33%;" />

### 页面设计

- **导航栏**设计, 在`app.json`中进行编写

  ```json
  "window":{
      "backgroundTextStyle":"light",
      "navigationBarBackgroundColor": "#E64340",
      "navigationBarTitleText": "推箱子游戏",
      "navigationBarTextStyle":"black"
    },
  ```

- **公共样式** `app.wxss`

  ```css
  .container{
    height:100vh;
    color:#E64340;
    font-weight:bold;
    display:flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
  }
  
  .title{
    font-size: 18pt;
  }
  ```
  
- **主页面**页面设计, 即编写`index.wxml`和`index.wxss`

  ```html
  <view class='container'>
    <text class='title'>游戏选关</text>
    <view class='levelBox'>
      <view class='box'wx:for='{{levels}}'wx:key='levels{{index}}'bindtap='chooseLevel'data-level='{{index}}'> 
      <image src='/images/{{item}}'></image>
      <text>第{{index+1}}关</text>
    </view>
    </view>
  </view>
  ```
  
  - 首页主要包含两部分内容.即标题和关卡列表.
  - 设置传递的参数, 方便后期跳转指定的关卡页面
  
  ```css
  .levelBox{
    width:100%;
  }
  
  .box{
    width:50%;
    float:left;
    margin:20rpx 0;
    display:flex;
    flex-direction: column;
    align-items: center;
  }
  
  image{
    width:300rpx;
    height:300rpx;
  }
  ```
  
- **游戏页面**页面设计, 即编写`game.wxml`和`game.wxss`

  ```html
  <view class='container'>
    <view class='title'>第{{level}}关</view>
    <countdown duration="{{time}}" bindcomplete="handleCountdownComplete"></countdown>
    <canvas canvas-id='myCanvas'></canvas>
    <view class='btnBox'>
      <image class='btnImage upDown' src='/images/up.svg' bindtap='up'></image>
      <view class='arrowRow'>
        <image class='btnImage' src='/images/left.svg' bindtap='left'></image>
        <view class='spacer'></view>
        <image class='btnImage' src='/images/right.svg' bindtap='right'></image>
      </view>
      <image class='btnImage upDown' src='/images/down.svg' bindtap='down'></image>
      <image class='redo' src='/images/redo.svg' bindtap='restartGame'></image>
    </view>
  </view>
  ```

  - 游戏页面做了几点改变创新, 使用了图标的矢量图来替代按钮, 使整体的游戏UI能够更加美观.
  - 第三行是一个**自定义的倒计时组件**, 稍后会介绍, 此处可以忽略.

  ```css
  canvas {
    border: 1rpx solid;
    width: 320px;
    height: 320px;
  }
  
  .btnBox {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .arrowRow {
    display: flex;
    flex-direction: row;
    justify-content: space-between; /* 在左右箭头之间留出空位 */
    margin-top: 10rpx;
    width: 300rpx; /* 控制整体宽度 */
  }
  
  .spacer {
    width: 250rpx; /* 空位的宽度 */
  }
  
  .btnImage {
    width: 90rpx;
    height: 75rpx;
    margin: 10rpx;
  }
  
  .btnImage.upDown {
    width: 70rpx; /* 缩小上下箭头的宽度 */
    height: 70rpx; /* 缩小上下箭头的高度 */
  }
  
  .redo {
    width: 60rpx;
    height: 60rpx;
    margin-top: 70rpx;
  }
  
  ```

  - 样式表的设计有几点需要说明, 样式表实现将四个箭头上下左右阵列排布. 并在左右箭头之间设置了一定的空间.

  - `redo`样式对应的是重新开始的按钮, 调整到适合的大小.

  - 实现效果如下:

    <img src="../pic/Lab-6/2.jpg" alt="2" style="zoom:50%;" />


### 逻辑实现

- **公共逻辑**, `utils/data.js`	

  ```js
  //地图数据napl~map4
  //地图数据：1为墙、2为路、3为终点、4为箱子、5为人物、0为墙的外围
  //=================================
  //关卡1
  var map1 =[
    [0,1,1,1,1,1,0,0],
    [0,1,2,2,1,1,1,0],
    [0,1,5,4,2,2,1,0],
    [1,1,1,2,1,2,1,1],
    [1,3,1,2,1,2,2,1],
    [1,3,4,2,2,1,2,1],
    [1,3,2,2,2,4,2,1],
    [1,1,1,1,1,1,1,1]
    ]
    //关卡2
    var map2 =[
    [0,0,1,1,1,0,0,0],
    [0,0,1,3,1,0,0,0],
    [0,0,1,2,1,1,1,1],
    [1,1,1,4,2,4,3,1],
    [1,3,2,4,5,1,1,1],
    [1,1,1,1,4,1,0,0],
    [0,0,0,1,3,1,0,0],
    [0,0,0,1,1,1,0,0]
    ]
    //关卡3
    var map3=[
    [0,0,1,1,1,1,0,0],
    [0,0,1,3,3,1,0,0],
    [0,1,1,2,3,1,1,0],
    [0,1,2,2,4,3,1,0],
    [1,1,2,2,5,4,1,1],
    [1,2,2,1,4,4,2,1],
    [1,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,1,1]
    ]
    //关卡4
    var map4=[
    [0,1,1,1,1,1,1,0],
    [0,1,3,2,3,3,1,0],
    [0,1,3,2,4,3,1,0],
    [1,1,1,2,2,4,1,1],
    [1,2,4,2,2,4,2,1],
    [1,2,1,4,1,1,2,1],
    [1,2,2,2,5,2,2,1],
    [1,1,1,1,1,1,1,1]
    ]
  
    module.exports={
      maps:[map1,map2,map3,map4]
    }
  ```

  - 这里分别使用map1-map4代表4个不同关卡的地图数据.以二维数组的形式存放。当前地图均由8X8的方格组成每个位置的数字代表对应的图标素材.

  - 当前地图数据和图片索材仅供参考. 开发者也可以自行修改游戏布局和图片

  - 最后需要在game页而的JS文件顶端引用公共JS文件，引用代码如下

    ```js
    var data = require('././utils/data, js')
    ```

    - 需要注意小程序在这里暂时还不支持绝对路径弓I用.只能使用相对路径


- **首页逻辑**, `index.js`

  ```js
  // index.js
  Page({
    data: {
      levels:[
        'level01.png',
        'level02.png',
        'level03.png',
        'level04.png'
      ]
    },
    chooseLevel:function(e){
      let level=e.currentTarget.dataset.level
      wx.navigateTo({
        url:'../game/game?level='+level
      })
    },
  })
  ```

  - 首页主要有两个功能需要实现. 一是展示关卡列表；二是点击图片能跳转到游戏页面

  - 在JS文件的data中录入关卡图片的数据信息.这里以4个关卡为例.

  - 自定义点击事件函数`chooseLevel`.并且使用`data-level`属性 携带了关卡图片下标信息, 此时已经可以点击跳转到game页面•并且成功携带「关卡图片数据，但是仍需在game 页面进行携带数据的接收处理才可显示正确的游戏I川I而

  - 实现效果

    <img src="../pic/Lab-6/3.jpg" alt="3" style="zoom:33%;" />

    

- **游戏页逻辑** `game.js`

  ```js
  // pages/game/game.js
  var data=require('../../utils/data.js');
  
  //地图图层数据
  var map =[
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    ]
    //箱子图层数据
    var box =[
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0]
    ]
    var w=40
    
    var row=0
    var col=0
    
  Page({
  
    data: {
      level:1,
      time : 120,
  
    }, 
    code_data:
    {
      status : false
    },
  
    handleCountdownComplete() {
      console.log('倒计时结束，执行game.js中的函数');
      this.code_data.status = false;
      this.restartGame();
    },
    onLoad:function(options) {
      let level=options.level
      this.setData({
        level:parseInt(level)+1
      })
      this.ctx=wx.createCanvasContext('myCanvas')
  
      this.initMap(level)
  
      this.drawCanvas()
    },
  
    initMap:function(level){
      let mapData=data.maps[level]
  
      for(var i=0;i<8;i++){
        for(var j=0;j<8;j++){
          box[i][j]=0
          map[i][j]=mapData[i][j]
  
          if(mapData[i][j]==4){
            box[i][j]=4
            map[i][j]=2
          }else if(mapData[i][j]==5){
            map[i][j]=2
            row=i
            col=j
          }
        }
      }
    },
  
    drawCanvas:function(){
      let ctx=this.ctx
      ctx.clearRect(0,0,320,320)
  
      for(var i=0;i<8;i++){
        for(var j=0;j<8;j++){
          let img='ice'
          if(map[i][j]==1){
            img='stone'
          }else if(map[i][j]==3){
            img='pig'
          }
  
          ctx.drawImage('/images/icons/'+img+'.png',j*w,i*w,w,w)
  
          if(box[i][j]==4){
            ctx.drawImage('/images/icons/box.png',j*w,i*w,w,w)
          }
        }
      }
      ctx.drawImage('/images/icons/bird.png',col*w,row*w,w,w)
  
      ctx.draw()
    },
  
    up:function(){
      if(row>0){
        if(map[row-1][col]!=1&&box[row-1][col]!=4){
          row=row-1
        }
        else if(box[row-1][col]==4){
          if(row-1>0){
            if(map[row-2][col]!=1&&box[row-2][col]!=4){
              box[row-2][col]=4
              box[row-1][col]=0
              row=row-1
            }
          }
        }
        this.drawCanvas()
        this.checkWin()
      }
    },
  
    down:function(){
      if(row<7){
        if(map[row+1][col]!=1&&box[row+1][col]!=4){
          row=row+1
        }
        else if(box[row+1][col]==4){
          if(row+1<7){
            if(map[row+2][col]!=1&&box[row+2][col]!=4){
              box[row+2][col]=4
              box[row+1][col]=0
              row=row+1
            }
          }
        }
        this.drawCanvas()
        this.checkWin()
      }
    },
  
    left:function(){
      if(col>0){
        if(map[row][col-1]!=1&&box[row][col-1]!=4){
          col=col-1
        }
        else if(box[row][col-1]==4){
          if(col-1>0){
            if(map[row][col-2]!=1&&box[row][col-2]!=4){
              box[row][col-2]=4
              box[row][col-1]=0
              col=col-1
            }
          }
        }
        this.drawCanvas()
        this.checkWin()
      }
    },
  
    right:function(){
      if(col<7){
        if(map[row][col+1]!=1&&box[row][col+1]!=4){
          col=col+1
        }
        else if(box[row][col+1]==4){
          if(col+1<7){
            if(map[row][col+2]!=1&&box[row][col+2]!=4){
              box[row][col+2]=4
              box[row][col+1]=0
              col=col+1
            }
          }
        }
        this.drawCanvas()
        this.checkWin()
      }
    },
  
    isWin:function(){
      for(var i=0;i<8;i++){
        for(var j=0;j<8;j++){
          if(box[i][j]==4&&map[i][j]!=3){
            return false
          }
        }
      }
      return true
    },
  
    checkWin:function(){
      if(this.isWin()){
        this.code_data.status = true;
      }
    },
  
    restartGame:function(){
      if(!this.code_data.status)
      {
        wx.showModal({
          title: '提示',
          content: '是否要增加时间',
          complete: (res) => {
            if (res.cancel) {
              wx.showToast({
                title: '游戏结束',
                icon:'error',
                duration:900
              })
            }
            if (res.confirm) {
              let t = this.data.time + 30;
              this.setData({time:t});
            }
          }
        })
      }
      else
      {
        this.code_data.status = false;
        wx.showModal({
          title:"提示",
          content:'游戏成功！是否缩短时间重新挑战',
          success (res) {
            if (res.confirm) {
              let t = this.data.time - 30;
              if(t < 10)
               wx.showToast({
                 title: '时间已经达到最小值',
                 icon : 'error',
                 duration : 900
               })
               else 
               {
                this.setData({time : t});
               }
            }
          }
        })
      }
      this.initMap(this.data.level-1)
      this.drawCanvas()
    },
  })
  ```

  - 首先在文件的顶端记录一些游戏初始数据信息, 然后添加`initMap`函数.用于初始化游戏地图数据

  - 上述代码首先从公共函数文件`data.js`中读取对应关卡的游戏地图数据.然后使用双重`for`循环对每一块地图数据进行解析. 并更新当前游戏的初始地图数据、箱子数据以及游戏主角(小鸟)的所在位置.

  - 然后在`game.js`中添加自定义函数`drawCanvas`,用于将地图信息绘制到画布上

  - 最后在`game.js`的`onLoad`雨数中创建画布上下文并依次调用自定义函数`initMap`

  - 方向键逻辑实现

    - 自定义函数`up`、`down`、`left`和`right`分别用于实现游戏主角(小鸟) 在上、下、左、右4个方向的移动.每次点击在条件允许的情况下移动一格

  - **重新开始**的逻辑和计时器相结合, 下文会详细阐述, 此处可以忽略

  - 判断游戏成功是是只要有一个箱子没存在终点位置就判断游戏尚未成功, 最后在`game.js`的`4`个方向键函数中追加关于游戏成功判断的函数

  - 实现效果

    <img src="../pic/Lab-6/4.jpg" alt="4" style="zoom:33%;" />

### 自定义组件样式及逻辑

- 实现一个倒计时的组件, 并且实现跳动的效果, 增加游戏体验.

- 首先在组件文件夹`components`中新建文件夹`time`, 结构如下

  <img src="../pic/Lab-6/5.jpg" alt="4" style="zoom:33%;" />

- 组件样式如下

  ```html
  <!--components/countdown/time.wxml-->
  <!-- countdown.wxml -->
  <view class="countdown">
    <text class="countdown-number">{{count}}</text>
  </view>
  
  ```

  ```css
  /* components/countdown/time.wxss */
  /* countdown.wxss */
  .countdown {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    background-color: #ff6347;
    animation: scale-up 1s ease-in-out infinite;
  }
  
  .countdown-number {
    font-size: 36rpx;
    color: white;
    font-weight: bold;
  }
  
  @keyframes scale-up {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }
  
  ```

- 逻辑实现 `time.js`

  ```js
  // components/countdown/time.js
  Component({
    properties: {
      duration: {
        type: Number,
        value: 10,
        observer(newVal) {
          // 仅在新的 duration 值与当前计时器的持续时间不同时重启倒计时
          if (newVal !== this.data.count) {
            this.restartCountdown(newVal);
          }
        }
      },
    },
    data: {
      count: 10,
    },
    lifetimes: {
      attached() {
        this.startCountdown(this.data.duration);
      },
    },
    methods: {
      startCountdown(duration) {
        // 确保计时器是唯一的
        if (this.timer) {
          clearInterval(this.timer);
        }
  
        this.setData({ count: duration });
        this.timer = setInterval(() => {
          if (this.data.count > 0) {
            this.setData({ count: this.data.count - 1 });
          } else {
            clearInterval(this.timer);
            this.timer = null;
            this.triggerEvent('complete');
          }
        }, 1000);
      },
      restartCountdown(newDuration) {
        this.startCountdown(newDuration);
      },
      detached() {
        if (this.timer) {
          clearInterval(this.timer);
        }
      },
    }
  });
  ```

  - 主要是设置监听数据的变化, 一定检测到其他页面修改了倒计时的时间, 就重新根据设置的数据重新进行倒计时

  - 完成以上逻辑后, 需要在`game.json`中进行引用

    ```json
    {
      "component": true,
      "usingComponents": {
        "countdown": "/components/countdown/time"
      }
    }

  - `game.wxml`使用对应的语句进行调用

    ```html
    <countdown duration="{{time}}" bindcomplete="handleCountdownComplete"></countdown>
    ```

    - 一旦倒计时结束就会触发相应的函数

  - `game.js`对应的函数逻辑如下

    ```js
    handleCountdownComplete() {
        console.log('倒计时结束，执行game.js中的函数');
        this.code_data.status = false;
        this.restartGame();
      },
          
    restartGame:function(){
        if(!this.code_data.status)
        {
          wx.showModal({
            title: '提示',
            content: '是否要增加时间',
            complete: (res) => {
              if (res.cancel) {
                wx.showToast({
                  title: '游戏结束',
                  icon:'error',
                  duration:900
                })
              }
              if (res.confirm) {
                let t = this.data.time + 30;
                this.setData({time:t});
              }
            }
          })
        }
        else
        {
          this.code_data.status = false;
          wx.showModal({
            title:"提示",
            content:'游戏成功！是否缩短时间重新挑战',
            success (res) {
              if (res.confirm) {
                let t = this.data.time - 30;
                if(t < 10)
                 wx.showToast({
                   title: '时间已经达到最小值',
                   icon : 'error',
                   duration : 900
                 })
                 else 
                 {
                  this.setData({time : t});
                 }
              }
            }
          })
        }
        this.initMap(this.data.level-1)
        this.drawCanvas()
      },
    ```

    - 一旦倒计时结束, 视为失败, 则提示重新开始
    - 一旦倒计时还没结束, 但是游戏完成了, 就提示是否需要减少时间进行游戏, 增加游戏难度.

## 三、程序运行结果

<img src="../pic/Lab-6/7.jpg" alt="7" style="zoom:15%;" /><img src="../pic/Lab-6/8.jpg" alt="8" style="zoom:15%;" />

<img src="../pic/Lab-6/9.jpg" alt="9" style="zoom:15%;" /><img src="../pic/Lab-6/10.jpg" alt="10" style="zoom:15%;" />

### 创新点

- 见上文自定义组件内容

