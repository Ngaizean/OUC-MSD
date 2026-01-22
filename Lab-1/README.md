# 2024年夏季《移动软件开发》实验报告



<center>姓名：余毅臻  学号：22090022045</center>

| 姓名和学号         | 余毅臻 22090022045                                        |
| ------------------ | --------------------------------------------------------- |
| 本实验属于哪门课程 | 中国海洋大学24夏《移动软件开发》                          |
| 实验名称           | 实验1：第一个微信小程序                                   |
| 博客地址           | https://blog.csdn.net/y_y_z_y_y_z?spm=1000.2115.3001.5343 |
| Github仓库地址     | https://github.com/Jamesonlong191207                      |



## **一、实验目标**

1、学习使用快速启动模板创建小程序的方法；

2、学习不使用模板手动创建小程序的方法。



## 二、实验步骤

### 1. 快速启动模板创建小程序

- 首先将在微信的官网中下载并安装微信小程序开发者工具, 此处不再赘述. *安装完成后弹窗出现系统环境变量添加失败看下文问题总结与体会*

- 安装成功后, 双击打开微信小程序开发者工具. 并在首页中点击加号新建项目.

- 在新建项目的页面中, 根据自身的需要修改项目名称, 项目目录等信息.

  

  <img src="../pic/Lab-1/1.jpg" alt="1" style="zoom:33%;" />

  

