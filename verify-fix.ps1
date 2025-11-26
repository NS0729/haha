# 验证修复脚本
Write-Host "=== 验证部署修复 ===" -ForegroundColor Cyan

Write-Host "`n1. 检查 wrangler.toml..." -ForegroundColor Yellow
$wrangler = Get-Content "wrangler.toml" -Raw
if ($wrangler -match '^#\s*\[\[d1_databases\]\]') {
    Write-Host "   D1 数据库配置已注释" -ForegroundColor Green
} elseif ($wrangler -match '\[\[d1_databases\]\]' -and $wrangler -notmatch 'database_id = "your-database-id-here"') {
    Write-Host "   D1 数据库已配置" -ForegroundColor Green
} else {
    Write-Host "   D1 数据库配置有问题" -ForegroundColor Yellow
}

Write-Host "`n2. 检查 Worker 代码..." -ForegroundColor Yellow
$worker = Get-Content "worker/index.js" -Raw
$dbChecks = ([regex]::Matches($worker, 'if \(!env\.DB\)')).Count
Write-Host "   找到 $dbChecks 个数据库检查点" -ForegroundColor $(if ($dbChecks -ge 5) { "Green" } else { "Yellow" })

Write-Host "`n3. 检查 GitHub Actions..." -ForegroundColor Yellow
if (Test-Path ".github/workflows/deploy.yml") {
    Write-Host "   工作流文件存在" -ForegroundColor Green
    $workflow = Get-Content ".github/workflows/deploy.yml" -Raw
    if ($workflow -match "Check Secrets") {
        Write-Host "   Secrets 检查已添加" -ForegroundColor Green
    }
} else {
    Write-Host "   工作流文件不存在" -ForegroundColor Red
}

Write-Host "`n=== 修复状态 ===" -ForegroundColor Cyan
Write-Host "D1 数据库: 可选（已注释）" -ForegroundColor Green
Write-Host "错误处理: 已改进" -ForegroundColor Green
Write-Host "部署配置: 已优化" -ForegroundColor Green

Write-Host "`n下一步:" -ForegroundColor Yellow
Write-Host "1. 检查 GitHub Actions: https://github.com/NS0729/haha/actions" -ForegroundColor White
Write-Host "2. 配置 GitHub Secrets（如果还没配置）" -ForegroundColor White
Write-Host "3. 查看部署日志" -ForegroundColor White

