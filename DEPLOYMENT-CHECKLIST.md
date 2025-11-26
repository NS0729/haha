# 部署配置检查清单

## ✅ 已完成的配置

- [x] Git 仓库已初始化
- [x] 代码已推送到 GitHub: https://github.com/NS0729/haha
- [x] GitHub Actions 工作流已创建 (`.github/workflows/deploy.yml`)
- [x] Worker 代码已准备 (`worker/index.js`)
- [x] Wrangler 配置已创建 (`wrangler.toml`)

## ⚠️ 需要配置的项目

### 1. GitHub Secrets（必需）

访问：https://github.com/NS0729/haha/settings/secrets/actions

需要添加：
- [ ] `CLOUDFLARE_API_TOKEN` - Cloudflare API Token
- [ ] `CLOUDFLARE_ACCOUNT_ID` - Cloudflare Account ID

### 2. Wrangler 配置（可选，用于本地测试）

如果要在本地测试部署：
```bash
# 登录 Cloudflare
npx wrangler login

# 或使用 API Token
npx wrangler login --api-token YOUR_TOKEN
```

### 3. D1 数据库 ID（如果使用生产环境）

在 `wrangler.toml` 中更新：
```toml
database_id = "your-actual-database-id"
```

## 验证步骤

### 步骤 1: 检查 GitHub Secrets

1. 访问：https://github.com/NS0729/haha/settings/secrets/actions
2. 确认看到两个 Secrets：
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`

### 步骤 2: 测试部署

1. 访问：https://github.com/NS0729/haha/actions
2. 选择 "Deploy to Cloudflare Workers" 工作流
3. 点击 "Run workflow" → "Run workflow"
4. 查看部署日志，确认成功

### 步骤 3: 验证部署结果

部署成功后，您的 Worker 将在以下地址可用：
- 开发环境：`https://jewelry-api.YOUR_SUBDOMAIN.workers.dev`
- 自定义域名（如果配置）：您的自定义域名

## 自动部署流程

配置完成后，每次您：

```bash
git add .
git commit -m "Update code"
git push
```

GitHub Actions 会自动：
1. ✅ 检出代码
2. ✅ 安装依赖
3. ✅ 部署到 Cloudflare Workers

## 故障排除

### 问题 1: Secrets 未配置
**错误**: `Error: Missing required secret: CLOUDFLARE_API_TOKEN`

**解决**: 在 GitHub 添加 Secrets

### 问题 2: Token 权限不足
**错误**: `Authentication error` 或 `Permission denied`

**解决**: 
- 检查 Token 是否有 `Cloudflare Workers:Edit` 权限
- 重新创建 Token 并更新 Secret

### 问题 3: Account ID 错误
**错误**: `Invalid account ID`

**解决**: 
- 确认 Account ID 正确
- 在 Cloudflare Dashboard 右侧边栏查找

### 问题 4: 部署成功但 Worker 不可用
**解决**:
- 检查 Worker 名称是否正确
- 查看 Cloudflare Dashboard 中的 Workers
- 检查 Worker 日志

## 快速测试命令

```bash
# 查看 GitHub Actions 状态
# 访问: https://github.com/NS0729/haha/actions

# 本地测试（需要先配置 wrangler）
npx wrangler deploy

# 查看部署日志
npx wrangler tail
```

## 相关链接

- GitHub 仓库: https://github.com/NS0729/haha
- GitHub Actions: https://github.com/NS0729/haha/actions
- GitHub Secrets: https://github.com/NS0729/haha/settings/secrets/actions
- Cloudflare Dashboard: https://dash.cloudflare.com
- Cloudflare API Tokens: https://dash.cloudflare.com/profile/api-tokens

