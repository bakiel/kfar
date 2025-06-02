# Start New Claude Session with MCP Servers

## Command to Start Claude with MCP:
```bash
claude --config "/Users/mac/Library/Application Support/Claude/claude_desktop_config.json"
```

Or if using the Claude desktop app, just restart it and the MCP servers should load automatically.

## Initial Prompt for New Session:
Copy and paste this as your first message:

---

I'm continuing work on the KFAR Marketplace project. We were setting up Supabase database.

Project location: `/Users/mac/Downloads/kfar-final/kfar-marketplace-app`

Current status:
- Next.js app is running on http://localhost:3001
- Supabase credentials are in `.env.local`
- Need to create database tables using SQL files in `/supabase/` directory
- Got error "relation vendors does not exist" - need to run schema.sql first

Available MCP servers:
- supabase-official
- query-mcp (with service key)
- postgres-mcp
- github
- browser
- playwright

Please help me:
1. Check which MCP tools are available (look for mcp__ prefixed tools)
2. Use Supabase MCP to create the database tables
3. Run the SQL from `/supabase/all-in-one.sql`
4. Test the connection works

The Supabase project URL is: https://iljykqkjsadimzkyuxxl.supabase.co

---

## Quick Context Files to Share:
- `/Users/mac/Downloads/kfar-final/kfar-marketplace-app/.env.local`
- `/Users/mac/Downloads/kfar-final/kfar-marketplace-app/supabase/all-in-one.sql`
- `/Users/mac/Downloads/kfar-final/kfar-marketplace-app/SUPABASE_SETUP.md`

## MCP Servers Info:
Your claude_desktop_config.json has these Supabase MCPs configured:
- **supabase-official**: Uses anon key
- **query-mcp**: Uses service role key (full access)
- **postgres-mcp**: Direct PostgreSQL connection

The new session should have access to MCP tools like:
- `mcp__supabase__*` (various Supabase operations)
- `mcp__postgres__*` (direct SQL execution)
- `mcp__github__*` (GitHub operations)
- `mcp__browser__*` (browser automation)

Good luck! 🚀