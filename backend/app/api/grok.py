# backend/app/api/grok.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Dict, Any

from app.services.grok import chat

router = APIRouter(prefix="/api/grok", tags=["grok"])


class ChatMessage(BaseModel):
    role: str = Field(..., description="One of 'system', 'user', or 'assistant'")
    content: str = Field(..., description="Message text")


class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    temperature: float = Field(0.7, ge=0.0, le=2.0)
    max_tokens: int = Field(1024, ge=1, le=4096)


class ChatResponse(BaseModel):
    content: str
    raw: Dict[str, Any]


@router.post("/chat", response_model=ChatResponse)
def grok_chat(req: ChatRequest):
    """Proxy endpoint for Grok model.
    The frontend sends a list of messages (OpenAI format) and receives the generated reply.
    """
    try:
        payload = [msg.dict() for msg in req.messages]
        result = chat(messages=payload, temperature=req.temperature, max_tokens=req.max_tokens)
        assistant_msg = result["choices"][0]["message"]["content"]
        return ChatResponse(content=assistant_msg, raw=result)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
