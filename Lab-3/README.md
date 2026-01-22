# 2022年夏季《移动软件开发》实验报告



<center>姓名：余毅臻  学号：22090022045</center>

| 姓名和学号         | 余毅臻 22090022045                                        |
| ------------------ | --------------------------------------------------------- |
| 本实验属于哪门课程 | 中国海洋大学24夏《移动软件开发》                          |
| 实验名称           | 实验3：微信小程序云开发实战 ————垃圾分类小程序            |
| 博客地址           | https://blog.csdn.net/y_y_z_y_y_z?spm=1000.2115.3001.5343 |
| Github仓库地址     | https://github.com/Jamesonlong191207                      |

## 一、实验目标

1. 学习微信小程序云开发的基础知识。
2. 实现利用文本搜索的功能
3. 利用百度云的图像识别、语音识别接口进行功能开发
4. **本次实验解决了源码中关于用户昵称头像获取失败的bug**, 详情见文末. 
5. 同时成功调用了百度的图像识别, 使用手机端**拍摄**可以成功识别, 详情见实验结果.

## 二、实验步骤

### 云开发环境搭建

1. 云开发环境是将后端各种环境集成于一体, 以下将介绍本项目需要搭建的数据库, 云函数.

#### 云环境创建

- 在搭建数据库, 云函数前需要将环境搭建好, 并把环境ID进行记录.

  <img src="../pic/Lab-3/1.jpg" alt="1" style="zoom:25%;" />

  

  <img src="../pic/Lab-3/2.jpg" alt="2" style="zoom:25%;" />

#### 搭建数据库

- 数据库的作用是将垃圾分类小程序中涉及查询的条目和内容储存于云端. 一旦用户搜索某个关键词就会在云端的数据库搜索相关的条目, 并返回结果.

- 对于微信小程序官方给出的云开发的数据库而言, 该数据库是一种文档型的数据库, 这与传统的关系型数据库有所区别(例如`MySql`). 微信云开发所提供的云数据库将以`json`的方式进行储存.

- 对于本微信小程序, 需要储存的两个表(也叫集合)为`trash`和`type`, 相关的数据集文件已在仓库进行同步, 命名分别为: `trash.json`和`type.json`, 只需要将该两个文件直接**导入**数据库即可一键创建条目.

  <img src="../pic/Lab-3/3.jpg" alt="3" style="zoom:25%;" />

  <img src="../pic/Lab-3/4.jpg" alt="4" style="zoom:25%;" />

### 部署云函数

