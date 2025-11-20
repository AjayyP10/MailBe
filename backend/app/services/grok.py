import os
from typing import List, Dict, Any

import httpx

# -------------------------------------------------
# Configuration
# -------------------------------------------------
GROK_API_KEY = os.getenv("GROK_API_KEY", "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")
GROK_ENDPOINT = (
    os.getenv("GROK_BASE_URL")
    or os.getenv("OPENAI_BASE_URL")
    or "https://api.x.ai/v1/chat/completions"
)


def _prepare_headers() -> Dict[str, str]:
    """Return the HTTP headers required by the Grok API."""
    return {
        "Authorization": f"Bearer {GROK_API_KEY}",
        "Content-Type": "application/json",
    }


def chat(
    messages: List[Dict[str, str]],
    model: str = "grok-4.1-fast",
    temperature: float = 0.7,
    max_tokens: int = 1024,
) -> Dict[str, Any]:
    """Call the Grok chat completion endpoint.

    Parameters
    ----------
    messages: List[Dict[str, str]]
        The chat history in OpenAI‑compatible format, e.g.
        [{"role": "user", "content": "Hello"}]

    model: str
        Model name – default is ``grok-4.1-fast`` (the fast tier you want).

    temperature: float
        Sampling temperature (0‑2). 0.7 is a good default.

    max_tokens: int
        Upper bound on the number of tokens returned.

    Returns
    -------
    Dict with the full JSON response from the API.
    """
    payload = {
        "model": model,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": max_tokens,
    }

    headers = _prepare_headers()
    with httpx.Client(timeout=30.0) as client:
        response = client.post(GROK_ENDPOINT, json=payload, headers=headers)

    response.raise_for_status()
    return response.json()
