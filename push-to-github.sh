#!/bin/bash

# Replace YOUR_USERNAME with your GitHub username
echo "Enter your GitHub username:"
read username

git remote add origin https://github.com/$username/hurricane-milton-report.git
git branch -M main
git push -u origin main

echo "✅ Code pushed to GitHub!"
echo "📄 Enable GitHub Pages in Settings > Pages > Source: Deploy from branch (main)"