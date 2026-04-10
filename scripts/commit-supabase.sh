#!/bin/bash

cd /vercel/share/v0-project

# Add all changes
git add -A

# Commit with a descriptive message
git commit -m "Add Supabase integration for slider and news management

- Create database tables for slider_images, news_ticker, and admins
- Add Supabase client and server setup files
- Create SliderManager and NewsManager components for admin dashboard
- Add useSliderNews hook for fetching slider and news data
- Create HeroNew component with dynamic slider and news ticker
- Add scroll animation for news ticker
- Integrate new components into AdminDashboard with new tabs"

# Push to main
git push origin main
