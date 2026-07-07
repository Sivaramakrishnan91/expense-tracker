# PowerShell Script to Push Personal Finance Tracker to GitHub
# This script will help you push your code to GitHub after you create the repository

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Personal Finance Tracker - GitHub Push Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "index.html")) {
    Write-Host "ERROR: Please run this script from the expense-tracker directory!" -ForegroundColor Red
    Write-Host "Current directory: $(Get-Location)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To fix this, run:" -ForegroundColor Yellow
    Write-Host "  cd C:\Users\SivaramakrishnanGopa\Desktop\expense-tracker" -ForegroundColor White
    Write-Host "  .\push-to-github.ps1" -ForegroundColor White
    exit 1
}

Write-Host "✓ Correct directory confirmed" -ForegroundColor Green
Write-Host ""

# Check if git is installed
try {
    $gitVersion = git --version
    Write-Host "✓ Git is installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Git is not installed!" -ForegroundColor Red
    Write-Host "Please install Git from: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Check if repository is initialized
if (-not (Test-Path ".git")) {
    Write-Host "ERROR: Git repository not initialized!" -ForegroundColor Red
    Write-Host "This shouldn't happen. Please contact support." -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ Git repository initialized" -ForegroundColor Green
Write-Host ""

# Get GitHub username
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Step 1: GitHub Repository Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Before running this script, you need to:" -ForegroundColor Yellow
Write-Host "1. Go to https://github.com/new" -ForegroundColor White
Write-Host "2. Create a new repository named 'expense-tracker'" -ForegroundColor White
Write-Host "3. Make it PUBLIC (so others can download)" -ForegroundColor White
Write-Host "4. DO NOT initialize with README, .gitignore, or license" -ForegroundColor White
Write-Host ""

$continue = Read-Host "Have you created the repository on GitHub? (yes/no)"
if ($continue -ne "yes" -and $continue -ne "y") {
    Write-Host ""
    Write-Host "Please create the repository first, then run this script again." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
$username = Read-Host "Enter your GitHub username"

if ([string]::IsNullOrWhiteSpace($username)) {
    Write-Host "ERROR: Username cannot be empty!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✓ Username: $username" -ForegroundColor Green
Write-Host ""

# Construct repository URL
$repoUrl = "https://github.com/$username/expense-tracker.git"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Step 2: Configure Remote Repository" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Repository URL: $repoUrl" -ForegroundColor White
Write-Host ""

# Check if remote already exists
$remoteExists = git remote get-url origin 2>$null
if ($remoteExists) {
    Write-Host "Remote 'origin' already exists: $remoteExists" -ForegroundColor Yellow
    $replace = Read-Host "Do you want to replace it? (yes/no)"
    if ($replace -eq "yes" -or $replace -eq "y") {
        Write-Host "Removing old remote..." -ForegroundColor Yellow
        git remote remove origin
        Write-Host "Adding new remote..." -ForegroundColor Yellow
        git remote add origin $repoUrl
        Write-Host "✓ Remote updated" -ForegroundColor Green
    } else {
        Write-Host "Keeping existing remote" -ForegroundColor Yellow
    }
} else {
    Write-Host "Adding remote repository..." -ForegroundColor Yellow
    git remote add origin $repoUrl
    Write-Host "✓ Remote added" -ForegroundColor Green
}

Write-Host ""

# Rename branch to main if needed
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Step 3: Prepare Branch" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$currentBranch = git branch --show-current
Write-Host "Current branch: $currentBranch" -ForegroundColor White

if ($currentBranch -ne "main") {
    Write-Host "Renaming branch to 'main'..." -ForegroundColor Yellow
    git branch -M main
    Write-Host "✓ Branch renamed to 'main'" -ForegroundColor Green
} else {
    Write-Host "✓ Already on 'main' branch" -ForegroundColor Green
}

Write-Host ""

# Push to GitHub
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Step 4: Push to GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Pushing code to GitHub..." -ForegroundColor Yellow
Write-Host ""
Write-Host "NOTE: You may be prompted for authentication:" -ForegroundColor Yellow
Write-Host "  - Username: Your GitHub username" -ForegroundColor White
Write-Host "  - Password: Use a Personal Access Token (NOT your password)" -ForegroundColor White
Write-Host ""
Write-Host "To create a token:" -ForegroundColor Yellow
Write-Host "  1. Go to: https://github.com/settings/tokens" -ForegroundColor White
Write-Host "  2. Click 'Generate new token (classic)'" -ForegroundColor White
Write-Host "  3. Select 'repo' scope" -ForegroundColor White
Write-Host "  4. Copy the token and use it as password" -ForegroundColor White
Write-Host ""

$pushConfirm = Read-Host "Ready to push? (yes/no)"
if ($pushConfirm -ne "yes" -and $pushConfirm -ne "y") {
    Write-Host ""
    Write-Host "Push cancelled. You can run this script again when ready." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Cyan

try {
    git push -u origin main
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  SUCCESS! Code Pushed to GitHub!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your repository is now live at:" -ForegroundColor Green
    Write-Host "  https://github.com/$username/expense-tracker" -ForegroundColor White
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Visit your repository URL above" -ForegroundColor White
    Write-Host "  2. Verify all files are there" -ForegroundColor White
    Write-Host "  3. Share the link with others!" -ForegroundColor White
    Write-Host ""
    Write-Host "Anyone can now:" -ForegroundColor Cyan
    Write-Host "  - Download your project" -ForegroundColor White
    Write-Host "  - Clone it with: git clone https://github.com/$username/expense-tracker.git" -ForegroundColor White
    Write-Host "  - Open index.html and start using it!" -ForegroundColor White
    Write-Host ""
} catch {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "  ERROR: Push Failed" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "  1. Authentication failed - Use Personal Access Token, not password" -ForegroundColor White
    Write-Host "  2. Repository doesn't exist - Create it on GitHub first" -ForegroundColor White
    Write-Host "  3. Wrong username - Check your GitHub username" -ForegroundColor White
    Write-Host ""
    Write-Host "Error details:" -ForegroundColor Yellow
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    exit 1
}

Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Made with Bob
