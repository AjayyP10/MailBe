from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
from supabase import create_client, Client
from app.core.config import settings
from app.services.gmail import GmailService

router = APIRouter()
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

class SendEmailRequest(BaseModel):
    account_id: str
    to: str
    subject: str
    body: str
    thread_id: str = None

@router.post("/send")
def send_email(req: SendEmailRequest):
    # 1. Fetch account credentials
    response = supabase.table('accounts').select('*').eq('id', req.account_id).single().execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Account not found")
    
    account = response.data
    
    # 2. Initialize Gmail Service
    try:
        service = GmailService(
            access_token=account['access_token'],
            refresh_token=account['refresh_token'],
            client_id=settings.GOOGLE_CLIENT_ID,
            client_secret=settings.GOOGLE_CLIENT_SECRET
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to initialize Gmail service: {str(e)}")

    # 3. Send Email
    result = service.send_email(req.to, req.subject, req.body, req.thread_id)
    
    if not result:
        raise HTTPException(status_code=500, detail="Failed to send email")
        
    return {"status": "sent", "message_id": result.get("id"), "thread_id": result.get("threadId")}
