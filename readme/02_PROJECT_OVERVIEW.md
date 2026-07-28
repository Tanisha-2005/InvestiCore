# 💡 InvestiCore — Humanized Project Overview

## 🧐 What is InvestiCore?

Imagine you are a cybersecurity investigator dealing with a ransomware outbreak or a phishing attack. You have dozens of raw log files, suspicious email attachments (`.eml`), IP addresses, domain names, file hashes, and victim reports scattered everywhere. 

**InvestiCore** is your **all-in-one digital forensic workstation and threat intelligence platform**. It takes raw evidence, automatically extracts indicators of compromise (IOCs), queries global threat databases, visualizes threat networks, and uses AI (GPT-4o) to write comprehensive forensic investigation reports in seconds.

---

## 🎯 Who is InvestiCore Built For?

- **SOC (Security Operations Center) Analysts**: Quickly triage suspicious emails, IPs, file hashes, and domains.
- **Digital Forensics & Incident Response (DFIR) Teams**: Manage active cybercrime cases, chain of custody, and evidence vaults.
- **Cybercrime Law Enforcement & Investigators**: Track threat actors, compile legal evidence packages, and generate audit-ready PDF/DOCX reports.

---

## 🌟 Key Modules & Features Explained in Plain English

### 1. 📁 Case Management
- Organize investigations into distinct cases with priority levels (`Low`, `Medium`, `High`, `Critical`).
- Tag cases with MITRE ATT&CK tactical IDs (e.g., `T1566 - Phishing`, `T1486 - Data Encrypted for Impact`).
- Track case progress, assign lead investigators, and monitor timeline events.

### 2. 🗄️ Evidence Vault & Intelligent File Parser
- Drag-and-drop evidence files (PDFs, Images, Office Docs, EML emails, Text logs).
- **Automated OCR**: Uses Tesseract OCR to read text out of screenshots or scanned documents.
- **Automated IOC Extraction**: Automatically finds and extracts:
  - IPv4 / IPv6 addresses
  - Domain names & URLs
  - Email addresses & phone numbers
  - MD5 / SHA1 / SHA256 file hashes
  - Cryptocurrency wallet addresses (Bitcoin, Ethereum)
  - Windows registry keys & mutexes

### 3. ⚖️ Legal Chain of Custody & Evidence Integrity Verification
- **Immutable Audit Logging**: Automatic logging of every action (upload, view, live integrity check, download, deletion) with officer name, role, timestamp, IP address, and hash snapshot.
- **Live Disk Integrity Verification**: Re-computes live SHA-256/SHA-1/MD5 file hashes directly from storage disk in real-time to detect any physical file tampering.
- **Official Certificate Export**: Generates court-admissible Certificates of Evidence Authenticity & Custody for legal proceedings.


### 3. 🔍 Live Threat Intelligence Sweep
Instead of manually opening 10 tabs to check suspicious IPs or hashes, InvestiCore queries live threat intelligence feeds in parallel:
- **VirusTotal**: Scans file hashes and URLs against 70+ antivirus engines.
- **AbuseIPDB**: Checks IP reputation and recent abuse reports.
- **URLScan.io**: Analyzes live website screenshots and DOM structures.
- **Shodan**: Scans open ports, banners, and vulnerable services on target IPs.
- **AlienVault OTX**: Queries global threat pulses and community indicators.

### 4. 🤖 AI Forensics Assistant (GPT-4o Powered)
- **Evidence Chat**: Ask natural language questions about your uploaded evidence (e.g., *"What IP address did the malware attempt to connect to in the suspicious email?"*).
- **YARA Rule Generator**: Generate custom YARA detection rules to scan your enterprise endpoints.
- **Sigma Rule Generator**: Automatically convert detected threat behavior into SIEM alert rules.

### 5. 🕸️ Visual Relationship Graph
- Powered by **Cytoscape.js**.
- Visualizes interactive nodes linking suspects, IP addresses, malicious domains, compromised files, and related cases.
- Helps investigators discover hidden connections between seemingly unrelated attacks.

### 6. 📄 Automated Executive & Forensic Report Generator
- Generate professional, branded **PDF** and **DOCX** reports with one click.
- Includes executive summaries, timeline graphs, evidence lists, Threat Intel scores, and recommended remediation steps.

---

## 🔄 Real-World Workflow Example

1. **Incident Occurs**: A company receives a suspicious phishing email attached with a malware sample.
2. **Create Case**: The investigator creates a new case titled *"Operation PhishGuard - Q3 Breach"*.
3. **Upload Evidence**: Upload the `.eml` email file and suspicious PDF screenshot to the Evidence Vault.
4. **Auto-Extract IOCs**: InvestiCore extracts the sender's IP (`192.0.2.1`), file hash (`e3b0c442...`), and malicious URL.
5. **Threat Intel Sweep**: InvestiCore flags the IP on AbuseIPDB (98% confidence score) and VirusTotal (45/70 detections).
6. **AI Analysis**: The investigator asks the AI assistant to summarize the threat vector.
7. **Export Report**: Generate an audit-ready PDF report for executive stakeholders.
