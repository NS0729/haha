# 自动部署到 GitHub 的完整脚本
param(
    [Parameter(Mandatory=$false)]
    [string]$RepoName = "haha",
    
    [Parameter(Mandatory=$false)]
    [string]$Description = "Jewelry App - Vue3 + Cloudflare Workers + D1",
    
    [Parameter(Mandatory=$false)]
    [switch]$Private = $false,
    
    [Parameter(Mandatory=$false)]
    [string]$GitHubToken,
    
    [Parameter(Mandatory=$false)]
    [switch]$SkipRepoCreation = $false
)

Write-Host "=== 自动部署到 GitHub ===" -ForegroundColor Cyan

# 检查是否在 git 仓库中
if (-not (Test-Path .git)) {
    Write-Host "❌ 当前目录不是 git 仓库！" -ForegroundColor Red
    Write-Host "正在初始化 git 仓库..." -ForegroundColor Yellow
    git init
    git branch -M main
}

# 检查是否有未提交的更改
$status = git status --porcelain
if ($status) {
    Write-Host "`n检测到未提交的更改，正在提交..." -ForegroundColor Yellow
    git add .
    $commitMessage = Read-Host "请输入提交信息 (直接回车使用默认: 'Initial commit')"
    if ([string]::IsNullOrWhiteSpace($commitMessage)) {
        $commitMessage = "Initial commit"
    }
    git commit -m $commitMessage
    Write-Host "✅ 代码已提交" -ForegroundColor Green
}

# 创建 GitHub 仓库（如果需要）
if (-not $SkipRepoCreation) {
    if (-not $GitHubToken) {
        $GitHubToken = $env:GITHUB_TOKEN
        if (-not $GitHubToken) {
            Write-Host "`n需要 GitHub Token 来创建仓库" -ForegroundColor Yellow
            Write-Host "访问: https://github.com/settings/tokens" -ForegroundColor Yellow
            $GitHubToken = Read-Host "请输入您的 GitHub Token (ghp_...)"
        }
    }
    
    if ($GitHubToken) {
        Write-Host "`n正在创建 GitHub 仓库: $RepoName..." -ForegroundColor Green
        
        $body = @{
            name = $RepoName
            description = $Description
            private = $Private.IsPresent
            auto_init = $false
        } | ConvertTo-Json
        
        $headers = @{
            "Authorization" = "token $GitHubToken"
            "Accept" = "application/vnd.github.v3+json"
            "User-Agent" = "PowerShell"
        }
        
        try {
            $response = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method POST -Headers $headers -Body $body -ContentType "application/json"
            
            Write-Host "✅ 仓库创建成功: $($response.html_url)" -ForegroundColor Green
            
            # 添加远程仓库
            $existingRemote = git remote get-url origin 2>$null
            if ($existingRemote) {
                Write-Host "更新远程仓库地址..." -ForegroundColor Yellow
                git remote set-url origin $response.clone_url
            } else {
                git remote add origin $response.clone_url
            }
            Write-Host "✅ 远程仓库已配置" -ForegroundColor Green
            
        } catch {
            Write-Host "❌ 创建仓库失败: $($_.Exception.Message)" -ForegroundColor Red
            if ($_.Exception.Response) {
                try {
                    $errorBody = $_.Exception.Response | ConvertFrom-Json
                    Write-Host "错误详情: $($errorBody.message)" -ForegroundColor Red
                } catch {}
            }
            
            # 如果创建失败，检查是否已存在远程仓库
            $existingRemote = git remote get-url origin 2>$null
            if (-not $existingRemote) {
                Write-Host "`n请手动创建仓库，然后运行:" -ForegroundColor Yellow
                Write-Host "  git remote add origin https://github.com/NS0729/$RepoName.git" -ForegroundColor White
                Write-Host "  git push -u origin main" -ForegroundColor White
                exit 1
            }
        }
    }
}

# 检查远程仓库
$remoteUrl = git remote get-url origin 2>$null
if (-not $remoteUrl) {
    Write-Host "`n❌ 未找到远程仓库！" -ForegroundColor Red
    Write-Host "请先添加远程仓库:" -ForegroundColor Yellow
    Write-Host "  git remote add origin https://github.com/NS0729/$RepoName.git" -ForegroundColor White
    exit 1
}

Write-Host "`n远程仓库: $remoteUrl" -ForegroundColor Cyan

# 推送代码
Write-Host "`n正在推送代码到 GitHub..." -ForegroundColor Green
try {
    git push -u origin main
    Write-Host "✅ 代码推送成功！" -ForegroundColor Green
} catch {
    Write-Host "❌ 推送失败，尝试强制推送..." -ForegroundColor Yellow
    $force = Read-Host "是否强制推送? (y/n)"
    if ($force -eq 'y' -or $force -eq 'Y') {
        git push -u origin main --force
        Write-Host "✅ 代码已强制推送" -ForegroundColor Green
    }
}

# 显示结果
Write-Host "`n=== 部署完成 ===" -ForegroundColor Cyan
Write-Host "仓库地址: $remoteUrl" -ForegroundColor White
Write-Host "`n下一步:" -ForegroundColor Yellow
Write-Host "1. 在 GitHub 仓库设置中添加 Secrets (用于自动部署):" -ForegroundColor White
Write-Host "   - CLOUDFLARE_API_TOKEN" -ForegroundColor Gray
Write-Host "   - CLOUDFLARE_ACCOUNT_ID" -ForegroundColor Gray
Write-Host "2. 访问: https://github.com/NS0729/$RepoName/settings/secrets/actions" -ForegroundColor White
Write-Host "3. 每次推送到 main 分支时，GitHub Actions 会自动部署" -ForegroundColor White

