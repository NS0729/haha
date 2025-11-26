# 部署错误修复指南

## 🔴 错误: npx 命令失败 (exit code 1)

### 常见原因和解决方案

#### 1. GitHub Secrets 未配置 ⚠️ 最常见

**错误表现**: `npx wrangler deploy` 失败，退出代码 1

**解决方法**:

1. **访问 GitHub Secrets 设置**:
   https://github.com/NS0729/haha/settings/secrets/actions

2. **添加 CLOUDFLARE_API_TOKEN**:
   - 点击 "New repository secret"
   - Name: `CLOUDFLARE_API_TOKEN`
   - Value: 您的 Cloudflare API Token
   - 获取: https://dash.cloudflare.com/profile/api-tokens
   - 选择 "Edit Cloudflare Workers" 模板

3. **添加 CLOUDFLARE_ACCOUNT_ID**:
   - 点击 "New repository secret"
   - Name: `CLOUDFLARE_ACCOUNT_ID`
   - Value: 您的 Cloudflare Account ID
   - 获取: https://dash.cloudflare.com (右侧边栏)

#### 2. Token 权限不足

**错误信息**: `Authentication error` 或 `401 Unauthorized`

**解决方法**:
- 确保 Token 有 `Cloudflare Workers:Edit` 权限
- 重新创建 Token 并更新 Secret

#### 3. Account ID 错误

**错误信息**: `Invalid account ID` 或 `Account not found`

**解决方法**:
- 确认 Account ID 正确（在 Cloudflare Dashboard 右侧边栏）
- 不要包含额外的空格或字符

#### 4. Worker 名称冲突

**错误信息**: `Worker name already exists`

**解决方法**:
- 更改 `wrangler.toml` 中的 `name` 字段
- 或删除 Cloudflare Dashboard 中的旧 Worker

#### 5. 配置文件错误

**错误信息**: `Invalid wrangler.toml` 或配置相关错误

**解决方法**:
- 检查 `wrangler.toml` 语法
- 确认 `main` 文件路径正确
- 确认 `worker/index.js` 文件存在

## 🔧 已改进的工作流

新的工作流包含：

1. ✅ **Secrets 验证**: 部署前检查 Secrets 是否存在
2. ✅ **文件验证**: 检查 worker 文件是否存在
3. ✅ **Wrangler 验证**: 检查 Wrangler 是否正确安装
4. ✅ **详细错误信息**: 提供清晰的错误提示和解决链接

## 📋 检查清单

部署前确认：

- [ ] GitHub Secrets 已配置
  - [ ] `CLOUDFLARE_API_TOKEN`
  - [ ] `CLOUDFLARE_ACCOUNT_ID`
- [ ] Token 有正确权限
- [ ] Account ID 正确
- [ ] `wrangler.toml` 配置正确
- [ ] `worker/index.js` 文件存在
- [ ] Worker 名称唯一

## 🚀 重新部署

修复问题后：

1. **重新触发部署**:
   - 访问: https://github.com/NS0729/haha/actions
   - 点击 "Run workflow" → "Run workflow"

2. **或推送新提交**:
   ```bash
   git commit --allow-empty -m "Retry deployment"
   git push
   ```

## 🔍 查看详细日志

1. 访问: https://github.com/NS0729/haha/actions
2. 点击失败的部署
3. 展开 "Deploy to Cloudflare Workers" 步骤
4. 查看详细的错误信息

## 📞 获取帮助

如果问题仍然存在：

1. **查看完整日志**: GitHub Actions 页面
2. **检查 Cloudflare Dashboard**: https://dash.cloudflare.com
3. **验证本地部署**: `npx wrangler deploy` (需要先配置本地认证)

## 🔗 相关链接

- GitHub Actions: https://github.com/NS0729/haha/actions
- GitHub Secrets: https://github.com/NS0729/haha/settings/secrets/actions
- Cloudflare Dashboard: https://dash.cloudflare.com
- Cloudflare API Tokens: https://dash.cloudflare.com/profile/api-tokens

