# 检查部署状态脚本
Write-Host "=== 部署状态检查 ===" -ForegroundColor Cyan

# 检查 Git 状态
Write-Host "`n1. 检查 Git 状态..." -ForegroundColor Yellow
$remote = git remote get-url origin 2>$null
if ($remote) {
    Write-Host "   Remote: $remote" -ForegroundColor Green
} else {
    Write-Host "   Remote: 未配置" -ForegroundColor Red
}

$branch = git branch --show-current
Write-Host "   当前分支: $branch" -ForegroundColor Green

# 检查最近的提交
Write-Host "`n2. 最近的提交..." -ForegroundColor Yellow
git log --oneline -3 | ForEach-Object {
    Write-Host "   $_" -ForegroundColor Gray
}

# 检查工作流文件
Write-Host "`n3. 检查 GitHub Actions 配置..." -ForegroundColor Yellow
if (Test-Path ".github/workflows/deploy.yml") {
    Write-Host "   工作流文件存在" -ForegroundColor Green
} else {
    Write-Host "   工作流文件不存在" -ForegroundColor Red
}

# 检查 wrangler 配置
Write-Host "`n4. 检查 Wrangler 配置..." -ForegroundColor Yellow
if (Test-Path "wrangler.toml") {
    Write-Host "   wrangler.toml 存在" -ForegroundColor Green
    $wrangler = Get-Content "wrangler.toml" -Raw
    if ($wrangler -match 'database_id = "your-database-id-here"') {
        Write-Host "   ⚠️  警告: database_id 仍是占位符，需要更新" -ForegroundColor Yellow
    } else {
        Write-Host "   database_id 已配置" -ForegroundColor Green
    }
} else {
    Write-Host "   wrangler.toml 不存在" -ForegroundColor Red
}

# 提供下一步操作
Write-Host "`n=== 下一步操作 ===" -ForegroundColor Cyan
Write-Host "1. 查看 GitHub Actions 状态:" -ForegroundColor Yellow
Write-Host "   https://github.com/NS0729/haha/actions" -ForegroundColor White
Write-Host "`n2. 如果部署失败，检查:" -ForegroundColor Yellow
Write-Host "   - GitHub Secrets 是否已配置" -ForegroundColor Gray
Write-Host "   - Cloudflare Token 权限是否正确" -ForegroundColor Gray
Write-Host "   - wrangler.toml 中的 database_id 是否已更新" -ForegroundColor Gray
Write-Host "`n3. 手动触发部署:" -ForegroundColor Yellow
Write-Host "   - 访问 GitHub Actions 页面" -ForegroundColor Gray
Write-Host "   - 点击 'Run workflow'" -ForegroundColor Gray

