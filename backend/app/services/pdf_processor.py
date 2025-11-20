import pdfplumber
from typing import Optional

def extract_pdf_text(file_path: str) -> Optional[str]:
    try:
        with pdfplumber.open(file_path) as pdf:
            text = "\n".join(page.extract_text() or "" for page in pdf.pages)
        return text.strip()
    except Exception:
        return None

from app.services.grok import chat

def summarize_pdf_text(text: str) -> str:
    prompt = f"""
    [DOCUMENT TYPE] PDF
    [CONTENT]\n{text[:4000]}
    [TASK] Summarize the document with key points, sections, and any action items.
    """
    messages = [
        {"role": "system", "content": "You summarize PDF documents clearly with bullet points and actions."},
        {"role": "user", "content": prompt},
    ]
    result = chat(messages=messages, temperature=0.2, max_tokens=512)
    return result["choices"][0]["message"]["content"]