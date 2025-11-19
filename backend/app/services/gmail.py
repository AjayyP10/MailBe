from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from app.core.config import settings
import base64
from bs4 import BeautifulSoup
import html2text

class GmailService:
    def __init__(self, access_token: str, refresh_token: str, client_id: str, client_secret: str):
        self.creds = Credentials(
            token=access_token,
            refresh_token=refresh_token,
            token_uri="https://oauth2.googleapis.com/token",
            client_id=client_id,
            client_secret=client_secret,
        )
        self.service = build('gmail', 'v1', credentials=self.creds)

    def list_messages(self, user_id='me', max_results=10):
        results = self.service.users().messages().list(userId=user_id, maxResults=max_results).execute()
        return results.get('messages', [])

    def get_message_details(self, msg_id, user_id='me'):
        msg = self.service.users().messages().get(userId=user_id, id=msg_id, format='full').execute()
        payload = msg.get('payload', {})
        headers = payload.get('headers', [])
        
        subject = next((h['value'] for h in headers if h['name'] == 'Subject'), 'No Subject')
        from_addr = next((h['value'] for h in headers if h['name'] == 'From'), 'Unknown')
        to_addr = next((h['value'] for h in headers if h['name'] == 'To'), '')
        
        # Extract Body
        body_html = ""
        body_text = ""
        
        if 'parts' in payload:
            for part in payload['parts']:
                if part['mimeType'] == 'text/plain':
                    body_text = base64.urlsafe_b64decode(part['body'].get('data', '')).decode('utf-8')
                elif part['mimeType'] == 'text/html':
                    body_html = base64.urlsafe_b64decode(part['body'].get('data', '')).decode('utf-8')
        else:
            # Fallback for simple messages
            data = payload.get('body', {}).get('data', '')
            if data:
                decoded = base64.urlsafe_b64decode(data).decode('utf-8')
                if payload.get('mimeType') == 'text/html':
                    body_html = decoded
                else:
                    body_text = decoded

        # If we only got HTML, convert to text for snippet/indexing
        if body_html and not body_text:
            h = html2text.HTML2Text()
            h.ignore_links = True
            body_text = h.handle(body_html)

        return {
            'id': msg['id'],
            'threadId': msg['threadId'],
            'snippet': msg.get('snippet', ''),
            'subject': subject,
            'from': from_addr,
            'to': [addr.strip() for addr in to_addr.split(',')] if to_addr else [],
            'body_html': body_html,
            'body_text': body_text,
            'internalDate': msg['internalDate']
        }
