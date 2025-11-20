from typing import Optional
from PIL import Image
import pytesseract
from app.services.grok import chat

def extract_image_text(file_path: str) -> Optional[str]:
    try:
        img = Image.open(file_path)
        text = pytesseract.image_to_string(img)
        return text.strip()
    except Exception:
        return None

def summarize_image_text(text: str) -> str:
    prompt = f"""
    [DOCUMENT TYPE] IMAGE OCR
    [CONTENT]\n{text[:4000]}
    [TASK] Summarize the extracted text with key points and any action items.
    """
    messages = [
        {"role": "system", "content": "You summarize OCR-extracted text from images clearly with bullet points and actions."},
        {"role": "user", "content": prompt},
    ]
    result = chat(messages=messages, temperature=0.2, max_tokens=512)
    return result["choices"][0]["message"]["content"]