# 部署故障排除指南

## 🔴 部署失败 - 常见原因和解决方案

### 问题 1: Secrets 未配置 ⚠️ 最常见

**错误信息**:
- `Missing required secret: CLOUDFLARE_API_TOKEN`
- `Missing required secret: CLOUDFLARE_ACCOUNT_ID`
- `Error: Missing required input: apiToken`

**解决方法**:

1. **访问 GitHub Secrets 设置**:
   https://github.com/NS0729/haha/settings/secrets/actions

2. **添加 CLOUDFLARE_API_TOKEN**:
   - 点击 "New repository secret"
   - Name: `CLOUDFLARE_API_TOKEN`
   - Value: 您的 Cloudflare API Token
   - 获取 Token: https://dash.cloudflare.com/profile/api-tokens
   - 选择 "Edit Cloudflare Workers" 模板

3. **添加 CLOUDFLARE_ACCOUNT_ID**:
   - 点击 "New repository secret"
   - Name: `CLOUDFLARE_ACCOUNT_ID`
   - Value: 您的 Cloudflare Account ID
   - 获取 Account ID: https://dash.cloudflare.com (右侧边栏)

4. **重新触发部署**:
   - 访问: https://github.com/NS0729/haha/actions
   - 点击 "Run workflow"

### 问题 2: Token 权限不足

**错误信息**:
- `Authentication error`
- `Permission denied`
- `401 Unauthorized`

**解决方法**:

1. **检查 Token 权限**:
   - 访问: https://dash.cloudflare.com/profile/api-tokens
   - 确认 Token 有 `Cloudflare Workers:Edit` 权限

2. **重新创建 Token**:
   - 删除旧 Token
   - 创建新 Token，选择 "Edit Cloudflare Workers" 模板
   - 更新 GitHub Secret

### 问题 3: Account ID 错误

**错误信息**:
- `Invalid account ID`
- `Account not found`

**解决方法**:

1. **获取正确的 Account ID**:
   - 访问: https://dash.cloudflare.com
   - 在右侧边栏找到 "Account ID"
   - 复制完整的 Account ID

2. **更新 GitHub Secret**:
   - 访问: https://github.com/NS0729/haha/settings/secrets/actions
   - 更新 `CLOUDFLARE_ACCOUNT_ID`

### 问题 4: database_id 占位符

**错误信息**:
- `Invalid database ID`
- `Database not found`

**解决方法**:

**选项 A: 如果不需要 D1 数据库（仅测试部署）**

临时注释掉 D1 配置：

```toml
# [[d1_databases]]
# binding = "DB"
# database_name = "jewelry-db"
# database_id = "your-database-id-here"
```

**选项 B: 创建并配置 D1 数据库（推荐）**

1. **创建数据库**:
```bash
npx wrangler d1 create jewelry-db
```

2. **更新 wrangler.toml**:
```toml
database_id = "your-actual-database-id"
```

3. **初始化数据库**:
```bash
npx wrangler d1 execute jewelry-db --file=./schema.sql
```

### 问题 5: Worker 名称冲突

**错误信息**:
- `Worker name already exists`
- `Name conflict`

**解决方法**:

1. **更改 Worker 名称**:
   编辑 `wrangler.toml`:
   ```toml
   name = "jewelry-api-unique-name"
   ```

2. **或删除旧的 Worker**:
   - 访问: https://dash.cloudflare.com
   - 进入 Workers & Pages
   - 删除旧的 Worker

### 问题 6: 依赖安装失败

**错误信息**:
- `npm ci failed`
- `Package not found`

**解决方法**:

1. **检查 package.json**:
   确保所有依赖都正确

2. **更新工作流**:
   工作流已包含 `npm ci`，如果失败，检查 package.json

## 🔍 诊断步骤

### 步骤 1: 检查 GitHub Actions 日志

1. 访问: https://github.com/NS0729/haha/actions
2. 点击失败的部署
3. 查看详细的错误日志
4. 找到具体的错误信息

### 步骤 2: 验证 Secrets

访问: https://github.com/NS0729/haha/settings/secrets/actions

确认看到:
- ✅ `CLOUDFLARE_API_TOKEN`
- ✅ `CLOUDFLARE_ACCOUNT_ID`

### 步骤 3: 本地测试

```bash
# 安装依赖
npm install

# 测试 Worker（需要先配置 wrangler）
npx wrangler dev
```

## 🚀 快速修复清单

- [ ] GitHub Secrets 已配置
- [ ] Cloudflare Token 有正确权限
- [ ] Account ID 正确
- [ ] wrangler.toml 配置正确
- [ ] Worker 名称唯一
- [ ] 代码无语法错误

## 📞 获取帮助

如果问题仍然存在：

1. **查看完整日志**: https://github.com/NS0729/haha/actions
2. **检查 Cloudflare Dashboard**: https://dash.cloudflare.com
3. **查看 Wrangler 文档**: https://developers.cloudflare.com/workers/wrangler/

## 🔗 相关链接

- GitHub Actions: https://github.com/NS0729/haha/actions
- GitHub Secrets: https://github.com/NS0729/haha/settings/secrets/actions
- Cloudflare Dashboard: https://dash.cloudflare.com
- Cloudflare API Tokens: https://dash.cloudflare.com/profile/api-tokens

