# 🏗️ Technical Architecture & Tech Stack

This document details the underlying software architecture, system layers, database configurations, and communication flows of the InvestiCore platform.

---

## 📐 System Architecture Overview

InvestiCore is designed using a decoupled, API-first microservices-friendly architecture:

```text
               +----------------------------------+
               |        Next.js 14 Web UI         |
               | (React 18, Tailwind, Cytoscape)   |
               +----------------------------------+
                                |
                         REST / HTTP APIs
                                v
               +----------------------------------+
               |      Node.js Express Backend     |
               | (Auth, Controllers, File Parser)  |
               +----------------------------------+
                 /              |               \
                /               |                \
               v                v                 v
     +------------------+  +----------+  +-------------------+
     | Database Layer   |  | OpenAI   |  | Live Threat Intel |
     | (MongoDB Local / |  | GPT-4o   |  | (VirusTotal,      |
     |  MongoMemoryServer)| | API      |  |  AbuseIPDB, etc.) |
     +------------------+  +----------+  +-------------------+
```

---

## 🛠️ Tech Stack Layer Breakdown

### 1. Frontend Web Layer
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript (`.tsx`) & JavaScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with dark mode aesthetics
- **Graph Visualization**: [Cytoscape.js](https://js.cytoscape.org/) & `react-cytoscapejs`
- **Charts & Data**: [Chart.js](https://www.chartjs.org/) & `react-chartjs-2`
- **Icons**: Lucide React (`lucide-react`)
- **HTTP Client**: Axios

### 2. Backend API Layer
- **Runtime**: Node.js (`v18+`)
- **Framework**: Express.js (`express`)
- **Authentication**: JSON Web Tokens (`jsonwebtoken`), `bcryptjs` password hashing
- **Security & Middleware**: `helmet`, `cors`, `express-rate-limit`, `morgan`
- **File Storage**: Local filesystem (`uploads/`) & S3 ready
- **File Parsers**: `multer`, `mailparser`, `tesseract.js` (OCR), `pdfkit`

### 3. Database Layer
- **ODM**: Mongoose (`mongoose`)
- **Persistent Database**: MongoDB (`mongodb://127.0.0.1:27017/investicore_platform`)
- **Zero-Config Fallback**: `mongodb-memory-server`
  - *How it works*: When `server.js` starts, it attempts to connect to a local MongoDB instance. If no local MongoDB is detected, it automatically instantiates an in-memory MongoDB database in RAM! This ensures developers can run the platform instantly without installing or configuring a database server.

---

## 🔄 Core Data Flow Sequence

1. **User Request**: The investigator logs in or creates a case via Next.js (`http://localhost:3000`).
2. **Authentication**: JWT token is stored securely in local storage / authorization headers.
3. **Evidence Processing**:
   - Investigator uploads a file (e.g. screenshot or report) to `/api/evidence/upload`.
   - `Multer` stores the file in `backend/uploads/`.
   - `Tesseract.js` performs OCR text extraction on images.
   - Regex engines extract domain names, IPs, hashes, and URLs.
4. **Threat Enrichment**:
   - The backend sends asynchronous requests to VirusTotal, AbuseIPDB, URLScan, and Shodan.
   - Results are aggregated into unified risk scores (0–100%).
5. **AI Summarization**:
   - Extracted text and threat indicators are sent to OpenAI (`gpt-4o-mini`).
   - Structured JSON summaries and YARA/Sigma rules are returned to the frontend.
