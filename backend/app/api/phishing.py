from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from supabase import create_client, Client
from app.core.config import settings
from app.services.phishing import score_email

router = APIRouter()
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

class ScoreRequest(BaseModel):
    email_id: str

@router.post("/score")
def api_score(req: ScoreRequest):
    response = supabase.table('emails').select('*').eq('id', req.email_id).single().execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Email not found")
    email = response.data
    result = score_email(email.get('subject') or '', email.get('body_text') or '')
    supabase.table('emails').update({
        'is_phishing': result.get('is_phishing'),
        'phishing_score': result.get('score'),
        'phishing_reason': result.get('reason'),
        'category': result.get('category')
    }).eq('id', req.email_id).execute()
    return {"result": result}

class ScanInboxRequest(BaseModel):
    user_id: str

@router.post("/scan-inbox")
def api_scan_inbox(req: ScanInboxRequest):
    emails = supabase.table('emails').select('id, subject, body_text').eq('user_id', req.user_id).execute().data or []
    out = []
    for e in emails:
        r = score_email(e.get('subject') or '', e.get('body_text') or '')
        supabase.table('emails').update({
            'is_phishing': r.get('is_phishing'),
            'phishing_score': r.get('score'),
            'phishing_reason': r.get('reason'),
            'category': r.get('category')
        }).eq('id', e['id']).execute()
        out.append({'email_id': e['id'], 'result': r})
    return {"results": out}