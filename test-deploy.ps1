# 测试本地部署（需要先配置 wrangler）
Write-Host "=== 测试本地部署 ===" -ForegroundColor Cyan

# 检查 wrangler 是否安装
Write-Host "`n检查 Wrangler..." -ForegroundColor Yellow
try {
    $wranglerVersion = npx wrangler --version 2>&1
    Write-Host "   Wrangler 可用" -ForegroundColor Green
} catch {
    Write-Host "   Wrangler 未安装，正在安装..." -ForegroundColor Yellow
    npm install -g wrangler
}

# 检查是否已登录
Write-Host "`n检查 Cloudflare 登录状态..." -ForegroundColor Yellow
try {
    npx wrangler whoami 2>&1 | Out-Null
    Write-Host "   已登录 Cloudflare" -ForegroundColor Green
} catch {
    Write-Host "   未登录，请运行: npx wrangler login" -ForegroundColor Yellow
    Write-Host "   或使用 API Token: npx wrangler login --api-token" -ForegroundColor Yellow
}

# 测试部署
Write-Host "`n是否要测试部署到 Cloudflare? (y/n)" -ForegroundColor Yellow
$deploy = Read-Host
if ($deploy -eq 'y' -or $deploy -eq 'Y') {
    Write-Host "`n正在部署..." -ForegroundColor Green
    npx wrangler deploy
} else {
    Write-Host "`n跳过部署测试" -ForegroundColor Gray
}

