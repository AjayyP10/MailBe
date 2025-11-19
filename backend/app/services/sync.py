import asyncio
import logging
from app.core.config import settings
from app.services.gmail import GmailService
from supabase import create_client, Client
from datetime import datetime

# Setup Logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

async def sync_account(account):
    logger.info(f"Syncing account {account['id']} ({account['provider']})")
    
    if account['provider'] == 'gmail':
        # In a real app, you would fetch client_id/secret from secure storage or env
        # For MVP, we assume they are in env or passed in account (not recommended for prod)
        # We'll use placeholders from settings for now
        service = GmailService(
            access_token=account['access_token'],
            refresh_token=account['refresh_token'],
            client_id=settings.GOOGLE_CLIENT_ID,
            client_secret=settings.GOOGLE_CLIENT_SECRET
        )
        
        messages = service.list_messages(max_results=10)
        for msg_meta in messages:
            try:
                details = service.get_message_details(msg_meta['id'])
                
                # Upsert into Supabase
                data = {
                    "account_id": account['id'],
                    "user_id": account['user_id'],
                    "provider_email_id": details['id'],
                    "thread_id": details['threadId'],
                    "subject": details['subject'],
                    "snippet": details['snippet'],
                    "from_address": details['from'],
                    "to_addresses": details['to'],
                    "body_text": details['body_text'],
                    "body_html": details['body_html'],
                    "received_at": datetime.fromtimestamp(int(details['internalDate'])/1000).isoformat()
                }
                
                # Check if exists to avoid duplicates (or use upsert if unique constraint is set)
                existing = supabase.table('emails').select('id').eq('account_id', account['id']).eq('provider_email_id', details['id']).execute()
                
                if not existing.data:
                    supabase.table('emails').insert(data).execute()
                    logger.info(f"Imported email: {details['subject']}")
                else:
                    logger.info(f"Skipping existing email: {details['id']}")
                    
            except Exception as e:
                logger.error(f"Failed to process message {msg_meta['id']}: {e}")

async def run_sync_loop():
    while True:
        logger.info("Starting sync cycle...")
        try:
            # Fetch all accounts that need syncing
            # In a real app, you'd use a queue or check last_sync_at
            accounts = supabase.table('accounts').select('*').execute()
            
            for account in accounts.data:
                await sync_account(account)
                
        except Exception as e:
            logger.error(f"Error in sync loop: {e}")
        
        logger.info("Sync cycle finished. Sleeping for 60s...")
        await asyncio.sleep(60)
