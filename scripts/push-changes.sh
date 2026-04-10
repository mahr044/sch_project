#!/bin/bash
cd /vercel/share/v0-project
git add vite.config.ts
git commit -m "Fix vite.config.ts: Add __dirname support for ES modules"
git push origin main
