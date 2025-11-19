from typing import List, Dict

class MCPService:
    """
    Mock Model Context Protocol (MCP) Service.
    In a real implementation, this would connect to:
    - Google Drive API
    - Microsoft Graph API (OneDrive/SharePoint)
    - Local Vector DB (pgvector)
    """
    
    def search_documents(self, query: str, user_id: str) -> List[Dict]:
        # Mock logic: return fake docs based on query keywords
        results = []
        
        query_lower = query.lower()
        
        if "budget" in query_lower or "financial" in query_lower:
            results.append({
                "id": "doc_123",
                "title": "Q3 Financial Budget.xlsx",
                "source": "Google Drive",
                "snippet": "Row 45: Marketing spend increased by 15%...",
                "link": "https://docs.google.com/spreadsheets/d/..."
            })
            
        if "project" in query_lower or "plan" in query_lower:
            results.append({
                "id": "doc_456",
                "title": "Project Alpha Implementation Plan.pdf",
                "source": "SharePoint",
                "snippet": "Phase 2 begins on Nov 1st with backend migration...",
                "link": "https://sharepoint.com/sites/..."
            })
            
        # Default fallback if no matches
        if not results:
            results.append({
                "id": "doc_789",
                "title": "General Company Guidelines.docx",
                "source": "OneDrive",
                "snippet": "All employees must adhere to the new remote work policy...",
                "link": "https://onedrive.live.com/..."
            })
            
        return results

mcp_service = MCPService()
