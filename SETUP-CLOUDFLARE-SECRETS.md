# 配置 Cloudflare Secrets 完整指南

## 步骤 1: 获取 Cloudflare API Token

### 1.1 访问 API Token 页面
已为您打开：https://dash.cloudflare.com/profile/api-tokens

### 1.2 创建 Token
1. 点击 **"Create Token"** 按钮
2. 选择 **"Edit Cloudflare Workers"** 模板（推荐）
   - 这会自动配置所需权限
3. 或者点击 **"Create Custom Token"** 自定义：
   - **Token name**: `jewelry-app-deploy`
   - **Permissions**:
     - Account → **Cloudflare Workers:Edit**
     - Zone → **Zone:Read** (如果需要)
   - **Account Resources**: 选择您的账户
   - **Zone Resources**: 选择 "Include All zones" 或特定域名

### 1.3 生成并复制 Token
1. 点击 **"Continue to summary"**
2. 点击 **"Create Token"**
3. **⚠️ 重要：立即复制 Token！**（格式：`xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`）
4. Token 只显示一次，请妥善保存

## 步骤 2: 获取 Cloudflare Account ID

### 2.1 访问 Dashboard
已为您打开：https://dash.cloudflare.com

### 2.2 查找 Account ID
1. 在右侧边栏找到 **"Account ID"**
2. 点击复制按钮复制 Account ID
3. 或者：
   - 点击任意 Worker
   - 在 Worker 详情页面的 URL 中可以找到 Account ID
   - 格式类似：`https://dash.cloudflare.com/[Account ID]/workers`

## 步骤 3: 在 GitHub 添加 Secrets

### 3.1 访问 Secrets 设置页面
已为您打开：https://github.com/NS0729/haha/settings/secrets/actions

### 3.2 添加 CLOUDFLARE_API_TOKEN
1. 点击 **"New repository secret"** 按钮
2. **Name**: 输入 `CLOUDFLARE_API_TOKEN`（必须完全一致）
3. **Secret**: 粘贴您复制的 Cloudflare API Token
4. 点击 **"Add secret"**

### 3.3 添加 CLOUDFLARE_ACCOUNT_ID
1. 再次点击 **"New repository secret"** 按钮
2. **Name**: 输入 `CLOUDFLARE_ACCOUNT_ID`（必须完全一致）
3. **Secret**: 粘贴您的 Cloudflare Account ID
4. 点击 **"Add secret"**

## 步骤 4: 验证配置

### 4.1 检查 Secrets
在 Secrets 页面应该看到：
- ✅ `CLOUDFLARE_API_TOKEN`
- ✅ `CLOUDFLARE_ACCOUNT_ID`

### 4.2 触发部署测试
1. 访问：https://github.com/NS0729/haha/actions
2. 选择 **"Deploy to Cloudflare Workers"** 工作流
3. 点击 **"Run workflow"** → **"Run workflow"**
4. 查看部署日志，确认部署成功

## 自动部署流程

配置完成后，每次您：
1. 推送代码到 `main` 分支
2. GitHub Actions 会自动触发
3. 构建并部署到 Cloudflare Workers

## 故障排除

### Token 权限不足
- 确保 Token 有 **Cloudflare Workers:Edit** 权限
- 检查 Account Resources 是否正确选择

### Account ID 错误
- 确保复制的是完整的 Account ID
- 不要包含额外的空格或字符

### 部署失败
1. 查看 Actions 日志：https://github.com/NS0729/haha/actions
2. 检查错误信息
3. 验证 Secrets 是否正确配置

### 手动触发部署
如果自动部署失败，可以手动触发：
1. 访问：https://github.com/NS0729/haha/actions
2. 选择工作流
3. 点击 **"Run workflow"**

## 安全提示

⚠️ **重要安全注意事项：**
- API Token 等同于密码，请妥善保管
- 不要将 Token 提交到代码仓库
- 定期轮换 Token（建议每 90 天）
- 如果 Token 泄露，立即删除并重新创建

## 相关链接

- Cloudflare API Tokens: https://dash.cloudflare.com/profile/api-tokens
- Cloudflare Dashboard: https://dash.cloudflare.com
- GitHub Secrets: https://github.com/NS0729/haha/settings/secrets/actions
- GitHub Actions: https://github.com/NS0729/haha/actions
- Wrangler 文档: https://developers.cloudflare.com/workers/wrangler/

## 快速命令参考

```bash
# 本地测试部署（需要先安装 wrangler）
npx wrangler deploy

# 查看部署状态
npx wrangler deployments list

# 查看日志
npx wrangler tail
```

