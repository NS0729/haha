# GitHub 仓库创建指南

## 方法 1: 使用脚本自动创建（需要 GitHub Token）

### 步骤 1: 创建 GitHub Personal Access Token

1. 访问：https://github.com/settings/tokens
2. 点击 "Generate new token" → "Generate new token (classic)"
3. 填写 Note（如：`jewelry-app-repo`）
4. 选择过期时间
5. **勾选 `repo` 权限**（完整仓库访问权限）
6. 点击 "Generate token"
7. **复制 token**（只显示一次！）

### 步骤 2: 使用脚本创建仓库

```powershell
# 使用 token 创建仓库
powershell -ExecutionPolicy Bypass -File create-github-repo.ps1 -RepoName "haha" -Description "精美首饰展示应用" -Token "your-token-here"

# 或者设置为私有仓库
powershell -ExecutionPolicy Bypass -File create-github-repo.ps1 -RepoName "haha" -Private -Token "your-token-here"

# 或者将 token 设置为环境变量（更安全）
$env:GITHUB_TOKEN = "your-token-here"
powershell -ExecutionPolicy Bypass -File create-github-repo.ps1 -RepoName "haha"
```

## 方法 2: 手动创建（推荐，更简单）

### 步骤 1: 访问创建页面

访问：https://github.com/new

### 步骤 2: 填写表单

- **Owner**: NS0729（已选择）
- **Repository name**: `haha`（或您喜欢的名称）
- **Description**: `精美首饰展示应用 - Vue3 + Cloudflare Workers + D1`
- **可见性**: 选择 Public 或 Private
- **不要勾选**: README、.gitignore、License（本地已有代码）

### 步骤 3: 点击 "Create repository"

### 步骤 4: 添加远程仓库并推送

创建完成后，GitHub 会显示仓库 URL，然后运行：

```bash
# 添加远程仓库
git remote add origin https://github.com/NS0729/haha.git

# 推送代码
git push -u origin main
```

## 方法 3: 使用 GitHub CLI（如果已安装）

```bash
# 安装 GitHub CLI (Windows)
winget install --id GitHub.cli

# 登录
gh auth login

# 创建仓库
gh repo create haha --public --description "精美首饰展示应用" --source=. --remote=origin --push
```

## 推荐配置

**仓库名称建议：**
- `jewelry-app`（推荐）
- `jewelry-shop`
- `jewelry-store`
- `haha`（如果已创建）

**Description 建议：**
```
精美首饰展示应用 - Vue3 + Cloudflare Workers + D1
```

## 安全提示

- 不要将 GitHub Token 提交到代码仓库
- 使用环境变量存储敏感信息
- Token 过期后需要重新生成

