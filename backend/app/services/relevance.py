from typing import Dict
from app.services.grok import chat

RELEVANCE_SYSTEM = "Score the relevance of a document to a given query on a scale from 0 (irrelevant) to 1 (highly relevant). Return JSON: score, reason."

def score_relevance(document_text: str, query: str) -> Dict:
    prompt = f"""
    [DOCUMENT]\n{document_text[:4000]}
    [QUERY]\n{query}
    [TASK] Score relevance and explain reasoning.
    """
    messages = [
        {"role": "system", "content": RELEVANCE_SYSTEM},
        {"role": "user", "content": prompt},
    ]
    result = chat(messages=messages, temperature=0, max_tokens=256)
    content = result["choices"][0]["message"]["content"]
    try:
        import json
        parsed = json.loads(content)
    except Exception:
        parsed = {"score": 0.0, "reason": content}
    return parsed