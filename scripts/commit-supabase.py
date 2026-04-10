import subprocess
import os

os.chdir("/vercel/share/v0-project")

try:
    # Stage all changes
    result = subprocess.run(["git", "add", "-A"], capture_output=True, text=True)
    print("[v0] Git add:", result.stdout or result.stderr)
    
    # Commit changes
    result = subprocess.run(
        ["git", "commit", "-m", "feat: Add Supabase integration with slider and news management\n\n- Created database tables for slider_images and news_ticker\n- Added SliderManager and NewsManager components\n- Updated AdminDashboard with new tabs\n- Integrated Supabase client and storage\n- Added dynamic Hero component with database fetching"],
        capture_output=True,
        text=True
    )
    print("[v0] Git commit:", result.stdout or result.stderr)
    
    # Push to main
    result = subprocess.run(["git", "push", "origin", "main"], capture_output=True, text=True)
    print("[v0] Git push:", result.stdout or result.stderr)
    
    print("[v0] Successfully pushed to GitHub!")
except Exception as e:
    print(f"[v0] Error: {str(e)}")
