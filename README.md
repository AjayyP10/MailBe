# MailBe - AI-Powered Email Client

A privacy-first, open-source AI email client that helps users manage, compose, summarize, and search emails intelligently.

## Project Overview

**Vision**: Modern, LLM-powered email client with a privacy-first approach, fully self-hosted on a single VPS.

**Target Users**: Knowledge workers and professionals who want intelligent email management without vendor lock-in.

**Core Value**: Privacy-first, open-source, self-hosted, zero API costs.

## System Architecture

### 3-Tier Architecture
- **Frontend**: Next.js 15 (React 18) with TypeScript
- **Backend**: FastAPI (Python) - async, AI/ML optimized
- **Database**: PostgreSQL 16 + pgvector extension
- **LLM**: Ollama with Llama 3.3/Mistral 7B
- **Authentication**: Authentik (OAuth 2.0, OIDC)
- **Email Access**: IMAP/SMTP (universal protocol)
- **Vector Search**: pgvector + NoMic embeddings
- **Deployment**: Docker Compose + Caddy/Nginx

## Tech Stack

| Layer | Technology | License |
|-------|-----------|---------|
| Frontend | Next.js 15, React 18, TypeScript | MIT |
| UI | shadcn/ui, Tailwind CSS | MIT |
| Rich Text | TipTap | MIT |
| Backend | FastAPI, Python 3.11 | MIT |
| Database | PostgreSQL 16, pgvector | PostgreSQL |
| LLM | Ollama, Llama 3.3/Mistral | Open |
| Auth | Authentik | MIT-like |
| Deployment | Docker, Caddy | Apache 2.0 |

## Project Structure

```
MailBe/
├── frontend/                  # Next.js app
│   ├── app/                   # App Router pages
│   ├── components/            # React components
│   ├── lib/                   # Utilities and API client
│   ├── hooks/                 # Custom React hooks
│   ├── styles/                # CSS and Tailwind
│   ├── public/                # Static assets
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   └── Dockerfile
├── backend/                   # FastAPI app
│   ├── src/
│   │   ├── main.py           # FastAPI entry point
│   │   ├── core/
│   │   │   └── config.py     # Settings management
│   │   ├── db/
│   │   │   ├── database.py   # SQLAlchemy setup
│   │   │   └── models.py     # ORM models
│   │   ├── schemas/
│   │   │   └── schemas.py    # Pydantic schemas
│   │   ├── routes/           # API endpoints
│   │   ├── services/         # Business logic
│   │   └── middleware/       # Middleware
│   ├── scripts/
│   │   └── init-db.sql       # Database initialization
│   ├── tests/                # Pytest tests
│   ├── requirements.txt      # Python dependencies
│   ├── .env.example
│   └── Dockerfile
├── docker-compose.yml         # Service orchestration
├── .gitignore
├── .env.example
└── README.md
```

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Git
- Node.js 18+ (for local frontend development)
- Python 3.11+ (for local backend development)

### Quick Start with Docker Compose

1. **Clone and setup**:
```bash
git clone <repo>
cd MailBe
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

2. **Start all services**:
```bash
docker-compose up -d
```

3. **Initialize database**:
```bash
docker-compose exec postgres psql -U mailbe -d mailbe -f /docker-entrypoint-initdb.d/init.sql
```

4. **Pull LLM model** (Ollama):
```bash
docker-compose exec ollama ollama pull llama2:7b
# or for higher quality
docker-compose exec ollama ollama pull mistral:7b
```

5. **Access the app**:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Authentik: http://localhost:9000
- API Docs: http://localhost:8000/docs

### Local Development

**Backend**:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn src.main:app --reload
```

**Frontend**:
```bash
cd frontend
npm install
npm run dev
```

## Implementation Roadmap (10 Weeks)

### Phase 1: Foundation (Weeks 1–2) ✅ IN PROGRESS
- ✅ Next.js setup with TypeScript, Tailwind, shadcn/ui
- ✅ FastAPI backend with routers and services
- ✅ PostgreSQL setup with pgvector via Docker
- ✅ Ollama installation
- ✅ Authentik authentication setup
- ⏳ Basic routing and folder structure

### Phase 2: Email Core (Weeks 3–4) ⏳ UPCOMING
- IMAP connection and email fetching
- Email thread reconstruction
- Email list view with virtual scrolling
- Thread/conversation view
- Email composition with rich text editor
- Send, reply, forward functionality
- Attachment handling
- Label management

### Phase 3: LLM Integration (Weeks 5–6) ⏳ UPCOMING
- Smart Compose (AI email drafting)
- Email Summarization
- Smart Reply suggestions
- Tone Adjustment
- Auto-categorization

### Phase 4: Search & Intelligence (Weeks 7–8) ⏳ UPCOMING
- Embedding pipeline (nomic-embed-text)
- Vector search with pgvector
- Natural language search
- Email analytics dashboard

### Phase 5: Polish & Deploy (Weeks 9–10) ⏳ UPCOMING
- Responsive design optimization
- Dark mode support
- Performance tuning
- Testing (unit + E2E)
- VPS deployment

## Core Features (MVP)

### Email Management
- Inbox view with threaded conversations
- Send, reply, forward emails
- Attachment upload/download
- Labels and folders
- Keyword + semantic search

### AI-Powered Features
1. **Smart Compose** - AI drafts emails based on context
2. **Summarization** - One-click thread summaries
3. **Auto-Categorization** - AI labels (Urgent, Newsletter, Action Required, etc.)
4. **Smart Reply** - 3 AI-generated reply suggestions
5. **Natural Language Search** - Search by meaning, not keywords
6. **Email Insights** - Weekly digest with analytics
7. **Tone Adjustment** - Rewrite email in different tones

## Database Schema

Key tables (managed by SQLAlchemy):
- **users** - User accounts and IMAP/SMTP credentials (encrypted)
- **emails** - Email messages with embeddings
- **threads** - Conversation threads
- **attachments** - Email attachments
- **categories** - Auto-categorization labels
- **drafts** - Email drafts

All user data is row-level secured at the database.

## API Endpoints

### Authentication
- `POST /auth/google` - OAuth callback
- `POST /auth/refresh` - Refresh token

### Emails
- `GET /emails` - List emails
- `GET /emails/{id}` - Get email details
- `POST /emails/send` - Send email
- `POST /emails/reply` - Reply to email
- `PATCH /emails/{id}/labels` - Manage labels

### AI Features
- `POST /ai/compose` - AI email composition
- `POST /ai/summarize` - Summarize thread
- `POST /ai/smart-reply` - Generate reply suggestions
- `POST /ai/rewrite` - Tone adjustment
- `POST /ai/search` - Natural language search

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@postgres:5432/mailbe
SECRET_KEY=<jwt-secret>
OLLAMA_HOST=http://ollama:11434
OLLAMA_MODEL=llama2:7b
AUTHENTIK_URL=http://authentik:9000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_AUTHENTIK_URL=http://localhost:9000
```

## Contributing

This project is open-source. Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push and create a pull request

## License

MIT License - see LICENSE file for details

## Support

- Issues: GitHub Issues
- Discussions: GitHub Discussions
- Documentation: /docs

---

**Status**: Early Development (Phase 1)
**Last Updated**: March 2026
