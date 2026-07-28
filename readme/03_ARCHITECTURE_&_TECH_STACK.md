# 🏗️ Technical Architecture & System Component Deep-Dive

This document details the underlying software architecture, component breakdowns, database configurations, data flow pipelines, and business utility of the **InvestiCore** platform.

---

## 📐 High-Level System Architecture Overview

InvestiCore is built using a decoupled, API-first microservices architecture engineered for high-throughput evidence processing, real-time threat intelligence enrichment, and legal chain of custody compliance.

```text
               +------------------------------------------------------+
               |                 Next.js 14 Web UI                    |
               | (React 18, Tailwind CSS, Cytoscape.js, Lucide Icons)  |
               +------------------------------------------------------+
                                          |
                                 REST / HTTP APIs (JWT Auth)
                                          v
               +------------------------------------------------------+
               |             Node.js Express Backend API              |
               |  (Controllers, Auth Middleware, File Ingestion)      |
               +------------------------------------------------------+
                 /           |                    |                 \
                /            |                    |                  \
               v             v                    v                   v
   +------------------+ +-----------------+ +------------------+ +------------------+
   | Evidence Engine  | | Legal Custody   | | AI Assistant &   | | Multi-Vendor     |
   | (Tesseract OCR,  | | Engine          | | Rule Generator   | | Threat Intel   |
   |  Mailparser,     | | (SHA-256 Live   | | (OpenAI GPT-4o,  | | (VirusTotal,   |
   |  PCAP Decoder)   | |  Audit Logs)    | |  YARA, Sigma)    | |  AbuseIPDB)    |
   +------------------+ +-----------------+ +------------------+ +------------------+
               \             |                    |                  /
                v            v                    v                 v
               +------------------------------------------------------+
               |            MongoDB Persistence Layer                 |
               |   (Persistent Mongo / MongoMemoryServer Fallback)    |
               +------------------------------------------------------+
```

---

## 🛠️ Complete System Component Breakdown

Below is a comprehensive breakdown of every major subsystem in InvestiCore, **what it does**, and **why it is critical** for digital forensics and cybercrime investigations:

---

### 1. 🗄️ Evidence Vault & File Parsing Engine
- **What it Does**:
  Accepts raw evidence files (`.png`, `.jpg`, `.eml`, `.pcap`, `.pdf`, `.log`, `.txt`). Uses **Tesseract.js OCR** for screenshot text recognition, **Mailparser** for MIME email header parsing, and native binary parsers for `.pcap` network capture streams. Extracted text is automatically passed to a regex engine that extracts IPv4/v6 addresses, domains, URLs, email addresses, file hashes, and cryptocurrency wallet addresses.
- **Why it is Useful**:
  In manual investigations, investigators spend 20–40 hours manually reading log files, copying IP addresses, and opening email attachments. InvestiCore automates this in under 2 minutes with zero human error.

---

### 2. ⚖️ Legal Chain of Custody & Live Integrity Verification Engine
- **What it Does**:
  Upon upload, calculates exact SHA-256, SHA-1, and MD5 cryptographic hashes. Every interaction (upload, view, live integrity check, download, deletion) is written to an immutable `CustodyLog` database model with officer name, role, UTC timestamp, IP address, and hash snapshot. Provides a **Live Integrity Verification API** that reads physical bytes off server disk in real-time to detect file tampering.
- **Why it is Useful**:
  In legal proceedings, evidence is frequently thrown out of court if the defense proves the file was tampered with or if chain of custody was broken. InvestiCore guarantees ISO/IEC 27037 legal admissibility and court readiness.

---

### 3. 🔍 Live Threat Intelligence Consensus Sweep
- **What it Does**:
  Queries multiple threat intelligence vendors concurrently in parallel:
  - **VirusTotal**: Scans file hashes and domains against 70+ antivirus engines.
  - **AbuseIPDB**: Checks IP abuse reports, confidence scores, and ISP origins.
  - **Shodan**: Scans open ports, banners, and vulnerable services.
  - **URLScan.io & AlienVault OTX**: Analyzes live website screenshots and community threat pulses.
- **Why it is Useful**:
  Prevents SOC analysts from context-switching across 10+ browser tabs for every single IP or file hash. Unified consensus scores eliminate false positives.

---

### 4. 🕸️ Interactive Indicator Topology Graph (Cytoscape.js)
- **What it Does**:
  Renders an interactive network graph connecting Suspects, Compromised Endpoints, Malicious IPs, Domains, Payload Hashes, and Ransomware Crypto Wallets across multiple active cases.
- **Why it is Useful**:
  Helps threat hunters discover hidden attack infrastructure (e.g., discovering that two seemingly unrelated phishing attacks share the same Command & Control server IP).

---

### 5. 🤖 AI Forensics Assistant & YARA/Sigma Rule Generator
- **What it Does**:
  Leverages OpenAI (`gpt-4o`) to summarize evidence text in plain English. Automatically generates ready-to-deploy **YARA rules** for disk malware scanning and **Sigma rules** for SIEM log detection (Splunk, Elastic).
- **Why it is Useful**:
  Allows junior SOC analysts to quickly generate endpoint defense rules without needing senior malware reverse engineers on shift.

---

### 6. 📄 One-Click Court-Ready PDF Evidence Exporter (`PDFKit`)
- **What it Does**:
  Compiles complete case details, cryptographic evidence hash tables, Chain of Custody audit logs, threat scores, and ISO/IEC 27037 legal compliance seals into a branded PDF document.
- **Why it is Useful**:
  Generates audit-ready evidence packages for law enforcement officers, legal prosecutors, and C-suite executives in one click.

---

### 7. 💾 Fail-Safe Persistence Layer (MongoDB + MongoMemoryServer)
- **What it Does**:
  Connects to persistent local or cloud MongoDB instances. If no database server is detected, it automatically instantiates an in-memory MongoDB instance in RAM (`MongoMemoryServer`).
- **Why it is Useful**:
  Ensures zero-config deployment on air-gapped forensic laptops or emergency response environments without needing database installation.

---

## 🔄 End-to-End Incident Response Data Lifecycle

1. **Case Creation**: Investigator creates an active case titled *"Operation PhishStorm"*.
2. **Evidence Ingestion**: Uploads `.eml` email and `.pcap` capture file to Evidence Vault.
3. **Automated Hashing & Custody Log**: Backend computes SHA-256 hash `7c9f8a3...` and writes `UPLOADED` entry in `CustodyLog`.
4. **Parsing & IOC Extraction**: Tesseract OCR / Mailparser decodes headers and extracts C2 IP `185.220.101.5` and payload hash.
5. **Threat Intelligence Sweep**: VirusTotal flags hash as `45/70 Malicious`; AbuseIPDB flags IP as `98% Abuse Confidence`.
6. **Topology Graph Linking**: Cytoscape graph connects IP node to payload hash node and suspect profile.
7. **Rule Generation**: AI generates custom YARA rule `rule Trojan_PhishStorm_Payload`.
8. **Court Package Export**: Investigator clicks **Generate Court PDF** to download legal evidence package for court submission.
