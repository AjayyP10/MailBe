from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.summary_engine import summarize_attachment
import os

router = APIRouter()

@router.post("/summary")
def summarize_uploaded_attachment(file: UploadFile = File(...)):
    ext = file.filename.split('.')[-1].lower()
    temp_path = f"/tmp/{file.filename}"
    try:
        with open(temp_path, "wb") as f:
            f.write(file.file.read())
        summary = summarize_attachment(temp_path, ext)
        os.remove(temp_path)
        if not summary:
            raise HTTPException(status_code=400, detail="Could not summarize attachment.")
        return {"summary": summary}
    except Exception as e:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        raise HTTPException(status_code=500, detail=str(e))