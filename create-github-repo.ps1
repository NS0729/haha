# GitHub 仓库创建脚本
param(
    [Parameter(Mandatory=$true)]
    [string]$RepoName,
    
    [Parameter(Mandatory=$false)]
    [string]$Description = "精美首饰展示应用 - Vue3 + Cloudflare Workers + D1",
    
    [Parameter(Mandatory=$false)]
    [switch]$Private = $false,
    
    [Parameter(Mandatory=$false)]
    [string]$Token
)

Write-Host "=== GitHub 仓库创建工具 ===" -ForegroundColor Cyan

# 如果没有提供 token，尝试从环境变量或 git config 获取
if (-not $Token) {
    $Token = $env:GITHUB_TOKEN
    if (-not $Token) {
        Write-Host "`n需要 GitHub Personal Access Token" -ForegroundColor Yellow
        Write-Host "请访问: https://github.com/settings/tokens" -ForegroundColor Yellow
        Write-Host "创建 token 时需要 'repo' 权限" -ForegroundColor Yellow
        $Token = Read-Host "`n请输入您的 GitHub Token (或按 Enter 跳过，使用手动方式)"
    }
}

if ($Token) {
    Write-Host "`n正在创建仓库: $RepoName..." -ForegroundColor Green
    
    $body = @{
        name = $RepoName
        description = $Description
        private = $Private.IsPresent
        auto_init = $false
    } | ConvertTo-Json
    
    $headers = @{
        "Authorization" = "token $Token"
        "Accept" = "application/vnd.github.v3+json"
        "User-Agent" = "PowerShell"
    }
    
    try {
        $response = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method POST -Headers $headers -Body $body -ContentType "application/json"
        
        Write-Host "`n✅ 仓库创建成功！" -ForegroundColor Green
        Write-Host "`n仓库信息:" -ForegroundColor Cyan
        Write-Host "  名称: $($response.name)" -ForegroundColor White
        Write-Host "  URL: $($response.html_url)" -ForegroundColor White
        Write-Host "  Clone URL: $($response.clone_url)" -ForegroundColor White
        
        # 自动添加远程仓库
        $existingRemote = git remote get-url origin 2>$null
        if ($existingRemote) {
            Write-Host "`n检测到已存在的远程仓库: $existingRemote" -ForegroundColor Yellow
            $replace = Read-Host "是否替换为新的远程仓库? (y/n)"
            if ($replace -eq 'y' -or $replace -eq 'Y') {
                git remote set-url origin $response.clone_url
                Write-Host "远程仓库已更新!" -ForegroundColor Green
            }
        } else {
            git remote add origin $response.clone_url
            Write-Host "`n✅ 远程仓库已添加!" -ForegroundColor Green
        }
        
        Write-Host "`n下一步，推送代码:" -ForegroundColor Yellow
        Write-Host "  git push -u origin main" -ForegroundColor White
        
        return $response
    } catch {
        Write-Host "`n❌ 创建失败: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            $errorBody = $_.Exception.Response | ConvertFrom-Json
            Write-Host "错误详情: $($errorBody.message)" -ForegroundColor Red
        }
        return $null
    }
} else {
    Write-Host "`n=== 手动创建步骤 ===" -ForegroundColor Cyan
    Write-Host "1. 访问: https://github.com/new" -ForegroundColor Yellow
    Write-Host "2. Repository name: $RepoName" -ForegroundColor Yellow
    Write-Host "3. Description: $Description" -ForegroundColor Yellow
    Write-Host "4. 选择 $($Private ? 'Private' : 'Public')" -ForegroundColor Yellow
    Write-Host "5. 不要勾选任何初始化选项" -ForegroundColor Yellow
    Write-Host "6. 点击 'Create repository'" -ForegroundColor Yellow
    Write-Host "`n创建完成后，运行:" -ForegroundColor Cyan
    Write-Host "  git remote add origin https://github.com/NS0729/$RepoName.git" -ForegroundColor Green
    Write-Host "  git push -u origin main" -ForegroundColor Green
}

