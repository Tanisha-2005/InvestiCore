# 🛡️ InvestiCore — AI-Powered Cyber Crime Investigation & Threat Intelligence Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-000000?style=flat&logo=next.js)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20Express-339933?style=flat&logo=nodedotjs)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=flat&logo=mongodb)](https://www.mongodb.com/)
[![Security](https://img.shields.io/badge/Compliance-ISO%2FIEC%2027037-navy)](https://www.iso.org/)

InvestiCore is a full-stack, enterprise-grade Digital Forensics and Cyber Crime Threat Intelligence Platform designed for law enforcement agencies, incident response teams, and forensic analysts.

---

## 🔴 Live Demo
You can easily watch and try out the live project here: **[InvestiCore Live App](https://investicore-frontend.onrender.com)**

---

## 👥 Role Hierarchy & Access Control (RBAC)

InvestiCore features a strict Role-Based Access Control (RBAC) architecture separating general personnel from administrative oversight:

| Role Name | Public Self-Registration | Key Access Privileges |
| :--- | :---: | :--- |
| 🕵️ **Lead Investigator** (`investigator`) | ✅ **Allowed** | Full Case Creation, Evidence Vault Management, Chain of Custody Auditing, AI Summaries, PDF Export |
| 🔍 **Forensic Analyst** (`analyst`) | ✅ **Allowed** | Threat Intel Scans (VirusTotal, AbuseIPDB, Shodan), IOC Graph Analysis, Timeline Event Tracking |
| ⚙️ **System Administrator** (`admin`) | ❌ **Restricted (Seeded Only)** | Exclusive access to **Personnel Audit Matrix** (auditing user registrations, positions, emails, and clearances) |

> 🔒 **System Admin Security**:  
> System Administrator credentials are initialized securely via private environment variables (`ADMIN_USERNAME`, `ADMIN_PASSWORD`) on backend startup. Public self-registration for `admin` role is strictly disabled.

---

## 🔒 Security Features & Authentication

1. **2-Step Real Email OTP Verification**:
   - During account registration for Investigators and Analysts, a **6-Digit One-Time Password (OTP)** is generated and delivered directly to the user's real email inbox via SMTP (Gmail App Password / Custom SMTP).
   - OTP codes expire after **10 minutes** and are strictly private to the email recipient.

2. **Google Sign-In (OAuth 2.0 Integration)**:
   - Supports 1-click **"Continue with Google"** authentication.
   - Pre-verified Google accounts bypass manual OTP verification for seamless onboarding.

3. **Dual Handle & Email Login**:
   - Supports logging in using either Personnel Email Address or Admin Username.

4. **Environment Credentials Privacy**:
   - All environment variables (`.env`) containing API keys, database URIs, passwords, and SMTP credentials are strictly **git-ignored** and hidden from public repository pushes.

---

## 🚀 Technology Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS, Lucide Icons, Axios
- **Backend**: Node.js, Express.js, JWT, Nodemailer, BcryptJS
- **Database**: MongoDB (Atlas Cloud / MongoMemoryServer fallback)
- **Threat Intelligence APIs**: VirusTotal, AbuseIPDB, Shodan, Urlscan.io, AlienVault OTX
- **AI Engine**: OpenAI GPT-4o / GPT-4o-mini API

---

## 🛠️ Quick Installation & Setup

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Fill your MongoDB URI, JWT Secret, Admin Credentials, and Gmail SMTP credentials in .env
npm start
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Visit **http://localhost:3000** in your browser.

---

## 📜 License & Compliance
InvestiCore follows ISO/IEC 27037 standards for digital evidence handling and chain of custody preservation.
