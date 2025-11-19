import asyncio
from app.services.sync import run_sync_loop

if __name__ == "__main__":
    print("Starting MailMCP Worker...")
    asyncio.run(run_sync_loop())
