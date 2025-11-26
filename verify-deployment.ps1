# 验证部署配置脚本
Write-Host "=== 验证部署配置 ===" -ForegroundColor Cyan

# 检查本地 git 配置
Write-Host "`n1. 检查 Git 配置..." -ForegroundColor Yellow
$remote = git remote get-url origin 2>$null
if ($remote) {
    Write-Host "   Remote: $remote" -ForegroundColor Green
} else {
    Write-Host "   Remote: 未配置" -ForegroundColor Red
}

# 检查 GitHub Actions 工作流文件
Write-Host "`n2. 检查 GitHub Actions 工作流..." -ForegroundColor Yellow
if (Test-Path ".github/workflows/deploy.yml") {
    Write-Host "   工作流文件存在" -ForegroundColor Green
    $workflow = Get-Content ".github/workflows/deploy.yml" -Raw
    if ($workflow -match "CLOUDFLARE_API_TOKEN") {
        Write-Host "   Secrets 配置正确" -ForegroundColor Green
    } else {
        Write-Host "   Secrets 配置可能有问题" -ForegroundColor Yellow
    }
} else {
    Write-Host "   工作流文件不存在" -ForegroundColor Red
}

# 检查 wrangler.toml
Write-Host "`n3. 检查 Wrangler 配置..." -ForegroundColor Yellow
if (Test-Path "wrangler.toml") {
    Write-Host "   wrangler.toml 存在" -ForegroundColor Green
    $wrangler = Get-Content "wrangler.toml" -Raw
    if ($wrangler -match "d1_databases") {
        Write-Host "   D1 数据库配置存在" -ForegroundColor Green
    }
} else {
    Write-Host "   wrangler.toml 不存在" -ForegroundColor Yellow
}

# 检查 worker 文件
Write-Host "`n4. 检查 Worker 代码..." -ForegroundColor Yellow
if (Test-Path "worker/index.js") {
    Write-Host "   Worker 文件存在" -ForegroundColor Green
} else {
    Write-Host "   Worker 文件不存在" -ForegroundColor Red
}

# 提供下一步操作
Write-Host "`n=== 下一步操作 ===" -ForegroundColor Cyan
Write-Host "1. 确保在 GitHub 添加了 Secrets:" -ForegroundColor Yellow
Write-Host "   - CLOUDFLARE_API_TOKEN" -ForegroundColor White
Write-Host "   - CLOUDFLARE_ACCOUNT_ID" -ForegroundColor White
Write-Host "`n2. 访问 GitHub Actions 测试部署:" -ForegroundColor Yellow
Write-Host "   https://github.com/NS0729/haha/actions" -ForegroundColor White
Write-Host "`n3. 或者推送代码触发自动部署:" -ForegroundColor Yellow
Write-Host "   git push" -ForegroundColor White

