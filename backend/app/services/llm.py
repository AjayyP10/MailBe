from openai import OpenAI
from app.core.config import settings

client = OpenAI(
    api_key=settings.OPENAI_API_KEY,
    base_url=settings.OPENAI_BASE_URL
)

SYSTEM_PROMPT = """
You are MailMCP, an intelligent email assistant. 
Your goal is to draft professional, concise, and context-aware email replies.
Always maintain a polite tone.
If the user provides specific keywords, ensure they are incorporated naturally.
"""

def generate_reply(thread_content: str, style: str = "professional", keywords: str = None) -> str:
    prompt = f"""
    [THREAD CONTEXT]
    {thread_content}
    
    [INSTRUCTIONS]
    Draft a reply to the above thread.
    Style: {style}
    """
    
    if keywords:
        prompt += f"\nKey points to include: {keywords}"
        
    response = client.chat.completions.create(
        model=settings.LLM_MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
    )
    
    return response.choices[0].message.content
