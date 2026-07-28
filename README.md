# 🛡️ InvestiCore — AI-Powered Cyber Crime Investigation & Threat Intelligence Platform

InvestiCore is an enterprise-grade digital forensics, live threat intelligence enrichment, and AI-assisted cybercrime investigation platform.

---

## 📖 Complete Documentation Folder

We have created a dedicated, human-friendly **[`readme/`](./readme/)** folder with complete guides on how to run, configure, and troubleshoot InvestiCore:

- 🚀 [**Getting Started Guide**](./readme/01_GETTING_STARTED.md) — 60-second setup and launch steps.
- 💡 [**Project Overview**](./readme/02_PROJECT_OVERVIEW.md) — Plain English feature breakdown & real-world workflows.
- 🏗️ [**Architecture & Tech Stack**](./readme/03_ARCHITECTURE_&_TECH_STACK.md) — Next.js, Node.js Express, MongoDB in-memory fallback, and AI engine details.
- 🔑 [**API & Environment Setup**](./readme/04_API_&_ENVIRONMENT_GUIDE.md) — Free API key sources & backend endpoint reference.
- ❓ [**Troubleshooting & FAQs**](./readme/05_TROUBLESHOOTING_&_FAQS.md) — Quick solutions to common errors.

---

## ⚡ Quick Start (Run Locally in 2 Steps)

### Step 1: Start Backend (Port 5000)
```bash
cd backend
npm install
npm start
```
> **Zero-Config Database**: If MongoDB is not installed locally, InvestiCore automatically spins up an **In-Memory MongoDB server** in RAM.

### Step 2: Start Frontend Web UI (Port 3000)
In a second terminal window:
```bash
cd frontend
npm install
npm run dev
```

### Access Points
- 💻 **Web Application UI**: [http://localhost:3000](http://localhost:3000)
- 🔌 **Backend REST API**: [http://localhost:5000](http://localhost:5000)
- 💚 **Backend Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🛠️ Stack Architecture

| Layer | Technology |
|---|---|
| **Frontend Web App** | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Cytoscape.js, Chart.js |
| **Backend REST API** | Node.js, Express.js, Mongoose, Multer, MailParser, Tesseract OCR, PDFKit |
| **Database** | MongoDB (Local Instance or Auto In-Memory Server Fallback) |
| **AI Forensics Assistant** | OpenAI API (`gpt-4o-mini`), Automated YARA & Sigma Rule Generators |
| **Threat Intel Sweep** | Live API enrichment via VirusTotal, AbuseIPDB, URLScan.io, Shodan, AlienVault OTX |
| **Security & Auth** | JWT Tokens, Password Hashing (`bcryptjs`), Rate Limiting, Helmet Headers |

---

## 🔍 Key Capabilities

1. **Case Management**: Priority tracking, MITRE ATT&CK tagging, timeline management.
2. **Evidence Vault**: OCR image reading, PDF/EML parsing, hash extraction (MD5, SHA256), IP/Domain/Hash IOC extractor.
3. **Legal Chain of Custody**: Cryptographic SHA-256 live disk hash verification, immutable audit log (`CustodyLog`), and tamper detection.
4. **Multi-Source Threat Intel Sweep**: Live threat score aggregations across VirusTotal, AbuseIPDB, Shodan, AlienVault, URLScan.
5. **AI Forensics Assistant**: Conversational Q&A over evidence files, automated YARA rule generation, and Sigma log rule generation.
6. **Relationship Graph**: Interactive Cytoscape.js visual graph connecting suspects, IPs, domains, and cases.
7. **Court-Ready PDF Exporter**: One-click multi-page PDF evidence package exporter with ISO/IEC 27037 legal compliance seals.

