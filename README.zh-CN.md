# Charity Events Hub — PROG2002 作业 2

一个动态 Web 应用，让用户浏览并搜索慈善筹款活动，演示了完整的客户端—服务端架构：

- **数据库：** MySQL（`charityevents_db`）
- **RESTful API：** Node.js + Express
- **客户端：** HTML + JavaScript + DOM + `fetch`（Promises / `async/await`）

## 功能

- 活动列表，带分类徽章和募款进度条
- 按日期 / 地点 / 分类搜索筛选
- 活动详情：列表页弹窗查看（「View details」），或独立详情页

## 项目结构

```
charity-events-project/
├── api/                    # 后端  -> usernameA2-api.zip
│   ├── event_db.js         # MySQL 连接池
│   ├── server.js           # Express 入口
│   ├── routes/
│   │   ├── events.js       # /api/events 端点
│   │   └── categories.js   # /api/categories 端点
│   ├── package.json
│   ├── .env                # 本地数据库配置（不提交）
│   └── .env.example
├── clientside/             # 前端 -> usernameA2-clientside.zip
│   ├── index.html          # 落地页（Hero）
│   ├── events.html         # 活动列表
│   ├── search.html         # 搜索 / 筛选
│   ├── event.html          # 活动详情页
│   ├── css/style.css
│   ├── js/
│   │   ├── api.js          # fetch 封装
│   │   ├── home.js         # 活动列表渲染
│   │   ├── search.js       # 搜索 / 筛选逻辑
│   │   ├── event.js        # 详情页渲染
│   │   └── event-modal.js  # 「View details」弹窗
│   └── images/
├── database/
│   └── charityevents_db.sql
├── docs/
│   └── project-report.md
├── start.bat               # 一键启动脚本（Windows）
└── README.md
```

## 环境要求

- [Node.js](https://nodejs.org/)（v18 或更高）
- [MySQL](https://dev.mysql.com/downloads/) 服务（本地实例）

## 快速开始

### 方式一：一键启动（Windows）

双击 `start.bat`。它会启动 API（`http://localhost:3000`）、前端
（`http://localhost:5500`），并自动在浏览器打开网站。

请先确保你的 MySQL 服务（例如 `MySQL84`）已在运行。

### 方式二：手动启动

#### 1. 导入数据库

```bash
mysql -u root -p < database/charityevents_db.sql
```

#### 2. 启动 API

```bash
cd api
npm install
npm start          # http://localhost:3000
```

API 端点：

| 方法 | 路径                 | 用途                          |
|------|----------------------|-------------------------------|
| GET  | `/api/events`        | 即将举办且未暂停的活动          |
| GET  | `/api/events/search` | 按日期/地点/分类搜索            |
| GET  | `/api/events/:id`    | 单个活动详情                   |
| GET  | `/api/categories`    | 所有分类                       |

#### 3. 启动前端

```bash
cd clientside
npx serve .        # 或使用 VS Code "Live Server"
```

然后打开 `http://localhost:5500/index.html`。

> 前端调用 `http://localhost:3000/api/...`。API 已开启 CORS，跨端口请求正常。

## 数据库配置

编辑 `api/.env` 以匹配你本地的 MySQL 配置：

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=你的密码
DB_NAME=charityevents_db
```

将 `.env.example` 复制为 `.env` 并填入你自己的值。