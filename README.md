# MailMCP - AI Email Assistant

## Stack
- **Frontend**: Next.js (App Router), Tailwind CSS, Supabase Auth
- **Backend**: FastAPI, Python 3.11, Supabase (DB), Datadog (Monitoring)
- **Infrastructure**: Render (Backend), Vercel (Frontend)

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- Docker (optional, for local container testing)
- Supabase Account (Free Tier)

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env # (Create this file based on config.py)
uvicorn app.main:app --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local # Add your Supabase keys
npm run dev
```

### 3. Supabase Setup
1. Create a new project on Supabase.
2. Go to Authentication -> Providers -> Enable Google.
3. Copy `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `frontend/.env.local`.
4. Copy `SUPABASE_URL` and `SUPABASE_KEY` (Service Role or Anon, depending on backend needs) to `backend/.env`.

## Deployment

### Backend (Render)
1. Connect your GitHub repo to Render.
2. Create a new "Blueprint" and select `infra/render.yaml`.
3. Add environment variables in Render Dashboard.

### Frontend (Vercel)
1. Connect your GitHub repo to Vercel.
2. Select `frontend` as the root directory.
3. Add environment variables (`NEXT_PUBLIC_...`).
