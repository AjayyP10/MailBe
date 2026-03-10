from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, Boolean, Text, ForeignKey, LargeBinary, JSON
from sqlalchemy.dialects.postgresql import UUID, ARRAY, VECTOR
from sqlalchemy.orm import relationship
import uuid
from src.db.database import Base


class User(Base):
    """User model for storing user information and email credentials."""
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String)
    full_name = Column(String)
    
    # IMAP/SMTP Credentials (encrypted)
    imap_host = Column(String)
    imap_port = Column(Integer)
    imap_username = Column(String)
    imap_password = Column(LargeBinary)  # AES-256 encrypted
    
    smtp_host = Column(String)
    smtp_port = Column(Integer)
    smtp_username = Column(String)
    smtp_password = Column(LargeBinary)  # AES-256 encrypted
    
    # Settings
    preferences = Column(JSON, default={})
    is_active = Column(Boolean, default=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    emails = relationship("Email", back_populates="user")
    threads = relationship("Thread", back_populates="user")
    categories = relationship("Category", back_populates="user")


class Email(Base):
    """Email model for storing email messages."""
    __tablename__ = "emails"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    thread_id = Column(UUID(as_uuid=True), ForeignKey("threads.id"))
    
    # Email metadata
    imap_id = Column(String, index=True)  # UID from IMAP
    subject = Column(String, index=True)
    sender = Column(String, index=True)
    recipients = Column(ARRAY(String))
    cc_recipients = Column(ARRAY(String))
    bcc_recipients = Column(ARRAY(String))
    
    # Email content
    body_text = Column(Text)
    body_html = Column(Text)
    
    # Email state
    is_read = Column(Boolean, default=False, index=True)
    is_starred = Column(Boolean, default=False)
    is_draft = Column(Boolean, default=False)
    is_spam = Column(Boolean, default=False)
    is_trash = Column(Boolean, default=False)
    
    # Labels and categories
    labels = Column(ARRAY(String), default=[])
    category = Column(String, index=True)  # Auto-categorized label
    
    # AI-generated content
    summary = Column(Text)
    embedding = Column(VECTOR(768))  # nomic-embed-text 768-dim vector
    
    # Timestamps
    received_date = Column(DateTime, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="emails")
    thread = relationship("Thread", back_populates="emails")
    attachments = relationship("Attachment", back_populates="email")


class Thread(Base):
    """Thread model for storing email threads/conversations."""
    __tablename__ = "threads"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    imap_thread_id = Column(String, index=True)
    
    subject = Column(String, index=True)
    snippet = Column(String)
    
    category = Column(String, index=True)
    message_count = Column(Integer, default=1)
    unread_count = Column(Integer, default=0)
    
    last_message_date = Column(DateTime, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="threads")
    emails = relationship("Email", back_populates="thread")


class Attachment(Base):
    """Attachment model for storing email attachments."""
    __tablename__ = "attachments"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email_id = Column(UUID(as_uuid=True), ForeignKey("emails.id"), nullable=False)
    
    filename = Column(String)
    mime_type = Column(String)
    size = Column(Integer)
    
    # File storage (could be S3 URL or base64 encoded)
    file_data = Column(LargeBinary)
    file_url = Column(String)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    email = relationship("Email", back_populates="attachments")


class Category(Base):
    """Category model for email categorization."""
    __tablename__ = "categories"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    name = Column(String, nullable=False)
    color = Column(String, default="#000000")
    is_ai_managed = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="categories")


class Draft(Base):
    """Draft model for storing email drafts."""
    __tablename__ = "drafts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    parent_email_id = Column(UUID(as_uuid=True), ForeignKey("emails.id"))
    
    recipients = Column(ARRAY(String))
    subject = Column(String)
    body = Column(Text)
    is_ai_generated = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
