# Cloudflare Secrets 配置助手
Write-Host "=== Cloudflare Secrets 配置助手 ===" -ForegroundColor Cyan

Write-Host "`n步骤 1: 获取 Cloudflare API Token" -ForegroundColor Yellow
Write-Host "1. 访问: https://dash.cloudflare.com/profile/api-tokens" -ForegroundColor White
Write-Host "2. 点击 'Create Token'" -ForegroundColor White
Write-Host "3. 选择 'Edit Cloudflare Workers' 模板" -ForegroundColor White
Write-Host "4. 复制生成的 Token" -ForegroundColor White

$apiToken = Read-Host "`n请输入您的 Cloudflare API Token"

Write-Host "`n步骤 2: 获取 Cloudflare Account ID" -ForegroundColor Yellow
Write-Host "1. 访问: https://dash.cloudflare.com" -ForegroundColor White
Write-Host "2. 在右侧边栏找到 'Account ID'" -ForegroundColor White
Write-Host "3. 复制 Account ID" -ForegroundColor White

$accountId = Read-Host "`n请输入您的 Cloudflare Account ID"

Write-Host "`n步骤 3: 在 GitHub 添加 Secrets" -ForegroundColor Yellow
Write-Host "访问: https://github.com/NS0729/haha/settings/secrets/actions" -ForegroundColor White
Write-Host "`n需要添加以下 Secrets:" -ForegroundColor Cyan
Write-Host "1. Name: CLOUDFLARE_API_TOKEN" -ForegroundColor White
Write-Host "   Value: $apiToken" -ForegroundColor Gray
Write-Host "`n2. Name: CLOUDFLARE_ACCOUNT_ID" -ForegroundColor White
Write-Host "   Value: $accountId" -ForegroundColor Gray

Write-Host "`n=== 配置信息 ===" -ForegroundColor Cyan
Write-Host "API Token: $($apiToken.Substring(0, [Math]::Min(10, $apiToken.Length)))..." -ForegroundColor Gray
Write-Host "Account ID: $accountId" -ForegroundColor Gray

Write-Host "`n✅ 请按照上述步骤在 GitHub 添加 Secrets" -ForegroundColor Green
Write-Host "`n完成后，可以访问以下链接测试部署:" -ForegroundColor Yellow
Write-Host "https://github.com/NS0729/haha/actions" -ForegroundColor White

