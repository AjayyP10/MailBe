from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List
from uuid import UUID


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Email Schemas
class AttachmentResponse(BaseModel):
    id: UUID
    filename: str
    mime_type: str
    size: int
    
    class Config:
        from_attributes = True


class EmailBase(BaseModel):
    subject: str
    recipients: List[str]
    body_text: str
    body_html: Optional[str] = None


class EmailCreate(EmailBase):
    sender: str


class EmailResponse(EmailBase):
    id: UUID
    sender: str
    is_read: bool
    is_starred: bool
    category: Optional[str]
    summary: Optional[str]
    received_date: datetime
    created_at: datetime
    attachments: List[AttachmentResponse] = []
    
    class Config:
        from_attributes = True


class EmailListResponse(BaseModel):
    id: UUID
    subject: str
    sender: str
    snippet: str
    is_read: bool
    is_starred: bool
    category: Optional[str]
    received_date: datetime
    
    class Config:
        from_attributes = True


# Thread Schemas
class ThreadResponse(BaseModel):
    id: UUID
    subject: str
    snippet: str
    message_count: int
    unread_count: int
    category: Optional[str]
    last_message_date: datetime
    created_at: datetime
    
    class Config:
        from_attributes = True


# Draft Schemas
class DraftCreate(BaseModel):
    recipients: List[str]
    subject: str
    body: str


class DraftResponse(DraftCreate):
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Auth Schemas
class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    expires_in: int


class IMAPConfig(BaseModel):
    imap_host: str
    imap_port: int
    imap_username: str
    imap_password: str
    smtp_host: str
    smtp_port: int
    smtp_username: str
    smtp_password: str
