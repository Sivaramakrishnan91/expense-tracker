#!/bin/bash
# Bash Script to Push Personal Finance Tracker to GitHub
# This script will help you push your code to GitHub after you create the repository

echo "========================================"
echo "  Personal Finance Tracker - GitHub Push Script"
echo "========================================"
echo ""

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "ERROR: Please run this script from the expense-tracker directory!"
    echo "Current directory: $(pwd)"
    echo ""
    echo "To fix this, run:"
    echo "  cd /path/to/expense-tracker"
    echo "  ./push-to-github.sh"
    exit 1
fi

echo "✓ Correct directory confirmed"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "ERROR: Git is not installed!"
    echo "Please install Git first"
    exit 1
fi

GIT_VERSION=$(git --version)
echo "✓ Git is installed: $GIT_VERSION"
echo ""

# Check if repository is initialized
if [ ! -d ".git" ]; then
    echo "ERROR: Git repository not initialized!"
    echo "This shouldn't happen. Please contact support."
    exit 1
fi

echo "✓ Git repository initialized"
echo ""

# Get GitHub username
echo "========================================"
echo "  Step 1: GitHub Repository Setup"
echo "========================================"
echo ""
echo "Before running this script, you need to:"
echo "1. Go to https://github.com/new"
echo "2. Create a new repository named 'expense-tracker'"
echo "3. Make it PUBLIC (so others can download)"
echo "4. DO NOT initialize with README, .gitignore, or license"
echo ""

read -p "Have you created the repository on GitHub? (yes/no): " continue
if [ "$continue" != "yes" ] && [ "$continue" != "y" ]; then
    echo ""
    echo "Please create the repository first, then run this script again."
    exit 0
fi

echo ""
read -p "Enter your GitHub username: " username

if [ -z "$username" ]; then
    echo "ERROR: Username cannot be empty!"
    exit 1
fi

echo ""
echo "✓ Username: $username"
echo ""

# Construct repository URL
REPO_URL="https://github.com/$username/expense-tracker.git"

echo "========================================"
echo "  Step 2: Configure Remote Repository"
echo "========================================"
echo ""
echo "Repository URL: $REPO_URL"
echo ""

# Check if remote already exists
if git remote get-url origin &> /dev/null; then
    EXISTING_REMOTE=$(git remote get-url origin)
    echo "Remote 'origin' already exists: $EXISTING_REMOTE"
    read -p "Do you want to replace it? (yes/no): " replace
    if [ "$replace" = "yes" ] || [ "$replace" = "y" ]; then
        echo "Removing old remote..."
        git remote remove origin
        echo "Adding new remote..."
        git remote add origin "$REPO_URL"
        echo "✓ Remote updated"
    else
        echo "Keeping existing remote"
    fi
else
    echo "Adding remote repository..."
    git remote add origin "$REPO_URL"
    echo "✓ Remote added"
fi

echo ""

# Rename branch to main if needed
echo "========================================"
echo "  Step 3: Prepare Branch"
echo "========================================"
echo ""

CURRENT_BRANCH=$(git branch --show-current)
echo "Current branch: $CURRENT_BRANCH"

if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "Renaming branch to 'main'..."
    git branch -M main
    echo "✓ Branch renamed to 'main'"
else
    echo "✓ Already on 'main' branch"
fi

echo ""

# Push to GitHub
echo "========================================"
echo "  Step 4: Push to GitHub"
echo "========================================"
echo ""
echo "Pushing code to GitHub..."
echo ""
echo "NOTE: You may be prompted for authentication:"
echo "  - Username: Your GitHub username"
echo "  - Password: Use a Personal Access Token (NOT your password)"
echo ""
echo "To create a token:"
echo "  1. Go to: https://github.com/settings/tokens"
echo "  2. Click 'Generate new token (classic)'"
echo "  3. Select 'repo' scope"
echo "  4. Copy the token and use it as password"
echo ""

read -p "Ready to push? (yes/no): " push_confirm
if [ "$push_confirm" != "yes" ] && [ "$push_confirm" != "y" ]; then
    echo ""
    echo "Push cancelled. You can run this script again when ready."
    exit 0
fi

echo ""
echo "Pushing to GitHub..."

if git push -u origin main; then
    echo ""
    echo "========================================"
    echo "  SUCCESS! Code Pushed to GitHub!"
    echo "========================================"
    echo ""
    echo "Your repository is now live at:"
    echo "  https://github.com/$username/expense-tracker"
    echo ""
    echo "Next steps:"
    echo "  1. Visit your repository URL above"
    echo "  2. Verify all files are there"
    echo "  3. Share the link with others!"
    echo ""
    echo "Anyone can now:"
    echo "  - Download your project"
    echo "  - Clone it with: git clone https://github.com/$username/expense-tracker.git"
    echo "  - Open index.html and start using it!"
    echo ""
else
    echo ""
    echo "========================================"
    echo "  ERROR: Push Failed"
    echo "========================================"
    echo ""
    echo "Common issues:"
    echo "  1. Authentication failed - Use Personal Access Token, not password"
    echo "  2. Repository doesn't exist - Create it on GitHub first"
    echo "  3. Wrong username - Check your GitHub username"
    echo ""
    exit 1
fi

# Made with Bob
