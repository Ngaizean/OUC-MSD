# 拼车平台 - 微信小程序

> 基于微信云开发的全功能拼车服务平台

## 项目简介

这是一个完整的拼车服务小程序，为用户提供便捷的拼车出行解决方案。本项目采用微信云开发架构，整合了数据库、云函数和云存储三大基础能力，实现了用户发布拼车信息、在线报名、实时拼车等核心功能。

项目展示了微信小程序云开发的完整应用场景，适合作为学习参考或商业项目基础进行二次开发。

## 核心功能

### 1. 用户系统
- 微信授权登录
- 用户头像和昵称管理
- 用户信息完善（真实姓名、手机号）

### 2. 广场功能
- 展示所有可参与拼车订单
- 支持按起点、终点、时间筛选
- 支持搜索功能
- 只显示当日及之后的订单
- 隐藏已取消/满员的订单

### 3. 订单详情
- 查看完整的拼车信息
- 查看参与者头像列表
- 一键加入/退出拼车
- 订单收藏功能
- 实时拼车入口

### 4. 发布订单
- 发布拼车信息
- 设置起点、终点、时间
- 设置剩余车位
- 添加备注信息
- 免责声明确认

### 5. 实时拼车
- 实时签到功能
- 上传车辆信息
- 查看参与者状态
- 呼叫未签到用户
- 共享位置（规划中）

### 6. 个人中心
- 我的发布
- 我的收藏
- 全部记录
- 用户设置
- 退出登录

## 技术架构

### 前端技术
- **框架**: 微信小程序原生框架
- **语言**: WXML、WXSS、JavaScript
- **UI组件**: 自定义组件 + WeUI
- **状态管理**: 小程序原生数据绑定

### 后端技术
- **云开发平台**: 微信云开发
- **数据库**: 云数据库（JSON 文档型）
- **云函数**: Node.js 12+
- **云存储**: 云存储服务

### 数据库设计

#### 用户表 (users)
```javascript
{
  _id: String,              // 用户ID
  _openid: String,          // 微信OpenID
  username: String,         // 用户昵称
  pic_address: String,      // 头像云存储地址
  phone: String,            // 手机号
  realname: String,         // 真实姓名
  favorite: Array,          // 收藏列表
  create: Array,            // 发布订单列表
  createTime: Date          // 注册时间
}
```

#### 订单表 (orders)
```javascript
{
  _id: String,              // 订单ID
  _openid: String,          // 发布者OpenID
  begin_place: String,      // 起点
  end_place: String,        // 终点
  date: String,             // 出发日期
  time: String,             // 出发时间
  rest_seat: Number,        // 剩余车位
  text: String,             // 备注
  passenger: Array,         // 参与者列表
  status: String,           // 订单状态（pending/active/finished/cancelled）
  carinfo: String,          // 车辆信息
  phone: String,            // 联系电话
  createTime: Date          // 创建时间
}
```

## 项目结构

```
finalProject/
├── README.md                  # 项目说明（本文件）
├── 页面逻辑设计.md             # 详细页面设计文档
├── project.config.json        # 项目配置
├── project.private.config.json # 私有配置
├── cloudfunctions/            # 云函数目录
│   ├── getid/                 # 获取用户OpenID
│   ├── quickstartFunctions/   # 快速入门云函数
│   └── ...                    # 其他云函数
├── miniprogram/               # 小程序前端
│   ├── pages/                 # 页面
│   │   ├── start/             # 启动页
│   │   ├── square/            # 广场页
│   │   ├── detail/            # 详情页
│   │   ├── realtime/          # 实时拼车页
│   │   ├── publish/           # 发布页
│   │   ├── me/                # 我的页
│   │   ├── mypublish/         # 我的发布页
│   │   ├── myfavorite/        # 我的收藏页
│   │   ├── allrecords/        # 全部记录页
│   │   └── ...                # 其他页面
│   ├── components/            # 自定义组件
│   ├── images/                # 图片资源
│   ├── utils/                 # 工具函数
│   ├── app.js                 # 小程序逻辑
│   ├── app.json               # 小程序配置
│   └── app.wxss               # 全局样式
└── uploadCloudFunction.bat    # 云函数上传脚本
```

## 页面说明

| 页面 | 功能说明 | 文件路径 |
|------|----------|----------|
| 启动页 | 用户授权，登录跳转 | `pages/start/` |
| 广场页 | 展示拼车订单列表 | `pages/square/` |
| 详情页 | 订单详情，加入/退出 | `pages/detail/` |
| 实时拼车页 | 实时签到，车辆信息 | `pages/realtime/` |
| 发布页 | 发布拼车订单 | `pages/publish/` |
| 我的页 | 个人中心入口 | `pages/me/` |
| 我的发布 | 用户发布的订单 | `pages/mypublish/` |
| 我的收藏 | 用户收藏的订单 | `pages/myfavorite/` |
| 全部记录 | 历史参与记录 | `pages/allrecords/` |

## 快速开始

### 环境准备

1. 下载并安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 注册微信小程序并获取 AppID
3. 开通微信云开发服务

### 项目导入

1. 打开微信开发者工具
2. 选择"导入项目"
3. 选择 `finalProject` 目录
4. 填写 AppID
5. 点击"导入"

### 云开发配置

1. 在微信开发者工具中点击"云开发"按钮
2. 创建云开发环境
3. 在 `project.config.json` 中配置云环境 ID
4. 上传云函数：右键 `cloudfunctions` 目录下的云函数文件夹，选择"上传并部署：云端安装依赖"

### 数据库初始化

1. 在云开发控制台中创建数据库
2. 创建 `users` 集合（用户表）
3. 创建 `orders` 集合（订单表）
4. 设置适当的权限规则

## 开发说明

### 页面逻辑设计

详细的页面逻辑设计请参考：[页面逻辑设计.md](./页面逻辑设计.md)

### 云函数开发

云函数位于 `cloudfunctions/` 目录下，每个云函数都需要单独上传部署。

主要云函数：
- `getid`: 获取用户 OpenID
- `quickstartFunctions`: 快速入门示例

### 自定义组件

自定义组件位于 `miniprogram/components/` 目录下，可复用的 UI 组件。

### 数据库权限

数据库权限规则建议：
- 用户表：仅创建者可读写
- 订单表：创建者可读写，其他人只读

## 功能迭代

### V1.0（已实现）
- 基础拼车功能
- 用户系统
- 订单发布与管理
- 收藏功能

### V2.0（已实现）
- 自定义头像和昵称
- 参与者头像显示
- 实时拼车签到
- 车辆信息上传

### V3.0（规划中）
- 位置共享
- 路线规划
- 消息推送
- 积分系统

## 常见问题

### 1. 云函数上传失败
确保已开通云开发服务，并且网络连接正常。

### 2. 数据库权限错误
检查云开发控制台中的数据库权限设置。

### 3. 图片上传失败
检查云存储是否已开通，以及存储权限配置。

## 参考文档

- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
- [微信开发者工具下载](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)

## 许可证

本项目采用 [LICENSE](../LICENSE) 许可证。

## 贡献

欢迎提交 Issue 和 Pull Request 进行交流和改进。

---

**Happy Coding!** 🚀
