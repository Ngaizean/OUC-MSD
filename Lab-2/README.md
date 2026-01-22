# 天气查询小程序

> 使用第三方API开发实时天气查询应用

## 项目简介

本项目演示如何开发一个实时天气查询小程序，通过调用第三方天气API获取天气数据，并在小程序中展示。项目涵盖了网络请求、数据绑定、列表渲染等核心技术。

## 项目目标

1. 学习调用第三方API接口
2. 掌握网络请求和数据解析
3. 学习制作简洁美观的布局



## 项目步骤

### 前期准备

1. 本实验中, 需要使用和风天气的API, 需要注册开发者用户, 此处不再赘述, 附上官方文档的[地址](https://dev.qweather.com/docs/api/)
2. 小程序的天气状态展示需要和风天气提供的天气状态图标, 官网[下载链接](https://icons.qweather.com/)
   - 也可以通过官方给定的`GitHub`地址下载: `https://github.com/qwd/Icons/releases/download/v1.6.0/QWeather-Icons-1.6.0.zip`

<img src="../pic/Lab-2/1.jpg" alt="1" style="zoom:33%;" />

3. **API密钥申请**

   - 完成开发者的注册后, 进入和风天气[控制台](https://console.qweather.com/#/console), 在`项目管理`一栏中点击创建项目, 选择**免费订阅**以及**`Web API`**

     <img src="../pic/Lab-2/2.jpg" alt="2" style="zoom:33%;" />

   - 创建成功后, 记录下`KEY`

     <img src="../pic/Lab-2/3.jpg" alt="3" style="zoom:33%;" />

4. **服务器域名配置**

   - 微信小程序官方要求小程序只允许和白名单中的域名进行通信, 因此我们要将以下几个API的通信域名添加至微信的公众平台上

     ```
     https://api.qweather.com
     https://devapi.qweather.com
     https://geoapi.qweather.com
     ```

     <img src="../pic/Lab-2/4.jpg" alt="4" style="zoom:33%;" />

### 项目框架构建

1. 使用手动创建小程序的方式创建项目, 并删除不必要的文件, 上一个实验已详细阐述, 此处不再赘述.

2. **创建自定义文件**

   - 将下载好的和风天气天气状态图标文件夹移入自定义创建的文件夹`images`中, 该文件夹和`Pages`同级. 文件组织架构如下图所示

     <img src="../pic/Lab-2/5.jpg" alt="5" style="zoom:33%;" />

### 小程序视图设计

1. 导航栏设计

   - 更改`app.json`文件中的`window`属性如下, 使得导航栏文本变为"今日天气", 背景颜色为蓝色

     ```json
     "window": {
         "navigationBarTitleText": "今日天气",
         "navigationBarBackgroundColor": "#3883FA"
       },
     ```

2. **主页面设计(`xtml`+`wxss`)**

   - 页面上主要包含三大区域, 垂直排列布局. 从上至下的区域分别是: 地区选择器(用户可以自行选择查询地点), 当前地点的温度和天气状态展示区, 多行显示其他详细的天气信息(湿度气压等)

   - 编写`index.xtml`

     ```html
     <view class = 'container'>
        
       <!-- 区域1 地区选择器 -->
       <picker mode = 'region' bindchange="regionChange"> <!-- regionChange函数实现获取用户选择的地区的映射值-->
         <view>{{region}}</view>
       </picker>
       
       <!-- 区域2 当前地区的温度和天气状态展示区 -->
       <text>{{now.temp}} {{now.text}}</text>
       <image src = '/images/weather_icon/{{now.icon}}.svg'mode = 'widthFix'></image>
         
       <!-- 区域3 当前地区的详细天气展示区-->
       <view class = 'detail'>
         <view class = 'bar'>
           <view class = 'box'>湿度</view>
           <view class = 'box'>气压</view>
           <view class = 'box'>能见度</view>
         </view>
         <view class = 'bar'>
           <view class = 'box'>{{now.humidity}}</view>
           <view class = 'box'>{{now.pressure}}</view>
           <view class = 'box'>{{now.vis}}</view>
         </view>
         <view class = 'bar'>
           <view class = 'box'>风向</view>
           <view class = 'box'>风速</view>
           <view class = 'box'>风力</view>
         </view>
         <view class = 'bar'>
           <view class = 'box'>{{now.windDir}}</view>
           <view class = 'box'>{{now.windSpeed}}</view>
           <view class = 'box'>{{now.windScale}}</view>
         </view>
       </view>
         
     </view>
     ```

     - **此处作几点说明**: `region`和`now`分别是地区的动态变量和地区的**天气数据对象**, 两者会在`index.js`文件中有详细的定义和描述. 另外, 和风天气返回的天气数据对象即此处的变量`now`, 包含几个属性(见下), 因此详细的天气只需要访问该对象的对应属性即可. 更详细的信息请参照对应章节的[官方文档](https://dev.qweather.com/docs/api/weather/weather-now/)

       ```json
       "now": {
           "obsTime": "2020-06-30T21:40+08:00",
           "temp": "24",
           "feelsLike": "26",
           "icon": "101",
           "text": "多云",
           "wind360": "123",
           "windDir": "东南风",
           "windScale": "1",
           "windSpeed": "3",
           "humidity": "72",
           "precip": "0.0",
           "pressure": "1003",
           "vis": "16",
           "cloud": "10",
           "dew": "21"
         },
       ```

   - 编写`index.wxss`文件

     ```css
     /*整体页面的布局*/
     .container{
       height: 100vh;
       display: flex;
       flex-direction: column;
       align-items: center;
       justify-content: space-around;
     }
     
     text{
       font-size: 80rpx;
       color: #3c5f81;
     }
     
     image{
       width: 220rpx;
     }
     
     /*对于详细的天气大布局先列排列*/
     .detail{
       width: 100%;
       display: flex;
       flex-direction: column;
     }
     
     /*再行排列*/
     .bar{
       display: flex;
       flex-direction: row;
       margin: 20rpx 0;
     }
     
     .box{
       width: 33.3%;
       text-align: center;
     }
     ```

### 小程序逻辑实现

1. 获取城市ID

   - 根据和风天气请求天气数据的规定, URL中需要有和风天气中规定中的城市ID即`location`参数, 详见此一[章节](https://dev.qweather.com/docs/api/weather/weather-now/). 因此获取某个地区的实时天气之前, 首先要获取该地区的城市ID. 下图为请求实时天气的两个必选参数.

     <img src="../pic/Lab-2/6.jpg" alt="6" style="zoom:33%;" />

   - 有了这个方向后, 即我们编写获取实时天气函数之前, 应该先编写获取城市ID的函数. 和风天气同样给出了查询城市ID的API请求参数和方法, 详见这一[章节](https://dev.qweather.com/docs/api/geoapi/city-lookup/). 主要的必选参数有`location`, `key`. 分别对应要查询的地区和API密钥, **值得注意的是**, `location`参数接受中文的输入, 并且支持模糊搜索, 和风天气会默认给出最相近的10个城市的ID. 除了两个重要的必选参数外, 比较值得使用的可选参数有两个: `adm`和`number`, 分别对应要查询的地区的上一级行政区和返回城市的数量(默认是10个). **`adm`的使用可以有效避免重名查询导致的天气查询储存的状况**. 例如, 同样含有西安字样, 可以隶属山西省也可以隶属吉林省辽源市, 不同的上级区划可以区别同名查询. 总结以上, 即查询ID建议使用上述四个参数进行查询.

   - 上段解决了查询城市ID的方法, 本段解决参数的值怎么来. 上文提及, 主页面的区域1是一个地区选择器, 用户的每一次的改变地区的选项, 都将产生数据. 该数据包含了用户选的地区值. 即只需要将这数据中包含地区信息的数据传给查询的参数, 就可以获得对应的城市ID.

     ```json
     data: Object
     	now: {obsTime: "2024-08-20T16:57+08:00", temp: "26", feelsLike: "28", icon: "306", text: "中雨", …}
     	region: Array(3)
             0: "山东省"
             1: "青岛市"
             2: "黄岛区"
             length: 3
             nv_length: 3
     ```

     - 上述是程序运行期间的`this`对象的`data`字段. 可见, 当用户选择变化时, 对应的地区值将以数组的形式存入`data`字段中的`region`属性. 另外, 显而易见的是, 随着数组的下标的递增, 行政区划的粒度是更加细小的. 有了以上的铺垫, 以下展示**获取城市ID的函数**.

     ```js
     getcity: function(callback){
         var city_data = this.data.region;
         console.log(city_data);
         wx.request({  //微信提供的访问域名函数
           url: 'https://geoapi.qweather.com/v2/city/lookup?',
           data: {
             location: city_data[2], //要查询的地区 即最小粒度的地区
             adm: city_data[1], //用做区分重名的区分 查询地区的上一级行政区划
             number: '1',
             key: '你的密钥'
           },
           success: function(res){
             var city_id = res.data.location[0].id;
             callback(city_id); // 在请求成功后调用回调函数，传递city_id
           }
         });
       },
     ```

   - 获得和风天气返回的数据后, 对其中的数据进行提取, 根据其返回的数据包来看, 对应的城市ID以数据的形式存如返回数据包的`data`字段的`location`中, 见下图, 为部分数据包结构. 因而`city_id = res.data.location[0].id`

     <img src="../pic/Lab-2/7.jpg" alt="7" style="zoom:33%;" />

2. **获取城市实时天气**

   - 上文解决了请求实时天气所需要的城市ID参数`location`, 因此直接仿照上文函数进行改写得到, 获取城市实时天气函数:

     ```js
     getWeather: function(){
         var that = this;
         // 获取城市ID并在回调中使用它
         this.getcity(function(city_id) {
           // 这里继续发起请求获取天气数据
           wx.request({
             url: 'https://devapi.qweather.com/v7/weather/now?',
             data: {
               location: city_id,
               key: '你的key'
             },
             success: function(res){
               that.setData({now: res.data.now});
             }
           });
         });
       },
     ```

     - 此处使用回调函数的原因是`request`以异步的形式进行, 当查询城市ID的时候, 还没查询出来就开始请求实时天气, 此时容易报错.

   - 得到服务器的返回的数据后, 只需要将其中符合我们小程序需求的详细天气的字段提取出来, 并设置数据. 就可以实现动态变量的效果. 也是上文`index.wxml`中`now`的来由, 通过观察返回的数据包可知, 详细的天气数据储存在数据包中的`data`字段中, 该字段中`now`对象包含我们所需要全部详细天气数据

     <img src="../pic/Lab-2/8.jpg" alt="8" style="zoom:33%;" />

3. 其他逻辑实现

   ```js
   regionChange: function(e){
       this.setData({region: e.detail.value});
       this.getWeather();
     },
         
   onLoad: function (options) {
       this.getWeather();
     },
   ```

   - 上述的两个函数分别实现了改变地区时执行一次获取实时天气的操作和小程序首次加载时执行获取实时天气的操作. 后者需要配合`index.js`的`data`属性, 该属性定义了初次加载的默认数据.

## 运行结果

<img src="../pic/Lab-2/12.jpg" alt="12" style="zoom:25%;" /><img src="../pic/Lab-2/9.jpg" alt="9" style="zoom:25%;" /><img src="../pic/Lab-2/11.jpg" alt="11" style="zoom:25%;" /><img src="../pic/Lab-2/10.jpg" alt="10" style="zoom:25%;" />



## 常见问题

1. 异步编程问题

   ```js
   getcity: function(){
       var city_data = this.data.region;
       console.log(city_data);
       wx.request({
         ......
         },
         success: function(res){
           return res.data.location[0].id;
         }
       })
     },
   
     getWeather: function(){
       var that = this;
       //首先先获取该城市的ID
       var city_id = this.getcity();
       ......
     }
   ```

   - 上述代码运行时会出现 `city_id`为`undefine` 
   - 原因是 `wx.request` 是一个异步操作，而`getcity`函数直接返回了`undefined`，因为`return`语句是在`wx.request`的`success`回调函数之外执行的。回调函数只有在请求完成并收到响应后才会执行，因此在`getcity`函数返回时, `wx.request` 的请求还没有完成.
   - 修正代码参照上文