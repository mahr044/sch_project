import subprocess
import sys

try:
    # Add all changes
    subprocess.run(['git', 'add', '-A'], cwd='/vercel/share/v0-project', check=True)
    
    # Commit
    subprocess.run(['git', 'commit', '-m', 'Update: Hero component now fetches slider images and news from Supabase database'], 
                   cwd='/vercel/share/v0-project', check=True)
    
    # Push
    subprocess.run(['git', 'push', 'origin', 'main'], cwd='/vercel/share/v0-project', check=True)
    
    print("Changes pushed successfully!")
    sys.exit(0)
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
