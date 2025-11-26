# 设置远程仓库脚本
param(
    [Parameter(Mandatory=$true)]
    [string]$RemoteUrl
)

Write-Host "正在添加远程仓库..." -ForegroundColor Green

# 检查是否已有远程仓库
$existingRemote = git remote get-url origin 2>$null
if ($existingRemote) {
    Write-Host "检测到已存在的远程仓库: $existingRemote" -ForegroundColor Yellow
    $response = Read-Host "是否要替换为新的远程仓库? (y/n)"
    if ($response -eq 'y' -or $response -eq 'Y') {
        git remote set-url origin $RemoteUrl
        Write-Host "远程仓库已更新!" -ForegroundColor Green
    } else {
        Write-Host "操作已取消" -ForegroundColor Yellow
        exit
    }
} else {
    git remote add origin $RemoteUrl
    Write-Host "远程仓库已添加!" -ForegroundColor Green
}

# 显示远程仓库信息
Write-Host "`n当前远程仓库配置:" -ForegroundColor Cyan
git remote -v

Write-Host "`n下一步，您可以运行以下命令推送代码:" -ForegroundColor Yellow
Write-Host "  git push -u origin main" -ForegroundColor White

