# Git 远程仓库设置指南

## 添加远程仓库

### 方法 1: 使用 PowerShell 脚本（推荐）

```powershell
# 使用脚本添加远程仓库
powershell -ExecutionPolicy Bypass -File setup-remote.ps1 -RemoteUrl "https://github.com/username/jewelry-app.git"
```

### 方法 2: 直接使用 Git 命令

```bash
# 添加远程仓库
git remote add origin <your-repo-url>

# 查看远程仓库
git remote -v

# 推送代码到远程仓库
git push -u origin main
```

## 常见远程仓库 URL 格式

### GitHub
```bash
# HTTPS
https://github.com/username/jewelry-app.git

# SSH
git@github.com:username/jewelry-app.git
```

### GitLab
```bash
# HTTPS
https://gitlab.com/username/jewelry-app.git

# SSH
git@gitlab.com:username/jewelry-app.git
```

## 推送代码

添加远程仓库后，推送代码：

```bash
# 首次推送
git push -u origin main

# 后续推送
git push
```

## 更新远程仓库 URL

如果需要更改远程仓库 URL：

```bash
# 更新远程 URL
git remote set-url origin <new-repo-url>

# 验证更改
git remote -v
```

## 创建 GitHub 仓库步骤

1. 登录 GitHub
2. 点击右上角的 "+" 按钮
3. 选择 "New repository"
4. 输入仓库名称（如：`jewelry-app`）
5. 选择公开或私有
6. **不要**初始化 README、.gitignore 或 license（因为本地已有代码）
7. 点击 "Create repository"
8. 复制仓库 URL
9. 使用上面的命令添加远程仓库

