# 自动部署到 GitHub 指南

## 快速开始

### 一键自动部署

```powershell
# 使用脚本自动创建仓库并推送代码
powershell -ExecutionPolicy Bypass -File deploy-to-github.ps1 -RepoName "haha"
```

脚本会自动：
1. ✅ 检查并提交所有更改
2. ✅ 创建 GitHub 仓库（如果提供 Token）
3. ✅ 添加远程仓库
4. ✅ 推送代码到 GitHub

## 详细步骤

### 方法 1: 使用自动部署脚本（推荐）

#### 步骤 1: 获取 GitHub Token

1. 访问：https://github.com/settings/tokens/new
2. 填写 Note: `jewelry-app-deploy`
3. 勾选 `repo` 权限
4. 生成并复制 Token

#### 步骤 2: 运行部署脚本

```powershell
# 方式1: 使用环境变量（推荐）
$env:GITHUB_TOKEN = "ghp_您的Token"
powershell -ExecutionPolicy Bypass -File deploy-to-github.ps1 -RepoName "haha"

# 方式2: 脚本会提示输入 Token
powershell -ExecutionPolicy Bypass -File deploy-to-github.ps1 -RepoName "haha"

# 方式3: 如果仓库已创建，跳过创建步骤
powershell -ExecutionPolicy Bypass -File deploy-to-github.ps1 -RepoName "haha" -SkipRepoCreation
```

### 方法 2: 手动部署

#### 步骤 1: 创建 GitHub 仓库

访问：https://github.com/new
- Repository name: `haha`
- Description: `精美首饰展示应用 - Vue3 + Cloudflare Workers + D1`
- 选择 Public 或 Private
- 不要勾选任何初始化选项

#### 步骤 2: 添加远程仓库并推送

```bash
# 添加远程仓库
git remote add origin https://github.com/NS0729/haha.git

# 推送代码
git push -u origin main
```

## 设置 GitHub Actions 自动部署

### 步骤 1: 获取 Cloudflare 凭证

1. **API Token**:
   - 访问：https://dash.cloudflare.com/profile/api-tokens
   - 点击 "Create Token"
   - 使用 "Edit Cloudflare Workers" 模板
   - 或自定义权限：`Account.Cloudflare Workers:Edit`

2. **Account ID**:
   - 访问：https://dash.cloudflare.com/
   - 在右侧边栏找到 "Account ID"

### 步骤 2: 在 GitHub 添加 Secrets

1. 访问您的仓库：https://github.com/NS0729/haha
2. 点击 **Settings** → **Secrets and variables** → **Actions**
3. 点击 **New repository secret**
4. 添加以下 Secrets：

   - **Name**: `CLOUDFLARE_API_TOKEN`
     **Value**: 您的 Cloudflare API Token

   - **Name**: `CLOUDFLARE_ACCOUNT_ID`
     **Value**: 您的 Cloudflare Account ID

### 步骤 3: 自动部署

配置完成后，每次推送到 `main` 分支时，GitHub Actions 会自动：
1. 构建项目
2. 部署到 Cloudflare Workers

## 查看部署状态

1. 访问：https://github.com/NS0729/haha/actions
2. 查看部署工作流状态

## 手动触发部署

如果需要手动触发部署：

1. 访问：https://github.com/NS0729/haha/actions
2. 选择 "Deploy to Cloudflare Workers" 工作流
3. 点击 "Run workflow"

## 故障排除

### 推送失败

```bash
# 如果远程仓库已有内容，先拉取
git pull origin main --allow-unrelated-histories

# 然后再推送
git push -u origin main
```

### GitHub Actions 部署失败

1. 检查 Secrets 是否正确配置
2. 检查 Cloudflare Token 权限
3. 查看 Actions 日志：https://github.com/NS0729/haha/actions

### 权限问题

确保 GitHub Token 有 `repo` 权限，Cloudflare Token 有 Workers 编辑权限。

## 项目结构

```
.
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions 部署配置
├── deploy-to-github.ps1        # 自动部署脚本
├── worker/                     # Cloudflare Worker 代码
├── src/                        # Vue3 前端代码
└── ...
```

## 相关链接

- GitHub 仓库: https://github.com/NS0729/haha
- Cloudflare Dashboard: https://dash.cloudflare.com/
- GitHub Actions: https://github.com/NS0729/haha/actions

