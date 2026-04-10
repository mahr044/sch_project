#!/bin/bash
cd /vercel/share/v0-project
git add -A
git commit -m "Fix: Remove duplicate api/local-chat.js file and fix vite.config.ts ES modules support"
git push origin main
