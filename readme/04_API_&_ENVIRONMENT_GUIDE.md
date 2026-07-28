# 🔑 API & Environment Configuration Guide

This guide covers all environment variables, API key configurations, and backend endpoint routes for InvestiCore.

---

## ⚙️ Environment Variables (`.env`)

InvestiCore has pre-configured environment files:
- **Backend Environment**: `InvestiCore/backend/.env`
- **Frontend Environment**: `InvestiCore/frontend/.env`

### Backend `.env` Options

```env
# Server Setup
PORT=5000                          # Backend port
NODE_ENV=development               # Environment mode
CLIENT_URL=http://localhost:3000   # Frontend URL allowed by CORS

# Database Configuration
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/investicore?retryWrites=true&w=majority

# Authentication
JWT_SECRET=investicore_secure_jwt_secret_token_2026_x89a
JWT_EXPIRES_IN=7d

# Real Email OTP Verification Delivery (Gmail SMTP / Custom SMTP)
SMTP_SERVICE=gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_digit_gmail_app_password
SMTP_FROM=your_email@gmail.com

# OpenAI Integration
OPENAI_API_KEY=your_openai_api_key_here # Your OpenAI API key
OPENAI_MODEL=gpt-4o-mini          # Model version

# Threat Intelligence Live APIs
VIRUSTOTAL_API_KEY=...             # VirusTotal API Key
ABUSEIPDB_API_KEY=...              # AbuseIPDB API Key
URLSCAN_API_KEY=...                # URLScan.io API Key
SHODAN_API_KEY=...                 # Shodan API Key
ALIENVAULT_OTX_API_KEY=...         # AlienVault OTX API Key

# File Storage
STORAGE_MODE=local                 # Options: 'local' or 's3'
```

### Frontend `.env` Options

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 🌐 Obtaining Free Threat Intel & AI API Keys

InvestiCore is designed to work even if some API keys are omitted (it falls back gracefully to local analysis). However, to enable live threat enrichment, you can register for free API keys:

1. **OpenAI**: [platform.openai.com](https://platform.openai.com) (For AI forensic Q&A and YARA/Sigma generation).
2. **VirusTotal**: [virustotal.com](https://www.virustotal.com) (Free tier allows 4 lookups/min).
3. **AbuseIPDB**: [abuseipdb.com](https://www.abuseipdb.com) (Free tier allows 1,000 IP checks/day).
4. **URLScan.io**: [urlscan.io](https://urlscan.io) (Free tier for URL & DOM scanning).
5. **Shodan**: [shodan.io](https://www.shodan.io) (Free community API key for IP port scanning).
6. **AlienVault OTX**: [otx.alienvault.com](https://otx.alienvault.com) (Free open threat exchange key).

---

## 📡 REST API Endpoint Reference

All backend API routes are prefixed with `/api`:

| Category | Endpoint | Method | Description |
|---|---|---|---|
| **Health** | `/api/health` | `GET` | Health check endpoint |
| **Auth** | `/api/auth/register` | `POST` | Register new account (Lead Investigator / Forensic Analyst) |
| **Auth** | `/api/auth/login` | `POST` | Authenticate via Email or Admin Username (`AdminInvestiCore`) |
| **Auth** | `/api/auth/verify-otp` | `POST` | Verify 6-digit email verification OTP |
| **Auth** | `/api/auth/resend-otp` | `POST` | Resend 6-digit email OTP to user's inbox |
| **Auth** | `/api/auth/google` | `POST` | Google Sign-In & 1-click authentication |
| **Auth** | `/api/auth/me` | `GET` | Get current logged-in user profile |
| **Auth (Admin)** | `/api/auth/users` | `GET` | Fetch Personnel Audit Matrix (System Admin Exclusive) |
| **Cases** | `/api/cases` | `GET` | List all investigation cases |
| **Cases** | `/api/cases` | `POST` | Create a new investigation case |
| **Cases** | `/api/cases/:id` | `GET` | Get specific case details & timeline |
| **Evidence** | `/api/evidence/upload` | `POST` | Upload file, trigger OCR & auto-extract IOCs |
| **Evidence** | `/api/evidence/case/:caseId` | `GET` | List all evidence for a specific case |
| **Threat Intel** | `/api/threat-intel/lookup` | `POST` | Run live sweep on IP, Domain, Hash, or URL |
| **AI Assistant** | `/api/ai/chat` | `POST` | Ask forensic questions grounded in case data |
| **AI Assistant** | `/api/ai/generate-yara` | `POST` | Generate YARA rule for threat indicators |
| **AI Assistant** | `/api/ai/generate-sigma` | `POST` | Generate Sigma rule for SIEM logging |
| **Reports** | `/api/reports/generate` | `POST` | Generate branded PDF or DOCX investigation report |
