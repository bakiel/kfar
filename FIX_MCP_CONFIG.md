# Fix Supabase MCP Configuration

## Current Issue
Your `supabase-official` MCP is using an anon key instead of a personal access token.

## Steps to Fix:

1. **Get a Personal Access Token:**
   - Go to: https://supabase.com/dashboard/account/tokens
   - Click "Generate new token"
   - Name it: "Claude MCP"
   - Copy the token

2. **Update your claude_desktop_config.json:**
   
   Replace this section:
   ```json
   "supabase-official": {
     "command": "npx",
     "args": [
       "-y",
       "@supabase/mcp-server-supabase@latest",
       "--access-token",
       "YOUR_ANON_KEY_HERE"
     ]
   }
   ```

   With:
   ```json
   "supabase-official": {
     "command": "npx",
     "args": [
       "-y",
       "@supabase/mcp-server-supabase@latest",
       "--access-token",
       "YOUR_PERSONAL_ACCESS_TOKEN_HERE"
     ]
   }
   ```

3. **Restart Claude Desktop**

4. **Test with these commands:**
   - "List my Supabase projects"
   - "Show me the database tables in project iljykqkjsadimzkyuxxl"

## Alternative: Use the postgres-mcp or query-mcp

Your other MCPs (`postgres-mcp` and `query-mcp`) are already configured correctly and might work if they load properly after restart.

## To Verify MCP Tools are Loaded:

After restarting Claude, you should have access to tools like:
- `mcp__supabase__list_projects`
- `mcp__supabase__execute_sql`
- `mcp__postgres__query`
- etc.

If you don't see these tools, the MCPs aren't loading properly.