- **AppID**有两种获取方式, 一般点击下拉框会自动抓取微信账号注册的小程序ID. 另外一种可以通过[微信小程序管理平台](https://mp.weixin.qq.com/)中的个人设置中找到对应的AppID

  

  <img src="../pic/Lab-1/2.jpg" alt="2" style="zoom: 33%;" />

  

- 点击创建后, 进入以下页面

  

  <img src="../pic/Lab-1/3.jpg" alt="3" style="zoom: 33%;" />



- 至此, 已经简单地完成通过模板进行创建小程序, 如果想进一步在手机上查看效果, 可以直接点击任务栏中的真机调试, 扫码后进入以下页面.

  

  <img src="../pic/Lab-1/4.jpg" alt="4" style="zoom:33%;" />

### 手动创建小程序

- 与模板创建类似, 但不同的是在新建项目页面中选择不使用模板, 这将会创建一个空白页面的小程序.

  

  <img src="../pic/Lab-1/5.jpg" alt="5" style="zoom: 25%;" />

  <img src="../pic/Lab-1/6.jpg" alt="6" style="zoom: 20%;" />

  

- 即使不使用模板, 初始的小程序中仍然有很多初始化的内容, 我们需要对其逐一删除和修改. *注意, 微信小程序开发者工具迭代快. 操作上可能会有所出入, 但是大致不变*

  - 将`app.json`文件内的`pages`属性中的`pages/logs/logs`删除, 以及上一行末尾的逗号.

  - 删除`index.wxml`和`index.wxss`中的所有代码, 但注意不要删除整个文件.

  - 删除`index.js`中的所有代码, 并且在次行空白处创建`Page`函数, 创建该函数建议使用代码自动补全的方式

    

    <img src="../pic/Lab-1/7.jpg" alt="7" style="zoom:33%;" />

    
  
  - 删除`app.js`中的所有代码, 并且在次行空白处创建`app`函数, 创建该函数建议使用代码自动补全的方式
  
    
  
    <img src="../pic/Lab-1/8.jpg" alt="8" style="zoom:33%;" />
  
    
  
  - 删除`app.wxss`中的全部代码
  
  - 以上的操作完成并保存后即可完成初步的创建.
  

### 视图设计

#### 导航栏设计

- 导航栏的样式定义一般在`app.json`中的`windows`属性. 默认值一般为黑底白字. 此处我们将其改为紫色背景, `app.json`文件的需要修改的代码如下:

  ```json
  "window": {
      "navigationBarBackgroundColor": "#663399",
      "navigationBarTitleText": "手动创建第一个程序"
    }
  ```

  - 编译后效果如下

    

    <img src="../pic/Lab-1/9.jpg" alt="9" style="zoom:33%;" />

#### 基础页面设计

- 小程序中的视图主要包括微信头像, 微信昵称和点击按钮. 按照前端的知识分析可得, 大致分为三个组件, 分别为图像组件, 文本组件,和按钮组件. 为了有更好的渲染效果, 完成`xtml`文件的编写后, 需要进一步在`wxss`中进行装饰. 以上是大致的页面设计方向.

  - 编写`xtml`文件(`index.wtml`)

    ```html
    <view class = 'container'>
      <image src = '{{src}}'mode = 'widthFix'></image>
      <text>{{name}}</text>
      <button open-type="getUserInfo"bindgetuserinfo='getMyInfo'>请点击获取头像和昵称</button>
    </view>
    ```

    - 为了获取动态数据, 此处使用模板进行占位, `{{}}`表示动态变量, 该变量所对应的值应当在`js`文件中得到定义.
    - 按钮组件的`open-type`值指定按钮的类型为 `getUserInfo`，表示点击按钮后将请求用户的头像和昵称. `bindgetuserinfo`的值表示当用户点击按钮并同意授权时，绑定的 `getMyInfo` 函数会被调用，这个函数通常在页面的 `.js` 文件中定义，处理用户信息的获取.
    - 实现逻辑主要是:当用户点击按钮时，小程序会弹出授权请求，询问用户是否允许获取他们的头像和昵称。如果用户同意，`getMyInfo` 函数会被触发，从而处理并显示用户的头像和昵称（`src` 和 `name`）在页面上。

  - 编写`wxss`文件(`index.wxss`)

    ```css
    .container{
      height: 100vh;  /*容器的高度*/
      display: flex;  /*布局方式 flex提供更灵活的方式*/
      flex-direction: column;  /*排列方式 竖向排列*/
      align-items: center;  /*对齐方式 居中对齐*/
      justify-content: space-around;  /*分布方式 上下间隔相等的均匀分布*/
    }
    image{
      width: 300rpx;
      border-radius: 50%; /*边框半径 数值越大边框的圆角越大*/
    }
    text{
      font-size: 50rpx;  /*字体大小*/
    }
    ```

    - `container`样式主要定义了设定容器的高度, 布局的方式和方向, 对齐方式.
    - `image`样式定义图片的宽度和形状
    - `text`样式定义小程序的文本的字体大小

  - 编写`index.js`

    ```js
    getMyInfo: function(e){  /*获取用户信息函数*/
        console.log(e.detail.userInfo)
        let info = e.detail.userInfo;
        this.setData({  /*获取用户信息 并将其覆盖至动态变量中*/
          src: info.avatarUrl,
          name: info.nickName
        })
      },
    data: {  /*页面初始加载的初始数据*/
        src: '/images/logo.png',  /*初始图片*/
        name:'DIVA  YUNG'
      },
    
    ```

    - 完成样式表和组件表的编写后, 需要在`js`文件中完成逻辑的编写. 首先是完善在组件表中按钮的获取函数的编写. `src`和`name`的变量对应组件表的同名变量, 一旦在过程中变量内容发生变化, 小程序的效果也会随之发生变化.
    - 代码中的初始图片为自定义, 读者可以根据自己的图片地址进行对应的修改即可.

- 最终的效果如下:

  

  <img src="../pic/Lab-1/10.jpg" alt="10" style="zoom:33%;" /><img src="../pic/Lab-1/11.jpg" alt="11" style="zoom:33%;" />

## 三、程序运行结果

### 模板创建

<img src="../pic/Lab-1/3.jpg" alt="3" style="zoom:33%;" />

### 手动创建

<img src="../pic/Lab-1/10.jpg" alt="10" style="zoom:33%;" /><img src="../pic/Lab-1/11.jpg" alt="11" style="zoom:33%;" />



## 四、问题总结与体会

### 开发工具安装

- **安装完成后提示系统的环境变量未能成功添加**

  ```
    一种解决办法是, 从系统的设置中的系统信息板块进入"高级系统设置", 并将开发工具安装根目录下的dll文件夹路径添加至path当中. 修改环境变量后记得重启电脑使得设置生效.
  ```


- `app.js`和`index.js`的代码补全问题

  ```
  代码补全应该选择函数类而不是变量类, 后者编译时不会报错但是渲染会变成一片空白, 两者区别见下图, 这是新手入手比较容易犯的错误
  ```

  <img src="../pic/Lab-1/12.jpg" alt="12" style="zoom:33%;" /><img src="../pic/Lab-1/13.jpg" alt="13" style="zoom:37%;" />

- 其他

  ```
  因为是手动进行创建, 因此对于一些本身的样式表比如导航栏的样式表, 能不删除就不删除, 尽可能改动与页面相关的文件, 例如index的三大文件wtml+wxss+js.
  ```

  