- 云函数相当于后端运行的代码段, 负责后端的逻辑运行. 云开发的云函数的独特优势在于与微信登录鉴权的无缝整合. 更多信息查看[官方技术文档](https://developers.weixin.qq.com/minigame/dev/wxcloud/guide/functions.html#%E4%BA%91%E5%87%BD%E6%95%B0)

- 本程序需要在服务器上运行多个函数, 分别为`getHotItems`, `login`, `search`, `type`.

  - 云函数在处理高并发比小程序端具有更独特的优势, 因此涉及到数据库的并发操作, 需要原子化, 将操作放在云函数, 使用的时候直接调用云函数是比较好的做法.
  - 每一个云函数将单独存放一个文件夹中, 并且所有的云函数的文件夹必须储存于`cloudfunctions`目录下, 对于初学者遵循惯例是比较好的.
  - 此外, 每一个云函数的文件夹下都有一个命名叫`index.js`的文件, 该文件是实现该云函数主要功能的文件.

- 以下将展示如何部署本程序的云函数, 请将源码导入开发者工具中.

- 首先将云函数的环境和上文创建的云开发环境进行关联

  <img src="../pic/Lab-3/5.jpg" alt="5" style="zoom:25%;" />

- 将本地上的云函数文件夹依次全部选择部署, 选择不上传`node_moudle`该选项上传部署

  <img src="../pic/Lab-3/6.jpg" alt="6" style="zoom:25%;" />

- 点击导航栏的`云开发`, 进入云开发页面后, 再次点击`云函数`, 查看是否部署成功.

  <img src="../pic/Lab-3/7.jpg" alt="7" style="zoom:25%;" />

### 百度云API应用创建

- 本程序需要涉及图像识别和处理, 因此需要调用百度云的`api`进行实现, 进入百度云[页面](https://console.bce.baidu.com/ai/?_=&fromai=1#/ai/imagerecognition/app/create)

- 勾选图像识别的全部内容, 将应用名称命名后点击创建.

- 创建完成后, 在概览页面进行零取免费调用额度

  <img src="../pic/Lab-3/8.jpg" alt="8" style="zoom:25%;" />

  <img src="../pic/Lab-3/9.jpg" alt="9" style="zoom:25%;" />

  <img src="../pic/Lab-3/11.jpg" alt="11" style="zoom:25%;" />

- 完成以上步骤后, 进入应用的详情列表, 查看对应的密钥, 需要进行记录.

  <img src="../pic/Lab-3/12.jpg" alt="12" style="zoom:25%;" />

### 替换源码参数

- 将本程序的源码导入开发者工具后, 在`project.config.json`文件中替换对应的`appid`, **注意此处的`appid`是==微信小程序==的而不是百度云的**

  <img src="../pic/Lab-3/15.jpg" alt="13" style="zoom:25%;" />

- 将刚刚记录的百度云`API Key`和`Secret Key`在`\pages\search\search.js`文件中进行替换

  <img src="../pic/Lab-3/13.jpg" alt="13" style="zoom:25%;" />

- 将云开发创建的环境ID替换至`app.js`文件当中

  <img src="../pic/Lab-3/14.jpg" alt="14" style="zoom:25%;" />

  

  - **至此, 全部的工作完成, 可以直接运行**

## 三、程序运行结果

<img src="../pic/Lab-3/16.jpg" alt="16" style="zoom:20%;" /><img src="../pic/Lab-3/17.jpg" alt="17" style="zoom:20%;" /><img src="../pic/Lab-3/18.jpg" alt="18" style="zoom:20%;" />

<img src="../pic/Lab-3/19.jpg" alt="19" style="zoom:20%;" /><img src="../pic/Lab-3/20.jpg" alt="20" style="zoom:20%;" /><img src="../pic/Lab-3/21.jpg" alt="21" style="zoom:20%;" />



## 四、问题总结与体会

### 云开发网络问题

- 微信云开发经常会出现数据加载失败的情况, 或者是使用云储存时, 上传失败的原因, 见下图.

  <img src="../pic/Lab-3/10.jpg" alt="10" style="zoom:25%;" />

  - **这样的问题一般可以通过关闭全局代理, 如果是规则代理下则将系统代理直接关闭. 另外一种可能是当前网络出现问题, 一般更换手机热点后, 刷新多次后得到解决.**

### ==用户头像昵称获取问题==

- 在微信官方社区给出的[公告](https://developers.weixin.qq.com/community/develop/doc/00022c683e8a80b29bed2142b56c01)中, 明确指出20222年10月25日后基础库2.27.1及以上的小程序不再支持`wx.getUserProfile`接口、`wx.getUserInfo`接口, 强行调用会出现默认的灰头像, 昵称变为"微信用户"

  <img src="../pic/Lab-3/22.jpg" alt="22" style="zoom:50%;" />

  <img src="../pic/Lab-3/23.jpg" alt="23" style="zoom:15%;" />

  - **解决方法是使用官方最新给出的昵称头像填写能力**, 找到源码中的`my.js`和`my.wxml`文件, 修改其中原本的代码, 更正如下

    ```html
    <--!my.wxml文件-->
    <image class="userinfo-avatar" src="{{avatarUrl}}" />
    <button class="getUserProfile" open-type="chooseAvatar" bind:chooseavatar="onChooseAvatar"> 绑定头像 </button>
    ```

    ```js
    //my.js文件  添加以下函数
    onChooseAvatar(e) 
    {
        this.setData({
          avatarUrl :e.detail.avatarUrl
        })
        console.log(e.detail.avatarUrl);
      },

  - 实现效果

    <img src="../pic/Lab-3/24.jpg" alt="24" style="zoom:25%;" />

### 受信任服务域名问题

- 手机端真机调试时, 出现无法搜索的情况, 查看错误信息后发现提示需要将百度的`api`网址添加到微信开发者平台中的受信任的服务域名的列表当中, 这是因为对于电脑的调试而言, 是不限制对外界域名的联系, 而对于手机的小程序的使用是只允许和域名的白名单进行通信, 所以将`https://aip.baidubce.com`添加至白名单即可.

  <img src="../pic/Lab-3/25.png" alt="25" style="zoom:30%;" />



