from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.relevance import score_relevance

router = APIRouter()

class RelevanceRequest(BaseModel):
    document_text: str
    query: str

@router.post("/score")
def api_score_relevance(req: RelevanceRequest):
    try:
        result = score_relevance(req.document_text, req.query)
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))