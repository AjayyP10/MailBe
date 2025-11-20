from app.services.grok import chat

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
        
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": prompt},
    ]
    result = chat(messages=messages, temperature=0.7, max_tokens=1024)
    return result["choices"][0]["message"]["content"]

def summarize_thread(thread_content: str) -> str:
    prompt = f"""
    [THREAD]
    {thread_content}
    
    [TASK]
    Provide a concise summary with key points, decisions, and action items.
    """
    messages = [
        {"role": "system", "content": "You summarize email threads clearly with bullet points and actions."},
        {"role": "user", "content": prompt},
    ]
    result = chat(messages=messages, temperature=0.2, max_tokens=512)
    return result["choices"][0]["message"]["content"]

def keywords_to_email(keywords: str, style: str = "professional") -> str:
    prompt = f"""
    [KEYWORDS]
    {keywords}
    
    [TASK]
    Draft an email using these points. Style: {style}
    """
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": prompt},
    ]
    result = chat(messages=messages, temperature=0.7, max_tokens=512)
    return result["choices"][0]["message"]["content"]
