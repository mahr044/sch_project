import { execSync } from 'child_process';

try {
  console.log('[v0] Adding all changes...');
  execSync('git add -A', { stdio: 'inherit', cwd: '/vercel/share/v0-project' });
  
  console.log('[v0] Committing changes...');
  execSync('git commit -m "Add Supabase integration: slider manager, news ticker, database tables and RLS policies"', { 
    stdio: 'inherit', 
    cwd: '/vercel/share/v0-project' 
  });
  
  console.log('[v0] Pushing to GitHub...');
  execSync('git push origin main', { stdio: 'inherit', cwd: '/vercel/share/v0-project' });
  
  console.log('[v0] ✓ All changes committed and pushed successfully!');
} catch (error) {
  console.error('[v0] Error during git operations:', error.message);
  process.exit(1);
}
