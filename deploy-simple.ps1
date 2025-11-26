# Simple GitHub Deployment Script
param(
    [string]$RepoName = "haha",
    [string]$GitHubToken
)

Write-Host "=== Deploy to GitHub ===" -ForegroundColor Cyan

# Check git status
$status = git status --porcelain
if ($status) {
    Write-Host "Committing changes..." -ForegroundColor Yellow
    git add .
    git commit -m "Deploy to GitHub"
}

# Check remote
$remote = git remote get-url origin 2>$null
if (-not $remote) {
    Write-Host "No remote repository found." -ForegroundColor Yellow
    Write-Host "Please add remote first:" -ForegroundColor Yellow
    Write-Host "  git remote add origin https://github.com/NS0729/$RepoName.git" -ForegroundColor White
    exit 1
}

Write-Host "Remote: $remote" -ForegroundColor Cyan

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Green
try {
    git push -u origin main
    Write-Host "Success! Code pushed to GitHub" -ForegroundColor Green
    Write-Host "Repository: $remote" -ForegroundColor Cyan
} catch {
    Write-Host "Push failed. Try manually:" -ForegroundColor Red
    Write-Host "  git push -u origin main" -ForegroundColor White
}

