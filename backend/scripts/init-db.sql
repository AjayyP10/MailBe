-- Initialize PostgreSQL with pgvector extension for MailBe
CREATE EXTENSION IF NOT EXISTS pgvector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;  -- For text search
CREATE EXTENSION IF NOT EXISTS btree_gin;  -- For multi-column indexes

-- Create ENUM types
CREATE TYPE email_category AS ENUM (
    'urgent',
    'newsletter',
    'receipts',
    'social',
    'action_required',
    'fyi',
    'other'
);

-- Create initial tables (SQLAlchemy will manage most of this, but we ensure pgvector is ready)

-- Create an index for vector similarity search
-- This will be done per user to avoid conflicts
-- The actual indexes will be created by SQLAlchemy models
