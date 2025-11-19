-- Enable pgvector extension for embeddings
create extension if not exists vector;

-- Users table (extends Supabase auth.users if needed, but we'll keep it simple and link via auth_id if using Supabase Auth)
-- For this MVP, we'll assume Supabase Auth handles the main user record, 
-- and we might just need a profile table or rely on auth.users.
-- Let's create a local users table to store app-specific settings if needed.
create table public.user_profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  created_at timestamptz default now(),
  settings jsonb default '{}'::jsonb
);

-- Accounts (Gmail, Outlook connections)
create table public.accounts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  provider text not null, -- 'gmail', 'msgraph'
  provider_user_id text,
  access_token text, -- Encrypt this in real app!
  refresh_token text, -- Encrypt this in real app!
  expires_at timestamptz,
  last_sync_at timestamptz,
  created_at timestamptz default now()
);

-- Emails
create table public.emails (
  id uuid default gen_random_uuid() primary key,
  account_id uuid references public.accounts(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  provider_email_id text not null, -- ID from Gmail/Graph
  thread_id text,
  subject text,
  snippet text,
  body_text text,
  body_html text,
  from_address text,
  to_addresses text[],
  received_at timestamptz,
  folder text default 'Inbox',
  
  -- AI Classification
  category text, -- 'Promotional', 'Social', 'Primary'
  is_phishing boolean default false,
  phishing_score float default 0.0,
  phishing_reason text,
  
  -- Embeddings for RAG
  embedding vector(1536),
  
  created_at timestamptz default now(),
  unique(account_id, provider_email_id)
);

-- Attachments
create table public.attachments (
  id uuid default gen_random_uuid() primary key,
  email_id uuid references public.emails(id) on delete cascade not null,
  filename text,
  content_type text,
  size_bytes bigint,
  storage_path text, -- Path in Supabase Storage or S3
  summary text,
  created_at timestamptz default now()
);

-- RLS Policies (Row Level Security)
alter table public.user_profiles enable row level security;
alter table public.accounts enable row level security;
alter table public.emails enable row level security;
alter table public.attachments enable row level security;

-- Simple policy: Users can only see their own data
create policy "Users can view own profile" on public.user_profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.user_profiles for update using (auth.uid() = id);

create policy "Users can view own accounts" on public.accounts for select using (auth.uid() = user_id);
create policy "Users can insert own accounts" on public.accounts for insert with check (auth.uid() = user_id);
create policy "Users can update own accounts" on public.accounts for update using (auth.uid() = user_id);

create policy "Users can view own emails" on public.emails for select using (auth.uid() = user_id);
create policy "Users can insert own emails" on public.emails for insert with check (auth.uid() = user_id);

create policy "Users can view own attachments" on public.attachments for select using (auth.uid() = (select user_id from public.emails where id = email_id));
