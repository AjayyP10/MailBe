from app.services.pdf_processor import extract_pdf_text, summarize_pdf_text
from app.services.docx_processor import extract_docx_text, summarize_docx_text
from app.services.image_ocr import extract_image_text, summarize_image_text
from app.services.csv_processor import extract_csv_summary, summarize_csv_text

from typing import Optional

def summarize_attachment(file_path: str, file_type: str) -> Optional[str]:
    if file_type == "pdf":
        text = extract_pdf_text(file_path)
        if text:
            return summarize_pdf_text(text)
    elif file_type == "docx":
        text = extract_docx_text(file_path)
        if text:
            return summarize_docx_text(text)
    elif file_type in ["jpg", "jpeg", "png"]:
        text = extract_image_text(file_path)
        if text:
            return summarize_image_text(text)
    elif file_type == "csv":
        text = extract_csv_summary(file_path)
        if text:
            return summarize_csv_text(text)
    return None