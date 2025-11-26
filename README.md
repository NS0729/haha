# 精美首饰 App

一个使用 Vue3 和 Cloudflare Workers + D1 构建的精美首饰展示应用。

## 功能特性

- 🎨 精美的现代化 UI 设计
- 📱 响应式布局，支持移动端
- 🔍 产品搜索和分类筛选
- 💎 产品详情页面
- 🚀 基于 Cloudflare Workers 的高性能 API
- 💾 使用 D1 数据库存储数据

## 技术栈

### 前端
- Vue 3
- Vue Router
- Vite
- Axios

### 后端
- Cloudflare Workers
- D1 Database

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 D1 数据库

首先，你需要在 Cloudflare 上创建 D1 数据库：

```bash
# 创建数据库
npx wrangler d1 create jewelry-db

# 获取数据库 ID，然后更新 wrangler.toml 中的 database_id
```

### 3. 初始化数据库

```bash
# 在本地创建数据库
npx wrangler d1 execute jewelry-db --local --file=./schema.sql

# 在生产环境创建数据库
npx wrangler d1 execute jewelry-db --file=./schema.sql
```

### 4. 开发

```bash
# 启动前端开发服务器
npm run dev

# 在另一个终端启动 Worker 开发服务器
npm run dev:worker
```

前端运行在 http://localhost:3000
Worker API 运行在 http://localhost:8787

### 5. 部署

```bash
# 构建前端
npm run build

# 部署 Worker
npm run deploy:worker
```

## 项目结构

```
.
├── src/                    # Vue 前端源码
│   ├── components/        # Vue 组件
│   ├── views/            # 页面视图
│   ├── utils/            # 工具函数
│   ├── App.vue           # 根组件
│   ├── main.js           # 入口文件
│   └── style.css         # 全局样式
├── worker/               # Cloudflare Worker
│   └── index.js          # Worker 主文件
├── schema.sql            # 数据库 schema
├── wrangler.toml         # Worker 配置
├── vite.config.js        # Vite 配置
└── package.json          # 项目配置
```

## API 端点

- `GET /api/products` - 获取产品列表（支持 category, search, sort, limit 参数）
- `GET /api/products/:id` - 获取单个产品
- `POST /api/products` - 创建新产品
- `PUT /api/products/:id` - 更新产品
- `DELETE /api/products/:id` - 删除产品

## 环境变量

创建 `.env` 文件（可选）：

```
VITE_API_URL=http://localhost:8787/api
```

## 许可证

MIT

