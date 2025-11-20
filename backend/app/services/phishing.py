from typing import Dict
from app.services.grok import chat

PHISHING_SYSTEM = "Classify emails for phishing risk with a score from 0 to 1. Return JSON keys: is_phishing, score, reason, category."

def score_email(subject: str, body_text: str) -> Dict:
    prompt = f"""
    Subject: {subject}
    Body: {body_text}
    """
    messages = [
        {"role": "system", "content": PHISHING_SYSTEM},
        {"role": "user", "content": prompt},
    ]
    result = chat(messages=messages, temperature=0, max_tokens=256)
    content = result["choices"][0]["message"]["content"]
    try:
        import json
        parsed = json.loads(content)
    except Exception:
        parsed = {"is_phishing": False, "score": 0.0, "reason": content, "category": "Primary"}
    return parsed