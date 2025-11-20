import pandas as pd
from typing import Optional
from app.services.grok import chat

def extract_csv_summary(file_path: str) -> Optional[str]:
    try:
        df = pd.read_csv(file_path)
        info = f"Rows: {len(df)}, Columns: {len(df.columns)}\nColumns: {', '.join(df.columns)}"
        sample = df.head(5).to_string(index=False)
        return f"{info}\nSample:\n{sample}"
    except Exception:
        return None

def summarize_csv_text(text: str) -> str:
    prompt = f"""
    [DOCUMENT TYPE] CSV
    [CONTENT]\n{text[:4000]}
    [TASK] Summarize the tabular data, highlight key metrics, trends, and any anomalies.
    """
    messages = [
        {"role": "system", "content": "You summarize CSV tabular data clearly with bullet points and insights."},
        {"role": "user", "content": prompt},
    ]
    result = chat(messages=messages, temperature=0.2, max_tokens=512)
    return result["choices"][0]["message"]["content"]