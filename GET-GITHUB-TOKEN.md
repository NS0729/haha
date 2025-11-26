# 获取 GitHub Personal Access Token 步骤

## 详细步骤

### 1. 访问 Token 设置页面
打开浏览器，访问：**https://github.com/settings/tokens**

### 2. 创建新 Token
- 点击 **"Generate new token"** 按钮
- 选择 **"Generate new token (classic)"**

### 3. 填写 Token 信息
- **Note（备注）**: 填写 `jewelry-app-repo` 或任何您喜欢的名称
- **Expiration（过期时间）**: 选择您需要的过期时间（建议 90 天或自定义）
- **Select scopes（选择权限）**: 
  - ✅ **必须勾选 `repo`**（完整仓库访问权限）
    - 这会自动勾选所有子权限：
      - repo:status
      - repo_deployment
      - public_repo
      - repo:invite
      - security_events

### 4. 生成 Token
- 滚动到页面底部
- 点击 **"Generate token"** 按钮

### 5. 复制 Token ⚠️ 重要！
- **Token 只会显示一次！**
- 立即复制并保存到安全的地方
- Token 格式类似：`ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 6. 使用 Token
将 Token 提供给脚本使用，或者设置为环境变量：

```powershell
# 方法1: 直接在命令中使用（不推荐，会显示在历史记录中）
powershell -ExecutionPolicy Bypass -File create-github-repo.ps1 -RepoName "haha" -Token "ghp_xxxxxxxxxxxx"

# 方法2: 使用环境变量（推荐，更安全）
$env:GITHUB_TOKEN = "ghp_xxxxxxxxxxxx"
powershell -ExecutionPolicy Bypass -File create-github-repo.ps1 -RepoName "haha"
```

## 安全提示

⚠️ **重要安全注意事项：**
- Token 等同于密码，请妥善保管
- 不要将 Token 提交到代码仓库
- 不要分享给他人
- 如果泄露，立即在 GitHub 设置中删除并重新生成
- Token 过期后需要重新生成

## 快速链接

- Token 管理页面: https://github.com/settings/tokens
- 创建新 Token: https://github.com/settings/tokens/new
- 文档: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token

