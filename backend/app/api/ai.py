from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
from app.services.llm import generate_reply, summarize_thread, keywords_to_email
from supabase import create_client, Client
from app.core.config import settings

router = APIRouter()
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

class ReplyRequest(BaseModel):
    email_id: str
    style: str = "professional"
    keywords: str = None

@router.post("/generate-reply")
def api_generate_reply(req: ReplyRequest):
    # 1. Fetch email context from DB
    response = supabase.table('emails').select('*').eq('id', req.email_id).single().execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Email not found")
    
    email = response.data
    
    # 2. Construct context (Subject + Body)
    context = f"Subject: {email['subject']}\nFrom: {email['from_address']}\n\n{email['body_text']}"
    
    # 3. Call LLM
    try:
        draft = generate_reply(context, req.style, req.keywords)
        return {"draft": draft}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class SearchDocsRequest(BaseModel):
    query: str
    user_id: str = "current_user" # In real app, get from auth context

@router.post("/search-docs")
def api_search_docs(req: SearchDocsRequest):
    from app.services.mcp import mcp_service
    results = mcp_service.search_documents(req.query, req.user_id)
    return {"results": results}

class SummarizeRequest(BaseModel):
    email_id: str

@router.post("/summarize-thread")
def api_summarize_thread(req: SummarizeRequest):
    response = supabase.table('emails').select('*').eq('id', req.email_id).single().execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Email not found")
    email = response.data
    context = f"Subject: {email['subject']}\nFrom: {email['from_address']}\n\n{email['body_text']}"
    try:
        summary = summarize_thread(context)
        return {"summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class KeywordsEmailRequest(BaseModel):
    keywords: str
    style: str = "professional"

@router.post("/keywords")
def api_keywords_email(req: KeywordsEmailRequest):
    try:
        draft = keywords_to_email(req.keywords, req.style)
        return {"draft": draft}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

