from typing import Optional
import docx
from app.services.grok import chat

def extract_docx_text(file_path: str) -> Optional[str]:
    try:
        doc = docx.Document(file_path)
        text = "\n".join([para.text for para in doc.paragraphs if para.text])
        return text.strip()
    except Exception:
        return None

def summarize_docx_text(text: str) -> str:
    prompt = f"""
    [DOCUMENT TYPE] DOCX
    [CONTENT]\n{text[:4000]}
    [TASK] Summarize the document with key points, sections, and any action items.
    """
    messages = [
        {"role": "system", "content": "You summarize DOCX documents clearly with bullet points and actions."},
        {"role": "user", "content": prompt},
    ]
    result = chat(messages=messages, temperature=0.2, max_tokens=512)
    return result["choices"][0]["message"]["content"]